<?php
require '../modelos/consultasDeProductos.php';
//---------------------------------------PRODUCTOS--------------------------------------------
//------Leer productos
if (isset($_POST['readProducts'])){
	$readProducts = new consultas;
	$readProducts->readProducts();
}
//-------Crear un producto
if (isset($_POST['createProduct'])){
	$registrarProducto = new consultas;
	$registrarProducto->asignarValoresR();
	$registrarProducto->registrar();
}
//------Actualizar un producto
if (isset($_POST['updateProduct'])){
	$guardarProducto = new consultas;
	$guardarProducto->asignarValoresM();
	$guardarProducto->guardar();
}
//------Elimina un Producto
if (isset($_POST['deleteProduct'])){
	$borrarProducto = new consultas;
	$borrarProducto->borrar($_POST['deleteProduct']);
}
//-----------------------------------------Marcas--------------------------------------------------
if (isset($_POST['createMarca'])){
	$registrarMarca = new consultas;
	$registrarMarca->createMarca();
}
if (isset($_POST['readMarca'])){
	$readMarca = new consultas;
	$readMarca->readMarca();
}
if (isset($_POST['deleteMarca'])){
	$deleteMarca = new consultas;
	$deleteMarca->deleteMarca($_POST['deleteMarca']);
}
//-----------------------------------------Categorias--------------------------------------------------
if (isset($_POST['createCategoria'])){
	$registrarCategoria = new consultas;
	$registrarCategoria->createCategoria();
}
if (isset($_POST['readCategoria'])){
	$readCategoria = new consultas;
	$readCategoria->readCategoria();
}
if (isset($_POST['deleteCategoria'])){
	$deleteCategoria = new consultas;
	$deleteCategoria->deleteCategoria($_POST['deleteCategoria']);
}
?>