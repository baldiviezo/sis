//-------------------------------------------------SUPPLIER--------------------------------------------------
//<<-----------------------------------------CRUD SUPPLIER----------------------------------------->>
let suppliers = {};
readSuppliers();
function readSuppliers() {
    let formData = new FormData();
    formData.append('readSuppliers', '');
    fetch('../controladores/clientes.php', {
        method: "POST",
        body: formData
    }).then(response => response.json()).then(data => {
        suppliers = JSON.parse(JSON.stringify(data));
        readEnterprises();
    }).catch(err => console.log(err));
}
//------Create a supplier
const formSupplierR = document.getElementById('formSupplierR');
formSupplierR.addEventListener('submit', createSupplier);
function createSupplier() {
    event.preventDefault();
    supplierRMW.classList.remove('modal__show');
    let formData = new FormData(formSupplierR);
    formData.append('createSupplier', '');
    fetch('../controladores/clientes.php', {
        method: "POST",
        body: formData
    }).then(response => response.text()).then(data => {
        alert(data);
        cleanFormSupplierR();
        readSuppliers();
    }).catch(err => console.log(err));
}
function cleanFormSupplierR() {
    const inputsR = document.querySelectorAll('#formSupplierR .form__group input');
    inputsR.forEach(input => { input.value = '' })
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
function updateSupplier() {
    event.preventDefault();
    supplierMMW.classList.remove('modal__show');
    let formData = new FormData(formClienteM);
    formData.append('updateSupplier', '');
    fetch('../controladores/clientes.php', {
        method: "POST",
        body: formData
    }).then(response => response.text()).then(data => {
        alert(data);
        readSuppliers();
    }).catch(err => console.log(err));
}
//------Delete a supplier
function deleteSupplier(rm) {
    let selectSupplierRM = document.getElementById('selectSupplier' + rm);
    if (confirm('¿Esta usted seguro?')) {
        let id = selectSupplierRM.value;
        let formData = new FormData();
        formData.append('deleteSupplier', id);
        fetch('../controladores/clientes.php', {
            method: "POST",
            body: formData
        }).then(response => response.text()).then(data => {
            alert(data);
            readSuppliers();
        }).catch(err => console.log(err));
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
let enterprises = {};
let filterEnterprises = {};
function readEnterprises() {
    let formData = new FormData();
    formData.append('readEnterprisesP', '');
    fetch('../controladores/clientes.php', {
        method: "POST",
        body: formData
    }).then(response => response.json()).then(data => {
        enterprises = JSON.parse(JSON.stringify(data));
        filterEnterprises = enterprises;
        paginacionEnterpriseMW(Object.values(filterEnterprises).length, 1);
        fillSelectEmp(selectEnterpriseR, selectSupplierR);
    }).catch(err => console.log(err));
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
function createEnterprise() {
    event.preventDefault();
    enterprisesRMW.classList.remove('modal__show');
    let formData = new FormData(formEmpresaR);
    formData.append('createEnterpriseP', '');
    fetch('../controladores/clientes.php', {
        method: "POST",
        body: formData
    }).then(response => response.text()).then(data => {
        alert(data);
        if (data != 'La empresa ya existe') {
            cleanFormEnterpriseR();
            readEnterprises();
        }
    }).catch(err => console.log(err));
}
//Limpiar enterprisesRMW
function cleanFormEnterpriseR() {
    let inputs = document.querySelectorAll('#formEmpresaR input.form__input');
    inputs.forEach(input => input.value = '');
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
function updateEnterprise() {
    event.preventDefault();
    enterprisesMMW.classList.remove('modal__show');
    let formData = new FormData(formEmpresaM);
    formData.append('updateEnterpriseP', '');
    fetch('../controladores/clientes.php', {
        method: "POST",
        body: formData
    }).then(response => response.text()).then(data => {
        alert(data);
        if (data == 'Empresa actualizada exitosamente') {
            readEnterprises();
        }
    }).catch(err => console.log(err));
}
//------Borrar una empresa
function deleteEnterprise(rm) {
    let selectEnterpriseRM = document.getElementById('selectEnterprise' + rm);
    if (confirm('¿Esta usted seguro?')) {
        let id_empp = selectEnterpriseRM.value;
        let formData = new FormData();
        formData.append('deleteEnterpriseP', id_empp);
        fetch('../controladores/clientes.php', {
            method: "POST",
            body: formData
        }).then(response => response.text()).then(data => {
            alert(data);
            readEnterprises();
        }).catch(err => console.log(err));
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
let buys = {};
let filterBuys = {};
let formBuy = '';
readBuys();
function readBuys() {
    let formData = new FormData();
    formData.append('readBuys', '');
    fetch('../controladores/compras.php', {
        method: "POST",
        body: formData
    }).then(response => response.json()).then(data => {
        buys = JSON.parse(JSON.stringify(data));
        filterBuys = buys;
        filterByUserBuys(Object.values(buys).length, 1);
    }).catch(err => console.log(err));
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
    filterByUserBuys(Object.values(filterBuys).length, 1);
});
//-------Estado de compra
const selectStateBuy = document.getElementById('selectStateBuy');
selectStateBuy.addEventListener('change', searchBuys);
//------buscar por:
function searchBuys() {
    filterBuys = {};
    for (let buy in buys) {
        for (let valor in buys[buy]) {
            if (selectSearchBuy.value == 'todas') {
                if (valor != 'estado_cmp' || valor == 'fk_id_prov_clte' || valor == 'fk_id_usua_cmp' || valor == 'id_cmp' || valor == 'id_empp' || valor == 'descuento_cmp') {
                    if (buys[buy][valor].toLowerCase().indexOf(inputSerchBuy.value.toLowerCase()) >= 0) {
                        filterBuys[buy] = buys[buy];
                        break;
                    }
                }
            } else {
                if (valor == selectSearchBuy.value) {
                    if (buys[buy][valor].toLowerCase().indexOf(inputSerchBuy.value.toLowerCase()) >= 0) {
                        filterBuys[buy] = buys[buy];
                        break;
                    }
                }
            }
        }
    }
    selectStateBuys();
}
//estado de la compra
function selectStateBuys() {
    if (selectStateBuy.value == 'todasLasCompras') {
        filterByUserBuys(Object.values(filterBuys).length, 1);
    } else {
        for (let buy in filterBuys) {
            for (let valor in filterBuys[buy]) {
                if (valor == 'estado_cmp') {
                    if (filterBuys[buy][valor] != selectStateBuy.value) {
                        delete filterBuys[buy];
                        break;
                    }
                }
            }
        }
        filterByUserBuys(Object.values(filterBuys).length, 1);
    }
}
//------Ordenar tabla descendente ascendente
let orderBuys = document.querySelectorAll('.tbody__head--buy');
orderBuys.forEach(div => {
    div.children[0].addEventListener('click', function () {
        let array = Object.entries(filterBuys).sort((a, b) => {
            let first = a[1][div.children[0].name];
            let second = b[1][div.children[0].name];
            if (typeof first === 'number' && typeof second === 'number') {
                return first - second;
            } else {
                return String(first).localeCompare(String(second));
            }
        });
        filterBuys = Object.fromEntries(array);
        filterByUserBuys(Object.values(filterBuys).length, 1);
    });
    div.children[1].addEventListener('click', function () {
        let array = Object.entries(filterBuys).sort((a, b) => {
            let first = a[1][div.children[0].name];
            let second = b[1][div.children[0].name];
            if (typeof first === 'number' && typeof second === 'number') {
                return second - first;
            } else {
                return String(second).localeCompare(String(first));
            }
        });
        filterBuys = Object.fromEntries(array);
        filterByUserBuys(Object.values(filterBuys).length, 1);
    });
});
//------Filtar por rol
function filterByUserBuys(length, page) {
    if(localStorage.getItem('rol_usua') == 'Gerente general' || localStorage.getItem('rol_usua') == 'Administrador'){
        paginacionBuy(length, page);
    }else if (localStorage.getItem('rol_usua') == 'Ingeniero' || localStorage.getItem('rol_usua') == 'Gerente De Inventario'){
        for(let buy in filterBuys){
            if (filterBuys[buy]['fk_id_usua_cmp'] != localStorage.getItem('id_usua')){
                delete filterBuys[buy];
            }
        }
        paginacionBuy(length, page);
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
    h2.innerHTML = `Pagina ${page}/${allPages}, ${allBuys} Clientes`;
    tableBuys(page);
}
//------Crear la tabla
function tableBuys(page) {
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
                } else if (valor == 'numero_cmp') {
                    td.innerText = `OC SMS${filterBuys[buy]['fecha_cmp'].slice(2, 4)}-${filterBuys[buy][valor]}`;
                    tr.appendChild(td);
                } else if (valor == 'fecha_cmp') {
                    td.innerText = filterBuys[buy][valor].slice(0, 10);
                    tr.appendChild(td);
                } else if (valor == 'fk_id_usua_cmp' || valor == 'fk_id_prov_cmp' || valor == 'apellido_usua' || valor == 'id_empp' || valor == 'apellido_prov' || valor == 'estado_cmp' || valor == 'moneda_cmp' || valor == 'tipo_cambio_cmp' || valor == 'descuento_cmp') {
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
                if (localStorage.getItem('rol_usua') == 'Gerente general') {
                    td.innerHTML = `
                <img src='../imagenes/receipt.svg' onclick='openProductBuyMW(this.parentNode.parentNode.children[0].innerText)' title='Añadir compra a inventario'>
                <img src='../imagenes/pdf.svg' onclick='selectPDFInformation(this.parentNode.parentNode.children[0].innerText)' title='Imprimir pdf'>
                <img src='../imagenes/edit.svg' onclick='readBuy(this.parentNode.parentNode.children[0].innerText)' title='Editar compra'>`;
                } else {
                    td.innerHTML = `
                <img src='../imagenes/receipt.svg' onclick='openProductBuyMW(this.parentNode.parentNode.children[0].innerText)' title='Añadir compra a inventario'>
                <img src='../imagenes/pdf.svg' onclick='selectPDFInformation(this.parentNode.parentNode.children[0].innerText)' title='Imprimir pdf'>`;
                }
            } else {
                    td.innerHTML = `
                    <img src='../imagenes/pdf.svg' onclick='selectPDFInformation(this.parentNode.parentNode.children[0].innerText)' title='Imprimir pdf'>`;
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
formBuyR.addEventListener('submit', createBuy);
function createBuy() {
    event.preventDefault();
    totalPriceCPPDR();
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
        let formData = new FormData(formBuyR);
        buyRMW.classList.remove('modal__show');
        formData.append('createBuy', JSON.stringify(array));
        formData.append('id_usua', localStorage.getItem('id_usua'));
        fetch('../controladores/compras.php', {
            method: "POST",
            body: formData
        }).then(response => response.text()).then(data => {
            alert(data);
            cleanFormBuyR();
            readBuys();
            readCmp_prods();
        }).catch(err => console.log(err));
    } else {
        alert('No a seleccionado ningun producto');
    }
}
//------read Buy
function readBuy(id_cmp) {
    buyMMW.classList.add('modal__show');
    const filterBuy = Object.values(filterBuys).find(buy => buy['id_cmp'] === id_cmp);
    if (filterBuy) {
        const properties = ['id_cmp', 'fecha_cmp', 'forma_pago_cmp', 'tpo_entrega_cmp', 'tipo_cambio_cmp', 'descuento_cmp', 'observacion_cmp'];
        properties.forEach(property => {
            document.getElementsByName(property+'M')[0].value = filterBuy[property];
        }); 

        selectEnterpriseM.innerHTML = '';
        const option = document.createElement('option');
        option.value = filterBuy.id_empp;
        option.innerText = filterBuy.nombre_empp;
        selectEnterpriseM.appendChild(option);

        selectSupplierM.innerHTML = '';
        const option2 = document.createElement('option');
        option2.value = filterBuy.fk_id_prov_cmp;
        option2.innerText = `${filterBuy.nombre_prov} ${filterBuy.apellido_prov}`;
        selectSupplierM.appendChild(option2);
    }
    readCmp_prod(id_cmp);
}
function readCmp_prod(id_cmp) {
    formBuy = 'M';
    const filterCmp_prods = Object.values(cmp_prods).filter(cmp_prod => cmp_prod['fk_id_cmp_cppd'] === id_cmp);
    cmp_prodMMW.querySelector('div.modal__body').innerHTML = '';
    filterCmp_prods.forEach(cmp_prod => {
        let div = document.createElement('div');
        div.classList.add('cart__item');
        div.innerHTML = `
        <input type="hidden"  value = "${cmp_prod['fk_id_prod_cppd']}" class="cart__item--id">
        <input type="text" value = "${cmp_prod['codigo_prod']}" class="cart__item--code">
        <textarea class="cart__item--name">${cmp_prod['descripcion_cppd']}</textarea>
        <input type="number" value = "${cmp_prod['cantidad_cppd']}" min="1" onChange="changeQuantityCPPDM(this.parentNode)" class="cart__item--quantity">
        <input type="number" value = "${cmp_prod['cost_uni_cppd']}" onChange="changeQuantityCPPDM(this.parentNode)" class="cart__item--costUnit">
        <input type="number" value = "${cmp_prod['cost_uni_cppd'] * cmp_prod['cantidad_cppd']}" class="cart__item--costTotal" readonly>
        <img src="../imagenes/trash.svg" onClick="removeCartM(this.parentNode)" class='icon__CRUD'>`;
        cmp_prodMMW.querySelector('div.modal__body').appendChild(div);
    });
    totalPriceCPPDM();
}
//------Update buy
const formBuyM = document.getElementById('formBuyM');
formBuyM.addEventListener('submit', updateBuy);
function updateBuy() {
    event.preventDefault();
    totalPriceCPPDM();
    let products = document.querySelectorAll('#cmp_prodMMW div.modal__body div.cart__item');
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
        let formData = new FormData(formBuyM);
        buyMMW.classList.remove('modal__show');
        formData.append('updateBuy', JSON.stringify(array));
        formData.append('id_usua', localStorage.getItem('id_usua'));
        fetch('../controladores/compras.php', {
            method: "POST",
            body: formData
        }).then(response => response.text()).then(data => {
            alert(data);
            readBuys();
            readCmp_prods();
        }).catch(err => console.log(err));
    }
}
//------Delete buy
function deleteBuy(id_cmp){
    if (confirm('¿Esta usted seguro?')){
        let formData = new FormData();
        formData.append('deleteBuy', id_cmp);
        fetch('../controladores/compras.php', {
            method: "POST",
            body: formData
        }).then(response => response.text()).then(data => {
            alert(data);
            readBuys();
            readCmp_prods();
        }).catch(err => console.log(err));
    }
}
//------Limpiar formulario despues de registrar una compra
function cleanFormBuyR() {
    formBuyR.querySelectorAll('input.form__input').forEach(input => {
        input.value = '';
    })
    cmp_prodRMW.querySelector('div.modal__body').innerHTML = '';
    document.querySelector('#totalProductsCPRMW').innerHTML = '0';
    document.querySelector('#totalCostCPRMW').innerHTML = 'Bs. 0.00';
}
//<<------------------------ABRIR Y CERRAR MODALES DE  COMPRA--------------------------------->>
const closeBuyRMW = document.getElementById('closeBuyRMW');
const closeBuyMMW = document.getElementById('closeBuyMMW');
const openBuyRMW = document.getElementById('openBuyRMW');
const openBuyMMW = document.getElementById('openBuyMMW');
openBuyRMW.addEventListener('click', () => {
    buyRMW.classList.add('modal__show');
    const fechaHoy = new Date();
    const fechaCorta = fechaHoy.toISOString().slice(0, 10);
    document.getElementsByName('fecha_cmpR')[0].value = fechaCorta;
    formBuy = 'R';
});
closeBuyRMW.addEventListener('click', () => {
    buyRMW.classList.remove('modal__show');
});
closeBuyMMW.addEventListener('click', () => {
    buyMMW.classList.remove('modal__show');
});
//-----------------------------------------------------add buy to inventory------------------------------- 
function openProductBuyMW(id_cmp) {
    addBuyMW.classList.add('modal__show');
    let hoy = new Date();
    let dia = hoy.getDate();
    let mes = hoy.getMonth() + 1;
    let year = hoy.getFullYear();
    document.getElementsByName('fecha_entrega_cmp')[0].value = `${year}-${mes}-${dia}`;
    document.getElementsByName('id_cmp')[0].value = id_cmp;

}
//------show products to buy
function showproductsAddBuyMW() {
    document.getElementById('productBuyMW').classList.add('modal__show');
    let id_cmp = document.getElementsByName('id_cmp')[0].value;
    let body = document.getElementById('productBuyMW').querySelector('.modal__body');
    body.innerHTML = '';
    for (let cmp_prod in cmp_prods) {
        if (cmp_prods[cmp_prod]['fk_id_cmp_cppd'] == id_cmp) {
            let div = document.createElement('div');
            div.classList.add('cart__item');
            div.innerHTML = `
            <h3>${cmp_prods[cmp_prod]['codigo_prod']}</h3>
            <p>${cmp_prods[cmp_prod]['descripcion_prod']}</p>
            <p>${cmp_prods[cmp_prod]['cantidad_cppd']}</p>
            <p>${cmp_prods[cmp_prod]['cost_uni_cppd']}</p>`;
            body.appendChild(div);
        }
    }
    document.getElementById('quantityCPPDMW').innerText = body.children.length;
    for (let buy in buys) {
        if (buys[buy]['id_cmp'] == id_cmp) {
            document.getElementById('totalCostCPPDMW').innerText = `${Number(buys[buy]['total_cmp']).toFixed(2)} Bs`;
        }

    }
}
//------Las copras ya llegaron y estan en inventario
function addBuysToInventory() {
    addBuyMW.classList.remove('modal__show');
    productBuyMW.classList.remove('modal__show');
    let id_cmp = document.getElementsByName('id_cmp')[0].value;
    let array = [];
    for (let cmp_prod in cmp_prods) {
        if (cmp_prods[cmp_prod]['fk_id_cmp_cppd'] == id_cmp) {
            let object = {
                'id_cppd': cmp_prods[cmp_prod]['id_cppd'],
                'fk_id_cmp_cppd': cmp_prods[cmp_prod]['fk_id_cmp_cppd'],
                'fk_id_prod_cppd': cmp_prods[cmp_prod]['fk_id_prod_cppd'],
                'cantidad_cppd': cmp_prods[cmp_prod]['cantidad_cppd']
            }
            array.push(object);
        }
    }
    let formData = new FormData();
    formData.append('addBuysToInventory', JSON.stringify(array));
    formData.append('id_cmp', document.getElementsByName('id_cmp')[0].value);
    formData.append('factura_cmp', document.getElementsByName('factura_cmp')[0].value);
    formData.append('fecha_entrega_cmp', document.getElementsByName('fecha_entrega_cmp')[0].value);
    formData.append('id_usua', localStorage.getItem('id_usua'));
    fetch('../controladores/compras.php', {
        method: "POST",
        body: formData
    }).then(response => response.text()).then(data => {
        alert(data);
        readBuys();
    }).catch(err => console.log(err));

}
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
let cmp_prods;
readCmp_prods();
function readCmp_prods() {
    let formData = new FormData();
    formData.append('readCmp_prods', '');
    fetch('../controladores/compras.php', {
        method: "POST",
        body: formData
    }).then(response => response.json()).then(data => {
        cmp_prods = data;
    }).catch(err => console.log(err));
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
const closeCmp_prodMMW = document.getElementById('closeCmp_prodMMW');
const cmp_prodMMW = document.getElementById('cmp_prodMMW');
function openCmp_prodMMW() {
    cmp_prodMMW.classList.add('modal__show');
}
closeCmp_prodMMW.addEventListener('click', (e) => {
    cmp_prodMMW.classList.remove('modal__show');
});
function openCmp_prodRMW() {
    cmp_prodRMW.classList.add('modal__show');
}
closeCmp_prodRMW.addEventListener('click', (e) => {
    cmp_prodRMW.classList.remove('modal__show');
});

//------------------------------------------------TABLA MODAL PRODUCTS--------------------------------------------------
let products = {};
filterProductsMW = {};
readProducts();
function readProducts() {
    let formData = new FormData();
    formData.append('readProducts', '');
    fetch('../controladores/productos.php', {
        method: "POST",
        body: formData
    }).then(response => response.json()).then(data => {
        products = JSON.parse(JSON.stringify(data));
        filterProductsMW = products;
        paginacionProductMW(Object.values(filterProductsMW).length, 1);
    }).catch(err => console.log(err));
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
    paginacionProductMW(Object.values(filterProductsMW).length, 1);
});
//-------Marca y categoria
const selectMarcaProdMW = document.getElementById('selectMarcaProdMW');
selectMarcaProdMW.addEventListener('change', selectCategoriaProductMW);
const selectCategoriaProdMW = document.getElementById('selectCategoriaProdMW');
selectCategoriaProdMW.addEventListener('change', searchProductsMW);
//------buscar por:
function searchProductsMW() {
    filterProductsMW = {};
    for (let product in products) {
        for (let valor in products[product]) {
            if (selectSearchProdMW.value == 'todas') {
                if (valor == 'codigo_prod' || valor == 'nombre_prod' || valor == 'descripcion_prod') {
                    if (products[product][valor].toLowerCase().indexOf(inputSearchProdMW.value.toLowerCase()) >= 0) {
                        filterProductsMW[product] = products[product];
                        break;
                    }
                }
            } else {
                if (valor == selectSearchProdMW.value) {
                    if (products[product][valor].toLowerCase().indexOf(inputSearchProdMW.value.toLowerCase()) >= 0) {
                        filterProductsMW[product] = products[product];
                        break;
                    }
                }
            }
        }
    }
    selectProductsMW();
}
//------buscar por marca y categoria:
function selectProductsMW() {
    if (selectMarcaProdMW.value == 'todasLasMarcas' && selectCategoriaProdMW.value == 'todasLasCategorias') {
        paginacionProductMW(Object.values(filterProductsMW).length, 1);
    } else {
        for (let product in filterProductsMW) {
            for (let valor in filterProductsMW[product]) {
                if (selectMarcaProdMW.value == 'todasLasMarcas') {
                    if (filterProductsMW[product]['id_ctgr'] != selectCategoriaProdMW.value) {
                        delete filterProductsMW[product];
                        break;
                    }
                } else if (selectCategoriaProdMW.value == 'todasLasCategorias') {
                    if (filterProductsMW[product]['id_mrc'] != selectMarcaProdMW.value) {
                        delete filterProductsMW[product];
                        break;
                    }
                } else {
                    if (filterProductsMW[product]['id_ctgr'] != selectCategoriaProdMW.value || filterProductsMW[product]['id_mrc'] != selectMarcaProdMW.value) {
                        delete filterProductsMW[product];
                        break;
                    }
                }
            }
        }
        paginacionProductMW(Object.values(filterProductsMW).length, 1);
    }
}
//------Ordenar tabla descendente ascendente
let orderProducts = document.querySelectorAll('.tbody__head--ProdMW');
orderProducts.forEach(div => {
    div.children[0].addEventListener('click', function () {
        let array = Object.entries(filterProductsMW).sort((a, b) => {
            let first = a[1][div.children[0].name].toLowerCase();
            let second = b[1][div.children[0].name].toLowerCase();
            if (first < second) { return -1 }
            if (first > second) { return 1 }
            return 0;
        })
        filterProductsMW = Object.fromEntries(array);
        paginacionProductMW(Object.values(filterProductsMW).length, 1);
    });
    div.children[1].addEventListener('click', function () {
        let array = Object.entries(filterProductsMW).sort((a, b) => {
            let first = a[1][div.children[0].name].toLowerCase();
            let second = b[1][div.children[0].name].toLowerCase();
            if (first > second) { return -1 }
            if (first < second) { return 1 }
            return 0;
        })
        filterProductsMW = Object.fromEntries(array);
        paginacionProductMW(Object.values(filterProductsMW).length, 1);
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
                } else if (valor == 'id_mrc') {
                } else if (valor == 'id_ctgr') {
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
        <img src='../imagenes/send.svg' onclick='sendProduct(this.parentNode.parentNode)'>`;
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
            let cart__items = document.querySelectorAll(`#cmp_prod${formBuy}MW div.modal__body div.cart__item`);
            let i = 0;
            if (cart__items.length > 0) {
                cart__items.forEach(prod => {
                    let id_prod = prod.children[0].value;
                    if (id_prod == filterProductsMW[product]['id_prod']) {
                        i++;
                    }
                })
            }
            if (i == 0) {
                if (formBuy == 'R') {
                    cartProduct_cppdR(filterProductsMW[product]);
                } else if (formBuy == 'M') {
                    cartProduct_cppdM(filterProductsMW[product]);
                }
            } else {
                alert("El producto ya se encuentra en la lista");
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
        <textarea class="cart__item--name" >${product['nombre_prod']}</textarea>
        <input type="number" value = "1" min="1" onChange="changeQuantityCPPDR(this.parentNode)" class="cart__item--quantity">
        <input type="number" value = "0" onChange="changeQuantityCPPDR(this.parentNode)" class="cart__item--costUnit">
        <input type="number" value = "0" class="cart__item--costTotal" readonly>
        <img src="../imagenes/trash.svg" onClick="removeCartR(this.parentNode)" class='icon__CRUD'>`;
    item.innerHTML = html;
    //-------drag drop
    item.setAttribute('draggable', true)
    item.addEventListener("dragstart", () => {
        setTimeout(() => item.classList.add("dragging"), 0);
    });
    item.addEventListener("dragend", () => item.classList.remove("dragging"));
    cmpProdRMW.appendChild(item);
    totalPriceCPPDR();
}
//-----Drag drop
const initSortableListM = (e) => {
    e.preventDefault();
    const draggingItem = document.querySelector(".dragging");
    let siblings = [...cmpProdRMW.querySelectorAll(".cart__item:not(.dragging)")];
    let nextSibling = siblings.find(sibling => {
        return e.clientY <= sibling.offsetTop + sibling.offsetHeight / 2;
    });
    cmpProdRMW.insertBefore(draggingItem, nextSibling);
}
cmpProdRMW.addEventListener("dragover", initSortableListM);
cmpProdRMW.addEventListener("dragenter", e => e.preventDefault());
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
function totalPriceCPPDR() {
    let divs = document.querySelectorAll('#cmp_prodRMW div.modal__body div.cart__item');
    let total = 0;
    divs.forEach(div => {
        costo_uni = Number(div.children[5].value);
        total = total + costo_uni;
    })
    document.getElementById('totalCostCPRMW').innerHTML = 'Bs ' + total.toFixed(2);
    document.getElementById('totalProductsCPRMW').innerHTML = divs.length;
    document.getElementsByName('total_cmpR')[0].value = total.toFixed(2) - document.getElementsByName('descuento_cmpR')[0].value*total/100;
}
const cmpProdMMW = document.querySelector('#cmp_prodMMW div.modal__body');
function cartProduct_cppdM(product) {
    let item = document.createElement('div');
    item.classList.add('cart__item');
    let html =
        `<input type="hidden"  value = "${product['id_prod']}" class="cart__item--id">
        <input type="text" value = "${product['codigo_prod']}" class="cart__item--code">
        <textarea class="cart__item--name">${product['nombre_prod']}</textarea>
        <input type="number" value = "1" min="1" onChange="changeQuantityCPPDM(this.parentNode)" class="cart__item--quantity">
        <input type="number" value = "0" onChange="changeQuantityCPPDM(this.parentNode)" class="cart__item--costUnit">
        <input type="number" value = "0" class="cart__item--costTotal" readonly>
        <img src="../imagenes/trash.svg" onClick="removeCartM(this.parentNode)" class='icon__CRUD'>`;
    item.innerHTML = html;
    //-------drag drop
    item.setAttribute('draggable', true)
    item.addEventListener("dragstart", () => {
        setTimeout(() => item.classList.add("dragging"), 0);
    });
    item.addEventListener("dragend", () => item.classList.remove("dragging"));
    cmpProdMMW.appendChild(item);
    totalPriceCPPDM();
}
function removeCartM(product) {
    let listProducts = document.querySelector('#cmp_prodMMW div.modal__body');
    listProducts.removeChild(product);
    totalPriceCPPDM();
}
function changeQuantityCPPDM(product) {
    let cantidad_prod = product.children[3].value;
    let costo_uni = product.children[4].value;
    let cost_uni_total = cantidad_prod * costo_uni;
    product.children[5].value = cost_uni_total.toFixed(2);
    totalPriceCPPDM();
}
function totalPriceCPPDM() {
    let divs = document.querySelectorAll('#cmp_prodMMW div.modal__body div.cart__item');
    let total = 0;
    divs.forEach(div => {
        costo_uni = Number(div.children[5].value);
        total = total + costo_uni;
    })
    document.getElementById('totalCostCPMMW').innerHTML = 'Bs ' + total.toFixed(2);
    document.getElementById('totalProductsCPMMW').innerHTML = divs.length;
    document.getElementsByName('total_cmpM')[0].value = total.toFixed(2) - document.getElementsByName('descuento_cmpM')[0].value*total/100;
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
readAllMarcas();
function readAllMarcas() {
    let formData = new FormData();
    formData.append('readMarcas', '');
    fetch('../controladores/productos.php', {
        method: "POST",
        body: formData
    }).then(response => response.json()).then(data => {
        marcas = JSON.parse(JSON.stringify(data));
        selectMarcaProdR();
        selectMarcaProductMW();
    }).catch(err => console.log(err));
}
//-------Read all categorias
let categorias = {};
readAllCategorias();
function readAllCategorias() {
    let formData = new FormData();
    formData.append('readCategorias', '');
    fetch('../controladores/productos.php', {
        method: "POST",
        body: formData
    }).then(response => response.json()).then(data => {
        categorias = JSON.parse(JSON.stringify(data));
    }).catch(err => console.log(err));
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

//---------------------------------------------------CRUD PRODUCTOS----------------------------------------------------------------
//------Create un producto
document.getElementById("formProductsR").addEventListener("submit", createProduct);
function createProduct() {
    event.preventDefault();
    if (marca_prodR.value == "todasLasMarcas") {
        alert("Debe seleccionar una marca");
    } else if (categoria_prodR.value == "todasLasCategorias") {
        alert("Debe seleccionar una categoria");
    } else {
        productsRMW.classList.remove('modal__show');
        let form = document.getElementById("formProductsR");
        let formData = new FormData(form);
        formData.append('createProduct', '');
        fetch('../controladores/productos.php', {
            method: "POST",
            body: formData
        }).then(response => response.text()).then(data => {
            if (data == "El codigo ya existe") {
                alert(data);
            } else {
                alert("El producto fue creado con éxito");
                readProducts();
                cleanUpProductFormR();
            }
        }).catch(err => console.log(err));
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
})
//------Limpia los campos del fomulario registrar
function cleanUpProductFormR() {
    inputsFormProduct.forEach(input => input.value = "");
    document.getElementsByName("descripcion_prodR")[0].value = "";
    document.getElementsByName("imagen_prodR")[0].value = "";
    document.querySelector('.drop__areaR').removeAttribute('style');
}
//--------DRANG AND DROP
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
//Cuando tenemos elementos q se estan arraztrando se activa
dropAreaR.addEventListener('dragover', (e) => {
    //Se necesita poner el preventDefault
    e.preventDefault();
    dropAreaR.classList.add('active');
    dragTextR.textContent = 'Suelta para subir el archivo';
});
//Cunado estemos arrastrando pero no estamos dentro de la zona
dropAreaR.addEventListener('dragleave', (e) => {
    //Se necesita poner el preventDefault
    e.preventDefault();
    dropAreaR.classList.remove('active');
    dragTextR.textContent = 'Arrastra y suelta la imágen';
});
//Cuando soltamos el archivo q estamos arrastrando dentro de la zona
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
    let validExtensions = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif'];
    if (validExtensions.includes(docType)) {
        inputR.files = filesR;
        mostrarimagenR();
    } else {
        //archivo no valido
        alert('No es una archivo valido');
    }
}
