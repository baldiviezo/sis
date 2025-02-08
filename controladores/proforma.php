<?php
require '../modelos/consultasDeProformas.php';
//---------------------------------------------CRUD PROFORMA
//-------Read proformas
if (isset($_POST['readProformas'])) {
	$readProformas = new consultas;
	$readProformas->readProformas();
}
//--------Create a proforma
if (isset($_POST['createProforma'])&&isset($_POST['id_usua'])) {
	session_start();
	$createProforma = new Consultas;
	$createProforma->asignarValores($_POST['id_usua']);
	$createProforma->createProforma($_POST['createProforma']);
}
//-------Update a proforma
if (isset($_POST['updateProforma'])&&isset($_POST['id_usua'])) {
	session_start();
	$updateProforma = new Consultas;
	$updateProforma->asignarValoresM($_POST['id_usua']);
	$updateProforma->updateProforma($_POST['updateProforma']);
}
//-------Delete a proforma
if (isset($_POST['deleteProforma'])) {
	$deleteProforma = new consultas;
	$deleteProforma->deleteProforma($_POST['deleteProforma']);
}
//---------------------------------------------CRUD PROF_PROD
//-------Read Prof_prods
if (isset($_POST['readProf_prods'])) {
	$readProf_prods = new consultas;
	$readProf_prods->readProf_prods();
}
if (isset($_POST['readmProf_prods'])) {
	$readmProf_prods = new consultas;
	$readmProf_prods->readmProf_prods();
}
//----------------------------------------------CRUD MDF_PROFORMA
//-------Read proformas modificadas
if (isset($_POST['read_mdf_Proforma'])) {
	$read_mdf_Proforma = new consultas;
	$read_mdf_Proforma->read_mdf_Proforma();
}
if (isset($_POST['deletemProforma'])) {
	$deletemProforma = new consultas;
	$deletemProforma->deletemProforma($_POST['deletemProforma']);
}
//------------------------------------------READ PRICES
if (isset($_POST['readPrices'])) {
	$readPrices = new consultas;
	$readPrices->readPrices();
}
?>