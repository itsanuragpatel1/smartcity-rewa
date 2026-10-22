import Scheme from '../models/Scheme.js';

/**
 * Get all schemes with optional filters
 * Route: GET /api/schemes
 */
export const getSchemes = async (req, res) => {
  try {
    const { category, search } = req.query;

    const query = {};

    if (category && category !== 'All') {
      query.category = category;
    }

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { eligibility: { $regex: search, $options: 'i' } },
      ];
    }

    const schemes = await Scheme.find(query).sort({ createdAt: -1 });

    res.json({ success: true, data: schemes });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * Create a scheme
 * Route: POST /api/schemes
 */
export const createScheme = async (req, res) => {
  try {
    const { name, description, category, eligibility, benefits, requiredDocuments, deadline, applyLink } = req.body;

    if (!name || !description || !category || !eligibility || !benefits) {
      return res.status(400).json({ success: false, message: 'Required fields are missing' });
    }

    const scheme = await Scheme.create({
      name,
      description,
      category,
      eligibility,
      benefits,
      requiredDocuments: Array.isArray(requiredDocuments) ? requiredDocuments : [],
      deadline: deadline ? new Date(deadline) : null,
      applyLink: applyLink || '',
    });

    res.status(201).json({ success: true, data: scheme });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
