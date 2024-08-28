fetch('../controladores/cerrarSesion.php', {
	method: "POST",
	body: JSON.stringify(localStorage.getItem('id_usua')),
	headers: {
		'Content-Type': 'application/x-www-form-urlencoded'
	}
}).then(response => {
	if (!response.ok) {
		throw new Error(`Error al enviar la petición: ${response.status}`);
	}
	return response.text();
}).then(data => {
	
}).catch(err => {console.error('Error:', err)});

localStorage.removeItem('id_usua');
localStorage.removeItem('nombres_usua');
localStorage.removeItem('apellidos_usua');
localStorage.removeItem('email_usua');
localStorage.removeItem('celular_usua');
localStorage.removeItem('rol_usua');

window.open('../vistas/login.html',"_self");