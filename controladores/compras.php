<?php 
require '../modelos/consultasDeCompras.php';
//------Registrar Compra
if (isset($_POST['createBuy'])) {
	$createBuy = new Consultas;
	$createBuy->asignarValores();
	$createBuy->createBuy($_POST['createBuy']);
}
//-------lee todas las Compras
if (isset($_POST['readBuy'])) {
	$readBuy = new Consultas;
	$readBuy->readBuy();
}
//-------lee una Buy
if (isset($_POST['readABuy'])) {
	$readABuy = new Consultas;
	$readABuy->readABuy($_POST['readABuy']);
}
//------Update inComprario
if (isset($_POST['updateCompra'])) {
	$updateCompra = new Consultas;
	$updateCompra->asignarValoresM();
	$updateCompra->updateCompra($_POST['updateCompra']);
}
//-------Delete una Compra
if (isset($_POST['deleteCompra'])) {
	$deleteCompra = new consultas;
	$deleteCompra->deleteCompra($_POST['deleteCompra']);
}
?>