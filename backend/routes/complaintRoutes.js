import express from 'express';
import {
  createComplaint,
  getComplaints,
  getComplaintById,
  updateComplaintStatus,
  getDashboardStats,
} from '../controllers/complaintController.js';
import { protect, officer, optionalProtect } from '../middleware/authMiddleware.js';
import upload from '../middleware/uploadMiddleware.js';

const router = express.Router();

router.post('/', optionalProtect, upload.array('images', 5), createComplaint);
router.get('/', getComplaints);
router.get('/dashboard-stats', getDashboardStats);
router.get('/:id', getComplaintById);
router.put('/:id/status', protect, officer, upload.array('images', 5), updateComplaintStatus);

export default router;
