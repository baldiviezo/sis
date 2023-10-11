<?php 
class consultas {
	//------CUSTOMERS
	public function asignarValoresR(){
		//protegemos al servidor de los valores que el usuario esta introduciendo
		include 'conexion.php';
		//Primero vovlemos toda la palabra en minusculas y despues la primera letra en mayuscula
		$this->nombreCliente = ucwords(strtolower(trim($conexion->real_escape_string($_POST['nombre_clteR']))));
		$this->apellidoCliente = ucwords(strtolower(trim($conexion->real_escape_string($_POST['apellido_clteR']))));
		$this->email_clte = trim($conexion->real_escape_string($_POST['email_clteR']));
		$this->direccion_clte = trim($conexion->real_escape_string($_POST['direccion_clteR']));
		$this->celularCliente = $conexion->real_escape_string($_POST['celular_clteR']);
		$this->empresaCliente = $conexion->real_escape_string($_POST['fk_id_emp_clteR']);
	}
	public function asignarValoresM(){
		//protegemos al servidor de los valores que el usuario esta introduciendo
		include 'conexion.php';
		//Primero vovlemos toda la palabra en minusculas y despues la primera letra en mayuscula
		$this->id = $conexion->real_escape_string($_POST['id_clteM']);
		$this->nombreCliente = ucwords(strtolower(trim($conexion->real_escape_string($_POST['nombre_clteM']))));
		$this->apellidoCliente = ucwords(strtolower(trim($conexion->real_escape_string($_POST['apellido_clteM']))));
		$this->email_clte = trim($conexion->real_escape_string($_POST['email_clteM']));
		$this->direccion_clte = trim($conexion->real_escape_string($_POST['direccion_clteM']));
		$this->celularCliente = $conexion->real_escape_string($_POST['celular_clteM']);
		$this->empresaCliente = number_format($_POST['fk_id_emp_clteM']);
	}
	//-------ENTERPRISE
	public function asignarValoresRE(){
		//protegemos al servidor de los valores que el usuario esta introduciendo
		include 'conexion.php';
		//Primero vovlemos toda la palabra en minusculas y despues la primera letra en mayuscula
		$this->sigla_emp = $conexion->real_escape_string($_POST['sigla_empR']);
		$this->nombreEmpresa = Strtoupper(trim($conexion->real_escape_string($_POST['nombre_empR'])));
		$this->nitEmpresa = $conexion->real_escape_string($_POST['nit_empR']);
		$this->precioEmpresa = $conexion->real_escape_string($_POST['precio_empR']);
		$this->direccionEmpresa = $conexion->real_escape_string($_POST['direccion_empR']);
		$this->telefonoEmpresa = $conexion->real_escape_string($_POST['telefono_empR']);
	}
	public function asignarValoresME(){
		//protegemos al servidor de los valores que el usuario esta introduciendo
		include 'conexion.php';
		//Primero vovlemos toda la palabra en minusculas y despues la primera letra en mayuscula
		$this->idEmpresa = $conexion->real_escape_string($_POST['id_empM']);
		$this->sigla_emp = $conexion->real_escape_string($_POST['sigla_empM']);
		$this->nombreEmpresa = Strtoupper(trim($conexion->real_escape_string($_POST['nombre_empM'])));
		$this->nitEmpresa = $conexion->real_escape_string($_POST['nit_empM']);
		$this->precioEmpresa = $conexion->real_escape_string($_POST['precio_empM']);
		$this->direccionEmpresa = $conexion->real_escape_string($_POST['direccion_empM']);
		$this->telefonoEmpresa = $conexion->real_escape_string($_POST['telefono_empM']);
	}
	//--------SUPPLIER
	public function asignarValoresPR(){
		//protegemos al servidor de los valores que el usuario esta introduciendo
		include 'conexion.php';
		//Primero vovlemos toda la palabra en minusculas y despues la primera letra en mayuscula
		$this->nombre_prov = ucwords(strtolower(trim($conexion->real_escape_string($_POST['nombre_provR']))));
		$this->apellido_prov = ucwords(strtolower(trim($conexion->real_escape_string($_POST['apellido_provR']))));
		$this->celular_prov = $conexion->real_escape_string($_POST['celular_provR']);
		$this->empresa_prov = $conexion->real_escape_string($_POST['fk_id_empp_provR']);
	}
	public function asignarValoresPM(){
		//protegemos al servidor de los valores que el usuario esta introduciendo
		include 'conexion.php';
		//Primero vovlemos toda la palabra en minusculas y despues la primera letra en mayuscula
		$this->id_prov = $conexion->real_escape_string($_POST['id_provM']);
		$this->nombre_prov = ucwords(strtolower(trim($conexion->real_escape_string($_POST['nombre_provM']))));
		$this->apellido_prov = ucwords(strtolower(trim($conexion->real_escape_string($_POST['apellido_provM']))));
		$this->celular_prov = $conexion->real_escape_string($_POST['celular_provM']);
		$this->empresa_prov = number_format($_POST['fk_id_empp_provM']);
	}
	//-------ENTERPRISES PARA PROVEEDORES
	public function asignarValoresREP(){
		//protegemos al servidor de los valores que el usuario esta introduciendo
		include 'conexion.php';
		//Primero vovlemos toda la palabra en minusculas y despues la primera letra en mayuscula
		$this->nombreEmpresa = ucwords(strtolower(trim($conexion->real_escape_string($_POST['nombreEmpresaR']))));
		$this->sigla_empp = $conexion->real_escape_string($_POST['sigla_emppR']);
		$this->direccionEmpresa = $conexion->real_escape_string($_POST['direccionEmpresaR']);
		$this->telefonoEmpresa = $conexion->real_escape_string($_POST['telefonoEmpresaR']);
	}
	public function asignarValoresMEP(){
		//protegemos al servidor de los valores que el usuario esta introduciendo
		include 'conexion.php';
		//Primero vovlemos toda la palabra en minusculas y despues la primera letra en mayuscula
		$this->idEmpresa = $conexion->real_escape_string($_POST['id_empp']);
		$this->nombreEmpresa = ucwords(strtolower(trim($conexion->real_escape_string($_POST['nombre_empp']))));
		$this->sigla_empp = $conexion->real_escape_string($_POST['sigla_empp']);
		$this->direccionEmpresa = $conexion->real_escape_string($_POST['direccion_empp']);
		$this->telefonoEmpresa = $conexion->real_escape_string($_POST['telefono_empp']);
	}
	//<<----------------------------------- cUSTOMERS----------------------------------------------->>
	//------Leer clientes
	public function readCustomers(){
		include 'conexion.php';
		$consulta = "SELECT * FROM cliente INNER JOIN empresa ON cliente.fk_id_emp_clte = id_emp ORDER BY id_clte DESC";
		$resultado = $conexion->query($consulta);
		$numeroClientes = $resultado->num_rows;
		$clientes =  array();
		while ($fila = $resultado->fetch_assoc()){
			$datos = array ( 'id_clte'=>$fila['id_clte'], 'nombre_clte'=>$fila['nombre_clte'], 'apellido_clte'=>$fila['apellido_clte'], 'email_clte'=>$fila['email_clte'],'direccion_clte'=>$fila['direccion_clte'],'celular_clte'=>$fila['celular_clte'], 'fk_id_emp_clte'=>$fila['fk_id_emp_clte'], 'nombre_emp'=>$fila['nombre_emp']);
			$clientes['clte_'.$fila['id_clte']] = $datos;
			
		}
		echo json_encode($clientes, JSON_UNESCAPED_UNICODE);
	}
	//------Registrar un cliente
	public function createCustomer(){
		include 'conexion.php';
		$consulta = "INSERT INTO cliente (nombre_clte, apellido_clte, email_clte, direccion_clte, celular_clte, fk_id_emp_clte) VALUES ('$this->nombreCliente', '$this->apellidoCliente', '$this->email_clte', '$this->direccion_clte' , '$this->celularCliente', '$this->empresaCliente')";
		$resultado = $conexion->query($consulta);
	}
	//------Actualizar un cliente
	public function updateCustomer(){
		include 'conexion.php';
		$consulta = "UPDATE cliente set nombre_clte='$this->nombreCliente', apellido_clte='$this->apellidoCliente', email_clte='$this->email_clte', direccion_clte='$this->direccion_clte', celular_clte='$this->celularCliente', fk_id_emp_clte='$this->empresaCliente' WHERE id_clte='$this->id'";
		$resultado = $conexion->query($consulta);
	}
	//------Borrar un cliente
	public function deleteCustomer($id){
		include 'conexion.php';
		$consulta = "DELETE FROM cliente WHERE id_clte='$id'";
		$resultado = $conexion->query($consulta);
		if ($resultado){
			echo json_encode("Usuario eliminado con éxito");
		}
	}
	//<<-----------------------------------ENTERPRISES----------------------------->>
	//------Leer empresas
	public function readEnterprises(){
		include 'conexion.php';
		$consulta = "SELECT * FROM empresa ORDER BY nombre_emp ASC";
		$resultado = $conexion->query($consulta);
		$numeroClientes = $resultado->num_rows;
		$empresas =  array();
		while ($fila = $resultado->fetch_assoc()){
			$datos = array ( 'id_emp'=>$fila['id_emp'], 'sigla_emp'=>$fila['sigla_emp'], 'nombre_emp'=>$fila['nombre_emp'], 'nit_emp'=>$fila['nit_emp'], 'precio_emp'=>$fila['precio_emp'], 'direccion_emp'=>$fila['direccion_emp'], 'telefono_emp'=>$fila['telefono_emp']);
			$empresas['id_emp_'.$fila['id_emp']] = $datos;
		}
		echo json_encode($empresas, JSON_UNESCAPED_UNICODE);
	}
	//------Crear una empresa
	public function createEnterprise(){
		include 'conexion.php';
		/*$consulta = "SELECT * FROM empresa WHERE sigla_emp ='$this->sigla_emp'";
		$resultado = $conexion->query($consulta);
		$numeroClientes = $resultado->num_rows;
		if ($numeroClientes > 0){
			echo ("La empresa ya existe");
		}else{*/
			$consulta = "INSERT INTO empresa (sigla_emp, nombre_emp, nit_emp, precio_emp, direccion_emp, telefono_emp) VALUES ('$this->sigla_emp', '$this->nombreEmpresa', '$this->nitEmpresa', '$this->precioEmpresa', '$this->direccionEmpresa', '$this->telefonoEmpresa')";
			$resultado = $conexion->query($consulta);
			echo ("registrado");
			//Crear cliente automaticamente
			$consulta = "SELECT * FROM empresa WHERE nombre_emp ='$this->nombreEmpresa'";
			$resultado = $conexion->query($consulta);
			$fila = $resultado->fetch_assoc();
			$id_emp = $fila['id_emp'];
			$consulta = "INSERT INTO cliente (nombre_clte, apellido_clte, celular_clte, fk_id_emp_clte) VALUES ('', '', '', '$id_emp')";
			$resultado = $conexion->query($consulta);
		/*}*/
	}
	//------Actualizar una empresa
	public function updateEnterprise(){
		include 'conexion.php';
		$consulta = "SELECT * FROM empresa WHERE sigla_emp ='$this->sigla_emp'";
		$resultado = $conexion->query($consulta);
		$numeroFilas = $resultado->num_rows;
		/*if($numeroFilas > 0){
			$empresa = $resultado->fetch_assoc();
			$id_emp = $empresa['id_emp'];
			if($id_emp == $this->idEmpresa){
				$consulta = "UPDATE empresa set sigla_emp='$this->sigla_emp', nombre_emp='$this->nombreEmpresa', direccion_emp='$this->direccionEmpresa', telefono_emp='$this->telefonoEmpresa' WHERE id_emp='$this->idEmpresa'";
				$resultado = $conexion->query($consulta);
				if ($resultado){echo 'modificado';}
			}else{
				echo "La empresa ya existe";
			}
		}else{*/
			$consulta = "UPDATE empresa set sigla_emp='$this->sigla_emp', nombre_emp='$this->nombreEmpresa', nit_emp='$this->nitEmpresa', precio_emp='$this->precioEmpresa', direccion_emp='$this->direccionEmpresa', telefono_emp='$this->telefonoEmpresa' WHERE id_emp='$this->idEmpresa'";
			$resultado = $conexion->query($consulta);
			if ($resultado){
				echo 'modificado';
			}
		/*}*/
	}
	//------Eliminar una empresa
	public function deleteEnterprise($id_emp){
		include 'conexion.php';
		$consulta = "SELECT * FROM cliente WHERE fk_id_emp_clte = '$id_emp'";
		$resultado = $conexion->query($consulta);
		$numeroClientes = $resultado->num_rows;
		if ($numeroClientes > 1){
			echo "No se puede eliminar, la empresa esta siendo utilizado";
		}else{
			$consulta = "DELETE FROM cliente WHERE fk_id_emp_clte='$id_emp'";
			$resultado = $conexion->query($consulta);
			$consulta = "DELETE FROM empresa WHERE id_emp='$id_emp'";
			$resultado = $conexion->query($consulta);
			echo 'Eliminado';
		}
	}


	//------PARA LA compta --Leer todos los proveedores
	public function leerProveedor(){
		include 'conexion.php';
		$id_empp = $_POST['id_empp'];
		$consulta = "SELECT * FROM proveedor INNER JOIN empresa_prov ON proveedor.fk_id_empp_prov = id_empp WHERE id_empp ='$id_empp' ORDER BY nombre_prov";
		$resultado = $conexion->query($consulta);
		$numeroClientes = $resultado->num_rows;
		$clientes =  array();
		if($numeroClientes > 0){
			while ($fila = $resultado->fetch_assoc()){
				$datos = array ( 'id_prov'=>$fila['id_prov'], 'nombre_prov'=>$fila['nombre_prov'], 'apellido_prov'=>$fila['apellido_prov'], 'celular_prov'=>$fila['celular_prov'], 'fk_id_empp_prov'=>$fila['nombre_empp'], 'direccion_empp'=>$fila['direccion_empp'], 'telefono_empp'=>$fila['telefono_empp']);
				$clientes[$fila['id_prov'].'_prov'] = $datos;
			}
			$json = json_encode($clientes, JSON_UNESCAPED_UNICODE);
			echo $json;
		}else{
			echo json_encode('');
		}
	}
	//<<-----------------------------------CREATE, READ, UPDATE AND DELETE SUPPLIER----------------------------->>
	//------Registrar un supplier
	public function createSupplier(){
		include 'conexion.php';
		$consulta = "INSERT INTO proveedor (nombre_prov, apellido_prov, celular_prov, fk_id_empp_prov) VALUES ('$this->nombre_prov', '$this->apellido_prov', '$this->celular_prov', '$this->empresa_prov')";
		$resultado = $conexion->query($consulta);
	}
	//-----Read all supplier
	public function readAllSupplier(){
		include 'conexion.php';
		$consulta = "SELECT * FROM proveedor INNER JOIN empresa_prov ON proveedor.fk_id_empp_prov = id_empp ORDER BY nombre_prov";
		$resultado = $conexion->query($consulta);
		$numeroProveedor = $resultado->num_rows;
		$proveedores =  array();
		if($numeroProveedor > 0){
			while ($fila = $resultado->fetch_assoc()){
				$datos = array ( 'id_prov'=>$fila['id_prov'], 'nombre_prov'=>$fila['nombre_prov'], 'apellido_prov'=>$fila['apellido_prov'], 'celular_prov'=>$fila['celular_prov'], 'fk_id_empp_prov'=>$fila['nombre_empp'], 'direccion_empp'=>$fila['direccion_empp'], 'telefono_empp'=>$fila['telefono_empp']);
				$proveedores[$fila['id_prov'].'_prov'] = $datos;
			}
			$json = json_encode($proveedores, JSON_UNESCAPED_UNICODE);
			echo $json;
		}else{
			echo json_encode('');
		}
	}
	//------read a suppliers
	public function readASupplier($id){
		include 'conexion.php';
		$consulta = "SELECT * FROM proveedor INNER JOIN empresa_prov ON proveedor.fk_id_empp_prov = id_empp WHERE id_prov='$id'";
		$resultado = $conexion->query($consulta);
		$cliente = $resultado->fetch_assoc();
		$id_empp = $cliente["fk_id_empp_prov"]." ";
		$datos = array ('id_prov'=>$cliente['id_prov'], 'nombreCliente'=>$cliente['nombre_prov'], 'apellidoCliente'=>$cliente['apellido_prov'], 'celularCliente'=>$cliente['celular_prov'], $id_empp=>$cliente['nombre_empp']);
		$json = json_encode($datos, JSON_UNESCAPED_UNICODE);
		echo $json;
	}
	//------Actualizar un proveedor
	public function updateSupplier(){
		include 'conexion.php';
		$consulta = "UPDATE proveedor set nombre_prov='$this->nombre_prov', apellido_prov='$this->apellido_prov', celular_prov='$this->celular_prov', fk_id_empp_prov='$this->empresa_prov' WHERE id_prov='$this->id_prov'";
		$resultado = $conexion->query($consulta);
	}
	//------Delete a supplier
	public function deleteSupplier($id){
		include 'conexion.php';
		$consulta = "DELETE FROM proveedor WHERE id_prov='$id'";
		$resultado = $conexion->query($consulta);
		if ($resultado){
			echo json_encode("Usuario eliminado con éxito");
		}
	}
	public function readAllEnterprise(){
		include 'conexion.php';
		$input = isset($_POST['readAllEnterprise'])?$conexion->real_escape_string($_POST['readAllEnterprise']):null;
		//convertir String en array
		$columnas = isset($_POST['selectSearchEmpMW'])?explode(',',$_POST['selectSearchEmpMW']):null;
		$where = "WHERE (";
		$numeroDeColumnas = isset($_POST['selectSearchEmpMW'])?count($columnas):null;
		$orderBy = $_POST['orderByEnterprise']; 
		
		for ($i = 0; $i < $numeroDeColumnas; $i++) {
			$where .= $columnas[$i] . " LIKE '%" . $input . "%' OR ";
		}
		//Elimina ' OR', esto por seguridad, por una inyeccion sql
		$where = substr_replace($where, "", -3);
		$where .= ")";

		$consulta = "SELECT * FROM empresa $where ORDER BY $orderBy";
		$resultado = $conexion->query($consulta);
		$numeroClientes = $resultado->num_rows;
		$empresas =  array();
		if($numeroClientes > 0){
			while ($fila = $resultado->fetch_assoc()){
				$datos = array ( 'id_emp'=>$fila['id_emp'], 'sigla_emp'=>$fila['sigla_emp'], 'nombre_emp'=>$fila['nombre_emp'], 'direccion_emp'=>$fila['direccion_emp'], 'telefono_emp'=>$fila['telefono_emp']);
				$empresas[$fila['nombre_emp']] = $datos;
			}
			$json = json_encode($empresas, JSON_UNESCAPED_UNICODE);
			echo $json;
		}else{
			echo json_encode('');
		}
	}

	//<<-----------------------------------CRUD ENTERPRISE PROVEEDOR----------------------------->>
	//------Crear una empresa
	public function createEnterpriseP(){
		include 'conexion.php';
		$consulta = "SELECT * FROM empresa_prov WHERE sigla_empp ='$this->sigla_empp'";
		$resultado = $conexion->query($consulta);
		$numeroClientes = $resultado->num_rows;
		if ($numeroClientes > 0){
			echo ("La empresa ya existe");
		}else{
			$consulta = "INSERT INTO empresa_prov (sigla_empp, nombre_empp, direccion_empp, telefono_empp) VALUES ('$this->sigla_empp', '$this->nombreEmpresa', '$this->direccionEmpresa', '$this->telefonoEmpresa')";
			$resultado = $conexion->query($consulta);
			echo ("registrado");

			//Crear cliente automaticamente
			/*$consulta = "SELECT * FROM empresa_prov WHERE sigla_empp ='$this->sigla_empp'";
			$resultado = $conexion->query($consulta);
			$fila = $resultado->fetch_assoc();
			$id_empp = $fila['id_empp'];
			$consulta = "INSERT INTO cliente_prov (nombre_clte, apellido_clte, celular_clte, fk_id_empp_clte) VALUES (' ', ' ', ' ', '$id_empp')";
			$resultado = $conexion->query($consulta);*/
		}
	}
	//------Leer todas la empresas
	public function readEnterpriseP(){
		include 'conexion.php';
		$consulta = "SELECT * FROM empresa_prov ORDER BY sigla_empp ASC";
		$resultado = $conexion->query($consulta);
		$numeroClientes = $resultado->num_rows;
		$empresas =  array();
		if($numeroClientes > 0){
			while ($fila = $resultado->fetch_assoc()){
				$datos = array ( 'id_empp'=>$fila['id_empp'], 'sigla_empp'=>$fila['sigla_empp'], 'nombre_empp'=>$fila['nombre_empp'], 'direccion_empp'=>$fila['direccion_empp'], 'telefono_empp'=>$fila['telefono_empp']);
				$empresas[$fila['nombre_empp']] = $datos;
			}
			$json = json_encode($empresas, JSON_UNESCAPED_UNICODE);
			echo $json;
		}else{
			echo json_encode('');
		}
	}
	//------Actualizar una empresa
	public function updateEnterpriseP(){
		include 'conexion.php';
		$consulta = "SELECT * FROM empresa_prov WHERE sigla_empp ='$this->sigla_empp'";
		$resultado = $conexion->query($consulta);
		$numeroFilas = $resultado->num_rows;
		if($numeroFilas > 0){
			$empresa = $resultado->fetch_assoc();
			$id_empp = $empresa['id_empp'];
			if($id_empp == $this->idEmpresa){
				$consulta = "UPDATE empresa set sigla_empp='$this->sigla_empp', nombre_empp='$this->nombreEmpresa', direccion_empp='$this->direccionEmpresa', telefono_empp='$this->telefonoEmpresa' WHERE id_empp='$this->idEmpresa'";
				$resultado = $conexion->query($consulta);
				if ($resultado){
					echo ('modificado');
				}
			}else{
				echo json_encode("La empresa ya existe");
			}
		}else{
			$consulta = "UPDATE empresa_prov set sigla_empp='$this->sigla_empp', nombre_empp='$this->nombreEmpresa', direccion_empp='$this->direccionEmpresa', telefono_empp='$this->telefonoEmpresa' WHERE id_empp='$this->idEmpresa'";
			$resultado = $conexion->query($consulta);
			if ($resultado){
				echo ('modificado');
			}
		}
	}
	//------Eliminar una empresa
	public function deleteEnterpriseP($id_empp){
		include 'conexion.php';
		$consulta = "SELECT * FROM proveedor WHERE fk_id_empp_prov = '$id_empp'";
		$resultado = $conexion->query($consulta);
		$numeroClientes = $resultado->num_rows;
		if ($numeroClientes > 0){
			echo ("No se puede eliminar, la empresa esta siendo utilizado");
		}else{
			$consulta = "DELETE FROM empresa_prov WHERE id_empp='$id_empp'";
			$resultado = $conexion->query($consulta);
			echo 'Eliminado';
		}
	}
	public function readAllEnterpriseP(){
		include 'conexion.php';
		$input = isset($_POST['readAllEnterprise'])?$conexion->real_escape_string($_POST['readAllEnterprise']):null;
		//convertir String en array
		$columnas = isset($_POST['selectSearchEmpMW'])?explode(',',$_POST['selectSearchEmpMW']):null;
		$where = "WHERE (";
		$numeroDeColumnas = isset($_POST['selectSearchEmpMW'])?count($columnas):null;
		$orderBy = $_POST['orderByEnterprise']; 
		
		for ($i = 0; $i < $numeroDeColumnas; $i++) {
			$where .= $columnas[$i] . " LIKE '%" . $input . "%' OR ";
		}
		//Elimina ' OR', esto por seguridad, por una inyeccion sql
		$where = substr_replace($where, "", -3);
		$where .= ")";

		$consulta = "SELECT * FROM empresa_prov $where ORDER BY $orderBy";
		$resultado = $conexion->query($consulta);
		$numeroClientes = $resultado->num_rows;
		$empresas =  array();
		if($numeroClientes > 0){
			while ($fila = $resultado->fetch_assoc()){
				$datos = array ( 'id_empp'=>$fila['id_empp'], 'sigla_empp'=>$fila['sigla_empp'], 'nombre_empp'=>$fila['nombre_empp'], 'direccion_empp'=>$fila['direccion_empp'], 'telefono_empp'=>$fila['telefono_empp']);
				$empresas[$fila['nombre_empp']] = $datos;
			}
			$json = json_encode($empresas, JSON_UNESCAPED_UNICODE);
			echo $json;
		}else{
			echo json_encode('');
		}
	}

}
?>