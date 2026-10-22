import mongoose from 'mongoose';

const paymentHistorySchema = new mongoose.Schema({
  transactionId: {
    type: String,
    required: true,
  },
  amountPaid: {
    type: Number,
    required: true,
  },
  paidAt: {
    type: Date,
    default: Date.now,
  },
  paymentMethod: {
    type: String,
    default: 'Net Banking/Card',
  },
});

const billSchema = new mongoose.Schema(
  {
    billType: {
      type: String,
      enum: ['Water Bill', 'Property Tax', 'Garbage Collection', 'Municipal Charges'],
      required: true,
    },
    consumerNumber: {
      type: String,
      required: true,
      index: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    dueDate: {
      type: Date,
      required: true,
    },
    status: {
      type: String,
      enum: ['Paid', 'Unpaid'],
      default: 'Unpaid',
    },
    ownerName: {
      type: String,
      required: true,
    },
    paymentHistory: [paymentHistorySchema],
  },
  {
    timestamps: true,
  }
);

const Bill = mongoose.model('Bill', billSchema);
export default Bill;
