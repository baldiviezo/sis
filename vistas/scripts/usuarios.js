//--------------------------------------------Restricciones de usuario----------------------------------------------
if (localStorage.getItem('rol_usua') == 'Ingeniero') {
    document.querySelector('.table__header').classList.add('hide');
    document.getElementsByName('email_usuaM')[0].setAttribute('readonly', 'readonly');
    document.getElementsByName('nombre_usuaM')[0].setAttribute('readonly', 'readonly');
    document.getElementsByName('apellido_usuaM')[0].setAttribute('readonly', 'readonly');
    //Options
    document.querySelectorAll('.form__radio')[1].children[2].classList.add('hide');
    document.querySelectorAll('.form__radio')[1].children[3].classList.add('hide');
    document.querySelectorAll('.form__radio')[1].children[4].classList.add('hide');
    document.querySelectorAll('.form__radio')[1].children[5].classList.add('hide');
} else if (localStorage.getItem('rol_usua') == 'Gerente De Inventario') {
    document.querySelector('.table__header').classList.add('hide');
    document.getElementsByName('email_usuaM')[0].setAttribute('readonly', 'readonly');
    document.getElementsByName('nombre_usuaM')[0].setAttribute('readonly', 'readonly');
    document.getElementsByName('apellido_usuaM')[0].setAttribute('readonly', 'readonly');
    //Options
    document.querySelectorAll('.form__radio')[1].children[0].classList.add('hide');
    document.querySelectorAll('.form__radio')[1].children[1].classList.add('hide');
    document.querySelectorAll('.form__radio')[1].children[4].classList.add('hide');
    document.querySelectorAll('.form__radio')[1].children[5].classList.add('hide');
} else if (localStorage.getItem('rol_usua') == 'Administrador') {
    document.getElementsByName('email_usuaM')[0].setAttribute('readonly', 'readonly');
    document.getElementsByName('nombre_usuaM')[0].setAttribute('readonly', 'readonly');
    document.getElementsByName('apellido_usuaM')[0].setAttribute('readonly', 'readonly');
    //Options
    document.querySelectorAll('.form__radio')[0].children[4].classList.add('hide');
    document.querySelectorAll('.form__radio')[0].children[5].classList.add('hide');
    document.querySelectorAll('.form__radio')[1].children[0].classList.add('hide');
    document.querySelectorAll('.form__radio')[1].children[1].classList.add('hide');
    document.querySelectorAll('.form__radio')[1].children[2].classList.add('hide');
    document.querySelectorAll('.form__radio')[1].children[3].classList.add('hide');
}
//----------------------------------------------BLOCK REQUEST WITH A FLAG----------------------------------------------
let rqstCreateUsua = false;
let rqstUpdateUsua = false;
let rqstDeleteUsua = false;
//<<-------------------------------------------CARGAR LA TABLA----------------------------------------------------->>
//------Leer tabla de usuarios
let usuarios = {};
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
function tableUsers() {
    if (localStorage.getItem('rol_usua') == 'Gerente general') {
        filterTableUsers(usuarios);
    } else if (localStorage.getItem('rol_usua') == 'Administrador') {
        let data = {};
        for (let usuario in usuarios) {
            if (usuarios[usuario]['rol_usua'] != 'Gerente general') {
                data[usuarios[usuario]['id_usua']] = usuarios[usuario];
            }
        }
        filterTableUsers(data);
    } else if (localStorage.getItem('rol_usua') == 'Ingeniero' || localStorage.getItem('rol_usua') == 'Gerente De Inventario') {
        let data = {};
        for (let usuario in usuarios) {
            if (usuarios[usuario]['id_usua'] == localStorage.getItem('id_usua')) {
                data[usuarios[usuario]['id_usua']] = usuarios[usuario];
            }
        }
        filterTableUsers(data);
    }
}
function filterTableUsers(data) {
    let i = 1;
    for (let usuario in data) {
        let tr = document.createElement('tr');
        for (let columna in data[usuario]) {
            if (columna == 'id_usua') {
                let td = document.createElement('td');
                td.innerText = data[usuario][columna];
                td.setAttribute('hidden', '');
                tr.appendChild(td);
                td = document.createElement('td');
                td.innerText = i;
                tr.appendChild(td);
                i++;
            } else {
                let td = document.createElement('td');
                td.innerText = data[usuario][columna];
                tr.appendChild(td);
            }
        }
        let td = document.createElement('td');
        if (localStorage.getItem('rol_usua') == 'Gerente general') {
            if (data[usuario]['rol_usua'] != 'Gerente general') {
                td.innerHTML = `
                <img src='../imagenes/edit.svg' onclick='readUser(this.parentNode.parentNode)' title='Editar usuario'>
                <img src='../imagenes/trash.svg' onclick='deleteUser(this.parentNode.parentNode)' title='Eliminar usuario'>`;
            } else {
                td.innerHTML = `
                <img src='../imagenes/edit.svg' onclick='readUser(this.parentNode.parentNode)' title='Editar usuario'>`;
            }
        } else {
            if (localStorage.getItem('rol_usua') == 'Ingeniero' || localStorage.getItem('rol_usua') == 'Gerente De Inventario') {
                td.innerHTML = `
                <img src='../imagenes/edit.svg' onclick='readUser(this.parentNode.parentNode)' title='Editar usuario'>`;
            } else if (localStorage.getItem('rol_usua') == 'Administrador') {
                if (data[usuario]['id_usua'] == localStorage.getItem('id_usua')) {
                    td.innerHTML = `
                    <img src='../imagenes/edit.svg' onclick='readUser(this.parentNode.parentNode)' title='Editar usuario'>`;
                }
            }
        }
        tr.appendChild(td);
        tbody.appendChild(tr);
    }
}
//------Buscar 
const search = document.getElementById("buscar");
search.addEventListener("keyup", e => {
    searchUsers();
});
function searchUsers() {
    let allRow = document.querySelectorAll('#tbody tr');
    let searchData = search.value.toLowerCase();
    allRow.forEach((tr) => {
        //textContent optiene todo el texto de las celdas de la fila.
        let rowData = tr.textContent.toLowerCase();
        tr.classList.toggle('hide', rowData.indexOf(searchData) < 0);
    })
}
//<<------------------------------CRUD USERS--------------------------------->>
//------crear usuario
document.getElementById("formUsersR").addEventListener("submit", createUser);
function createUser() {
    event.preventDefault();
    let pass1 = document.getElementsByName("contraseña_usua_R")[0];
    let pass2 = document.getElementsByName("contraseña2_usua_R")[0];
    if (pass1.value == pass2.value) {
        if (rqstCreateUsua == false) {
            rqstCreateUsua = true;
            let form = document.getElementById("formUsersR");
            let formData = new FormData(form);
            formData.append('createUser', '');
            preloader.classList.add('modal__show');
            fetch('../controladores/usuarios.php', {
                method: "POST",
                body: formData
            }).then(response => response.text()).then(data => {
                preloader.classList.remove('modal__show');
                rqstCreateUsua = false;
                alert(data);
                if (data != 'El email ya existe') {
                    usersRMW.classList.remove('modal__show');
                    readUsers();
                    cleanUpFormRegister();
                }
            }).catch(err => {
                rqstCreateUsua = false;
                alert(err);
            });
        }
    } else {
        alert("Las contraseñas no son iguales");
    }
}
//------Leer usuario
function readUser(usuario) {
    let id_usua = usuario.children[0].innerText;
    for (let usuario in usuarios) {
        if (usuarios[usuario]['id_usua'] == id_usua) {
            for (let columna in usuarios[usuario]) {
                if (columna == 'rol_usua') {
                    if (usuarios[usuario][columna] == 'Administrador') {
                        document.querySelectorAll('.form__radio')[1].classList.remove('hide');
                        document.getElementById('admi').checked = true;
                    } else if (usuarios[usuario][columna] == 'Ingeniero') {
                        document.querySelectorAll('.form__radio')[1].classList.remove('hide');
                        document.getElementById('ing').checked = true;
                    } else if (usuarios[usuario][columna] == 'Gerente De Inventario') {
                        document.querySelectorAll('.form__radio')[1].classList.remove('hide');
                        document.getElementById('gteInv').checked = true;
                    } else if (usuarios[usuario][columna] == 'Gerente general') {
                        document.querySelectorAll('.form__radio')[1].classList.add('hide');
                    }
                } else if (columna == 'contraseña_usuaM') {
                    document.getElementsByName(columna)[0].value = '';
                } else {
                    document.getElementsByName(columna + 'M')[0].value = usuarios[usuario][columna];
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
function updateUser() {
    event.preventDefault();
    let pass1 = document.getElementsByName("contraseña_usuaM")[0];
    let pass2 = document.getElementsByName("contraseña2_usuaM")[0];
    if (pass1.value == pass2.value) {
        if (rqstUpdateUsua == false) {
            rqstUpdateUsua = true;
            usersMMW.classList.remove('modal__show');
            let form = document.getElementById("formUsersM");
            let formData = new FormData(form);
            formData.append('updateUser', 'guardar');
            preloader.classList.add('modal__show');
            fetch('../controladores/usuarios.php', {
                method: "POST",
                body: formData
            }).then(response => response.text()).then(data => {
                preloader.classList.remove('modal__show');
                rqstUpdateUsua = false;
                cleanUpFormModify();
                readUsers();
                alert(data)
            }).catch(err => {
                rqstUpdateUsua = false;
                alert(err);
            });
        }
    } else {
        alert("Las contraseñas no son iguales");
    }
}
//------Borrar usuario
function deleteUser(usuario) {
    let id_usua = usuario.children[0].innerText;
    if (confirm(`¿Esta usted seguro? Se borrara el usuario "${usuario.children[2].innerText} ${usuario.children[3].innerText}"`)) {
        if (rqstDeleteUsua == false) {
            rqstDeleteUsua = true;
            const formData = new FormData()
            formData.append('deleteUser', id_usua);
            preloader.classList.add('modal__show');
            fetch('../controladores/usuarios.php', {
                method: "POST",
                body: formData
            }).then(response => response.text()).then(data => {
                preloader.classList.remove('modal__show');
                rqstDeleteUsua = false;
                readUsers();
                alert(data);
            }).catch(err => {
                rqstDeleteUsua = false;
                alert(err);
            });
        }
    }
}
//<<------------------------ABRIR Y CERRAR VENTANAS MODALES--------------------------------->>
const usersRMW = document.getElementById('usersRMW');
const usersMMW = document.getElementById('usersMMW');
const closeUsersRMW = document.getElementById('closeUsersRMW');
const closeUsersMMW = document.getElementById('closeUsersMMW');
const openUsersRMW = document.getElementById('openUsersRMW');
openUsersRMW.addEventListener('click', (e) => {
    usersRMW.classList.add('modal__show');
});
closeUsersRMW.addEventListener('click', (e) => {
    usersRMW.classList.remove('modal__show');
});
closeUsersMMW.addEventListener('click', (e) => {
    usersMMW.classList.remove('modal__show');
});
//<<----------------------------ESPACIOS OBLIGATORIOS Y LIMPIAR LOS CAMPOS DE LOS FORMULARIOS------------------------------------------>>
const modifyInputs = document.querySelectorAll('#formUsersM .form__group input');
const registerInputs = document.querySelectorAll('#formUsersR .form__group input');
spaceRequiret();
function spaceRequiret() {
    const requiredInputs = document.querySelectorAll('.form .form__group input.required');
    requiredInputs.forEach(input => {
        input.setAttribute("required", "");
        input.setAttribute('autocomplete', 'off');
    });
    //para el formulario de modificar
    document.getElementsByName("id_usuaM")[0].setAttribute("hidden", "");
    document.getElementsByName("rol_usuaM")[0].setAttribute("required", "");
    //para el formulario de registrar
    document.getElementsByName("rol_usua_R")[0].setAttribute("required", "");

}
//------Limpia los formualrios registrar y modificar
function cleanUpFormModify() {
    document.getElementsByName("id_usuaM")[0].value = "";
    modifyInputs.forEach(input => input.value = "");
    //limpiar radio button
    if (document.getElementById('ing').checked) {
        document.getElementById('ing').checked = false;
    }
    if (document.getElementById('admi').checked) {
        document.getElementById('admi').checked = false;
    }
}
function cleanUpFormRegister() {
    registerInputs.forEach(input => input.value = "");
    //limpiar los radio buton
    if (document.getElementById('ingR').checked) {
        document.getElementById('ingR').checked = false;
    }
    if (document.getElementById('admiR').checked) {
        document.getElementById('admiR').checked = false;
    }
}
//-----------------------------------------PRE LOADER---------------------------------------------
const preloader = document.getElementById('preloader');
