-- CreateTable
CREATE TABLE "Analysis" (
    "id" SERIAL NOT NULL,
    "url" TEXT NOT NULL,
    "score" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Analysis_pkey" PRIMARY KEY ("id")
);
