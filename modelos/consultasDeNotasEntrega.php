<?php 
class consultas{
	public function asignarValores (){
		//protegemos al servidor de los valores que el usuario esta introduciendo
		include 'conexion.php';
		$this->id_usua = trim($conexion->real_escape_string($_POST['id_usua']));
		$this->id_prof = trim($conexion->real_escape_string($_POST['id_prof']));
		$this->fecha_ne = trim($conexion->real_escape_string($_POST['fecha_ne']));
		$this->orden_ne = trim($conexion->real_escape_string($_POST['orden_ne']));
		$this->observacion_ne = trim($conexion->real_escape_string($_POST['observacion_ne']));
	}
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
			$notasEntrega[] = $fila;
		}
		echo json_encode($notasEntrega, JSON_NUMERIC_CHECK | JSON_UNESCAPED_UNICODE);
	}
	//------Crear nota de entrega
	public function createNotaEntrega(){
		if ($_POST['arrayObjetos'] == '' || $_POST['arrayObjetos'] == null || $_POST['arrayObjetos'] == '[]' || $_POST['arrayObjetos'] == '{}') {
			echo "La nota de entrega no se pudo registrar, inténtelo de nuevo más tarde";
		}else{
			$arrayObjetos = json_decode($_POST['arrayObjetos'], true);
			include 'conexion.php';
			$i = 0;
			foreach ($arrayObjetos as $valor) {
				$id_inv = $valor['id_inv'];
				$cantidad_neiv = $valor['cantidad_neiv'];
				$consulta2 = "SELECT * FROM inventario WHERE id_inv = '$id_inv'";
				$resultado2 = $conexion->query($consulta2);
				$numeroNotaEntrega = $resultado2->num_rows;
				if($numeroNotaEntrega > 0){
					//------Primero verificar que exista productos suficientes en el inventario
					$inventario = $resultado2->fetch_assoc();
					if ($cantidad_neiv <= $cantidad_inv = $inventario['cantidad_inv']){
						$i++;
					}
				}
			}
			//-------Comprobar  que lo productos existan en el inventario
			if (count($arrayObjetos) == $i) {
				//-----Cambiar el estado estado_Prof
				$consulta = "UPDATE proforma set estado_prof='vendido' WHERE id_prof = '$this->id_prof'";
				$resultado = $conexion->query($consulta);
				//-----Cambiar el estado de la proforma
				$consulta = "INSERT INTO nota_entrega (fk_id_prof_ne, fk_id_usua_ne, fecha_ne, orden_ne, observacion_ne, estado_ne) VALUES ('$this->id_prof', '$this->id_usua', '$this->fecha_ne', '$this->orden_ne', '$this->observacion_ne', 'pendiente')";
				$resultado = $conexion->query($consulta);

				//-----Descontar del inventario
				if ($resultado) {
					foreach ($arrayObjetos as $valor) {
						$id_inv = $valor['id_inv'];
						$cantidad_neiv=	$valor['cantidad_neiv'];
						$consulta2 = "SELECT * FROM inventario WHERE id_inv = '$id_inv'";
						$resultado2 = $conexion->query($consulta2);
						$inventario = $resultado2->fetch_assoc();
						$cantidad_inv = $inventario['cantidad_inv'];
						$cantidad_inv = $cantidad_inv - $cantidad_neiv;
						$consulta3 = "UPDATE inventario set cantidad_inv='$cantidad_inv' WHERE id_inv='$id_inv'";
						$resultado3 = $conexion->query($consulta3);
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
	public function readNte_invs(){
    	include 'conexion.php';
    	$consulta = "SELECT * FROM nte_inv";
    	$resultado = $conexion->query($consulta);
    	$nteInvs =  array();
    	while ($fila = $resultado->fetch_assoc()){
        	$nteInvs[] = $fila;
    	}
    	echo json_encode($nteInvs, JSON_NUMERIC_CHECK | JSON_UNESCAPED_UNICODE);
	}

	public function addZerosGo($numero) {
		return str_pad($numero, 4, "0", STR_PAD_LEFT);
	}
}
?>