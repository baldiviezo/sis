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
		$this->observacion_cmp = $conexion->real_escape_string($_POST['observacion_cmpR']);
	}
	public function asignarValoresM (){
		//protegemos al servidor de los valores que el usuario esta introduciendo
		include 'conexion.php';
		$this->id_cmp = $conexion->real_escape_string($_POST['id_cmpM']);
		$this->id_prov = $conexion->real_escape_string($_POST['fk_id_prov_cmpM']);
		$this->fecha_cmp = $conexion->real_escape_string($_POST['fecha_cmpM']);//para volverlo en integer
        $this->factura_cmp = $conexion->real_escape_string($_POST['factura_cmpM']);
		$this->descripcion_cmp = $conexion->real_escape_string($_POST['descripcion_cmpM']);
	}
	 //------Read buys
	public function readBuys(){
		include 'conexion.php';
		$consulta = "SELECT * FROM compra INNER JOIN proveedor ON compra.fk_id_prov_cmp = id_prov INNER JOIN empresa_prov ON proveedor.fk_id_empp_prov = id_empp INNER JOIN usuario ON compra.fk_id_usua_cmp = id_usua ORDER BY id_cmp DESC";
		$resultado = $conexion->query($consulta);
		$array = array();
		while ($row = $resultado->fetch_assoc()) {
			$buy = array('id_cmp'=>$row['id_cmp'], 'numero_cmp'=>$row['numero_cmp'], 'fecha_cmp'=>$row['fecha_cmp'], 'fk_id_usua_cmp'=>$row['fk_id_usua_cmp'], 'nombre_usua'=>$row['nombre_usua'], 'apellido_usua'=>$row['apellido_usua'], 'id_empp'=>$row['id_empp'], 'nombre_empp'=>$row['nombre_empp'], 'fk_id_prov_cmp'=>$row['fk_id_prov_cmp'], 'nombre_prov'=>$row['nombre_prov'], 'apellido_prov'=>$row['apellido_prov'], 'total_cmp'=>$row['total_cmp'], 'forma_pago_cmp'=>$row['forma_pago_cmp'], 'tpo_entrega_cmp'=>$row['tpo_entrega_cmp'], 'estado_cmp'=>$row['estado_cmp'], 'factura_cmp'=>$row['factura_cmp'], 'fecha_entrega_cmp'=>$row['fecha_entrega_cmp'], 'observacion_cmp'=>$row['observacion_cmp']);
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
		$consulta = "INSERT INTO compra (numero_cmp, fecha_cmp, fk_id_prov_cmp, fk_id_usua_cmp, total_cmp, forma_pago_cmp, tpo_entrega_cmp, estado_cmp, observacion_cmp) VALUES ('$nuevo_numero_cmp', '$this->fecha_cmp', '$this->fk_id_prov_cmp', '$this->encargado', '$this->total_cmp', '$this->forma_pago_cmp', '$this->tpo_entrega_cmp', '0', '$this->observacion_cmp')";
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
   
	
	//-----Update compra
	public function updateCompra($productos){
        include 'conexion.php';
        $consulta = "UPDATE compra set fecha_cmp='$this->fecha_cmp', factura_cmp = '$this->factura_cmp', fk_id_prov_cmp = '$this->id_prov', descripcion_cmp = '$this->descripcion_cmp' WHERE id_cmp = '$this->id_cmp'";
		$resultado = $conexion->query($consulta);

		//-----array inicial
		$consulta = "SELECT * FROM cmp_prod  WHERE fk_id_cmp_cppd = '$this->id_cmp'";
		$resultado = $conexion->query($consulta);
		while ($fila = $resultado->fetch_assoc()){
			$id_prod = $fila['fk_id_prod_cppd'];
			//-----Restar productos
			$consulta2 = "SELECT * FROM inventario WHERE fk_id_prod_inv='$id_prod'";
			$resultado2 = $conexion->query($consulta2);
			$inventario = $resultado2->fetch_assoc();
			$cantidad_inv = $inventario['cantidad_inv'];	

			$cantidad_inv = $cantidad_inv - $fila['cantidad_cppd'];
			$consulta3 = "UPDATE inventario set cantidad_inv='$cantidad_inv' WHERE fk_id_prod_inv='$id_prod'";
			$resultado3 = $conexion->query($consulta3);
		}
		//------ARRAY FINAL
		$productos = json_decode($productos,true);

		//------Eliminar productos de la compra
		$consulta = "DELETE FROM cmp_prod WHERE fk_id_cmp_cppd = '$this->id_cmp'";
		$resultado = $conexion->query($consulta);

		foreach($productos as $celda){
    		$codigo = $celda['codigo'];
    		$consulta = "SELECT * FROM producto WHERE codigo_prod='$codigo'";
			$resultado = $conexion->query($consulta);
			$producto = $resultado->fetch_assoc();
			$id_prod = $producto['id_prod'];

			//-----sumar productos
			$consulta2 = "SELECT * FROM inventario WHERE fk_id_prod_inv='$id_prod'";
			$resultado2 = $conexion->query($consulta2);
			$inventario = $resultado2->fetch_assoc();
			$cantidad_inv = $inventario['cantidad_inv'];	

			$cantidad_inv = $cantidad_inv + $celda['cantidad'];
			$consulta3 = "UPDATE inventario set cantidad_inv='$cantidad_inv' WHERE fk_id_prod_inv='$id_prod'";
			$resultado3 = $conexion->query($consulta3);


    		$cantidad = $celda['cantidad'];
    		$consulta2 = "INSERT INTO cmp_prod (fk_id_cmp_cppd, fk_id_prod_cppd, cantidad_cppd) VALUES ('$this->id_cmp' , '$id_prod', '$cantidad')";
			$resultado2 = $conexion->query($consulta2);
		}
    }
    public function deleteCompra($id_cmp){
		//------Eliminar productos de la tabla prof_prof
		include 'conexion.php';

		$consulta = "SELECT * FROM cmp_prod WHERE fk_id_cmp_cppd = '$id_cmp'";
		$resultado = $conexion->query($consulta);
		while ($fila = $resultado->fetch_assoc()){
			$id_prod = $fila['fk_id_prod_cppd'];
			$cantidad_cppd = $fila['cantidad_cppd'];
			$consulta2 = "SELECT * FROM inventario WHERE fk_id_prod_inv = '$id_prod'";
			$resultado2 = $conexion->query($consulta2);
			$inventario = $resultado2->fetch_assoc();
			$cantidad_inv = $inventario['cantidad_inv'];
			$cantidad_inv = $cantidad_inv - $cantidad_cppd;
			$consulta3 = "UPDATE inventario set cantidad_inv='$cantidad_inv' WHERE fk_id_prod_inv='$id_prod'";
			$resultado3 = $conexion->query($consulta3);
		}

		$consulta = "DELETE FROM cmp_prod WHERE fk_id_cmp_cppd = '$id_cmp'";
		$resultado = $conexion->query($consulta);
		//------Eliminar proforma de la tabla proforma
		$consulta = "DELETE FROM compra WHERE id_cmp = '$id_cmp'";
		$resultado = $conexion->query($consulta);
	}
}
?>