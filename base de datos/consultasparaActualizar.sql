--1. Eliminar tabla temporal:
DROP TABLE IF EXISTS `proformas_temp`;
--2. Renombrar columna (si falla es porque ya existe, sigue con la siguiente):
ALTER TABLE `usuario` CHANGE `contraseña_usua` `pass_usua` VARCHAR(100) NOT NULL;
--3. Nuevas columnas en usuario:
ALTER TABLE `usuario` ADD COLUMN IF NOT EXISTS `activo_usua` TINYINT(1) NOT NULL DEFAULT 1 AFTER `rol_usua`;
ALTER TABLE `usuario` ADD COLUMN IF NOT EXISTS `ultimo_acceso` TIMESTAMP NULL DEFAULT NULL AFTER `activo_usua`;
--4. Cambiar tipos en usuario:
ALTER TABLE `usuario` MODIFY `nombre_usua` VARCHAR(100) NOT NULL;
ALTER TABLE `usuario` MODIFY `apellido_usua` VARCHAR(100) NOT NULL;
ALTER TABLE `usuario` MODIFY `email_usua` VARCHAR(254) NOT NULL;
ALTER TABLE `usuario` MODIFY `ci_usua` VARCHAR(20) NOT NULL;
ALTER TABLE `usuario` MODIFY `celular_usua` VARCHAR(20) NOT NULL;
ALTER TABLE `usuario` MODIFY `direccion_usua` VARCHAR(255) NOT NULL;
--5. Índices:
ALTER TABLE `usuario` ADD UNIQUE INDEX IF NOT EXISTS `email_usua` (`email_usua`);
CREATE INDEX IF NOT EXISTS `idx_email_usua` ON `usuario` (`email_usua`);
--6. VARCHAR(20):
ALTER TABLE `cliente` MODIFY `celular_clte` VARCHAR(20) NOT NULL;
ALTER TABLE `empresa` MODIFY `nit_emp` VARCHAR(50) NOT NULL;
ALTER TABLE `empresa` MODIFY `telefono_emp` VARCHAR(20) NOT NULL;
ALTER TABLE `empresa_prov` MODIFY `nit_empp` VARCHAR(50) NOT NULL;
ALTER TABLE `empresa_prov` MODIFY `telefono_empp` VARCHAR(20) NOT NULL;
ALTER TABLE `proveedor` MODIFY `celular_prov` VARCHAR(20) NOT NULL;
--7. DECIMAL(10,2) / DECIMAL(12,2) / DECIMAL(10,4):
ALTER TABLE `cmp_prod`       MODIFY `cost_uni_cppd` DECIMAL(10,2) NOT NULL;
ALTER TABLE `compra`         MODIFY `total_cmp` DECIMAL(12,2) NOT NULL;
ALTER TABLE `compra`         MODIFY `tipo_cambio_cmp` DECIMAL(10,4) NOT NULL;
ALTER TABLE `compra`         MODIFY `descuento_cmp` DECIMAL(10,2) NOT NULL;
ALTER TABLE `devolucion`     MODIFY `descuento_dvl` DECIMAL(10,2) NOT NULL;
ALTER TABLE `devolucion`     MODIFY `total_dvl` DECIMAL(12,2) NOT NULL;
ALTER TABLE `devolucion`     MODIFY `tipo_cambio_dvl` DECIMAL(10,4) NOT NULL;
ALTER TABLE `empresa_prov`   MODIFY `descuento_empp` DECIMAL(10,2) NOT NULL;
ALTER TABLE `inventario`     MODIFY `cost_uni_inv` DECIMAL(10,2) NOT NULL;
ALTER TABLE `inventario_arce` MODIFY `cost_uni_inv` DECIMAL(10,2) NOT NULL;
ALTER TABLE `lista_precios`  MODIFY `precio` DECIMAL(10,2) NOT NULL;
ALTER TABLE `mdf_proforma`   MODIFY `descuento_mprof` DECIMAL(10,2) NOT NULL;
ALTER TABLE `mdf_proforma`   MODIFY `total_mprof` DECIMAL(12,2) NOT NULL;
ALTER TABLE `mdf_proforma`   MODIFY `tipo_cambio_mprof` DECIMAL(10,4) NOT NULL;
ALTER TABLE `mdf_prof_prod`  MODIFY `cost_uni_mpfpd` DECIMAL(10,2) NOT NULL;
ALTER TABLE `nota_entrega`   MODIFY `descuento_ne` DECIMAL(10,2) NOT NULL;
ALTER TABLE `nota_entrega`   MODIFY `total_ne` DECIMAL(12,2) NOT NULL;
ALTER TABLE `nota_entrega`   MODIFY `tipo_cambio_ne` DECIMAL(10,4) NOT NULL;
ALTER TABLE `nte_prod`       MODIFY `cost_uni_nepd` DECIMAL(10,2) NOT NULL;
ALTER TABLE `oc_prod`        MODIFY `cost_uni_ocpd` DECIMAL(10,2) NOT NULL;
ALTER TABLE `orden_compra`   MODIFY `descuento_oc` DECIMAL(10,2) NOT NULL;
ALTER TABLE `orden_compra`   MODIFY `total_oc` DECIMAL(12,2) NOT NULL;
ALTER TABLE `orden_compra`   MODIFY `tipo_cambio_oc` DECIMAL(10,4) NOT NULL;
ALTER TABLE `proforma`       MODIFY `descuento_prof` DECIMAL(10,2) NOT NULL;
ALTER TABLE `proforma`       MODIFY `total_prof` DECIMAL(12,2) NOT NULL;
ALTER TABLE `proforma`       MODIFY `tipo_cambio_prof` DECIMAL(10,4) NOT NULL;
ALTER TABLE `prof_prod`      MODIFY `cost_uni_pfpd` DECIMAL(10,2) NOT NULL;
ALTER TABLE `venta`          MODIFY `descuento_vnt` DECIMAL(10,2) NOT NULL;
ALTER TABLE `venta`          MODIFY `total_vnt` DECIMAL(12,2) NOT NULL;
ALTER TABLE `vnt_prod`       MODIFY `cost_uni_vtpd` DECIMAL(10,2) NOT NULL;
--8. Índices faltantes:
CREATE INDEX IF NOT EXISTS `fk_id_clte_dvl` ON `devolucion` (`fk_id_clte_dvl`);
CREATE INDEX IF NOT EXISTS `fk_id_usua_dvl` ON `devolucion` (`fk_id_usua_dvl`);
CREATE INDEX IF NOT EXISTS `fk_id_usua_ing` ON `ingreso` (`fk_id_usua_ing`);
CREATE INDEX IF NOT EXISTS `fk_id_ing_igpd` ON `ing_prod` (`fk_id_ing_igpd`);
CREATE INDEX IF NOT EXISTS `fk_id_prod_igpd` ON `ing_prod` (`fk_id_prod_igpd`);
CREATE INDEX IF NOT EXISTS `fk_id_prod_inv` ON `inventario` (`fk_id_prod_inv`);
CREATE INDEX IF NOT EXISTS `fk_id_prod_inv` ON `inventario_arce` (`fk_id_prod_inv`);
CREATE INDEX IF NOT EXISTS `fk_id_prof_ne` ON `nota_entrega` (`fk_id_prof_ne`);
CREATE INDEX IF NOT EXISTS `fk_id_oc_ne` ON `nota_entrega` (`fk_id_oc_ne`);
CREATE INDEX IF NOT EXISTS `fk_id_clte_ne` ON `nota_entrega` (`fk_id_clte_ne`);
CREATE INDEX IF NOT EXISTS `fk_id_ne_nepd` ON `nte_prod` (`fk_id_ne_nepd`);
CREATE INDEX IF NOT EXISTS `fk_id_prod_nepd` ON `nte_prod` (`fk_id_prod_nepd`);
CREATE INDEX IF NOT EXISTS `fk_id_ocpd_nepd` ON `nte_prod` (`fk_id_ocpd_nepd`);
CREATE INDEX IF NOT EXISTS `fk_id_oc_ocpd` ON `oc_prod` (`fk_id_oc_ocpd`);
CREATE INDEX IF NOT EXISTS `fk_id_prod_ocpd` ON `oc_prod` (`fk_id_prod_ocpd`);
CREATE INDEX IF NOT EXISTS `fk_id_prof_oc` ON `orden_compra` (`fk_id_prof_oc`);
CREATE INDEX IF NOT EXISTS `fk_id_clte_oc` ON `orden_compra` (`fk_id_clte_oc`);
CREATE INDEX IF NOT EXISTS `fk_id_usua_oc` ON `orden_compra` (`fk_id_usua_oc`);
CREATE INDEX IF NOT EXISTS `fk_id_clte_vnt` ON `venta` (`fk_id_usua_vnt`);
CREATE INDEX IF NOT EXISTS `fk_id_prof_vnt` ON `venta` (`fk_id_ne_vnt`);
CREATE INDEX IF NOT EXISTS `fk_id_clte_vnt_2` ON `venta` (`fk_id_clte_vnt`);
--eliminar guaerfnos
DELETE FROM `ing_prod` WHERE `fk_id_ing_igpd` NOT IN (SELECT `id_ing` FROM `ingreso`);
--añadir activo_prod
ALTER TABLE `producto`
  ADD COLUMN IF NOT EXISTS `activo_prod` TINYINT(1) NOT NULL DEFAULT 1 AFTER `catalogo_prod`;
--añadir activo_ne
  ALTER TABLE nota_entrega
ADD COLUMN activo_ne TINYINT(1) DEFAULT 1 AFTER estado_ne;

DROP TABLE IF EXISTS `devolucion`;

CREATE TABLE devolucion (
    id_dvl INT AUTO_INCREMENT PRIMARY KEY,
    fk_id_ne_dvl INT NOT NULL,
    fk_id_usua_dvl INT NOT NULL,
    fecha_dvl DATE NOT NULL,
    motivo_dvl TEXT,
    total_dvl DECIMAL(10,2) DEFAULT 0,
    FOREIGN KEY (fk_id_ne_dvl) REFERENCES nota_entrega(id_ne),
    FOREIGN KEY (fk_id_usua_dvl) REFERENCES usuario(id_usua)
);

CREATE TABLE dvl_prod (
    id_dp INT AUTO_INCREMENT PRIMARY KEY,
    fk_id_dvl_dp INT NOT NULL,
    fk_id_prod_dp INT NOT NULL,
    cantidad_dp INT NOT NULL,
    cost_uni_dp DECIMAL(10,2),
    almacen_dp TINYINT(1) NOT NULL COMMENT '0=El Alto(inventario), 1=La Paz(inventario_arce)',
    FOREIGN KEY (fk_id_dvl_dp) REFERENCES devolucion(id_dvl),
    FOREIGN KEY (fk_id_prod_dp) REFERENCES producto(id_prod)
);


ALTER TABLE orden_compra
ADD COLUMN activo_oc TINYINT(1) DEFAULT 1 AFTER estado_oc;
