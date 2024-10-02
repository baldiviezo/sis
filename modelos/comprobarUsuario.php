<?php
function comprobarUsuario(){
	//toma todo el texto/código/marcado que existe en el archivo especificado y lo copia en el archivo que usa la declaración de inclusión.
	require 'conexion.php';
	//No usamos isset, las varibles $_POST si las recibe como un espacio vacion y isset los considera como definidos
	$usuario = $_POST['email'];
	$contraseña = $_POST['contraseña'];
	//Control de los datos enviados por el usario en el formulario de inicio de sesion
	if ($usuario != "" && $contraseña !="" ){
		$consulta = "SELECT * FROM  usuario WHERE email_usua ='$usuario'";
		$resultado = $conexion->query($consulta);
		$numeroFilas = $resultado->num_rows;
		if($numeroFilas > 0){
			$usuario = $resultado->fetch_assoc();
			$hash = $usuario['contraseña_usua'];
			if(password_verify($contraseña, $hash )){
				//craendo variables superglobales del usuario encontrado, se lo utiliza en el archivo accesoDeUsuario.php
				session_start();
				//info_celular e info_email usado para las proformas echas en fpdf
				//info_rol usado en comprobarRol.php
				$_SESSION[$usuario['id_usua'].'_id_usua']=$usuario['id_usua'];
				$_SESSION[$usuario['id_usua'].'_nombre_usua']=$usuario['nombre_usua'];
				$_SESSION[$usuario['id_usua'].'_apellido_usua']=$usuario['apellido_usua'];
				$_SESSION[$usuario['id_usua'].'_rol_usua']=$usuario['rol_usua'];
				$nameCookie = $usuario['id_usua'].'_delete_var_session';
				setcookie($nameCookie, true, time() + (3600*24*6), '/'); // Tiempo de expiración de 7 días
				//Array asociativo (calve, valor)
				$array = array(
					'id_usua' => $usuario['id_usua'],
					'nombres_usua' => $usuario['nombre_usua'],
					'apellidos_usua' => $usuario['apellido_usua'],
					'email_usua' => $usuario['email_usua'],
					'celular_usua' => $usuario['celular_usua'],
					'rol_usua' => $usuario['rol_usua']
				);
				//convertimos al array en un json string
				$json = json_encode($array, JSON_UNESCAPED_UNICODE);
				echo $json;
			}else{
				echo json_encode('La contraseña es incorrecta');
			}
		}else{
			echo json_encode('El usuario no existe');
		}
	}else{
		echo json_encode('Todos los campos son obligatorios');
	}
}
?>
