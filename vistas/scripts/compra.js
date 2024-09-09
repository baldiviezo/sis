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
                if (valor == 'fk_id_empp_prov'){
                    selectEntProvM.innerHTML = '';
                    let option = document.createElement('option');
                    option.value = selectEnterpriseR.value
                    option.innerText = selectEnterpriseR.options[selectEnterpriseR.selectedIndex].textContent;
                    selectEntProvM.appendChild(option);
                }else{
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
    console.log(enterprises)
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
                if (valor == 'id_emp') {
                    td.innerText = filterEnterprises[enterprise][valor];
                    td.setAttribute('hidden', '');
                    tr.appendChild(td);
                    td = document.createElement('td');
                    td.innerText = i;
                    tr.appendChild(td);
                    i++;
                } else if (valor == 'sigla_emp') {
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
//<<---------------------------------------------------------TABLA DE COMPRA------------------------------------------>>
let buys = {};
let filterBuys = {};
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
        paginacionBuy(Object.values(buys).length, 1);
    }).catch(err => console.log(err));
}
//------Select utilizado para buscar por columnas
const selectSearchBuy = document.getElementById('selectSearchBuy');
selectSearchBuy.addEventListener('change', searchBuys);
//------buscar por input
const inputSerchBuy = document.getElementById("inputSerchBuy");
inputSerchBuy.addEventListener("keyup", searchBuys);
//------Clientes por pagina
const selectNumberBuy = document.getElementById('selectNumberBuy');
selectNumberBuy.selectedIndex = 3;
selectNumberBuy.addEventListener('change', function () {
    paginacionBuy(Object.values(filterBuys).length, 1);
});
//------buscar por:
function searchBuys() {
    filterBuys = {};
    for (let buy in buys) {
        for (let valor in buys[buy]) {
            if (selectSearchBuy.value == 'todas') {
                if (valor != 'estado_cmp' || valor == 'fk_id_prov_clte' || valor == 'fk_id_usua_cmp' || valor == 'id_cmp' || valor == 'id_empp') {
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
    paginacionBuy(Object.values(filterBuys).length, 1);
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
    paginacionBuy(Object.values(filterBuys).length, 1);
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
    paginacionBuy(Object.values(filterBuys).length, 1);
  });
});
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
    for (let customer in filterBuys) {
        if (i > inicio && i <= final) {
            let tr = document.createElement('tr');
            for (let valor in filterBuys[customer]) {
                let td = document.createElement('td');
                if (valor == 'id_cmp') {
                    td.innerText = filterBuys[customer][valor];
                    td.setAttribute('hidden', '');
                    tr.appendChild(td);
                    td = document.createElement('td');
                    td.innerText = i;
                    tr.appendChild(td);
                    i++;
                } else if (valor == 'numero_cmp') {
                    td.innerText = `OC SMS${filterBuys[customer]['fecha_cmp'].slice(2, 4)}-${filterBuys[customer][valor]}`;
                    tr.appendChild(td);
                }else if (valor == 'fecha_cmp') {
                    td.innerText = filterBuys[customer][valor].slice(0, 10);
                    tr.appendChild(td);
                } else if (valor == 'fk_id_usua_cmp' || valor == 'fk_id_prov_cmp' || valor == 'apellido_usua' || valor == 'id_empp' || valor == 'apellido_prov' || valor == 'estado_cmp') {
                } else if (valor == 'nombre_usua') {
                    td.innerText = `${filterBuys[customer][valor]} ${filterBuys[customer]['apellido_usua']}`;
                    tr.appendChild(td);
                } else if (valor == 'nombre_prov') {
                    td.innerText = `${filterBuys[customer][valor]} ${filterBuys[customer]['apellido_prov']}`;
                    tr.appendChild(td);
                }else if (valor == 'total_cmp') {
                    td.innerText = `${filterBuys[customer][valor]} Bs`;
                    tr.appendChild(td);
                }else {
                    td.innerText = filterBuys[customer][valor];
                    tr.appendChild(td);
                }
            }
            let td = document.createElement('td');
            if (localStorage.getItem('rol_usua') == 'Gerente general') {
                td.innerHTML = `
            <img src='../imagenes/edit.svg' onclick='readBuy(this.parentNode.parentNode.children[0].innerText)' title='Editar cliente'>
            <img src='../imagenes/trash.svg' onclick='deleteBuy(this.parentNode.parentNode)' title='Eliminar cliente'>`;
            } else {
                td.innerHTML = `
            <img src='../imagenes/edit.svg' onclick='readBuy(this.parentNode.parentNode.children[0].innerText)' title='Editar cliente'>`;
            }
            tr.appendChild(td);
            tbody.appendChild(tr);
        } else {
            i++;
        }
    }
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
});
closeBuyRMW.addEventListener('click', () => {
    buyRMW.classList.remove('modal__show');
});
closeBuyMMW.addEventListener('click', () => {
    buyMMW.classList.remove('modal__show');
});
//<<-------------------------------------CRUD DE COMPRAS-------------------------------------------->>
//-------Create buy
let formBuyR = document.getElementById('formBuyR');
formBuyR.addEventListener('submit', createBuy);
function createBuy() {
    event.preventDefault();
    let productos = document.querySelectorAll('#cmp_prodMW div.modal__body div.cart__item');
    if (productos.length > 0) {
        let array = [];
        productos.forEach(producto => {
            let object = {
                'fk_id_prod_cppd': producto.children[0].value,
                'descripcion_cppd': producto.children[2].innerHTML,
                'cantidad_cppd': producto.children[3].value,
                'cost_uni_cppd': producto.children[4].value
            };
            array.push(object);
        });
        let cmp_prods = JSON.stringify(array);
        console.log(cmp_prods)
        let formData = new FormData(formBuyR);
        buyRMW.classList.remove('modal__show');
        formData.append('createBuy', cmp_prods);
        formData.append('id_usua', localStorage.getItem('id_usua'));
        fetch('../controladores/compras.php', {
            method: "POST",
            body: formData
        }).then(response => response.text()).then(data => {
            alert(data);
            readBuys();
        }).catch(err => console.log(err));
    } else {
        alert('No a seleccionado ningun producto');
    }
} 
function readBuy(id_cmp) {
    buyMMW.classList.add('modal__show');
    for (let buy in filterBuys) {
        if (filterBuys[buy]['id_cmp'] == id_cmp) {
            document.getElementsByName('id_cmpM')[0].value = filterBuys[buy]['id_cmp'].slice(0, 10);
            document.getElementsByName('fecha_cmpM')[0].value = filterBuys[buy]['fecha_cmp'];
            document.getElementsByName('forma_pago_cmpM')[0].value = filterBuys[buy]['forma_pago_cmp'];
            document.getElementsByName('tpo_entrega_cmpM')[0].value = filterBuys[buy]['tpo_entrega_cmp'];
        }
    }
}






//<<-------------------------------------MODAL DE PRODUCTS PARA COMPRAR-------------------------------------------->>
const closeCmp_prodMW = document.getElementById('closeCmp_prodMW');
const cmp_prodMW = document.getElementById('cmp_prodMW');
function openCmp_prodMW() {
    cmp_prodMW.classList.add('modal__show');
}
closeCmp_prodMW.addEventListener('click', (e) => {
    cmp_prodMW.classList.remove('modal__show');
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
            let cart__items = document.querySelectorAll('#cmp_prodMW div.modal__body div.cart__item');
            let i = 0;
            if (cart__items.length > 0){
                cart__items.forEach(prod => {
                    let id_prod = prod.children[0].value;
                    if (id_prod == filterProductsMW[product]['id_prod']) {
                        i++;
                    }
                })
            }
            if (i == 0) {
                cartProduct_cppd(filterProductsMW[product]);
            } else {
                alert("El producto ya se encuentra en la lista");
            }
        }
    }
}
const cmpProdMW = document.querySelector('#cmp_prodMW div.modal__body');
function cartProduct_cppd(product) {
    let item = document.createElement('div');
    item.classList.add('cart__item');
    let html =
        `<input type="hidden"  value = "${product['id_prod']}" class="cart__item--id">
        <input type="text" value = "${product['codigo_prod']}" class="cart__item--code">
        <textarea class="cart__item--name">${product['nombre_prod']}</textarea>
        <input type="number" value = "1" min="1" onChange="changeQuantityCPPD(this.parentNode)" class="cart__item--quantity">
        <input type="number" value = "0" onChange="changeQuantityCPPD(this.parentNode)" class="cart__item--costUnit">
        <input type="number" value = "0" class="cart__item--costTotal" readonly>
        <img src="../imagenes/trash.svg" onClick="removeCart(this.parentNode)" class='icon__CRUD'>`;
    item.innerHTML = html;
    //-------drag drop
    item.setAttribute('draggable', true)
    item.addEventListener("dragstart", () => {
        setTimeout(() => item.classList.add("dragging"), 0);
    });
    item.addEventListener("dragend", () => item.classList.remove("dragging"));
    cmpProdMW.appendChild(item);
    totalPriceCPPD();
}
//-----Drag drop
const initSortableListM = (e) => {
    e.preventDefault();
    const draggingItem = document.querySelector(".dragging");
    let siblings = [...cmpProdMW.querySelectorAll(".cart__item:not(.dragging)")];
    let nextSibling = siblings.find(sibling => {
        return e.clientY <= sibling.offsetTop + sibling.offsetHeight / 2;
    });
    cmpProdMW.insertBefore(draggingItem, nextSibling);
}
cmpProdMW.addEventListener("dragover", initSortableListM);
cmpProdMW.addEventListener("dragenter", e => e.preventDefault());
//-------Eliminar producto 
function removeCart(product) {
    let listProducts = document.querySelector('#cmp_prodMW div.modal__body');
    listProducts.removeChild(product);
    totalPriceCPPD();
}
//-------Cuando cambia la cantidad
function changeQuantityCPPD(product) {
    let cantidad_prod = product.children[3].value;
    let costo_uni = product.children[4].value;
    let cost_uni_total = cantidad_prod * costo_uni;
    product.children[5].value = cost_uni_total.toFixed(2);
    totalPriceCPPD();
}
function totalPriceCPPD() {
    let divs = document.querySelectorAll('#cmp_prodMW div.modal__body div.cart__item');
    let total = 0;
    divs.forEach(div => {
        costo = Number(div.children[5].value);
        total = total + costo;
    })
    document.getElementById('totalCostCPMW').innerHTML = 'Bs ' + total.toFixed(2);
    document.getElementById('totalProductsCPMW').innerHTML = divs.length;
    //para el input total_cmp
    document.getElementsByName('total_cmpR')[0].value = total.toFixed(2);
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







/*


const buyRMW = document.getElementById('buyRMW');
const buyMMW = document.getElementById('buyMMW');*/











//-----------------------------------FECHA----------------------------------------------------
/*let hoy = new Date();
let dia = hoy.getDate();
let mes = hoy.getMonth() + 1;
let year = hoy.getFullYear();
onlyYear = year % 100;*/









/*const buyForPage = document.getElementById('buyForPage');
buyForPage.addEventListener('change', pageOneBuy)
let compras = {};  //base de datos de compras
let globalPageBuy = 1;
let comprasPorPagina;
let totalCompras;
//--------Read todas las compras
readBuys();
function readBuys() {
    const tbody = document.getElementById('tbodyCompra');
    tbody.innerHTML = '';
    comprasPorPagina = Number(buyForPage.value);
    let formData = new FormData();
    formData.append('readBuy', searchCompra.value);
    formData.append('orderByBuy', orderByBuy);
    formData.append('selectSearchCompra', returnSelectSearchCompra());
    fetch('../controladores/compras.php', {
        method: "POST",
        body: formData
    }).then(response => response.json()).then(data => {
        compras = JSON.parse(JSON.stringify(data));
        totalCompras = Object.values(data).length;
        allPages = Math.ceil(totalCompras / comprasPorPagina);
        paginacionCompra(allPages, globalPageBuy, totalCompras);
    }).catch(err => console.log(err));
}*/



/*

*/
//<<---------------------------------CRUD COMPRA----------------------------------------->>

//------READ COMPRA
/*function readBuy(tr) {
    addProductoClave = 'M';
    claveSendSupplier = 'M';
    claveSendEnterprise = 'M';
    let id_cmp = tr.children[1].innerText;
    let formData = new FormData();
    formData.append('readABuy', id_cmp);
    fetch('../controladores/compras.php', {
        method: "POST",
        body: formData
    }).then(response => response.json()).then(data => {
        let compra = data['compra'];
        for (let clave in compra) {
            if (clave == 'fecha_cmp') {
                document.getElementsByName(clave + 'M')[0].value = compra[clave].slice(0, 10);
            } else if (clave == 'id_prov') {
                selectSupplierM.innerHTML = '';
                let option = document.createElement('option');
                option.value = compra[clave];
                option.innerText = compra['proveedor_prov'];
                selectSupplierM.appendChild(option);
            } else if (clave == 'proveedor_prov') {
            } else if (clave == 'id_empp') {
                selectEnterpriseM.innerHTML = '';
                let option = document.createElement('option');
                option.value = compra[clave];
                option.innerText = compra['sigla_empp'];
                selectEnterpriseM.appendChild(option);
            } else if (clave == 'sigla_empp') {
            } else {
                document.getElementsByName(clave + 'M')[0].value = compra[clave];
            }
        }
        //-----Mostrar los productos en el modal cmp_prod
        let modalCmp_prod = document.querySelector('#cmp_prodMMW div.modal__body');
        modalCmp_prod.innerHTML = '';
        for (let clave in data['cmp_prod']) {
            listProducts(data['cmp_prod'][clave], 'M');
        }
    }).catch(err => console.log(err));
    buyMMW.classList.add('modal__show');
}
//------UPDATE Compra
let formBuyM = document.getElementById('formBuyM');
formBuyM.addEventListener('submit', updateABuy)
function updateABuy() {
    event.preventDefault();
    let productos = document.querySelectorAll('#cmp_prodMMW div.modal__body .cart-item');
    if (productos.length > 0) {
        let arrayOfObjects = [];
        productos.forEach(producto => {
            let jsonObject = {};
            jsonObject['codigo'] = producto.children[2].innerHTML;
            jsonObject['cantidad'] = producto.children[3].value;
            arrayOfObjects.push(jsonObject);
        });
        let stringJson = JSON.stringify(arrayOfObjects);
        let form = document.getElementById('formBuyM');
        let formData = new FormData(form);
        buyMMW.classList.remove('modal__show');
        formData.append('updateCompra', stringJson);
        fetch('../controladores/compras.php', {
            method: "POST",
            body: formData
        }).then(response => response.text()).then(data => {
            readBuys();
        }).catch(err => console.log(err));
    } else {
        alert('No a seleccionado ningun producto');
    }
}
//------Delete Compra
function deleteCompra(tr) {
    let id_cmp = tr.children[1].innerText;
    let formData = new FormData();
    formData.append('deleteCompra', id_cmp);
    fetch('../controladores/compras.php', {
        method: "POST",
        body: formData
    }).then(response => response.text()).then(data => {
        readBuys();
    }).catch(err => console.log(err));
}*/
/*


const closeCmp_prodMMW = document.getElementById('closeCmp_prodMMW');
const cmp_prodMMW = document.getElementById('cmp_prodMMW');
function openCmp_prodMMW() {
    cmp_prodMMW.classList.add('modal__show');
}
closeCmp_prodMMW.addEventListener('click', (e) => {
    cmp_prodMMW.classList.remove('modal__show');
});


*/

//<<--------------------------------------------------PROVEEDOR---------------------------------------------->>






/*

inputRequireFormEnterprise();
function inputRequireFormEnterprise() {
    document.getElementById('selectPageEmpMW').selectedIndex = 3;
}
function initialPageSelectEmp() {
    globalPageEmp = 1;
    readEnterprises();
}
//--------Buscar venta

function selectSearchEnterpriseMW() {
    let options = selectSearchEmpMW.querySelectorAll('option');
    let arraySearch = [];
    if (selectSearchEmpMW.value == 'todas') {
        options.forEach(option => {
            if (option.value == 'todas') {
            } else {
                arraySearch.push(option.value);
            }
        })
    } else {
        arraySearch.push(selectSearchEmpMW.value)
    }
    return arraySearch;
}
//------Ordenar tabla descendente ascendente
let imgOrderEnterprise = document.querySelectorAll('.tbody__head--empMW');
imgOrderEnterprise.forEach(div => {
    div.children[0].addEventListener('click', function () {
        orderEnterpriseTableASC(this);
    });
    div.children[1].addEventListener('click', function () {
        orderEnterpriseTableDESC(this);
    });
})
let orderByEnterprise = 'id_empp DESC';
function orderEnterpriseTableASC(img) {
    orderByEnterprise = img.name;
    initialPageSelectEmp();
}
function orderEnterpriseTableDESC(img) {
    orderByEnterprise = img.name + ' DESC';
    initialPageSelectEmp();
}

//-----Comrpras por pagina
const selectPageEmpMW = document.getElementById('selectPageEmpMW');
selectPageEmpMW.addEventListener('change', initialPageSelectEmp)

//--------PaginacionEmpresa
function paginacionEmpresa(allPages, page, totalEmpresas) {
    let ulVenta = document.querySelector('#wrapperEmpMW ul');
    globalPageEmp = page;
    let li = '';
    let beforePages = page - 1;
    let afterPages = page + 1;
    let liActive;
    totalPaginasEmpresa(page, totalEmpresas);
    enterpriseTableMW(page);
    if (page > 1) {
        li += `<li class="btn" onclick="paginacionEmpresa(allPages, ${page - 1}, totalEmpresas)"><img src="../imagenes/arowLeft.svg"></li>`;
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
        li += `<li class="numb ${liActive}" onclick="paginacionEmpresa(allPages, ${pageLength}, totalEmpresas)"><span>${pageLength}</span></li>`;
    }
    if (page < allPages) {
        li += `<li class="btn" onclick="paginacionEmpresa(allPages, ${page + 1}, totalEmpresas)"><img src="../imagenes/arowRight.svg"></li>`;
    }
    ulVenta.innerHTML = li;
}
function totalPaginasEmpresa(page, totalEmpresas) {
    const h2 = document.querySelector('#showPageEmpMW h2');
    h2.innerHTML = `Pagina ${page}/${allPages}, ${totalEmpresas} Empresas`;
}





*/










//<<---------------------------------------TABLA MODAL EMPRESA--------------------------------------->>
/*


function fillSelectSupplier(select, index) {
    select.innerHTML = '';
    for (let enterprise in enterprises) {
        let option = document.createElement('option');
        option.value = enterprises[enterprise]['id_empP'];
        option.innerText = enterprises[enterprise]['nombre_empP'];
        select.appendChild(option);
    }
    if (index > 0) { select.value = index }
}













let Proveedores = {};
/*function fillSelectSupplier(select, id_empp, index) {
    select.innerHTML = '';
    let formData = new FormData();
    formData.append('id_empp', id_empp);
    formData.append('leerProveedor', '');
    fetch('../controladores/clientes.php', {
        method: "POST",
        body: formData
    }).then(response => response.json()).then(data => {
        Proveedores = data;
        for (let clave in data) {
            let option = document.createElement('option');
            option.value = data[clave]['id_prov'];
            option.innerText = data[clave]['nombre_prov'] + ' ' + data[clave]['apellido_prov'];
            select.appendChild(option);
        }
        let options = select.querySelectorAll('option');
        options.forEach(option => {
            if (option.value == index) {
                select.value = index;
            }
        })
    }).catch(err => console.log(err));
}*/










/*





//<<---------------------------------LLENAR LA LISTA DE PROVEEDORS-------------------------------------->>
//-------LLENAR LA LISTA DE Proveedores



//------Llenar la empresa del cliente en el formulario de registrar nuevo cliente
function enterpriseOfCustomer(rm) {
    let selectEnterpriseR2 = document.getElementById('selectEnterpriseR2');
    let selectEnterprise = document.getElementById('selectEnterprise' + rm);
    selectEnterpriseR2.innerHTML = '';
    let option2 = document.createElement('option');
    option2.value = selectEnterprise.value;
    let options = selectEnterprise.querySelectorAll('option');
    let valor;
    options.forEach(option => {
        if (selectEnterprise.value == option.value) {
            valor = option.innerText;
        }
    })
    option2.innerText = valor;
    selectEnterpriseR2.appendChild(option2);
}








//--------Tabla de proforma
function enterpriseTableMW(page) {
    const tbody = document.getElementById('tbodyEmpMW');
    inicio = (page - 1) * empresasPorPagina;
    final = inicio + empresasPorPagina;
    i = 1;
    tbody.innerHTML = '';
    for (let empresa in empresas) {
        if (i > inicio && i <= final) {
            let tr = document.createElement('tr');
            for (let dato in empresas[empresa]) {
                let td = document.createElement('td');
                if (dato == 'id_empp') {
                    td.innerText = i;
                    tr.appendChild(td);
                    i++;
                    td = document.createElement('td');
                    td.innerText = empresas[empresa][dato];
                    td.setAttribute('hidden', '');
                    tr.appendChild(td);
                } else {
                    td.innerText = empresas[empresa][dato];
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
//------select Enterprise
let claveSendEnterprise;
function sendEnterprise(tr) {
    let id_empp = tr.children[1].innerText;
    let select = document.getElementById('selectEnterprise' + claveSendEnterprise);
    let options = select.querySelectorAll('option');
    options.forEach((option, index) => {
        if (option.value == id_empp) {
            select.selectedIndex = index;
            enterpriseSMW.classList.remove('modal__show');
        }
    })
    fillSelectSupplier(selectSupplierR, select.value, 0);
}





//---------------------------------------------TABLA MODAL INVENTARIOMW------------------------------------------------------------
espacioObligatorioInvMW();
function espacioObligatorioInvMW() {
    //paginas por producto
    document.getElementById('inventoryForPageMW').selectedIndex = 3;
}
//-------Mostrar tabla
let selectSearchInvenMW = document.getElementById('selectSearchInvenMW');
selectSearchInvenMW.addEventListener('change', pageOneInvMW);
function pageOneInvMW() {
    globalPageInv = 1;
    readAllInventoryMW();
}
function returnSSInventoryMW() {
    let options = selectSearchInvenMW.querySelectorAll('option');
    let arraySearch = [];
    if (selectSearchInvenMW.value == 'todas') {
        options.forEach(option => {
            if (option.value == 'todas') {
            } else {
                arraySearch.push(option.value);
            }
        })
    } else {
        arraySearch.push(selectSearchInvenMW.value)
    }
    return arraySearch;
}
//------Ordenar tabla descendente ascendente
let orderImgsInventory = document.querySelectorAll('.tbody__head--invMW');
orderImgsInventory.forEach(div => {
    div.children[0].addEventListener('click', function () {
        orderInventoryTableASC(this);
    });
    div.children[1].addEventListener('click', function () {
        orderInventoryTableDESC(this);
    });
})
let orderByInventory = 'id_inv DESC';
function orderInventoryTableASC(img) {
    orderByInventory = img.name;
    pageOneInvMW();
}
function orderInventoryTableDESC(img) {
    orderByInventory = img.name + ' DESC';
    pageOneInvMW();
}
//------BUSCAR
const searchInputInvMW = document.getElementById("searchInputInvMW");
searchInputInvMW.addEventListener("keyup", e => {
    if (e.key == 'Enter') { pageOneInvMW() }
    if (searchInputInvMW.value == '') { pageOneInvMW() }
});
const selectMarcaInvMW = document.getElementById('selectMarcaInvMW');
const selectCategoriaInvMW = document.getElementById('selectCategoriaInvMW');
selectMarcaInvMW.addEventListener('change', pageOneInvMW);
selectCategoriaInvMW.addEventListener('change', pageOneInvMW);
let inventarioMW = {};
let globalPageInvMW = 1;
let invPorPaginaMW;
let totalInventarioMW;
//-------Productos por pagina
const inventoryForPageMW = document.getElementById('inventoryForPageMW');
inventoryForPageMW.addEventListener('change', pageOneInvMW)
//leet todos los productos del inventario
/*readAllInventoryMW();
function readAllInventoryMW() {
    let tbody = document.getElementById('tbodyInvMW');
    tbody.innerHTML = '';
    invPorPaginaMW = Number(inventoryForPageMW.value);
    let formData = new FormData();
    formData.append('marca', selectMarcaInvMW.value);
    formData.append('categoria', selectCategoriaInvMW.value);
    formData.append('readTable', searchInputInvMW.value);
    formData.append('orderByInventory', orderByInventory);
    formData.append('selectSearch', returnSSInventoryMW());
    fetch('../controladores/inventario.php', {
        method: "POST",
        body: formData
    }).then(response => response.text()).then(data => {
        console.log(data);
        inventarioMW = data;
        totalInventarioMW = Object.values(data).length;
        allPages = Math.ceil(totalInventarioMW/invPorPaginaMW);
        paginacionInventarioMW(allPages,globalPageInvMW,totalInventarioMW);
    }).catch(err => console.log(err));
}*/
//<<----------------------------------PAGINACION Inventario-------------------------------------------->>

/*function paginacionInventarioMW(allPages, page, totalInventarioMW) {
    let ul = document.querySelector('#wrapperInvMW ul');
    globalPageInvMW = page;
    let li = '';
    let beforePages = page - 1;
    let afterPages = page + 1;
    let liActive;
    allPageInventoryMW(page, totalInventarioMW);
    inventoryTableMW(page);
    if (page > 1) {
        li += `<li class="btn" onclick="paginacionInventarioMW(allPages, ${page - 1}, totalInventarioMW)"><img src="../imagenes/arowLeft.svg"></li>`;
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
        li += `<li class="numb ${liActive}" onclick="paginacionInventarioMW(allPages, ${pageLength}, totalInventarioMW)"><span>${pageLength}</span></li>`;
    }
    if (page < allPages) {
        li += `<li class="btn" onclick="paginacionInventarioMW(allPages, ${page + 1}, totalInventarioMW)"><img src="../imagenes/arowRight.svg"></li>`;
    }
    ul.innerHTML = li;
}
function allPageInventoryMW(page, totalInventarioMW) {
    let h2 = document.querySelector('#showPageInvMW h2');
    h2.innerHTML = `Pagina ${page}/${allPages}, ${totalInventarioMW} Productos`;
}
//-----------TABLA
function inventoryTableMW(page) {
    let tbody = document.getElementById('tbodyInvMW');
    inicio = (page - 1) * invPorPaginaMW;
    final = inicio + invPorPaginaMW;
    i = 1;
    tbody.innerHTML = '';
    if (inventarioMW == '') {
        tbody.innerHTML = 'NO HAY';
    } else {
        tbody.innerHTML = '';
        html = '';
        i = 1;
        for (let producto in inventarioMW) {
            if (i > inicio && i <= final) {
                html += '<tr>';
                html += '<td>' + i + '</td>';
                for (let x_prod in inventarioMW[producto]) {
                    if (x_prod == 'id_prod' || x_prod == 'id_inv') {
                        html += '<td hidden="">' + inventarioMW[producto][x_prod] + '</td>';
                    } else if (x_prod == 'imagen_prod') {
                        html += "<td><img src='../modelos/imagenes/" + inventarioMW[producto][x_prod] + "' class='tbody__img'></td>";
                    } else {
                        html += '<td>' + inventarioMW[producto][x_prod] + '</td>';
                    }
                }
                html += `<td>
                <img src='../imagenes/send.svg' onclick='addProduct(this.parentNode.parentNode)'>
                </td>`;
                html += '</tr>';
                i++;
            } else {
                i++;
            }
        }
        tbody.innerHTML = html;
    }
}
function addProduct(tr) {
    let id_prod = tr.children[2].innerText;
    for (let inventario in inventarioMW) {
        if (inventarioMW[inventario]['id_prod'] == id_prod) {
            let modalProf_prod = document.querySelector('#cmp_prod' + addProductoClave + 'MW div.modal__body');
            let prof_prods = modalProf_prod.querySelectorAll('.cart-item');
            let i = 0;
            prof_prods.forEach(prod => {
                let codigo = prod.children[2].innerText;
                if (codigo == inventarioMW[inventario]['codigo_prod']) {
                    i++;
                }
            })
            if (i == 0) {
                listProducts(inventarioMW[inventario], addProductoClave);
            } else {
                alert("El producto ya se encuentra en la lista");
            }
        }
    }
}



function listProducts(product, rm) {
    let modalCmp_prod = document.querySelector('#cmp_prod' + rm + 'MW div.modal__body');
    let cantidad_inv;
    let imagen_prod = product['imagen_prod'];
    let codigo_prod = product['codigo_prod'];

    for (let producto in allInventory) {
        if (producto == codigo_prod) {
            cantidad_inv = allInventory[producto]['cantidad_inv'];
            break;
        } else {
            cantidad_inv = 0;
        }
    }
    if (rm == 'R') {
        cantidad_pfpd = 1;
    } else if (rm == 'M') {
        cantidad_pfpd = product['cantidad_cppd'];
    }

    let div__cart = document.createElement('div');
    div__cart.classList.add('cart-item');
    let p_stock = document.createElement('p');
    p_stock.classList.add('cart-item__cantInv2');
    p_stock.innerHTML = cantidad_inv;
    let div_img = document.createElement('div');
    div_img.classList.add('row-img');
    let img = document.createElement('img');
    img.classList.add('rowimg');
    img.setAttribute('src', `../modelos/imagenes/${imagen_prod}`);
    div_img.appendChild(img);
    let p_codigo = document.createElement('p');
    p_codigo.classList.add('cart-item__codigo2');
    p_codigo.innerHTML = codigo_prod;
    let input_cantidad = document.createElement('input');
    input_cantidad.classList.add('cart-item__cantidad');
    input_cantidad.setAttribute('type', 'number');
    input_cantidad.setAttribute('value', cantidad_pfpd);
    input_cantidad.setAttribute('min', 1);


    let imgTrash = document.createElement('img');
    imgTrash.setAttribute('src', '../imagenes/trash.svg');
    imgTrash.addEventListener('click', function () {
        removeProduct(imgTrash.parentNode, rm);
    })


    div__cart.appendChild(p_stock);
    div__cart.appendChild(div_img);
    div__cart.appendChild(p_codigo);
    div__cart.appendChild(input_cantidad);
    div__cart.appendChild(imgTrash);
    modalCmp_prod.appendChild(div__cart);
    //drag drop
    div__cart.setAttribute('draggable', true)
    div__cart.addEventListener("dragstart", () => {
        setTimeout(() => div__cart.classList.add("dragging"), 0);
    });
    div__cart.addEventListener("dragend", () => div__cart.classList.remove("dragging"));

    itemProduct = modalCmp_prod.querySelectorAll('div.cart-item');
    document.getElementById('count_cppd' + rm).innerHTML = itemProduct.length;
}

let modalCmp_prodR = document.querySelector('#cmp_prodRMW div.modal__body');
let modalCmp_prodM = document.querySelector('#cmp_prodMMW div.modal__body');
const initSortableListR = (e) => {
    e.preventDefault();
    const draggingItem = document.querySelector(".dragging");
    // Getting all items except currently dragging and making array of them
    let siblings = [...modalCmp_prodR.querySelectorAll(".cart-item:not(.dragging)")];

    // Finding the sibling after which the dragging item should be placed
    let nextSibling = siblings.find(sibling => {
        return e.clientY <= sibling.offsetTop + sibling.offsetHeight / 2;
    });

    // Inserting the dragging item before the found sibling
    modalCmp_prodR.insertBefore(draggingItem, nextSibling);
}
const initSortableListM = (e) => {
    e.preventDefault();
    const draggingItem = document.querySelector(".dragging");
    // Getting all items except currently dragging and making array of them
    let siblings = [...modalCmp_prodM.querySelectorAll(".cart-item:not(.dragging)")];

    // Finding the sibling after which the dragging item should be placed
    let nextSibling = siblings.find(sibling => {
        return e.clientY <= sibling.offsetTop + sibling.offsetHeight / 2;
    });

    // Inserting the dragging item before the found sibling
    modalCmp_prodM.insertBefore(draggingItem, nextSibling);
}
modalCmp_prodR.addEventListener("dragover", initSortableListR);
modalCmp_prodR.addEventListener("dragenter", e => e.preventDefault());
modalCmp_prodM.addEventListener("dragover", initSortableListM);
modalCmp_prodM.addEventListener("dragenter", e => e.preventDefault());

//-------Eliminar producto de la lista
function removeProduct(product, rm) {
    let listProducts = document.querySelector('#cmp_prod' + rm + 'MW div.modal__body');
    let itemProduct = listProducts.querySelectorAll('div.cart-item');
    listProducts.removeChild(product);

    itemProduct = listProducts.querySelectorAll('div.cart-item');
    document.getElementById('count_cppd' + rm).innerHTML = itemProduct.length;
}
*/