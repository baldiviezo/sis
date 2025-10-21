<?php
$prof_mprof_ne = json_decode($_POST['prof_mprof_ne'], true);
$pf_pd = json_decode($_POST['pf_pd'], true);
$pdf = $_POST['pdf'];

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

include '../conexion.php';

if ($_POST['pdf'] == 'prof') {
    
    $consulta = "SELECT * FROM cliente WHERE id_clte = ".$prof_mprof_ne['fk_id_clte_prof'];
    $resultado = mysqli_query($conexion, $consulta);
    $cliente = $resultado->fetch_assoc();

    $id_emp = $cliente['fk_id_emp_clte'];
 
    $consulta = "SELECT * FROM empresa WHERE id_emp = ".$id_emp;
    $resultado = mysqli_query($conexion, $consulta);
    $empresa = $resultado->fetch_assoc();

    $consulta = "SELECT * FROM usuario WHERE id_usua = ".$prof_mprof_ne['fk_id_usua_prof'];
    $resultado = mysqli_query($conexion, $consulta);
    $usuario = $resultado->fetch_assoc();

    if($id_emp == '77'){
        $_prof_mprof_ne = strtoupper($prof_mprof_ne['numero_prof']);
        $_empresa = $cliente['nombre_clte'].' '.$cliente['apellido_clte'];
        $_cliente = '';
        $_direccion = '';
        $_telefono = $cliente['celular_clte'];
    
    }else{
        $_prof_mprof_ne = strtoupper($prof_mprof_ne['numero_prof']);
        $_empresa = $empresa['nombre_emp'];
        $_cliente = $cliente['nombre_clte'].' '.$cliente['apellido_clte'];
        $_direccion = $empresa['direccion_emp'];
        if ($cliente['nombre_clte'] == ''){
            $_telefono = ($empresa['telefono_emp'] == 0) ? '' : $empresa['telefono_emp'];
        }else{
            $_telefono = ($cliente['celular_clte'] == 0) ? '' : $cliente['celular_clte']; 
        }
    }
    $_moneda = $prof_mprof_ne['moneda_prof'];
    $_fecha = substr($prof_mprof_ne['fecha_prof'],0,10);
    $_encargado = $usuario['nombre_usua'].' '.$usuario['apellido_usua'];
    $_descuento = $prof_mprof_ne['descuento_prof'];
    $_tpo_valido = $prof_mprof_ne['tpo_valido_prof'];
    $_cond_pago = $prof_mprof_ne['cond_pago_prof'];
    $_tpo_entrega = $prof_mprof_ne['tpo_entrega_prof'];
    $_observacion = $prof_mprof_ne['observacion_prof'];
    $_tipo_cambio = $prof_mprof_ne['tipo_cambio_prof'];
    $_email_usua = $usuario['email_usua'];
    $_celular_usua = $usuario['celular_usua'];
} else if ($_POST['pdf'] == 'mprof'){

    $consulta = "SELECT * FROM cliente WHERE id_clte = ".$prof_mprof_ne['fk_id_clte_mprof'];
    $resultado = mysqli_query($conexion, $consulta);
    $cliente = $resultado->fetch_assoc();

    $id_emp = $cliente['fk_id_emp_clte'];

    if($id_emp == '77'){
        $_prof_mprof_ne = strtoupper($prof_mprof_ne['numero_mprof']);
        $_empresa = $cliente['nombre_clte'].' '.$cliente['apellido_clte'];
        $_cliente = '';
        $_direccion = '';
        $_telefono = $cliente['celular_clte'] == 0 ? '' : $cliente['celular_clte'];
    
    }else{
        $consulta = "SELECT * FROM empresa WHERE id_emp = ".$id_emp;
        $resultado = mysqli_query($conexion, $consulta);
        $empresa = $resultado->fetch_assoc();

        $consulta = "SELECT * FROM usuario WHERE id_usua = ".$prof_mprof_ne['fk_id_usua_mprof'];
        $resultado = mysqli_query($conexion, $consulta);
        $usuario = $resultado->fetch_assoc();   

        $_prof_mprof_ne = strtoupper($prof_mprof_ne['numero_mprof']);
        $_empresa = $empresa['nombre_emp'];
        $_cliente = $cliente['nombre_clte'].' '.$cliente['apellido_clte'];
        $_direccion = $empresa['direccion_emp'];
        if ($cliente['nombre_clte'] == '' && $cliente['apellido_clte'] == ''){
            $_telefono = ($empresa['telefono_emp'] == 0) ? '' : $empresa['telefono_emp'];
        }else{
            $_telefono = ($cliente['celular_clte'] == 0) ? '' : $cliente['celular_clte']; 
        }
        $_moneda = $prof_mprof_ne['moneda_mprof'];
        $_fecha = substr($prof_mprof_ne['fecha_mprof'],0,10);
        $_encargado = $usuario['nombre_usua'].' '.$usuario['apellido_usua'];
        $_descuento = $prof_mprof_ne['descuento_mprof'];
        $_tpo_valido = $prof_mprof_ne['tpo_valido_mprof'];
        $_cond_pago = $prof_mprof_ne['cond_pago_mprof'];
        $_tpo_entrega = $prof_mprof_ne['tpo_entrega_mprof'];
        $_observacion = $prof_mprof_ne['observacion_mprof'];
        $_tipo_cambio = $prof_mprof_ne['tipo_cambio_mprof'];
        $_email_usua = $usuario['email_usua'];
        $_celular_usua = $usuario['celular_usua'];
    }
} else if ($_POST['pdf'] == 'ne'){
    $consulta = "SELECT * FROM cliente WHERE id_clte = ".$prof_mprof_ne['fk_id_clte_ne'];
    $resultado = mysqli_query($conexion, $consulta);
    $cliente = $resultado->fetch_assoc();

    $id_emp = $cliente['fk_id_emp_clte'];
 
    $consulta = "SELECT * FROM empresa WHERE id_emp = ".$id_emp;
    $resultado = mysqli_query($conexion, $consulta);
    $empresa = $resultado->fetch_assoc();

    $consulta = "SELECT * FROM usuario WHERE id_usua = ".$prof_mprof_ne['fk_id_usua_ne'];
    $resultado = mysqli_query($conexion, $consulta);
    $usuario = $resultado->fetch_assoc();

    if($id_emp == '77'){
        $_prof_mprof_ne = strtoupper($prof_mprof_ne['numero_ne']);
        $_empresa = $cliente['nombre_clte'].' '.$cliente['apellido_clte'];
        $_cliente = '';
        $_direccion = '';
        $_telefono = $cliente['celular_clte'];
    
    }else{
        $_prof_mprof_ne = strtoupper($prof_mprof_ne['numero_ne']);
        $_empresa = $empresa['nombre_emp'];
        $_cliente = $cliente['nombre_clte'].' '.$cliente['apellido_clte'];
        $_direccion = $empresa['direccion_emp'];
        if ($cliente['nombre_clte'] == ''){
            $_telefono = ($empresa['telefono_emp'] == 0) ? '' : $empresa['telefono_emp'];
        }else{
            $_telefono = ($cliente['celular_clte'] == 0) ? '' : $cliente['celular_clte']; 
        }
    }
    $_moneda = $prof_mprof_ne['moneda_ne'];
    $_fecha = substr($prof_mprof_ne['fecha_ne'],0,10);
    $_encargado = $usuario['nombre_usua'].' '.$usuario['apellido_usua'];
    $_descuento = $prof_mprof_ne['descuento_ne'];
    $_observacion = $prof_mprof_ne['observacion_ne'];
    $_tipo_cambio = $prof_mprof_ne['tipo_cambio_ne'];
    $_email_usua = $usuario['email_usua'];
    $_celular_usua = $usuario['celular_usua'];
} else if ($_POST['pdf'] == 'oc'){
    $consulta = "SELECT * FROM cliente WHERE id_clte = ".$prof_mprof_ne['fk_id_clte_oc'];
    $resultado = mysqli_query($conexion, $consulta);
    $cliente = $resultado->fetch_assoc();

    $id_emp = $cliente['fk_id_emp_clte'];
 
    $consulta = "SELECT * FROM empresa WHERE id_emp = ".$id_emp;
    $resultado = mysqli_query($conexion, $consulta);
    $empresa = $resultado->fetch_assoc();

    $consulta = "SELECT * FROM usuario WHERE id_usua = ".$prof_mprof_ne['fk_id_usua_oc'];
    $resultado = mysqli_query($conexion, $consulta);
    $usuario = $resultado->fetch_assoc();

    if($id_emp == '77'){
        $_prof_mprof_ne = strtoupper($prof_mprof_ne['numero_oc']);
        $_empresa = $cliente['nombre_clte'].' '.$cliente['apellido_clte'];
        $_cliente = '';
        $_direccion = '';
        $_telefono = $cliente['celular_clte'];
    
    }else{
        $_prof_mprof_ne = strtoupper($prof_mprof_ne['numero_oc']);
        $_empresa = $empresa['nombre_emp'];
        $_cliente = $cliente['nombre_clte'].' '.$cliente['apellido_clte'];
        $_direccion = $empresa['direccion_emp'];
        if ($cliente['nombre_clte'] == ''){
            $_telefono = ($empresa['telefono_emp'] == 0) ? '' : $empresa['telefono_emp'];
        }else{
            $_telefono = ($cliente['celular_clte'] == 0) ? '' : $cliente['celular_clte']; 
        }
    }
    $_moneda = $prof_mprof_ne['moneda_oc'];
    $_fecha = substr($prof_mprof_ne['fecha_oc'],0,10);
    $_encargado = $usuario['nombre_usua'].' '.$usuario['apellido_usua'];
    $_descuento = $prof_mprof_ne['descuento_oc'];
    $_observacion = $prof_mprof_ne['observacion_oc'];
    $_tipo_cambio = $prof_mprof_ne['tipo_cambio_oc'];
    $_email_usua = $usuario['email_usua'];
    $_celular_usua = $usuario['celular_usua'];
} else if ($_POST['pdf'] == 'cmp'){
    $_prof_mprof_ne = strtoupper($prof_mprof_ne['numero_cmp']);
    $_encargado = "Benjamín A. Aparicio García";
    $_fecha = substr($prof_mprof_ne['fecha_cmp'],0,10);
    $_empresa = $prof_mprof_ne['nombre_empp'];
    $_cliente = $prof_mprof_ne['nombre_prov'].' '.$prof_mprof_ne['apellido_prov'];
    $_tipo_cambio = $prof_mprof_ne['tipo_cambio_cmp'];
    $_descuento = $prof_mprof_ne['descuento_cmp'];
}

?>