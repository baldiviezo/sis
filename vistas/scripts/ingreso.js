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
//-----------------------------------------PRE LOADER---------------------------------------------
let rqstArmed = false;
const preloader = document.getElementById('preloader');
init();
async function init() {
    if (!rqstArmed) {
        rqstArmed = true;
        preloader.classList.add('modal__show');
        try {
            await Promise.all([
                readArmeds(), 
                readInventories(), 
                readProducts(),
                readAllMarcas(),
                readAllCategorias()
            ]);
            paginacionArmed(filterArmeds.length, 1);
            paginacionInventoryMW(filterInventoriesMW.length, 1);
            rqstArmed = false;
            preloader.classList.remove('modal__show');
        } catch (error) {
            console.log(error);
        }
    }
}
//--------------------------------------------TABLE ARMED------------------------------------
//------read armed
let armeds = [];
let filterArmeds = [];
async function readArmeds() {
    return new Promise((resolve, reject) => {
        let formData = new FormData();
        formData.append('readIngresos', '');
        fetch('../controladores/ingreso.php', {
            method: "POST",
            body: formData
        }).then(response => response.json()).then(data => {
            armeds = data;  
            filterArmeds = armeds;
            resolve();
        }).catch(err => console.log(err));
    });
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
    paginacionArmed(filterArmeds.length, 1);
});
//------buscar por:
function searchArmeds() {
    const valor = selectSearchRmd.value;
    const busqueda = inputSerchRmd.value.toLowerCase().trim();
    filterArmeds = armeds.filter(armed => {
        if (valor === 'todas') {
            return (
                armed.numero_ing.toString().toLowerCase().includes(busqueda) ||
                armed.fecha_ing.toString().toLowerCase().includes(busqueda) ||
                (armed.nombre_usua + ' ' + armed.apellido_usua).toLowerCase().includes(busqueda) ||
                armed.codigo_igpd.toString().toLowerCase().includes(busqueda) ||
                armed.observacion_ing.toLowerCase().includes(busqueda)
            );
        } else if (valor in armed) {
            return armed[valor].toString().toLowerCase().includes(busqueda);
        }
    });
    paginacionArmed(filterArmeds.length, 1);
}
//------Ordenar tabla descendente ascendente
const orderCustomers = document.querySelectorAll('.tbody__head--ingresos');
orderCustomers.forEach(div => {
    div.children[0].addEventListener('click', function () {
        filterArmeds.sort((a, b) => {
            let first = a[div.children[0].name];
            let second = b[div.children[0].name];
            if (typeof first === 'number' && typeof second === 'number') {
                return first - second;
            } else {
                return String(first).localeCompare(String(second));
            }
        })
        paginacionArmed(filterArmeds.length, 1);
    });
    div.children[1].addEventListener('click', function () {
        filterArmeds.sort((a, b) => {
            let first = a[div.children[0].name];
            let second = b[div.children[0].name];
            if (typeof first === 'number' && typeof second === 'number') {
                return second - first;
            } else {
                return String(second).localeCompare(String(first));
            }
        })
        paginacionArmed(filterArmeds.length, 1);
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
const tbodyIncome = document.getElementById('tbodyIncome');
function tableArmed(page) {
    inicio = (page - 1) * Number(selectNumberRmd.value);
    final = inicio + Number(selectNumberRmd.value);
    const ingresos = filterArmeds.slice(inicio, final);
    tbodyIncome.innerHTML = '';
    ingresos.forEach((armed, index) => {
        const tr = document.createElement('tr');
        tr.setAttribute('id_rmd', armed.id_igpd);

        const tdIndex = document.createElement('td');
        tdIndex.innerText = inicio + index + 1;
        tr.appendChild(tdIndex);

        const tdAlmacen = document.createElement('td');
        tdAlmacen.innerText = armed.ubi_almacen_ing == 0 ? 'Av. Arce' : 'El Alto';
        tr.appendChild(tdAlmacen);

        const tdNumero = document.createElement('td');
        tdNumero.innerText = armed.numero_ing;
        tr.appendChild(tdNumero);

        const tdFecha = document.createElement('td');
        tdFecha.innerText = armed.fecha_ing;
        tr.appendChild(tdFecha);

        const tdEncargado = document.createElement('td');
        tdEncargado.innerText = armed.nombre_usua + ' ' + armed.apellido_usua;
        tr.appendChild(tdEncargado);

        const tdCodigo = document.createElement('td');
        tdCodigo.innerText = armed.codigo_igpd;
        tr.appendChild(tdCodigo);

        const tdCantidad = document.createElement('td');
        tdCantidad.innerText = armed.cantidad_igpd;
        tr.appendChild(tdCantidad);

        const tdEstado = document.createElement('td');
        tdEstado.innerText = armed.estado_igpd === 0 ? 'Baja' : 'Agregado';
        tr.appendChild(tdEstado);

        const tdObservacion = document.createElement('td');
        tdObservacion.innerText = armed.observacion_ing;
        tr.appendChild(tdObservacion);

        tbodyIncome.appendChild(tr);
    });
}
//---------------------------------------------CRUD ARMADO------------------------------------//
const columnOne = document.querySelectorAll('.double__list--box')[0];
const columnTwo = document.querySelectorAll('.double__list--box')[1];
//------Create armed
function createArmed() {
    if (columnOne.querySelectorAll('.cart-item').length > 0 || columnTwo.querySelectorAll('.cart-item').length > 0) {
        const carts = columnOne.querySelectorAll('.cart-item');
        let count = true;
        for (let i = 0; i < carts.length; i++) {
            if (Number(carts[i].children[0].innerText) < Number(carts[i].children[3].value)) {
                mostrarAlerta('No hay la cantidad suficiente en inventario del prducto: ' + carts[i].children[2].innerText);
                count = false;
                break; // Detiene la ejecución del bucle
            }
        }
        if (count == true) {
            formArmedRMW.classList.remove('modal__show');
            let array = [];
            columnOne.querySelectorAll('.cart-item').forEach(item => {
                let valor = {};
                valor['fk_id_prod_igpd'] = item.getAttribute('id_prod');
                valor['codigo_igpd'] = item.children[2].innerText;
                valor['cantidad_igpd'] = item.children[3].value;
                valor['estado_igpd'] = 0;
                array.push(valor);
            })
            columnTwo.querySelectorAll('.cart-item').forEach(item => {
                let valor = {};
                valor['fk_id_prod_igpd'] = item.getAttribute('id_prod');
                valor['codigo_igpd'] = item.children[2].innerText;
                valor['cantidad_igpd'] = item.children[3].value;
                valor['estado_igpd'] = 1;
                array.push(valor);
            })
            if (confirm('¿Esta usted seguro?')) {
                if (rqstArmed == false) {
                    rqstArmed = true;
                    const form = document.getElementById("formArmedR");
                    let formData = new FormData(form);
                    formData.set("almacen_ingR", almacen_ingR.value);
                    formData.append('id_usua', localStorage.getItem('id_usua'));
                    formData.append('createIngreso', JSON.stringify(array));
                    preloader.classList.add('modal__show');
                    fetch('../controladores/ingreso.php', {
                        method: 'POST',
                        body: formData
                    }).then(response => response.text()).then(data => {
                        Promise.all([readArmeds(), readInventories()]).then(() => {
                            paginacionArmed(filterArmeds.length, 1);
                            rqstArmed = false;
                            mostrarAlerta(data);
                            cleanUpArmedFormR();
                            preloader.classList.remove('modal__show');
                            formArmedRMW.classList.remove('modal__show');
                        });
                    }).catch(err => {
                        rqstArmed = false;
                        mostrarAlerta(err);
                    });
                }
            }
        }
    } else {
        mostrarAlerta('No es un armado correcto');
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
const closeFormArmedRMW = document.getElementById('closeFormArmedRMW');
function openFormArmedRMW() {
    document.getElementsByName('fecha_ingR')[0].value = `${dateActual[2]}-${dateActual[1]}-${dateActual[0]}`;
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
let inventories = [];
let filterInventoriesMW = [];
async function readInventories() {
    return new Promise((resolve, reject) => {
        let formData = new FormData();
        formData.append('readInventories', '');
        fetch('../controladores/inventario.php', {
            method: "POST",
            body: formData
        }).then(response => response.json()).then(data => {
            inventories = data;
            filterInventoriesMW = inventories;
            resolve();
        }).catch(err => console.log(err));
    });
}
//-------------------------------------------------TABLA MODAL INVENTARIOMW------------------------------------------------------------
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
    paginacionInventoryMW(filterInventoriesMW.length, 1);
});
//-------Marca y categoria
const selectMarcaInvMW = document.getElementById('selectMarcaInvMW');
const selectCategoriaInvMW = document.getElementById('selectCategoriaInvMW');
selectMarcaInvMW.addEventListener('change', selectCategoriaInventoryMW);
selectCategoriaInvMW.addEventListener('change', searchInventoriesMW);
const selectAlmacenInventory = document.getElementById('selectAlmacenInventory');
selectAlmacenInventory.addEventListener('change', searchInventoriesMW);
//------buscar por:
function searchInventoriesMW() {
    const valor = selectSearchInvMW.value;
    const busqueda = inputSearchInvMW.value.toLowerCase().trim();
    filterInventoriesMW = inventories.filter(inventory => {
        let product = products.find(product => product.id_prod === inventory.fk_id_prod_inv);
        if (valor === 'todas') {
            return (
                inventory.cost_uni_inv.toString().toLowerCase().includes(busqueda) ||
                product.codigo_prod.toString().toLowerCase().includes(busqueda) ||
                product.nombre_prod.toLowerCase().includes(busqueda) ||
                product.descripcion_prod.toLowerCase().includes(busqueda) ||
                inventory.descripcion_inv.toLowerCase().includes(busqueda)
            );
        } else if (valor in inventory) {
            return inventory[valor].toString().toLowerCase().includes(busqueda);
        } else if (valor in product) {
            return product[valor].toString().toLowerCase().includes(busqueda);
        }
    });
    selectInventoriesMW();
}
//------buscar por marca y categoria:
function selectInventoriesMW() {
    filterInventoriesMW = filterInventoriesMW.filter(inventory => {
        let product = products.find(product => product.id_prod === inventory.fk_id_prod_inv);
        const marca = selectMarcaInvMW.value === 'todasLasMarcas' ? true : product.fk_id_mrc_prod == selectMarcaInvMW.value;
        const categoria = selectCategoriaInvMW.value === 'todasLasCategorias' ? true : product.fk_id_ctgr_prod == selectCategoriaInvMW.value;
        const almacen = selectAlmacenInventory.value === 'todo' ? true : inventory.ubi_almacen == selectAlmacenInventory.value;
        return marca && categoria && almacen;
    })
    paginacionInventoryMW(filterInventoriesMW.length, 1);
}
//------Ordenar tabla descendente ascendente
const orderInventoriesMW = document.querySelectorAll('.tbody__head--invMW');
orderInventoriesMW.forEach(div => {
    div.children[0].addEventListener('click', function () {
        const valor = div.children[0].name;
        filterInventoriesMW.sort((a, b) => {
            const productoA = products.find(p => p.id_prod === a.fk_id_prod_inv);
            const productoB = products.find(p => p.id_prod === b.fk_id_prod_inv);
            const valorA = String(productoA[valor]);
            const valorB = String(productoB[valor]);
            return valorA.localeCompare(valorB);
        });
        paginacionInventoryMW(filterInventoriesMW.length, 1);
    });
    div.children[1].addEventListener('click', function () {
        const valor = div.children[0].name;
        filterInventoriesMW.sort((a, b) => {
            const productoA = products.find(p => p.id_prod === a.fk_id_prod_inv);
            const productoB = products.find(p => p.id_prod === b.fk_id_prod_inv);
            const valorA = String(productoA[valor]);
            const valorB = String(productoB[valor]);
            return valorB.localeCompare(valorA);
        });
        paginacionInventoryMW(filterInventoriesMW.length, 1);
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
    let inicio = (page - 1) * Number(selectNumberInvMW.value);
    let final = inicio + Number(selectNumberInvMW.value);
    i = 1;
    tbody.innerHTML = '';
    let fragment = document.createDocumentFragment();

    const columnas = [
        'ubi_almacen',
        'codigo_prod',
        'fk_id_mrc_prod',
        'fk_id_ctgr_prod',
        'nombre_prod',
        'descripcion_prod',
        'imagen_prod',
        'cantidad_inv',
        'cost_uni_inv',
        'descripcion_inv'
    ];

    for (let inventory of filterInventoriesMW.slice(inicio, final)) {

        const product = products.find(product => product.id_prod === inventory.fk_id_prod_inv);

        let tr = document.createElement('tr');
        tr.setAttribute('id_inv', inventory.id_inv);

        let tdIndex = document.createElement('td');
        tdIndex.innerText = inicio + i++;
        tr.appendChild(tdIndex);

        for (const columna of columnas) {

            let td = document.createElement('td');

            if (columna in inventory) {
                if (columna == 'cost_uni_inv') {
                    td.innerText = Number(inventory[columna]).toFixed(2);
                } else if (columna == 'ubi_almacen') {
                    td.innerText = inventory[columna] == 0 ? 'El Alto' : 'La Paz';
                } else if(columna == 'cantidad_inv') {
                    td.innerText = inventory[columna] > 0 ? inventory[columna] : 'Sin stock';
                }else {
                    td.innerText = inventory[columna];
                }
            } else if (columna in product) {
                if (columna == 'fk_id_mrc_prod') {
                    const marca = marcas.find((marca) => marca.id_mrc === product[columna]);
                    td.innerText = marca ? marca.nombre_mrc : '';
                } else if (columna == 'fk_id_ctgr_prod') {
                    const categoria = categorias.find((categoria) => categoria.id_ctgr === product[columna]);
                    td.innerText = categoria ? categoria.nombre_ctgr : '';

                } else if (columna == 'imagen_prod') {
                    let img = document.createElement('img');
                    img.classList.add('tbody__img');
                    img.setAttribute('src', '../modelos/imagenes/' + product[columna]);
                    td.appendChild(img);
                } else {
                    td.innerText = product[columna];
                }
            }
            tr.appendChild(td);
        }
        fragment.appendChild(tr);
        let tdActions = document.createElement('td');    
        tdActions.innerHTML = `<img src="../imagenes/send.svg" onclick="addProduct(${inventory.fk_id_prod_inv})" title="Agregar">`;
        tr.appendChild(tdActions);

    }
    tbody.innerHTML = '';
    tbody.appendChild(fragment);
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
function addProduct(id_prod) {
    const product = products.find(product => product.id_prod == id_prod);
    
    const inventoriesAlto = inventories.filter(inventory => inventory.fk_id_prod_inv === id_prod && inventory.ubi_almacen === 0);
    const inventoriesArce = inventories.filter(inventory => inventory.fk_id_prod_inv === id_prod && inventory.ubi_almacen === 1);

    const cantidad_invAlto = inventoriesAlto.length > 0 ? inventoriesAlto[0].cantidad_inv : 0;
    const cantidad_invArce = inventoriesArce.length > 0 ? inventoriesArce[0].cantidad_inv : 0;

    let cantidad_invTotal = 0;
    if (almacen_ingR.value == 0) {
        cantidad_invTotal = cantidad_invAlto;
    } else {
        cantidad_invTotal = cantidad_invArce;
    }

    const item = document.createElement('div');
    item.classList.add('cart-item');
    item.setAttribute('id_prod', product['id_prod']);
    item.setAttribute('draggable', 'true');

    const cantidadInvParagraph = document.createElement('p');
    cantidadInvParagraph.classList.add('cart-item__cantInv');

    if (cantidad_invAlto > 0 && cantidad_invArce > 0) {
        cantidadInvParagraph.classList.add('almacen-ambos');
    } else if (cantidad_invAlto > 0) {
        cantidadInvParagraph.classList.add('almacen-alto');
    } else if (cantidad_invArce > 0) {
        cantidadInvParagraph.classList.add('almacen-arce');
    }

    cantidadInvParagraph.textContent = cantidad_invTotal;
    item.appendChild(cantidadInvParagraph);

    const rowImgDiv = document.createElement('div');
    rowImgDiv.classList.add('row-img');
    const rowImg = document.createElement('img');
    rowImg.setAttribute('src', '../modelos/imagenes/' + product.imagen_prod);
    rowImg.setAttribute('draggable', 'false');
    rowImg.classList.add('rowimg');
    rowImgDiv.appendChild(rowImg);
    item.appendChild(rowImgDiv);

    const codigoParagraph = document.createElement('p');
    codigoParagraph.classList.add('cart-item__codigo');
    codigoParagraph.textContent = product.codigo_prod;
    item.appendChild(codigoParagraph);

    const cantidadInput = document.createElement('input');
    cantidadInput.setAttribute('type', 'number');
    cantidadInput.setAttribute('value', '1');
    cantidadInput.setAttribute('min', '1');
    cantidadInput.classList.add('cart-item__cantidad');
    item.appendChild(cantidadInput);

    const iconCRUD = document.createElement('img');
    iconCRUD.setAttribute('src', '../imagenes/trash.svg');
    iconCRUD.setAttribute('onClick', 'removeProduct(this.parentNode.parentNode, this.parentNode)');
    iconCRUD.classList.add('icon__CRUD');
    item.appendChild(iconCRUD);

    //-------drag drop
    item.setAttribute('draggable', true)
    columnOne.appendChild(item);
}
function removeProduct(box, item) {
    box.removeChild(item);
}
//-------Select almacen_ingR cambia el texto de la cantidad en inventario
const almacen_ingR = document.getElementById('almacen_ingR');
almacen_ingR.addEventListener('change', changeAlmacen);
function changeAlmacen() {
    const carts = armedRMW.querySelectorAll('.cart-item');
    carts.forEach(cart => {
        if (almacen_ingR.value == 0) {
            const inventoriesAlto = inventories.find(inventory => inventory.fk_id_prod_inv == cart.getAttribute('id_prod') && inventory.ubi_almacen === 0);
            cart.children[0].innerText = inventoriesAlto ? inventoriesAlto.cantidad_inv : 0;
        } else {
            const inventoriesArce = inventories.find(inventory => inventory.fk_id_prod_inv == cart.getAttribute('id_prod') && inventory.ubi_almacen === 1);
            cart.children[0].innerText = inventoriesArce ? inventoriesArce.cantidad_inv : 0;
        }
    });
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
//--------------------------------------------TABLA MODAL PRODUCTS-----------------------------------------------
let products = [];
let filterProductsMW = [];
async function readProducts() {
    return new Promise((resolve, reject) => {
        let formData = new FormData();
        formData.append('readProducts', '');
        fetch('../controladores/productos.php', {
            method: "POST",
            body: formData
        }).then(response => response.json()).then(data => {
            products = data;
            filterProductsMW = products;
            resolve();
        }).catch(err => mostrarAlerta('Ocurrio un error al cargar los productos, cargue nuevamente la pagina.'));
    })
}
/*----------------------------------------------Marca y categoria  modal product-------------------------------------------------*/
//-------Read all Marcas
let marcas = [];
async function readAllMarcas() {
    return new Promise((resolve, reject) => {
        let formData = new FormData();
        formData.append('readMarcas', '');
        fetch('../controladores/productos.php', {
            method: "POST",
            body: formData
        }).then(response => response.json()).then(data => {
            marcas = data;
            selectMarcaInventoryMW();
            resolve();
        }).catch(err => console.log(err));
    })
}
//-------Read all categorias
let categorias = [];
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
/*----------------------------------------------Marca y categoria  modal inventory-------------------------------------------------*/
//-------Select de marcas
function selectMarcaInventoryMW() {
    selectMarcaInvMW.innerHTML = '';
    let option = document.createElement('option');
    option.value = 'todasLasMarcas';
    option.innerText = 'Todas las marcas';
    selectMarcaInvMW.appendChild(option);
    marcas.forEach(marca => {
        let option = document.createElement('option');
        option.value = marca.id_mrc;
        option.innerText = marca.nombre_mrc;
        selectMarcaInvMW.appendChild(option);
    })
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
        categorias.forEach(categoria => {
            if (categoria.fk_id_mrc_mccr == id_mrc) {
                let option = document.createElement('option');
                option.value = categoria.id_ctgr;
                option.innerText = categoria.nombre_ctgr;
                selectCategoriaInvMW.appendChild(option);
            }
        })
    }
    searchInventoriesMW();
}
/*************************************************ALERTA***************************************/
const modalAlerta = document.getElementById('alerta');
const botonAceptar = document.getElementById('botonAceptar');
function mostrarAlerta(message) {
    modalAlerta.classList.add('modal__show');
    document.getElementById('mensaje-alerta').innerText = message;
}
botonAceptar.addEventListener('click', (e) => {
    modalAlerta.classList.remove('modal__show');
});
/*********************************************Reporte en Excel****************************************************/
const EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
const EXCEL_EXTENSION = '.xlsx';
function downloadAsExcel(data) {
    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = {
        Sheets: {
            'data': worksheet
        },
        SheetNames: ['data']
    };
    const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });

    saveAsExcel(excelBuffer, 'Ventas');
}
function saveAsExcel(buffer, filename) {
    const data = new Blob([buffer], { type: EXCEL_TYPE });
    saveAs(data, filename + EXCEL_EXTENSION);
}
const excelReport = document.getElementById('excelReport');
excelReport.addEventListener('click', () => {
    //filtrar el costo unitario de los objetos prices y inventories
    const reporte = filterArmeds.map((obj) => {
        const cantidad = obj.estado_igpd === 'agregado' ? parseFloat(obj.cantidad_igpd) : -parseFloat(obj.cantidad_igpd);
        return {
            'ALMACEN': obj.almacen_ing == 0 ? 'Av. Arce' : 'El Alto',
            'FECHA': obj.fecha_ing,
            'CODIGO': obj.codigo_igpd,
            'CANTIDAD': cantidad
        };
    });

    downloadAsExcel(reporte);
});