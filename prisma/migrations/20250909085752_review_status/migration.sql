-- CreateEnum
CREATE TYPE "public"."ReviewStatus" AS ENUM ('PENDING', 'IN_REVIEW', 'APPROVED', 'REJECTED');

-- AlterTable
ALTER TABLE "public"."Document" ADD COLUMN     "reviewStatus" "public"."ReviewStatus" NOT NULL DEFAULT 'PENDING';
