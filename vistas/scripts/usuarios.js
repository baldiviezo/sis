//--------------------------------------------Restricciones de usuario----------------------------------------------
if(localStorage.getItem('usua_rol') == 'Ingeniero' || localStorage.getItem('usua_rol') == 'Administrador'){
    document.querySelector('.table__header').classList.add('hide');
    document.querySelectorAll('.form__radio')[1].classList.add('hide');
    document.getElementsByName('email_usuaM')[0].parentNode.classList.add('hide');
}else if (localStorage.getItem('usua_rol') == 'Gerente general'){
    document.querySelectorAll('.form__radio')[1].classList.add('hide');
}
//<<-------------------------------------------CARGAR LA TABLA----------------------------------------------------->>
//------Leer tabla de usuarios
let usuarios ={};
readUsers();
function readUsers() {
    let tbody = document.getElementById("tbody");
    tbody.innerHTML = '';
    let formData = new FormData();
    formData.append('readUsers', '');
    fetch('../controladores/usuarios.php', {
            method: "POST",
            body: formData
    }).then(response => response.json()).then(data => {
        usuarios = data;
        tableUsers();
    }).catch(err => console.log(err));
}
function  tableUsers(){
    let i = 1;
        for(let usuario in usuarios){
            let tr = document.createElement('tr');
            for(let columna in usuarios[usuario]){
                if(columna == 'id_usua'){
                    let td = document.createElement('td');
                    td.innerText = usuarios[usuario][columna];
                    td.setAttribute('hidden', '');
                    tr.appendChild(td);
                    td = document.createElement('td');
                    td.innerText = i;
                    tr.appendChild(td);
                    i++;
                }else{
                    let td = document.createElement('td');
                    td.innerText = usuarios[usuario][columna];
                    tr.appendChild(td);
                }
            }
            let td = document.createElement('td');
            if(localStorage.getItem('usua_rol')=='Gerente general'){
                if(usuarios[usuario]['rol_usua'] == 'Gerente general'){
                    td.innerHTML = `
                    <img src='../imagenes/edit.svg' onclick='readUser(this.parentNode.parentNode)'>`;
                }else{
                    td.innerHTML = `
                    <img src='../imagenes/edit.svg' onclick='readUser(this.parentNode.parentNode)'>
                    <img src='../imagenes/trash.svg' onclick='deleteUser(this.parentNode.parentNode)'>`;
                }
            }else{
                td.innerHTML = `
                <img src='../imagenes/edit.svg' onclick='readUser(this.parentNode.parentNode)'>`;
            }
            tr.appendChild(td);
            tbody.appendChild(tr);
        }
}
//------Buscar 
const search = document.getElementById("buscar");
search.addEventListener("keyup", e=>{
    searchUsers();
    /*if(e.key == 'Enter'){
        searchUsers();
    }*/
});
function searchUsers(){
    let allRow = document.querySelectorAll('#tbody tr');
    let searchData = search.value.toLowerCase();
    allRow.forEach((tr) =>{
        //textContent optiene todo el texto de las celdas de la fila.
        let rowData = tr.textContent.toLowerCase();
        tr.classList.toggle('hide', rowData.indexOf(searchData)<0);
   })
}
//<<------------------------------CRUD USERS--------------------------------->>
//------crear usuario
document.getElementById("formUsersR").addEventListener("submit", createUser);
function createUser(){
    event.preventDefault();
    let pass1 = document.getElementsByName("contraseña_usua_R")[0];
    let pass2 = document.getElementsByName("contraseña2_usua_R")[0];
    if(pass1.value == pass2.value){
        event.preventDefault();
        let form = document.getElementById("formUsersR");
        let formData = new FormData(form);
        formData.append('createUser', '');
        fetch('../controladores/usuarios.php', {
            method: "POST",
            body: formData
        }).then(response => response.text()).then(data => {
            if (data!="registrado"){           
                alert(data);
            }else{
                usersRMW.classList.remove('modal__show');
                readUsers();
                cleanUpFormRegister();
            }
        }).catch(err => console.log(err));
    }else{
        alert("Las contraseñas no son iguales");
    }
}
//------Leer usuario
function readUser (usuario){
    let id_usua = usuario.children[0].innerText;
    for(let usuario in usuarios){
        if(usuarios[usuario]['id_usua']==id_usua){
            for(let columna in usuarios[usuario]){
                if(columna == 'rol_usua'){
                    if (usuarios[usuario][columna]=='Administrador'){
                        document.getElementById('admi').checked = true;
                    }
                    if (usuarios[usuario][columna]=='Ingeniero'){
                        document.getElementById('ing').checked = true;
                    }
                }else if(columna == 'contraseña_usuaM'){
                    document.getElementsByName(columna)[0].value = '';
                }else{
                    document.getElementsByName(columna+'M')[0].value = usuarios[usuario][columna];
                }
            }
            break;
        }
    }
    document.getElementsByName('contraseña_usuaM')[0].value = '';
    document.getElementsByName('contraseña2_usuaM')[0].value = '';
    usersMMW.classList.add('modal__show');
}
//------Actualizar usuario
document.getElementById("formUsersM").addEventListener("submit", updateUser);
function updateUser(){
    let pass1 = document.getElementsByName("contraseña_usuaM")[0];
    let pass2 = document.getElementsByName("contraseña2_usuaM")[0];
    if(pass1.value == pass2.value){
        event.preventDefault();
        let form = document.getElementById("formUsersM");
        let formData = new FormData(form);
        formData.append('updateUser', 'guardar');
        fetch('../controladores/usuarios.php', {
                method: "POST",
                body: formData
        }).then(response => response.text()).then(data => {
            if (data=="modificado"){
                cleanUpFormModify();
                usersMMW.classList.remove('modal__show');
                readUsers();
            }else{
                alert(data);
            }
        }).catch(err => console.log(err));
    }else{
        event.preventDefault();
        alert("Las contraseñas no son iguales");
    }
}
//------Borrar usuario
function deleteUser (usuario){
    let id_usua = usuario.children[0].innerText;
    if (confirm('¿Esta usted seguro?')){
        const formData = new FormData()
        formData.append('deleteUser', id_usua);
        fetch('../controladores/usuarios.php', {
            method: "POST",
            body: formData
        }).then(response => response.text()).then(data => {
            if (data!=""){
                readUsers();
            }
        }).catch(error => console.log("Ocurrio un error. Intente nuevamente mas tarde"));
    }
}
//<<------------------------ABRIR Y CERRAR VENTANAS MODALES--------------------------------->>
const usersRMW = document.getElementById('usersRMW');
const usersMMW = document.getElementById('usersMMW');  
const openUsersRMW = document.getElementById('openUsersRMW');
const closeUsersRMW = document.getElementById('closeUsersRMW');
const closeUsersMMW = document.getElementById('closeUsersMMW'); 
openUsersRMW.addEventListener('click',(e)=>{
    usersRMW.classList.add('modal__show');
});
closeUsersRMW.addEventListener('click',(e)=>{
    usersRMW.classList.remove('modal__show');
});
closeUsersMMW.addEventListener('click',(e)=>{
    usersMMW.classList.remove('modal__show');
});
//<<----------------------------ESPACIOS OBLIGATORIOS Y LIMPIAR LOS CAMPOS DE LOS FORMULARIOS------------------------------------------>>
const allInputs = document.querySelectorAll('.form .form__group input');
const modifyInputs = document.querySelectorAll('#formUsersM .form__group input');
const registerInputs = document.querySelectorAll('#formUsersR .form__group input');
//------Vuelve oblogatorios los campos del formulario 
espaciosObligatorios();
function espaciosObligatorios(){
    allInputs.forEach(input => {
        input.setAttribute("required","");
        input.setAttribute('autocomplete','off');
    });
    //para el formulario de modificar
    document.getElementsByName("id_usuaM")[0].setAttribute("hidden","");
    document.getElementsByName("rol_usuaM")[0].setAttribute("required","");
    //para el formulario de registrar
    document.getElementsByName("rol_usua_R")[0].setAttribute("required","");
}
//------Limpia los formualrios registrar y modificar
function cleanUpFormModify(){
    document.getElementsByName("id_usuaM")[0].value = "";
    modifyInputs.forEach(input => input.value = "");
    //limpiar radio button
    if(document.getElementById('ing').checked){
        document.getElementById('ing').checked = false;
    }
    if(document.getElementById('admi').checked){
        document.getElementById('admi').checked = false;
    }
}
function cleanUpFormRegister(){
    registerInputs.forEach(input => input.value = "");
    //limpiar los radio buton
    if(document.getElementById('ingR').checked){
        document.getElementById('ingR').checked = false;
    }
    if(document.getElementById('admiR').checked){
        document.getElementById('admiR').checked = false;
    }
}