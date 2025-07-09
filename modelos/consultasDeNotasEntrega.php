<?php 
class consultas{
	//---------------------------------------------------CRUD ORDEN DE COMPRA-------------------------------------------
	//------Read orden de compra
	public function readOrderBuys(){
		require_once 'conexion.php';
		$consulta = "SELECT * FROM orden_compra ORDER BY id_oc DESC";
		$resultado = $conexion->query($consulta);
		$ordenCompra = array();
		while ($fila = $resultado->fetch_array(MYSQLI_ASSOC)) {
			$fila['numero_oc'] = strtoupper('OC-SMS' . substr($fila['fecha_oc'], 2, 2) . '-' . $this->addZerosGo($fila['numero_oc']));
			$ordenCompra[] = $fila;
		}
		echo json_encode($ordenCompra, JSON_NUMERIC_CHECK | JSON_UNESCAPED_UNICODE);
	}
	//------Read OC_PROD
	public function readOcProd(){
		require_once 'conexion.php';
		$consulta = "SELECT * FROM oc_prod ORDER BY id_ocpd DESC";
		$resultado = $conexion->query($consulta);
		$oc_prods = array();
		while ($fila = $resultado->fetch_array(MYSQLI_ASSOC)) {
			$oc_prods[] = $fila;
		}
		echo json_encode($oc_prods, JSON_NUMERIC_CHECK | JSON_UNESCAPED_UNICODE);
	}
	//-----------------------------------------------------------CRUD NOTA DE ENTREGA-------------------------------------------
	//-------Leer notas de entrega
	public function readNotasEntrega(){
		include 'conexion.php';
		$consulta = "SELECT * FROM nota_entrega ORDER BY id_ne DESC";
		$resultado = $conexion->query($consulta);
		$notasEntrega = array();
		while ($fila = $resultado->fetch_array(MYSQLI_ASSOC)) {
			$fila['numero_ne'] = strtoupper('NE-SMS' . substr($fila['fecha_ne'], 2, 2) . '-' . $this->addZerosGo($fila['numero_ne']));
			$notasEntrega[] = $fila;
		}
		echo json_encode($notasEntrega, JSON_NUMERIC_CHECK | JSON_UNESCAPED_UNICODE);
	}
	//------Crear nota de entrega
	public function createNotaEntrega($id_usua){
		if ($_POST['createNotaEntrega'] == '' || $_POST['createNotaEntrega'] == null || $_POST['createNotaEntrega'] == '[]' || $_POST['createNotaEntrega'] == '{}') {
			echo "La nota de entrega no se pudo registrar, inténtelo de nuevo más tarde";
		}else{
			$arrayObjetos = json_decode($_POST['createNotaEntrega'], true);
			$ordenCompra = json_decode($_POST['ordenCompra'], true);
			//-----Asignar valores
			include 'conexion.php';
			$i = 0;
			$id_inv = 0;
			foreach ($arrayObjetos as $valor) {
				$inventario = $ordenCompra['almacen_oc'] == 0 ? 'inventario' : 'inventario_arce';
				$fk_id_prod_nepd = (int) $valor['fk_id_prod_nepd'];
			
				$consulta = "SELECT * FROM $inventario WHERE fk_id_prod_inv = '$fk_id_prod_nepd'";
				$resultado = $conexion->query($consulta);
				$id_inv = $resultado->fetch_assoc()['id_inv'];

				$cantidad_nepd = $valor['cantidad_nepd'];
				$consulta2 = "SELECT * FROM $inventario WHERE id_inv = '$id_inv'";
				$resultado2 = $conexion->query($consulta2);
				$numeroNotaEntrega = $resultado2->num_rows;
				if($numeroNotaEntrega > 0){
					//------Primero verificar que exista productos suficientes en el inventario
					$stock = $resultado2->fetch_assoc();
					if ($cantidad_nepd <= $cantidad_inv = $stock['cantidad_inv']){
						$i++;
					}
				}
				
			}
			//-------Comprobar  que lo productos existan en el inventario
			
			if (count($arrayObjetos) == $i) {
				//Obtener el numero_ne mas alto
				$consulta = "SELECT MAX(numero_ne) AS maximo FROM nota_entrega";
				$resultado = $conexion->query($consulta);
				$max_id_ne = $resultado->fetch_assoc()['maximo'] + 1;
				//-----Crear nota de entrega y que me devuelva el id_ne
				$consulta = "INSERT INTO nota_entrega (numero_ne, fk_id_oc_ne, fk_id_clte_ne, fk_id_usua_ne, fecha_ne, descuento_ne, total_ne, moneda_ne, tipo_cambio_ne, orden_ne, estado_ne, almacen_ne) VALUES ('$max_id_ne','" . $ordenCompra['id_oc'] . "', '" . $ordenCompra['fk_id_clte_oc'] . "', ' $id_usua', '" . $_POST['fecha_ne'] . "', '" . $ordenCompra['descuento_oc'] . "', '" . $_POST['total_ne'] . "', '" . $ordenCompra['moneda_oc'] . "', '" . $ordenCompra['tipo_cambio_oc'] . "', '" . $ordenCompra['orden_oc'] . "', '0', '" . $ordenCompra['almacen_oc'] . "')";
				$resultado = $conexion->query($consulta);
				//-----Obtener el ultimo id de la nota de entrega
				$consulta = "SELECT * FROM nota_entrega ORDER BY id_ne DESC LIMIT 1";
				$resultado = $conexion->query($consulta);
				$id_ne = $resultado->fetch_assoc()['id_ne'];

				//-----Descontar del inventario
				if ($resultado) {
					foreach ($arrayObjetos as $valor) {
						$cantidad_nepd = $valor['cantidad_nepd'];
						$consulta2 = "SELECT * FROM inventario WHERE id_inv = '$id_inv'";
						$resultado2 = $conexion->query($consulta2);
						$inventario = $resultado2->fetch_assoc();
						$cantidad_inv = $inventario['cantidad_inv'];
						$cantidad_inv = $cantidad_inv - $cantidad_nepd;
						$consulta3 = "UPDATE inventario set cantidad_inv='$cantidad_inv' WHERE id_inv='$id_inv'";
						$resultado3 = $conexion->query($consulta3);
						//cambiar estado oc_prod
						$consulta4 = "UPDATE oc_prod set estado_ocpd = 1 WHERE id_ocpd = '" . $valor['id_ocpd'] . "'";
						$resultado4 = $conexion->query($consulta4);
						// obtener cantidad_ocpd
						$consulta5 = "SELECT * FROM oc_prod WHERE id_ocpd = '" . $valor['id_ocpd'] . "'";
						$resultado5 = $conexion->query($consulta5);
						$cantidad_ocpd = $resultado5->fetch_assoc()['cantidad_ocpd'];
						//crear ne_prod
						$consulta6 = "INSERT INTO nte_prod (fk_id_ne_nepd, fk_id_prod_nepd, fk_id_ocpd_nepd, cantidad_nepd, cost_uni_nepd) VALUES ('" . $id_ne . "', '" . $valor['fk_id_prod_nepd'] . "', '" . $valor['id_ocpd'] . "', '$cantidad_nepd', '" . $valor['cost_uni_nepd'] . "')";
						$resultado6 = $conexion->query($consulta6);
					}
					echo "La nota de entrega se registro correctamente";
				}
			}else{
				echo "La nota de entrega no se pudo registrar, los productos no existen o no hay suficientes en el inventario";
			}
		}
	}
	//------Delete nota de entrega
	public function deleteNotaEntrega(){
		include 'conexion.php';
		$id_ne = trim($conexion->real_escape_string($_POST['fk_id_ne_dvl']));
		$motivo_dvl = trim($conexion->real_escape_string($_POST['motivo_dvl']));
		$consulta = "UPDATE nota_entrega set estado_ne = 'DEVOLUCION' WHERE id_ne='$id_ne'";
		$resultado = $conexion->query($consulta);
		//cambiar el estado de la proforma
		$consulta = "UPDATE proforma set estado_prof = 'devolucion' WHERE id_prof = (SELECT fk_id_prof_ne FROM nota_entrega WHERE id_ne = '$id_ne')";
		$resultado = $conexion->query($consulta);
		//Buscar si la nota de entrega fue facturada
		$consulta = "SELECT * FROM venta WHERE fk_id_ne_vnt = '$id_ne'";
		$resultado = $conexion->query($consulta);
		$numeroNotaEntrega = $resultado->num_rows;
		if ($numeroNotaEntrega > 0) {
			//camabiar el estado de la venta
			$consulta = "UPDATE venta set estado_vnt = 'DEVOLUCION' WHERE fk_id_ne_vnt = '$id_ne'";
			$resultado = $conexion->query($consulta);
			//Eliminar los productos registrado en la tabla
			$this->deleteNe_inv($id_ne, $motivo_dvl );
		}else{
			//Eliminar los productos registrado en la tabla 
			$this->deleteNe_inv($id_ne, $motivo_dvl );
		}
	}
	public function deleteNe_inv($id_ne, $motivo_dvl){
		include 'conexion.php';
		//Crear un registro en la tabla devolucion y obtener el ultimo id
		$consulta = "INSERT INTO devolucion (fk_id_ne_dvl, motivo_dvl) VALUES ('$id_ne', '$motivo_dvl')";
		$resultado = $conexion->query($consulta);
		$consulta = "SELECT * FROM devolucion ORDER BY id_dvl DESC LIMIT 1";
		$resultado = $conexion->query($consulta);
		$devolucion = $resultado->fetch_assoc();
		$id_dvl = $devolucion['id_dvl'];
		//Sumar cantidades

		$consulta = "SELECT * FROM nota_entrega WHERE id_ne = '$id_ne'";
		$resultado = $conexion->query($consulta);
		$fk_id_prof_ne = $resultado->fetch_assoc()['fk_id_prof_ne'];
		$consulta2 = "SELECT * FROM prof_prod WHERE fk_id_prof_pfpd = '$fk_id_prof_ne'";
		$resultado2 = $conexion->query($consulta2);
		while ($fila = $resultado2->fetch_assoc()){
			$id_prod = $fila['fk_id_prod_pfpd'];
			$cantidad_pfpd = $fila['cantidad_pfpd'];
			//Sumar las cantidades de los productos vendidos
			$consulta3 = "UPDATE inventario SET cantidad_inv = cantidad_inv + '$cantidad_pfpd' WHERE fk_id_prod_inv='$id_prod'";
			$resultado3 = $conexion->query($consulta3);
		}
		echo 'Nota de entrega eliminada correctamente';
	}
	//-------------------------------------------CRUD NTE-INV---------------------------
	//-------Read nte_inv
	public function readNte_prods(){
    	include 'conexion.php';
    	$consulta = "SELECT * FROM nte_prod";
    	$resultado = $conexion->query($consulta);
    	$nteProds =  array();
    	while ($fila = $resultado->fetch_assoc()){
        	$nteProds[] = $fila;
    	}
    	echo json_encode($nteProds, JSON_NUMERIC_CHECK | JSON_UNESCAPED_UNICODE);
	}
	public function addZerosGo($numero) {
		return str_pad($numero, 4, "0", STR_PAD_LEFT);
	}
}
?>