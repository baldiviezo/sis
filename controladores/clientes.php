<?php 
require '../modelos/consultasDeClientes.php';
//------CRUD CLIENTES
if (isset($_POST['readCustomers'])){
	$readCustomers = new consultas;
	$readCustomers->readCustomers();
}
if (isset($_POST['createCustomer'])) {
	$createCustomer = new consultas;
	$createCustomer->asignarValoresR();
	$createCustomer->createCustomer();
}
if (isset($_POST['updateCustomer'])) {
	$updateCustomer = new consultas;
	$updateCustomer->asignarValoresM();
	$updateCustomer->updateCustomer();
}
if (isset($_POST['deleteCustomer'])) {
	$deleteCustomer = new consultas;
	$deleteCustomer->deleteCustomer($_POST['deleteCustomer']);
}
//------CRUD ENTERPRISE
if (isset($_POST['readEnterprises'])) {
	$readEnterprises = new consultas;
	$readEnterprises->readEnterprises();
}
if (isset($_POST['createEnterprise'])) {
	$registrarEmpresa = new consultas;
	$registrarEmpresa->asignarValoresRE();
	$registrarEmpresa->createEnterprise();
}
if (isset($_POST['updateEnterprise'])) {
	$updateEmpresa = new consultas;
	$updateEmpresa->asignarValoresME();
	$updateEmpresa->updateEnterprise();
}
if (isset($_POST['deleteEnterprise'])) {
	$deleteEmpresa = new consultas;
	$deleteEmpresa->deleteEnterprise($_POST['deleteEnterprise']);
}





//------CRUD PROVEEDORES
if (isset($_POST['readSuppliers'])){
	$readSuppliers = new consultas;
	$readSuppliers->readSuppliers();
}
if (isset($_POST['createSupplier'])) {
	$createSupplier = new consultas;
	$createSupplier->asignarValoresPR();
	$createSupplier->createSupplier();
}
if (isset($_POST['updateSupplier'])) {
	$updateSupplier = new consultas;
	$updateSupplier->asignarValoresPM();
	$updateSupplier->updateSupplier();
}
if (isset($_POST['deleteSupplier'])) {
	$deleteSupplier = new consultas;
	$deleteSupplier->deleteSupplier($_POST['deleteSupplier']);
}


if (isset($_POST['leerProveedor'])){
	$leerProveedor = new consultas;
	$leerProveedor->leerProveedor();
}

//------CRUD ENTERPRISEP
if (isset($_POST['readEnterprisesP'])) {
	$readEnterprisesP = new consultas;
	$readEnterprisesP->readEnterprisesP();
}
if (isset($_POST['createEnterpriseP'])) {
	$registrarEmpresa = new consultas;
	$registrarEmpresa->asignarValoresREP();
	$registrarEmpresa->createEnterpriseP();
}
if (isset($_POST['updateEnterpriseP'])) {
	$updateEmpresa = new consultas;
	$updateEmpresa->asignarValoresMEP();
	$updateEmpresa->updateEnterpriseP();
}
if (isset($_POST['deleteEnterpriseP'])) {
	$deleteEmpresa = new consultas;
	$deleteEmpresa->deleteEnterpriseP($_POST['deleteEnterpriseP']);
}
?>