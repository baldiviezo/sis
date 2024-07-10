if (!localStorage.getItem('usua_nombres')){
	window.open('../vistas/login.html',"_self");
}
const cookies = document.cookie.split(';');
let cookieExists = false;

for(let i = 0; i < cookies.length; i++) {
    let cookie = cookies[i].trim();
    if(cookie.startsWith('sesionIniciada=')) {
        cookieExists = true;
        break;
    }
}

if(!cookieExists) {
    localStorage.removeItem('usua_id');
	localStorage.removeItem('usua_nombres');
	localStorage.removeItem('usua_apellidos');
	localStorage.removeItem('usua_email');
	localStorage.removeItem('usua_celular');
	localStorage.removeItem('usua_rol');
	window.open('../vistas/login.html',"_self");
}