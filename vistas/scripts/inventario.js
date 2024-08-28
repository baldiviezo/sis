//--------------------------------------------Restricciones de usuario----------------------------------------------
if (localStorage.getItem('rol_usua') == 'Gerente general') {
    //tabla inventario
    document.querySelector('main section.table__body tr').children[10].removeAttribute('hidden');
    //Marca y Categoria
    document.querySelector('.select__search').children[0].children[2].removeAttribute('hidden');
    document.querySelector('.select__search').children[0].children[3].removeAttribute('hidden');
    document.querySelector('.select__search').children[1].children[2].removeAttribute('hidden');
    document.querySelector('.select__search').children[1].children[3].removeAttribute('hidden');
    //inventoryRMW
    document.querySelector('#openInventoryRMW').removeAttribute('hidden');
    document.querySelector('#inventoryRMW .form__group--select').children[4].removeAttribute('hidden');
    //inventoryMMW
    document.querySelector('#inventoryMMW .form__group--select').children[4].removeAttribute('hidden');
}
//-------Marca y categoria
const selectMarcaInventory = document.getElementById('selectMarcaInventory');
selectMarcaInventory.addEventListener('change', selectCategoriaInv);
const selectCategoriaInventory = document.getElementById('selectCategoriaInventory');
selectCategoriaInventory.addEventListener('change', searchInventories);
//------Read inventarios
let inventories = {};
let filterInventories = {};
readInventories();
function readInventories() {
    let formData = new FormData();
    formData.append('readInventories', '');
    fetch('../controladores/inventario.php', {
        method: "POST",
        body: formData
    }).then(response => response.json()).then(data => {
        inventories = JSON.parse(JSON.stringify(data));
        filterInventories = JSON.parse(JSON.stringify(data));
        (selectMarcaInventory.value == 'todasLasMarcas' && selectCategoriaInventory.value == 'todasLasCategorias') ? paginacionInventory(Object.values(data).length, 1) : selectInventories();
    }).catch(err => console.log(err));
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
    paginacionInventory(Object.values(filterInventories).length, 1);
});
//------buscar por:
function searchInventories() {
    filterInventories = {};
    for (let inventory in inventories) {
        for (let valor in inventories[inventory]) {
            if (selectSearchInv.value == 'todas') {
                if (valor == 'codigo_prod' || valor == 'nombre_prod' || valor == 'descripcion_prod' || valor == 'cost_uni_inv') {
                    if (inventories[inventory][valor].toLowerCase().indexOf(inputSearchInv.value.toLowerCase()) >= 0) {
                        filterInventories[inventory] = inventories[inventory];
                        break;
                    }
                }
            } else {
                if (valor == selectSearchInv.value) {
                    if (inventories[inventory][valor].toLowerCase().indexOf(inputSearchInv.value.toLowerCase()) >= 0) {
                        filterInventories[inventory] = inventories[inventory];
                        break;
                    }
                }
            }
        }
    }
    selectInventories();
}
//------buscar por marca y categoria:
function selectInventories() {
    if (selectMarcaInventory.value == 'todasLasMarcas' && selectCategoriaInventory.value == 'todasLasCategorias') {
        paginacionInventory(Object.values(filterInventories).length, 1);
    } else {
        for (let ìnventory in filterInventories) {
            for (let valor in filterInventories[ìnventory]) {
                if (selectMarcaInventory.value == 'todasLasMarcas') {
                    if (filterInventories[ìnventory]['id_ctgr'] != selectCategoriaInventory.value) {
                        delete filterInventories[ìnventory];
                        break;
                    }
                } else if (selectCategoriaInventory.value == 'todasLasCategorias') {
                    if (filterInventories[ìnventory]['id_mrc'] != selectMarcaInventory.value) {
                        delete filterInventories[ìnventory];
                        break;
                    }
                } else {
                    if (filterInventories[ìnventory]['id_ctgr'] != selectCategoriaInventory.value || filterInventories[ìnventory]['id_mrc'] != selectMarcaInventory.value) {
                        delete filterInventories[ìnventory];
                        break;
                    }
                }
            }
        }
        filterInventories = JSON.parse(JSON.stringify(filterInventories));
        paginacionInventory(Object.values(filterInventories).length, 1);
    }
}
//------Ordenar tabla descendente ascendente
let orderInventories = document.querySelectorAll('.tbody__head--inventory');
orderInventories.forEach(div => {
    div.children[0].addEventListener('click', function () {
        let array = Object.entries(filterInventories).sort((a, b) => {
            let first = a[1][div.children[0].name].toLowerCase();
            let second = b[1][div.children[0].name].toLowerCase();
            if (first < second) { return -1 }
            if (first > second) { return 1 }
            return 0;
        })
        filterInventories = Object.fromEntries(array);
        paginacionInventory(Object.values(filterInventories).length, 1);
    });
    div.children[1].addEventListener('click', function () {
        let array = Object.entries(filterInventories).sort((a, b) => {
            let first = a[1][div.children[0].name].toLowerCase();
            let second = b[1][div.children[0].name].toLowerCase();
            if (first > second) { return -1 }
            if (first < second) { return 1 }
            return 0;
        })
        filterInventories = Object.fromEntries(array);
        paginacionInventory(Object.values(filterInventories).length, 1);
    });
})
//------PaginacionInventory
function paginacionInventory(allInventories, page) {
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
    inicio = (page - 1) * Number(selectNumberInv.value);
    final = inicio + Number(selectNumberInv.value);
    i = 1;
    tbody.innerHTML = '';
    for (let inventory in filterInventories) {
        if (i > inicio && i <= final) {
            let tr = document.createElement('tr');
            for (let valor in filterInventories[inventory]) {
                let td = document.createElement('td');
                if (valor == 'id_inv') {
                    td.innerText = filterInventories[inventory][valor];
                    td.setAttribute('hidden', '');
                    tr.appendChild(td);
                } else if (valor == 'id_mrc') {
                } else if (valor == 'id_ctgr') {
                } else if (valor == 'fk_id_prod_inv') {
                    td.innerText = filterInventories[inventory][valor];
                    td.setAttribute('hidden', '');
                    tr.appendChild(td);
                    td = document.createElement('td');
                    td.innerText = i;
                    tr.appendChild(td);
                    i++;
                } else if (valor == 'imagen_prod') {
                    let img = document.createElement('img');
                    img.classList.add('tbody__img');
                    img.setAttribute('src', '../modelos/imagenes/' + filterInventories[inventory][valor]);
                    td.appendChild(img);
                    tr.appendChild(td);
                } else {
                    td.innerText = filterInventories[inventory][valor];
                    tr.appendChild(td);
                }
            }
            let td = document.createElement('td');
            if(localStorage.getItem('rol_usua')=='Gerente general'){
                td.innerHTML = `
                <img src='../imagenes/edit.svg' onclick='readInventory(this.parentNode.parentNode)' title='Editar en Inventario'>
                <img src='../imagenes/trash.svg' onclick='deleteInventory(this.parentNode.parentNode)' title='Eliminar en Inventario'>`;
            }else{
                //td.innerHTML = ``;
            }
            tr.appendChild(td);
            tbody.appendChild(tr);
        } else {
            i++;
        }
    }
}
//<<-----------------------------------------CRUD INVENTARIO-------------------------------------->>
//------CREATE UN INVENTARIO
document.getElementById("formInventarioR").addEventListener("submit", createInventory);
function createInventory() {
    event.preventDefault();
    inventoryRMW.classList.remove('modal__show');
    let form = document.getElementById("formInventarioR");
    let formData = new FormData(form);
    formData.append('createInventory', '');
    fetch('../controladores/inventario.php', {
        method: "POST",
        body: formData
    }).then(response => response.text()).then(data => {
        alert(data);
        //Limpiar al registrar
        let inputsR = document.querySelectorAll('#formInventarioR .form__input');
        inputsR.forEach(input => { input.value = '' });
        readInventories();        
    }).catch(err => console.log(err));
}
//------LEER UN INVENTARIO
function readInventory(tr) {
    formProduct = 'M';
    let id_inv = tr.children[0].innerText;
    for (let inventory in filterInventories) {
        if (filterInventories[inventory]['id_inv'] == id_inv) {
            for (let valor in filterInventories[inventory]) {
                if (valor == 'marca_prod' || valor == 'categoria_prod' || valor == 'codigo_prod' || valor == 'nombre_prod' || valor == 'descripcion_prod' || valor == 'imagen_prod') {
                } else if (valor == 'id_ctgr') {
                } else if (valor == 'id_mrc') {
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
function updateInventory() {
    event.preventDefault();
    let form = document.getElementById("formInventarioM");
    let formData = new FormData(form);
    formData.append('updateInventory', '');
    fetch('../controladores/inventario.php', {
        method: "POST",
        body: formData
    }).then(response => response.text()).then(data => {
        alert(data);
        inventoryMMW.classList.remove('modal__show');
        readInventories();    
    }).catch(err => console.log(err));
}
//------DELETE UN INVENTARIO
function deleteInventory(tr) {
    if (confirm('¿Esta usted seguro?')) {
        let id = tr.children[0].innerText;
        let formData = new FormData();
        formData.append('deleteInventory', id);
        fetch('../controladores/inventario.php', {
            method: "POST",
            body: formData
        }).then(response => response.text()).then(data => {
            alert(data);
            readInventories();
        }).catch(error => console.log("Ocurrio un error. Intente nuevamente mas tarde"));
    }
}
//-----------------------------------Ventana modal para inventario---------------------------------//
const inventoryRMW = document.getElementById('inventoryRMW');
const inventoryMMW = document.getElementById('inventoryMMW');
const openInventoryRMW = document.getElementById('openInventoryRMW');
const openInventoryMMW = document.getElementById('openInventoryMMW');
const closeInventoryRMW = document.getElementById('closeInventoryRMW');
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
const selectProductR = document.getElementById('selectProductR');
const selectProductM = document.getElementById('selectProductM');
let products = {};
let filterProducts = {};
let sortProducts = {};
let indexProduct = 0;
let formProduct;
readProductsMW();
function readProductsMW() {
    let formData = new FormData();
    formData.append('readProducts', '');
    fetch('../controladores/productos.php', {
        method: "POST",
        body: formData
    }).then(response => response.json()).then(data => {
        products = JSON.parse(JSON.stringify(data)); 
        filterProducts = JSON.parse(JSON.stringify(data));
        sortProducts = JSON.parse(JSON.stringify(data));
        let array = Object.entries(sortProducts).sort((a, b) => {
            if (a[1].codigo_prod.toLowerCase() < b[1].codigo_prod.toLowerCase()) {
                return -1;
            }
            if (a[1].codigo_prod.toLowerCase() > b[1].codigo_prod.toLowerCase()) {
                return 1;
            }
            return 0;
        })
        sortProducts = Object.fromEntries(array);
        fillSelectProd(selectProductR, indexProduct);
        fillSelectProd(selectProductM, indexProduct);
        (selectMarcaProdMW.value == 'todasLasMarcas' && selectCategoriaProdMW.value == 'todasLasCategorias') ? paginacionProductMW(Object.values(data).length, 1) : selectProductsMW();
    }).catch(err => console.log(err));
}
function fillSelectProd(select, index) {
    select.innerHTML = '';
    for (let product in sortProducts) {
        let option = document.createElement('option');
        option.value = sortProducts[product]['id_prod'];
        option.innerText = sortProducts[product]['codigo_prod'];
        select.appendChild(option);
    }
    if (index > 0) { select.value = index }
}
//<<------------------------------------------CRUD DE PRODUCTS------------------------------------->>
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
                indexProduct = data;
                readProductsMW();
                readInventories();
                cleanUpProductFormR();
            }
        }).catch(err => console.log(err));
    }
}
//------Leer un producto
function readProduct(div) {
    cleanUpProductFormM();
    let id_prod = div.children[0].value;
    for (let product in products) {
        if (products[product]['id_prod'] == id_prod) {
            for (let valor in products[product]) {
                if (valor == 'imagen_prod') {
                    document.querySelector('.drop__areaM').setAttribute('style', `background-image: url("../modelos/imagenes/${products[product][valor]}"); background-size: cover;`);
                } else if (valor == 'id_ctgr') {
                } else if (valor == 'id_mrc') {
                } else if (valor == 'marca_prod') {
                    document.getElementsByName(valor + 'M')[0].value = products[product]['id_mrc'];
                } else if (valor == 'categoria_prod') {
                    selectCategoriaProdM();
                    document.getElementsByName(valor + 'M')[0].value = products[product]['id_ctgr'];
                } else {
                    document.getElementsByName(valor + 'M')[0].value = products[product][valor];
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
    if (marca_prodM.value == "todasLasMarcas") {
        alert("Debe seleccionar una marca");
    } else if (categoria_prodM.value == "todasLasCategorias") {
        alert("Debe seleccionar una categoria");
    } else {
        productsMMW.classList.remove('modal__show');
        let form = document.getElementById("formProductsM");
        let formData = new FormData(form);
        formData.append('updateProduct', '');
        fetch('../controladores/productos.php', {
            method: "POST",
            body: formData
        }).then(response => response.text()).then(data => {
            alert(data);
            indexProduct = document.getElementsByName('fk_id_prod_inv' + formProduct)[0].value;
            readProductsMW();
            readInventories();
        }).catch(err => console.log(err));
    }
}
//------Delete un producto
function deleteProduct(div) {
    if (confirm('¿Esta usted seguro?')) {
        let id_prod = div.children[0].value;
        const formData = new FormData()
        formData.append('deleteProduct', id_prod);
        fetch('../controladores/productos.php', {
            method: "POST",
            body: formData
        }).then(response => response.text()).then(data => {
            alert(data);
            indexProduct = 0;
            readProductsMW();
            readInventories();
        }).catch(error => console.log("Ocurrio un error. Intente nuevamente mas tarde"));
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
//<<--------------------------------------------------------CAMPOS DE LOS FORMULARIOS------------------------------->>
//------Vuelve oblogatorios los campos del formulario
function requiredInputProd() {
    inputsFormProduct.forEach(input => input.setAttribute("required", ""));
    //formulario registrar
    document.getElementsByName("imagen_prodR")[0].setAttribute('accept', "image/png, image/jpeg, image/jpg, image/gif");
    document.getElementsByName("descripcion_prodR")[0].setAttribute("required", "");
    //formulario modificar
    document.getElementsByName("id_prodM")[0].setAttribute("hidden", "");
    document.getElementsByName("imagen_prodM")[0].setAttribute("accept", "image/png, image/jpeg, image/jpg, image/gif");
    document.getElementsByName("descripcion_prodM")[0].setAttribute("required", "");
}
//<<-------------------------------------------------------ESPACIOS OBLIGATORIOS de formProductsR y formProductsM ------------------------------------------>>
inputsFormProduct.forEach(input => {
    input.setAttribute('required','');
})
//------Limpia los campos del fomulario registrar
function cleanUpProductFormR() {
    inputsFormProduct.forEach(input => input.value = "");
    document.getElementsByName("descripcion_prodR")[0].value = "";
    document.getElementsByName("imagen_prodR")[0].value = "";
    document.querySelector('.drop__areaR').removeAttribute('style');
}
//------Limpia los campos del fomulario Modificar
function cleanUpProductFormM(){
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
        alert('No es una archivo valido');
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
        alert('No es una archivo valido');
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
    paginacionProductMW(Object.values(filterProducts).length, 1);
});
//------buscar por:
function searchProductsMW() {
    filterProducts = {};
    for (let product in products) {
        for (let valor in products[product]) {
            if (selectSearchProdMW.value == 'todas') {
                if (valor == 'codigo_prod' || valor == 'nombre_prod' || valor == 'descripcion_prod') {
                    if (products[product][valor].toLowerCase().indexOf(inputSearchProdMW.value.toLowerCase()) >= 0) {
                        filterProducts[product] = products[product];
                        break;
                    }
                }
            } else {
                if (valor == selectSearchProdMW.value) {
                    if (products[product][valor].toLowerCase().indexOf(inputSearchProdMW.value.toLowerCase()) >= 0) {
                        filterProducts[product] = products[product];
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
        paginacionProductMW(Object.values(filterProducts).length, 1);
    } else {
        for (let product in filterProducts) {
            for (let valor in filterProducts[product]) {
                if (selectMarcaProdMW.value == 'todasLasMarcas') {
                    if (filterProducts[product]['id_ctgr'] != selectCategoriaProdMW.value) {
                        delete filterProducts[product];
                        break;
                    }
                } else if (selectCategoriaProdMW.value == 'todasLasCategorias') {
                    if (filterProducts[product]['id_mrc'] != selectMarcaProdMW.value) {
                        delete filterProducts[product];
                        break;
                    }
                } else {
                    if (filterProducts[product]['id_ctgr'] != selectCategoriaProdMW.value || filterProducts[product]['id_mrc'] != selectMarcaProdMW.value) {
                        delete filterProducts[product];
                        break;
                    }
                }
            }
        }
        paginacionProductMW(Object.values(filterProducts).length, 1);
    }
}
//------Ordenar tabla descendente ascendente
let orderProducts = document.querySelectorAll('.tbody__head--ProdMW');
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
        paginacionProductMW(Object.values(filterProducts).length, 1);
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
        paginacionProductMW(Object.values(filterProducts).length, 1);
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
                } else if (valor == 'id_mrc') {
                } else if (valor == 'id_ctgr') {
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
            td.innerHTML = `
        <img src='../imagenes/send.svg' onclick='sendProduct(this.parentNode.parentNode)' title='Seleccionar'>`;
            tr.appendChild(td);
            tbody.appendChild(tr);
        } else {
            i++;
        }
    }
}
function sendProduct(tr) {
    let id_prod = tr.children[0].innerText;
    let select = document.getElementsByName('fk_id_prod_inv' + formProduct)[0];
    select.value = id_prod;
    productSMW.classList.remove('modal__show');
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
        marcas = data;
        selectMarcaProd();
        selectMarcaProdR();
        selectMarcaProdM();
        selectMarcaInv();
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
        categorias = data;
        selectCategoriaProd();
        selectCategoriaInv();
        selectCategoriaProdR();
        selectCategoriaProdM();
    }).catch(err => console.log(err));
}
/*----------------------------------------------Marca y categoria inventario-------------------------------------------------*/
//-------Create Marca
let formMarcaR = document.getElementById('formMarcaR');
formMarcaR.addEventListener('submit', createMarcaInv);
function createMarcaInv() {
    event.preventDefault();
    marcaRMW.classList.remove('modal__show');
    let formData = new FormData(formMarcaR);
    formData.append('createMarca', '');
    fetch('../controladores/productos.php', {
        method: "POST",
        body: formData
    }).then(response => response.text()).then(data => {
            alert(data);
            readAllMarcas();
    }).catch(err => console.log(err));
}
//-------Eliminar Marca
function deleteMarcaInv() {
    let id_mrc = selectMarcaInventory.value;
    if (confirm('¿Esta usted seguro?')) {
        let formData = new FormData();
        formData.append('deleteMarca', id_mrc);
        fetch('../controladores/productos.php', {
            method: "POST",
            body: formData
        }).then(response => response.text()).then(data => {
            alert(data);
            readAllMarcas();
        }).catch(err => console.log(err));
    }
    selectMarcaInventory.selectedIndex = 0;
}
//-------Select de marcas
function selectMarcaInv() {
    selectMarcaInventory.innerHTML = '';
    let option = document.createElement('option');
    option.value = 'todasLasMarcas';
    option.innerText = 'Todas las marcas';
    selectMarcaInventory.appendChild(option);
    for (let clave in marcas) {
        let option = document.createElement('option');
        option.value = marcas[clave]['id_mrc'];
        option.innerText = marcas[clave]['nombre_mrc'];
        selectMarcaInventory.appendChild(option);
    }
}
//-------registrar categoria
let formCategoriaR = document.getElementById('formCategoriaR');
formCategoriaR.addEventListener('submit', createCategoriaInv);
function createCategoriaInv() {
    event.preventDefault();
    if (selectMarcaInventory.value != 'todasLasMarcas') {
        categoriaRMW.classList.remove('modal__show');
        let formData = new FormData(formCategoriaR);
        formData.append('id_mrc', selectMarcaInventory.value);
        formData.append('createCategoria', '');
        fetch('../controladores/productos.php', {
            method: "POST",
            body: formData
        }).then(response => response.text()).then(data => {
                alert(data);
                readAllCategorias();
        }).catch(err => console.log(err));
    } else {
        alert('Seleccione una marca');
    }
}
//-------Eliminar Categoria
function deleteCategoriaInv() {
    let id_ctgr = selectCategoriaInventory.value;
    if (confirm('¿Esta usted seguro?')) {
        let formData = new FormData();
        formData.append('id_mrc', selectMarcaInventory.value);
        formData.append('deleteCategoria', id_ctgr);
        fetch('../controladores/productos.php', {
            method: "POST",
            body: formData
        }).then(response => response.text()).then(data => {
            alert(data)
            readAllCategorias();
        }).catch(err => console.log(err));
    }
    selectCategoriaInventory.selectedIndex = 0;
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
        for (let clave in categorias) {
            if (categorias[clave]['id_mrc'] == id_mrc) {
                let option = document.createElement('option');
                option.value = categorias[clave]['id_ctgr'];
                option.innerText = categorias[clave]['nombre_ctgr'];
                selectCategoriaInventory.appendChild(option);
            }
        }
    }
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
    for (let clave in marcas) {
        let option = document.createElement('option');
        option.value = marcas[clave]['id_mrc'];
        option.innerText = marcas[clave]['nombre_mrc'];
        selectMarcaProdMW.appendChild(option);
    }
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
//<<------------------------ABRIR Y CERRAR VENTANAS MODALES--------------------------------->>
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