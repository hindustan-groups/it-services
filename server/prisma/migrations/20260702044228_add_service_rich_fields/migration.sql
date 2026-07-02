-- AlterTable
ALTER TABLE "services" ADD COLUMN     "colorFrom" TEXT,
ADD COLUMN     "colorTo" TEXT,
ADD COLUMN     "deliveryTime" TEXT,
ADD COLUMN     "keyFeatures" TEXT[],
ADD COLUMN     "process" JSONB,
ADD COLUMN     "tag" TEXT,
ADD COLUMN     "techStack" TEXT[];
