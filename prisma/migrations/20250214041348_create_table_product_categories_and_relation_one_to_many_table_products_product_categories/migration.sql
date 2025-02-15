/*
  Warnings:

  - You are about to alter the column `name` on the `products` table. The data in that column could be lost. The data in that column will be cast from `VarChar(255)` to `VarChar(150)`.

*/
-- AlterTable
ALTER TABLE "products" ADD COLUMN     "product_category_id" TEXT,
ALTER COLUMN "name" SET DATA TYPE VARCHAR(150);

-- CreateTable
CREATE TABLE "product_categories" (
    "id" TEXT NOT NULL,
    "name" VARCHAR(150) NOT NULL,
    "slug" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "product_categories_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "products" ADD CONSTRAINT "products_product_category_id_fkey" FOREIGN KEY ("product_category_id") REFERENCES "product_categories"("id") ON DELETE SET NULL ON UPDATE CASCADE;
