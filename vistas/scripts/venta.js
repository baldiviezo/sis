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
    h2.innerHTML =`Pagina ${page}/${allPages}, ${allVentas} Ventas`;
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
            }else if(valor == 'nombre_usua'){
                td.innerText = filterSales[sale][valor]+' '+filterSales[sale]['apellido_usua'];
                tr.appendChild(td);
            }else if(valor == 'apellido_usua'){
            }else if(valor == 'total_vnt'){
                td.innerText = Number(filterSales[sale][valor]).toFixed(2) + ' Bs';
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









/***********************************************PRODUCT FILTER VNT_PRODS*********************************************/
//--------read vnt_prods
let vnt_prods;
let filterVnt_prods;
readvnt_prods();
function readvnt_prods() {
    let formData = new FormData();
    formData.append('readVnt_prods', '');
    fetch('../controladores/ventas.php', {
        method: "POST",
        body: formData
    }).then(response => response.json()).then(data => {
        vnt_prods = data;
        filterVnt_prods = vnt_prods;
        paginacionProdVnt(Object.values(vnt_prods).length, 1);
    }).catch(err => console.log(err));
}
//------------------------------------------------------TABLE PRODUCT FILTER-----------------------------------------------------
//------Select utilizado para buscar por columnas
const selectSearchProdVnt = document.getElementById('selectSearchProdVnt');
selectSearchProdVnt.addEventListener('change', searchProdVnt);
//------buscar por input
const inputSearchProdVnt = document.getElementById("inputSearchProdVnt");
inputSearchProdVnt.addEventListener("keyup", searchProdVnt);
//------Proformas por pagina
const selectNumberProdVnt = document.getElementById('selectNumberProdVnt');
selectNumberProdVnt.selectedIndex = 3;
selectNumberProdVnt.addEventListener('change', function () {
    paginacionProdVnt(Object.values(filterVnt_prods).length, 1);
});
//------buscar por:
function searchProdVnt() {
    filterVnt_prods = {};
    for (let proforma in vnt_prods) {
        for (let valor in vnt_prods[proforma]) {
            if (selectSearchProdVnt.value == 'todas') {
                if (valor == 'numero_prof') {
                    if (vnt_prods[proforma][valor].toString().toLowerCase().indexOf(inputSearchProdVnt.value.toLowerCase()) >= 0) {
                        filterVnt_prods[proforma] = vnt_prods[proforma];
                        break;
                    }
                } else if (valor == 'nombre_usua') {
                    if ((vnt_prods[proforma][valor] + ' ' + vnt_prods[proforma]['apellido_usua']).toLowerCase().indexOf(inputSearchProdVnt.value.toLowerCase()) >= 0) {
                        filterVnt_prods[proforma] = vnt_prods[proforma];
                        break;
                    }
                } else if (valor == 'nombre_clte') {
                    if ((vnt_prods[proforma]['apellido_clte'] + ' ' + vnt_prods[proforma][valor]).toLowerCase().indexOf(inputSearchProdVnt.value.toLowerCase()) >= 0) {
                        filterVnt_prods[proforma] = vnt_prods[proforma];
                        break;
                    }
                } else if ( valor == 'nombre_emp' || valor == 'nombre_mrc' || valor == 'nombre_ctgr' || valor == 'codigo_vtpd' ||  valor == 'nombre_prod' || valor == 'cantidad_vtpd' || valor == 'cost_uni_vtpd' || valor == 'descuento_prof' || valor == 'fecha_ne' || valor == 'fecha_vnt') {
                    if (vnt_prods[proforma][valor].toString().toLowerCase().indexOf(inputSearchProdVnt.value.toLowerCase()) >= 0) {
                        filterVnt_prods[proforma] = vnt_prods[proforma];
                        break;
                    }
                }
            } else if (selectSearchProdVnt.value == 'encargado') {
                if (valor == 'nombre_usua') {
                    if ((vnt_prods[proforma][valor] + ' ' + vnt_prods[proforma]['apellido_usua']).toLowerCase().indexOf(inputSearchProdVnt.value.toLowerCase()) >= 0) {
                        filterVnt_prods[proforma] = vnt_prods[proforma];
                        break;
                    }
                }
            } else if (selectSearchProdVnt.value == 'cliente') {
                if (valor == 'nombre_clte') {
                    if ((vnt_prods[proforma]['apellido_clte'] + ' ' + vnt_prods[proforma][valor]).toLowerCase().indexOf(inputSearchProdVnt.value.toLowerCase()) >= 0) {
                        filterVnt_prods[proforma] = vnt_prods[proforma];
                        break;
                    }
                }
            } else {
                if (valor == selectSearchProdVnt.value) {
                    if (vnt_prods[proforma][valor].toString().toLowerCase().indexOf(inputSearchProdVnt.value.toLowerCase()) >= 0) {
                        filterVnt_prods[proforma] = vnt_prods[proforma];
                        break;
                    }
                }
            }
        }
    }
    //selectStateProductOC();
    paginacionProdVnt(Object.values(filterVnt_prods).length, 1);
}
//-------Estado de proforma
/*const selectStateProdOC = document.getElementById('selectStateProdOC');
selectStateProdOC.addEventListener('change', searchProdVnt);
function selectStateProductOC() {
    if (selectStateProdOC.value == 'todasLasOC') {
        paginacionProdVnt(Object.values(filterVnt_prods).length, 1);
    } else {
        for (let proforma in filterVnt_prods) {
            for (let valor in filterVnt_prods[proforma]) {
                if (valor == 'estado_cmp') {
                    if (filterVnt_prods[proforma][valor] != selectStateProdOC.value) {
                        delete filterVnt_prods[proforma];
                        break;
                    }
                }
            }
        }
        paginacionProdVnt(Object.values(filterVnt_prods).length, 1);
    }
}*/
//------Ordenar tabla descendente ascendente
let orderProforma = document.querySelectorAll('.tbody__head--proforma');
orderProforma.forEach(div => {
    div.children[0].addEventListener('click', function () {
        let array = Object.entries(filterVnt_prods).sort((a, b) => {
            let first = a[1][div.children[0].name];
            let second = b[1][div.children[0].name];
            if (typeof first === 'number' && typeof second === 'number') {
                return first - second;
            } else {
                return String(first).localeCompare(String(second));
            }
        });
        filterVnt_prods = Object.fromEntries(array);
        paginacionProdVnt(Object.values(filterVnt_prods).length, 1);
    });
    div.children[1].addEventListener('click', function () {
        let array = Object.entries(filterVnt_prods).sort((a, b) => {
            let first = a[1][div.children[0].name];
            let second = b[1][div.children[0].name];
            if (typeof first === 'number' && typeof second === 'number') {
                return second - first;
            } else {
                return String(second).localeCompare(String(first));
            }
        });
        filterVnt_prods = Object.fromEntries(array);
        paginacionProdVnt(Object.values(filterVnt_prods).length, 1);
    });
});
//------PaginacionProdVnt
function paginacionProdVnt(allProducts, page) {
    let totalProdVnt = document.getElementById('totalProdVnt');
    let total = 0;
    for (let vnt_prods in filterVnt_prods) {
        total += filterVnt_prods[vnt_prods]['cantidad_vtpd'] * filterVnt_prods[vnt_prods]['cost_uni_vtpd'] * (100 - filterVnt_prods[vnt_prods]['descuento_prof']) / 100;
    }
    totalProdVnt.innerHTML = total.toFixed(2) + ' Bs';
    let numberProducts = Number(selectNumberProdVnt.value);
    let allPages = Math.ceil(allProducts / numberProducts);
    let ul = document.querySelector('#wrapperProf ul');
    let li = '';
    let beforePages = page - 1;
    let afterPages = page + 1;
    let liActive;
    if (page > 1) {
        li += `<li class="btn" onclick="paginacionProdVnt(${allProducts}, ${page - 1})"><img src="../imagenes/arowLeft.svg"></li>`;
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
        li += `<li class="numb ${liActive}" onclick="paginacionProdVnt(${allProducts}, ${pageLength})"><span>${pageLength}</span></li>`;
    }
    if (page < allPages) {
        li += `<li class="btn" onclick="paginacionProdVnt(${allProducts}, ${page + 1})"><img src="../imagenes/arowRight.svg"></li>`;
    }
    ul.innerHTML = li;
    let h2 = document.querySelector('#showPageProf h2');
    h2.innerHTML = `Pagina ${page}/${allPages}, ${allProducts} Productos`;
    tableVntProds(page);
}
//--------Tabla de vnt_prods
function tableVntProds(page) {
    let tbody = document.getElementById('tbodyProdVnt');
    inicio = (page - 1) * Number(selectNumberProdVnt.value);
    final = inicio + Number(selectNumberProdVnt.value);
    i = 1;
    tbody.innerHTML = '';
    for (let proforma in filterVnt_prods) {
        if (i > inicio && i <= final) {
            let tr = document.createElement('tr');
            for (let valor in filterVnt_prods[proforma]) {
                let td = document.createElement('td');
                if (valor == 'id_vtpd') {
                    td = document.createElement('td');
                    td.innerText = i;
                    tr.appendChild(td);
                    i++;
                } else if (valor == 'nombre_usua') {
                    td.innerText = filterVnt_prods[proforma][valor] + ' ' + filterVnt_prods[proforma]['apellido_usua'];
                    tr.appendChild(td);
                } else if (valor == 'nombre_clte') {
                    td.innerText = filterVnt_prods[proforma]['apellido_clte'] + ' ' + filterVnt_prods[proforma][valor];
                    tr.appendChild(td);
                } else if (valor == 'cost_uni_vtpd') {
                    td.innerText = filterVnt_prods[proforma][valor].toFixed(2) + ' Bs';
                    tr.appendChild(td);
                    let td2 = document.createElement('td');
                    let subTotal = filterVnt_prods[proforma]['cost_uni_vtpd'] * filterVnt_prods[proforma]['cantidad_vtpd'];
                    td2.innerText = subTotal.toFixed(2) + ' Bs';
                    tr.appendChild(td2);

                } else if (valor == 'descuento_prof') {
                    let desc = filterVnt_prods[proforma][valor] * filterVnt_prods[proforma]['cost_uni_vtpd'] * filterVnt_prods[proforma]['cantidad_vtpd'] / 100;
                    td.innerText = desc.toFixed(2) + ' Bs' + ' (' + filterVnt_prods[proforma][valor] + '%)';
                    tr.appendChild(td);
                    let td2 = document.createElement('td');
                    let total = filterVnt_prods[proforma]['cantidad_vtpd'] * filterVnt_prods[proforma]['cost_uni_vtpd'] * (100 - filterVnt_prods[proforma]['descuento_prof']) / 100;
                    td2.innerText = total.toFixed(2) + ' Bs';
                    tr.appendChild(td2);
                } else if ( valor == 'apellido_usua' || valor == 'apellido_clte' || valor == 'fk_id_prod_vtpd' || valor == 'imagen_prod' || valor == 'estado_ne') {
                } else {
                    td.innerText = filterVnt_prods[proforma][valor];
                    tr.appendChild(td);
                }
            }
            tbody.appendChild(tr);
        } else {
            i++;
        }
    }
}
//---------------------------------VENTANA MODAL PARA FILTRAR PRODUCTOS COMPRADOS ------------------------------>>
const openProdVnt = document.getElementById('openProdVnt');
const closeTableProdVnt = document.getElementById('closeTableProdVnt');
const tableProdVnt = document.getElementById('tableProdVnt');
openProdVnt.addEventListener('click', () => {
    tableProdVnt.classList.add('modal__show');
})
closeTableProdVnt.addEventListener('click', () => {
    tableProdVnt.classList.remove('modal__show');
})

/*********************************************Reporte en Excel****************************************************/
const EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
const EXCEL_EXTENSION = '.xlsx';
function downloadAsExcel(data){
    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = {
        Sheets: {
            'data' : worksheet
        },
        SheetNames: ['data']
    };
    const excelBuffer = XLSX.write(workbook, {bookType: 'xlsx', type: 'array'});

    saveAsExcel(excelBuffer, 'Ventas');
}
function saveAsExcel(buffer, filename){
    const data = new Blob([buffer], {type: EXCEL_TYPE});
    saveAs(data, filename+EXCEL_EXTENSION);
}
const excelProdVnt = document.getElementById('excelProdVnt');
excelProdVnt.addEventListener('click', () => {
    let reversed = Object.values(filterVnt_prods).reverse();
    downloadAsExcel(reversed)
});