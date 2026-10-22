import mongoose from 'mongoose';

const schemeSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      enum: ['Students', 'Farmers', 'Women', 'Business', 'Employment', 'Housing', 'Education'],
      required: true,
    },
    eligibility: {
      type: String,
      required: true,
    },
    benefits: {
      type: String,
      required: true,
    },
    requiredDocuments: {
      type: [String],
      default: [],
    },
    deadline: {
      type: Date,
      default: null,
    },
    applyLink: {
      type: String,
      default: '',
    },
  },
  {
    timestamps: true,
  }
);

// Index for search
schemeSchema.index({ name: 'text', description: 'text' });

const Scheme = mongoose.model('Scheme', schemeSchema);
export default Scheme;
