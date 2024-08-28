fetch('../controladores/comprobarSesion.php', {
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
	if (data == 'false') window.open('../vistas/login.html',"_self");
}).catch(err => {console.error('Error:', err)});

