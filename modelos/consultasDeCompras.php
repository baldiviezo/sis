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
		$this->total_cmp = $conexion->real_escape_string($_POST['total_cmpR']);
		$this->tipo_cambio_cmp = $conexion->real_escape_string($_POST['tipo_cambio_cmpR']);
		$this->descuento_cmp = $conexion->real_escape_string($_POST['descuento_cmpR']);
		$this->observacion_cmp = $conexion->real_escape_string($_POST['observacion_cmpR']);
		$this->almacen_cmp = $conexion->real_escape_string($_POST['almacen_cmp']);
	}
	public function asignarValoresCppd (){
		include 'conexion.php';
		$this->id_cppd = $conexion->real_escape_string($_POST['id_cppd']);
		$this->fecha_entrega_cppd = $conexion->real_escape_string($_POST['fecha_entrega_cppd']);
		$this->fecha_factura_cppd = $conexion->real_escape_string($_POST['fecha_factura_cppd']);
		$this->cantidad_cppd = $conexion->real_escape_string($_POST['cantidad_cppd']);
		$this->factura_cppd = $conexion->real_escape_string($_POST['factura_cppd']);
	}
	//-------------------------------------CRUD COMPRAS------------------------------------------------
	//------Read buys
	public function readBuys(){
		include 'conexion.php';
		$consulta = "SELECT * FROM compra ORDER BY id_cmp DESC";
		$resultado = $conexion->query($consulta);
		$array = array();
		while ($row = $resultado->fetch_assoc()) {
			$row['numero_cmp'] = 'OC-SMS'.substr($row['fecha_cmp'],2,2).'-'.$this->addZerosGo($row['numero_cmp']);
			$array[] = $row;
		}
		echo json_encode($array, JSON_NUMERIC_CHECK | JSON_UNESCAPED_UNICODE);
	}
	//------Create compra
	public function createBuy($productos){
        include 'conexion.php';
		$consulta = "SELECT numero_cmp FROM compra ORDER BY id_cmp DESC LIMIT 1";
    	$resultado = $conexion->query($consulta);
		$numero_cmp = $resultado->fetch_assoc();
		$nuevo_numero_cmp = ($numero_cmp['numero_cmp'] == null) ? 1 : $numero_cmp['numero_cmp'] + 1;

		$consulta = "INSERT INTO compra (numero_cmp, fecha_cmp, fk_id_prov_cmp, fk_id_usua_cmp, total_cmp, forma_pago_cmp, tpo_entrega_cmp, estado_cmp, moneda_cmp, tipo_cambio_cmp, descuento_cmp, observacion_cmp, almacen_cmp) VALUES ('$nuevo_numero_cmp', '$this->fecha_cmp', '$this->fk_id_prov_cmp', '$this->encargado', '$this->total_cmp', '$this->forma_pago_cmp', '$this->tpo_entrega_cmp', '0', 'Bs', '$this->tipo_cambio_cmp', '$this->descuento_cmp', '$this->observacion_cmp', '$this->almacen_cmp')";
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
				$tabla = ($this->almacen_cmp == '1') ? 'inventario_arce' : 'inventario';

				$consulta = "SELECT * FROM $tabla WHERE fk_id_prod_inv = '$celda[fk_id_prod_cppd]'";
				$resultado = $conexion->query($consulta);
				if ($resultado->num_rows == 0) {
   					$consulta = "INSERT INTO $tabla (fk_id_prod_inv, cantidad_inv, cost_uni_inv, descripcion_inv) VALUES ('$celda[fk_id_prod_cppd]', 0, '$celda[cost_uni_cppd]', '')";
    			$resultado = $conexion->query($consulta);
				}
				
				//Insertando los productos de la compra
				$fk_id_prod_cppd = $celda['fk_id_prod_cppd'];
				$descripcion_cppd = $celda['descripcion_cppd'];
				$cantidad_cppd = $celda['cantidad_cppd'];
				$cost_uni_cppd = $celda['cost_uni_cppd'];
				$observacion_cppd = $celda['observacion_cppd'];
				$consulta = "INSERT INTO cmp_prod (fk_id_cmp_cppd, fk_id_prod_cppd, descripcion_cppd, cantidad_cppd, cost_uni_cppd, observacion_cppd, estado_cppd) VALUES ('$fk_id_cmp_cppd' , '$fk_id_prod_cppd', '$descripcion_cppd', '$cantidad_cppd', '$cost_uni_cppd', '$observacion_cppd', 0)";
				$resultado = $conexion->query($consulta);
			}
			echo 'Compra registrada exitosamente';
		}

    }
    public function deleteBuy($id_cmp){
		//------Eliminar productos de la tabla prof_prof
		include 'conexion.php';
		//------verificar si hay productos recibidos en la compra
		$consulta = "SELECT * FROM cmp_prod WHERE fk_id_cmp_cppd = '$id_cmp' AND estado_cppd = 1";
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
	//-------------------------------------CRUD CMP_PROD------------------------------------------------
	//------read cpm_prod
	public function readCmp_prods(){
		include 'conexion.php';
		$consulta = "SELECT * FROM cmp_prod ORDER BY id_cppd ASC";
		$resultado = $conexion->query($consulta);
		$filas = array();
		while ($fila = $resultado->fetch_assoc()){
			$filas[] = $fila;
		}
		echo json_encode($filas, JSON_NUMERIC_CHECK | JSON_UNESCAPED_UNICODE);
	}
	//-----Create cmp_prod
	public function createCmp_prod($object){
		include 'conexion.php';
		//----Convertir el stric a objeto
		$cmp_prod = json_decode($object, true);
		//----Verificar el almacen de la oc
		$consulta = "SELECT * FROM compra WHERE id_cmp = '$cmp_prod[fk_id_cmp_cppd]'";
		$resultado = $conexion->query($consulta);
		$compra = $resultado->fetch_assoc();
		if ($compra['almacen_cmp'] == '0') {
			//Coprobar que los productos esten creados en inventario
			$consulta = "SELECT * FROM inventario WHERE fk_id_prod_inv = '$cmp_prod[fk_id_prod_cppd]'";
			$resultado = $conexion->query($consulta);
			$numero_productos = $resultado->num_rows;
			if ($numero_productos == 0) {
				$consulta = "INSERT INTO inventario (fk_id_prod_inv, cantidad_inv, cost_uni_inv, descripcion_inv) VALUES ('$cmp_prod[fk_id_prod_cppd]', 0, '$cmp_prod[cost_uni_cppd]', '')";
				$resultado = $conexion->query($consulta);
			}
		}else if ($compra['almacen_cmp'] == '1') {
			$consulta = "SELECT * FROM inventario_arce WHERE fk_id_prod_inv = '$cmp_prod[fk_id_prod_cppd]'";
			$resultado = $conexion->query($consulta);
			$numero_productos = $resultado->num_rows;
			if ($numero_productos == 0) {
				$consulta = "INSERT INTO inventario_arce (fk_id_prod_inv, cantidad_inv, cost_uni_inv, descripcion_inv) VALUES ('$cmp_prod[fk_id_prod_cppd]', 0, '$cmp_prod[cost_uni_cppd]', '')";
				$resultado = $conexion->query($consulta);
			}
		}
		
		$consulta = "INSERT INTO cmp_prod (fk_id_cmp_cppd, fk_id_prod_cppd, descripcion_cppd, cantidad_cppd, cost_uni_cppd, observacion_cppd, estado_cppd) VALUES ('$cmp_prod[fk_id_cmp_cppd]', '$cmp_prod[fk_id_prod_cppd]', '$cmp_prod[descripcion_cppd]', '$cmp_prod[cantidad_cppd]', '$cmp_prod[cost_uni_cppd]', '$cmp_prod[observacion_cppd]', 0)";
		$resultado = $conexion->query($consulta);

		//------Actualizar el total de la compra
		$suma = ($cmp_prod['cost_uni_cppd'] * $cmp_prod['cantidad_cppd'])*(1-$compra['descuento_cmp']/100) + $compra['total_cmp'];
		$consulta = "UPDATE compra SET total_cmp = '$suma' WHERE id_cmp = '$cmp_prod[fk_id_cmp_cppd]'";
		$resultado = $conexion->query($consulta);

		if ($resultado) {
			echo $cmp_prod['fk_id_cmp_cppd'];
		}
		
	}
	//------Update productos recibidos
	public function addBuyToInventory(){
		include 'conexion.php';
		//obtener cantidad del producto
		$consulta = "SELECT * FROM cmp_prod WHERE id_cppd = '$this->id_cppd'";
		$resultado = $conexion->query($consulta);
		$fila = $resultado->fetch_assoc();
		$fk_id_cmp_cppd = $fila['fk_id_cmp_cppd'];
		$fk_id_prod_cppd = $fila['fk_id_prod_cppd'];
		$cantidad_cppd = $fila['cantidad_cppd'];
		$descripcion_cppd = $fila['descripcion_cppd'];
		$cost_uni_cppd = $fila['cost_uni_cppd'];
		//obtener almacen
		$consulta = "SELECT * FROM compra WHERE id_cmp = '$fk_id_cmp_cppd'";
		$resultado = $conexion->query($consulta);
		$fila = $resultado->fetch_assoc();
		$almacen = $fila['almacen_cmp'];
		$almacen = ($fila['almacen_cmp'] == '0') ? 'inventario' : 'inventario_arce';

		if ($cantidad_cppd == $this->cantidad_cppd) {
			$consulta = "UPDATE cmp_prod set  factura_cppd = '$this->factura_cppd', fecha_entrega_cppd = '$this->fecha_entrega_cppd',  fecha_factura_cppd = '$this->fecha_factura_cppd', estado_cppd = 1 WHERE id_cppd = '$this->id_cppd'";
			$resultado = $conexion->query($consulta);
			if ($resultado) {
				$consulta = "UPDATE $almacen set cantidad_inv = cantidad_inv + '$this->cantidad_cppd' WHERE fk_id_prod_inv = '$fk_id_prod_cppd'";
				$resultado = $conexion->query($consulta);
			}
		} else if ( $this->cantidad_cppd < $cantidad_cppd && $this->cantidad_cppd > 0) {
			$consulta = "UPDATE cmp_prod set cantidad_cppd = '$this->cantidad_cppd',  factura_cppd = '$this->factura_cppd', fecha_entrega_cppd = '$this->fecha_entrega_cppd',  fecha_factura_cppd = '$this->fecha_factura_cppd', estado_cppd = 1 WHERE id_cppd = '$this->id_cppd'";
			$resultado = $conexion->query($consulta);
			//Añadir el producto restante a la compra
			//vovler $cantidad_cppd  a un numero entero
			$cantidad = intval($cantidad_cppd) - intval($this->cantidad_cppd);
			$consulta2 = "INSERT INTO cmp_prod (fk_id_cmp_cppd, fk_id_prod_cppd, descripcion_cppd, cantidad_cppd, cost_uni_cppd, observacion_cppd, estado_cppd) VALUES ('$fk_id_cmp_cppd', '$fk_id_prod_cppd', '$descripcion_cppd', '$cantidad' , '$cost_uni_cppd' , 'Añadido automaticamente', 0)";
			$resultado2 = $conexion->query($consulta2);
			//Actualizar el inventario
			if ($resultado) {
				$consulta = "UPDATE $almacen set cantidad_inv = cantidad_inv + '$this->cantidad_cppd' WHERE fk_id_prod_inv = '$fk_id_prod_cppd'";
				$resultado = $conexion->query($consulta);
			}
		} 
		echo $fk_id_cmp_cppd;
	}
	//------Delete cmp_prod
	public function deleteCmp_prod($cmp_prod){
		include 'conexion.php';
		$product = json_decode($cmp_prod, true);
		//------Obtener orden de compra
		$consulta = "SELECT * FROM compra WHERE id_cmp = '$product[fk_id_cmp_cppd]'";
		$resultado = $conexion->query($consulta);
		$compra = $resultado->fetch_assoc();

		//------Actualizar el total de la compra
		$resta = ($product['cost_uni_cppd'] * $product['cantidad_cppd'])*(1-$compra['descuento_cmp']/100);
		
		$consulta = "UPDATE compra set total_cmp = total_cmp - '$resta' WHERE id_cmp = '$product[fk_id_cmp_cppd]'";
		$resultado = $conexion->query($consulta);
		if ($resultado) {
			$consulta = "DELETE FROM cmp_prod WHERE id_cppd = '$product[id_cppd]'";
			$resultado = $conexion->query($consulta);
			echo $product['fk_id_cmp_cppd'];
		}
	}
	//------edit factura
	public function editFactura(){
		include 'conexion.php';
		$id_cppd = $_POST['id_cppd'];
		$factura_cppd = $_POST['factura_cppd'];
		$fecha_entrega_cppd = $_POST['fecha_entrega_cppd'];
		$fecha_factura_cppd = $_POST['fecha_factura_cppd'];
		$consulta = "UPDATE cmp_prod set factura_cppd = '$factura_cppd', fecha_entrega_cppd = '$fecha_entrega_cppd', fecha_factura_cppd = '$fecha_factura_cppd' WHERE id_cppd = '$id_cppd'";
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