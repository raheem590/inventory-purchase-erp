-- CreateTable
CREATE TABLE "UnitOfMeasure" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "abbreviation" TEXT NOT NULL,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "UnitOfMeasure_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "UnitOfMeasure_name_key" ON "UnitOfMeasure"("name");

-- CreateIndex
CREATE UNIQUE INDEX "UnitOfMeasure_abbreviation_key" ON "UnitOfMeasure"("abbreviation");

-- Seed default UOM
INSERT INTO "UnitOfMeasure" ("id", "name", "abbreviation", "sortOrder", "active", "createdAt")
VALUES ('cmc9pieceuom0000000000000', 'Piece', 'pc', 1, true, NOW())
ON CONFLICT ("abbreviation") DO NOTHING;

-- Add nullable column first
ALTER TABLE "Product" ADD COLUMN "uomId" TEXT;

-- Backfill existing products to Piece
UPDATE "Product"
SET "uomId" = (SELECT "id" FROM "UnitOfMeasure" WHERE "abbreviation" = 'pc' LIMIT 1)
WHERE "uomId" IS NULL;

-- Enforce required relation
ALTER TABLE "Product" ALTER COLUMN "uomId" SET NOT NULL;
ALTER TABLE "Product" ADD CONSTRAINT "Product_uomId_fkey"
FOREIGN KEY ("uomId") REFERENCES "UnitOfMeasure"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
