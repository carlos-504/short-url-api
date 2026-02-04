-- Reverte short_code para VARCHAR(6) conforme requisito (máx. 6 caracteres).
-- Necessário apenas se a migration anterior alterou para VARCHAR(12).
ALTER TABLE "short_urls" ALTER COLUMN "short_code" SET DATA TYPE VARCHAR(6);
