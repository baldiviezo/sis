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
			$buy = array('id_cmp'=>intval($row['id_cmp']), 'numero_cmp'=>'OC-SMS'.substr($row['fecha_cmp'],2,2).'-'.$this->addZerosGo($row['numero_cmp']), 'fecha_cmp'=>$row['fecha_cmp'], 'fk_id_usua_cmp'=>$row['fk_id_usua_cmp'], 'nombre_usua'=>$row['nombre_usua'], 'apellido_usua'=>$row['apellido_usua'], 'id_empp'=>$row['id_empp'], 'nombre_empp'=>$row['nombre_empp'], 'fk_id_prov_cmp'=>$row['fk_id_prov_cmp'], 'nombre_prov'=>$row['nombre_prov'], 'apellido_prov'=>$row['apellido_prov'], 'total_cmp'=>floatval($row['total_cmp']), 'forma_pago_cmp'=>$row['forma_pago_cmp'], 'tpo_entrega_cmp'=>$row['tpo_entrega_cmp'], 'estado_cmp'=>$row['estado_cmp'],
			'moneda_cmp'=>$row['moneda_cmp'], 'tipo_cambio_cmp'=>number_format(floatval($row['tipo_cambio_cmp']), 2), 'descuento_cmp'=>$row['descuento_cmp'], 'factura_cmp'=>$row['factura_cmp'], 'observacion_cmp'=>$row['observacion_cmp']);
			$array[$row['id_cmp'].'_id_cmp'] = $buy;
		}
		echo json_encode($array, JSON_UNESCAPED_UNICODE);
	}
	//------Create compra
	public function createBuy($productos){
        include 'conexion.php';
		$consulta = "SELECT numero_cmp FROM compra ORDER BY id_cmp DESC LIMIT 1";
    	$resultado = $conexion->query($consulta);
		$numero_cmp = $resultado->fetch_assoc();
		$nuevo_numero_cmp = ($numero_cmp['numero_cmp'] == null) ? 1 : $numero_cmp['numero_cmp'] + 1;
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
					$consulta = "INSERT INTO inventario (fk_id_prod_inv, cantidad_inv, cost_uni_inv, descripcion_inv) VALUES ('$celda[fk_id_prod_cppd]', 0, '$celda[cost_uni_cppd]', '')";
					$resultado = $conexion->query($consulta);
				}
				//Insertando los productos de la compra
				$fk_id_prod_cppd = $celda['fk_id_prod_cppd'];
				$descripcion_cppd = $celda['descripcion_cppd'];
				$cantidad_cppd = $celda['cantidad_cppd'];
				$cost_uni_cppd = $celda['cost_uni_cppd'];
				$consulta = "INSERT INTO cmp_prod (fk_id_cmp_cppd, fk_id_prod_cppd, descripcion_cppd, cantidad_cppd, cost_uni_cppd, estado_cppd) VALUES ('$fk_id_cmp_cppd' , '$fk_id_prod_cppd', '$descripcion_cppd', '$cantidad_cppd', '$cost_uni_cppd', 'PENDIENTE')";
				$resultado = $conexion->query($consulta);
			}
			echo 'Compra registrada exitosamente';
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
		//------verificar si hay productos recibidos en la compra
		$consulta = "SELECT * FROM cmp_prod WHERE fk_id_cmp_cppd = '$id_cmp' AND estado_cppd = 'RECIBIDO'";
		$resultado = $conexion->query($consulta);
		$numero_productos = $resultado->num_rows;
		if ($numero_productos > 0) {
			echo 'No se puede eliminar la compra porque tiene productos recibidos';
			return;
		} else {
			$consulta = "DELETE FROM cmp_prod WHERE fk_id_cmp_cppd = '$id_cmp'";
			$resultado = $conexion->query($consulta);
			//------Eliminar proforma de la tabla proforma
			$consulta = "DELETE FROM compra WHERE id_cmp = '$id_cmp'";
			$resultado = $conexion->query($consulta);
			if ($resultado) {
				echo 'Compra eliminada exitosamente';
			}
		}
	}
	//------Change status
	public function changeStateBuy($id_cmp){
		include 'conexion.php';
		$consulta = "UPDATE compra SET estado_cmp = '1' WHERE id_cmp = '$id_cmp'";
		$resultado = $conexion->query($consulta);
		if ($resultado) {
			echo 'Compra actualizada exitosamente';
		}
	}
	//------read cpm_prod
	public function readCmp_prods(){
		include 'conexion.php';
		$consulta = "SELECT * FROM cmp_prod INNER JOIN producto ON cmp_prod.fk_id_prod_cppd = producto.id_prod INNER JOIN compra ON cmp_prod.fk_id_cmp_cppd = compra.id_cmp INNER JOIN marca ON producto.fk_id_mrc_prod = marca.id_mrc INNER JOIN categoria ON producto.fk_id_ctgr_prod = categoria.id_ctgr INNER JOIN usuario ON compra.fk_id_usua_cmp = usuario.id_usua INNER JOIN proveedor ON compra.fk_id_prov_cmp = proveedor.id_prov INNER JOIN empresa_prov ON proveedor.fk_id_empp_prov = empresa_prov.id_empp ORDER BY id_cppd ASC";
		$resultado = $conexion->query($consulta);
		$filas = array();
		while ($fila = $resultado->fetch_assoc()){
			$row = array('id_cppd'=>$fila['id_cppd'], 'fk_id_cmp_cppd'=>$fila['fk_id_cmp_cppd'], 'numero_cmp'=>'OC-SMS'.substr($fila['fecha_cmp'],2,2).'-'.$this->addZerosGo($fila['numero_cmp']), 'fecha_cmp'=>$fila['fecha_cmp'], 'fecha_entrega_cppd'=>$fila['fecha_entrega_cppd'], 'nombre_usua'=>$fila['nombre_usua'], 'apellido_usua'=>$fila['apellido_usua'], 'nombre_empp'=>$fila['nombre_empp'], 'nombre_mrc'=>$fila['nombre_mrc'], 'nombre_ctgr'=>$fila['nombre_ctgr'], 'fk_id_prod_cppd'=>$fila['fk_id_prod_cppd'], 'codigo_prod'=>$fila['codigo_prod'], 'imagen_prod'=>$fila['imagen_prod'], 'descripcion_cppd'=>$fila['descripcion_cppd'], 'factura_cppd'=>$fila['factura_cppd'], 'cantidad_cppd'=>intval($fila['cantidad_cppd']), 'cost_uni_cppd'=>doubleval($fila['cost_uni_cppd']), 'estado_cppd'=>$fila['estado_cppd'],   'descuento_cmp'=>floatval($fila['descuento_cmp']), 'estado_cmp'=>$fila['estado_cmp']);
			$filas[$fila['id_cppd'].'_cppd'] = $row;
		}
		echo json_encode($filas, JSON_UNESCAPED_UNICODE);
	}
	//-----Create cmp_prod
	public function createCmp_prod($object){
		include 'conexion.php';
		//----Convertir el stric a objeto
		$cmp_prod = json_decode($object, true);
		//Coprobar que los productos esten creados en inventario
		$consulta = "SELECT * FROM inventario WHERE fk_id_prod_inv = '$cmp_prod[fk_id_prod_cppd]'";
		$resultado = $conexion->query($consulta);
		$numero_productos = $resultado->num_rows;
		if ($numero_productos == 0) {
			$consulta = "INSERT INTO inventario (fk_id_prod_inv, cantidad_inv, cost_uni_inv, descripcion_inv) VALUES ('$cmp_prod[fk_id_prod_cppd]', 0, '$cmp_prod[cost_uni_cppd]', '')";
			$resultado = $conexion->query($consulta);
		}
		$consulta = "INSERT INTO cmp_prod (fk_id_cmp_cppd, fk_id_prod_cppd, descripcion_cppd, cantidad_cppd, cost_uni_cppd, estado_cppd) VALUES ('$cmp_prod[fk_id_cmp_cppd]', '$cmp_prod[fk_id_prod_cppd]', '$cmp_prod[descripcion_cppd]', '$cmp_prod[cantidad_cppd]', '$cmp_prod[cost_uni_cppd]', 'PENDIENTE')";
		$resultado = $conexion->query($consulta);
		$consulta = "SELECT * FROM compra WHERE id_cmp = '$cmp_prod[fk_id_cmp_cppd]'";
		$resultado = $conexion->query($consulta);
		$product = $resultado->fetch_assoc();
		$descuento = floatval($product['descuento_cmp'])/100;
		$total = (floatval($cmp_prod['cost_uni_cppd']) * intval($cmp_prod['cantidad_cppd']))*(1-$descuento);
		if ($resultado) {
			$consulta = "UPDATE compra set total_cmp = total_cmp + '$total' WHERE id_cmp = '$cmp_prod[fk_id_cmp_cppd]'";
			$resultado = $conexion->query($consulta);
			echo $cmp_prod['fk_id_cmp_cppd'];
		}
	}
	//------Update productos recibidos
	public function addBuyToInventory(){
		include 'conexion.php';
		$id_cppd = $_POST['id_cppd'];
		$fk_id_prod_cppd = $_POST['fk_id_prod_cppd'];
		$codigo_cppd = $_POST['codigo_cppd'];
		$cantidad_cppd = intval($_POST['cantidad_cppd']);
		$cost_uni_cppd = doubleval($_POST['cost_uni_cppd']);
		$factura_cppd = $_POST['factura_cppd'];
		$fecha_entrega_cppd = $_POST['fecha_entrega_cppd'];
		$fk_id_cmp_cppd = $_POST['fk_id_cmp_cppd'];
		//optener cantidad y cost unitario del producto
		$consulta = "SELECT * FROM cmp_prod WHERE id_cppd = '$id_cppd'";
		$resultado = $conexion->query($consulta);
		$fila = $resultado->fetch_assoc();
		if ($resultado) {
			$cantidad = intval($fila['cantidad_cppd']);
			$cost_uni = doubleval($fila['cost_uni_cppd']);
			//encontra el descuento que tiene este producto en la orden de compra
			$consulta = "SELECT compra.descuento_cmp FROM compra INNER JOIN cmp_prod ON compra.id_cmp = cmp_prod.fk_id_cmp_cppd WHERE cmp_prod.id_cppd = '$id_cppd'";
			$resultado = $conexion->query($consulta);
			$fila = $resultado->fetch_assoc();
			$descuento = floatval($fila['descuento_cmp']);
			$diferencia = ($cantidad_cppd*$cost_uni_cppd - $cantidad*$cost_uni)*(1-$descuento/100);
			//restas la diferencia al costo total de la compra
			$consulta = "UPDATE compra set total_cmp = total_cmp + '$diferencia' WHERE id_cmp = '$fk_id_cmp_cppd'";
			$resultado = $conexion->query($consulta);
			if ($resultado) {
				$consulta = "UPDATE cmp_prod set cantidad_cppd = '$cantidad_cppd', cost_uni_cppd = '$cost_uni_cppd', factura_cppd = '$factura_cppd', fecha_entrega_cppd = '$fecha_entrega_cppd', estado_cppd = 'RECIBIDO' WHERE id_cppd = '$id_cppd'";
				$resultado = $conexion->query($consulta);
				if ($resultado) {
					$consulta = "UPDATE inventario set cantidad_inv = cantidad_inv + '$cantidad_cppd' WHERE fk_id_prod_inv = '$fk_id_prod_cppd'";
					$resultado = $conexion->query($consulta);
					echo $fk_id_cmp_cppd;
				}
			}
		}
	}
	//------Delete cmp_prod
	public function deleteCmp_prod($cmp_prod){
		include 'conexion.php';
		$product = json_decode($cmp_prod, true);
		$total = (floatval($product['cost_uni_cppd']) * intval($product['cantidad_cppd']))*(1-floatval($product['descuento_cmp'])/100);
		$consulta = "UPDATE compra set total_cmp = total_cmp - '$total' WHERE id_cmp = '$product[fk_id_cmp_cppd]'";
		$resultado = $conexion->query($consulta);
		if ($resultado) {
			$consulta = "DELETE FROM cmp_prod WHERE id_cppd = '$product[id_cppd]'";
			$resultado = $conexion->query($consulta);
			echo $product['fk_id_cmp_cppd'];
		}
	}
	//------edit factura
	public function editFactura(){
		$id_cppd = $_POST['id_cppd2'];
		$factura_cppd = $_POST['factura_cppd2'];
		include 'conexion.php';
		$consulta = "UPDATE cmp_prod set factura_cppd = '$factura_cppd' WHERE id_cppd = '$id_cppd'";
		$resultado = $conexion->query($consulta);
		if ($resultado) {
			//obtener fk_id_cmp_cppd
			$consulta = "SELECT fk_id_cmp_cppd FROM cmp_prod WHERE id_cppd = '$id_cppd'";
			$resultado = $conexion->query($consulta);
			$fila = $resultado->fetch_assoc();
			echo $fila['fk_id_cmp_cppd'];
		}
	}
	public function addZerosGo($numero) {
		return str_pad($numero, 4, "0", STR_PAD_LEFT);
	}
}
?>