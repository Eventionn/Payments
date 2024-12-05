import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const paymentService = {

  /**
   * Get all Payments
   * @returns {Array} List of all payments
   */
  async getAllPayments() {
    return prisma.payment.findMany({
      include: {
        paymentStatus: true,  
      },
    });
  },

  /**
   * Get Payment by ID
   * @param {String} id - The ID of the Payment
   * @returns {Object} The payment object
   */
  async getPaymentById(id) {
    return prisma.payment.findUnique({
      where: { paymentID: id },
      include: {
        paymentStatus: true,  
      },
    });
  },

  /**
   * Create a new Payment
   * @param {Object} data - The Payment data
   * @returns {Object} The created payment object
   */
  async createPayment(data) {
    return prisma.payment.create({
      data,
      include: {
        paymentStatus: true,  
      },
    });
  },

  /**
   * Update an existing Payment
   * @param {String} id - The ID of the Payment to update
   * @param {Object} data - The updated payment data
   * @returns {Object} The updated payment object
   */
  async updatePayment(id, data) {
    return prisma.payment.update({
      where: { paymentID: id },
      data,
      include: {
        paymentStatus: true,  
      },
    });
  },

  /**
   * Delete a Payment by its ID
   * @param {String} id - The ID of the Payment to delete
   * @returns {Object} The result of the deletion
   */
  async deletePayment(id) {
    return prisma.payment.delete({
      where: { paymentID: id },
    });
  },

  /**
   * Get all Payments for a specific Ticket
   * @param {String} ticketId - The ticket ID
   * @returns {Array} List of payments for the given ticket
   */
  async getPaymentsByTicket(ticketId) {
    return prisma.payment.findMany({
      where: { ticketID: ticketId },
      include: {
        paymentStatus: true,  
      },
    });
  },

    /**
   * Get Payment for a specific Ticket
   * @param {String} ticketId - The ticket ID
   * @returns {Array} List of payments for the given ticket
   */
    async getPaymentByTicketId(ticketId) {
      return prisma.payment.findMany({
        where: { ticketID: ticketId },
        include: {
          paymentStatus: true,  
        },
      });
    },

  /**
   * Get all Payments by Payment Status
   * @param {String} paymentStatusID - The ID of the payment status
   * @returns {Array} List of payments for the given status
   */
  async getPaymentsByStatus(paymentStatusID) {
    return prisma.payment.findMany({
      where: { paymentStatusID },
      include: {
        paymentStatus: true,  
      },
    });
  },

  /**
   * Get all user payments
   * @param {string} userId - The ID of the user
   * @returns {Promise<Array>} List of user payments
   */
  async getUserPayments(userId) {
    return prisma.payment.findMany({
      where: {
        ticketID: {
          in: (
            await prisma.userInEvent.findMany({
              where: {
                user_id: userId, // get tickets
              },
              select: {
                ticketID: true, // seleciona ids
              },
            })
          ).map((userInEvent) => userInEvent.ticketID), // get ticket ids
        },
      },
      include: {
        paymentStatus: true, // get payment status
      },
    });
  },

  /**
   * Get user payments
   * @param {string} userId - The ID of the user
   * @returns {Promise<Array>} List of user payments
   */
  async getPayment(ticketId) {
    return prisma.payment.findFirst({
      where: {
        ticketID: ticketId
      }
    });
  },

};

export default paymentService;