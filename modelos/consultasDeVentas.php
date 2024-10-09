<?php
class Consultas{
	//------------------------------------------------------------------------CRUD VENTA---------------------------------------------------
    public function asignarValores(){
		//protegemos al servidor de los valores que el usuario esta introduciendo
		include 'conexion.php';
		$this->id_ne = $conexion->real_escape_string($_POST['id_neR']);
		$this->id_clte = $conexion->real_escape_string($_POST['id_clteR']);
		$this->fecha_vnt = $conexion->real_escape_string($_POST['fecha_vntR']);//para volverlo en integer
        $this->factura_vnt = $conexion->real_escape_string($_POST['factura_vntR']);
        $this->fk_id_prof_vnt = $conexion->real_escape_string($_POST['id_profR']);
		$this->descripcion_vnt = $conexion->real_escape_string($_POST['descripcion_vntR']);
	}
	public function asignarValoresM(){
		//protegemos al servidor de los valores que el usuario esta introduciendo
		include 'conexion.php';
		$this->id_vnt = $conexion->real_escape_string($_POST['id_vntM']);
		$this->id_clte = $conexion->real_escape_string($_POST['fk_id_clte_vntM']);
		$this->fecha_vnt = $conexion->real_escape_string($_POST['fecha_vntM']);//para volverlo en integer
        $this->factura_vnt = $conexion->real_escape_string($_POST['factura_vntM']);
        $this->fk_id_prof_vnt = $conexion->real_escape_string($_POST['fk_id_prof_vntM']);
		$this->descripcion_vnt = $conexion->real_escape_string($_POST['descripcion_vntM']);
	}
	//-----read ventas
	public function readSales(){
		include 'conexion.php';
		$consulta = "SELECT * FROM venta INNER JOIN nota_entrega ON venta.fk_id_ne_vnt = id_ne INNER JOIN proforma ON nota_entrega.fk_id_prof_ne = id_prof INNER JOIN cliente ON proforma.fk_id_clte_prof = id_clte INNER JOIN empresa ON cliente.fk_id_emp_clte = id_emp INNER JOIN usuario ON venta.fk_id_usua_vnt = id_usua ORDER BY fecha_vnt DESC";
		$resultado = $conexion->query($consulta);
		$numeroClientes = $resultado->num_rows;
		$clientes =  array();
		if($numeroClientes > 0){
			while ($fila = $resultado->fetch_assoc()){
				$datos = array ('id_vnt'=>$fila['id_vnt'], 'fecha_ne'=>$fila['fecha_ne'], 'fecha_vnt'=>$fila['fecha_vnt'], 'nombre_usua'=>$fila['nombre_usua'], 'apellido_usua'=>$fila['apellido_usua'], 'nombre_emp'=>$fila['nombre_emp'], 'cliente_clte'=>$fila['nombre_clte'].' '.$fila['apellido_clte'], 'orden_ne'=>$fila['orden_ne'], 'factura_vnt'=>$fila['factura_vnt'], 'total_vnt'=>$fila['total_vnt'], 'observacion_vnt'=>$fila['observacion_vnt']);
				$clientes[$fila['id_vnt'].'_id_vnt'] = $datos;
			}
			$json = json_encode($clientes, JSON_UNESCAPED_UNICODE);
			echo $json;
		}
	}
	//-----Create venta
    public function createSale(){
		$id_ne = $_POST['createSale'];
		$products = $_POST['prodCart'];
		$fecha_vnt = $_POST['fecha_vnt'];
		$total_vnt = $_POST['total_vnt'];
		$id_usua = $_POST['id_usua'];
		$factura_vnt = $_POST['factura_vnt'];
		$observacion_vnt = $_POST['observacion_vnt'];
        include 'conexion.php';

	
		

		$consulta = "UPDATE nota_entrega set estado_ne='vendido' WHERE id_ne = '$id_ne'";
		$resultado = $conexion->query($consulta);
		if($resultado){
			$consulta = "INSERT INTO venta (fecha_vnt, factura_vnt, total_vnt, fk_id_ne_vnt, fk_id_usua_vnt, observacion_vnt) VALUES ('$fecha_vnt' , '$factura_vnt', '$total_vnt', '$id_ne', '$id_usua', '$observacion_vnt')"; 
			$resultado = $conexion->query($consulta);
			if($resultado){
				$consulta = "SELECT MAX(id_vnt) as id_vnt_max FROM venta";
				$resultado = $conexion->query($consulta);
				$id_vnt = $resultado->fetch_assoc();
				$id_vnt = $id_vnt['id_vnt_max'];
				$productos = json_decode($products,true);
				foreach($productos as $celda){
					$id_prod = $celda['fk_id_prod_inv'];
					$codigo_vtpd = $celda['codigo_prod'];
					$cantidad_vtpd = $celda['cantidad_pfpd'];
					$cost_uni_vtpd = $celda['cost_uni_pfpd'];
					$consulta = "INSERT INTO vnt_prod (fk_id_vnt_vtpd, fk_id_prod_vtpd, codigo_vtpd, cantidad_vtpd, cost_uni_vtpd) VALUES ('$id_vnt', '$id_prod', '$codigo_vtpd', '$cantidad_vtpd', '$cost_uni_vtpd')";
					$resultado = $conexion->query($consulta);
				}
				echo "Venta registrada exitosamente";
			}
    	}
	}
	//-----Update venta
	public function updateVenta($productos){
        include 'conexion.php';
        $consulta = "UPDATE venta set fecha_vnt='$this->fecha_vnt', factura_vnt = '$this->factura_vnt', fk_id_clte_vnt = '$this->id_clte', fk_id_prof_vnt = '$this->fk_id_prof_vnt', descripcion_vnt = '$this->descripcion_vnt' WHERE id_vnt = '$this->id_vnt'";
		$resultado = $conexion->query($consulta);

		//-----array inicial
		/*$consulta = "SELECT * FROM vnt_prod  WHERE fk_id_vnt_vtpd = '$this->id_vnt'";
		$resultado = $conexion->query($consulta);
		while ($fila = $resultado->fetch_assoc()){
			$id_prod = $fila['fk_id_prod_vtpd'];
			//-----sumar productos
			$consulta2 = "SELECT * FROM inventario WHERE fk_id_prod_inv='$id_prod'";
			$resultado2 = $conexion->query($consulta2);
			$inventario = $resultado2->fetch_assoc();
			$cantidad_inv = $inventario['cantidad_inv'];	

			$cantidad_inv = $cantidad_inv + $fila['cantidad_vtpd'];
			$consulta3 = "UPDATE inventario set cantidad_inv='$cantidad_inv' WHERE fk_id_prod_inv='$id_prod'";
			$resultado3 = $conexion->query($consulta3);
		}*/
		//------ARRAY FINAL
		$productos = json_decode($productos,true);


		//------Eliminar productos de la venta
		$consulta = "DELETE FROM vnt_prod WHERE fk_id_vnt_vtpd = '$this->id_vnt'";
		$resultado = $conexion->query($consulta);


		foreach($productos as $celda){
    		$codigo = $celda['codigo'];
    		$consulta = "SELECT * FROM producto WHERE codigo_prod='$codigo'";
			$resultado = $conexion->query($consulta);
			$producto = $resultado->fetch_assoc();
			$id_prod = $producto['id_prod'];

			/*
			//-----restar productos
			$consulta2 = "SELECT * FROM inventario WHERE fk_id_prod_inv='$id_prod'";
			$resultado2 = $conexion->query($consulta2);
			$inventario = $resultado2->fetch_assoc();
			$cantidad_inv = $inventario['cantidad_inv'];	

			$cantidad_inv = $cantidad_inv - $celda['cantidad'];
			$consulta3 = "UPDATE inventario set cantidad_inv='$cantidad_inv' WHERE fk_id_prod_inv='$id_prod'";
			$resultado3 = $conexion->query($consulta3);  */


    		$cantidad = $celda['cantidad'];
    		$consulta2 = "INSERT INTO vnt_prod (fk_id_vnt_vtpd, fk_id_prod_vtpd, cantidad_vtpd) VALUES ('$this->id_vnt' , '$id_prod', '$cantidad')";
			$resultado2 = $conexion->query($consulta2);
		}
    }
	//-----Delate venta
	public function deleteVenta($id_vnt){
		//------Eliminar productos de la tabla prof_prof
		include 'conexion.php';
		/*
		$consulta = "SELECT * FROM vnt_prod WHERE fk_id_vnt_vtpd = '$id_vnt'";
		$resultado = $conexion->query($consulta);
		while ($fila = $resultado->fetch_assoc()){
			$id_prod = $fila['fk_id_prod_vtpd'];
			$cantidad_vtpd = $fila['cantidad_vtpd'];
			$consulta2 = "SELECT * FROM inventario WHERE fk_id_prod_inv = '$id_prod'";
			$resultado2 = $conexion->query($consulta2);
			$inventario = $resultado2->fetch_assoc();
			$cantidad_inv = $inventario['cantidad_inv'];
			$cantidad_inv = $cantidad_inv + $cantidad_vtpd;
			$consulta3 = "UPDATE inventario set cantidad_inv='$cantidad_inv' WHERE fk_id_prod_inv='$id_prod'";
			$resultado3 = $conexion->query($consulta3);
		}*/

		$consulta = "DELETE FROM vnt_prod WHERE fk_id_vnt_vtpd = '$id_vnt'";
		$resultado = $conexion->query($consulta);
		//------Eliminar proforma de la tabla proforma
		$consulta = "DELETE FROM venta WHERE id_vnt = '$id_vnt'";
		$resultado = $conexion->query($consulta);

		//------Cambiar el estado de la nota de entrega
		$id_prof = $_POST['id_prof'];
		$consulta = "SELECT * FROM nota_entrega WHERE fk_id_prof_ne = '$id_prof'";
		$resultado = $conexion->query($consulta);
		$fila = $resultado->fetch_assoc();
		$id_ne = $fila['id_ne'];
		$consulta = "UPDATE nota_entrega set estado_ne='pendiente' WHERE id_ne = '$id_ne'";
		$resultado = $conexion->query($consulta);
	}
	//------------------------------------------------------------------------CRUD VNT-PROD-------------------------------------------------------
	//------Read vnt-prods
	public function readVnt_prods(){
		include 'conexion.php';
		$consulta = "SELECT * FROM vnt_prod INNER JOIN producto ON vnt_prod.fk_id_prod_vtpd = id_prod INNER JOIN venta ON vnt_prod.fk_id_vnt_vtpd = id_vnt INNER JOIN proforma ON venta.fk_id_prof_vnt = id_prof ORDER BY fecha_vnt DESC";
		$resultado = $conexion->query($consulta);
		$numeroClientes = $resultado->num_rows;
		$clientes =  array();
		if($numeroClientes > 0){
			while ($fila = $resultado->fetch_assoc()){
				$datos = array ('id_vtpd'=>$fila['id_vtpd'], 'fecha_vnt'=>$fila['fecha_vnt'], 'id_prof'=>$fila['id_prof'], 'codigo_prod'=>$fila['codigo_prod'], 'nombre_prod'=>$fila['nombre_prod'], 'imagen_prod'=>$fila['imagen_prod'], 'cantidad_vtpd'=>$fila['cantidad_vtpd'], 'cost_uni_vtpd'=>$fila['cost_uni_vtpd'], 'cost_total_vtpd'=>$fila['cost_total_vtpd']);
				$clientes['id_vtpd_'.$fila['id_vtpd']] = $datos;
			}
			$json = json_encode($clientes, JSON_UNESCAPED_UNICODE);
			echo $json;
		}else{
			echo json_encode('');
		}
	}
}
?>