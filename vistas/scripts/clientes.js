//--------------------------------------------Restricciones de usuario----------------------------------------------
if (localStorage.getItem('rol_usua') == 'Ingeniero' || localStorage.getItem('rol_usua') == 'Gerente De Inventario') {
    //customersRMW
    document.querySelector('#formClienteR .form__group--select').children[4].classList.add('hide');
    document.getElementsByName('nombre_empM')[0].setAttribute('readonly', 'readonly');
    //customersMMW
    document.querySelector('#formClienteM .form__label--only').classList.add('hide');
    document.querySelector('#formClienteM .form__group--select').children[0].classList.add('hide');
    document.querySelector('#formClienteM .form__group--select').children[1].classList.add('hide');
    document.querySelector('#formClienteM .form__group--select').children[2].classList.add('hide');
    document.querySelector('#formClienteM .form__group--select').children[3].classList.add('hide');
    document.querySelector('#formClienteM .form__group--select').children[4].classList.add('hide');
    document.getElementsByName('nombre_clteM')[0].setAttribute('readonly', 'readonly');
    document.getElementsByName('apellido_clteM')[0].setAttribute('readonly', 'readonly');
}else if (localStorage.getItem('rol_usua') == 'Administrador') {
    //customersMMW
    //document.getElementsByName('nombre_clteM')[0].setAttribute('readonly', 'readonly');
    //document.getElementsByName('apellido_clteM')[0].setAttribute('readonly', 'readonly');
    //document.getElementsByName('nombre_empM')[0].setAttribute('readonly', 'readonly');
}
/************************************************TABLA DE CLIENTES*********************************************/
let customers = {};
let filterCustomers = {};
readCustomers();
function readCustomers() {
    let formData = new FormData();
    formData.append('readCustomers', '');
    fetch('../controladores/clientes.php', {
        method: "POST",
        body: formData
    }).then(response => response.json()).then(data => {
        for (let customer in data) {
            for (let valor in data[customer]) {
                if (data[customer]['nombre_clte'] == '' && data[customer]['nombre_clte'] == '') {
                    delete data[customer];
                    break;
                }
            }
        }
        customers = JSON.parse(JSON.stringify(data));
        filterCustomers = customers;
        paginacionCustomer(Object.values(customers).length, 1);
    }).catch(err => console.log(err));
}
//------Select utilizado para buscar por columnas
const selectSearchClte = document.getElementById('selectSearchClte');
selectSearchClte.addEventListener('change', searchCustomers);
//------buscar por input
const inputSerchClte = document.getElementById("inputSerchClte");
inputSerchClte.addEventListener("keyup", searchCustomers);
//------Clientes por pagina
const selectNumberClte = document.getElementById('selectNumberClte');
selectNumberClte.selectedIndex = 3;
selectNumberClte.addEventListener('change', function () {
    paginacionCustomer(Object.values(filterCustomers).length, 1);
});
//------buscar por:
function searchCustomers() {
    filterCustomers = {};
    for (let customer in customers) {
        for (let valor in customers[customer]) {
            if (selectSearchClte.value == 'todas') {
                if (valor == 'apellido_clte' || valor == 'nombre_emp' || valor == 'sigla_emp' || valor == 'nit_emp' || valor == 'email_clte' || valor == 'descuento_emp') {
                    if (valor == 'apellido_clte') {
                        if ((customers[customer][valor] + ' ' + customers[customer]['nombre_clte']).toLowerCase().indexOf(inputSerchClte.value.toLowerCase()) >= 0) {
                            filterCustomers[customer] = customers[customer];
                            break;
                        }
                    }else {
                        if (customers[customer][valor].toLowerCase().indexOf(inputSerchClte.value.toLowerCase()) >= 0){
                            filterCustomers[customer] = customers[customer];
                            break;
                        }
                    }
                }
            } else if (selectSearchClte.value == 'cliente'){
                if (valor == 'apellido_clte'){
                    if ((customers[customer][valor] + ' ' + customers[customer]['nombre_clte']).toLowerCase().indexOf(inputSerchClte.value.toLowerCase()) >= 0) {
                        filterCustomers[customer] = customers[customer];
                        break;
                    }
                } 
            } else {
                if (valor == selectSearchClte.value) {
                    if (customers[customer][valor].toLowerCase().indexOf(inputSerchClte.value.toLowerCase()) >= 0) {
                        filterCustomers[customer] = customers[customer];
                        break;
                    }
                }
            }
        }
    }
    paginacionCustomer(Object.values(filterCustomers).length, 1);
}
//------Ordenar tabla descendente ascendente
let orderCustomers = document.querySelectorAll('.tbody__head--customer');
orderCustomers.forEach(div => {
    div.children[0].addEventListener('click', function () {
        let array = Object.entries(filterCustomers).sort((a, b) => {
            let first = a[1][div.children[0].name].toLowerCase();
            let second = b[1][div.children[0].name].toLowerCase();
            if (first < second) { return -1 }
            if (first > second) { return 1 }
            return 0;
        })
        filterCustomers = Object.fromEntries(array);
        paginacionCustomer(Object.values(filterCustomers).length, 1);
    });
    div.children[1].addEventListener('click', function () {
        let array = Object.entries(filterCustomers).sort((a, b) => {
            let first = a[1][div.children[0].name].toLowerCase();
            let second = b[1][div.children[0].name].toLowerCase();
            if (first > second) { return -1 }
            if (first < second) { return 1 }
            return 0;
        })
        filterCustomers = Object.fromEntries(array);
        paginacionCustomer(Object.values(filterCustomers).length, 1);
    });
})
//------PaginacionCustomer
function paginacionCustomer(allCustomers, page) {
    let numberCustomers = Number(selectNumberClte.value);
    let allPages = Math.ceil(allCustomers / numberCustomers);
    let ul = document.querySelector('#wrapperCustomer ul');
    let li = '';
    let beforePages = page - 1;
    let afterPages = page + 1;
    let liActive;
    if (page > 1) {
        li += `<li class="btn" onclick="paginacionCustomer(${allCustomers}, ${page - 1})"><img src="../imagenes/arowLeft.svg"></li>`;
    }
    for (let pageLength = beforePages; pageLength <= afterPages; pageLength++) {
        if (pageLength > allPages) {
            continue;
        }
        if (pageLength == 0) {
            pageLength = pageLength + 1;
        }
        if (page == pageLength) {
            liActive = 'active';
        } else {
            liActive = '';
        }
        li += `<li class="numb ${liActive}" onclick="paginacionCustomer(${allCustomers}, ${pageLength})"><span>${pageLength}</span></li>`;
    }
    if (page < allPages) {
        li += `<li class="btn" onclick="paginacionCustomer(${allCustomers}, ${page + 1})"><img src="../imagenes/arowRight.svg"></li>`;
    }
    ul.innerHTML = li;
    let h2 = document.querySelector('#showPageCustomer h2');
    h2.innerHTML = `Pagina ${page}/${allPages}, ${allCustomers} Clientes`;
    tableCustomers(page);
}
//------Crear la tabla
function tableCustomers(page) {
    let tbody = document.getElementById('tbodyCustomer');
    inicio = (page - 1) * Number(selectNumberClte.value);
    final = inicio + Number(selectNumberClte.value);
    i = 1;
    tbody.innerHTML = '';
    for (let customer in filterCustomers) {
        if (i > inicio && i <= final) {
            let tr = document.createElement('tr');
            for (let valor in filterCustomers[customer]) {
                let td = document.createElement('td');
                if (valor == 'id_clte') {
                    td.innerText = filterCustomers[customer][valor];
                    td.setAttribute('hidden', '');
                    tr.appendChild(td);
                    td = document.createElement('td');
                    td.innerText = i;
                    tr.appendChild(td);
                    i++;
                } else if (valor == 'nombre_clte') {
                    td.innerText = filterCustomers[customer]['apellido_clte'] + ' ' + filterCustomers[customer]['nombre_clte'];
                    tr.appendChild(td);
                } else if (valor == 'fk_id_emp_clte' || valor == 'apellido_clte') {
                } else if (valor == 'celular_clte') {
                    if (filterCustomers[customer][valor] == '0') {
                        td.innerText = '';
                    } else {
                        td.innerText = filterCustomers[customer][valor];
                    }
                    tr.appendChild(td);
                } else if (valor == 'precio_emp') {
                    td.innerText = `${filterCustomers[customer][valor]} %`;
                    tr.appendChild(td);
                } else {
                    td.innerText = filterCustomers[customer][valor];
                    tr.appendChild(td);
                }
            }
            let td = document.createElement('td');
            if (localStorage.getItem('rol_usua') == 'Gerente general' || localStorage.getItem('rol_usua') == 'Administrador') {
                td.innerHTML = `
            <img src='../imagenes/edit.svg' onclick='readCustomer(this.parentNode.parentNode)' title='Editar cliente'>
            <img src='../imagenes/trash.svg' onclick='deleteCustomer(this.parentNode.parentNode)' title='Eliminar cliente'>`;
            } else {
                td.innerHTML = `
            <img src='../imagenes/edit.svg' onclick='readCustomer(this.parentNode.parentNode)' title='Editar cliente'>`;
            }
            tr.appendChild(td);
            tbody.appendChild(tr);
        } else {
            i++;
        }
    }
}
//<<----------------------------CRUD CLIENTE---------------------------------->>
//------Crear cliente
const formClienteR = document.getElementById('formClienteR');
formClienteR.addEventListener('submit', createCustomer);
function createCustomer() {
    customersRMW.classList.remove('modal__show');
    event.preventDefault();
    let formData = new FormData(formClienteR);
    formData.append('createCustomer', '');
    fetch('../controladores/clientes.php', {
        method: "POST",
        body: formData
    }).then(response => response.text()).then(data => {
        readCustomers();
        //Limpiar al registrar
        let inputsR = document.querySelectorAll('#formClienteR .form__input');
        inputsR.forEach(input => { input.value = '' });
        alert(data)
    }).catch(err => console.log(err));
}
//------Leer cliente
function readCustomer(tr) {
    formEnterprise = 'M';
    let id_clte = tr.children[0].innerText;
    for (let customer in filterCustomers) {
        if (filterCustomers[customer]['id_clte'] == id_clte) {
            for (let valor in filterCustomers[customer]) {
                if (valor == 'nombre_emp') {
                } else {
                    document.getElementsByName(valor + 'M')[0].value = filterCustomers[customer][valor];
                }
            }
            break;
        }
    }
    customersMMW.classList.add('modal__show');
}
//------Actualizar cliente
const formClienteM = document.getElementById('formClienteM');
formClienteM.addEventListener('submit', updateCustomer);
function updateCustomer() {
    customersMMW.classList.remove('modal__show');
    event.preventDefault();
    let formData = new FormData(formClienteM);
    formData.append('updateCustomer', '');
    fetch('../controladores/clientes.php', {
        method: "POST",
        body: formData
    }).then(response => response.text()).then(data => {
        readCustomers();
        alert(data)
    }).catch(err => console.log(err));
}
//------Eliminar cliente
function deleteCustomer(tr) {
    if (confirm('¿Esta usted seguro?')) {
        let id_clte = tr.children[0].innerText;
        let formData = new FormData();
        formData.append('deleteCustomer', id_clte);
        fetch('../controladores/clientes.php', {
            method: "POST",
            body: formData
        }).then(response => response.text()).then(data => {
            readCustomers();
            alert(data);
        }).catch(err => console.log(err));
    }
}
//-----------------------------------Ventana modal para cliente---------------------------------//
const customersRMW = document.getElementById('customersRMW');
const customersMMW = document.getElementById('customersMMW');
const openCustomersRMW = document.getElementById('openCustomersRMW');
const closeCustomersMMW = document.getElementById('closeCustomersMMW');
const closeCustomersRMW = document.getElementById('closeCustomersRMW');
openCustomersRMW.addEventListener('click', () => {
    customersRMW.classList.add('modal__show');
    formEnterprise = 'R';
});
closeCustomersMMW.addEventListener('click', () => {
    customersMMW.classList.remove('modal__show');
});
closeCustomersRMW.addEventListener('click', () => {
    customersRMW.classList.remove('modal__show');
});

//<<------------------------LLENAR LA LISTA DE EMPRESAS-------------------------------------->>
const selectEnterpriseR = document.getElementsByName('fk_id_emp_clteR')[0];
const selectEnterpriseM = document.getElementsByName('fk_id_emp_clteM')[0];
let enterprises = {};
let filterEnterprises = {};
let indexEnterprise = 0;
let formEnterprise;
readEnterprises();
function readEnterprises() {
    let formData = new FormData();
    formData.append('readEnterprises', '');
    fetch('../controladores/clientes.php', {
        method: "POST",
        body: formData
    }).then(response => response.json()).then(data => {
        enterprises = JSON.parse(JSON.stringify(data));
        filterEnterprises = enterprises;
        paginacionEnterpriseMW(Object.values(filterEnterprises).length, 1);
        fillSelectEmp(selectEnterpriseR, indexEnterprise);
        fillSelectEmp(selectEnterpriseM, indexEnterprise);
    }).catch(err => console.log(err));
}
function fillSelectEmp(select, index) {
    let ordNameEnterprises = Object.values(enterprises).sort((a, b) => a['nombre_emp'].localeCompare(b['nombre_emp']));
    select.innerHTML = '';
    for (let enterprise in ordNameEnterprises) {
        let option = document.createElement('option');
        option.value = ordNameEnterprises[enterprise]['id_emp'];
        option.innerText = ordNameEnterprises[enterprise]['nombre_emp'];
        select.appendChild(option);
    }
    if (index > 0) { select.value = index }
}
//<<---------------------------CRUD EMPRESA------------------------------->>
//------Craer una empresa
const formEmpresaR = document.getElementById('formEmpresaR');
formEmpresaR.addEventListener('submit', createEnterprise);
function createEnterprise() {
    enterprisesRMW.classList.remove('modal__show');
    event.preventDefault();
    let formData = new FormData(formEmpresaR);
    formData.append('createEnterprise', '');
    fetch('../controladores/clientes.php', {
        method: "POST",
        body: formData
    }).then(response => response.text()).then(data => {
        if (data == 'La empresa ya existe') {
            alert(data);
        } else {
            alert (data);
            indexEnterprise = 0;
            readEnterprises();
            //Limpiar el formulario de registrar empresa
            let inputs = document.querySelectorAll('#formEmpresaR .form__input');
            inputs.forEach(input => input.value = '');
        }
    }).catch(err => console.log(err));
    //initialPageSelectEmp();  
}
//------Leer una empresa
function readEnterprise(div) {
    let id_emp = div.children[0].value;
    for (let enterprise in enterprises) {
        if (enterprises[enterprise]['id_emp'] == id_emp) {
            for (let valor in enterprises[enterprise]) {
                document.getElementsByName(valor + 'M')[0].value = enterprises[enterprise][valor];
            }
            break;
        }
    }
    enterprisesMMW.classList.add('modal__show');
}
//------Actualizar una empresa
let formEmpresaM = document.getElementById('formEmpresaM');
formEmpresaM.addEventListener('submit', updateEnterprise);
function updateEnterprise() {
    enterprisesMMW.classList.remove('modal__show');
    event.preventDefault();
    let formData = new FormData(formEmpresaM);
    formData.append('updateEnterprise', '');
    fetch('../controladores/clientes.php', {
        method: "POST",
        body: formData
    }).then(response => response.text()).then(data => {
        indexEnterprise = document.getElementsByName('fk_id_emp_clte' + formEnterprise)[0].value;
        readEnterprises();
        readCustomers();
        alert(data);
    }).catch(err => console.log(err));
}
//------Borrar una empresa
function deleteEnterprise(div) {
    let id_emp = div.children[0].value;
    if (confirm('¿Esta usted seguro?')) {
        let formData = new FormData();
        formData.append('deleteEnterprise', id_emp);
        fetch('../controladores/clientes.php', {
            method: "POST",
            body: formData
        }).then(response => response.text()).then(data => {
            readEnterprises();
            alert(data);
        }).catch(err => console.log(err));
    }
}
//<<------------------------ABRIR Y CERRAR VENTANAS MODALES--------------------------------->>
//-----------------------------------Ventana modal para empresa---------------------------------//
const enterprisesRMW = document.getElementById('enterprisesRMW');
const enterprisesMMW = document.getElementById('enterprisesMMW');
const closeEnterprisesRMW = document.getElementById('closeEnterprisesRMW');
const closeEnterprisesMMW = document.getElementById('closeEnterprisesMMW');
function openEnterprisesRMW() {
    enterprisesRMW.classList.add('modal__show');
}
closeEnterprisesRMW.addEventListener('click', () => {
    enterprisesRMW.classList.remove('modal__show');
});
closeEnterprisesMMW.addEventListener('click', () => {
    enterprisesMMW.classList.remove('modal__show');
});
//<<---------------------------------------TABLA EMPRESA--------------------------------------->>
//------Select utilizado para buscar por columnas
const selectSearchEmpMW = document.getElementById('selectSearchEmpMW');
selectSearchEmpMW.addEventListener('change', searchEnterprisesMW);
//------buscar por input
const inputSearchEmpMW = document.getElementById("inputSearchEmpMW");
inputSearchEmpMW.addEventListener("keyup", searchEnterprisesMW);
//------Clientes por pagina
const selectNumberEmpMW = document.getElementById('selectNumberEmpMW');
selectNumberEmpMW.selectedIndex = 3;
selectNumberEmpMW.addEventListener('change', function () {
    paginacionEnterpriseMW(Object.values(filterEnterprises).length, 1);
});
//------buscar por:
function searchEnterprisesMW() {
    filterEnterprises = {};
    for (let enterprise in enterprises) {
        for (let valor in enterprises[enterprise]) {
            if (selectSearchEmpMW.value == 'todas') {
                if (valor != 'id_emp') {
                    if (enterprises[enterprise][valor].toLowerCase().indexOf(inputSearchEmpMW.value.toLowerCase()) >= 0) {
                        filterEnterprises[enterprise] = enterprises[enterprise];
                        break;
                    }
                }
            } else {
                if (valor == selectSearchEmpMW.value) {
                    if (enterprises[enterprise][valor].toLowerCase().indexOf(inputSearchEmpMW.value.toLowerCase()) >= 0) {
                        filterEnterprises[enterprise] = enterprises[enterprise];
                        break;
                    }
                }
            }
        }
    }
    paginacionEnterpriseMW(Object.values(filterEnterprises).length, 1);
}
//------Ordenar tabla descendente ascendente
let orderEnterprises = document.querySelectorAll('.tbody__head--empMW');
orderEnterprises.forEach(div => {
    div.children[0].addEventListener('click', function () {
        let array = Object.entries(filterEnterprises).sort((a, b) => {
            let first = a[1][div.children[0].name].toLowerCase();
            let second = b[1][div.children[0].name].toLowerCase();
            if (first < second) { return -1 }
            if (first > second) { return 1 }
            return 0;
        })
        filterEnterprises = Object.fromEntries(array);
        paginacionEnterpriseMW(Object.values(filterEnterprises).length, 1);
    });
    div.children[1].addEventListener('click', function () {
        let array = Object.entries(filterEnterprises).sort((a, b) => {
            let first = a[1][div.children[0].name].toLowerCase();
            let second = b[1][div.children[0].name].toLowerCase();
            if (first > second) { return -1 }
            if (first < second) { return 1 }
            return 0;
        })
        filterEnterprises = Object.fromEntries(array);
        paginacionEnterpriseMW(Object.values(filterEnterprises).length, 1);
    });
})
//------PaginacionEnterpriseMW
function paginacionEnterpriseMW(allEnterprises, page) {
    let numberEnterprises = Number(selectNumberEmpMW.value);
    let allPages = Math.ceil(allEnterprises / numberEnterprises);
    let ul = document.querySelector('#wrapperEmpMW ul');
    let li = '';
    let beforePages = page - 1;
    let afterPages = page + 1;
    let liActive;
    if (page > 1) {
        li += `<li class="btn" onclick="paginacionEnterpriseMW(${allEnterprises}, ${page - 1})"><img src="../imagenes/arowLeft.svg"></li>`;
    }
    for (let pageLength = beforePages; pageLength <= afterPages; pageLength++) {
        if (pageLength > allPages) {
            continue;
        }
        if (pageLength == 0) {
            pageLength = pageLength + 1;
        }
        if (page == pageLength) {
            liActive = 'active';
        } else {
            liActive = '';
        }
        li += `<li class="numb ${liActive}" onclick="paginacionEnterpriseMW(${allEnterprises}, ${pageLength})"><span>${pageLength}</span></li>`;
    }
    if (page < allPages) {
        li += `<li class="btn" onclick="paginacionEnterpriseMW(${allEnterprises}, ${page + 1})"><img src="../imagenes/arowRight.svg"></li>`;
    }
    ul.innerHTML = li;
    let h2 = document.querySelector('#showPageEmpMW h2');
    h2.innerHTML = `Pagina ${page}/${allPages}, ${allEnterprises} Empresas`;
    tableEnterprisesMW(page);
}
//------Crear la tabla
function tableEnterprisesMW(page) {
    const tbody = document.getElementById('tbodyEmpMW');
    inicio = (page - 1) * Number(selectNumberEmpMW.value);
    final = inicio + Number(selectNumberEmpMW.value);
    i = 1;
    tbody.innerHTML = '';
    for (let enterprise in filterEnterprises) {
        if (i > inicio && i <= final) {
            let tr = document.createElement('tr');
            for (let valor in filterEnterprises[enterprise]) {
                let td = document.createElement('td');
                if (valor == 'id_emp') {
                    td.innerText = filterEnterprises[enterprise][valor];
                    td.setAttribute('hidden', '');
                    tr.appendChild(td);
                    td = document.createElement('td');
                    td.innerText = i;
                    tr.appendChild(td);
                    i++;
                } else if (valor == 'nit_emp') {
                    if (filterEnterprises[enterprise][valor] == '0') {
                        td.innerText = '';
                    } else {
                        td.innerText = filterEnterprises[enterprise][valor];
                    }
                    tr.appendChild(td);
                } else if (valor == 'telefono_emp') {
                    if (filterEnterprises[enterprise][valor] == '0') {
                        td.innerText = '';
                    } else {
                        td.innerText = filterEnterprises[enterprise][valor];
                    }
                    tr.appendChild(td);
                } else {
                    td.innerText = filterEnterprises[enterprise][valor];
                    tr.appendChild(td);
                }
            }
            let td = document.createElement('td');
            td.innerHTML = `
            <img src='../imagenes/send.svg' onclick='sendEnterprise(this.parentNode.parentNode)' title='Seleccionar'>`;
            tr.appendChild(td);
            tbody.appendChild(tr);
        } else {
            i++;
        }
    }
}
//-------Send Enterprise
function sendEnterprise(tr) {
    let id_emp = tr.children[0].innerText;
    let select = document.getElementsByName('fk_id_emp_clte' + formEnterprise)[0];
    select.value = id_emp;
    enterpriseSMW.classList.remove('modal__show');
}
//----------------------------------ventana modal EnterpriseSMW-------------------------------------------
//---------------------------ventana modal para buscar producto
const enterpriseSMW = document.getElementById('enterpriseSMW');
//enterpriseSMW.addEventListener('click', ()=>enterpriseSMW.classList.remove('modal__show'));
const closeEnterpriseSMW = document.getElementById('closeEnterpriseSMW');
function openEnterpriseSMW() {
    enterpriseSMW.classList.add('modal__show');
}
closeEnterpriseSMW.addEventListener('click', () => {
    enterpriseSMW.classList.remove('modal__show');
});

