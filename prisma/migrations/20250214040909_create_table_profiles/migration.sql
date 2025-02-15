-- CreateEnum
CREATE TYPE "LoginProvider" AS ENUM ('CREDENTIALS');

-- CreateTable
CREATE TABLE "profiles" (
    "id" TEXT NOT NULL,
    "name" VARCHAR(100) NOT NULL,
    "email" VARCHAR(150) NOT NULL,
    "provider" "LoginProvider" NOT NULL DEFAULT 'CREDENTIALS',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "profiles_pkey" PRIMARY KEY ("id")
);
