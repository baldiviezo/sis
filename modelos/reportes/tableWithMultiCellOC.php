<?php 
require('fpdf/fpdf.php');
require('./prof_mprof_ne.php');
class pdf extends FPDF{
	public function header(){
        //importar variables globales a la clase
        global $_prof_mprof_ne;
		//informacion
        $this->SetFont('arial','',10);
        $this->SetTextColor(0,0,0);  
        //Direccion
        $this->SetX(13);
        $this->Cell(0,5, utf8_decode('SMS Integración y Control LTDA.'),0,1,'L',false);
        $this->SetX(13);
        $this->Cell(0,5, utf8_decode('Dirección: Av. Ballivian Otero # 1209-B'),0,1,'L',false);
        $this->SetX(13);
        $this->Cell(0,5, utf8_decode('Ciudad Satelite'),0,1,'L',false);
        $this->SetX(13);
        $this->Cell(0,5, utf8_decode('Telf. (591-2) 2430864-2430867'),0,1,'L',false);
        $this->SetX(13);
        $this->Cell(0,5, utf8_decode('La Paz - Bolivia'),0,1,'L',false);
        $this->SetY(10);
        //Logo
        $this->Image('logos/logo.jpg',146,10,56,15);
        //total de paginas
        $this->AliasNbPages();
        $this->SetTextColor(0,0,0);
        $this->Cell(0,5, utf8_decode('    Página '. $this->PageNo().' de '.'{nb}'),0,1,'C',false);
        $this->Cell(0,5, $_prof_mprof_ne,0,1,'C',false);
        $this->ln(16);	
    }
	public function footer(){
        $this->SetTextColor(0,0,0);
		$this->SetFont('arial','',9);
        $this->SetY(-15);
        $this->Cell(0,10, utf8_decode('SMS Integración y Control LTDA. - Dirección: Av. Arce Esq. Clavijo 2896 - Telf. (591-2) 2430864-2430867 - La Paz - Bolivia'),0,1,'C',false);
	}
//---------------------script para ajuste de texto en celda---------------//
var $widths;
var $aligns;
function SetWidths($w){
    //Set the array of column widths
    $this->widths=$w;
}
function SetAligns($a){
    //Set the array of column alignments
    $this->aligns=$a;
}
function Row($data,$imagen){
    //Calculate the height of the row
    $nb=0;
    for($i=0;$i<count($data);$i++)
        $nb=max($nb,$this->NbLines($this->widths[$i],$data[$i]));
    $h=5*$nb;
    //Issue a page break first if needed
    $this->CheckPageBreak($h);
    //Draw the cells of the row
    for($i=0;$i<count($data);$i++)
    {
        $w=$this->widths[$i];
        $a=isset($this->aligns[$i]) ? $this->aligns[$i] : 'L';
        //Save the current position
        $x=$this->GetX();
        $y=$this->GetY();
        //Draw the border
        $this->Rect($x,$y,$w,$h);
        if($i==5){
            if ($imagen != null) {
                $this->Image($imagen, $x - 12, $y + 5, 29, 29);
            }
        }
        //Print the text
        $this->MultiCell($w,5,$data[$i],0,$a);
        //Put the position to the right of the cell
        $this->SetXY($x+$w,$y);
    }
    //Go to the next line
    $this->Ln($h);
    //salto de linea
    if($this->GetY()>0){ // no entiendo pero funciona
        $this->CheckPageBreak($h);
    }
}

//-----------DESPUES DE UN SALTO DE LINEA-----------------------//
function CheckPageBreak($h){
    //importar variables globales a la clase
    global $_moneda;
    //If the height h would cause an overflow, add a new page immediately
    if($this->GetY()+$h>$this->PageBreakTrigger){
        $this->AddPage($this->CurOrientation);

        $moneda2 = $_moneda;
        $unidad3 = '';
        if($moneda2 == 'Bs'){

            $unidad3 = 'Bs';
        }else{

            $unidad3 = '$us';
        }
        $this->SetTextColor(255,255,255);
        $this->SetFont('arial','b',9);
        $this->Cell(10,12, utf8_decode('Item'),1,0,'C',true);
        $this->Cell(30,12, utf8_decode('Código'),1,0,'C',true);
        $this->Cell(86,12, utf8_decode('Descripción'),1,0,'C',true);
        $this->Cell(15,12, utf8_decode('Cant.'),1,0,'C',true);
        $x = $this->GetX();
        $this->Cell(41,6, utf8_decode('Costo '.$unidad3),1,1,'C',true);
        $this->SetX($x);
        $this->Cell(17,6, utf8_decode('Unitario'),1,0,'C',true);
        $this->Cell(24,6, utf8_decode('Total'),1,1,'C',true);
        $this->SetTextColor(0,0,0);
        $this->SetFont('arial','',9);

        $this->SetLineWidth(0.8);
        $this->line(15,35,201,35);
        $this->line(201,35,201,260);
        $this->line(15,35,15,260);
        $this->line(15,260,201,260);
        $this->SetLineWidth(0.2);
    }
}

function NbLines($w,$txt){
    //Computes the number of lines a MultiCell of width w will take
    $cw=&$this->CurrentFont['cw'];
    if($w==0)
        $w=$this->w-$this->rMargin-$this->x;
    $wmax=($w-2*$this->cMargin)*1000/$this->FontSize;
    $s=str_replace("\r",'',$txt);
    $nb=strlen($s);
    if($nb>0 and $s[$nb-1]=="\n")
        $nb--;
    $sep=-1;
    $i=0;
    $j=0;
    $l=0;
    $nl=1;
    while($i<$nb)
    {
        $c=$s[$i];
        if($c=="\n")
        {
            $i++;
            $sep=-1;
            $j=$i;
            $l=0;
            $nl++;
            continue;
        }
        if($c==' ')
            $sep=$i;
        $l+=$cw[$c];
        if($l>$wmax)
        {
            if($sep==-1)
            {
                if($i==$j)
                    $i++;
            }
            else
                $i=$sep+1;
            $sep=-1;
            $j=$i;
            $l=0;
            $nl++;
        }
        else
            $i++;
    }
    return $nl;
}
//--------------------SALTO DE PAGINA------------------------------//
}
?>