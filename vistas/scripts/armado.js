//----------------------------------------------BLOCK REQUEST WITH A FLAG----------------------------------------------
let rqstCreateArmed = false;
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
//--------------------------------------------TABLE ARMED------------------------------------
//------read armed
let armeds = {};
let filterArmeds = {};
readArmeds();
function readArmeds() {
    let formData = new FormData();
    formData.append('readArmeds', '');
    fetch('../controladores/armado.php', {
        method: "POST",
        body: formData
    }).then(response => response.json()).then(data => {
        armeds = data;
        filterArmeds = armeds;
        paginacionArmed(Object.values(filterArmeds).length, 1);
    }).catch(err => console.log(err));

}
//------Select utilizado para buscar por columnas
const selectSearchRmd = document.getElementById('selectSearchRmd');
selectSearchRmd.addEventListener('change', searchArmeds);
//------buscar por input
const inputSerchRmd = document.getElementById("inputSerchRmd");
inputSerchRmd.addEventListener("keyup", searchArmeds);
//------Clientes por pagina
const selectNumberRmd = document.getElementById('selectNumberRmd');
selectNumberRmd.selectedIndex = 3;
selectNumberRmd.addEventListener('change', function () {
    paginacionArmed(Object.values(filterArmeds).length, 1);
});
//------buscar por:
function searchArmeds() {
    filterArmeds = {};
    for (let customer in armeds) {
        for (let valor in armeds[customer]) {
            if (selectSearchRmd.value == 'todas') {
                if (valor == 'numero_rmd' || valor == 'fecha_rmd' || valor == 'proforma_rmd' || valor == 'nombre_usua' || valor == 'codigo_rdpd' || valor == 'estado_rdpd' || valor == 'observacion_rmd') {
                    if (valor == 'nombre_usua') {
                        if ((armeds[customer][valor] + ' ' + armeds[customer]['apellido_usua']).toLowerCase().indexOf(inputSerchRmd.value.toLowerCase()) >= 0) {
                            filterArmeds[customer] = armeds[customer];
                            break;
                        }
                    } else {
                        if (armeds[customer][valor].toLowerCase().indexOf(inputSerchRmd.value.toLowerCase()) >= 0) {
                            filterArmeds[customer] = armeds[customer];
                            break;
                        }
                    }
                }
            } else if (selectSearchRmd.value == 'encargado') {
                if (valor == 'nombre_usua') {
                    if ((armeds[customer][valor] + ' ' + armeds[customer]['apellido_usua']).toLowerCase().indexOf(inputSerchRmd.value.toLowerCase()) >= 0) {
                        filterArmeds[customer] = armeds[customer];
                        break;
                    }
                }
            } else {
                if (valor == selectSearchRmd.value) {
                    if (armeds[customer][valor].toLowerCase().indexOf(inputSerchRmd.value.toLowerCase()) >= 0) {
                        filterArmeds[customer] = armeds[customer];
                        break;
                    }
                }
            }
        }
    }
    paginacionArmed(Object.values(filterArmeds).length, 1);
}
//------Ordenar tabla descendente ascendente
let orderCustomers = document.querySelectorAll('.tbody__head--customer');
orderCustomers.forEach(div => {
    div.children[0].addEventListener('click', function () {
        let array = Object.entries(filterArmeds).sort((a, b) => {
            let first = a[1][div.children[0].name].toLowerCase();
            let second = b[1][div.children[0].name].toLowerCase();
            if (first < second) { return -1 }
            if (first > second) { return 1 }
            return 0;
        })
        filterArmeds = Object.fromEntries(array);
        paginacionArmed(Object.values(filterArmeds).length, 1);
    });
    div.children[1].addEventListener('click', function () {
        let array = Object.entries(filterArmeds).sort((a, b) => {
            let first = a[1][div.children[0].name].toLowerCase();
            let second = b[1][div.children[0].name].toLowerCase();
            if (first > second) { return -1 }
            if (first < second) { return 1 }
            return 0;
        })
        filterArmeds = Object.fromEntries(array);
        paginacionArmed(Object.values(filterArmeds).length, 1);
    });
})
//------PaginacionArmed
function paginacionArmed(allCustomers, page) {
    let numberCustomers = Number(selectNumberRmd.value);
    let allPages = Math.ceil(allCustomers / numberCustomers);
    let ul = document.querySelector('#wrapperCustomer ul');
    let li = '';
    let beforePages = page - 1;
    let afterPages = page + 1;
    let liActive;
    if (page > 1) {
        li += `<li class="btn" onclick="paginacionArmed(${allCustomers}, ${page - 1})"><img src="../imagenes/arowLeft.svg"></li>`;
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
        li += `<li class="numb ${liActive}" onclick="paginacionArmed(${allCustomers}, ${pageLength})"><span>${pageLength}</span></li>`;
    }
    if (page < allPages) {
        li += `<li class="btn" onclick="paginacionArmed(${allCustomers}, ${page + 1})"><img src="../imagenes/arowRight.svg"></li>`;
    }
    ul.innerHTML = li;
    let h2 = document.querySelector('#showPageCustomer h2');
    h2.innerHTML = `Pagina ${page}/${allPages}, ${allCustomers} Productos`;
    tableArmed(page);
}
//------Crear la tabla
function tableArmed(page) {
    let tbody = document.getElementById('tbodyCustomer');
    inicio = (page - 1) * Number(selectNumberRmd.value);
    final = inicio + Number(selectNumberRmd.value);
    i = 1;
    tbody.innerHTML = '';
    for (let customer in filterArmeds) {
        if (i > inicio && i <= final) {
            let tr = document.createElement('tr');
            for (let valor in filterArmeds[customer]) {
                let td = document.createElement('td');
                if (valor == 'id_rmd') {
                    td.innerText = filterArmeds[customer][valor];
                    td.setAttribute('hidden', '');
                    tr.appendChild(td);
                    td = document.createElement('td');
                    td.innerText = i;
                    tr.appendChild(td);
                    i++;
                } else if (valor == 'nombre_usua') {
                    td.innerText = filterArmeds[customer][valor] + ' ' + filterArmeds[customer]['apellido_usua'];
                    tr.appendChild(td);
                } else if (valor == 'apellido_usua') {
                } else {
                    td.innerText = filterArmeds[customer][valor];
                    tr.appendChild(td);
                }
            }
            tbody.appendChild(tr);
        } else {
            i++;
        }
    }
}
//---------------------------------------------CRUD ARMADO------------------------------------//
const columnOne = document.querySelectorAll('.double__list--box')[0];
const columnTwo = document.querySelectorAll('.double__list--box')[1];
//------Create armed
function createArmed() {
    if (columnOne.querySelectorAll('.cart-item').length > 0 && columnTwo.querySelectorAll('.cart-item').length > 0) {
        columnOne
        let carts = columnOne.querySelectorAll('.cart-item');
        let count = true;
        for (let i = 0; i < carts.length; i++) {
            if (Number(carts[i].children[1].innerText) < Number(carts[i].children[4].value)) {
                alert('No hay la cantidad suficiente en inventario del prducto: ' + carts[i].children[3].innerText);
                count = false;
                break; // Detiene la ejecución del bucle
            }
        }
        if (count == true) {
            formArmedRMW.classList.remove('modal__show');
            let array = [];
            columnOne.querySelectorAll('.cart-item').forEach(item => {
                let valor = {};
                valor['fk_id_prod_rdpd'] = item.children[0].value;
                valor['codigo_rdpd'] = item.children[3].innerText;
                valor['cantidad_rdpd'] = item.children[4].value;
                valor['estado_rdpd'] = 'baja';
                array.push(valor);
            })
            columnTwo.querySelectorAll('.cart-item').forEach(item => {
                let valor = {};
                valor['fk_id_prod_rdpd'] = item.children[0].value;
                valor['codigo_rdpd'] = item.children[3].innerText;
                valor['cantidad_rdpd'] = item.children[4].value;
                valor['estado_rdpd'] = 'agregado';
                array.push(valor);
            })
            if (confirm('¿Esta usted seguro?')) {
                if (rqstCreateArmed == false) {
                    rqstCreateArmed = true;
                    let form = document.getElementById("formArmedR");
                    let formData = new FormData(form);
                    formData.set("fecha_rmdR", `${dateActual[2]}-${dateActual[1]}-${dateActual[0]} ${datePart[1]}`);
                    formData.append('id_usua', localStorage.getItem('id_usua'));
                    formData.append('createArmed', JSON.stringify(array));
                    preloader.classList.add('modal__show');
                    fetch('../controladores/armado.php', {
                        method: 'POST',
                        body: formData
                    }).then(response => response.text()).then(data => {
                        preloader.classList.remove('modal__show');
                        rqstCreateArmed = false;
                        alert(data);
                        readArmeds();
                        cleanUpArmedFormR();
                        readInventories();
                    }).catch(err => {
                        rqstCreateArmed = false;
                        alert(err);
                    });
                }
            }
        }
    } else {
        alert('No es un armado correcto');
    }
}
function cleanUpArmedFormR() {
    document.getElementById('formArmedR').reset();
    columnOne.querySelectorAll('.cart-item').forEach(item => {
        item.remove();
    })
    columnTwo.querySelectorAll('.cart-item').forEach(item => {
        item.remove();
    })
}
//---------------------------MODAL FORM ARMADO
const formArmedRMW = document.getElementById('formArmedRMW');
closeFormArmedRMW = document.getElementById('closeFormArmedRMW');
function openFormArmedRMW() {
    document.getElementsByName('fecha_rmdR')[0].value = `${dateActual[2]}-${dateActual[1]}-${dateActual[0]}`;
    formArmedRMW.classList.add('modal__show');
}
closeFormArmedRMW.addEventListener('click', () => {
    formArmedRMW.classList.remove('modal__show');
});
//<<------------------------ABRIR Y CERRAR VENTANAS MODALES--------------------------------->>
//-----------------------------------Ventana modal para Armados---------------------------------//
const armedRMW = document.getElementById('armedRMW');
const closeArmedRMW = document.getElementById('closeArmedRMW');
function openArmedRMW() {
    armedRMW.classList.add('modal__show');
}
closeArmedRMW.addEventListener('click', () => {
    armedRMW.classList.remove('modal__show');
});
//-------------------------------------------------TABLA MODAL INVENTARIOMW------------------------------------------------------------
let inventories = {};
let filterInventoriesMW = {};
readInventories();
function readInventories() {
    let formData = new FormData();
    formData.append('readInventories', '');
    fetch('../controladores/inventario.php', {
        method: "POST",
        body: formData
    }).then(response => response.json()).then(data => {
        inventories = JSON.parse(JSON.stringify(data));
        filterInventoriesMW = inventories;
        paginacionInventoryMW(Object.values(data).length, 1);
    }).catch(err => console.log(err));
}
//------Select utilizado para buscar por columnas
const selectSearchInvMW = document.getElementById('selectSearchInvMW');
selectSearchInvMW.addEventListener('change', searchInventoriesMW);
//------buscar por input
const inputSearchInvMW = document.getElementById("inputSearchInvMW");
inputSearchInvMW.addEventListener("keyup", searchInventoriesMW);
//------Clientes por pagina
const selectNumberInvMW = document.getElementById('selectNumberInvMW');
selectNumberInvMW.selectedIndex = 3;
selectNumberInvMW.addEventListener('change', function () {
    paginacionInventoryMW(Object.values(filterInventoriesMW).length, 1);
});
//-------Marca y categoria
const selectMarcaInvMW = document.getElementById('selectMarcaInvMW');
selectMarcaInvMW.addEventListener('change', selectCategoriaInventoryMW);
const MWMW = document.getElementById('MWMW');
selectCategoriaInvMW.addEventListener('change', searchInventoriesMW);
//------buscar por:
function searchInventoriesMW() {
    filterInventoriesMW = {};
    for (let inventory in inventories) {
        for (let valor in inventories[inventory]) {
            if (selectSearchInvMW.value == 'todas') {
                if (valor == 'codigo_prod' || valor == 'nombre_prod' || valor == 'descripcion_prod' || valor == 'cost_uni_inv') {
                    if (inventories[inventory][valor].toLowerCase().indexOf(inputSearchInvMW.value.toLowerCase()) >= 0) {
                        filterInventoriesMW[inventory] = inventories[inventory];
                        break;
                    }
                }
            } else {
                if (valor == selectSearchInvMW.value) {
                    if (inventories[inventory][valor].toLowerCase().indexOf(inputSearchInvMW.value.toLowerCase()) >= 0) {
                        filterInventoriesMW[inventory] = inventories[inventory];
                        break;
                    }
                }
            }
        }
    }
    selectInventoriesMW();
}
//------buscar por marca y categoria:
function selectInventoriesMW() {
    if (selectMarcaInvMW.value == 'todasLasMarcas' && selectCategoriaInvMW.value == 'todasLasCategorias') {
        paginacionInventoryMW(Object.values(filterInventoriesMW).length, 1);
    } else {
        for (let ìnventory in filterInventoriesMW) {
            for (let valor in filterInventoriesMW[ìnventory]) {
                if (selectMarcaInvMW.value == 'todasLasMarcas') {
                    if (filterInventoriesMW[ìnventory]['id_ctgr'] != selectCategoriaInvMW.value) {
                        delete filterInventoriesMW[ìnventory];
                        break;
                    }
                } else if (selectCategoriaInvMW.value == 'todasLasCategorias') {
                    if (filterInventoriesMW[ìnventory]['id_mrc'] != selectMarcaInvMW.value) {
                        delete filterInventoriesMW[ìnventory];
                        break;
                    }
                } else {
                    if (filterInventoriesMW[ìnventory]['id_ctgr'] != selectCategoriaInvMW.value || filterInventoriesMW[ìnventory]['id_mrc'] != selectMarcaInvMW.value) {
                        delete filterInventoriesMW[ìnventory];
                        break;
                    }
                }
            }
        }
        paginacionInventoryMW(Object.values(filterInventoriesMW).length, 1);
    }
}
//------Ordenar tabla descendente ascendente
let orderInventoriesMW = document.querySelectorAll('.tbody__head--invMW');
orderInventoriesMW.forEach(div => {
    div.children[0].addEventListener('click', function () {
        let array = Object.entries(filterInventoriesMW).sort((a, b) => {
            let first = a[1][div.children[0].name].toLowerCase();
            let second = b[1][div.children[0].name].toLowerCase();
            if (first < second) { return -1 }
            if (first > second) { return 1 }
            return 0;
        })
        filterInventoriesMW = Object.fromEntries(array);
        paginacionInventoryMW(Object.values(filterInventoriesMW).length, 1);
    });
    div.children[1].addEventListener('click', function () {
        let array = Object.entries(filterInventoriesMW).sort((a, b) => {
            let first = a[1][div.children[0].name].toLowerCase();
            let second = b[1][div.children[0].name].toLowerCase();
            if (first > second) { return -1 }
            if (first < second) { return 1 }
            return 0;
        })
        filterInventoriesMW = Object.fromEntries(array);
        paginacionInventoryMW(Object.values(filterInventoriesMW).length, 1);
    });
})
//------PaginacionInventoryMW
function paginacionInventoryMW(allInventoriesMW, page) {
    let numberInventoriesMW = Number(selectNumberInvMW.value);
    let allPages = Math.ceil(allInventoriesMW / numberInventoriesMW);
    let ul = document.querySelector('#wrapperInvMW ul');
    let li = '';
    let beforePages = page - 1;
    let afterPages = page + 1;
    let liActive;
    if (page > 1) {
        li += `<li class="btn" onclick="paginacionInventoryMW(${allInventoriesMW}, ${page - 1})"><img src="../imagenes/arowLeft.svg"></li>`;
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
        li += `<li class="numb ${liActive}" onclick="paginacionInventoryMW(${allInventoriesMW}, ${pageLength})"><span>${pageLength}</span></li>`;
    }
    if (page < allPages) {
        li += `<li class="btn" onclick="paginacionInventoryMW(${allInventoriesMW}, ${page + 1})"><img src="../imagenes/arowRight.svg"></li>`;
    }
    ul.innerHTML = li;
    let h2 = document.querySelector('#showPageInvMW h2');
    h2.innerHTML = `Pagina ${page}/${allPages}, ${allInventoriesMW} Productos`;
    tableInventoriesMW(page);
}
//------Crear la tabla
function tableInventoriesMW(page) {
    let tbody = document.getElementById('tbodyInvMW');
    inicio = (page - 1) * Number(selectNumberInvMW.value);
    final = inicio + Number(selectNumberInvMW.value);
    i = 1;
    tbody.innerHTML = '';
    for (let inventory in filterInventoriesMW) {
        if (i > inicio && i <= final) {
            let tr = document.createElement('tr');
            for (let valor in filterInventoriesMW[inventory]) {
                let td = document.createElement('td');
                if (valor == 'id_inv') {
                    td.innerText = filterInventoriesMW[inventory][valor];
                    td.setAttribute('hidden', '');
                    tr.appendChild(td);
                } else if (valor == 'id_mrc') {
                } else if (valor == 'id_ctgr') {
                } else if (valor == 'fk_id_prod_inv') {
                    td.innerText = filterInventoriesMW[inventory][valor];
                    td.setAttribute('hidden', '');
                    tr.appendChild(td);
                    td = document.createElement('td');
                    td.innerText = i;
                    tr.appendChild(td);
                    i++;
                } else if (valor == 'imagen_prod') {
                    let img = document.createElement('img');
                    img.classList.add('tbody__img');
                    img.setAttribute('src', '../modelos/imagenes/' + filterInventoriesMW[inventory][valor]);
                    td.appendChild(img);
                    tr.appendChild(td);
                } else {
                    td.innerText = filterInventoriesMW[inventory][valor];
                    tr.appendChild(td);
                }
            }
            let td = document.createElement('td');
            td.innerHTML = `
        <img src='../imagenes/send.svg' onclick='sendInventory(this.parentNode.parentNode)'>`;
            tr.appendChild(td);
            tbody.appendChild(tr);
        } else {
            i++;
        }
    }
}
function sendInventory(tr) {
    let id_inv = tr.children[0].innerText;
    for (let inventario in filterInventoriesMW) {
        if (filterInventoriesMW[inventario]['id_inv'] == id_inv) {
            let prof_prods = columnOne.querySelectorAll('.cart-item');
            let i = 0;
            prof_prods.forEach(prod => {
                let codigo = prod.children[3].innerText;
                if (codigo == filterInventoriesMW[inventario]['codigo_prod']) {
                    i++;
                }
            })
            if (i == 0) {
                addProduct(filterInventoriesMW[inventario]);
            } else {
                alert("El producto ya se encuentra en la lista");
            }
        }
    }
}
//---------------------------MODAL TABLA BUSCAR INVENTARIO
const inventorySMW = document.getElementById('inventorySMW');
const closeInventorySMW = document.getElementById('closeInventorySMW');
function openInventorySMW() {
    inventorySMW.classList.add('modal__show');
}
closeInventorySMW.addEventListener('click', () => {
    inventorySMW.classList.remove('modal__show');
});
//----------------------------------------------ARMADO Y DESARMADO-------------------------------------------------
//-------Agragar producto
function addProduct(product) {
    let cantidad_inv;
    let cost_uni = 0;
    for (let inventory in inventories) {
        for (let valor in inventories[inventory]) {
            if (inventories[inventory]['codigo_prod'] == product['codigo_prod']) {
                cantidad_inv = inventories[inventory]['cantidad_inv'];
                cost_uni = inventories[inventory]['cost_uni_inv'];
                break;
            }
        }
    }
    let id_prod = (product['id_prod'] == undefined) ? product['fk_id_prod_inv'] : product['id_prod'];
    cantidad_inv = (cantidad_inv == undefined) ? 0 : cantidad_inv;
    let cantidad_prod = 1;
    cost_uni = (product['cost_uni_pfpd'] == undefined) ? (product['cost_uni_inv'] == undefined) ? (cost_uni == 0) ? 0 : cost_uni : product['cost_uni_inv'] : product['cost_uni_pfpd'];
    let item = document.createElement('div');
    item.classList.add('cart-item');
    let html =
        `<input type="hidden" value = "${id_prod}">
        <p class="cart-item__cantInv">${cantidad_inv}</p>
        <div class="row-img">
            <img src="../modelos/imagenes/`+ product['imagen_prod'] + `" draggable="false" class="rowimg">
        </div>
        <p class="cart-item__codigo">`+ product['codigo_prod'] + `</p>
        <input type="number" value = "${cantidad_prod}" min="1" class="cart-item__cantidad">
        <img src="../imagenes/trash.svg" onClick="removeProduct(this.parentNode.parentNode, this.parentNode)" class='icon__CRUD'>`;
    item.innerHTML = html;
    //-------drag drop
    item.setAttribute('draggable', true)
    columnOne.appendChild(item);
}
function removeProduct(box, item) {
    box.removeChild(item);
}
//-------Drag and drop
const columns = document.querySelectorAll(".double__list--box");
document.addEventListener("dragstart", (e) => {
    e.target.classList.add("dragging");
});

document.addEventListener("dragend", (e) => {
    e.target.classList.remove("dragging");
});
columns.forEach((item) => {
    item.addEventListener("dragover", (e) => {
        const dragging = document.querySelector(".dragging");
        const applyAfter = getNewPosition(item, e.clientY);

        if (applyAfter) {
            applyAfter.insertAdjacentElement("afterend", dragging);
        } else {
            item.prepend(dragging);
        }
    });
});
function getNewPosition(column, posY) {
    const cards = column.querySelectorAll(".cart-item:not(.dragging)");
    let result;

    for (let refer_card of cards) {
        const box = refer_card.getBoundingClientRect();
        const boxCenterY = box.y + box.height / 2;

        if (posY >= boxCenterY) result = refer_card;
    }

    return result;
}
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
            let prof_prods = columnOne.querySelectorAll('.cart-item');
            let i = 0;
            prof_prods.forEach(prod => {
                let codigo = prod.children[3].innerText;
                if (codigo == filterProductsMW[product]['codigo_prod']) {
                    i++;
                }
            })
            if (i == 0) {
                addProduct(filterProductsMW[product]);
            } else {
                alert("El producto ya se encuentra en la lista");
            }
        }
    }
}
//---------------------------VENTANA MODAL PARA BUSCAR PRODUCTOS
const productSMW = document.getElementById('productSMW');
const closeProductSMW = document.getElementById('closeProductSMW');
function openProductSMW(clave) {
    productSMW.classList.add('modal__show');
    claveSendProduct = clave;
}
closeProductSMW.addEventListener('click', () => {
    productSMW.classList.remove('modal__show');
});
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
        selectMarcaInventoryMW();
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
/*----------------------------------------------Marca y categoria  modal inventory-------------------------------------------------*/
//-------Select de marcas
function selectMarcaInventoryMW() {
    selectMarcaInvMW.innerHTML = '';
    let option = document.createElement('option');
    option.value = 'todasLasMarcas';
    option.innerText = 'Todas las marcas';
    selectMarcaInvMW.appendChild(option);
    for (let clave in marcas) {
        let option = document.createElement('option');
        option.value = marcas[clave]['id_mrc'];
        option.innerText = marcas[clave]['nombre_mrc'];
        selectMarcaInvMW.appendChild(option);
    }
}
//------Select categorias
function selectCategoriaInventoryMW() {
    selectCategoriaInvMW.innerHTML = '';
    let option = document.createElement('option');
    option.value = 'todasLasCategorias';
    option.innerText = 'Todas las categorias';
    selectCategoriaInvMW.appendChild(option);
    if (selectMarcaInvMW.value != 'todasLasMarcas') {
        let id_mrc = selectMarcaInvMW.value;
        for (let clave in categorias) {
            if (categorias[clave]['id_mrc'] == id_mrc) {
                let option = document.createElement('option');
                option.value = categorias[clave]['id_ctgr'];
                option.innerText = categorias[clave]['nombre_ctgr'];
                selectCategoriaInvMW.appendChild(option);
            }
        }
    }
    searchInventoriesMW();
}
/*----------------------------------------------Marca y categoria  modal product-------------------------------------------------*/
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
//-----------------------------------------PRE LOADER---------------------------------------------
const preloader = document.getElementById('preloader');

