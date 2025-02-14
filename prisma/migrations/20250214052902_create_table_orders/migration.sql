-- CreateTable
CREATE TABLE "orders" (
    "id" TEXT NOT NULL,
    "label" VARCHAR(100) NOT NULL,
    "description" TEXT NOT NULL,
    "total_amount" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "orders_pkey" PRIMARY KEY ("id")
);
