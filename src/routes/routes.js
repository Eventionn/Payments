import { Router } from "express";
import paymentController from "../controllers/paymentController.js";
import paymentStatusController from "../controllers/paymentStatusController.js";
import {verifyToken }from "../middlewares/authMiddleware.js";
import { verifyAdmin } from "../middlewares/adminMiddleware.js";
import {verifyAdvertiser} from "../middlewares/advertiserMiddleware.js";

const router = Router();

// PaymentStatus Routes
router.get('/paymentstatus', verifyToken, verifyAdmin, paymentStatusController.getAllPaymentStatuses);
router.get('/paymentstatus/:id', paymentStatusController.getPaymentStatusById);
router.post('/paymentstatus', paymentStatusController.createPaymentStatus);
router.put('/paymentstatus/:id', paymentStatusController.updatePaymentStatus);
router.delete('/paymentstatus/:id', paymentStatusController.deletePaymentStatus);

// Payment Routes
router.get('/payments', verifyToken, verifyAdmin, paymentController.getAllPayments);
router.get('/payments/my', verifyToken, paymentController.getUserPayments);
router.get('/payments/:id', paymentController.getPaymentById);
router.post('/payments', paymentController.createPayment);
router.put('/payments/:id/cancel', paymentController.cancelPayment);
router.put('/payments/:id', paymentController.updatePayment);
router.delete('/payments/:id', paymentController.deletePayment);
router.get('/payments/ticket/:ticketId', paymentController.getPaymentByTicketId);

export default router;