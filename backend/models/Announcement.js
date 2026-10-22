import mongoose from 'mongoose';

const announcementSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    banner: {
      type: String,
      default: '',
    },
    description: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      enum: [
        'Water Supply',
        'Road Closure',
        'Traffic',
        'Emergency',
        'Government Notice',
        'Public Notice',
        'Development',
        'Festival',
        'Event',
      ],
      required: true,
    },
    pinned: {
      type: Boolean,
      default: false,
    },
    publishedDate: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

// Index for search
announcementSchema.index({ title: 'text', description: 'text' });

const Announcement = mongoose.model('Announcement', announcementSchema);
export default Announcement;
