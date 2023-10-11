<?php
class consultas {
	public function asignarValores (){
		include 'conexion.php';
		//Ponemos TRIM para el momento de comparar, al no usar trim se puede guardar una variable con espasio en la base de datos y al comparar con la misma variable ya guardada en el fronent el espacio se quita y al comparar no son las mismas
		$this->codigo = trim($conexion->real_escape_string($_POST['fk_id_prod_invR'])); //codigo igual a id_prod
		$this->cantidad = trim($conexion->real_escape_string($_POST['cantidad_invR']));
		$this->cu = (trim($conexion->real_escape_string($_POST['cost_uni_invR']))!='')?round(trim($conexion->real_escape_string($_POST['cost_uni_invR'])), 2):0;
		$this->descripcion = trim($conexion->real_escape_string($_POST['descripcion_invR']));
	}
	public function asignarValoresModificar(){
		include 'conexion.php';
		$this->id_inv = trim($conexion->real_escape_string($_POST['id_invM']));
		$this->codigo = trim($conexion->real_escape_string($_POST['fk_id_prod_invM']));
		$this->cantidad = trim($conexion->real_escape_string($_POST['cantidad_invM']));
		$this->cu = isset($_POST['cost_uni_invM'])?round(trim($conexion->real_escape_string($_POST['cost_uni_invM'])), 2):0;
		$this->descripcion = trim($conexion->real_escape_string($_POST['descripcion_invM']));
	}
	//-------Leer inventarios
	public  function readInventories(){
		include 'conexion.php';
		$consulta = "SELECT * FROM inventario INNER JOIN producto ON inventario.fk_id_prod_inv = id_prod ORDER BY id_inv DESC";
		$resultado = $conexion->query($consulta);
		$numeroFilas = $resultado->num_rows;
		$productos =  array();
			while ($fila = $resultado->fetch_assoc()){
				$description = $fila['descripcion_prod'];
				//$description = str_replace("\r" , '<br>', $description);
				$datos = array ('id_inv'=>$fila['id_inv'], 'fk_id_prod_inv'=>$fila['fk_id_prod_inv'], 'marca_prod'=>$fila['marca_prod'], 'categoria_prod'=>$fila['categoria_prod'], 'codigo_prod'=>$fila['codigo_prod'], 'nombre_prod'=>$fila['nombre_prod'], 'descripcion_prod'=>$description, 'imagen_prod'=>$fila['imagen_prod'], 'cantidad_inv'=>$fila['cantidad_inv'], 'cost_uni_inv'=>$fila['cost_uni_inv'], 'descripcion_inv'=>$fila['descripcion_inv']);
				$productos[$fila['codigo_prod']] = $datos;
			}
			echo json_encode($productos, JSON_UNESCAPED_UNICODE);
	}
	//-------Registrar un inventario
	public function createInventory(){
		include 'conexion.php';
		//buscando el id_prod
		$consulta = "SELECT * FROM inventario WHERE fk_id_prod_inv='$this->codigo'";
		$resultado = $conexion->query($consulta);
		$numeroFilas = $resultado->num_rows;
		if($numeroFilas > 0){
			echo ("El producto ya esta en el inventario");	
		}else{
			$consulta = "INSERT INTO inventario (fk_id_prod_inv, cantidad_inv, cost_uni_inv, descripcion_inv) VALUES ('$this->codigo', '$this->cantidad', '$this->cu', '$this->descripcion')";
			//Si la sentencia se ejecuto exitosamente $resultado devuelve true, si no se ejecuto devuelve false
			$resultado = $conexion->query($consulta);
		}
	}
	//------Actualizar un inventario
	public function updateInventory(){
		include 'conexion.php';
		$consulta = "SELECT * FROM inventario WHERE fk_id_prod_inv='$this->codigo'";
		$resultado = $conexion->query($consulta);
		$numeroFilas = $resultado->num_rows;
		if($numeroFilas > 0){
			$inventario = $resultado->fetch_assoc();
			$id_inv = $inventario['id_inv'];
			if($id_inv == $this->id_inv){
				$this->update();
			}else{
				echo json_encode("El producto ya esta en el inventario");
			}
		}else{
			$this->update();
		}
	}
	public function update(){
		include 'conexion.php';
		$consulta = "UPDATE inventario INNER JOIN producto ON inventario.fk_id_prod_inv = id_prod set fk_id_prod_inv='$this->codigo', cantidad_inv='$this->cantidad', cost_uni_inv='$this->cu', descripcion_inv='$this->descripcion' WHERE id_inv='$this->id_inv'";
		$resultado = $conexion->query($consulta);
	}
	//------Borrar un inventario
	public function deleteInventory($id){
		include 'conexion.php';
		//Eliminar imagen de la carpeta imagenes
		$consulta = "DELETE FROM inventario WHERE id_inv='$id'";
		$resultado = $conexion->query($consulta);
	}
}
?>