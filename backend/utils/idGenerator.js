import Complaint from '../models/Complaint.js';

/**
 * Generates a unique, sequential complaint ID (e.g., RW-2026-000145)
 * @returns {Promise<string>} Sequential Complaint ID
 */
export const generateComplaintId = async () => {
  const currentYear = new Date().getFullYear();
  const prefix = `RW-${currentYear}-`;

  try {
    // Find the latest complaint created in this year
    const lastComplaint = await Complaint.findOne({
      complaintId: { $regex: `^${prefix}` }
    })
      .sort({ createdAt: -1 })
      .select('complaintId')
      .exec();

    let nextNumber = 1;

    if (lastComplaint && lastComplaint.complaintId) {
      const parts = lastComplaint.complaintId.split('-');
      if (parts.length === 3) {
        const lastNum = parseInt(parts[2], 10);
        if (!isNaN(lastNum)) {
          nextNumber = lastNum + 1;
        }
      }
    }

    const paddedNumber = String(nextNumber).padStart(6, '0');
    return `${prefix}${paddedNumber}`;
  } catch (error) {
    console.error('Error generating complaint ID:', error);
    // Fallback ID if search fails
    const randomSuffix = Math.floor(100000 + Math.random() * 900000);
    return `${prefix}${randomSuffix}`;
  }
};
