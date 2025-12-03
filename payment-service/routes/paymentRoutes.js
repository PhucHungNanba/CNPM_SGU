// payment-service/routes/paymentRoutes.js
import express from 'express';
import { processPayment } from '../controllers/paymentController.js'; // Add .js

const router = express.Router();

router.route('/').post(processPayment);

export default router;