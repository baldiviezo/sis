<?php
require '../modelos/consultasDeNotasEntrega.php';
//----------------------------------------------CRUD NOTA DE ENTREGA
//-------Create a nota de entrega
if (isset($_POST['createNotaEntrega'])) {
	$createNotaEntrega = new consultas;
	$createNotaEntrega->createNotaEntrega($_POST['id_usua']);
}
//-------read notas de entrega
if (isset($_POST['readNotasEntrega'])) {
	$readNotasEntrega = new consultas;
	$readNotasEntrega->readNotasEntrega();
}
//-------delete nota de entrega
if (isset($_POST['deleteNotaEntrega'])) {
	$deleteNotaEntrega = new consultas;
	$deleteNotaEntrega->deleteNotaEntrega();
}
//------read todas las notas de entrega
if (isset($_POST['readAllNotaEntrega'])) {
	$readAllNotaEntrega = new consultas;
	$readAllNotaEntrega->readAllNotaEntrega();
}
//---------------------------------------------CRUD NTE_PROD
//-------Read Nte_prods
	if (isset($_POST['readNte_prods'])) {
	$readNte_prods = new consultas;
	$readNte_prods->readNte_prods();
}
//--------------------------------------------CRUD ORDEN DE COMPRA
if (isset($_POST['readOrderBuys'])) {
	$readOrderBuys = new consultas;
	$readOrderBuys->readOrderBuys();
}
//-------read OC_PROD
if (isset($_POST['readOcProd'])) {
	$readOcProd = new consultas;
	$readOcProd->readOcProd();
}
?>