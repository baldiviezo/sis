<?php 
require '../modelos/consultasDeCompras.php';
//-------read buys
if (isset($_POST['readBuys'])) {
	$readBuy = new Consultas;
	$readBuy->readBuys();
}
//------Registrar Compra
if (isset($_POST['createBuy'])) {
	$createBuy = new Consultas;
	$createBuy->asignarValores($_POST['id_usua']);
	$createBuy->createBuy($_POST['createBuy']);
}
//--------Update productos recibidos
if (isset($_POST['addBuysToInventory'])) {
	$addBuysToInventory = new Consultas;
	$addBuysToInventory->addBuysToInventory();
}
//------Update inComprario
if (isset($_POST['updateBuy'])) {
	$updateBuy = new Consultas;
	$updateBuy->asignarValoresM($_POST['id_usua']);
	$updateBuy->updateBuy();
}
//-------Delete una Compra
if (isset($_POST['deleteBuy'])) {
	$deleteBuy = new consultas;
	$deleteBuy->deleteBuy($_POST['deleteBuy']);
}
//------read cpm_prod
if (isset($_POST['readCmp_prods'])) {
	$readCmp_prods = new Consultas;
	$readCmp_prods->readCmp_prods();
}	
?>