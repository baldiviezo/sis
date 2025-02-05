//--------------------------------------------Restricciones de usuario----------------------------------------------
if (localStorage.getItem('rol_usua') == 'Gerente general' || localStorage.getItem('rol_usua') == 'Administrador') {
} else if (localStorage.getItem('rol_usua') == 'Ingeniero' || localStorage.getItem('rol_usua') == 'Gerente De Inventario') {
    //marca y categoria create
    document.getElementsByName('codigo_prodM')[0].setAttribute('readonly', 'readonly');
}
//--------------------------------------------BLOCK REQUEST WITH A FLAG----------------------------------------------
let rqstBuy = false;
const preloader = document.getElementById('preloader');
init();
async function init() {
    if (rqstBuy == false) {
        preloader.classList.add('modal__show');
        rqstBuy = true;
        Promise.all([readSuppliers(), readEnterprises(), readBuys(), readCmp_prods(), readProducts(), readAllMarcas(), readAllCategorias()], readInventories()).then(() => {
            rqstBuy = false;
            preloader.classList.remove('modal__show');
        })
    }
}
//-----------------------------------------------FECHA ACTUAL-------------------------------------
const date = new Date();
const dateFormat = new Intl.DateTimeFormat('es-ES', {
    timeZone: 'America/La_Paz',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
});
const formattedDate = dateFormat.format(date);
const datePart = formattedDate.split(', ');
const dateActual = datePart[0].split('/');
//-------------------------------------------------SUPPLIER--------------------------------------------------
//<<-----------------------------------------CRUD SUPPLIER----------------------------------------->>
let suppliers = [];
async function readSuppliers() {
    return new Promise((resolve, reject) => {
        let formData = new FormData();
        formData.append('readSuppliers', '');
        fetch('../controladores/clientes.php', {
            method: "POST",
            body: formData
        }).then(response => response.json()).then(data => {
            suppliers = Object.values(data);
            resolve();
        }).catch(err => console.log(err));
    })
}
//------Create a supplier
const formSupplierR = document.getElementById('formSupplierR');
formSupplierR.addEventListener('submit', createSupplier);
async function createSupplier() {
    if (!rqstBuy) {
        rqstBuy = true;
        event.preventDefault();
        supplierRMW.classList.remove('modal__show');
        let formData = new FormData(formSupplierR);
        formData.append('createSupplier', '');
        preloader.classList.add('modal__show');
        fetch('../controladores/clientes.php', {
            method: "POST",
            body: formData
        }).then(response => response.text()).then(data => {
            readSuppliers().then(() => {
                preloader.classList.remove('modal__show');
                rqstBuy = false;
                formSupplierR.reset();
                fillSelectClte(selectEnterpriseR, selectSupplierR);
                mostrarAlerta(data);
            })
        }).catch(err => console.log(err));
    }
}
//------Read a supplier
function readSupplier(rm) {
    let selectSupplierRM = document.getElementById('selectSupplier' + rm);
    let id_prov = selectSupplierRM.value;
    for (let supplier in suppliers) {
        if (suppliers[supplier]['id_prov'] == id_prov) {
            for (let valor in suppliers[supplier]) {
                if (valor == 'fk_id_empp_prov') {
                    selectEntProvM.innerHTML = '';
                    let option = document.createElement('option');
                    option.value = selectEnterpriseR.value
                    option.innerText = selectEnterpriseR.options[selectEnterpriseR.selectedIndex].textContent;
                    selectEntProvM.appendChild(option);
                } else {
                    document.getElementsByName(valor + 'M')[0].value = suppliers[supplier][valor];
                }
            }
        }
    }
    supplierMMW.classList.add('modal__show');
}
//------Update a supplier
const formClienteM = document.getElementById('formSupplierM');
formSupplierM.addEventListener('submit', updateSupplier);
async function updateSupplier() {
    if (!rqstBuy) {
        rqstBuy = true;
        preloader.classList.add('modal__show');
        event.preventDefault();
        supplierMMW.classList.remove('modal__show');
        let formData = new FormData(formClienteM);
        formData.append('updateSupplier', '');
        fetch('../controladores/clientes.php', {
            method: "POST",
            body: formData
        }).then(response => response.text()).then(data => {
            readSuppliers().then(() => {
                preloader.classList.remove('modal__show');
                rqstBuy = false;
                fillSelectClte(selectEnterpriseR, selectSupplierR);
                mostrarAlerta(data);
            })
        }).catch(err => console.log(err));
    }
}
//------Delete a supplier
async function deleteSupplier(rm) {
    let selectSupplierRM = document.getElementById('selectSupplier' + rm);
    if (confirm('¿Esta usted seguro?')) {
        if (!rqstBuy) {
            rqstBuy = true;
            preloader.classList.add('modal__show');
            let id = selectSupplierRM.value;
            let formData = new FormData();
            formData.append('deleteSupplier', id);
            fetch('../controladores/clientes.php', {
                method: "POST",
                body: formData
            }).then(response => response.text()).then(data => {
                readSuppliers().then(() => {
                    preloader.classList.remove('modal__show');
                    rqstBuy = false;
                    fillSelectClte(selectEnterpriseR, selectSupplierR);
                    mostrarAlerta(data);
                })
            }).catch(err => console.log(err));
        }
    }
}
//<<-------------------------------------------MODAL SUPPLIER---------------------------------------->>
const supplierRMW = document.getElementById('supplierRMW');
const supplierMMW = document.getElementById('supplierMMW');
const closeSupplierRMW = document.getElementById('closeSupplierRMW');
const closeSupplierMMW = document.getElementById('closeSupplierMMW');
const selectEntProvR = document.getElementsByName('fk_id_empp_provR')[0];
const selectEntProvM = document.getElementsByName('fk_id_empp_provM')[0];
function openSupplierRMW() {
    supplierRMW.classList.add('modal__show');
    selectEntProvR.innerHTML = '';
    let option = document.createElement('option');
    option.value = selectEnterpriseR.value;
    option.innerText = selectEnterpriseR.options[selectEnterpriseR.selectedIndex].textContent;
    selectEntProvR.appendChild(option);
}
closeSupplierRMW.addEventListener('click', () => {
    supplierRMW.classList.remove('modal__show');
});
closeSupplierMMW.addEventListener('click', () => {
    supplierMMW.classList.remove('modal__show');
});
//<<---------------------------------------------EMPRESA---------------------------------------------->>
const selectEnterpriseR = document.getElementsByName('fk_id_emp_clteR')[0];
const selectEnterpriseM = document.getElementsByName('fk_id_emp_clteM')[0];
const selectSupplierR = document.getElementsByName('fk_id_prov_cmpR')[0];
const selectSupplierM = document.getElementsByName('fk_id_prov_cmpM')[0];
selectEnterpriseR.addEventListener('change', () => {
    fillSelectClte(selectEnterpriseR, selectSupplierR);
});
let enterprises = [];
let filterEnterprises = [];
async function readEnterprises() {
    return new Promise((resolve, reject) => {
        let formData = new FormData();
        formData.append('readEnterprisesP', '');
        fetch('../controladores/clientes.php', {
            method: "POST",
            body: formData
        }).then(response => response.json()).then(data => {
            enterprises = Object.values(data);
            filterEnterprises = enterprises;
            paginacionEnterpriseMW(enterprises.length, 1);
            fillSelectEmp(selectEnterpriseR, selectSupplierR);
            resolve();
        }).catch(err => console.log(err));
    })
}
//<<---------------------------------------TABLA MODAL EMPRESA--------------------------------------->>
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
                if (valor != 'id_empp') {
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
                if (valor == 'id_empp') {
                    td.innerText = filterEnterprises[enterprise][valor];
                    td.setAttribute('hidden', '');
                    tr.appendChild(td);
                    td = document.createElement('td');
                    td.innerText = i;
                    tr.appendChild(td);
                    i++;
                } else if (valor == 'nit_empp') {
                    if (filterEnterprises[enterprise][valor] == '0') {
                        td.innerText = '';
                    } else {
                        td.innerText = filterEnterprises[enterprise][valor];
                    }
                    tr.appendChild(td);
                } else if (valor == 'telefono_empp') {
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
        <img src='../imagenes/send.svg' onclick='sendEnterprise(this.parentNode.parentNode)'>`;
            tr.appendChild(td);
            tbody.appendChild(tr);
        } else {
            i++;
        }
    }
}
function sendEnterprise(tr) {
    enterpriseSMW.classList.remove('modal__show');
    let id_empp = tr.children[0].innerText;
    selectEnterpriseR.value = id_empp;
    fillSelectClte(selectEnterpriseR, selectSupplierR);
}
function fillSelectEmp(selectEmp, selectSpl) {
    selectEmp.innerHTML = '';
    for (let enterprise in enterprises) {
        let option = document.createElement('option');
        option.value = enterprises[enterprise]['id_empp'];
        option.innerText = enterprises[enterprise]['nombre_empp'];
        selectEmp.appendChild(option);
    }
    fillSelectClte(selectEmp, selectSpl);
}
function fillSelectClte(selectEmp, selectSpl) {
    if (selectSpl != false) {
        let id_empp = selectEmp.value;
        selectSpl.innerHTML = '';
        for (let supplier in suppliers) {
            if (suppliers[supplier]['fk_id_empp_prov'] == id_empp) {
                let option = document.createElement('option');
                option.value = suppliers[supplier]['id_prov'];
                option.innerText = suppliers[supplier]['nombre_prov'] + ' ' + suppliers[supplier]['apellido_prov'];
                selectSpl.appendChild(option);
            }
        }
        for (let enterprise in enterprises) {
            if (enterprises[enterprise]['id_empp'] == id_empp) {
                document.getElementsByName('descuento_cmpR')[0].value = enterprises[enterprise]['descuento_empp'];
                break;
            } else {
                document.getElementsByName('descuento_cmpR')[0].value = '0';
            }
        }
    }
}
//----------------------------------ventana modal EnterpriseSMW-------------------------------------------
//---------------------------ventana modal para buscar producto
const enterpriseSMW = document.getElementById('enterpriseSMW');
const closeEnterpriseSMW = document.getElementById('closeEnterpriseSMW');
function openEnterpriseSMW() {
    enterpriseSMW.classList.add('modal__show');
}
closeEnterpriseSMW.addEventListener('click', () => {
    enterpriseSMW.classList.remove('modal__show');
});
//----------------------------------------------CRUD EMPRESA---------------------------------------------
//------Craer una empresa
const formEmpresaR = document.getElementById('formEmpresaR');
formEmpresaR.addEventListener('submit', createEnterprise);
async function createEnterprise() {
    event.preventDefault();
    if (!rqstBuy) {
        rqstBuy = true;
        preloader.classList.add('modal__show');
        enterprisesRMW.classList.remove('modal__show');
        let formData = new FormData(formEmpresaR);
        formData.append('createEnterpriseP', '');
        fetch('../controladores/clientes.php', {
            method: "POST",
            body: formData
        }).then(response => response.text()).then(data => {
            if (data != 'La empresa ya existe') {
                Promise.all([readSuppliers(), readEnterprises()]).then(() => {
                    formEmpresaR.reset();
                    preloader.classList.remove('modal__show');
                    rqstBuy = false;
                    mostrarAlerta(data);
                })
            } else {
                preloader.classList.remove('modal__show');
                rqstBuy = false;
                mostrarAlerta(data);
            }
        }).catch(err => console.log(err));
    }
}
//------Leer una empresa
function readEnterprise(rm) {
    let selectEnterpriseRM = document.getElementById('selectEnterprise' + rm);
    let id_empp = selectEnterpriseRM.value;
    for (let enterprise in enterprises) {
        if (enterprises[enterprise]['id_empp'] == id_empp) {

            for (let valor in enterprises[enterprise]) {
                document.getElementsByName(valor + 'M')[0].value = enterprises[enterprise][valor];
            }
        }
    }
    enterprisesMMW.classList.add('modal__show');
}
//------Actualizar una empresa
let formEmpresaM = document.getElementById('formEmpresaM');
formEmpresaM.addEventListener('submit', updateEnterprise);
async function updateEnterprise() {
    event.preventDefault();
    if (!rqstBuy) {
        rqstBuy = true;
        preloader.classList.add('modal__show');
        enterprisesMMW.classList.remove('modal__show');
        let formData = new FormData(formEmpresaM);
        formData.append('updateEnterpriseP', '');
        fetch('../controladores/clientes.php', {
            method: "POST",
            body: formData
        }).then(response => response.text()).then(data => {
            rqstBuy = false;
            if (data == 'Empresa actualizada exitosamente') {
                readEnterprises().then(() => {
                    preloader.classList.remove('modal__show');
                    mostrarAlerta(data);
                })
            } else {
                preloader.classList.remove('modal__show');
                mostrarAlerta(data);
            }
        }).catch(err => console.log(err));
    }

}
//------Borrar una empresa
async function deleteEnterprise(rm) {
    let selectEnterpriseRM = document.getElementById('selectEnterprise' + rm);
    if (confirm('¿Esta usted seguro?')) {
        if (!rqstBuy) {
            rqstBuy = true;
            preloader.classList.add('modal__show');
            let id_empp = selectEnterpriseRM.value;
            let formData = new FormData();
            formData.append('deleteEnterpriseP', id_empp);
            fetch('../controladores/clientes.php', {
                method: "POST",
                body: formData
            }).then(response => response.text()).then(data => {
                readEnterprises().then(() => {
                    rqstBuy = false;
                    preloader.classList.remove('modal__show');
                    mostrarAlerta(data);
                })
            }).catch(err => console.log(err));
        }
    }
}
//<<------------------------ABRIR Y CERRAR VENTANAS MODALES--------------------------------->>
//-----------------------------------Ventana modal para empresa---------------------------------//
const enterprisesRMW = document.getElementById('enterprisesRMW');
const enterprisesMMW = document.getElementById('enterprisesMMW');
const closEEnterprisesRMW = document.getElementById('closEEnterprisesRMW');
const closEEnterprisesMMW = document.getElementById('closEEnterprisesMMW');
function openEnterprisesRMW() {
    enterprisesRMW.classList.add('modal__show');
}
closeEnterprisesRMW.addEventListener('click', () => {
    enterprisesRMW.classList.remove('modal__show');
});
closeEnterprisesMMW.addEventListener('click', () => {
    enterprisesMMW.classList.remove('modal__show');
});
//<<---------------------------------------------------TABLA DE COMPRA------------------------------------------>>
let buys = [];
let filterBuys = [];
let formBuy = '';
async function readBuys() {
    return new Promise((resolve, reject) => {
        let formData = new FormData();
        formData.append('readBuys', '');
        fetch('../controladores/compras.php', {
            method: "POST",
            body: formData
        }).then(response => response.json()).then(data => {
            buys = Object.values(data);
            createSelectDateBuy();
            filterBuys = buys;
            filterByUserBuys(buys.length, 1);
            resolve();
        }).catch(err => console.log(err));
    })
}
//------Select utilizado para buscar por columnas
const selectSearchBuy = document.getElementById('selectSearchBuy');
selectSearchBuy.addEventListener('change', searchBuys);
//------buscar por input
const inputSerchBuy = document.getElementById("inputSerchBuy");
inputSerchBuy.addEventListener("keyup", searchBuys);
//------Compras por pagina
const selectNumberBuy = document.getElementById('selectNumberBuy');
selectNumberBuy.selectedIndex = 3;
selectNumberBuy.addEventListener('change', function () {
    filterByUserBuys(filterBuys.length, 1);
});
//------buscar por:
function searchBuys() {
    const busqueda = inputSerchBuy.value.toLowerCase().trim();
    const valor = selectSearchBuy.value.toLowerCase().trim();
    filterBuys = buys.filter(buy => {
        if (valor == 'todas') {
            return (
                buy.numero_cmp.toLowerCase().includes(busqueda) ||
                (buy.nombre_usua + ' ' + buy.apellido_usua).toLowerCase().includes(busqueda) ||
                (buy.nombre_prov + ' ' + buy.apellido_prov).toLowerCase().includes(busqueda) ||
                buy.fecha_cmp.toLowerCase().includes(busqueda) ||
                buy.nombre_empp.toLowerCase().includes(busqueda) ||
                buy.total_cmp.toString().includes(busqueda)
            )
        } if (valor === 'total_cmp') {
            return buy[valor].toString().includes(busqueda);
        } else if (valor === 'nombre_usua') {
            return (buy[valor] + ' ' + buy.apellido_usua).toLowerCase().includes(busqueda);
        } else {
            return buy[valor].toLowerCase().includes(busqueda);
        }
    });
    selectStateBuys();
}
function createSelectDateBuy() {
    const anios = Array.from(new Set(buys.map(buy => buy.fecha_cmp.split('-')[0])));
    selectDateBuy.innerHTML = '';
    let optionFirst = document.createElement('option');
    optionFirst.value = 'todas';
    optionFirst.innerText = 'Todos los años';
    selectDateBuy.appendChild(optionFirst);
    for (let anio of anios) {
        const option = document.createElement('option');
        option.value = anio;
        option.textContent = anio;
        selectDateBuy.appendChild(option);
    }
}
//------Seleccionar el año
const selectDateBuy = document.getElementById('selectDateBuy');
selectDateBuy.addEventListener('change', selectChangeYear);
function selectChangeYear() {
    if (selectDateBuy.value == 'todas') {
        filterBuys = buys;
    } else {
        filterBuys = buys.filter(buy => buy.fecha_cmp.split('-')[0] == selectDateBuy.value);
    }
    filterBuys = filterBuys.filter(buy => {
        if (selectStateBuy.value == 'todasLasCompras') {
            return true;
        } else {
            return buy.estado_cmp == selectStateBuy.value;
        }
    });
    filterByUserBuys(filterBuys.length, 1);
}
//-------Estado de compra
const selectStateBuy = document.getElementById('selectStateBuy');
selectStateBuy.addEventListener('change', searchBuys);
//estado de la compra
function selectStateBuys() {
    if (selectStateBuy.value == 'todasLasCompras') {
        filterBuys = filterBuys;
    } else {
        filterBuys = filterBuys.filter(buy => buy.estado_cmp == selectStateBuy.value);
    }
    filterBuys = filterBuys.filter(buy => {
        if (selectDateBuy.value == 'todas') {
            return true;
        } else {
            return buy.fecha_cmp.split('-')[0] == selectDateBuy.value;
        }
    });
    filterByUserBuys(filterBuys.length, 1);
}
//------Ordenar tabla descendente ascendente
let orderBuys = document.querySelectorAll('.tbody__head--buy');
orderBuys.forEach(div => {
    div.children[0].addEventListener('click', function () {
        filterBuys.sort((a, b) => {
            let first = a[div.children[0].name];
            let second = b[div.children[0].name];
            if (typeof first === 'number' && typeof second === 'number') {
                return first - second;
            } else {
                return String(first).localeCompare(String(second));
            }
        });
        filterByUserBuys(filterBuys.length, 1);
    });
    div.children[1].addEventListener('click', function () {
        filterBuys.sort((a, b) => {
            let first = a[div.children[0].name];
            let second = b[div.children[0].name];
            if (typeof first === 'number' && typeof second === 'number') {
                return second - first;
            } else {
                return String(second).localeCompare(String(first));
            }
        });
        filterByUserBuys(filterBuys.length, 1);
    });
});
//------Filtar por rol
function filterByUserBuys(length, page) {
    if (localStorage.getItem('rol_usua') == 'Gerente general' || localStorage.getItem('rol_usua') == 'Administrador') {
        paginacionBuy(length, page);
    } else if (localStorage.getItem('rol_usua') == 'Ingeniero' || localStorage.getItem('rol_usua') == 'Gerente De Inventario') {
        filterBuys = filterBuys.filter(buy => buy.fk_id_usua_cmp == localStorage.getItem('id_usua'));
        paginacionBuy(filterBuys.length, page);
    }
}
//------PaginacionBuy
function paginacionBuy(allBuys, page) {
    let numberCustomers = Number(selectNumberBuy.value);
    let allPages = Math.ceil(allBuys / numberCustomers);
    let ul = document.querySelector('#wrapperBuy ul');
    let li = '';
    let beforePages = page - 1;
    let afterPages = page + 1;
    let liActive;
    if (page > 1) {
        li += `<li class="btn" onclick="paginacionBuy(${allBuys}, ${page - 1})"><img src="../imagenes/arowLeft.svg"></li>`;
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
        li += `<li class="numb ${liActive}" onclick="paginacionBuy(${allBuys}, ${pageLength})"><span>${pageLength}</span></li>`;
    }
    if (page < allPages) {
        li += `<li class="btn" onclick="paginacionBuy(${allBuys}, ${page + 1})"><img src="../imagenes/arowRight.svg"></li>`;
    }
    ul.innerHTML = li;
    let h2 = document.querySelector('#showPageBuy h2');
    h2.innerHTML = `Pagina ${page}/${allPages}, ${allBuys} ordenes de  compras`;
    tableBuys(page);
}
//------Crear la tabla
function tableBuys(page) {
    const totalBuy = document.getElementById('totalBuy');
    let total = 0;
    for (let buy in filterBuys) {
        total += Number(filterBuys[buy]['total_cmp']);
    }
    totalBuy.innerText = `Total: ${total.toFixed(2)} Bs`;
    let tbody = document.getElementById('tbodyBuy');
    inicio = (page - 1) * Number(selectNumberBuy.value);
    final = inicio + Number(selectNumberBuy.value);
    i = 1;
    tbody.innerHTML = '';
    for (let buy in filterBuys) {
        if (i > inicio && i <= final) {
            let tr = document.createElement('tr');
            for (let valor in filterBuys[buy]) {
                let td = document.createElement('td');
                if (valor == 'id_cmp') {
                    td.innerText = filterBuys[buy][valor];
                    td.setAttribute('hidden', '');
                    tr.appendChild(td);
                    td = document.createElement('td');
                    td.innerText = i;
                    tr.appendChild(td);
                    i++;
                } else if (valor == 'fecha_cmp') {
                    td.innerText = filterBuys[buy][valor].slice(0, 10);
                    tr.appendChild(td);
                } else if (valor == 'fk_id_usua_cmp' || valor == 'fk_id_prov_cmp' || valor == 'apellido_usua' || valor == 'id_empp' || valor == 'apellido_prov' || valor == 'estado_cmp' || valor == 'moneda_cmp' || valor == 'tipo_cambio_cmp' || valor == 'descuento_cmp' || valor == 'factura_cmp' || valor == 'fecha_entrega_cmp') {
                } else if (valor == 'nombre_usua') {
                    td.innerText = `${filterBuys[buy][valor]} ${filterBuys[buy]['apellido_usua']}`;
                    tr.appendChild(td);
                } else if (valor == 'nombre_prov') {
                    td.innerText = `${filterBuys[buy][valor]} ${filterBuys[buy]['apellido_prov']}`;
                    tr.appendChild(td);
                } else if (valor == 'total_cmp') {
                    td.innerText = `${Number(filterBuys[buy][valor]).toFixed(2)} Bs`;
                    tr.appendChild(td);
                } else {
                    td.innerText = filterBuys[buy][valor];
                    tr.appendChild(td);
                }
            }
            let td = document.createElement('td');

            if (filterBuys[buy]['estado_cmp'] == '0') {
                if (localStorage.getItem('rol_usua') == 'Gerente general' || localStorage.getItem('rol_usua') == 'Administrador') {
                    td.innerHTML = `
                <img src='../imagenes/receipt.svg' onclick='showproductsAddBuyMW(this.parentNode.parentNode.children[0].innerText)' title='Añadir compra a inventario'>
                <img src='../imagenes/pdf.svg' onclick='selectPDFInformation(this.parentNode.parentNode.children[0].innerText)' title='Imprimir orden de compra'>
                <img src='../imagenes/trash.svg' onclick='deleteBuy(this.parentNode.parentNode.children[0].innerText)' title='Eliminar compra'>`;
                } else {
                    td.innerHTML = `
                <img src='../imagenes/receipt.svg' onclick='showproductsAddBuyMW(this.parentNode.parentNode.children[0].innerText)' title='Añadir compra a inventario'>
                <img src='../imagenes/pdf.svg' onclick='selectPDFInformation(this.parentNode.parentNode.children[0].innerText)' title='Imprimir orden de compra'>`;
                }
            } else {
                td.innerHTML = `
                    <img src='../imagenes/pdf.svg' onclick='selectPDFInformation(this.parentNode.parentNode.children[0].innerText)' title='Imprimir orden de compra'>`;
            }
            tr.appendChild(td);
            tbody.appendChild(tr);
        } else {
            i++;
        }
    }
}
//<<-------------------------------------------CRUD DE COMPRAS-------------------------------------------->>
//-------Create buy
let formBuyR = document.getElementById('formBuyR');
async function createBuy() {
    let products = document.querySelectorAll('#cmp_prodRMW div.modal__body div.cart__item');
    if (products.length > 0) {
        let array = [];
        products.forEach(producto => {
            let object = {
                'fk_id_prod_cppd': producto.children[0].value,
                'descripcion_cppd': producto.children[2].value,
                'cantidad_cppd': producto.children[3].value,
                'cost_uni_cppd': producto.children[4].value
            };
            array.push(object);
        });
        if (confirm('¿Esta usted seguro?')) {
            if (rqstBuy == false) {
                rqstBuy = true;
                let formData = new FormData(formBuyR);
                formData.append('createBuy', JSON.stringify(array));
                formData.append('id_usua', localStorage.getItem('id_usua'));
                formData.set('fecha_cmpR', `${dateActual[2]}-${dateActual[1]}-${dateActual[0]}`);
                preloader.classList.add('modal__show');
                fetch('../controladores/compras.php', {
                    method: "POST",
                    body: formData
                }).then(response => response.text()).then(data => {
                    Promise.all([readBuys(), readCmp_prods()]).then(() => {
                        cleanFormBuyR();
                        buyRMW.classList.remove('modal__show');
                        cmp_prodRMW.classList.remove('modal__show');
                        totalPriceCPPDR();
                        preloader.classList.remove('modal__show');
                        rqstBuy = false;
                        mostrarAlerta(data);
                    });
                }).catch(err => {
                    rqstBuy = false;
                    mostrarAlerta(err);
                });
            }
        }
    } else {
        mostrarAlerta('No a seleccionado ningun producto');
    }
}
//------Delete buy
function deleteBuy(id_cmp) {
    if (confirm('¿Esta usted seguro?')) {
        if (rqstBuy == false) {
            rqstBuy = true;
            preloader.classList.add('modal__show');
            let formData = new FormData();
            formData.append('deleteBuy', id_cmp);
            fetch('../controladores/compras.php', {
                method: "POST",
                body: formData
            }).then(response => response.text()).then(data => {
                Promise.all([readBuys(), readCmp_prods()]).then(() => {
                    rqstBuy = false;
                    preloader.classList.remove('modal__show');
                    mostrarAlerta(data);
                })
            }).catch(err => {
                rqstBuy = false;
                mostrarAlerta(err);
            });
        }
    }
}
//------Estado de compra
async function changeStateBuy(divs) {
    const divshihijos = divs.children;
    const cantidadDivsHijos = Array.prototype.filter.call(divshihijos, hijo => hijo.tagName === 'DIV').length;
    if (cantidadDivsHijos > 0) {
        id_cmp = divs.children[0].children[2].value;
        const product = cmp_prods.filter(cmp_prod => cmp_prod.fk_id_cmp_cppd == id_cmp);
        const productRecibidos = product.filter(obj => obj.estado_cppd === "RECIBIDO");
        if (product.length == productRecibidos.length) {
            if (rqstBuy == false) {
                rqstBuy = true;
                preloader.classList.add('modal__show');
                let formData = new FormData();
                formData.append('changeStateBuy', id_cmp);
                fetch('../controladores/compras.php', {
                    method: "POST",
                    body: formData
                }).then(response => response.text()).then(data => {
                    readBuys().then(() => {
                        preloader.classList.remove('modal__show');
                        rqstBuy = false;
                        document.getElementById('productBuyMW').classList.remove('modal__show');
                        mostrarAlerta(data);
                    })
                }).catch(err => {
                    rqstBuy = false;
                    mostrarAlerta(err);
                });
            }
        } else {
            mostrarAlerta('Falta registrar productos');
        }
    } else {
        mostrarAlerta('La nota de entrega no tiene ningun producto');
    }
}
function cleanFormBuyR() {
    document.querySelector('#cmp_prodRMW .modal__body').innerHTML = '';
    document.getElementsByName('forma_pago_cmpR')[0].value = '';
    document.getElementsByName('tpo_entrega_cmpR')[0].value = '';
    document.getElementsByName('total_cmpR')[0].value = '0';
    document.getElementsByName('tipo_cambio_cmpR')[0].value = '';
    document.getElementsByName('observacion_cmpR')[0].value = '';
    quantityCPRMW.innerHTML = '0';
    subTotalCPRMW.innerHTML = 'Sub-Total (Bs):';
    descCPRMW.innerHTML = 'Desc. (Bs):';
    totalCPRMW.innerHTML = 'Total (Bs):';

}
//------Open and close buyR
const closeBuyRMW = document.getElementById('closeBuyRMW');
const openBuyRMW = document.getElementById('openBuyRMW');
openBuyRMW.addEventListener('click', () => {
    buyRMW.classList.add('modal__show');
    document.getElementsByName('fecha_cmpR')[0].value = `${dateActual[2]}-${dateActual[1]}-${dateActual[0]}`;
    formBuy = 'R';
});
closeBuyRMW.addEventListener('click', () => {
    buyRMW.classList.remove('modal__show');
});
/*---------------------------------------------------------------------------------------------*/
//------------PDF of buys
function selectPDFInformation(id_cmp) {
    for (let buy in buys) {
        if (buys[buy]['id_cmp'] == id_cmp) {
            let array = [];
            for (let cmp_prod in cmp_prods) {
                if (cmp_prods[cmp_prod]['fk_id_cmp_cppd'] == id_cmp) {
                    let object = {
                        'id_cppd': cmp_prods[cmp_prod]['id_cppd'],
                        'fk_id_cmp_cppd': cmp_prods[cmp_prod]['fk_id_cmp_cppd'],
                        'fk_id_prod_cppd': cmp_prods[cmp_prod]['fk_id_prod_cppd'],
                        'codigo_prod': cmp_prods[cmp_prod]['codigo_prod'],
                        'descripcion_cppd': cmp_prods[cmp_prod]['descripcion_cppd'],
                        'cantidad_cppd': cmp_prods[cmp_prod]['cantidad_cppd'],
                        'cost_uni_cppd': cmp_prods[cmp_prod]['cost_uni_cppd']
                    }
                    array.push(object);
                }
            }
            showPDF(buys[buy], array, 'oc');
            break;
        }
    }
}
function showPDF(buy, array, pdf) {
    // Crea un formulario oculto
    var form = document.createElement('form');
    form.method = 'post';
    form.action = '../modelos/reportes/ordenDeCompra.php';
    form.target = '_blank'; // Abre la página en una nueva ventana
    form.style.display = 'none'; // Oculta visualmente el formulario
    // Crea un campo oculto para la variable prof_mprof_ne
    var input1 = document.createElement('input');
    input1.type = 'hidden';
    input1.name = 'prof_mprof_ne';
    input1.value = JSON.stringify(buy); // Reemplaza con el valor real

    // Crea un campo oculto para la variable pf_pd
    var input2 = document.createElement('input');
    input2.type = 'hidden';
    input2.name = 'pf_pd';
    input2.value = JSON.stringify(array); // Reemplaza con el valor real

    // Crea un campo oculto para la variable pdf
    var input3 = document.createElement('input');
    input3.type = 'hidden';
    input3.name = 'pdf';
    input3.value = pdf; // Reemplaza con el valor real

    // Crea un campo oculto para la variable pdf
    var input4 = document.createElement('input');
    input4.type = 'hidden';
    input4.name = 'id_usua';
    input4.value = localStorage.getItem('id_usua'); // Reemplaza con el valor real

    // Agrega los campos al formulario
    form.appendChild(input1);
    form.appendChild(input2);
    form.appendChild(input3);
    form.appendChild(input4);
    // Agrega el formulario al cuerpo del documento HTML
    document.body.appendChild(form);
    // Submitir el formulario
    form.submit();

}
//------------------------------Campos obligatorios para registrar compra---------------------------
spaceRequiretBuyR();
function spaceRequiretBuyR() {
    const tipo_cambio_cmpR = document.getElementsByName('tipo_cambio_cmpR')[0];
    tipo_cambio_cmpR.addEventListener('input', function () {
        const valor = this.value;
        const regex = /^[0-9]+(\.[0-9]{1,2})?$/;
        if (!regex.test(valor)) {
            this.value = valor.replace(/[^0-9\.]/g, '');
        }
    });
}
const closeProductBuyMW = document.getElementById('closeProductBuyMW');
closeProductBuyMW.addEventListener('click', (e) => {
    productBuyMW.classList.remove('modal__show');
});
//------------------------------------------CRUD COMPRAS--------------------------------------------------
//--------read Cmp_prods
let cmp_prods = [];
let filterCmp_prods;
async function readCmp_prods() {
    return new Promise((resolve, reject) => {
        let formData = new FormData();
        formData.append('readCmp_prods', '');
        fetch('../controladores/compras.php', {
            method: "POST",
            body: formData
        }).then(response => response.json()).then(data => {
            cmp_prods = Object.values(data);
            filterCmp_prods = cmp_prods;
            createSelectDateProcOC()
            paginacionProdOC(cmp_prods.length, 1);
            resolve();
        }).catch(err => console.log(err));
    })
}
//----Create Cmp_prod
async function createCmp_prod(row) {
    if (rqstBuy == false) {
        rqstBuy = true;
        preloader.classList.add('modal__show');
        let object = {
            'fk_id_cmp_cppd': row.children[2].value,
            'fk_id_prod_cppd': row.children[1].value,
            'descripcion_cppd': row.children[6].value,
            'cantidad_cppd': row.children[7].value,
            'cost_uni_cppd': row.children[8].value,
        }
        let formData = new FormData();
        formData.append('createCmp_prod', JSON.stringify(object));
        fetch('../controladores/compras.php', {
            method: "POST",
            body: formData
        }).then(response => response.text()).then(data => {
            Promise.all([readBuys(), readCmp_prods()]).then(() => {
                rqstBuy = false;
                preloader.classList.remove('modal__show');
                showproductsAddBuyMW(data);
            })
        }).catch(err => {
            mostrarAlerta(err);
        });
    }
}
const formAddBuy = document.getElementById('formAddBuy');
formAddBuy.addEventListener('submit', updateCmp_prod);
//----Update Cmp_prod
async function updateCmp_prod() {
    event.preventDefault();
    if (rqstBuy == false) {
        if (confirm('Se añadirá el producto a el inventario. ¿Esta usted seguro?')) {
            rqstBuy = true;
            preloader.classList.add('modal__show');
            let formData = new FormData(formAddBuy);
            formData.append('addBuyToInventory', '');
            //formData.set("fecha_entrega_cppd", `${dateActual[2]}-${dateActual[1]}-${dateActual[0]} ${datePart[1]}`);
            fetch('../controladores/compras.php', {
                method: "POST",
                body: formData
            }).then(response => response.text()).then(data => {
                Promise.all([readBuys(), readCmp_prods()]).then(() => {
                    rqstBuy = false;
                    formAddBuy.reset();
                    addBuyMW.classList.remove('modal__show');
                    showproductsAddBuyMW(data);
                    preloader.classList.remove('modal__show');
                })
            }).catch(err => {
                mostrarAlerta(err);
            });
        }
    }
}
//-----Delete CMP_PRODS
async function deleteCmp_prod(id_cppd) {
    if (confirm('¿Esta usted seguro de eliminar el producto?')) {
        if (rqstBuy == false) {
            rqstBuy = true;
            let cmp_prod = cmp_prods.find(cmp_prod => cmp_prod.id_cppd == id_cppd);
            preloader.classList.add('modal__show');
            let formData = new FormData();
            formData.append('deleteCmp_prod', JSON.stringify(cmp_prod));
            fetch('../controladores/compras.php', {
                method: "POST",
                body: formData
            }).then(response => response.text()).then(data => {
                Promise.all([readBuys(), readCmp_prods()]).then(() => {
                    rqstBuy = false;
                    preloader.classList.remove('modal__show');
                    showproductsAddBuyMW(data);
                })
            }).catch(err => {
                mostrarAlerta(err);
            });
        }
    }
}
//------show products to buy
function showproductsAddBuyMW(id_cmp) {
    formBuy = id_cmp;
    document.getElementById('productBuyMW').classList.add('modal__show');
    let body = document.getElementById('productBuyMW').querySelector('.modal__body');
    body.innerHTML = '';
    let i = 0;
    for (let cmp_prod in cmp_prods) {
        if (cmp_prods[cmp_prod]['fk_id_cmp_cppd'] == id_cmp) {
            let div = document.createElement('div');
            div.classList.add('cart__item');
            div.innerHTML = `
            <input type="hidden" value="${cmp_prods[cmp_prod]['id_cppd']}">
            <input type="hidden" value="${cmp_prods[cmp_prod]['fk_id_prod_cppd']}">
            <input type="hidden" value="${cmp_prods[cmp_prod]['fk_id_cmp_cppd']}">
            <p class="numero--addProd">${++i}</p>
            <img src="../modelos/imagenes/${cmp_prods[cmp_prod]['imagen_prod']}" alt="" class="imagen--addProd"/>
            <p class="codigo--addProd">${cmp_prods[cmp_prod]['codigo_prod']}</p>
            <textarea class="cart__item--name">${cmp_prods[cmp_prod]['descripcion_cppd']}</textarea>
            <input type="number" value = "${cmp_prods[cmp_prod]['cantidad_cppd']}" min="1" onChange="changeQuantityCPPD(this.parentNode, ${id_cmp})" class="cart__item--quantity">
            <input type="number" value = "${cmp_prods[cmp_prod]['cost_uni_cppd']}" onChange="changeQuantityCPPD(this.parentNode, ${id_cmp})" class="cart__item--costUnit">
            <input type="number" value = "${Number(cmp_prods[cmp_prod]['cost_uni_cppd'] * cmp_prods[cmp_prod]['cantidad_cppd']).toFixed(2)}" class="cart__item--costTotal" readonly>
            <input type="number" value="${cmp_prods[cmp_prod]['factura_cppd']}" class="cart__item--factura" readonly>`;
            if (cmp_prods[cmp_prod]['estado_cppd'] == 'PENDIENTE') {
                let img = document.createElement('img');
                img.classList.add('icon__CRUD');
                img.src = '../imagenes/cartAdd.svg';
                img.setAttribute('onclick', 'openProductBuyMW(this.parentNode)');
                img.setAttribute('title', 'Agregar producto');
                div.appendChild(img);
                let img2 = document.createElement('img');
                img2.classList.add('icon__CRUD');
                img2.src = '../imagenes/trash.svg';
                img2.setAttribute('title', 'Eliminar producto');
                img2.setAttribute('onclick', 'deleteCmp_prod(this.parentNode.children[0].value)');
                div.appendChild(img2);
            } else if (cmp_prods[cmp_prod]['estado_cppd'] == 'RECIBIDO') {
                let img = document.createElement('img');
                img.src = '../imagenes/checkCircle.svg';
                img.setAttribute('title', 'Producto agregado');
                div.appendChild(img);
                let img2 = document.createElement('img');
                img2.classList.add('icon__CRUD');
                img2.src = '../imagenes/edit.svg';
                img2.setAttribute('title', 'Editar factura');
                img2.setAttribute('onclick', 'openEditFactura(this.parentNode.children[0].value)');
                div.appendChild(img2);
            }
            body.appendChild(div);
        }
    }
    let divs = document.querySelectorAll('#productBuyMW div.modal__body div.cart__item');
    const quantityaddBuyMW = document.getElementById('quantityaddBuyMW');
    const subTotaladdBuyMW = document.getElementById('subTotaladdBuyMW');
    const descaddBuyMW = document.getElementById('descaddBuyMW');
    const totaladdBuyMW = document.getElementById('totaladdBuyMW');
    let total = 0;
    let desc = 0;
    divs.forEach(div => {
        costo_uni = Number(div.children[9].value);
        total = total + costo_uni;
    })
    let ordenCompra = filterBuys.find(cmp_prod => cmp_prod.id_cmp == id_cmp);
    subTotaladdBuyMW.innerHTML = 'Sub-Total (Bs): ' + total.toFixed(2) + ' Bs';
    desc = Number(ordenCompra.descuento_cmp) * total / 100;
    desc = desc.toFixed(2);
    descaddBuyMW.innerHTML = `Desc. ${ordenCompra.descuento_cmp}% (Bs): ${desc} Bs`;
    totaladdBuyMW.innerHTML = `Total (Bs): ${Number(total.toFixed(2) - desc).toFixed(2)} Bs`;
    document.getElementsByName('total_cmpR')[0].value = Number(total.toFixed(2) - desc).toFixed(2);
    quantityaddBuyMW.innerHTML = divs.length;
}
function openProductBuyMW(row) {
    id_cppd = row.children[0].value;
    addBuyMW.classList.add('modal__show');
    document.getElementsByName('id_cppd')[0].value = row.children[0].value;
    document.getElementsByName('fk_id_prod_cppd')[0].value = row.children[1].value;
    document.getElementsByName('fk_id_cmp_cppd')[0].value = row.children[2].value;
    document.getElementsByName('fecha_entrega_cppd')[0].value = `${dateActual[2]}-${dateActual[1]}-${dateActual[0]}`;
    document.getElementsByName('fecha_factura_cppd')[0].value = `${dateActual[2]}-${dateActual[1]}-${dateActual[0]}`;
    document.getElementsByName('codigo_cppd')[0].value = row.children[5].innerText;
    document.getElementsByName('cantidad_cppd')[0].value = row.children[7].value;
    document.getElementsByName('cost_uni_cppd')[0].value = row.children[8].value + ' Bs';
}
function changeQuantityCPPD(row, id_cmp) {
    let cantidad_prod = row.children[7].value;
    let costo_uni = row.children[8].value;
    let cost_uni_total = cantidad_prod * costo_uni;
    row.children[9].value = cost_uni_total.toFixed(2);
    totalPriceCPPD(id_cmp);
}
function totalPriceCPPD(id_cmp) {
    let divs = document.querySelectorAll('#productBuyMW div.modal__body div.cart__item');
    let quantityCPMMW = document.getElementById('quantityaddBuyMW');
    let subTotalCPMMW = document.getElementById('subTotaladdBuyMW');
    let descCPMMW = document.getElementById('descaddBuyMW');
    let totalCPMMW = document.getElementById('totaladdBuyMW');
    let total = 0;
    let desc = 0;
    divs.forEach(div => {
        costo_total = Number(div.children[9].value);
        total = total + costo_total;
    })
    let ordenCompra = filterBuys.find(cmp_prod => cmp_prod.id_cmp == id_cmp);
    subTotalCPMMW.innerHTML = 'Sub-Total (Bs): ' + total.toFixed(2) + ' Bs';
    desc = Number(ordenCompra.descuento_cmp) * total / 100;
    desc = desc.toFixed(2);
    descCPMMW.innerHTML = `Desc. ${ordenCompra.descuento_cmp}% (Bs): ${desc} Bs`;
    totalCPMMW.innerHTML = `Total (Bs): ${Number(total.toFixed(2) - desc).toFixed(2)} Bs`;
    quantityCPMMW.innerHTML = divs.length;
}
//-------------------------------EDITAR EL NUMERO DE FACTURA---------------------------------------------
const editFactura = document.getElementById('editFactura');
const closeEditFactura = document.getElementById('closeEditFactura');
closeEditFactura.addEventListener('click', (e) => {
    editFactura.classList.remove('modal__show');
})
function openEditFactura(id_cppd) {
    editFactura.classList.add('modal__show');
    document.getElementsByName('id_cppd2')[0].value = id_cppd;
    const editProd = cmp_prods.find(cmp_prod => cmp_prod.id_cppd == id_cppd);
    document.getElementsByName('fecha_entrega_cppd2')[0].value = editProd.fecha_entrega_cppd;
    document.getElementsByName('fecha_factura_cppd2')[0].value = editProd.fecha_factura_cppd;
    document.getElementsByName('factura_cppd2')[0].value = editProd.factura_cppd;
}
const formEditFactura = document.getElementById('formEditFactura');
formEditFactura.addEventListener('submit', editFacturaCompra)
async function editFacturaCompra() {
    event.preventDefault();
    if (rqstBuy == false) {
        rqstBuy = true;
        preloader.classList.add('modal__show');
        let formData = new FormData(formEditFactura);
        formData.append('editFactura', '');
        fetch('../controladores/compras.php', {
            method: "POST",
            body: formData
        }).then(response => response.json()).then(data => {
            Promise.all([readBuys(), readCmp_prods()]).then(() => {
                rqstBuy = false;
                formEditFactura.reset();
                addBuyMW.classList.remove('modal__show');
                editFactura.classList.remove('modal__show');
                showproductsAddBuyMW(data);
                preloader.classList.remove('modal__show');
            })
        })
    }
}
//------------------------------MODAL ADD BUY TO INVETORY-----------------------------------------------------
const addBuyMW = document.getElementById('addBuyMW');
const closeAddBuyMW = document.getElementById('closeAddBuyMW');
closeAddBuyMW.addEventListener('click', (e) => {
    addBuyMW.classList.remove('modal__show');
});
//<<-------------------------------------MODAL DE PRODUCTS PARA COMPRAR-------------------------------------------->>
const closeCmp_prodRMW = document.getElementById('closeCmp_prodRMW');
const cmp_prodRMW = document.getElementById('cmp_prodRMW');
function openCmp_prodRMW() {
    cmp_prodRMW.classList.add('modal__show');
}
closeCmp_prodRMW.addEventListener('click', (e) => {
    cmp_prodRMW.classList.remove('modal__show');
});
//------------------------------------------------TABLA MODAL PRODUCTS--------------------------------------------------
let products = [];
filterProductsMW = [];
async function readProducts() {
    return new Promise((resolve, reject) => {
        let formData = new FormData();
        formData.append('readProducts', '');
        fetch('../controladores/productos.php', {
            method: "POST",
            body: formData
        }).then(response => response.json()).then(data => {
            products = Object.values(data);
            filterProductsMW = products;
            paginacionProductMW(products.length, 1);
            resolve();
        }).catch(err => console.log(err));
    })
}
//------Select utilizado para buscar por columnas
const selectSearchProdMW = document.getElementById('selectSearchProdMW');
selectSearchProdMW.addEventListener('change', searchProductsMW);
//------buscar por input
const inputSearchProdMW = document.getElementById("inputSearchProdMW");
inputSearchProdMW.addEventListener("keyup", searchProductsMW);
//------Clientes por pagina
const selectNumberProdMW = document.getElementById('selectNumberProdMW');
selectNumberProdMW.selectedIndex = 3;
selectNumberProdMW.addEventListener('change', function () {
    paginacionProductMW(filterProductsMW.length, 1);
});
//-------Marca y categoria
const selectMarcaProdMW = document.getElementById('selectMarcaProdMW');
selectMarcaProdMW.addEventListener('change', selectCategoriaProductMW);
const selectCategoriaProdMW = document.getElementById('selectCategoriaProdMW');
selectCategoriaProdMW.addEventListener('change', searchProductsMW);
//------buscar por:
function searchProductsMW() {
    const valor = selectSearchProdMW.value;
    const busqueda = inputSearchProdMW.value.toLowerCase().trim();
    filterProductsMW = products.filter(product => {
        if (valor === 'todas') {
            return (
                product.codigo_prod.toLowerCase().includes(busqueda) ||
                product.nombre_prod.toLowerCase().includes(busqueda) ||
                product.descripcion_prod.toLowerCase().includes(busqueda)
            );
        } else {
            return product[valor].toLowerCase().includes(busqueda);
        }
    });
    selectProductsMW();
}
//------buscar por marca y categoria:
function selectProductsMW() {
    if (selectMarcaProdMW.value == 'todasLasMarcas' && selectCategoriaProdMW.value == 'todasLasCategorias') {
        paginacionProductMW(filterProductsMW.length, 1);
    } else {
        filterProductsMW = filterProductsMW.filter(product => {
            if (selectMarcaProdMW.value == 'todasLasMarcas') {
                return product['id_ctgr'] == selectCategoriaProdMW.value;
            } else if (selectCategoriaProdMW.value == 'todasLasCategorias') {
                return product['id_mrc'] == selectMarcaProdMW.value;
            } else {
                return product['id_ctgr'] == selectCategoriaProdMW.value && product['id_mrc'] == selectMarcaProdMW.value;
            }
        });
        paginacionProductMW(filterProductsMW.length, 1);
    }
}
//------Ordenar tabla descendente ascendente
let orderProducts = document.querySelectorAll('.tbody__head--ProdMW');
orderProducts.forEach(div => {
    div.children[0].addEventListener('click', function () {
        const valor = div.children[0].name;
        filterProductsMW.sort((a, b) => a[valor].localeCompare(b[valor]));
        paginacionProductMW(filterProductsMW.length, 1);
    });
    div.children[1].addEventListener('click', function () {
        const valor = div.children[0].name;
        filterProductsMW.sort((a, b) => b[valor].localeCompare(a[valor]));
        paginacionProductMW(filterProductsMW.length, 1);
    });
})
//------PaginacionProductMW
function paginacionProductMW(allProducts, page) {
    let numberProducts = Number(selectNumberProdMW.value);
    let allPages = Math.ceil(allProducts / numberProducts);
    let ul = document.querySelector('#wrapperProductMW ul');
    let li = '';
    let beforePages = page - 1;
    let afterPages = page + 1;
    let liActive;
    if (page > 1) {
        li += `<li class="btn" onclick="paginacionProductMW(${allProducts}, ${page - 1})"><img src="../imagenes/arowLeft.svg"></li>`;
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
        li += `<li class="numb ${liActive}" onclick="paginacionProductMW(${allProducts}, ${pageLength})"><span>${pageLength}</span></li>`;
    }
    if (page < allPages) {
        li += `<li class="btn" onclick="paginacionProductMW(${allProducts}, ${page + 1})"><img src="../imagenes/arowRight.svg"></li>`;
    }
    ul.innerHTML = li;
    let h2 = document.querySelector('#showPageProductMW h2');
    h2.innerHTML = `Pagina ${page}/${allPages}, ${allProducts} Productos`;
    tableProductsMW(page);
}
//------Crear la tabla
function tableProductsMW(page) {
    let tbody = document.getElementById('tbodyProductMW');
    inicio = (page - 1) * Number(selectNumberProdMW.value);
    final = inicio + Number(selectNumberProdMW.value);
    i = 1;
    tbody.innerHTML = '';
    for (let product in filterProductsMW) {
        if (i > inicio && i <= final) {
            let tr = document.createElement('tr');
            for (let valor in filterProductsMW[product]) {
                let td = document.createElement('td');
                if (valor == 'id_prod') {
                    td.innerText = filterProductsMW[product][valor];
                    td.setAttribute('hidden', '');
                    tr.appendChild(td);
                    td = document.createElement('td');
                    td.innerText = i;
                    tr.appendChild(td);
                    i++;
                } else if (valor == 'codigo_smc_prod' || valor == 'id_mrc' || valor == 'id_ctgr' || valor == 'catalogo_prod') {
                } else if (valor == 'imagen_prod') {
                    let img = document.createElement('img');
                    img.classList.add('tbody__img');
                    img.setAttribute('src', '../modelos/imagenes/' + filterProductsMW[product][valor]);
                    td.appendChild(img);
                    tr.appendChild(td);
                } else {
                    td.innerText = filterProductsMW[product][valor];
                    tr.appendChild(td);
                }
            }
            let td = document.createElement('td');
            td.innerHTML = `
            <img src='../imagenes/edit.svg' onclick='readProduct(this.parentNode.parentNode)' title='Editar producto'>
            <img src='../imagenes/send.svg' onclick='sendProduct(this.parentNode.parentNode)' title='Seleccionar producto'>`;
            tr.appendChild(td);
            tbody.appendChild(tr);
        } else {
            i++;
        }
    }
}
function sendProduct(tr) {
    let id_prod = tr.children[0].innerText;
    for (let product in filterProductsMW) {
        if (filterProductsMW[product]['id_prod'] == id_prod) {
            let cart__items = '';
            let i = 0;
            if (formBuy == 'R') {

                cart__items = document.querySelectorAll(`#cmp_prod${formBuy}MW div.modal__body div.cart__item`);
                if (cart__items.length > 0) {
                    cart__items.forEach(prod => {
                        let id_prod = prod.children[0].value;
                        if (id_prod == filterProductsMW[product]['id_prod']) {
                            i++;
                        }
                    })
                }
            } else if (formBuy != 'R') {
                /*
                cart__items = document.querySelectorAll(`#productBuyMW div.modal__body div.cart__item`);
                if (cart__items.length > 0) {
                    cart__items.forEach(prod => {
                        let id_prod = prod.children[1].value;
                        if (id_prod == filterProductsMW[product]['id_prod']) {
                            i++;
                        }
                    })
                }*/
            }
            if (i == 0) {
                let inventario = inventories.find(inventory => inventory.fk_id_prod_inv == filterProductsMW[product]['id_prod']);
                if (inventario != undefined) {
                    //Añadir ivnetario.cost_uni_inv a el objeto filterProductsMW[product]
                    filterProductsMW[product]['cost_uni_inv'] = inventario['cost_uni_inv'];
                } else {
                    filterProductsMW[product]['cost_uni_inv'] = 0;
                }
                if (formBuy == 'R') {
                    cartProduct_cppdR(filterProductsMW[product]);
                } else if (formBuy != 'R') {
                    cartProduct_cppdM(filterProductsMW[product], formBuy);
                }
            } else {
                mostrarAlerta("El producto ya se encuentra en la lista");
            }
        }
    }
}
const cmpProdRMW = document.querySelector('#cmp_prodRMW div.modal__body');
function cartProduct_cppdR(product) {
    let item = document.createElement('div');
    item.classList.add('cart__item');
    let html =
        `<input type="hidden"  value = "${product['id_prod']}" class="cart__item--id">
        <input type="text" value = "${product['codigo_prod']}" class="cart__item--code">
        <textarea class="cart__item--name">${product['nombre_prod']}</textarea>
        <input type="number" value = "1" min="1" onChange="changeQuantityCPPDR(this.parentNode)" class="cart__item--quantity">
        <input type="number" value = "${product['cost_uni_inv']}" onChange="changeQuantityCPPDR(this.parentNode)" class="cart__item--costUnit">
        <input type="number" value = "${product['cost_uni_inv']}" class="cart__item--costTotal" readonly>
        <img src="../imagenes/trash.svg" onClick="removeCartR(this.parentNode)" class='icon__CRUD'>`;
    item.innerHTML = html;
    cmpProdRMW.appendChild(item);
    totalPriceCPPDR();
}
function cartProduct_cppdM(product, id_cmp) {
    let body = document.getElementById('productBuyMW').querySelector('.modal__body');
    let div = document.createElement('div');
    div.classList.add('cart__item');
    div.innerHTML = `
            <input type="hidden" value="">
            <input type="hidden" value="${product['id_prod']}">
            <input type="hidden" value="${id_cmp}">
            <p class="numero--addProd"> - </p>
            <img src="../modelos/imagenes/${product['imagen_prod']}" alt="" class="imagen--addProd"/>
            <p class="codigo--addProd">${product['codigo_prod']}</p>
            <textarea class="cart__item--name">${product['nombre_prod']}</textarea>
            <input type="number" value = "1" min="1" onChange="changeQuantityCPPD(this.parentNode, ${id_cmp})" class="cart__item--quantity">
            <input type="number" value = "${product['cost_uni_inv']}" onChange="changeQuantityCPPD(this.parentNode, ${id_cmp})" class="cart__item--costUnit">
            <input type="number" value = "${product['cost_uni_inv']}" class="cart__item--costTotal" readonly>
            <img src="../imagenes/plus.svg" onClick="createCmp_prod(this.parentNode)" class='icon__CRUD'>`;
    body.appendChild(div);
}
//-------Eliminar producto 
function removeCartR(product) {
    let listProducts = document.querySelector('#cmp_prodRMW div.modal__body');
    listProducts.removeChild(product);
    totalPriceCPPDR();
}
//-------Cuando cambia la cantidad
function changeQuantityCPPDR(product) {
    let cantidad_prod = product.children[3].value;
    let costo_uni = product.children[4].value;
    let cost_uni_total = cantidad_prod * costo_uni;
    product.children[5].value = cost_uni_total.toFixed(2);
    totalPriceCPPDR();
}
const quantityCPRMW = document.getElementById('quantityCPRMW');
const subTotalCPRMW = document.getElementById('subTotalCPRMW');
const descCPRMW = document.getElementById('descCPRMW');
const totalCPRMW = document.getElementById('totalCPRMW');
function totalPriceCPPDR() {
    let divs = document.querySelectorAll('#cmp_prodRMW div.modal__body div.cart__item');
    let total = 0;
    let desc = 0;
    divs.forEach(div => {
        costo_uni = Number(div.children[5].value);
        total = total + costo_uni;
    })
    subTotalCPRMW.innerHTML = 'Sub-Total (Bs): ' + total.toFixed(2) + ' Bs';
    desc = document.getElementsByName('descuento_cmpR')[0].value * total / 100;
    desc = desc.toFixed(2);
    descCPRMW.innerHTML = `Desc. ${document.getElementsByName('descuento_cmpR')[0].value}% (Bs): ${desc} Bs`;
    totalCPRMW.innerHTML = `Total (Bs): ${Number(total.toFixed(2) - desc).toFixed(2)} Bs`;
    document.getElementsByName('total_cmpR')[0].value = Number(total.toFixed(2) - desc).toFixed(2);
    quantityCPRMW.innerHTML = divs.length;
}
//---------------------------VENTANA MODAL PARA BUSCAR PRODUCTOS
const productSMW = document.getElementById('productSMW');
const closeProductSMW = document.getElementById('closeProductSMW');
function openProductSMW() {
    productSMW.classList.add('modal__show');
}
closeProductSMW.addEventListener('click', () => {
    productSMW.classList.remove('modal__show');
});
/*----------------------------------------------Marca y categoria  modal product-------------------------------------------------*/
/*-----------------------------------------Marca y categoria producto-------------------------------------------------*/
//-------Read all Marcas
let marcas = {};
async function readAllMarcas() {
    return new Promise((resolve, reject) => {
        let formData = new FormData();
        formData.append('readMarcas', '');
        fetch('../controladores/productos.php', {
            method: "POST",
            body: formData
        }).then(response => response.json()).then(data => {
            marcas = data;
            selectMarcaProdR();
            selectMarcaProductMW();
            selectMarcaProdM();
            resolve();
        }).catch(err => console.log(err));
    })
}
//-------Read all categorias
let categorias = {};
async function readAllCategorias() {
    return new Promise((resolve, reject) => {
        let formData = new FormData();
        formData.append('readCategorias', '');
        fetch('../controladores/productos.php', {
            method: "POST",
            body: formData
        }).then(response => response.json()).then(data => {
            categorias = data;
            resolve();
        }).catch(err => console.log(err));
    })
}
/***************************MARCA Y CATEGORIA PARA FORMULARIO DE REGSITRO DE PRODUCTOS***************************/
const marca_prodR = document.getElementById('marca_prodR');
marca_prodR.addEventListener('change', selectCategoriaProdR);
const categoria_prodR = document.getElementById('categoria_prodR');
//-------Select de marcas registrar
function selectMarcaProdR() {
    marca_prodR.innerHTML = '';
    let option = document.createElement('option');
    option.value = 'todasLasMarcas';
    option.innerText = 'Todas las marcas';
    marca_prodR.appendChild(option);
    for (let clave in marcas) {
        let option = document.createElement('option');
        option.value = marcas[clave]['id_mrc'];
        option.innerText = marcas[clave]['nombre_mrc'];
        marca_prodR.appendChild(option);
    }
    selectCategoriaProdR();
}
function selectCategoriaProdR() {
    categoria_prodR.innerHTML = '';
    let option = document.createElement('option');
    option.value = 'todasLasCategorias';
    option.innerText = 'Todas las categorias';
    categoria_prodR.appendChild(option);
    if (marca_prodR.value != 'todasLasMarcas') {
        let id_mrc = marca_prodR.value;
        for (let clave in categorias) {
            if (categorias[clave]['id_mrc'] == id_mrc) {
                let option = document.createElement('option');
                option.value = categorias[clave]['id_ctgr'];
                option.innerText = categorias[clave]['nombre_ctgr'];
                categoria_prodR.appendChild(option);
            }
        }
    }
}
const marca_prodM = document.getElementById('marca_prodM');
marca_prodM.addEventListener('change', selectCategoriaProdM);
const categoria_prodM = document.getElementById('categoria_prodM');
//-------Select de marcas registrar
function selectMarcaProdM() {
    marca_prodM.innerHTML = '';
    let option = document.createElement('option');
    option.value = 'todasLasMarcas';
    option.innerText = 'Todas las marcas';
    marca_prodM.appendChild(option);
    for (let clave in marcas) {
        let option = document.createElement('option');
        option.value = marcas[clave]['id_mrc'];
        option.innerText = marcas[clave]['nombre_mrc'];
        marca_prodM.appendChild(option);
    }
    selectCategoriaProdM();
}
function selectCategoriaProdM() {
    categoria_prodM.innerHTML = '';
    let option = document.createElement('option');
    option.value = 'todasLasCategorias';
    option.innerText = 'Todas las categorias';
    categoria_prodM.appendChild(option);
    if (marca_prodM.value != 'todasLasMarcas') {
        let id_mrc = marca_prodM.value;
        for (let clave in categorias) {
            if (categorias[clave]['id_mrc'] == id_mrc) {
                let option = document.createElement('option');
                option.value = categorias[clave]['id_ctgr'];
                option.innerText = categorias[clave]['nombre_ctgr'];
                categoria_prodM.appendChild(option);
            }
        }
    }
}
//-------Select de marcas
function selectMarcaProductMW() {
    selectMarcaProdMW.innerHTML = '';
    let option = document.createElement('option');
    option.value = 'todasLasMarcas';
    option.innerText = 'Todas las marcas';
    selectMarcaProdMW.appendChild(option);
    for (let clave in marcas) {
        let option = document.createElement('option');
        option.value = marcas[clave]['id_mrc'];
        option.innerText = marcas[clave]['nombre_mrc'];
        selectMarcaProdMW.appendChild(option);
    }
}
//------Select categorias
function selectCategoriaProductMW() {
    selectCategoriaProdMW.innerHTML = '';
    let option = document.createElement('option');
    option.value = 'todasLasCategorias';
    option.innerText = 'Todas las categorias';
    selectCategoriaProdMW.appendChild(option);
    if (selectMarcaProdMW.value != 'todasLasMarcas') {
        let id_mrc = selectMarcaProdMW.value;
        for (let clave in categorias) {
            if (categorias[clave]['id_mrc'] == id_mrc) {
                let option = document.createElement('option');
                option.value = categorias[clave]['id_ctgr'];
                option.innerText = categorias[clave]['nombre_ctgr'];
                selectCategoriaProdMW.appendChild(option);
            }
        }
    }
    searchProductsMW();
}
//<<------------------------------------------CRUD DE PRODUCTS------------------------------------->>
//------Create un producto
document.getElementById("formProductsR").addEventListener("submit", createProduct);
function createProduct() {
    event.preventDefault();
    if (rqstBuy == false) {
        rqstBuy = true;
        if (marca_prodR.value == "todasLasMarcas") {
            mostrarAlerta("Debe seleccionar una marca");
        } else if (categoria_prodR.value == "todasLasCategorias") {
            mostrarAlerta("Debe seleccionar una categoria");
        } else {
            let form = document.getElementById("formProductsR");
            let formData = new FormData(form);
            formData.append('createProduct', '');
            preloader.classList.add('modal__show');
            fetch('../controladores/productos.php', {
                method: "POST",
                body: formData
            }).then(response => response.text()).then(data => {
                requestProducts = false;
                preloader.classList.remove('modal__show');
                if (data == "El codigo ya existe") {
                    mostrarAlerta(data);
                } else if (data == "El codigo SMC ya existe") {
                    mostrarAlerta(data);
                } else {
                    readProducts().then(() => {
                        mostrarAlerta("El producto fue creado con éxito");
                        productsRMW.classList.remove('modal__show');
                        divCodigoSMCR.setAttribute('hidden', '');
                        form.reset();
                    })
                }
            }).catch(err => {
                rqstBuy = false;
                mostrarAlerta(err);
            });
        }
    }
}
//------Leer un producto
function readProduct(tr) {
    cleanUpProductFormM();
    let id_prod = tr.children[0].innerText;
    for (let product in filterProductsMW) {
        if (filterProductsMW[product]['id_prod'] == id_prod) {
            for (let valor in filterProductsMW[product]) {
                if (valor == 'imagen_prod') {
                    document.querySelector('.drop__areaM').setAttribute('style', `background-image: url("../modelos/imagenes/${filterProductsMW[product][valor]}"); background-size: cover;`);
                } else if (valor == 'codigo_smc_prod') {
                    if (filterProductsMW[product]['id_mrc'] == '15') {
                        divCodigoSMCM.removeAttribute('hidden');
                        document.getElementsByName(valor + 'M')[0].value = filterProductsMW[product][valor];
                    }
                } else if (valor == 'id_ctgr') {
                } else if (valor == 'id_mrc') {
                } else if (valor == 'marca_prod') {
                    document.getElementsByName(valor + 'M')[0].value = filterProductsMW[product]['id_mrc'];
                } else if (valor == 'categoria_prod') {
                    selectCategoriaProdM();
                    document.getElementsByName(valor + 'M')[0].value = filterProductsMW[product]['id_ctgr'];
                } else {
                    document.getElementsByName(valor + 'M')[0].value = filterProductsMW[product][valor];
                }
            }
            break;
        }
    }
    productsMMW.classList.add('modal__show');
}
//-------Update un producto
document.getElementById("formProductsM").addEventListener("submit", updateProduct);
function updateProduct() {
    event.preventDefault();
    if (rqstBuy == false) {
        rqstBuy = true;
        if (marca_prodM.value == "todasLasMarcas") {
            mostrarAlerta("Debe seleccionar una marca");
        } else if (categoria_prodM.value == "todasLasCategorias") {
            mostrarAlerta("Debe seleccionar una categoria");
        } else {
            let form = document.getElementById("formProductsM");
            let formData = new FormData(form);
            formData.append('updateProduct', '');
            preloader.classList.add('modal__show');
            fetch('../controladores/productos.php', {
                method: "POST",
                body: formData
            }).then(response => response.text()).then(data => {
                preloader.classList.remove('modal__show');
                requestProducts = false;
                if (data == "El codigo ya existe") {
                    mostrarAlerta(data);
                } else if (data == 'El codigo SMC ya existe') {
                    mostrarAlerta(data);
                } else {
                    readProducts().then(() => {
                        productsMMW.classList.remove('modal__show');
                        mostrarAlerta(data);
                    })
                }
            }).catch(err => {
                rqstBuy = false;
                mostrarAlerta(err);
            });
        }
    }
}
//---------------------------------VENTANA MODAL PARA REGISTRAR PRODUCTOS------------------------------>>
const productsRMW = document.getElementById('productsRMW');
const closeProductsRMW = document.getElementById('closeProductsRMW');
function openProductsRMW() {
    productsRMW.classList.add('modal__show');
}
closeProductsRMW.addEventListener('click', (e) => {
    productsRMW.classList.remove('modal__show');
});
const productsMMW = document.getElementById('productsMMW');
const closeProductsMMW = document.getElementById('closeProductsMMW');
closeProductsMMW.addEventListener('click', (e) => {
    productsMMW.classList.remove('modal__show');
});
//<<-----------------------------------------------------MUESTRA LA IMAGEN CARGADA------------------------------>>
const inputsFormProduct = document.querySelectorAll('.modalP__form .modalP__group input');
//<<----------------------------------MUESTRA LA IMAGEN CARGADA------------------------------>>
document.getElementById("imagen_prodR").addEventListener("change", mostrarimagenR);
//-------Muestra en un campo la imagen que se esta seleccionando para registrar
function mostrarimagenR() {
    let form = document.getElementById('formProductsR');
    //Seleccionar los elementos del form registrar antes de enviar el formulario
    let formData = new FormData(form);
    let imagen = formData.get('imagen_prodR');
    //URL.createObjectURL() crea un DOMString que contiene una URL que representa al objeto pasado como parámetro.
    let urlDeImagen = URL.createObjectURL(imagen);
    document.querySelector('.drop__areaR').setAttribute('style', `background-image: url("${urlDeImagen}"); background-size: cover;`);
}
//------Muestra en un campo la imagen que se esta seleccionado para modificar
function mostrarimagenM() {
    let form = document.getElementById('formProductsM');
    //Seleccionar los elementos del form registrar antes de enviar el formulario
    let formData = new FormData(form);
    let imagen = formData.get('imagen_prodM');
    //URL.createObjectURL() crea un DOMString que contiene una URL que representa al objeto pasado como parámetro.
    let urlDeImagen = URL.createObjectURL(imagen);
    document.querySelector('.drop__areaM').setAttribute('style', `background-image: url("${urlDeImagen}"); background-size: cover; background-position: center; background-repeat: no-repeat;`);
}
//<<--------------------------------------------------------CAMPOS DE LOS FORMULARIOS------------------------------->>
//------Vuelve oblogatorios los campos del formulario
function requiredInputProd() {
    inputsFormProduct.forEach(input => input.setAttribute("required", ""));
    //formulario registrar
    document.getElementsByName("imagen_prodR")[0].setAttribute('accept', "image/png, image/jpeg, image/jpg, image/gif");
    document.getElementsByName("descripcion_prodR")[0].setAttribute("required", "");
}
//<<-------------------------------------------------------ESPACIOS OBLIGATORIOS de formProductsR y formProductsM ------------------------------------------>>
inputsFormProduct.forEach(input => {
    input.setAttribute('required', '');
    document.getElementsByName("codigo_smc_prodR")[0].removeAttribute('required');
    document.getElementsByName("codigo_smc_prodM")[0].removeAttribute('required');
})
//------Limpia los campos del fomulario registrar
function cleanUpProductFormR() {
    inputsFormProduct.forEach(input => input.value = "");
    document.getElementsByName("descripcion_prodR")[0].value = "";
    document.getElementsByName("imagen_prodR")[0].value = "";
    document.querySelector('.drop__areaR').removeAttribute('style');
}
//------Limpia los campos del fomulario Modificar
function cleanUpProductFormM() {
    inputsFormProduct.forEach(input => input.value = "");
    document.getElementsByName("descripcion_prodM")[0].value = "";
    document.getElementsByName("imagen_prodM")[0].value = "";
    document.querySelector('.drop__areaM').removeAttribute('style');
    divCodigoSMCM.setAttribute('hidden', '');
}
//----------------------------------DRANG AND DROP-----------------------------------------------------
const dropAreaR = document.querySelector('.drop__areaR');
const dragTextR = dropAreaR.querySelector('h2');
const buttonR = dropAreaR.querySelector('button');
const inputR = dropAreaR.querySelector('#imagen_prodR');
let filesR;
buttonR.addEventListener('click', () => {
    //llamamos al evento click del inputR
    event.preventDefault();
    inputR.click();
})
/*Cuando tenemos elementos q se estan arraztrando se activa*/
dropAreaR.addEventListener('dragover', (e) => {
    //Se necesita poner el preventDefault
    e.preventDefault();
    dropAreaR.classList.add('active');
    dragTextR.textContent = 'Suelta para subir el archivo';
});
/*Cunado estemos arrastrando pero no estamos dentro de la zona*/
dropAreaR.addEventListener('dragleave', (e) => {
    //Se necesita poner el preventDefault
    e.preventDefault();
    dropAreaR.classList.remove('active');
    dragTextR.textContent = 'Arrastra y suelta la imágen';
});
/*Cuando soltamos el archivo q estamos arrastrando dentro de la zona*/
dropAreaR.addEventListener('drop', (e) => {
    //Se necesita poner el preventDefault para que al momento de soltar no abra la imagen en el navegador
    e.preventDefault();
    filesR = e.dataTransfer.files;
    showFiles();
    dropAreaR.classList.remove('active');
    dragTextR.textContent = 'Arrastra y suelta la imagen';
});
function showFiles() {
    for (let file of filesR) {
        processFile(file);
    }
}
function processFile(file) {
    let docType = file.type;
    let validExtensions = ['image/jpeg', 'image/jpg'];
    if (validExtensions.includes(docType)) {
        //archivo valido
        inputR.files = filesR;
        mostrarimagenR();
    } else {
        //archivo no valido
        mostrarAlerta('No es una archivo valido');
    }
}
const dropAreaM = document.querySelector('.drop__areaM');
const dragTextM = dropAreaM.querySelector('h2');
const buttonM = dropAreaM.querySelector('button');
const inputM = dropAreaM.querySelector('#imagen_prodM');
let filesM;
buttonM.addEventListener('click', () => {
    //llamamos al evento click del inputR
    event.preventDefault();
    inputM.click();
})
/*Cuando tenemos elementos q se estan arraztrando se activa*/
dropAreaM.addEventListener('dragover', (e) => {
    //Se necesita poner el preventDefault
    e.preventDefault();
    dropAreaM.classList.add('active');
    dragTextM.textContent = 'Suelta para subir el archivo';

});
/*Cunado estemos arrastrando pero no estamos dentro de la zona*/
dropAreaM.addEventListener('dragleave', (e) => {
    //Se necesita poner el preventDefault
    e.preventDefault();
    dropAreaM.classList.remove('active');
    dragTextM.textContent = 'Arrastra y suelta la imágen';
});
/*Cuando soltamos el archivo q estamos arrastrando dentro de la zona*/
dropAreaM.addEventListener('drop', (e) => {
    //Se necesita poner el preventDefault para que al momento de soltar no abra la imagen en el navegador
    e.preventDefault();
    filesM = e.dataTransfer.files;
    showFilesM();
    dropAreaM.classList.remove('active');
    dragTextM.textContent = 'Arrastra y suelta la imagen';
});
function showFilesM() {
    for (let file of filesM) {
        processFileM(file);
    }
}
function processFileM(file) {
    let docType = file.type;
    let validExtensions = ['image/jpeg', 'image/jpg'];
    if (validExtensions.includes(docType)) {
        //archivo valido
        inputM.files = filesM;
        mostrarimagenM();
    } else {
        //archivo no valido
        mostrarAlerta('No es una archivo valido');
    }
}
/***********************************************PRODUCT FILTER******************************************/
//------------------------------------------------------TABLE PRODUCT FILTER-----------------------------------------------------
//------Select utilizado para buscar por columnas
const selectSearchProdOC = document.getElementById('selectSearchProdOC');
selectSearchProdOC.addEventListener('change', searchProdOC);
//------buscar por input
const inputSearchProdOC = document.getElementById("inputSearchProdOC");
inputSearchProdOC.addEventListener("keyup", searchProdOC);
//------Proformas por pagina
const selectNumberProdOC = document.getElementById('selectNumberProdOC');
selectNumberProdOC.selectedIndex = 3;
selectNumberProdOC.addEventListener('change', function () {
    paginacionProdOC(filterCmp_prods.length, 1);
});
//------buscar por:
function searchProdOC() {
    const busqueda = inputSearchProdOC.value.toLowerCase().trim();
    const valor = selectSearchProdOC.value.toLowerCase().trim();
    filterCmp_prods = cmp_prods.filter(cmp_prod => {
        if (valor == 'todas') {
            return (
                cmp_prod.numero_cmp.toLowerCase().includes(busqueda) ||
                cmp_prod.fecha_cmp.toLowerCase().includes(busqueda) ||
                cmp_prod.fecha_factura_cppd.toLowerCase().includes(busqueda) ||
                cmp_prod.fecha_entrega_cppd.toLowerCase().includes(busqueda) ||
                (cmp_prod.nombre_usua + ' ' + cmp_prod.apellido_usua).toLowerCase().includes(busqueda) ||
                cmp_prod.nombre_empp.toLowerCase().includes(busqueda) ||
                cmp_prod.codigo_prod.toLowerCase().includes(busqueda) ||
                cmp_prod.descripcion_cppd.toLowerCase().includes(busqueda) ||
                cmp_prod.factura_cppd.toLowerCase().includes(busqueda)
            )
        } else {
            return cmp_prod[valor].toLowerCase().includes(busqueda);
        }
    });
    selectStateProductOC();
}
function createSelectDateProcOC() {
    const anios = Array.from(new Set(filterCmp_prods.map(buy => buy.fecha_cmp.split('-')[0])));
    selectDateProdOC.innerHTML = '';
    let optionFirst = document.createElement('option');
    optionFirst.value = 'todas';
    optionFirst.innerText = 'Todos los años';
    selectDateProdOC.appendChild(optionFirst);
    for (let anio of anios) {
        const option = document.createElement('option');
        option.value = anio;
        option.textContent = anio;
        selectDateProdOC.appendChild(option);
    }
}
//------Seleccionar el año
const selectDateProdOC = document.getElementById('selectDateProdOC');
selectDateProdOC.addEventListener('change', selectChangeYearProd);
function selectChangeYearProd() {
    if (selectDateProdOC.value == 'todas') {
        filterCmp_prods = cmp_prods;
    } else {
        filterCmp_prods = cmp_prods.filter(buy => buy.fecha_factura_cppd.split('-')[0] == selectDateProdOC.value);
    }
    filterCmp_prods = filterCmp_prods.filter(buy => {
        if (selectStateProdOC.value == 'todasLasOC') {
            return true;
        } else {
            return buy.estado_cppd == selectStateProdOC.value;
        }
    });
    paginacionProdOC(filterCmp_prods.length, 1);
}
//-------Estado de cmp_prods
const selectStateProdOC = document.getElementById('selectStateProdOC');
selectStateProdOC.addEventListener('change', selectStateProductOC);
function selectStateProductOC() {
    if (selectStateProdOC.value == 'todasLasOC') {
        filterCmp_prods = filterCmp_prods;
    } else {
        filterCmp_prods = filterCmp_prods.filter(buy => buy.estado_cppd == selectStateProdOC.value);
    }
    filterCmp_prods = filterCmp_prods.filter(buy => {
        if (selectDateProdOC.value == 'todas') {
            return true;
        } else {
            return buy.fecha_factura_cppd.split('-')[0] == selectDateProdOC.value;
        }
    });
    paginacionProdOC(filterCmp_prods.length, 1);
}
//------Ordenar tabla descendente ascendente
let orderProforma = document.querySelectorAll('.tbody__head--fbuy');
orderProforma.forEach(div => {
    div.children[0].addEventListener('click', function () {
        filterCmp_prods.sort((a, b) => {
            let first = a[div.children[0].name];
            let second = b[div.children[0].name];
            if (typeof first === 'number' && typeof second === 'number') {
                return first - second;
            } else {
                return String(first).localeCompare(String(second));
            }
        });
        paginacionProdOC(filterCmp_prods.length, 1);
    });
    div.children[1].addEventListener('click', function () {
        filterCmp_prods.sort((a, b) => {
            let first = a[div.children[0].name];
            let second = b[div.children[0].name];
            if (typeof first === 'number' && typeof second === 'number') {
                return second - first;
            } else {
                return String(second).localeCompare(String(first));
            }
        });
        paginacionProdOC(filterCmp_prods.length, 1);
    });
});
//------PaginacionProdOC
function paginacionProdOC(allProducts, page) {
    let totalProdOC = document.getElementById('totalProdOC');
    let total = 0;
    for (let cmp_prods in filterCmp_prods) {
        total += filterCmp_prods[cmp_prods]['cantidad_cppd'] * filterCmp_prods[cmp_prods]['cost_uni_cppd'] * (100 - filterCmp_prods[cmp_prods]['descuento_cmp']) / 100;
    }
    totalProdOC.innerHTML = total.toFixed(2) + ' Bs';
    let numberProducts = Number(selectNumberProdOC.value);
    let allPages = Math.ceil(allProducts / numberProducts);
    let ul = document.querySelector('#wrapperProf ul');
    let li = '';
    let beforePages = page - 1;
    let afterPages = page + 1;
    let liActive;
    if (page > 1) {
        li += `<li class="btn" onclick="paginacionProdOC(${allProducts}, ${page - 1})"><img src="../imagenes/arowLeft.svg"></li>`;
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
        li += `<li class="numb ${liActive}" onclick="paginacionProdOC(${allProducts}, ${pageLength})"><span>${pageLength}</span></li>`;
    }
    if (page < allPages) {
        li += `<li class="btn" onclick="paginacionProdOC(${allProducts}, ${page + 1})"><img src="../imagenes/arowRight.svg"></li>`;
    }
    ul.innerHTML = li;
    let h2 = document.querySelector('#showPageProf h2');
    h2.innerHTML = `Pagina ${page}/${allPages}, ${allProducts} Productos`;
    tableCmpProds(page);
}
//--------Tabla de cmp_prods
function tableCmpProds(page) {
    let tbody = document.getElementById('tbodyProdOC');
    inicio = (page - 1) * Number(selectNumberProdOC.value);
    final = inicio + Number(selectNumberProdOC.value);
    i = 1;
    tbody.innerHTML = '';
    for (let cmp_prod in filterCmp_prods) {
        if (i > inicio && i <= final) {
            let tr = document.createElement('tr');
            for (let valor in filterCmp_prods[cmp_prod]) {
                let td = document.createElement('td');
                if (valor == 'id_cppd') {
                    td = document.createElement('td');
                    td.innerText = i;
                    tr.appendChild(td);
                    i++;
                } else if (valor == 'cost_uni_cppd') {
                    td.innerText = filterCmp_prods[cmp_prod][valor].toFixed(2) + ' Bs';
                    tr.appendChild(td);
                    let td2 = document.createElement('td');
                    let subTotal = filterCmp_prods[cmp_prod]['cost_uni_cppd'] * filterCmp_prods[cmp_prod]['cantidad_cppd'];
                    td2.innerText = subTotal.toFixed(2) + ' Bs';
                    tr.appendChild(td2);
                } else if (valor == 'descuento_cmp') {
                    let desc = filterCmp_prods[cmp_prod][valor] * filterCmp_prods[cmp_prod]['cost_uni_cppd'] * filterCmp_prods[cmp_prod]['cantidad_cppd'] / 100;
                    td.innerText = desc.toFixed(2) + ' Bs' + ' (' + filterCmp_prods[cmp_prod][valor] + '%)';
                    tr.appendChild(td);
                    let td2 = document.createElement('td');
                    let total = filterCmp_prods[cmp_prod]['cantidad_cppd'] * filterCmp_prods[cmp_prod]['cost_uni_cppd'] * (100 - filterCmp_prods[cmp_prod]['descuento_cmp']) / 100;
                    td2.innerText = total.toFixed(2) + ' Bs';
                    tr.appendChild(td2);
                } else if (valor == 'fk_id_cmp_cppd' || valor == 'apellido_usua' || valor == 'fk_id_prod_cppd' || valor == 'imagen_prod' || valor == 'estado_cmp' || valor == 'estado_cppd' || valor == 'nombre_usua' || valor == 'nombre_empp') {
                } else {
                    td.innerText = filterCmp_prods[cmp_prod][valor];
                    tr.appendChild(td);
                }
            }
            tbody.appendChild(tr);
        } else {
            i++;
        }
    }
}
//---------------------------------VENTANA MODAL PARA FILTRAR PRODUCTOS COMPRADOS ------------------------------>>
const openProdOC = document.getElementById('openProdOC');
const closeTableProdOC = document.getElementById('closeTableProdOC');
const tableProdOC = document.getElementById('tableProdOC');
openProdOC.addEventListener('click', () => {
    tableProdOC.classList.add('modal__show');
})
closeTableProdOC.addEventListener('click', () => {
    tableProdOC.classList.remove('modal__show');
})
//------Alert
const modalAlerta = document.getElementById('alerta');
const botonAceptar = document.getElementById('botonAceptar');
function mostrarAlerta(message) {
    modalAlerta.classList.add('modal__show');
    document.getElementById('mensaje-alerta').innerText = message;
}
botonAceptar.addEventListener('click', (e) => {
    modalAlerta.classList.remove('modal__show');
});
//------------------------------------------------------Leer invnetario
let inventories = [];
async function readInventories() {
    return new Promise((resolve, reject) => {
        let formData = new FormData();
        formData.append('readInventories', '');
        fetch('../controladores/inventario.php', {
            method: "POST",
            body: formData
        }).then(response => response.json()).then(data => {
            inventories = Object.values(data);
        }).catch(err => console.log(err));
    })
}
//------div codigo smc
const divCodigoSMCR = document.getElementById('divCodigoSMCR');
const divCodigoSMCM = document.getElementById('divCodigoSMCM');
marca_prodR.addEventListener('change', () => {
    if (marca_prodR.value == '15') {
        divCodigoSMCR.removeAttribute('hidden');
    } else {
        divCodigoSMCR.setAttribute('hidden', '');
    }
});
marca_prodM.addEventListener('change', () => {
    if (marca_prodM.value == '15') {
        divCodigoSMCM.removeAttribute('hidden');
    } else {
        divCodigoSMCM.setAttribute('hidden', '');
    }
});