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
selectEnterpriseM.addEventListener('change', function () {
    fillSelectClte(selectEnterpriseM, selectSupplierM);
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
        fillSelectEmp(selectEnterpriseM, selectSupplierM);
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
//readBuys();
function readBuys() {
    let formData = new FormData();
    formData.append('readBuys', '');
    fetch('../controladores/compras.php', {
        method: "POST",
        body: formData
    }).then(response => response.json()).then(data => {
        buys = JSON.parse(JSON.stringify(data));
        filterBuys = buys;
    }).catch(err => console.log(err));
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
    for (let product in productsMW) {
        for (let valor in productsMW[product]) {
            if (selectSearchProdMW.value == 'todas') {
                if (valor == 'codigo_prod' || valor == 'nombre_prod' || valor == 'descripcion_prod') {
                    if (productsMW[product][valor].toLowerCase().indexOf(inputSearchProdMW.value.toLowerCase()) >= 0) {
                        filterProductsMW[product] = productsMW[product];
                        break;
                    }
                }
            } else {
                if (valor == selectSearchProdMW.value) {
                    if (productsMW[product][valor].toLowerCase().indexOf(inputSearchProdMW.value.toLowerCase()) >= 0) {
                        filterProductsMW[product] = productsMW[product];
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
            let prof_prods = modalProf_prod.querySelectorAll('.cart-item');
            let i = 0;
            prof_prods.forEach(prod => {
                let codigo = prod.children[2].innerText;
                if (codigo == filterProductsMW[product]['codigo_prod']) {
                    i++;
                }
            })
            if (i == 0) {
                cartProduct_pfpd(filterProductsMW[product]);
            } else {
                alert("El producto ya se encuentra en la lista");
            }
        }
    }
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
readAllBuy();
function readAllBuy() {
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

espaciosObligatoriosBuy();
function espaciosObligatoriosBuy() {
    document.getElementById('buyForPage').selectedIndex = 3;
}
function pageOneBuy() {
    globalPageBuy = 1;
    readAllBuy();
}
//--------Buscar compra
let selectSearchCompra = document.getElementById('selectSearchCompra');
selectSearchCompra.addEventListener('change', pageOneBuy);
function returnSelectSearchCompra() {
    let options = selectSearchCompra.querySelectorAll('option');
    let arraySearch = [];
    if (selectSearchCompra.value == 'todas') {
        options.forEach(option => {
            if (option.value == 'todas') {
            } else {
                arraySearch.push(option.value);
            }
        })
    } else {
        arraySearch.push(selectSearchCompra.value)
    }
    return arraySearch;
}
//------Ordenar tabla descendente ascendente
let orderImgsBuy = document.querySelectorAll('.tbody__head--buy');
orderImgsBuy.forEach(div => {
    div.children[0].addEventListener('click', function () {
        orderBuyTableASC(this);
    });
    div.children[1].addEventListener('click', function () {
        orderBuyTableDESC(this);
    });
})
let orderByBuy = 'id_cmp DESC';  //Para que se muestre la ultima  compra
function orderBuyTableASC(img) {
    orderByBuy = img.name;
    pageOneBuy();
}
function orderBuyTableDESC(img) {
    orderByBuy = img.name + ' DESC';
    pageOneBuy();
}
const searchCompra = document.getElementById("buscarCompra");
searchCompra.addEventListener("keyup", e => {
    if (e.key == 'Enter') { pageOneBuy() }
    if (searchCompra.value == '') { pageOneBuy() }
});
//-----Comrpras por pagina

//--------PaginacionCompra
function paginacionCompra(allPages, page, totalCompras) {
    let ulCompra = document.querySelector('#wrapperBuy ul');
    globalPageBuy = page;
    let li = '';
    let beforePages = page - 1;
    let afterPages = page + 1;
    let liActive;
    totalPaginasCompra(page, totalCompras);
    buyTable(page);
    if (page > 1) {
        li += `<li class="btn" onclick="paginacionCompra(allPages, ${page - 1}, totalCompras)"><img src="../imagenes/arowLeft.svg"></li>`;
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
        li += `<li class="numb ${liActive}" onclick="paginacionCompra(allPages, ${pageLength}, totalCompras)"><span>${pageLength}</span></li>`;
    }
    if (page < allPages) {
        li += `<li class="btn" onclick="paginacionCompra(allPages, ${page + 1}, totalCompras)"><img src="../imagenes/arowRight.svg"></li>`;
    }
    ulCompra.innerHTML = li;
}
function totalPaginasCompra(page, totalCompras) {
    let h2 = document.querySelector('#showPageBuy h2');
    h2.innerHTML = `Pagina ${page}/${allPages}, ${totalCompras} compras`;
}
//--------Tabla de compras
function buyTable(page) {
    const tbody = document.getElementById('tbodyCompra');
    inicio = (page - 1) * comprasPorPagina;
    final = inicio + comprasPorPagina;
    i = 1;
    tbody.innerHTML = '';
    for (let Compra in compras) {
        if (i > inicio && i <= final) {
            let tr = document.createElement('tr');
            for (let dato in compras[Compra]) {
                let td = document.createElement('td');
                if (dato == 'id_cmp') {
                    td.innerText = i;
                    tr.appendChild(td);
                    i++;
                    td = document.createElement('td');
                    td.innerText = compras[Compra][dato];
                    td.setAttribute('hidden', '');
                    tr.appendChild(td);
                } else if (dato == 'fecha_cmp') {
                    td.innerText = compras[Compra][dato].slice(0, 10);
                    tr.appendChild(td);
                } else if (dato == 'telefono_empp') {
                } else if (dato == 'celular_prov') {
                } else {
                    td.innerText = compras[Compra][dato];
                    tr.appendChild(td);
                }
            }
            let td = document.createElement('td');
            td.innerHTML = `
        <img src='../imagenes/edit.svg' onclick='readBuy(this.parentNode.parentNode)'>
        <img src='../imagenes/trash.svg' onclick='deleteCompra(this.parentNode.parentNode)'>`;
            tr.appendChild(td);
            tbody.appendChild(tr);
        } else {
            i++;
        }
    }
}*/
//<<---------------------------------CRUD COMPRA----------------------------------------->>
//-------Create buy
/*let formBuyR = document.getElementById('formBuyR');
formBuyR.addEventListener('submit', createBuy);
function createBuy() {
    event.preventDefault();
    let productos = document.querySelectorAll('#cmp_prodRMW div.modal__body .cart-item');
    if (productos.length > 0) {
        let arrayOfObjects = [];
        productos.forEach(producto => {
            let jsonObject = {};
            jsonObject['codigo'] = producto.children[2].innerHTML;
            jsonObject['cantidad'] = producto.children[3].value;
            arrayOfObjects.push(jsonObject);
        });
        let stringJson = JSON.stringify(arrayOfObjects);
        let formData = new FormData(formBuyR);
        buyRMW.classList.remove('modal__show');
        formData.append('createBuy', stringJson);
        fetch('../controladores/compras.php', {
            method: "POST",
            body: formData
        }).then(response => response.text()).then(data => {
            readAllBuy();
        }).catch(err => console.log(err));
    } else {
        alert('No a seleccionado ningun producto');
    }
}
//------READ COMPRA
function readBuy(tr) {
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
            readAllBuy();
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
        readAllBuy();
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


/*----------------------------------------------Marca y categoria-------------------------------------------------*/
//-------registrar Marca
/*let formMarcaR = document.getElementById('formMarcaR');
formMarcaR.addEventListener('submit', createMarca);
function createMarca() {
    event.preventDefault();
    let formData = new FormData(formMarcaR);
    formData.append('createMarca', '');
    fetch('../controladores/productos.php', {
        method: "POST",
        body: formData
    }).then(response => response.text()).then(data => {
        readAllMarcas();
        marcaRMW.classList.remove('modal__show');
    }).catch(err => console.log(err));
}
/*readAllMarcas();
function readAllMarcas() {
    let formData = new FormData();
    formData.append('readMarca', '');
    fetch('../controladores/productos.php', {
            method: "POST",
            body: formData
    }).then(response => response.json()).then(data => {
        let selects = document.querySelectorAll('.select__marca');
        selects.forEach(select=>{
            select.innerHTML = '';
            let option = document.createElement('option');
            option.value = 'todasLasMarcas';
            option.innerText = 'Todas las marcas';
            select.appendChild(option); 
            for ( let clave in data){
                let option = document.createElement('option');
                option.value = data[clave]['nombre_mrc'];
                option.innerText = data[clave]['nombre_mrc'];
                select.appendChild(option);
            }
        })
    }).catch(err => console.log(err));
}*/
/*function deleteMarca() {
    let nombre_mrc = selectMarcaProduct.value;
    if (confirm('¿Esta usted seguro?')) {
        let formData = new FormData();
        formData.append('deleteMarca', nombre_mrc);
        fetch('../controladores/productos.php', {
            method: "POST",
            body: formData
        }).then(response => response.text()).then(data => {
            readAllMarcas();
        }).catch(err => console.log(err));
    }
    selectMarcaProduct.selectedIndex = 0;
    pageOneProd();
}
//-------registrar categoria
/*let formCategoriaR = document.getElementById('formCategoriaR');
formCategoriaR.addEventListener('submit', createCategoria);
function createCategoria() {
    event.preventDefault();
    let formData = new FormData(formCategoriaR);
    formData.append('createCategoria', '');
    fetch('../controladores/productos.php', {
        method: "POST",
        body: formData
    }).then(response => response.text()).then(data => {
        readAllCategorias();
        categoriaRMW.classList.remove('modal__show');
    }).catch(err => console.log(err));
}
/*readAllCategorias();
function readAllCategorias() {
    let formData = new FormData();
    formData.append('readCategoria', '');
    fetch('../controladores/productos.php', {
            method: "POST",
            body: formData
    }).then(response => response.json()).then(data => {
        let selects = document.querySelectorAll('.select__categoria');
        selects.forEach(select=>{
            select.innerHTML = ''; 
            let option = document.createElement('option');
            option.value = 'todasLasCategorias';
            option.innerText = 'Todas las categorias';
            select.appendChild(option);
            for ( let clave in data){
                let option = document.createElement('option');
                option.value = data[clave]['nombre_ctgr'];
                option.innerText = data[clave]['nombre_ctgr'];
                select.appendChild(option);
            }
        })  
    }).catch(err => console.log(err));
}*/
/*function deleteCategoria() {
    let nombre_ctgr = selectCategoriaProduct.value;
    if (confirm('¿Esta usted seguro?')) {
        let formData = new FormData();
        formData.append('deleteCategoria', nombre_ctgr);
        fetch('../controladores/productos.php', {
            method: "POST",
            body: formData
        }).then(response => response.text()).then(data => {
            readAllCategorias();
        }).catch(err => console.log(err));
    }
    selectCategoriaProduct.selectedIndex = 0;
    pageOneProd();
}
//<<------------------------ABRIR Y CERRAR VENTANAS MODALES--------------------------------->>
/*const marcaRMW = document.getElementById('marcaRMW');
const closeMarcaRMW = document.getElementById('closeMarcaRMW');
function openMarcaRMW() {
    marcaRMW.classList.add('modal__show');
}
closeMarcaRMW.addEventListener('click', (e) => {
    marcaRMW.classList.remove('modal__show');
});

const categoriaRMW = document.getElementById('categoriaRMW');
const closeCategoriaRMW = document.getElementById('closeCategoriaRMW');
function openCategoriaRMW() {
    categoriaRMW.classList.add('modal__show');
}
closeCategoriaRMW.addEventListener('click', (e) => {
    categoriaRMW.classList.remove('modal__show');
});


//-----------------------------------------GUARDAR EL TOTAL DE PRODUCTOS DEL INVENTARIO-----------------------------------
/*let allInventory;
constReadAllInventory()
function constReadAllInventory(){
    let formData = new FormData();
    formData.append('readAllInventory', '');
    fetch('../controladores/inventario.php', {
        method: "POST",
        body: formData
    }).then(response => response.json()).then(data => {
        allInventory = data; 
    }).catch(err => console.log(err));
}*/
