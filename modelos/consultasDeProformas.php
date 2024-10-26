<?php 
class consultas{
	//------Guardamos los datos de la proforma
	public function asignarValores ($id_usua){
		//protegemos al servidor de los valores que el usuario esta introduciendo
		include 'conexion.php';
		//Ponemos TRIM para el momento de comparar, al no usar trim se puede guardar una variable con espasio en la base de datos y al comparar con la misma variable ya guardada en el fronent el espacio se quita y al comparar no son las mismas
		$this->fecha = trim($conexion->real_escape_string($_POST['fecha_profR']));
		$this->cliente = trim($conexion->real_escape_string($_POST['fk_id_clte_profR']));
		$this->encargado = $id_usua;
		$this->tiempoValido = trim($conexion->real_escape_string($_POST['tpo_valido_profR']));
		$this->condicionesDePago = trim($conexion->real_escape_string($_POST['cond_pago_profR']));
		$this->tiempoDeEntrega = trim($conexion->real_escape_string($_POST['tpo_entrega_profR']));
		$this->observacion = trim($conexion->real_escape_string($_POST['observacion_profR']));
		$this->descuento = trim($conexion->real_escape_string($_POST['descuento_profR']));
		$this->total = trim($conexion->real_escape_string($_POST['total_profR']));
		$this->moneda = trim($conexion->real_escape_string($_POST['moneda_profR']));
		$this->tipo_cambio_prof = trim($conexion->real_escape_string($_POST['tipo_cambio_profR']));
	}
	public function asignarValoresM ($id_usua){
		//protegemos al servidor de los valores que el usuario esta introduciendo
		include 'conexion.php';
		$this->id_prof = trim($conexion->real_escape_string($_POST['id_profM']));
		$this->fecha = trim($conexion->real_escape_string($_POST['fecha_profM']));
		$this->cliente = trim($conexion->real_escape_string($_POST['fk_id_clte_profM']));
		$this->encargado = $id_usua;
		$this->tiempoValido = trim($conexion->real_escape_string($_POST['tpo_valido_profM']));
		$this->condicionesDePago = trim($conexion->real_escape_string($_POST['cond_pago_profM']));
		$this->tiempoDeEntrega = trim($conexion->real_escape_string($_POST['tpo_entrega_profM']));
		$this->observacion = trim($conexion->real_escape_string($_POST['observacion_profM']));
		$this->descuento = trim($conexion->real_escape_string($_POST['descuento_profM']));
		$this->total = trim($conexion->real_escape_string($_POST['total_profM']));
		$this->moneda = trim($conexion->real_escape_string($_POST['moneda_profM']));
		$this->tipo_cambio_prof = trim($conexion->real_escape_string($_POST['tipo_cambio_profM']));
	}
	//--------------------------------------------CRUD PROFORMAS-----------------------------
	//-------Read proformas
	public function readProformas(){
		include 'conexion.php';
		$consulta = "SELECT * FROM proforma INNER JOIN cliente ON proforma.fk_id_clte_prof = id_clte INNER JOIN usuario ON proforma.fk_id_usua_prof = id_usua INNER JOIN empresa ON cliente.fk_id_emp_clte = id_emp ORDER BY id_prof DESC";
		$resultado = $conexion->query($consulta);
		$proformas =  array();
		while ($fila = $resultado->fetch_assoc()){
			$_prof_mprof_ne = '';
			if ($fila['nombre_emp'] == 'Ninguna'){
				$_prof_mprof_ne = strtoupper('SMS'.substr($fila['fecha_prof'],2,2).'-'.$this->addZerosGo($fila['numero_prof']).'-'.explode(" ",$fila['apellido_clte'])[0]);
			}else{
				$_prof_mprof_ne = strtoupper('SMS'.substr($fila['fecha_prof'],2,2).'-'.$this->addZerosGo($fila['numero_prof']).'-'.$sigla_emp = $fila['sigla_emp']);
			}
			$datos = array ('id_prof'=>$fila['id_prof'], 'numero_prof'=>$_prof_mprof_ne, 'fecha_prof'=>$fila['fecha_prof'], 'fk_id_usua_prof'=>$fila['fk_id_usua_prof'], 'nombre_usua'=>$fila['nombre_usua'], 'apellido_usua'=>$fila['apellido_usua'], 'email_usua'=>$fila['email_usua'], 'celular_usua'=>$fila['celular_usua'], 'id_emp'=>$fila['id_emp'], 'nombre_emp'=>$fila['nombre_emp'], 'sigla_emp'=>$fila['sigla_emp'], 'direccion_emp'=>$fila['direccion_emp'], 'telefono_emp'=>$fila['telefono_emp'], 'fk_id_clte_prof'=>$fila['fk_id_clte_prof'], 'nombre_clte'=>$fila['nombre_clte'], 'apellido_clte'=>$fila['apellido_clte'], 'celular_clte'=>$fila['celular_clte'], 'descuento_prof'=>$fila['descuento_prof'], 'total_prof'=>$fila['total_prof'], 'tpo_valido_prof'=>$fila['tpo_valido_prof'], 'cond_pago_prof'=>$fila['cond_pago_prof'], 'tpo_entrega_prof'=>$fila['tpo_entrega_prof'], 'observacion_prof'=>$fila['observacion_prof'],  'moneda_prof'=>$fila['moneda_prof'], 'tipo_cambio_prof'=>$fila['tipo_cambio_prof'], 'estado_prof'=>$fila['estado_prof']);
			$proformas[$fila['id_prof'].'_id_prof'] = $datos;
		}
		echo json_encode($proformas, JSON_UNESCAPED_UNICODE);
	}
	//-------Create a proforma
	public function createProforma(){
		include 'conexion.php';
		$consulta = "SELECT MAX(numero_prof) as numero_prof_max FROM proforma ";
    	$resultado = $conexion->query($consulta);
    	$numero_prof = $resultado->fetch_assoc();
    	$nuevo_numero_prof = ($numero_prof['numero_prof_max'] == null) ? 1 : $numero_prof['numero_prof_max'] + 1;
		$consulta = "INSERT INTO proforma (numero_prof, fecha_prof, fk_id_clte_prof, fk_id_usua_prof, cond_pago_prof, tpo_entrega_prof, tpo_valido_prof, descuento_prof, total_prof, moneda_prof, observacion_prof, tipo_cambio_prof, estado_prof) VALUES ('$nuevo_numero_prof' ,'$this->fecha', '$this->cliente' , '$this->encargado', '$this->condicionesDePago', '$this->tiempoDeEntrega', '$this->tiempoValido', '$this->descuento', '$this->total', '$this->moneda', '$this->observacion', '$this->tipo_cambio_prof', 'pendiente')";
		$resultado = $conexion->query($consulta);
		$consulta = "SELECT MAX(id_prof) as id_prof_max FROM proforma ";
    	$resultado = $conexion->query($consulta);
    	$id_prof = $resultado->fetch_assoc();
    	$this->nProforma = $id_prof['id_prof_max'];
		echo "Proforma creada exitosamente";
	}
	//-------Update a proforma
	public function updateProforma($productos){
        include 'conexion.php';
        $consulta = "SELECT * FROM proforma WHERE id_prof='$this->id_prof'";
		$resultado = $conexion->query($consulta);
		$fila = $resultado->fetch_assoc();
		$id_prof = $fila['id_prof'];
		$numero_prof = $fila['numero_prof'];
		$fecha_prof = $fila['fecha_prof'];
		$id_clte = $fila['fk_id_clte_prof'];
		$id_usua = $fila['fk_id_usua_prof'];
		$tpo_valido_prof = $fila['tpo_valido_prof'];
		$cond_pago_prof = $fila['cond_pago_prof'];
		$tpo_entrega_prof =$fila['tpo_entrega_prof'];
		$observacion_prof = $fila['observacion_prof'];
		$descuento_prof = $fila['descuento_prof'];
		$total_prof = $fila['total_prof'];
		$moneda_prof = $fila['moneda_prof'];
		$tipo_cambio_prof = $fila['tipo_cambio_prof'];
        $consulta = "INSERT INTO mdf_proforma (id_prof_mprof, numero_mprof, fecha_mprof, fk_id_clte_mprof, fk_id_usua_mprof, tpo_valido_mprof, cond_pago_mprof, tpo_entrega_mprof, observacion_mprof, descuento_mprof, total_mprof, moneda_mprof, tipo_cambio_mprof) VALUES ('$id_prof', '$numero_prof' ,'$fecha_prof', '$id_clte' , '$id_usua', '$tpo_valido_prof', '$cond_pago_prof', '$tpo_entrega_prof', '$observacion_prof', '$descuento_prof', '$total_prof', '$moneda_prof', '$tipo_cambio_prof')";
		$resultado = $conexion->query($consulta);
		
		$consulta = "SELECT MAX(id_mprof) as id_mprof_max FROM mdf_proforma ";
		$resultado = $conexion->query($consulta);
		$id_mprof = $resultado->fetch_assoc();
		$this->nProforma = $id_mprof['id_mprof_max'];

		$consulta = "SELECT * FROM prof_prod WHERE fk_id_prof_pfpd = '$id_prof'";
		$resultado = $conexion->query($consulta);
		$numeroProductos = $resultado->num_rows;
		if($numeroProductos > 0){
			while ($fila = $resultado->fetch_assoc()){
				$fk_id_prof_pfpd = $fila['fk_id_prof_pfpd'];
				$fk_id_prod_pfpd = $fila['fk_id_prod_pfpd'];
				$cantidad_pfpd = $fila['cantidad_pfpd'];
				$cost_uni_pfpd = $fila['cost_uni_pfpd'];

				$consulta2 = "INSERT INTO  mdf_prof_prod (fk_id_mprof_mpfpd, fk_id_prod_mpfpd, cantidad_mpfpd, cost_uni_mpfpd) VALUES ('$this->nProforma','$fk_id_prod_pfpd','$cantidad_pfpd','$cost_uni_pfpd')";
				$resultado2 = $conexion->query($consulta2);
			}
		}
		$consulta = "UPDATE proforma set fecha_prof='$this->fecha', fk_id_clte_prof = '$this->cliente', fk_id_usua_prof = '$this->encargado', cond_pago_prof = '$this->condicionesDePago', tpo_entrega_prof = '$this->tiempoDeEntrega',  tpo_valido_prof = '$this->tiempoValido', descuento_prof = '$this->descuento', total_prof = '$this->total', moneda_prof = '$this->moneda', observacion_prof = '$this->observacion', tipo_cambio_prof = '$this->tipo_cambio_prof' WHERE id_prof = '$this->id_prof'";
		$resultado = $conexion->query($consulta);
		//------Eliminar productos de la proforma
		$consulta = "DELETE FROM prof_prod WHERE fk_id_prof_pfpd = '$this->id_prof'";
		$resultado = $conexion->query($consulta);
		$productos = json_decode($productos,true);
		foreach($productos as $celda){
    		$codigo = $celda['codigo'];
    		$consulta = "SELECT * FROM producto WHERE codigo_prod='$codigo'";
			$resultado = $conexion->query($consulta);
			$producto = $resultado->fetch_assoc();
			$id_prod = $producto['id_prod'];
    		$cantidad = $celda['cantidad'];
    		$costoUnitario = $celda['costoUnitario'];
    		$consulta2 = "INSERT INTO prof_prod (fk_id_prof_pfpd, fk_id_prod_pfpd, cantidad_pfpd, cost_uni_pfpd) VALUES ('$this->id_prof' , '$id_prod', '$cantidad', '$costoUnitario')";
			$resultado2 = $conexion->query($consulta2);
		}
		echo 'Proforma modificada exitosamente!';
    }
    //-------Delete a proforma 
	public function deleteProforma($id_prof){
		//------Eliminar productos de la tabla prof_prof
		include 'conexion.php';
		$consulta = "SELECT * FROM mdf_proforma WHERE id_prof_mprof = '$id_prof'";
		$resultado = $conexion->query($consulta);
		$numeroProductos = $resultado->num_rows;
		if($numeroProductos > 0){
			while ($fila = $resultado->fetch_assoc()){
				$id_mprof = $fila['id_mprof'];
				$consulta = "DELETE FROM mdf_prof_prod WHERE fk_id_mprof_mpfpd = '$id_mprof'";
				$resultado2 = $conexion->query($consulta);
				$consulta = "DELETE FROM mdf_proforma WHERE id_mprof = '$id_mprof'";
				$resultado3 = $conexion->query($consulta);
			}
		}
		$consulta = "DELETE FROM prof_prod WHERE fk_id_prof_pfpd = '$id_prof'";
		$resultado = $conexion->query($consulta);
		//------Eliminar proforma de la tabla proforma
		$consulta = "DELETE FROM proforma WHERE id_prof = '$id_prof'";
		$resultado = $conexion->query($consulta);
		echo 'Proforma eliminada exitosamente!';
	}
	//-------------------------------------------CRUD PROF_PROD---------------------------
	//-------Read Prof_prods
	public function readProf_prods(){
		include 'conexion.php';
		$consulta = "SELECT * FROM prof_prod";
		$resultado = $conexion->query($consulta);
		$proformas =  array();
		while ($fila = $resultado->fetch_assoc()){
			$datos = array ('fk_id_prof_pfpd'=>$fila['fk_id_prof_pfpd'], 'fk_id_prod_pfpd'=>$fila['fk_id_prod_pfpd'], 'cantidad_pfpd'=>$fila['cantidad_pfpd'], 'cost_uni_pfpd'=>$fila['cost_uni_pfpd']);
			$proformas[$fila['id_pfpd'].'_id_pfpd'] = $datos;
		}
		echo json_encode($proformas, JSON_UNESCAPED_UNICODE);
	}
	public function readmProf_prods(){
		include 'conexion.php';
		$consulta = "SELECT * FROM mdf_prof_prod";
		$resultado = $conexion->query($consulta);
		$mproformas =  array();
		while ($fila = $resultado->fetch_assoc()){
			$datos = array ('fk_id_mprof_mpfpd'=>$fila['fk_id_mprof_mpfpd'], 'fk_id_prod_mpfpd'=>$fila['fk_id_prod_mpfpd'], 'cantidad_mpfpd'=>$fila['cantidad_mpfpd'], 'cost_uni_mpfpd'=>$fila['cost_uni_mpfpd']);
			$mproformas[$fila['id_mpfpd'].'_id_mpfpd'] = $datos;
		}
		echo json_encode($mproformas, JSON_UNESCAPED_UNICODE);
	}
	//-------Create Prof_prod
	public function createProf_prod($productos){
		include 'conexion.php';
		$productos = json_decode($productos,true);
		foreach($productos as $celda){
    		$codigo = $celda['codigo'];
    		$consulta = "SELECT * FROM producto WHERE codigo_prod='$codigo'";
			$resultado = $conexion->query($consulta);
			$producto = $resultado->fetch_assoc();
			$id_prod = $producto['id_prod'];
    		$cantidad = $celda['cantidad'];
    		$costoUnitario = $celda['costoUnitario'];
    		$consulta2 = "INSERT INTO  prof_prod (fk_id_prof_pfpd, fk_id_prod_pfpd, cantidad_pfpd, cost_uni_pfpd) VALUES ('$this->nProforma','$id_prod','$cantidad','$costoUnitario')";
			$resultado2 = $conexion->query($consulta2);
		}
	}
	//-----------------------------------------------CRUD MDF_PROFORMA------------------------------
	public function read_mdf_Proforma(){
		include 'conexion.php';
		$consulta = "SELECT * FROM mdf_proforma INNER JOIN cliente ON mdf_proforma.fk_id_clte_mprof = id_clte INNER JOIN usuario ON mdf_proforma.fk_id_usua_mprof = id_usua INNER JOIN empresa ON cliente.fk_id_emp_clte = id_emp";
		$resultado = $conexion->query($consulta);
		$numeroFilas = $resultado->num_rows;
		$mProforma =  array();
		if($numeroFilas > 0){
			while ($fila = $resultado->fetch_assoc()){
				$_prof_mprof_ne = '';
				if ($fila['nombre_emp'] == 'Ninguna'){
					$_prof_mprof_ne = strtoupper('SMS'.substr($fila['fecha_mprof'],2,2).'-'.$this->addZerosGo($fila	['numero_mprof']).'-'.explode(" ",$fila['apellido_clte'])[0]);
				}else{
					$_prof_mprof_ne = strtoupper('SMS'.substr($fila['fecha_mprof'],2,2).'-'.$this->addZerosGo($fila	['numero_mprof']).'-'.$sigla_emp = $fila['sigla_emp']);
				}
				$datos = array ('id_mprof'=>$fila['id_mprof'], 'id_prof_mprof'=>$fila['id_prof_mprof'], 'numero_mprof'=>$_prof_mprof_ne, 'fecha_mprof'=>$fila['fecha_mprof'], 'nombre_usua'=>$fila['nombre_usua'], 'apellido_usua'=>$fila['apellido_usua'], 'email_usua'=>$fila['email_usua'], 'celular_usua'=>$fila['celular_usua'], 'sigla_emp'=>$fila['sigla_emp'], 'nombre_emp'=>$fila['nombre_emp'], 'direccion_emp'=>$fila['direccion_emp'], 'telefono_emp'=>$fila['telefono_emp'], 'nombre_clte'=>$fila['nombre_clte'], 'apellido_clte'=>$fila['apellido_clte'], 'celular_clte'=>$fila['celular_clte'], 'descuento_mprof'=>$fila['descuento_mprof'], 'total_mprof'=>$fila['total_mprof'],  'tpo_valido_mprof'=>$fila['tpo_valido_mprof'], 'cond_pago_mprof'=>$fila['cond_pago_mprof'], 'tpo_entrega_mprof'=>$fila['tpo_entrega_mprof'], 'observacion_mprof'=>$fila['observacion_mprof'], 'moneda_mprof'=>$fila['moneda_mprof'], 'tipo_cambio_mprof'=>$fila['tipo_cambio_mprof']);
				$mProforma[$fila['id_mprof'].'_id_mprof'] = $datos;
			}
			$json = json_encode($mProforma, JSON_UNESCAPED_UNICODE);
			echo $json;
		}else{
			echo json_encode('');
		}
	}
	//-----Delete proforma
	public function deletemProforma($id_mprof){
		//------Eliminar productos de la tabla prof_prof
		include 'conexion.php';
		$consulta = "DELETE FROM mdf_prof_prod WHERE fk_id_mprof_mpfpd = '$id_mprof'";
		$resultado = $conexion->query($consulta);
		//------Eliminar proforma de la tabla proforma
		$consulta = "DELETE FROM mdf_proforma WHERE id_mprof = '$id_mprof'";
		$resultado = $conexion->query($consulta);
		echo "Proforma eliminada con exito";
	}
	public function addZerosGo($numero) {
		return str_pad($numero, 4, "0", STR_PAD_LEFT);
	}
}
?>