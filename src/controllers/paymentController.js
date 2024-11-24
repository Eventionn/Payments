import { prisma } from '../prismaClient.js';
import paymentService from '../services/paymentService.js';
import paymentStatusService from '../services/paymentStatusService.js';

const paymentController = {

  /**
   * Get all Payments
   * @auth none
   * @route {GET} /payments
   * @returns {Array} List of Payments
   */
  async getAllPayments(req, res) {
    try {
      const payments = await paymentService.getAllPayments();
      console.log(payments);

      if (payments == null || payments.length === 0) {
        return res.status(404).json({ message: 'No payments found' }); 
      }

      res.status(200).json(payments);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Error fetching payments' });
    }
  },

  /**
   * Get a Payment by its ID
   * @auth none
   * @route {GET} /payments/{id}
   * @param {String} id - The ID of the Payment
   * @returns {Payment} The Payment object
   */
  async getPaymentById(req, res) {
    const { id } = req.params; // gets id from param url
    try {
      const payment = await paymentService.getPaymentById(id);
  
      if (!payment) {
        return res.status(404).json({ message: 'Payment not found' });
      }
  
      res.status(200).json(payment);

    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Error fetching Payment by ID' });
    }
  },

  /**
   * Create a new Payment
   * @auth none
   * @route {POST} /payments
   * @bodyparam {Payment} payment - The Payment object to create
   * @returns {Payment} The created Payment object
   */
  async createPayment(req, res) {
    try {
        
      const { totalValue, paymentType, paymentStatusID, ticketID } = req.body;
      
      // Verificar campos obrigatórios
      if (!totalValue || !paymentType || !ticketID) {
        return res.status(400).json({ message: 'Missing required fields' });
      }

      let paymentStatus;

      // Se paymentStatusID for enviado, validar
      if (paymentStatusID) {
        paymentStatus = await paymentStatusService.getPaymentStatusById(paymentStatusID);

        if (!paymentStatus) {
          return res.status(404).json({ message: 'Payment Status not found' });
        }
      } else {
        // Caso `paymentStatusID` não seja enviado, buscar o status 'Pending'
        paymentStatus = await paymentStatusService.getPaymentStatusByStatus('Pending');

        if (!paymentStatus) {
          return res.status(404).json({ message: 'Default Payment Status "Pending" not found' });
        }

        // Atribuir o ID do status 'Pending' ao corpo da requisição
        req.body.paymentStatusID = paymentStatus.paymentStatusID;
      }


      // Criar Payment
      const newPayment = await paymentService.createPayment(req.body);

      res.status(201).json(newPayment);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Error creating Payment' });
    }
  },

  /**
   * Update an existing Payment
   * @auth none
   * @route {PUT} /payments/{id}
   * @param {String} id - The ID of the Payment to update
   * @bodyparam {Payment} payment - The Payment data to update
   * @returns {Payment} The updated Payment object
   */
  async updatePayment(req, res) {
    const { id } = req.params;
    const paymentData = req.body;

    try {

      const payment = await paymentService.getPaymentById(id);
      if (!payment) {
        return res.status(404).json({ message: 'Payment not found' });
      }

      // Verifica se o paymentStatusID (se enviado) é válido
      if (paymentData.paymentStatusID) {
          const paymentStatus = await paymentStatusService.getPaymentStatusByStatus('Canceled');

          if (!paymentStatus) {
              return res.status(404).json({ message: 'Payment Status not found' });
          }
      }

      const updatedPayment = paymentService.updatePayment(id, paymentData);
      res.status(200).json(updatedPayment);

    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Error updating Payment' });
    }
  },

  /**
   * Cancel a Payment
   * @auth none
   * @route {PUT} /payments/{id}/cancel
   * @param {String} id - The ID of the Payment to cancel
   * @returns {Payment} The updated Payment object with the status changed to "canceled"
   */
  async cancelPayment(req, res) {
    const { id } = req.params;

    try {
      // Verifica se o pagamento existe
      const payment = await paymentService.getPaymentById(id);
      if (!payment) {
        return res.status(404).json({ message: 'Payment not found' });
      }

      //procura status 
      const canceledStatus = await prisma.paymentStatus.findFirst({
        where: { status: 'Canceled' }, 
      });

      if (!canceledStatus) {
        return res.status(404).json({ message: 'Payment Status "canceled" not found' });
      }

      // Atualiza o status para canceled
      const updatedPayment = await paymentService.updatePayment(id, {
        paymentStatusID: canceledStatus.paymentStatusID,
      });

      // success
      res.status(200).json(updatedPayment);

    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Error canceling Payment' });
    }
  },

  /**
   * Delete a Payment by its ID
   * @auth none
   * @route {DELETE} /payments/{id}
   * @param {String} id - The ID of the Payment to delete
   * @returns {Object} The result of the deletion
   */
  async deletePayment(req, res) {
    const { id } = req.params;

    try {

      const payment = await paymentService.getPaymentById(id);
      if (!payment) {
        return res.status(404).json({ message: 'Payment not found' });
      }
    
      await paymentService.deletePayment(id);
      res.status(204).json({ message: 'Payment deleted successfully' });
      
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Error deleting Payment' });
    }
  },
};

export default paymentController;