import { Router } from "express";
import paymentController from "../controllers/paymentController.js";

const router = Router();

// PaymentStatus Routes


// Payment Routes
router.get('/payments', paymentController.getAllPayments);
router.get('/payments/:id', paymentController.getPaymentById);
router.post('/payments', paymentController.createPayment);
router.put('/payments/:id', paymentController.updatePayment);
router.delete('/payments/:id', paymentController.deletePayment);
//rota dos meus pagamentos - api/payments/my


export default router;