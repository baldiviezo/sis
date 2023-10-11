<?php
require('tableWithMultiCell.php');

/*HOJA CARTA 21.59 - 27.94*/
$fpdf = new pdf("p","mm","letter");
//HAY QUE PONER ANTES DE CREAR LA PAGINA PARA Q SE APLIQUE
$fpdf->SetMargins(17,10,17);

$fpdf->AddPage();
/*$fpdf->SetAutoPageBreak(true,35);*/

$fpdf->SetLineWidth(0.8);
$fpdf->line(15,35,201,35);
$fpdf->line(201,35,201,260);
$fpdf->line(15,35,15,260);
$fpdf->line(15,260,201,260);
$fpdf->SetLineWidth(0.2);

$moneda = $_SESSION['moneda_prof'];
$unidad = '';
$unidad2 = '';
if($moneda == 'Bs'){
    $unidad = 'Bolivianos';
    $unidad2 = 'Bs';
}else{
    $unidad = 'Dolares';
    $unidad2 = '$us';
}


$fpdf->SetFont('arial','b',20);
//datos del usuario
$fpdf->Cell(0,14, utf8_decode('PROFORMA'),'B',1,'C',false);
$fpdf->ln(2);
$fpdf->SetFont('arial','b',10);
$fpdf->SetTextColor(0,0,0);
$fpdf->Cell(100,6, utf8_decode('N° de Proforma: '),'LTB',0,'l',false);
$fpdf->Cell(82,6, utf8_decode('Responsable: '),'TRB',1,'l',false);
$fpdf->ln(2);
$fpdf->SetFont('arial','b',9);
$fpdf->SetFillColor(35,64,96);
$fpdf->SetTextColor(255,255,255);
$fpdf->Cell(35,6, utf8_decode('Fecha: '),'LT',1,'l',true);
$fpdf->Cell(35,6, utf8_decode('Nombre de cliente: '),'L',1,'l',true);
$fpdf->Cell(35,6, utf8_decode('Dirección: '),'L',1,'l',true);
$fpdf->Cell(35,6, utf8_decode('Teléfono: '),'LB',1,'l',true);
$fpdf->ln(2);
$fpdf->Cell(10,12, utf8_decode('Item'),1,0,'C',true);
$fpdf->Cell(20,12, utf8_decode('Código'),1,0,'C',true);
$fpdf->Cell(96,12, utf8_decode('Descripción'),1,0,'C',true);
$fpdf->Cell(15,12, utf8_decode('Cant.'),1,0,'C',true);
$fpdf->Cell(41,6, utf8_decode('Costo '.$unidad2),1,1,'C',true);
$fpdf->SetXY(158,92);
$fpdf->Cell(17,6, utf8_decode('Unitario'),1,0,'C',true);
$fpdf->Cell(24,6, utf8_decode('Total'),1,1,'C',true);

//Agregar Informacion del cliente

$fpdf->SetTextColor(0,0,0);
$fpdf->SetFont('arial','',10);
$fpdf->SetXY(45,52);
$fpdf->Cell(96,6, utf8_decode(strtoupper($_SESSION['nProforma'].'-'.$_SESSION['sigla'])),0,0,'l',false);
$fpdf->Cell(100,6, utf8_decode($_SESSION['encargado']),0,1,'l',false);

$fpdf->SetXY(120,60);
$fpdf->SetFont('arial','b',9);
$fpdf->Cell(0,6, 'ATN: ',0,2,'l',false);
$fpdf->SetXY(135,60);
$fpdf->SetFont('arial','',10);
$fpdf->Cell(0,6, utf8_decode($_SESSION['cliente']),0,2,'l',false);
$fpdf->SetXY(52, 60);
$fpdf->Cell(0,6, utf8_decode($_SESSION['fecha']),'TR',2,'l',false);
$fpdf->SetFont('arial','b',10);
$fpdf->Cell(0,6, utf8_decode($_SESSION['empresa']),'R',2,'l',false);
$fpdf->SetFont('arial','',10);
$fpdf->Cell(0,6, utf8_decode($_SESSION['direccion']),'R',2,'l',false);
if($_SESSION['telefono'] != 0){
    $fpdf->Cell(0,6, utf8_decode($_SESSION['telefono']),'RB',1,'l',false);
}else{
    $fpdf->Cell(0,6, ' ','RB',1,'l',false);
}
$fpdf->ln(14);




$fpdf->SetTextColor(0,0,0);
$fpdf->SetFont('arial','',9);

$fpdf->SetWidths(array(10,20,96,15,17,24));
//------
//$productos = json_decode($_SESSION['cart'],true);
include '../../modelos/conexion.php';
//Buscar nombre de la tabla
$id_prof;
$tabla;
$clave = $_SESSION['clave'];
if($clave=='prof'){
    $id_prof = substr($_SESSION['nProforma'],8);
    $tabla = 'prof_prod';
    $sigla = 'pfpd';
    $celda = 'fk_id_prof_pfpd';
}else{
    $id_prof = $_SESSION['id_mprof'];
    $tabla = 'mdf_prof_prod';
    $sigla = 'mpfpd';
    $celda = 'fk_id_mprof_mpfpd';
}

$consulta = "SELECT * FROM $tabla INNER JOIN producto ON $tabla.fk_id_prod_$sigla = id_prod WHERE $celda ='$id_prof'";
$resultado = $conexion->query($consulta);
$total = 0;
$i = 1;
while ($fila = $resultado->fetch_assoc()){
    $costoTotal =  $fila['cantidad_'.$sigla]*$fila['cost_uni_'.$sigla];
    $fpdf->Row(array($i, utf8_decode($fila['codigo_prod']),utf8_decode($fila['descripcion_prod']), $fila['cantidad_'.$sigla], number_format($fila['cost_uni_'.$sigla], 2, ',', '.'), number_format($costoTotal, 2, ',', '.')),'../imagenes/'.$fila['imagen_prod']);
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
    $fpdf->Cell(41,6, utf8_decode('Costo '.$unidad2),1,1,'C',true);
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

$fpdf->Cell(32,6, 'Sub-Total('.$unidad2.')',1,0,'R',true);
$fpdf->MultiCell(24,6, number_format($total, 2, ',', '.').' '.$moneda.'',1,'R',true);
if($_SESSION['descuento_prof']!='0'){
    $fpdf->SetX(143);
    $fpdf->Cell(32,6, 'Desc. '.(100*$_SESSION['descuento_prof']).'%('.$unidad2.')',1,0,'R',true);
    $descuento = $total*$_SESSION['descuento_prof'];
    $fpdf->MultiCell(24,6, number_format($descuento,2, ',', '.').' '.$moneda.'',1,'R',true);
}
$fpdf->SetX(143);
$fpdf->Cell(32,6, 'TOTAL('.$unidad2.')',1,0,'R',true);
$total = $total*(1-$_SESSION['descuento_prof']);
$total = round($total, 2);
$fpdf->MultiCell(24,6, number_format($total, 2, ',', '.').' '.$moneda.'',1,'R',true);


if($moneda == '$'){
    $fpdf->SetX(143);
    $fpdf->Cell(32,6, 'TOTAL(Bs)',1,0,'R',true);

    $total = $total*$_SESSION['tipo_cambio_prof'];
    $total = round($total, 2);
    $fpdf->MultiCell(24,6, number_format($total, 2, ',', '.').' Bs',1,'R',true);
    
    $fpdf->SetTextColor(0,0,0);
    $fpdf->Cell(30,6, 'Tipo de camio:' ,0,0,'L',false);
    $fpdf->Cell(32,6, $_SESSION['tipo_cambio_prof'] ,1,0,'R',false);
    $unidad = 'Bolivianos';
}



$fpdf->SetTextColor(0,0,0);
$fpdf->SetFont('arial','b',10);
$fpdf->ln(12);
$fpdf->Cell(10,6, utf8_decode('Son: '),'',0,'',false);
require_once "cifrasEnLetras.php";
$modelonumero = new modelonumero();
$letra=$modelonumero->numtoletras($total);
$fpdf->MultiCell(0,6, strtoupper(utf8_decode($letra)),0,'L',false);
$fpdf->SetTextColor(255,0,0);
$fpdf->SetFont('arial','b',8);
$fpdf->SetY(253); //En 54 se pasa de hoja
$fpdf->Cell(0,6, utf8_decode('El tiempo de entrega se contabiliza una vez se cumplan las condiciones de pago.'),'',1,'',false);


$fpdf->AddPage();
$fpdf->SetFont('arial','b',10);
$fpdf->SetTextColor(0,0,0);
$fpdf->Cell(0,10, utf8_decode('La presente proforma está sujeta a las siguientes condiciones:'),'B',1,'L',false);
$fpdf->Cell(50,6, utf8_decode('Proforma válida por:'),'B',0,'L',false);
$fpdf->MultiCell(0,6, utf8_decode($_SESSION['tpo_valido_prof']),'B','L',false);
$fpdf->SetX(67);
$y1 = $fpdf->GetY();
$fpdf->MultiCell(0,6, utf8_decode($_SESSION['condicionesDePago']),'B','L',false);
$y2 = $fpdf->GetY();
$h = $y2-$y1;
$fpdf->SetFont('arial','b',10);
$fpdf->SetXY(17,$y1);
$fpdf->Cell(50,$h, utf8_decode('Condiciones de pago:'),'B',1,'L',false);
$fpdf->SetX(67);
$y1 = $fpdf->GetY();
$fpdf->MultiCell(0,6, utf8_decode($_SESSION['tiempoDeEntrega']),'B','L',false);
$y2 = $fpdf->GetY();
$h = $y2-$y1;
$fpdf->SetFont('arial','b',10);
$fpdf->SetXY(17,$y1);
$fpdf->Cell(50,$h, utf8_decode('Tiempo de entrega:'),'B',1,'L',false);
$fpdf->Cell(50,6, utf8_decode('Garantía:'),'B',0,'L',false);
$fpdf->MultiCell(0,6,utf8_decode('1 año por defecto de fábrica'),'B','L',false);
$fpdf->Ln(6);
$fpdf->SetFont('arial','b',10);
$fpdf->Cell(32,36, utf8_decode('Observaciones:'),'BR',0,'L',false);
$fpdf->MultiCell(0,6,utf8_decode($_SESSION['observacion']),'T','L',false);

$fpdf->SetXY(49,$y2+48);
$y1 = $fpdf->GetY();
$fpdf->Cell(50,6, utf8_decode('Email y Página Principal'),'TLBR',0,'L',false);
$fpdf->SetTextColor(0,0,255);
$fpdf->SetFont('arial','U',10);
$fpdf->Cell(65,6, utf8_decode('www.smsic.com.bo'),'TLBR',0,'C',false);
$fpdf->Cell(35,6, utf8_decode('info@smsic.com.bo'),'TLBR',1,'C',false);


$fpdf->SetX(49);
$fpdf->SetTextColor(0,0,0);
$fpdf->SetFont('arial','b',10);
$fpdf->Cell(50,6, utf8_decode($_SESSION['encargado']),'LBR',0,'L',false);
$fpdf->SetTextColor(0,0,255);
$fpdf->SetFont('arial','U',10);
$nombre = str_replace(" " , '.', $_SESSION['encargado']);
$fpdf->Cell(65,6, utf8_decode($_SESSION['email']),'LBR',0,'C',false);
$fpdf->SetFont('arial','',10);
$fpdf->SetTextColor(0,0,0);
$fpdf->Cell(35,6, utf8_decode('Tel: '.$_SESSION['celular']),'LBR',1,'C',false);



$fpdf->SetX(49);
$fpdf->SetTextColor(0,0,0);
$fpdf->SetFont('arial','b',10);
$fpdf->Cell(50,6, utf8_decode('Benjamin Aparicio'),'LBR',0,'L',false);
$fpdf->SetTextColor(0,0,255);
$fpdf->SetFont('arial','U',10);
$fpdf->Cell(65,6, utf8_decode('benjamin.aparicio@smsic.com.bo'),'LBR',0,'C',false);
$fpdf->SetFont('arial','',10);
$fpdf->SetTextColor(0,0,0);
$fpdf->Cell(35,6, utf8_decode('Tel: 72020303'),'LBR',1,'C',false);
$y2 = $fpdf->GetY();
$h = $y2-$y1;
$fpdf->SetFont('arial','b',10);
$fpdf->SetTextColor(0,0,0);
$fpdf->SetXY(17,$y1);
$fpdf->Cell(32,$h, utf8_decode('CONSULTAS A:'),'B',1,'L',false);
$fpdf->SetFont('arial','',10);
$fpdf->Cell(0,12, utf8_decode('En espera de su respuesta, saluda a Uds. muy atentamente'),'',1,'C',false);

$y2 = $fpdf->GetY();

$fpdf->SetLineWidth(0.8);
$fpdf->line(15,35,201,35);
$fpdf->line(201,35,201,$y2);
$fpdf->line(15,35,15,$y2);
$fpdf->line(15,$y2,201,$y2);
$fpdf->SetLineWidth(0.2);




$fpdf->Image('logos/IngenuityforLife.jpg',25,187,80,27);
$fpdf->Image('logos/nacionalInstruments.jpg',105,190,85,25);
$fpdf->Image('logos/smc.jpg',25,215,56,15);
$fpdf->Image('logos/sensorex.png',90,215,56,15);
$fpdf->Image('logos/knx.png',150,215,40,15);
$fpdf->Image('logos/quanser.jpg',25,240,56,12);
$fpdf->Image('logos/balluff.png',87,240,56,15);
$fpdf->Image('logos/kimo.jpg',147,240,44,15);
$fpdf->Output();
//$fpdf->Output('D',$_SESSION['nProforma'].'.pdf','UTF-8');
//$fpdf->Output('F','../../reportes/'.$_SESSION['nProforma'].'.pdf');

?>

