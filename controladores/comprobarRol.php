<?php
	session_start();
	if(isset($_SESSION['info_nombres'])&&isset($_SESSION['info_apellidos'])&&isset($_SESSION['info_rol'])){
		$rol = $_SESSION['info_rol'];
		if($rol=='Administrador'){
            header('location: ../vistas/administrador.html',"_self");
        }
        if($rol=='Ingeniero'){
			header('location: ../vistas/ingeniero.html',"_self");
        }	
	}
?>