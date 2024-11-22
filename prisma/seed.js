import { prisma } from '../src/prismaClient.js';

const paymentStatusData = [
  {
    paymentStatusID: '1a2b3c4d-5e6f-7890-abcd-ef1234567890',
    status: 'Completed',
  },
  {
    paymentStatusID: '2b3c4d5e-6f7a-8901-bcde-f12345678901',
    status: 'Pending',
  },
  {
    paymentStatusID: '3c4d5e6f-7a8b-9012-cdef-123456789012',
    status: 'Canceled',
  },
];

const paymentData = [
  {
    paymentID: '4d5e6f7a-8b9c-0123-def4-567890123456',
    totalValue: 100.50,
    paymentType: 'Credit Card',
    timestamp: new Date(),
    paymentStatusID: '1a2b3c4d-5e6f-7890-abcd-ef1234567890',
    ticketID: '5a1f9d3e-b12d-42fd-87f3-9f8f7c6c1a01', 
  },
  {
    paymentID: '5e6f7a8b-9c01-234d-ef56-789012345678',
    totalValue: 50.75,
    paymentType: 'PayPal',
    timestamp: new Date(),
    paymentStatusID: '2b3c4d5e-6f7a-8901-bcde-f12345678901',
    ticketID: '6b2f1e4f-c23e-53fe-98f4-af9e8d7e2b12', 
  },
  {
    paymentID: '6f7a8b9c-0123-45de-f678-901234567890',
    totalValue: 75.00,
    paymentType: 'Bank Transfer',
    timestamp: new Date(),
    paymentStatusID: '3c4d5e6f-7a8b-9012-cdef-123456789012',
    ticketID: '5a1f9d3e-b12d-42fd-87f3-9f8f7c6c1a01', 
  },
];

const seedDatabase = async () => {
  try {
    console.log('🌱 Starting seeding process...');

    // Seed PaymentStatuses
    for (const paymentStatus of paymentStatusData) {
      const createdPaymentStatus = await prisma.paymentStatus.create({
        data: paymentStatus,
      });
      console.log(`✅ Created PaymentStatus with ID: ${createdPaymentStatus.paymentStatusID}`);
    }

    // Seed Payments
    for (const payment of paymentData) {
      const createdPayment = await prisma.payment.create({
        data: payment,
      });
      console.log(`✅ Created Payment with ID: ${createdPayment.paymentID}`);
    }

    console.log('🌱 Seeding completed successfully!');
  } catch (error) {
    console.error('❌ Error during seeding:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
};

seedDatabase();
