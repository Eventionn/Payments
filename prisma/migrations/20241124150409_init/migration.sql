-- CreateTable
CREATE TABLE "Payments" (
    "paymentID" TEXT NOT NULL,
    "totalValue" DOUBLE PRECISION NOT NULL,
    "paymentType" TEXT NOT NULL,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "paymentStatusID" TEXT NOT NULL,
    "ticketID" TEXT NOT NULL,

    CONSTRAINT "Payments_pkey" PRIMARY KEY ("paymentID")
);

-- CreateTable
CREATE TABLE "PaymentStatuses" (
    "paymentStatusID" TEXT NOT NULL,
    "status" VARCHAR(20) NOT NULL,

    CONSTRAINT "PaymentStatuses_pkey" PRIMARY KEY ("paymentStatusID")
);

-- AddForeignKey
ALTER TABLE "Payments" ADD CONSTRAINT "Payments_paymentStatusID_fkey" FOREIGN KEY ("paymentStatusID") REFERENCES "PaymentStatuses"("paymentStatusID") ON DELETE RESTRICT ON UPDATE CASCADE;
