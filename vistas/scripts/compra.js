//--------------------------------------------Restricciones de usuario----------------------------------------------
if (localStorage.getItem('rol_usua') == 'Gerente general' || localStorage.getItem('rol_usua') == 'Administrador') {
} else if (localStorage.getItem('rol_usua') == 'Ingeniero' || localStorage.getItem('rol_usua') == 'Gerente De Inventario') {
    //marca y categoria create
    document.getElementsByName('codigo_prodM')[0].setAttribute('readonly', 'readonly');
}
//--------------------------------------------BLOCK REQUEST WITH A FLAG----------------------------------------------
let rqstBuy = false;
const preloader = document.getElementById('preloader');
init();
async function init() {
    if (rqstBuy == false) {
        preloader.classList.add('modal__show');
        rqstBuy = true;
        try {
            await Promise.all([
                readBuys(),
                readSuppliers(),
                readEnterprises(),
                readCmp_prods(),
                readProducts(),
                readAllMarcas(),
                readAllCategorias(),
                readInventories(),
                readPrices(),
                readUsers()
            ]);
            paginacionProductMW(products.length, 1);
            paginacionEnterpriseMW(enterprises.length, 1);
            fillSelectEmp(selectEnterpriseR, selectSupplierR);
            paginacionBuy(filterBuys.length, 1);
            paginacionProdOC(cmp_prods.length, 1);
            createSelectDateBuy();
            preloader.classList.remove('modal__show');
            rqstBuy = false;
        } catch (error) {
            console.log(error);
            mostrarAlerta('Error al cargar los datos: ' + error.message);
        }
    }
}
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
//<<---------------------------------------------------TABLA DE COMPRA------------------------------------------>>
let buys = [];
let filterBuys = [];
let formBuy;
async function readBuys() {
    return new Promise((resolve, reject) => {
        let formData = new FormData();
        formData.append('readBuys', '');
        fetch('../controladores/compras.php', {
            method: "POST",
            body: formData
        }).then(response => response.json()).then(data => {
            buys = data;
            filterBuys = buys;
            resolve();
        }).catch(err => console.log(err));
    })
}
//------Select utilizado para buscar por columnas
const selectSearchBuy = document.getElementById('selectSearchBuy');
selectSearchBuy.addEventListener('change', searchBuys);
//------buscar por input
const inputSerchBuy = document.getElementById("inputSerchBuy");
inputSerchBuy.addEventListener("keyup", searchBuys);
//------Compras por pagina
const selectNumberBuy = document.getElementById('selectNumberBuy');
selectNumberBuy.selectedIndex = 3;
selectNumberBuy.addEventListener('change', function () {
    paginacionBuy(filterBuys.length, 1);
});
//-------Estado de compra
const selectStateBuy = document.getElementById('selectStateBuy');
selectStateBuy.addEventListener('change', searchBuys);
//------buscar por:
function searchBuys() {
    const busqueda = inputSerchBuy.value.toLowerCase().trim();
    const valor = selectSearchBuy.value.toLowerCase().trim();
    filterBuys = buys.filter(buy => {
        const usuario = users.find(user => user.id_usua === buy.fk_id_usua_cmp);
        const proveedor = suppliers.find(supplier => supplier.id_prov === buy.fk_id_prov_cmp);
        const empresa = enterprises.find(enterprise => enterprise.id_empp === proveedor.fk_id_empp_prov);
        if (valor == 'todas') {
            return (
                buy.numero_cmp.toLowerCase().includes(busqueda) ||
                (usuario.nombre_usua + ' ' + usuario.apellido_usua).toLowerCase().includes(busqueda) ||
                (proveedor.nombre_prov + ' ' + proveedor.apellido_prov).toLowerCase().includes(busqueda) ||
                buy.fecha_cmp.toLowerCase().includes(busqueda) ||
                empresa.nombre_empp.toLowerCase().includes(busqueda) ||
                buy.total_cmp.toString().includes(busqueda)
            )
        } if (valor === 'total_cmp') {
            return buy[valor].toString().includes(busqueda);
        } else if (valor === 'nombre_usua') {
            return (buy[valor] + ' ' + buy.apellido_usua).toLowerCase().includes(busqueda);
        } else {
            return buy[valor].toLowerCase().includes(busqueda);
        }
    });
    selectStateBuys();
}
function createSelectDateBuy() {
    const anios = Array.from(new Set(buys.map(buy => buy.fecha_cmp.split('-')[0])));
    selectDateBuy.innerHTML = '';
    const optionFirst = document.createElement('option');
    optionFirst.value = 'todas';
    optionFirst.innerText = 'Todos los años';
    selectDateBuy.appendChild(optionFirst);
    for (let anio of anios) {
        const option = document.createElement('option');
        option.value = anio;
        option.textContent = anio;
        selectDateBuy.appendChild(option);
    }

    selectDateProdOC.innerHTML = '';
    const optionSecond = document.createElement('option');
    optionSecond.value = 'todas';
    optionSecond.innerText = 'Todos los años';
    selectDateProdOC.appendChild(optionSecond);
    for (let anio of anios) {
        const option = document.createElement('option');
        option.value = anio;
        option.textContent = anio;
        selectDateProdOC.appendChild(option);
    }
}
//------Seleccionar el año
const selectDateBuy = document.getElementById('selectDateBuy');
selectDateBuy.addEventListener('change', searchBuys);
//------mes
const selectMonthBuy = document.getElementById('selectMonthBuy');
selectMonthBuy.addEventListener('change', searchBuys);
//estado de la compra
function selectStateBuys() {
    filterBuys = filterBuys.filter(buy => {
        const estado = selectStateBuy.value === 'todasLasCompras' ? true : buy.estado_cmp == selectStateBuy.value;
        const fecha = selectDateBuy.value === 'todas' ? true : buy.fecha_cmp.split('-')[0] === selectDateBuy.value;
        const mes = selectMonthBuy.value === 'todas' ? true : buy.fecha_cmp.split('-')[1] === selectMonthBuy.value;
        return estado && fecha && mes;
    });
    paginacionBuy(filterBuys.length, 1);
}
//------Ordenar tabla descendente ascendente
const orderBuys = document.querySelectorAll('.tbody__head--buy');
orderBuys.forEach(div => {
    div.children[0].addEventListener('click', function () {
        filterBuys.sort((a, b) => {
            let first = a[div.children[0].name];
            let second = b[div.children[0].name];
            if (typeof first === 'number' && typeof second === 'number') {
                return first - second;
            } else {
                return String(first).localeCompare(String(second));
            }
        });
        paginacionBuy(filterBuys.length, 1);
    });
    div.children[1].addEventListener('click', function () {
        filterBuys.sort((a, b) => {
            let first = a[div.children[0].name];
            let second = b[div.children[0].name];
            if (typeof first === 'number' && typeof second === 'number') {
                return second - first;
            } else {
                return String(second).localeCompare(String(first));
            }
        });
        paginacionBuy(filterBuys.length, 1);
    });
});
//------PaginacionBuy
function paginacionBuy(allBuys, page) {
    let numberCustomers = Number(selectNumberBuy.value);
    let allPages = Math.ceil(allBuys / numberCustomers);
    let ul = document.querySelector('#wrapperBuy ul');
    let li = '';
    let beforePages = page - 1;
    let afterPages = page + 1;
    let liActive;
    if (page > 1) {
        li += `<li class="btn" onclick="paginacionBuy(${allBuys}, ${page - 1})"><img src="../imagenes/arowLeft.svg"></li>`;
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
        li += `<li class="numb ${liActive}" onclick="paginacionBuy(${allBuys}, ${pageLength})"><span>${pageLength}</span></li>`;
    }
    if (page < allPages) {
        li += `<li class="btn" onclick="paginacionBuy(${allBuys}, ${page + 1})"><img src="../imagenes/arowRight.svg"></li>`;
    }
    ul.innerHTML = li;
    let h2 = document.querySelector('#showPageBuy h2');
    h2.innerHTML = `Pagina ${page}/${allPages}, ${allBuys} ordenes de  compras`;
    tableBuys(page);
}
//------Crear la tabla
function tableBuys(page) {
    const totalBuy = document.getElementById('totalBuy');
    const total = filterBuys.reduce((acc, buy) => acc + Number(buy.total_cmp), 0);
    totalBuy.innerText = `Total (Bs): ${total.toFixed(2)} Bs`;

    const tbody = document.getElementById('tbodyBuy');
    const inicio = (page - 1) * Number(selectNumberBuy.value);
    const final = inicio + Number(selectNumberBuy.value);
    const compras = filterBuys.slice(inicio, final);
    tbody.innerHTML = '';
    compras.forEach((buy, index) => {
        const proveedor = suppliers.find(supplier => supplier.id_prov === buy.fk_id_prov_cmp);
        const usuario = users.find(user => user.id_usua === buy.fk_id_usua_cmp);
        const empresa = enterprises.find(enterprise => enterprise.id_empp === proveedor.fk_id_empp_prov);

        const tr = document.createElement('tr');
        tr.setAttribute('id_cmp', buy.id_cmp);

        const tdIndex = document.createElement('td');
        tdIndex.innerText = inicio + index + 1;
        tr.appendChild(tdIndex);

        const tdNumeroOC = document.createElement('td');
        tdNumeroOC.innerText = `OC-SMS${buy.fecha_cmp.slice(2, 4)}-${buy.numero_cmp}`;
        tr.appendChild(tdNumeroOC);

        const tdFecha = document.createElement('td');
        tdFecha.innerText = buy.fecha_cmp.slice(0, 10);
        tr.appendChild(tdFecha);

        const tdUsuario = document.createElement('td');
        tdUsuario.innerText = `${usuario.nombre_usua} ${usuario.apellido_usua}`;
        tr.appendChild(tdUsuario);

        const tdEmpresa = document.createElement('td');
        tdEmpresa.innerText = empresa.nombre_empp;
        tr.appendChild(tdEmpresa);

        const tdProveedor = document.createElement('td');
        tdProveedor.innerText = proveedor.apellido_prov;
        tr.appendChild(tdProveedor);

        const tdTotal = document.createElement('td');
        tdTotal.innerText = `${buy.total_cmp.toFixed(2)} ${buy.moneda_cmp}`;
        tr.appendChild(tdTotal);

        const tdFormaPago = document.createElement('td');
        tdFormaPago.innerText = buy.forma_pago_cmp;
        tr.appendChild(tdFormaPago);

        const tdTiempoEntrega = document.createElement('td');
        tdTiempoEntrega.innerText = buy.tpo_entrega_cmp;
        tr.appendChild(tdTiempoEntrega);

        const tdObservacion = document.createElement('td');
        tdObservacion.innerText = buy.observacion_cmp;
        tr.appendChild(tdObservacion);

        let tdAcciones = document.createElement('td');
        if (buy.estado_cmp === 0) {
            if (localStorage.getItem('rol_usua') == 'Gerente general' || localStorage.getItem('rol_usua') == 'Administrador') {
                tdAcciones.innerHTML = `
                <img src='../imagenes/receipt.svg' onclick='readCmpProd(${buy.id_cmp})' title='Añadir compra a inventario'>
                <img src='../imagenes/pdf.svg' onclick='selectPDFInformation(${buy.id_cmp})' title='Imprimir orden de compra'>
                <img src='../imagenes/trash.svg' onclick='deleteBuy(${buy.id_cmp})' title='Eliminar compra'>`;
            } else {
                tdAcciones.innerHTML = `
                <img src='../imagenes/receipt.svg' onclick='readCmpProd(${buy.id_cmp})' title='Añadir compra a inventario'>
                <img src='../imagenes/pdf.svg' onclick='selectPDFInformation(${buy.id_cmp})' title='Imprimir orden de compra'>`;
            }
        } else {
            tdAcciones.innerHTML = `
                <img src='../imagenes/pdf.svg' onclick='selectPDFInformation(${buy.id_cmp})' title='Imprimir orden de compra'>`;
        }

        tr.appendChild(tdAcciones);

        tbody.appendChild(tr);
    });
}
//<<-------------------------------------------CRUD DE COMPRAS-------------------------------------------->>
//-------Create buy
const formBuyR = document.getElementById('formBuyR');
const buyRMW = document.getElementById('buyRMW');
async function createBuy() {
    if (rqstBuy === false) {
        rqstBuy = true;
        preloader.classList.add('modal__show');
        buyRMW.classList.remove('modal__show');
        cmp_prodRMW.classList.remove('modal__show');

        const productos = [];
        for (let producto of cmp_prodRMW.querySelectorAll('div.cart__item')) {
            productos.push({
                fk_id_prod_cppd: producto.getAttribute('id_prod'),
                descripcion_cppd: producto.querySelector('.cart__item--name').innerText,
                cantidad_cppd: producto.querySelector('.cart__item--quantity').value,
                cost_uni_cppd: producto.querySelector('.cart__item--costUnit').value,
                observacion_cppd: producto.querySelector('.cart__item--observacion').value,
            });
        }
        let formData = new FormData(formBuyR);
        const total = Number(totalCPRMW.innerHTML.split(' ')[2]);
        formData.set('total_cmpR', total);
        formData.append('createBuy', JSON.stringify(productos));
        formData.append('id_usua', localStorage.getItem('id_usua'));
        formData.set('fecha_cmpR', `${dateActual[2]}-${dateActual[1]}-${dateActual[0]}`);
        fetch('../controladores/compras.php', {
            method: "POST",
            body: formData
        }).then(response => response.text()).then(data => {
            Promise.all([readBuys(), readCmp_prods()]).then(() => {
                paginacionBuy(filterBuys.length, 1);
                paginacionProdOC(filterCmp_prods.length, 1);
                preloader.classList.remove('modal__show');
                rqstBuy = false;
                formBuyR.reset();
                cmpProdRMW.innerHTML = '';
                totalPriceR();
                mostrarAlerta(data);
            });
        }).catch(err => {
            rqstBuy = false;
            mostrarAlerta(err);
        });
    } else {
        mostrarAlerta('No se puede realizar la compra en este momento');
    }
}
//------Delete buy
function deleteBuy(id_cmp) {
    if (confirm('¿Esta usted seguro?')) {
        if (rqstBuy == false) {
            rqstBuy = true;
            preloader.classList.add('modal__show');
            let formData = new FormData();
            formData.append('deleteBuy', id_cmp);
            fetch('../controladores/compras.php', {
                method: "POST",
                body: formData
            }).then(response => response.text()).then(data => {
                Promise.all([readBuys(), readCmp_prods()]).then(() => {
                    paginacionBuy(filterBuys.length, 1);
                    paginacionProdOC(filterCmp_prods.length, 1);
                    preloader.classList.remove('modal__show');
                    rqstBuy = false;
                    mostrarAlerta(data);
                })
            }).catch(err => {
                rqstBuy = false;
                mostrarAlerta(err);
            });
        }
    }
}
//------Estado de compra
/*
async function changeStateBuy(divs) {
    const divshihijos = divs.children;
    const cantidadDivsHijos = Array.prototype.filter.call(divshihijos, hijo => hijo.tagName === 'DIV').length;
    if (cantidadDivsHijos > 0) {
        id_cmp = divs.children[0].children[2].value;
        const product = cmp_prods.filter(cmp_prod => cmp_prod.fk_id_cmp_cppd == id_cmp);
        const productRecibidos = product.filter(obj => obj.estado_cppd === "RECIBIDO");
        if (product.length == productRecibidos.length) {
            if (rqstBuy == false) {
                rqstBuy = true;
                preloader.classList.add('modal__show');
                let formData = new FormData();
                formData.append('changeStateBuy', id_cmp);
                fetch('../controladores/compras.php', {
                    method: "POST",
                    body: formData
                }).then(response => response.text()).then(data => {
                    readBuys().then(() => {
                        preloader.classList.remove('modal__show');
                        rqstBuy = false;
                        document.getElementById('productBuyMW').classList.remove('modal__show');
                        mostrarAlerta(data);
                    })
                }).catch(err => {
                    rqstBuy = false;
                    mostrarAlerta(err);
                });
            }
        } else {
            mostrarAlerta('Falta registrar productos');
        }
    } else {
        mostrarAlerta('La nota de entrega no tiene ningun producto');
    }
}*/
//------Open and close buyR
const closeBuyRMW = document.getElementById('closeBuyRMW');
const openBuyRMW = document.getElementById('openBuyRMW');
openBuyRMW.addEventListener('click', () => {
    formBuy = 'R';
    buyRMW.classList.add('modal__show');
    document.getElementsByName('fecha_cmpR')[0].value = `${dateActual[2]}-${dateActual[1]}-${dateActual[0]}`;
});
closeBuyRMW.addEventListener('click', () => {
    buyRMW.classList.remove('modal__show');
});
//------------------------------------------CRUD CMP-PROD--------------------------------------------------
//--------read Cmp_prods
let cmp_prods = [];
let filterCmp_prods = [];
async function readCmp_prods() {
    return new Promise((resolve, reject) => {
        let formData = new FormData();
        formData.append('readCmp_prods', '');
        fetch('../controladores/compras.php', {
            method: "POST",
            body: formData
        }).then(response => response.json()).then(data => {
            cmp_prods = data;
            filterCmp_prods = cmp_prods;
            resolve();
        }).catch(err => console.log(err));
    })
}
//------------------------------------------------------TABLE PRODUCT FILTER-----------------------------------------------------
//------Select utilizado para buscar por columnas
const selectSearchProdOC = document.getElementById('selectSearchProdOC');
selectSearchProdOC.addEventListener('change', searchProdOC);
//------buscar por input
const inputSearchProdOC = document.getElementById("inputSearchProdOC");
inputSearchProdOC.addEventListener("keyup", searchProdOC);
//------Proformas por pagina
const selectNumberProdOC = document.getElementById('selectNumberProdOC');
selectNumberProdOC.selectedIndex = 3;
selectNumberProdOC.addEventListener('change', function () {
    paginacionProdOC(filterCmp_prods.length, 1);
});
//------buscar por:
function searchProdOC() {
    const busqueda = inputSearchProdOC.value.toLowerCase().trim();
    const valor = selectSearchProdOC.value.toLowerCase().trim();
    filterCmp_prods = cmp_prods.filter(cmp_prod => {
        const compra = buys.find(buy => buy.id_cmp === cmp_prod.fk_id_cmp_cppd);
        const producto = products.find(product => product.id_prod === cmp_prod.fk_id_prod_cppd);
        if (valor == 'todas') {
            return (
                compra.numero_cmp.toLowerCase().includes(busqueda) ||
                compra.fecha_cmp.toLowerCase().includes(busqueda) ||
                cmp_prod.fecha_factura_cppd.toLowerCase().includes(busqueda) ||
                cmp_prod.fecha_entrega_cppd.toLowerCase().includes(busqueda) ||
                producto.codigo_prod.toLowerCase().includes(busqueda) ||
                cmp_prod.factura_cppd.toString().toLowerCase().includes(busqueda) ||
                cmp_prod.observacion_cppd.toString().toLowerCase().includes(busqueda)
            )
        } else {
            if (valor === 'numero_cmp' || valor === 'fecha_cmp') {
                return compra[valor].toLowerCase().includes(busqueda);
            } else if (valor === 'codigo_prod') { 
                return producto[valor].toLowerCase().includes(busqueda);
            } else {
                if (valor === 'factura_cppd' || valor === 'observacion_cppd') {
                    return cmp_prod[valor].toString().toLowerCase().includes(busqueda);
                }else{
            return cmp_prod[valor].toLowerCase().includes(busqueda);
        }
            }
        }
    });
    selectStateProductOC();
}
//------Seleccionar el año
const selectDateProdOC = document.getElementById('selectDateProdOC');
selectDateProdOC.addEventListener('change', searchProdOC);
//-------Estado de cmp_prods
const selectStateProdOC = document.getElementById('selectStateProdOC');
selectStateProdOC.addEventListener('change', searchProdOC);
//------mes
const selectMonthProdOC = document.getElementById('selectMonthProdOC');
selectMonthProdOC.addEventListener('change', searchProdOC);
function selectStateProductOC() {
    filterCmp_prods = filterCmp_prods.filter(cmp_prod => {
        const ordenCompra = buys.find(buy => buy.id_cmp === cmp_prod.fk_id_cmp_cppd);
        const fecha = selectDateProdOC.value === 'todas' ? true : ordenCompra.fecha_cmp.split('-')[0] === selectDateProdOC.value;
        const mes = selectMonthProdOC.value === 'todas' ? true : ordenCompra.fecha_cmp.split('-')[1] === selectMonthProdOC.value;
        const estado = selectStateProdOC.value === 'todasLasOC' ? true : cmp_prod.estado_cppd == selectStateProdOC.value;
        return estado && fecha && mes;
    });
    paginacionProdOC(filterCmp_prods.length, 1);
}
//------Ordenar tabla descendente ascendente
const orderCmpProd = document.querySelectorAll('.tbody__head--cmpProd');
orderCmpProd.forEach(div => {
    div.children[0].addEventListener('click', function () {
        const valor = div.children[0].name;
        filterCmp_prods.sort((a, b) => {
            if (valor === 'numero_cmp' || valor === 'fecha_cmp') {
                const compraA = buys.find(buy => buy.id_cmp === a.fk_id_cmp_cppd);
                const compraB = buys.find(buy => buy.id_cmp === b.fk_id_cmp_cppd);
                const valorA = String(compraA[valor]);
                const valorB = String(compraB[valor]);
                return valorA.localeCompare(valorB);
            } else {
                const valorA = String(a[valor]);
                const valorB = String(b[valor]);
                return valorA.localeCompare(valorB);
            }

        });
        paginacionProdOC(filterCmp_prods.length, 1);
    });
    div.children[1].addEventListener('click', function () {
        const valor = div.children[0].name;
        filterCmp_prods.sort((a, b) => {
            if (valor === 'numero_cmp' || valor === 'fecha_cmp') {
                const compraA = buys.find(buy => buy.id_cmp === a.fk_id_cmp_cppd);
                const compraB = buys.find(buy => buy.id_cmp === b.fk_id_cmp_cppd);
                const valorA = String(compraA[valor]);
                const valorB = String(compraB[valor]);
                return valorB.localeCompare(valorA);
            } else {
                const valorA = String(a[valor]);
                const valorB = String(b[valor]);
                return valorB.localeCompare(valorA);
            }
        });
        paginacionProdOC(filterCmp_prods.length, 1);
    });
});
//------PaginacionProdOC
const totalProdOC = document.getElementById('totalProdOC');
function paginacionProdOC(allProducts, page) {
    let total = 0;
    filterCmp_prods.forEach(cmp_prod => {
        const compra = buys.find(buy => buy.id_cmp === cmp_prod.fk_id_cmp_cppd);
        total += cmp_prod.cantidad_cppd * cmp_prod.cost_uni_cppd * (100 - compra.descuento_cmp) / 100;
    })
    totalProdOC.innerHTML = `Total (Bs): ${total.toFixed(2)} Bs`;
    let numberProducts = Number(selectNumberProdOC.value);
    let allPages = Math.ceil(allProducts / numberProducts);
    let ul = document.querySelector('#wrapperProf ul');
    let li = '';
    let beforePages = page - 1;
    let afterPages = page + 1;
    let liActive;
    if (page > 1) {
        li += `<li class="btn" onclick="paginacionProdOC(${allProducts}, ${page - 1})"><img src="../imagenes/arowLeft.svg"></li>`;
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
        li += `<li class="numb ${liActive}" onclick="paginacionProdOC(${allProducts}, ${pageLength})"><span>${pageLength}</span></li>`;
    }
    if (page < allPages) {
        li += `<li class="btn" onclick="paginacionProdOC(${allProducts}, ${page + 1})"><img src="../imagenes/arowRight.svg"></li>`;
    }
    ul.innerHTML = li;
    let h2 = document.querySelector('#showPageProf h2');
    h2.innerHTML = `Pagina ${page}/${allPages}, ${allProducts} Productos`;
    tableCmpProds(page);
}
//--------Tabla de cmp_prods
function tableCmpProds(page) {
    const tbody = document.getElementById('tbodyProdOC');
    const inicio = (page - 1) * Number(selectNumberProdOC.value);
    const final = inicio + Number(selectNumberProdOC.value);
    const cmpProds = filterCmp_prods.slice(inicio, final);
    tbody.innerHTML = '';

    cmpProds.forEach((cmpProd, index) => {
        const compra = buys.find(buy => buy.id_cmp === cmpProd.fk_id_cmp_cppd);
        const producto = products.find(product => product.id_prod === cmpProd.fk_id_prod_cppd);

        const tr = document.createElement('tr');
        tr.setAttribute('id_cppd', cmpProd.id_cppd);

        const tdNumero = document.createElement('td');
        tdNumero.innerText = inicio + index + 1;
        tr.appendChild(tdNumero);

        const tdNumeroOC = document.createElement('td');
        tdNumeroOC.innerText = compra.numero_cmp;
        tr.appendChild(tdNumeroOC);

        const tdFechaOC = document.createElement('td');
        tdFechaOC.innerText = compra.fecha_cmp;
        tr.appendChild(tdFechaOC);

        const tdFechaFactura = document.createElement('td');
        tdFechaFactura.innerText = cmpProd.fecha_factura_cppd;
        tr.appendChild(tdFechaFactura);

        const tdFechaEntrega = document.createElement('td');
        tdFechaEntrega.innerText = cmpProd.fecha_entrega_cppd;
        tr.appendChild(tdFechaEntrega);

        const tdCodigo = document.createElement('td');
        tdCodigo.innerText = producto.codigo_prod;
        tr.appendChild(tdCodigo);

        const tdCantidad = document.createElement('td');
        tdCantidad.innerText = cmpProd.cantidad_cppd;
        tr.appendChild(tdCantidad);

        const tdCostoUnitario = document.createElement('td');
        tdCostoUnitario.innerText = `${cmpProd.cost_uni_cppd.toFixed(2)} Bs`;
        tr.appendChild(tdCostoUnitario);

        const tdSubTotal = document.createElement('td');
        const subTotal = cmpProd.cost_uni_cppd * cmpProd.cantidad_cppd;
        tdSubTotal.innerText = `${subTotal.toFixed(2)} Bs`;
        tr.appendChild(tdSubTotal);

        const tdDescuento = document.createElement('td');
        const desc = compra.descuento_cmp * cmpProd.cost_uni_cppd * cmpProd.cantidad_cppd / 100;
        tdDescuento.innerText = `-${desc.toFixed(2)} Bs (${compra.descuento_cmp}%)`;
        tr.appendChild(tdDescuento);

        const tdTotal = document.createElement('td');
        const total = cmpProd.cantidad_cppd * cmpProd.cost_uni_cppd * (100 - compra.descuento_cmp) / 100;
        tdTotal.innerText = `${total.toFixed(2)} Bs`;
        tr.appendChild(tdTotal);

        const tdFactura = document.createElement('td');
        const factura = cmpProd.factura_cppd;
        tdFactura.innerText = factura;
        tr.appendChild(tdFactura);

        const tdObservacion = document.createElement('td');
        tdObservacion.innerText = cmpProd.observacion_cppd;
        tr.appendChild(tdObservacion);

            tbody.appendChild(tr);
    });
}
//----------------------------------------CRUD CMP-PROD--------------------------------------------
//------read Cmp_prods by 
const titleCmp_prodMMW = document.querySelector('#titleCmp_prodMMW');
function readCmpProd(id_cmp) {
    const compra = buys.find(buy => buy.id_cmp === id_cmp);
    titleCmp_prodMMW.innerHTML = `${compra.numero_cmp}`;
    const productos = cmp_prods.filter(cmp_prod => cmp_prod.fk_id_cmp_cppd === id_cmp);
    cmp_prodMMW.classList.add('modal__show');
    cmpProdMMW.innerHTML = '';
    productos.forEach(producto => {
        const cart = cartCmp_prodM(producto, cmpProdMMW, totalPriceR);
        cmpProdMMW.appendChild(cart);
    });
    //Drang and drop
    const items = cmpProdMMW.querySelectorAll(".cart__item");
    items.forEach(item => {
        item.addEventListener("dragstart", () => {
            setTimeout(() => item.classList.add("dragging"), 0);
        });
        item.addEventListener("dragend", () => item.classList.remove("dragging"));
    });
    cmpProdMMW.addEventListener("dragover", initSortableList);
    cmpProdMMW.addEventListener("dragenter", e => e.preventDefault());
    totalPriceR();
}
//----Create Cmp_prod
async function createCmp_prod(row) {
    if (rqstBuy == false) {
        rqstBuy = true;
        preloader.classList.add('modal__show');
        let object = {
            'fk_id_cmp_cppd': row.children[2].value,
            'fk_id_prod_cppd': row.children[1].value,
            'descripcion_cppd': row.children[6].value,
            'cantidad_cppd': row.children[7].value,
            'cost_uni_cppd': row.children[8].value,
            'observacion_cppd': row.children[10].value
        }
        let formData = new FormData();
        formData.append('createCmp_prod', JSON.stringify(object));
        fetch('../controladores/compras.php', {
            method: "POST",
            body: formData
        }).then(response => response.text()).then(data => {
            Promise.all([readBuys(), readCmp_prods()]).then(() => {
                rqstBuy = false;
                preloader.classList.remove('modal__show');
                readCmpProd(data);
            })
        }).catch(err => {
            mostrarAlerta(err);
        });
    }
}
const formAddBuy = document.getElementById('formAddBuy');
formAddBuy.addEventListener('submit', updateCmp_prod);
//----Update Cmp_prod
async function updateCmp_prod() {
    event.preventDefault();
    if (rqstBuy == false) {
        if (confirm('Se añadirá el producto a el inventario. ¿Esta usted seguro?')) {
            rqstBuy = true;
            preloader.classList.add('modal__show');
            let formData = new FormData(formAddBuy);
            formData.append('addBuyToInventory', '');
            //formData.set("fecha_entrega_cppd", `${dateActual[2]}-${dateActual[1]}-${dateActual[0]} ${datePart[1]}`);
            fetch('../controladores/compras.php', {
                method: "POST",
                body: formData
            }).then(response => response.text()).then(data => {
                Promise.all([readBuys(), readCmp_prods()]).then(() => {
                    rqstBuy = false;
                    formAddBuy.reset();
                    addBuyMW.classList.remove('modal__show');
                    readCmpProd(data);
                    preloader.classList.remove('modal__show');
                })
            }).catch(err => {
                mostrarAlerta(err);
            });
        }
    }
}
//-----Delete CMP_PRODS
async function deleteCmp_prod(id_cppd) {
    if (confirm('¿Esta usted seguro de eliminar el producto?')) {
        if (rqstBuy == false) {
            rqstBuy = true;
            let cmp_prod = cmp_prods.find(cmp_prod => cmp_prod.id_cppd == id_cppd);
            preloader.classList.add('modal__show');
            let formData = new FormData();
            formData.append('deleteCmp_prod', JSON.stringify(cmp_prod));
            fetch('../controladores/compras.php', {
                method: "POST",
                body: formData
            }).then(response => response.text()).then(data => {
                Promise.all([readBuys(), readCmp_prods()]).then(() => {
                    rqstBuy = false;
                    preloader.classList.remove('modal__show');
                    readCmpProd(data);
                })
            }).catch(err => {
                mostrarAlerta(err);
            });
        }
    }
}
function openProductBuyMW(row) {
    id_cppd = row.children[0].value;
    addBuyMW.classList.add('modal__show');
    document.getElementsByName('id_cppd')[0].value = row.children[0].value;
    document.getElementsByName('fk_id_prod_cppd')[0].value = row.children[1].value;
    document.getElementsByName('fk_id_cmp_cppd')[0].value = row.children[2].value;
    document.getElementsByName('fecha_entrega_cppd')[0].value = `${dateActual[2]}-${dateActual[1]}-${dateActual[0]}`;
    document.getElementsByName('fecha_factura_cppd')[0].value = `${dateActual[2]}-${dateActual[1]}-${dateActual[0]}`;
    document.getElementsByName('codigo_cppd')[0].value = row.children[5].innerText;
    document.getElementsByName('cantidad_cppd')[0].value = row.children[7].value;
    document.getElementsByName('cost_uni_cppd')[0].value = row.children[8].value + ' Bs';
}
function changeQuantityCPPD(row, id_cmp) {
    let cantidad_prod = row.children[7].value;
    let costo_uni = row.children[8].value;
    let cost_uni_total = cantidad_prod * costo_uni;
    row.children[9].value = cost_uni_total.toFixed(2);
    totalPriceCPPD(id_cmp);
}
function totalPriceCPPD(id_cmp) {
    let divs = document.querySelectorAll('#productBuyMW div.modal__body div.cart__item');
    let quantityCPMMW = document.getElementById('quantityaddBuyMW');
    let subTotalCPMMW = document.getElementById('subTotaladdBuyMW');
    let descCPMMW = document.getElementById('descaddBuyMW');
    let totalCPMMW = document.getElementById('totaladdBuyMW');
    let total = 0;
    let desc = 0;
    divs.forEach(div => {
        costo_total = Number(div.children[9].value);
        total = total + costo_total;
    })
    let ordenCompra = filterBuys.find(cmp_prod => cmp_prod.id_cmp == id_cmp);
    subTotalCPMMW.innerHTML = 'Sub-Total (Bs): ' + total.toFixed(2) + ' Bs';
    desc = Number(ordenCompra.descuento_cmp) * total / 100;
    desc = desc.toFixed(2);
    descCPMMW.innerHTML = `Desc. ${ordenCompra.descuento_cmp}% (Bs): ${desc} Bs`;
    totalCPMMW.innerHTML = `Total (Bs): ${Number(total.toFixed(2) - desc).toFixed(2)} Bs`;
    quantityCPMMW.innerHTML = divs.length;
}
//-----------------------------------------------ADD CART------------------------------------------
const cmpProdRMW = document.querySelector('#cmp_prodRMW div.modal__body');
function cartCmp_prodR(id_prod, contenedor, totalPrice) {
    const product = filterProductsMW.find(product => product['id_prod'] == id_prod);
    const inventoriesAlto = inventories.filter(inventory => inventory.fk_id_prod_inv === id_prod && inventory.ubi_almacen === 0);
    const inventoriesArce = inventories.filter(inventory => inventory.fk_id_prod_inv === id_prod && inventory.ubi_almacen === 1);

    const cantidad_invAlto = inventoriesAlto.length > 0 ? inventoriesAlto[0].cantidad_inv : 0;
    const cantidad_invArce = inventoriesArce.length > 0 ? inventoriesArce[0].cantidad_inv : 0;
    const cantidad_invTotal = cantidad_invAlto + cantidad_invArce;

    const cost_uni2 = prices.find(price => price.modelo.trim() === product.codigo_prod);
    const cost_uni = cost_uni2 ? Math.round(Number(cost_uni2.precio) * 1.1) : (inventoriesAlto.length > 0 ? Math.round(inventoriesAlto[0].cost_uni_inv * 1.1) : (inventoriesArce.length > 0 ? Math.round(inventoriesArce[0].cost_uni_inv * 1.1) : 0));

    const item = document.createElement('div');
    item.classList.add('cart__item');
    item.setAttribute('id_prod', product['id_prod']);
    item.setAttribute('draggable', 'true');

    const cantidadInvParagraph = document.createElement('p');
    cantidadInvParagraph.classList.add('cart__item--stock');

    if (cantidad_invAlto > 0 && cantidad_invArce > 0) {
        cantidadInvParagraph.classList.add('almacen-ambos');
    } else if (cantidad_invAlto > 0) {
        cantidadInvParagraph.classList.add('almacen-alto');
    } else if (cantidad_invArce > 0) {
        cantidadInvParagraph.classList.add('almacen-arce');
    }

    cantidadInvParagraph.textContent = cantidad_invTotal;
    item.appendChild(cantidadInvParagraph);

    const img = document.createElement('img');
    img.src = `../modelos/imagenes/${product['imagen_prod']}`;
    img.classList.add('cart__item--img');
    item.appendChild(img);

    const codigoParagraph = document.createElement('p');
    codigoParagraph.classList.add('cart__item--code');
    codigoParagraph.textContent = product['codigo_prod'];
    item.appendChild(codigoParagraph);

    const descripcionTextarea = document.createElement('textarea');
    descripcionTextarea.classList.add('cart__item--name');
    descripcionTextarea.textContent = product['nombre_prod'];
    item.appendChild(descripcionTextarea);

    function updateCostTotal(cantidadInput, costUnitInput, costTotalInput) {
        const cantidad = parseInt(cantidadInput.value);
        const costUnit = parseFloat(costUnitInput.value);
        const costTotal = cantidad * costUnit;
        costTotalInput.value = costTotal;
        totalPriceR();
    }

    const cantidadInput = document.createElement('input');
    cantidadInput.type = 'number';
    cantidadInput.value = '1';
    cantidadInput.min = '1';
    cantidadInput.classList.add('cart__item--quantity');
    cantidadInput.addEventListener('change', (e) => {
        const costUnitInput = e.target.parentNode.querySelector('.cart__item--costUnit');
        const costTotalInput = e.target.parentNode.querySelector('.cart__item--costTotal');
        updateCostTotal(e.target, costUnitInput, costTotalInput);
    });

    item.appendChild(cantidadInput);

    const costUnitInput = document.createElement('input');
    costUnitInput.type = 'number';
    costUnitInput.value = cost_uni;
    costUnitInput.classList.add('cart__item--costUnit');
    costUnitInput.addEventListener('change', (e) => {
        const cantidadInput = e.target.parentNode.querySelector('.cart__item--quantity');
        const costTotalInput = e.target.parentNode.querySelector('.cart__item--costTotal');
        updateCostTotal(cantidadInput, e.target, costTotalInput);
    });
    item.appendChild(costUnitInput);

    const costTotalInput = document.createElement('input');
    costTotalInput.type = 'number';
    costTotalInput.value = cost_uni;
    costTotalInput.classList.add('cart__item--costTotal');
    costTotalInput.readOnly = true;
    item.appendChild(costTotalInput);

    const observacionInput = document.createElement('input');
    observacionInput.type = 'text';
    observacionInput.placeholder = 'Observaciones';
    observacionInput.classList.add('cart__item--observacion');
    item.appendChild(observacionInput);

    const divImg = document.createElement('div');
    divImg.classList.add('cart__item--imgCRUD');
    const trashImg = document.createElement('img');
    trashImg.src = '../imagenes/trash.svg';
    trashImg.classList.add('icon__CRUD');
    trashImg.addEventListener('click', (e) => removeCartR(e, contenedor, totalPrice));
    divImg.appendChild(trashImg);
    item.appendChild(divImg);
    return item;
}
//-------Eliminar producto 
function removeCartR(e, container, total) {
    const item = e.target.parentNode.parentNode;
    container.removeChild(item);
    total();
}
const quantityCPRMW = document.getElementById('quantityCPRMW');
const subTotalCPRMW = document.getElementById('subTotalCPRMW');
const descCPRMW = document.getElementById('descCPRMW');
const totalCPRMW = document.getElementById('totalCPRMW');
const descuento_cmpR = document.getElementById('descuento_cmpR');
const numberCPRMW = cmp_prodRMW.querySelector('div.modal__body--number');
function totalPriceR() {
    const divs = cmpProdRMW.querySelectorAll('.cart__item');
    let total = 0;
    if (divs.length > 0) {
        divs.forEach(div => {
            const costoTotal = div.querySelector('.cart__item--costTotal').value;
            const costo = parseFloat(costoTotal);
            if (!isNaN(costo)) {
                total += costo;
            }
        });
    }
    const descuento = total * (descuento_cmpR.value / 100);
    subTotalCPRMW.innerHTML = 'Sub-Total (Bs): ' + total.toFixed(2) + ' Bs';
    descCPRMW.innerHTML = `Desc. ${descuento_cmpR.value}% (Bs): ${descuento.toFixed(2)} Bs`;
    totalCPRMW.innerHTML = `Total (Bs): ${(total - descuento).toFixed(2)} Bs`;
    quantityCPRMW.innerHTML = divs.length;
    numberCPRMW.innerHTML = '';
    for (let i = 1; i <= divs.length; i++) {
        const div = document.createElement('div');
        div.classList.add('modal__body--index');
        div.innerText = i;
        numberCPRMW.appendChild(div);
    }
}
//<<-------------------------------------MODAL DE PRODUCTS PARA COMPRAR-------------------------------------------->>
const closeCmp_prodRMW = document.getElementById('closeCmp_prodRMW');
const cmp_prodRMW = document.getElementById('cmp_prodRMW');
function openCmp_prodRMW() {
    cmp_prodRMW.classList.add('modal__show');
}
closeCmp_prodRMW.addEventListener('click', (e) => {
    cmp_prodRMW.classList.remove('modal__show');
});
const cmpProdMMW = document.querySelector('#cmp_prodMMW div.modal__body');
function cartCmp_prodM(product, contenedor, totalPrice) {
    const producto = products.find(producto => producto['id_prod'] == product.fk_id_prod_cppd);
    const inventoriesAlto = inventories.filter(inventory => inventory.fk_id_prod_inv === product.fk_id_prod_cppd && inventory.ubi_almacen === 0);
    const inventoriesArce = inventories.filter(inventory => inventory.fk_id_prod_inv === product.fk_id_prod_cppd && inventory.ubi_almacen === 1);

    const cantidad_invAlto = inventoriesAlto.length > 0 ? inventoriesAlto[0].cantidad_inv : 0;
    const cantidad_invArce = inventoriesArce.length > 0 ? inventoriesArce[0].cantidad_inv : 0;
    const cantidad_invTotal = cantidad_invAlto + cantidad_invArce;

    const cost_uni2 = prices.find(price => price.modelo.trim() === producto.codigo_prod);
    const cost_uni = cost_uni2 ? Math.round(Number(cost_uni2.precio) * 1.1) : (inventoriesAlto.length > 0 ? Math.round(inventoriesAlto[0].cost_uni_inv * 1.1) : (inventoriesArce.length > 0 ? Math.round(inventoriesArce[0].cost_uni_inv * 1.1) : 0));

    const item = document.createElement('div');
    item.classList.add('cart__item');
    item.setAttribute('id_prod', producto['id_prod']);
    item.setAttribute('draggable', 'true');

    const cantidadInvParagraph = document.createElement('p');
    cantidadInvParagraph.classList.add('cart__item--stock');

    if (cantidad_invAlto > 0 && cantidad_invArce > 0) {
        cantidadInvParagraph.classList.add('almacen-ambos');
    } else if (cantidad_invAlto > 0) {
        cantidadInvParagraph.classList.add('almacen-alto');
    } else if (cantidad_invArce > 0) {
        cantidadInvParagraph.classList.add('almacen-arce');
    }

    cantidadInvParagraph.textContent = cantidad_invTotal;
    item.appendChild(cantidadInvParagraph);

    const img = document.createElement('img');
    img.src = `../modelos/imagenes/${producto['imagen_prod']}`;
    img.classList.add('cart__item--img');
    item.appendChild(img);

    const codigoParagraph = document.createElement('p');
    codigoParagraph.classList.add('cart__item--code');
    codigoParagraph.textContent = producto['codigo_prod'];
    item.appendChild(codigoParagraph);

    const descripcionTextarea = document.createElement('textarea');
    descripcionTextarea.classList.add('cart__item--name');
    descripcionTextarea.textContent = product.descripcion_cppd;
    item.appendChild(descripcionTextarea);

    function updateCostTotal(cantidadInput, costUnitInput, costTotalInput) {
        const cantidad = parseInt(cantidadInput.value);
        const costUnit = parseFloat(costUnitInput.value);
        const costTotal = cantidad * costUnit;
        costTotalInput.value = costTotal;
        totalPriceR();
    }

    const cantidadInput = document.createElement('input');
    cantidadInput.type = 'number';
    cantidadInput.value = product.cantidad_cppd;
    cantidadInput.min = '1';
    cantidadInput.classList.add('cart__item--quantity');
    cantidadInput.addEventListener('change', (e) => {
        const costUnitInput = e.target.parentNode.querySelector('.cart__item--costUnit');
        const costTotalInput = e.target.parentNode.querySelector('.cart__item--costTotal');
        updateCostTotal(e.target, costUnitInput, costTotalInput);
    });

    item.appendChild(cantidadInput);

    const costUnitInput = document.createElement('input');
    costUnitInput.type = 'number';
    costUnitInput.value = product.cost_uni_cppd;
    costUnitInput.classList.add('cart__item--costUnit');
    costUnitInput.addEventListener('change', (e) => {
        const cantidadInput = e.target.parentNode.querySelector('.cart__item--quantity');
        const costTotalInput = e.target.parentNode.querySelector('.cart__item--costTotal');
        updateCostTotal(cantidadInput, e.target, costTotalInput);
    });
    item.appendChild(costUnitInput);

    const costTotalInput = document.createElement('input');
    costTotalInput.type = 'number';
    costTotalInput.value = (product.cantidad_cppd * product.cost_uni_cppd).toFixed(2);
    costTotalInput.classList.add('cart__item--costTotal');
    costTotalInput.readOnly = true;
    item.appendChild(costTotalInput);

    const observacionInput = document.createElement('input');
    observacionInput.type = 'text';
    observacionInput.value = product.observacion_cppd;
    observacionInput.classList.add('cart__item--observacion');
    item.appendChild(observacionInput);

    if (product.estado_cppd === 0) {
        const img = document.createElement('img');
        img.classList.add('icon__CRUD');
        img.src = '../imagenes/cartAdd.svg';
        img.setAttribute('onclick', 'openProductBuyMW(this.parentNode)');
        img.setAttribute('title', 'Agregar producto');
        item.appendChild(img);
        const img2 = document.createElement('img');
        img2.classList.add('icon__CRUD');
        img2.src = '../imagenes/trash.svg';
        img2.setAttribute('title', 'Eliminar producto');
        img2.setAttribute('onclick', 'deleteCmp_prod(this.parentNode.children[0].value)');
        item.appendChild(img2);
    } else if (product.estado_cppd === 1) {
        const img = document.createElement('img');
        img.src = '../imagenes/checkCircle.svg';
        img.setAttribute('title', 'Producto agregado');
        item.appendChild(img);
        const img2 = document.createElement('img');
        img2.classList.add('icon__CRUD');
        img2.src = '../imagenes/edit.svg';
        img2.setAttribute('title', 'Editar producto');
        img2.setAttribute('onclick', 'openProductBuyMW(this.parentNode)');
        item.appendChild(img2);
    }
    return item;
}

//<<-------------------------------------MODAL DE PRODUCTS PARA COMPRAR-------------------------------------------->>
const closeCmp_prodMMW = document.getElementById('closeCmp_prodMMW');
const cmp_prodMMW = document.getElementById('cmp_prodMMW');
closeCmp_prodMMW.addEventListener('click', (e) => {
    cmp_prodMMW.classList.remove('modal__show');
});


//-------------------------------------------------SUPPLIER--------------------------------------------------
//<<-----------------------------------------CRUD SUPPLIER----------------------------------------->>
let suppliers = [];
async function readSuppliers() {
    return new Promise((resolve, reject) => {
        let formData = new FormData();
        formData.append('readSuppliers', '');
        fetch('../controladores/clientes.php', {
            method: "POST",
            body: formData
        }).then(response => response.json()).then(data => {
            suppliers = data;
            resolve();
        }).catch(err => console.log(err));
    })
}
//------Create a supplier
const formSupplierR = document.getElementById('formSupplierR');
formSupplierR.addEventListener('submit', createSupplier);
async function createSupplier() {
    if (!rqstBuy) {
        rqstBuy = true;
        event.preventDefault();
        supplierRMW.classList.remove('modal__show');
        let formData = new FormData(formSupplierR);
        formData.append('createSupplier', '');
        preloader.classList.add('modal__show');
        fetch('../controladores/clientes.php', {
            method: "POST",
            body: formData
        }).then(response => response.text()).then(data => {
            readSuppliers().then(() => {
                preloader.classList.remove('modal__show');
                rqstBuy = false;
                formSupplierR.reset();
                fillSelectClte(selectEnterpriseR, selectSupplierR);
                mostrarAlerta(data);
            })
        }).catch(err => console.log(err));
    }
}
//------Read a supplier
function readSupplier(rm) {
    let selectSupplierRM = document.getElementById('selectSupplier' + rm);
    let id_prov = selectSupplierRM.value;
    for (let supplier in suppliers) {
        if (suppliers[supplier]['id_prov'] == id_prov) {
            for (let valor in suppliers[supplier]) {
                if (valor == 'fk_id_empp_prov') {
                    selectEntProvM.innerHTML = '';
                    let option = document.createElement('option');
                    option.value = selectEnterpriseR.value
                    option.innerText = selectEnterpriseR.options[selectEnterpriseR.selectedIndex].textContent;
                    selectEntProvM.appendChild(option);
                } else {
                    document.getElementsByName(valor + 'M')[0].value = suppliers[supplier][valor];
                }
            }
        }
    }
    supplierMMW.classList.add('modal__show');
}
//------Update a supplier
const formSupplierM = document.getElementById('formSupplierM');
formSupplierM.addEventListener('submit', updateSupplier);
async function updateSupplier() {
    if (!rqstBuy) {
        rqstBuy = true;
        preloader.classList.add('modal__show');
        event.preventDefault();
        supplierMMW.classList.remove('modal__show');
        let formData = new FormData(formSupplierM);
        formData.append('updateSupplier', '');
        fetch('../controladores/clientes.php', {
            method: "POST",
            body: formData
        }).then(response => response.text()).then(data => {
            readSuppliers().then(() => {
                preloader.classList.remove('modal__show');
                rqstBuy = false;
                fillSelectClte(selectEnterpriseR, selectSupplierR);
                mostrarAlerta(data);
            })
        }).catch(err => console.log(err));
    }
}
//------Delete a supplier
async function deleteSupplier(rm) {
    let selectSupplierRM = document.getElementById('selectSupplier' + rm);
    if (confirm('¿Esta usted seguro?')) {
        if (!rqstBuy) {
            rqstBuy = true;
            preloader.classList.add('modal__show');
            let id = selectSupplierRM.value;
            let formData = new FormData();
            formData.append('deleteSupplier', id);
            fetch('../controladores/clientes.php', {
                method: "POST",
                body: formData
            }).then(response => response.text()).then(data => {
                readSuppliers().then(() => {
                    preloader.classList.remove('modal__show');
                    rqstBuy = false;
                    fillSelectClte(selectEnterpriseR, selectSupplierR);
                    mostrarAlerta(data);
                })
            }).catch(err => console.log(err));
        }
    }
}
//<<-------------------------------------------MODAL SUPPLIER---------------------------------------->>
const supplierRMW = document.getElementById('supplierRMW');
const supplierMMW = document.getElementById('supplierMMW');
const closeSupplierRMW = document.getElementById('closeSupplierRMW');
const closeSupplierMMW = document.getElementById('closeSupplierMMW');
const selectEntProvR = document.getElementsByName('fk_id_empp_provR')[0];
const selectEntProvM = document.getElementsByName('fk_id_empp_provM')[0];
function openSupplierRMW() {
    supplierRMW.classList.add('modal__show');
    selectEntProvR.innerHTML = '';
    let option = document.createElement('option');
    option.value = selectEnterpriseR.value;
    option.innerText = selectEnterpriseR.options[selectEnterpriseR.selectedIndex].textContent;
    selectEntProvR.appendChild(option);
}
closeSupplierRMW.addEventListener('click', () => {
    supplierRMW.classList.remove('modal__show');
});
closeSupplierMMW.addEventListener('click', () => {
    supplierMMW.classList.remove('modal__show');
});
//<<---------------------------------------------EMPRESA---------------------------------------------->>
const selectEnterpriseR = document.getElementsByName('fk_id_emp_clteR')[0];
const selectEnterpriseM = document.getElementsByName('fk_id_emp_clteM')[0];
const selectSupplierR = document.getElementsByName('fk_id_prov_cmpR')[0];
const selectSupplierM = document.getElementsByName('fk_id_prov_cmpM')[0];
selectEnterpriseR.addEventListener('change', () => {
    fillSelectClte(selectEnterpriseR, selectSupplierR);
});
let enterprises = [];
let filterEnterprises = [];
async function readEnterprises() {
    return new Promise((resolve, reject) => {
        let formData = new FormData();
        formData.append('readEnterprisesP', '');
        fetch('../controladores/clientes.php', {
            method: "POST",
            body: formData
        }).then(response => response.json()).then(data => {
            enterprises = data;
            filterEnterprises = enterprises;

            resolve();
        }).catch(err => console.log(err));
    })
}
//<<---------------------------------------TABLA MODAL EMPRESA--------------------------------------->>
//------Select utilizado para buscar por columnas
const selectSearchEmpMW = document.getElementById('selectSearchEmpMW');
selectSearchEmpMW.addEventListener('change', searchEnterprisesMW);
//------buscar por input
const inputSearchEmpMW = document.getElementById("inputSearchEmpMW");
inputSearchEmpMW.addEventListener("keyup", searchEnterprisesMW);
//------Clientes por pagina
const selectNumberEmpMW = document.getElementById('selectNumberEmpMW');
selectNumberEmpMW.selectedIndex = 3;
selectNumberEmpMW.addEventListener('change', function () {
    paginacionEnterpriseMW(Object.values(filterEnterprises).length, 1);
});
//------buscar por:
function searchEnterprisesMW() {
    filterEnterprises = {};
    for (let enterprise in enterprises) {
        for (let valor in enterprises[enterprise]) {
            if (selectSearchEmpMW.value == 'todas') {
                if (valor != 'id_empp') {
                    if (enterprises[enterprise][valor].toLowerCase().indexOf(inputSearchEmpMW.value.toLowerCase()) >= 0) {
                        filterEnterprises[enterprise] = enterprises[enterprise];
                        break;
                    }
                }
            } else {
                if (valor == selectSearchEmpMW.value) {
                    if (enterprises[enterprise][valor].toLowerCase().indexOf(inputSearchEmpMW.value.toLowerCase()) >= 0) {
                        filterEnterprises[enterprise] = enterprises[enterprise];
                        break;
                    }
                }
            }
        }
    }
    paginacionEnterpriseMW(Object.values(filterEnterprises).length, 1);
}
//------PaginacionEnterpriseMW
function paginacionEnterpriseMW(allEnterprises, page) {
    let numberEnterprises = Number(selectNumberEmpMW.value);
    let allPages = Math.ceil(allEnterprises / numberEnterprises);
    let ul = document.querySelector('#wrapperEmpMW ul');
    let li = '';
    let beforePages = page - 1;
    let afterPages = page + 1;
    let liActive;
    if (page > 1) {
        li += `<li class="btn" onclick="paginacionEnterpriseMW(${allEnterprises}, ${page - 1})"><img src="../imagenes/arowLeft.svg"></li>`;
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
        li += `<li class="numb ${liActive}" onclick="paginacionEnterpriseMW(${allEnterprises}, ${pageLength})"><span>${pageLength}</span></li>`;
    }
    if (page < allPages) {
        li += `<li class="btn" onclick="paginacionEnterpriseMW(${allEnterprises}, ${page + 1})"><img src="../imagenes/arowRight.svg"></li>`;
    }
    ul.innerHTML = li;
    let h2 = document.querySelector('#showPageEmpMW h2');
    h2.innerHTML = `Pagina ${page}/${allPages}, ${allEnterprises} Empresas`;
    tableEnterprisesMW(page);
}
//------Crear la tabla
function tableEnterprisesMW(page) {
    const tbody = document.getElementById('tbodyEmpMW');
    inicio = (page - 1) * Number(selectNumberEmpMW.value);
    final = inicio + Number(selectNumberEmpMW.value);
    i = 1;
    tbody.innerHTML = '';
    for (let enterprise in filterEnterprises) {
        if (i > inicio && i <= final) {
            let tr = document.createElement('tr');
            for (let valor in filterEnterprises[enterprise]) {
                let td = document.createElement('td');
                if (valor == 'id_empp') {
                    td.innerText = filterEnterprises[enterprise][valor];
                    td.setAttribute('hidden', '');
                    tr.appendChild(td);
                    td = document.createElement('td');
                    td.innerText = i;
                    tr.appendChild(td);
                    i++;
                } else if (valor == 'nit_empp') {
                    if (filterEnterprises[enterprise][valor] == '0') {
                        td.innerText = '';
                    } else {
                        td.innerText = filterEnterprises[enterprise][valor];
                    }
                    tr.appendChild(td);
                } else if (valor == 'telefono_empp') {
                    if (filterEnterprises[enterprise][valor] == '0') {
                        td.innerText = '';
                    } else {
                        td.innerText = filterEnterprises[enterprise][valor];
                    }
                    tr.appendChild(td);
                } else {
                    td.innerText = filterEnterprises[enterprise][valor];
                    tr.appendChild(td);
                }
            }
            let td = document.createElement('td');
            td.innerHTML = `
        <img src='../imagenes/send.svg' onclick='sendEnterprise(this.parentNode.parentNode)'>`;
            tr.appendChild(td);
            tbody.appendChild(tr);
        } else {
            i++;
        }
    }
}
function sendEnterprise(tr) {
    enterpriseSMW.classList.remove('modal__show');
    let id_empp = tr.children[0].innerText;
    selectEnterpriseR.value = id_empp;
    fillSelectClte(selectEnterpriseR, selectSupplierR);
}
function fillSelectEmp(selectEmp, selectSpl) {
    selectEmp.innerHTML = '';
    for (let enterprise in enterprises) {
        let option = document.createElement('option');
        option.value = enterprises[enterprise]['id_empp'];
        option.innerText = enterprises[enterprise]['nombre_empp'];
        selectEmp.appendChild(option);
    }
    fillSelectClte(selectEmp, selectSpl);
}
function fillSelectClte(selectEmp, selectSpl) {
    if (selectSpl != false) {
        let id_empp = selectEmp.value;
        selectSpl.innerHTML = '';
        for (let supplier in suppliers) {
            if (suppliers[supplier]['fk_id_empp_prov'] == id_empp) {
                let option = document.createElement('option');
                option.value = suppliers[supplier]['id_prov'];
                option.innerText = suppliers[supplier]['nombre_prov'] + ' ' + suppliers[supplier]['apellido_prov'];
                selectSpl.appendChild(option);
            }
        }
        for (let enterprise in enterprises) {
            if (enterprises[enterprise]['id_empp'] == id_empp) {
                document.getElementsByName('descuento_cmpR')[0].value = enterprises[enterprise]['descuento_empp'];
                break;
            } else {
                document.getElementsByName('descuento_cmpR')[0].value = '0';
            }
        }
    }
}
//----------------------------------ventana modal EnterpriseSMW-------------------------------------------
//---------------------------ventana modal para buscar producto
const enterpriseSMW = document.getElementById('enterpriseSMW');
const closeEnterpriseSMW = document.getElementById('closeEnterpriseSMW');
function openEnterpriseSMW() {
    enterpriseSMW.classList.add('modal__show');
}
closeEnterpriseSMW.addEventListener('click', () => {
    enterpriseSMW.classList.remove('modal__show');
});
//----------------------------------------------CRUD EMPRESA---------------------------------------------
//------Craer una empresa
const formEmpresaR = document.getElementById('formEmpresaR');
formEmpresaR.addEventListener('submit', createEnterprise);
async function createEnterprise() {
    event.preventDefault();
    if (!rqstBuy) {
        rqstBuy = true;
        preloader.classList.add('modal__show');
        enterprisesRMW.classList.remove('modal__show');
        let formData = new FormData(formEmpresaR);
        formData.append('createEnterpriseP', '');
        fetch('../controladores/clientes.php', {
            method: "POST",
            body: formData
        }).then(response => response.text()).then(data => {
            if (data != 'La empresa ya existe') {
                Promise.all([readSuppliers(), readEnterprises()]).then(() => {
                    formEmpresaR.reset();
                    preloader.classList.remove('modal__show');
                    rqstBuy = false;
                    mostrarAlerta(data);
                })
            } else {
                preloader.classList.remove('modal__show');
                rqstBuy = false;
                mostrarAlerta(data);
            }
        }).catch(err => console.log(err));
    }
}
//------Leer una empresa
function readEnterprise(rm) {
    let selectEnterpriseRM = document.getElementById('selectEnterprise' + rm);
    let id_empp = selectEnterpriseRM.value;
    for (let enterprise in enterprises) {
        if (enterprises[enterprise]['id_empp'] == id_empp) {

            for (let valor in enterprises[enterprise]) {
                document.getElementsByName(valor + 'M')[0].value = enterprises[enterprise][valor];
            }
        }
    }
    enterprisesMMW.classList.add('modal__show');
}
//------Actualizar una empresa
let formEmpresaM = document.getElementById('formEmpresaM');
formEmpresaM.addEventListener('submit', updateEnterprise);
async function updateEnterprise() {
    event.preventDefault();
    if (!rqstBuy) {
        rqstBuy = true;
        preloader.classList.add('modal__show');
        enterprisesMMW.classList.remove('modal__show');
        let formData = new FormData(formEmpresaM);
        formData.append('updateEnterpriseP', '');
        fetch('../controladores/clientes.php', {
            method: "POST",
            body: formData
        }).then(response => response.text()).then(data => {
            rqstBuy = false;
            if (data == 'Empresa actualizada exitosamente') {
                readEnterprises().then(() => {
                    preloader.classList.remove('modal__show');
                    mostrarAlerta(data);
                })
            } else {
                preloader.classList.remove('modal__show');
                mostrarAlerta(data);
            }
        }).catch(err => console.log(err));
    }

}
//------Borrar una empresa
async function deleteEnterprise(rm) {
    let selectEnterpriseRM = document.getElementById('selectEnterprise' + rm);
    if (confirm('¿Esta usted seguro?')) {
        if (!rqstBuy) {
            rqstBuy = true;
            preloader.classList.add('modal__show');
            let id_empp = selectEnterpriseRM.value;
            let formData = new FormData();
            formData.append('deleteEnterpriseP', id_empp);
            fetch('../controladores/clientes.php', {
                method: "POST",
                body: formData
            }).then(response => response.text()).then(data => {
                readEnterprises().then(() => {
                    rqstBuy = false;
                    preloader.classList.remove('modal__show');
                    mostrarAlerta(data);
                })
            }).catch(err => console.log(err));
        }
    }
}
//<<------------------------ABRIR Y CERRAR VENTANAS MODALES--------------------------------->>
//-----------------------------------Ventana modal para empresa---------------------------------//
const enterprisesRMW = document.getElementById('enterprisesRMW');
const enterprisesMMW = document.getElementById('enterprisesMMW');
const closEEnterprisesRMW = document.getElementById('closEEnterprisesRMW');
const closEEnterprisesMMW = document.getElementById('closEEnterprisesMMW');
function openEnterprisesRMW() {
    enterprisesRMW.classList.add('modal__show');
}
closeEnterprisesRMW.addEventListener('click', () => {
    enterprisesRMW.classList.remove('modal__show');
});
closeEnterprisesMMW.addEventListener('click', () => {
    enterprisesMMW.classList.remove('modal__show');
});
/*---------------------------------------------------------------------------------------------*/
//------------PDF of buys
function selectPDFInformation(id_cmp) {
    for (let buy in buys) {
        if (buys[buy]['id_cmp'] == id_cmp) {
            let array = [];
            for (let cmp_prod in cmp_prods) {
                if (cmp_prods[cmp_prod]['fk_id_cmp_cppd'] == id_cmp) {
                    let object = {
                        'id_cppd': cmp_prods[cmp_prod]['id_cppd'],
                        'fk_id_cmp_cppd': cmp_prods[cmp_prod]['fk_id_cmp_cppd'],
                        'fk_id_prod_cppd': cmp_prods[cmp_prod]['fk_id_prod_cppd'],
                        'codigo_prod': cmp_prods[cmp_prod]['codigo_prod'],
                        'descripcion_cppd': cmp_prods[cmp_prod]['descripcion_cppd'],
                        'cantidad_cppd': cmp_prods[cmp_prod]['cantidad_cppd'],
                        'cost_uni_cppd': cmp_prods[cmp_prod]['cost_uni_cppd']
                    }
                    array.push(object);
                }
            }
            showPDF(buys[buy], array, 'oc');
            break;
        }
    }
}
function showPDF(buy, array, pdf) {
    // Crea un formulario oculto
    var form = document.createElement('form');
    form.method = 'post';
    form.action = '../modelos/reportes/ordenDeCompra.php';
    form.target = '_blank'; // Abre la página en una nueva ventana
    form.style.display = 'none'; // Oculta visualmente el formulario
    // Crea un campo oculto para la variable prof_mprof_ne
    var input1 = document.createElement('input');
    input1.type = 'hidden';
    input1.name = 'prof_mprof_ne';
    input1.value = JSON.stringify(buy); // Reemplaza con el valor real

    // Crea un campo oculto para la variable pf_pd
    var input2 = document.createElement('input');
    input2.type = 'hidden';
    input2.name = 'pf_pd';
    input2.value = JSON.stringify(array); // Reemplaza con el valor real

    // Crea un campo oculto para la variable pdf
    var input3 = document.createElement('input');
    input3.type = 'hidden';
    input3.name = 'pdf';
    input3.value = pdf; // Reemplaza con el valor real

    // Crea un campo oculto para la variable pdf
    var input4 = document.createElement('input');
    input4.type = 'hidden';
    input4.name = 'id_usua';
    input4.value = localStorage.getItem('id_usua'); // Reemplaza con el valor real

    // Agrega los campos al formulario
    form.appendChild(input1);
    form.appendChild(input2);
    form.appendChild(input3);
    form.appendChild(input4);
    // Agrega el formulario al cuerpo del documento HTML
    document.body.appendChild(form);
    // Submitir el formulario
    form.submit();

}
//------------------------------Campos obligatorios para registrar compra---------------------------
spaceRequiretBuyR();
function spaceRequiretBuyR() {
    const tipo_cambio_cmpR = document.getElementsByName('tipo_cambio_cmpR')[0];
    tipo_cambio_cmpR.addEventListener('input', function () {
        const valor = this.value;
        const regex = /^[0-9]+(\.[0-9]{1,2})?$/;
        if (!regex.test(valor)) {
            this.value = valor.replace(/[^0-9\.]/g, '');
        }
    });
}
const closeProductBuyMW = document.getElementById('closeProductBuyMW');
closeProductBuyMW.addEventListener('click', (e) => {
    productBuyMW.classList.remove('modal__show');
});
//-------------------------------EDITAR EL NUMERO DE FACTURA---------------------------------------------
const editFactura = document.getElementById('editFactura');
const closeEditFactura = document.getElementById('closeEditFactura');
closeEditFactura.addEventListener('click', (e) => {
    editFactura.classList.remove('modal__show');
})
function openEditFactura(id_cppd) {
    editFactura.classList.add('modal__show');
    document.getElementsByName('id_cppd2')[0].value = id_cppd;
    const editProd = cmp_prods.find(cmp_prod => cmp_prod.id_cppd == id_cppd);
    document.getElementsByName('fecha_entrega_cppd2')[0].value = editProd.fecha_entrega_cppd;
    document.getElementsByName('fecha_factura_cppd2')[0].value = editProd.fecha_factura_cppd;
    document.getElementsByName('factura_cppd2')[0].value = editProd.factura_cppd;
}
const formEditFactura = document.getElementById('formEditFactura');
formEditFactura.addEventListener('submit', editFacturaCompra)
async function editFacturaCompra() {
    event.preventDefault();
    if (rqstBuy == false) {
        rqstBuy = true;
        preloader.classList.add('modal__show');
        let formData = new FormData(formEditFactura);
        formData.append('editFactura', '');
        fetch('../controladores/compras.php', {
            method: "POST",
            body: formData
        }).then(response => response.json()).then(data => {
            Promise.all([readBuys(), readCmp_prods()]).then(() => {
                rqstBuy = false;
                formEditFactura.reset();
                addBuyMW.classList.remove('modal__show');
                editFactura.classList.remove('modal__show');
                readCmpProd(data);
                preloader.classList.remove('modal__show');
            })
        })
    }
}
//------------------------------MODAL ADD BUY TO INVETORY-----------------------------------------------------
const addBuyMW = document.getElementById('addBuyMW');
const closeAddBuyMW = document.getElementById('closeAddBuyMW');
closeAddBuyMW.addEventListener('click', (e) => {
    addBuyMW.classList.remove('modal__show');
});


//--------------------------------------------TABLA MODAL PRODUCTS-----------------------------------------------
let products = [];
let filterProductsMW = [];
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
            resolve();
        }).catch(err => mostrarAlerta('Ocurrio un error al cargar los productos, cargue nuevamente la pagina.'));
    })
}
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
        const costUnit = (inventarioArce ? inventarioArce.cost_uni_inv : 0) + (inventarioAlto ? inventarioAlto.cost_uni_inv : 0);

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
    if (formBuy === 'R') {
        const row = cartCmp_prodR(id_prod, cmpProdRMW, totalPriceR);
        cmpProdRMW.appendChild(row);
        //Drang and drop
        const items = cmpProdRMW.querySelectorAll(".cart__item");
        items.forEach(item => {
            item.addEventListener("dragstart", () => {
                setTimeout(() => item.classList.add("dragging"), 0);
            });
            item.addEventListener("dragend", () => item.classList.remove("dragging"));
        });
        cmpProdRMW.addEventListener("dragover", initSortableList);
        cmpProdRMW.addEventListener("dragenter", e => e.preventDefault());
        totalPriceR();
    } else if (formBuy === 'M') {
        const row = cartCmp_prodR(id_prod, cmpProdMMW, totalPriceR);
        cmpProdRMW.appendChild(row);
        //Drang and drop
        const items = cmpProdRMW.querySelectorAll(".cart__item");
        items.forEach(item => {
            item.addEventListener("dragstart", () => {
                setTimeout(() => item.classList.add("dragging"), 0);
            });
            item.addEventListener("dragend", () => item.classList.remove("dragging"));
        });
        cmpProdRMW.addEventListener("dragover", initSortableList);
        cmpProdRMW.addEventListener("dragenter", e => e.preventDefault());
    }
}
const initSortableList = (e) => {
    e.preventDefault();
    const draggingItem = document.querySelector(".dragging");

    let siblings = [...cmpProdRMW.querySelectorAll(".cart__item:not(.dragging)")];

    let nextSibling = siblings.find(sibling => {
        const rect = sibling.getBoundingClientRect();
        return e.clientY <= rect.top + rect.height / 2;
    });

    cmpProdRMW.insertBefore(draggingItem, nextSibling);
}
//---------------------------VENTANA MODAL PARA BUSCAR PRODUCTOS
const productSMW = document.getElementById('productSMW');
const closeProductSMW = document.getElementById('closeProductSMW');
function openProductSMW() {
    productSMW.classList.add('modal__show');
}
closeProductSMW.addEventListener('click', () => {
    productSMW.classList.remove('modal__show');
});



/*----------------------------------------------Marca y categoria  modal product-------------------------------------------------*/
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
            resolve();
        }).catch(err => console.log(err));
    })
}
/***************************MARCA Y CATEGORIA PARA FORMULARIO DE REGSITRO DE PRODUCTOS***************************/
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
const fk_id_mrc_prodM = document.getElementById('fk_id_mrc_prodM');
fk_id_mrc_prodM.addEventListener('change', selectCategoriaProdM);
const fk_id_ctgr_prodM = document.getElementById('fk_id_ctgr_prodM');
//-------Select de marcas registrar
function selectMarcaProdM() {
    fk_id_mrc_prodM.innerHTML = '';
    let option = document.createElement('option');
    option.value = 'todasLasMarcas';
    option.innerText = 'Todas las marcas';
    fk_id_mrc_prodM.appendChild(option);
    for (let clave in marcas) {
        let option = document.createElement('option');
        option.value = marcas[clave]['id_mrc'];
        option.innerText = marcas[clave]['nombre_mrc'];
        fk_id_mrc_prodM.appendChild(option);
    }
}
function selectCategoriaProdM() {
    fk_id_ctgr_prodM.innerHTML = '';
    let option = document.createElement('option');
    option.value = 'todasLasCategorias';
    option.innerText = 'Todas las categorias';
    fk_id_ctgr_prodM.appendChild(option);
    if (fk_id_mrc_prodM.value != 'todasLasMarcas') {
        let id_mrc = fk_id_mrc_prodM.value;
        categorias.forEach(categoria => {
            if (categoria.fk_id_mrc_mccr == id_mrc) {
                let option = document.createElement('option');
                option.value = categoria.id_ctgr;
                option.innerText = categoria.nombre_ctgr;
                fk_id_ctgr_prodM.appendChild(option);
            }
        });
    }
    searchProducts();
}
/*----------------------------------------------Marca y categoria  modal product-------------------------------------------------*/
//-------Select de marcas
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
//<<------------------------------------------CRUD DE PRODUCTS------------------------------------->>
//------Create un producto
document.getElementById("formProductsR").addEventListener("submit", createProduct);
function createProduct() {
    event.preventDefault();
    if (rqstBuy == false) {
        rqstBuy = true;
        if (marca_prodR.value == "todasLasMarcas") {
            mostrarAlerta("Debe seleccionar una marca");
        } else if (categoria_prodR.value == "todasLasCategorias") {
            mostrarAlerta("Debe seleccionar una categoria");
        } else {
            let form = document.getElementById("formProductsR");
            let formData = new FormData(form);
            formData.append('createProduct', '');
            preloader.classList.add('modal__show');
            fetch('../controladores/productos.php', {
                method: "POST",
                body: formData
            }).then(response => response.text()).then(data => {
                rqstBuy = false;
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
            }).catch(err => {
                rqstBuy = false;
                mostrarAlerta(err);
            });
        }
    }
}
//------Leer un producto
function readProduct(tr) {
    cleanUpProductFormM();
    let id_prod = tr.children[0].innerText;
    for (let product in filterProductsMW) {
        if (filterProductsMW[product]['id_prod'] == id_prod) {
            for (let valor in filterProductsMW[product]) {
                if (valor == 'imagen_prod') {
                    document.querySelector('.drop__areaM').setAttribute('style', `background-image: url("../modelos/imagenes/${filterProductsMW[product][valor]}"); background-size: cover;`);
                } else if (valor == 'codigo_smc_prod') {
                    if (filterProductsMW[product]['id_mrc'] == '15') {
                        divCodigoSMCM.removeAttribute('hidden');
                        document.getElementsByName(valor + 'M')[0].value = filterProductsMW[product][valor];
                    }
                } else if (valor == 'id_ctgr') {
                } else if (valor == 'id_mrc') {
                } else if (valor == 'marca_prod') {
                    document.getElementsByName(valor + 'M')[0].value = filterProductsMW[product]['id_mrc'];
                } else if (valor == 'categoria_prod') {
                    selectCategoriaProdM();
                    document.getElementsByName(valor + 'M')[0].value = filterProductsMW[product]['id_ctgr'];
                } else {
                    document.getElementsByName(valor + 'M')[0].value = filterProductsMW[product][valor];
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
    if (rqstBuy == false) {
        rqstBuy = true;
        if (marca_prodM.value == "todasLasMarcas") {
            mostrarAlerta("Debe seleccionar una marca");
        } else if (categoria_prodM.value == "todasLasCategorias") {
            mostrarAlerta("Debe seleccionar una categoria");
        } else {
            let form = document.getElementById("formProductsM");
            let formData = new FormData(form);
            formData.append('updateProduct', '');
            preloader.classList.add('modal__show');
            fetch('../controladores/productos.php', {
                method: "POST",
                body: formData
            }).then(response => response.text()).then(data => {
                preloader.classList.remove('modal__show');
                rqstBuy = false;
                if (data == "El codigo ya existe") {
                    mostrarAlerta(data);
                } else if (data == 'El codigo SMC ya existe') {
                    mostrarAlerta(data);
                } else {
                    readProducts().then(() => {
                        productsMMW.classList.remove('modal__show');
                        mostrarAlerta(data);
                    })
                }
            }).catch(err => {
                rqstBuy = false;
                mostrarAlerta(err);
            });
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
const productsMMW = document.getElementById('productsMMW');
const closeProductsMMW = document.getElementById('closeProductsMMW');
closeProductsMMW.addEventListener('click', (e) => {
    productsMMW.classList.remove('modal__show');
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
/***********************************************PRODUCT FILTER******************************************/

//---------------------------------VENTANA MODAL PARA FILTRAR PRODUCTOS COMPRADOS ------------------------------>>
const openProdOC = document.getElementById('openProdOC');
const closeTableProdOC = document.getElementById('closeTableProdOC');
const tableProdOC = document.getElementById('tableProdOC');
openProdOC.addEventListener('click', () => {
    tableProdOC.classList.add('modal__show');
})
closeTableProdOC.addEventListener('click', () => {
    tableProdOC.classList.remove('modal__show');
})
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
//------------------------------------------------------Leer invnetario
let inventories = [];
async function readInventories() {
    return new Promise((resolve, reject) => {
        let formData = new FormData();
        formData.append('readInventories', '');
        fetch('../controladores/inventario.php', {
            method: "POST",
            body: formData
        }).then(response => response.json()).then(data => {
            inventories = Object.values(data);
            resolve();
        }).catch(err => console.log(err));
    })
}
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
fk_id_mrc_prodM.addEventListener('change', () => {
    if (fk_id_mrc_prodM.value == '15') {
        divCodigoSMCM.removeAttribute('hidden');
    } else {
        divCodigoSMCM.setAttribute('hidden', '');
    }
});
/******************************************TABLE LIST PRICE******************************************/
const tablePriceList = document.getElementById('tablePriceList');
const closetablePriceList = document.getElementById('closetablePriceList');
const tbodyPriceList = document.getElementById('tbodyPriceList');
closetablePriceList.addEventListener('click', closePriceList);
function openPriceList() {
    tablePriceList.classList.add('modal__show');
}
function closePriceList() {
    tablePriceList.classList.remove('modal__show');
}
//-----read prices
let prices = [];
let filterPrices = [];
async function readPrices() {
    return new Promise((resolve, reject) => {
        let formData = new FormData();
        formData.append('readPrices', '');
        fetch('../controladores/proforma.php', {
            method: "POST",
            body: formData
        }).then(response => response.json()).then(data => {
            prices = Object.values(data);
            filterPrices = prices;
            paginacionPriceList(filterPrices.length, 1);
            resolve();
        }).catch(err => console.log(err));
    })
}
//------buscar por input
const inputSearchPriceList = document.getElementById("inputSearchPriceList");
inputSearchPriceList.addEventListener("keyup", searchPriceList);
//------Proformas por pagina
const selectNumberPriceList = document.getElementById('selectNumberPriceList');
selectNumberPriceList.selectedIndex = 3;
selectNumberPriceList.addEventListener('change', function () {
    paginacionPriceList(filterPrices.length, 1);
});
//------buscar por:
function searchPriceList() {
    const busqueda = inputSearchPriceList.value.toLowerCase().trim();
    filterPrices = prices.filter(price => {
        return (
            price.modelo.toLowerCase().includes(busqueda)
        );
    });
    paginacionPriceList(filterPrices.length, 1);
}
//------PaginacionPriceList
function paginacionPriceList(allProducts, page) {
    let numberProducts = Number(selectNumberPriceList.value);
    let allPages = Math.ceil(allProducts / numberProducts);
    let ul = document.querySelector('#wrapperPriceList ul');
    let li = '';
    let beforePages = page - 1;
    let afterPages = page + 1;
    let liActive;
    if (page > 1) {
        li += `<li class="btn" onclick="paginacionPriceList(${allProducts}, ${page - 1})"><img src="../imagenes/arowLeft.svg"></li>`;
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
        li += `<li class="numb ${liActive}" onclick="paginacionPriceList(${allProducts}, ${pageLength})"><span>${pageLength}</span></li>`;
    }
    if (page < allPages) {
        li += `<li class="btn" onclick="paginacionPriceList(${allProducts}, ${page + 1})"><img src="../imagenes/arowRight.svg"></li>`;
    }
    ul.innerHTML = li;
    let h2 = document.querySelector('#showPagePriceList h2');
    h2.innerHTML = `Pagina ${page}/${allPages}, ${allProducts} Productos`;
    tablePrices(page);
}
//--------Tabla de proforma
function tablePrices(page) {
    const tbody = document.getElementById('tbodyPriceList');
    const inicio = (page - 1) * Number(selectNumberPriceList.value);
    const final = inicio + Number(selectNumberPriceList.value);
    const product = filterPrices.slice(inicio, final);
    tbody.innerHTML = '';
    product.forEach((prod, index) => {
        const tr = document.createElement('tr');

        const tdNumero = document.createElement('td');
        tdNumero.innerText = index + 1;
        tr.appendChild(tdNumero);

        const modelo = document.createElement('td');
        modelo.innerText = prod.modelo;
        tr.appendChild(modelo);

        const precioLista = document.createElement('td');
        precioLista.innerText = Math.round(prod.precio);
        tr.appendChild(precioLista);

        const precioVenta = document.createElement('td');
        precioVenta.innerText = Math.round(prod.precio * 1.1);
        precioVenta.setAttribute('style', 'background-color:rgba(6, 245, 38, 0.41)');
        tr.appendChild(precioVenta);

        tbody.appendChild(tr);
    });
}

//********* USUARIO ***********/
//------Leer tabla de usuarios
let users = [];
async function readUsers() {
    return new Promise((resolve) => {
        let formData = new FormData();
        formData.append('readUsers', '');
        fetch('../controladores/usuarios.php', {
            method: "POST",
            body: formData
        }).then(response => response.json()).then(data => {
            users = data;
            resolve();
        }).catch(err => {
            mostrarAlerta('Ocurrio un error al cargar la tabla de usuarios, cargue nuevamente la pagina');
        });
    });
}




function cartProduct_cppdM(product, id_cmp) {
    let body = document.getElementById('productBuyMW').querySelector('.modal__body');
    let div = document.createElement('div');
    div.classList.add('cart__item');
    div.innerHTML = `
            <input type="hidden" value="">
            <input type="hidden" value="${product['id_prod']}">
            <input type="hidden" value="${id_cmp}">
            <p class="numero--addProd"> - </p>
            <img src="../modelos/imagenes/${product['imagen_prod']}" alt="" class="imagen--addProd"/>
            <p class="codigo--addProd">${product['codigo_prod']}</p>
            <textarea class="cart__item--name">${product['nombre_prod']}</textarea>
            <input type="number" value = "1" min="1" onChange="changeQuantityCPPD(this.parentNode, ${id_cmp})" class="cart__item--quantity">
            <input type="number" value = "${product['cost_uni_inv']}" onChange="changeQuantityCPPD(this.parentNode, ${id_cmp})" class="cart__item--costUnit">
            <input type="number" value = "${product['cost_uni_inv']}" class="cart__item--costTotal" readonly>
            <input type="text" class="cart__item--observacion">
            <img src="../imagenes/plus.svg" onClick="createCmp_prod(this.parentNode)" class='icon__CRUD'>`;
    body.appendChild(div);
}