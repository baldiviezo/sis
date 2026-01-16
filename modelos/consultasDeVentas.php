<?php
class Consultas{
	//------------------------------------------------------------------------CRUD VENTA---------------------------------------------------
    public function asignarValores(){
		//protegemos al servidor de los valores que el usuario esta introduciendo
		include 'conexion.php';
		$this->almacen_vnt = $conexion->real_escape_string($_POST['almacen_vnt']);
		$this->ciudad_vnt = $conexion->real_escape_string($_POST['ciudad_vnt']);
		$this->estado_factura_vnt = $conexion->real_escape_string($_POST['estado_factura_vnt']);
		$this->fecha_factura_vnt = $conexion->real_escape_string($_POST['fecha_factura_vnt']);
		$this->factura_vnt = $conexion->real_escape_string($_POST['factura_vnt']);
		$this->id_usua = $conexion->real_escape_string($_POST['fk_id_usua_vnt']);
		$this->fk_id_clte_vnt = $conexion->real_escape_string($_POST['fk_id_clte_vntR']);
		$this->total_vnt = $conexion->real_escape_string($_POST['total_vnt']);
		$this->tipo_pago_vnt = $conexion->real_escape_string($_POST['tipo_pago_vnt']);
		$this->tiempo_credito_vnt = $conexion->real_escape_string($_POST['tiempo_credito_vnt']);
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
		$consulta = "SELECT * FROM venta ORDER BY id_vnt DESC";
		$resultado = $conexion->query($consulta);
		$numeroVentas = $resultado->num_rows;
		$ventas =  array();
		if($numeroVentas > 0){
			while ($fila = $resultado->fetch_array(MYSQLI_ASSOC)){
				$ventas[] = $fila;
			}
			echo json_encode($ventas, JSON_NUMERIC_CHECK | JSON_UNESCAPED_UNICODE);
		}
	}
	//-----Create venta
	public function createSale(){
		include 'conexion.php';
		$products = $_POST['createSale'];
		//-----Comprobar que la factura no exista
		if ($this->estado_factura_vnt == '1'){
			$consulta = "SELECT * FROM venta WHERE factura_vnt = '$this->factura_vnt' AND YEAR(fecha_factura_vnt) = YEAR(NOW())";
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
		$consulta = "INSERT INTO venta (almacen_vnt, ciudad_vnt, estado_factura_vnt, fecha_factura_vnt, factura_vnt, fk_id_usua_vnt, fk_id_clte_vnt, total_vnt, tipo_pago_vnt, tiempo_credito_vnt,  observacion_vnt, estado_vnt) VALUES ('$this->almacen_vnt','$this->ciudad_vnt', '$this->estado_factura_vnt', '$this->fecha_factura_vnt', '$this->factura_vnt', '$this->id_usua', '$this->fk_id_clte_vnt', '$this->total_vnt', '$this->tipo_pago_vnt', '$this->tiempo_credito_vnt', '$this->observacion_vnt', 0)"; 
		$resultado = $conexion->query($consulta);
		if($resultado){
			$consulta = "SELECT MAX(id_vnt) as id_vnt_max FROM venta";
			$resultado = $conexion->query($consulta);
			$id_vnt = $resultado->fetch_assoc();
			$id_vnt = $id_vnt['id_vnt_max'];
			$productos = json_decode($products,true);
			foreach($productos as $celda){
				$id_nepd = $celda['id_nepd'];
				$id_prod= $celda['fk_id_prod_vtpd'];
				$codigo_vtpd = $celda['codigo_vtpd'];
				$cantidad_vtpd = $celda['cantidad_vtpd'];
				$cost_uni_vtpd = $celda['cost_uni_vtpd'];
				$consulta = "INSERT INTO vnt_prod (fk_id_vnt_vtpd, fk_id_prod_vtpd, codigo_vtpd, cantidad_vtpd, cost_uni_vtpd) VALUES ('$id_vnt', '$id_prod', '$codigo_vtpd', '$cantidad_vtpd', '$cost_uni_vtpd')";
				$resultado = $conexion->query($consulta);
				$consulta2 = "UPDATE nte_prod SET estado_nepd = 1 WHERE id_nepd = '$id_nepd'";
				$resultado2 = $conexion->query($consulta2);
			}
			echo "Venta registrada exitosamente";
		}
		
	}
	//------------------------------------------------------------------------CRUD VNT-PROD-------------------------------------------------------
	//------Read vnt-prods
	public function readVnt_prods(){
		include 'conexion.php';
		$consulta = "SELECT vnt_prod.* , producto.nombre_prod, producto.codigo_smc_prod, marca.nombre_mrc, categoria.nombre_ctgr FROM vnt_prod INNER JOIN producto ON vnt_prod.fk_id_prod_vtpd = producto.id_prod INNER JOIN marca ON producto.fk_id_mrc_prod = marca.id_mrc INNER JOIN categoria ON producto.fk_id_ctgr_prod = categoria.id_ctgr ORDER BY id_vtpd DESC";
		$resultado = $conexion->query($consulta);
		$numeroVntProd = $resultado->num_rows;
		$vntProd =  array(); 
		if($numeroVntProd > 0){
			while ($fila = $resultado->fetch_array(MYSQLI_ASSOC)){
				$vntProd[] = $fila;
			}
			echo json_encode($vntProd, JSON_NUMERIC_CHECK | JSON_UNESCAPED_UNICODE);
		}else{
			echo json_encode('');
		}
	}
	public function addZerosGo($numero) {
		return str_pad($numero, 4, "0", STR_PAD_LEFT);
	}

}
?>