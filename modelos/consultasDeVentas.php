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
	//------------------------------------------------------------------------CRUD VNT-PROD-------------------------------------------------------
	//------Read vnt-prods
	public function readVnt_prods(){
		include 'conexion.php';
		$consulta = "SELECT * FROM vnt_prod INNER JOIN producto ON vnt_prod.fk_id_prod_vtpd = id_prod INNER JOIN venta ON vnt_prod.fk_id_vnt_vtpd = id_vnt INNER JOIN marca ON producto.fk_id_mrc_prod = marca.id_mrc INNER JOIN categoria ON producto.fk_id_ctgr_prod = categoria.id_ctgr INNER JOIN usuario ON venta.fk_id_usua_vnt = usuario.id_usua INNER JOIN nota_entrega ON venta.fk_id_ne_vnt = id_ne INNER JOIN proforma ON nota_entrega.fk_id_prof_ne = id_prof INNER JOIN cliente ON proforma.fk_id_clte_prof = id_clte INNER JOIN empresa ON cliente.fk_id_emp_clte = id_emp ORDER BY id_vnt DESC";
		$resultado = $conexion->query($consulta);
		$numeroClientes = $resultado->num_rows;
		$clientes =  array(); 
		if($numeroClientes > 0){
			while ($fila = $resultado->fetch_assoc()){
				$datos = array ('id_vtpd'=>$fila['id_vtpd'], 'numero_prof'=>'SMS'.substr($fila['fecha_vnt'],2,2).'-'.$this->addZerosGo($fila['numero_prof']), 'nombre_usua'=>$fila['nombre_usua'], 'apellido_usua'=>$fila['apellido_usua'], 'nombre_emp'=>$fila['nombre_emp'], 'nombre_clte'=>$fila['nombre_clte'], 'apellido_clte'=>$fila['apellido_clte'], 'nombre_mrc'=>$fila['nombre_mrc'], 'nombre_ctgr'=>$fila['nombre_ctgr'], 'fk_id_prod_vtpd'=>$fila['fk_id_prod_vtpd'], 'codigo_vtpd'=>$fila['codigo_vtpd'], 'imagen_prod'=>$fila['imagen_prod'], 'nombre_prod'=>$fila['nombre_prod'], 'cantidad_vtpd'=>intval($fila['cantidad_vtpd']), 'cost_uni_vtpd'=>doubleval($fila['cost_uni_vtpd']), 'descuento_prof'=>floatval($fila['descuento_prof']), 'fecha_ne'=>$fila['fecha_ne'], 'fecha_vnt'=>$fila['fecha_vnt'], 'estado_ne'=>$fila['estado_ne']);
				$clientes['id_vtpd_'.$fila['id_vtpd']] = $datos;
			}
			$json = json_encode($clientes, JSON_UNESCAPED_UNICODE);
			echo $json;
		}else{
			echo json_encode('');
		}
	}
	public function addZerosGo($numero) {
		return str_pad($numero, 4, "0", STR_PAD_LEFT);
	}

}
?>