<?php 
class consultas{
	//-------Leer notas de entrega
	public function readNotasEntrega(){
		include 'conexion.php';
		$consulta = "SELECT * FROM nota_entrega INNER JOIN proforma ON nota_entrega.fk_id_prof_ne = id_prof INNER JOIN usuario ON nota_entrega.fk_id_usua_ne = id_usua INNER JOIN cliente ON proforma.fk_id_clte_prof = id_clte INNER JOIN empresa ON cliente.fk_id_emp_clte = id_emp ORDER BY id_ne DESC";
		$resultado = $conexion->query($consulta);
		$numeroNotaEntrega = $resultado->num_rows;
		$notasEntrega =  array();
		if($numeroNotaEntrega > 0){
			while ($fila = $resultado->fetch_assoc()){
					$datos = array ('id_ne'=>$fila['id_ne'], 'id_prof'=>intval($fila['fk_id_prof_ne']), 'numero_prof'=>('NE-SMS'.substr($fila['fecha_ne'],2, 2).'-'.$fila['numero_prof'].'-'.$fila['sigla_emp']),  'fecha_prof'=>$fila['fecha_prof'], 'fecha_ne'=>$fila['fecha_ne'], 'fk_id_usua_ne'=>$fila['fk_id_usua_ne'], 'nombre_usua'=>$fila['nombre_usua'], 'apellido_usua'=>$fila['apellido_usua'], 'nombre_emp'=>$fila['nombre_emp'], 'id_clte'=>$fila['id_clte'], 'nombre_clte'=>$fila['nombre_clte'], 'apellido_clte'=>$fila['apellido_clte'], 'orden_ne'=>$fila['orden_ne'], 'observacion_ne'=>$fila['observacion_ne'], 'estado_ne'=>$fila['estado_ne']);
					$notasEntrega[$fila['id_ne'].'_ne'] = $datos;		
			}
			$json = json_encode($notasEntrega, JSON_UNESCAPED_UNICODE);
			echo $json;
		}else{
			echo json_encode('');
		}
	}
	//------Crear nota de entrega
	public function createNotaEntrega(){
		$arrayObjetos = json_decode($_POST['arrayObjetos'], true);
		$object = json_decode($_POST['createNotaEntrega'], true);
		$id_usua = $_POST['id_usua'];
		include 'conexion.php';
		$id_prof = trim($conexion->real_escape_string($object['fk_id_prof_ne']));
		$orden = trim($conexion->real_escape_string($object['orden_ne']));
		$fecha_ne = trim($conexion->real_escape_string($object['fecha_ne']));
		$observacion = trim($conexion->real_escape_string($object['observacion_ne']));
		$consulta = "INSERT INTO nota_entrega (fk_id_prof_ne, fk_id_usua_ne, fecha_ne, orden_ne, observacion_ne, estado_ne) VALUES ('$id_prof', '$id_usua', '$fecha_ne', '$orden' , '$observacion', 'pendiente')";
		$resultado = $conexion->query($consulta);
		//Restar cantidades
		foreach ($arrayObjetos as $valor) {
			$id_inv = $valor['id_inv'];
			$cantidad =	$valor['cantidad'];
			$consulta2 = "SELECT * FROM inventario WHERE id_inv = '$id_inv'";
			$resultado2 = $conexion->query($consulta2);
			$numeroNotaEntrega = $resultado2->num_rows;
			if($numeroNotaEntrega > 0){
				$inventario = $resultado2->fetch_assoc();
				$cantidad_inv = $inventario['cantidad_inv'];
				$cantidad_inv = $cantidad_inv - $cantidad;
				$consulta3 = "UPDATE inventario set cantidad_inv='$cantidad_inv' WHERE id_inv='$id_inv'";
				$resultado3 = $conexion->query($consulta3);
			}
		}
		echo 'Nota de entrega creada con exito';
	}
	//-----Delete nota de entrega
	public function deleteNotaEntrega($id_ne){
		include 'conexion.php';
		//Modificar el estado de la proforma
		$consulta = "SELECT * FROM nota_entrega WHERE id_ne = '$id_ne'";
		$resultado = $conexion->query($consulta);
		$fila = $resultado->fetch_assoc();
		$id_prof = $fila['fk_id_prof_ne'];
		$consulta = "UPDATE proforma set estado_prof = 'pendiente' WHERE id_prof='$id_prof'";
		$resultado = $conexion->query($consulta);
		//Eliminar nota de entrega
		$consulta = "DELETE FROM nota_entrega WHERE id_ne = '$id_ne'";
		$resultado = $conexion->query($consulta);
		if ($resultado) {
			//Sumar cantidades
			$consulta = "SELECT * FROM prof_prod WHERE fk_id_prof_pfpd = $id_prof";
			$resultado = $conexion->query($consulta);
			while ($fila = $resultado->fetch_assoc()){
				$id_prod = $fila['fk_id_prod_pfpd'];
				$cantidad_pfpd = $fila['cantidad_pfpd'];
				$consulta2 = "SELECT * FROM inventario WHERE fk_id_prod_inv = '$id_prod'";
				$resultado2 = $conexion->query($consulta2);
				$numeroNotaEntrega = $resultado2->num_rows;
				if($numeroNotaEntrega > 0){
					$inventario = $resultado2->fetch_assoc();
					$cantidad_inv = $inventario['cantidad_inv'];
					$cantidad_inv = $cantidad_inv + $cantidad_pfpd;
					$consulta3 = "UPDATE inventario set cantidad_inv='$cantidad_inv' WHERE fk_id_prod_inv='$id_prod'";
					$resultado3 = $conexion->query($consulta3);
				}
			}
			echo 'Nota de entrega eliminada correctamente';
		}
	}
	//--------------------------------------------Estado de proforma---------------------------------
	public function proformaStatus(){
		$object = json_decode($_POST['createNotaEntrega'], true);
		include 'conexion.php';
		$id_prof = $object['fk_id_prof_ne'];
		$consulta = "UPDATE proforma set estado_prof='vendido' WHERE id_prof = '$id_prof'";
		$resultado = $conexion->query($consulta);
	}
}
?>