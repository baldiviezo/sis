<?php
class consultas {
	public function asignarValores (){
		include 'conexion.php';
		//Ponemos TRIM para el momento de comparar, al no usar trim se puede guardar una variable con espasio en la base de datos y al comparar con la misma variable ya guardada en el fronent el espacio se quita y al comparar no son las mismas
		$this->fk_id_prod = trim($conexion->real_escape_string($_POST['fk_id_prod_invR'])); //codigo igual a id_prod
		$this->cantidad = trim($conexion->real_escape_string($_POST['cantidad_invR']));
		$this->cu = (trim($conexion->real_escape_string($_POST['cost_uni_invR']))!='') ? round(trim($conexion->real_escape_string($_POST['cost_uni_invR'])), 2):0;
		$this->descripcion = trim($conexion->real_escape_string($_POST['descripcion_invR']));
		$this->ubi_almacen = trim($conexion->real_escape_string($_POST['ubi_almacenR']));
	}
	public function asignarValoresModificar(){
		include 'conexion.php';
		$this->id_inv = trim($conexion->real_escape_string($_POST['id_invM']));
		$this->fk_id_prod = trim($conexion->real_escape_string($_POST['fk_id_prod_invM']));
		$this->cantidad = trim($conexion->real_escape_string($_POST['cantidad_invM']));
		$this->cu = isset($_POST['cost_uni_invM'])?round(trim($conexion->real_escape_string($_POST['cost_uni_invM'])), 2):0;
		$this->descripcion = trim($conexion->real_escape_string($_POST['descripcion_invM']));
	}
	//-------Leer inventarios
	public function readInventories() {
		include 'conexion.php';
		$productos = array();
		// Ejemplo de consulta a la base de datos
		$consulta = "SELECT * FROM inventario ORDER BY id_inv DESC";
		$resultado = $conexion->query($consulta);
		$producto = array();
		while ($fila = $resultado->fetch_assoc()) {
			$fila['ubi_almacen'] = "0";
			$productos[] = $fila;
		}
		
		// Ejemplo de otra consulta a la base de datos
		$consulta = "SELECT * FROM inventario_arce ORDER BY id_inv DESC";
		$resultado = $conexion->query($consulta);
		while ($fila = $resultado->fetch_assoc()) {
			$fila['ubi_almacen'] = "1";
			$productos[] = $fila;
		}
		echo json_encode($productos, JSON_NUMERIC_CHECK | JSON_UNESCAPED_UNICODE);
	}
	//-------Registrar un inventario
	public function createInventory(){
		include 'conexion.php';
		//seleccionar almacen
		$inventario = '';
		if ($this->ubi_almacen == "0"){
			$inventario = "inventario";
		}else if ($this->ubi_almacen == "1"){
			$inventario = "inventario_arce";
		}
		//buscando el id_prod
		$consulta = "SELECT * FROM $inventario WHERE fk_id_prod_inv='$this->fk_id_prod'";
		$resultado = $conexion->query($consulta);
		$numeroFilas = $resultado->num_rows;
		if($numeroFilas > 0){
			echo ("El producto ya se encuentra en el inventario");	
		}else{
			$consulta = "INSERT INTO $inventario (fk_id_prod_inv, cost_uni_inv, descripcion_inv) VALUES ('$this->fk_id_prod', '$this->cu', '$this->descripcion')";
			//Si la sentencia se ejecuto exitosamente $resultado devuelve true, si no se ejecuto devuelve false
			$resultado = $conexion->query($consulta);
			echo ("El producto se añadió al inventario exitosamente");
		}
	}
	//------Actualizar un inventario
	public function updateInventory(){
		include 'conexion.php';
		$consulta = "SELECT * FROM inventario WHERE fk_id_prod_inv='$this->fk_id_prod'";
		$resultado = $conexion->query($consulta);
		$numeroFilas = $resultado->num_rows;
		if($numeroFilas > 0){
			$inventario = $resultado->fetch_assoc();
			$id_inv = $inventario['id_inv'];
			if($id_inv == $this->id_inv){
				$this->update();
			}else{
				echo ("El producto ya esta en el inventario");
			}
		}else{
			$this->update();
		}
	}
	public function update(){
		include 'conexion.php';
		$consulta = "UPDATE inventario INNER JOIN producto ON inventario.fk_id_prod_inv = id_prod set   cost_uni_inv='$this->cu', descripcion_inv='$this->descripcion' WHERE id_inv='$this->id_inv'";
		$resultado = $conexion->query($consulta);
		echo ("Inventario actualizado exitosamente");
	}
	//------Borrar un inventario
	public function deleteInventory($id){
		include 'conexion.php';
		$consulta = "SELECT * FROM inventario WHERE id_inv ='$id'";
		$resultado = $conexion->query($consulta);
		$inventario = $resultado->fetch_assoc();
		$id_prod = $inventario['fk_id_prod_inv'];
		$consulta = "SELECT * FROM prof_prod WHERE fk_id_prod_pfpd ='$id_prod'";
		$resultado = $conexion->query($consulta);
		$numeroFilas = $resultado->num_rows;
		if($numeroFilas > 0){
			echo ("No se puede eliminar, el producto está siendo utilizado por una o más proformas");
		}else{
			//Eliminar imagen de la carpeta imagenes
			$consulta = "DELETE FROM inventario WHERE id_inv='$id'";
			$resultado = $conexion->query($consulta);
			echo ("Producto eliminado del inventario exitosamente");
		}
	}
}
?>