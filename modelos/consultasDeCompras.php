<?php
class Consultas{
	 public function asignarValores (){
		//protegemos al servidor de los valores que el usuario esta introduciendo
		include 'conexion.php';
		$this->id_prov = $conexion->real_escape_string($_POST['fk_id_prov_cmpR']);
		$this->fecha_cmp = $conexion->real_escape_string($_POST['fecha_cmpR']);//para volverlo en integer
        $this->factura_cmp = $conexion->real_escape_string($_POST['factura_cmpR']);
		$this->descripcion_cmp = $conexion->real_escape_string($_POST['descripcion_cmpR']);
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
	//------Create compra
	public function createBuy($productos){
        include 'conexion.php';
        $consulta = "INSERT INTO compra (fecha_cmp, factura_cmp, fk_id_prov_cmp, descripcion_cmp) VALUES ('$this->fecha_cmp' , '$this->factura_cmp', '$this->id_prov', '$this->descripcion_cmp')";
        echo $this->id_prov;
		$resultado = $conexion->query($consulta);
		$consulta = "SELECT MAX(id_cmp) as id_cmp_max FROM compra";
		$resultado = $conexion->query($consulta);
		$id_cmp = $resultado->fetch_assoc();
		$this->id_cmp = $id_cmp['id_cmp_max'];


		$productos = json_decode($productos,true);
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
    		$consulta4 = "INSERT INTO cmp_prod (fk_id_cmp_cppd, fk_id_prod_cppd, cantidad_cppd) VALUES ('$this->id_cmp' , '$id_prod', '$cantidad')";
			$resultado4 = $conexion->query($consulta4);
		}
    }
    //------Read buy
    //-------TABLA DE compraS
	public function readBuy(){
		include 'conexion.php';
		$input = isset($_POST['readBuy'])?$conexion->real_escape_string($_POST['readBuy']):null;
		//convertir String en array
		$columnas = isset($_POST['selectSearchCompra'])?explode(',',$_POST['selectSearchCompra']):null;
		$orderByBuy = $_POST['orderByBuy'];
		$where = "WHERE (";
		$numeroDeColumnas = isset($_POST['selectSearchCompra'])?count($columnas):null;
		for ($i = 0; $i < $numeroDeColumnas; $i++) {
			$where .= $columnas[$i] . " LIKE '%" . $input . "%' OR ";
		}
		//Elimina ' OR', esto por seguridad, por una inyeccion sql
		$where = substr_replace($where, "", -3);
		$where .= ")";
		$consulta = "SELECT * FROM compra INNER JOIN proveedor ON compra.fk_id_prov_cmp = id_prov INNER JOIN empresa_prov ON proveedor.fk_id_empp_prov = id_empp $where ORDER BY $orderByBuy";
		$resultado = $conexion->query($consulta);
		$numeroproveedores = $resultado->num_rows;
		$proveedores =  array();
		if($numeroproveedores > 0){
			while ($fila = $resultado->fetch_assoc()){
				$datos = array ('id_cmp'=>$fila['id_cmp'], 'fecha_cmp'=>$fila['fecha_cmp'], 'factura_cmp'=>$fila['factura_cmp'], 'nombre_empp'=>$fila['nombre_empp'], 'telefono_empp'=>$fila['telefono_empp'], 'proveedor_prov'=>$fila['nombre_prov'].' '.$fila['apellido_prov'], 'celular_prov'=>$fila['celular_prov'], 'descripcion_cmp'=>$fila['descripcion_cmp']);
				$proveedores[$fila['id_cmp'].'_id_cmp'] = $datos;
			}
			$json = json_encode($proveedores, JSON_UNESCAPED_UNICODE);
			echo $json;
		}else{
			echo json_encode('');
		}
	}
	//-------read a buy
	public function readABuy($id_cmp){
		include 'conexion.php';
		$consulta = "SELECT * FROM compra INNER JOIN proveedor ON compra.fk_id_prov_cmp = id_prov INNER JOIN empresa_prov ON proveedor.fk_id_empp_prov = id_empp WHERE id_cmp='$id_cmp'";
		$resultado = $conexion->query($consulta);
		$compra = $resultado->fetch_assoc();
		$compras =  array();
		$datos = array ('id_cmp'=>$compra['id_cmp'], 'fecha_cmp'=>$compra['fecha_cmp'], 'factura_cmp'=>$compra['factura_cmp'], 'id_prov'=>$compra["fk_id_prov_cmp"], 'proveedor_prov'=>$compra['nombre_prov'].' '.$compra['apellido_prov'], 'id_empp'=>$compra['id_empp'], 'sigla_empp'=>$compra['sigla_empp'], 'descripcion_cmp'=>$compra['descripcion_cmp']);
		$compras['compra'] = $datos;
		


		$consulta = "SELECT * FROM cmp_prod INNER JOIN compra ON cmp_prod.fk_id_cmp_cppd = id_cmp INNER JOIN producto ON cmp_prod.fk_id_prod_cppd = id_prod WHERE fk_id_cmp_cppd='$id_cmp'";
		$resultado = $conexion->query($consulta);
		$numeroProductos = $resultado->num_rows;
		$productos =  array();
		if($numeroProductos > 0){
			$i = 0;
			while ($fila = $resultado->fetch_assoc()){
				$datos = array ('cantidad_cppd'=>$fila['cantidad_cppd'], 'imagen_prod'=>$fila['imagen_prod'], 'codigo_prod'=>$fila['codigo_prod'] , 'nombre_prod'=>$fila['nombre_prod']);
				$productos[$i.'_id_prod'] = $datos;
				$i++;
			}
		}
		$compras['cmp_prod'] = $productos;
		
		$json = json_encode($compras, JSON_UNESCAPED_UNICODE);
		echo $json;
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