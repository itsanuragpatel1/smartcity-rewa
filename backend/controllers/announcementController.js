import Announcement from '../models/Announcement.js';

/**
 * Get all announcements (pinned ones first)
 * Route: GET /api/announcements
 */
export const getAnnouncements = async (req, res) => {
  try {
    const { category, search } = req.query;

    const query = {};

    if (category && category !== 'All') {
      query.category = category;
    }

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
      ];
    }

    // Pinned: true first, then publishedDate: desc
    const announcements = await Announcement.find(query).sort({
      pinned: -1,
      publishedDate: -1,
    });

    res.json({ success: true, data: announcements });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * Create a new announcement
 * Route: POST /api/announcements
 */
export const createAnnouncement = async (req, res) => {
  try {
    const { title, banner, description, category, pinned } = req.body;

    if (!title || !description || !category) {
      return res.status(400).json({ success: false, message: 'Title, description, and category are required' });
    }

    const announcement = await Announcement.create({
      title,
      banner: banner || '',
      description,
      category,
      pinned: pinned === 'true' || pinned === true,
      publishedDate: new Date(),
    });

    res.status(201).json({ success: true, data: announcement });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
