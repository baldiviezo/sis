const header = document.querySelector('header.header nav');
if(localStorage.getItem('rol_usua')=='Gerente general' || localStorage.getItem('rol_usua')=='Administrador'){
	header.innerHTML = `
					<div class="nav__logo"></div>
					<ul class="nav__list">
						<li><a href="inicio.html" class="nav__link">Inicio</a></li>
						<li><a href="usuarios.html" class="nav__link">Usuarios</a></li>
						<li><a href="productos.html" class="nav__link">Productos</a></li>
						<li><a href="inventario.html" class="nav__link">Inventario</a></li>
						<li><a href="proforma.html" class="nav__link">Proforma</a></li>
						<li><a href="notaEntrega.html" class="nav__link">Nota de entrega</a></li>
						<li><a href="cerrar.html" class="nav__link">Cerrar sesión</a></li>
					</ul>
					<figure class="nav__menu">
					<img src="../imagenes/manu.svg" alt="Imagen de muestra" class="nav__icon">
					</figure>`;
}
/*

						<li><a href="armados.html" class="nav__link">Armados y desarmados</a></li>
						<li><a href="compras.html" class="nav__link">Compras</a></li>
						<li><a href="ventas.html" class="nav__link">Ventas</a></li>
						<li><a href="ingresos.html" class="nav__link">Ingresos e egresos</a></li>
*/
if(localStorage.getItem('rol_usua')=='Ingeniero' || localStorage.getItem('rol_usua')=='Gerente De Inventario'){
	header.innerHTML = `
						<div class="nav__logo"></div>
							<ul class="nav__list">
								<li><a href="inicio.html" class="nav__link">Inicio</a></li>
								<li><a href="usuarios.html" class="nav__link">Usuario</a></li>
								<li><a href="productos.html" class="nav__link">Productos</a></li>
								<li><a href="inventario.html" class="nav__link">Inventario</a></li>
								<li><a href="proforma.html" class="nav__link">Proforma</a></li>
								<li><a href="cerrar.html" class="nav__link">Cerrar sesión</a></li>
							</ul>
						<figure class="nav__menu">
							<img src="../imagenes/manu.svg" alt="Imagen de muestra" class="nav__icon">
						</figure>`;
};
//								<li><a href="notaEntrega.html" class="nav__link">Nota de entrega</a></li>
//------El logo es el apellido del usuario
const logo = document.querySelector('.nav__logo');
let apellido = localStorage.getItem('apellidos_usua').split(" ");
let nombre = localStorage.getItem('nombres_usua').split(" ");
logo.innerHTML = `<img src="../imagenes/user.png"><h2>${nombre[0]} ${apellido[0]}</h2>`;
//------Menu desplegable
const list = document.querySelector('.nav__list');
const menu = document.querySelector('.nav__menu');
menu.addEventListener('click', ()=> list.classList.toggle('nav__list--show'));
