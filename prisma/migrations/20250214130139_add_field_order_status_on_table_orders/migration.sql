-- CreateEnum
CREATE TYPE "OrderStatus" AS ENUM ('PENDING', 'SUCCESS');

-- AlterTable
ALTER TABLE "order_categories" ALTER COLUMN "description" DROP NOT NULL;

-- AlterTable
ALTER TABLE "orders" ADD COLUMN     "order_status" "OrderStatus" NOT NULL DEFAULT 'PENDING',
ALTER COLUMN "description" DROP NOT NULL;

-- AlterTable
ALTER TABLE "product_categories" ALTER COLUMN "description" DROP NOT NULL;

-- AlterTable
ALTER TABLE "products" ALTER COLUMN "description" DROP NOT NULL;
