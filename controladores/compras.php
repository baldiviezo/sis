<?php 
require '../modelos/consultasDeCompras.php';
//----------------------------------------CRUD COMPRAS------------------------------------------------
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
//-------Delete una Compra
if (isset($_POST['deleteBuy'])) {
	$deleteBuy = new consultas;
	$deleteBuy->deleteBuy($_POST['deleteBuy']);
}
//------Change status
if (isset($_POST['changeStateBuy'])) {
	$changeStateBuy = new Consultas;
	$changeStateBuy->changeStateBuy($_POST['changeStateBuy']);
}
//----------------------------------------CRUD CMP-PROD------------------------------------------------
//------read cpm_prod
if (isset($_POST['readCmp_prods'])) {
	$readCmp_prods = new Consultas;
	$readCmp_prods->readCmp_prods();
}
//------Create cmp_prod
if (isset($_POST['createCmp_prod'])){
	$createCmp_prod = new Consultas;
	$createCmp_prod->createCmp_prod($_POST['createCmp_prod']);
}
//------Update cmp_prod
if (isset($_POST['addBuyToInventory'])) {
	$addBuyToInventory = new Consultas;
	$addBuyToInventory->asignarValoresCppd();
	$addBuyToInventory->addBuyToInventory();

}
//------delate cpm_prod
if (isset($_POST['deleteCmp_prod'])) {
	$deleteCmp_prod = new Consultas;
	$deleteCmp_prod->deleteCmp_prod($_POST['deleteCmp_prod']);
}
//-----edit factura
if (isset($_POST['editFactura'])) {
	$editFactura = new Consultas;
	$editFactura->editFactura();
}
//----------------------------------------TABLA FRECUENCIA DE VENTA------------------------------------------------
if (isset($_POST['readMostProd'])){
	$readMostProd = new Consultas;
	$readMostProd->readMostProd();
}
?>