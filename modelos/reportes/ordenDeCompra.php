<?php
require('tableWithMultiCellOC.php');
/*HOJA CARTA 21.59 - 27.94*/
$fpdf = new pdf("p","mm","letter");
//HAY QUE PONER ANTES DE CREAR LA PAGINA PARA Q SE APLIQUE EL MARGEN
$fpdf->SetMargins(17,10,17);

$fpdf->AddPage();
/*$fpdf->SetAutoPageBreak(true,35);*/

$fpdf->SetLineWidth(0.8);
$fpdf->line(15,35,201,35);
$fpdf->line(201,35,201,260);
$fpdf->line(15,35,15,260);
$fpdf->line(15,260,201,260);
$fpdf->SetLineWidth(0.2);

$fpdf->SetFont('arial','b',20);
//datos del usuario
$fpdf->Cell(0,14, utf8_decode('ORDEN DE COMPRA'),'B',1,'C',false);
$fpdf->ln(2);
$fpdf->SetFont('arial','b',10);
$fpdf->SetTextColor(0,0,0);
$fpdf->Cell(100,6, utf8_decode('N° de Orden de compra: '),'LTB',0,'l',false);
$fpdf->Cell(82,6, utf8_decode('Aprobado por: '),'TRB',1,'l',false);
$fpdf->ln(2);
$fpdf->SetFont('arial','b',9);
$fpdf->SetFillColor(35,64,96);
$fpdf->SetTextColor(255,255,255);
$fpdf->Cell(35,6, utf8_decode('Fecha: '),'LT',1,'l',true);
$fpdf->Cell(35,6, utf8_decode('Proveedor: '),'L',1,'l',true);
$fpdf->Cell(35,6, utf8_decode('Dirección: '),'L',1,'l',true);
$fpdf->Cell(35,6, utf8_decode('Teléfono: '),'LB',1,'l',true);
$fpdf->ln(2);
$fpdf->Cell(10,12, utf8_decode('Item'),1,0,'C',true);
$fpdf->Cell(30,12, utf8_decode('Código'),1,0,'C',true);
$fpdf->Cell(86,12, utf8_decode('Descripción'),1,0,'C',true);
$fpdf->Cell(15,12, utf8_decode('Cant.'),1,0,'C',true);
$fpdf->Cell(41,6, utf8_decode('Costo Bs'),1,1,'C',true);
$fpdf->SetXY(158,92);
$fpdf->Cell(17,6, utf8_decode('Unitario'),1,0,'C',true);
$fpdf->Cell(24,6, utf8_decode('Total'),1,1,'C',true);

//Agregar Informacion del cliente

$fpdf->SetTextColor(0,0,0);
$fpdf->SetFont('arial','',10);
$fpdf->SetXY(58,52);
$fpdf->Cell(84,6, utf8_decode($_prof_mprof_ne),0,0,'l',false);
$fpdf->Cell(100,6, utf8_decode($_encargado),0,1,'l',false);

$fpdf->SetXY(120,60);
$fpdf->SetFont('arial','b',9);
$fpdf->Cell(0,6, 'ATN: ',0,2,'l',false);
$fpdf->SetXY(130,60);
$fpdf->SetFont('arial','',10);
$fpdf->Cell(0,6, utf8_decode($_cliente),0,2,'l',false);
$fpdf->SetXY(52, 60);
$fpdf->Cell(0,6, utf8_decode($_fecha),'TR',2,'l',false);
$fpdf->SetFont('arial','b',10);
$fpdf->Cell(0,6, utf8_decode($_empresa),'R',2,'l',false);
$fpdf->SetFont('arial','',10);
$fpdf->Cell(0,6, utf8_decode($_direccion),'R',2,'l',false);
$fpdf->Cell(0,6, utf8_decode($_telefono),'RB',1,'l',false);
$fpdf->ln(14);

$fpdf->SetTextColor(0,0,0);
$fpdf->SetFont('arial','',9);

$fpdf->SetWidths(array(10,30,86,15,17,24));
//------
//$productos = json_decode($_SESSION['cart'],true);
include '../../modelos/conexion.php';
//Buscar nombre de la tabla

$i = 1;
$total = 0;
$referencia = '';

foreach ($pf_pd as $producto) {
    $costoTotal =  $producto['cantidad_cppd']*$producto['cost_uni_cppd'];
    $fpdf->Row(array($i, utf8_decode($producto['codigo_prod']),utf8_decode($producto['descripcion_cppd']), $producto['cantidad_cppd'], number_format($producto['cost_uni_cppd'], 2, ',', '.'), number_format($costoTotal, 2, ',', '.')), null);
    $i++;
    $total = $total + $costoTotal;
}


if($fpdf->GetY()>210){
    $fpdf->AddPage();

    $fpdf->SetTextColor(255,255,255);
    $fpdf->SetFont('arial','b',9);
    $fpdf->Cell(10,12, utf8_decode('Item'),1,0,'C',true);
    $fpdf->Cell(20,12, utf8_decode('Código'),1,0,'C',true);
    $fpdf->Cell(96,12, utf8_decode('Descripción'),1,0,'C',true);
    $fpdf->Cell(15,12, utf8_decode('Cant.'),1,0,'C',true);
    $x = $fpdf->GetX();
    $fpdf->Cell(41,6, utf8_decode('Costo Bs'),1,1,'C',true);
    $fpdf->SetX($x);
    $fpdf->Cell(17,6, utf8_decode('Unitario'),1,0,'C',true);
    $fpdf->Cell(24,6, utf8_decode('Total'),1,1,'C',true);
    $fpdf->SetTextColor(0,0,0);
    $fpdf->SetFont('arial','',9);

    $fpdf->SetLineWidth(0.8);
    $fpdf->line(15,35,201,35);
    $fpdf->line(201,35,201,260);
    $fpdf->line(15,35,15,260);
    $fpdf->line(15,260,201,260);
    $fpdf->SetLineWidth(0.2);
}
//------
$fpdf->SetTextColor(255,255,255);
$fpdf->SetFont('arial','b',9);
$fpdf->SetX(143);

$fpdf->Cell(32,6, 'Sub-Total (Bs)',1,0,'R',true);
$fpdf->MultiCell(24,6, number_format($total, 2, ',', '.').' ',1,'R',true);
if($_descuento!='0'){
    $fpdf->SetX(143);
    $fpdf->Cell(32,6, 'Desc. '.($_descuento).'% (Bs)',1,0,'R',true);
    $descuento = ($total*$_descuento)/100;
    $fpdf->MultiCell(24,6, number_format($descuento,2, ',', '.').' ',1,'R',true);
}
$fpdf->SetX(143);
$fpdf->Cell(32,6, 'TOTAL (Bs)',1,0,'R',true);
$total = $total*(1-$_descuento/100);
$total = round($total, 2);
$fpdf->MultiCell(24,6, number_format($total, 2, ',', '.').' ',1,'R',true);

$fpdf->SetTextColor(0,0,0);
$fpdf->Cell(30,6, 'Tipo de camio:' ,0,0,'L',false);
$fpdf->Cell(32,6, $_tipo_cambio ,1,0,'R',false);


$fpdf->SetTextColor(0,0,0);
$fpdf->SetFont('arial','b',10);
$fpdf->ln(12);
require_once "cifrasEnLetras.php";
$modelonumero = new modelonumero();
$letra=$modelonumero->numtoletras($total);
$fpdf->Cell(0,6, 'Son: '. strtoupper(utf8_decode($letra)), 'B', 1,'L',false);
$fpdf->Cell(100,6, utf8_decode('Según Proforma N°: '), 'B', 0,'L',false);
$fpdf->Cell(15,6, utf8_decode('Fecha: '), 'B', 0,'L',false);
$fpdf->Cell(67,6, $_fecha, 'B', 0,'L',false);

$fpdf->ln(30);
$fpdf->SetFont('arial','b',9);
$fpdf->Cell(40,6, utf8_decode('Firma: '), 0, 1,'R',false);
$fpdf->Cell(40,6, utf8_decode('Nombre: '), 0, 0,'R',false);
$fpdf->Cell(94,6, utf8_decode('Benjamín A. Aparicio García'), 0, 1,'C',false);

$y = $fpdf->GetY();
$fpdf->Image('logos/firmaIng.jpg',80,$y-35,45,30);
$fpdf->setTitle($_prof_mprof_ne);
$fpdf->Output('I',$_prof_mprof_ne.'.pdf','UTF-8');

?>

