-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Servidor: localhost:3306
-- Tiempo de generación: 04-07-2026 a las 10:04:35
-- Versión del servidor: 10.6.19-MariaDB-log
-- Versión de PHP: 8.1.34

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de datos: `smsiccom_inventario_v2`
--

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `armado`
--

CREATE TABLE `armado` (
  `id_rmd` int(11) NOT NULL,
  `almacen_rmd` int(11) NOT NULL,
  `numero_rmd` int(11) NOT NULL,
  `fecha_rmd` timestamp NOT NULL DEFAULT current_timestamp(),
  `fk_id_usua_rmd` int(11) NOT NULL,
  `proforma_rmd` varchar(500) NOT NULL,
  `observacion_rmd` varchar(500) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `categoria`
--

CREATE TABLE `categoria` (
  `id_ctgr` int(11) NOT NULL,
  `nombre_ctgr` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `cliente`
--

CREATE TABLE `cliente` (
  `id_clte` int(11) NOT NULL,
  `numero_clte` int(11) NOT NULL,
  `nombre_clte` varchar(30) NOT NULL,
  `apellido_clte` varchar(30) NOT NULL,
  `nit_clte` varchar(100) NOT NULL,
  `email_clte` varchar(100) NOT NULL,
  `direccion_clte` varchar(50) NOT NULL,
  `celular_clte` varchar(20) NOT NULL,
  `fk_id_emp_clte` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `cmp_prod`
--

CREATE TABLE `cmp_prod` (
  `id_cppd` int(11) NOT NULL,
  `fk_id_cmp_cppd` int(11) NOT NULL,
  `fk_id_prod_cppd` int(11) NOT NULL,
  `descripcion_cppd` varchar(4000) NOT NULL,
  `cantidad_cppd` int(11) NOT NULL,
  `cost_uni_cppd` decimal(10,2) NOT NULL,
  `factura_cppd` int(11) NOT NULL,
  `fecha_entrega_cppd` date NOT NULL,
  `fecha_factura_cppd` date NOT NULL,
  `observacion_cppd` varchar(200) NOT NULL,
  `estado_cppd` int(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `compra`
--

CREATE TABLE `compra` (
  `id_cmp` int(11) NOT NULL,
  `numero_cmp` int(11) NOT NULL,
  `fecha_cmp` date NOT NULL,
  `fk_id_prov_cmp` int(11) NOT NULL,
  `fk_id_usua_cmp` int(11) NOT NULL,
  `total_cmp` decimal(12,2) NOT NULL,
  `forma_pago_cmp` varchar(100) NOT NULL,
  `tpo_entrega_cmp` varchar(100) NOT NULL,
  `estado_cmp` varchar(100) NOT NULL,
  `moneda_cmp` varchar(10) NOT NULL,
  `tipo_cambio_cmp` decimal(10,4) NOT NULL,
  `descuento_cmp` decimal(10,2) NOT NULL,
  `observacion_cmp` varchar(100) NOT NULL,
  `almacen_cmp` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `devolucion`
--

CREATE TABLE `devolucion` (
  `id_dvl` int(11) NOT NULL,
  `numero_dvl` int(11) NOT NULL,
  `fk_id_clte_dvl` int(11) NOT NULL,
  `fk_id_usua_dvl` int(11) NOT NULL,
  `fk_id_ne_dvl` int(11) NOT NULL,
  `fecha_dvl` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `descuento_dvl` decimal(10,2) NOT NULL,
  `total_dvl` decimal(12,2) NOT NULL,
  `moneda_dvl` varchar(10) NOT NULL,
  `tipo_cambio_dvl` decimal(10,4) NOT NULL,
  `orden_dvl` varchar(100) NOT NULL,
  `motivo_dvl` varchar(100) NOT NULL,
  `almacen_dvl` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `empresa`
--

CREATE TABLE `empresa` (
  `id_emp` int(11) NOT NULL,
  `nombre_emp` varchar(100) NOT NULL,
  `sigla_emp` varchar(30) NOT NULL,
  `nit_emp` varchar(50) NOT NULL,
  `precio_emp` int(11) DEFAULT NULL,
  `direccion_emp` varchar(50) NOT NULL,
  `telefono_emp` varchar(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `empresa_prov`
--

CREATE TABLE `empresa_prov` (
  `id_empp` int(11) NOT NULL,
  `sigla_empp` varchar(50) NOT NULL,
  `nombre_empp` varchar(100) NOT NULL,
  `nit_empp` varchar(50) NOT NULL,
  `direccion_empp` varchar(50) NOT NULL,
  `telefono_empp` varchar(20) NOT NULL,
  `descuento_empp` decimal(10,2) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `ingreso`
--

CREATE TABLE `ingreso` (
  `id_ing` int(11) NOT NULL,
  `numero_ing` int(11) NOT NULL,
  `fecha_ing` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `fk_id_usua_ing` int(11) NOT NULL,
  `observacion_ing` varchar(200) NOT NULL,
  `almacen_ing` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `ing_prod`
--

CREATE TABLE `ing_prod` (
  `id_igpd` int(11) NOT NULL,
  `fk_id_ing_igpd` int(11) NOT NULL,
  `fk_id_prod_igpd` int(11) NOT NULL,
  `codigo_igpd` varchar(100) NOT NULL,
  `cantidad_igpd` int(11) NOT NULL,
  `estado_igpd` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `inventario`
--

CREATE TABLE `inventario` (
  `id_inv` int(11) NOT NULL,
  `fk_id_prod_inv` int(11) NOT NULL,
  `cantidad_inv` int(11) NOT NULL,
  `cost_uni_inv` decimal(10,2) NOT NULL,
  `descripcion_inv` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `inventario_arce`
--

CREATE TABLE `inventario_arce` (
  `id_inv` int(11) NOT NULL,
  `fk_id_prod_inv` int(11) NOT NULL,
  `cantidad_inv` int(11) NOT NULL,
  `cost_uni_inv` decimal(10,2) NOT NULL,
  `descripcion_inv` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `lista_precios`
--

CREATE TABLE `lista_precios` (
  `id` int(11) NOT NULL,
  `modelo` varchar(100) NOT NULL,
  `precio` decimal(10,2) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `marca`
--

CREATE TABLE `marca` (
  `id_mrc` int(11) NOT NULL,
  `nombre_mrc` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `mdf_proforma`
--

CREATE TABLE `mdf_proforma` (
  `id_mprof` int(11) NOT NULL,
  `id_prof_mprof` int(11) NOT NULL,
  `numero_mprof` int(11) NOT NULL,
  `fecha_mprof` date NOT NULL DEFAULT current_timestamp(),
  `fk_id_clte_mprof` int(11) NOT NULL,
  `fk_id_usua_mprof` int(11) NOT NULL,
  `tpo_valido_mprof` varchar(100) NOT NULL,
  `cond_pago_mprof` varchar(500) NOT NULL,
  `tpo_entrega_mprof` varchar(500) NOT NULL,
  `observacion_mprof` varchar(500) NOT NULL,
  `descuento_mprof` decimal(10,2) NOT NULL,
  `total_mprof` decimal(12,2) NOT NULL,
  `moneda_mprof` varchar(10) NOT NULL,
  `tipo_cambio_mprof` decimal(10,4) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `mdf_prof_prod`
--

CREATE TABLE `mdf_prof_prod` (
  `id_mpfpd` int(11) NOT NULL,
  `fk_id_mprof_mpfpd` int(11) NOT NULL,
  `fk_id_prod_mpfpd` int(11) NOT NULL,
  `cantidad_mpfpd` int(11) NOT NULL,
  `cost_uni_mpfpd` decimal(10,2) NOT NULL,
  `tmp_entrega_mpfpd` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `mrc_ctgr`
--

CREATE TABLE `mrc_ctgr` (
  `id_mccr` int(11) NOT NULL,
  `fk_id_mrc_mccr` int(11) NOT NULL,
  `fk_id_ctgr_mccr` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `nota_entrega`
--

CREATE TABLE `nota_entrega` (
  `id_ne` int(11) NOT NULL,
  `numero_ne` int(11) NOT NULL,
  `fk_id_prof_ne` int(11) NOT NULL,
  `fk_id_oc_ne` int(11) NOT NULL,
  `fk_id_clte_ne` int(11) NOT NULL,
  `fk_id_usua_ne` int(11) NOT NULL,
  `fecha_ne` date NOT NULL DEFAULT current_timestamp(),
  `descuento_ne` decimal(10,2) NOT NULL,
  `total_ne` decimal(12,2) NOT NULL,
  `moneda_ne` varchar(10) NOT NULL,
  `tipo_cambio_ne` decimal(10,4) NOT NULL,
  `orden_ne` varchar(100) NOT NULL,
  `observacion_ne` varchar(500) NOT NULL,
  `estado_ne` int(11) NOT NULL,
  `almacen_ne` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `nte_prod`
--

CREATE TABLE `nte_prod` (
  `id_nepd` int(11) NOT NULL,
  `fk_id_ne_nepd` int(11) NOT NULL,
  `fk_id_prod_nepd` int(11) NOT NULL,
  `fk_id_ocpd_nepd` int(11) NOT NULL,
  `cantidad_nepd` int(11) NOT NULL,
  `cost_uni_nepd` decimal(10,2) NOT NULL,
  `estado_nepd` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `oc_prod`
--

CREATE TABLE `oc_prod` (
  `id_ocpd` int(11) NOT NULL,
  `fk_id_oc_ocpd` int(11) NOT NULL,
  `fk_id_prod_ocpd` int(11) NOT NULL,
  `codigo_ocpd` varchar(50) NOT NULL,
  `cantidad_ocpd` int(11) NOT NULL,
  `cost_uni_ocpd` decimal(10,2) NOT NULL,
  `estado_ocpd` tinyint(1) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `orden_compra`
--

CREATE TABLE `orden_compra` (
  `id_oc` int(11) NOT NULL,
  `numero_oc` int(11) NOT NULL,
  `fk_id_prof_oc` int(11) NOT NULL,
  `fk_id_clte_oc` int(11) NOT NULL,
  `fk_id_usua_oc` int(11) NOT NULL,
  `fecha_oc` date NOT NULL,
  `descuento_oc` decimal(10,2) NOT NULL,
  `total_oc` decimal(12,2) NOT NULL,
  `moneda_oc` varchar(10) NOT NULL,
  `tipo_cambio_oc` decimal(10,4) NOT NULL,
  `orden_oc` varchar(100) NOT NULL,
  `observacion_oc` varchar(500) NOT NULL,
  `estado_oc` tinyint(1) NOT NULL,
  `almacen_oc` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `producto`
--

CREATE TABLE `producto` (
  `id_prod` int(11) NOT NULL,
  `codigo_smc_prod` varchar(30) NOT NULL,
  `codigo_prod` varchar(30) NOT NULL,
  `fk_id_mrc_prod` int(11) NOT NULL,
  `fk_id_ctgr_prod` int(11) NOT NULL,
  `nombre_prod` varchar(500) NOT NULL,
  `descripcion_prod` varchar(8000) NOT NULL,
  `imagen_prod` varchar(100) NOT NULL,
  `catalogo_prod` varchar(250) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `proforma`
--

CREATE TABLE `proforma` (
  `id_prof` int(11) NOT NULL,
  `numero_prof` int(11) NOT NULL,
  `fecha_prof` date NOT NULL,
  `fk_id_clte_prof` int(11) NOT NULL,
  `fk_id_usua_prof` int(11) NOT NULL,
  `tpo_valido_prof` varchar(100) NOT NULL,
  `cond_pago_prof` varchar(500) NOT NULL,
  `tpo_entrega_prof` varchar(500) NOT NULL,
  `observacion_prof` varchar(500) NOT NULL,
  `descuento_prof` decimal(10,2) NOT NULL,
  `total_prof` decimal(12,2) NOT NULL,
  `moneda_prof` varchar(10) NOT NULL,
  `tipo_cambio_prof` decimal(10,4) NOT NULL,
  `estado_prof` tinyint(1) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `prof_prod`
--

CREATE TABLE `prof_prod` (
  `id_pfpd` int(11) NOT NULL,
  `fk_id_prof_pfpd` int(11) NOT NULL,
  `fk_id_prod_pfpd` int(11) NOT NULL,
  `cantidad_pfpd` int(11) NOT NULL,
  `cost_uni_pfpd` decimal(10,2) NOT NULL,
  `tmp_entrega_pfpd` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `proveedor`
--

CREATE TABLE `proveedor` (
  `id_prov` int(11) NOT NULL,
  `nombre_prov` varchar(30) NOT NULL,
  `apellido_prov` varchar(30) NOT NULL,
  `celular_prov` varchar(20) NOT NULL,
  `fk_id_empp_prov` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `rmd_prod`
--

CREATE TABLE `rmd_prod` (
  `id_rdpd` int(11) NOT NULL,
  `fk_id_rmd_rdpd` int(11) NOT NULL,
  `fk_id_prod_rdpd` int(11) NOT NULL,
  `codigo_rdpd` varchar(100) NOT NULL,
  `cantidad_rdpd` int(11) NOT NULL,
  `estado_rdpd` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `usuario`
--

CREATE TABLE `usuario` (
  `id_usua` int(11) NOT NULL,
  `nombre_usua` varchar(100) NOT NULL,
  `apellido_usua` varchar(100) NOT NULL,
  `pass_usua` varchar(100) NOT NULL,
  `email_usua` varchar(254) NOT NULL,
  `ci_usua` varchar(20) NOT NULL,
  `direccion_usua` varchar(255) NOT NULL,
  `celular_usua` varchar(20) NOT NULL,
  `rol_usua` varchar(30) NOT NULL,
  `activo_usua` tinyint(1) NOT NULL DEFAULT 1,
  `ultimo_acceso` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `venta`
--

CREATE TABLE `venta` (
  `id_vnt` int(11) NOT NULL,
  `almacen_vnt` int(11) NOT NULL,
  `ciudad_vnt` varchar(30) NOT NULL,
  `fecha_vnt` date NOT NULL DEFAULT current_timestamp(),
  `estado_factura_vnt` tinyint(1) NOT NULL,
  `fecha_factura_vnt` date NOT NULL,
  `factura_vnt` int(11) DEFAULT NULL,
  `fk_id_ne_vnt` int(11) NOT NULL,
  `fk_id_usua_vnt` int(11) NOT NULL,
  `fk_id_clte_vnt` int(11) NOT NULL,
  `descuento_vnt` decimal(10,2) NOT NULL,
  `total_vnt` decimal(12,2) NOT NULL,
  `tipo_pago_vnt` varchar(20) NOT NULL,
  `tiempo_credito_vnt` int(11) NOT NULL,
  `observacion_vnt` varchar(100) NOT NULL,
  `estado_vnt` varchar(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `vnt_prod`
--

CREATE TABLE `vnt_prod` (
  `id_vtpd` int(11) NOT NULL,
  `fk_id_vnt_vtpd` int(11) NOT NULL,
  `fk_id_prod_vtpd` int(11) NOT NULL,
  `codigo_vtpd` varchar(30) NOT NULL,
  `cantidad_vtpd` int(11) NOT NULL,
  `cost_uni_vtpd` decimal(10,2) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `armado`
--
ALTER TABLE `armado`
  ADD PRIMARY KEY (`id_rmd`),
  ADD KEY `fk_id_usua_rmd` (`fk_id_usua_rmd`);

--
-- Indices de la tabla `categoria`
--
ALTER TABLE `categoria`
  ADD PRIMARY KEY (`id_ctgr`);

--
-- Indices de la tabla `cliente`
--
ALTER TABLE `cliente`
  ADD PRIMARY KEY (`id_clte`),
  ADD KEY `fk_id_emp_clte` (`fk_id_emp_clte`);

--
-- Indices de la tabla `cmp_prod`
--
ALTER TABLE `cmp_prod`
  ADD PRIMARY KEY (`id_cppd`),
  ADD KEY `fk_id_cmp_cppd` (`fk_id_cmp_cppd`),
  ADD KEY `fk_id_prod_cppd` (`fk_id_prod_cppd`);

--
-- Indices de la tabla `compra`
--
ALTER TABLE `compra`
  ADD PRIMARY KEY (`id_cmp`),
  ADD KEY `fk_id_prov_cmp` (`fk_id_prov_cmp`),
  ADD KEY `fk_id_usua_cmp` (`fk_id_usua_cmp`);

--
-- Indices de la tabla `devolucion`
--
ALTER TABLE `devolucion`
  ADD PRIMARY KEY (`id_dvl`),
  ADD KEY `fk_id_ne_dvl` (`fk_id_ne_dvl`),
  ADD KEY `fk_id_clte_dvl` (`fk_id_clte_dvl`),
  ADD KEY `fk_id_usua_dvl` (`fk_id_usua_dvl`);

--
-- Indices de la tabla `empresa`
--
ALTER TABLE `empresa`
  ADD PRIMARY KEY (`id_emp`);

--
-- Indices de la tabla `empresa_prov`
--
ALTER TABLE `empresa_prov`
  ADD PRIMARY KEY (`id_empp`);

--
-- Indices de la tabla `ingreso`
--
ALTER TABLE `ingreso`
  ADD PRIMARY KEY (`id_ing`),
  ADD KEY `fk_id_usua_ing` (`fk_id_usua_ing`);

--
-- Indices de la tabla `ing_prod`
--
ALTER TABLE `ing_prod`
  ADD PRIMARY KEY (`id_igpd`),
  ADD KEY `fk_id_ing_igpd` (`fk_id_ing_igpd`),
  ADD KEY `fk_id_prod_igpd` (`fk_id_prod_igpd`);

--
-- Indices de la tabla `inventario`
--
ALTER TABLE `inventario`
  ADD PRIMARY KEY (`id_inv`),
  ADD KEY `fk_id_prod_inv` (`fk_id_prod_inv`);

--
-- Indices de la tabla `inventario_arce`
--
ALTER TABLE `inventario_arce`
  ADD PRIMARY KEY (`id_inv`),
  ADD KEY `fk_id_prod_inv` (`fk_id_prod_inv`);

--
-- Indices de la tabla `lista_precios`
--
ALTER TABLE `lista_precios`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `marca`
--
ALTER TABLE `marca`
  ADD PRIMARY KEY (`id_mrc`);

--
-- Indices de la tabla `mdf_proforma`
--
ALTER TABLE `mdf_proforma`
  ADD PRIMARY KEY (`id_mprof`),
  ADD KEY `fk_id_clte_mprof` (`fk_id_clte_mprof`),
  ADD KEY `fk_id_usua_mprof` (`fk_id_usua_mprof`);

--
-- Indices de la tabla `mdf_prof_prod`
--
ALTER TABLE `mdf_prof_prod`
  ADD PRIMARY KEY (`id_mpfpd`),
  ADD KEY `fk_id_prof_mpfpd` (`fk_id_mprof_mpfpd`),
  ADD KEY `fk_id_prod_mpfpd` (`fk_id_prod_mpfpd`);

--
-- Indices de la tabla `mrc_ctgr`
--
ALTER TABLE `mrc_ctgr`
  ADD PRIMARY KEY (`id_mccr`),
  ADD KEY `fk_id_ctgr_mccr` (`fk_id_ctgr_mccr`),
  ADD KEY `fk_id_mrc_mccr` (`fk_id_mrc_mccr`);

--
-- Indices de la tabla `nota_entrega`
--
ALTER TABLE `nota_entrega`
  ADD PRIMARY KEY (`id_ne`),
  ADD KEY `fk_id_prof_ne` (`fk_id_prof_ne`),
  ADD KEY `fk_id_usua_ne` (`fk_id_usua_ne`),
  ADD KEY `fk_id_oc_ne` (`fk_id_oc_ne`),
  ADD KEY `fk_id_clte_ne` (`fk_id_clte_ne`);

--
-- Indices de la tabla `nte_prod`
--
ALTER TABLE `nte_prod`
  ADD PRIMARY KEY (`id_nepd`),
  ADD KEY `fk_id_ne_nepd` (`fk_id_ne_nepd`),
  ADD KEY `fk_id_prod_nepd` (`fk_id_prod_nepd`),
  ADD KEY `fk_id_ocpd_nepd` (`fk_id_ocpd_nepd`);

--
-- Indices de la tabla `oc_prod`
--
ALTER TABLE `oc_prod`
  ADD PRIMARY KEY (`id_ocpd`),
  ADD KEY `fk_id_oc_ocpd` (`fk_id_oc_ocpd`),
  ADD KEY `fk_id_prod_ocpd` (`fk_id_prod_ocpd`);

--
-- Indices de la tabla `orden_compra`
--
ALTER TABLE `orden_compra`
  ADD PRIMARY KEY (`id_oc`),
  ADD KEY `fk_id_prof_oc` (`fk_id_prof_oc`),
  ADD KEY `fk_id_clte_oc` (`fk_id_clte_oc`),
  ADD KEY `fk_id_usua_oc` (`fk_id_usua_oc`);

--
-- Indices de la tabla `producto`
--
ALTER TABLE `producto`
  ADD PRIMARY KEY (`id_prod`),
  ADD KEY `marca_prod` (`fk_id_mrc_prod`),
  ADD KEY `fk_id_ctgr_prod` (`fk_id_ctgr_prod`);

--
-- Indices de la tabla `proforma`
--
ALTER TABLE `proforma`
  ADD PRIMARY KEY (`id_prof`),
  ADD KEY `fk_id_clte_prof` (`fk_id_clte_prof`,`fk_id_usua_prof`),
  ADD KEY `fk_id_usua_prof` (`fk_id_usua_prof`);

--
-- Indices de la tabla `prof_prod`
--
ALTER TABLE `prof_prod`
  ADD PRIMARY KEY (`id_pfpd`),
  ADD KEY `fk_id_prof_pfpd` (`fk_id_prod_pfpd`),
  ADD KEY `fk_id_prof_pfpd_2` (`fk_id_prof_pfpd`);

--
-- Indices de la tabla `proveedor`
--
ALTER TABLE `proveedor`
  ADD PRIMARY KEY (`id_prov`),
  ADD KEY `fk_id_emp_prov` (`fk_id_empp_prov`);

--
-- Indices de la tabla `rmd_prod`
--
ALTER TABLE `rmd_prod`
  ADD PRIMARY KEY (`id_rdpd`),
  ADD KEY `fk_id_rmd_rdpd` (`fk_id_rmd_rdpd`),
  ADD KEY `fk_id_prod_rdpd` (`fk_id_prod_rdpd`);

--
-- Indices de la tabla `usuario`
--
ALTER TABLE `usuario`
  ADD PRIMARY KEY (`id_usua`),
  ADD UNIQUE KEY `email_usua` (`email_usua`),
  ADD KEY `idx_email_usua` (`email_usua`);

--
-- Indices de la tabla `venta`
--
ALTER TABLE `venta`
  ADD PRIMARY KEY (`id_vnt`),
  ADD KEY `fk_id_clte_vnt` (`fk_id_usua_vnt`),
  ADD KEY `fk_id_prof_vnt` (`fk_id_ne_vnt`),
  ADD KEY `fk_id_clte_vnt_2` (`fk_id_clte_vnt`);

--
-- Indices de la tabla `vnt_prod`
--
ALTER TABLE `vnt_prod`
  ADD PRIMARY KEY (`id_vtpd`),
  ADD KEY `fk_id_vnt_vtpd` (`fk_id_vnt_vtpd`),
  ADD KEY `fk_id_prod_vtpd` (`fk_id_prod_vtpd`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `armado`
--
ALTER TABLE `armado`
  MODIFY `id_rmd` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `categoria`
--
ALTER TABLE `categoria`
  MODIFY `id_ctgr` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `cliente`
--
ALTER TABLE `cliente`
  MODIFY `id_clte` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `cmp_prod`
--
ALTER TABLE `cmp_prod`
  MODIFY `id_cppd` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `compra`
--
ALTER TABLE `compra`
  MODIFY `id_cmp` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `devolucion`
--
ALTER TABLE `devolucion`
  MODIFY `id_dvl` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `empresa`
--
ALTER TABLE `empresa`
  MODIFY `id_emp` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `empresa_prov`
--
ALTER TABLE `empresa_prov`
  MODIFY `id_empp` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `ingreso`
--
ALTER TABLE `ingreso`
  MODIFY `id_ing` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `ing_prod`
--
ALTER TABLE `ing_prod`
  MODIFY `id_igpd` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `inventario`
--
ALTER TABLE `inventario`
  MODIFY `id_inv` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `inventario_arce`
--
ALTER TABLE `inventario_arce`
  MODIFY `id_inv` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `lista_precios`
--
ALTER TABLE `lista_precios`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `marca`
--
ALTER TABLE `marca`
  MODIFY `id_mrc` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `mdf_proforma`
--
ALTER TABLE `mdf_proforma`
  MODIFY `id_mprof` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `mdf_prof_prod`
--
ALTER TABLE `mdf_prof_prod`
  MODIFY `id_mpfpd` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `mrc_ctgr`
--
ALTER TABLE `mrc_ctgr`
  MODIFY `id_mccr` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `nota_entrega`
--
ALTER TABLE `nota_entrega`
  MODIFY `id_ne` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `nte_prod`
--
ALTER TABLE `nte_prod`
  MODIFY `id_nepd` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `oc_prod`
--
ALTER TABLE `oc_prod`
  MODIFY `id_ocpd` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `orden_compra`
--
ALTER TABLE `orden_compra`
  MODIFY `id_oc` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `producto`
--
ALTER TABLE `producto`
  MODIFY `id_prod` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `proforma`
--
ALTER TABLE `proforma`
  MODIFY `id_prof` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `prof_prod`
--
ALTER TABLE `prof_prod`
  MODIFY `id_pfpd` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `proveedor`
--
ALTER TABLE `proveedor`
  MODIFY `id_prov` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `rmd_prod`
--
ALTER TABLE `rmd_prod`
  MODIFY `id_rdpd` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `usuario`
--
ALTER TABLE `usuario`
  MODIFY `id_usua` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `venta`
--
ALTER TABLE `venta`
  MODIFY `id_vnt` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `vnt_prod`
--
ALTER TABLE `vnt_prod`
  MODIFY `id_vtpd` int(11) NOT NULL AUTO_INCREMENT;

--
-- Restricciones para tablas volcadas
--

--
-- Filtros para la tabla `armado`
--
ALTER TABLE `armado`
  ADD CONSTRAINT `armado_ibfk_1` FOREIGN KEY (`fk_id_usua_rmd`) REFERENCES `usuario` (`id_usua`) ON UPDATE CASCADE;

--
-- Filtros para la tabla `cliente`
--
ALTER TABLE `cliente`
  ADD CONSTRAINT `cliente_ibfk_1` FOREIGN KEY (`fk_id_emp_clte`) REFERENCES `empresa` (`id_emp`) ON UPDATE CASCADE;

--
-- Filtros para la tabla `cmp_prod`
--
ALTER TABLE `cmp_prod`
  ADD CONSTRAINT `cmp_prod_ibfk_1` FOREIGN KEY (`fk_id_cmp_cppd`) REFERENCES `compra` (`id_cmp`) ON UPDATE CASCADE,
  ADD CONSTRAINT `cmp_prod_ibfk_2` FOREIGN KEY (`fk_id_prod_cppd`) REFERENCES `producto` (`id_prod`) ON UPDATE CASCADE;

--
-- Filtros para la tabla `compra`
--
ALTER TABLE `compra`
  ADD CONSTRAINT `compra_ibfk_1` FOREIGN KEY (`fk_id_prov_cmp`) REFERENCES `proveedor` (`id_prov`) ON UPDATE CASCADE,
  ADD CONSTRAINT `compra_ibfk_2` FOREIGN KEY (`fk_id_usua_cmp`) REFERENCES `usuario` (`id_usua`) ON UPDATE CASCADE;

--
-- Filtros para la tabla `devolucion`
--
ALTER TABLE `devolucion`
  ADD CONSTRAINT `devolucion_ibfk_1` FOREIGN KEY (`fk_id_clte_dvl`) REFERENCES `cliente` (`id_clte`) ON UPDATE CASCADE,
  ADD CONSTRAINT `devolucion_ibfk_2` FOREIGN KEY (`fk_id_usua_dvl`) REFERENCES `usuario` (`id_usua`) ON UPDATE CASCADE,
  ADD CONSTRAINT `devolucion_ibfk_3` FOREIGN KEY (`fk_id_ne_dvl`) REFERENCES `nota_entrega` (`id_ne`) ON UPDATE CASCADE;

--
-- Filtros para la tabla `ingreso`
--
ALTER TABLE `ingreso`
  ADD CONSTRAINT `ingreso_ibfk_1` FOREIGN KEY (`fk_id_usua_ing`) REFERENCES `usuario` (`id_usua`) ON UPDATE CASCADE;

--
-- Filtros para la tabla `ing_prod`
--
ALTER TABLE `ing_prod`
  ADD CONSTRAINT `ing_prod_ibfk_1` FOREIGN KEY (`fk_id_ing_igpd`) REFERENCES `ingreso` (`id_ing`) ON UPDATE CASCADE,
  ADD CONSTRAINT `ing_prod_ibfk_2` FOREIGN KEY (`fk_id_prod_igpd`) REFERENCES `producto` (`id_prod`) ON UPDATE CASCADE;

--
-- Filtros para la tabla `inventario`
--
ALTER TABLE `inventario`
  ADD CONSTRAINT `inventario_ibfk_1` FOREIGN KEY (`fk_id_prod_inv`) REFERENCES `producto` (`id_prod`) ON UPDATE CASCADE;

--
-- Filtros para la tabla `inventario_arce`
--
ALTER TABLE `inventario_arce`
  ADD CONSTRAINT `inventario_arce_ibfk_1` FOREIGN KEY (`fk_id_prod_inv`) REFERENCES `producto` (`id_prod`) ON UPDATE CASCADE;

--
-- Filtros para la tabla `mdf_proforma`
--
ALTER TABLE `mdf_proforma`
  ADD CONSTRAINT `mdf_proforma_ibfk_1` FOREIGN KEY (`fk_id_clte_mprof`) REFERENCES `cliente` (`id_clte`) ON UPDATE CASCADE,
  ADD CONSTRAINT `mdf_proforma_ibfk_2` FOREIGN KEY (`fk_id_usua_mprof`) REFERENCES `usuario` (`id_usua`) ON UPDATE CASCADE;

--
-- Filtros para la tabla `mdf_prof_prod`
--
ALTER TABLE `mdf_prof_prod`
  ADD CONSTRAINT `mdf_prof_prod_ibfk_1` FOREIGN KEY (`fk_id_mprof_mpfpd`) REFERENCES `mdf_proforma` (`id_mprof`) ON UPDATE CASCADE,
  ADD CONSTRAINT `mdf_prof_prod_ibfk_2` FOREIGN KEY (`fk_id_prod_mpfpd`) REFERENCES `producto` (`id_prod`) ON UPDATE CASCADE;

--
-- Filtros para la tabla `mrc_ctgr`
--
ALTER TABLE `mrc_ctgr`
  ADD CONSTRAINT `mrc_ctgr_ibfk_1` FOREIGN KEY (`fk_id_mrc_mccr`) REFERENCES `marca` (`id_mrc`) ON UPDATE CASCADE,
  ADD CONSTRAINT `mrc_ctgr_ibfk_2` FOREIGN KEY (`fk_id_ctgr_mccr`) REFERENCES `categoria` (`id_ctgr`) ON UPDATE CASCADE;

--
-- Filtros para la tabla `nota_entrega`
--
ALTER TABLE `nota_entrega`
  ADD CONSTRAINT `nota_entrega_ibfk_1` FOREIGN KEY (`fk_id_prof_ne`) REFERENCES `proforma` (`id_prof`) ON UPDATE CASCADE,
  ADD CONSTRAINT `nota_entrega_ibfk_2` FOREIGN KEY (`fk_id_usua_ne`) REFERENCES `usuario` (`id_usua`) ON UPDATE CASCADE,
  ADD CONSTRAINT `nota_entrega_ibfk_3` FOREIGN KEY (`fk_id_oc_ne`) REFERENCES `orden_compra` (`id_oc`) ON UPDATE CASCADE,
  ADD CONSTRAINT `nota_entrega_ibfk_4` FOREIGN KEY (`fk_id_clte_ne`) REFERENCES `cliente` (`id_clte`) ON UPDATE CASCADE;

--
-- Filtros para la tabla `nte_prod`
--
ALTER TABLE `nte_prod`
  ADD CONSTRAINT `nte_prod_ibfk_1` FOREIGN KEY (`fk_id_ne_nepd`) REFERENCES `nota_entrega` (`id_ne`) ON UPDATE CASCADE,
  ADD CONSTRAINT `nte_prod_ibfk_2` FOREIGN KEY (`fk_id_prod_nepd`) REFERENCES `producto` (`id_prod`) ON UPDATE CASCADE,
  ADD CONSTRAINT `nte_prod_ibfk_3` FOREIGN KEY (`fk_id_ocpd_nepd`) REFERENCES `oc_prod` (`id_ocpd`) ON UPDATE CASCADE;

--
-- Filtros para la tabla `oc_prod`
--
ALTER TABLE `oc_prod`
  ADD CONSTRAINT `oc_prod_ibfk_1` FOREIGN KEY (`fk_id_oc_ocpd`) REFERENCES `orden_compra` (`id_oc`) ON UPDATE CASCADE,
  ADD CONSTRAINT `oc_prod_ibfk_2` FOREIGN KEY (`fk_id_prod_ocpd`) REFERENCES `producto` (`id_prod`) ON UPDATE CASCADE;

--
-- Filtros para la tabla `orden_compra`
--
ALTER TABLE `orden_compra`
  ADD CONSTRAINT `orden_compra_ibfk_1` FOREIGN KEY (`fk_id_prof_oc`) REFERENCES `proforma` (`id_prof`) ON UPDATE CASCADE,
  ADD CONSTRAINT `orden_compra_ibfk_2` FOREIGN KEY (`fk_id_clte_oc`) REFERENCES `cliente` (`id_clte`) ON UPDATE CASCADE,
  ADD CONSTRAINT `orden_compra_ibfk_3` FOREIGN KEY (`fk_id_usua_oc`) REFERENCES `usuario` (`id_usua`) ON UPDATE CASCADE;

--
-- Filtros para la tabla `producto`
--
ALTER TABLE `producto`
  ADD CONSTRAINT `producto_ibfk_1` FOREIGN KEY (`fk_id_mrc_prod`) REFERENCES `marca` (`id_mrc`) ON UPDATE CASCADE,
  ADD CONSTRAINT `producto_ibfk_2` FOREIGN KEY (`fk_id_ctgr_prod`) REFERENCES `categoria` (`id_ctgr`) ON UPDATE CASCADE;

--
-- Filtros para la tabla `proforma`
--
ALTER TABLE `proforma`
  ADD CONSTRAINT `proforma_ibfk_1` FOREIGN KEY (`fk_id_usua_prof`) REFERENCES `usuario` (`id_usua`) ON UPDATE CASCADE,
  ADD CONSTRAINT `proforma_ibfk_2` FOREIGN KEY (`fk_id_clte_prof`) REFERENCES `cliente` (`id_clte`) ON UPDATE CASCADE;

--
-- Filtros para la tabla `prof_prod`
--
ALTER TABLE `prof_prod`
  ADD CONSTRAINT `prof_prod_ibfk_1` FOREIGN KEY (`fk_id_prof_pfpd`) REFERENCES `proforma` (`id_prof`) ON UPDATE CASCADE,
  ADD CONSTRAINT `prof_prod_ibfk_2` FOREIGN KEY (`fk_id_prod_pfpd`) REFERENCES `producto` (`id_prod`) ON UPDATE CASCADE;

--
-- Filtros para la tabla `proveedor`
--
ALTER TABLE `proveedor`
  ADD CONSTRAINT `proveedor_ibfk_1` FOREIGN KEY (`fk_id_empp_prov`) REFERENCES `empresa_prov` (`id_empp`) ON UPDATE CASCADE;

--
-- Filtros para la tabla `rmd_prod`
--
ALTER TABLE `rmd_prod`
  ADD CONSTRAINT `rmd_prod_ibfk_1` FOREIGN KEY (`fk_id_prod_rdpd`) REFERENCES `producto` (`id_prod`) ON UPDATE CASCADE,
  ADD CONSTRAINT `rmd_prod_ibfk_2` FOREIGN KEY (`fk_id_rmd_rdpd`) REFERENCES `armado` (`id_rmd`) ON UPDATE CASCADE;

--
-- Filtros para la tabla `venta`
--
ALTER TABLE `venta`
  ADD CONSTRAINT `venta_ibfk_1` FOREIGN KEY (`fk_id_ne_vnt`) REFERENCES `nota_entrega` (`id_ne`) ON UPDATE CASCADE,
  ADD CONSTRAINT `venta_ibfk_2` FOREIGN KEY (`fk_id_clte_vnt`) REFERENCES `cliente` (`id_clte`) ON UPDATE CASCADE,
  ADD CONSTRAINT `venta_ibfk_3` FOREIGN KEY (`fk_id_usua_vnt`) REFERENCES `usuario` (`id_usua`) ON UPDATE CASCADE;

--
-- Filtros para la tabla `vnt_prod`
--
ALTER TABLE `vnt_prod`
  ADD CONSTRAINT `vnt_prod_ibfk_1` FOREIGN KEY (`fk_id_vnt_vtpd`) REFERENCES `venta` (`id_vnt`) ON UPDATE CASCADE,
  ADD CONSTRAINT `vnt_prod_ibfk_2` FOREIGN KEY (`fk_id_prod_vtpd`) REFERENCES `producto` (`id_prod`) ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
