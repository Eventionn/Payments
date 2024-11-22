-- CreateTable
CREATE TABLE "UserInEvents" (
    "ticketID" TEXT NOT NULL,
    "event_id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "feedback_id" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "participated" BOOLEAN NOT NULL,

    CONSTRAINT "UserInEvents_pkey" PRIMARY KEY ("ticketID")
);

-- CreateTable
CREATE TABLE "Feedbacks" (
    "feedbackID" TEXT NOT NULL,
    "rating" INTEGER NOT NULL,
    "commentary" VARCHAR(150) NOT NULL,

    CONSTRAINT "Feedbacks_pkey" PRIMARY KEY ("feedbackID")
);

-- CreateIndex
CREATE UNIQUE INDEX "UserInEvents_feedback_id_key" ON "UserInEvents"("feedback_id");

-- AddForeignKey
ALTER TABLE "UserInEvents" ADD CONSTRAINT "UserInEvents_feedback_id_fkey" FOREIGN KEY ("feedback_id") REFERENCES "Feedbacks"("feedbackID") ON DELETE SET NULL ON UPDATE CASCADE;
