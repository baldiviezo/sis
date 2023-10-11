<?php
require '../modelos/consultasDeInventario.php';
//------Read inventories
if (isset($_POST['readInventories'])){
	$readInventories = new consultas;
	$readInventories->readInventories();
}
//-------Registrar productos
if (isset($_POST['createInventory'])){
	$registrarProducto = new consultas;
	$registrarProducto->asignarValores();
	$registrarProducto->createInventory();
}
if (isset($_POST['updateInventory'])){
	$updateInventory = new consultas;
	$updateInventory->asignarValoresModificar();
	$updateInventory->updateInventory();
}
//-----Elimina Producto
if (isset($_POST['deleteInventory'])){
	$deleteInventory = new consultas;
	$deleteInventory->deleteInventory($_POST['deleteInventory']);
}
?>