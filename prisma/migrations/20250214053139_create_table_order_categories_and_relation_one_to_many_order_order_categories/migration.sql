/*
  Warnings:

  - Added the required column `order_category_id` to the `orders` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "orders" ADD COLUMN     "order_category_id" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "order_categories" (
    "id" TEXT NOT NULL,
    "name" VARCHAR(150) NOT NULL,
    "slug" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "order_categories_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "orders" ADD CONSTRAINT "orders_order_category_id_fkey" FOREIGN KEY ("order_category_id") REFERENCES "order_categories"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
