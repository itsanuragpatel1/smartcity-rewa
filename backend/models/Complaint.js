import mongoose from 'mongoose';

const timelineSchema = new mongoose.Schema({
  status: {
    type: String,
    enum: ['Pending', 'Assigned', 'Accepted', 'In Progress', 'Resolved', 'Verified', 'Reopened', 'Rejected'],
    required: true,
  },
  officer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null,
  },
  remarks: {
    type: String,
    default: '',
  },
  images: {
    type: [String],
    default: [],
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
});

const complaintSchema = new mongoose.Schema(
  {
    complaintId: {
      type: String,
      required: true,
      unique: true,
    },
    description: {
      type: String,
      required: true,
    },
    images: {
      type: [String],
      required: true,
      validate: [
        (val) => val.length > 0,
        'At least one image is required for a complaint.',
      ],
    },
    category: {
      type: String,
      enum: [
        'Roads & Potholes',
        'Street Light',
        'Garbage',
        'Water Supply',
        'Drainage',
        'Electricity',
        'Park',
        'Illegal Construction',
        'Public Property',
        'Other',
      ],
      default: 'Other',
    },
    status: {
      type: String,
      enum: ['Pending', 'Assigned', 'Accepted', 'In Progress', 'Resolved', 'Verified', 'Reopened', 'Rejected'],
      default: 'Pending',
    },
    location: {
      lat: { type: Number, required: true },
      lng: { type: Number, required: true },
    },
    locality: {
      type: String,
      required: true,
    },
    ward: {
      type: Number,
      required: true,
    },
    department: {
      type: String,
      required: true,
    },
    reporter: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null, // null means anonymous or unregistered
    },
    isAnonymous: {
      type: Boolean,
      default: false,
    },
    timeline: [timelineSchema],
  },
  {
    timestamps: true,
  }
);

// Indexing for search
complaintSchema.index({ complaintId: 'text', description: 'text', locality: 'text' });

const Complaint = mongoose.model('Complaint', complaintSchema);
export default Complaint;
