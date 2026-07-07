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
		$this->pass = $conexion->real_escape_string($_POST['pass_usuaM']);
		$this->pass2 = $conexion->real_escape_string($_POST['pass2_usuaM']);
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
		$this->pass = $conexion->real_escape_string($_POST['pass_usua_R']);
		$this->pass2 = $conexion->real_escape_string($_POST['pass2_usua_R']);
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
		while ($fila = $resultado->fetch_assoc()) {
			$usuarios[] = $fila;
		}
		echo json_encode($usuarios, JSON_NUMERIC_CHECK | JSON_UNESCAPED_UNICODE);
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
			$passCifrado = password_hash($this->pass, PASSWORD_DEFAULT);
			$consulta2 = "INSERT INTO usuario (nombre_usua, apellido_usua, pass_usua, email_usua, ci_usua, direccion_usua, celular_usua, rol_usua, activo_usua) VALUES ('$this->nombres', '$this->apellidos', '$passCifrado', '$this->email', '$this->ci', '$this->direccion', '$this->celular', '$this->rol', 1)";
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
		if (!empty($this->pass)) {
			$passCifrado = password_hash($this->pass, PASSWORD_DEFAULT);
			$consulta = "UPDATE usuario set nombre_usua='$this->nombres', apellido_usua='$this->apellidos', pass_usua='$passCifrado', email_usua='$this->email', ci_usua='$this->ci', direccion_usua='$this->direccion', celular_usua='$this->celular', rol_usua='$this->rol' WHERE id_usua='$this->id'";
		} else {
			$consulta = "UPDATE usuario set nombre_usua='$this->nombres', apellido_usua='$this->apellidos', email_usua='$this->email', ci_usua='$this->ci', direccion_usua='$this->direccion', celular_usua='$this->celular', rol_usua='$this->rol' WHERE id_usua='$this->id'";
		}
		$resultado = $conexion->query($consulta);
		if ($resultado){
			echo ('Usuario modificado exitosamente');
		}	
	}
	//-------Soft delete user (desactivar)
	public function deleteUser($id){
		include 'conexion.php';
		$consulta = "UPDATE usuario SET activo_usua = 0 WHERE id_usua='$id'";
		$resultado = $conexion->query($consulta);
		if ($resultado){
			echo ("Usuario desactivado correctamente");
		}
	}
	//-------Reactivar usuario
	public function reactivarUser($id){
		include 'conexion.php';
		$consulta = "UPDATE usuario SET activo_usua = 1 WHERE id_usua='$id'";
		$resultado = $conexion->query($consulta);
		if ($resultado){
			echo ("Usuario reactivado correctamente");
		}
	}
}
?>