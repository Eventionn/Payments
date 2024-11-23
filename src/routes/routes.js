import { Router } from "express";
import paymentController from "../controllers/paymentController.js";
import paymentStatusController from "../controllers/paymentStatusController.js";

const router = Router();

// PaymentStatus Routes
router.get('/paymentstatus', paymentStatusController.getAllPaymentStatuses);
router.get('/paymentstatus/:id', paymentStatusController.getPaymentStatusById);
router.post('/paymentstatus', paymentStatusController.createPaymentStatus);
router.put('/paymentstatus/:id', paymentStatusController.updatePaymentStatus);
router.delete('/paymentstatus/:id', paymentStatusController.deletePaymentStatus);

// Payment Routes
router.get('/payments', paymentController.getAllPayments);
router.get('/payments/:id', paymentController.getPaymentById);
router.post('/payments', paymentController.createPayment);
router.put('/payments/:id', paymentController.updatePayment);
router.delete('/payments/:id', paymentController.deletePayment);
//rota dos meus pagamentos - api/payments/my


export default router;