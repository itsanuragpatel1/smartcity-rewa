import Bill from '../models/Bill.js';

/**
 * Fetch bill by utility type and consumer number
 * Route: GET /api/bills/:billType/:consumerNumber
 */
export const getBill = async (req, res) => {
  try {
    const { billType, consumerNumber } = req.params;

    // Decode URI space characters just in case
    const decodedType = decodeURIComponent(billType);

    const bill = await Bill.findOne({
      billType: decodedType,
      consumerNumber: consumerNumber,
    });

    if (!bill) {
      return res.status(404).json({
        success: false,
        message: `No active consumer found for Consumer Number: ${consumerNumber} under ${decodedType}.`,
      });
    }

    res.json({ success: true, data: bill });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * Simulate payment of a municipal bill
 * Route: POST /api/bills/:billId/pay
 */
export const payBill = async (req, res) => {
  try {
    const { billId } = req.params;
    const { paymentMethod = 'UPI/Credit Card' } = req.body;

    const bill = await Bill.findById(billId);
    if (!bill) {
      return res.status(404).json({ success: false, message: 'Bill record not found.' });
    }

    if (bill.status === 'Paid') {
      return res.status(400).json({ success: false, message: 'This bill has already been paid.' });
    }

    // Update status and push to payment history
    const transactionId = `TXN-${Date.now()}-${Math.floor(1000 + Math.random() * 9000)}`;
    
    bill.status = 'Paid';
    bill.paymentHistory.push({
      transactionId,
      amountPaid: bill.amount,
      paidAt: new Date(),
      paymentMethod,
    });

    await bill.save();

    res.json({
      success: true,
      message: 'Payment completed successfully!',
      data: bill,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
