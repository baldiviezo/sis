//<<-------------------------------------MAXIMO DE CARACTERES--------------------------------------------->>
setMaxInputLength();
function setMaxInputLength() {
  const inputElements = document.querySelectorAll('.form__input');
  inputElements.forEach(input => {
    input.setAttribute('maxlength', '40');
  });
}
//Añadimos un evento al fomulario de iniciar sesion
const form = document.querySelector('.form');
form.addEventListener('submit', ()=>{
	//Evitamos que se recargue la venta de iniciar sesion (Esto por q el boton esta dentro de un formulario)
	event.preventDefault();
	//Creamos un objeto formData para guardar todos los datos del formulario
	const formData = new FormData(form)
	//realizamos un envio de informacion asincrona con el metodo POST
	fetch('../controladores/login.php', {
		method: "POST",
		body: formData
	//Si recivimos en text, es un json string
	//si recibimos con json, es un objeto json
	}).then(response => response.json()).then(data => {
		//_self nos ayuda a remplazar la ventana actual, por la ventana que queremos abrir
		if (data=="La contraseña es incorrecta"){
			alert("La contraseña es incorrecta");
        }else if(data=="El usuario no existe") {
			alert("El usuario no existe");
		}else if (data=="Todos los campos son obligatorios") {
			alert("Todos los campos son obligatorios");
		}else{
        	//usua_apellidos y usua_rol, es usado en header.js, usua_nombres usado en sesionIniciada.js
			//usua_nombre y usua_apellidos usado en inicio.js
			//usua_rol es usado en venta.js
			//usUa_email usado en...
			//suua_celular usado en...
			for ( let clave in data ){
				localStorage.setItem(`${clave}`, data[clave]);
			}
			document.cookie = "sesionIniciada=true; max-age=" + (6 * 24 * 60 * 60);
			window.open('../vistas/inicio.html',"_self");
        }
	//catch se ejecuta cunado la promesa no se verdadera
	}).catch(error => console.log("Ocurrio un error. Intente nuevamente mas tarde"));
});
