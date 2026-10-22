import mongoose from 'mongoose';
import Complaint from '../models/Complaint.js';
import User from '../models/User.js';
import {
  detectCategory,
  findLocalityAndWard,
  getResponsibleDepartment,
} from '../services/intelligenceService.js';
import { uploadFile } from '../services/storageService.js';
import { generateComplaintId } from '../utils/idGenerator.js';

/**
 * Submit a new civic complaint
 * Route: POST /api/complaints
 * Access: Public (Citizens can post anonymously without auth, or authenticated)
 */
export const createComplaint = async (req, res) => {
  try {
    const { description, isAnonymous } = req.body;
    let { category, location } = req.body;

    // Check files
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ success: false, message: 'At least one image is required to submit a complaint.' });
    }

    if (!description) {
      return res.status(400).json({ success: false, message: 'Complaint description is required.' });
    }

    // Parse location
    let parsedLocation;
    try {
      parsedLocation = typeof location === 'string' ? JSON.parse(location) : location;
    } catch (e) {
      return res.status(400).json({ success: false, message: 'Invalid location coordinates.' });
    }

    if (!parsedLocation || !parsedLocation.lat || !parsedLocation.lng) {
      return res.status(400).json({ success: false, message: 'Live GPS or Map selected location is required.' });
    }

    // Auth check based on anonymous status
    let reporterId = null;
    const isAnon = isAnonymous === 'true' || isAnonymous === true;
    
    if (req.user) {
      reporterId = req.user._id;
    } else if (!isAnon) {
      return res.status(401).json({ success: false, message: 'Authentication required for named submissions.' });
    }

    // 1. Detect category if set to Auto Detect or empty
    if (!category || category === 'Auto Detect') {
      category = detectCategory(description);
    }

    // 2. Identify Locality & Ward based on GPS
    let locality, ward;
    try {
      const geoInfo = findLocalityAndWard(Number(parsedLocation.lat), Number(parsedLocation.lng));
      locality = geoInfo.localityName;
      ward = geoInfo.wardNumber;
    } catch (err) {
      return res.status(400).json({ success: false, message: err.message });
    }

    // 3. Determine Responsible Department
    const department = getResponsibleDepartment(category);

    // 4. Upload files
    const imageUrls = [];
    for (const file of req.files) {
      const url = await uploadFile(file);
      if (url) imageUrls.push(url);
    }

    if (imageUrls.length === 0) {
      return res.status(500).json({ success: false, message: 'Failed to process and store image uploads.' });
    }

    // 5. Generate Complaint ID (e.g. RW-2026-000145)
    const complaintId = await generateComplaintId();

    // 6. Build Initial Timeline Entry
    const initialTimeline = [
      {
        status: 'Pending',
        remarks: 'Complaint registered. Waiting for officer assignment.',
        images: imageUrls,
        timestamp: new Date(),
      },
    ];

    // Create Complaint
    const complaint = await Complaint.create({
      complaintId,
      description,
      images: imageUrls,
      category,
      status: 'Pending',
      location: parsedLocation,
      locality,
      ward,
      department,
      reporter: isAnon ? null : reporterId,
      isAnonymous: isAnon,
      timeline: initialTimeline,
    });

    res.status(201).json({
      success: true,
      message: 'Complaint submitted successfully!',
      data: complaint,
    });
  } catch (error) {
    console.error('Complaint Submission Error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * Get Public Complaint Feed with search, filters, sorting & pagination
 * Route: GET /api/complaints
 */
export const getComplaints = async (req, res) => {
  try {
    const { search, status, category, ward, sort, page = 1, limit = 10 } = req.query;

    const query = {};

    // 1. Search Query (supports ID, keyword description, or locality)
    if (search) {
      query.$or = [
        { complaintId: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { locality: { $regex: search, $options: 'i' } },
      ];
    }

    // 2. Status Filter
    if (status && status !== 'All') {
      query.status = status;
    }

    // 2.5. Department Filter
    if (req.query.department) {
      query.department = req.query.department;
    }

    // 3. Category Filter
    if (category && category !== 'All') {
      query.category = category;
    }

    // 4. Ward Filter
    if (ward && ward !== 'All') {
      query.ward = Number(ward);
    }

    // 5. Build Sort Options
    let sortOption = { createdAt: -1 }; // Newest first (default)
    if (sort === 'oldest') {
      sortOption = { createdAt: 1 };
    }

    // Pagination
    const skip = (Number(page) - 1) * Number(limit);

    const complaints = await Complaint.find(query)
      .populate('reporter', 'name profilePhoto')
      .populate('timeline.officer', 'name role department')
      .sort(sortOption)
      .skip(skip)
      .limit(Number(limit));

    const total = await Complaint.countDocuments(query);

    // Transform complaints to hide reporter details if anonymous
    const sanitizedComplaints = complaints.map((c) => {
      const json = c.toObject();
      if (json.isAnonymous) {
        json.reporter = { name: 'Anonymous Citizen' };
      }
      return json;
    });

    res.json({
      success: true,
      data: sanitizedComplaints,
      pagination: {
        total,
        page: Number(page),
        pages: Math.ceil(total / Number(limit)),
        limit: Number(limit),
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * Get single complaint details
 * Route: GET /api/complaints/:id
 */
export const getComplaintById = async (req, res) => {
  try {
    const id = req.params.id;

    // Support searching either by Mongo ObjectId OR human-readable ComplaintId (e.g. RW-2026-000145)
    let complaint;
    if (mongoose.Types.ObjectId.isValid(id)) {
      complaint = await Complaint.findById(id)
        .populate('reporter', 'name profilePhoto')
        .populate('timeline.officer', 'name role department');
    } else {
      complaint = await Complaint.findOne({ complaintId: id })
        .populate('reporter', 'name profilePhoto')
        .populate('timeline.officer', 'name role department');
    }

    if (!complaint) {
      return res.status(404).json({ success: false, message: 'Complaint not found.' });
    }

    // Sanitize anonymous user
    const responseData = complaint.toObject();
    if (responseData.isAnonymous) {
      responseData.reporter = { name: 'Anonymous Citizen' };
    }

    res.json({ success: true, data: responseData });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * Update complaint status / process timeline (Officer Portal Action)
 * Route: PUT /api/complaints/:id/status
 * Access: Private (Officer only)
 */
export const updateComplaintStatus = async (req, res) => {
  try {
    const { status, remarks } = req.body;
    const complaintId = req.params.id;

    if (!status) {
      return res.status(400).json({ success: false, message: 'New status is required.' });
    }

    // Find complaint
    const complaint = await Complaint.findById(complaintId);
    if (!complaint) {
      return res.status(404).json({ success: false, message: 'Complaint not found.' });
    }

    // Upload files if completion photos are uploaded
    const imageUrls = [];
    if (req.files && req.files.length > 0) {
      for (const file of req.files) {
        const url = await uploadFile(file);
        if (url) imageUrls.push(url);
      }
    }

    // Push new entry to historical timeline
    const newTimelineEntry = {
      status,
      officer: req.user._id,
      remarks: remarks || `Status transitioned to ${status}.`,
      images: imageUrls,
      timestamp: new Date(),
    };

    complaint.timeline.push(newTimelineEntry);
    complaint.status = status;
    await complaint.save();

    res.json({
      success: true,
      message: `Complaint updated successfully to ${status}!`,
      data: complaint,
    });
  } catch (error) {
    console.error('Update Status Error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * Fetch dashboard stats for Rewa City Public Dashboard
 * Route: GET /api/complaints/dashboard-stats
 */
export const getDashboardStats = async (req, res) => {
  try {
    const total = await Complaint.countDocuments();
    const pending = await Complaint.countDocuments({ status: 'Pending' });
    const assigned = await Complaint.countDocuments({ status: 'Assigned' });
    const accepted = await Complaint.countDocuments({ status: 'Accepted' });
    const inProgress = await Complaint.countDocuments({ status: 'In Progress' });
    const resolved = await Complaint.countDocuments({ status: { $in: ['Resolved', 'Verified'] } });
    const rejected = await Complaint.countDocuments({ status: 'Rejected' });

    // Category wise distribution
    const categoryStats = await Complaint.aggregate([
      { $group: { _id: '$category', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);

    // Ward wise distribution
    const wardStats = await Complaint.aggregate([
      { $group: { _id: '$ward', count: { $sum: 1 } } },
      { $sort: { _id: 1 } }
    ]);

    // Latest complaints preview (limit 5)
    const latestComplaints = await Complaint.find()
      .populate('reporter', 'name')
      .sort({ createdAt: -1 })
      .limit(5);

    const sanitizedLatest = latestComplaints.map(c => {
      const json = c.toObject();
      if (json.isAnonymous) {
        json.reporter = { name: 'Anonymous Citizen' };
      }
      return json;
    });

    const resolutionRate = total > 0 ? Math.round((resolved / total) * 100) : 0;

    res.json({
      success: true,
      data: {
        totals: {
          total,
          pending: pending + assigned + accepted, // Unified pending categories
          inProgress,
          resolved,
          rejected,
        },
        resolutionRate,
        categoryDistribution: categoryStats,
        wardDistribution: wardStats,
        latestPreview: sanitizedLatest,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
