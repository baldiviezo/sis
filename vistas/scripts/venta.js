//----------------------------------------------------------FECHA----------------------------------------------------
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


//--------------------------------------------------------TABLE SALES--------------------------------------------
let sales = {};
let filterSales = {};
readSales();
function readSales() {
    let formData = new FormData();
    formData.append('readSales','');
    fetch('../controladores/ventas.php', {
        method: "POST",
        body: formData
    }).then(response => response.json()).then(data => {
        sales = data;
        filterSales = data;
        paginationSales(Object.values(data).length, 1);
    }).catch(err => console.log(err));
}
//------Select utilizado para buscar por columnas
const selectSearchVnt = document.getElementById('selectSearchVnt');
selectSearchVnt.addEventListener('change', searchSales);
//------buscar por input
const inputSerchVnt = document.getElementById("inputSerchVnt");
inputSerchVnt.addEventListener("keyup", searchSales);
//------Clientes por pagina
const selectNumberVnt = document.getElementById('selectNumberVnt');
selectNumberVnt.selectedIndex = 3;
selectNumberVnt.addEventListener('change', function(){
    paginationSales(Object.values(filterSales).length, 1);
});
//------buscar por:
function searchSales(){
    filterSales = {};
    for(let sale in sales){
        for(let valor in sales[sale]){
            if(selectSearchVnt.value == 'todas'){
                if(valor != 'id_prof'){
                    if(sales[sale][valor].toLowerCase().indexOf(inputSerchVnt.value.toLowerCase())>=0){
                        filterSales[sale] = sales[sale];
                        break;
                    }
                }
            }else{
                if(valor == selectSearchVnt.value){
                    if(sales[sale][valor].toLowerCase().indexOf(inputSerchVnt.value.toLowerCase())>=0){
                        filterSales[sale] = sales[sale];
                        break;
                    }
                }
            }
        }
    }
    paginationSales(Object.values(filterSales).length, 1);
}
//------Ordenar tabla descendente ascendente
let orderSales = document.querySelectorAll('.tbody__head--venta');
orderSales.forEach(div=>{
    div.children[0].addEventListener('click', function() {
        let array = Object.entries(filterSales).sort((a,b)=>{
            let first = a[1][div.children[0].name].toLowerCase();
            let second = b[1][div.children[0].name].toLowerCase();
            if( first < second){return -1}
            if(first > second){return 1}
            return 0;
        })
        filterSales = Object.fromEntries(array);
        paginationSales(Object.values(filterSales).length, 1);
    });
    div.children[1].addEventListener('click', function() {
        let array = Object.entries(filterSales).sort((a,b)=>{
            let first = a[1][div.children[0].name].toLowerCase();
            let second = b[1][div.children[0].name].toLowerCase();
            if( first > second){return -1}
            if(first < second){return 1}
            return 0;
        })
        filterSales = Object.fromEntries(array);
        paginationSales(Object.values(filterSales).length, 1);
    });
})
//------PaginationSales
function paginationSales(allVentas, page){
    let numberVentas = Number(selectNumberVnt.value);
    let allPages = Math.ceil(allVentas/numberVentas);
    let ul = document.querySelector('#wrapperVenta ul');
    let li = '';
    let beforePages = page-1;
    let afterPages = page +1;
    let liActive;
    if(page > 1){
        li+= `<li class="btn" onclick="paginationSales(${allVentas}, ${page-1})"><img src="../imagenes/arowLeft.svg"></li>`;
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
        li+= `<li class="numb ${liActive}" onclick="paginationSales(${allVentas}, ${pageLength})"><span>${pageLength}</span></li>`;
    }
    if(page < allPages){
        li += `<li class="btn" onclick="paginationSales(${allVentas}, ${page+1})"><img src="../imagenes/arowRight.svg"></li>`;
    }
    ul.innerHTML = li;
    let h2= document.querySelector('#showPageVenta h2');
    h2.innerHTML =`Pagina ${page}/${allPages}, ${allVentas} Clientes`;
    tableSales(page);
}
//------Crear la tabla
function tableSales(page) {
    let tbody = document.getElementById('tbodyVenta');
    inicio = (page-1)*Number(selectNumberVnt.value); 
    final = inicio + Number(selectNumberVnt.value);
    let i=1;
    tbody.innerHTML = '';
    for(let sale in filterSales){
       if( i > inicio && i <= final){
        let tr = document.createElement('tr');
        for(let valor in filterSales[sale]){
            let td = document.createElement('td');
            if(valor == 'id_vnt'){
                td.innerText = i;
                tr.appendChild(td);
                i++;
                td = document.createElement('td');
                td.innerText = 'VNT-SMS-'+filterSales[sale][valor];
                tr.appendChild(td);
            }else if(valor == 'id_prof'){
                td.innerText = 'SMSIC'+filterSales[sale]['fecha_vnt'].slice(2, 4)+'-'+filterSales[sale][valor];
                tr.appendChild(td);
            }else if(valor == 'nombre_usua'){
                td.innerText = filterSales[sale][valor]+' '+filterSales[sale]['apellido_usua'];
                tr.appendChild(td);
            }else if(valor == 'apellido_usua'){
            }else if(valor == 'fecha_vnt'){
                td.innerText = filterSales[sale][valor].slice(0,10);
                tr.appendChild(td);
            }else{
                td.innerText = filterSales[sale][valor];
                tr.appendChild(td);
            }
        }
        /*let td = document.createElement('td');
        td.innerHTML = `
        <img src='../imagenes/edit.svg' onclick='readVenta(this.parentNode.parentNode)'>
        <img src='../imagenes/trash.svg' onclick='deleteVenta(this.parentNode.parentNode)'>`;
        tr.appendChild(td);*/
        tbody.appendChild(tr);
        }else{
            i++;    
        }
    }   
}








//----------------------------------------------------------------FECHA----------------------------------------------------
/*let hoy = new Date();
let dia = hoy.getDate();
let mes = hoy.getMonth()+1;
let year = hoy.getFullYear();
onlyYear = year%100;


//<<--------------------------------------CRUD VENTA-------------------------------------------->>
//------READ VENTA
function readVenta(tr) {
    document.getElementsByName('fecha_vntM')[0].value = tr.children[2].innerText; 
    document.getElementsByName('factura_vntM')[0].value = tr.children[3].innerText;
    saleMMW.classList.add('modal__show');
}
//------UPDATE VENTA
/*let formsaleM  = document.getElementById('formsaleM');
formsaleM.addEventListener('submit', updateASale)
function updateASale(){
    event.preventDefault();
    let productos = document.querySelectorAll('#vnt_prodMMW div.modal__body .cart-item');
    if(productos.length > 0){
        let arrayOfObjects = [];
        productos.forEach(producto=>{
            let jsonObject = {};
            jsonObject['codigo'] = producto.children[2].innerHTML;
            jsonObject['cantidad'] = producto.children[3].value;
            arrayOfObjects.push(jsonObject);
        });
        let stringJson = JSON.stringify(arrayOfObjects);
        let form  = document.getElementById('formsaleM');
        let formData = new FormData(form);
        saleMMW.classList.remove('modal__show');
        formData.append('updateVenta', stringJson);
        fetch('../controladores/ventas.php', {
            method: "POST",
            body: formData
        }).then(response => response.text()).then(data => {
            readAllVenta();
        }).catch(err => console.log(err));
    }else{
        alert('No a seleccionado ningun producto');
    }
}*/
//------Delete venta
/*function deleteVenta(tr){
    if(confirm('¿Esta usted seguro?')){
        let id_vnt = tr.children[1].innerText.slice(6);
        let id_prof = tr.children[4].innerText.slice(8);
        let formData = new FormData();
        formData.append('deleteVenta',id_vnt);
        formData.append('id_prof',id_prof);
        fetch('../controladores/ventas.php', {
            method: "POST",
            body: formData
        }).then(response => response.text()).then(data => {
            console.log(data)
            readSales();
        }).catch(err => console.log(err));
    }
}
//-----------------------------------Ventana modal para VENTA---------------------------------//
const saleMMW = document.getElementById('saleMMW');
const closeSaleMMW = document.getElementById('closeSaleMMW');
const openSaleMMW = document.getElementById('openSaleMMW');
closeSaleMMW.addEventListener('click',()=>{
    saleMMW.classList.remove('modal__show');
});








//-------------------------------------------VNT-PROD TABLA MODAL----------------------------------------------
//-------Marca y categoria
/*const selectMarcaProduct = document.getElementById('selectMarcaProduct');
selectMarcaProduct.addEventListener('change', searchVnt_prod);
const selectCategoriaProduct = document.getElementById('selectCategoriaProduct');
selectCategoriaProduct.addEventListener('change', searchVnt_prod);*/
//------read vnt-prods
/*let vnt_prods = {};
let filterVnt_prods = {};
readVnt_prods();
function readVnt_prods() {
    let formData = new FormData();
    formData.append('readVnt_prods','');
    fetch('../controladores/ventas.php', {
        method: "POST",
        body: formData
    }).then(response => response.json()).then(data => {
        vnt_prods = data;
        filterVnt_prods = data;
        paginacionVnt_prod(Object.values(filterVnt_prods).length, 1);
        //(selectMarcaProduct.value == 'todasLasMarcas' && selectCategoriaProduct.value == 'todasLasCategorias') ? paginacionVnt_prod(Object.values(data).length, 1) : selectVnt_prod();
    }).catch(err => console.log(err));
}
//------Select utilizado para buscar por columnas
const selectSearchVtpdMW = document.getElementById('selectSearchVtpdMW');
selectSearchVtpdMW.addEventListener('change', searchVnt_prod);
//------buscar por input
const inputSearchVtpdMW = document.getElementById("inputSearchVtpdMW");
inputSearchVtpdMW.addEventListener("keyup", searchVnt_prod);
//------Producto por pagina
const selectNumberVtpdMW = document.getElementById('selectNumberVtpdMW');
selectNumberVtpdMW.selectedIndex = 3;
selectNumberVtpdMW.addEventListener('change', function(){
    paginacionVnt_prod(Object.values(filterVnt_prods).length, 1);
});
//------buscar por:
function searchVnt_prod(){
    filterVnt_prods = {};
    for(let vnt_prod in vnt_prods){
        for(let valor in vnt_prods[vnt_prod]){
            if(selectSearchVtpdMW.value == 'todas'){
                if(valor == 'codigo_prod' ||  valor == 'nombre_prod' || valor == 'descripcion_prod'){
                    if(vnt_prods[vnt_prod][valor].toLowerCase().indexOf(inputSearchVtpdMW.value.toLowerCase())>=0){
                        filterVnt_prods[vnt_prod] = vnt_prods[vnt_prod];
                        break;
                    }
                }
            }else{
                if(valor == selectSearchVtpdMW.value){
                    if(vnt_prods[vnt_prod][valor].toLowerCase().indexOf(inputSearchVtpdMW.value.toLowerCase())>=0){
                        filterVnt_prods[vnt_prod] = vnt_prods[vnt_prod];
                        break;
                    }
                }
            }
        }
    }
    //selectVnt_prod();
    paginacionVnt_prod(Object.values(filterVnt_prods).length, 1);
}
//------buscar por marca y categoria:
/*function selectVnt_prod(){
    if(selectMarcaProduct.value == 'todasLasMarcas' && selectCategoriaProduct.value == 'todasLasCategorias'){
        paginacionVnt_prod(Object.values(filterVnt_prods).length, 1);
    }else{
        for(let product in filterVnt_prods){
            for(let valor in filterVnt_prods[product]){
                if(selectMarcaProduct.value == 'todasLasMarcas'){
                    if(filterVnt_prods[product]['categoria_prod'] != selectCategoriaProduct.value){
                        delete filterVnt_prods[product];
                        break;
                    }    
                }else if(selectCategoriaProduct.value == 'todasLasCategorias'){
                    if(filterVnt_prods[product]['marca_prod'] != selectMarcaProduct.value){
                        delete filterVnt_prods[product];
                        break;
                    }  
                }else{
                    if(filterVnt_prods[product]['categoria_prod'] != selectCategoriaProduct.value || filterVnt_prods[product]['marca_prod'] != selectMarcaProduct.value){
                        delete filterVnt_prods[product];
                        break;
                    }  
                }
            }
        }
        paginacionVnt_prod(Object.values(filterVnt_prods).length, 1); 
    }
}*/
//------Ordenar tabla descendente ascendente
/*let orderVvt_prod = document.querySelectorAll('.tbody__head--vtpd');
orderVvt_prod.forEach(div=>{
    div.children[0].addEventListener('click', function() {
        let array = Object.entries(filterVnt_prods).sort((a,b)=>{
            let first = a[1][div.children[0].name].toLowerCase();
            let second = b[1][div.children[0].name].toLowerCase();
            if( first < second){return -1}
            if(first > second){return 1}
            return 0;
        })
        filterVnt_prods = Object.fromEntries(array);
        paginacionVnt_prod(Object.values(filterVnt_prods).length, 1);
    });
    div.children[1].addEventListener('click', function() {
        let array = Object.entries(filterVnt_prods).sort((a,b)=>{
            let first = a[1][div.children[0].name].toLowerCase();
            let second = b[1][div.children[0].name].toLowerCase();
            if( first > second){return -1}
            if(first < second){return 1}
            return 0;
        })
        filterVnt_prods = Object.fromEntries(array);
        paginacionVnt_prod(Object.values(filterVnt_prods).length, 1);
    });
})
//------PaginacionVnt_prod
function paginacionVnt_prod(allProducts, page){
    let numberProducts = Number(selectNumberVtpdMW.value);
    let allPages = Math.ceil(allProducts/numberProducts);
    let ul = document.querySelector('#wrapperVtpdMW ul');
    let li = '';
    let beforePages = page-1;
    let afterPages = page +1;
    let liActive;
    if(page > 1){
        li+= `<li class="btn" onclick="paginacionVnt_prod(${allProducts}, ${page-1})"><img src="../imagenes/arowLeft.svg"></li>`;
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
        li+= `<li class="numb ${liActive}" onclick="paginacionVnt_prod(${allProducts}, ${pageLength})"><span>${pageLength}</span></li>`;
    }
    if(page < allPages){
        li += `<li class="btn" onclick="paginacionVnt_prod(${allProducts}, ${page+1})"><img src="../imagenes/arowRight.svg"></li>`;
    }
    ul.innerHTML = li;
    let h2= document.querySelector('#showPageVtpdMW h2');
    h2.innerHTML =`Pagina ${page}/${allPages}, ${allProducts} Productos`;
    tableVnt_prod(page);
}
//------Crear la tabla
function tableVnt_prod(page) {
    let tbody = document.getElementById('tbodyVtpdMW');
    inicio = (page-1)*Number(selectNumberVtpdMW.value); 
    final = inicio + Number(selectNumberVtpdMW.value);
    i=1;
    tbody.innerHTML = '';
    for(let vnt_prod in filterVnt_prods){
       if( i > inicio && i <= final){
        let tr = document.createElement('tr');
        for(let valor in filterVnt_prods[vnt_prod]){
            let td = document.createElement('td');
            if(valor == 'id_vtpd'){
                td.innerText = filterVnt_prods[vnt_prod][valor];
                td.setAttribute('hidden', '');
                tr.appendChild(td);
                td = document.createElement('td');
                td.innerText = i;
                tr.appendChild(td);
                i++;
            }else if(valor == 'imagen_prod'){
                let img = document.createElement('img');
                img.classList.add('tbody__img');
                img.setAttribute('src', '../modelos/imagenes/'+filterVnt_prods[vnt_prod][valor]);
                td.appendChild(img);
                tr.appendChild(td);
            }else{
                td.innerText = filterVnt_prods[vnt_prod][valor];
                tr.appendChild(td);
            }
        }
        tbody.appendChild(tr);
        }else{
            i++;    
        }
    }
    priceTotal();   
}











//--------------------------------------------------VENTANA MODAL-------------------------------------------------
const closeVnt_prodSMW = document.getElementById('closeVnt_prodSMW');
const vnt_prodSMW = document.getElementById('vnt_prodSMW');
function openVnt_prodSMW(){
    vnt_prodSMW.classList.add('modal__show'); 
}
closeVnt_prodSMW.addEventListener('click',(e)=>{
    vnt_prodSMW.classList.remove('modal__show');
});


//-----llenar los años, meses y dias
selectDate();
function selectDate(){
    let year = document.getElementsByName('selectYear');
    year.forEach(select=>{
        for(let i=2020 ; i<=2050; i++){
            let option = document.createElement('option');
            option.value = i;
            option.innerText = i;
            select.appendChild (option);
        }
    })
    let month = document.getElementsByName('selectMonth');
    month.forEach(select=>{
        for(let i=1 ; i<=12; i++){
            let option = document.createElement('option');
            option.value = i;
            option.innerText = i;
            select.appendChild (option);
        }
    })
    let day = document.getElementsByName('selectDay');
    day.forEach(select=>{
        for(let i=1 ; i<=31; i++){
            let option = document.createElement('option');
            option.value = i;
            option.innerText = i;
            select.appendChild (option);
        }
    })
}



function priceTotal(){
    let ventaTotal = document.getElementById('priceTotal');
    let tbody = document.getElementById('tbodyVtpdMW');
    let trs = tbody.querySelectorAll('tr');
    let total= 0 ;
    trs.forEach(tr=>{
        total += Number(tr.children[9].innerText);
    })
    ventaTotal.innerText = 'Total: '+total+ 'Bs';
}


/*


//-----------------------------------Ventana modal para VENTA---------------------------------//
const saleRMW = document.getElementById('saleRMW');
const saleMMW = document.getElementById('saleMMW');
const closeSaleRMW = document.getElementById('closeSaleRMW');
const closeSaleMMW = document.getElementById('closeSaleMMW');
const openSaleRMW = document.getElementById('openSaleRMW');
const openSaleMMW = document.getElementById('openSaleMMW');
openSaleRMW.addEventListener('click',()=>{
    saleRMW.classList.add('modal__show');
    rmAddProduct='R';
    addProductoClave = 'R';
    claveSendCustomer = 'R';
    claveSendNotaEntrega = 'R';
    document.getElementsByName('fecha_vntR')[0].value = year+'-'+mes+'-'+dia;
});
closeSaleRMW.addEventListener('click',()=>{
    saleRMW.classList.remove('modal__show');
});
closeSaleMMW.addEventListener('click',()=>{
    saleMMW.classList.remove('modal__show');
});
//<<-------------------------------------MODAL DE PRODUCTS DE UNA PROFORMA MODIFICAR-------------------------------------------->>
const closeVnt_prodRMW = document.getElementById('closeVnt_prodRMW');
const vnt_prodRMW = document.getElementById('vnt_prodRMW');
function openVnt_prodRMW(){
    vnt_prodRMW.classList.add('modal__show'); 
}
closeVnt_prodRMW.addEventListener('click',(e)=>{
    vnt_prodRMW.classList.remove('modal__show');
});
const closeVnt_prodMMW = document.getElementById('closeVnt_prodMMW');
const vnt_prodMMW = document.getElementById('vnt_prodMMW');
function openVnt_prodMMW(){
    vnt_prodMMW.classList.add('modal__show'); 
}
closeVnt_prodMMW.addEventListener('click',(e)=>{
    vnt_prodMMW.classList.remove('modal__show');
});





//<<------------------------------------------CLIENTE---------------------------------------------->>

//<<------------------------LLENAR LA LISTA DE EMPRESAS-------------------------------------->>
const selectEnterpriseR = document.getElementById('selectEnterpriseR');
const selectEnterpriseM = document.getElementById('selectEnterpriseM');
listSelectEnterprise(selectEnterpriseR, 'R', 0);
function listSelectEnterprise(select, rm, index) {
    let formData = new FormData();
    formData.append('readEnterprise','');
    fetch('../controladores/clientes.php', {
        method: "POST",
        body: formData
    }).then(response => response.json()).then(data => {
        select.innerHTML = ''; 
        for ( let clave in data){
            let option = document.createElement('option');
            option.value = data[clave]['id_emp'];
            option.innerText = data[clave]['sigla_emp'];
            select.appendChild(option);
        }
        //Para seguir seleccionando el campor modificado
        let options = select.querySelectorAll('option');
        options.forEach(option=>{
            if(option.value == index){
                select.value = index;
            }
        })
        //LLenas con solo los clientes que tiene la empresa
        let selectCustomer = document.getElementById('selectCustomer'+rm);
        llenarClientes(selectCustomer, select.value, rm);
    }).catch(err => console.log(err));
}
let selectCustomerR = document.getElementById('selectCustomerR');
let selectCustomerM = document.getElementById('selectCustomerM');
//---------LLENAR EL FORMULARIO AL CAMBIAR LA EMPRESA
selectEnterpriseR.addEventListener('change', function(){
    llenarClientes(selectCustomerR, selectEnterpriseR.value, 0);
});
selectEnterpriseM.addEventListener('change', function(){
    llenarClientes(selectCustomerM, selectEnterpriseM.value, 0);
});

//-------LLENAR LA LISTA DE CLIENTES
let datosDeClientes;
function llenarClientes(select, id_emp, index) {
    select.innerHTML = '';
    let formData = new FormData();
    formData.append('id_emp', id_emp);
    formData.append('readCustomer','');
    fetch('../controladores/clientes.php', {
        method: "POST",
        body: formData
    }).then(response => response.json()).then(data => {
        datosDeClientes = data;
        for ( let clave in data){
            let option = document.createElement('option');
            option.value = data[clave]['id_clte'];
            option.innerText = data[clave]['nombre_clte']+' '+data[clave]['apellido_clte'];
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


//<<-----------------------------------------CRUD CLIENTE----------------------------------------->>
//------Create a customer
const formClienteR = document.getElementById('formClienteR');
formClienteR.addEventListener('submit', registrar);
function registrar() {
    event.preventDefault();

    let formData = new FormData(formClienteR);
    formData.append('registrar','');
    fetch('../controladores/clientes.php', {
        method: "POST",
        body: formData
    }).then(response => response.text()).then(data => {
        customersRMW.classList.remove('modal__show');
        const inputsR = document.querySelectorAll('#formClienteR .form__group input');
        inputsR.forEach(input=>{input.value = ''})
        llenarClientes(selectCustomerR, selectEnterpriseR.value, 'R', 0);
        llenarClientes(selectCustomerM, selectEnterpriseM.value, 'M', 0);
    }).catch(err => console.log(err));
}
//------Llenar la empresa del cliente en el formulario de registrar nuevo cliente
function enterpriseOfCustomer(rm){
    let selectEnterprise2 = document.getElementById('selectEnterpriseR2');
    let selectEnterprise = document.getElementById('selectEnterprise'+rm);
    selectEnterprise2.innerHTML = '';
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
    selectEnterprise2.appendChild(option2);
}
//------Read a Customer
function readCustomers(rm) {
    let selectCustomerRM = document.getElementById('selectCustomer'+rm);
    let id = selectCustomerRM.value;
    if (id!=0){
    customersMMW.classList.add('modal__show');
    let formData = new FormData();
    formData.append('modificar',id);
    fetch('../controladores/clientes.php', {
        method: "POST",
        body: formData
    }).then(response => response.json()).then(data => {
        let selectM = document.getElementById('selectEnterpriseM2');
        let inputsM = document.querySelectorAll('#formClienteM .form__group input');
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
//------Update a Customer
const formClienteM = document.getElementById('formClienteM');
formClienteM.addEventListener('submit', modificar);
function modificar(){
    event.preventDefault();
    let id_clte = document.getElementsByName('idM')[0].value;
    let formData = new FormData(formClienteM);
    formData.append('guardar', id_clte);
    fetch('../controladores/clientes.php', {
        method: "POST",
        body: formData
    }).then(response => response.text()).then(data => {
        customersMMW.classList.remove('modal__show');
        const inputsM = document.querySelectorAll('#formClienteM .form__group input');
        inputsM.forEach(input=>{input.value = ''})
        llenarClientes(selectCustomerR, selectEnterpriseR.value, 'R', selectCustomerR.value);
        llenarClientes(selectCustomerM, selectEnterpriseM.value, 'M', selectCustomerM.value);
    }).catch(err => console.log(err));   
}
//------Delete a Customer
function deleteCustomers (rm) {
    let selectCustomerRM = document.getElementById('selectCustomer'+rm);
    if (confirm('¿Esta usted seguro?')){
        let id = selectCustomerRM.value;
        let formData = new FormData();
        formData.append('borrar',id);
        fetch('../controladores/clientes.php', {
            method: "POST",
            body: formData
        }).then(response => response.text()).then(data => {
            llenarClientes(selectCustomerR, selectEnterpriseR.value, 'R', 0);
            llenarClientes(selectCustomerM, selectEnterpriseM.value, 'M', 0);
        }).catch(err => console.log(err));  
    }   
}
//<<-------------------------------------------MODAL CLIENTE---------------------------------------->>
const customersRMW = document.getElementById('customersRMW');
const customersMMW = document.getElementById('customersMMW');
const closeCustomersRMW = document.getElementById('closeCustomersRMW');
const closeCustomersMMW = document.getElementById('closeCustomersMMW');
function openCustomersRMW() {
    customersRMW.classList.add('modal__show');
    enterpriseOfCustomer(claveSendCustomer);
}
closeCustomersRMW.addEventListener('click',()=>{
    customersRMW.classList.remove('modal__show');
});
closeCustomersMMW.addEventListener('click',()=>{
    customersMMW.classList.remove('modal__show');
});



//<<------------------------------------------------CRUD EMPRESA------------------------------->>
//------Craer una empresa
const formEmpresaR = document.getElementById('formEmpresaR');
formEmpresaR.addEventListener('submit', createEnterprise);
function createEnterprise() {
    event.preventDefault();
    let formData = new FormData(formEmpresaR);
    formData.append('createEnterprise','');
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
    let id_emp = selectEnterpriseRM.value;
    let formData = new FormData();
    formData.append('readEnterprise','');
    fetch('../controladores/clientes.php', {
        method: "POST",
        body: formData
    }).then(response => response.json()).then(data => {
        for ( let clave in data){
            if(data[clave]['id_emp']==id_emp){
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
    formData.append('updateEnterprise','');
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
        let id_emp = selectEnterpriseRM.value;
        let formData = new FormData();
        formData.append('deleteEnterprise',id_emp);
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
let orderByEnterprise = 'id_emp DESC';
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
    formData.append('readAllEnterprise',inputSearchEmpMW.value);
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
            if(dato == 'id_emp'){
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
    let id_emp = tr.children[1].innerText;
    let selectCustomer = document.getElementById('selectCustomerR')
    let selectEnterprise = document.getElementById('selectEnterpriseR');
    let options = selectEnterprise.querySelectorAll('option');
    options.forEach((option,index) =>{
        if (option.value == id_emp){
            selectEnterprise.selectedIndex = index;
            enterpriseSMW.classList.remove('modal__show');
        }
    })
    llenarClientes(selectCustomer, selectEnterprise.value, 0);
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
            let modalProf_prod = document.querySelector('#vnt_prod'+addProductoClave+'MW div.modal__body');
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
    let modalCmp_prod = document.querySelector('#vnt_prod'+rm+'MW div.modal__body');
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
        cantidad_pfpd = product['cantidad_vtpd'];
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
    let itemProduct = modalCmp_prod.querySelectorAll('div.cart-item');
    document.getElementById('count_vtpd'+rm).innerHTML = itemProduct.length;
}

let modalVnt_prodR = document.querySelector('#vnt_prodRMW div.modal__body');
let modalVnt_prodM = document.querySelector('#vnt_prodMMW div.modal__body');
const initSortableListR = (e) => {
    e.preventDefault();
    const draggingItem = document.querySelector(".dragging");
    // Getting all items except currently dragging and making array of them
    let siblings = [...modalVnt_prodR.querySelectorAll(".cart-item:not(.dragging)")];

    // Finding the sibling after which the dragging item should be placed
    let nextSibling = siblings.find(sibling => {
        return e.clientY <= sibling.offsetTop + sibling.offsetHeight / 2;
    });

    // Inserting the dragging item before the found sibling
    modalVnt_prodR.insertBefore(draggingItem, nextSibling);
}
const initSortableListM = (e) => {
    e.preventDefault();
    const draggingItem = document.querySelector(".dragging");
    // Getting all items except currently dragging and making array of them
    let siblings = [...modalVnt_prodM.querySelectorAll(".cart-item:not(.dragging)")];

    // Finding the sibling after which the dragging item should be placed
    let nextSibling = siblings.find(sibling => {
        return e.clientY <= sibling.offsetTop + sibling.offsetHeight / 2;
    });

    // Inserting the dragging item before the found sibling
    modalVnt_prodM.insertBefore(draggingItem, nextSibling);
}
modalVnt_prodR.addEventListener("dragover", initSortableListR);
modalVnt_prodR.addEventListener("dragenter", e => e.preventDefault());
modalVnt_prodM.addEventListener("dragover", initSortableListM);
modalVnt_prodM.addEventListener("dragenter", e => e.preventDefault());

//-------Eliminar producto de la lista
function removeProduct(product, rm) {
    let listProducts = document.querySelector('#vnt_prod'+rm+'MW div.modal__body');
    let itemProduct = listProducts.querySelectorAll('div.cart-item');
    listProducts.removeChild(product);

    itemProduct = listProducts.querySelectorAll('div.cart-item');
    document.getElementById('count_vtpd'+rm).innerHTML = itemProduct.length;
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

//----------------------------------------------Marca y categoria-------------------------------------------------
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
    




//--------------------------------------------------------TABLA DE NOTA DE ENTREGA-------------------------------------------------

espaciosObligatoriosNE();
function espaciosObligatoriosNE(){
    //paginas por producto
    document.getElementById('forPageNE').selectedIndex = 3;
}
//-------TABLA DE notaEntrega
//-------Buscar Proforma
let selectSearchNE = document.getElementById('selectSearchNE');
selectSearchNE.addEventListener('change', pageOneNE);
function returnSelectSearchNE(){
    let options = selectSearchNE.querySelectorAll('option');
    let arraySearch = [];
    if(selectSearchNE.value == 'todas'){
        options.forEach(option => {
            if(option.value == 'todas'){
            }else{
            arraySearch.push(option.value);
            }
        })
    }else{
        arraySearch.push(selectSearchNE.value)
    }
    return arraySearch;
}
function pageOneNE(){
    globalPageNE = 1;
    readAllNE();
}
//------Ordenar tabla descendente ascendente
let orderImgsProforma = document.querySelectorAll('.tbody__head--proforma');
orderImgsProforma.forEach(div=>{
    div.children[0].addEventListener('click', function() {
        orderProformableASC(this);
    });
    div.children[1].addEventListener('click', function() {
        orderProformableDESC(this);
    });
})
let orderByNE = 'fk_id_prof_ne DESC';
function orderProformableASC(img){
    orderByNE = img.name;
    pageOneNE();
}
function orderProformableDESC(img){
    orderByNE = img.name+' DESC';
    pageOneNE();
}
const buscarNE = document.getElementById("buscarNE");
buscarNE.addEventListener("keyup", e=>{
    if(e.key == 'Enter'){pageOneNE()}
    if(buscarNE.value == ''){pageOneNE()}
});
let notaEntrega = {};  //base de datos de notaEntrega
let totalNE;
let globalPageNE =1;
let nEPorPagina
//-------Productos por pagina
const forPageNE = document.getElementById('forPageNE');
forPageNE.addEventListener('change', pageOneNE )
//-------Read todas las notaEntrega
readAllNE();
function readAllNE() {
    let tbody = document.getElementById('tbodyNE');
    tbody.innerHTML = '';
    nEPorPagina = Number(forPageNE.value);
    let formData = new FormData();
    formData.append('readAllNE',buscarNE.value);
    formData.append('selectSearch', returnSelectSearchNE());
    formData.append('orderByNE', orderByNE);
    fetch('../controladores/notaEntrega.php', {
        method: "POST",
        body: formData
    }).then(response => response.json()).then(data => {
        notaEntrega = data;
        totalNE = Object.values(data).length;
        allPages = Math.ceil(totalNE/nEPorPagina);
        paginacionNE(allPages,globalPageNE,totalNE);   
    }).catch(err => console.log(err));
}
//--------PaginacionNE
function paginacionNE(allPages, page,totalNE){
    let ul = document.querySelector('#wrapperNE ul');
    globalPageNE = page;
    let li = '';
    let beforePages = page-1;
    let afterPages = page +1;
    let liActive;
    totalPaginas(page, totalNE);
    notaEntregaTable(page);
    if(page > 1){
        li+= `<li class="btn" onclick="paginacionNE(allPages, ${page-1}, totalNE)"><img src="../imagenes/arowLeft.svg"></li>`;
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
        li+= `<li class="numb ${liActive}" onclick="paginacionNE(allPages, ${pageLength}, totalNE)"><span>${pageLength}</span></li>`;
    }
    if(page < allPages){
        li += `<li class="btn" onclick="paginacionNE(allPages, ${page+1}, totalNE)"><img src="../imagenes/arowRight.svg"></li>`;
    }
    ul.innerHTML = li;
}
function totalPaginas(page, totalNE){
    const h2= document.querySelector('#showPageNE h2');
    h2.innerHTML =`Pagina ${page}/${allPages}, ${totalNE} Notas de entrega`;
}
//--------Tabla de proforma
function notaEntregaTable(page) {
    let tbody = document.getElementById('tbodyNE');
    inicio = (page-1)*nEPorPagina; 
    final = inicio +nEPorPagina;
    i=1;
    tbody.innerHTML = '';
    for(let proforma in notaEntrega){
       if( i > inicio && i <= final){
        let tr = document.createElement('tr');
        for(let dato in notaEntrega[proforma]){
            let td = document.createElement('td');
            if(dato == 'id_ne'){
                td.innerText = notaEntrega[proforma][dato];
                td.setAttribute('hidden', '');
                tr.appendChild(td);
            }else if(dato == 'id_prof'){
                td.innerText = i;
                tr.appendChild(td);
                i++;
                td = document.createElement('td');
                td.innerText = 'SMS23-'+notaEntrega[proforma][dato];
                tr.appendChild(td);
            }else if(dato == 'fecha_prof'){
                td.innerText = notaEntrega[proforma][dato].slice(0,10);
                tr.appendChild(td);
            }
            else if(dato == 'nombre_usua'){
                td.innerText = notaEntrega[proforma][dato]+' '+notaEntrega[proforma]['apellido_usua'];
                tr.appendChild(td);
            }else if(dato == 'apellido_usua'){
            }else if(dato == 'nombre_clte'){
                td.innerText = notaEntrega[proforma][dato]+' '+notaEntrega[proforma]['apellido_clte'];
                tr.appendChild(td);
            }else if(dato == 'apellido_clte'){
            }else{
                td.innerText = notaEntrega[proforma][dato];
                tr.appendChild(td);
            }
        }
        let td = document.createElement('td');
        //--------------------------------------------Restricciones de usuario---------------------------------------------
            td.innerHTML = `
            <img src='../imagenes/pdf.svg' onclick='pdfNotaEntrega(this.parentNode.parentNode)'>
            <img src='../imagenes/send.svg' onclick='sendNotaEntrega(this.parentNode.parentNode)'>`;
        
        tr.appendChild(td);
        tbody.appendChild(tr);
        }else{
            i++;    
        }
    }   
}
//------------------------------------- CRUD NOTA ENTREGA--------------------------------------
let nota;
function pdfNotaEntrega(tr){
    let id_ne = tr.children[0].innerText;
    let formData = new FormData();
    formData.append('readNotaEntrega', id_ne);
    fetch('../controladores/notaEntrega.php', {
        method: "POST",
        body: formData
    }).then(response => response.json()).then(data=>{
        nota = data;
        showNotaEntrega(tr);
    }).catch(err => console.log(err));
}
function showNotaEntrega(tr){
    let id_prof = tr.children[2].innerText.slice(6);
    for(let proforma in proformas){
        if(proformas[proforma]['id_prof']==id_prof){
            let formData = new FormData();
            formData.append('fk_id_prof_ne', id_prof);
            formData.append('orden_ne', nota['orden_ne']);
            formData.append('observacion_ne', nota['observacion_ne']);
            let proformaStringJson = JSON.stringify(proformas[proforma]);
            formData.append('proforma',proformaStringJson);
            formData.append('clave', 'prof');
            formData.append('ne', 'NE-');
            fetch('../controladores/proforma.php', {
                method: "POST",
                body: formData
            }).then(response => response.text()).then(data=>{
            }).catch(err => console.log(err));
            window.open('../modelos/reportes/notaDeEntrega.php');
        }
    }
}
let claveSendNotaEntrega;
function sendNotaEntrega(tr) {
    let id_prof = tr.children[2].innerText.slice(6);
    let selectNotaEntrega = document.getElementById('selectNotaEntrega'+claveSendNotaEntrega);
    selectNotaEntrega.value = id_prof;
    notaEntregaSMW.classList.remove('modal__show');
}

//-------LLENAR LA LISTA DE NOTA DE VENTA
let selectNotaEntregaR = document.getElementById('selectNotaEntregaR');
let selectNotaEntregaM = document.getElementById('selectNotaEntregaM');
llenarSelectNotaEntrega(selectNotaEntregaR);
llenarSelectNotaEntrega(selectNotaEntregaM);
function llenarSelectNotaEntrega(select) {
    let formData = new FormData();
    formData.append('readAllNotaEntrega','');
    fetch('../controladores/notaEntrega.php', {
        method: "POST",
        body: formData
    }).then(response => response.json()).then(data => {
        for ( let clave in data){
            let option = document.createElement('option');
            option.value = data[clave]['id_prof'];
            option.innerText = 'NE-SMS'+onlyYear+'-'+data[clave]['id_prof'];
            select.appendChild(option);
        }
    }).catch(err => console.log(err));
}


//------------------------------------Leer todos las proformas
let proformas = {};
readAllProformas();
function readAllProformas() {
    let arraySearch = ['id_prof'];
    let formData = new FormData();
    formData.append('readAllProformas', '');
    formData.append('selectSearch', arraySearch);
    formData.append('orderByProforma', 'id_prof');
    formData.append('estado', 'todasLasProformas');
    fetch('../controladores/proforma.php', {
        method: "POST",
        body: formData
    }).then(response => response.json()).then(data => {
        proformas= data;  
    }).catch(err => console.log(err));
}


//---------------------------------------------MODAL TABLA DE NOTA DE ENTREGA------------------------------------------------
const notaEntregaSMW = document.getElementById('notaEntregaSMW');
const closeNotaEntregaSMW = document.getElementById('closeNotaEntregaSMW');
function openNotaEntregaSMW(){
    notaEntregaSMW.classList.add('modal__show');
}
closeNotaEntregaSMW.addEventListener('click',()=>{
    notaEntregaSMW.classList.remove('modal__show');
});
*/