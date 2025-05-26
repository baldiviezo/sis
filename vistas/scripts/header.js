const header = document.querySelector('header.header nav');
// Define los roles y sus respectivos menús
const roles = {
  'Gerente general': [
    { href: 'inicio.html', text: 'Inicio' },
    { href: 'usuarios.html', text: 'Usuarios' },
    { href: 'productos.html', text: 'Productos' },
    { href: 'inventario.html', text: 'Inventario' },
    { href: 'proforma.html', text: 'Proforma' },
    { href: 'notaEntrega.html', text: 'Nota de entrega' },
    { href: 'compras.html', text: 'Compras' },
    { href: 'cerrar.html', text: 'Cerrar sesión' }
  ],
  'Administrador': [
    { href: 'inicio.html', text: 'Inicio' },
    { href: 'usuarios.html', text: 'Usuarios' },
    { href: 'productos.html', text: 'Productos' },
    { href: 'inventario.html', text: 'Inventario' },
    { href: 'proforma.html', text: 'Proforma' },
    { href: 'notaEntrega.html', text: 'Nota de entrega' },
    { href: 'compras.html', text: 'Compras' },
    { href: 'cerrar.html', text: 'Cerrar sesión' }
  ],
  'Ingeniero': [
    { href: 'inicio.html', text: 'Inicio' },
    { href: 'usuarios.html', text: 'Usuario' },
    { href: 'productos.html', text: 'Productos' },
    { href: 'inventario.html', text: 'Inventario' },
    { href: 'proforma.html', text: 'Proforma' },
    { href: 'cerrar.html', text: 'Cerrar sesión' }
  ],
  'Gerente De Inventario': [
    { href: 'inicio.html', text: 'Inicio' },
    { href: 'usuarios.html', text: 'Usuario' },
    { href: 'productos.html', text: 'Productos' },
    { href: 'inventario.html', text: 'Inventario' },
    { href: 'proforma.html', text: 'Proforma' },
    { href: 'cerrar.html', text: 'Cerrar sesión' }
  ]
};

// Obtiene el rol del usuario
const rol = localStorage.getItem('rol_usua');

// Crea el menú según el rol del usuario
const menuItems = roles[rol].map(item => `
  <li><a href="${item.href}" class="nav__link">${item.text}</a></li>
`);

// Agrega el menú al header
header.innerHTML = `
  <div class="nav__logo"></div>
  <ul class="nav__list">
    ${menuItems.join('')}
  </ul>
  <figure class="nav__menu">
    <img src="../imagenes/manu.svg" alt="Imagen de muestra" class="nav__icon">
  </figure>
`;

const logo = document.querySelector('.nav__logo');
const list = document.querySelector('.nav__list');
const menu = document.querySelector('.nav__menu');
// Agrega el logo del usuario
let apellido = localStorage.getItem('apellidos_usua').split(" ");
let nombre = localStorage.getItem('nombres_usua').split(" ");
logo.innerHTML = `<img src="../imagenes/user.png"><h2>${nombre[0]} ${apellido[0]}</h2>`;

// Agrega el evento de clic al menú desplegable
menu.addEventListener('click', () => list.classList.toggle('nav__list--show'));

// Obtiene la URL actual
const urlActual = window.location.href;

// Agrega la clase active al enlace correspondiente
const enlaces = document.querySelectorAll('.nav__list a');
enlaces.forEach(enlace => {
  if (enlace.href === urlActual) {
    enlace.classList.add('active');
  }
});