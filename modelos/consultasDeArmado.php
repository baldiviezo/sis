<?php
class Consultas{
	//------------------------------------------------------------------------CRUD VENTA---------------------------------------------------
    public function assignValuesR(){
		include 'conexion.php';
		$this->fecha_rmd = $conexion->real_escape_string($_POST['fecha_rmdR']);
        $this->fk_id_usua_rmd = trim($conexion->real_escape_string($_POST['id_usua']));
        $this->proforma_rmd = Strtoupper(trim($conexion->real_escape_string($_POST['proforma_rmdR'])));
        $this->observacion_rmd = trim($conexion->real_escape_string($_POST['observacion_rmdR']));
	}
	public function assignValuesM(){
		include 'conexion.php'; 
	}
    //-------read armeds
    public function readArmeds(){
        include 'conexion.php';
        $consulta = "SELECT * FROM rmd_prod INNER JOIN armado ON rmd_prod.fk_id_rmd_rdpd = armado.id_rmd INNER JOIN usuario ON armado.fk_id_usua_rmd = usuario.id_usua ORDER BY id_rdpd DESC";
        $resultado = $conexion->query($consulta);
        $array = array();
        if ($resultado->num_rows > 0) {
            while($row = $resultado->fetch_assoc()) {
                $filas = array('id_rmd'=>$row['id_rmd'], 'numero_rmd'=>'RMD-SMS'.substr($row['fecha_rmd'],2,2).'-'.$this->addZerosGo($row['numero_rmd']), 'fecha_rmd'=>$row['fecha_rmd'], 'nombre_usua'=>$row['nombre_usua'], 'apellido_usua'=>$row['apellido_usua'],'proforma_rmd'=>$row['proforma_rmd'], 'codigo_rdpd'=>$row['codigo_rdpd'], 'cantidad_rdpd'=>$row['cantidad_rdpd'], 'estado_rdpd'=>$row['estado_rdpd'], 'observacion_rmd'=>$row['observacion_rmd']);
                $array[$row['id_rdpd'].'_rdpd'] = $filas;
            }
            echo json_encode($array, JSON_UNESCAPED_UNICODE);
        }
    }
	//-------create armed
    public function createArmed(){
        include 'conexion.php';
		$consulta = "SELECT MAX(numero_rmd) as numero_rmd_max FROM armado";
    	$resultado = $conexion->query($consulta);
    	$numero_rmd = $resultado->fetch_assoc();
    	$nuevo_numero_rmd = ($numero_rmd['numero_rmd_max'] == null) ? 1 : $numero_rmd['numero_rmd_max'] + 1;
        $consulta = "INSERT INTO armado (numero_rmd, fecha_rmd, fk_id_usua_rmd, proforma_rmd, observacion_rmd) VALUES ('$nuevo_numero_rmd' ,'$this->fecha_rmd', '$this->fk_id_usua_rmd', '$this->proforma_rmd', '$this->observacion_rmd')";
        $resultado = $conexion->query($consulta);
        if ($resultado) {
            $consulta = "SELECT MAX(id_rmd) as id_rmd_max FROM armado";
    	    $resultado = $conexion->query($consulta);
    	    $id_rmd = $resultado->fetch_assoc();        
            $array = json_decode($_POST['createArmed'],true);
            foreach($array as $celda){
                $fk_id_prod_rdpd = $celda['fk_id_prod_rdpd'];
                $codigo_rdpd = $celda['codigo_rdpd'];
                $cantidad_rdpd = $celda['cantidad_rdpd'];
                $estado_rdpd = $celda['estado_rdpd'];
                //Coprobar que los productos esten creados en inventario
			    $consulta = "SELECT * FROM inventario WHERE fk_id_prod_inv = '$fk_id_prod_rdpd'";
                $resultado = $conexion->query($consulta);
                $numero_productos = $resultado->num_rows;
                if ($numero_productos == 0) {
                    $consulta = "INSERT INTO inventario (fk_id_prod_inv, cantidad_inv, cost_uni_inv, descripcion_inv) VALUES ('$fk_id_prod_rdpd', 0, 0, '')";
                    $resultado = $conexion->query($consulta);
                }
                $consulta = "INSERT INTO rmd_prod (fk_id_rmd_rdpd, fk_id_prod_rdpd, codigo_rdpd, cantidad_rdpd, estado_rdpd) VALUES ('$id_rmd[id_rmd_max]', '$fk_id_prod_rdpd', '$codigo_rdpd', '$cantidad_rdpd', '$estado_rdpd')";
                $resultado = $conexion->query($consulta);
                //------Sumar y restar al inventario
                if ($estado_rdpd == 'agregado'){
                    $consulta2 = "SELECT * FROM inventario WHERE fk_id_prod_inv = '$fk_id_prod_rdpd'";
                    $resultado2 = $conexion->query($consulta2);
				    $inventario = $resultado2->fetch_assoc();
				    $cantidad_inv = $inventario['cantidad_inv'];
				    $cantidad_inv = $cantidad_inv + $cantidad_rdpd;
				    $consulta3 = "UPDATE inventario set cantidad_inv='$cantidad_inv' WHERE fk_id_prod_inv='$fk_id_prod_rdpd'";
				    $resultado3 = $conexion->query($consulta3);
                } else if ($estado_rdpd == 'baja') {
                    $consulta2 = "SELECT * FROM inventario WHERE fk_id_prod_inv = '$fk_id_prod_rdpd'";
                    $resultado2 = $conexion->query($consulta2);
				    $inventario = $resultado2->fetch_assoc();
				    $cantidad_inv = $inventario['cantidad_inv'];
				    $cantidad_inv = $cantidad_inv - $cantidad_rdpd;
				    $consulta3 = "UPDATE inventario set cantidad_inv='$cantidad_inv' WHERE fk_id_prod_inv='$fk_id_prod_rdpd'";
				    $resultado3 = $conexion->query($consulta3);
			    }
            }
        }
        echo "Armado creado exitosamente";
    }
    public function addZerosGo($numero) {
		return str_pad($numero, 4, "0", STR_PAD_LEFT);
	}

}
?>