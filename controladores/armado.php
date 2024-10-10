<?php
require '../modelos/consultasDeArmado.php';
//---------------------------------------------CRUD ARMADO
//-------Read Armados
if (isset($_POST['readArmeds'])) {
    $readArmeds = new consultas;
    $readArmeds->readArmeds();
}
//--------Create an armado
if (isset($_POST['createArmed'])&&isset($_POST['id_usua'])) {
    $createArmed = new Consultas;
    $createArmed->assignValuesR();
    $createArmed->createArmed();
}
//-------Update an armado
if (isset($_POST['updateArmado'])&&isset($_POST['id_usua'])) {
    session_start();
    $updateArmado = new Consultas;
    $updateArmado->asignarValoresM($_POST['id_usua']);
    $updateArmado->updateArmado($_POST['updateArmado']);
}
//-------Delete an armado
if (isset($_POST['deleteArmado'])) {
    $deleteArmado = new consultas;
    $deleteArmado->deleteArmado($_POST['deleteArmado']);
}
?>