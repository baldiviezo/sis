<?php
session_start();
$id = json_decode(file_get_contents('php://input'), true);
// Verificar si la cookie está establecida y eliminar las variables de sesión
if (!isset($_COOKIE[$id.'_delete_var_session'])) {
    unset($_SESSION[$id.'_id_usua']);
    unset($_SESSION[$id.'_nombre_usua']);
    unset($_SESSION[$id.'_apellido_usua']);
    unset($_SESSION[$id.'_rol_usua']);
}
if (isset($_SESSION[$id.'_id_usua'])) {
    echo 'true';
}else{
    echo 'false';
}
?>