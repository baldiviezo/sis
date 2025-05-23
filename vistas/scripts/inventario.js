//--------------------------------------------Restricciones de usuario----------------------------------------------
const openMarcaRMW = document.getElementById('openMarcaRMW');
const buttondDeleteMarca = document.getElementById('buttondDeleteMarca');
const openCategoriaRMW = document.getElementById('openCategoriaRMW');
const buttonDeleteCategoria = document.getElementById('buttonDeleteCategoria');
if (localStorage.getItem('rol_usua') == 'Gerente general' || localStorage.getItem('rol_usua') == 'Administrador') {
    //Marca y Categoria
    openMarcaRMW.removeAttribute('hidden');
    buttondDeleteMarca.removeAttribute('hidden');
    openCategoriaRMW.removeAttribute('hidden');
    buttonDeleteCategoria.removeAttribute('hidden');
    //inventoryMMW
    document.getElementsByName('cantidad_invM')[0].setAttribute('readonly', 'readonly');
    //inventoryRMW
    document.querySelector('#openInventoryRMW').removeAttribute('hidden');
    document.getElementsByName('cantidad_invR')[0].setAttribute('readonly', 'readonly');
    //document.querySelector('#inventoryRMW .form__group--select').children[4].removeAttribute('hidden');

} else if (localStorage.getItem('rol_usua') == 'Gerente De Inventario') {
    //Marca y Categoria
    document.querySelector('.select__search').children[0].children[2].removeAttribute('hidden');
    document.querySelector('.select__search').children[1].children[2].removeAttribute('hidden');
    //inventoryMMW
    document.getElementsByName('cantidad_invM')[0].setAttribute('readonly', 'readonly');
}
//--------------------------------------------BLOCK REQUEST WITH A FLAG--------------------------------------------
let requestInventory = false;
const preloader = document.getElementById('preloader');
init();
async function init() {
    if (!requestInventory) {
        requestInventory = true;
        preloader.classList.add('modal__show');
        try {
            await Promise.all([
                readAllMarcas(),
                readAllCategorias(),
                readProductsMW(),
                readInventories()
            ]);
            paginacionInventory(filterInventories.length, 1);
            paginacionProductMW(products.length, 1);
            requestInventory = false;
            preloader.classList.remove('modal__show');
        } catch (error) {
            console.log(error)
            mostrarAlerta('Ocurrio un error al cargar la tabla de inventarios. Cargue nuevamente la pagina.');
        }
    }
}
//---------------------------------------------TABLA INVENTORY--------------------------------------------
//-------Marca y categoria
const selectMarcaInventory = document.getElementById('selectMarcaInventory');
selectMarcaInventory.addEventListener('change', selectCategoriaInv);
const selectCategoriaInventory = document.getElementById('selectCategoriaInventory');
selectCategoriaInventory.addEventListener('change', searchInventories);
const selectAlmacenInventory = document.getElementById('selectAlmacenInventory');
selectAlmacenInventory.addEventListener('change', searchInventories);
//------Read inventarios
let inventories = [];
let filterInventories = [];
async function readInventories() {
    return new Promise((resolve, reject) => {
        let formData = new FormData();
        formData.append('readInventories', '');
        fetch('../controladores/inventario.php', {
            method: "POST",
            body: formData
        }).then(response => response.json()).then(data => {
            inventories = data.filter(objeto => objeto.cantidad_inv !== 0);
            filterInventories = inventories;
            resolve();
        }).catch(err => console.log(err));
    })
}
//------Select utilizado para buscar por columnas
const selectSearchInv = document.getElementById('selectSearchInv');
selectSearchInv.addEventListener('change', searchInventories);
//------buscar por input
const inputSearchInv = document.getElementById("inputSearchInv");
inputSearchInv.addEventListener("keyup", searchInventories);
//------Clientes por pagina
const selectNumberInv = document.getElementById('selectNumberInv');
selectNumberInv.selectedIndex = 3;
selectNumberInv.addEventListener('change', function () {
    paginacionInventory(filterInventories.length, 1);
});
//------buscar por:
function searchInventories() {
    const valor = selectSearchInv.value;
    const busqueda = inputSearchInv.value.toLowerCase().trim();
    filterInventories = inventories.filter(inventory => {
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
    selectInventories();
}
//------buscar por marca y categoria:
function selectInventories() {
    filterInventories = filterInventories.filter(inventory => {
        let product = products.find(product => product.id_prod === inventory.fk_id_prod_inv);
        const marca = selectMarcaInventory.value === 'todasLasMarcas' ? true : product.fk_id_mrc_prod == selectMarcaInventory.value;
        const categoria = selectCategoriaInventory.value === 'todasLasCategorias' ? true : product.fk_id_ctgr_prod == selectCategoriaInventory.value;
        const almacen = selectAlmacenInventory.value === 'todo' ? true : inventory.ubi_almacen == selectAlmacenInventory.value;
        return marca && categoria && almacen;
    });
    paginacionInventory(filterInventories.length, 1);
}
//------Ordenar tabla descendente ascendente
const orderInventories = document.querySelectorAll('.tbody__head--inventory');
orderInventories.forEach(div => {
    div.children[0].addEventListener('click', function () {
        const valor = div.children[0].name;
        filterInventories.sort((a, b) => {
            const productoA = products.find(p => p.id_prod === a.fk_id_prod_inv);
            const productoB = products.find(p => p.id_prod === b.fk_id_prod_inv);
            const valorA = String(productoA[valor]);
            const valorB = String(productoB[valor]);
            return valorA.localeCompare(valorB);
        });
        paginacionInventory(filterInventories.length, 1);
    });
    div.children[1].addEventListener('click', function () {
        const valor = div.children[0].name;
        filterInventories.sort((a, b) => {
            const productoA = products.find(p => p.id_prod === a.fk_id_prod_inv);
            const productoB = products.find(p => p.id_prod === b.fk_id_prod_inv);
            const valorA = String(productoA[valor]);
            const valorB = String(productoB[valor]);
            return valorB.localeCompare(valorA);
        });
        paginacionInventory(filterInventories.length, 1);
    });
})
//------PaginacionInventory
const totalStock = document.querySelector('#totalStock');
const totalCompra = document.querySelector('#totalCompra');
function paginacionInventory(allInventories, page) {
    let stock = 0;
    for (let inventory in filterInventories) {
        stock += Number(filterInventories[inventory].cantidad_inv) * Number(filterInventories[inventory].cost_uni_inv) * .65;
    }
    totalStock.innerText = `Precio de lista: ${stock.toFixed(2)} Bs`;
    totalCompra.innerText = `Precio de compra: ${(stock * .65).toFixed(2)} Bs`;
    let numberInventories = Number(selectNumberInv.value);
    let allPages = Math.ceil(allInventories / numberInventories);
    let ul = document.querySelector('#wrapperInventory ul');
    let li = '';
    let beforePages = page - 1;
    let afterPages = page + 1;
    let liActive;
    if (page > 1) {
        li += `<li class="btn" onclick="paginacionInventory(${allInventories}, ${page - 1})"><img src="../imagenes/arowLeft.svg"></li>`;
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
        li += `<li class="numb ${liActive}" onclick="paginacionInventory(${allInventories}, ${pageLength})"><span>${pageLength}</span></li>`;
    }
    if (page < allPages) {
        li += `<li class="btn" onclick="paginacionInventory(${allInventories}, ${page + 1})"><img src="../imagenes/arowRight.svg"></li>`;
    }
    ul.innerHTML = li;
    let h2 = document.querySelector('#showPageInventory h2');
    h2.innerHTML = `Pagina ${page}/${allPages}, ${allInventories} Productos`;
    tableInventories(page);
}
//------Crear la tabla inventario
function tableInventories(page) {
    let tbody = document.getElementById('tbodyInventory');
    let inicio = (page - 1) * Number(selectNumberInv.value);
    let final = inicio + Number(selectNumberInv.value);
    let i = 1;
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

    for (let inventory of filterInventories.slice(inicio, final)) {

        let product = products.find(product => product.id_prod === inventory.fk_id_prod_inv);

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
                } else {
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

        let td = document.createElement('td');
        const isAdmin = ['Gerente general', 'Administrador', 'Gerente De Inventario'].includes(localStorage.getItem('rol_usua'));
        const hasCatalog = product['catalogo_prod'] !== '';
        const isInventory = true; // Asumo que siempre es inventario

        td.innerHTML = `
            ${isAdmin ? '<img src="../imagenes/edit.svg" onclick="readInventory(this.parentNode.parentNode)" title="Editar en Inventario">' : ''}
            ${hasCatalog ? `<a href="${product['catalogo_prod']}" target="_blank"><img src="../imagenes/pdf.svg" title="Catálogo"></a>` : ''}`;
        tr.appendChild(td);
        fragment.appendChild(tr);
    }
    tbody.innerHTML = '';
    tbody.appendChild(fragment);
}
//<<-----------------------------------------CRUD INVENTARIO-------------------------------------->>
//------CREATE UN INVENTARIO
document.getElementById("formInventarioR").addEventListener("submit", createInventory);
async function createInventory() {
    event.preventDefault();
    //verificar que el valor de codigo_prod_invR no este vacio
    if (document.getElementsByName('codigo_prod_invR')[0].value == '') {
        mostrarAlerta('Seleccione un producto');
        return;
    }
    if (requestInventory == false) {
        requestInventory = true;
        inventoryRMW.classList.remove('modal__show');
        let form = document.getElementById("formInventarioR");
        let formData = new FormData(form);
        formData.append('createInventory', '');
        preloader.classList.add('modal__show');
        fetch('../controladores/inventario.php', {
            method: "POST",
            body: formData
        }).then(response => response.text()).then(data => {
            readInventories().then(() => {
                selectAlmacenInventory.selectedIndex = 0;
                paginacionInventory(filterInventories.length, 1);
                preloader.classList.remove('modal__show');
                requestInventory = false;
                form.reset();
                mostrarAlerta(data);
            });
        }).catch(err => {
            requestInventory = false;
            mostrarAlerta(err);
        });
    }
}
//------LEER UN INVENTARIO
function readInventory(tr) {
    formProduct = 'M';
    let id_inv = tr.getAttribute('id_inv');
    for (let inventory in filterInventories) {
        if (filterInventories[inventory]['id_inv'] == id_inv) {
            const product = products.find(product => product.id_prod === filterInventories[inventory]['fk_id_prod_inv']);
            document.getElementsByName('codigo_prod_invM')[0].value = product['codigo_prod'];
            for (let valor in filterInventories[inventory]) {
                if (valor == 'ubi_almacen') {
                    document.getElementsByName('ubi_almacenM')[0].value = filterInventories[inventory][valor] == 0 ? 'El Alto' : 'La Paz';
                } else {
                    document.getElementsByName(valor + 'M')[0].value = filterInventories[inventory][valor];
                }
            }
            break;
        }
    }
    inventoryMMW.classList.add('modal__show');
}
//-------ACTUALIZAR UN INVENTARIO
document.getElementById("formInventarioM").addEventListener("submit", updateInventory);
async function updateInventory() {
    event.preventDefault();
    if (requestInventory == false) {
        requestInventory = true;
        let form = document.getElementById("formInventarioM");
        let formData = new FormData(form);
        formData.append('updateInventory', '');
        preloader.classList.add('modal__show');
        inventoryMMW.classList.remove('modal__show');
        fetch('../controladores/inventario.php', {
            method: "POST",
            body: formData
        }).then(response => response.text()).then(data => {
            readInventories().then(() => {
                selectAlmacenInventory.selectedIndex = 0;
                paginacionInventory(filterInventories.length, 1);
                requestInventory = false;
                preloader.classList.remove('modal__show');
                mostrarAlerta(data);
            })
        }).catch(err => {
            requestInventory = false;
            mostrarAlerta('Ocurrio un error al actualizar el inventario, cargue nuevamente la pagina.');
        });
    }
}
//------DELETE UN INVENTARIO
async function deleteInventory(tr) {
    if (confirm('¿Esta usted seguro?')) {
        let cantidad_inv = parseInt(tr.children[9].innerText);
        if (cantidad_inv > 0) {
            mostrarAlerta('No se puede eliminar los productos que existen en almacen');
        } else {
            if (requestInventory == false) {
                requestInventory = true;
                let id = tr.children[0].innerText;
                let formData = new FormData();
                formData.append('deleteInventory', id);
                preloader.classList.add('modal__show');
                fetch('../controladores/inventario.php', {
                    method: "POST",
                    body: formData
                }).then(response => response.text()).then(data => {
                    readInventories().then(() => {
                        paginacionInventory(filterInventories.length, 1);
                        requestInventory = false;
                        preloader.classList.remove('modal__show');
                        mostrarAlerta(data);
                    });
                }).catch(err => {
                    requestInventory = false;
                    mostrarAlerta('Ocurrio un error al eliminar el inventario, cargue nuevamente la pagina.');
                });
            }
        }
    }
}
//-----------------------------------Ventana modal para inventario---------------------------------//
const inventoryRMW = document.getElementById('inventoryRMW');
const inventoryMMW = document.getElementById('inventoryMMW');
const openInventoryRMW = document.getElementById('openInventoryRMW');
const openInventoryMMW = document.getElementById('openInventoryMMW'); const closeInventoryRMW = document.getElementById('closeInventoryRMW');
const closeInventoryMMW = document.getElementById('closeInventoryMMW');
openInventoryRMW.addEventListener('click', () => {
    inventoryRMW.classList.add('modal__show');
    formProduct = 'R';
});
closeInventoryRMW.addEventListener('click', () => {
    inventoryRMW.classList.remove('modal__show');
});
closeInventoryMMW.addEventListener('click', () => {
    inventoryMMW.classList.remove('modal__show');
});
//---------------------------------------------------PRODUCTOS-----------------------------------------------//
//-------Marca y categoria
const selectMarcaProdMW = document.getElementById('selectMarcaProdMW');
selectMarcaProdMW.addEventListener('change', selectCategoriaProd);
const selectCategoriaProdMW = document.getElementById('selectCategoriaProdMW');
selectCategoriaProdMW.addEventListener('change', searchProductsMW);
//<<-----------------------------------LLENAR LA LISTA DE PRODUCTOS-------------------------------------->>
let products = [];
let filterProducts = [];
let formProduct;
async function readProductsMW() {
    return new Promise((resolve, reject) => {
        let formData = new FormData();
        formData.append('readProducts', '');
        fetch('../controladores/productos.php', {
            method: "POST",
            body: formData
        }).then(response => response.json()).then(data => {
            products = data;
            filterProducts = products;
            resolve();
        }).catch(err => mostrarAlerta('Ocurrio un error al cargar los productos, cargue nuevamente la pagina.'));
    })
}
//<<------------------------------------------CRUD DE PRODUCTS------------------------------------->>
//------Create un producto
document.getElementById("formProductsR").addEventListener("submit", createProduct);
async function createProduct() {
    event.preventDefault();
    if (marca_prodR.value == "todasLasMarcas") {
        mostrarAlerta("Debe seleccionar una marca");
    } else if (categoria_prodR.value == "todasLasCategorias") {
        mostrarAlerta("Debe seleccionar una categoria");
    } else {
        if (requestInventory == false) {
            requestInventory = true;
            preloader.classList.add('modal__show');
            productsRMW.classList.remove('modal__show');
            let form = document.getElementById("formProductsR");
            let formData = new FormData(form);
            formData.append('createProduct', '');
            fetch('../controladores/productos.php', {
                method: "POST",
                body: formData
            }).then(response => response.text()).then(data => {
                requestInventory = false;
                if (data == "El codigo ya existe") {
                    mostrarAlerta(data);
                    preloader.classList.remove('modal__show');
                } else if (data == "El codigo SMC ya existe") {
                    mostrarAlerta(data);
                    preloader.classList.remove('modal__show');
                } else {
                    readProductsMW().then(() => {
                        form.reset();
                        paginacionProductMW(products.length, 1);
                        mostrarAlerta("El producto fue creado con éxito");
                        divCodigoSMCR.setAttribute('hidden', '');
                        preloader.classList.remove('modal__show');
                    })
                }
            }).catch(err => {
                requestInventory = false;
                mostrarAlerta(err);
            });
        }
    }
}
//------Leer un producto
function readProduct(div) {
    cleanUpProductFormM();
    let id_prod = div.children[0].value;
    let product = filterProducts.find(product => product.id_prod == id_prod);

    if (product) {
        for (let valor in product) {
            if (valor == 'imagen_prod') {
                document.querySelector('.drop__areaM').setAttribute('style', `background-image: url("../modelos/imagenes/${product[valor]}"); background-size: cover;`);
            } else if (valor == 'codigo_smc_prod') {
                if (product['fk_id_mrc_prod'] == '15') {
                    divCodigoSMCM.removeAttribute('hidden');
                    document.getElementsByName(valor + 'M')[0].value = product[valor];
                }
            } else if (valor == 'fk_id_mrc_prod') {
                document.getElementsByName(valor + 'M')[0].value = product[valor];
            } else if (valor == 'fk_id_ctgr_prod') {
                selectCategoriaProdM();
                document.getElementsByName(valor + 'M')[0].value = product[valor];
            } else {
                document.getElementsByName(valor + 'M')[0].value = product[valor];
            }
        }
    }
    productsMMW.classList.add('modal__show');
}
//-------Update un producto
document.getElementById("formProductsM").addEventListener("submit", updateProduct);
async function updateProduct() {
    event.preventDefault();
    if (marca_prodM.value == "todasLasMarcas") {
        mostrarAlerta("Debe seleccionar una marca");
    } else if (categoria_prodM.value == "todasLasCategorias") {
        mostrarAlerta("Debe seleccionar una categoria");
    } else {
        productsMMW.classList.remove('modal__show');
        let form = document.getElementById("formProductsM");
        let formData = new FormData(form);
        formData.append('updateProduct', '');
        fetch('../controladores/productos.php', {
            method: "POST",
            body: formData
        }).then(response => response.text()).then(data => {
            readProductsMW().then(() => {
                paginacionInventory(filterInventories.length, 1);
                paginacionProductMW(products.length, 1);
                mostrarAlerta(data);
            })
        }).catch(err => console.log(err));
    }
}
//------Delete un producto
async function deleteProduct(div) {
    if (confirm(`¿Esta usted seguro? Se eliminará el producto "${div.children[0].options[div.children[0].selectedIndex].text}"`)) {
        if (requestInventory == false) {
            requestInventory = true;
            let id_prod = div.children[0].value;
            let formData = new FormData();
            formData.append('deleteProduct', id_prod);
            preloader.classList.add('modal__show');
            fetch('../controladores/productos.php', {
                method: "POST",
                body: formData
            }).then(response => response.text()).then(data => {
                readProductsMW().then(() => {
                    paginacionProductMW(products.length, 1);
                    preloader.classList.remove('modal__show');
                    mostrarAlerta(data);
                })
            }).catch(err => console.log(err));
        }
    }
}
//---------------------------------VENTANA MODAL PARA REGISTRAR PRODUCTOS------------------------------>>
const productsRMW = document.getElementById('productsRMW');
const productsMMW = document.getElementById('productsMMW');
const closeProductsRMW = document.getElementById('closeProductsRMW');
const closeProductsMMW = document.getElementById('closeProductsMMW');
function openProductsRMW() {
    productsRMW.classList.add('modal__show');
}
closeProductsRMW.addEventListener('click', (e) => {
    productsRMW.classList.remove('modal__show');
});
closeProductsMMW.addEventListener('click', (e) => {
    productsMMW.classList.remove('modal__show');
});
//<<-----------------------------------------------------MUESTRA LA IMAGEN CARGADA------------------------------>>
const inputsFormProduct = document.querySelectorAll('.modalP__form .modalP__group input');
//<<----------------------------------MUESTRA LA IMAGEN CARGADA------------------------------>>
document.getElementById("imagen_prodR").addEventListener("change", mostrarimagenR);
document.getElementById("imagen_prodM").addEventListener("change", mostrarimagenM);
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
    document.querySelector('.drop__areaM').setAttribute('style', `background-image: url("${urlDeImagen}"); background-size: cover;`);
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
    let validExtensions = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif'];
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
    let validExtensions = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif'];
    if (validExtensions.includes(docType)) {
        //archivo valido
        inputM.files = filesM;
        mostrarimagenM();
    } else {
        //archivo no valido
        mostrarAlerta('No es una archivo valido');
    }
}
//------------------------------------------------TABLA MODAL PRODUCTS--------------------------------------------------
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
    paginacionProductMW(filterProducts.length, 1);
});
//------buscar por:
function searchProductsMW() {
    const valor = selectSearchProdMW.value;
    const busqueda = inputSearchProdMW.value.toLowerCase().trim();
    filterProducts = products.filter(product => {
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
    filterProducts = filterProducts.filter(product => {
        const marca = selectMarcaProdMW.value === 'todasLasMarcas' ? true : product.fk_id_mrc_prod == selectMarcaProdMW.value;
        const categoria = selectCategoriaProdMW.value === 'todasLasCategorias' ? true : product.fk_id_ctgr_prod == selectCategoriaProdMW.value;
        return marca && categoria;
    });
    paginacionProductMW(filterProducts.length, 1);
}
//------Ordenar tabla descendente ascendente
const orderProducts = document.querySelectorAll('.tbody__head--ProdMW');
orderProducts.forEach(div => {
    div.children[0].addEventListener('click', function () {
        let array = Object.entries(filterProducts).sort((a, b) => {
            let first = a[1][div.children[0].name].toLowerCase();
            let second = b[1][div.children[0].name].toLowerCase();
            if (first < second) { return -1 }
            if (first > second) { return 1 }
            return 0;
        })
        filterProducts = Object.fromEntries(array);
        paginacionProductMW(filterProducts.length, 1);
    });
    div.children[1].addEventListener('click', function () {
        let array = Object.entries(filterProducts).sort((a, b) => {
            let first = a[1][div.children[0].name].toLowerCase();
            let second = b[1][div.children[0].name].toLowerCase();
            if (first > second) { return -1 }
            if (first < second) { return 1 }
            return 0;
        })
        filterProducts = Object.fromEntries(array);
        paginacionProductMW(filterProducts.length, 1);
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
    let inicio = (page - 1) * Number(selectNumberProdMW.value);
    let final = inicio + Number(selectNumberProdMW.value);
    let fragment = document.createDocumentFragment();

    for (let product of filterProducts.slice(inicio, final)) {
        let tr = document.createElement('tr');
        tr.setAttribute('id_prod', product.id_prod);

        let tdIndex = document.createElement('td');
        tdIndex.innerText = inicio + filterProducts.indexOf(product) + 1;
        tr.appendChild(tdIndex);

        for (let valor in product) {
            let td = document.createElement('td');
            if (valor == 'id_prod' || valor == 'codigo_smc_prod' || valor == 'catalogo_prod') {
                // No hacer nada
            } else if (valor == 'fk_id_mrc_prod') {
                const marca = marcas.find((marca) => marca.id_mrc === product[valor]);
                td.innerText = marca ? marca.nombre_mrc : '';
                tr.appendChild(td);
            } else if (valor == 'fk_id_ctgr_prod') {
                const categoria = categorias.find((categoria) => categoria.id_ctgr === product[valor]);
                td.innerText = categoria ? categoria.nombre_ctgr : '';
                tr.appendChild(td);
            } else if (valor == 'imagen_prod') {
                let img = document.createElement('img');
                img.classList.add('tbody__img');
                img.setAttribute('src', '../modelos/imagenes/' + product[valor]);
                td.appendChild(img);
                tr.appendChild(td);
            } else {
                td.innerText = product[valor];
                tr.appendChild(td);
            }
        }

        let td = document.createElement('td');
        td.innerHTML = `
            <img src='../imagenes/send.svg' onclick='sendProduct(${product.id_prod})' title='Seleccionar'>`;
        tr.appendChild(td);
        fragment.appendChild(tr);
    }
    tbody.innerHTML = '';
    tbody.appendChild(fragment);
}
function sendProduct(id_prod) {
    const fk_id_prod_invR = document.getElementsByName('fk_id_prod_inv' + formProduct)[0];
    fk_id_prod_invR.value = id_prod;
    const codigo_prod_invR = document.getElementsByName('codigo_prod_inv' + formProduct)[0];
    codigo_prod_invR.value = products.find(product => product.id_prod === id_prod).codigo_prod;
    productSMW.classList.remove('modal__show');
}
//---------------------------VENTANA MODAL PARA BUSCAR PRODUCTOS
const productSMW = document.getElementById('productSMW');
const closeProductSMW = document.getElementById('closeProductSMW');
function openProductSMW(clave) {
    productSMW.classList.add('modal__show');
    claveSendProduct = clave;
    inputSearchProdMW.focus();
}
closeProductSMW.addEventListener('click', () => {
    productSMW.classList.remove('modal__show');
});
/*-----------------------------------------Marca y categoria producto-------------------------------------------------*/
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
            selectMarcaProd();
            selectMarcaProdR();
            selectMarcaProdM();
            selectMarcaInv();
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
/*----------------------------------------------Marca y categoria inventario-------------------------------------------------*/
//-------Create Marca
const formMarcaR = document.getElementById('formMarcaR');
formMarcaR.addEventListener('submit', createMarcaInv);
function createMarcaInv() {
    event.preventDefault();
    if (requestInventory == false) {
        requestInventory = true;
        preloader.classList.add('modal__show');
        let formData = new FormData(formMarcaR);
        formData.append('createMarca', '');
        fetch('../controladores/productos.php', {
            method: "POST",
            body: formData
        }).then(response => response.text()).then(data => {
            readAllMarcas().then(() => {
                mostrarAlerta(data);
                requestInventory = false;
                formMarcaR.reset();
                preloader.classList.remove('modal__show');
                marcaRMW.classList.remove('modal__show');
            })
        }).catch(err => mostrarAlerta('Ocurrio un error al crear la marca. Cargue nuevamente la pagina.'));
    }
}
//-------Eliminar Marca
function deleteMarcaInv() {
    if (confirm('¿Esta usted seguro?')) {
        if (requestInventory == false) {
            requestInventory = true;
            preloader.classList.add('modal__show');
            let formData = new FormData();
            formData.append('deleteMarca', selectMarcaInventory.value);
            fetch('../controladores/productos.php', {
                method: "POST",
                body: formData
            }).then(response => response.text()).then(data => {
                readAllMarcas().then(() => {
                    searchInventories();
                    searchProductsMW();
                    mostrarAlerta(data);
                    requestInventory = false;
                    preloader.classList.remove('modal__show');
                })
            }).catch(err => mostrarAlerta('Ocurrio un error al eliminar la marca. Cargue nuevamente la pagina.'));
        }
    }
}
//-------registrar categoria
const formCategoriaR = document.getElementById('formCategoriaR');
formCategoriaR.addEventListener('submit', createCategoriaInv);
async function createCategoriaInv() {
    event.preventDefault();
    if (selectMarcaInventory.value != 'todasLasMarcas') {
        if (requestInventory == false) {
            requestInventory = true;
            preloader.classList.add('modal__show');
            categoriaRMW.classList.remove('modal__show');
            let formData = new FormData(formCategoriaR);
            formData.append('id_mrc', selectMarcaInventory.value);
            formData.append('createCategoria', '');
            fetch('../controladores/productos.php', {
                method: "POST",
                body: formData
            }).then(response => response.text()).then(data => {
                readAllCategorias().then(() => {
                    selectCategoriaInv();
                    selectCategoriaProd();
                    selectCategoriaProdR();
                    selectCategoriaProdM();
                    formCategoriaR.reset();
                    requestInventory = false;
                    preloader.classList.remove('modal__show');
                    mostrarAlerta(data);
                })
            }).catch(err => mostrarAlerta('Ocurrio un error al crear la categoria. Cargue nuevamente la pagina.'));
        }
    } else {
        mostrarAlerta('Seleccione una marca');
    }
}
//-------Eliminar Categoria
async function deleteCategoriaInv() {
    if (confirm('¿Esta usted seguro?')) {
        if (requestInventory == false) {
            requestInventory = true;
            preloader.classList.add('modal__show');
            let formData = new FormData();
            formData.append('id_mrc', selectMarcaInventory.value);
            formData.append('deleteCategoria', selectCategoriaInventory.value);
            fetch('../controladores/productos.php', {
                method: "POST",
                body: formData
            }).then(response => response.text()).then(data => {
                readAllCategorias().then(() => {
                    selectCategoriaInv();
                    selectCategoriaProd();
                    selectCategoriaProdR();
                    selectCategoriaProdM();
                    requestInventory = false;
                    preloader.classList.remove('modal__show');
                    mostrarAlerta(data);
                })
            }).catch(err => mostrarAlerta('Ocurrio un error al eliminar la categoria. Cargue nuevamente la pagina.'));
        }
    }
}
//------------------------------------MARCA Y CATEGORIA DE INVENTARIO--------------------------------->
//-------Select de marcas
function selectMarcaInv() {
    selectMarcaInventory.innerHTML = '';
    let option = document.createElement('option');
    option.value = 'todasLasMarcas';
    option.innerText = 'Todas las marcas';
    selectMarcaInventory.appendChild(option);
    marcas.forEach(marca => {
        let option = document.createElement('option');
        option.value = marca.id_mrc;
        option.innerText = marca.nombre_mrc;
        selectMarcaInventory.appendChild(option);
    });
}
//------Select categorias
function selectCategoriaInv() {
    selectCategoriaInventory.innerHTML = '';
    let option = document.createElement('option');
    option.value = 'todasLasCategorias';
    option.innerText = 'Todas las categorias';
    selectCategoriaInventory.appendChild(option);
    if (selectMarcaInventory.value != 'todasLasMarcas') {
        let id_mrc = selectMarcaInventory.value;
        categorias.forEach(categoria => {
            if (categoria.fk_id_mrc_mccr == id_mrc) {
                let option = document.createElement('option');
                option.value = categoria.id_ctgr;
                option.innerText = categoria.nombre_ctgr;
                selectCategoriaInventory.appendChild(option);
            }
        });
    }
    // Llamar a searchInventories solo si no estamos en la inicialización
    searchInventories();
}
/*----------------------------------------------Marca y categoria modal producto-------------------------------------------------*/
//-------Select de marcas
function selectMarcaProd() {
    selectMarcaProdMW.innerHTML = '';
    let option = document.createElement('option');
    option.value = 'todasLasMarcas';
    option.innerText = 'Todas las marcas';
    selectMarcaProdMW.appendChild(option);
    marcas.forEach(marca => {
        let option = document.createElement('option');
        option.value = marca.id_mrc;
        option.innerText = marca.nombre_mrc;
        selectMarcaProdMW.appendChild(option);
    });
}
//------Select categorias
function selectCategoriaProd() {
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
//------MARCA Y CATEGORIA PARA FORMULARIO DE REGSITRO Y MODIFICACION DE PRODUCTOS
const marca_prodR = document.getElementById('fk_id_mrc_prodR');
marca_prodR.addEventListener('change', selectCategoriaProdR);
const categoria_prodR = document.getElementById('fk_id_ctgr_prodR');
//-------Select de marcas registrar
function selectMarcaProdR() {
    marca_prodR.innerHTML = '';
    let option = document.createElement('option');
    option.value = 'todasLasMarcas';
    option.innerText = 'Todas las marcas';
    marca_prodR.appendChild(option);
    marcas.forEach(marca => {
        let option = document.createElement('option');
        option.value = marca.id_mrc;
        option.innerText = marca.nombre_mrc;
        marca_prodR.appendChild(option);
    });

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
        categorias.forEach(categoria => {
            if (categoria.fk_id_mrc_mccr == id_mrc) {
                let option = document.createElement('option');
                option.value = categoria.id_ctgr;
                option.innerText = categoria.nombre_ctgr;
                categoria_prodR.appendChild(option);
            }
        });
    }
}
const marca_prodM = document.getElementById('fk_id_mrc_prodM');
marca_prodM.addEventListener('change', selectCategoriaProdM);
const categoria_prodM = document.getElementById('fk_id_ctgr_prodM');
//-------Select de marcas registrar
function selectMarcaProdM() {
    marca_prodM.innerHTML = '';
    let option = document.createElement('option');
    option.value = 'todasLasMarcas';
    option.innerText = 'Todas las marcas';
    marca_prodM.appendChild(option);
    marcas.forEach(marca => {
        let option = document.createElement('option');
        option.value = marca.id_mrc;
        option.innerText = marca.nombre_mrc;
        marca_prodM.appendChild(option);
    });
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
        categorias.forEach(categoria => {
            if (categoria.fk_id_mrc_mccr == id_mrc) {
                let option = document.createElement('option');
                option.value = categoria.id_ctgr;
                option.innerText = categoria.nombre_ctgr;
                categoria_prodM.appendChild(option);
            }
        });
    }
}
//<<------------------------ABRIR Y CERRAR VENTANAS MODALES--------------------------------->>
const marcaRMW = document.getElementById('marcaRMW');
const closeMarcaRMW = document.getElementById('closeMarcaRMW');
openMarcaRMW.addEventListener('click', (e) => {
    marcaRMW.classList.add('modal__show');
});
closeMarcaRMW.addEventListener('click', (e) => {
    marcaRMW.classList.remove('modal__show');
});
const categoriaRMW = document.getElementById('categoriaRMW');
const closeCategoriaRMW = document.getElementById('closeCategoriaRMW');
openCategoriaRMW.addEventListener('click', (e) => {
    categoriaRMW.classList.add('modal__show');
});
closeCategoriaRMW.addEventListener('click', (e) => {
    categoriaRMW.classList.remove('modal__show');
});
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