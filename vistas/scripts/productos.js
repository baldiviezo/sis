//--------------------------------------------Restricciones de usuario----------------------------------------------
if (localStorage.getItem('rol_usua') == 'Gerente general' || localStorage.getItem('rol_usua') == 'Administrador') {
    //marca y categoria create delete
    document.querySelector('.select__search').children[0].children[2].removeAttribute('hidden');
    document.querySelector('.select__search').children[0].children[3].removeAttribute('hidden');
    document.querySelector('.select__search').children[1].children[2].removeAttribute('hidden');
    document.querySelector('.select__search').children[1].children[3].removeAttribute('hidden');
} else if (localStorage.getItem('rol_usua') == 'Ingeniero' || localStorage.getItem('rol_usua') == 'Gerente De Inventario') {
    //marca y categoria create
    document.querySelector('.select__search').children[0].children[2].removeAttribute('hidden');
    document.querySelector('.select__search').children[1].children[2].removeAttribute('hidden');
    document.getElementsByName('codigo_prodM')[0].setAttribute('readonly', 'readonly');
}
//-------------------------------------------BLOCK REQUEST WITH A FLAG--------------------------------------------
let requestProducts = false;
const preloader = document.getElementById('preloader');
init();
async function init() {
    if (!requestProducts) {
        requestProducts = true;
        preloader.classList.add('modal__show');
        Promise.all([readProducts(), readAllMarcas(), readAllCategorias()]).then(() => {
            requestProducts = false;
            preloader.classList.remove('modal__show');
        }).catch((error) => {
            mostrarAlerta('Ocurrio un error al cargar la tabla de productos. Cargue nuevamente la pagina.');
        });
    }
}
//--------------------------------------------TABLE PRODUCT-----------------------------------------------------
//-------Marca y categoria
const selectMarcaProduct = document.getElementById('selectMarcaProduct');
selectMarcaProduct.addEventListener('change', selectCategoriaProd);
const selectCategoriaProduct = document.getElementById('selectCategoriaProduct');
selectCategoriaProduct.addEventListener('change', searchProducts);
//-------Read productos
let products = [];
let filterProducts = [];
async function readProducts() {
    return new Promise((resolve, reject) => {
        let formData = new FormData();
        formData.append('readProducts', '');
        fetch('../controladores/productos.php', {
            method: "POST",
            body: formData
        }).then(response => response.json()).then(data => {
            products = Object.values(data);
            filterProducts = products;
            (selectMarcaProduct.value == 'todasLasMarcas' && selectCategoriaProduct.value == 'todasLasCategorias') ? paginacionProduct(products.length, 1) : selectProducts();
            resolve();
        }).catch(err => console.log(err));
    })
}
//------Select utilizado para buscar por columnas
const selectSearchProduct = document.getElementById('selectSearchProduct');
selectSearchProduct.addEventListener('change', searchProducts);
//------buscar por input
const inputSerchProduct = document.getElementById("inputSerchProduct");
inputSerchProduct.addEventListener("keyup", searchProducts);
//------Clientes por pagina
const selectNumberProduct = document.getElementById('selectNumberProduct');
selectNumberProduct.selectedIndex = 3;
selectNumberProduct.addEventListener('change', function () {
    paginacionProduct(filterProducts.length, 1);
});
//------buscar por:
function searchProducts() {
    const busqueda = inputSerchProduct.value.toLowerCase();
    const valor = selectSearchProduct.value;
    filterProducts = products.filter(product => {
        if (valor == 'todas') {
            return product.codigo_prod.toLowerCase().includes(busqueda) ||
                product.nombre_prod.toLowerCase().includes(busqueda) ||
                product.descripcion_prod.toLowerCase().includes(busqueda);
        } else {
            return product[valor].toLowerCase().includes(busqueda);
        }
    });
    selectProducts();
}
//------buscar por marca y categoria:
function selectProducts() {
    if (selectMarcaProduct.value == 'todasLasMarcas' && selectCategoriaProduct.value == 'todasLasCategorias') {
        paginacionProduct(filterProducts.length, 1);
    } else {
        filterProducts = filterProducts.filter(product => {
            if (selectMarcaProduct.value == 'todasLasMarcas') {
                return product['id_ctgr'] == selectCategoriaProduct.value;
            } else if (selectCategoriaProduct.value == 'todasLasCategorias') {
                return product['id_mrc'] == selectMarcaProduct.value;
            } else {
                return product['id_ctgr'] == selectCategoriaProduct.value && product['id_mrc'] == selectMarcaProduct.value;
            }
        });
        paginacionProduct(filterProducts.length, 1);
    }
}
//------Ordenar tabla descendente ascendente
let orderProducts = document.querySelectorAll('.tbody__head--Product');
orderProducts.forEach(div => {
    div.children[0].addEventListener('click', function () {
        filterProducts.sort((a, b) => {
            let first = a[div.children[0].name].toLowerCase();
            let second = b[div.children[0].name].toLowerCase();
            if (first < second) { return -1 }
            if (first > second) { return 1 }
            return 0;
        });
        paginacionProduct(filterProducts.length, 1);
    });
    div.children[1].addEventListener('click', function () {
        filterProducts.sort((a, b) => {
            let first = a[div.children[0].name].toLowerCase();
            let second = b[div.children[0].name].toLowerCase();
            if (first > second) { return -1 }
            if (first < second) { return 1 }
            return 0;
        });
        paginacionProduct(filterProducts.length, 1);
    });
});
//------PaginacionProduct
function paginacionProduct(allProducts, page) {
    let numberProducts = Number(selectNumberProduct.value);
    let allPages = Math.ceil(allProducts / numberProducts);
    let ul = document.querySelector('#wrapperProduct ul');
    let li = '';
    let beforePages = page - 1;
    let afterPages = page + 1;
    let liActive;
    if (page > 1) {
        li += `<li class="btn" onclick="paginacionProduct(${allProducts}, ${page - 1})"><img src="../imagenes/arowLeft.svg"></li>`;
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
        li += `<li class="numb ${liActive}" onclick="paginacionProduct(${allProducts}, ${pageLength})"><span>${pageLength}</span></li>`;
    }
    if (page < allPages) {
        li += `<li class="btn" onclick="paginacionProduct(${allProducts}, ${page + 1})"><img src="../imagenes/arowRight.svg"></li>`;
    }
    ul.innerHTML = li;
    let h2 = document.querySelector('#showPageProduct h2');
    h2.innerHTML = `Pagina ${page}/${allPages}, ${allProducts} Productos`;
    tableProducts(page);
}
//------Crear la tabla
function tableProducts(page) {
    let tbody = document.getElementById('tbodyProduct');
    inicio = (page - 1) * Number(selectNumberProduct.value);
    final = inicio + Number(selectNumberProduct.value);
    i = 1;
    tbody.innerHTML = '';
    for (let product in filterProducts) {
        if (i > inicio && i <= final) {
            let tr = document.createElement('tr');
            for (let valor in filterProducts[product]) {
                let td = document.createElement('td');
                if (valor == 'id_prod') {
                    td.innerText = filterProducts[product][valor];
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
                    img.setAttribute('src', '../modelos/imagenes/' + filterProducts[product][valor]);
                    td.appendChild(img);
                    tr.appendChild(td);
                } else {
                    td.innerText = filterProducts[product][valor];
                    tr.appendChild(td);
                }
            }
            let td = document.createElement('td');
            let html = '';
            if (filterProducts[product]['catalogo_prod'] != '') {
                html += `<a href='${filterProducts[product]['catalogo_prod']}' target='_blank'><img src='../imagenes/pdf.svg' title='Catálogo'></a>`;
            }
            if (localStorage.getItem('rol_usua') == 'Gerente general' || localStorage.getItem('rol_usua') == 'Administrador') {
                html += `
                <img src='../imagenes/edit.svg' onclick='readProduct(this.parentNode.parentNode)' title='Editar producto'>
                <img src='../imagenes/trash.svg' onclick='deleteProduct(this.parentNode.parentNode)' title='Eliminar Producto'>`;
            } else {
                html += `
                <img src='../imagenes/edit.svg' onclick='readProduct(this.parentNode.parentNode)' title='Editar Producto'>`;
            }
            td.innerHTML = html;
            tr.appendChild(td);
            tbody.appendChild(tr);
        } else {
            i++;
        }
    }
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
        if (requestProducts == false) {
            requestProducts = true;
            preloader.classList.add('modal__show');
            let form = document.getElementById("formProductsR");
            let formData = new FormData(form);
            formData.append('createProduct', '');
            fetch('../controladores/productos.php', {
                method: "POST",
                body: formData
            }).then(response => response.text()).then(data => {
                requestProducts = false;
                
                if (data == "El codigo ya existe") {
                    mostrarAlerta(data);
                    preloader.classList.remove('modal__show');
                } else if (data == "El codigo SMC ya existe"){
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
            }).catch(err => {
                requestProducts = false;
                mostrarAlerta('Ocurrio un error al crear el producto. Cargue nuevamente la pagina.');
            });
        }
    }
}
//------Leer un producto
function readProduct(tr) {
    cleanUpProductFormM();
    let id_prod = tr.children[0].innerText;
    for (let product in filterProducts) {
        if (filterProducts[product]['id_prod'] == id_prod) {
            for (let valor in filterProducts[product]) {
                if (valor == 'imagen_prod') {
                    document.querySelector('.drop__areaM').setAttribute('style', `background-image: url("../modelos/imagenes/${filterProducts[product][valor]}"); background-size: cover;`);
                } else if (valor == 'codigo_smc_prod') {
                    if (filterProducts[product]['id_mrc'] == '15') {
                        divCodigoSMCM.removeAttribute('hidden');
                        document.getElementsByName(valor + 'M')[0].value = filterProducts[product][valor];
                    }
                } else if (valor == 'id_ctgr') {
                } else if (valor == 'id_mrc') {
                } else if (valor == 'marca_prod') {
                    document.getElementsByName(valor + 'M')[0].value = filterProducts[product]['id_mrc'];
                } else if (valor == 'categoria_prod') {
                    selectCategoriaProdM();
                    document.getElementsByName(valor + 'M')[0].value = filterProducts[product]['id_ctgr'];
                } else {
                    document.getElementsByName(valor + 'M')[0].value = filterProducts[product][valor];
                }
            }
            break;
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
        if (requestProducts == false) {
            requestProducts = true;
            let form = document.getElementById("formProductsM");
            let formData = new FormData(form);
            formData.append('updateProduct', '');
            preloader.classList.add('modal__show');
            fetch('../controladores/productos.php', {
                method: "POST",
                body: formData
            }).then(response => response.text()).then(data => {
                requestProducts = false;
                if (data == "El codigo ya existe") {
                    mostrarAlerta(data);
                    preloader.classList.remove('modal__show');
                } else if (data == 'El codigo SMC ya existe'){
                    mostrarAlerta(data);
                    preloader.classList.remove('modal__show');
                } else {
                    readProducts().then(() => {
                        productsMMW.classList.remove('modal__show');
                        mostrarAlerta(data);
                        preloader.classList.remove('modal__show');
                    })
                }
            }).catch(err => {
                requestProducts = false;
                mostrarAlerta('Ocurrio un error al actualizar el producto. Cargue nuevamente la pagina.');
            });
        }
    }
}
//------Delete un producto
async function deleteProduct(tr) {
    if (confirm(`¿Esta usted seguro? Se eliminará el producto "${tr.children[4].innerText}"`)) {
        if (requestProducts == false) {
            requestProducts = true;
            let id_prod = tr.children[0].innerText;
            let formData = new FormData()
            formData.append('deleteProduct', id_prod);
            preloader.classList.add('modal__show');
            fetch('../controladores/productos.php', {
                method: "POST",
                body: formData
            }).then(response => response.text()).then(data => {
                readProducts().then(() => {
                    preloader.classList.remove('modal__show');
                    requestProducts = false;
                    mostrarAlerta(data);
                });
            }).catch(err => {
                requestProducts = false;
                mostrarAlerta('Ocurrio un error al eliminar el producto. Cargue nuevamente la pagina.');
            });
        }

    }
}
//<<--------------------------------------------ABRIR Y CERRAR VENTANAS MODALES--------------------------------->>
const productsRMW = document.getElementById('productsRMW');
const productsMMW = document.getElementById('productsMMW');
const openProductsRMW = document.getElementById('openProductsRMW');
const closeProductsRMW = document.getElementById('closeProductsRMW');
const closeProductsMMW = document.getElementById('closeProductsMMW');
openProductsRMW.addEventListener('click', (e) => {
    productsRMW.classList.add('modal__show');
});
closeProductsRMW.addEventListener('click', (e) => {
    productsRMW.classList.remove('modal__show');
});

closeProductsMMW.addEventListener('click', (e) => {
    productsMMW.classList.remove('modal__show');
});
//<<-----------------------------------------------------MUESTRA LA IMAGEN CARGADA------------------------------>>
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
    document.querySelector('.drop__areaR').setAttribute('style', `background-image: url("${urlDeImagen}"); background-size: cover; background-position: center; background-repeat: no-repeat;`);
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
//<<------------------------------------------------------CAMPOS DE LOS FORMULARIOS------------------------------->>
const inputsFormProduct = document.querySelectorAll('.modalP__form .modalP__group input');
//------Vuelve oblogatorios los campos del formulario
//<<-------------------------------------------------------ESPACIOS OBLIGATORIOS de formProductsR y formProductsM ------------------------------------------>>
inputsFormProduct.forEach(input => {
    input.setAttribute('required', '');
    document.getElementsByName("codigo_smc_prodR")[0].removeAttribute('required');
    document.getElementsByName("codigo_smc_prodM")[0].removeAttribute('required');
})
//<<---------------------------------------------------LIMPIAR CAMPOS DEL FORMULARIO----------------------------------->>
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
/*----------------------------------------------Marca y categoria-------------------------------------------------*/
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
            selectMarcaProd();
            selectMarcaProdR();
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
            selectCategoriaProd();
            selectCategoriaProdR();
            selectCategoriaProdM();
            resolve();
        }).catch(err => console.log(err));
    })
}
/*---------------------------------------------- CRUD Marca y categoria-------------------------------------------------*/
//-------Create Marca
let formMarcaR = document.getElementById('formMarcaR');
formMarcaR.addEventListener('submit', createMarcaProd);
async function createMarcaProd() {
    marcaRMW.classList.remove('modal__show');
    event.preventDefault();
    let formData = new FormData(formMarcaR);
    formData.append('createMarca', '');
    fetch('../controladores/productos.php', {
        method: "POST",
        body: formData
    }).then(response => response.text()).then(data => {
        readAllMarcas().then(() => {
            mostrarAlerta(data);
        })
    }).catch(err => mostrarAlerta('Ocurrio un error al crear la marca. Cargue nuevamente la pagina.'));
}
//-------Eliminar Marca
async function deleteMarcaProd() {
    let id_mrc = selectMarcaProduct.value;
    if (confirm('¿Esta usted seguro?')) {
        let formData = new FormData();
        formData.append('deleteMarca', id_mrc);
        fetch('../controladores/productos.php', {
            method: "POST",
            body: formData
        }).then(response => response.text()).then(data => {
            readAllMarcas().then(() => {
                mostrarAlerta(data);
            })
        }).catch(err => mostrarAlerta('Ocurrio un error al eliminar la marca. Cargue nuevamente la pagina.'));
    }
}
//-------Select de marcas
function selectMarcaProd() {
    selectMarcaProduct.innerHTML = '';
    let option = document.createElement('option');
    option.value = 'todasLasMarcas';
    option.innerText = 'Todas las marcas';
    selectMarcaProduct.appendChild(option);
    for (let clave in marcas) {
        let option = document.createElement('option');
        option.value = marcas[clave]['id_mrc'];
        option.innerText = marcas[clave]['nombre_mrc'];
        selectMarcaProduct.appendChild(option);
    }
}
//-------registrar categoria
let formCategoriaR = document.getElementById('formCategoriaR');
formCategoriaR.addEventListener('submit', createCategoriaProd);
async function createCategoriaProd() {
    event.preventDefault();
    if (selectMarcaProduct.value != 'todasLasMarcas') {
        categoriaRMW.classList.remove('modal__show');
        let formData = new FormData(formCategoriaR);
        formData.append('id_mrc', selectMarcaProduct.value);
        formData.append('createCategoria', '');
        fetch('../controladores/productos.php', {
            method: "POST",
            body: formData
        }).then(response => response.text()).then(data => {
            readAllCategorias().then(() => {
                mostrarAlerta(data);
            })
        }).catch(err => mostrarAlerta('Ocurrio un error al crear la categoria. Cargue nuevamente la pagina.'));
    } else {
        mostrarAlerta('Seleccione una marca');
    }
}
//-------Eliminar Categoria
async function deleteCategoriaProd() {
    let id_ctgr = selectCategoriaProduct.value;
    if (confirm('¿Esta usted seguro?')) {
        let formData = new FormData();
        formData.append('id_mrc', selectMarcaProduct.value);
        formData.append('deleteCategoria', id_ctgr);
        fetch('../controladores/productos.php', {
            method: "POST",
            body: formData
        }).then(response => response.text()).then(data => {
            readAllCategorias().then(() => {
                mostrarAlerta(data);
            })
        }).catch(err => mostrarAlerta('Ocurrio un error al eliminar la categoria. Cargue nuevamente la pagina.'));
    }
    selectCategoriaProduct.selectedIndex = 0;
}
//------Select categorias
function selectCategoriaProd() {
    selectCategoriaProduct.innerHTML = '';
    let option = document.createElement('option');
    option.value = 'todasLasCategorias';
    option.innerText = 'Todas las categorias';
    selectCategoriaProduct.appendChild(option);
    if (selectMarcaProduct.value != 'todasLasMarcas') {
        let id_mrc = selectMarcaProduct.value;
        for (let clave in categorias) {
            if (categorias[clave]['id_mrc'] == id_mrc) {
                let option = document.createElement('option');
                option.value = categorias[clave]['id_ctgr'];
                option.innerText = categorias[clave]['nombre_ctgr'];
                selectCategoriaProduct.appendChild(option);
            }
        }
    }
    searchProducts();
}
//------MARCA Y CATEGORIA PARA FORMULARIO DE REGSITRO Y MODIFICACION DE PRODUCTOS
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
//<<------------------------ABRIR Y CERRAR VENTANAS MODALES DE MARCA Y CATEGORIA--------------------------------->>
const marcaRMW = document.getElementById('marcaRMW');
const openMarcaRMW = document.getElementById('openMarcaRMW');
const closeMarcaRMW = document.getElementById('closeMarcaRMW');
openMarcaRMW.addEventListener('click', (e) => {
    marcaRMW.classList.add('modal__show');
});
closeMarcaRMW.addEventListener('click', (e) => {
    marcaRMW.classList.remove('modal__show');
});
const categoriaRMW = document.getElementById('categoriaRMW');
const openCategoriaRMW = document.getElementById('openCategoriaRMW');
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