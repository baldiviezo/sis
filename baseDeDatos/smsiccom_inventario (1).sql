-- phpMyAdmin SQL Dump
-- version 5.2.0
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1
-- Tiempo de generación: 19-06-2023 a las 23:03:21
-- Versión del servidor: 10.4.24-MariaDB
-- Versión de PHP: 8.1.6

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de datos: `smsiccom_inventario`
--

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `categoria`
--

CREATE TABLE `categoria` (
  `id_ctgr` int(11) NOT NULL,
  `nombre_ctgr` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Volcado de datos para la tabla `categoria`
--

INSERT INTO `categoria` (`id_ctgr`, `nombre_ctgr`) VALUES
(11, 'CABLE'),
(12, 'FINALES DE CARRERA'),
(13, 'CONECTORES'),
(14, 'FUENTES'),
(15, 'PROGRAMADOR'),
(17, 'INTERFAZ');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `cliente`
--

CREATE TABLE `cliente` (
  `id_clte` int(11) NOT NULL,
  `nombre_clte` varchar(30) NOT NULL,
  `apellido_clte` varchar(30) NOT NULL,
  `email_clte` varchar(50) NOT NULL,
  `direccion_clte` varchar(50) NOT NULL,
  `celular_clte` int(11) NOT NULL,
  `fk_id_emp_clte` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Volcado de datos para la tabla `cliente`
--

INSERT INTO `cliente` (`id_clte`, `nombre_clte`, `apellido_clte`, `email_clte`, `direccion_clte`, `celular_clte`, `fk_id_emp_clte`) VALUES
(62, 'Abel', 'Chirino Espinal', '', '', 7654452, 11),
(64, 'Kevin', 'Ortiz Flores', '', '', 7646546, 62),
(72, 'Carlos David', 'Mamani Nina', '', '', 76548982, 77),
(75, '', '', '', '', 0, 75),
(76, 'Jhonny', 'Condori', 'jhony.condori@venado.com.bo', 'ciudadela', 75811234, 62),
(77, '', '', '', '', 0, 1),
(83, '', '', '', '', 0, 62),
(84, '', '', '', '', 0, 11),
(87, 'Pedro', 'Martinez', 'pedro@martines.com', 'Av. Avaroa', 76548234, 1),
(89, '', '', '', '', 0, 84);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `cmp_prod`
--

CREATE TABLE `cmp_prod` (
  `id_cppd` int(11) NOT NULL,
  `fk_id_cmp_cppd` int(11) NOT NULL,
  `fk_id_prod_cppd` int(11) NOT NULL,
  `cantidad_cppd` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `compra`
--

CREATE TABLE `compra` (
  `id_cmp` int(11) NOT NULL,
  `fecha_cmp` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `factura_cmp` varchar(30) NOT NULL,
  `fk_id_prov_cmp` int(11) NOT NULL,
  `descripcion_cmp` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `empresa`
--

CREATE TABLE `empresa` (
  `id_emp` int(11) NOT NULL,
  `sigla_emp` varchar(50) NOT NULL,
  `nombre_emp` varchar(100) NOT NULL,
  `direccion_emp` varchar(50) NOT NULL,
  `telefono_emp` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Volcado de datos para la tabla `empresa`
--

INSERT INTO `empresa` (`id_emp`, `sigla_emp`, `nombre_emp`, `direccion_emp`, `telefono_emp`) VALUES
(1, 'EMBOL', 'EMBOL S.A.', 'Rio Seco', 2278981),
(11, 'YPFB-LP', 'Yacimientos Petroliferos Fiscales Bolivianos S.A.', 'Av. Camacho ', 22787149),
(62, 'VENADO', 'VENADO S.A.', 'C. Teniente Oquendo', 24598798),
(75, 'CBN', 'Cerveceria Boliviana Nacional', 'Autopista', 2278965),
(77, 'Ninguna', '', '', 0),
(84, 'DEGMA', 'Degma', 'EL Alto', 2278965);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `empresa_prov`
--

CREATE TABLE `empresa_prov` (
  `id_empp` int(11) NOT NULL,
  `sigla_empp` varchar(50) NOT NULL,
  `nombre_empp` varchar(100) NOT NULL,
  `direccion_empp` varchar(50) NOT NULL,
  `telefono_empp` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Volcado de datos para la tabla `empresa_prov`
--

INSERT INTO `empresa_prov` (`id_empp`, `sigla_empp`, `nombre_empp`, `direccion_empp`, `telefono_empp`) VALUES
(1, 'SIEMENS', 'Siemens', 'ALEMANIA', 43451687),
(2, 'smc', 'Smc', 'japon', 534636346);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `inventario`
--

CREATE TABLE `inventario` (
  `id_inv` int(11) NOT NULL,
  `fk_id_prod_inv` int(11) NOT NULL,
  `cantidad_inv` int(11) NOT NULL,
  `cost_uni_inv` float NOT NULL,
  `descripcion_inv` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Volcado de datos para la tabla `inventario`
--

INSERT INTO `inventario` (`id_inv`, `fk_id_prod_inv`, `cantidad_inv`, `cost_uni_inv`, `descripcion_inv`) VALUES
(3, 124, 100, 0, ''),
(4, 123, 100, 0, ''),
(5, 126, 1, 0, ''),
(6, 125, 2, 0, ''),
(7, 127, 1, 0, ''),
(8, 128, 1, 0, ''),
(9, 129, 1, 0, ''),
(10, 130, 1, 0, ''),
(11, 131, 2, 0, ''),
(12, 132, 5, 0, ''),
(13, 133, 4, 0, ''),
(14, 134, 12, 0, ''),
(15, 135, 2, 0, ''),
(16, 136, 12, 0, ''),
(17, 137, 2, 0, ''),
(18, 138, 1, 0, ''),
(19, 139, 2, 0, ''),
(20, 140, 1, 0, ''),
(21, 141, 1, 0, ''),
(22, 142, 1, 0, ''),
(23, 143, 2, 0, ''),
(24, 144, 1, 0, ''),
(25, 145, 2, 0, ''),
(26, 146, 1, 0, ''),
(27, 147, 2, 0, ''),
(28, 148, 1, 0, ''),
(29, 149, 0, 255.21, ''),
(33, 154, 0, 300.26, ''),
(42, 196, 1, 0, ''),
(43, 197, 1, 0, ''),
(44, 198, 1, 0, '');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `marca`
--

CREATE TABLE `marca` (
  `id_mrc` int(11) NOT NULL,
  `nombre_mrc` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Volcado de datos para la tabla `marca`
--

INSERT INTO `marca` (`id_mrc`, `nombre_mrc`) VALUES
(1, 'SIEMENS'),
(14, 'SMC');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `mdf_proforma`
--

CREATE TABLE `mdf_proforma` (
  `id_mprof` int(11) NOT NULL,
  `num_proforma_mprof` int(11) NOT NULL,
  `fecha_mprof` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `fk_id_clte_mprof` int(11) NOT NULL,
  `fk_id_usua_mprof` int(11) NOT NULL,
  `tpo_valido_mprof` varchar(100) NOT NULL,
  `cond_pago_mprof` varchar(500) NOT NULL,
  `tpo_entrega_mprof` varchar(500) NOT NULL,
  `observacion_mprof` varchar(500) NOT NULL,
  `descuento_mprof` int(11) NOT NULL,
  `moneda_mprof` varchar(10) NOT NULL,
  `tipo_cambio_mprof` float NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Volcado de datos para la tabla `mdf_proforma`
--

INSERT INTO `mdf_proforma` (`id_mprof`, `num_proforma_mprof`, `fecha_mprof`, `fk_id_clte_mprof`, `fk_id_usua_mprof`, `tpo_valido_mprof`, `cond_pago_mprof`, `tpo_entrega_mprof`, `observacion_mprof`, `descuento_mprof`, `moneda_mprof`, `tipo_cambio_mprof`) VALUES
(25, 319, '2023-06-09 04:00:00', 62, 2, '30 dias', 'A CONTRA ENTREGA\r\nDATOS PARA REALIZAR DEPÓSITOS:\r\nA nombre de: SMS INTEGRACIÓN Y CONTROL LTDA.\r\nBanco: BISA\r\nNo. de cuenta: 1675590016', 'Todo Previa confirmación y orden de compra.', 'Precios ofertados válidos sólo a la compra de la totalidad de la proforma o según seleccion previa consulta', 15, '$', 6.96),
(26, 320, '2023-06-16 04:00:00', 87, 2, '15 dias', 'A CONTRA ENTREGA\r\nDATOS PARA REALIZAR DEPÓSITOS:\r\nA nombre de: SMS INTEGRACIÓN Y CONTROL LTDA.\r\nBanco: BISA\r\nNo. de cuenta: 1675590016', 'Todo Previa confirmación y orden de compra.', 'Precios ofertados válidos sólo a la compra de la totalidad de la proforma o según seleccion previa consulta', 15, 'Bs', 6.96);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `mdf_prof_prod`
--

CREATE TABLE `mdf_prof_prod` (
  `id_mpfpd` int(11) NOT NULL,
  `fk_id_mprof_mpfpd` int(11) NOT NULL,
  `fk_id_prod_mpfpd` int(11) NOT NULL,
  `cantidad_mpfpd` int(11) NOT NULL,
  `cost_uni_mpfpd` float NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Volcado de datos para la tabla `mdf_prof_prod`
--

INSERT INTO `mdf_prof_prod` (`id_mpfpd`, `fk_id_mprof_mpfpd`, `fk_id_prod_mpfpd`, `cantidad_mpfpd`, `cost_uni_mpfpd`) VALUES
(28, 25, 124, 30, 300.26),
(29, 25, 130, 1, 200.5),
(30, 25, 149, 5, 3500),
(31, 26, 154, 1, 300.26),
(32, 26, 149, 1, 255.21);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `nota_entrega`
--

CREATE TABLE `nota_entrega` (
  `id_ne` int(11) NOT NULL,
  `fk_id_prof_ne` int(11) NOT NULL,
  `orden_ne` bigint(20) NOT NULL,
  `observacion_ne` varchar(500) NOT NULL,
  `estado_ne` varchar(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Volcado de datos para la tabla `nota_entrega`
--

INSERT INTO `nota_entrega` (`id_ne`, `fk_id_prof_ne`, `orden_ne`, `observacion_ne`, `estado_ne`) VALUES
(41, 319, 4563165161, '', ''),
(42, 321, 5345363646, '', ''),
(43, 320, 346366633636, '', ''),
(45, 323, 23532345234, '', '');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `producto`
--

CREATE TABLE `producto` (
  `id_prod` int(11) NOT NULL,
  `codigo_prod` varchar(30) NOT NULL,
  `marca_prod` varchar(30) NOT NULL,
  `categoria_prod` varchar(30) NOT NULL,
  `nombre_prod` varchar(100) NOT NULL,
  `descripcion_prod` varchar(8000) NOT NULL,
  `imagen_prod` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Volcado de datos para la tabla `producto`
--

INSERT INTO `producto` (`id_prod`, `codigo_prod`, `marca_prod`, `categoria_prod`, `nombre_prod`, `descripcion_prod`, `imagen_prod`) VALUES
(123, '3RX9020-0AA00', 'SIEMENS', 'CABLE', 'Cable AS-i, perfilado para tensión auxiliar externa 24 V negro', 'Cable AS-i, perfilado para tensión auxiliar externa 24 V negro, Goma 2 x 1,5 mm2, 100 m consta de 100 m de cable', '1686337956_G_IC03_XX_19190i.jpg'),
(124, '3RX9010-0AA00', 'SIEMENS', 'CABLE', 'Cable AS-i, perfilado amarillo', 'Cable AS-i, perfilado amarillo, goma 2x 1,5 mm2, 100 m consta de 100 m de cable', '1686338021_G_IC03_XX_19191t.jpg'),
(125, '3SE5112-0LH50', 'SIEMENS', 'FINALES DE CARRERA', 'Interruptor de posición Caja metálica de 40 mm según EN 50041 Palanca metálica de 100 mm de largo y ', 'Interruptor de posición Caja metálica de 40 mm según EN 50041 Conexión del dispositivo 1x (M20 x 1,5) 1 NA/2 NC contactos de acción rápida ajustables con longitud ajustable Palanca metálica de 100 mm de largo y rodillo de plástico de 19 mm', '1686338355_G_IC03_XX_17494t.jpg'),
(126, '3SE5112-0CE01', 'SIEMENS', 'FINALES DE CARRERA', 'Interruptor de posición Caja metálica 40 mm Palanca de rodillo, Palanca de metal y Rodillo de plásti', 'Interruptor de posición Caja metálica 40 mm según EN 50041 Conexión del dispositivo 1x (M20 x 1,5) Contactos de acción rápida 1 NA/1 NC Palanca de rodillo, Palanca de metal y Rodillo de plástico de 22 mm', '1686338287_G_NSW0_XX_90485t.jpg'),
(127, '6GK1901-1BB10-2AE0', 'SIEMENS', 'CONECTORES', 'Industrial Ethernet FastConnect RJ45 plug 180 2x 2', 'Industrial Ethernet FastConnect RJ45 plug 180 2x 2, conector enchufable RJ45 (10/100 Mbit/s) con carcasa de metal resistente y sistema de conexión FC, para cable IE FC TP 2x 2; Salida cable 180° 1 paquete = 50 unidades.', '1686338502_P_IK10_XX_00949t.jpg'),
(128, '6GK1901-1BB12-2AE0', 'SIEMENS', 'CONECTORES', 'Industrial Ethernet FastConnect RJ45 plug 180 4x 2', 'Industrial Ethernet FastConnect RJ45 plug 180 4x 2, conector enchufable', '1686338588_P_IK10_XX_01894t.jpg'),
(129, '6GK1901-1BB20-2AE0', 'SIEMENS', 'CONECTORES', 'Industrial Ethernet FastConnect RJ45 plug 90 2x 2', 'Industrial Ethernet FastConnect RJ45 plug 90 2x 2, conector enchufable RJ45 (10/100 Mbit/s) con carcasa de metal resistente y sistema de conexión FC, para IE FC TP Cable 2x 2; Salida cable 90° 1 paquete=50 unidades.', '1686338650_P_IK10_XX_00838t.jpg'),
(130, '6EP1332-1SH31', 'SIEMENS', 'FUENTES', 'Fuente de alimentación de línea estabilizada Entrada: 120/230 V CA Salida: 24 V CC/3,5 A Diseño S7-2', 'SITOP power 3,5 A, Univ. Fuente de alimentación de línea estabilizada Entrada: 120/230 V CA Salida: 24 V CC/3,5 A Diseño S7-200', '1686339087_P_KT01_XX_00415i.jpg'),
(131, '6ES7307-1BA00-0AA0', 'SIEMENS', 'FUENTES', 'SIMATIC S7-300 Fuente de alimentación regulada PS307', 'SIMATIC S7-300 Fuente de alimentación regulada PS307 entrada: 120/230 V CA, salida: 24 V CC/2 A', '1686339263_download.jpg'),
(132, '6EP3331-6SB00-0AY0', 'SIEMENS', 'FUENTES', 'LOGO!Power Fuente de alimentación estabilizada de 24 V/1,3 A', 'LOGO!Power Fuente de alimentación estabilizada de 24 V/1,3 A Entrada: 100-240 V CA Salida: 24 V CC/ 1,3 A', '1686339430_P_KT01_XX_01760t.jpg'),
(133, '6EP3332-6SB00-0AY0', 'SIEMENS', 'FUENTES', 'LOGO!POWER 24 V / 2,5 A Fuente de alimentación estabilizada', 'LOGO!POWER 24 V / 2,5 A Fuente de alimentación estabilizada Entrada: 100-240 V CA Salida: 24 V CC/ 2,5 A', '1686339550_P_KT01_XX_01761t.jpg'),
(134, '6XV1875-3FN15', 'SIEMENS', 'CABLE', '', '', '1686340545_OIP.jpg'),
(135, '6XV1875-5CH50', 'SIEMENS', 'CABLE', '', '', '1686340656_download.jpg'),
(136, '6XV1875-5CN10', 'SIEMENS', 'CABLE', '', '', '1686340883_download.jpg'),
(137, '6NH9860-1AA00', 'SIEMENS', 'CABLE', '', '', '1686340831_OIP.jpg'),
(138, '1P6ES5735-2BD20', 'SIEMENS', 'CABLE', '', '', '1686341059_download.jpg'),
(139, '1P6ES5734-2BF00', 'SIEMENS', 'CABLE', '', '', '1686341101_download.jpg'),
(140, '6ES5735-8BB00', 'SIEMENS', 'CABLE', '', '', '1686341195_download.jpg'),
(141, '1P6AT8002-4AC03', 'SIEMENS', 'CABLE', '', '', '1686341339_OIP.jpg'),
(142, '6GK5792-6MN00-0AA6', 'SIEMENS', 'CABLE', '', '', '1686341389_OIP.jpg'),
(143, '6SE3290-0XX87-8BF0', 'SIEMENS', 'CONECTORES', ' Panel de operador OPM 2', ' Panel de operador OPM 2', '1686341503_download.jpg'),
(144, '6SE6400-1PC00-0AA0', 'SIEMENS', 'CONECTORES', 'Kit de conexión MICROMASTER 4 PC', 'Kit de conexión MICROMASTER 4 PC', '1686341597_P_D011_XX_00167i.jpg'),
(145, '6P6EP1961-2BA21', 'SIEMENS', 'FUENTES', 'SITOP PSE200U 10 A', 'SITOP PSE200U 10 A Módulo de selectividad Entrada de 4 canales: 24 V CC/40 A Salida: 24 V CC/4x 10 A Nivel ajustable 3-10 A con contacto de señalización común', '1686341775_P_KT01_XX_01077i.jpg'),
(146, '6EP1334-2BA20', 'SIEMENS', 'FUENTES', 'SITOP PSU100S 24 V/10 A', 'SITOP PSU100S 24 V/10 A Entrada de fuente de alimentación estabilizada: 120/230 V AC, salida: DC 24 V/10 A ', '1686341869_P_KT01_XX_01338t.jpg'),
(147, '6EP4134-3AB00-0AY0', 'SIEMENS', 'FUENTES', 'SITOP UPS1600 10 A', 'SITOP UPS1600 10 A fuente de alimentación ininterrumpida entrada: 24 V CC salida: 24 V CC/ 10 A', '1686341937_P_KT01_XX_01453t.jpg'),
(148, '6EP4135-0GB00-0AY0', 'SIEMENS', 'FUENTES', 'SITOP UPS1100 Módulo de batería con baterías selladas de plomo', 'SITOP UPS1100 Módulo de batería con baterías selladas de plomo libres de mantenimiento para SITOP DC UPS module 24 V DC 12 Ah', '1686342004_P_KT01_XX_01597t.jpg'),
(149, '6GK5791-1PS00-0AA6', 'SIEMENS', 'FUENTES', '', '', '1686342057_P_IK10_XX_00827t.jpg'),
(154, '6ES7798-0CA00-0XA0', 'SIEMENS', 'PROGRAMADOR', 'SIMATIC PG', 'SIMATIC PG, adaptador para programación EPROM S5 en Field PG y Power PG', '1686688302_P_ST70_XX_08289i.jpg'),
(196, '6SE3290-0XX87-8SK0D', 'SIEMENS', 'INTERFAZ', 'MÓDULO PROFIBUS CB15 12 MBAUD', 'MÓDULO PROFIBUS CB15 12 MBAUD PARA MICROMASTER (6SE92) MICROMASTER VECTOR (6SE32), MIDIMASTER VECTOR (6SE32) PROTECCIÓN IP21', '1686927239_download.jpg'),
(197, '6ES7972-0DA00-0AA0', 'SIEMENS', 'INTERFAZ', 'SIMATIC DP', 'SIMATIC DP, resistencia terminadora RS485 para terminar redes PROFIBUS/MPI', '1686927420_P_ST70_XX_08768t.jpg'),
(198, '3RS1700-1DD00', 'SIEMENS', 'INTERFAZ', 'convertidor de interfaz', 'convertidor de interfaz Producto descatalogado !!! Para más información, póngase en contacto con nuestro departamento de ventas 24 V AC/DC, entrada de separación de 2 vías: 0-10 V Salida: 4-20 mA terminal de tornillo\r\n', '1686927713_P_NSB0_XX_00776t.jpg'),
(204, '6agdg323', 'SIEMENS', 'CABLE', 'fsdfsd', 'sfsdf', 'imagen.jpg'),
(205, '1lsnfsf', 'SIEMENS', 'CABLE', 'sdfsdf', 'dfsfsdfsfsdgds', 'imagen.jpg');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `proforma`
--

CREATE TABLE `proforma` (
  `id_prof` int(11) NOT NULL,
  `fecha_prof` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `fk_id_clte_prof` int(11) NOT NULL,
  `fk_id_usua_prof` int(11) NOT NULL,
  `tpo_valido_prof` varchar(100) NOT NULL,
  `cond_pago_prof` varchar(500) NOT NULL,
  `tpo_entrega_prof` varchar(500) NOT NULL,
  `observacion_prof` varchar(500) NOT NULL,
  `descuento_prof` int(11) NOT NULL,
  `moneda_prof` varchar(10) NOT NULL,
  `tipo_cambio_prof` float NOT NULL,
  `estado_prof` varchar(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Volcado de datos para la tabla `proforma`
--

INSERT INTO `proforma` (`id_prof`, `fecha_prof`, `fk_id_clte_prof`, `fk_id_usua_prof`, `tpo_valido_prof`, `cond_pago_prof`, `tpo_entrega_prof`, `observacion_prof`, `descuento_prof`, `moneda_prof`, `tipo_cambio_prof`, `estado_prof`) VALUES
(317, '2023-06-09 20:50:50', 64, 3, '15 dias', 'A CONTRA ENTREGA\r\nDATOS PARA REALIZAR DEPÓSITOS:\r\nA nombre de: SMS INTEGRACIÓN Y CONTROL LTDA.\r\nBanco: BISA\r\nNo. de cuenta: 1675590016', 'Todo Previa confirmación y orden de compra.', 'Precios ofertados válidos sólo a la compra de la totalidad de la proforma o según seleccion previa consulta', 15, 'Bs', 6.96, 'pendiente'),
(318, '2023-06-09 04:00:00', 62, 2, '30 dias', 'A CONTRA ENTREGA\r\nDATOS PARA REALIZAR DEPÓSITOS:\r\nA nombre de: SMS INTEGRACIÓN Y CONTROL LTDA.\r\nBanco: BISA\r\nNo. de cuenta: 1675590016', 'Todo Previa confirmación y orden de compra.', 'Precios ofertados válidos sólo a la compra de la totalidad de la proforma o según seleccion previa consulta', 15, '$', 6.96, 'pendiente'),
(319, '2023-06-12 16:13:16', 62, 2, '30 dias', 'A CONTRA ENTREGA\r\nDATOS PARA REALIZAR DEPÓSITOS:\r\nA nombre de: SMS INTEGRACIÓN Y CONTROL LTDA.\r\nBanco: BISA\r\nNo. de cuenta: 1675590016', 'Todo Previa confirmación y orden de compra.', 'Precios ofertados válidos sólo a la compra de la totalidad de la proforma o según seleccion previa consulta', 15, '$', 6.96, 'vendido'),
(320, '2023-06-19 15:58:07', 87, 2, '15', 'A CONTRA ENTREGA\r\nDATOS PARA REALIZAR DEPÓSITOS:\r\n', 'Todo Previa confirmación', 'Precios ofertados válidos sólo a la co', 20, 'Bs', 6.96, 'vendido'),
(321, '2023-06-19 15:50:48', 87, 2, '30 dias', 'A CONTRA ENTREGA\r\nDATOS PARA REALIZAR DEPÓSITOS:\r\nA nombre de: SMS INTEGRACIÓN Y CONTROL LTDA.\r\nBanco: BISA\r\nNo. de cuenta: 1675590016', 'Todo Previa confirmación y orden de compra.', 'Precios ofertados válidos sólo a la compra de la totalidad de la proforma o según seleccion previa consulta', 15, 'Bs', 6.96, 'vendido'),
(322, '2023-06-19 16:19:02', 72, 2, '15 dias', 'A CONTRA ENTREGA\r\nDATOS PARA REALIZAR DEPÓSITOS:\r\nA nombre de: SMS INTEGRACIÓN Y CONTROL LTDA.\r\nBanco: BISA\r\nNo. de cuenta: 1675590016', 'Todo Previa confirmación y orden de compra.', 'Precios ofertados válidos sólo a la compra de la totalidad de la proforma o según seleccion previa consulta', 15, 'Bs', 6.96, 'pendiente'),
(323, '2023-06-19 19:01:27', 84, 2, '45 dias', 'A CONTRA ENTREGA\r\nDATOS PARA REALIZAR DEPÓSITOS:\r\nA nombre de: SMS INTEGRACIÓN Y CONTROL LTDA.\r\nBanco: BISA\r\nNo. de cuenta: 1675590016', 'Todo Previa confirmación y orden de compra.', 'Precios ofertados válidos sólo a la compra de la totalidad de la proforma o según seleccion previa consulta', 15, 'Bs', 6.96, 'vendido'),
(331, '2023-06-19 04:00:00', 83, 2, '15 dias', 'A CONTRA ENTREGA\r\nDATOS PARA REALIZAR DEPÓSITOS:\r\nA nombre de: SMS INTEGRACIÓN Y CONTROL LTDA.\r\nBanco: BISA\r\nNo. de cuenta: 1675590016', 'Todo Previa confirmación y orden de compra.', 'Precios ofertados válidos sólo a la compra de la totalidad de la proforma o según seleccion previa consulta', 10, 'Bs', 6.96, 'pendiente');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `prof_prod`
--

CREATE TABLE `prof_prod` (
  `id_pfpd` int(11) NOT NULL,
  `fk_id_prof_pfpd` int(11) NOT NULL,
  `fk_id_prod_pfpd` int(11) NOT NULL,
  `cantidad_pfpd` int(11) NOT NULL,
  `cost_uni_pfpd` float NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Volcado de datos para la tabla `prof_prod`
--

INSERT INTO `prof_prod` (`id_pfpd`, `fk_id_prof_pfpd`, `fk_id_prod_pfpd`, `cantidad_pfpd`, `cost_uni_pfpd`) VALUES
(55, 317, 124, 20, 20),
(56, 318, 124, 30, 300.26),
(57, 318, 130, 1, 200.5),
(58, 318, 149, 5, 3500),
(62, 319, 124, 20, 300.26),
(63, 319, 149, 5, 3500),
(64, 319, 147, 1, 200),
(67, 320, 154, 1, 300.26),
(68, 320, 149, 1, 255.21),
(69, 321, 154, 2, 299.26),
(70, 321, 196, 4, 255.2),
(71, 321, 197, 5, 156.2),
(72, 321, 198, 2, 168.56),
(73, 322, 146, 1, 252.3),
(74, 322, 147, 1, 363),
(75, 323, 149, 1, 255.21),
(76, 323, 204, 2, 125.25),
(77, 323, 154, 3, 300.26),
(78, 323, 205, 4, 145.23),
(81, 331, 205, 1, 150),
(82, 331, 154, 1, 300.26);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `proveedor`
--

CREATE TABLE `proveedor` (
  `id_prov` int(11) NOT NULL,
  `nombre_prov` varchar(30) NOT NULL,
  `apellido_prov` varchar(30) NOT NULL,
  `celular_prov` int(11) NOT NULL,
  `fk_id_empp_prov` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Volcado de datos para la tabla `proveedor`
--

INSERT INTO `proveedor` (`id_prov`, `nombre_prov`, `apellido_prov`, `celular_prov`, `fk_id_empp_prov`) VALUES
(13, 'Pedro', 'Mendoza', 764654987, 1),
(14, 'Pedro', 'Gonzales', 5646, 2);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `usuario`
--

CREATE TABLE `usuario` (
  `id_usua` int(11) NOT NULL,
  `nombre_usua` varchar(30) NOT NULL,
  `apellido_usua` varchar(30) NOT NULL,
  `contraseña_usua` varchar(100) NOT NULL,
  `email_usua` varchar(50) NOT NULL,
  `ci_usua` int(11) NOT NULL,
  `direccion_usua` varchar(50) NOT NULL,
  `celular_usua` int(11) NOT NULL,
  `rol_usua` varchar(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Volcado de datos para la tabla `usuario`
--

INSERT INTO `usuario` (`id_usua`, `nombre_usua`, `apellido_usua`, `contraseña_usua`, `email_usua`, `ci_usua`, `direccion_usua`, `celular_usua`, `rol_usua`) VALUES
(2, 'Benjamin', 'Aparicio', '$2y$10$y1C8t6r1yf68Qc8hXf1RPe9A1gClK9XNhkS/daeYmjsMBLoohweg.', 'benjamin.aparicio@smsic.com.bo', 1236454, 'Av.arce', 76543210, 'Administrador'),
(3, 'Caleb', 'Huasco Cama', '$2y$10$Z3QOEdBh436ExcKQu41osO/QBKxsea9EWyZ7ZWs0p6gGjPLr6StQW', 'caleb.huasco@smsic.com.bo', 6654625, 'El Alto', 76543210, 'Ingeniero'),
(5, 'Alexandro', 'Montes', '$2y$10$nsWO9dFLP3eDcAtaYtSxZun8c.N39v14d2pG15KJtwkR6LuUKtDoa', 'alexandro.montes@smsic.com.bo', 4568796, 'Obrajes', 76543251, 'Ingeniero'),
(6, 'Luis', 'Aparicio', '$2y$10$px/gR0V7aH3FXpB48kB97.YBHprD5mBic5a98ozzPA5JXQMjGUxpa', 'luis.aparicio@smsic.com.bo', 45986321, 'Av. Arce', 6853349, 'Administrador');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `venta`
--

CREATE TABLE `venta` (
  `id_vnt` int(11) NOT NULL,
  `fecha_vnt` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `factura_vnt` varchar(30) NOT NULL,
  `fk_id_prof_vnt` int(11) NOT NULL,
  `fk_id_clte_vnt` int(11) NOT NULL,
  `descripcion_vnt` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Volcado de datos para la tabla `venta`
--

INSERT INTO `venta` (`id_vnt`, `fecha_vnt`, `factura_vnt`, `fk_id_prof_vnt`, `fk_id_clte_vnt`, `descripcion_vnt`) VALUES
(41, '2023-06-19 04:00:00', '95164', 320, 87, ''),
(42, '2023-06-19 04:00:00', '9498498', 320, 87, ''),
(43, '2023-06-19 04:00:00', 'asasfa', 320, 87, ''),
(44, '2023-06-19 04:00:00', '23223525', 320, 87, ''),
(45, '2023-06-19 04:00:00', '', 320, 87, ''),
(46, '2023-06-19 04:00:00', '', 320, 87, ''),
(47, '2023-06-19 04:00:00', '', 320, 87, '');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `vnt_prod`
--

CREATE TABLE `vnt_prod` (
  `id_vtpd` int(11) NOT NULL,
  `fk_id_vnt_vtpd` int(11) NOT NULL,
  `fk_id_prod_vtpd` int(11) NOT NULL,
  `cantidad_vtpd` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Volcado de datos para la tabla `vnt_prod`
--

INSERT INTO `vnt_prod` (`id_vtpd`, `fk_id_vnt_vtpd`, `fk_id_prod_vtpd`, `cantidad_vtpd`) VALUES
(57, 47, 154, 1),
(58, 47, 149, 1);

--
-- Índices para tablas volcadas
--

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
  ADD KEY `fk_id_prov_cmp` (`fk_id_prov_cmp`);

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
-- Indices de la tabla `inventario`
--
ALTER TABLE `inventario`
  ADD PRIMARY KEY (`id_inv`),
  ADD KEY `fk_id_prod_inv` (`fk_id_prod_inv`);

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
-- Indices de la tabla `nota_entrega`
--
ALTER TABLE `nota_entrega`
  ADD PRIMARY KEY (`id_ne`),
  ADD KEY `fk_id_prof_ne` (`fk_id_prof_ne`);

--
-- Indices de la tabla `producto`
--
ALTER TABLE `producto`
  ADD PRIMARY KEY (`id_prod`);

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
-- Indices de la tabla `usuario`
--
ALTER TABLE `usuario`
  ADD PRIMARY KEY (`id_usua`);

--
-- Indices de la tabla `venta`
--
ALTER TABLE `venta`
  ADD PRIMARY KEY (`id_vnt`),
  ADD KEY `fk_id_clte_vnt` (`fk_id_clte_vnt`),
  ADD KEY `fk_id_prof_vnt` (`fk_id_prof_vnt`);

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
-- AUTO_INCREMENT de la tabla `categoria`
--
ALTER TABLE `categoria`
  MODIFY `id_ctgr` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=18;

--
-- AUTO_INCREMENT de la tabla `cliente`
--
ALTER TABLE `cliente`
  MODIFY `id_clte` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=98;

--
-- AUTO_INCREMENT de la tabla `cmp_prod`
--
ALTER TABLE `cmp_prod`
  MODIFY `id_cppd` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=82;

--
-- AUTO_INCREMENT de la tabla `compra`
--
ALTER TABLE `compra`
  MODIFY `id_cmp` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=38;

--
-- AUTO_INCREMENT de la tabla `empresa`
--
ALTER TABLE `empresa`
  MODIFY `id_emp` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=87;

--
-- AUTO_INCREMENT de la tabla `empresa_prov`
--
ALTER TABLE `empresa_prov`
  MODIFY `id_empp` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT de la tabla `inventario`
--
ALTER TABLE `inventario`
  MODIFY `id_inv` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=45;

--
-- AUTO_INCREMENT de la tabla `marca`
--
ALTER TABLE `marca`
  MODIFY `id_mrc` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=15;

--
-- AUTO_INCREMENT de la tabla `mdf_proforma`
--
ALTER TABLE `mdf_proforma`
  MODIFY `id_mprof` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=27;

--
-- AUTO_INCREMENT de la tabla `mdf_prof_prod`
--
ALTER TABLE `mdf_prof_prod`
  MODIFY `id_mpfpd` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=33;

--
-- AUTO_INCREMENT de la tabla `nota_entrega`
--
ALTER TABLE `nota_entrega`
  MODIFY `id_ne` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=46;

--
-- AUTO_INCREMENT de la tabla `producto`
--
ALTER TABLE `producto`
  MODIFY `id_prod` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=209;

--
-- AUTO_INCREMENT de la tabla `proforma`
--
ALTER TABLE `proforma`
  MODIFY `id_prof` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=332;

--
-- AUTO_INCREMENT de la tabla `prof_prod`
--
ALTER TABLE `prof_prod`
  MODIFY `id_pfpd` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=83;

--
-- AUTO_INCREMENT de la tabla `proveedor`
--
ALTER TABLE `proveedor`
  MODIFY `id_prov` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=15;

--
-- AUTO_INCREMENT de la tabla `usuario`
--
ALTER TABLE `usuario`
  MODIFY `id_usua` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=15;

--
-- AUTO_INCREMENT de la tabla `venta`
--
ALTER TABLE `venta`
  MODIFY `id_vnt` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=48;

--
-- AUTO_INCREMENT de la tabla `vnt_prod`
--
ALTER TABLE `vnt_prod`
  MODIFY `id_vtpd` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=59;

--
-- Restricciones para tablas volcadas
--

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
  ADD CONSTRAINT `compra_ibfk_1` FOREIGN KEY (`fk_id_prov_cmp`) REFERENCES `proveedor` (`id_prov`) ON UPDATE CASCADE;

--
-- Filtros para la tabla `inventario`
--
ALTER TABLE `inventario`
  ADD CONSTRAINT `inventario_ibfk_1` FOREIGN KEY (`fk_id_prod_inv`) REFERENCES `producto` (`id_prod`) ON UPDATE CASCADE;

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
-- Filtros para la tabla `nota_entrega`
--
ALTER TABLE `nota_entrega`
  ADD CONSTRAINT `nota_entrega_ibfk_1` FOREIGN KEY (`fk_id_prof_ne`) REFERENCES `proforma` (`id_prof`) ON UPDATE CASCADE;

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
-- Filtros para la tabla `venta`
--
ALTER TABLE `venta`
  ADD CONSTRAINT `venta_ibfk_1` FOREIGN KEY (`fk_id_clte_vnt`) REFERENCES `cliente` (`id_clte`) ON UPDATE CASCADE,
  ADD CONSTRAINT `venta_ibfk_2` FOREIGN KEY (`fk_id_prof_vnt`) REFERENCES `proforma` (`id_prof`) ON UPDATE CASCADE;

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
