import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import Complaint from '../models/Complaint.js';

// Helper: Generate JWT
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'super_secret_rewa_connect_token_key_2026_xyz', {
    expiresIn: '30d',
  });
};

/**
 * Register a new citizen
 * Route: POST /api/auth/register
 */
export const registerUser = async (req, res) => {
  try {
    const { name, mobile, email, password, address, profilePhoto } = req.body;

    // Check if user exists (email or mobile)
    const emailExists = await User.findOne({ email });
    if (emailExists) {
      return res.status(400).json({ success: false, message: 'Email already registered' });
    }

    const mobileExists = await User.findOne({ mobile });
    if (mobileExists) {
      return res.status(400).json({ success: false, message: 'Mobile number already registered' });
    }

    // Create user
    const user = await User.create({
      name,
      mobile,
      email,
      password,
      address,
      profilePhoto,
      role: 'citizen', // Citizen registration only. Officers are seeded.
    });

    res.status(201).json({
      success: true,
      data: {
        _id: user._id,
        name: user.name,
        email: user.email,
        mobile: user.mobile,
        address: user.address,
        profilePhoto: user.profilePhoto,
        role: user.role,
        token: generateToken(user._id),
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * Login user (Citizen or Officer)
 * Route: POST /api/auth/login
 */
export const loginUser = async (req, res) => {
  try {
    const { identifier, password } = req.body; // Can be email or mobile

    if (!identifier || !password) {
      return res.status(400).json({ success: false, message: 'Please provide identifier and password' });
    }

    // Find by email or mobile
    const user = await User.findOne({
      $or: [{ email: identifier.toLowerCase() }, { mobile: identifier }],
    });

    if (user && (await user.matchPassword(password))) {
      res.json({
        success: true,
        data: {
          _id: user._id,
          name: user.name,
          email: user.email,
          mobile: user.mobile,
          address: user.address,
          profilePhoto: user.profilePhoto,
          role: user.role,
          department: user.department,
          token: generateToken(user._id),
        },
      });
    } else {
      res.status(401).json({ success: false, message: 'Invalid credentials' });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * Get current user profile and stats
 * Route: GET /api/auth/profile
 */
export const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    // Fetch complaint statistics for this citizen (excluding anonymous)
    let stats = { total: 0, pending: 0, resolved: 0, rejected: 0 };
    let complaints = [];

    if (user.role === 'citizen') {
      complaints = await Complaint.find({ reporter: user._id, isAnonymous: false }).sort({ createdAt: -1 });
      
      const total = complaints.length;
      const resolved = complaints.filter(c => c.status === 'Resolved' || c.status === 'Verified').length;
      const rejected = complaints.filter(c => c.status === 'Rejected').length;
      const pending = total - resolved - rejected;

      stats = { total, pending, resolved, rejected };
    }

    res.json({
      success: true,
      data: {
        profile: user,
        stats,
        complaints,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
