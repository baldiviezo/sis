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
        Promise.all([readArmeds(), readInventories(), readProducts(), readAllMarcas(), readAllCategorias()]).then(() => {
            rqstArmed = false;
            preloader.classList.remove('modal__show');
        });
    }
}
//--------------------------------------------TABLE ARMED------------------------------------
//------read armed
let armeds = {};
let filterArmeds = {};
async function readArmeds() {
    return new Promise((resolve, reject) => {
        let formData = new FormData();
        formData.append('readArmeds', '');
        fetch('../controladores/armado.php', {
            method: "POST",
            body: formData
        }).then(response => response.json()).then(data => {
            armeds = Object.values(data);
            filterArmeds = armeds;
            paginacionArmed(filterArmeds.length, 1);
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
                mostrarAlerta('No hay la cantidad suficiente en inventario del prducto: ' + carts[i].children[3].innerText);
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
                if (rqstArmed == false) {
                    rqstArmed = true;
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
                        Promise.all([readArmeds(), readInventories()]).then(() => {
                            preloader.classList.remove('modal__show');
                            rqstArmed = false;
                            mostrarAlerta(data);
                            cleanUpArmedFormR();
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
            paginacionProductMW(filterProductsMW.length, 1);
            resolve();
        }).catch(err => console.log(err));
    })
}
//--------------------------------------------TABLA MODAL PRODUCTS-----------------------------------------------
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
                product.codigo_prod.toString().toLowerCase().includes(busqueda) ||
                product.nombre_prod.toLowerCase().includes(busqueda) ||
                product.descripcion_prod.toLowerCase().includes(busqueda)
            );
        } else {
            return product[valor].toString().toLowerCase().includes(busqueda);
        }
    });
    selectProductsMW();
}
//------buscar por marca y categoria:
function selectProductsMW() {
    filterProductsMW = filterProductsMW.filter(product => {
        const marca = selectMarcaProdMW.value === 'todasLasMarcas' ? true : product.fk_id_mrc_prod == selectMarcaProdMW.value;
        const categoria = selectCategoriaProdMW.value === 'todasLasCategorias' ? true : product.fk_id_ctgr_prod == selectCategoriaProdMW.value;
        return marca && categoria;
    });
    paginacionProductMW(filterProductsMW.length, 1);
}
//------Ordenar tabla descendente ascendente
const orderProducts = document.querySelectorAll('.tbody__head--ProdMW');
orderProducts.forEach(div => {
    div.children[0].addEventListener('click', function () {
        const valor = div.children[0].name;
        filterProductsMW.sort((a, b) => {
            const valorA = String(a[valor]);
            const valorB = String(b[valor]);
            return valorA.localeCompare(valorB);
        });
        paginacionProductMW(filterProductsMW.length, 1);
    });
    div.children[1].addEventListener('click', function () {
        const valor = div.children[0].name;
        filterProductsMW.sort((a, b) => {
            const valorA = String(a[valor]);
            const valorB = String(b[valor]);
            return valorB.localeCompare(valorA);
        });
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
    const tbody = document.getElementById('tbodyProductMW');
    const inicio = (page - 1) * Number(selectNumberProdMW.value);
    const final = inicio + Number(selectNumberProdMW.value);
    const products = filterProductsMW.slice(inicio, final);
    tbody.innerHTML = '';
    products.forEach((product, index) => {

        const marca = marcas.find(marca => marca.id_mrc === product.fk_id_mrc_prod);
        const categoria = categorias.find(categoria => categoria.id_ctgr === product.fk_id_ctgr_prod);
        const inventarioArce = inventories.find(inventory => inventory.fk_id_prod_inv === product.id_prod && inventory.ubi_almacen === 1);
        const inventarioAlto = inventories.find(inventory => inventory.fk_id_prod_inv === product.id_prod && inventory.ubi_almacen === 0);
        const stock = (inventarioArce ? inventarioArce.cantidad_inv : 0) + (inventarioAlto ? inventarioAlto.cantidad_inv : 0);

        const tr = document.createElement('tr');
        tr.setAttribute('id_prod', product.id_prod);

        const tdIndex = document.createElement('td');
        tdIndex.innerText = inicio + index + 1;
        tr.appendChild(tdIndex);

        const tdCodigo = document.createElement('td');
        tdCodigo.innerText = product.codigo_prod;
        tr.appendChild(tdCodigo);

        const tdMarca = document.createElement('td');
        tdMarca.innerText = marca ? marca.nombre_mrc : '';
        tr.appendChild(tdMarca);

        const tdCategoria = document.createElement('td');
        tdCategoria.innerText = categoria ? categoria.nombre_ctgr : '';
        tr.appendChild(tdCategoria);

        const tdNombre = document.createElement('td');
        tdNombre.innerText = product.nombre_prod;
        tr.appendChild(tdNombre);

        const tdDescripcion = document.createElement('td');
        tdDescripcion.innerText = product.descripcion_prod;
        tr.appendChild(tdDescripcion);

        const tdImagen = document.createElement('td');
        const img = document.createElement('img');
        img.classList.add('tbody__img');
        img.setAttribute('src', '../modelos/imagenes/' + product.imagen_prod);
        tdImagen.appendChild(img);
        tr.appendChild(tdImagen);

        const tdStock = document.createElement('td');
        tdStock.innerText = stock > 0 ? stock : 'Sin Stock';
        tr.appendChild(tdStock);

        const tdAcciones = document.createElement('td');
        const fragment = document.createDocumentFragment();
        let imgs = [];

        imgs.push({ src: '../imagenes/send.svg', onclick: `sendProduct(${product.id_prod})`, title: 'Seleccionar' });

        imgs.forEach((img) => {
            const imgElement = document.createElement('img');
            imgElement.src = img.src;
            imgElement.onclick = new Function(img.onclick);
            imgElement.title = img.title;
            fragment.appendChild(imgElement);
        });

        tdAcciones.appendChild(fragment);
        tr.appendChild(tdAcciones);

        tbody.appendChild(tr);
    });
}
function sendProduct(id_prod) {
    const product = filterProductsMW.find(prod => prod['id_prod'] === id_prod);
    if (product) {
        let prof_prods = modalProf_prod.querySelectorAll('.cart-item');
        const codigo = product['codigo_prod'];
        const existe = Array.from(prof_prods).some(prod => prod.children[2].innerText === codigo);
        if (!existe) {

            const card = cartProduct(id_prod, modalProf_prod, totalPriceM);
            modalProf_prod.appendChild(card);

            //Drang and drop
            const items = modalProf_prod.querySelectorAll(".cart-item");
            items.forEach(item => {
                item.addEventListener("dragstart", () => {
                    setTimeout(() => item.classList.add("dragging"), 0);
                });
                item.addEventListener("dragend", () => item.classList.remove("dragging"));
            });

            modalProf_prod.addEventListener("dragover", initSortableListM);
            modalProf_prod.addEventListener("dragenter", e => e.preventDefault());

            totalPriceM();
        } else {
            mostrarAlerta("El producto ya se encuentra en la lista");
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
async function createProduct() {
    event.preventDefault();
    if (marca_prodR.value == "todasLasMarcas") {
        mostrarAlerta("Debe seleccionar una marca");
    } else if (categoria_prodR.value == "todasLasCategorias") {
        mostrarAlerta("Debe seleccionar una categoria");
    } else {
        if (!rqstArmed) {
            rqstArmed = true;
            let form = document.getElementById("formProductsR");
            let formData = new FormData(form);
            formData.append('createProduct', '');
            preloader.classList.add('modal__show');
            fetch('../controladores/productos.php', {
                method: "POST",
                body: formData
            }).then(response => response.text()).then(data => {
                rqstArmed = false;
                if (data == "El codigo ya existe") {
                    mostrarAlerta(data);
                    preloader.classList.remove('modal__show');
                } else if (data == "El codigo SMC ya existe") {
                    mostrarAlerta(data);
                    preloader.classList.remove('modal__show');
                } else {
                    readProducts().then(() => {
                        mostrarAlerta("El producto fue creado con éxito");
                        productsRMW.classList.remove('modal__show');
                        divCodigoSMCR.setAttribute('hidden', '');
                        form.reset();
                        preloader.classList.remove('modal__show');
                    })
                }
            }).catch(err => console.log(err));
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
        mostrarAlerta('No es una archivo valido');
    }
}
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
/*----------------------------------------------Marca y categoria  modal /*----------------------------------------------Marca y categoria  modal product-------------------------------------------------*/
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
        categorias.forEach(categoria => {
            if (categoria.fk_id_mrc_mccr == id_mrc) {
                let option = document.createElement('option');
                option.value = categoria.id_ctgr;
                option.innerText = categoria.nombre_ctgr;
                selectCategoriaProdMW.appendChild(option);
            }
        });
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