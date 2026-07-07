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
	//------Update venta
	public function updateSale(){
		include 'conexion.php';
		$id_vnt = $conexion->real_escape_string($_POST['id_vntM']);
		$fecha_factura = $conexion->real_escape_string($_POST['fecha_factura_vntM']);
		$factura = $conexion->real_escape_string($_POST['factura_vntM']);
		$fk_id_usua = $conexion->real_escape_string($_POST['fk_id_usua_vntM']);
		$observacion = $conexion->real_escape_string($_POST['observacion_vntM']);

		// Check if invoice already exists (different sale)
		if ($factura !== '') {
			$check = $conexion->query("SELECT id_vnt FROM venta WHERE factura_vnt = '$factura' AND id_vnt != '$id_vnt' AND YEAR(fecha_factura_vnt) = YEAR(NOW())");
			if ($check->num_rows > 0) {
				echo "La factura ya existe";
				exit();
			}
		}

		$consulta = "UPDATE venta SET fecha_factura_vnt = '$fecha_factura', factura_vnt = '$factura', fk_id_usua_vnt = '$fk_id_usua', observacion_vnt = '$observacion' WHERE id_vnt = '$id_vnt'";
		if ($conexion->query($consulta)) {
			echo "Venta modificada exitosamente";
		} else {
			echo "Error al modificar la venta";
		}
	}

	public function addZerosGo($numero) {
		return str_pad($numero, 4, "0", STR_PAD_LEFT);
	}
	//-----Dashboard sales
	public function readDashboardSales(){
		include 'conexion.php';
		$year = $conexion->real_escape_string($_POST['year'] ?? date('Y'));
		$month = $_POST['month'] ?? '';
		$rol = $_POST['rol_usua'] ?? '';
		$id_usua = $_POST['id_usua'] ?? '';
		$userFilter = '';
		if ($rol === 'Ingeniero' && $id_usua !== '') {
			$userFilter = "AND v.fk_id_usua_vnt = '" . $conexion->real_escape_string($id_usua) . "'";
		}
		$monthFilter = $month !== '' ? "AND MONTH(v.fecha_vnt) = '" . $conexion->real_escape_string($month) . "'" : '';

		// Summary
		$summary = $conexion->query("SELECT COUNT(*) AS total_count, COALESCE(SUM(v.total_vnt), 0) AS total_amount FROM venta v WHERE YEAR(v.fecha_vnt) = '$year' $monthFilter $userFilter")->fetch_assoc();

		// Top 5 clients
		$topResult = $conexion->query("SELECT c.id_clte, c.nombre_clte, c.apellido_clte, CASE WHEN e.id_emp = 77 THEN CONCAT(c.apellido_clte, ' ', c.nombre_clte) ELSE e.nombre_emp END AS cliente, SUM(v.total_vnt) AS total FROM venta v INNER JOIN cliente c ON v.fk_id_clte_vnt = c.id_clte INNER JOIN empresa e ON c.fk_id_emp_clte = e.id_emp WHERE YEAR(v.fecha_vnt) = '$year' $monthFilter $userFilter GROUP BY v.fk_id_clte_vnt ORDER BY total DESC LIMIT 5");
		$topClients = [];
		while ($row = $topResult->fetch_assoc()) {
			$topClients[] = $row;
		}

		echo json_encode([
			'total_amount' => $summary['total_amount'],
			'total_count' => $summary['total_count'],
			'top_clients' => $topClients
		], JSON_NUMERIC_CHECK | JSON_UNESCAPED_UNICODE);
	}

	//-----Product frequency for stock replacement (dynamic months 8-12 from nte_prod)
	public function readProductFrequency(){
		include 'conexion.php';
		$numMonths = isset($_POST['months']) ? intval($_POST['months']) : 8;
		$numMonths = max(8, min(12, $numMonths));

		$endDate = date('Y-m-d');
		$startDate = date('Y-m-01', strtotime("-" . ($numMonths - 1) . " months"));

		$monthNames = ['', 'Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];

		$caseStatements = [];
		$frequencyParts = [];
		$monthLabels = [];

		$current = new DateTime($startDate);

		for ($i = 0; $i < $numMonths; $i++) {
			$monthNum = $current->format('n');
			$yearNum = $current->format('Y');
			$label = $monthNames[$monthNum];
			$monthLabels[] = $label;
			$caseStatements[] = "SUM(CASE WHEN MONTH(n.fecha_ne) = $monthNum AND YEAR(n.fecha_ne) = $yearNum THEN np.cantidad_nepd ELSE 0 END) AS `$label`";
			$frequencyParts[] = "(SUM(CASE WHEN MONTH(n.fecha_ne) = $monthNum AND YEAR(n.fecha_ne) = $yearNum THEN np.cantidad_nepd ELSE 0 END) > 0)";
			$current->modify('+1 month');
		}

		$caseSQL = implode(",\n\t\t\t", $caseStatements);
		$freqSQL = implode(" +\n\t\t\t", $frequencyParts);

		$consulta = "SELECT p.codigo_prod, p.nombre_prod,
							$caseSQL,
							($freqSQL) AS frecuencia,
							COALESCE(i_el.cantidad_inv, 0) + COALESCE(i_ar.cantidad_inv, 0) AS stock_total,
							COALESCE(i_el.cost_uni_inv, i_ar.cost_uni_inv, 0) AS costo
					 FROM nte_prod np
					 INNER JOIN producto p ON np.fk_id_prod_nepd = p.id_prod
					 INNER JOIN nota_entrega n ON n.id_ne = np.fk_id_ne_nepd
					 LEFT JOIN inventario i_el ON p.id_prod = i_el.fk_id_prod_inv
					 LEFT JOIN inventario_arce i_ar ON p.id_prod = i_ar.fk_id_prod_inv
					 WHERE n.activo_ne = 1
					   AND n.fecha_ne BETWEEN '$startDate' AND '$endDate'
					 GROUP BY p.codigo_prod
					 ORDER BY frecuencia DESC, p.codigo_prod ASC";

		$resultado = $conexion->query($consulta);
		$data = array();
		while ($fila = $resultado->fetch_assoc()) {
			$data[] = $fila;
		}

		echo json_encode([
			'months' => $monthLabels,
			'data' => $data
		], JSON_NUMERIC_CHECK | JSON_UNESCAPED_UNICODE);
	}

}
?>