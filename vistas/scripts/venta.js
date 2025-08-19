//-----------------------------------------PRE LOADER---------------------------------------------
const preloader = document.getElementById('preloader');
let requestProf = false;
init();
function init() {
    if (requestProf == false) {
        requestProf = true;
        preloader.classList.add('modal__show');
        Promise.all([readSales(), readvnt_prods()]).then(() => {
            requestProf = false;
            preloader.classList.remove('modal__show');
        });
    }
}
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
let sales = [];
let filterSales = [];
async function readSales() {
    return new Promise((resolve, reject) => {
        let formData = new FormData();
        formData.append('readSales', '');
        fetch('../controladores/ventas.php', {
            method: "POST",
            body: formData
        }).then(response => response.text()).then(data => {
            console.log(data)
            sales = Object.values(data);
            selectYearVnt();
            filterSales = sales;
            paginationSales(sales.length, 1);
            resolve();
        }).catch(err => console.log(err));
    });
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
selectNumberVnt.addEventListener('change', function () {
    paginationSales(filterSales.length, 1);
});
//------buscar por:
function searchSales() {
    const busqueda = inputSerchVnt.value.toLowerCase();
    const valor = selectSearchVnt.value.toLowerCase().trim();
    filterSales = sales.filter(sale => {
        if (valor === 'todas') {
            return (
                sale.numero_prof.toLowerCase().includes(busqueda) ||
                sale.nombre_emp.toLowerCase().includes(busqueda) ||
                sale.cliente_clte.toLowerCase().includes(busqueda) ||
                sale.fecha_ne.includes(busqueda) ||
                sale.fecha_vnt.toLowerCase().includes(busqueda) ||
                sale.orden_ne.toLowerCase().includes(busqueda) ||
                sale.encargado.toLowerCase().includes(busqueda) ||
                sale.ciudad_vnt.toLowerCase().includes(busqueda) ||
                sale.tipo_pago_vnt.toLowerCase().includes(busqueda) ||
                String(sale.factura_vnt).toLowerCase().includes(busqueda)
            );
        } else {
            return String(sale[valor]).toLowerCase().includes(busqueda);
        }
    });
    selectchangeYear()
}
//-----Seleccionar el Año
const selectDateVnt = document.getElementById('selectDateVnt');
selectDateVnt.addEventListener('change', searchSales);
const stateFactured = document.getElementById('stateFactured');
stateFactured.addEventListener('click', searchSales);
const selectMonthVnt = document.getElementById('selectMonthVnt');
selectMonthVnt.addEventListener('change', searchSales);
function selectYearVnt() {
    const anios = Array.from(new Set(sales.map(sale => sale.fecha_vnt.split('-')[0])));
    selectDateVnt.innerHTML = '';
    let optionFirst = document.createElement('option');
    optionFirst.value = 'todas';
    optionFirst.innerText = 'Todos los años';
    selectDateVnt.appendChild(optionFirst);
    for (let i = 0; i < anios.length; i++) {
        let option = document.createElement('option');
        option.value = anios[i];
        option.innerText = anios[i];
        selectDateVnt.appendChild(option);
    }

    selectDateVntProd.innerHTML = '';
    optionFirst = document.createElement('option');
    optionFirst.value = 'todas';
    optionFirst.innerText = 'Todos los años';
    selectDateVntProd.appendChild(optionFirst);
    for (let i = 0; i < anios.length; i++) {
        let option = document.createElement('option');
        option.value = anios[i];
        option.innerText = anios[i];
        selectDateVntProd.appendChild(option);
    }
}
function selectchangeYear() {
    filterSales = filterSales.filter(buy => {
        const estado = stateFactured.value === 'todas' ? true : buy.estado_factura_vnt === stateFactured.value;
        const fecha = selectDateVnt.value === 'todas' ? true : buy.fecha_vnt.split('-')[0] === selectDateVnt.value;
        const mes = selectMonthVnt.value === 'todas' ? true : buy.fecha_vnt.split('-')[1] === selectMonthVnt.value;
        return estado && fecha && mes;
    });
    paginationSales(filterSales.length, 1);
}
//------Ordenar tabla descendente ascendente
let orderSales = document.querySelectorAll('.tbody__head--venta');
orderSales.forEach(div => {
    div.children[0].addEventListener('click', function () {
        filterSales.sort((a, b) => {
            let first = a[div.children[0].name];
            let second = b[div.children[0].name];
            if (typeof first === 'number' && typeof second === 'number') {
                return first - second;
            } else {
                return first.toLowerCase().localeCompare(second.toLowerCase());
            }

        })
        paginationSales(filterSales.length, 1);
    });
    div.children[1].addEventListener('click', function () {
        filterSales.sort((a, b) => {

            let first = a[div.children[0].name];
            let second = b[div.children[0].name];
            if (typeof first === 'number' && typeof second === 'number') {
                return second - first;
            } else {
                return second.toLowerCase().localeCompare(first.toLowerCase());
            }

        })
        paginationSales(filterSales.length, 1);
    });
})
//------PaginationSales
function paginationSales(allVentas, page) {
    let numberVentas = Number(selectNumberVnt.value);
    let allPages = Math.ceil(allVentas / numberVentas);
    let ul = document.querySelector('#wrapperVenta ul');
    let li = '';
    let beforePages = page - 1;
    let afterPages = page + 1;
    let liActive;
    if (page > 1) {
        li += `<li class="btn" onclick="paginationSales(${allVentas}, ${page - 1})"><img src="../imagenes/arowLeft.svg"></li>`;
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
        li += `<li class="numb ${liActive}" onclick="paginationSales(${allVentas}, ${pageLength})"><span>${pageLength}</span></li>`;
    }
    if (page < allPages) {
        li += `<li class="btn" onclick="paginationSales(${allVentas}, ${page + 1})"><img src="../imagenes/arowRight.svg"></li>`;
    }
    ul.innerHTML = li;
    let h2 = document.querySelector('#showPageVenta h2');
    h2.innerHTML = `Pagina ${page}/${allPages}, ${allVentas} Ventas`;
    tableSales(page);
}
//------Crear la tabla
function tableSales(page) {
    const totalVentas = document.getElementById('totalVentas');
    let total = 0;
    for (let venta in filterSales) {
        total += Number(filterSales[venta]['total_prof']);
    }
    totalVentas.innerHTML = `Total: ${total.toFixed(2)} Bs`;
    let tbody = document.getElementById('tbodyVenta');
    let pageItems = filterSales.slice((page - 1) * Number(selectNumberVnt.value), page * Number(selectNumberVnt.value));
    tbody.innerHTML = '';
    for (let i = 0; i < pageItems.length; i++) {
        let sale = pageItems[i];
        let tr = document.createElement('tr');
        for (const propiedad in sale) {
            let td = document.createElement('td');
            if (propiedad === 'id_vnt') {
                td.innerText = i + 1;
                tr.appendChild(td);
            } else if (propiedad === 'nombre_emp') {
                if (sale[propiedad] === 'Ninguna') {
                    td.innerText = sale['cliente_clte'];
                    tr.appendChild(td);
                } else {
                    td.innerText = sale[propiedad];
                    tr.appendChild(td);
                }
            } else if (propiedad === 'total_prof') {
                td.innerText = Number(sale[propiedad]).toFixed(2) + ' Bs';
                tr.appendChild(td);
            } else if (propiedad === 'apellido_usua' || propiedad === 'cliente_clte' || propiedad === 'estado_factura_vnt') {
            } else {
                td.innerText = sale[propiedad];
                tr.appendChild(td);
            }
        }
        tbody.appendChild(tr);
    }
}
/***********************************************PRODUCT FILTER VNT_PRODS*********************************************/
//--------read vnt_prods
let vnt_prods = [];
let filterVnt_prods = [];
function readvnt_prods() {
    new Promise((resolve, reject) => {
        let formData = new FormData();
        formData.append('readVnt_prods', '');
        fetch('../controladores/ventas.php', {
            method: "POST",
            body: formData
        }).then(response => response.json()).then(data => {
            vnt_prods = Object.values(data);
            filterVnt_prods = vnt_prods;
            paginacionProdVnt(vnt_prods.length, 1);
            resolve();
        }).catch(err => console.log(err));
    });
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
    paginacionProdVnt(filterVnt_prods.length, 1);
});
//------buscar por:
function searchProdVnt() {
    const valor = selectSearchProdVnt.value;
    const busqueda = inputSearchProdVnt.value.toLowerCase().trim();
    filterVnt_prods = vnt_prods.filter(proforma => {
        if (valor === 'todas') {
            return (
                proforma.numero_prof.toString().toLowerCase().includes(busqueda) ||
                (proforma.nombre_usua + ' ' + proforma.apellido_usua).toLowerCase().includes(busqueda) ||
                (proforma.apellido_clte + ' ' + proforma.nombre_clte).toLowerCase().includes(busqueda) ||
                proforma.nombre_emp.toLowerCase().includes(busqueda) ||
                proforma.nombre_mrc.toLowerCase().includes(busqueda) ||
                proforma.nombre_ctgr.toLowerCase().includes(busqueda) ||
                proforma.codigo_vtpd.toLowerCase().includes(busqueda) ||
                proforma.nombre_prod.toLowerCase().includes(busqueda) ||
                proforma.factura_vnt.toLowerCase().includes(busqueda) ||
                proforma.cantidad_vtpd.toString().toLowerCase().includes(busqueda) ||
                proforma.cost_uni_vtpd.toString().toLowerCase().includes(busqueda) ||
                proforma.descuento_prof.toString().toLowerCase().includes(busqueda) ||
                proforma.fecha_ne.toLowerCase().includes(busqueda) ||
                proforma.fecha_vnt.toLowerCase().includes(busqueda)
            );
        } else if (valor === 'encargado') {
            return (proforma.nombre_usua + ' ' + proforma.apellido_usua).toLowerCase().includes(busqueda);
        } else if (valor === 'cliente') {
            return (proforma.apellido_clte + ' ' + proforma.nombre_clte).toLowerCase().includes(busqueda);
        } else {
            return proforma[valor].toString().toLowerCase().includes(busqueda);
        }
    });
    selectchangeYearProd();
}
//------select
const selectDateVntProd = document.getElementById('selectDateVntProd');
selectDateVntProd.addEventListener('change', searchProdVnt);
const stateFacturedProd = document.getElementById('stateFacturedProd');
stateFacturedProd.addEventListener('click', searchProdVnt);
const selectMonthVnPd = document.getElementById('selectMonthVnPd');
selectMonthVnPd.addEventListener('change', searchProdVnt);

function selectchangeYearProd() {
    filterVnt_prods = filterVnt_prods.filter(buy => {
        const estado = stateFacturedProd.value === 'todas' ? true : buy.estado_factura_vnt === stateFacturedProd.value;
        const fecha = selectDateVntProd.value === 'todas' ? true : buy.fecha_vnt.split('-')[0] === selectDateVntProd.value;
        const mes = selectMonthVnPd.value === 'todas' ? true : buy.fecha_vnt.split('-')[1] === selectMonthVnPd.value;
        return estado && fecha && mes;
    });
    paginacionProdVnt(filterVnt_prods.length, 1);
}
//------Ordenar tabla descendente ascendente
let orderProforma = document.querySelectorAll('.tbody__head--proforma');
orderProforma.forEach(div => {
    div.children[0].addEventListener('click', function () {
        filterVnt_prods.sort((a, b) => {
            let first = a[1][div.children[0].name];
            let second = b[1][div.children[0].name];
            if (typeof first === 'number' && typeof second === 'number') {
                return first - second;
            } else {
                return String(first).localeCompare(String(second));
            }
        });
        paginacionProdVnt(filterVnt_prods.length, 1);
    });
    div.children[1].addEventListener('click', function () {
        filterVnt_prods.sort((a, b) => {
            let first = a[1][div.children[0].name];
            let second = b[1][div.children[0].name];
            if (typeof first === 'number' && typeof second === 'number') {
                return second - first;
            } else {
                return String(second).localeCompare(String(first));
            }
        });
        paginacionProdVnt(filterVnt_prods.length, 1);
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
                } else if (valor == 'apellido_usua' || valor == 'apellido_clte' || valor == 'fk_id_prod_vtpd' || valor == 'imagen_prod' || valor == 'estado_ne' || valor == 'codigo_smc_prod' || valor == 'cost_uni_inv' || valor == 'estado_factura_vnt') {
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
const excelProdVnt = document.getElementById('excelProdVnt');
excelProdVnt.addEventListener('click', () => {
    console.log(filterVnt_prods)
    const reporte = filterVnt_prods.map((obj, index) => ({
        'Item': index + 1,
        'Factura': obj.factura_vnt,
        'Nombre cliente': obj.nombre_emp === 'Ninguna' ? obj.nombre_clte + ' ' + obj.apellido_clte : obj.nombre_emp,
        'Codigo producto': obj.codigo_smc_prod,
        'Codigo Japón': obj.codigo_vtpd,
        'Descripcion del producto': obj.nombre_prod,
        'Cantidad': obj.cantidad_vtpd,
        'Precio venta sin IVA': obj.cost_uni_vtpd * obj.cantidad_vtpd * (1- obj.descuento_prof/100)  * 0.87,
        'Total a precio venta': obj.cost_uni_vtpd * obj.cantidad_vtpd * (1- obj.descuento_prof/100),
        'Fecha venta': obj.fecha_vnt.toString().split(' ')[0],
        'Precio Lista': obj.cost_uni_inv,
        'Total a precio de lista': obj.cost_uni_inv * obj.cantidad_vtpd
    }));
    downloadAsExcel(reporte);
});
//*******************************************BEST SELLER PRODUCT**************************************************/
//----------------------------------------------TABLE MODAL MOST VENDIDOS----------------------------------------->
//-----------------------------------------------OPEN AND CLOSE MODAL---------------------------------------- -
//--------------------------------------------fechas
const formDates = document.getElementById('formDates');
const startingDateInput = document.getElementById('startingDate');
const endDateInput = document.getElementById('endDate');
let filteredProducts = [];
formDates.addEventListener('submit', (e) => {
    e.preventDefault();
    const startingDate = startingDateInput.value;
    const endDate = endDateInput.value;
    if (!startingDate || !endDate) {
        alert('Por favor, ingrese ambas fechas');
        return;
    }
    const startingDateObj = new Date(startingDate);
    const endDateObj = new Date(endDate);
    if (isNaN(startingDateObj.getTime()) || isNaN(endDateObj.getTime())) {
        alert('Por favor, ingrese fechas válidas');
        return;
    }
    if (startingDateObj > endDateObj) {
        alert('La fecha inicial no puede ser posterior a la fecha final');
        return;
    }
    filteredProducts = Object.values(vnt_prods).filter((product) => {
        const fecha_vnt = new Date(product.fecha_vnt);
        const startingDateObj = new Date(startingDate);
        const endDateObj = new Date(endDate);

        return fecha_vnt >= startingDateObj && fecha_vnt <= endDateObj;
    });
    filterMostVnt();
});
const tableMostProd = document.getElementById('tableMostProd');
const closeTableMostProd = document.getElementById('closeTableMostProd');
function openTableMostProd() {
    tableMostProd.classList.add('modal__show');
}
closeTableMostProd.addEventListener('click', () => {
    tableMostProd.classList.remove('modal__show');
})
let productsSold = [];
function filterMostVnt() {
    let numberMoths = document.getElementById('numberMoths').value;
    let daysLate = document.getElementById('daysLate').value;
    let mothsReplacement = document.getElementById('mothsReplacement').value;


    const productosVendidos = Object.values(filteredProducts).reduce((acc, producto) => {
        const nombreProducto = producto.codigo_vtpd;
        if (acc[nombreProducto]) {
            acc[nombreProducto].cantidad_vtpd += producto.cantidad_vtpd;
            acc[nombreProducto].costoTotal += producto.cantidad_vtpd * producto.cost_uni_vtpd;
        } else {
            acc[nombreProducto] = {
                codigo_vtpd: nombreProducto,
                cantidad_vtpd: producto.cantidad_vtpd,
                costoTotal: producto.cantidad_vtpd * producto.cost_uni_vtpd
            };
        }
        return acc;
    }, []);
    productsSold = Object.values(productosVendidos).sort((a, b) => b.cantidad_vtpd - a.cantidad_vtpd);
    productsSold.forEach(product => {
        const encontrado = inventories.find(inventario => inventario.codigo_prod === product.codigo_vtpd);
        product.cantidad_inv = encontrado.cantidad_inv;
        const consumoMensual = product.cantidad_vtpd / numberMoths;
        const reponer = Math.ceil(consumoMensual * mothsReplacement + (consumoMensual / 30) * daysLate - encontrado.cantidad_inv);
        product.reponer = reponer;
    });
    paginacionMostProd(productsSold.length, 1);
}
//------Proformas por pagina
const selectNumberMostProd = document.getElementById('selectNumberMostProd');
selectNumberMostProd.selectedIndex = 4;
selectNumberMostProd.addEventListener('change', function () {
    paginacionMostProd(productsSold.length, 1);
});
//------Ordenar tabla descendente ascendente
let orderMostProd = document.querySelectorAll('.tbody__head--MP');
orderMostProd.forEach(div => {
    div.children[0].addEventListener('click', function () {
        let valor = div.children[0].name;
        if (valor == 'codigo_vtpd') {
            productsSold.sort((a, b) => a[valor].localeCompare(b[valor]));
        } else if (valor == 'cantidad_vtpd' || valor == 'costoTotal' || valor == 'reponer') {
            productsSold.sort((a, b) => a[valor] - b[valor]);
        }
        paginacionMostProd(productsSold.length, 1);
    });
    div.children[1].addEventListener('click', function () {
        let valor = div.children[0].name;
        if (valor == 'codigo_vtpd') {
            productsSold.sort((a, b) => b[valor].localeCompare(a[valor]));
        } else if (valor == 'cantidad_vtpd' || valor == 'costoTotal' || valor == 'reponer') {
            productsSold.sort((a, b) => b[valor] - a[valor]);
        }
        paginacionMostProd(productsSold.length, 1);
    });
});
//------PaginacionProdVnt
function paginacionMostProd(allProducts, page) {
    //let totalProdVnt = document.getElementById('tbodyMostProd');
    //let total = 0;
    /*for (let vnt_prods in productsSold) {
        total += productsSold[vnt_prods]['cantidad_vtpd'] * productsSold[vnt_prods]['cost_uni_vtpd'] * (100 - productsSold[vnt_prods]['descuento_prof']) / 100;
    }*/
    //totalProdVnt.innerHTML = total.toFixed(2) + ' Bs';
    let numberProducts = Number(selectNumberMostProd.value);
    let allPages = Math.ceil(allProducts / numberProducts);
    let ul = document.querySelector('#wrapperMostProd ul');
    let li = '';
    let beforePages = page - 1;
    let afterPages = page + 1;
    let liActive;
    if (page > 1) {
        li += `<li class="btn" onclick="paginacionMostProd(${allProducts}, ${page - 1})"><img src="../imagenes/arowLeft.svg"></li>`;
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
        li += `<li class="numb ${liActive}" onclick="paginacionMostProd(${allProducts}, ${pageLength})"><span>${pageLength}</span></li>`;
    }
    if (page < allPages) {
        li += `<li class="btn" onclick="paginacionMostProd(${allProducts}, ${page + 1})"><img src="../imagenes/arowRight.svg"></li>`;
    }
    ul.innerHTML = li;
    let h2 = document.querySelector('#showPageMostProd h2');
    h2.innerHTML = `Pagina ${page}/${allPages}, ${allProducts} Productos`;
    tableMostVnt(page);
}
//--------Tabla de vnt_prods
function tableMostVnt(page) {
    let tbody = document.getElementById('tbodyMostProd');
    inicio = (page - 1) * Number(selectNumberMostProd.value);
    final = inicio + Number(selectNumberMostProd.value);
    i = 1;
    tbody.innerHTML = '';
    for (let proforma in productsSold) {
        if (i > inicio && i <= final) {
            let tr = document.createElement('tr');
            for (let valor in productsSold[proforma]) {
                if (valor == 'codigo_vtpd') {
                    let td = document.createElement('td');
                    td.innerText = i;
                    tr.appendChild(td);
                    i++;
                    let td2 = document.createElement('td');
                    td2.innerText = productsSold[proforma][valor];
                    tr.appendChild(td2);
                } else if (valor == 'costoTotal') {
                    let td = document.createElement('td');
                    td.innerText = productsSold[proforma][valor].toFixed(2) + ' Bs';
                    tr.appendChild(td);
                } else {
                    let td = document.createElement('td');
                    td.innerText = productsSold[proforma][valor];
                    tr.appendChild(td);
                }
            }
            tbody.appendChild(tr);
        } else {
            i++;
        }
    }
}
let inventories = [];
let filterInventories = [];
readInventories();
function readInventories() {
    let formData = new FormData();
    formData.append('readInventories', '');
    fetch('../controladores/inventario.php', {
        method: "POST",
        body: formData
    }).then(response => response.json()).then(data => {
        inventories = Object.values(data);
        filterInventories = inventories;
    }).catch(err => console.log(err));
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
/*******************************************importa en excel**************************************************/
const excelProdReponer = document.getElementById('excelProdReponer');
excelProdReponer.addEventListener('click', () => {
    downloadAsExcel(productsSold);
});
//***************************reporte de ventas mestros*****************************************************/
const excelVnt = document.getElementById('excelVnt');
excelVnt.addEventListener('click', () => {
    const sortedSales = filterSales.sort((a, b) => {
        if (a.factura_vnt === 0 && b.factura_vnt !== 0) {
            return 1;
        } else if (a.factura_vnt !== 0 && b.factura_vnt === 0) {
            return -1;
        } else {
            return a.factura_vnt - b.factura_vnt;
        }
    });
    const nuevaVariable = sortedSales.map((sale) => ({
        ITEM: sale.factura_vnt,
        CLIENTE: sale.nombre_emp === 'Ninguna' ? sale.cliente_clte : sale.nombre_emp,
        FECHA: sale.fecha_vnt,
        OC: sale.orden_ne,
        MONTO: Number(sale.total_prof),
        VENTA: sale.encargado,
        CIUDAD: sale.ciudad_vnt,
        PAGO: sale.tipo_pago_vnt,
        OBSERVACIONES: sale.observacion_vnt
    }));
    // Crear un nuevo arrar que este el total vendido por un ecargado de todos los encargados
    const totalVendido = sortedSales.reduce((acc, sale) => {
        if (acc[sale.encargado]) {
            acc[sale.encargado] += Number(sale.total_prof);
        } else {
            acc[sale.encargado] = Number(sale.total_prof);
        }
        return acc;
    }, []);
    // Crear un nuevo array que este el total vendido por un encargado de todos los encargados
    const totalVendidoPorEncargado = Object.entries(totalVendido).map(([key, value]) => ({
        ENCARGADO: key,
        TOTAL: value
    }));
    //El array totalVendidoPorEncargado añadirlo al final del array nuevaVariable
    const reporte = [...nuevaVariable, ...totalVendidoPorEncargado];
    downloadAsExcel(reporte);
});