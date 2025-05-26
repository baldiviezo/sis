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
	public function readProformas() {
		require_once 'conexion.php';
		$consulta = "SELECT proforma.*, cliente.apellido_clte, empresa.id_emp, empresa.sigla_emp, empresa.nombre_emp FROM proforma INNER JOIN cliente ON proforma.fk_id_clte_prof = cliente.id_clte INNER JOIN empresa ON cliente.fk_id_emp_clte = empresa.id_emp ORDER BY id_prof DESC";
		$resultado = $conexion->query($consulta);
		$proformas = array();
		while ($fila = $resultado->fetch_array(MYSQLI_ASSOC)) {
			$fila['numero_prof'] = strtoupper('SMS' . substr($fila['fecha_prof'], 2, 2) . '-' . $this->addZerosGo($fila['numero_prof']) . '-' . ($fila['id_emp'] == 77 ? explode(" ", $fila['apellido_clte'])[0] : $fila['sigla_emp']));
			unset($fila['apellido_clte'], $fila['sigla_emp'], $fila['nombre_emp'], $fila['id_emp']);
			$proformas[] = $fila;
		}
		echo json_encode($proformas, JSON_NUMERIC_CHECK | JSON_UNESCAPED_UNICODE);
	}
	//-------Create a proforma
	public function createProforma($productos){
		include 'conexion.php';
		$consulta = "SELECT numero_prof FROM proforma ORDER BY id_prof DESC LIMIT 1";
    	$resultado = $conexion->query($consulta);
		$numero_prof = $resultado->fetch_assoc();
		$nuevo_numero_prof = ($numero_prof['numero_prof'] == null) ? 1 : $numero_prof['numero_prof'] + 1;
		$consulta = "INSERT INTO proforma (numero_prof, fecha_prof, fk_id_clte_prof, fk_id_usua_prof, cond_pago_prof, tpo_entrega_prof, tpo_valido_prof, descuento_prof, total_prof, moneda_prof, observacion_prof, tipo_cambio_prof, estado_prof) VALUES ('$nuevo_numero_prof' ,'$this->fecha', '$this->cliente' , '$this->encargado', '$this->condicionesDePago', '$this->tiempoDeEntrega', '$this->tiempoValido', '$this->descuento', '$this->total', '$this->moneda', '$this->observacion', '$this->tipo_cambio_prof', 'pendiente')";
		$resultado = $conexion->query($consulta);
		$consulta = "SELECT MAX(id_prof) as id_prof_max FROM proforma ";
    	$resultado = $conexion->query($consulta);
    	$id_prof = $resultado->fetch_assoc();
		$numero_prof = $id_prof['id_prof_max'];
		$productos = json_decode($productos,true);
		
		foreach($productos as $celda){
    		$id_prod = $celda['id_prod'];
    		$cantidad = $celda['cantidad'];
    		$costoUnitario = $celda['costoUnitario'];
    		$consulta2 = "INSERT INTO  prof_prod (fk_id_prof_pfpd, fk_id_prod_pfpd, cantidad_pfpd, cost_uni_pfpd) VALUES ('$numero_prof','$id_prod','$cantidad','$costoUnitario')";	
			$resultado2 = $conexion->query($consulta2);
		}
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
			$id_prod = $celda['id_prod'];
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
	//-------Change state proforma
	public function changeStateProforma($id_prof){
		include 'conexion.php';
		$consulta = "UPDATE proforma set estado_prof = 'confirmada' WHERE id_prof = '$id_prof'";
		$resultado = $conexion->query($consulta);
		echo 'Proforma confirmada exitosamente!';
	}
	//-------------------------------------------CRUD PROF_PROD---------------------------
	//-------Read Prof_prods
	public function readProf_prods(){
		include 'conexion.php';
		$consulta = "SELECT * FROM prof_prod";
		$resultado = $conexion->query($consulta);
		$profProds =  array();
		while ($fila = $resultado->fetch_assoc()){
			$profProds[] = $fila;
		}
		echo json_encode($profProds, JSON_NUMERIC_CHECK | JSON_UNESCAPED_UNICODE);
	}
	public function readmProf_prods(){
		include 'conexion.php';
		$consulta = "SELECT * FROM mdf_prof_prod";
		$resultado = $conexion->query($consulta);
		$mprofProds =  array();
		while ($fila = $resultado->fetch_assoc()){
			$mprofProds[] = $fila;
		}
		echo json_encode($mprofProds, JSON_NUMERIC_CHECK | JSON_UNESCAPED_UNICODE);
	}
	//-----------------------------------------------CRUD MDF_PROFORMA------------------------------
	public function read_mdf_Proforma() {
		require_once 'conexion.php';
		$consulta = "SELECT mdf_proforma.*, cliente.apellido_clte, empresa.sigla_emp, empresa.nombre_emp FROM mdf_proforma INNER JOIN cliente ON mdf_proforma.fk_id_clte_mprof = cliente.id_clte INNER JOIN empresa ON cliente.fk_id_emp_clte = empresa.id_emp ORDER BY id_prof_mprof DESC";
		$resultado = $conexion->query($consulta);
		$proformas_mprof = array();
		while ($fila = $resultado->fetch_array(MYSQLI_ASSOC)) {
			$fila['numero_mprof'] = strtoupper('SMS' . substr($fila['fecha_mprof'], 2, 2) . '-' . $this->addZerosGo($fila['numero_mprof']) . '-' . ($fila['nombre_emp'] == 'Ninguna' ? explode(" ", $fila['apellido_clte'])[0] : $fila['sigla_emp']));
			unset($fila['apellido_clte'], $fila['sigla_emp'], $fila['nombre_emp']);
			$proformas_mprof[] = $fila;
		}
		echo json_encode($proformas_mprof, JSON_NUMERIC_CHECK | JSON_UNESCAPED_UNICODE);
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
	/*****************************read price list */
	//-------Read Prices
	public function readPrices(){
		include 'conexion.php';
		$consulta = "SELECT * FROM lista_precios";
		$resultado = $conexion->query($consulta);
		$prices = array();
		while ($fila = $resultado->fetch_assoc()){
			$prices[] = $fila;
		}
		echo json_encode($prices, JSON_UNESCAPED_UNICODE);
	}
}
?>