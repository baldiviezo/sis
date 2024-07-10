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
				$_SESSION['info_id_usua']=$usuario['id_usua'];
				$_SESSION['info_nombres']=$usuario['nombre_usua'];
				$_SESSION['info_apellidos']=$usuario['apellido_usua'];
				$_SESSION['info_rol']=$usuario['rol_usua'];
				//Array asociativo (calve, valor)
				$array = array(
					'id' => $usuario['id_usua'],
					'nombres' => $usuario['nombre_usua'],
					'apellidos' => $usuario['apellido_usua'],
					'email' => $usuario['email_usua'],
					'celular' => $usuario['celular_usua'],
					'rol' => $usuario['rol_usua']
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
