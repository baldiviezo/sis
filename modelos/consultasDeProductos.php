<?php
class consultas {
	public function asignarValoresR(){
		include 'conexion.php';
		//Ponemos TRIM para el momento de comparar, al no usar trim se puede guardar una variable con espasio en la base de datos y al comparar con la misma variable ya guardada en el fronent el espacio se quita y al comparar no son las mismas
		$this->codigo = trim($conexion->real_escape_string(strtoupper($_POST['codigo_prodR'])));
		$this->marca = trim($conexion->real_escape_string($_POST['marca_prodR']));
		$this->categoria = trim($conexion->real_escape_string($_POST['categoria_prodR']));
		$this->nombre = trim($conexion->real_escape_string($_POST['nombre_prodR']));
		$this->descripcion = trim($conexion->real_escape_string($_POST['descripcion_prodR']));
		$this->imagen = trim($conexion->real_escape_string($_FILES['imagen_prodR']['name']));
	}
	public function asignarValoresM(){
		include 'conexion.php';
		$this->id = trim($conexion->real_escape_string($_POST['id_prodM']));
		$this->codigo = trim($conexion->real_escape_string(strtoupper($_POST['codigo_prodM'])));
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
		$consulta = "SELECT * FROM producto INNER JOIN marca ON producto.fk_id_mrc_prod = id_mrc INNER JOIN categoria ON producto.fk_id_ctgr_prod = id_ctgr ORDER BY id_prod DESC"; 
		$resultado = $conexion->query($consulta);
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
			$consulta = "INSERT INTO producto (codigo_prod, fk_id_mrc_prod, fk_id_ctgr_prod, nombre_prod, descripcion_prod, imagen_prod) VALUES ('$this->codigo', '$this->marca', '$this->categoria', '$this->nombre','$this->descripcion', '$nombreImagen')";
			$resultado = $conexion->query($consulta);
			if($resultado){
				$imagenTemporal = $_FILES['imagen_prodR']['tmp_name'];
        		move_uploaded_file($imagenTemporal, "../modelos/imagenes/" . $nombreImagen);
			}
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
		$consulta = "UPDATE producto set codigo_prod='$this->codigo', fk_id_mrc_prod='$this->marca', fk_id_ctgr_prod='$this->categoria', descripcion_prod='$this->descripcion', nombre_prod='$this->nombre' WHERE id_prod='$this->id'";
		$resultado = $conexion->query($consulta);
		if($this->imagen != "" && $resultado){
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
			echo ("Producto modificado exitosamente");
		}
	}
	//------Borrar un producto
	public function borrar($id){
		include 'conexion.php';
		//------Verificar que el producto no este en una o mas proformas
		$consulta = "SELECT * FROM prof_prod WHERE fk_id_prod_pfpd ='$id'";
		$resultado = $conexion->query($consulta);
		$numeroFilas = $resultado->num_rows;
		if($numeroFilas > 0){
			echo ("No se puede eliminar, el producto está siendo utilizado por una o más proformas");
		}else{
			//------Verificar que el producto no este en una o mas proformas modificadas
			$consulta2 = "SELECT * FROM mdf_prof_prod WHERE fk_id_prod_mpfpd ='$id'";
			$resultado2 = $conexion->query($consulta2);
			$numeroFilas2 = $resultado2->num_rows;
			if($numeroFilas2 > 0){
				echo ("No se puede eliminar, el producto está siendo utilizado por una o más proformas modificadas");
			}else {
				//------Verificar que el producto no este en una o mas ventas
				$consulta3 = "SELECT * FROM vnt_prod WHERE fk_id_prod_vtpd = '$id'";
				$resultado3 = $conexion->query($consulta3);
				$numeroFilas3 = $resultado3->num_rows;
				if($numeroFilas3 > 0){
					echo ("No se puede eliminar, el producto está siendo utilizado por una o más ventas");
				}else{
					//------Verificar que el proyecto no este en una o mas Compras
					$consulta4 = "SELECT * FROM cmp_prod WHERE fk_id_prod_cppd = '$id'";
					$resultado4 = $conexion->query($consulta4);
					$numeroFilas4 = $resultado4->num_rows;
					if($numeroFilas4 > 0){
						echo ("No se puede eliminar, el proyecto está siendo utilizado por una o más compras");
					}else{
						//------Verificar que el proyecto no este en una o mas Armados
						$consulta5 = "SELECT * FROM rmd_prod WHERE fk_id_prod_rdpd = '$id'";
						$resultado5 = $conexion->query($consulta5);
						$numeroFilas5 = $resultado5->num_rows;
						if($numeroFilas5 > 0){
							echo ("No se puede eliminar, el proyecto está siendo utilizado por una o más armados");
						}else{
							//------verificar que no exista en inventario
							$consulta = "SELECT * FROM inventario WHERE fk_id_prod_inv ='$id'";
							$resultado = $conexion->query($consulta);
							$numeroFilas = $resultado->num_rows;
							if($numeroFilas > 0){
								echo ("No se puede eliminar, el producto está en el inventario");
							}else{
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
								echo ("Producto eliminado exitosamente");
							}
						}
					}
				}
			}
		}
	}
	//-----------------------------------CRUD MARCAS----------------------------------
	public function readMarcas(){
		include 'conexion.php';
		$consulta = "SELECT * FROM marca ORDER BY nombre_mrc ASC";
		$resultado = $conexion->query($consulta);
		$marcas =  array();
		while ($fila = $resultado->fetch_assoc()){
			$datos = array ( 'id_mrc'=>$fila['id_mrc'], 'nombre_mrc'=>$fila['nombre_mrc']);
			$marcas[$fila['id_mrc'].'_mrc'] = $datos;
		}
		$json = json_encode($marcas, JSON_UNESCAPED_UNICODE);
		echo $json;
	}
	public function createMarca(){
		include 'conexion.php';
		$nombre_mrc = trim($conexion->real_escape_string(strtoupper($_POST['nombre_mrc'])));
		$consulta = "SELECT * FROM marca WHERE nombre_mrc ='$nombre_mrc'";
		$resultado = $conexion->query($consulta);
		$numeroMarcas = $resultado->num_rows;
		if ($numeroMarcas > 0){
			echo ("La marca ya existe");
		}else{
			$consulta = "INSERT INTO marca (nombre_mrc) VALUES ('$nombre_mrc')";
			$resultado = $conexion->query($consulta);
			echo ("Marca creada exitosamente");
		}
	}
	public function deleteMarca($id_mrc){
		include 'conexion.php';
		$consulta = "SELECT * FROM producto WHERE fk_id_mrc_prod='$id_mrc'";
		$resultado = $conexion->query($consulta);
		$numeroFilas = $resultado->num_rows;
		if($numeroFilas > 0){
			echo("Existen productos que utilizan esta marca");
		}else{
			$consulta = "SELECT * FROM mrc_ctgr WHERE fk_id_mrc_mccr = '$id_mrc'";
    		$resultado = $conexion->query($consulta);
    		$numeroFilas = $resultado->num_rows;
    		if($numeroFilas > 0){
				echo("Existen categorias que utilizan esta marca");
			}else{
				$consulta = "DELETE FROM marca WHERE id_mrc='$id_mrc'";
				$resultado = $conexion->query($consulta);
				if (!$resultado) {
					$error = mysqli_error($conexion);
					echo "Error al eliminar la marca: " . $error;
				}else{
					echo ("Marca eliminada exitosamente");
				}
			}
		}
	}
	//----------------------------------CRUD CATEGORIAS------------------------------
	public function readCategorias(){
		include 'conexion.php';
		$consulta = "SELECT * FROM mrc_ctgr 
             INNER JOIN marca ON mrc_ctgr.fk_id_mrc_mccr = id_mrc 
             INNER JOIN categoria ON mrc_ctgr.fk_id_ctgr_mccr = id_ctgr 
             ORDER BY categoria.nombre_ctgr ASC";
		$resultado = $conexion->query($consulta);
		$categorias =  array();
		while ($fila = $resultado->fetch_assoc()){
			$datos = array ( 'id_mccr'=>$fila['id_mccr'], 'id_mrc'=>$fila['id_mrc'], 'nombre_mrc'=>$fila['nombre_mrc'], 'id_ctgr'=>$fila['id_ctgr'], 'nombre_ctgr'=>$fila['nombre_ctgr']);
			$categorias[$fila['id_mccr'].'_mccr'] = $datos;
		}
		$json = json_encode($categorias, JSON_UNESCAPED_UNICODE);
		echo $json;
	}
	public function createCategoria(){
		include 'conexion.php';
		$nombre_ctgr = strtoupper(trim($conexion->real_escape_string($_POST['nombre_ctgr'])));
		$id_mrc = trim($conexion->real_escape_string($_POST['id_mrc']));
		$consulta = "SELECT * FROM categoria WHERE nombre_ctgr ='$nombre_ctgr'";
		$resultado = $conexion->query($consulta);
		$categorias = $resultado->fetch_assoc();
		$numeroCategorias = $resultado->num_rows;
		if ($numeroCategorias > 0){
			$id_ctgr = $categorias['id_ctgr'];
			$consulta = "SELECT * FROM mrc_ctgr WHERE fk_id_ctgr_mccr ='$id_ctgr' AND fk_id_mrc_mccr = '$id_mrc'";
			$resultado = $conexion->query($consulta);
			$numeroCategorias = $resultado->num_rows;
			if ($numeroCategorias > 0){
				echo ("La categoria ya existe");
			}else{
				$consulta = "INSERT INTO  mrc_ctgr (fk_id_mrc_mccr, fk_id_ctgr_mccr) VALUES ($id_mrc, $id_ctgr)";
				$resultado = $conexion->query($consulta);
				echo ("Categoría creada exitosamente");
			}
		}else{
			$consulta = "INSERT INTO categoria (nombre_ctgr) VALUES ('$nombre_ctgr')";
			$resultado = $conexion->query($consulta);
			$consulta = "SELECT MAX(id_ctgr) as id_ctgr_max FROM categoria ";
			$resultado = $conexion->query($consulta);
			$id_ctgr_max = $resultado->fetch_assoc();
			$id_ctgr_max = $id_ctgr_max['id_ctgr_max'];
			$consulta = "INSERT INTO  mrc_ctgr (fk_id_mrc_mccr, fk_id_ctgr_mccr) VALUES ($id_mrc, $id_ctgr_max)";
			$resultado = $conexion->query($consulta);
			echo ("Categoría creada exitosamente");
		}
	}
	public function deleteCategoria($id_ctgr){
		include 'conexion.php';
		$id_mrc = trim($conexion->real_escape_string($_POST['id_mrc']));
		$consulta = "SELECT * FROM producto WHERE fk_id_ctgr_prod='$id_ctgr' AND fk_id_mrc_prod='$id_mrc'";
		$resultado = $conexion->query($consulta);
		$numeroFilas = $resultado->num_rows;
		if($numeroFilas > 0){
			echo("Existe productos que utilizan esta categoría");
		}else{
			$consulta = "DELETE FROM mrc_ctgr WHERE fk_id_ctgr_mccr='$id_ctgr' AND fk_id_mrc_mccr='$id_mrc'";
			$resultado = $conexion->query($consulta);
			if($resultado){
				$consulta = "SELECT * FROM mrc_ctgr WHERE fk_id_ctgr_mccr ='$id_ctgr' AND fk_id_mrc_mccr <> '$id_mrc'";
				$resultado = $conexion->query($consulta);
				$categorias = $resultado->fetch_assoc();
				$numeroCategorias = $resultado->num_rows;
				if ($numeroCategorias > 0){
					echo ('Categoría eliminada exitosamente');
				}else{
					$consulta = "DELETE FROM categoria WHERE id_ctgr='$id_ctgr'";
					$resultado = $conexion->query($consulta);
					echo ('Categoría eliminada exitosamente');
				}
			}
			
		}
	}
}
?>