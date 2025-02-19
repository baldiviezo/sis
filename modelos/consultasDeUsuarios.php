<?php
class consultas {
	public function asignarValoresModificar (){
		include 'conexion.php';
		//protegemos al servidor de los valores que el usuario esta introduciendo
		//Primero vovlemos toda la palabra en minusculas y despues la primera letra en mayuscula
		//unwords pone la primera letra de la palabra en mayuscula
		//strtolower vuelve todo en minuscula
		$this->id = $conexion->real_escape_string($_POST['id_usuaM']);
		$this->nombres = ucwords(strtolower(trim($conexion->real_escape_string($_POST['nombre_usuaM']))));
		$this->apellidos = ucwords(strtolower(trim($conexion->real_escape_string($_POST['apellido_usuaM']))));
		$this->contraseña = $conexion->real_escape_string($_POST['contraseña_usuaM']);
		$this->contraseña2 = $conexion->real_escape_string($_POST['contraseña2_usuaM']);
		$this->email = $conexion->real_escape_string($_POST['email_usuaM']);
		$this->ci = $conexion->real_escape_string($_POST['ci_usuaM']);
		$this->direccion = $conexion->real_escape_string($_POST['direccion_usuaM']);
		$this->celular = $conexion->real_escape_string($_POST['celular_usuaM']);
		$this->rol = $conexion->real_escape_string($_POST['rol_usuaM']);
	}
	public function asignarValoresRegistrar (){
		include 'conexion.php';
		$this->nombres = ucwords(strtolower(trim($conexion->real_escape_string($_POST['nombre_usua_R']))));
		$this->apellidos = ucwords(strtolower(trim($conexion->real_escape_string($_POST['apellido_usua_R']))));
		$this->contraseña = $conexion->real_escape_string($_POST['contraseña_usua_R']);
		$this->contraseña2 = $conexion->real_escape_string($_POST['contraseña2_usua_R']);
		$this->email = $conexion->real_escape_string($_POST['email_usua_R']);
		$this->ci = $conexion->real_escape_string($_POST['ci_usua_R']);
		$this->direccion = $conexion->real_escape_string($_POST['direccion_usua_R']);
		$this->celular = $conexion->real_escape_string($_POST['celular_usua_R']);
		$this->rol = $conexion->real_escape_string($_POST['rol_usua_R']);
	}
	//------Read users
	function readUsers(){
		include 'conexion.php';
		$consulta;
		$consulta = "SELECT * FROM usuario ORDER BY nombre_usua ASC";
		$resultado = $conexion->query($consulta);
		$numeroFilas = $resultado->num_rows;
		$usuarios =  array();
		if($numeroFilas > 0){
			while ($fila = $resultado->fetch_assoc()){
				$datos = array ( 'id_usua'=>$fila['id_usua'], 'nombre_usua'=>$fila['nombre_usua'], 'apellido_usua'=>$fila['apellido_usua'], 'email_usua'=>$fila['email_usua'], 'ci_usua'=>$fila['ci_usua'], 'direccion_usua'=>$fila['direccion_usua'], 'celular_usua'=>$fila['celular_usua'],  'rol_usua'=>$fila['rol_usua']);
				$usuarios['usua_'.$fila['id_usua']] = $datos;
			}
			$json = json_encode($usuarios, JSON_UNESCAPED_UNICODE);
			echo $json;
		}
	}
	//-------Create user
	public function createUser(){
		include 'conexion.php';
		//Verificar que NO exista el mismo correo
		$consulta = "SELECT * FROM usuario WHERE email_usua ='$this->email'";
		$resultado = $conexion->query($consulta);
		$usuario = $resultado->fetch_assoc();
		if (isset($usuario['email_usua'])){
			echo ("El email ya existe");
		}else{
			$passCifrado = password_hash($this->contraseña, PASSWORD_DEFAULT);
			$consulta2 = "INSERT INTO usuario (nombre_usua, apellido_usua, contraseña_usua, email_usua, ci_usua, direccion_usua, celular_usua, rol_usua) VALUES ('$this->nombres', '$this->apellidos', '$passCifrado', '$this->email', '$this->ci', '$this->direccion', '$this->celular', '$this->rol')";
			$resultado2 = $conexion->query($consulta2);
			echo ("Usuario creado correctamente");
		}
	}
	//-------Update user
	public function updateUser(){
		include 'conexion.php';
		$consulta = "SELECT * FROM usuario WHERE email_usua ='$this->email'";
		$resultado = $conexion->query($consulta);
		$numeroFilas = $resultado->num_rows;
		if($numeroFilas > 0){
			$usuario = $resultado->fetch_assoc();
			$id_usua = $usuario['id_usua'];
			if($id_usua == $this->id){
				$this->consultaUpdateUser();
			}else{
				echo json_encode("El email ya existe");
			}
		}else{
			$this->consultaUpdateUser();
		}		
	}
	public function consultaUpdateUser(){
		include 'conexion.php';
		$passCifrado = password_hash($this->contraseña, PASSWORD_DEFAULT);
		$consulta = "UPDATE usuario set nombre_usua='$this->nombres', apellido_usua='$this->apellidos', contraseña_usua='$passCifrado', email_usua='$this->email', ci_usua='$this->ci', direccion_usua='$this->direccion', celular_usua='$this->celular', rol_usua='$this->rol' WHERE id_usua='$this->id'";
		$resultado = $conexion->query($consulta);
		if ($resultado){
			echo ('Usuario modificado exitosamente');
		}	
	}
	//-------Delete user
	public function deleteUser($id){
		include 'conexion.php';
		//------Verificar si el usuario tiene una proforma
		$consulta = "SELECT * FROM proforma WHERE fk_id_usua_prof = '$id'";
		$resultado = $conexion->query($consulta);
		$numeroProformas = $resultado->num_rows;
		if ($numeroProformas > 0){
			echo "No se puede eliminar, El usuario está siendo utilizado por una proforma";
		}else{
			//------Verificar si el usuario tiene una nota de entrega
			$consulta2 = "SELECT * FROM nota_entrega WHERE fk_id_usua_ne = '$id'";
			$resultado2 = $conexion->query($consulta2);
			$numeroNotas = $resultado2->num_rows;
			if ($numeroNotas > 0){
				echo "No se puede eliminar, El usuario está siendo utilizado por una nota de entrega";
			}else{
				//------Verificar si el usuario tiene una Venta
				$consulta3 = "SELECT * FROM venta WHERE fk_id_usua_vnt = '$id'";
				$resultado3 = $conexion->query($consulta3);
				$numeroVentas = $resultado3->num_rows;
				if ($numeroVentas > 0){
					echo "No se puede eliminar, El usuario está siendo utilizado por una venta";
				}else{
					//------Verificar si el usuario tiene una Compra
					$consulta4 = "SELECT * FROM compra WHERE fk_id_usua_cmp = '$id'";
					$resultado4 = $conexion->query($consulta4);
					$numeroCompras = $resultado4->num_rows;
					if ($numeroCompras > 0){
						echo "No se puede eliminar, El usuario está siendo utilizado por una compra";
					}else{
						//------Verificar si el usuario tiene una Armado
						$consulta5 = "SELECT * FROM armado WHERE fk_id_usua_rmd = '$id'";
						$resultado5 = $conexion->query($consulta5);
						$numeroArmados = $resultado5->num_rows;
						if ($numeroArmados > 0){
							echo "No se puede eliminar, El usuario está sendo utilizado por un armado";
						}else{
							$consulta = "DELETE FROM usuario WHERE id_usua='$id'";
							$resultado = $conexion->query($consulta);
							if ($resultado){
								echo ("Usuario eliminado con éxito");
							}
						}						
					}
				}
			}
		}
	}
}
?>