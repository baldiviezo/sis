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
	//$createSale->asignarValores();
	$createSale->createSale();
}
//------Update inventario
if (isset($_POST['updateVenta'])) {
	$updateVenta = new Consultas;
	$updateVenta->asignarValoresM();
	$updateVenta->updateVenta($_POST['updateVenta']);
}
//-------Delete una venta
if (isset($_POST['deleteVenta'])) {
	$deleteVenta = new consultas;
	$deleteVenta->deleteVenta($_POST['deleteVenta']);
}
//------------------------------------------------VNT-PROD------------------------------------------------
//-------Read vnt-prod
if (isset($_POST['readVnt_prods'])) {
	$readVnt_prods = new Consultas;
	$readVnt_prods->readVnt_prods();
}
?>