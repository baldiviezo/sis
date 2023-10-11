<?php
require'../modelos/consultasDeUsuarios.php';
session_start();
//------Leer usuarios
if (isset($_POST['readUsers'])){
	$readUsers = new Consultas;
	$readUsers->readUsers();
}
//------Crear un usuario
if (isset($_POST['nombre_usua_R'])&&isset($_POST['apellido_usua_R'])&&isset($_POST['contraseña_usua_R'])&&isset($_POST['contraseña2_usua_R'])&&isset($_POST['email_usua_R'])&&isset($_POST['ci_usua_R'])&&isset($_POST['direccion_usua_R'])&&isset($_POST['celular_usua_R'])&&isset($_POST['rol_usua_R'])&&isset($_POST['createUser'])){
	$createUser = new Consultas;
	$createUser->asignarValoresRegistrar();
	$createUser->createUser();
}
//------Actualizar un usuario
if (isset($_POST['updateUser'])){
	$updateUser = new Consultas;
	$updateUser->asignarValoresModificar();
	$updateUser->updateUser();
}
//------Eliminar un usuario
if (isset($_POST['deleteUser'])){
	$deleteUser = new Consultas;
	$deleteUser->deleteUser($_POST['deleteUser']);
}
?>