<?php 
class consultas {
	//------CUSTOMERS
	public function asignarValoresR(){
		//protegemos al servidor de los valores que el usuario esta introduciendo
		include 'conexion.php';
		//Primero vovlemos toda la palabra en minusculas y despues la primera letra en mayuscula
		$this->nombreCliente = ucwords(strtolower(trim($conexion->real_escape_string($_POST['nombre_clteR']))));
		$this->apellidoCliente = ucwords(strtolower(trim($conexion->real_escape_string($_POST['apellido_clteR']))));
		$this->nit_clte = $conexion->real_escape_string($_POST['nit_clteR']);
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
		$this->nit_clte = $conexion->real_escape_string($_POST['nit_clteM']);
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
		$this->nombreEmpresa = Strtoupper(trim($conexion->real_escape_string($_POST['nombre_empR'])));
		$this->siglaEmpresa = Strtoupper(trim($conexion->real_escape_string($_POST['sigla_empR'])));
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
		$this->nombreEmpresa = Strtoupper(trim($conexion->real_escape_string($_POST['nombre_empM'])));
		$this->siglaEmpresa = Strtoupper(trim($conexion->real_escape_string($_POST['sigla_empM'])));
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
		$this->sigla_empp = strtoupper(trim($conexion->real_escape_string($_POST['sigla_emppR'])));
		$this->nombre_empp = strtoupper(trim($conexion->real_escape_string($_POST['nombre_emppR'])));
		$this->nit_empp = trim($conexion->real_escape_string($_POST['nit_emppR']));
		$this->descuento_empp = trim($conexion->real_escape_string($_POST['descuento_emppR']));
		$this->direccion_empp = trim($conexion->real_escape_string($_POST['direccion_emppR']));
		$this->telefono_empp = trim($conexion->real_escape_string($_POST['telefono_emppR']));
	}
	public function asignarValoresMEP(){
		//protegemos al servidor de los valores que el usuario esta introduciendo
		include 'conexion.php';
		//Primero vovlemos toda la palabra en minusculas y despues la primera letra en mayuscula
		$this->id_empp = $conexion->real_escape_string($_POST['id_emppM']);
		$this->sigla_empp = strtoupper(trim($conexion->real_escape_string($_POST['sigla_emppM'])));
		$this->nombre_empp = strtoupper(trim($conexion->real_escape_string($_POST['nombre_emppM'])));
		$this->nit_empp = trim($conexion->real_escape_string($_POST['nit_emppM']));
		$this->descuento_empp = trim($conexion->real_escape_string($_POST['descuento_emppM']));
		$this->direccion_empp = trim($conexion->real_escape_string($_POST['direccion_emppM']));
		$this->telefono_empp = trim($conexion->real_escape_string($_POST['telefono_emppM']));
	}
	//<<----------------------------------- CUSTOMERS----------------------------------------------->>
	//------Leer clientes
	public function readCustomers(){
		include 'conexion.php';
		$consulta = "SELECT * FROM cliente INNER JOIN empresa ON cliente.fk_id_emp_clte = id_emp ORDER BY id_clte DESC";
		$resultado = $conexion->query($consulta);
		$numeroClientes = $resultado->num_rows;
		$clientes =  array();
		while ($fila = $resultado->fetch_assoc()){
			$datos = array ( 'id_clte'=>$fila['id_clte'], 'nombre_clte'=>$fila['nombre_clte'], 'apellido_clte'=>$fila['apellido_clte'], 'nit_clte'=>$fila['nit_clte'], 'nombre_emp'=>$fila['nombre_emp'], 'sigla_emp'=>$fila['sigla_emp'], 'nit_emp'=>$fila['nit_emp'], 'email_clte'=>$fila['email_clte'], 'direccion_clte'=>$fila['direccion_clte'], 'celular_clte'=>$fila['celular_clte'], 'fk_id_emp_clte'=>$fila['fk_id_emp_clte'], 'precio_emp'=>$fila['precio_emp']);
			$clientes['clte_'.$fila['id_clte']] = $datos;
			
		}
		echo json_encode($clientes, JSON_UNESCAPED_UNICODE);
	}
	//------Registrar un cliente
	public function createCustomer(){
		include 'conexion.php';
		$consulta = "INSERT INTO cliente (nombre_clte, apellido_clte, nit_clte, email_clte, direccion_clte, celular_clte, fk_id_emp_clte) VALUES ('$this->nombreCliente', '$this->apellidoCliente', '$this->nit_clte', '$this->email_clte', '$this->direccion_clte' , '$this->celularCliente', '$this->empresaCliente')";
		$resultado = $conexion->query($consulta);
		echo ("Cliente creado con éxito");
	}
	//------Actualizar un cliente
	public function updateCustomer(){
		include 'conexion.php';
		$consulta = "UPDATE cliente set nombre_clte='$this->nombreCliente', apellido_clte='$this->apellidoCliente', nit_clte='$this->nit_clte', email_clte='$this->email_clte', direccion_clte='$this->direccion_clte', celular_clte='$this->celularCliente', fk_id_emp_clte='$this->empresaCliente' WHERE id_clte='$this->id'";
		$resultado = $conexion->query($consulta);
		echo ("Cliente modificado con éxito");
	}
	//------Borrar un cliente
	public function deleteCustomer($id){
		include 'conexion.php';
		//Comprobar si el cliente tiene alguna proforma
		$consulta = "SELECT * FROM proforma WHERE fk_id_clte_prof = '$id'";
		$resultado = $conexion->query($consulta);
		$numeroProformas = $resultado->num_rows;
		if ($numeroProformas > 0){
			echo "No se puede eliminar, El cliente está siendo utilizada por una proforma";
		}else{
			//Comprobar si el cliente tiene alguna proforma modificada
			$consulta = "SELECT * FROM mdf_proforma WHERE fk_id_clte_mprof = '$id'";
			$resultado = $conexion->query($consulta);
			$numeroProformas = $resultado->num_rows;
			if ($numeroProformas > 0){
				echo "No se puede eliminar, El cliente está siendo utilizada por una proforma modificada";
			}else{
				$consulta = "DELETE FROM cliente WHERE id_clte='$id'";
				$resultado = $conexion->query($consulta);
				if ($resultado){
					echo ("Cliente eliminado con éxito");
				}
			}
		}
	}
	//<<-----------------------------------ENTERPRISES----------------------------->>
	//------Leer empresas
	public function readEnterprises(){
		include 'conexion.php';
		$consulta = "SELECT * FROM empresa ORDER BY id_emp DESC";
		$resultado = $conexion->query($consulta);
		$numeroClientes = $resultado->num_rows;
		$empresas =  array();
		while ($fila = $resultado->fetch_assoc()){
			$datos = array ( 'id_emp'=>$fila['id_emp'], 'nombre_emp'=>$fila['nombre_emp'], 'sigla_emp'=>$fila['sigla_emp'], 'nit_emp'=>$fila['nit_emp'], 'precio_emp'=>$fila['precio_emp'], 'direccion_emp'=>$fila['direccion_emp'], 'telefono_emp'=>$fila['telefono_emp']);
			$empresas['id_emp_'.$fila['id_emp']] = $datos;
		}
		echo json_encode($empresas, JSON_UNESCAPED_UNICODE);
	}
	//------Crear una empresa
	public function createEnterprise(){
		include 'conexion.php';
		$consulta = "SELECT * FROM empresa WHERE nombre_emp ='$this->nombreEmpresa'";
		$resultado = $conexion->query($consulta);
		$numeroClientes = $resultado->num_rows;
		if ($numeroClientes > 0){
			echo ("La empresa ya existe");
		}else{
			$consulta = "INSERT INTO empresa (nombre_emp, sigla_emp, nit_emp, precio_emp, direccion_emp, telefono_emp) VALUES ('$this->nombreEmpresa', '$this->siglaEmpresa', '$this->nitEmpresa', '$this->precioEmpresa', '$this->direccionEmpresa', '$this->telefonoEmpresa')";
			$resultado = $conexion->query($consulta);
			//Crear cliente automaticamente
			$consulta = "SELECT * FROM empresa WHERE nombre_emp ='$this->nombreEmpresa'";
			$resultado = $conexion->query($consulta);
			$fila = $resultado->fetch_assoc();
			$id_emp = $fila['id_emp'];
			$consulta = "INSERT INTO cliente (nombre_clte, apellido_clte, celular_clte, fk_id_emp_clte) VALUES ('', '', '', '$id_emp')";
			$resultado = $conexion->query($consulta);
			echo ("Empresa creada con éxito");
		}
	}
	//------Actualizar una empresa
	public function updateEnterprise(){
		include 'conexion.php';
		$consulta = "SELECT * FROM empresa WHERE nombre_emp ='$this->nombreEmpresa'";
		$resultado = $conexion->query($consulta);
		$numeroFilas = $resultado->num_rows;
		if($numeroFilas > 0){
			$empresa = $resultado->fetch_assoc();
			$id_emp = $empresa['id_emp'];
			if($id_emp == $this->idEmpresa){
				$this->consultaUpdateEnterprise();
			}else{
				echo json_encode("La empresa ya existe");
			}
		}else{
			$this->consultaUpdateEnterprise();
		}		
	}
	public function consultaUpdateEnterprise(){
		include 'conexion.php';
		$consulta = "UPDATE empresa set nombre_emp='$this->nombreEmpresa', sigla_emp='$this->siglaEmpresa', nit_emp='$this->nitEmpresa', precio_emp='$this->precioEmpresa', direccion_emp='$this->direccionEmpresa', telefono_emp='$this->telefonoEmpresa' WHERE id_emp='$this->idEmpresa'";
		$resultado = $conexion->query($consulta);
		if ($resultado){
			echo ("Empresa modificado con éxito");
		}
	}
	//------Eliminar una empresa
	public function deleteEnterprise($id_emp){
		include 'conexion.php';
		
		$consulta = "SELECT * FROM cliente WHERE fk_id_emp_clte = '$id_emp'";
		$resultado = $conexion->query($consulta);
		$numeroClientes = $resultado->num_rows;
		if ($numeroClientes > 1){
			echo "No se puede eliminar, la empresa pertenece a un cliente";
		}else{
			//------Comprobar si la empresa esta siendo utilizada por una proforma
			$id_clte = $resultado->fetch_assoc()['id_clte'];
			$consulta = "SELECT * FROM proforma WHERE fk_id_clte_prof = '$id_clte'";
			$resultado = $conexion->query($consulta);
			$numeroProformas = $resultado->num_rows;
			if ($numeroProformas > 0){
				echo "No se puede eliminar, la empresa está siendo utilizada por una proforma";
			}else{
				$consulta = "DELETE FROM cliente WHERE fk_id_emp_clte='$id_emp'";
				$resultado = $conexion->query($consulta);
				$consulta = "DELETE FROM empresa WHERE id_emp='$id_emp'";
				$resultado = $conexion->query($consulta);
				echo 'Empresa eliminada con éxito';
			}
		}
	}
	//<<-----------------------------------SUPPLIER----------------------------->>
	//-----Read all supplier
	public function readSuppliers(){
		include 'conexion.php';
		$consulta = "SELECT * FROM proveedor INNER JOIN empresa_prov ON proveedor.fk_id_empp_prov = id_empp ORDER BY nombre_prov";
		$resultado = $conexion->query($consulta);
		$numeroProveedor = $resultado->num_rows;
		$proveedores =  array();
		if($numeroProveedor > 0){
			while ($fila = $resultado->fetch_assoc()){
				$datos = array ( 'id_prov'=>$fila['id_prov'], 'nombre_prov'=>$fila['nombre_prov'], 'apellido_prov'=>$fila['apellido_prov'], 'celular_prov'=>$fila['celular_prov'], 'fk_id_empp_prov'=>$fila['fk_id_empp_prov'], 'direccion_empp'=>$fila['direccion_empp'], 'telefono_empp'=>$fila['telefono_empp']);
				$proveedores[$fila['id_prov'].'_prov'] = $datos;
			}
			$json = json_encode($proveedores, JSON_UNESCAPED_UNICODE);
			echo $json;
		}else{
			echo json_encode('');
		}
	}
	//------Registrar un supplier
	public function createSupplier(){
		include 'conexion.php';
		$consulta = "INSERT INTO proveedor (nombre_prov, apellido_prov, celular_prov, fk_id_empp_prov) VALUES ('$this->nombre_prov', '$this->apellido_prov', '$this->celular_prov', '$this->empresa_prov')";
		$resultado = $conexion->query($consulta);
		echo 'Proveedor registrado con exito';
	}
	//------Actualizar un proveedor
	public function updateSupplier(){
		include 'conexion.php';
		$consulta = "UPDATE proveedor set nombre_prov='$this->nombre_prov', apellido_prov='$this->apellido_prov', celular_prov='$this->celular_prov', fk_id_empp_prov='$this->empresa_prov' WHERE id_prov='$this->id_prov'";
		$resultado = $conexion->query($consulta);
		echo 'Proveedor actualizado con exito';
	}
	//------Delete a supplier
	public function deleteSupplier($id){
		include 'conexion.php';
		$consulta = "DELETE FROM proveedor WHERE id_prov='$id'";
		$resultado = $conexion->query($consulta);
		if ($resultado){
			echo "Usuario eliminado con éxito";
		}
	}
	//<<----------------------------------- ENTERPRISE DE PROVEEDOR----------------------------->>
	//------Leer todas la empresas
	public function readEnterprisesP(){
		include 'conexion.php';
		$consulta = "SELECT * FROM empresa_prov ORDER BY id_empp ASC";
		$resultado = $conexion->query($consulta);
		$numeroClientes = $resultado->num_rows;
		$empresas =  array();
		if($numeroClientes > 0){
			while ($fila = $resultado->fetch_assoc()){
				$datos = array ( 'id_empp'=>$fila['id_empp'], 'sigla_empp'=>$fila['sigla_empp'], 'nombre_empp'=>$fila['nombre_empp'], 'nit_empp'=>$fila['nit_empp'], 'descuento_empp'=>$fila['descuento_empp'], 'direccion_empp'=>$fila['direccion_empp'], 'telefono_empp'=>$fila['telefono_empp']);
				$empresas[$fila['id_empp']] = $datos;
			}
			$json = json_encode($empresas, JSON_UNESCAPED_UNICODE);
			echo $json;
		}else{
			echo json_encode('');
		}
	}
	//------Crear una empresa
	public function createEnterpriseP(){
		include 'conexion.php';
		$consulta = "SELECT * FROM empresa_prov WHERE nombre_empp ='$this->nombre_empp'";
		$resultado = $conexion->query($consulta);
		$numeroClientes = $resultado->num_rows;
		if ($numeroClientes > 0){
			echo ("La empresa ya existe");
		}else{
			$consulta = "INSERT INTO empresa_prov (sigla_empp, nombre_empp, nit_empp, descuento_empp, direccion_empp, telefono_empp) VALUES ( '$this->sigla_empp', '$this->nombre_empp', '$this->nit_empp', '$this->descuento_empp', '$this->direccion_empp', '$this->telefono_empp')";
			$resultado = $conexion->query($consulta);
			//Crear cliente automaticamente
			$consulta = "SELECT * FROM empresa_prov WHERE nombre_empp ='$this->nombre_empp'";
			$resultado = $conexion->query($consulta);
			$fila = $resultado->fetch_assoc();
			$id_emp = $fila['id_empp'];
			$consulta = "INSERT INTO proveedor (nombre_prov, apellido_prov, celular_prov, fk_id_empp_prov) VALUES ('', '', '', '$id_emp')";
			$resultado = $conexion->query($consulta);
			echo ("Empresa creada exitosamente");
		}
	}
	//------Actualizar una empresa
	public function updateEnterpriseP(){
		include 'conexion.php';
		$consulta = "SELECT * FROM empresa_prov WHERE nombre_empp ='$this->nombre_empp'";
		$resultado = $conexion->query($consulta);
		$numeroFilas = $resultado->num_rows;
		if($numeroFilas > 0){
			$empresa = $resultado->fetch_assoc();
			$id_empp = $empresa['id_empp'];
			if($id_empp == $this->id_empp){
				$consulta = "UPDATE empresa_prov set sigla_empp='$this->sigla_empp', nombre_empp='$this->nombre_empp', nit_empp='$this->nit_empp', descuento_empp='$this->descuento_empp', direccion_empp='$this->direccion_empp', telefono_empp='$this->telefono_empp' WHERE id_empp='$this->id_empp'";
				$resultado = $conexion->query($consulta);
				echo ("Empresa actualizada exitosamente");
			}else{
				echo json_encode("El nombre de la empresa ya existe");
			}
		}else{
			$consulta = "UPDATE empresa_prov set sigla_empp='$this->sigla_empp', nombre_empp='$this->nombre_empp', nit_empp='$this->nit_empp', descuento_empp='$this->descuento_empp', direccion_empp='$this->direccion_empp', telefono_empp='$this->telefono_empp' WHERE id_empp='$this->id_empp'";
			$resultado = $conexion->query($consulta);
			echo ("Empresa actualizada exitosamente");
		}
	}
	//------Eliminar una empresa
	public function deleteEnterpriseP($id_empp){
		include 'conexion.php';
		$consulta = "SELECT * FROM proveedor WHERE fk_id_empp_prov = '$id_empp'";
		$resultado = $conexion->query($consulta);
		$numeroClientes = $resultado->num_rows;
		if ($numeroClientes > 1){
			echo ("No se puede eliminar, la empresa pertenece a un proveedor");
		}else{
			//----Comprobar si la empresa esta siendo utilizada por una orden de compra
			$id_prov = $resultado->fetch_assoc()['id_prov'];
			$consulta = "SELECT * FROM compra WHERE fk_id_prov_cmp = '$id_prov'";
			$resultado = $conexion->query($consulta);
			$numeroCompras = $resultado->num_rows;
			if ($numeroCompras > 0){
				echo "No se puede eliminar, la empresa está siendo utilizada por una orden de compra";
			}else{
				$consulta = "DELETE FROM proveedor WHERE fk_id_empp_prov='$id_empp'";
				$resultado = $conexion->query($consulta);
				$consulta = "DELETE FROM empresa_prov WHERE id_empp='$id_empp'";
				$resultado = $conexion->query($consulta);
				echo 'Empresa eliminada con éxito';
			}

			
		}
	}
}
?>