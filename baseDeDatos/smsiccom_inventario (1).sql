-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1:33066
-- Tiempo de generación: 23-10-2023 a las 23:39:11
-- Versión del servidor: 10.4.28-MariaDB
-- Versión de PHP: 8.2.4

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
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `categoria`
--

INSERT INTO `categoria` (`id_ctgr`, `nombre_ctgr`) VALUES
(28, 'CABLE'),
(30, 'CONECTOR TUBO-TUBO'),
(31, 'FINAL DE CARRERA'),
(32, 'CONECTOR'),
(33, 'FUENTE'),
(34, 'PROGRAMADOR'),
(35, 'INTERFAZ'),
(36, 'CONECTOR TUBO-ROSCA');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `cliente`
--

CREATE TABLE `cliente` (
  `id_clte` int(11) NOT NULL,
  `nombre_clte` varchar(30) NOT NULL,
  `apellido_clte` varchar(30) NOT NULL,
  `email_clte` varchar(100) NOT NULL,
  `direccion_clte` varchar(50) NOT NULL,
  `celular_clte` int(11) NOT NULL,
  `fk_id_emp_clte` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `cliente`
--

INSERT INTO `cliente` (`id_clte`, `nombre_clte`, `apellido_clte`, `email_clte`, `direccion_clte`, `celular_clte`, `fk_id_emp_clte`) VALUES
(100, '', '', '', '', 0, 87),
(101, '', '', '', '', 0, 88),
(102, '', '', '', '', 0, 89),
(103, '', '', '', '', 0, 90),
(104, '', '', '', '', 0, 91),
(105, '', '', '', '', 0, 92),
(106, '', '', '', '', 0, 93),
(107, '', '', '', '', 0, 94),
(108, '', '', '', '', 0, 95),
(109, '', '', '', '', 0, 96),
(110, '', '', '', '', 0, 97),
(111, '', '', '', '', 0, 98),
(112, '', '', '', '', 0, 100),
(113, '', '', '', '', 0, 101),
(114, '', '', '', '', 0, 102),
(115, '', '', '', '', 0, 103),
(116, '', '', '', '', 0, 104),
(118, 'Walter', 'Laserna', 'wlaserna@timberland.com.bo', '', 75800240, 87),
(119, 'Dario', 'Quispe', 'md-13darius@ hotmail.es ; capricornio.import777@gmial.com', '', 70179703, 88),
(120, '', '', '', '', 0, 105),
(121, '', '', '', '', 0, 106),
(122, '', '', '', '', 0, 107),
(123, 'Oscar', 'Romero', '', '', 70163431, 92),
(124, 'Jilmar', 'Quispe', 'jquispe@carsabolivia.com', '', 70697911, 89),
(125, 'Robert', 'Ticona', '', '', 78884369, 90),
(126, 'Ever', 'Caceres', 'ever.caceres@delizia.com.bo', '', 0, 91),
(127, 'Hector', 'Contreras', 'hector.contreras@delizia.com.bo', '', 0, 91),
(128, 'Rolando', 'Tapia', 'rolando.tapia@delizia.com.bo', '', 76760065, 91),
(129, 'Benito', 'Marca', '', '', 77287001, 93),
(130, 'Yamilca', 'Gorostiaga', 'ygorostiaga@envazen.com', '', 76777239, 93),
(131, 'Wilder', 'Condori', '', '', 77776938, 94),
(132, 'Lin', 'Mark', '', '', 76232376, 94),
(133, 'Jhonny', 'Condori', '', '', 77733011, 95),
(134, 'Jose Luis', 'Marces', 'jlmarces@grupovenado.com', '', 78815660, 95),
(135, 'Omar', 'Daza', 'omardaza@grupovenado.com', '', 0, 95),
(136, 'Ismael', 'Barrios', '', '', 70575454, 96),
(137, 'Anselmo', 'Kama', 'anselkama@hotmail.com', '', 77543770, 97),
(138, 'Evans', 'Rivas', 'evans.rivas@inti.com.bo', '', 0, 98),
(139, 'Daniel', 'Quevedo', 'daniel.quevedo@inti.com.bo', '', 0, 98),
(140, 'Luis', 'Acuña', 'lacuna@laestrella.cc', '', 69720148, 100),
(141, 'Macario', 'Diaz', '', '', 72596117, 101),
(142, 'Andres', 'Barrios', '', '', 0, 101),
(143, 'Jaime', 'Fernandez', 'j.fernandez@simgacorp.com.bo', '', 77438369, 102),
(144, 'Alexander', 'GarcÍa', 'alexander.garcia@vita.com.bo', '', 78983071, 103),
(145, 'Juan Carlos', 'Ali', 'mathor.srl@gmail.com', '', 70559633, 104),
(146, 'MÁximo', 'Mamani', 'maximo.mamani@lasuprema.com.bo', '', 0, 105),
(147, 'Juan Carlos', 'Sipe', 'juan.sipe@lasuprema.com.bo', '', 69838804, 105),
(148, 'Marcelo', 'Ribera', '', '', 0, 106),
(149, 'Guillermo', 'Padilla', 'gpadilla@pilandina.com.bo', '', 68210311, 106),
(150, 'Manuel', 'Rubin De Celis', 'vrubin@pilandina.com.bo', '', 67001901, 106),
(151, 'Prudencio', 'Ramirez', '', '', 75872399, 107),
(152, '', '', '', '', 0, 108),
(153, '', '', '', '', 0, 109),
(154, '', '', '', '', 0, 110),
(155, '', '', '', '', 0, 111),
(156, '', '', '', '', 0, 112),
(157, '', '', '', '', 0, 113),
(158, '', '', '', '', 0, 114),
(159, '', '', '', '', 0, 115),
(160, '', '', '', '', 0, 116),
(161, '', '', '', '', 0, 117),
(162, '', '', '', '', 0, 118),
(164, '', '', '', '', 0, 120),
(165, 'Paulo', 'Luna', '', '', 0, 108),
(166, 'Crisosto', 'Villanueva', '', '', 0, 109),
(167, 'Jose', 'Roca', 'jose_roca@praxair.com', '', 68938554, 110),
(168, 'Antonio', 'Quispe', '', '', 67023256, 111),
(169, 'Feliz', 'Tancara', 'ftancara@soalpro.com', '', 0, 112),
(170, 'Juan Carlos', 'Lafuente', 'jlafuente777@gmail.com', '', 72519133, 113),
(171, 'Omar', 'Oliveira', 'oolivera@tecalim.com', '', 69877324, 114),
(172, 'Dennis', 'Nava', '', '', 0, 115),
(173, 'Fabricio', 'Heredia', 'stephano.heredia@tigre.com', '', 75862062, 116),
(174, 'Luis', 'Alba', 'lalba@tusequis.com', '', 70540570, 117),
(175, 'Fernando', 'Alanoca', 'fernando.alanoca@zepol.cc', '', 69720190, 118),
(176, 'Julio', '', 'zchambijulio@gmail.com', '', 0, 118),
(177, 'Abdon', 'Lopez', '', '', 0, 120);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `cmp_prod`
--

CREATE TABLE `cmp_prod` (
  `id_cppd` int(11) NOT NULL,
  `fk_id_cmp_cppd` int(11) NOT NULL,
  `fk_id_prod_cppd` int(11) NOT NULL,
  `cantidad_cppd` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

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
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `empresa`
--

CREATE TABLE `empresa` (
  `id_emp` int(11) NOT NULL,
  `nombre_emp` varchar(100) NOT NULL,
  `nit_emp` int(11) NOT NULL,
  `precio_emp` varchar(30) NOT NULL,
  `direccion_emp` varchar(50) NOT NULL,
  `telefono_emp` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `empresa`
--

INSERT INTO `empresa` (`id_emp`, `nombre_emp`, `nit_emp`, `precio_emp`, `direccion_emp`, `telefono_emp`) VALUES
(77, 'Ninguna', 0, '', '', 0),
(87, 'BOLIVIAN TIMBERLAND', 298630023, 'ANTIGUOS', '', 0),
(88, 'CARPRICORNIO', 0, 'ANTIGUOS ', '', 0),
(89, 'CARSA', 193304025, 'ANTIGUOS', '', 0),
(90, 'CONCRETEC', 0, 'NUEVOS', '', 0),
(91, 'COMPAÑIA DE ALIMENTOS SRL (DELIZIA)', 1020493029, 'ANTIGUOS Descuento 5%', '', 0),
(92, 'ENALPAZ SRL', 1018873026, 'CAROS', '', 0),
(93, 'ENVAZEN', 341252027, 'ANTIGUOS', '', 0),
(94, 'FAPELSA', 1001037020, 'ANTIGUOS', '', 0),
(95, 'GRUPO VENADO', 0, 'CAROS', '', 0),
(96, 'HILASA', 0, '', '', 0),
(97, 'ILLAMPU TEXTILES SRL', 233940024, '', '', 0),
(98, 'DROGUERÍA INTI SA', 1020521023, 'ANTIGUOS Descuento 3%', '', 0),
(100, 'FABRICA LA ESTRELLA SRL', 1020431029, 'ANTIGUOS', '', 0),
(101, 'LA PAPELERA SA', 1020495020, 'ANTIGUOS', '', 0),
(102, 'LAB. SIGMA', 0, 'CAROS Descuento 3%', '', 0),
(103, 'LABORATORIOS VITA SA', 1020711029, 'ANTIGUOS', '', 0),
(104, 'MATHOR SRL', 188074024, 'ANTIGUOS', '', 0),
(105, 'MOLINO ANDINO SA', 1020387020, 'ANTIGUOS Descuento 3%', '', 0),
(106, 'PIL ANDINA', 0, 'NUEVOS', '', 0),
(107, 'PLÁSTICOS ENVAZEN', 0, 'NUEVOS', '', 0),
(108, 'PLÁSTICOS VJF LTDA', 161140021, 'NUEVOS Descuento 5%', '', 0),
(109, 'POLAR', 0, '', '', 0),
(110, 'PRAXAIR', 0, '', '', 0),
(111, 'SERVICIOS GRÁFICOS CTP', 0, '', '', 0),
(112, 'SOALPRO SRL', 1020409021, '', '', 0),
(113, 'SOLPLAST', 0, '', '', 0),
(114, 'TECALIM SA', 166320021, 'ANTIGUOS', '', 0),
(115, 'TECNOPRECO', 0, '', '', 0),
(116, 'TIGRE SA', 1020113024, 'ANTIGUOS', '', 0),
(117, 'TUSEQUIS LTDA', 1020477022, '', '', 0),
(118, 'ZEPOL LTDA', 1020429022, '', '', 0),
(120, 'VIVECCA NACIF', 2147483647, '', '', 0);

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
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

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
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

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
(29, 149, 1, 255.21, ''),
(33, 154, 1, 300.26, ''),
(42, 196, 1, 0, ''),
(43, 197, 1, 0, ''),
(44, 198, 1, 0, ''),
(45, 209, 0, 12, ''),
(46, 213, 0, 8, ''),
(47, 214, 0, 12, ''),
(48, 215, 0, 12, ''),
(49, 216, 0, 9, ''),
(50, 217, 0, 12, ''),
(51, 218, 0, 14, ''),
(52, 219, 0, 12, ''),
(53, 220, 0, 13, ''),
(54, 221, 0, 15, ''),
(55, 222, 0, 16, ''),
(56, 223, 0, 15, ''),
(57, 224, 0, 16, ''),
(58, 225, 0, 18, ''),
(59, 226, 0, 20, ''),
(60, 227, 0, 20, ''),
(61, 228, 0, 23, ''),
(62, 229, 0, 38, ''),
(63, 230, 0, 39, ''),
(64, 231, 0, 17, ''),
(65, 232, 0, 13, ''),
(66, 233, 0, 17, ''),
(67, 234, 0, 17, ''),
(68, 235, 0, 13, ''),
(69, 236, 0, 17, ''),
(70, 237, 0, 18, ''),
(71, 238, 0, 18, ''),
(72, 239, 0, 19, ''),
(73, 240, 0, 20, ''),
(74, 241, 0, 24, ''),
(75, 242, 0, 24, ''),
(76, 243, 0, 25, ''),
(77, 244, 0, 27, ''),
(78, 245, 0, 31, ''),
(79, 247, 0, 32, ''),
(80, 246, 0, 31, ''),
(81, 248, 0, 48, ''),
(82, 249, 0, 49, ''),
(83, 250, 0, 23, ''),
(84, 251, 0, 20, ''),
(85, 252, 0, 23, ''),
(86, 253, 0, 25, ''),
(87, 254, 0, 21, ''),
(88, 255, 0, 24, ''),
(89, 256, 0, 26, ''),
(90, 257, 0, 26, ''),
(91, 258, 0, 27, ''),
(92, 259, 0, 27, ''),
(93, 260, 0, 33, ''),
(94, 261, 0, 33, ''),
(95, 262, 0, 35, ''),
(96, 263, 0, 37, ''),
(97, 264, 0, 41, ''),
(98, 265, 0, 41, ''),
(99, 266, 0, 41, ''),
(100, 267, 0, 70, ''),
(101, 268, 0, 71, ''),
(102, 269, 0, 28, ''),
(103, 270, 0, 30, ''),
(104, 271, 0, 30, ''),
(105, 272, 0, 30, ''),
(106, 273, 0, 28, ''),
(107, 274, 0, 28, ''),
(108, 275, 0, 33, ''),
(109, 276, 0, 36, ''),
(110, 277, 0, 34, ''),
(111, 278, 0, 35, ''),
(112, 279, 0, 48, ''),
(113, 280, 0, 43, ''),
(114, 281, 0, 44, ''),
(115, 282, 0, 55, ''),
(116, 283, 0, 53, ''),
(117, 284, 0, 55, ''),
(118, 285, 0, 21, ''),
(119, 286, 0, 22, ''),
(120, 287, 0, 21, ''),
(121, 288, 0, 23, ''),
(122, 289, 0, 25, ''),
(123, 290, 0, 22, ''),
(124, 291, 0, 23, ''),
(125, 292, 0, 26, ''),
(126, 293, 0, 25, ''),
(127, 294, 0, 28, ''),
(128, 295, 0, 30, ''),
(129, 296, 0, 31, ''),
(130, 297, 0, 40, ''),
(131, 298, 0, 16, ''),
(132, 299, 0, 17, ''),
(133, 300, 0, 16, ''),
(134, 301, 0, 17, ''),
(135, 302, 0, 19, ''),
(136, 303, 0, 22, ''),
(137, 304, 0, 23, ''),
(138, 305, 0, 24, ''),
(139, 306, 0, 26, ''),
(140, 307, 0, 40, ''),
(141, 308, 0, 34, ''),
(142, 309, 0, 14, ''),
(143, 310, 0, 15, ''),
(144, 311, 0, 15, ''),
(145, 312, 0, 15, ''),
(146, 313, 0, 16, ''),
(147, 314, 0, 16, ''),
(148, 315, 0, 18, ''),
(149, 316, 0, 18, ''),
(150, 317, 0, 19, ''),
(151, 318, 0, 20, ''),
(152, 319, 0, 20, ''),
(153, 320, 0, 6, ''),
(154, 321, 0, 6, ''),
(155, 322, 0, 6, ''),
(156, 323, 0, 9, ''),
(157, 324, 0, 9, ''),
(158, 325, 0, 9, '');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `marca`
--

CREATE TABLE `marca` (
  `id_mrc` int(11) NOT NULL,
  `nombre_mrc` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `marca`
--

INSERT INTO `marca` (`id_mrc`, `nombre_mrc`) VALUES
(1, 'SIEMENS'),
(15, 'SMC');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `mrc_ctgr`
--

CREATE TABLE `mrc_ctgr` (
  `id_mccr` int(11) NOT NULL,
  `fk_id_mrc_mccr` int(11) NOT NULL,
  `fk_id_ctgr_mccr` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `mrc_ctgr`
--

INSERT INTO `mrc_ctgr` (`id_mccr`, `fk_id_mrc_mccr`, `fk_id_ctgr_mccr`) VALUES
(5, 1, 28),
(7, 15, 30),
(8, 1, 31),
(9, 1, 32),
(10, 1, 33),
(11, 1, 34),
(12, 1, 35),
(13, 15, 36);

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
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `nota_entrega`
--

INSERT INTO `nota_entrega` (`id_ne`, `fk_id_prof_ne`, `orden_ne`, `observacion_ne`, `estado_ne`) VALUES
(54, 337, 64353453453, 'descripcion', 'pendiente');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `producto`
--

CREATE TABLE `producto` (
  `id_prod` int(11) NOT NULL,
  `codigo_prod` varchar(30) NOT NULL,
  `fk_id_mrc_prod` int(11) NOT NULL,
  `fk_id_ctgr_prod` int(11) NOT NULL,
  `nombre_prod` varchar(100) NOT NULL,
  `descripcion_prod` varchar(8000) NOT NULL,
  `imagen_prod` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `producto`
--

INSERT INTO `producto` (`id_prod`, `codigo_prod`, `fk_id_mrc_prod`, `fk_id_ctgr_prod`, `nombre_prod`, `descripcion_prod`, `imagen_prod`) VALUES
(123, '3RX9020-0AA00', 1, 28, 'Cable AS-i, perfilado para tensión auxiliar externa 24 V negro', 'Cable AS-i, perfilado para tensión auxiliar externa 24 V negro, Goma 2 x 1,5 mm2, 100 m consta de 100 m de cable', '1686337956_G_IC03_XX_19190i.jpg'),
(124, '3RX9010-0AA00', 1, 28, 'Cable AS-i, perfilado amarillo', 'Cable AS-i, perfilado amarillo, goma 2x 1,5 mm2, 100 m consta de 100 m de cable', '1686338021_G_IC03_XX_19191t.jpg'),
(125, '3SE5112-0LH50', 1, 31, 'Interruptor de posición Caja metálica de 40 mm según EN 50041 Palanca metálica de 100 mm de largo y ', 'Interruptor de posición Caja metálica de 40 mm según EN 50041 Conexión del dispositivo 1x (M20 x 1,5) 1 NA/2 NC contactos de acción rápida ajustables con longitud ajustable Palanca metálica de 100 mm de largo y rodillo de plástico de 19 mm', '1686338355_G_IC03_XX_17494t.jpg'),
(126, '3SE5112-0CE01', 1, 31, 'Interruptor de posición Caja metálica 40 mm Palanca de rodillo, Palanca de metal y Rodillo de plásti', 'Interruptor de posición Caja metálica 40 mm según EN 50041 Conexión del dispositivo 1x (M20 x 1,5) Contactos de acción rápida 1 NA/1 NC Palanca de rodillo, Palanca de metal y Rodillo de plástico de 22 mm', '1686338287_G_NSW0_XX_90485t.jpg'),
(127, '6GK1901-1BB10-2AE0', 1, 32, 'Industrial Ethernet FastConnect RJ45 plug 180 2x 2', 'Industrial Ethernet FastConnect RJ45 plug 180 2x 2, conector enchufable RJ45 (10/100 Mbit/s) con carcasa de metal resistente y sistema de conexión FC, para cable IE FC TP 2x 2; Salida cable 180° 1 paquete = 50 unidades.', '1686338502_P_IK10_XX_00949t.jpg'),
(128, '6GK1901-1BB12-2AE0', 1, 32, 'Industrial Ethernet FastConnect RJ45 plug 180 4x 2', 'Industrial Ethernet FastConnect RJ45 plug 180 4x 2, conector enchufable', '1686338588_P_IK10_XX_01894t.jpg'),
(129, '6GK1901-1BB20-2AE0', 1, 32, 'Industrial Ethernet FastConnect RJ45 plug 90 2x 2', 'Industrial Ethernet FastConnect RJ45 plug 90 2x 2, conector enchufable RJ45 (10/100 Mbit/s) con carcasa de metal resistente y sistema de conexión FC, para IE FC TP Cable 2x 2; Salida cable 90° 1 paquete=50 unidades.', '1686338650_P_IK10_XX_00838t.jpg'),
(130, '6EP1332-1SH31', 1, 33, 'Fuente de alimentación de línea estabilizada Entrada: 120/230 V CA Salida: 24 V CC/3,5 A Diseño S7-2', 'SITOP power 3,5 A, Univ. Fuente de alimentación de línea estabilizada Entrada: 120/230 V CA Salida: 24 V CC/3,5 A Diseño S7-200', '1686339087_P_KT01_XX_00415i.jpg'),
(131, '6ES7307-1BA00-0AA0', 1, 33, 'SIMATIC S7-300 Fuente de alimentación regulada PS307', 'SIMATIC S7-300 Fuente de alimentación regulada PS307 entrada: 120/230 V CA, salida: 24 V CC/2 A', '1686339263_download.jpg'),
(132, '6EP3331-6SB00-0AY0', 1, 33, 'LOGO!Power Fuente de alimentación estabilizada de 24 V/1,3 A', 'LOGO!Power Fuente de alimentación estabilizada de 24 V/1,3 A Entrada: 100-240 V CA Salida: 24 V CC/ 1,3 A', '1686339430_P_KT01_XX_01760t.jpg'),
(133, '6EP3332-6SB00-0AY0', 1, 33, 'LOGO!POWER 24 V / 2,5 A Fuente de alimentación estabilizada', 'LOGO!POWER 24 V / 2,5 A Fuente de alimentación estabilizada Entrada: 100-240 V CA Salida: 24 V CC/ 2,5 A', '1686339550_P_KT01_XX_01761t.jpg'),
(134, '6XV1875-3FN15', 1, 28, '', '', '1686340545_OIP.jpg'),
(135, '6XV1875-5CH50', 1, 28, '', '', '1686340656_download.jpg'),
(136, '6XV1875-5CN10', 1, 28, '', '', '1686340883_download.jpg'),
(137, '6NH9860-1AA00', 1, 28, '', '', '1686340831_OIP.jpg'),
(138, '1P6ES5735-2BD20', 1, 28, '', '', '1686341059_download.jpg'),
(139, '1P6ES5734-2BF00', 1, 28, '', '', '1686341101_download.jpg'),
(140, '6ES5735-8BB00', 1, 28, '', '', '1686341195_download.jpg'),
(141, '1P6AT8002-4AC03', 1, 28, '', '', '1686341339_OIP.jpg'),
(142, '6GK5792-6MN00-0AA6', 1, 28, '', '', '1686341389_OIP.jpg'),
(143, '6SE3290-0XX87-8BF0', 1, 32, ' Panel de operador OPM 2', ' Panel de operador OPM 2', '1686341503_download.jpg'),
(144, '6SE6400-1PC00-0AA0', 1, 32, 'Kit de conexión MICROMASTER 4 PC', 'Kit de conexión MICROMASTER 4 PC', '1686341597_P_D011_XX_00167i.jpg'),
(145, '6P6EP1961-2BA21', 1, 33, 'SITOP PSE200U 10 A', 'SITOP PSE200U 10 A Módulo de selectividad Entrada de 4 canales: 24 V CC/40 A Salida: 24 V CC/4x 10 A Nivel ajustable 3-10 A con contacto de señalización común', '1686341775_P_KT01_XX_01077i.jpg'),
(146, '6EP1334-2BA20', 1, 33, 'SITOP PSU100S 24 V/10 A', 'SITOP PSU100S 24 V/10 A Entrada de fuente de alimentación estabilizada: 120/230 V AC, salida: DC 24 V/10 A ', '1686341869_P_KT01_XX_01338t.jpg'),
(147, '6EP4134-3AB00-0AY0', 1, 33, 'SITOP UPS1600 10 A', 'SITOP UPS1600 10 A fuente de alimentación ininterrumpida entrada: 24 V CC salida: 24 V CC/ 10 A', '1686341937_P_KT01_XX_01453t.jpg'),
(148, '6EP4135-0GB00-0AY0', 1, 33, 'SITOP UPS1100 Módulo de batería con baterías selladas de plomo', 'SITOP UPS1100 Módulo de batería con baterías selladas de plomo libres de mantenimiento para SITOP DC UPS module 24 V DC 12 Ah', '1686342004_P_KT01_XX_01597t.jpg'),
(149, '6GK5791-1PS00-0AA6', 1, 33, '', '', '1686342057_P_IK10_XX_00827t.jpg'),
(154, '6ES7798-0CA00-0XA0', 1, 34, 'SIMATIC PG', 'SIMATIC PG, adaptador para programación EPROM S5 en Field PG y Power PG', '1686688302_P_ST70_XX_08289i.jpg'),
(196, '6SE3290-0XX87-8SK0D', 1, 35, 'MÓDULO PROFIBUS CB15 12 MBAUD', 'MÓDULO PROFIBUS CB15 12 MBAUD PARA MICROMASTER (6SE92) MICROMASTER VECTOR (6SE32), MIDIMASTER VECTOR (6SE32) PROTECCIÓN IP21', '1686927239_download.jpg'),
(197, '6ES7972-0DA00-0AA0', 1, 35, 'SIMATIC DP', 'SIMATIC DP, resistencia terminadora RS485 para terminar redes PROFIBUS/MPI', '1686927420_P_ST70_XX_08768t.jpg'),
(198, '3RS1700-1DD00', 1, 35, 'convertidor de interfaz', 'convertidor de interfaz Producto descatalogado !!! Para más información, póngase en contacto con nuestro departamento de ventas 24 V AC/DC, entrada de separación de 2 vías: 0-10 V Salida: 4-20 mA terminal de tornillo\r\n', '1686927713_P_NSB0_XX_00776t.jpg'),
(209, 'KQ2H04-M5A', 15, 36, 'CONECTOR RAPIDO RECTO', 'CONECTOR RAPIDO RECTO		\r\nCaracterísticas Técnicas		\r\nFluido: 		Aire\r\nConexión:		M5\r\nTubo aplicable:		4 mm\r\nPresión de operación: 		-1 a 10 bar\r\nMáxima presión de prueba:		30 bar\r\nTemperatura ambiente y fluido: -5 a 60°C		\r\nComponentes adicionales y observaciones		\r\nCon Face seal		\r\n', '1687274307_download.jpg'),
(213, 'KQ2H04-01AS', 15, 36, 'CONECTOR RAPIDO RECTO', 'CONECTOR RAPIDO RECTO		\r\nCaracterísticas Técnicas		\r\nFluido: 		Aire\r\nConexión:		1/8\"\r\nTubo aplicable:		4 mm\r\nPresión de operación: 		-1 a 10 bar\r\nMáxima presión de prueba:		30 bar\r\nTemperatura ambiente y fluido: -5 a 60°C		\r\nComponentes adicionales y observaciones		\r\nCon sellante		', '1687275741_download.jpg'),
(214, 'KQ2H04-02AS', 15, 36, 'CONECTOR RAPIDO RECTO', 'CONECTOR RAPIDO RECTO		\r\nCaracterísticas Técnicas		\r\nFluido: 		Aire\r\nConexión:		1/4\"\r\nTubo aplicable:		4 mm\r\nPresión de operación: 		-1 a 10 bar\r\nMáxima presión de prueba:		30 bar\r\nTemperatura ambiente y fluido: -5 a 60°C		\r\nComponentes adicionales y observaciones		\r\nCon sellante		\r\n', '1687275825_download.jpg'),
(215, 'KQ2H06-M5A', 15, 36, 'CONECTOR RAPIDO RECTO', 'CONECTOR RAPIDO RECTO		\r\nCaracterísticas Técnicas		\r\nFluido: 		Aire\r\nConexión:		M5\r\nTubo aplicable:		6 mm\r\nPresión de operación: 		-1 a 10 bar\r\nMáxima presión de prueba:		30 bar\r\nTemperatura ambiente y fluido: -5 a 60°C		\r\nComponentes adicionales y observaciones		\r\nCon Face seal		\r\n', '1687275913_download.jpg'),
(216, 'KQ2H06-01AS', 15, 36, 'CONECTOR RAPIDO RECTO', 'CONECTOR RAPIDO RECTO		\r\nCaracterísticas Técnicas		\r\nFluido: 		Aire\r\nConexión:		1/8\"\r\nTubo aplicable:		6 mm\r\nPresión de operación: 		-1 a 10 bar\r\nMáxima presión de prueba:		30 bar\r\nTemperatura ambiente y fluido: -5 a 60°C		\r\nComponentes adicionales y observaciones		\r\nCon sellante		\r\n', '1687275963_download.jpg'),
(217, 'KQ2H06-02AS', 15, 36, 'CONECTOR RAPIDO RECTO', 'CONECTOR RAPIDO RECTO		\r\nCaracterísticas Técnicas		\r\nFluido: 		Aire\r\nConexión:		1/4\"\r\nTubo aplicable:		6 mm\r\nPresión de operación: 		-1 a 10 bar\r\nMáxima presión de prueba:		30 bar\r\nTemperatura ambiente y fluido: -5 a 60°C		\r\nComponentes adicionales y observaciones		\r\nCon sellante		\r\n', '1687276092_download.jpg'),
(218, 'KQ2H06-03AS', 15, 36, 'CONECTOR RAPIDO RECTO', 'CONECTOR RAPIDO RECTO		\r\nCaracterísticas Técnicas		\r\nFluido: 		Aire\r\nConexión:		3/8\"\r\nTubo aplicable:		6 mm\r\nPresión de operación: 		-1 a 10 bar\r\nMáxima presión de prueba:		30 bar\r\nTemperatura ambiente y fluido: -5 a 60°C		\r\nComponentes adicionales y observaciones		\r\nCon sellante		\r\n', '1687276242_download.jpg'),
(219, 'KQ2H08-01AS', 15, 36, 'CONECTOR RAPIDO RECTO', 'CONECTOR RAPIDO RECTO		\r\nCaracterísticas Técnicas		\r\nFluido: 		Aire\r\nConexión:		1/8\"\r\nTubo aplicable:		8 mm\r\nPresión de operación: 		-1 a 10 bar\r\nMáxima presión de prueba:		30 bar\r\nTemperatura ambiente y fluido: -5 a 60°C		\r\nComponentes adicionales y observaciones		\r\nCon sellante		\r\n', '1687276307_download.jpg'),
(220, 'KQ2H08-02AS', 15, 36, 'CONECTOR RAPIDO RECTO', 'CONECTOR RAPIDO RECTO		\r\nCaracterísticas Técnicas		\r\nFluido: 		Aire\r\nConexión:		1/4\"\r\nTubo aplicable:		8 mm\r\nPresión de operación: 		-1 a 10 bar\r\nMáxima presión de prueba:		30 bar\r\nTemperatura ambiente y fluido: -5 a 60°C		\r\nComponentes adicionales y observaciones		\r\nCon sellante		\r\n', '1687276348_download.jpg'),
(221, 'KQ2H08-03AS', 15, 36, 'CONECTOR RAPIDO RECTO', 'CONECTOR RAPIDO RECTO		\r\nCaracterísticas Técnicas		\r\nFluido: 		Aire\r\nConexión:		3/8\"\r\nTubo aplicable:		8 mm\r\nPresión de operación: 		-1 a 10 bar\r\nMáxima presión de prueba:		30 bar\r\nTemperatura ambiente y fluido: -5 a 60°C		\r\nComponentes adicionales y observaciones		\r\nCon sellante		\r\n\r\n', '1687276386_download.jpg'),
(222, 'KQ2H10-01AS', 15, 36, 'CONECTOR RAPIDO RECTO', 'CONECTOR RAPIDO RECTO		\r\nCaracterísticas Técnicas		\r\nFluido: 		Aire\r\nConexión:		1/8\"\r\nTubo aplicable:		10 mm\r\nPresión de operación: 		-1 a 10 bar\r\nMáxima presión de prueba:		30 bar\r\nTemperatura ambiente y fluido: -5 a 60°C		\r\nComponentes adicionales y observaciones		\r\nCon sellante		\r\n', '1687276419_download.jpg'),
(223, 'KQ2H10-02AS', 15, 36, 'CONECTOR RAPIDO RECTO', 'CONECTOR RAPIDO RECTO		\r\nCaracterísticas Técnicas		\r\nFluido: 		Aire\r\nConexión:		1/4\"\r\nTubo aplicable:		10 mm\r\nPresión de operación: 		-1 a 10 bar\r\nMáxima presión de prueba:		30 bar\r\nTemperatura ambiente y fluido: -5 a 60°C		\r\nComponentes adicionales y observaciones		\r\nCon sellante		\r\n\r\n', '1687276471_download.jpg'),
(224, 'KQ2H10-03AS', 15, 36, 'CONECTOR RAPIDO RECTO', 'CONECTOR RAPIDO RECTO		\r\nCaracterísticas Técnicas		\r\nFluido: 		Aire\r\nConexión:		3/8\"\r\nTubo aplicable:		10 mm\r\nPresión de operación: 		-1 a 10 bar\r\nMáxima presión de prueba:		30 bar\r\nTemperatura ambiente y fluido: -5 a 60°C		\r\nComponentes adicionales y observaciones		\r\nCon sellante		\r\n', '1687276532_download.jpg'),
(225, 'KQ2H10-04AS', 15, 36, 'CONECTOR RAPIDO RECTO', 'CONECTOR RAPIDO RECTO		\r\nCaracterísticas Técnicas		\r\nFluido: 		Aire\r\nConexión:		1/2\"\r\nTubo aplicable:		10 mm\r\nPresión de operación: 		-1 a 10 bar\r\nMáxima presión de prueba:		30 bar\r\nTemperatura ambiente y fluido: -5 a 60°C		\r\nComponentes adicionales y observaciones		\r\nCon sellante', '1687276569_download.jpg'),
(226, 'KQ2H12-02AS', 15, 36, 'CONECTOR RAPIDO RECTO', 'CONECTOR RAPIDO RECTO		\r\nCaracterísticas Técnicas		\r\nFluido: 		Aire\r\nConexión:		1/4\"\r\nTubo aplicable:		12 mm\r\nPresión de operación: 		-1 a 10 bar\r\nMáxima presión de prueba:		30 bar\r\nTemperatura ambiente y fluido: -5 a 60°C		\r\nComponentes adicionales y observaciones		\r\nCon sellante		\r\n', '1687276614_download.jpg'),
(227, 'KQ2H12-03AS', 15, 36, 'CONECTOR RAPIDO RECTO', 'CONECTOR RAPIDO RECTO		\r\nCaracterísticas Técnicas		\r\nFluido: 		Aire\r\nConexión:		3/8\"\r\nTubo aplicable:		12 mm\r\nPresión de operación: 		-1 a 10 bar\r\nMáxima presión de prueba:		30 bar\r\nTemperatura ambiente y fluido: -5 a 60°C		\r\nComponentes adicionales y observaciones		\r\nCon sellante		\r\n', '1687276658_download.jpg'),
(228, 'KQ2H12-04AS', 15, 36, 'CONECTOR RAPIDO RECTO', 'CONECTOR RAPIDO RECTO		\r\nCaracterísticas Técnicas		\r\nFluido: 		Aire\r\nConexión:		1/2\"\r\nTubo aplicable:		12 mm\r\nPresión de operación: 		-1 a 10 bar\r\nMáxima presión de prueba:		30 bar\r\nTemperatura ambiente y fluido: -5 a 60°C		\r\nComponentes adicionales y observaciones		\r\nCon sellante		\r\n', '1687276713_download.jpg'),
(229, 'KQ2H16-03AS', 15, 36, 'CONECTOR RAPIDO RECTO', 'CONECTOR RAPIDO RECTO		\r\nCaracterísticas Técnicas		\r\nFluido: 		Aire\r\nConexión:		3/8\"\r\nTubo aplicable:		16 mm\r\nPresión de operación: 		-1 a 10 bar\r\nMáxima presión de prueba:		30 bar\r\nTemperatura ambiente y fluido: -5 a 60°C		\r\nComponentes adicionales y observaciones		\r\nCon sellante			\r\n', '1687276814_download.jpg'),
(230, 'KQ2H16-04AS', 15, 36, 'CONECTOR RAPIDO RECTO', 'CONECTOR RAPIDO RECTO		\r\nCaracterísticas Técnicas		\r\nFluido: 		Aire\r\nConexión:		1/2\"\r\nTubo aplicable:		16 mm\r\nPresión de operación: 		-1 a 10 bar\r\nMáxima presión de prueba:		30 bar\r\nTemperatura ambiente y fluido: -5 a 60°C		\r\nComponentes adicionales y observaciones		\r\nCon sellante		', '1687276847_download.jpg'),
(231, 'KQ2L04-M5A', 15, 36, 'CONECTOR RAPIDO CODO', 'CONECTOR RAPIDO CODO		\r\nCaracterísticas Técnicas		\r\nFluido: 		Aire\r\nConexión:		M5\r\nTubo aplicable:		4 mm\r\nPresión de operación: 		-1 a 10 bar\r\nMáxima presión de prueba:		30 bar\r\nTemperatura ambiente y fluido: -5 a 60°C		\r\nComponentes adicionales y observaciones		\r\nCon Face seal', '1687276976_OIP.jpg'),
(232, 'KQ2L04-01AS', 15, 36, 'CONECTOR RAPIDO CODO', 'CONECTOR RAPIDO CODO		\r\nCaracterísticas Técnicas		\r\nFluido: 		Aire\r\nConexión:		1/8\"\r\nTubo aplicable:		4 mm\r\nPresión de operación: 		-1 a 10 bar\r\nMáxima presión de prueba:		30 bar\r\nTemperatura ambiente y fluido: -5 a 60°C		\r\nComponentes adicionales y observaciones		\r\nCon sellante		\r\n', '1687277064_OIP.jpg'),
(233, 'KQ2L04-02AS', 15, 36, 'CONECTOR RAPIDO CODO', 'CONECTOR RAPIDO CODO		\r\nCaracterísticas Técnicas		\r\nFluido: 		Aire\r\nConexión:		1/4\"\r\nTubo aplicable:		4 mm\r\nPresión de operación: 		-1 a 10 bar\r\nMáxima presión de prueba:		30 bar\r\nTemperatura ambiente y fluido: -5 a 60°C		\r\nComponentes adicionales y observaciones		\r\nCon sellante		', '1687277112_OIP.jpg'),
(234, 'KQ2L06-M5A', 15, 36, 'CONECTOR RAPIDO CODO', 'CONECTOR RAPIDO CODO		\r\nCaracterísticas Técnicas		\r\nFluido: 		Aire\r\nConexión:		M5\r\nTubo aplicable:		6 mm\r\nPresión de operación: 		-1 a 10 bar\r\nMáxima presión de prueba:		30 bar\r\nTemperatura ambiente y fluido: -5 a 60°C		\r\nComponentes adicionales y observaciones		\r\nCon Face seal		', '1687277199_OIP.jpg'),
(235, 'KQ2L06-01AS', 15, 36, 'CONECTOR RAPIDO CODO', 'CONECTOR RAPIDO CODO		\r\nCaracterísticas Técnicas		\r\nFluido: 		Aire\r\nConexión:		1/8\"\r\nTubo aplicable:		6 mm\r\nPresión de operación: 		-1 a 10 bar\r\nMáxima presión de prueba:		30 bar\r\nTemperatura ambiente y fluido: -5 a 60°C		\r\nComponentes adicionales y observaciones		\r\nCon sellante		\r\n', '1687277275_OIP.jpg'),
(236, 'KQ2L06-02AS', 15, 36, 'CONECTOR RAPIDO CODO', 'CONECTOR RAPIDO CODO		\r\nCaracterísticas Técnicas		\r\nFluido: 		Aire\r\nConexión:		1/4\"\r\nTubo aplicable:		6 mm\r\nPresión de operación: 		-1 a 10 bar\r\nMáxima presión de prueba:		30 bar\r\nTemperatura ambiente y fluido: -5 a 60°C		\r\nComponentes adicionales y observaciones		\r\nCon sellante		\r\n', '1687277317_OIP.jpg'),
(237, 'KQ2L06-03AS', 15, 36, 'CONECTOR RAPIDO CODO', 'CONECTOR RAPIDO CODO		\r\nCaracterísticas Técnicas		\r\nFluido: 		Aire\r\nConexión:		3/8\"\r\nTubo aplicable:		6 mm\r\nPresión de operación: 		-1 a 10 bar\r\nMáxima presión de prueba:		30 bar\r\nTemperatura ambiente y fluido: -5 a 60°C		\r\nComponentes adicionales y observaciones		\r\nCon sellante		\r\n', '1687277350_OIP.jpg'),
(238, 'KQ2L08-01AS', 15, 36, 'CONECTOR RAPIDO CODO', 'CONECTOR RAPIDO CODO		\r\nCaracterísticas Técnicas		\r\nFluido: 		Aire\r\nConexión:		1/8\"\r\nTubo aplicable:		8 mm\r\nPresión de operación: 		-1 a 10 bar\r\nMáxima presión de prueba:		30 bar\r\nTemperatura ambiente y fluido: -5 a 60°C		\r\nComponentes adicionales y observaciones		\r\nCon sellante		\r\n', '1687277398_OIP.jpg'),
(239, 'KQ2L08-02AS', 15, 36, 'CONECTOR RAPIDO CODO', 'CONECTOR RAPIDO CODO		\r\nCaracterísticas Técnicas		\r\nFluido: 		Aire\r\nConexión:		1/4\"\r\nTubo aplicable:		8 mm\r\nPresión de operación: 		-1 a 10 bar\r\nMáxima presión de prueba:		30 bar\r\nTemperatura ambiente y fluido: -5 a 60°C		\r\nComponentes adicionales y observaciones		\r\nCon sellante		\r\n\r\n', '1687277432_OIP.jpg'),
(240, 'KQ2L08-03AS', 15, 36, 'CONECTOR RAPIDO CODO', 'CONECTOR RAPIDO CODO		\r\nCaracterísticas Técnicas		\r\nFluido: 		Aire\r\nConexión:		3/8\"\r\nTubo aplicable:		8 mm\r\nPresión de operación: 		-1 a 10 bar\r\nMáxima presión de prueba:		30 bar\r\nTemperatura ambiente y fluido: -5 a 60°C		\r\nComponentes adicionales y observaciones		\r\nCon sellante		\r\n\r\n', '1687277466_OIP.jpg'),
(241, 'KQ2L10-01AS', 15, 36, 'CONECTOR RAPIDO CODO', 'CONECTOR RAPIDO CODO		\r\nCaracterísticas Técnicas		\r\nFluido: 		Aire\r\nConexión:		1/8\"\r\nTubo aplicable:		10 mm\r\nPresión de operación: 		-1 a 10 bar\r\nMáxima presión de prueba:		30 bar\r\nTemperatura ambiente y fluido: -5 a 60°C		\r\nComponentes adicionales y observaciones		\r\nCon sellante		\r\n', '1687277509_OIP.jpg'),
(242, 'KQ2L10-02AS', 15, 36, 'CONECTOR RAPIDO CODO', 'CONECTOR RAPIDO CODO		\r\nCaracterísticas Técnicas		\r\nFluido: 		Aire\r\nConexión:		1/4\"\r\nTubo aplicable:		10 mm\r\nPresión de operación: 		-1 a 10 bar\r\nMáxima presión de prueba:		30 bar\r\nTemperatura ambiente y fluido: -5 a 60°C		\r\nComponentes adicionales y observaciones		\r\nCon sellante		\r\n\r\n', '1687277534_OIP.jpg'),
(243, 'KQ2L10-03AS', 15, 36, 'CONECTOR RAPIDO CODO', 'CONECTOR RAPIDO CODO		\r\nCaracterísticas Técnicas		\r\nFluido: 		Aire\r\nConexión:		3/8\"\r\nTubo aplicable:		10 mm\r\nPresión de operación: 		-1 a 10 bar\r\nMáxima presión de prueba:		30 bar\r\nTemperatura ambiente y fluido: -5 a 60°C		\r\nComponentes adicionales y observaciones		\r\nCon sellante		', '1687277582_OIP.jpg'),
(244, 'KQ2L10-04AS', 15, 36, 'CONECTOR RAPIDO CODO', 'CONECTOR RAPIDO CODO		\r\nCaracterísticas Técnicas		\r\nFluido: 		Aire\r\nConexión:		1/2\"\r\nTubo aplicable:		10 mm\r\nPresión de operación: 		-1 a 10 bar\r\nMáxima presión de prueba:		30 bar\r\nTemperatura ambiente y fluido: -5 a 60°C		\r\nComponentes adicionales y observaciones		\r\nCon sellante		', '1687277617_OIP.jpg'),
(245, 'KQ2L12-02AS', 15, 36, 'CONECTOR RAPIDO CODO', 'CONECTOR RAPIDO CODO		\r\nCaracterísticas Técnicas		\r\nFluido: 		Aire\r\nConexión:		1/4\"\r\nTubo aplicable:		12 mm\r\nPresión de operación: 		-1 a 10 bar\r\nMáxima presión de prueba:		30 bar\r\nTemperatura ambiente y fluido: -5 a 60°C		\r\nComponentes adicionales y observaciones		\r\nCon sellante		\r\n', '1687277785_OIP.jpg'),
(246, 'KQ2L12-03AS', 15, 36, 'CONECTOR RAPIDO CODO', 'CONECTOR RAPIDO CODO		\r\nCaracterísticas Técnicas		\r\nFluido: 		Aire\r\nConexión:		3/8\"\r\nTubo aplicable:		12 mm\r\nPresión de operación: 		-1 a 10 bar\r\nMáxima presión de prueba:		30 bar\r\nTemperatura ambiente y fluido: -5 a 60°C		\r\nComponentes adicionales y observaciones		\r\nCon sellante', '1687277827_OIP.jpg'),
(247, 'KQ2L12-04AS', 15, 36, 'CONECTOR RAPIDO CODO', 'CONECTOR RAPIDO CODO		\r\nCaracterísticas Técnicas		\r\nFluido: 		Aire\r\nConexión:		1/2\"\r\nTubo aplicable:		12 mm\r\nPresión de operación: 		-1 a 10 bar\r\nMáxima presión de prueba:		30 bar\r\nTemperatura ambiente y fluido: -5 a 60°C		\r\nComponentes adicionales y observaciones		\r\nCon sellante		\r\n', '1687277877_OIP.jpg'),
(248, 'KQ2L16-03AS', 15, 36, 'CONECTOR RAPIDO CODO', 'CONECTOR RAPIDO CODO		\r\nCaracterísticas Técnicas		\r\nFluido: 		Aire\r\nConexión:		3/8\"\r\nTubo aplicable:		16 mm\r\nPresión de operación: 		-1 a 10 bar\r\nMáxima presión de prueba:		30 bar\r\nTemperatura ambiente y fluido: -5 a 60°C		\r\nComponentes adicionales y observaciones		\r\nCon sellante', '1687278103_OIP.jpg'),
(249, 'KQ2L16-04AS', 15, 36, 'CONECTOR RAPIDO CODO', 'CONECTOR RAPIDO CODO		\r\nCaracterísticas Técnicas		\r\nFluido: 		Aire\r\nConexión:		1/2\"\r\nTubo aplicable:		16 mm\r\nPresión de operación: 		-1 a 10 bar\r\nMáxima presión de prueba:		30 bar\r\nTemperatura ambiente y fluido: -5 a 60°C		\r\nComponentes adicionales y observaciones		\r\nCon sellante', '1687278144_OIP.jpg'),
(250, 'KQ2T04-M5A', 15, 36, 'CONECTOR RAPIDO T', 'CONECTOR RAPIDO T		\r\nCaracterísticas Técnicas		\r\nFluido: 		Aire\r\nConexión:		M5\r\nTubo aplicable:		4 mm\r\nPresión de operación: 		-1 a 10 bar\r\nMáxima presión de prueba:		30 bar\r\nTemperatura ambiente y fluido: -5 a 60°C		\r\nComponentes adicionales y observaciones		\r\nCon Face seal', '1687278407_download.jpg'),
(251, 'KQ2T04-01AS', 15, 36, 'CONECTOR RAPIDO T', 'CONECTOR RAPIDO T		\r\nCaracterísticas Técnicas		\r\nFluido: 		Aire\r\nConexión:		1/8\"\r\nTubo aplicable:		4 mm\r\nPresión de operación: 		-1 a 10 bar\r\nMáxima presión de prueba:		30 bar\r\nTemperatura ambiente y fluido: -5 a 60°C		\r\nComponentes adicionales y observaciones		\r\nCon sellante', '1687278754_OIP.jpg'),
(252, 'KQ2T04-02AS', 15, 36, 'CONECTOR RAPIDO T', 'CONECTOR RAPIDO T		\r\nCaracterísticas Técnicas		\r\nFluido: 		Aire\r\nConexión:		1/4\"\r\nTubo aplicable:		4 mm\r\nPresión de operación: 		-1 a 10 bar\r\nMáxima presión de prueba:		30 bar\r\nTemperatura ambiente y fluido: -5 a 60°C		\r\nComponentes adicionales y observaciones		\r\nCon sellante', '1687278781_OIP.jpg'),
(253, 'KQ2T06-M5A', 15, 36, 'CONECTOR RAPIDO T', 'CONECTOR RAPIDO T		\r\nCaracterísticas Técnicas		\r\nFluido: 		Aire\r\nConexión:		M5\r\nTubo aplicable:		6 mm\r\nPresión de operación: 		-1 a 10 bar\r\nMáxima presión de prueba:		30 bar\r\nTemperatura ambiente y fluido: -5 a 60°C		\r\nComponentes adicionales y observaciones		\r\nCon Face seal', '1687278820_download.jpg'),
(254, 'KQ2T06-01AS', 15, 36, 'CONECTOR RAPIDO T', 'CONECTOR RAPIDO T		\r\nCaracterísticas Técnicas		\r\nFluido: 		Aire\r\nConexión:		1/8\"\r\nTubo aplicable:		6 mm\r\nPresión de operación: 		-1 a 10 bar\r\nMáxima presión de prueba:		30 bar\r\nTemperatura ambiente y fluido: -5 a 60°C		\r\nComponentes adicionales y observaciones		\r\nCon sellante', '1687278864_OIP.jpg'),
(255, 'KQ2T06-02AS', 15, 36, 'CONECTOR RAPIDO T', 'CONECTOR RAPIDO T		\r\nCaracterísticas Técnicas		\r\nFluido: 		Aire\r\nConexión:		1/4\"\r\nTubo aplicable:		6 mm\r\nPresión de operación: 		-1 a 10 bar\r\nMáxima presión de prueba:		30 bar\r\nTemperatura ambiente y fluido: -5 a 60°C		\r\nComponentes adicionales y observaciones		\r\nCon sellante', '1687278904_OIP.jpg'),
(256, 'KQ2T06-03AS', 15, 36, 'CONECTOR RAPIDO T', 'CONECTOR RAPIDO T		\r\nCaracterísticas Técnicas		\r\nFluido: 		Aire\r\nConexión:		3/8\"\r\nTubo aplicable:		6 mm\r\nPresión de operación: 		-1 a 10 bar\r\nMáxima presión de prueba:		30 bar\r\nTemperatura ambiente y fluido: -5 a 60°C		\r\nComponentes adicionales y observaciones		\r\nCon sellante', '1687278937_OIP.jpg'),
(257, 'KQ2T08-01AS', 15, 36, 'CONECTOR RAPIDO T', 'CONECTOR RAPIDO T		\r\nCaracterísticas Técnicas		\r\nFluido: 		Aire\r\nConexión:		1/8\"\r\nTubo aplicable:		8 mm\r\nPresión de operación: 		-1 a 10 bar\r\nMáxima presión de prueba:		30 bar\r\nTemperatura ambiente y fluido: -5 a 60°C		\r\nComponentes adicionales y observaciones		\r\nCon sellante		\r\n', '1687278966_OIP.jpg'),
(258, 'KQ2T08-02AS', 15, 36, 'CONECTOR RAPIDO T', 'CONECTOR RAPIDO T		\r\nCaracterísticas Técnicas		\r\nFluido: 		Aire\r\nConexión:		1/4\"\r\nTubo aplicable:		8 mm\r\nPresión de operación: 		-1 a 10 bar\r\nMáxima presión de prueba:		30 bar\r\nTemperatura ambiente y fluido: -5 a 60°C		\r\nComponentes adicionales y observaciones		\r\nCon sellante		\r\n', '1687278990_OIP.jpg'),
(259, 'KQ2T08-03AS', 15, 36, 'CONECTOR RAPIDO T', 'CONECTOR RAPIDO T		\r\nCaracterísticas Técnicas		\r\nFluido: 		Aire\r\nConexión:		3/8\"\r\nTubo aplicable:		8 mm\r\nPresión de operación: 		-1 a 10 bar\r\nMáxima presión de prueba:		30 bar\r\nTemperatura ambiente y fluido: -5 a 60°C		\r\nComponentes adicionales y observaciones		\r\nCon sellante		\r\n', '1687279018_OIP.jpg'),
(260, 'KQ2T10-01AS', 15, 36, 'CONECTOR RAPIDO T', 'CONECTOR RAPIDO T		\r\nCaracterísticas Técnicas		\r\nFluido: 		Aire\r\nConexión:		1/8\"\r\nTubo aplicable:		10 mm\r\nPresión de operación: 		-1 a 10 bar\r\nMáxima presión de prueba:		30 bar\r\nTemperatura ambiente y fluido: -5 a 60°C		\r\nComponentes adicionales y observaciones		\r\nCon sellante', '1687279133_OIP.jpg'),
(261, 'KQ2T10-02AS', 15, 36, 'CONECTOR RAPIDO T', 'CONECTOR RAPIDO T		\r\nCaracterísticas Técnicas		\r\nFluido: 		Aire\r\nConexión:		1/4\"\r\nTubo aplicable:		10 mm\r\nPresión de operación: 		-1 a 10 bar\r\nMáxima presión de prueba:		30 bar\r\nTemperatura ambiente y fluido: -5 a 60°C		\r\nComponentes adicionales y observaciones		\r\nCon sellante', '1687279164_OIP.jpg'),
(262, 'KQ2T10-03AS', 15, 36, 'CONECTOR RAPIDO T', 'CONECTOR RAPIDO T		\r\nCaracterísticas Técnicas		\r\nFluido: 		Aire\r\nConexión:		3/8\"\r\nTubo aplicable:		10 mm\r\nPresión de operación: 		-1 a 10 bar\r\nMáxima presión de prueba:		30 bar\r\nTemperatura ambiente y fluido: -5 a 60°C		\r\nComponentes adicionales y observaciones		\r\nCon sellante', '1687279190_OIP.jpg'),
(263, 'KQ2T10-04AS', 15, 36, 'CONECTOR RAPIDO T', 'CONECTOR RAPIDO T		\r\nCaracterísticas Técnicas		\r\nFluido: 		Aire\r\nConexión:		1/2\"\r\nTubo aplicable:		10 mm\r\nPresión de operación: 		-1 a 10 bar\r\nMáxima presión de prueba:		30 bar\r\nTemperatura ambiente y fluido: -5 a 60°C		\r\nComponentes adicionales y observaciones		\r\nCon sellante', '1687279218_OIP.jpg'),
(264, 'KQ2T12-02AS', 15, 36, 'CONECTOR RAPIDO T', 'CONECTOR RAPIDO T		\r\nCaracterísticas Técnicas		\r\nFluido: 		Aire\r\nConexión:		1/4\"\r\nTubo aplicable:		12 mm\r\nPresión de operación: 		-1 a 10 bar\r\nMáxima presión de prueba:		30 bar\r\nTemperatura ambiente y fluido: -5 a 60°C		\r\nComponentes adicionales y observaciones		\r\nCon sellante', '1687279244_OIP.jpg'),
(265, 'KQ2T12-03AS', 15, 36, 'CONECTOR RAPIDO T', 'CONECTOR RAPIDO T		\r\nCaracterísticas Técnicas		\r\nFluido: 		Aire\r\nConexión:		3/8\"\r\nTubo aplicable:		12 mm\r\nPresión de operación: 		-1 a 10 bar\r\nMáxima presión de prueba:		30 bar\r\nTemperatura ambiente y fluido: -5 a 60°C		\r\nComponentes adicionales y observaciones		\r\nCon sellante', '1687279273_OIP.jpg'),
(266, 'KQ2T12-04AS', 15, 36, 'CONECTOR RAPIDO T', 'CONECTOR RAPIDO T		\r\nCaracterísticas Técnicas		\r\nFluido: 		Aire\r\nConexión:		1/2\"\r\nTubo aplicable:		12 mm\r\nPresión de operación: 		-1 a 10 bar\r\nMáxima presión de prueba:		30 bar\r\nTemperatura ambiente y fluido: -5 a 60°C		\r\nComponentes adicionales y observaciones		\r\nCon sellante', '1687280900_OIP.jpg'),
(267, 'KQ2T16-03AS', 15, 36, 'CONECTOR RAPIDO T', 'CONECTOR RAPIDO T		\r\nCaracterísticas Técnicas		\r\nFluido: 		Aire\r\nConexión:		3/8\"\r\nTubo aplicable:		16 mm\r\nPresión de operación: 		-1 a 10 bar\r\nMáxima presión de prueba:		30 bar\r\nTemperatura ambiente y fluido: -5 a 60°C		\r\nComponentes adicionales y observaciones		\r\nCon sellante', '1687280926_OIP.jpg'),
(268, 'KQ2T16-04AS', 15, 36, 'CONECTOR RAPIDO T', 'CONECTOR RAPIDO T		\r\nCaracterísticas Técnicas		\r\nFluido: 		Aire\r\nConexión:		1/2\"\r\nTubo aplicable:		16 mm\r\nPresión de operación: 		-1 a 10 bar\r\nMáxima presión de prueba:		30 bar\r\nTemperatura ambiente y fluido: -5 a 60°C		\r\nComponentes adicionales y observaciones		\r\nCon sellante		\r\n', '1687280956_OIP.jpg'),
(269, 'KQ2E04-00A', 15, 36, 'CONECTOR RAPIDO PASAMURO', 'CONECTOR RAPIDO PASAMURO		\r\nCaracterísticas Técnicas		\r\nFluido: 		Aire\r\nTubo aplicable:		4 mm\r\nPresión de operación: 		-1 a 10 bar\r\nMáxima presión de prueba:		30 bar\r\nTemperatura ambiente y fluido: -5 a 60°C		\r\nComponentes adicionales y observaciones		\r\n', '1687281192_conector.png'),
(270, 'KQ2E04-01A', 15, 36, 'CONECTOR RAPIDO PASAMURO', 'CONECTOR RAPIDO PASAMURO		\r\nCaracterísticas Técnicas		\r\nFluido: 		Aire\r\nConexión:		1/8\"\r\nTubo aplicable:		4 mm\r\nPresión de operación: 		-1 a 10 bar\r\nMáxima presión de prueba:		30 bar\r\nTemperatura ambiente y fluido: -5 a 60°C		\r\nComponentes adicionales y observaciones		\r\n', '1687281262_download.jpg'),
(271, 'KQ2E04-02A', 15, 36, 'CONECTOR RAPIDO PASAMURO', 'CONECTOR RAPIDO PASAMURO		\r\nCaracterísticas Técnicas		\r\nFluido: 		Aire\r\nConexión:		1/4\"\r\nTubo aplicable:		4 mm\r\nPresión de operación: 		-1 a 10 bar\r\nMáxima presión de prueba:		30 bar\r\nTemperatura ambiente y fluido: -5 a 60°C		\r\nComponentes adicionales y observaciones		\r\n', '1687281297_download.jpg'),
(272, 'KQ2E06-00A', 15, 36, 'CONECTOR RAPIDO PASAMURO', 'CONECTOR RAPIDO PASAMURO		\r\nCaracterísticas Técnicas		\r\nFluido: 		Aire\r\nTubo aplicable:		6 mm\r\nPresión de operación: 		-1 a 10 bar\r\nMáxima presión de prueba:		30 bar\r\nTemperatura ambiente y fluido: -5 a 60°C		\r\nComponentes adicionales y observaciones		\r\n', '1687281348_conector.png'),
(273, 'KQ2E06-01A', 15, 36, 'CONECTOR RAPIDO PASAMURO', 'CONECTOR RAPIDO PASAMURO		\r\nCaracterísticas Técnicas		\r\nFluido: 		Aire\r\nConexión:		1/8\"\r\nTubo aplicable:		6 mm\r\nPresión de operación: 		-1 a 10 bar\r\nMáxima presión de prueba:		30 bar\r\nTemperatura ambiente y fluido: -5 a 60°C		\r\nComponentes adicionales y observaciones		\r\n', '1687281405_download.jpg'),
(274, 'KQ2E06-02A', 15, 36, 'CONECTOR RAPIDO PASAMURO', 'CONECTOR RAPIDO PASAMURO		\r\nCaracterísticas Técnicas		\r\nFluido: 		Aire\r\nConexión:		1/4\"\r\nTubo aplicable:		6 mm\r\nPresión de operación: 		-1 a 10 bar\r\nMáxima presión de prueba:		30 bar\r\nTemperatura ambiente y fluido: -5 a 60°C		\r\nComponentes adicionales y observaciones', '1687281442_download.jpg'),
(275, 'KQ2E06-03A', 15, 36, 'CONECTOR RAPIDO PASAMURO', 'CONECTOR RAPIDO PASAMURO		\r\nCaracterísticas Técnicas		\r\nFluido: 		Aire\r\nConexión:		3/8\"\r\nTubo aplicable:		6 mm\r\nPresión de operación: 		-1 a 10 bar\r\nMáxima presión de prueba:		30 bar\r\nTemperatura ambiente y fluido: -5 a 60°C		\r\nComponentes adicionales y observaciones', '1687281467_download.jpg'),
(276, 'KQ2E08-00A', 15, 36, 'CONECTOR RAPIDO PASAMURO', 'CONECTOR RAPIDO PASAMURO		\r\nCaracterísticas Técnicas		\r\nFluido: 		Aire\r\nTubo aplicable:		8 mm\r\nPresión de operación: 		-1 a 10 bar\r\nMáxima presión de prueba:		30 bar\r\nTemperatura ambiente y fluido: -5 a 60°C		\r\nComponentes adicionales y observaciones', '1687281514_conector.png'),
(277, 'KQ2E08-03A', 15, 36, 'CONECTOR RAPIDO PASAMURO', 'CONECTOR RAPIDO PASAMURO		\r\nCaracterísticas Técnicas		\r\nFluido: 		Aire\r\nConexión:		3/8\"\r\nTubo aplicable:		8 mm\r\nPresión de operación: 		-1 a 10 bar\r\nMáxima presión de prueba:		30 bar\r\nTemperatura ambiente y fluido: -5 a 60°C		\r\nComponentes adicionales y observaciones', '1687281557_download.jpg'),
(278, 'KQ2E08-02A', 15, 36, 'CONECTOR RAPIDO PASAMURO', 'CONECTOR RAPIDO PASAMURO		\r\nCaracterísticas Técnicas		\r\nFluido: 		Aire\r\nConexión:		1/4\"\r\nTubo aplicable:		8 mm\r\nPresión de operación: 		-1 a 10 bar\r\nMáxima presión de prueba:		30 bar\r\nTemperatura ambiente y fluido: -5 a 60°C		\r\nComponentes adicionales y observaciones', '1687281648_download.jpg'),
(279, 'KQ2E10-00A', 15, 36, 'CONECTOR RAPIDO PASAMURO', 'CONECTOR RAPIDO PASAMURO		\r\nCaracterísticas Técnicas		\r\nFluido: 		Aire\r\nTubo aplicable:		10 mm\r\nPresión de operación: 		-1 a 10 bar\r\nMáxima presión de prueba:		30 bar\r\nTemperatura ambiente y fluido: -5 a 60°C		\r\nComponentes adicionales y observaciones', '1687281682_conector.png'),
(280, 'KQ2E10-02A', 15, 36, 'CONECTOR RAPIDO PASAMURO', 'CONECTOR RAPIDO PASAMURO		\r\nCaracterísticas Técnicas		\r\nFluido: 		Aire\r\nConexión:		1/4\"\r\nTubo aplicable:		10 mm\r\nPresión de operación: 		-1 a 10 bar\r\nMáxima presión de prueba:		30 bar\r\nTemperatura ambiente y fluido: -5 a 60°C		\r\nComponentes adicionales y observaciones', '1687281720_download.jpg'),
(281, 'KQ2E10-03A', 15, 36, 'CONECTOR RAPIDO PASAMURO', 'CONECTOR RAPIDO PASAMURO		\r\nCaracterísticas Técnicas		\r\nFluido: 		Aire\r\nConexión:		3/8\"\r\nTubo aplicable:		10 mm\r\nPresión de operación: 		-1 a 10 bar\r\nMáxima presión de prueba:		30 bar\r\nTemperatura ambiente y fluido: -5 a 60°C		\r\nComponentes adicionales y observaciones		\r\n', '1687281754_download.jpg'),
(282, 'KQ2E12-00A', 15, 36, 'CONECTOR RAPIDO PASAMURO', 'CONECTOR RAPIDO PASAMURO		\r\nCaracterísticas Técnicas		\r\nFluido: 		Aire\r\nTubo aplicable:		12 mm\r\nPresión de operación: 		-1 a 10 bar\r\nMáxima presión de prueba:		30 bar\r\nTemperatura ambiente y fluido: -5 a 60°C		\r\nComponentes adicionales y observaciones', '1687281789_conector.png'),
(283, 'KQ2E12-03A', 15, 36, 'CONECTOR RAPIDO PASAMURO', 'CONECTOR RAPIDO PASAMURO		\r\nCaracterísticas Técnicas		\r\nFluido: 		Aire\r\nConexión:		3/8\"\r\nTubo aplicable:		12 mm\r\nPresión de operación: 		-1 a 10 bar\r\nMáxima presión de prueba:		30 bar\r\nTemperatura ambiente y fluido: -5 a 60°C		\r\nComponentes adicionales y observaciones', '1687281845_download.jpg'),
(284, 'KQ2E12-04A', 15, 36, 'CONECTOR RAPIDO PASAMURO', 'CONECTOR RAPIDO PASAMURO		\r\nCaracterísticas Técnicas		\r\nFluido: 		Aire\r\nConexión:		1/2\"\r\nTubo aplicable:		12 mm\r\nPresión de operación: 		-1 a 10 bar\r\nMáxima presión de prueba:		30 bar\r\nTemperatura ambiente y fluido: -5 a 60°C		\r\nComponentes adicionales y observaciones', '1687281880_download.jpg'),
(285, 'KQ2F04-01A', 15, 36, 'CONECTOR RAPIDO HEMBRA', 'CONECTOR RAPIDO HEMBRA		\r\nCaracterísticas Técnicas		\r\nFluido: 		Aire\r\nConexión:		1/8\"\r\nTubo aplicable:		4 mm\r\nPresión de operación: 		-1 a 10 bar\r\nMáxima presión de prueba:		30 bar\r\nTemperatura ambiente y fluido: -5 a 60°C		\r\nComponentes adicionales y observaciones		\r\n', '1687281941_download.jpg'),
(286, 'KQ2F04-02A', 15, 36, 'CONECTOR RAPIDO HEMBRA', 'CONECTOR RAPIDO HEMBRA		\r\nCaracterísticas Técnicas		\r\nFluido: 		Aire\r\nConexión:		1/4\"\r\nTubo aplicable:		4 mm\r\nPresión de operación: 		-1 a 10 bar\r\nMáxima presión de prueba:		30 bar\r\nTemperatura ambiente y fluido: -5 a 60°C		\r\nComponentes adicionales y observaciones		\r\n', '1687281976_download.jpg'),
(287, 'KQ2F06-01A', 15, 36, 'CONECTOR RAPIDO HEMBRA', 'CONECTOR RAPIDO HEMBRA		\r\nCaracterísticas Técnicas		\r\nFluido: 		Aire\r\nConexión:		1/8\"\r\nTubo aplicable:		6 mm\r\nPresión de operación: 		-1 a 10 bar\r\nMáxima presión de prueba:		30 bar\r\nTemperatura ambiente y fluido: -5 a 60°C		\r\nComponentes adicionales y observaciones		\r\n\r\n', '1687282004_download.jpg'),
(288, 'KQ2F06-02A', 15, 36, 'CONECTOR RAPIDO HEMBRA', 'CONECTOR RAPIDO HEMBRA		\r\nCaracterísticas Técnicas		\r\nFluido: 		Aire\r\nConexión:		1/4\"\r\nTubo aplicable:		6 mm\r\nPresión de operación: 		-1 a 10 bar\r\nMáxima presión de prueba:		30 bar\r\nTemperatura ambiente y fluido: -5 a 60°C		\r\nComponentes adicionales y observaciones		\r\n\r\n', '1687282034_download.jpg'),
(289, 'KQ2F06-03A', 15, 36, 'CONECTOR RAPIDO HEMBRA', 'CONECTOR RAPIDO HEMBRA		\r\nCaracterísticas Técnicas		\r\nFluido: 		Aire\r\nConexión:		3/8\"\r\nTubo aplicable:		6 mm\r\nPresión de operación: 		-1 a 10 bar\r\nMáxima presión de prueba:		30 bar\r\nTemperatura ambiente y fluido: -5 a 60°C		\r\nComponentes adicionales y observaciones', '1687282062_download.jpg'),
(290, 'KQ2F08-01A', 15, 36, 'CONECTOR RAPIDO HEMBRA', 'CONECTOR RAPIDO HEMBRA		\r\nCaracterísticas Técnicas		\r\nFluido: 		Aire\r\nConexión:		1/8\"\r\nTubo aplicable:		8 mm\r\nPresión de operación: 		-1 a 10 bar\r\nMáxima presión de prueba:		30 bar\r\nTemperatura ambiente y fluido: -5 a 60°C		\r\nComponentes adicionales y observaciones', '1687282099_download.jpg'),
(291, 'KQ2F08-02A', 15, 36, 'CONECTOR RAPIDO HEMBRA', 'CONECTOR RAPIDO HEMBRA		\r\nCaracterísticas Técnicas		\r\nFluido: 		Aire\r\nConexión:		1/4\"\r\nTubo aplicable:		8 mm\r\nPresión de operación: 		-1 a 10 bar\r\nMáxima presión de prueba:		30 bar\r\nTemperatura ambiente y fluido: -5 a 60°C		\r\nComponentes adicionales y observaciones		\r\n', '1687282149_download.jpg'),
(292, 'KQ2F08-03A', 15, 36, 'CONECTOR RAPIDO HEMBRA', 'CONECTOR RAPIDO HEMBRA		\r\nCaracterísticas Técnicas		\r\nFluido: 		Aire\r\nConexión:		3/8\"\r\nTubo aplicable:		8 mm\r\nPresión de operación: 		-1 a 10 bar\r\nMáxima presión de prueba:		30 bar\r\nTemperatura ambiente y fluido: -5 a 60°C		\r\nComponentes adicionales y observaciones		\r\n\r\n', '1687282178_download.jpg'),
(293, 'KQ2F10-02A', 15, 36, 'CONECTOR RAPIDO HEMBRA', 'CONECTOR RAPIDO HEMBRA		\r\nCaracterísticas Técnicas		\r\nFluido: 		Aire\r\nConexión:		1/4\"\r\nTubo aplicable:		10 mm\r\nPresión de operación: 		-1 a 10 bar\r\nMáxima presión de prueba:		30 bar\r\nTemperatura ambiente y fluido: -5 a 60°C		\r\nComponentes adicionales y observaciones		\r\n', '1687282227_download.jpg'),
(294, 'KQ2F10-03A', 15, 36, 'CONECTOR RAPIDO HEMBRA', 'CONECTOR RAPIDO HEMBRA		\r\nCaracterísticas Técnicas		\r\nFluido: 		Aire\r\nConexión:		3/8\"\r\nTubo aplicable:		10 mm\r\nPresión de operación: 		-1 a 10 bar\r\nMáxima presión de prueba:		30 bar\r\nTemperatura ambiente y fluido: -5 a 60°C		\r\nComponentes adicionales y observaciones		\r\n', '1687282257_download.jpg'),
(295, 'KQ2F12-02A', 15, 36, 'CONECTOR RAPIDO HEMBRA', 'CONECTOR RAPIDO HEMBRA		\r\nCaracterísticas Técnicas		\r\nFluido: 		Aire\r\nConexión:		1/4\"\r\nTubo aplicable:		12 mm\r\nPresión de operación: 		-1 a 10 bar\r\nMáxima presión de prueba:		30 bar\r\nTemperatura ambiente y fluido: -5 a 60°C		\r\nComponentes adicionales y observaciones		\r\n', '1687282286_download.jpg'),
(296, 'KQ2F12-03A', 15, 36, 'CONECTOR RAPIDO HEMBRA', 'CONECTOR RAPIDO HEMBRA		\r\nCaracterísticas Técnicas		\r\nFluido: 		Aire\r\nConexión:		3/8\"\r\nTubo aplicable:		12 mm\r\nPresión de operación: 		-1 a 10 bar\r\nMáxima presión de prueba:		30 bar\r\nTemperatura ambiente y fluido: -5 a 60°C		\r\nComponentes adicionales y observaciones		\r\n', '1687282308_download.jpg'),
(297, 'KQ2F12-04A', 15, 36, 'CONECTOR RAPIDO HEMBRA', 'CONECTOR RAPIDO HEMBRA		\r\nCaracterísticas Técnicas		\r\nFluido: 		Aire\r\nConexión:		1/2\"\r\nTubo aplicable:		12 mm\r\nPresión de operación: 		-1 a 10 bar\r\nMáxima presión de prueba:		30 bar\r\nTemperatura ambiente y fluido: -5 a 60°C		\r\nComponentes adicionales y observaciones', '1687282335_download.jpg'),
(298, 'KQ2H04-00A', 15, 30, 'CONECTOR UNION RECTO TUBO-TUBO', 'CONECTOR UNION RECTO TUBO-TUBO		\r\nCaracterísticas Técnicas		\r\nFluido: 		Aire\r\nTubo aplicable:		4 mm\r\nPresión de operación: 		-1 a 10 bar\r\nMáxima presión de prueba:		30 bar\r\nTemperatura ambiente y fluido: -5 a 60°C		\r\nComponentes adicionales y observaciones', '1687283315_download.jpg'),
(299, 'KQ2H04-06A', 15, 30, 'CONECTOR REDUCTOR UNION RECTO', 'CONECTOR REDUCTOR UNION RECTO 		\r\nTUBO-TUBO		\r\nCaracterísticas Técnicas		\r\nFluido: 		Aire\r\nTubo aplicable:		4 mm\r\nTubo aplicable:		6 mm\r\nPresión de operación: 		-1 a 10 bar\r\nMáxima presión de prueba:		30 bar\r\nTemperatura ambiente y fluido: -5 a 60°C		\r\nComponentes adicionales y observaciones', '1687283265_download.jpg'),
(300, 'KQ2H06-00A', 15, 30, 'CONECTOR UNION RECTO TUBO-TUBO', 'CONECTOR UNION RECTO TUBO-TUBO		\r\nCaracterísticas Técnicas		\r\nFluido: 		Aire\r\nTubo aplicable:		6 mm\r\nPresión de operación: 		-1 a 10 bar\r\nMáxima presión de prueba:		30 bar\r\nTemperatura ambiente y fluido: -5 a 60°C		\r\nComponentes adicionales y observaciones', '1687283402_download.jpg'),
(301, 'KQ2H06-08A', 15, 30, 'CONECTOR REDUCTOR UNION RECTO', 'CONECTOR REDUCTOR UNION RECTO 		\r\nTUBO-TUBO		\r\nCaracterísticas Técnicas		\r\nFluido: 		Aire\r\nTubo aplicable:		6 mm\r\nTubo aplicable:		8 mm\r\nPresión de operación: 		-1 a 10 bar\r\nMáxima presión de prueba:		30 bar\r\nTemperatura ambiente y fluido: -5 a 60°C		\r\nComponentes adicionales y observaciones', '1687283754_download.jpg'),
(302, 'KQ2H08-00A', 15, 30, 'CONECTOR UNION RECTO TUBO-TUBO', 'CONECTOR UNION RECTO TUBO-TUBO		\r\nCaracterísticas Técnicas		\r\nFluido: 		Aire\r\nTubo aplicable:		8 mm\r\nPresión de operación: 		-1 a 10 bar\r\nMáxima presión de prueba:		30 bar\r\nTemperatura ambiente y fluido: -5 a 60°C		\r\nComponentes adicionales y observaciones', '1687283810_download.jpg'),
(303, 'KQ2H08-10A', 15, 30, 'CONECTOR REDUCTOR UNION RECTO', 'CONECTOR REDUCTOR UNION RECTO 		\r\nTUBO-TUBO		\r\nCaracterísticas Técnicas		\r\nFluido: 		Aire\r\nTubo aplicable:		8 mm\r\nTubo aplicable:		10 mm\r\nPresión de operación: 		-1 a 10 bar\r\nMáxima presión de prueba:		30 bar\r\nTemperatura ambiente y fluido: -5 a 60°C		\r\nComponentes adicionales y observaciones', '1687283202_download.jpg'),
(304, 'KQ2H10-00A', 15, 30, 'CONECTOR UNION RECTO TUBO-TUBO', 'CONECTOR UNION RECTO TUBO-TUBO		\r\nCaracterísticas Técnicas		\r\nFluido: 		Aire\r\nTubo aplicable:		10 mm\r\nPresión de operación: 		-1 a 10 bar\r\nMáxima presión de prueba:		30 bar\r\nTemperatura ambiente y fluido: -5 a 60°C		\r\nComponentes adicionales y observaciones', '1687283846_download.jpg'),
(305, 'KQ2H10-12A', 15, 30, 'CONECTOR REDUCTOR UNION RECTO 		 TUBO-TUBO', 'CONECTOR REDUCTOR UNION RECTO 		\r\nTUBO-TUBO		\r\nCaracterísticas Técnicas		\r\nFluido: 		Aire\r\nTubo aplicable:		10 mm\r\nTubo aplicable:		12 mm\r\nPresión de operación: 		-1 a 10 bar\r\nMáxima presión de prueba:		30 bar\r\nTemperatura ambiente y fluido: -5 a 60°C		\r\nComponentes adicionales y observaciones', '1687283176_download.jpg'),
(306, 'KQ2H12-00A', 15, 30, 'CONECTOR UNION RECTO TUBO-TUBO', 'CONECTOR UNION RECTO TUBO-TUBO		\r\nCaracterísticas Técnicas		\r\nFluido: 		Aire\r\nTubo aplicable:		12 mm\r\nPresión de operación: 		-1 a 10 bar\r\nMáxima presión de prueba:		30 bar\r\nTemperatura ambiente y fluido: -5 a 60°C		\r\nComponentes adicionales y observaciones', '1687283151_download.jpg'),
(307, 'KQ2H12-16A', 15, 30, 'CONECTOR REDUCTOR UNION RECTO 		 TUBO-TUBO', 'CONECTOR REDUCTOR UNION RECTO 		\r\nTUBO-TUBO		\r\nCaracterísticas Técnicas		\r\nFluido: 		Aire\r\nTubo aplicable:		12 mm\r\nTubo aplicable:		16 mm\r\nPresión de operación: 		-1 a 10 bar\r\nMáxima presión de prueba:		30 bar\r\nTemperatura ambiente y fluido: -5 a 60°C		\r\nComponentes adicionales y observaciones', '1687283922_download.jpg'),
(308, 'KQ2H16-00A', 15, 30, 'CONECTOR UNION RECTO TUBO-TUBO', 'CONECTOR UNION RECTO TUBO-TUBO		\r\nCaracterísticas Técnicas		\r\nFluido: 		Aire\r\nTubo aplicable:		16 mm\r\nPresión de operación: 		-1 a 10 bar\r\nMáxima presión de prueba:		30 bar\r\nTemperatura ambiente y fluido: -5 a 60°C		\r\nComponentes adicionales y observaciones		\r\n', '1687283988_download.jpg'),
(309, 'KQ2R04-06A', 15, 30, 'CONECTOR REDUCTOR UNION RECTO 		 TUBO-CLAVIJA', 'CONECTOR REDUCTOR UNION RECTO 		\r\nTUBO-CLAVIJA		\r\nCaracterísticas Técnicas		\r\nFluido: 		Aire\r\nTubo aplicable:		4 mm\r\nDiámetro clavija:		6 mm\r\nPresión de operación: 		-1 a 10 bar\r\nMáxima presión de prueba:		30 bar\r\nTemperatura ambiente y fluido: -5 a 60°C		\r\nComponentes adicionales y observaciones', '1687284053_R.png'),
(310, 'KQ2R04-08A', 15, 30, 'CONECTOR REDUCTOR UNION RECTO 		 TUBO-CLAVIJA', 'CONECTOR REDUCTOR UNION RECTO 		\r\nTUBO-CLAVIJA		\r\nCaracterísticas Técnicas		\r\nFluido: 		Aire\r\nTubo aplicable:		4 mm\r\nDiámetro clavija:		8 mm\r\nPresión de operación: 		-1 a 10 bar\r\nMáxima presión de prueba:		30 bar\r\nTemperatura ambiente y fluido: -5 a 60°C		\r\nComponentes adicionales y observaciones', '1687284100_R.png'),
(311, 'KQ2R04-10A', 15, 30, 'CONECTOR REDUCTOR UNION RECTO 		 TUBO-CLAVIJA', 'CONECTOR REDUCTOR UNION RECTO 		\r\nTUBO-CLAVIJA		\r\nCaracterísticas Técnicas		\r\nFluido: 		Aire\r\nTubo aplicable:		4 mm\r\nDiámetro clavija:		10 mm\r\nPresión de operación: 		-1 a 10 bar\r\nMáxima presión de prueba:		30 bar\r\nTemperatura ambiente y fluido: -5 a 60°C		\r\nComponentes adicionales y observaciones', '1687284143_R.png'),
(312, 'KQ2R06-08A', 15, 30, 'CONECTOR REDUCTOR UNION RECTO 		 TUBO-CLAVIJA', 'CONECTOR REDUCTOR UNION RECTO 		\r\nTUBO-CLAVIJA		\r\nCaracterísticas Técnicas		\r\nFluido: 		Aire\r\nTubo aplicable:		6 mm\r\nDiámetro clavija:		8 mm\r\nPresión de operación: 		-1 a 10 bar\r\nMáxima presión de prueba:		30 bar\r\nTemperatura ambiente y fluido: -5 a 60°C		\r\nComponentes adicionales y observaciones		\r\n', '1687284168_R.png'),
(313, 'KQ2R06-10A', 15, 30, 'CONECTOR REDUCTOR UNION RECTO 		 TUBO-CLAVIJA', 'CONECTOR REDUCTOR UNION RECTO 		\r\nTUBO-CLAVIJA		\r\nCaracterísticas Técnicas		\r\nFluido: 		Aire\r\nTubo aplicable:		6 mm\r\nDiámetro clavija:		10 mm\r\nPresión de operación: 		-1 a 10 bar\r\nMáxima presión de prueba:		30 bar\r\nTemperatura ambiente y fluido: -5 a 60°C		\r\nComponentes adicionales y observaciones', '1687284194_R.png'),
(314, 'KQ2R06-12A', 15, 30, 'CONECTOR REDUCTOR UNION RECTO 		 TUBO-CLAVIJA', 'CONECTOR REDUCTOR UNION RECTO 		\r\nTUBO-CLAVIJA		\r\nCaracterísticas Técnicas		\r\nFluido: 		Aire\r\nTubo aplicable:		6 mm\r\nDiámetro clavija:		12 mm\r\nPresión de operación: 		-1 a 10 bar\r\nMáxima presión de prueba:		30 bar\r\nTemperatura ambiente y fluido: -5 a 60°C		\r\nComponentes adicionales y observaciones		\r\n', '1687284220_R.png'),
(315, 'KQ2R08-10A', 15, 30, 'CONECTOR REDUCTOR UNION RECTO 		 TUBO-CLAVIJA', 'CONECTOR REDUCTOR UNION RECTO 		\r\nTUBO-CLAVIJA		\r\nCaracterísticas Técnicas		\r\nFluido: 		Aire\r\nTubo aplicable:		8 mm\r\nDiámetro clavija:		10 mm\r\nPresión de operación: 		-1 a 10 bar\r\nMáxima presión de prueba:		30 bar\r\nTemperatura ambiente y fluido: -5 a 60°C		\r\nComponentes adicionales y observaciones', '1687284250_R.png'),
(316, 'KQ2R08-12A', 15, 30, 'CONECTOR REDUCTOR UNION RECTO 		 TUBO-CLAVIJA', 'CONECTOR REDUCTOR UNION RECTO 		\r\nTUBO-CLAVIJA		\r\nCaracterísticas Técnicas		\r\nFluido: 		Aire\r\nTubo aplicable:		8 mm\r\nDiámetro clavija:		12 mm\r\nPresión de operación: 		-1 a 10 bar\r\nMáxima presión de prueba:		30 bar\r\nTemperatura ambiente y fluido: -5 a 60°C		\r\nComponentes adicionales y observaciones', '1687284281_R.png'),
(317, 'KQ2R10-12A', 15, 30, 'CONECTOR REDUCTOR UNION RECTO 		 TUBO-CLAVIJA', 'CONECTOR REDUCTOR UNION RECTO 		\r\nTUBO-CLAVIJA		\r\nCaracterísticas Técnicas		\r\nFluido: 		Aire\r\nTubo aplicable:		10 mm\r\nDiámetro clavija:		12 mm\r\nPresión de operación: 		-1 a 10 bar\r\nMáxima presión de prueba:		30 bar\r\nTemperatura ambiente y fluido: -5 a 60°C		\r\nComponentes adicionales y observaciones		\r\n', '1687284308_R.png'),
(318, 'KQ2R10-16A', 15, 30, 'CONECTOR REDUCTOR UNION RECTO 		 TUBO-CLAVIJA', 'CONECTOR REDUCTOR UNION RECTO 		\r\nTUBO-CLAVIJA		\r\nCaracterísticas Técnicas		\r\nFluido: 		Aire\r\nTubo aplicable:		10 mm\r\nDiámetro clavija:		16 mm\r\nPresión de operación: 		-1 a 10 bar\r\nMáxima presión de prueba:		30 bar\r\nTemperatura ambiente y fluido: -5 a 60°C		\r\nComponentes adicionales y observaciones		\r\n\r\n', '1687284363_R.png'),
(319, 'KQ2R12-16A', 15, 30, 'CONECTOR REDUCTOR UNION RECTO 		 TUBO-CLAVIJA', 'CONECTOR REDUCTOR UNION RECTO 		\r\nTUBO-CLAVIJA		\r\nCaracterísticas Técnicas		\r\nFluido: 		Aire\r\nTubo aplicable:		12 mm\r\nDiámetro clavija:		16 mm\r\nPresión de operación: 		-1 a 10 bar\r\nMáxima presión de prueba:		30 bar\r\nTemperatura ambiente y fluido: -5 a 60°C		\r\nComponentes adicionales y observaciones', '1687284399_R.png'),
(320, 'KQ2P-04', 15, 30, 'TAPÓN', 'TAPÓN		\r\nCaracterísticas Técnicas		\r\nFluido: 		Aire\r\nTubo aplicable:		4 mm\r\nPresión de operación: 		-1 a 10 bar\r\nMáxima presión de prueba:		30 bar\r\nTemperatura ambiente y fluido: -5 a 60°C		\r\nComponentes adicionales y observaciones', '1687284461_download.jpg'),
(321, 'KQ2P-06', 15, 30, 'TAPÓN', 'TAPÓN		\r\nCaracterísticas Técnicas		\r\nFluido: 		Aire\r\nTubo aplicable:		6 mm\r\nPresión de operación: 		-1 a 10 bar\r\nMáxima presión de prueba:		30 bar\r\nTemperatura ambiente y fluido: -5 a 60°C		\r\nComponentes adicionales y observaciones', '1687284487_download.jpg'),
(322, 'KQ2P-08', 15, 30, 'TAPÓN', 'TAPÓN		\r\nCaracterísticas Técnicas		\r\nFluido: 		Aire\r\nTubo aplicable:		8 mm\r\nPresión de operación: 		-1 a 10 bar\r\nMáxima presión de prueba:		30 bar\r\nTemperatura ambiente y fluido: -5 a 60°C		\r\nComponentes adicionales y observaciones		\r\n', '1687284519_download.jpg'),
(323, 'KQ2P-10', 15, 30, 'TAPÓN', 'TAPÓN		\r\nCaracterísticas Técnicas		\r\nFluido: 		Aire\r\nTubo aplicable:		10 mm\r\nPresión de operación: 		-1 a 10 bar\r\nMáxima presión de prueba:		30 bar\r\nTemperatura ambiente y fluido: -5 a 60°C		\r\nComponentes adicionales y observaciones', '1687284545_download.jpg'),
(324, 'KQ2P-12', 15, 30, 'TAPÓN', 'TAPÓN		\nCaracterísticas Técnicas		\nFluido: 		Aire\nTubo aplicable:		12 mm\nPresión de operación: 		-1 a 10 bar\nMáxima presión de prueba:		30 bar\nTemperatura ambiente y fluido: -5 a 60°C		\nComponentes adicionales y observaciones', '1687284574_download.jpg'),
(325, 'KQ2P-16', 15, 30, 'TAPÓN', 'TAPÓN		\nCaracterísticas Técnicas		\nFluido: Aire\nTubo aplicable: 16 mm\nPresión de operación:  -1 a 10 bar\nMáxima presión de prueba: 30 bar\nTemperatura ambiente y fluido: -5 a 60°C		\nComponentes adicionales y observaciones		\n', '1687284597_download.jpg');

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
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `proforma`
--

INSERT INTO `proforma` (`id_prof`, `fecha_prof`, `fk_id_clte_prof`, `fk_id_usua_prof`, `tpo_valido_prof`, `cond_pago_prof`, `tpo_entrega_prof`, `observacion_prof`, `descuento_prof`, `moneda_prof`, `tipo_cambio_prof`, `estado_prof`) VALUES
(337, '2023-10-10 16:31:10', 177, 2, '15 dias', 'A CONTRA ENTREGA\r\nDATOS PARA REALIZAR DEPÓSITOS:\r\nA nombre de: SMS INTEGRACIÓN Y CONTROL LTDA.\r\nBanco: BISA\r\nNo. de cuenta: 1675590016', 'Todo Previa confirmación y orden de compra.', 'Precios ofertados válidos sólo a la compra de la totalidad de la proforma o según seleccion previa consulta', 10, 'Bs', 6.96, 'vendido'),
(338, '2023-10-10 04:00:00', 177, 2, '15 dias', 'A CONTRA ENTREGA\r\nDATOS PARA REALIZAR DEPÓSITOS:\r\nA nombre de: SMS INTEGRACIÓN Y CONTROL LTDA.\r\nBanco: BISA\r\nNo. de cuenta: 1675590016', 'Todo Previa confirmación y orden de compra.', 'Precios ofertados válidos sólo a la compra de la totalidad de la proforma o según seleccion previa consulta', 20, '$', 6.96, 'pendiente'),
(339, '2023-10-17 04:00:00', 134, 2, '15 dias', 'A CONTRA ENTREGA\r\nDATOS PARA REALIZAR DEPÓSITOS:\r\nA nombre de: SMS INTEGRACIÓN Y CONTROL LTDA.\r\nBanco: BISA\r\nNo. de cuenta: 1675590016', 'Todo Previa confirmación y orden de compra.', 'Precios ofertados válidos sólo a la compra de la totalidad de la proforma o según seleccion previa consulta', 10, 'Bs', 6.96, 'pendiente');

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
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `prof_prod`
--

INSERT INTO `prof_prod` (`id_pfpd`, `fk_id_prof_pfpd`, `fk_id_prod_pfpd`, `cantidad_pfpd`, `cost_uni_pfpd`) VALUES
(102, 337, 196, 1, 20),
(103, 337, 154, 1, 300.26),
(104, 338, 148, 15, 200),
(105, 339, 323, 1, 9),
(106, 339, 322, 1, 6);

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
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

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
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `usuario`
--

INSERT INTO `usuario` (`id_usua`, `nombre_usua`, `apellido_usua`, `contraseña_usua`, `email_usua`, `ci_usua`, `direccion_usua`, `celular_usua`, `rol_usua`) VALUES
(2, 'Benjamin', 'Aparicio', '$2y$10$CydqF0KSIqPK8X0wj2KlpOAcgZooP7xf0sk.YfXzZ95P3sxllkMUK', 'benjamin.aparicio@smsic.com.bo', 1236454, 'Av.arce', 76543210, 'Administrador'),
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
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `vnt_prod`
--

CREATE TABLE `vnt_prod` (
  `id_vtpd` int(11) NOT NULL,
  `fk_id_vnt_vtpd` int(11) NOT NULL,
  `fk_id_prod_vtpd` int(11) NOT NULL,
  `cantidad_vtpd` int(11) NOT NULL,
  `cost_uni_vtpd` float NOT NULL,
  `cost_total_vtpd` float NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

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
  ADD KEY `fk_id_prof_ne` (`fk_id_prof_ne`);

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
  MODIFY `id_ctgr` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=37;

--
-- AUTO_INCREMENT de la tabla `cliente`
--
ALTER TABLE `cliente`
  MODIFY `id_clte` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=187;

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
  MODIFY `id_emp` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=128;

--
-- AUTO_INCREMENT de la tabla `empresa_prov`
--
ALTER TABLE `empresa_prov`
  MODIFY `id_empp` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT de la tabla `inventario`
--
ALTER TABLE `inventario`
  MODIFY `id_inv` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=162;

--
-- AUTO_INCREMENT de la tabla `marca`
--
ALTER TABLE `marca`
  MODIFY `id_mrc` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=18;

--
-- AUTO_INCREMENT de la tabla `mrc_ctgr`
--
ALTER TABLE `mrc_ctgr`
  MODIFY `id_mccr` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=14;

--
-- AUTO_INCREMENT de la tabla `nota_entrega`
--
ALTER TABLE `nota_entrega`
  MODIFY `id_ne` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=55;

--
-- AUTO_INCREMENT de la tabla `producto`
--
ALTER TABLE `producto`
  MODIFY `id_prod` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=333;

--
-- AUTO_INCREMENT de la tabla `proforma`
--
ALTER TABLE `proforma`
  MODIFY `id_prof` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=340;

--
-- AUTO_INCREMENT de la tabla `prof_prod`
--
ALTER TABLE `prof_prod`
  MODIFY `id_pfpd` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=107;

--
-- AUTO_INCREMENT de la tabla `proveedor`
--
ALTER TABLE `proveedor`
  MODIFY `id_prov` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=15;

--
-- AUTO_INCREMENT de la tabla `usuario`
--
ALTER TABLE `usuario`
  MODIFY `id_usua` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=20;

--
-- AUTO_INCREMENT de la tabla `venta`
--
ALTER TABLE `venta`
  MODIFY `id_vnt` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=67;

--
-- AUTO_INCREMENT de la tabla `vnt_prod`
--
ALTER TABLE `vnt_prod`
  MODIFY `id_vtpd` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=100;

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
-- Filtros para la tabla `mrc_ctgr`
--
ALTER TABLE `mrc_ctgr`
  ADD CONSTRAINT `mrc_ctgr_ibfk_1` FOREIGN KEY (`fk_id_mrc_mccr`) REFERENCES `marca` (`id_mrc`) ON UPDATE CASCADE,
  ADD CONSTRAINT `mrc_ctgr_ibfk_2` FOREIGN KEY (`fk_id_ctgr_mccr`) REFERENCES `categoria` (`id_ctgr`) ON UPDATE CASCADE;

--
-- Filtros para la tabla `nota_entrega`
--
ALTER TABLE `nota_entrega`
  ADD CONSTRAINT `nota_entrega_ibfk_1` FOREIGN KEY (`fk_id_prof_ne`) REFERENCES `proforma` (`id_prof`) ON UPDATE CASCADE;

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
