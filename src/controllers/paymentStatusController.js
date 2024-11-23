import { prisma } from '../prismaClient.js';
import paymentStatusService from '../services/paymentStatusService.js';

const paymentStatusController = {

  /**
   * Get all PaymentStatuses
   * @auth none
   * @route {GET} /paymentStatuses
   * @returns {Array} List of PaymentStatuses
   */
  async getAllPaymentStatuses(req, res) {
    try {
      const paymentStatuses = await paymentStatusService.getAllPaymentStatuses();
      console.log(paymentStatuses);

      if (paymentStatuses == null || paymentStatuses.length === 0) {
        return res.status(404).json({ message: 'No payment statuses found' }); 
      }

      res.status(200).json(paymentStatuses);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Error fetching payment statuses' });
    }
  },

  /**
   * Get a PaymentStatus by its ID
   * @auth none
   * @route {GET} /paymentStatuses/{id}
   * @param {String} id - The ID of the PaymentStatus
   * @returns {PaymentStatus} The PaymentStatus object
   */
  async getPaymentStatusById(req, res) {
    const { id } = req.params; // gets id from param url
    try {
      const paymentStatus = await paymentStatusService.getPaymentStatusById(id);

      if (!paymentStatus) {
        return res.status(404).json({ message: 'Payment status not found' });
      }

      res.status(200).json(paymentStatus);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Error fetching payment status by ID' });
    }
  },

  /**
   * Create a new PaymentStatus
   * @auth none
   * @route {POST} /paymentStatuses
   * @bodyparam {PaymentStatus} paymentStatus - The PaymentStatus object to create
   * @returns {PaymentStatus} The created PaymentStatus object
   */
  async createPaymentStatus(req, res) {
    try {
      const { status } = req.body;

      if (!status) {
        return res.status(400).json({ message: 'Missing required field: status' });
      }

      const newPaymentStatus = await paymentStatusService.createPaymentStatus(req.body);
      res.status(201).json(newPaymentStatus);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Error creating payment status' });
    }
  },

  /**
   * Update an existing PaymentStatus
   * @auth none
   * @route {PUT} /paymentStatuses/{id}
   * @param {String} id - The ID of the PaymentStatus to update
   * @bodyparam {PaymentStatus} paymentStatus - The PaymentStatus data to update
   * @returns {PaymentStatus} The updated PaymentStatus object
   */
  async updatePaymentStatus(req, res) {
    const { id } = req.params;
    const paymentStatusData = req.body;

    try {
      const paymentStatus = await paymentStatusService.getPaymentStatusById(id);
      if (!paymentStatus) {
        return res.status(404).json({ message: 'Payment status not found' });
      }

      const updatedPaymentStatus = await paymentStatusService.updatePaymentStatus(id, paymentStatusData);
      res.status(200).json(updatedPaymentStatus);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Error updating payment status' });
    }
  },

  /**
   * Delete a PaymentStatus by its ID
   * @auth none
   * @route {DELETE} /paymentStatuses/{id}
   * @param {String} id - The ID of the PaymentStatus to delete
   * @returns {Object} The result of the deletion
   */
  async deletePaymentStatus(req, res) {
    const { id } = req.params;

    try {
      const paymentStatus = await paymentStatusService.getPaymentStatusById(id);
      if (!paymentStatus) {
        return res.status(404).json({ message: 'Payment status not found' });
      }

      await paymentStatusService.deletePaymentStatus(id);
      res.status(204).json({ message: 'Payment status deleted successfully' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Error deleting payment status' });
    }
  },
};

export default paymentStatusController;
