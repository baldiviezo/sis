<?php
require '../modelos/consultasDeNotasEntrega.php';
//-------read notas de entrega
if (isset($_POST['readNotasEntrega'])) {
	$readNotasEntrega = new consultas;
	$readNotasEntrega->readNotasEntrega();
}
//-------delete nota de entrega
if (isset($_POST['deleteNotaEntrega'])) {
	$deleteNotaEntrega = new consultas;
	$deleteNotaEntrega->deleteNotaEntrega($_POST['deleteNotaEntrega']);
}
//------read todas las notas de entrega
if (isset($_POST['readAllNotaEntrega'])) {
	$readAllNotaEntrega = new consultas;
	$readAllNotaEntrega->readAllNotaEntrega();
}
//-------read prof_prods
if (isset($_POST['readprof_prods'])) {
	$readprof_prods = new consultas;
	$readprof_prods->readprof_prods();
}
?>