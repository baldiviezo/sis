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
?>