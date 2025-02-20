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
	//-------Leer notas de entrega
	public function readNotasEntrega(){
		include 'conexion.php';
		$consulta = "SELECT * FROM nota_entrega INNER JOIN proforma ON nota_entrega.fk_id_prof_ne = id_prof INNER JOIN usuario ON proforma.fk_id_usua_prof = id_usua INNER JOIN cliente ON proforma.fk_id_clte_prof = id_clte INNER JOIN empresa ON cliente.fk_id_emp_clte = id_emp ORDER BY id_ne DESC";
		$resultado = $conexion->query($consulta);
		$numeroNotaEntrega = $resultado->num_rows;
		$notasEntrega =  array();
		if($numeroNotaEntrega > 0){
			while ($fila = $resultado->fetch_assoc()){
				$_prof_mprof_ne = '';
				if ($fila['nombre_emp'] == 'Ninguna'){
					$_prof_mprof_ne = strtoupper('NE-SMS'.substr($fila['fecha_prof'],2,2).'-'.$this->addZerosGo($fila['numero_prof']).'-'.explode(" ",$fila['apellido_clte'])[0]);
				}else{
					$_prof_mprof_ne = strtoupper('NE-SMS'.substr($fila['fecha_prof'],2,2).'-'.$this->addZerosGo($fila['numero_prof']).'-'.$sigla_emp = $fila['sigla_emp']);
				}
				$datos = array ('id_ne'=>$fila['id_ne'], 'id_prof'=>intval($fila['fk_id_prof_ne']), 'numero_prof'=>$_prof_mprof_ne,  'fecha_prof'=>$fila['fecha_prof'], 'fecha_ne'=>$fila['fecha_ne'], 'fk_id_usua_ne'=>$fila['fk_id_usua_ne'], 'nombre_usua'=>$fila['nombre_usua'], 'apellido_usua'=>$fila['apellido_usua'], 'nombre_emp'=>$fila['nombre_emp'], 'id_clte'=>$fila['id_clte'], 'nombre_clte'=>$fila['nombre_clte'], 'apellido_clte'=>$fila['apellido_clte'], 'orden_ne'=>$fila['orden_ne'], 'total_prof'=>doubleval($fila['total_prof']), 'observacion_ne'=>$fila['observacion_ne'], 'estado_ne'=>$fila['estado_ne']);
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
				//-----Cambiar el estado estado_pfpd
				$consulta = "UPDATE prof_prod set estado_pfpd='vendido' WHERE fk_id_prof_pfpd = '$this->id_prof'";
				$resultado = $conexion->query($consulta);
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
	//-----Delete nota de entrega
	public function deleteNotaEntrega(){
		include 'conexion.php';
		$id_ne = trim($conexion->real_escape_string($_POST['fk_id_ne_dvl']));
		$motivo_dvl = trim($conexion->real_escape_string($_POST['motivo_dvl']));
		$consulta = "UPDATE nota_entrega set estado_ne = 'DEVOLUCION' WHERE id_ne='$id_ne'";
		$resultado = $conexion->query($consulta);
		//Buscar si la nota de entrega fue facturada
		$consulta = "SELECT * FROM venta WHERE fk_id_ne_vnt = '$id_ne'";
		$resultado = $conexion->query($consulta);
		$numeroNotaEntrega = $resultado->num_rows;
		if ($numeroNotaEntrega > 0) {
			//camabiar el estado de la venta
			$consulta = "UPDATE venta set estado_vnt = 'DEVOLUCION' WHERE fk_id_ne_vnt = '$id_ne'";
			$resultado = $conexion->query($consulta);
			//Eliminar los productos registrado en la tabla nte_inv
			$this->deleteNe_inv($id_ne, $motivo_dvl );
		}else{
			//Eliminar los productos registrado en la tabla nte_inv
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
		$consulta = "SELECT * FROM nte_inv WHERE fk_id_ne_neiv = '$id_ne'";
		$resultado2 = $conexion->query($consulta);
		while ($fila = $resultado2->fetch_assoc()){
			$id_inv = $fila['fk_id_inv_neiv'];
			$codigo_neiv =	$fila['codigo_neiv'];
			$cantidad_neiv = $fila['cantidad_neiv'];
			$cost_uni_neiv = $fila['cost_uni_neiv'];
			//Sumar las cantidades de los productos vendidos
			$consulta3 = "UPDATE inventario SET cantidad_inv = cantidad_inv + '$cantidad_neiv' WHERE id_inv='$id_inv'";
			$resultado3 = $conexion->query($consulta3);
			//registrar los productos devueltos a la tabla dvl_inv
			$consulta = "INSERT INTO dvl_inv (fk_id_dvl_dliv, fk_id_inv_dliv, codigo_dliv, cantidad_dliv, cost_uni_dliv) VALUES ('$id_dvl', '$id_inv', '$cantidad_neiv', '$codigo_neiv', '$cost_uni_neiv')";
			$resultado = $conexion->query($consulta);
		}
		echo 'Nota de entrega eliminada correctamente';
	}
	public function addZerosGo($numero) {
		return str_pad($numero, 4, "0", STR_PAD_LEFT);
	}
}
?>