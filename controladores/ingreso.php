<?php
require '../modelos/consultasDeIngreso.php';
//---------------------------------------------CRUD ARMADO
//-------Read Armados
if (isset($_POST['readIngresos'])) {
    $readIngresos = new consultas;
    $readIngresos->readIngresos();
}
//--------Create an armado
if (isset($_POST['createIngreso'])&&isset($_POST['id_usua'])) {
    $createIngreso = new Consultas;
    $createIngreso->assignValuesR();
    $createIngreso->createIngreso();
}
?>