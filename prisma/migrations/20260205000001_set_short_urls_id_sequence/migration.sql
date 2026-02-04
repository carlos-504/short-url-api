-- Inicia o autoincrement do id em 40000000.
-- Se já existirem registros com id >= 40000000, mantém o valor atual da sequence.
SELECT setval(
  pg_get_serial_sequence('short_urls', 'id'),
  GREATEST(COALESCE((SELECT MAX(id) FROM short_urls), 0), 39999999)
);
