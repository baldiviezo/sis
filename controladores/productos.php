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
if (isset($_POST['readMarcas'])){
	$readMarca = new consultas;
	$readMarca->readMarcas();
}
if (isset($_POST['createMarca'])){
	$registrarMarca = new consultas;
	$registrarMarca->createMarca();
}
//------Actualizar una marca
if (isset($_POST['updateMarca'])){
	$guardarMarca = new consultas;
	$guardarMarca->updateMarca();
}
//------Eliminar una marca
if (isset($_POST['deleteMarca'])){
	$deleteMarca = new consultas;
	$deleteMarca->deleteMarca($_POST['deleteMarca']);
}
//-----------------------------------------Categorias--------------------------------------------------
if (isset($_POST['readCategorias'])){
	$readCategoria = new consultas;
	$readCategoria->readCategorias();
}
if (isset($_POST['createCategoria'])){
	$registrarCategoria = new consultas;
	$registrarCategoria->createCategoria();
}
if (isset($_POST['deleteCategoria'])){
	$deleteCategoria = new consultas;
	$deleteCategoria->deleteCategoria($_POST['deleteCategoria']);
}
?>