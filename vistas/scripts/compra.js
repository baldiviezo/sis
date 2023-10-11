//-----------------------------------FECHA----------------------------------------------------
let hoy = new Date();
let dia = hoy.getDate();
let mes = hoy.getMonth()+1;
let year = hoy.getFullYear();
onlyYear = year%100;

//<<----------------------------------TABLA COMPRA------------------------------------------>>
espaciosObligatoriosBuy();
function espaciosObligatoriosBuy(){
    document.getElementById('buyForPage').selectedIndex = 3;
}
function pageOneBuy(){
    globalPageBuy = 1;
    readAllBuy();
}
//--------Buscar compra
let selectSearchCompra = document.getElementById('selectSearchCompra');
selectSearchCompra.addEventListener('change', pageOneBuy);
function returnSelectSearchCompra(){
    let options = selectSearchCompra.querySelectorAll('option');
    let arraySearch = [];
    if(selectSearchCompra.value == 'todas'){
        options.forEach(option => {
            if(option.value == 'todas'){
            }else{
            arraySearch.push(option.value);
            }
        })
    }else{
        arraySearch.push(selectSearchCompra.value)
    }
    return arraySearch;
}
//------Ordenar tabla descendente ascendente
let orderImgsBuy = document.querySelectorAll('.tbody__head--buy');
orderImgsBuy.forEach(div=>{
    div.children[0].addEventListener('click', function() {
        orderBuyTableASC(this);
    });
    div.children[1].addEventListener('click', function() {
        orderBuyTableDESC(this);
    });
})
let orderByBuy = 'id_cmp DESC';  //Para que se muestre la ultima  compra
function orderBuyTableASC(img){
    orderByBuy = img.name;
    pageOneBuy();
}
function orderBuyTableDESC(img){
    orderByBuy = img.name+' DESC';
    pageOneBuy();
}
const searchCompra = document.getElementById("buscarCompra");
searchCompra.addEventListener("keyup", e=>{
    if(e.key == 'Enter'){pageOneBuy()}
    if(searchCompra.value == ''){pageOneBuy()}
});
//-----Comrpras por pagina
const buyForPage = document.getElementById('buyForPage');
buyForPage.addEventListener('change', pageOneBuy )
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
    formData.append('readBuy',searchCompra.value);
    formData.append('orderByBuy',orderByBuy);
    formData.append('selectSearchCompra', returnSelectSearchCompra());
    fetch('../controladores/compras.php', {
        method: "POST",
        body: formData
    }).then(response => response.json()).then(data => {
        compras = data;
        totalCompras = Object.values(data).length;
        allPages = Math.ceil(totalCompras/comprasPorPagina);
        paginacionCompra(allPages,globalPageBuy,totalCompras);   
    }).catch(err => console.log(err));
}
//--------PaginacionCompra
function paginacionCompra(allPages, page,totalCompras){
    let ulCompra = document.querySelector('#wrapperBuy ul');
    globalPageBuy = page;
    let li = '';
    let beforePages = page-1;
    let afterPages = page +1;
    let liActive;
    totalPaginasCompra(page, totalCompras);
    buyTable(page);
    if(page > 1){
        li+= `<li class="btn" onclick="paginacionCompra(allPages, ${page-1}, totalCompras)"><img src="../imagenes/arowLeft.svg"></li>`;
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
        li+= `<li class="numb ${liActive}" onclick="paginacionCompra(allPages, ${pageLength}, totalCompras)"><span>${pageLength}</span></li>`;
    }
    if(page < allPages){
        li += `<li class="btn" onclick="paginacionCompra(allPages, ${page+1}, totalCompras)"><img src="../imagenes/arowRight.svg"></li>`;
    }
    ulCompra.innerHTML = li;
}
function totalPaginasCompra(page, totalCompras){
    let h2= document.querySelector('#showPageBuy h2');
    h2.innerHTML =`Pagina ${page}/${allPages}, ${totalCompras} compras`;
}
//--------Tabla de compras
function buyTable(page) {
    const tbody = document.getElementById('tbodyCompra');
    inicio = (page-1)*comprasPorPagina; 
    final = inicio +comprasPorPagina;
    i=1;
    tbody.innerHTML = '';
    for(let Compra in compras){
       if( i > inicio && i <= final){
        let tr = document.createElement('tr');
        for(let dato in compras[Compra]){
            let td = document.createElement('td');
            if(dato == 'id_cmp'){
                td.innerText = i;
                tr.appendChild(td);
                i++;
                td = document.createElement('td');
                td.innerText = compras[Compra][dato];
                td.setAttribute('hidden','');
                tr.appendChild(td);
            }else if(dato == 'fecha_cmp'){
                td.innerText = compras[Compra][dato].slice(0,10);
                tr.appendChild(td);
            }else if(dato == 'telefono_empp'){
            }else if(dato == 'celular_prov'){
            }else{
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
        }else{
            i++;    
        }
    }   
}
//<<---------------------------------CRUD COMPRA----------------------------------------->>
//-------Create buy
let formBuyR = document.getElementById('formBuyR');
formBuyR.addEventListener('submit', createBuy);
function createBuy() {
    event.preventDefault();
    let productos = document.querySelectorAll('#cmp_prodRMW div.modal__body .cart-item');
    if(productos.length > 0){
        let arrayOfObjects = [];
        productos.forEach(producto=>{
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
    }else{
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
    formData.append('readABuy',id_cmp);
    fetch('../controladores/compras.php', {
        method: "POST",
        body: formData
    }).then(response => response.json()).then(data => {
        let compra = data['compra'];
        for(let clave in compra){
            if(clave == 'fecha_cmp'){
                document.getElementsByName(clave+'M')[0].value = compra[clave].slice(0,10);
            }else if(clave == 'id_prov'){
                selectSupplierM.innerHTML = '';
                let option = document.createElement('option');
                option.value = compra[clave];
                option.innerText = compra['proveedor_prov'] ;
                selectSupplierM.appendChild(option);
            }else if(clave == 'proveedor_prov'){
            }else if(clave == 'id_empp'){
                selectEnterpriseM.innerHTML = '';
                let option = document.createElement('option');
                option.value = compra[clave];
                option.innerText = compra['sigla_empp'] ;
                selectEnterpriseM.appendChild(option);
            }else if(clave == 'sigla_empp'){
            }else{
                document.getElementsByName(clave+'M')[0].value = compra[clave];
            }
        }
        //-----Mostrar los productos en el modal cmp_prod
        let modalCmp_prod = document.querySelector('#cmp_prodMMW div.modal__body');
        modalCmp_prod.innerHTML = '';
        for ( let clave in data['cmp_prod']){
            listProducts(data['cmp_prod'][clave], 'M');
        }
    }).catch(err => console.log(err));
    buyMMW.classList.add('modal__show');
}
//------UPDATE Compra
let formBuyM  = document.getElementById('formBuyM');
formBuyM.addEventListener('submit', updateABuy)
function updateABuy(){
    event.preventDefault();
    let productos = document.querySelectorAll('#cmp_prodMMW div.modal__body .cart-item');
    if(productos.length > 0){
        let arrayOfObjects = [];
        productos.forEach(producto=>{
            let jsonObject = {};
            jsonObject['codigo'] = producto.children[2].innerHTML;
            jsonObject['cantidad'] = producto.children[3].value;
            arrayOfObjects.push(jsonObject);
        });
        let stringJson = JSON.stringify(arrayOfObjects);
        let form  = document.getElementById('formBuyM');
        let formData = new FormData(form);
        buyMMW.classList.remove('modal__show');
        formData.append('updateCompra', stringJson);
        fetch('../controladores/compras.php', {
            method: "POST",
            body: formData
        }).then(response => response.text()).then(data => {
            readAllBuy();
        }).catch(err => console.log(err));
    }else{
        alert('No a seleccionado ningun producto');
    }
}
//------Delete Compra
function deleteCompra(tr){
    let id_cmp = tr.children[1].innerText;
    let formData = new FormData();
    formData.append('deleteCompra',id_cmp);
    fetch('../controladores/compras.php', {
        method: "POST",
        body: formData
    }).then(response => response.text()).then(data => {
        readAllBuy();
    }).catch(err => console.log(err));
}
//<<------------------------ABRIR Y CERRAR CompraS MODALES--------------------------------->>
//-----------------------------------Comprana modal para Compra---------------------------------//
const buyRMW = document.getElementById('buyRMW');
const buyMMW = document.getElementById('buyMMW');
const closeBuyRMW = document.getElementById('closeBuyRMW');
const closeBuyMMW = document.getElementById('closeBuyMMW');
const openBuyRMW = document.getElementById('openBuyRMW');
const openBuyMMW = document.getElementById('openBuyMMW');
openBuyRMW.addEventListener('click',()=>{
    buyRMW.classList.add('modal__show');
    addProductoClave='R';
    claveSendSupplier = 'R';
    claveSendEnterprise = 'R';
    document.getElementsByName('fecha_cmpR')[0].value = year+'-'+mes+'-'+dia;
});
closeBuyRMW.addEventListener('click',()=>{
    buyRMW.classList.remove('modal__show');
});
closeBuyMMW.addEventListener('click',()=>{
    buyMMW.classList.remove('modal__show');
});
//<<-------------------------------------MODAL DE PRODUCTS DE UNA PROFORMA MODIFICAR-------------------------------------------->>
const closeCmp_prodRMW = document.getElementById('closeCmp_prodRMW');
const cmp_prodRMW = document.getElementById('cmp_prodRMW');
function openCmp_prodRMW(){
    cmp_prodRMW.classList.add('modal__show'); 
}
closeCmp_prodRMW.addEventListener('click',(e)=>{
    cmp_prodRMW.classList.remove('modal__show');
});
const closeCmp_prodMMW = document.getElementById('closeCmp_prodMMW');
const cmp_prodMMW = document.getElementById('cmp_prodMMW');
function openCmp_prodMMW(){
    cmp_prodMMW.classList.add('modal__show'); 
}
closeCmp_prodMMW.addEventListener('click',(e)=>{
    cmp_prodMMW.classList.remove('modal__show');
});




//<<----------------------------------------------PROVEEDOR---------------------------------------------->>
//<<------------------------LLENAR LA LISTA DE EMPRESAS-------------------------------------->>
const selectEnterpriseR = document.getElementById('selectEnterpriseR');
const selectEnterpriseM = document.getElementById('selectEnterpriseM');
listSelectEnterprise(selectEnterpriseR, 'R', 0);
function listSelectEnterprise(select, rm, index) {
    let formData = new FormData();
    formData.append('readEnterpriseP','');
    fetch('../controladores/clientes.php', {
        method: "POST",
        body: formData
    }).then(response => response.json()).then(data => {
        select.innerHTML = ''; 
        for ( let clave in data){
            let option = document.createElement('option');
            option.value = data[clave]['id_empp'];
            option.innerText = data[clave]['sigla_empp'];
            select.appendChild(option);
        }
        let options = select.querySelectorAll('option');
        options.forEach(option=>{
            if(option.value == index){
                select.value = index;
            }
        })
        //LLenas con solo los clientes que tiene la empresa
        let selectSupplier = document.getElementById('selectSupplier'+rm);
        fillSelectSupplier(selectSupplier, select.value, rm);
    }).catch(err => console.log(err));
}
let SelectSupplierR = document.getElementById('selectSupplierR');
let SelectSupplierM = document.getElementById('selectSupplierM');
//---------LLENAR EL Proveedor AL CAMBIAR LA EMPRESA
selectEnterpriseR.addEventListener('change', function(){
    fillSelectSupplier(SelectSupplierR, selectEnterpriseR.value, 0);;
});
selectEnterpriseM.addEventListener('change', function(){
    fillSelectSupplier(SelectSupplierM, selectEnterpriseM.value, 0);
});

//<<---------------------------------LLENAR LA LISTA DE PROVEEDORS-------------------------------------->>
//-------LLENAR LA LISTA DE Proveedores
let Proveedores = {};
function fillSelectSupplier(select, id_empp, index) {
    select.innerHTML = '';
    let formData = new FormData();
    formData.append('id_empp', id_empp);
    formData.append('leerProveedor','');
    fetch('../controladores/clientes.php', {
        method: "POST",
        body: formData
    }).then(response => response.json()).then(data => {
        Proveedores = data;
        for ( let clave in data){
            let option = document.createElement('option');
            option.value = data[clave]['id_prov'];
            option.innerText = data[clave]['nombre_prov']+' '+data[clave]['apellido_prov'];
            select.appendChild(option);
        }
        let options = select.querySelectorAll('option');
        options.forEach(option=>{
            if(option.value == index){
                select.value = index;
            }
        })
    }).catch(err => console.log(err));
}

//<<-----------------------------------------CRUD PROVEEDOR----------------------------------------->>
//------Create a supplier
const formSupplierR = document.getElementById('formSupplierR');
formSupplierR.addEventListener('submit', createSupplier);
function createSupplier() {
    event.preventDefault();
    let formData = new FormData(formSupplierR);
    formData.append('createSupplier','');
    fetch('../controladores/clientes.php', {
        method: "POST",
        body: formData
    }).then(response => response.text()).then(data => {
        supplierRMW.classList.remove('modal__show');
        const inputsR = document.querySelectorAll('#formSupplierR .form__group input');
        inputsR.forEach(input=>{input.value = ''})
        fillSelectSupplier(selectSupplierR, selectEnterpriseR.value, 0);
        fillSelectSupplier(selectSupplierM, selectEnterpriseR.value, 0);
    }).catch(err => console.log(err));
}
//------Llenar la empresa del cliente en el formulario de registrar nuevo cliente
function enterpriseOfCustomer(rm){
    let selectEnterpriseR2 = document.getElementById('selectEnterpriseR2');
    let selectEnterprise = document.getElementById('selectEnterprise'+rm);
    selectEnterpriseR2.innerHTML = '';
    let option2 = document.createElement('option');
    option2.value = selectEnterprise.value;
    let options = selectEnterprise.querySelectorAll('option');
    let valor;
    options.forEach(option=>{
        if (selectEnterprise.value == option.value){
            valor = option.innerText;
        }
    })
    option2.innerText = valor;
    selectEnterpriseR2.appendChild(option2);
}
//------Read a supplier
function readSupplier(rm) {
    let selectSupplierRM = document.getElementById('selectSupplier'+rm);
    let id = selectSupplierRM.value;
    if (id!=0){
    supplierMMW.classList.add('modal__show');
    let formData = new FormData();
    formData.append('readASupplier',id);
    fetch('../controladores/clientes.php', {
        method: "POST",
        body: formData
    }).then(response => response.json()).then(data => {
        const selectM = document.getElementById('selectEnterpriseM2');
        const inputsM = document.querySelectorAll('#formSupplierM .form__group input');
        let i=0;
        for(let clave in data){
            if(i==4){
                selectM.innerHTML = '';
                let option = document.createElement('option');
                option.value = clave - 0;
                option.innerText = data[clave];
                selectM .appendChild(option);
            }else{
                inputsM[i].value = data[clave];
            }
            i++;
        }
    }).catch(err => console.log(err));
    }
}
//------Update a supplier
const formClienteM = document.getElementById('formSupplierM');
formSupplierM.addEventListener('submit', updateSupplier);
function updateSupplier(){
    event.preventDefault();
    let id_prov = document.getElementsByName('id_provM')[0].value;
    let formData = new FormData(formClienteM);
    formData.append('updateSupplier', id_prov);
    fetch('../controladores/clientes.php', {
        method: "POST",
        body: formData
    }).then(response => response.text()).then(data => {
        console.log(data);
        supplierMMW.classList.remove('modal__show');
        const inputsM = document.querySelectorAll('#formSupplierM .form__group input');
        inputsM.forEach(input=>{input.value = ''})
        fillSelectSupplier(selectSupplierR, selectEnterpriseR.value, selectSupplierR.value);
        fillSelectSupplier(selectSupplierM, selectEnterpriseR.value, selectSupplierR.value);
    }).catch(err => console.log(err));   
}
//------Delete a supplier
function deleteSupplier (rm) {
    let selectSupplierRM = document.getElementById('selectSupplier'+rm);
    if (confirm('¿Esta usted seguro?')){
        let id = selectSupplierRM.value;
        let formData = new FormData();
        formData.append('deleteSupplier',id);
        fetch('../controladores/clientes.php', {
            method: "POST",
            body: formData
        }).then(response => response.text()).then(data => {
            fillSelectSupplier(selectSupplierR, selectEnterpriseR.value, 0);
            fillSelectSupplier(selectSupplierM, selectEnterpriseR.value, 0);
        }).catch(err => console.log(err));  
    }   
}
//<<-------------------------------------------MODAL PROVEEDOR---------------------------------------->>
const supplierRMW = document.getElementById('supplierRMW');
const supplierMMW = document.getElementById('supplierMMW');
const closeSupplierRMW = document.getElementById('closeSupplierRMW');
const closeSupplierMMW = document.getElementById('closeSupplierMMW');
function openSupplierRMW() {
    supplierRMW.classList.add('modal__show');
    enterpriseOfCustomer(claveSendSupplier);
}
closeSupplierRMW.addEventListener('click',()=>{
    supplierRMW.classList.remove('modal__show');
});
closeSupplierMMW.addEventListener('click',()=>{
    supplierMMW.classList.remove('modal__show');
});






//<<------------------------------------------------CRUD EMPRESA------------------------------->>
//------Craer una empresa
const formEmpresaR = document.getElementById('formEmpresaR');
formEmpresaR.addEventListener('submit', createEnterprise);
function createEnterprise() {
    event.preventDefault();
    let formData = new FormData(formEmpresaR);
    formData.append('createEnterpriseP','');
    fetch('../controladores/clientes.php', {
        method: "POST",
        body: formData
    }).then(response => response.text()).then(data => {
        if (data!="registrado"){           
            alert(data);
        }else{
            enterprisesRMW.classList.remove('modal__show');
            //Limpiar el formulario de registrar empresa
            let inputs = document.querySelectorAll('#formEmpresaR input.form__input');
            inputs.forEach(input =>input.value = '');
            //En select escribir las empresas
            listSelectEnterprise(selectEnterpriseR, 'R', 0);
            //listSelectEnterprise(selectEnterpriseM, 'M', 0);
            initialPageSelectEmp();
        }
    }).catch(err => console.log(err));
}
//------Leer una empresa
function readEnterprise(rm){
    let selectEnterpriseRM = document.getElementById('selectEnterprise'+rm);
    let id_empp = selectEnterpriseRM.value;
    let formData = new FormData();
    formData.append('readEnterpriseP','');
    fetch('../controladores/clientes.php', {
        method: "POST",
        body: formData
    }).then(response => response.json()).then(data => {
        for ( let clave in data){
            if(data[clave]['id_empp']==id_empp){
                let inputs = document.querySelectorAll('#formEmpresaM input.form__input');
                inputs.forEach(input=>input.value = data[clave][input.name]);
            }
        }
        enterprisesMMW.classList.add('modal__show');
    }).catch(err => console.log(err));
}
//------Actualizar una empresa
let formEmpresaM = document.getElementById('formEmpresaM');
formEmpresaM.addEventListener('submit',updateEnterprise);
function updateEnterprise(){
    event.preventDefault();
    let formData = new FormData(formEmpresaM);
    formData.append('updateEnterpriseP','');
    fetch('../controladores/clientes.php', {
        method: "POST",
        body: formData
    }).then(response => response.text()).then(data=>{
        if(data == 'modificado'){
            enterprisesMMW.classList.remove('modal__show');
            listSelectEnterprise(selectEnterpriseR, 'R', selectEnterpriseR.value);
            //listSelectEnterprise(selectEnterpriseM, 'M', selectEnterpriseM.value);
            initialPageSelectEmp();
        }else{
            alert(data);
        }
    }).catch(err => console.log(err));
}
//------Borrar una empresa
function deleteEnterprise(rm){
    let selectEnterpriseRM = document.getElementById('selectEnterprise'+rm);
    if (confirm('¿Esta usted seguro?')){
        let id_empp = selectEnterpriseRM.value;
        let formData = new FormData();
        formData.append('deleteEnterpriseP',id_empp);
        fetch('../controladores/clientes.php', {
            method: "POST",
            body: formData
        }).then(response => response.text()).then(data =>{
            if(data !='Eliminado'){
                alert(data);
            }else{
                listSelectEnterprise(selectEnterpriseR, 'R', 0);
                //listSelectEnterprise(selectEnterpriseM, 'M', 0);
                initialPageSelectEmp();
            }
        }).catch(err => console.log(err));
    }
}
//<<------------------------ABRIR Y CERRAR VENTANAS MODALES--------------------------------->>
//-----------------------------------Ventana modal para empresa---------------------------------//
const enterprisesRMW = document.getElementById('enterprisesRMW');
const enterprisesMMW = document.getElementById('enterprisesMMW');
const closEEnterprisesRMW = document.getElementById('closEEnterprisesRMW');
const closEEnterprisesMMW = document.getElementById('closEEnterprisesMMW');
function openEnterprisesRMW(){
    enterprisesRMW.classList.add('modal__show');
}
closeEnterprisesRMW.addEventListener('click',()=>{
    enterprisesRMW.classList.remove('modal__show');
});
closeEnterprisesMMW.addEventListener('click',()=>{
    enterprisesMMW.classList.remove('modal__show');
});




//<<---------------------------------------TABLA MODAL EMPRESA--------------------------------------->>
inputRequireFormEnterprise();
function inputRequireFormEnterprise(){
    document.getElementById('selectPageEmpMW').selectedIndex = 3;
}
function initialPageSelectEmp(){
    globalPageEmp = 1;
    readAllEnterprise();
}
//--------Buscar venta
let selectSearchEmpMW = document.getElementById('selectSearchEmpMW');
selectSearchEmpMW.addEventListener('change', initialPageSelectEmp);
function selectSearchEnterpriseMW(){
    let options = selectSearchEmpMW.querySelectorAll('option');
    let arraySearch = [];
    if(selectSearchEmpMW.value == 'todas'){
        options.forEach(option => {
            if(option.value == 'todas'){
            }else{
            arraySearch.push(option.value);
            }
        })
    }else{
        arraySearch.push(selectSearchEmpMW.value)
    }
    return arraySearch;
}
//------Ordenar tabla descendente ascendente
let imgOrderEnterprise = document.querySelectorAll('.tbody__head--empMW');
imgOrderEnterprise.forEach(div=>{
    div.children[0].addEventListener('click', function() {
        orderEnterpriseTableASC(this);
    });
    div.children[1].addEventListener('click', function() {
        orderEnterpriseTableDESC(this);
    });
})
let orderByEnterprise = 'id_empp DESC';
function orderEnterpriseTableASC(img){
    orderByEnterprise = img.name;
    initialPageSelectEmp();
}
function orderEnterpriseTableDESC(img){
    orderByEnterprise = img.name+' DESC';
    initialPageSelectEmp();
}
const inputSearchEmpMW = document.getElementById("inputSearchEmpMW");
inputSearchEmpMW.addEventListener("keyup", e=>{
    if(e.key == 'Enter'){initialPageSelectEmp()}
    if(inputSearchEmpMW.value == ''){initialPageSelectEmp()}
});
//-----Comrpras por pagina
const selectPageEmpMW = document.getElementById('selectPageEmpMW');
selectPageEmpMW.addEventListener('change', initialPageSelectEmp )
let empresas = {};  //base de datos de ventas
let globalPageEmp = 1;
let empresasPorPagina;
let totalEmpresas;
readAllEnterprise();
function readAllEnterprise() {
    const tbody = document.getElementById('tbodyEmpMW');
    tbody.innerHTML = '';
    empresasPorPagina = Number(selectPageEmpMW.value);
    let formData = new FormData();
    formData.append('readAllEnterpriseP',inputSearchEmpMW.value);
    formData.append('orderByEnterprise',orderByEnterprise);
    formData.append('selectSearchEmpMW', selectSearchEnterpriseMW());
    fetch('../controladores/clientes.php', {
        method: "POST",
        body: formData
    }).then(response => response.json()).then(data => {
        empresas = data;
        totalEmpresas = Object.values(data).length;
        allPages = Math.ceil(totalEmpresas/empresasPorPagina);
        paginacionEmpresa(allPages,globalPageEmp,totalEmpresas);   
    }).catch(err => console.log(err));
}
//--------PaginacionEmpresa
function paginacionEmpresa(allPages, page,totalEmpresas){
    let ulVenta = document.querySelector('#wrapperEmpMW ul');
    globalPageEmp = page;
    let li = '';
    let beforePages = page-1;
    let afterPages = page +1;
    let liActive;
    totalPaginasEmpresa(page, totalEmpresas);
    enterpriseTableMW(page);
    if(page > 1){
        li+= `<li class="btn" onclick="paginacionEmpresa(allPages, ${page-1}, totalEmpresas)"><img src="../imagenes/arowLeft.svg"></li>`;
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
        li+= `<li class="numb ${liActive}" onclick="paginacionEmpresa(allPages, ${pageLength}, totalEmpresas)"><span>${pageLength}</span></li>`;
    }
    if(page < allPages){
        li += `<li class="btn" onclick="paginacionEmpresa(allPages, ${page+1}, totalEmpresas)"><img src="../imagenes/arowRight.svg"></li>`;
    }
    ulVenta.innerHTML = li;
}
function totalPaginasEmpresa(page, totalEmpresas){
    const h2= document.querySelector('#showPageEmpMW h2');
    h2.innerHTML =`Pagina ${page}/${allPages}, ${totalEmpresas} Empresas`;
}
//--------Tabla de proforma
function enterpriseTableMW(page) {
    const tbody = document.getElementById('tbodyEmpMW');
    inicio = (page-1)*empresasPorPagina; 
    final = inicio +empresasPorPagina;
    i=1;
    tbody.innerHTML = '';
    for(let empresa in empresas){
       if( i > inicio && i <= final){
        let tr = document.createElement('tr');
        for(let dato in empresas[empresa]){
            let td = document.createElement('td');
            if(dato == 'id_empp'){
                td.innerText = i;
                tr.appendChild(td);
                i++;
                td = document.createElement('td');
                td.innerText = empresas[empresa][dato];
                td.setAttribute('hidden','');
                tr.appendChild(td);
            }else{
                td.innerText = empresas[empresa][dato];
                tr.appendChild(td);
            }
        }
        let td = document.createElement('td');
        td.innerHTML = `
        <img src='../imagenes/send.svg' onclick='sendEnterprise(this.parentNode.parentNode)'>`;
        tr.appendChild(td);
        tbody.appendChild(tr);
        }else{
            i++;    
        }
    }   
}
//------select Enterprise
let claveSendEnterprise;
function sendEnterprise(tr) {
    let id_empp = tr.children[1].innerText;
    let select = document.getElementById('selectEnterprise'+claveSendEnterprise);
    let options = select.querySelectorAll('option');
    options.forEach((option,index) =>{
        if (option.value == id_empp){
            select.selectedIndex = index;
            enterpriseSMW.classList.remove('modal__show');
        }
    })
    fillSelectSupplier(selectSupplierR, select.value, 0);
}
//----------------------------------ventana modal EnterpriseSMW-------------------------------------------
//---------------------------ventana modal para buscar producto
const enterpriseSMW = document.getElementById('enterpriseSMW');
const closeEnterpriseSMW = document.getElementById('closeEnterpriseSMW');
function openEnterpriseSMW(){
    enterpriseSMW.classList.add('modal__show');
}
closeEnterpriseSMW.addEventListener('click',()=>{
    enterpriseSMW.classList.remove('modal__show');
});




//---------------------------------------------TABLA MODAL INVENTARIOMW------------------------------------------------------------
espacioObligatorioInvMW();
function espacioObligatorioInvMW(){
    //paginas por producto
    document.getElementById('inventoryForPageMW').selectedIndex = 3;
}
//-------Mostrar tabla 
let selectSearchInvenMW = document.getElementById('selectSearchInvenMW');
selectSearchInvenMW.addEventListener('change', pageOneInvMW);
function pageOneInvMW(){
    globalPageInv = 1;
    readAllInventoryMW();
}
function returnSSInventoryMW(){
    let options = selectSearchInvenMW.querySelectorAll('option');
    let arraySearch = [];
    if(selectSearchInvenMW.value == 'todas'){
        options.forEach(option => {
            if(option.value == 'todas'){
            }else{
            arraySearch.push(option.value);
            }
        })
    }else{
        arraySearch.push(selectSearchInvenMW.value)
    }
    return arraySearch;
}
//------Ordenar tabla descendente ascendente
let orderImgsInventory = document.querySelectorAll('.tbody__head--invMW');
orderImgsInventory.forEach(div=>{
    div.children[0].addEventListener('click', function() {
        orderInventoryTableASC(this);
    });
    div.children[1].addEventListener('click', function() {
        orderInventoryTableDESC(this);
    });
})
let orderByInventory = 'id_inv DESC';
function orderInventoryTableASC(img){
    orderByInventory = img.name;
    pageOneInvMW();
}
function orderInventoryTableDESC(img){
    orderByInventory = img.name+' DESC';
    pageOneInvMW();
}
//------BUSCAR
const searchInputInvMW = document.getElementById("searchInputInvMW");
searchInputInvMW.addEventListener("keyup", e=>{
    if(e.key == 'Enter'){pageOneInvMW()}
    if(searchInputInvMW.value == ''){pageOneInvMW()}
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
inventoryForPageMW.addEventListener('change', pageOneInvMW )
//leet todos los productos del inventario
readAllInventoryMW();
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
    }).then(response => response.json()).then(data => {
        inventarioMW = data;
        totalInventarioMW = Object.values(data).length;
        allPages = Math.ceil(totalInventarioMW/invPorPaginaMW);
        paginacionInventarioMW(allPages,globalPageInvMW,totalInventarioMW);   
    }).catch(err => console.log(err));
}
//<<----------------------------------PAGINACION Inventario-------------------------------------------->>
function paginacionInventarioMW(allPages, page,totalInventarioMW){
    let ul = document.querySelector('#wrapperInvMW ul');
    globalPageInvMW = page;
    let li = '';
    let beforePages = page-1;
    let afterPages = page +1;
    let liActive;
    allPageInventoryMW(page, totalInventarioMW);
    inventoryTableMW(page);
    if(page > 1){
        li+= `<li class="btn" onclick="paginacionInventarioMW(allPages, ${page-1}, totalInventarioMW)"><img src="../imagenes/arowLeft.svg"></li>`;
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
        li+= `<li class="numb ${liActive}" onclick="paginacionInventarioMW(allPages, ${pageLength}, totalInventarioMW)"><span>${pageLength}</span></li>`;
    }
    if(page < allPages){
        li += `<li class="btn" onclick="paginacionInventarioMW(allPages, ${page+1}, totalInventarioMW)"><img src="../imagenes/arowRight.svg"></li>`;
    }
    ul.innerHTML = li;
}
function allPageInventoryMW(page, totalInventarioMW){
    let h2= document.querySelector('#showPageInvMW h2');
    h2.innerHTML =`Pagina ${page}/${allPages}, ${totalInventarioMW} Productos`;
}
//-----------TABLA
function inventoryTableMW(page){
    let tbody = document.getElementById('tbodyInvMW');
    inicio = (page-1)*invPorPaginaMW; 
    final = inicio +invPorPaginaMW;
    i=1;
    tbody.innerHTML = '';
    if (inventarioMW == ''){
        tbody.innerHTML = 'NO HAY';
    }else{
        tbody.innerHTML = '';
        html='';
        i=1;
        for(let producto in inventarioMW){
            if( i > inicio && i <= final){
                html += '<tr>';
                html += '<td>'+i+'</td>';
                for(let x_prod in inventarioMW[producto]){
                    if(x_prod == 'id_prod' || x_prod == 'id_inv'){
                        html += '<td hidden="">'+inventarioMW[producto][x_prod]+'</td>';
                    }else if(x_prod == 'imagen_prod'){
                        html += "<td><img src='../modelos/imagenes/"+inventarioMW[producto][x_prod]+"' class='tbody__img'></td>";
                    }else{
                        html += '<td>'+inventarioMW[producto][x_prod]+'</td>';
                    }  
                }
                html += `<td>
                <img src='../imagenes/send.svg' onclick='addProduct(this.parentNode.parentNode)'>
                </td>`;
                html += '</tr>';
                i++;
            }else{
                i++;
            }
        }
        tbody.innerHTML = html; 
    }
}
function addProduct(tr){
    let id_prod = tr.children[2].innerText;
    for(let inventario in inventarioMW){
        if(inventarioMW[inventario]['id_prod']==id_prod){
            let modalProf_prod = document.querySelector('#cmp_prod'+addProductoClave+'MW div.modal__body');
            let prof_prods = modalProf_prod.querySelectorAll('.cart-item');
            let i = 0;
            prof_prods.forEach(prod=>{
                let codigo = prod.children[2].innerText;
                if(codigo == inventarioMW[inventario]['codigo_prod']){
                    i++;
                }
            })
            if(i == 0){
                listProducts(inventarioMW[inventario], addProductoClave);
            }else{
                alert("El producto ya se encuentra en la lista");
            }     
        }
    }
}



function listProducts(product, rm){
    let modalCmp_prod = document.querySelector('#cmp_prod'+rm+'MW div.modal__body');
    let cantidad_inv;
    let imagen_prod = product['imagen_prod'];
    let codigo_prod = product['codigo_prod'];

    for (let producto in allInventory){
        if(producto == codigo_prod){
            cantidad_inv = allInventory[producto]['cantidad_inv'];
            break;
        }else{
            cantidad_inv = 0;
        }
    }
    if(rm == 'R'){
        cantidad_pfpd = 1;
    }else if(rm == 'M'){
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
    img.setAttribute('src',`../modelos/imagenes/${imagen_prod}`);
    div_img.appendChild(img);
    let p_codigo = document.createElement('p');
    p_codigo.classList.add('cart-item__codigo2');
    p_codigo.innerHTML = codigo_prod;
    let input_cantidad = document.createElement('input');
    input_cantidad.classList.add('cart-item__cantidad');
    input_cantidad.setAttribute('type', 'number');
    input_cantidad.setAttribute('value', cantidad_pfpd);
    input_cantidad.setAttribute('min',1);
 
 
    let imgTrash = document.createElement('img');
    imgTrash.setAttribute('src', '../imagenes/trash.svg');
    imgTrash.addEventListener('click', function(){ 
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
    document.getElementById('count_cppd'+rm).innerHTML = itemProduct.length;
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
    let listProducts = document.querySelector('#cmp_prod'+rm+'MW div.modal__body');
    let itemProduct = listProducts.querySelectorAll('div.cart-item');
    listProducts.removeChild(product);

    itemProduct = listProducts.querySelectorAll('div.cart-item');
    document.getElementById('count_cppd'+rm).innerHTML = itemProduct.length;
}

//---------------------------ventana modal para buscar inventario
const inventorySMW = document.getElementById('inventorySMW');
const closeInventorySMW = document.getElementById('closeInventorySMW');
function openInventorySMW(){
    inventorySMW.classList.add('modal__show');
}
closeInventorySMW.addEventListener('click',()=>{
    inventorySMW.classList.remove('modal__show');
});

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
//<<------------------------ABRIR Y CERRAR VENTANAS MODALES--------------------------------->>
const marcaRMW = document.getElementById('marcaRMW');
const closeMarcaRMW = document.getElementById('closeMarcaRMW');
function openMarcaRMW() {
    marcaRMW.classList.add('modal__show');
}
closeMarcaRMW.addEventListener('click',(e)=>{
    marcaRMW.classList.remove('modal__show');
});

const categoriaRMW = document.getElementById('categoriaRMW');
const closeCategoriaRMW = document.getElementById('closeCategoriaRMW');
function openCategoriaRMW() {
    categoriaRMW.classList.add('modal__show');
}
closeCategoriaRMW.addEventListener('click',(e)=>{
    categoriaRMW.classList.remove('modal__show');
});


//-----------------------------------------GUARDAR EL TOTAL DE PRODUCTOS DEL INVENTARIO-----------------------------------
let allInventory;
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
}
    