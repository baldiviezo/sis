<?php
require '../modelos/consultasDeVentas.php';
//-----------------------------------------------VENTAS-------------------------
//-------lee todas las ventas
if (isset($_POST['readSales'])) {
	$readSales = new Consultas;
	$readSales->readSales();
}
//------Registrar inventario
if (isset($_POST['createSale'])) {
	$createSale = new Consultas;
	$createSale->asignarValores();
	$createSale->createSale();
}
//------------------------------------------------VNT-PROD------------------------------------------------
//-------Read vnt-prod
if (isset($_POST['readVnt_prods'])) {
	$readVnt_prods = new Consultas;
	$readVnt_prods->readVnt_prods();
}
?>