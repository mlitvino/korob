-- Amounts were stored as currency units (sometimes fractional); store whole cents instead.
-- The tiny offset keeps values like 12.345 (really 12.34499…) rounding to the nearest cent.
UPDATE `transactions` SET `amount` = CAST(ROUND(`amount` * 100 + 0.000001) AS INTEGER);
