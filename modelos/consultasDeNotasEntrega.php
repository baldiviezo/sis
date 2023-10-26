<?php 
class consultas{
	//-------TABLA DE notas de entrega
	public function readNotasEntrega(){
		include 'conexion.php';
		$consulta = "SELECT * FROM nota_entrega INNER JOIN proforma ON nota_entrega.fk_id_prof_ne = id_prof INNER JOIN usuario ON proforma.fk_id_usua_prof = id_usua INNER JOIN cliente ON proforma.fk_id_clte_prof = id_clte INNER JOIN empresa ON cliente.fk_id_emp_clte = id_emp ORDER BY id_ne DESC";
		$resultado = $conexion->query($consulta);
		$numeroNotaEntrega = $resultado->num_rows;
		$notasEntrega =  array();
		if($numeroNotaEntrega > 0){
			while ($fila = $resultado->fetch_assoc()){
					$datos = array ('id_ne'=>$fila['id_ne'], 'id_prof'=>$fila['fk_id_prof_ne'], 'fecha_prof'=>$fila['fecha_prof'], 'nombre_usua'=>$fila['nombre_usua'], 'apellido_usua'=>$fila['apellido_usua'], 'id_clte'=>$fila['id_clte'], 'nombre_clte'=>$fila['nombre_clte'], 'apellido_clte'=>$fila['apellido_clte'], 'orden_ne'=>$fila['orden_ne'], 'observacion_ne'=>$fila['observacion_ne'], 'estado_ne'=>$fila['estado_ne']);
					$notasEntrega[$fila['id_ne'].'_ne'] = $datos;		
			}
			$json = json_encode($notasEntrega, JSON_UNESCAPED_UNICODE);
			echo $json;
		}else{
			echo json_encode('');
		}
	}
	//------read todas las notas de entrega
	public function readAllNotaEntrega(){
		include 'conexion.php';
		$consulta = "SELECT * FROM nota_entrega INNER JOIN proforma ON nota_entrega.fk_id_prof_ne = id_prof INNER JOIN usuario ON proforma.fk_id_usua_prof = id_usua INNER JOIN cliente ON proforma.fk_id_clte_prof = id_clte INNER JOIN empresa ON cliente.fk_id_emp_clte = id_emp ORDER BY id_prof DESC";
		$resultado = $conexion->query($consulta);
		$numeroNotaEntrega = $resultado->num_rows;
		$notasEntrega =  array();
		if($numeroNotaEntrega > 0){
			while ($fila = $resultado->fetch_assoc()){
					$datos = array ('id_ne'=>$fila['id_ne'], 'id_prof'=>$fila['fk_id_prof_ne']);
					$notasEntrega[$fila['id_ne'].'_ne'] = $datos;		
			}
			$json = json_encode($notasEntrega, JSON_UNESCAPED_UNICODE);
			echo $json;
		}else{
			echo json_encode('');
		}
	}
	//------read prof_prod
	public function readprof_prods(){
		include 'conexion.php';
		$consulta = "SELECT * FROM prof_prod INNER JOIN proforma ON prof_prod.fk_id_prof_pfpd = id_prof INNER JOIN producto ON prof_prod.fk_id_prod_pfpd = id_prod";
		$resultado = $conexion->query($consulta);
		$numeroProductos = $resultado->num_rows;
		$productos =  array();
		if($numeroProductos > 0){
			while ($fila = $resultado->fetch_assoc()){
					$datos = array ('id_pfpd'=>$fila['id_pfpd'], 'fk_id_prof_pfpd'=>$fila['fk_id_prof_pfpd'], 'fk_id_prof_pfpd'=>$fila['fk_id_prof_pfpd'], 'codigo_prod'=>$fila['codigo_prod'], 'nombre_prod'=>$fila['nombre_prod'], 'descripcion_prod'=>$fila['descripcion_prod'], 'imagen_prod'=>$fila['imagen_prod'], 'cantidad_pfpd'=>$fila['cantidad_pfpd'], 'cost_uni_pfpd'=>$fila['cost_uni_pfpd']);
					$productos['pfpd_'.$fila['id_pfpd']] = $datos;		
			}
			$json = json_encode($productos, JSON_UNESCAPED_UNICODE);
			echo $json;
		}else{
			echo json_encode('');
		}
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

		//Sumar cantidades
		/*$consulta = "SELECT * FROM prof_prod WHERE fk_id_prof_pfpd = $id_prof";
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
		}*/
	}
}
?>