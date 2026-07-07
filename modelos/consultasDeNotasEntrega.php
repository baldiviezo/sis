<?php 
class consultas{
	//---------------------------------------------------CRUD ORDEN DE COMPRA-------------------------------------------
	//------Read orden de compra
	public function readOrderBuys(){
		require_once 'conexion.php';
		$rol = $_POST['rol_usua'] ?? '';
		$id_usua = $_POST['id_usua'] ?? '';
		$where = '';
		if (!in_array($rol, ['Gerente general', 'Administrador', 'Gerente De Inventario']) && $id_usua !== '') {
			$id_usua = $conexion->real_escape_string($id_usua);
			$where = "AND proforma.fk_id_usua_prof = '$id_usua'";
		}
		$consulta = "SELECT orden_compra.*, proforma.numero_prof, proforma.fecha_prof, cliente.apellido_clte, empresa.id_emp, empresa.sigla_emp FROM orden_compra INNER JOIN cliente ON orden_compra.fk_id_clte_oc = cliente.id_clte INNER JOIN empresa ON cliente.fk_id_emp_clte = empresa.id_emp INNER JOIN proforma ON orden_compra.fk_id_prof_oc = proforma.id_prof WHERE orden_compra.activo_oc = 1 $where ORDER BY id_oc DESC";
		$resultado = $conexion->query($consulta);
		$ordenCompra = array();
		while ($fila = $resultado->fetch_array(MYSQLI_ASSOC)) {
			$fila['numero_oc'] = strtoupper('P-SMS' . substr($fila['fecha_oc'], 2, 2) . '-' . $this->addZerosGo($fila['numero_oc']).'-' . ($fila['id_emp'] == 77 ? explode(" ", $fila['apellido_clte'])[0] : $fila['sigla_emp']));
			$fila['numero_prof'] = strtoupper('SMS' . substr($fila['fecha_prof'], 2, 2) . '-' . $this->addZerosGo($fila['numero_prof']).'-' . ($fila['id_emp'] == 77 ? explode(" ", $fila['apellido_clte'])[0] : $fila['sigla_emp']));
			unset($fila['apellido_clte'], $fila['sigla_emp'], $fila['id_emp']);
			$ordenCompra[] = $fila;
		}
		echo json_encode($ordenCompra, JSON_NUMERIC_CHECK | JSON_UNESCAPED_UNICODE);
	}
	//------Read OC_PROD
	public function readOcProd(){
		require_once 'conexion.php';
		$rol = $_POST['rol_usua'] ?? '';
		$id_usua = $_POST['id_usua'] ?? '';
		$where = '';
		if (!in_array($rol, ['Gerente general', 'Administrador', 'Gerente De Inventario']) && $id_usua !== '') {
			$id_usua = $conexion->real_escape_string($id_usua);
			$where = "AND proforma.fk_id_usua_prof = '$id_usua'";
		}
		$consulta = "SELECT oc_prod.*, orden_compra.numero_oc, orden_compra.fecha_oc, cliente.apellido_clte, empresa.id_emp, empresa.sigla_emp FROM oc_prod INNER JOIN orden_compra ON oc_prod.fk_id_oc_ocpd = orden_compra.id_oc INNER JOIN proforma ON orden_compra.fk_id_prof_oc = proforma.id_prof INNER JOIN cliente ON orden_compra.fk_id_clte_oc = cliente.id_clte INNER JOIN empresa ON cliente.fk_id_emp_clte = empresa.id_emp WHERE orden_compra.activo_oc = 1 $where ORDER BY id_ocpd DESC";
		$resultado = $conexion->query($consulta);
		$oc_prods = array();
		while ($fila = $resultado->fetch_array(MYSQLI_ASSOC)) {
			$fila['numero_oc'] = strtoupper('P-SMS' . substr($fila['fecha_oc'], 2, 2) . '-' . $this->addZerosGo($fila['numero_oc']) . '-' . ($fila['id_emp'] == 77 ? explode(" ", $fila['apellido_clte'])[0] : $fila['sigla_emp']));
			unset($fila['apellido_clte'], $fila['sigla_emp'], $fila['id_emp']);
			$oc_prods[] = $fila;
		}
		echo json_encode($oc_prods, JSON_NUMERIC_CHECK | JSON_UNESCAPED_UNICODE);
	}
	//------Finalizar oc
	public function finalizarOC($id_oc){
		require_once 'conexion.php';
		$id_oc = trim($conexion->real_escape_string($id_oc));
		$consulta = "UPDATE orden_compra SET estado_oc = 1 WHERE id_oc = '$id_oc'";
		$resultado = $conexion->query($consulta);
		if ($resultado) {
			echo "La orden de compra se finalizó correctamente";
		}else{
			echo "Error al finalizar la orden de compra, inténtelo de nuevo más tarde";
		}
	}
	//-------Eliminar orden de compra (soft-delete)
	public function deleteOrderBuy($id_oc){
		include 'conexion.php';
		$id_oc = trim($conexion->real_escape_string($id_oc));

		// Verificar que ningún producto tenga estado_ocpd = 1 (entregado)
		$consulta = "SELECT COUNT(*) AS entregados FROM oc_prod WHERE fk_id_oc_ocpd = '$id_oc' AND estado_ocpd = 1";
		$resultado = $conexion->query($consulta);
		$entregados = $resultado->fetch_assoc()['entregados'];

		if ($entregados > 0) {
			echo "No se puede eliminar el pedido porque tiene productos ya entregados";
			return;
		}

		// Soft-delete
		$consulta = "UPDATE orden_compra SET activo_oc = 0 WHERE id_oc = '$id_oc'";
		$resultado = $conexion->query($consulta);
		if ($resultado) {
			// Revertir estado de la proforma asociada
			$conexion->query("UPDATE proforma SET estado_prof = 0 WHERE id_prof = (SELECT fk_id_prof_oc FROM orden_compra WHERE id_oc = '$id_oc')");
			echo "Pedido eliminado correctamente";
		} else {
			echo "Error al eliminar el pedido, inténtelo de nuevo más tarde";
		}
	}
	//-----------------------------------------------------------CRUD NOTA DE ENTREGA-------------------------------------------
	//-------Leer notas de entrega
	public function readNotasEntrega(){
		include 'conexion.php';
		$rol = $_POST['rol_usua'] ?? '';
		$id_usua = $_POST['id_usua'] ?? '';
		$where = '';
		if (!in_array($rol, ['Gerente general', 'Administrador', 'Gerente De Inventario']) && $id_usua !== '') {
			$id_usua = $conexion->real_escape_string($id_usua);
			$where = "AND proforma.fk_id_usua_prof = '$id_usua'";
		}
		$consulta = "SELECT nota_entrega.*, orden_compra.numero_oc, orden_compra.fecha_oc, orden_compra.fk_id_prof_oc, cliente.apellido_clte, empresa.id_emp, empresa.sigla_emp FROM nota_entrega INNER JOIN orden_compra ON nota_entrega.fk_id_oc_ne = orden_compra.id_oc INNER JOIN proforma ON orden_compra.fk_id_prof_oc = proforma.id_prof INNER JOIN cliente ON orden_compra.fk_id_clte_oc = cliente.id_clte INNER JOIN empresa ON cliente.fk_id_emp_clte = empresa.id_emp WHERE nota_entrega.activo_ne = 1 $where ORDER BY id_ne DESC";
		$resultado = $conexion->query($consulta);
		$notasEntrega = array();
		while ($fila = $resultado->fetch_array(MYSQLI_ASSOC)) {
			$fila['numero_ne'] = strtoupper('NE-SMS' . substr($fila['fecha_ne'], 2, 2) . '-' . $this->addZerosGo($fila['numero_ne']) . '-' . ($fila['id_emp'] == 77 ? explode(" ", $fila['apellido_clte'])[0] : $fila['sigla_emp']));
			$fila['numero_oc'] = strtoupper('P-SMS' . substr($fila['fecha_oc'], 2, 2) . '-' . $this->addZerosGo($fila['numero_oc']) . '-' . ($fila['id_emp'] == 77 ? explode(" ", $fila['apellido_clte'])[0] : $fila['sigla_emp']));
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
						$fk_id_prod_nepd2 = (int) $valor['fk_id_prod_nepd'];
						$consulta = "SELECT * FROM $inventario WHERE fk_id_prod_inv = '$fk_id_prod_nepd2'";
						$resultado = $conexion->query($consulta);
						$id_inv2 = $resultado->fetch_assoc()['id_inv'];

						$cantidad_nepd = $valor['cantidad_nepd'];
						$consulta2 = "SELECT * FROM $inventario WHERE id_inv = '$id_inv2'";
						$resultado2 = $conexion->query($consulta2);
						$stock = $resultado2->fetch_assoc();
						$cantidad_inv = $stock['cantidad_inv'];
						$cantidad_inv = $cantidad_inv - $cantidad_nepd;
						$consulta3 = "UPDATE $inventario set cantidad_inv='$cantidad_inv' WHERE id_inv='$id_inv2'";
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
	//-------Devolver nota de entrega
	public function devolverNotaEntrega($id_usua){
		include 'conexion.php';
		$id_ne = trim($conexion->real_escape_string($_POST['id_ne']));
		$motivo_dvl = trim($conexion->real_escape_string($_POST['motivo_dvl']));

		// 1. Verificar que la NE existe y está activa
		$consulta = "SELECT * FROM nota_entrega WHERE id_ne = '$id_ne' AND activo_ne = 1";
		$resultado = $conexion->query($consulta);
		if ($resultado->num_rows == 0) {
			echo "La nota de entrega no existe o ya fue devuelta";
			return;
		}
		$notaEntrega = $resultado->fetch_assoc();
		$inventario = $notaEntrega['almacen_ne'] == 0 ? 'inventario' : 'inventario_arce';

		// 2. Obtener productos de nte_prod
		$consulta = "SELECT * FROM nte_prod WHERE fk_id_ne_nepd = '$id_ne'";
		$resultado = $conexion->query($consulta);
		$productos = [];
		$total_dvl = 0;
		while ($fila = $resultado->fetch_assoc()) {
			$productos[] = $fila;
			$total_dvl += $fila['cantidad_nepd'] * $fila['cost_uni_nepd'];
		}

		// 3. INSERT devolucion
		$fecha = date('Y-m-d');
		$consulta = "INSERT INTO devolucion (fk_id_ne_dvl, fk_id_usua_dvl, fecha_dvl, motivo_dvl, total_dvl)
					 VALUES ('$id_ne', '$id_usua', '$fecha', '$motivo_dvl', '$total_dvl')";
		$conexion->query($consulta);
		$id_dvl = $conexion->insert_id;

		// 4. Por cada producto: INSERT dvl_prod + restaurar stock + revertir oc_prod
		foreach ($productos as $producto) {
			$fk_id_prod = (int) $producto['fk_id_prod_nepd'];
			$cantidad = $producto['cantidad_nepd'];
			$cost_uni = $producto['cost_uni_nepd'];

			// INSERT dvl_prod
			$conexion->query("INSERT INTO dvl_prod (fk_id_dvl_dp, fk_id_prod_dp, cantidad_dp, cost_uni_dp, almacen_dp)
							  VALUES ('$id_dvl', '$fk_id_prod', '$cantidad', '$cost_uni', '{$notaEntrega['almacen_ne']}')");

			// Restaurar stock
			$inv = $conexion->query("SELECT * FROM $inventario WHERE fk_id_prod_inv = '$fk_id_prod'")->fetch_assoc();
			if ($inv) {
				$nueva_cantidad = $inv['cantidad_inv'] + $cantidad;
				$conexion->query("UPDATE $inventario SET cantidad_inv = '$nueva_cantidad' WHERE id_inv = '{$inv['id_inv']}'");
			}

			// Revertir oc_prod a pendiente
			$conexion->query("UPDATE oc_prod SET estado_ocpd = 0 WHERE id_ocpd = '{$producto['fk_id_ocpd_nepd']}'");
		}

		// 5. Revertir estado de la orden de compra a pendiente
		$conexion->query("UPDATE orden_compra SET estado_oc = 0 WHERE id_oc = '{$notaEntrega['fk_id_oc_ne']}'");

		// 6. Marcar NE como devuelta
		$conexion->query("UPDATE nota_entrega SET activo_ne = 0 WHERE id_ne = '$id_ne'");

		echo "Nota de entrega devuelta correctamente";
	}
	//-------------------------------------------CRUD NTE-INV---------------------------
	//-------Read nte_inv
	public function readNte_prods(){
    	include 'conexion.php';
		$rol = $_POST['rol_usua'] ?? '';
		$id_usua = $_POST['id_usua'] ?? '';
		$where = '';
		if (!in_array($rol, ['Gerente general', 'Administrador', 'Gerente De Inventario']) && $id_usua !== '') {
			$id_usua = $conexion->real_escape_string($id_usua);
			$where = "AND proforma.fk_id_usua_prof = '$id_usua'";
		}
    	$consulta = "SELECT orden_compra.numero_oc, orden_compra.fecha_oc, orden_compra.descuento_oc, orden_compra.moneda_oc, nte_prod.*, producto.codigo_prod, producto.nombre_prod, producto.fk_id_mrc_prod, producto.fk_id_ctgr_prod, producto.imagen_prod, empresa.id_emp, empresa.nombre_emp, empresa.sigla_emp, cliente.nombre_clte, cliente.apellido_clte FROM nte_prod INNER JOIN nota_entrega ON nte_prod.fk_id_ne_nepd = nota_entrega.id_ne INNER JOIN orden_compra ON nota_entrega.fk_id_oc_ne = orden_compra.id_oc INNER JOIN proforma ON orden_compra.fk_id_prof_oc = proforma.id_prof INNER JOIN cliente ON nota_entrega.fk_id_clte_ne = cliente.id_clte INNER JOIN empresa ON cliente.fk_id_emp_clte = empresa.id_emp INNER JOIN producto ON nte_prod.fk_id_prod_nepd = producto.id_prod WHERE nota_entrega.activo_ne = 1 $where ORDER BY id_nepd DESC";
    	$resultado = $conexion->query($consulta);
    	$nteProds =  array();
    	while ($fila = $resultado->fetch_assoc()){
			$fila['numero_oc'] = strtoupper('P-SMS' . substr($fila['fecha_oc'], 2, 2) . '-' . $this->addZerosGo($fila['numero_oc']).'-' . ($fila['id_emp'] == 77 ? explode(" ", $fila['apellido_clte'])[0] : $fila['sigla_emp']));
			unset($fila['sigla_emp'], $fila['id_emp']);
        	$nteProds[] = $fila;
    	}
    	echo json_encode($nteProds, JSON_NUMERIC_CHECK | JSON_UNESCAPED_UNICODE);
	}
	public function addZerosGo($numero) {
		return str_pad($numero, 4, "0", STR_PAD_LEFT);
	}
}
?>