<?php
class Consultas{
	 public function asignarValores ($id_usua){
		//protegemos al servidor de los valores que el usuario esta introduciendo
		include 'conexion.php';
		$this->fecha_cmp = $conexion->real_escape_string($_POST['fecha_cmpR']);
		$this->forma_pago_cmp = $conexion->real_escape_string($_POST['forma_pago_cmpR']);
		$this->tpo_entrega_cmp = $conexion->real_escape_string($_POST['tpo_entrega_cmpR']);
		$this->fk_id_prov_cmp = $conexion->real_escape_string($_POST['fk_id_prov_cmpR']);
		$this->encargado = $id_usua;
		$this->total_cmp = $_POST['total_cmpR'];
		$this->tipo_cambio_cmp = $conexion->real_escape_string($_POST['tipo_cambio_cmpR']);
		$this->descuento_cmp = $conexion->real_escape_string($_POST['descuento_cmpR']);
		$this->observacion_cmp = $conexion->real_escape_string($_POST['observacion_cmpR']);
	}
	public function asignarValoresM ($id_usua){
		//protegemos al servidor de los valores que el usuario esta introduciendo
		include 'conexion.php';
		$this->id_cmp = $conexion->real_escape_string($_POST['id_cmpM']);
		$this->fecha_cmp = date('Y-m-d');
		$this->forma_pago_cmp = $conexion->real_escape_string($_POST['forma_pago_cmpM']);
		$this->tpo_entrega_cmp = $conexion->real_escape_string($_POST['tpo_entrega_cmpM']);
		$this->fk_id_prov_cmp = $conexion->real_escape_string($_POST['fk_id_prov_cmpM']);
		$this->encargado = $id_usua;
		$this->total_cmp = floatval($_POST['total_cmpM']);
		$this->tipo_cambio_cmp = $conexion->real_escape_string($_POST['tipo_cambio_cmpM']);
		$this->descuento_cmp = $conexion->real_escape_string($_POST['descuento_cmpM']);
		$this->observacion_cmp = $conexion->real_escape_string($_POST['observacion_cmpM']);
	}
	 //------Read buys
	public function readBuys(){
		include 'conexion.php';
		$consulta = "SELECT * FROM compra INNER JOIN proveedor ON compra.fk_id_prov_cmp = id_prov INNER JOIN empresa_prov ON proveedor.fk_id_empp_prov = id_empp INNER JOIN usuario ON compra.fk_id_usua_cmp = id_usua ORDER BY id_cmp DESC";
		$resultado = $conexion->query($consulta);
		$array = array();
		while ($row = $resultado->fetch_assoc()) {
			$buy = array('id_cmp'=>intval($row['id_cmp']), 'numero_cmp'=>'OC-SMS'.substr($row['fecha_cmp'],2,2).'-'.$row['numero_cmp'], 'fecha_cmp'=>$row['fecha_cmp'], 'fk_id_usua_cmp'=>$row['fk_id_usua_cmp'], 'nombre_usua'=>$row['nombre_usua'], 'apellido_usua'=>$row['apellido_usua'], 'id_empp'=>$row['id_empp'], 'nombre_empp'=>$row['nombre_empp'], 'fk_id_prov_cmp'=>$row['fk_id_prov_cmp'], 'nombre_prov'=>$row['nombre_prov'], 'apellido_prov'=>$row['apellido_prov'], 'total_cmp'=>floatval($row['total_cmp']), 'forma_pago_cmp'=>$row['forma_pago_cmp'], 'tpo_entrega_cmp'=>$row['tpo_entrega_cmp'], 'estado_cmp'=>$row['estado_cmp'],
			'moneda_cmp'=>$row['moneda_cmp'], 'tipo_cambio_cmp'=>number_format(floatval($row['tipo_cambio_cmp']), 2), 'descuento_cmp'=>$row['descuento_cmp'], 'factura_cmp'=>$row['factura_cmp'], 'fecha_entrega_cmp'=>$row['fecha_entrega_cmp'], 'observacion_cmp'=>$row['observacion_cmp']);
			$array[$row['id_cmp'].'_id_cmp'] = $buy;
		}
		echo json_encode($array, JSON_UNESCAPED_UNICODE);
	}
	//------Create compra
	public function createBuy($productos){
        include 'conexion.php';
		$consulta = "SELECT MAX(numero_cmp) as numero_cmp_max FROM compra";
    	$resultado = $conexion->query($consulta);
    	$numero_cmp = $resultado->fetch_assoc();
		$nuevo_numero_cmp = ($numero_cmp['numero_cmp_max'] == null) ? 1 : $numero_cmp['numero_cmp_max'] + 1;
		$consulta = "INSERT INTO compra (numero_cmp, fecha_cmp, fk_id_prov_cmp, fk_id_usua_cmp, total_cmp, forma_pago_cmp, tpo_entrega_cmp, estado_cmp, moneda_cmp, tipo_cambio_cmp, descuento_cmp, observacion_cmp) VALUES ('$nuevo_numero_cmp', '$this->fecha_cmp', '$this->fk_id_prov_cmp', '$this->encargado', '$this->total_cmp', '$this->forma_pago_cmp', '$this->tpo_entrega_cmp', '0', 'Bs', '$this->tipo_cambio_cmp', '$this->descuento_cmp', '$this->observacion_cmp')";
		$resultado = $conexion->query($consulta);
		if ($resultado) {
			//Obteniendo el id de la compra
			$consulta = "SELECT MAX(id_cmp) as id_cmp_max FROM compra ";
    		$resultado = $conexion->query($consulta);
    		$array = $resultado->fetch_assoc();
    		$fk_id_cmp_cppd = $array['id_cmp_max'];
			//Insertando los productos de la compra
			$productos = json_decode($productos,true);
			foreach($productos as $celda){
				//Coprobar que los productos esten creados en inventario
				$consulta = "SELECT * FROM inventario WHERE fk_id_prod_inv = '$celda[fk_id_prod_cppd]'";
				$resultado = $conexion->query($consulta);
				$numero_productos = $resultado->num_rows;
				if ($numero_productos == 0) {
					$consulta = "INSERT INTO inventario (fk_id_prod_inv, cantidad_inv, cost_uni_inv, descripcion_inv) VALUES ('$celda[fk_id_prod_cppd]', 0, 0, '')";
					$resultado = $conexion->query($consulta);
				}
				//Insertando los productos de la compra
				$fk_id_prod_cppd = $celda['fk_id_prod_cppd'];
				$descripcion_cppd = $celda['descripcion_cppd'];
				$cantidad_cppd = $celda['cantidad_cppd'];
				$cost_uni_cppd = $celda['cost_uni_cppd'];
				$consulta = "INSERT INTO cmp_prod (fk_id_cmp_cppd, fk_id_prod_cppd, descripcion_cppd, cantidad_cppd, cost_uni_cppd) VALUES ('$fk_id_cmp_cppd' , '$fk_id_prod_cppd', '$descripcion_cppd', '$cantidad_cppd', '$cost_uni_cppd')";
				$resultado = $conexion->query($consulta);
			}
			echo 'Compra registrada exitosamente';
		}

    }
	//------Update productos recibidos
	public function addBuysToInventory(){
		include 'conexion.php';
		$id_usua = $_POST['id_usua'];
		$id_cmp = $_POST['id_cmp'];
		$fecha_entrega_cmp = $_POST['fecha_entrega_cmp'];
		$factura_cmp = $_POST['factura_cmp'];
		$products = json_decode($_POST['addBuysToInventory'], true);
		$consulta = "UPDATE compra set estado_cmp = '1', fk_id_usua_cmp = '$id_usua', fecha_entrega_cmp = '$fecha_entrega_cmp', factura_cmp = '$factura_cmp' WHERE id_cmp = '$id_cmp'";
		$resultado = $conexion->query($consulta);
		if($resultado){
			//Insertando los productos de la compra
			foreach($products as $celda){
				$fk_id_prod_cppd = $celda['fk_id_prod_cppd'];
				$cantidad_cppd = $celda['cantidad_cppd'];
				$consulta2 = "SELECT * FROM inventario WHERE fk_id_prod_inv = '$fk_id_prod_cppd'";
				$resultado2 = $conexion->query($consulta2);
				$numeroNotaEntrega = $resultado2->num_rows;
				if($numeroNotaEntrega > 0){
					$inventario = $resultado2->fetch_assoc();
					$id_inv = $inventario['id_inv'];
					$cantidad_inv = $inventario['cantidad_inv'];
					$cantidad_inv = $cantidad_inv + $cantidad_cppd;
					$consulta3 = "UPDATE inventario set cantidad_inv='$cantidad_inv' WHERE id_inv='$id_inv'";
					$resultado3 = $conexion->query($consulta3);
				}
			}
			echo 'Se agregado la compra al inventario correctamente';
		}
	}
	//-----Update compra
	public function updateBuy(){
        include 'conexion.php';
        $consulta = "UPDATE compra set fecha_cmp='$this->fecha_cmp', forma_pago_cmp='$this->forma_pago_cmp', tpo_entrega_cmp='$this->tpo_entrega_cmp', fk_id_prov_cmp='$this->fk_id_prov_cmp', fk_id_usua_cmp='$this->encargado', total_cmp='$this->total_cmp', tipo_cambio_cmp='$this->tipo_cambio_cmp', descuento_cmp='$this->descuento_cmp', observacion_cmp='$this->observacion_cmp' WHERE id_cmp = '$this->id_cmp'";
		$resultado = $conexion->query($consulta);
		if ($resultado) {
			$productos = json_decode($_POST['updateBuy'],true);
			//------Eliminar productos de la compra
			$consulta = "DELETE FROM cmp_prod WHERE fk_id_cmp_cppd = '$this->id_cmp'";
			$resultado = $conexion->query($consulta);
			foreach($productos as $celda){
				//Coprobar que los productos esten creados en inventario
				$consulta = "SELECT * FROM inventario WHERE fk_id_prod_inv = '$celda[fk_id_prod_cppd]'";
				$resultado = $conexion->query($consulta);
				$numero_productos = $resultado->num_rows;
				if ($numero_productos == 0) {
					$consulta = "INSERT INTO inventario (fk_id_prod_inv, cantidad_inv, cost_uni_inv, descripcion_inv) VALUES ('$celda[fk_id_prod_cppd]', 0, 0, '')";
					$resultado = $conexion->query($consulta);
				}
				//Insertando los productos de la compra
				$fk_id_prod_cppd = $celda['fk_id_prod_cppd'];
				$descripcion_cppd = $celda['descripcion_cppd'];
				$cantidad_cppd = $celda['cantidad_cppd'];
				$cost_uni_cppd = $celda['cost_uni_cppd'];
				$consulta = "INSERT INTO cmp_prod (fk_id_cmp_cppd, fk_id_prod_cppd, descripcion_cppd, cantidad_cppd, cost_uni_cppd) VALUES ('$this->id_cmp' , '$fk_id_prod_cppd', '$descripcion_cppd', '$cantidad_cppd', '$cost_uni_cppd')";
				$resultado = $conexion->query($consulta);
			}
			echo 'Compra actualizada exitosamente';
		}
    }
    public function deleteBuy($id_cmp){
		//------Eliminar productos de la tabla prof_prof
		include 'conexion.php';
		$consulta = "DELETE FROM cmp_prod WHERE fk_id_cmp_cppd = '$id_cmp'";
		$resultado = $conexion->query($consulta);
		//------Eliminar proforma de la tabla proforma
		$consulta = "DELETE FROM compra WHERE id_cmp = '$id_cmp'";
		$resultado = $conexion->query($consulta);
		if ($resultado) {
			echo 'Compra eliminada exitosamente';
		}
	}
	//------read cpm_prod
	public function readCmp_prods(){
		include 'conexion.php';
		$consulta = "SELECT * FROM cmp_prod INNER JOIN producto ON cmp_prod.fk_id_prod_cppd = producto.id_prod";
		$resultado = $conexion->query($consulta);
		$filas = array();
		while ($fila = $resultado->fetch_assoc()){
			$row = array('id_cppd'=>$fila['id_cppd'], 'fk_id_cmp_cppd'=>$fila['fk_id_cmp_cppd'], 'fk_id_prod_cppd'=>$fila['fk_id_prod_cppd'], 'codigo_prod'=>$fila['codigo_prod'], 'descripcion_prod'=>$fila['descripcion_prod'], 'imagen_prod'=>$fila['imagen_prod'], 'descripcion_cppd'=>$fila['descripcion_cppd'], 'cantidad_cppd'=>$fila['cantidad_cppd'], 'cost_uni_cppd'=>$fila['cost_uni_cppd']);
			$filas[$fila['id_cppd'].'_cppd'] = $row;
		}
		echo json_encode($filas, JSON_UNESCAPED_UNICODE);
	}
}
?>