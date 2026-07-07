ALTER TABLE orden_compra
ADD COLUMN activo_oc TINYINT(1) DEFAULT 1 AFTER estado_oc;
