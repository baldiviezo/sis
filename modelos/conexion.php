<?php
/*server*/
/*$conexion = new mysqli("localhost", "smsiccom_smsiccom", "Smsic123!@@!", "smsiccom_inventario");
if($conexion){
	mysqli_select_db($conexion, 'pruebas');
	mysqli_query($conexion, 'SET NAMES "utf8"');
	date_default_timezone_set('America/Mexico_city');
}
//Se ejecuta cuando ocurre un error al momneto de conectarse con la base de datos
if ($conexion->connect_error) {
    die('Error de conexion a la base de datos. ' . $conexion->connect_error);
}*/
/*local */
$conexion = new mysqli("127.0.0.1:33066", "root", "", "smsiccom_inventario");
if ($conexion->connect_error) {
    die('Error de conexion a la base de datos. ' . $conexion->connect_error);
}
?>
