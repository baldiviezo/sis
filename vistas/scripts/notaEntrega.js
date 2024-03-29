//-------------------------------------------------------TABLA NOTA DE ENTREGA-----------------------------------------------------
let notasEntrega = {};
let filterNotasEntrega = {};
readNotasEntrega();
function readNotasEntrega() {
    let formData = new FormData();
    formData.append('readNotasEntrega','');
    fetch('../controladores/notaEntrega.php', {
        method: "POST",
        body: formData
    }).then(response => response.json()).then(data => {
        notasEntrega = data;
        filterNotasEntrega = data;
        paginacionNotaEntrega(Object.values(data).length, 1);
    }).catch(err => console.log(err));
}
//------Select utilizado para buscar por columnas
const selectSearchNe = document.getElementById('selectSearchNe');
selectSearchNe.addEventListener('change', searchNotasEntrega);
//------buscar por input
const inputSearchNe = document.getElementById("inputSearchNe");
inputSearchNe.addEventListener("keyup", searchNotasEntrega);
//------Notas de entrega por pagina
const selectNumberNe = document.getElementById('selectNumberNe');
selectNumberNe.selectedIndex = 3;
selectNumberNe.addEventListener('change', function(){
    paginacionNotaEntrega(Object.values(filterNotasEntrega).length, 1);
});
//-------Estado de proforma
const selectStateNe = document.getElementById('selectStateNe');
selectStateNe.addEventListener('change', searchNotasEntrega);
//------buscar por:
function searchNotasEntrega(){
    filterNotasEntrega = {};
    for(let notaEntrega in notasEntrega){
        for(let valor in notasEntrega[notaEntrega]){
            if(selectSearchNe.value == 'todas'){
                if(valor == 'id_prof' ||  valor == 'fecha_prof' || valor == 'nombre_usua' || valor == 'sigla_emp' || valor == 'nombre_clte'){
                    if(valor == 'nombre_usua'){
                        if((notasEntrega[notaEntrega][valor]+' '+notasEntrega[notaEntrega]['apellido_usua']).toLowerCase().indexOf(inputSearchNe.value.toLowerCase())>=0){
                            filterNotasEntrega[notaEntrega] = notasEntrega[notaEntrega];
                            break;
                        }
                    }else if(valor == 'nombre_clte'){
                        if((notasEntrega[notaEntrega][valor]+' '+notasEntrega[notaEntrega]['apellido_clte']).toLowerCase().indexOf(inputSearchNe.value.toLowerCase())>=0){
                            filterNotasEntrega[notaEntrega] = notasEntrega[notaEntrega];
                            break;
                        }
                    }else{
                        if(notasEntrega[notaEntrega][valor].toLowerCase().indexOf(inputSearchNe.value.toLowerCase())>=0){
                            filterNotasEntrega[notaEntrega] = notasEntrega[notaEntrega];
                            break;
                        }
                    }
                }
            }else if(selectSearchNe.value == 'encargado'){
                if(valor == 'nombre_usua'){
                    if((notasEntrega[notaEntrega][valor]+' '+notasEntrega[notaEntrega]['apellido_usua']).toLowerCase().indexOf(inputSearchNe.value.toLowerCase())>=0){
                        filterNotasEntrega[notaEntrega] = notasEntrega[notaEntrega];
                        break;
                    }
                }
            }else if(selectSearchNe.value == 'cliente'){
                if(valor == 'nombre_clte'){
                    if((notasEntrega[notaEntrega][valor]+' '+notasEntrega[notaEntrega]['apellido_clte']).toLowerCase().indexOf(inputSearchNe.value.toLowerCase())>=0){
                        filterNotasEntrega[notaEntrega] = notasEntrega[notaEntrega];
                        break;
                    }
                }
            }else{
                if(valor == selectSearchNe.value){
                    if(notasEntrega[notaEntrega][valor].toLowerCase().indexOf(inputSearchNe.value.toLowerCase())>=0){
                        filterNotasEntrega[notaEntrega] = notasEntrega[notaEntrega];
                        break;
                    }
                }
            }
        }
    }
    selectStateNotasEntrega();
}
//------buscar por marca y categoria:
function selectStateNotasEntrega(){
    if(selectStateNe.value == 'notasEntrega'){
        paginacionNotaEntrega(Object.values(filterNotasEntrega).length, 1);
    }else{
        for(let proforma in filterNotasEntrega){
            for(let valor in filterNotasEntrega[proforma]){
                if(valor == 'estado_ne'){
                    if(filterNotasEntrega[proforma][valor] != selectStateNe.value){
                        delete filterNotasEntrega[proforma];
                        break;
                    }    
                }
            }
        }
        paginacionNotaEntrega(Object.values(filterNotasEntrega).length, 1); 
    }
}
//------Ordenar tabla descendente ascendente
let orderNotaEntrega = document.querySelectorAll('.tbody__head--ne');
orderNotaEntrega.forEach(div=>{
    div.children[0].addEventListener('click', function() {
        let array = Object.entries(filterNotasEntrega).sort((a,b)=>{
            let first = a[1][div.children[0].name].toLowerCase();
            let second = b[1][div.children[0].name].toLowerCase();
            if( first < second){return -1}
            if(first > second){return 1}
            return 0;
        })
        filterNotasEntrega = Object.fromEntries(array);
        paginacionNotaEntrega(Object.values(filterNotasEntrega).length, 1);
    });
    div.children[1].addEventListener('click', function() {
        let array = Object.entries(filterNotasEntrega).sort((a,b)=>{
            let first = a[1][div.children[0].name].toLowerCase();
            let second = b[1][div.children[0].name].toLowerCase();
            if( first > second){return -1}
            if(first < second){return 1}
            return 0;
        })
        filterNotasEntrega = Object.fromEntries(array);
        paginacionNotaEntrega(Object.values(filterNotasEntrega).length, 1);
    });
})
//------PaginacionNotaEntrega
function paginacionNotaEntrega(allProducts, page){
    let numberProducts = Number(selectNumberNe.value);
    let allPages = Math.ceil(allProducts/numberProducts);
    let ul = document.querySelector('#wrapperNE ul');
    let li = '';
    let beforePages = page-1;
    let afterPages = page +1;
    let liActive;
    if(page > 1){
        li+= `<li class="btn" onclick="paginacionNotaEntrega(${allProducts}, ${page-1})"><img src="../imagenes/arowLeft.svg"></li>`;
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
        li+= `<li class="numb ${liActive}" onclick="paginacionNotaEntrega(${allProducts}, ${pageLength})"><span>${pageLength}</span></li>`;
    }
    if(page < allPages){
        li += `<li class="btn" onclick="paginacionNotaEntrega(${allProducts}, ${page+1})"><img src="../imagenes/arowRight.svg"></li>`;
    }
    ul.innerHTML = li;
    let h2= document.querySelector('#showPageNE h2');
    h2.innerHTML =`Pagina ${page}/${allPages}, ${allProducts} Notas entrega`;
    tableNotaEntrega(page);
}
//--------Tabla de proforma
function tableNotaEntrega(page) {
    let tbody = document.getElementById('tbodyNE');
    inicio = (page-1)*Number(selectNumberNe.value); 
    final = inicio +Number(selectNumberNe.value);
    i=1;
    tbody.innerHTML = '';
    for(let notaEntrega in filterNotasEntrega){
        if( i > inicio && i <= final){
        let tr = document.createElement('tr');
        for(let valor in filterNotasEntrega[notaEntrega]){
            let td = document.createElement('td');
            if(valor == 'id_ne'){
                td.innerText = filterNotasEntrega[notaEntrega][valor];
                td.setAttribute('hidden', '');
                tr.appendChild(td);
            }else if(valor == 'id_prof'){
                td.innerText = filterNotasEntrega[notaEntrega]['id_clte'];
                td.setAttribute('hidden', '');
                tr.appendChild(td);
                td = document.createElement('td');
                td.innerText = i;
                tr.appendChild(td);
                i++;
                td = document.createElement('td');
                td.innerText = 'SMS23-'+filterNotasEntrega[notaEntrega][valor];
                tr.appendChild(td);
            }else if(valor == 'fecha_prof'){
                td.innerText = filterNotasEntrega[notaEntrega][valor].slice(0,10);
                tr.appendChild(td);
            }
            else if(valor == 'nombre_usua'){
                td.innerText = filterNotasEntrega[notaEntrega][valor]+' '+filterNotasEntrega[notaEntrega]['apellido_usua'];
                tr.appendChild(td);
            }else if(valor == 'apellido_usua' || valor == 'apellido_clte' || valor == 'id_clte' || valor == 'estado_ne'){
            }else if(valor == 'nombre_clte'){
                td.innerText = filterNotasEntrega[notaEntrega][valor]+' '+filterNotasEntrega[notaEntrega]['apellido_clte'];
                tr.appendChild(td);
            }else{
                td.innerText = filterNotasEntrega[notaEntrega][valor];
                tr.appendChild(td);
            }
        }
        //------Restricciones de usuario
        let td = document.createElement('td');
        if(localStorage.getItem('usua_rol') == 'Ingeniero'){
            td.innerHTML = `
            <img src='../imagenes/pdf.svg' onclick='pdfNotaEntrega(this.parentNode.parentNode)'>`;
        }else{
            if(filterNotasEntrega[notaEntrega]['estado_ne'] == 'vendido'){
                td.innerHTML = `
                <img src='../imagenes/pdf.svg' onclick='pdfNotaEntrega(this.parentNode.parentNode)'>`;
            }else{
                td.innerHTML = `
                <img src='../imagenes/carrito.svg' onclick='readSale(this.parentNode.parentNode)'>
                <img src='../imagenes/pdf.svg' onclick='pdfNotaEntrega(this.parentNode.parentNode)'>
                <img src='../imagenes/trash.svg' onclick='deleteNotaEntrega(this.parentNode.parentNode)'>`;
            }
        }
        tr.appendChild(td);
        tbody.appendChild(tr);
        }else{
            i++;    
        }
    }   
}
//----------------------------------------------------------- CRUD NOTA ENTREGA----------------------------------------------
//------Delete a nota de entrega
function deleteNotaEntrega(tr) {
    if (confirm('¿Esta usted seguro?')){
        let id_ne = tr.children[0].innerText;
        let formData = new FormData();
        formData.append('deleteNotaEntrega',id_ne);
        fetch('../controladores/notaEntrega.php', {
            method: "POST",
            body: formData
        }).then(response => response.text()).then(data=>{
            readNotasEntrega();
        }).catch(err => console.log(err));
    }
}
//----------------------------------------------------------FECHA----------------------------------------------------
let hoy = new Date();
let dia = hoy.getDate();
let mes = hoy.getMonth()+1;
let year = hoy.getFullYear();
onlyYear = year%100;
//------------------------------------------------------CRUD VENTA--------------------------------------------------------
//-----Create a venta
const formsaleR = document.getElementById('formsaleR');
formsaleR.addEventListener('submit', createSale)
function createSale(){
    event.preventDefault();
    let productos = document.querySelectorAll('#vnt_prodRMW div.modal__body .cart-item');
    if(productos.length > 0){
        let array = [];
        let i = 0;
        productos.forEach(producto=>{
            if(Number(producto.children[0].innerHTML) < Number(producto.children[3].value)){
                i++;
            }
            let objeto = {producto};
            objeto['codigo'] = producto.children[2].innerHTML;
            objeto['cantidad'] = producto.children[3].value;
            objeto['precio'] = producto.children[4].value;
            array.push(objeto);
        });
        if(i == 0 ){
            let products = JSON.stringify(array);
            let formData = new FormData(formsaleR);
            formData.append('createVenta', products);
            fetch('../controladores/ventas.php', {
                method: "POST",
                body: formData
            }).then(response => response.text()).then(data => {
                readInventories();
                readNotasEntrega();
            }).catch(err => console.log(err));
            saleRMW.classList.remove('modal__show');
        }else{
            alert("Falta de stock");
        }
    }else{
        alert('No a seleccionado ningun producto');
    }
}
//-----Read a venta
function readSale(tr) {
    let id_prof = tr.children[3].innerText.slice(6);
    //-----leer proforma
    document.getElementsByName('fecha_vntR')[0].value = year+'-'+mes+'-'+dia;
    document.getElementsByName('id_neR')[0].value = tr.children[0].innerText;
    document.getElementsByName('id_clteR')[0].value = tr.children[1].innerText;
    document.getElementsByName('id_profR')[0].value = id_prof;
    //-----Leer los productos
    modalProf_prod.innerHTML = '';
    saleRMW.classList.add('modal__show');
    for(let product in prof_prods){
        for(let valor in prof_prods[product]){
            if(prof_prods[product]['fk_id_prof_pfpd'] == id_prof){
                cartProduct_pfpd(prof_prods[product]);
                break;
            }
        }
    }
}
//--------Muestra la lista de los productos de la proforma
const modalProf_prod = document.querySelector('#vnt_prodRMW div.modal__body');
function cartProduct_pfpd(product){
    let cantidad_inv;
    for (let inventory in inventories){
        for (let valor in inventories[inventory]){
            if(inventories[inventory]['codigo_prod'] == product['codigo_prod']){
                cantidad_inv = inventories[inventory]['cantidad_inv'];


                let cantidad_prod = (product['cantidad_pfpd'] == undefined) ? (product['cantidad_inv'] == undefined) ? 1 : product['cantidad_inv'] : product['cantidad_pfpd'];
                let costo_uni = (product['cost_uni_pfpd'] == undefined) ? (product['cost_uni_inv'] == undefined) ? 0 : product['cost_uni_inv'] : product['cost_uni_pfpd'];
                let item = document.createElement('div');
                item.classList.add('cart-item'); 
                let html = 
                    `<p class="cart-item__cantInv">${cantidad_inv}</p>
                    <div class="row-img">
                        <img src="../modelos/imagenes/`+product['imagen_prod']+`" class="rowimg">
                    </div>
                    <p class="cart-item__codigo">`+product['codigo_prod']+`</p>
                    <input type="number" value = "${cantidad_prod}" min="1" " class="cart-item__cantidad" readonly>
                    <input type="number" value = "${costo_uni}" " class="cart-item__costUnit" readonly>
                    <input type="number" value = "`+cantidad_prod*costo_uni+`" class="cart-item__costTotal" readonly>
                    <img src="../imagenes/trash.svg" >
                    <h3 hidden>`+product['descripcion_prod']+`</h3>
                    <h3 hidden>`+product['nombre_prod']+`</h3>`;
                item.innerHTML = html;
                //-------drag drop
                item.setAttribute('draggable', true)
                item.addEventListener("dragstart", () => {
                    setTimeout(() => item.classList.add("dragging"), 0);
                });
                item.addEventListener("dragend", () => item.classList.remove("dragging"));
                modalProf_prod.appendChild(item);


                break;
            }
        }
    }
    
}
//-----------------------------------Ventana modal para VENTA---------------------------------//
const saleRMW = document.getElementById('saleRMW');
const closeSaleRMW = document.getElementById('closeSaleRMW');
closeSaleRMW.addEventListener('click',()=>{
    saleRMW.classList.remove('modal__show');
});
//-------------------------------------------PROF_PROD
let prof_prods = {};
let filterprof_prods = {};
readprof_prods();
function readprof_prods() {
    let formData = new FormData();
    formData.append('readprof_prods','');
    fetch('../controladores/notaEntrega.php', {
        method: "POST",
        body: formData
    }).then(response => response.json()).then(data => {
        prof_prods = data;
        filterprof_prods = data;
    }).catch(err => console.log(err));
}
//-------------------------------------MODAL DE PRODUCTS DE UNA PROFORMA MODIFICAR-------------------------------------------->>
const closeVnt_prodRMW = document.getElementById('closeVnt_prodRMW');
const vnt_prodRMW = document.getElementById('vnt_prodRMW');
function openVnt_prodRMW() {
    vnt_prodRMW.classList.add('modal__show'); 
}
closeVnt_prodRMW.addEventListener('click',(e)=>{
    vnt_prodRMW.classList.remove('modal__show');
});


//-------------------------------------------------------INVENTARIO-------------------------------------------------------------
let inventories = {};
readInventories();
function readInventories() {
    let formData = new FormData();
    formData.append('readInventories','');
    fetch('../controladores/inventario.php', {
        method: "POST",
        body: formData
    }).then(response => response.json()).then(data => {
        inventories = data;
    }).catch(err => console.log(err));
}
//------imprimir pdf
function pdfNotaEntrega(tr){
    let id_ne = tr.children[0].innerText;
    let id_prof = tr.children[3].innerText.slice(6);
    let ne;
    let prof;
    for(let notaEntrega in notasEntrega){
        if(notasEntrega[notaEntrega]['id_ne']==id_ne){
            ne =  notasEntrega[notaEntrega];
        }
    }
    for(let proforma in proformas){
        if(proformas[proforma]['id_prof']==id_prof){
            prof = proformas[proforma];
        }
    }
    let proforma = JSON.stringify(prof);
    let formData = new FormData();
    formData.append('fk_id_prof_ne', id_prof);
    formData.append('orden_ne', ne['orden_ne']);
    formData.append('observacion_ne', ne['observacion_ne']);
    formData.append('proforma',proforma);
    formData.append('clave', 'prof');
    formData.append('ne', 'NE-');
    fetch('../controladores/proforma.php', {
        method: "POST",
        body: formData
    }).then(response => response.text()).then(data=>{
    }).catch(err => console.log(err));
    window.open('../modelos/reportes/notaDeEntrega.php');
 
}
//-------------------------------------------------------PROFORMA-----------------------------------------------------
let proformas = {};  //base de datos de proformas
readProformas();
function readProformas() {
    let formData = new FormData();
    formData.append('readProformas', '');
    fetch('../controladores/proforma.php', {
        method: "POST",
        body: formData
    }).then(response => response.json()).then(data => {
        proformas = data;
    }).catch(err => console.log(err));
}