import { prisma } from '../prismaClient.js';
import paymentService from '../services/paymentService.js';
import paymentStatusService from '../services/paymentStatusService.js';
import axios from 'axios';

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

      // Configuração para ignorar certificados autoassinados (apenas para desenvolvimento)
      const agent = new https.Agent({ rejectUnauthorized: false });      

      // const ticketExistsResponse = await axios.get(`http://userineventservice:5003/api/tickets/${ticketID}`);
      //const ticketExistsResponse = await axios.get(`http://nginx-api-gateway:5010/userinevent/api/tickets/${ticketID}`); //api gateway
      const ticketExistsResponse = await axios.get(`https://userineventservice:5003/api/tickets/${ticketID}`, { httpsAgent: agent }); //https teste
      //const ticketExistsResponse = await axios.get(`http://nginx-api-gateway:5010/userinevent/api/tickets/${ticketID}`, { httpsAgent: agent });  //https api gateway

      if (!ticketExistsResponse || !ticketExistsResponse.data) {
        return res.status(404).json({ message: 'Ticket not found' });
      }
      
      console.log(ticketExistsResponse.data);

      const useridticket = ticketExistsResponse.data.user_id;

      // const userExistsResponse = await axios.get(`http://userservice:5001/api/users/${useridticket}`);
      //const userExistsResponse = await axios.get(`http://nginx-api-gateway:5010/user/api/users/${useridticket}`); //api gateway
      const userExistsResponse = await axios.get(`https://userservice:5001/api/users/${useridticket}`, { httpsAgent: agent }); //https teste
      //const userExistsResponse = await axios.get(`http://nginx-api-gateway:5010/user/api/users/${useridticket}`, { httpsAgent: agent });  //https api gateway

      if (!userExistsResponse || !userExistsResponse.data) {
        return res.status(404).json({ message: 'User not found' });
      }

      let paymentStatus;

      // paymentStatusID enviado, validar
      if (paymentStatusID) {
        paymentStatus = await paymentStatusService.getPaymentStatusById(paymentStatusID);

        if (!paymentStatus) {
          return res.status(404).json({ message: 'Payment Status not found' });
        }
      } else {
        // paymentStatusID não enviado procura o status 'Pending'
        paymentStatus = await paymentStatusService.getPaymentStatusByStatus('Pending');

        if (!paymentStatus) {
          return res.status(404).json({ message: 'Default Payment Status "Pending" not found' });
        }

        // ID do status 'Pending' no body da requisição
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

      // verifica se o paymentStatusID é válido
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

  /**
   * Get User payments
   * @route {GET} /payments/my
   * @param {string} id - The ID of the Payment
   * @returns {Array} List of payments
   */
  async getUserPayments(req, res) {
    try {
      console.log(req.user);
      const userId = req.user.userID;
  
      console.log(userId);
  
      // Configura o cabeçalho com o token
      const token = req.headers.authorization; // token do cabeçalho do req
      const axiosConfig = {
        headers: {
          Authorization: token, // token
        },
      };
  
      // get tickets com o token no cabeçalho
      // const ticketResponse = await axios.get(`http://userineventservice:5003/api/tickets/my/`, axiosConfig);
      //const ticketResponse = await axios.get(`http://nginx-api-gateway:5010/userinevent/api/tickets/my/`, axiosConfig);
      const ticketResponse = await axios.get(`http://userineventservice:5003/api/tickets/my/`, axiosConfig, { httpsAgent: agent }); //https teste
      //const ticketResponse = await axios.get(`http://nginx-api-gateway:5010/userinevent/api/tickets/my/`, axiosConfig, { httpsAgent: agent });  //https api gateway
      const tickets = ticketResponse.data;
  
      if (!tickets || tickets.length === 0) {
        return res.status(404).json({ message: 'No tickets found' });
      }
  
      // array de pagamentos
      const payments = [];
  
      // procura pagamento de cada ticket
      for (const element of tickets) {
        const pay = await paymentService.getPayment(element.ticketID);
        if (pay) {
          payments.push(pay);
        }
      }
  
      // Resposta com os pagamentos encontrados
      res.status(200).json(payments);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Error fetching payments' });
    }
  },


  /**
   * Get a Payment by ticket ID
   * @auth none 
   * @route {GET} /payments/ticket/{ticketId}
   * @param {String} ticketId - The ID of the Ticket
   * @returns {Payment} The Payment object
   */
  async getPaymentByTicketId(req, res) {
    const { ticketId } = req.params; // gets id from param url
    try {
      const payment = await paymentService.getPaymentByTicketId(ticketId);
  
      if (!payment) {
        return res.status(404).json({ message: 'Payment not found' });
      }
  
      res.status(200).json(payment);

    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Error fetching Payment by ID' });
    }
  },

};

export default paymentController;