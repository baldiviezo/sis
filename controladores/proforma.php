<?php
require '../modelos/consultasDeProformas.php';
//---------------------------------------------CRUD PROFORMA
//-------Read proformas
if (isset($_POST['readProformas'])) {
	$readProformas = new consultas;
	$readProformas->readProformas();
}
//--------Create a proforma
if (isset($_POST['createProforma'])){
	session_start();
	$createProforma = new Consultas;
	$createProforma->asignarValores();
	$createProforma->createProforma();
	$createProforma->createProf_prod($_POST['createProforma']);
}
//-------Update a proforma
if (isset($_POST['updateProforma'])) {
	session_start();
	$updateProforma = new Consultas;
	$updateProforma->asignarValoresM();
	$updateProforma->updateProforma($_POST['updateProforma']);
}
//-------Delete a proforma
if (isset($_POST['deleteProforma'])) {
	$deleteProforma = new consultas;
	$deleteProforma->deleteProforma($_POST['deleteProforma']);
}
//---------------------------------------------CRUD PROF_PROD
//-------Read productos de una proforma
if (isset($_POST['readProf_prod'])) {
	$readProf_prod = new consultas;
	$readProf_prod->readProf_prod($_POST['readProf_prod']);
}
//----------------------------------------------CRUD MDF_PROFORMA
//-------Read proformas modificadas
if (isset($_POST['read_mdf_Proforma'])) {
	$read_mdf_Proforma = new consultas;
	$read_mdf_Proforma->read_mdf_Proforma($_POST['read_mdf_Proforma']);
}
//------Mostrar la proforma en un pdf
if (isset($_POST['proforma'])&&isset($_POST['clave'])){
	session_start();
	if(isset($_POST['ne'])){
		$_SESSION['ne']= $_POST['ne'];
	}else{
		$_SESSION['ne']='';
	}
	$proforma = json_decode($_POST['proforma'], true);
	$clave = $_POST['clave'];
	$_SESSION['clave'] = $_POST['clave'];
	$nombre_clte = explode(' ', $proforma['nombre_clte']);
	$apellido_clte = explode(' ', $proforma['apellido_clte']);
	if($clave == 'prof'){
		$_SESSION['nProforma'] = 'SMSIC23-'.$proforma['id_prof'];
	}else{
		$_SESSION['nProforma'] = 'SMSIC23-'.$proforma['num_proforma_mprof'];
		$_SESSION['id_mprof'] = $proforma['id_mprof'];
	}
	
	if($proforma['sigla_emp'] == 'Ninguna'){
		$_SESSION['sigla'] = $apellido_clte[0];
		$_SESSION['empresa'] = $nombre_clte[0].' '.$proforma['apellido_clte'];
		$_SESSION['cliente'] = '';

	}else{
		$_SESSION['sigla'] = $proforma['sigla_emp'];
		$_SESSION['empresa'] = $proforma['nombre_emp'];
		$_SESSION['cliente'] = $nombre_clte[0].' '.$proforma['apellido_clte'];
	}
	$_SESSION['direccion'] = $proforma['direccion_emp'];
	$_SESSION['telefono'] = $proforma['telefono_emp'];
	$_SESSION['fecha'] = substr($proforma['fecha_'.$clave],0,10);
	$nombre_usua = explode(' ', $proforma['nombre_usua']);
	$apellido_usua = explode(' ', $proforma['apellido_usua']);
	$_SESSION['encargado'] = $nombre_usua[0].' '.$apellido_usua[0];
	$_SESSION['email'] = $proforma['email_usua'];
	$_SESSION['celular'] = $proforma['celular_usua'];
	$_SESSION['tpo_valido_prof'] = $proforma['tpo_valido_'.$clave];
	$_SESSION['condicionesDePago'] = $proforma['cond_pago_'.$clave];
	$_SESSION['tiempoDeEntrega'] = $proforma['tpo_entrega_'.$clave];
	if(isset($_POST['ne'])){
		$_SESSION['observacion'] = $_POST['observacion_ne'];
		$_SESSION['orden'] = $_POST['orden_ne'];

	}else{
		$_SESSION['observacion'] = $proforma['observacion_'.$clave];
	}
	$_SESSION['descuento_prof'] = $proforma['descuento_'.$clave]/100;
	$_SESSION['moneda_prof'] = $proforma['moneda_'.$clave];
	$_SESSION['tipo_cambio_prof'] = $proforma['tipo_cambio_'.$clave];
}
//----------------------------------------------CRUD NOTA DE ENTREGA
//-------Create a nota de entrega
if (isset($_POST['createNotaEntrega'])){
	$createNotaEntrega = new consultas;
	$createNotaEntrega->proformaStatus();
	$createNotaEntrega->createNotaEntrega();
	$createNotaEntrega->readProf_prod($_POST['readProf_prod']);
}
?>