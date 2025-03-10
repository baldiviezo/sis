<?php
class Consultas{
	//------------------------------------------------------------------------CRUD VENTA---------------------------------------------------
    public function assignValuesR(){
		include 'conexion.php';
		$this->fecha_ing = $conexion->real_escape_string($_POST['fecha_ingR']);
        $this->fk_id_usua_ing = trim($conexion->real_escape_string($_POST['id_usua']));
        $this->observacion_ing = trim($conexion->real_escape_string($_POST['observacion_ingR']));
	}
    //-------read armeds
    public function readIngresos(){
        include 'conexion.php';
        $consulta = "SELECT * FROM ing_prod INNER JOIN ingreso ON ing_prod.fk_id_ing_igpd = ingreso.id_ing INNER JOIN usuario ON ingreso.fk_id_usua_ing = usuario.id_usua ORDER BY id_igpd DESC";
        $resultado = $conexion->query($consulta);
        $array = array();
        if ($resultado->num_rows > 0) {
            while($row = $resultado->fetch_assoc()) {
                $filas = array('id_ing'=>$row['id_ing'], 'numero_ing'=>'I&E-SMS'.substr($row['fecha_ing'],2,2).'-'.$this->addZerosGo($row['numero_ing']), 'fecha_ing'=>$row['fecha_ing'], 'nombre_usua'=>$row['nombre_usua'], 'apellido_usua'=>$row['apellido_usua'], 'codigo_igpd'=>$row['codigo_igpd'], 'cantidad_igpd'=>$row['cantidad_igpd'], 'estado_igpd'=>$row['estado_igpd'], 'observacion_ing'=>$row['observacion_ing']);
                $array[$row['id_igpd'].'_igpd'] = $filas;
            }
            echo json_encode($array, JSON_UNESCAPED_UNICODE);
        }
    }

    public function createIngreso() {
        include 'conexion.php';
		$consulta = "SELECT MAX(numero_ing) as numero_ing_max FROM ingreso";
    	$resultado = $conexion->query($consulta);
    	$numero_ing = $resultado->fetch_assoc();
    	$nuevo_numero_ing = ($numero_ing['numero_ing_max'] == null) ? 1 : $numero_ing['numero_ing_max'] + 1;
        $consulta = "INSERT INTO ingreso (numero_ing, fecha_ing, fk_id_usua_ing, observacion_ing) VALUES ('$nuevo_numero_ing' ,'$this->fecha_ing', '$this->fk_id_usua_ing','$this->observacion_ing')";
        $resultado = $conexion->query($consulta);
        if ($resultado) {
            $consulta = "SELECT MAX(id_ing) as id_ing_max FROM ingreso";
    	    $resultado = $conexion->query($consulta);
    	    $id_ing = $resultado->fetch_assoc();        
            $array = json_decode($_POST['createIngreso'],true);
            foreach($array as $celda){
                $fk_id_prod_igpd = $celda['fk_id_prod_igpd'];
                $codigo_igpd = $celda['codigo_igpd'];
                $cantidad_igpd = $celda['cantidad_igpd'];
                $estado_igpd = $celda['estado_igpd'];
                //Coprobar que los productos esten creados en inventario
			    $consulta = "SELECT * FROM inventario WHERE fk_id_prod_inv = '$fk_id_prod_igpd'";
                $resultado = $conexion->query($consulta);
                $numero_productos = $resultado->num_rows;
                if ($numero_productos == 0) {
                    $consulta = "INSERT INTO inventario (fk_id_prod_inv, cantidad_inv, cost_uni_inv, descripcion_inv) VALUES ('$fk_id_prod_igpd', 0, 0, '')";
                    $resultado = $conexion->query($consulta);
                }
                $consulta = "INSERT INTO ing_prod (fk_id_ing_igpd, fk_id_prod_igpd, codigo_igpd, cantidad_igpd, estado_igpd) VALUES ('$id_ing[id_ing_max]', '$fk_id_prod_igpd', '$codigo_igpd', '$cantidad_igpd', '$estado_igpd')";
                $resultado = $conexion->query($consulta);
                //------Sumar y restar al inventario
                if ($estado_igpd == 'agregado'){
                    $consulta2 = "SELECT * FROM inventario WHERE fk_id_prod_inv = '$fk_id_prod_igpd'";
                    $resultado2 = $conexion->query($consulta2);
				    $inventario = $resultado2->fetch_assoc();
				    $cantidad_inv = $inventario['cantidad_inv'];
				    $cantidad_inv = $cantidad_inv + $cantidad_igpd;
				    $consulta3 = "UPDATE inventario set cantidad_inv='$cantidad_inv' WHERE fk_id_prod_inv='$fk_id_prod_igpd'";
				    $resultado3 = $conexion->query($consulta3);
                } else if ($estado_igpd == 'baja') {
                    $consulta2 = "SELECT * FROM inventario WHERE fk_id_prod_inv = '$fk_id_prod_igpd'";
                    $resultado2 = $conexion->query($consulta2);
				    $inventario = $resultado2->fetch_assoc();
				    $cantidad_inv = $inventario['cantidad_inv'];
				    $cantidad_inv = $cantidad_inv - $cantidad_igpd;
				    $consulta3 = "UPDATE inventario set cantidad_inv='$cantidad_inv' WHERE fk_id_prod_inv='$fk_id_prod_igpd'";
				    $resultado3 = $conexion->query($consulta3);
			    }
            }
        }
        echo "Creado exitosamente";
    }
    public function addZerosGo($numero) {
		return str_pad($numero, 4, "0", STR_PAD_LEFT);
	}

}
?>