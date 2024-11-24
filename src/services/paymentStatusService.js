import { prisma } from '../prismaClient.js';

const paymentStatusService = {

  /**
   * Get all PaymentStatuses
   * @returns {Array} List of all payment statuses
   */
  async getAllPaymentStatuses() {
    return prisma.paymentStatus.findMany({
    });
  },

  /**
   * Get PaymentStatus by ID
   * @param {String} id - The ID of the PaymentStatus
   * @returns {Object} The payment status object
   */
  async getPaymentStatusById(id) {
    return prisma.paymentStatus.findUnique({
      where: { paymentStatusID: id },
    });
  },

  /**
   * Get PaymentStatus by status
   * @param {String} searchstatus - The status of the PaymentStatus
   * @returns {Object} The payment status object
   */
    async getPaymentStatusByStatus(searchstatus) {
      return prisma.paymentStatus.findFirst({
        where: { status: searchstatus },
      });
    },

  /**
   * Create a new PaymentStatus
   * @param {Object} data - The PaymentStatus data
   * @returns {Object} The created payment status object
   */
  async createPaymentStatus(data) {
    return prisma.paymentStatus.create({
      data,
    });
  },

  /**
   * Update an existing PaymentStatus
   * @param {String} id - The ID of the PaymentStatus to update
   * @param {Object} data - The updated payment status data
   * @returns {Object} The updated payment status object
   */
  async updatePaymentStatus(id, data) {
    return prisma.paymentStatus.update({
      where: { paymentStatusID: id },
      data,
    });
  },

  /**
   * Delete a PaymentStatus by its ID
   * @param {String} id - The ID of the PaymentStatus to delete
   * @returns {Object} The result of the deletion
   */
  async deletePaymentStatus(id) {
    return prisma.paymentStatus.delete({
      where: { paymentStatusID: id },
    });
  },

};

export default paymentStatusService;
