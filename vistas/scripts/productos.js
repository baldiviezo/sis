//-------Marca y categoria
const selectMarcaProduct = document.getElementById('selectMarcaProduct');
selectMarcaProduct.addEventListener('change', searchProducts);
const selectCategoriaProduct = document.getElementById('selectCategoriaProduct');
selectCategoriaProduct.addEventListener('change', searchProducts);
//-------Read productos
let products = {};
let filterProducts = {};
readProducts();
function readProducts() {
    let formData = new FormData();
    formData.append('readProducts','');
    fetch('../controladores/productos.php', {
        method: "POST",
        body: formData
    }).then(response => response.json()).then(data => {
        products = data;
        filterProducts = data;
        (selectMarcaProduct.value == 'todasLasMarcas' && selectCategoriaProduct.value == 'todasLasCategorias') ? paginacionProduct(Object.values(data).length, 1) : selectProducts();
    }).catch(err => console.log(err));
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
selectNumberProduct.addEventListener('change', function(){
    paginacionProduct(Object.values(filterProducts).length, 1);
});
//------buscar por:
function searchProducts(){
    filterProducts = {};
    for(let product in products){
        for(let valor in products[product]){
            if(selectSearchProduct.value == 'todas'){
                if(valor == 'codigo_prod' ||  valor == 'nombre_prod' || valor == 'descripcion_prod'){
                    if(products[product][valor].toLowerCase().indexOf(inputSerchProduct.value.toLowerCase())>=0){
                        filterProducts[product] = products[product];
                        break;
                    }
                }
            }else{
                if(valor == selectSearchProduct.value){
                    if(products[product][valor].toLowerCase().indexOf(inputSerchProduct.value.toLowerCase())>=0){
                        filterProducts[product] = products[product];
                        break;
                    }
                }
            }
        }
    }
    selectProducts();
}
//------buscar por marca y categoria:
function selectProducts(){
    if(selectMarcaProduct.value == 'todasLasMarcas' && selectCategoriaProduct.value == 'todasLasCategorias'){
        paginacionProduct(Object.values(filterProducts).length, 1);
    }else{
        for(let product in filterProducts){
            for(let valor in filterProducts[product]){
                if(selectMarcaProduct.value == 'todasLasMarcas'){
                    if(filterProducts[product]['categoria_prod'] != selectCategoriaProduct.value){
                        delete filterProducts[product];
                        break;
                    }    
                }else if(selectCategoriaProduct.value == 'todasLasCategorias'){
                    if(filterProducts[product]['marca_prod'] != selectMarcaProduct.value){
                        delete filterProducts[product];
                        break;
                    }  
                }else{
                    if(filterProducts[product]['categoria_prod'] != selectCategoriaProduct.value || filterProducts[product]['marca_prod'] != selectMarcaProduct.value){
                        delete filterProducts[product];
                        break;
                    }  
                }
            }
        }
        paginacionProduct(Object.values(filterProducts).length, 1); 
    }
}
//------Ordenar tabla descendente ascendente
let orderProducts = document.querySelectorAll('.tbody__head--Product');
orderProducts.forEach(div=>{
    div.children[0].addEventListener('click', function() {
        let array = Object.entries(filterProducts).sort((a,b)=>{
            let first = a[1][div.children[0].name].toLowerCase();
            let second = b[1][div.children[0].name].toLowerCase();
            if( first < second){return -1}
            if(first > second){return 1}
            return 0;
        })
        filterProducts = Object.fromEntries(array);
        paginacionProduct(Object.values(filterProducts).length, 1);
    });
    div.children[1].addEventListener('click', function() {
        let array = Object.entries(filterProducts).sort((a,b)=>{
            let first = a[1][div.children[0].name].toLowerCase();
            let second = b[1][div.children[0].name].toLowerCase();
            if( first > second){return -1}
            if(first < second){return 1}
            return 0;
        })
        filterProducts = Object.fromEntries(array);
        paginacionProduct(Object.values(filterProducts).length, 1);
    });
})
//------PaginacionProduct
function paginacionProduct(allProducts, page){
    let numberProducts = Number(selectNumberProduct.value);
    let allPages = Math.ceil(allProducts/numberProducts);
    let ul = document.querySelector('#wrapperProduct ul');
    let li = '';
    let beforePages = page-1;
    let afterPages = page +1;
    let liActive;
    if(page > 1){
        li+= `<li class="btn" onclick="paginacionProduct(${allProducts}, ${page-1})"><img src="../imagenes/arowLeft.svg"></li>`;
    }
    for(let pageLength = beforePages; pageLength <= afterPages; pageLength++){
        if(pageLength > allPages){
            continue;
        }
        if(pageLength == 0){
            pageLength = pageLength +1;
        }
        if(page == pageLength){
            liActive = 'active';
        }else{
            liActive = '';
        }
        li+= `<li class="numb ${liActive}" onclick="paginacionProduct(${allProducts}, ${pageLength})"><span>${pageLength}</span></li>`;
    }
    if(page < allPages){
        li += `<li class="btn" onclick="paginacionProduct(${allProducts}, ${page+1})"><img src="../imagenes/arowRight.svg"></li>`;
    }
    ul.innerHTML = li;
    let h2= document.querySelector('#showPageProduct h2');
    h2.innerHTML =`Pagina ${page}/${allPages}, ${allProducts} Productos`;
    tableProducts(page);
}
//------Crear la tabla
function tableProducts(page) {
    let tbody = document.getElementById('tbodyProduct');
    inicio = (page-1)*Number(selectNumberProduct.value); 
    final = inicio + Number(selectNumberProduct.value);
    i=1;
    tbody.innerHTML = '';
    for(let product in filterProducts){
       if( i > inicio && i <= final){
        let tr = document.createElement('tr');
        for(let valor in filterProducts[product]){
            let td = document.createElement('td');
            if(valor == 'id_prod'){
                td.innerText = filterProducts[product][valor];
                td.setAttribute('hidden', '');
                tr.appendChild(td);
                td = document.createElement('td');
                td.innerText = i;
                tr.appendChild(td);
                i++;
            }else if(valor == 'imagen_prod'){
                let img = document.createElement('img');
                img.classList.add('tbody__img');
                img.setAttribute('src', '../modelos/imagenes/'+filterProducts[product][valor]);
                td.appendChild(img);
                tr.appendChild(td);
            }else{
                td.innerText = filterProducts[product][valor];
                tr.appendChild(td);
            }
        }
        let td = document.createElement('td');
        td.innerHTML = `
        <img src='../imagenes/edit.svg' onclick='readProduct(this.parentNode.parentNode)'>
        <img src='../imagenes/trash.svg' onclick='deleteProduct(this.parentNode.parentNode)'>`;
        tr.appendChild(td);
        tbody.appendChild(tr);
        }else{
            i++;    
        }
    }   
}


//<<------------------------------------------CRUD DE PRODUCTS------------------------------------->>
//------Create un producto
document.getElementById("formProductsR").addEventListener("submit", createProduct);
function createProduct(){
    event.preventDefault();
    let form = document.getElementById("formProductsR");
    let formData = new FormData(form);
    formData.append('createProduct', '');
    fetch('../controladores/productos.php', {
            method: "POST",
            body: formData
    }).then(response => response.text()).then(data => {
        if (data=="El codigo ya existe"){
            alert(data);
        }else{
            productsRMW.classList.remove('modal__show');
            readProducts();
            cleanUpProductFormR();
        }
    }).catch(err => console.log(err));
}
//------Leer un producto
function readProduct(tr){
    let id_prod = tr.children[0].innerText;
    for(let product in filterProducts){
        if(filterProducts[product]['id_prod']==id_prod){
            for(let valor in filterProducts[product]){
                if(valor == 'imagen_prod'){
                    document.querySelector('.drop__areaM').setAttribute('style', `background-image: url("../modelos/imagenes/${filterProducts[product][valor]}"); background-size: cover;`);
                }else{
                    document.getElementsByName(valor+'M')[0].value = filterProducts[product][valor];
                }
            }
            break;
        }
    }
    productsMMW.classList.add('modal__show');
}
//-------Update un producto
document.getElementById("formProductsM").addEventListener("submit", updateProduct);
function updateProduct(){
    event.preventDefault();
    let form = document.getElementById("formProductsM");
    let formData = new FormData(form);
    formData.append('updateProduct', '');
    fetch('../controladores/productos.php', {
            method: "POST",
            body: formData
    }).then(response => response.json()).then(data => {
        if (data=="Modificado"){
            productsMMW.classList.remove('modal__show');
            readProducts();
        }else{
            alert(data);
        }
    }).catch(err => console.log(err));
}
//------Delete un producto
function deleteProduct (tr){
    if (confirm('¿Esta usted seguro?')){
        let id_prod = tr.children[0].innerText;
        let formData = new FormData()
        formData.append('deleteProduct', id_prod);
        fetch('../controladores/productos.php', {
            method: "POST",
            body: formData
        }).then(response => response.text()).then(data => {
            readProducts();
        }).catch(error => console.log("Ocurrio un error. Intente nuevamente mas tarde"));
    }
}

//<<--------------------------------------------ABRIR Y CERRAR VENTANAS MODALES--------------------------------->>
const productsRMW = document.getElementById('productsRMW');
const productsMMW = document.getElementById('productsMMW');
const openProductsRMW = document.getElementById('openProductsRMW');
const closeProductsRMW = document.getElementById('closeProductsRMW');
const closeProductsMMW = document.getElementById('closeProductsMMW');
openProductsRMW.addEventListener('click',(e)=>{
    productsRMW.classList.add('modal__show');
});
closeProductsRMW.addEventListener('click',(e)=>{
    productsRMW.classList.remove('modal__show');
});

closeProductsMMW.addEventListener('click',(e)=>{
    productsMMW.classList.remove('modal__show');
});
//<<-----------------------------------------------------MUESTRA LA IMAGEN CARGADA------------------------------>>
document.getElementById("imagen_prodR").addEventListener("change", mostrarimagenR);
document.getElementById("imagen_prodM").addEventListener("change", mostrarimagenM);
//-------Muestra en un campo la imagen que se esta seleccionando para registrar
function mostrarimagenR () {
    let form = document.getElementById('formProductsR');
    //Seleccionar los elementos del form registrar antes de enviar el formulario
    let formData = new FormData(form);
    let imagen = formData.get('imagen_prodR');
    //URL.createObjectURL() crea un DOMString que contiene una URL que representa al objeto pasado como parámetro.
    let urlDeImagen = URL.createObjectURL(imagen);
    document.querySelector('.drop__areaR').setAttribute('style', `background-image: url("${urlDeImagen}"); background-size: cover;`);
}
//------Muestra en un campo la imagen que se esta seleccionado para modificar
function mostrarimagenM () {
    let form = document.getElementById('formProductsM');
    //Seleccionar los elementos del form registrar antes de enviar el formulario
    let formData = new FormData(form);
    let imagen = formData.get('imagen_prodM');
    //URL.createObjectURL() crea un DOMString que contiene una URL que representa al objeto pasado como parámetro.
    let urlDeImagen = URL.createObjectURL(imagen);
    document.querySelector('.drop__areaM').setAttribute('style', `background-image: url("${urlDeImagen}"); background-size: cover;`);
}
//<<------------------------------------------------------CAMPOS DE LOS FORMULARIOS------------------------------->>
const inputsFormProduct = document.querySelectorAll('.modalP__form .modalP__group input');
//------Vuelve oblogatorios los campos del formulario
function requiredInputProd(){
    inputsFormProduct.forEach(input => input.setAttribute("required",""));
    //formulario registrar
    document.getElementsByName("imagen_prodR")[0].setAttribute('accept',"image/png, image/jpeg, image/jpg, image/gif");
    document.getElementsByName("descripcion_prodR")[0].setAttribute("required","");
    //formulario modificar
    document.getElementsByName("id_prodM")[0].setAttribute("hidden","");
    document.getElementsByName("imagen_prodM")[0].setAttribute("accept","image/png, image/jpeg, image/jpg, image/gif");
    document.getElementsByName("descripcion_prodM")[0].setAttribute("required","");
}
//<<---------------------------------------------------LIMPIAR CAMPOS DEL FORMULARIO----------------------------------->>
//------Limpia los campos del fomulario registrar
function cleanUpProductFormR(){
    inputsFormProduct.forEach(input => input.value = "");
    document.getElementsByName("descripcion_prodR")[0].value = "";
    document.getElementsByName("imagen_prodR")[0].value = "";
    document.querySelector('.drop__areaR').removeAttribute('style');
}
//----------------------------------DRANG AND DROP-----------------------------------------------------
const dropAreaR = document.querySelector('.drop__areaR');
const dragTextR = dropAreaR.querySelector('h2');
const buttonR = dropAreaR.querySelector('button');
const inputR = dropAreaR.querySelector('#imagen_prodR');
let filesR;
buttonR.addEventListener('click', ()=>{
    //llamamos al evento click del inputR
    event.preventDefault();
    inputR.click();
})
/*Cuando tenemos elementos q se estan arraztrando se activa*/
dropAreaR.addEventListener('dragover', (e)=>{
    //Se necesita poner el preventDefault
    e.preventDefault();
    dropAreaR.classList.add('active');
    dragTextR.textContent = 'Suelta para subir el archivo';

});
/*Cunado estemos arrastrando pero no estamos dentro de la zona*/
dropAreaR.addEventListener('dragleave', (e)=>{
    //Se necesita poner el preventDefault
    e.preventDefault();
    dropAreaR.classList.remove('active');
    dragTextR.textContent = 'Arrastra y suelta la imágen';
});
/*Cuando soltamos el archivo q estamos arrastrando dentro de la zona*/
dropAreaR.addEventListener('drop', (e)=>{
    //Se necesita poner el preventDefault para que al momento de soltar no abra la imagen en el navegador
    e.preventDefault();
    filesR = e.dataTransfer.files;
    showFiles();
    dropAreaR.classList.remove('active');
    dragTextR.textContent = 'Arrastra y suelta la imagen';
});
function showFiles(){
        for(let file of filesR){
            processFile(file);
        }
}
function processFile(file){
    let docType = file.type;
    let validExtensions = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif'];
    if(validExtensions.includes(docType)){
        //archivo valido
        inputR.files = filesR;
        mostrarimagenR();
    }else{
        //archivo no valido
        alert('No es una archivo valido');
    }
}
const dropAreaM = document.querySelector('.drop__areaM');
const dragTextM = dropAreaM.querySelector('h2');
const buttonM = dropAreaM.querySelector('button');
const inputM = dropAreaM.querySelector('#imagen_prodM');
let filesM;
buttonM.addEventListener('click', ()=>{
    //llamamos al evento click del inputR
    event.preventDefault();
    inputM.click();
})
/*Cuando tenemos elementos q se estan arraztrando se activa*/
dropAreaM.addEventListener('dragover', (e)=>{
    //Se necesita poner el preventDefault
    e.preventDefault();
    dropAreaM.classList.add('active');
    dragTextM.textContent = 'Suelta para subir el archivo';

});
/*Cunado estemos arrastrando pero no estamos dentro de la zona*/
dropAreaM.addEventListener('dragleave', (e)=>{
    //Se necesita poner el preventDefault
    e.preventDefault();
    dropAreaM.classList.remove('active');
    dragTextM.textContent = 'Arrastra y suelta la imágen';
});
/*Cuando soltamos el archivo q estamos arrastrando dentro de la zona*/
dropAreaM.addEventListener('drop', (e)=>{
    //Se necesita poner el preventDefault para que al momento de soltar no abra la imagen en el navegador
    e.preventDefault();
    filesM = e.dataTransfer.files;
    showFilesM();
    dropAreaM.classList.remove('active');
    dragTextM.textContent = 'Arrastra y suelta la imagen';
});
function showFilesM(){
        for(let file of filesM){
            processFileM(file);
        }
}
function processFileM(file){
    let docType = file.type;
    let validExtensions = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif'];
    if(validExtensions.includes(docType)){
        //archivo valido
        inputM.files = filesM;
        mostrarimagenM();
    }else{
        //archivo no valido
        alert('No es una archivo valido');
    }
}



/*----------------------------------------------Marca y categoria-------------------------------------------------*/
//-------registrar Marca
let formMarcaR = document.getElementById('formMarcaR');
formMarcaR.addEventListener('submit', createMarca);
function createMarca(){
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
readAllMarcas();
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
}
function deleteMarca() {
    let nombre_mrc = selectMarcaProduct.value;
    if (confirm('¿Esta usted seguro?')){
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
let formCategoriaR = document.getElementById('formCategoriaR');
formCategoriaR.addEventListener('submit', createCategoria);
function createCategoria(){
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
readAllCategorias();
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
}
function deleteCategoria() {
    let nombre_ctgr = selectCategoriaProduct.value;
    if (confirm('¿Esta usted seguro?')){
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
//<<------------------------ABRIR Y CERRAR VENTANAS MODALES DE MARCA Y CATEGORIA--------------------------------->>
const marcaRMW = document.getElementById('marcaRMW');
const openMarcaRMW = document.getElementById('openMarcaRMW');
const closeMarcaRMW = document.getElementById('closeMarcaRMW');
openMarcaRMW.addEventListener('click',(e)=>{
    marcaRMW.classList.add('modal__show');
});
closeMarcaRMW.addEventListener('click',(e)=>{
    marcaRMW.classList.remove('modal__show');
});
const categoriaRMW = document.getElementById('categoriaRMW');
const openCategoriaRMW = document.getElementById('openCategoriaRMW');
const closeCategoriaRMW = document.getElementById('closeCategoriaRMW');
openCategoriaRMW.addEventListener('click',(e)=>{
    categoriaRMW.classList.add('modal__show');
});
closeCategoriaRMW.addEventListener('click',(e)=>{
    categoriaRMW.classList.remove('modal__show');
});