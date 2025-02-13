<?php
class Consultas{
	//------------------------------------------------------------------------CRUD VENTA---------------------------------------------------
    public function asignarValores(){
		//protegemos al servidor de los valores que el usuario esta introduciendo
		include 'conexion.php';
		$this->id_ne = $conexion->real_escape_string($_POST['id_ne']);
		$this->id_usua = $conexion->real_escape_string($_POST['id_usua']);
		$this->fecha_vnt = $conexion->real_escape_string($_POST['fecha_vnt']);
		$this->ciudad_vnt = $conexion->real_escape_string($_POST['ciudad_vnt']);
		$this->tipo_pago_vnt = $conexion->real_escape_string($_POST['tipo_pago_vnt']);
		$this->tiempo_credito_vnt = $conexion->real_escape_string($_POST['tiempo_credito_vnt']);
		$this->estado_factura_vnt = $conexion->real_escape_string($_POST['estado_factura_vnt']);
		$this->fecha_factura_vnt = $conexion->real_escape_string($_POST['fecha_factura_vnt']);
        $this->factura_vnt = $conexion->real_escape_string($_POST['factura_vnt']);
		$this->observacion_vnt = $conexion->real_escape_string($_POST['observacion_vnt']);
	}
	public function asignarValoresM(){
		//protegemos al servidor de los valores que el usuario esta introduciendo
		include 'conexion.php';
		$this->id_vnt = $conexion->real_escape_string($_POST['id_vntM']);
		$this->id_clte = $conexion->real_escape_string($_POST['fk_id_clte_vntM']);
		$this->fecha_vnt = $conexion->real_escape_string($_POST['fecha_vntM']);//para volverlo en integer
        $this->factura_vnt = $conexion->real_escape_string($_POST['factura_vntM']);
        $this->fk_id_prof_vnt = $conexion->real_escape_string($_POST['fk_id_prof_vntM']);
		$this->descripcion_vnt = $conexion->real_escape_string($_POST['descripcion_vntM']);
	}
	//-----read ventas
	public function readSales(){
		include 'conexion.php';
		$consulta = "SELECT * FROM venta INNER JOIN nota_entrega ON venta.fk_id_ne_vnt = id_ne INNER JOIN proforma ON nota_entrega.fk_id_prof_ne = id_prof INNER JOIN cliente ON proforma.fk_id_clte_prof = id_clte INNER JOIN empresa ON cliente.fk_id_emp_clte = id_emp INNER JOIN usuario ON venta.fk_id_usua_vnt = id_usua WHERE venta.estado_vnt = 'FACTURADO' ORDER BY id_vnt DESC";
		$resultado = $conexion->query($consulta);
		$numeroClientes = $resultado->num_rows;
		$clientes =  array();
		if($numeroClientes > 0){
			while ($fila = $resultado->fetch_assoc()){
				$datos = array ('id_vnt'=>intval($fila['id_vnt']), 'numero_prof'=>'NE-SMS'.substr($fila['fecha_ne'],2,2).'-'.$this->addZerosGo($fila['numero_prof']), 'nombre_emp'=>$fila['nombre_emp'], 'cliente_clte'=>$fila['nombre_clte'].' '.$fila['apellido_clte'], 'fecha_ne'=>$fila['fecha_ne'], 'fecha_vnt'=>$fila['fecha_vnt'], 'orden_ne'=>$fila['orden_ne'], 'total_prof'=>$fila['total_prof'], 'encargado'=>$fila['nombre_usua'].' '.$fila['apellido_usua'], 'ciudad_vnt'=>$fila['ciudad_vnt'], 'tipo_pago_vnt'=>$fila['tipo_pago_vnt'], 'estado_factura_vnt'=>$fila['estado_factura_vnt'], 'fecha_factura_vnt'=>$fila['fecha_factura_vnt'], 'factura_vnt'=>intval($fila['factura_vnt']), 'observacion_vnt'=>$fila['observacion_vnt']);
				$clientes[$fila['id_vnt'].'_id_vnt'] = $datos;
			}
			$json = json_encode($clientes, JSON_UNESCAPED_UNICODE);
			echo $json;
		}
	}
	//-----Create venta
	public function createSale(){
		include 'conexion.php';
		$products = $_POST['prodCart'];
		//-----Comprobar que la factura no exista
		if ($this->estado_factura_vnt == '1'){
			$consulta = "SELECT * FROM venta WHERE factura_vnt = '$this->factura_vnt'";
			$resultado = $conexion->query($consulta);
			$numeroClientes = $resultado->num_rows;
			if($numeroClientes > 0){
				echo "La factura ya existe";
				exit();
			} else {
				$this->addProduct($products);
			}
		} else {
			$this->addProduct($products);
		}
	}
	public function addProduct($products){
		include 'conexion.php';
		$consulta = "UPDATE nota_entrega set estado_ne='vendido' WHERE id_ne = '$this->id_ne'";
		$resultado = $conexion->query($consulta);
		if($resultado){
			$consulta = "INSERT INTO venta (ciudad_vnt, fecha_vnt, estado_factura_vnt, fecha_factura_vnt, factura_vnt, fk_id_ne_vnt, fk_id_usua_vnt, tipo_pago_vnt, tiempo_credito_vnt,  observacion_vnt, estado_vnt) VALUES ('$this->ciudad_vnt', '$this->fecha_vnt', '$this->estado_factura_vnt', '$this->fecha_factura_vnt', '$this->factura_vnt', '$this->id_ne', '$this->id_usua', '$this->tipo_pago_vnt', '$this->tiempo_credito_vnt', '$this->observacion_vnt', 'FACTURADO')"; 
			$resultado = $conexion->query($consulta);
			if($resultado){
				$consulta = "SELECT MAX(id_vnt) as id_vnt_max FROM venta";
				$resultado = $conexion->query($consulta);
				$id_vnt = $resultado->fetch_assoc();
				$id_vnt = $id_vnt['id_vnt_max'];
				$productos = json_decode($products,true);
				foreach($productos as $celda){
					$id_prod = $celda['fk_id_prod_pfpd'];
					$codigo_vtpd = $celda['codigo_prod'];
					$cantidad_vtpd = $celda['cantidad_pfpd'];
					$cost_uni_vtpd = $celda['cost_uni_pfpd'];
					$consulta = "INSERT INTO vnt_prod (fk_id_vnt_vtpd, fk_id_prod_vtpd, codigo_vtpd, cantidad_vtpd, cost_uni_vtpd) VALUES ('$id_vnt', '$id_prod', '$codigo_vtpd', '$cantidad_vtpd', '$cost_uni_vtpd')";
					$resultado = $conexion->query($consulta);
				}
				echo "Venta registrada exitosamente";
			}
		}	
	}
	//------------------------------------------------------------------------CRUD VNT-PROD-------------------------------------------------------
	//------Read vnt-prods
	public function readVnt_prods(){
		include 'conexion.php';
		$consulta = "SELECT * FROM vnt_prod INNER JOIN producto ON vnt_prod.fk_id_prod_vtpd = id_prod INNER JOIN inventario ON producto.id_prod = inventario.fk_id_prod_inv INNER JOIN venta ON vnt_prod.fk_id_vnt_vtpd = id_vnt INNER JOIN marca ON producto.fk_id_mrc_prod = marca.id_mrc INNER JOIN categoria ON producto.fk_id_ctgr_prod = categoria.id_ctgr INNER JOIN usuario ON venta.fk_id_usua_vnt = usuario.id_usua INNER JOIN nota_entrega ON venta.fk_id_ne_vnt = id_ne INNER JOIN proforma ON nota_entrega.fk_id_prof_ne = id_prof INNER JOIN cliente ON proforma.fk_id_clte_prof = id_clte INNER JOIN empresa ON cliente.fk_id_emp_clte = id_emp WHERE venta.estado_vnt = 'FACTURADO' ORDER BY id_vnt DESC";
		$resultado = $conexion->query($consulta);
		$numeroClientes = $resultado->num_rows;
		$clientes =  array(); 
		if($numeroClientes > 0){
			while ($fila = $resultado->fetch_assoc()){
				$datos = array ('id_vtpd'=>$fila['id_vtpd'], 'numero_prof'=>'SMS'.substr($fila['fecha_vnt'],2,2).'-'.$this->addZerosGo($fila['numero_prof']), 'fecha_ne'=>$fila['fecha_ne'], 'fecha_vnt'=>$fila['fecha_vnt'], 'nombre_usua'=>$fila['nombre_usua'], 'apellido_usua'=>$fila['apellido_usua'], 'nombre_emp'=>$fila['nombre_emp'] , 'nombre_clte'=>$fila['nombre_clte'], 'apellido_clte'=>$fila['apellido_clte'], 'nombre_mrc'=>$fila['nombre_mrc'], 'nombre_ctgr'=>$fila['nombre_ctgr'], 'fk_id_prod_vtpd'=>$fila['fk_id_prod_vtpd'], 'codigo_smc_prod'=>$fila['codigo_smc_prod'], 'cost_uni_inv'=>$fila['cost_uni_inv'], 'codigo_vtpd'=>$fila['codigo_vtpd'], 'imagen_prod'=>$fila['imagen_prod'], 'nombre_prod'=>$fila['nombre_prod'], 'factura_vnt'=>$fila['factura_vnt'], 'cantidad_vtpd'=>intval($fila['cantidad_vtpd']), 'cost_uni_vtpd'=>doubleval($fila['cost_uni_vtpd']), 'descuento_prof'=>floatval($fila['descuento_prof']), 'estado_ne'=>$fila['estado_ne']);
				$clientes['id_vtpd_'.$fila['id_vtpd']] = $datos;
			}
			$json = json_encode($clientes, JSON_UNESCAPED_UNICODE);
			echo $json;
		}else{
			echo json_encode('');
		}
	}
	public function addZerosGo($numero) {
		return str_pad($numero, 4, "0", STR_PAD_LEFT);
	}

}
?>