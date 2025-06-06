<?php
/*server*/
// Definir constantes para la configuración de la base de datos
/*
try {
    $conexion = new mysqli('localhost','smsiccom_smsiccom', 'Smsic123!@@!', 'smsiccom_inventario');
    if ($conexion->connect_error) {
        throw new Exception("Error de conexión a la base de datos: " . $conexion->connect_error);
    }

    mysqli_select_db($conexion, 'pruebas');
    mysqli_query($conexion, 'SET NAMES "utf8"');
    date_default_timezone_set('America/Mexico_city');

// Si ocurre una excepción, se muestra un mensaje de error y se detiene la ejecución del script.

} catch (Exception $e) {
    die($e->getMessage());
}
*/
/*local */
$conexion = new mysqli("127.0.0.1:3305", "root", "", "smsiccom_inventario");
if ($conexion->connect_error) {
    die('Error de conexion a la base de datos. ' . $conexion->connect_error);
}
?>
