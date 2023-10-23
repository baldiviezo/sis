<?php
class consultas {
	public function asignarValoresR(){
		include 'conexion.php';
		//Ponemos TRIM para el momento de comparar, al no usar trim se puede guardar una variable con espasio en la base de datos y al comparar con la misma variable ya guardada en el fronent el espacio se quita y al comparar no son las mismas
		$this->codigo = trim($conexion->real_escape_string($_POST['codigo_prodR']));
		$this->marca = trim($conexion->real_escape_string($_POST['marca_prodR']));
		$this->categoria = trim($conexion->real_escape_string($_POST['categoria_prodR']));
		$this->nombre = trim($conexion->real_escape_string($_POST['nombre_prodR']));
		$this->descripcion = trim($conexion->real_escape_string($_POST['descripcion_prodR']));
		$this->imagen = trim($conexion->real_escape_string($_FILES['imagen_prodR']['name']));
	}
	public function asignarValoresM(){
		include 'conexion.php';
		$this->id = trim($conexion->real_escape_string($_POST['id_prodM']));
		$this->codigo = trim($conexion->real_escape_string($_POST['codigo_prodM']));
		$this->marca = trim($conexion->real_escape_string($_POST['marca_prodM']));
		$this->categoria = trim($conexion->real_escape_string($_POST['categoria_prodM']));
		$this->descripcion = trim($conexion->real_escape_string($_POST['descripcion_prodM']));
		$this->nombre = trim($conexion->real_escape_string($_POST['nombre_prodM']));
		$this->imagen = trim($conexion->real_escape_string($_FILES['imagen_prodM']['name']));
	}
	//-------------------------------CRUD PRODUCTS--------------------------------
	//-------Leer productos
	public function readProducts(){
		require 'conexion.php';
		$orderBy = $_POST['readProducts'];
		$consulta = "SELECT * FROM producto INNER JOIN marca ON producto.fk_id_mrc_prod = id_mrc INNER JOIN categoria ON producto.fk_id_ctgr_prod = id_ctgr ORDER BY id_prod DESC"; 
		$resultado = $conexion->query($consulta);
		$numeroFilas = $resultado->num_rows;
		$productos =  array();
		while ($fila = $resultado->fetch_assoc()){
			$description = $fila['descripcion_prod'];
			//$description = str_replace("\r" , '<br>', $description);
			$datos = array ( 'id_prod'=>$fila['id_prod'], 'id_mrc'=>$fila['id_mrc'], 'marca_prod'=>$fila['nombre_mrc'], 'id_ctgr'=>$fila['id_ctgr'], 'categoria_prod'=>$fila['nombre_ctgr'], 'codigo_prod'=>$fila['codigo_prod'], 'nombre_prod'=>$fila['nombre_prod'], 'descripcion_prod'=>$description,  'imagen_prod'=>$fila['imagen_prod']);
			$productos['id_prod_'.$fila['id_prod']] = $datos;
		}
		echo json_encode($productos, JSON_UNESCAPED_UNICODE);
	}
	//-------Registra un producto
	public function registrar(){
		include 'conexion.php';
		$consulta = "SELECT * FROM producto WHERE codigo_prod='$this->codigo'";
		$resultado = $conexion->query($consulta);
		$numeroFilas = $resultado->num_rows;
		if($numeroFilas > 0){
			echo "El codigo ya existe";	
		}else{
			$fecha = new DateTime();
			$nombreImagen=($this->imagen!="")?$fecha->getTimestamp()."_".$this->imagen:"imagen.jpg";
			$imagenTemporal=$_FILES['imagen_prodR']['tmp_name'];
			move_uploaded_file($imagenTemporal, "../modelos/imagenes/".$nombreImagen);
			$consulta = "INSERT INTO producto (codigo_prod, marca_prod, categoria_prod, nombre_prod, descripcion_prod, imagen_prod) VALUES ('$this->codigo', '$this->marca', '$this->categoria', '$this->nombre','$this->descripcion', '$nombreImagen')";
			$resultado = $conexion->query($consulta);
			$consulta = "SELECT MAX(id_prod) as id_prod_max FROM producto";
			$resultado = $conexion->query($consulta);
			$producto = $resultado->fetch_assoc();
			echo $producto['id_prod_max'];
		}
	}
	//------Actualizar un producto
	public function guardar(){
		include 'conexion.php';
		$consulta = "SELECT * FROM producto WHERE codigo_prod='$this->codigo'";
		$resultado = $conexion->query($consulta);
		$numeroFilas = $resultado->num_rows;
		if($numeroFilas > 0){
			$producto = $resultado->fetch_assoc();
			$id_prod = $producto['id_prod'];
			if($id_prod == $this->id){
				$this->update();
			}else{
				echo json_encode("El codigo ya existe");
			}
		}else{
			$this->update();
		}
	}
	public function update(){
		include 'conexion.php';
		$consulta = "UPDATE producto set codigo_prod='$this->codigo', marca_prod='$this->marca', categoria_prod='$this->categoria', descripcion_prod='$this->descripcion', nombre_prod='$this->nombre' WHERE id_prod='$this->id'";
		$resultado = $conexion->query($consulta);
		if($this->imagen != ""){
			//borrar la anterior imagen
			$seleccionar = "SELECT * FROM producto WHERE id_prod='$this->id'";
			$resultado = $conexion->query($seleccionar);
			$producto = $resultado->fetch_assoc();
			if($producto['imagen_prod'] != 'imagen.jpg'){
				if(file_exists("../modelos/imagenes/".$producto['imagen_prod'])){
					unlink("../modelos/imagenes/".$producto['imagen_prod']);
				}
			}	
			//guardar la nueva imagen
			$fecha = new DateTime();
			$nombreImagen=($this->imagen!="")?$fecha->getTimestamp()."_".$this->imagen:"imagen.jpg";
			$imagenTemporal=$_FILES['imagen_prodM']['tmp_name'];
			move_uploaded_file($imagenTemporal, "../modelos/imagenes/".$nombreImagen);
			$consulta = "UPDATE producto set imagen_prod='$nombreImagen' WHERE id_prod='$this->id'";
			$resultado = $conexion->query($consulta);
		}
		if ($resultado){
			echo json_encode("Modificado");
		}
	}
	//------Borrar un producto
	public function borrar($id){
		include 'conexion.php';
		//Eliminar imagen de la carpeta imagenes
		$consulta = "SELECT * FROM producto WHERE id_prod='$id'";
		$resultado = $conexion->query($consulta);
		$producto = $resultado->fetch_assoc();
		//Eliminar en la base de datos
		$consulta = "DELETE FROM producto WHERE id_prod='$id'";
		$resultado = $conexion->query($consulta);
		if ($resultado){
			if($producto['imagen_prod'] != 'imagen.jpg'){
				if(file_exists("../modelos/imagenes/".$producto['imagen_prod'])){
					unlink("../modelos/imagenes/".$producto['imagen_prod']);
				}
			}
		}
	}
	//-----------------------------------CRUD MARCAS----------------------------------
	public function createMarca(){
		include 'conexion.php';
		$marca = trim($conexion->real_escape_string($_POST['nombre_mrc']));
		$consulta = "SELECT * FROM marca WHERE nombre_mrc ='$marca'";
		$resultado = $conexion->query($consulta);
		$numeroMarcas = $resultado->num_rows;
		if ($numeroMarcas > 0){
			echo ("La marca ya existe");
		}else{
			$consulta = "INSERT INTO marca (nombre_mrc) VALUES ('$marca')";
			$resultado = $conexion->query($consulta);
		}
	}
	public function readMarca(){
		include 'conexion.php';
		$consulta = "SELECT * FROM marca";
		$resultado = $conexion->query($consulta);
		$marcas =  array();
		while ($fila = $resultado->fetch_assoc()){
			$datos = array ( 'id_mrc'=>$fila['id_mrc'], 'nombre_mrc'=>$fila['nombre_mrc']);
			$marcas[$fila['id_mrc'].'_mrc'] = $datos;
		}
		$json = json_encode($marcas, JSON_UNESCAPED_UNICODE);
		echo $json;
	}
	public function deleteMarca($nombre){
		include 'conexion.php';
		$consulta = "DELETE FROM marca WHERE nombre_mrc='$nombre'";
		$resultado = $conexion->query($consulta);
	}
	//----------------------------------CRUD CATEGORIAS------------------------------
	public function createCategoria(){
		include 'conexion.php';
		$categoria = trim($conexion->real_escape_string($_POST['nombre_ctgr']));
		$id_mrc = trim($conexion->real_escape_string($_POST['id_mrc']));
		$consulta = "SELECT * FROM mrc_ctgr INNER JOIN categoria ON mrc_ctgr.fk_id_ctgr_mccr = id_ctgr WHERE  fk_id_mrc_mccr = '$id_mrc' AND nombre_ctgr ='$categoria' ";
		$resultado = $conexion->query($consulta);
		$numeroMarcas = $resultado->num_rows;
		if ($numeroMarcas > 0){
			echo ("La categoria ya existe");
		}else{
			$consulta = "INSERT INTO categoria (nombre_ctgr) VALUES ('$categoria')";
			$resultado = $conexion->query($consulta);
			$consulta = "SELECT MAX(id_ctgr) as id_ctgr_max FROM categoria ";
			$resultado = $conexion->query($consulta);
			$id_ctgr = $resultado->fetch_assoc();
			$id_ctgr = $id_ctgr['id_ctgr_max'];
			$consulta = "INSERT INTO  mrc_ctgr (fk_id_mrc_mccr, fk_id_ctgr_mccr) VALUES ($id_mrc, $id_ctgr)";
			$resultado = $conexion->query($consulta);
		}
	}
	public function readCategoria(){
		include 'conexion.php';
		$id_mrc = trim($conexion->real_escape_string($_POST['id_mrc']));
		$consulta = "SELECT * FROM mrc_ctgr INNER JOIN categoria ON mrc_ctgr.fk_id_ctgr_mccr = id_ctgr WHERE fk_id_mrc_mccr = '$id_mrc' ORDER BY nombre_ctgr ASC";
		$resultado = $conexion->query($consulta);
		$categorias =  array();
		while ($fila = $resultado->fetch_assoc()){
			$datos = array ( 'id_ctgr'=>$fila['id_ctgr'], 'nombre_ctgr'=>$fila['nombre_ctgr']);
			$categorias[$fila['id_ctgr'].'_ctgr'] = $datos;
		}
		$json = json_encode($categorias, JSON_UNESCAPED_UNICODE);
		echo $json;
	}
	public function deleteCategoria($nombre){
		include 'conexion.php';
		$consulta = "DELETE FROM categoria WHERE nombre_ctgr='$nombre'";
		$resultado = $conexion->query($consulta);
	}
}
?>