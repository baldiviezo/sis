<?php
session_start();
$id = json_decode(file_get_contents('php://input'), true);
unset($_SESSION[$id.'_id_usua']);
unset($_SESSION[$id.'_nombre_usua']);
unset($_SESSION[$id.'_apellido_usua']);
unset($_SESSION[$id.'_rol_usua']);
//estruir cookie
session_destroy();
$nombreCookie = $id."_delete_var_session";
setcookie($nombreCookie, "", time() - 3600, "/");
unset($_COOKIE[$nombreCookie]);
?>