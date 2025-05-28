<?php
require '../modelos/consultasDeNotasEntrega.php';
//----------------------------------------------CRUD NOTA DE ENTREGA
//-------Create a nota de entrega
if (isset($_POST['createNotaEntrega'])&&isset($_POST['arrayObjetos'])) {
	$createNotaEntrega = new consultas;
	$createNotaEntrega->asignarValores();
	$createNotaEntrega->createNotaEntrega();
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
//---------------------------------------------CRUD NTE_INV
//-------Read Nte_invs
	if (isset($_POST['readNte_invs'])) {
	$readNte_invs = new consultas;
	$readNte_invs->readNte_invs();
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