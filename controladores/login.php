<?php
//require producirá un error fatal (E_COMPILE_ERROR) y detendrá el script
//include solo producirá una advertencia (E_WARNING) y el script continuará
require '../modelos/comprobarUsuario.php';
if(isset($_POST['email'])&&isset($_POST['contraseña'])){
	comprobarUsuario();	
}
?>
