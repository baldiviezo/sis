<?php
$prof_mprof_ne = json_decode($_POST['prof_mprof_ne'], true);
$pf_pd = json_decode($_POST['pf_pd'], true);
$pdf = $_POST['pdf'];
//$id_usua = $_POST['id_usua'];
//Variables
$_prof_mprof_ne = null;
$_encargado = null;
$_fecha = null;
$_empresa = null;
$_cliente = null;
$_direccion = null;
$_telefono = null;
$_moneda = null;
$_descuento = null;
$_tpo_valido = null;
$_cond_pago = null;
$_tpo_entrega = null;
$_observacion = null;
$_tipo_cambio = null;
$_email_usua = null;
$_celular_usua = null;
$_orden = null;
$_observacion = null;
if ($_POST['pdf'] == 'prof') {
    if($prof_mprof_ne['nombre_emp'] == 'Ninguna'){
        $_prof_mprof_ne = strtoupper('SMS'.substr($prof_mprof_ne['fecha_prof'],2,2).'-'.$prof_mprof_ne['numero_prof'].'-'.$prof_mprof_ne['apellido_clte']);
        $_empresa = $prof_mprof_ne['nombre_clte'].' '.$prof_mprof_ne['apellido_clte'];
        $_cliente = '';
        $_direccion = '';
        $_telefono = $prof_mprof_ne['celular_clte'];
    
    }else{
        $_prof_mprof_ne = strtoupper('SMS'.substr($prof_mprof_ne['fecha_prof'],2,2).'-'.$prof_mprof_ne['numero_prof'].'-'.$sigla_emp = $prof_mprof_ne['sigla_emp']);
        $_empresa = $prof_mprof_ne['nombre_emp'];
        $_cliente = $prof_mprof_ne['nombre_clte'].' '.$prof_mprof_ne['apellido_clte'];
        $_direccion = $prof_mprof_ne['direccion_emp'];
        if ($prof_mprof_ne['nombre_clte'] == ''){
            $_telefono = ($prof_mprof_ne['telefono_emp'] == 0) ? '' : $prof_mprof_ne['telefono_emp'];
        }else{
            $_telefono = ($prof_mprof_ne['celular_clte'] == 0) ? '' : $prof_mprof_ne['celular_clte']; 
        }
    }
    $_moneda = $prof_mprof_ne['moneda_prof'];
    $_fecha = substr($prof_mprof_ne['fecha_prof'],0,10);
    $_encargado = $prof_mprof_ne['nombre_usua'].' '.$prof_mprof_ne['apellido_usua'];
    $_descuento = $prof_mprof_ne['descuento_prof'];
    $_tpo_valido = $prof_mprof_ne['tpo_valido_prof'];
    $_cond_pago = $prof_mprof_ne['cond_pago_prof'];
    $_tpo_entrega = $prof_mprof_ne['tpo_entrega_prof'];
    $_observacion = $prof_mprof_ne['observacion_prof'];
    $_tipo_cambio = $prof_mprof_ne['tipo_cambio_prof'];
    $_email_usua = $prof_mprof_ne['email_usua'];
    $_celular_usua = $prof_mprof_ne['celular_usua'];
} else if ($_POST['pdf'] == 'mprof'){
    if($prof_mprof_ne['nombre_emp'] == 'Ninguna'){
        $_prof_mprof_ne = strtoupper('SMS'.substr($prof_mprof_ne['fecha_mprof'],2,2).'-'.$prof_mprof_ne['numero_mprof'].'-'.$prof_mprof_ne['apellido_clte']);
        $_empresa = $prof_mprof_ne['nombre_clte'].' '.$prof_mprof_ne['apellido_clte'];
        $_cliente = '';
        $_direccion = '';
        $_telefono = $prof_mprof_ne['celular_clte'];
    
    }else{
        $_prof_mprof_ne = strtoupper('SMS'.substr($prof_mprof_ne['fecha_mprof'],2,2).'-'.$prof_mprof_ne['numero_mprof'].'-'.$sigla_emp = $prof_mprof_ne['sigla_emp']);
        $_empresa = $prof_mprof_ne['nombre_emp'];
        $_cliente = $prof_mprof_ne['nombre_clte'].' '.$prof_mprof_ne['apellido_clte'];
        $_direccion = $prof_mprof_ne['direccion_emp'];
        if ($prof_mprof_ne['nombre_clte'] == ''){
            $_telefono = ($prof_mprof_ne['telefono_emp'] == 0) ? '' : $prof_mprof_ne['telefono_emp'];
        }else{
            $_telefono = ($prof_mprof_ne['celular_clte'] == 0) ? '' : $prof_mprof_ne['celular_clte']; 
        }
        $_moneda = $prof_mprof_ne['moneda_mprof'];
        $_fecha = substr($prof_mprof_ne['fecha_mprof'],0,10);
        $_encargado = $prof_mprof_ne['nombre_usua'].' '.$prof_mprof_ne['apellido_usua'];
        $_descuento = $prof_mprof_ne['descuento_mprof'];
        $_tpo_valido = $prof_mprof_ne['tpo_valido_mprof'];
        $_cond_pago = $prof_mprof_ne['cond_pago_mprof'];
        $_tpo_entrega = $prof_mprof_ne['tpo_entrega_mprof'];
        $_observacion = $prof_mprof_ne['observacion_mprof'];
        $_tipo_cambio = $prof_mprof_ne['tipo_cambio_mprof'];
        $_email_usua = $prof_mprof_ne['email_usua'];
        $_celular_usua = $prof_mprof_ne['celular_usua'];
    }
} else if ($_POST['pdf'] == 'ne'){
    if($prof_mprof_ne['nombre_emp'] == 'Ninguna'){
        $_prof_mprof_ne = strtoupper('SMS'.substr($prof_mprof_ne['fecha_prof'],2,2).'-'.$prof_mprof_ne['numero_prof'].'-'.$prof_mprof_ne['apellido_clte']);
        $_empresa = $prof_mprof_ne['nombre_clte'].' '.$prof_mprof_ne['apellido_clte'];
        $_cliente = '';
        $_direccion = '';
        $_telefono = $prof_mprof_ne['celular_clte'];
    
    }else{
        $_prof_mprof_ne = strtoupper('SMS'.substr($prof_mprof_ne['fecha_prof'],2,2).'-'.$prof_mprof_ne['numero_prof'].'-'.$sigla_emp = $prof_mprof_ne['sigla_emp']);
        $_empresa = $prof_mprof_ne['nombre_emp'];
        $_cliente = $prof_mprof_ne['nombre_clte'].' '.$prof_mprof_ne['apellido_clte'];
        $_direccion = $prof_mprof_ne['direccion_emp'];
        if ($prof_mprof_ne['nombre_clte'] == ''){
            $_telefono = ($prof_mprof_ne['telefono_emp'] == 0) ? '' : $prof_mprof_ne['telefono_emp'];
        }else{
            $_telefono = ($prof_mprof_ne['celular_clte'] == 0) ? '' : $prof_mprof_ne['celular_clte']; 
        }
    }
    $_moneda = $prof_mprof_ne['moneda_prof'];
    $_fecha = substr($prof_mprof_ne['fecha_prof'],0,10);
    $_encargado = $prof_mprof_ne['nombre_usua'].' '.$prof_mprof_ne['apellido_usua'];
    $_descuento = $prof_mprof_ne['descuento_prof'];
    $_tpo_valido = $prof_mprof_ne['tpo_valido_prof'];
    $_cond_pago = $prof_mprof_ne['cond_pago_prof'];
    $_tpo_entrega = $prof_mprof_ne['tpo_entrega_prof'];
    $_observacion = $prof_mprof_ne['observacion_prof'];
    $_tipo_cambio = $prof_mprof_ne['tipo_cambio_prof'];
    $_email_usua = $prof_mprof_ne['email_usua'];
    $_celular_usua = $prof_mprof_ne['celular_usua'];
    $_orden = $prof_mprof_ne['orden_ne'];
    $_observacion = $prof_mprof_ne['observacion_ne'];
}

?>