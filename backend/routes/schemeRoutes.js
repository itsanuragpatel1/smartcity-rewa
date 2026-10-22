import express from 'express';
import { getSchemes, createScheme } from '../controllers/schemeController.js';

const router = express.Router();

router.get('/', getSchemes);
router.post('/', createScheme); // Open for seeding/updates

export default router;
