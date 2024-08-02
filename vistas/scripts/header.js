const header = document.querySelector('header.header nav');
if(localStorage.getItem('usua_rol')=='Gerente general'){
	header.innerHTML = `
					<div class="nav__logo"></div>
					<ul class="nav__list">
						<li><a href="administrador.html" class="nav__link">Inicio</a></li>
						<li><a href="usuarios.html" class="nav__link">Usuarios</a></li>
						<li><a href="clientes.html" class="nav__link">Clientes</a></li>
						<li><a href="productos.html" class="nav__link">Productos</a></li>
						<li><a href="inventario.html" class="nav__link">Inventario</a></li>
						<li><a href="proforma.html" class="nav__link">Proforma</a></li>
						<li><a href="notaEntrega.html" class="nav__link">Nota de entrega</a></li>
						<li><a href="ventas.html" class="nav__link">Ventas</a></li>
						<li><a href="compras.html" class="nav__link">Compras</a></li>
						<li><a href="cerrar.html" class="nav__link">Cerrar sesión</a></li>
					</ul>
					<figure class="nav__menu">
					<img src="../imagenes/manu.svg" alt="Imagen de muestra" class="nav__icon">
					</figure>`;
}
if(localStorage.getItem('usua_rol')=='Ingeniero' || localStorage.getItem('usua_rol')=='Administrador'){
	header.innerHTML = `
						<div class="nav__logo"></div>
							<ul class="nav__list">
								<li><a href="administrador.html" class="nav__link">Inicio</a></li>
								<li><a href="usuarios.html" class="nav__link">Usuario</a></li>
								<li><a href="clientes.html" class="nav__link">Clientes</a></li>
								<li><a href="productos.html" class="nav__link">Productos</a></li>
								<li><a href="inventario.html" class="nav__link">Inventario</a></li>
								<li><a href="proforma.html" class="nav__link">Proforma</a></li>
								<li><a href="cerrar.html" class="nav__link">Cerrar sesión</a></li>
							</ul>
						<figure class="nav__menu">
							<img src="../imagenes/manu.svg" alt="Imagen de muestra" class="nav__icon">
						</figure>`;
};
//------El logo es el apellido del usuario
const logo = document.querySelector('.nav__logo');
let apellido = localStorage.getItem('usua_apellidos').split(" ");
let nombre = localStorage.getItem('usua_nombres').split(" ");
logo.innerHTML = `<img src="../imagenes/user.png"><h2>${nombre[0]} ${apellido[0]}</h2>`;
//------Menu desplegable
const list = document.querySelector('.nav__list');
const menu = document.querySelector('.nav__menu');
menu.addEventListener('click', ()=> list.classList.toggle('nav__list--show'));
