import express from 'express';
import { getBill, payBill } from '../controllers/billController.js';

const router = express.Router();

router.get('/:billType/:consumerNumber', getBill);
router.post('/:billId/pay', payBill);

export default router;
