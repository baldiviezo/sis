//--------------------------------------------Restricciones de usuario----------------------------------------------
if (localStorage.getItem('rol_usua') == 'Ingeniero' || localStorage.getItem('rol_usua') == 'Gerente De Inventario') {
} else if (localStorage.getItem('rol_usua') == 'Administrador') {
} else if (localStorage.getItem('rol_usua') == 'Gerente general') {
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
//-------------------------------------------------------BLOCK REQUEST WITH A FLAG--------------------------------------------
let rqstNotaEntrega = false
const preloader = document.getElementById('preloader');
init();
async function init() {
    if (!rqstNotaEntrega) {
        rqstNotaEntrega = true;
        preloader.classList.add('modal__show');
        try {   
            await Promise.all([
                readAllMarcas(),
                readAllCategorias(),
                readInventories(),
                readCustomers(),
                readProducts(),
                readOrderBuys(),
                readProformas(),
                readOcProd(),
                readUsers(),
                readEnterprises(),
                readNotasEntrega(),
                readNte_prods()
            ]);
            paginacionOrdenCompra(orderBuys.length, 1);
            paginacionInventoryMW(inventories.length, 1);
            paginacionNotaEntrega(notasEntrega.length, 1);
            paginacionNteProd(filterNte_prods.length, 1);
            paginacionOCPd(filterOCProds.length, 1);
            rqstNotaEntrega = false;
            preloader.classList.remove('modal__show');
        } catch (error) {
            console.log(error);
            mostrarAlerta('Ocurrio un error al cargar la tabla de notas de entrega. Cargue nuevamente la pagina.');
        }
    }
}
//---------------------------------------------MODAL DE NOTA DE ENTREGA------------------------------------------------
const prof_prodMW = document.getElementById('prof_prodMW');
const closeProf_prodMW = document.getElementById('closeProf_prodMW');
const titleProf_prodMW = document.getElementById('titleProf_prodMW');
const titleAlmacenMW = document.getElementById('titleAlmacenMW');
const openNotaEntregaRMW = (id_oc) => {
    const ordenCompra = orderBuys.find(orderBuy => orderBuy.id_oc == id_oc);
    titleAlmacenMW.innerText = (ordenCompra.almacen_oc === 0) ? 'El Alto' : 'Arce';
    titleProf_prodMW.innerText = `${ordenCompra.numero_oc}`
    prof_prodMW.classList.add('modal__show');
    readOc_prod(id_oc);
}
closeProf_prodMW.addEventListener('click', () => {
    prof_prodMW.classList.remove('modal__show');
})
//---------------------------------------------------------ORDEN DE COMPRA---------------------------------------------------
let orderBuys = [];
let filterOrderBuys = [];
async function readOrderBuys() {
    return new Promise((resolve, reject) => {
        let formData = new FormData();
        formData.append('readOrderBuys', '');
        fetch('../controladores/notaEntrega.php', {
            method: "POST",
            body: formData
        }).then(response => response.json()).then(data => {
            orderBuys = data;
            filterOrderBuys = data;
            createYearOC();
            resolve();
        }).catch(err => console.log(err));
    })
}
//------Select utilizado para buscar por columnas
const selectSearchOC = document.getElementById('selectSearchOC');
selectSearchOC.addEventListener('change', searchOrdenCompra);
//------buscar por input
const inputSearchOC = document.getElementById("inputSearchOC");
inputSearchOC.addEventListener("keyup", searchOrdenCompra);
//------Proformas por pagina
const selectNumberOC = document.getElementById('selectNumberOC');
selectNumberOC.selectedIndex = 3;
selectNumberOC.addEventListener('change', function () {
    paginacionOrdenCompra(filterProformas.length, 1);
});
//-------Estado de orden de compra
const selectStateOC = document.getElementById('selectStateOC');
selectStateOC.addEventListener('change', searchOrdenCompra);
//------buscar por:
function searchOrdenCompra() {
    const valor = selectSearchOC.value;
    const busqueda = inputSearchOC.value.toLowerCase().trim();

    filterOrderBuys = orderBuys.filter(ordenBuy => {
        const proforma = proformas.find(proforma => proforma.id_prof === ordenBuy.fk_id_prof_oc);
        const cliente = customers.find(customer => customer.id_clte === ordenBuy.fk_id_clte_oc);
        const empresa = enterprises.find(enterprise => enterprise.id_emp === cliente.fk_id_emp_clte);
        const usuario = users.find(user => user.id_usua === ordenBuy.fk_id_usua_oc);

        if (valor === 'todas') {
            return (
                proforma.numero_prof.toLowerCase().includes(busqueda) ||
                ordenBuy.numero_oc.toLowerCase().includes(busqueda) ||
                ordenBuy.fecha_oc.toLowerCase().includes(busqueda) ||
                empresa.nombre_emp.toLowerCase().includes(busqueda) ||
                (usuario.nombre_usua + ' ' + usuario.apellido_usua).toLowerCase().includes(busqueda) ||
                (cliente.apellido_clte + ' ' + cliente.nombre_clte).toLowerCase().includes(busqueda)
            );
        } else if (valor === 'numero_prof') {
            return proforma.numero_prof.toLowerCase().includes(busqueda);
        } else if (valor === 'encargado') {
            return (usuario.nombre_usua + ' ' + usuario.apellido_usua).toLowerCase().includes(busqueda);
        } else if (valor === 'cliente') {
            return (cliente.apellido_clte + ' ' + cliente.nombre_clte).toLowerCase().includes(busqueda);
        } else if (valor === 'nombre_emp') {
            return empresa.nombre_emp.toLowerCase().includes(busqueda);
        } else {
            return ordenBuy[valor].toLowerCase().includes(busqueda);
        }
    });
    selectStateOrdenCompra();
}
function createYearOC() {
    const anios = Array.from(new Set(orderBuys.map(orderBuy => orderBuy.fecha_oc.split('-')[0])));
    // Crear opciones para selectYearOC
    selectYearOC.innerHTML = '';
    const optionFirst = document.createElement('option');
    optionFirst.value = 'todas';
    optionFirst.innerText = 'Todos los años';
    selectYearOC.appendChild(optionFirst);
    for (let anio of anios) {
        const option = document.createElement('option');
        option.value = anio;
        option.textContent = anio;
        selectYearOC.appendChild(option);
    }

    // Crear opciones para selectYearOC
    selectYearOCProd.innerHTML = '';
    const optionFirstOCProd = document.createElement('option');
    optionFirstOCProd.value = 'todas';
    optionFirstOCProd.innerText = 'Todos los años';
    selectYearOCProd.appendChild(optionFirstOCProd);
    for (let anio of anios) {
        const option = document.createElement('option');
        option.value = anio;
        option.textContent = anio;
        selectYearOCProd.appendChild(option);
    }
}
//------seleccionar el año
const selectYearOC = document.getElementById('selectYearOC');
selectYearOC.addEventListener('change', searchOrdenCompra);
const selectMonthOC = document.getElementById('selectMonthOC');
selectMonthOC.addEventListener('change', searchOrdenCompra);
//------buscar por marca y categoria:
function selectStateOrdenCompra() {
    filterOrderBuys = filterOrderBuys.filter(orderBuy => {
        const estado = selectStateOC.value === 'todasLasOC' ? true : orderBuy.estado_oc == selectStateOC.value;
        const fecha = selectYearOC.value === 'todas' ? true : orderBuy.fecha_oc.split('-')[0] === selectYearOC.value;
        const mes = selectMonthOC.value === 'todas' ? true : orderBuy.fecha_oc.split('-')[1] === selectMonthOC.value;
        return estado && fecha && mes;
    });
    paginacionOrdenCompra(filterOrderBuys.length, 1);
}
//------Ordenar tabla descendente ascendente
const orderOrdenCompra = document.querySelectorAll('.tbody__head--OC');
orderOrdenCompra.forEach(div => {
    div.children[0].addEventListener('click', function () {
        filterOrderBuys.sort((a, b) => {
            let first = a[div.children[0].name].toString().toLowerCase();
            let second = b[div.children[0].name].toString().toLowerCase();
            if (first < second) { return -1 }
            if (first > second) { return 1 }
            return 0;
        });
        paginacionOrdenCompra(filterOrderBuys.length, 1);
    });
    div.children[1].addEventListener('click', function () {
        filterOrderBuys.sort((a, b) => {
            let first = a[div.children[0].name].toString().toLowerCase();
            let second = b[div.children[0].name].toString().toLowerCase();
            if (first > second) { return -1 }
            if (first < second) { return 1 }
            return 0;
        });
        paginacionOrdenCompra(filterOrderBuys.length, 1);
    });
});
//------PaginacionOrdenCompra
function paginacionOrdenCompra(allProducts, page) {
    let numberProducts = Number(selectNumberOC.value);
    let allPages = Math.ceil(allProducts / numberProducts);
    let ul = document.querySelector('#wrapperOC ul');
    let li = '';
    let beforePages = page - 1;
    let afterPages = page + 1;
    let liActive;
    if (page > 1) {
        li += `<li class="btn" onclick="paginacionOrdenCompra(${allProducts}, ${page - 1})"><img src="../imagenes/arowLeft.svg"></li>`;
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
        li += `<li class="numb ${liActive}" onclick="paginacionOrdenCompra(${allProducts}, ${pageLength})"><span>${pageLength}</span></li>`;
    }
    if (page < allPages) {
        li += `<li class="btn" onclick="paginacionOrdenCompra(${allProducts}, ${page + 1})"><img src="../imagenes/arowRight.svg"></li>`;
    }
    ul.innerHTML = li;
    let h2 = document.querySelector('#showPageOC h2');
    h2.innerHTML = `Pagina ${page}/${allPages}, ${allProducts} Ordens de Compra`;
    tableOrdenCompra(page);
}
//--------Tabla de Orden de Compra
const tbodyOC = document.getElementById('tbodyOC');
const totalOC = document.getElementById('totalOC');
function tableOrdenCompra(page) {
    let total = 0;
    filterOrderBuys.forEach(orderBuy => {
        total += orderBuy.total_oc;
    });
    totalOC.innerHTML = `Total (Bs): ${total.toFixed(2)} Bs`;

    const inicio = (page - 1) * Number(selectNumberOC.value);
    const final = inicio + Number(selectNumberOC.value);
    const orderBuys = filterOrderBuys.slice(inicio, final);
    tbodyOC.innerHTML = '';

    orderBuys.forEach((orderBuy, index) => {

        const proforma = proformas.find(proforma => proforma.id_prof === orderBuy.fk_id_prof_oc);
        const cliente = customers.find(customer => customer.id_clte === orderBuy.fk_id_clte_oc);
        const usuario = users.find(user => user.id_usua === orderBuy.fk_id_usua_oc);
        const empresa = enterprises.find(enterprise => enterprise.id_emp === cliente.fk_id_emp_clte);
        const tr = document.createElement('tr');

        tr.setAttribute('id_oc', orderBuy.id_oc);

        const tdNumero = document.createElement('td');
        tdNumero.innerText = index + 1;
        tr.appendChild(tdNumero);

        const tdSucursal = document.createElement('td');
        tdSucursal.innerText = (orderBuy.almacen_oc === 0) ? 'El Alto' : 'Arce';
        tr.appendChild(tdSucursal);

        const tdNumeroOC = document.createElement('td');
        tdNumeroOC.innerText = orderBuy.numero_oc;
        tr.appendChild(tdNumeroOC);

        const tdFecha = document.createElement('td');
        tdFecha.innerText = orderBuy.fecha_oc;
        tr.appendChild(tdFecha);

        const tdNumeroProforma = document.createElement('td');
        tdNumeroProforma.innerText = proforma.numero_prof;
        tr.appendChild(tdNumeroProforma);

        const tdEncargado = document.createElement('td');
        tdEncargado.innerText = usuario.nombre_usua + ' ' + usuario.apellido_usua;
        tr.appendChild(tdEncargado);

        const tdEmpresa = document.createElement('td');
        tdEmpresa.innerText = empresa.nombre_emp;
        tr.appendChild(tdEmpresa);

        const tdCliente = document.createElement('td');
        tdCliente.innerText = cliente.apellido_clte + ' ' + cliente.nombre_clte;
        tr.appendChild(tdCliente);

        const tdTotal = document.createElement('td');
        tdTotal.innerText = orderBuy.total_oc + ' ' + orderBuy.moneda_oc;
        tr.appendChild(tdTotal);

        const tdOC = document.createElement('td');
        tdOC.innerText = orderBuy.orden_oc;
        tr.appendChild(tdOC);

        const tdObservacion = document.createElement('td');
        tdObservacion.innerText = orderBuy.observacion_oc;
        tr.appendChild(tdObservacion);

        const tdAcciones = document.createElement('td');
        const fragment = document.createDocumentFragment();

        let imgs = [];

        if (orderBuy.estado_oc === 1) {
            imgs = [
                { src: '../imagenes/pdf.svg', onclick: `pdfOrdenCompra(${orderBuy.id_oc})`, title: 'PDF' }
            ];
        } else if (orderBuy.estado_oc === 0) {
            if (['Administrador', 'Gerente general'].includes(localStorage.getItem('rol_usua'))) {
                imgs = [
                    { src: '../imagenes/notaEntrega.svg', onclick: `openNotaEntregaRMW(${orderBuy.id_oc})`, title: 'Generar Nota de Entrega' },
                    { src: '../imagenes/pdf.svg', onclick: `pdfOrdenCompra(${orderBuy.id_oc})`, title: 'PDF' },
                    { src: '../imagenes/trash.svg', onclick: `deleteOrderBuy(${orderBuy.id_oc})`, title: 'Eliminar' }
                ];
            } else if (['Ingeniero', 'Gerente De Inventario'].includes(localStorage.getItem('rol_usua'))) {
                imgs = [
                    { src: '../imagenes/notaEntrega.svg', onclick: `openNotaEntregaRMW(${orderBuy.id_oc})`, title: 'Generar Nota de Entrega' },
                    { src: '../imagenes/pdf.svg', onclick: `pdfOrdenCompra(${orderBuy.id_oc})`, title: 'PDF' }
                ];
            }
        }

        imgs.forEach((img) => {
            const imgElement = document.createElement('img');
            imgElement.src = img.src;
            imgElement.onclick = new Function(img.onclick);
            imgElement.title = img.title;
            fragment.appendChild(imgElement);
        });

        tdAcciones.appendChild(fragment);
        tr.appendChild(tdAcciones);

        tbodyOC.appendChild(tr);
    });
}
//-------------------------------------------PDF DE ORDEN DE COMPRA------------------------------------------------
function pdfOrdenCompra(id_oc) {
    const ordenCompra = orderBuys.find(orderBuy => orderBuy.id_oc === id_oc);
    const productos = oc_prods.filter(oc_prod => oc_prod.fk_id_oc_ocpd === id_oc);
    const objetos = [];
    productos.forEach(oc_prod => {
        const product = products.find(product => product.id_prod === oc_prod.fk_id_prod_ocpd);
        objetos.push({
            'codigo_prod': product.codigo_prod,
            'descripcion_prod': product['nombre_prod'],
            'cantidad_ocpd': oc_prod['cantidad_ocpd'],
            'cost_uni_ocpd': oc_prod['cost_uni_ocpd']
        });
    });
    //Crear un formulario oculto
    var form = document.createElement('form');
    form.method = 'post';
    form.action = '../modelos/reportes/ordenCompraPDF.php';
    form.target = '_blank'; // Abre la página en una nueva ventana
    form.style.display = 'none'; // Oculta visualmente el formulario

    // Crea un campo oculto para la variable 
    var input1 = document.createElement('input');
    input1.type = 'hidden';
    input1.name = 'prof_mprof_ne';
    input1.value = JSON.stringify(ordenCompra); // Reemplaza con el valor real

    // Crea un campo oculto para la variable pf_pd
    var input2 = document.createElement('input');
    input2.type = 'hidden';
    input2.name = 'pf_pd';
    input2.value = JSON.stringify(objetos); // Reemplaza con el valor real

    // Crea un campo oculto para la variable pdf
    var input3 = document.createElement('input');
    input3.type = 'hidden';
    input3.name = 'pdf';
    input3.value = 'oc'; // Reemplaza con el valor real

    // Agrega los campos al formulario
    form.appendChild(input1);
    form.appendChild(input2);
    form.appendChild(input3);
    // Agrega el formulario al cuerpo del documento HTML
    document.body.appendChild(form);
    // Submitir el formulario
    form.submit();
}
//------Finalizar orden de compra
const finalizarOC = document.getElementById('finalizarOC');
finalizarOC.addEventListener('click', () => {
    let i = 0;
    const productos = oc_prods.filter(oc_prod => oc_prod.fk_id_oc_ocpd === golbalIdOc);
    productos.forEach(oc_prod => {
        const entregados = nte_prods.filter(nte_prod => nte_prod.fk_id_ocpd_nepd === oc_prod.id_ocpd);
        let entregadosCantidad = 0;
        entregados.forEach(nte_prod => {
            entregadosCantidad += nte_prod.cantidad_nepd;
        })
        if (entregadosCantidad != oc_prod.cantidad_ocpd) {
            i++;
        }
    })

    if (i == 0) {
        prof_prodMW.classList.remove('modal__show');
        let formData = new FormData();
        formData.append('finalizarOC', golbalIdOc);
        fetch('../controladores/notaEntrega.php', {
            method: "POST",
            body: formData
        }).then(response => response.text()).then(data => {
            readOrderBuys().then(() => {
                paginacionOrdenCompra(filterOCProds.length, 1);
                mostrarAlerta(data);
            })

        }).catch(err => console.log(err));
    }
})
//------Delete orden de compra
function deleteOrderBuy(id_oc) {
    console.log(id_oc)
}
//-----------------------------------------------TABLE OC_PROD---------------------------------------------------------
//-----------------------------------------READ OC_PROD
let oc_prods = [];
let filterOCProds = [];
function readOcProd() {
    return new Promise((resolve, reject) => {
        let formData = new FormData();
        formData.append('readOcProd', '');
        fetch('../controladores/notaEntrega.php', {
            method: "POST",
            body: formData
        }).then(response => response.json()).then(data => {
            oc_prods = data;
            filterOCProds = oc_prods;
            resolve();
        }).catch(err => console.log(err));
    })
}
//------------------------------------------------TABLE PRODUCT FILTER---------------------------------------
//------Select utilizado para buscar por columnas
const selectSearchOCProd = document.getElementById('selectSearchOCProd');
selectSearchOCProd.addEventListener('change', searchOCProd);
//------buscar por input
const inputSearchOCProd = document.getElementById("inputSearchOCProd");
inputSearchOCProd.addEventListener("keyup", searchOCProd);
//------Proformas por pagina
const selectNumberOCProd = document.getElementById('selectNumberOCProd');
selectNumberOCProd.selectedIndex = 3;
selectNumberOCProd.addEventListener('change', function () {
    paginacionOCPd(filterOCProds.length, 1);
});
//------buscar por:
function searchOCProd() {
    const busqueda = inputSearchOCProd.value.toLowerCase().trim();
    const valor = selectSearchOCProd.value.toLowerCase().trim();
    filterOCProds = oc_prods.filter(oc_prod => {
        const ordenCompra = orderBuys.find(ordenCompra => ordenCompra.id_oc === oc_prod.fk_id_oc_ocpd);
        const producto = products.find(product => product.id_prod === oc_prod.fk_id_prod_ocpd);
        if (valor == 'todas') {
            return (
                ordenCompra.numero_oc.toLowerCase().includes(busqueda) ||
                ordenCompra.fecha_oc.toLowerCase().includes(busqueda) ||
                producto.codigo_prod.toString().toLowerCase().includes(busqueda)
            )
        } else if (valor == 'codigo_prod') {
            return producto.codigo_prod.toString().toLowerCase().includes(busqueda);
        } else {
            return ordenCompra[valor].toLowerCase().includes(busqueda);
        }
    });
    selectStateProductOC();
}
//------Seleccionar el año
const selectYearOCProd = document.getElementById('selectYearOCProd');
selectYearOCProd.addEventListener('change', searchOCProd);
//-------Estado de oc_prods
const selectStateOCProd = document.getElementById('selectStateOCProd');
selectStateOCProd.addEventListener('change', searchOCProd);
const selectMonthOCProd = document.getElementById('selectMonthOCProd');
selectMonthOCProd.addEventListener('change', searchOCProd);
function selectStateProductOC() {
    filterOCProds = filterOCProds.filter(OCProd => {
        const ordenCompra = orderBuys.find(ordenCompra => ordenCompra.id_oc === OCProd.fk_id_oc_ocpd);
        const estado = selectStateOCProd.value === 'todas' ? true : ordenCompra.estado_oc == selectStateOCProd.value;
        const fecha = selectYearOCProd.value === 'todas' ? true : ordenCompra.fecha_oc.split('-')[0] === selectYearOCProd.value;
        const mes = selectMonthOCProd.value === 'todas' ? true : ordenCompra.fecha_oc.split('-')[1] === selectMonthOCProd.value;
        return estado && fecha && mes;
    });
    paginacionOCPd(filterOCProds.length, 1);
}
//------Ordenar tabla descendente ascendente
const orderOCPd = document.querySelectorAll('.tbody__head--OCProd');
orderOCPd.forEach(div => {
    div.children[0].addEventListener('click', function () {
        const valor = div.children[0].name;
        filterOCProds.sort((a, b) => {
            const ordenCompraA = orderBuys.find(ordenCompra => ordenCompra.id_prof == a.fk_id_prof_ocpd);
            const ordenCompraB = orderBuys.find(ordenCompra => ordenCompra.id_prof == b.fk_id_prof_ocpd);
            const valorA = String(ordenCompraA[valor]);
            const valorB = String(ordenCompraB[valor]);
            return valorA.localeCompare(valorB);
        });
        paginacionOCPd(filterOCProds.length, 1);
    });
    div.children[1].addEventListener('click', function () {
        const valor = div.children[0].name;
        filterOCProds.sort((a, b) => {
            const ordenCompraA = orderBuys.find(ordenCompra => ordenCompra.id_prof == a.fk_id_prof_pfpd);
            const ordenCompraB = orderBuys.find(ordenCompra => ordenCompra.id_prof == b.fk_id_prof_pfpd);
            const valorA = String(ordenCompraA[valor]);
            const valorB = String(ordenCompraB[valor]);
            return valorB.localeCompare(valorA);
        });
        paginacionOCPd(filterOCProds.length, 1);
    });
});
//------
const totalOCProd = document.getElementById('totalOCProd');
function paginacionOCPd(allProducts, page) {
    let total = 0;
    filterOCProds.forEach(oc_prod => {
        const ordenCompra = orderBuys.find(ordenCompra => ordenCompra.id_oc === oc_prod.fk_id_oc_ocpd);
        total += oc_prod.cantidad_ocpd * oc_prod.cost_uni_ocpd * (100 - ordenCompra.descuento_oc) / 100;
    })
    totalOCProd.innerHTML = `Total: ${total.toFixed(2)} Bs`;
    let numberProducts = Number(selectNumberOCProd.value);
    let allPages = Math.ceil(allProducts / numberProducts);
    let ul = document.querySelector('#wrapperOCProd ul');
    let li = '';
    let beforePages = page - 1;
    let afterPages = page + 1;
    let liActive;
    if (page > 1) {
        li += `<li class="btn" onclick="paginacionOCPd(${allProducts}, ${page - 1})"><img src="../imagenes/arowLeft.svg"></li>`;
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
        li += `<li class="numb ${liActive}" onclick="paginacionOCPd(${allProducts}, ${pageLength})"><span>${pageLength}</span></li>`;
    }
    if (page < allPages) {
        li += `<li class="btn" onclick="paginacionOCPd(${allProducts}, ${page + 1})"><img src="../imagenes/arowRight.svg"></li>`;
    }
    ul.innerHTML = li;
    let h2 = document.querySelector('#showPageOCProd h2');
    h2.innerHTML = `Pagina ${page}/${allPages}, ${allProducts} Productos`;
    tableOCProd(page);
}
//--------Tabla de oc_prods
function tableOCProd(page) {
    const tbody = document.getElementById('tbodyOCProd');
    const inicio = (page - 1) * Number(selectNumberOCProd.value);
    const final = inicio + Number(selectNumberOCProd.value);
    const prods = filterOCProds.slice(inicio, final);
    tbody.innerHTML = '';
    prods.forEach((prod, index) => {
        const ordenCompra = orderBuys.find(ordenCompra => ordenCompra.id_oc == prod.fk_id_oc_ocpd);
        const producto = products.find(product => product.id_prod == prod.fk_id_prod_ocpd);

        const tr = document.createElement('tr');
        tr.setAttribute('id_ocpd', prod.id_ocpd);

        const tdNumero = document.createElement('td');
        tdNumero.innerText = inicio + index + 1;
        tr.appendChild(tdNumero);

        const tdNumeroOrdenCompra = document.createElement('td');
        tdNumeroOrdenCompra.innerText = ordenCompra.numero_oc;
        tr.appendChild(tdNumeroOrdenCompra);

        const tdFechaOrdenCompra = document.createElement('td');
        tdFechaOrdenCompra.innerText = ordenCompra.fecha_oc;
        tr.appendChild(tdFechaOrdenCompra);

        const tdCodigo = document.createElement('td');
        tdCodigo.innerText = producto.codigo_prod;
        tr.appendChild(tdCodigo);

        const tdCantidad = document.createElement('td');
        tdCantidad.innerText = prod.cantidad_ocpd;
        tr.appendChild(tdCantidad);

        const tdCostoUnitario = document.createElement('td');
        tdCostoUnitario.innerText = `${prod.cost_uni_ocpd} ${ordenCompra.moneda_oc}`;
        tr.appendChild(tdCostoUnitario);

        const tdSubTotal = document.createElement('td');
        const subTotal = prod.cost_uni_ocpd * prod.cantidad_ocpd;
        tdSubTotal.innerText = `${subTotal.toFixed(2)} ${ordenCompra.moneda_oc}`;
        tr.appendChild(tdSubTotal);

        const tdDescuento = document.createElement('td');
        const desc = ordenCompra.descuento_oc * prod.cost_uni_ocpd * prod.cantidad_ocpd / 100;
        tdDescuento.innerText = `-${desc.toFixed(2)} ${ordenCompra.moneda_oc} (${ordenCompra.descuento_oc}%)`;
        tr.appendChild(tdDescuento);

        const tdTotal = document.createElement('td');
        const total = prod.cantidad_ocpd * prod.cost_uni_ocpd * (100 - ordenCompra.descuento_oc) / 100;
        tdTotal.innerText = `${total.toFixed(2)} ${ordenCompra.moneda_oc}`;
        tr.appendChild(tdTotal);

        tbody.appendChild(tr);
    });
}
//------open and close tabla de oc_prod
const openTableOCProdMW = document.querySelector('#openTableOCProdMW');
const closeTableOCProdMW = document.querySelector('#closeTableOCProdMW');
const tableOCProdMW = document.querySelector('#tableOCProdMW');
openTableOCProdMW.addEventListener('click', () => {
    tableOCProdMW.classList.add('modal__show');
});
closeTableOCProdMW.addEventListener('click', () => {
    tableOCProdMW.classList.remove('modal__show');
});
//-------------------------------MODAL DE OC_PROD---------------------------------------------
//------read oc_prod
const cartsProf_prodMW = document.querySelector('#cartsProf_prodMW');
const button__prof_prodMW = document.querySelector('#button__prof_prodMW');
let golbalIdOc = 0;
function readOc_prod(id_oc) {
    golbalIdOc = id_oc;
    cartsProf_prodMW.innerHTML = '';
    const productos = oc_prods.filter(oc_prod => oc_prod['fk_id_oc_ocpd'] == id_oc);
    productos.forEach(oc_prod => {
        const card = cartProduct_ocpd(oc_prod, totalPriceM);
        if (card) {
            cartsProf_prodMW.appendChild(card);
        }
    })
    //------Si no hay productos en la orden de compra, mostrar mensaje
    if (cartsProf_prodMW.children.length === 0) {
        const p = document.createElement('p');
        p.classList.add('cart__item--empty');
        p.textContent = 'Todos los productos de esta orden de compra ya fueron entregados.';
        cartsProf_prodMW.appendChild(p);
    }
    //Drang and drop
    const items = cartsProf_prodMW.querySelectorAll(".cart-item");
    items.forEach(item => {
        item.addEventListener("dragstart", () => {
            setTimeout(() => item.classList.add("dragging"), 0);
        });
        item.addEventListener("dragend", () => item.classList.remove("dragging"));
    });
    cartsProf_prodMW.addEventListener("dragover", initSortableListM);
    cartsProf_prodMW.addEventListener("dragenter", e => e.preventDefault());

    totalPriceM();
}
const initSortableListM = (e) => {
    e.preventDefault();
    const draggingItem = document.querySelector(".dragging");

    let siblings = [...cartsProf_prodMW.querySelectorAll(".cart-item:not(.dragging)")];

    let nextSibling = siblings.find(sibling => {
        const rect = sibling.getBoundingClientRect();
        return e.clientY <= rect.top + rect.height / 2;
    });

    cartsProf_prodMW.insertBefore(draggingItem, nextSibling);
}
//------Abrir modal de la card
function cartProduct_ocpd(oc_prod, total) {
    // buscar si el producto ya fue entregado parcial o total mente
    const entregados = nte_prods.filter(nte_prod => nte_prod.fk_id_ocpd_nepd === oc_prod.id_ocpd);
    let entregadosCantidad = 0;
    // Del array entregados obtener la cantidad de productos entregados
    if (entregados.length > 0) {
        entregadosCantidad = entregados.reduce((acc, nte_prod) => acc + nte_prod.cantidad_nepd, 0);
    }
    const cantidad_ocpd = oc_prod.cantidad_ocpd - entregadosCantidad;
    if (cantidad_ocpd > 0) {
        const ordenCompra = orderBuys.find(orderBuy => orderBuy.id_oc === oc_prod.fk_id_oc_ocpd);
        const product = products.find(product => product.id_prod === oc_prod.fk_id_prod_ocpd);
        if (product) {
            const inventoriesAlto = inventories.filter(inventory => inventory.fk_id_prod_inv === product.id_prod && inventory.ubi_almacen === 0);
            const inventoriesArce = inventories.filter(inventory => inventory.fk_id_prod_inv === product.id_prod && inventory.ubi_almacen === 1);

            const cantidad_invAlto = inventoriesAlto.length > 0 ? inventoriesAlto[0].cantidad_inv : 0;
            const cantidad_invArce = inventoriesArce.length > 0 ? inventoriesArce[0].cantidad_inv : 0;

            const card = document.createElement('div');
            card.classList.add('cart-item');
            card.setAttribute('id_ocpd', oc_prod.id_ocpd);
            card.setAttribute('draggable', 'true');

            const cantidadInvParagraph = document.createElement('p');
            cantidadInvParagraph.classList.add('cart-item__cantInv');

            if (ordenCompra.almacen_oc === 0) {
                cantidadInvParagraph.textContent = cantidad_invAlto
            } else if (ordenCompra.almacen_oc === 1) {
                cantidadInvParagraph.textContent = cantidad_invArce;
            }
            card.appendChild(cantidadInvParagraph);

            const rowImgDiv = document.createElement('div');
            rowImgDiv.classList.add('row-img');
            const img = document.createElement('img');
            img.src = `../modelos/imagenes/${product.imagen_prod}`;
            img.classList.add('rowimg');
            rowImgDiv.appendChild(img);
            card.appendChild(rowImgDiv);

            const codigoParagraph = document.createElement('p');
            codigoParagraph.classList.add('cart-item__codigo');
            codigoParagraph.textContent = product.codigo_prod;
            card.appendChild(codigoParagraph);

            function updateCostTotal(cantidadInput, costUnitInput, costTotalInput) {
                const cantidad = parseInt(cantidadInput.value);
                const costUnit = parseFloat(costUnitInput.value);
                const costTotal = cantidad * costUnit;
                costTotalInput.value = costTotal;
                total();
            }

            const cantidadInput = document.createElement('input');
            cantidadInput.type = 'number';
            cantidadInput.value = cantidad_ocpd;
            cantidadInput.min = '1';
            cantidadInput.max = cantidad_ocpd;
            cantidadInput.classList.add('cart-item__cantidad');
            cantidadInput.addEventListener('change', (e) => {
                const costUnitInput = e.target.parentNode.querySelector('.cart-item__costUnit');
                const costTotalInput = e.target.parentNode.querySelector('.cart-item__costTotal');
                updateCostTotal(e.target, costUnitInput, costTotalInput);
            });
            card.appendChild(cantidadInput);

            const costUnitInput = document.createElement('input');
            costUnitInput.type = 'number';
            costUnitInput.value = oc_prod.cost_uni_ocpd;
            costUnitInput.classList.add('cart-item__costUnit');
            costUnitInput.addEventListener('change', (e) => {
                const cantidadInput = e.target.parentNode.querySelector('.cart-item__cantidad');
                const costTotalInput = e.target.parentNode.querySelector('.cart-item__costTotal');
                updateCostTotal(cantidadInput, e.target, costTotalInput);
            });
            costUnitInput.readOnly = true;
            card.appendChild(costUnitInput);

            const costTotalInput = document.createElement('input');
            costTotalInput.type = 'number';
            costTotalInput.value = oc_prod.cost_uni_ocpd * cantidad_ocpd;
            costTotalInput.classList.add('cart-item__costTotal');
            costTotalInput.readOnly = true;
            card.appendChild(costTotalInput);

            const checkbox = document.createElement('input');
            checkbox.type = 'checkbox';
            checkbox.checked = true;
            checkbox.classList.add('icon__checkbox');
            card.appendChild(checkbox);
            return card;
        }
    } else {
        //hay que retornar algo
        return null;
    }
}
const numberCPRMW = prof_prodMW.querySelector('div.modal__body--number');
const subTotal_pfpd = document.getElementById('subTotal_pfpd');
const desc_pfpd = document.getElementById('desc_pfpd');
const total_pfpd = document.getElementById('total_pfpd');
const count_pfpd = document.getElementById('count_pfpd');
function totalPriceM() {
    const divs = cartsProf_prodMW.querySelectorAll('div.cart-item');
    let total = 0;
    let moneda = '';
    let descuento = 0;
    divs.forEach(div => {
        costo = Number(div.querySelector('.cart-item__costTotal').value);
        total = total + costo;
    })

    const ordenCompra = orderBuys.find(orderBuy => orderBuy.id_oc == golbalIdOc);
    moneda = ordenCompra.moneda_oc;
    descuento = ordenCompra.descuento_oc

    subTotal_pfpd.innerHTML = `Sub-Total(${moneda}): ${total.toFixed(2)} ${moneda}`;
    desc_pfpd.innerHTML = `Desc. ${descuento}% (${moneda}):   ${((total * descuento) / 100).toFixed(2)} ${moneda}`;
    total_pfpd.innerHTML = `Total(${moneda}): ${((total - (total * descuento) / 100)).toFixed(2)} ${moneda}`;
    count_pfpd.innerHTML = divs.length;

    numberCPRMW.innerHTML = '';
    for (let i = 1; i <= divs.length; i++) {
        const div = document.createElement('div');
        div.classList.add('modal__body--index');
        div.innerText = i;
        numberCPRMW.appendChild(div);
    }
}
//------------------------------------MOSTRAR LOS PRODUCTOS PREVIAMENTE--------------------------------------------
const tbodyPreviewProd = document.getElementById('tbodyPreviewProd');
function openPreviwProducts() {
    cart = cartsProf_prodMW.querySelectorAll('.cart-item')

    if (cart.length > 0) {
        const productos = getProducts();
        if (!checkCantidad(productos)) { return }
        const moneda = getMoneda();
        const total = calculateTotal(productos);
        const desc = getDescuento();
        createTable(tbodyPreviewProd, productos, moneda);
        updateTotales(total, desc, moneda);
        createButton(tbodyPreviewProd);
        previewProducts.classList.add('modal__show');
    } else {
        mostrarAlerta('No a seleccionado ningun producto');
    }
}
const titleEnterprise = document.getElementById('titleEnterprise');
const titleCustomer = document.getElementById('titleCustomer');
function getProducts() {
    const ordenCompra = orderBuys.find(orderBuy => orderBuy.id_oc === golbalIdOc);
    const cliente = customers.find(customer => customer.id_clte === ordenCompra.fk_id_clte_oc);
    const empresa = enterprises.find(enterprise => enterprise.id_emp === cliente.fk_id_emp_clte);
    titleEnterprise.innerText = `EMPRESA: ${empresa.nombre_emp}`;
    titleCustomer.innerText = `CLIENTE: ${cliente.apellido_clte + ' ' + cliente.nombre_clte}`;
    // Obtener todos los productos seleccionados en la proforma que checkbox.checked = true
    return Array.from(cartsProf_prodMW.querySelectorAll('.cart-item')).filter(item => item.querySelector('.icon__checkbox').checked);
}
function checkCantidad(productos) {
    let msg = '';
    productos.forEach(producto => {
        const cantidad = Number(producto.querySelector('.cart-item__cantidad').value);
        const cmp_prod = oc_prods.find(ocp => ocp.id_ocpd == producto.getAttribute('id_ocpd'));
        const stock = Number(producto.querySelector('.cart-item__cantInv').textContent);
        // verificar si cantidad es mayor a 0 y menor o igual a la cantidad del producto en inventario
        if (cantidad > stock) {
            msg += `No hay suficiente stock para el producto ${cmp_prod.codigo_ocpd}.\n`;
        }
        // verificar si cantidad es mayor a 0 y menor o igual a la cantidad del producto en oc_prods
        if (cantidad <= 0 || cantidad > cmp_prod.cantidad_ocpd) {
            msg += `El ${cmp_prod.codigo_ocpd} debe ser mayor a 0 y menor o igual a ${cmp_prod.cantidad_ocpd}\n`;
        }
        // verificar si cantidad es un numero entero
        if (!Number.isInteger(cantidad)) {
            msg += `La cantidad de ${cmp_prod.codigo_ocpd} debe ser un número entero\n`;
        }
    });
    if (msg === '') {
        return true
    } else {
        mostrarAlerta(msg);
        return false;
    }
}
function getMoneda() {
    const ordenCompra = orderBuys.find(orderBuy => orderBuy.id_oc === golbalIdOc);
    return ordenCompra.moneda_oc;
}
function calculateTotal(productos) {
    let total = 0;
    productos.forEach(producto => {
        total += Number(producto.querySelector('.cart-item__costTotal').value);
    });
    return total;
}
function getDescuento() {
    const ordenCompra = orderBuys.find(orderBuy => orderBuy.id_oc === golbalIdOc);
    return ordenCompra.descuento_oc;
}
function createTable(tbody, productos, moneda) {
    const fragment = document.createDocumentFragment();

    productos.forEach((producto, index) => {
        const oc_prod = oc_prods.find(ocp => ocp.id_ocpd == producto.getAttribute('id_ocpd'));
        const product = products.find(prod => prod.id_prod === oc_prod.fk_id_prod_ocpd);
        const monedaSymbol = `<b>${moneda}</b>`;

        const tr = document.createElement('tr');
        tr.setAttribute('id_ocpd', producto.getAttribute('id_ocpd'));
        tr.setAttribute('id_prod', product.id_prod);

        const tdIndex = document.createElement('td');
        tdIndex.innerText = index + 1;
        tr.appendChild(tdIndex);

        const tdCodigo = document.createElement('td');
        tdCodigo.innerText = product.codigo_prod;
        tr.appendChild(tdCodigo);

        const tdDescripcion = document.createElement('td');
        tdDescripcion.innerText = product.descripcion_prod;
        tr.appendChild(tdDescripcion);

        const tdImagen = document.createElement('td');
        const img = document.createElement('img');
        img.classList.add('tbody__img');
        img.setAttribute('src', `../modelos/imagenes/${product.imagen_prod}`);
        tdImagen.appendChild(img);
        tr.appendChild(tdImagen);

        const tdCantidad = document.createElement('td');
        tdCantidad.innerText = producto.querySelector('.cart-item__cantidad').value;
        tr.appendChild(tdCantidad);

        const tdPrecio = document.createElement('td');
        tdPrecio.innerHTML = `${producto.querySelector('.cart-item__costUnit').value} ${monedaSymbol}`;
        tr.appendChild(tdPrecio);

        const tdTotal = document.createElement('td');
        tdTotal.innerHTML = `${producto.querySelector('.cart-item__costTotal').value} ${monedaSymbol}`;
        tr.appendChild(tdTotal);

        fragment.appendChild(tr);
    });

    tbody.innerHTML = '';
    tbody.appendChild(fragment);
}
function updateTotales(total, desc, moneda) {
    const footerData = [
        { value: `Sub-Total: ${total.toFixed(2)}`, id: 'subTotalPWNE' },
        { value: `Desc. ${desc}%: ${(total * desc / 100).toFixed(2)}`, id: 'descuentoPWNE' },
        { value: `Total: ${(total - (total * desc / 100)).toFixed(2)}`, id: 'totalPWNE' }
    ];

    footerData.forEach((item, index) => {
        const tr = document.createElement('tr');
        const tdLabel = document.createElement('td');
        tdLabel.setAttribute('colspan', '5');

        const tdValue = document.createElement('td');
        tdValue.setAttribute('colspan', '2');
        tdValue.id = item.id;
        tdValue.classList.add('footer__tbody');
        tdValue.innerText = `${item.value} ${moneda}`;

        tr.appendChild(tdLabel);
        tr.appendChild(tdValue);
        tbodyPreviewProd.appendChild(tr);
    });
}
function createButton(tbody) {
    const tr = document.createElement('tr');
    const tdLabel = document.createElement('td');
    const tdValue = document.createElement('td');
    const button = document.createElement('button');
    button.classList.add('button__sell--previw');
    button.innerText = 'CREAR NOTA DE ENTREGA';
    button.setAttribute('onclick', 'createNotaEntrega()');
    tdLabel.setAttribute('colspan', '6');
    tdValue.appendChild(button);
    tr.appendChild(tdLabel);
    tr.appendChild(tdValue);
    tbody.appendChild(tr);
}
//-----------------------------MODAL VISTA PREVIA DE LOS PRODUCTOS DE LA PROFORMA
const previewProducts = document.getElementById('previewProducts');
const closePreviewProducts = document.getElementById('closePreviewProducts');
closePreviewProducts.addEventListener('click', () => {
    previewProducts.classList.remove('modal__show');
});
//----------------------------------------------TABLA DE NOTA DE ENTREGA------------------------------------------------
let notasEntrega = [];
let filterNotasEntrega = [];
async function readNotasEntrega() {
    return new Promise((resolve, reject) => {
        let formData = new FormData();
        formData.append('readNotasEntrega', '');
        fetch('../controladores/notaEntrega.php', {
            method: "POST",
            body: formData
        }).then(response => response.json()).then(data => {
            const isAdmin = ['Gerente general', 'Administrador'].includes(localStorage.getItem('rol_usua'));
            notasEntrega = isAdmin ? data : data.filter(notaEntrega => notaEntrega.fk_id_usua_ne === localStorage.getItem('id_usua'));
            filterNotasEntrega = notasEntrega;
            notasEntrega.forEach(notaEntrega => {
                if (typeof notaEntrega.descuento_ne != 'number') {
                    console.log(notaEntrega);
                }
            });
            createYearNE();
            resolve();
        }).catch(err => console.log(err));
    });
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
selectNumberNe.addEventListener('change', function () {
    paginacionNotaEntrega(filterNotasEntrega.length, 1);
});
//-------Estado de proforma
const selectStateNe = document.getElementById('selectStateNe');
selectStateNe.addEventListener('change', searchNotasEntrega);
//------buscar por:
function searchNotasEntrega() {
    const busqueda = inputSearchNe.value.toLowerCase().trim();
    const valor = selectSearchNe.value.toLowerCase().trim();
    filterNotasEntrega = notasEntrega.filter(notaEntrega => {
        if (valor == 'todas') {
            const ordenCompra = orderBuys.find(ordenCompra => ordenCompra.id_oc === notaEntrega.fk_id_oc_ne);
            const usuario = users.find(user => user.id_usua === notaEntrega.fk_id_usua_ne);
            const cliente = customers.find(customer => customer.id_clte === notaEntrega.fk_id_clte_ne);
            const empresa = enterprises.find(enterprise => enterprise.id_emp === cliente.fk_id_emp_clte);
            return (
                ordenCompra.numero_oc.toLowerCase().includes(busqueda) ||
                notaEntrega.numero_ne.toLowerCase().includes(busqueda) ||
                notaEntrega.fecha_ne.toLowerCase().includes(busqueda) ||
                notaEntrega.fecha_ne.toLowerCase().includes(busqueda) ||
                empresa.nombre_emp.toLowerCase().includes(busqueda) ||
                (usuario.nombre_usua + ' ' + usuario.apellido_usua).toLowerCase().includes(busqueda) ||
                (cliente.nombre_clte + ' ' + cliente.apellido_clte).toLowerCase().includes(busqueda)
            );
        } else if (valor == 'encargado') {
            return (usuario.nombre_usua + ' ' + usuario.apellido_usua).toLowerCase().includes(busqueda);
        } else if (valor == 'cliente') {
            return (cliente.nombre_clte + ' ' + cliente.apellido_clte).toLowerCase().includes(busqueda);
        } else if (valor == 'nombre_emp') {
            return empresa.nombre_emp.toString().toLowerCase().includes(busqueda);
        } else {
            return notaEntrega[valor].toLowerCase().includes(busqueda);
        }
    });
    selectStateNotasEntrega();
}
function createYearNE() {
    const anios = Array.from(new Set(notasEntrega.map(ne => ne.fecha_ne.split('-')[0])));
    // Crear opciones para selectYearNE
    selectYearNE.innerHTML = '';
    let optionFirst = document.createElement('option');
    optionFirst.value = 'todas';
    optionFirst.innerText = 'Todos los años';
    selectYearNE.appendChild(optionFirst);
    for (let anio of anios) {
        const option = document.createElement('option');
        option.value = anio;
        option.textContent = anio;
        selectYearNE.appendChild(option);
    }

    // Crear opciones para selectYearNteProd
    selectYearNteProd.innerHTML = '';
    let optionFirstNteInv = document.createElement('option');
    optionFirstNteInv.value = 'todas';
    optionFirstNteInv.innerText = 'Todos los años';
    selectYearNteProd.appendChild(optionFirstNteInv);
    for (let anio of anios) {
        const option = document.createElement('option');
        option.value = anio;
        option.textContent = anio;
        selectYearNteProd.appendChild(option);
    }
}
//-------Estado de proforma
const selectYearNE = document.getElementById('selectYearNE');
selectYearNE.addEventListener('change', searchNotasEntrega);
const selectMonthNE = document.getElementById('selectMonthNE');
selectMonthNE.addEventListener('change', searchNotasEntrega);
//------buscar por marca y categoria:
function selectStateNotasEntrega() {
    filterNotasEntrega = filterNotasEntrega.filter(notaEntrega => {
        const estado = selectStateNe.value === 'notasEntrega' ? true : notaEntrega.estado_ne === selectStateNe.value;
        const fecha = selectYearNE.value === 'todas' ? true : notaEntrega.fecha_ne.split('-')[0] === selectYearNE.value;
        const mes = selectMonthNE.value === 'todas' ? true : notaEntrega.fecha_ne.split('-')[1] === selectMonthNE.value;
        return estado && fecha && mes;
    });
    paginacionNotaEntrega(filterNotasEntrega.length, 1);
}
//------Ordenar tabla descendente ascendente
const orderNotaEntrega = document.querySelectorAll('.tbody__head--ne');
orderNotaEntrega.forEach(div => {
    div.children[0].addEventListener('click', function () {
        filterNotasEntrega.sort((a, b) => {
            let first = a[div.children[0].name];
            let second = b[div.children[0].name];
            if (typeof first === 'number' && typeof second === 'number') {
                return first - second;
            } else {
                return String(first).localeCompare(String(second));
            }
        });
        paginacionNotaEntrega(filterNotasEntrega.length, 1);
    });
    div.children[1].addEventListener('click', function () {
        filterNotasEntrega.sort((a, b) => {
            let first = a[div.children[0].name];
            let second = b[div.children[0].name];
            if (typeof first === 'number' && typeof second === 'number') {
                return second - first;
            } else {
                return String(second).localeCompare(String(first));
            }
        });
        paginacionNotaEntrega(filterNotasEntrega.length, 1);
    });
});
//------PaginacionNotaEntrega
function paginacionNotaEntrega(allProducts, page) {
    let numberProducts = Number(selectNumberNe.value);
    let allPages = Math.ceil(allProducts / numberProducts);
    let ul = document.querySelector('#wrapperNE ul');
    let li = '';
    let beforePages = page - 1;
    let afterPages = page + 1;
    let liActive;
    if (page > 1) {
        li += `<li class="btn" onclick="paginacionNotaEntrega(${allProducts}, ${page - 1})"><img src="../imagenes/arowLeft.svg"></li>`;
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
        li += `<li class="numb ${liActive}" onclick="paginacionNotaEntrega(${allProducts}, ${pageLength})"><span>${pageLength}</span></li>`;
    }
    if (page < allPages) {
        li += `<li class="btn" onclick="paginacionNotaEntrega(${allProducts}, ${page + 1})"><img src="../imagenes/arowRight.svg"></li>`;
    }
    ul.innerHTML = li;
    let h2 = document.querySelector('#showPageNE h2');
    h2.innerHTML = `Pagina ${page}/${allPages}, ${allProducts} Notas entrega`;
    tableNotaEntrega(page);
}
//--------Tabla de Nota de entrega
const totalNE = document.getElementById('totalNE');
function tableNotaEntrega(page) {
    const total = filterNotasEntrega.reduce((acc, current) => acc + current.total_ne, 0);
    totalNE.innerText = `Total: ${total.toFixed(2)} Bs`;

    const tbody = document.getElementById('tbodyNE');
    const inicio = (page - 1) * Number(selectNumberNe.value);
    const final = inicio + Number(selectNumberNe.value);
    const notasEntrega = filterNotasEntrega.slice(inicio, final);
    tbody.innerHTML = '';

    notasEntrega.forEach((notaEntrega, index) => {
        const usuario = users.find(user => user.id_usua === notaEntrega.fk_id_usua_ne);
        const cliente = customers.find(customer => customer.id_clte === notaEntrega.fk_id_clte_ne);
        const empresa = enterprises.find(enterprise => enterprise.id_emp === cliente.fk_id_emp_clte);

        const tr = document.createElement('tr');
        tr.setAttribute('id_ne', notaEntrega.id_ne);

        const tdIdNE = document.createElement('td');
        tdIdNE.innerText = notaEntrega.id_ne;
        tdIdNE.setAttribute('hidden', '');
        tr.appendChild(tdIdNE);

        const tdNumero = document.createElement('td');
        tdNumero.innerText = index + 1;
        tr.appendChild(tdNumero);

        const tdOrdenCompra = document.createElement('td');
        tdOrdenCompra.innerText = notaEntrega.numero_oc;
        tr.appendChild(tdOrdenCompra);

        const tdNumeroNE = document.createElement('td');
        tdNumeroNE.innerText = notaEntrega.numero_ne;
        tr.appendChild(tdNumeroNE);

        const tdFechaNE = document.createElement('td');
        tdFechaNE.innerText = notaEntrega.fecha_ne;
        tr.appendChild(tdFechaNE);

        const tdEncargado = document.createElement('td');
        tdEncargado.innerText = usuario.nombre_usua + ' ' + usuario.apellido_usua;
        tr.appendChild(tdEncargado);

        const tdEmpresa = document.createElement('td');
        tdEmpresa.innerText = empresa.nombre_emp;
        tr.appendChild(tdEmpresa);

        const tdCliente = document.createElement('td');
        tdCliente.innerText = cliente.nombre_clte + ' ' + cliente.apellido_clte;
        tr.appendChild(tdCliente);

        const tdTotal = document.createElement('td');
        tdTotal.innerText = `${notaEntrega.total_ne.toFixed(2)} ${notaEntrega.moneda_ne}`;
        tr.appendChild(tdTotal);

        const tdOrden = document.createElement('td');
        tdOrden.innerText = notaEntrega.orden_ne;
        tr.appendChild(tdOrden);

        const tdAcciones = document.createElement('td');
        const fragment = document.createDocumentFragment();

        let imgs = [];

        if (notaEntrega.estado_ne == '1') {
            imgs = [
                { src: '../imagenes/pdf.svg', onclick: `pdfNotaEntrega(${notaEntrega.id_ne})`, title: 'PDF' },

            ];
        } else if (notaEntrega.estado_ne == '0') {
            if (localStorage.getItem('rol_usua') == 'Administrador' || localStorage.getItem('rol_usua') == 'Gerente general') {
                imgs = [
                    { src: '../imagenes/pdf.svg', onclick: `pdfNotaEntrega(${notaEntrega.id_ne})`, title: 'PDF' },

                ];
            } else if (localStorage.getItem('rol_usua') == 'Ingeniero' || localStorage.getItem('rol_usua') == 'Gerente De Inventario') {
                imgs = [
                    { src: '../imagenes/pdf.svg', onclick: `pdfNotaEntrega(${notaEntrega.id_ne})`, title: 'PDF' },

                ];
            }
        }
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
//-------pdf nota entrega
function pdfNotaEntrega(id_ne) {
    const notaEntrega = notasEntrega.find(nota => nota.id_ne === id_ne);
    const productos = nte_prods.filter(nte_prod => nte_prod.fk_id_ne_nepd === id_ne);
    const objeto = [];
    productos.forEach(nte_prod => {
        const product = products.find(prod => prod.id_prod === nte_prod.fk_id_prod_nepd);
        objeto.push({
            'codigo_prod': product.codigo_prod,
            'descripcion_prod': product['nombre_prod'],
            'cantidad_pfpd': nte_prod['cantidad_nepd'],
            'cost_uni_pfpd': nte_prod['cost_uni_nepd']
        });
    });
    //Crear un formulario oculto
    var form = document.createElement('form');
    form.method = 'post';
    form.action = '../modelos/reportes/notaDeEntrega.php';
    form.target = '_blank'; // Abre la página en una nueva ventana
    form.style.display = 'none'; // Oculta visualmente el formulario

    // Crea un campo oculto para la variable 
    var input1 = document.createElement('input');
    input1.type = 'hidden';
    input1.name = 'prof_mprof_ne';
    input1.value = JSON.stringify(notaEntrega); // Reemplaza con el valor real

    // Crea un campo oculto para la variable pf_pd
    var input2 = document.createElement('input');
    input2.type = 'hidden';
    input2.name = 'pf_pd';
    input2.value = JSON.stringify(objeto); // Reemplaza con el valor real

    // Crea un campo oculto para la variable pdf
    var input3 = document.createElement('input');
    input3.type = 'hidden';
    input3.name = 'pdf';
    input3.value = 'ne'; // Reemplaza con el valor real

    // Agrega los campos al formulario
    form.appendChild(input1);
    form.appendChild(input2);
    form.appendChild(input3);
    // Agrega el formulario al cuerpo del documento HTML
    document.body.appendChild(form);
    // Submitir el formulario
    form.submit();
}
//------------------------------------------OPEN AND CLOSE TABLA NOTA DE ENTREGA-----------------------------------
const tableNEMW = document.getElementById('tableNEMW');
const closeTableNEMW = document.getElementById('closeTableNEMW');
closeTableNEMW.addEventListener('click', () => {
    tableNEMW.classList.remove('modal__show');
})
function openTableNEMW() {
    tableNEMW.classList.add('modal__show');
}
//--------------------------------------------CRUD NOTA DE ENTREGA------------------------------------------------
//------Crear nota de entrega
function createNotaEntrega() {
    const totalPWNE = document.getElementById('totalPWNE');
    const rows = tbodyPreviewProd.querySelectorAll('tr');

    if (rows.length === 0) {
        mostrarAlerta('No hay productos en la proforma');
        return;
    }
    const ordenCompra = orderBuys.find(orderBuy => orderBuy.id_oc === golbalIdOc);
    if (!ordenCompra) {
        mostrarAlerta('No se encontró la orden de compra asociada a esta proforma');
        return;
    }

    const productos = [];
    for (let i = 0; i < rows.length - 4; i++) {
        const row = rows[i];
        productos.push({
            id_ocpd: row.getAttribute('id_ocpd'),
            fk_id_prod_nepd: row.getAttribute('id_prod'),
            codigo_nepd: row.children[1].innerText,
            cantidad_nepd: row.children[4].innerText,
            cost_uni_nepd: row.children[5].innerText,
        });
    }

    if (rqstNotaEntrega === false) {
        rqstNotaEntrega = true;
        preloader.classList.add('modal__show');
        previewProducts.classList.remove('modal__show');
        prof_prodMW.classList.remove('modal__show');
        const formData = new FormData();
        formData.append('createNotaEntrega', JSON.stringify(productos));
        formData.append('ordenCompra', JSON.stringify(ordenCompra));
        formData.append('id_usua', localStorage.getItem('id_usua'));
        formData.append('total_ne', Number(totalPWNE.innerText.split(': ')[1].split(' ')[0]).toFixed(2));
        formData.append('fecha_ne', dateActual[2] + '-' + dateActual[1] + '-' + dateActual[0]);
        fetch('../controladores/notaEntrega.php', {
            method: "POST",
            body: formData
        }).then(response => response.text()).then(data => {
            Promise.all([readNotasEntrega(), readNte_prods(), readInventories()]).then(() => {
                paginacionNotaEntrega(filterNotasEntrega.length, 1);
                rqstNotaEntrega = false;
                preloader.classList.remove('modal__show');
                mostrarAlerta(data);
            })
        }).catch(err => console.log(err));
    }


}
//----------------------------------------------------NTE_PROD----------------------------------------------//
//---------------------------------------------------CRUD NTE_PROD------------------------------------------------
let nte_prods = [];
let filterNte_prods = [];
async function readNte_prods() {
    return new Promise((resolve, reject) => {
        let formData = new FormData();
        formData.append('readNte_prods', '');
        fetch('../controladores/notaEntrega.php', {
            method: "POST",
            body: formData
        }).then(response => response.json()).then(data => {
            nte_prods = data;
            filterNte_prods = nte_prods;
            resolve();
        }).catch(err => console.log(err));
    })
}
//------------------------------------------------------TABLE NTE PROD FILTER-----------------------------------------------------
//------Select utilizado para buscar por columnas
const selectSearchNteProd = document.getElementById('selectSearchNteProd');
selectSearchNteProd.addEventListener('change', searchNteProd);
//------buscar por input
const inputSearchNteProd = document.getElementById("inputSearchNteProd");
inputSearchNteProd.addEventListener("keyup", searchNteProd);
//------NTE PROD por pagina
const selectNumberNteProd = document.getElementById('selectNumberNteProd');
selectNumberNteProd.selectedIndex = 3;
selectNumberNteProd.addEventListener('change', function () {
    paginacionNteProd(filterNte_prods.length, 1);
});
//------buscar por:
function searchNteProd() {
    const busqueda = inputSearchNteProd.value.toLowerCase().trim();
    const valor = selectSearchNteProd.value.toLowerCase().trim();
    filterNte_prods = nte_prods.filter(nte_prod => {
        if (valor == 'todas') {
            const notaEntrega = notasEntrega.find(notaEntrega => notaEntrega.id_ne === nte_prod.fk_id_ne_nepd);
            const product = products.find(product => product.id_prod === nte_prod.fk_id_prod_nepd);
            return (
                product.codigo_prod.toString().toLowerCase().includes(busqueda)
            )
        } else {
            return nte_prod[valor].toLowerCase().includes(busqueda);
        }
    });
    selectStateNteProdOC();
}
//------Seleccionar el año
const selectYearNteProd = document.getElementById('selectYearNteProd');
selectYearNteProd.addEventListener('change', searchNteProd);
//-------Estado de nte_prods
const selectStateNteProd = document.getElementById('selectStateNteProd');
selectStateNteProd.addEventListener('change', searchNteProd);
const selectMonthNteProd = document.getElementById('selectMonthNteProd');
selectMonthNteProd.addEventListener('change', searchNteProd);
function selectStateNteProdOC() {
    filterNte_prods = filterNte_prods.filter(nteProd => {
        const notaEntrega = notasEntrega.find(notaEntrega => notaEntrega.id_ne === nteProd.fk_id_ne_nepd);
        const estado = selectStateNteProd.value === 'todas' ? true : notaEntrega.estado_ne === selectStateNteProd.value;
        const fecha = selectYearNteProd.value === 'todas' ? true : notaEntrega.fecha_ne.split('-')[0] === selectYearNteProd.value;
        const mes = selectMonthNteProd.value === 'todas' ? true : notaEntrega.fecha_ne.split('-')[1] === selectMonthNteProd.value;
        return estado && fecha && mes;
    });
    paginacionNteProd(filterNte_prods.length, 1);
}
//------Ordenar tabla descendente ascendente
const orderNteProd = document.querySelectorAll('.tbody__head--NteProd');
orderNteProd.forEach(div => {
    div.children[0].addEventListener('click', function () {
        filterNte_prods.sort((a, b) => {
            let first = a[div.children[0].name];
            let second = b[div.children[0].name];
            if (typeof first === 'number' && typeof second === 'number') {
                return first - second;
            } else {
                return String(first).localeCompare(String(second));
            }
        });
        paginacionNteProd(filterNte_prods.length, 1);
    });
    div.children[1].addEventListener('click', function () {
        filterNte_prods.sort((a, b) => {
            let first = a[div.children[0].name];
            let second = b[div.children[0].name];
            if (typeof first === 'number' && typeof second === 'number') {
                return second - first;
            } else {
                return String(second).localeCompare(String(first));
            }
        });
        paginacionNteProd(filterNte_prods.length, 1);
    });
});
//------paginacionNteProd
const totalNteProd = document.getElementById('totalNteProd');
function paginacionNteProd(allProducts, page) {
    let total = 0;
    filterNte_prods.forEach(nte_prod => {
        const notaEntrega = filterNotasEntrega.find(notaEntrega => notaEntrega.id_ne === nte_prod.fk_id_ne_nepd);
        total += nte_prod.cost_uni_nepd * nte_prod.cantidad_nepd * (100 - notaEntrega.descuento_ne) / 100;
    });
    totalNteProd.innerHTML = 'Total (Bs):' + total.toFixed(2) + ' Bs';

    let numberProducts = Number(selectNumberNteProd.value);
    let allPages = Math.ceil(allProducts / numberProducts);
    let ul = document.querySelector('#wrapperNteProd ul');
    let li = '';
    let beforePages = page - 1;
    let afterPages = page + 1;
    let liActive;
    if (page > 1) {
        li += `<li class="btn" onclick="paginacionNteProd(${allProducts}, ${page - 1})"><img src="../imagenes/arowLeft.svg"></li>`;
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
        li += `<li class="numb ${liActive}" onclick="paginacionNteProd(${allProducts}, ${pageLength})"><span>${pageLength}</span></li>`;
    }
    if (page < allPages) {
        li += `<li class="btn" onclick="paginacionNteProd(${allProducts}, ${page + 1})"><img src="../imagenes/arowRight.svg"></li>`;
    }
    ul.innerHTML = li;
    let h2 = document.querySelector('#showPageNteProd h2');
    h2.innerHTML = `Pagina ${page}/${allPages}, ${allProducts} Productos`;
    tableNteProdMW(page);
}
//--------Tabla de nte_prods
function tableNteProdMW(page) {
    const tbody = document.getElementById('tbodyNteProd');
    const inicio = (page - 1) * Number(selectNumberNteProd.value);
    const final = inicio + Number(selectNumberNteProd.value);
    const nte_prods = filterNte_prods.slice(inicio, final);
    tbody.innerHTML = '';
    nte_prods.forEach((nte_prod, index) => {
        const notaEntrega = filterNotasEntrega.find(notaEntrega => notaEntrega.id_ne === nte_prod.fk_id_ne_nepd);

        const producto = products.find(product => product.id_prod === nte_prod.fk_id_prod_nepd);

        const tr = document.createElement('tr');
        tr.setAttribute('id_nepd', nte_prod.id_nepd);

        const tdNumero = document.createElement('td');
        tdNumero.innerText = index + 1;
        tr.appendChild(tdNumero);

        const tdNumeroNotaEntrega = document.createElement('td');
        tdNumeroNotaEntrega.innerText = notaEntrega.numero_ne;
        tr.appendChild(tdNumeroNotaEntrega);

        const tdFechaNotaEntrega = document.createElement('td');
        tdFechaNotaEntrega.innerText = notaEntrega.fecha_ne;
        tr.appendChild(tdFechaNotaEntrega);

        const tdCodigo = document.createElement('td');
        tdCodigo.innerText = producto.codigo_prod;
        tr.appendChild(tdCodigo);

        const tdCantidad = document.createElement('td');
        tdCantidad.innerText = nte_prod.cantidad_nepd;
        tr.appendChild(tdCantidad);

        const tdCostoUnitario = document.createElement('td');
        tdCostoUnitario.innerText = nte_prod.cost_uni_nepd.toFixed(2) + ' Bs';
        tr.appendChild(tdCostoUnitario);

        const tdSubTotal = document.createElement('td');
        const subTotal = nte_prod.cost_uni_nepd * nte_prod.cantidad_nepd;
        tdSubTotal.innerText = subTotal.toFixed(2) + ' Bs';
        tr.appendChild(tdSubTotal);

        const tdDescuento = document.createElement('td');
        const desc = notaEntrega.descuento_ne * nte_prod.cost_uni_nepd * nte_prod.cantidad_nepd / 100;
        tdDescuento.innerText = desc.toFixed(2) + ' Bs' + ' (' + notaEntrega.descuento_ne + '%)';
        tr.appendChild(tdDescuento);

        const tdTotal = document.createElement('td');
        const total = nte_prod.cantidad_nepd * nte_prod.cost_uni_nepd * (100 - notaEntrega.descuento_ne) / 100;
        tdTotal.innerText = total.toFixed(2) + ' Bs';
        tr.appendChild(tdTotal);

        tbody.appendChild(tr);
    });
}
//------open and close modal nte_prod
const tableNteProd = document.querySelector('#tableNteProd');
const openTableNteProd = document.querySelector('#openTableNteProd');
const closeTableNteProd = document.querySelector('#closeTableNteProd');
openTableNteProd.addEventListener('click', () => {
    tableNteProd.classList.add('modal__show');
});
closeTableNteProd.addEventListener('click', () => {
    tableNteProd.classList.remove('modal__show');
});
//--------------------------------------------PROFORMA-----------------------------------------------------
let proformas = [];
async function readProformas() {
    return new Promise((resolve, reject) => {
        let formData = new FormData();
        formData.append('readProformas', '');
        fetch('../controladores/proforma.php', {
            method: "POST",
            body: formData
        }).then(response => response.json()).then(data => {
            proformas = data;
            resolve();
        }).catch(err => console.log(err));
    })
}
//------------------------------------------------------INVENTARIO----------------------------------------------------------
let inventories = [];
let filterInventoriesMW = [];
async function readInventories() {
    return new Promise((resolve, reject) => {
        let formData = new FormData();
        formData.append('readInventories', '');
        fetch('../controladores/inventario.php', {
            method: "POST",
            body: formData
        }).then(response => response.json()).then(data => {
            inventories = data.filter(objeto => objeto.cantidad_inv !== 0);
            filterInventoriesMW = inventories;
            resolve();
        }).catch(err => console.log(err));
    })
}
//-------------------------------------------------TABLA MODAL INVENTARIOMW------------------------------------------------------------
//------Select utilizado para buscar por columnas
const selectSearchInvMW = document.getElementById('selectSearchInvMW');
selectSearchInvMW.addEventListener('change', searchInventoriesMW);
//------buscar por input
const inputSearchInvMW = document.getElementById("inputSearchInvMW");
inputSearchInvMW.addEventListener("keyup", searchInventoriesMW);
//------Clientes por pagina
const selectNumberInvMW = document.getElementById('selectNumberInvMW');
selectNumberInvMW.selectedIndex = 3;
selectNumberInvMW.addEventListener('change', function () {
    paginacionInventoryMW(filterInventoriesMW.length, 1);
});
//-------Marca y categoria
const selectMarcaInvMW = document.getElementById('selectMarcaInvMW');
const selectCategoriaInvMW = document.getElementById('selectCategoriaInvMW');
selectMarcaInvMW.addEventListener('change', selectCategoriaInventoryMW);
selectCategoriaInvMW.addEventListener('change', searchInventoriesMW);
const selectAlmacenInventory = document.getElementById('selectAlmacenInventory');
selectAlmacenInventory.addEventListener('change', searchInventoriesMW);
//------buscar por:
function searchInventoriesMW() {
    const valor = selectSearchInvMW.value;
    const busqueda = inputSearchInvMW.value.toLowerCase().trim();
    filterInventoriesMW = inventories.filter(inventory => {
        let product = products.find(product => product.id_prod === inventory.fk_id_prod_inv);
        if (valor === 'todas') {
            return (
                inventory.cost_uni_inv.toString().toLowerCase().includes(busqueda) ||
                product.codigo_prod.toString().toLowerCase().includes(busqueda) ||
                product.nombre_prod.toString().toLowerCase().includes(busqueda) ||
                product.descripcion_prod.toLowerCase().includes(busqueda) ||
                inventory.descripcion_inv.toLowerCase().includes(busqueda)
            );
        } else if (valor in inventory) {
            return inventory[valor].toString().toLowerCase().includes(busqueda);
        } else if (valor in product) {
            return product[valor].toString().toLowerCase().includes(busqueda);
        }
    });
    selectInventoriesMW();
}
//------buscar por marca y categoria:
function selectInventoriesMW() {
    filterInventoriesMW = filterInventoriesMW.filter(inventory => {
        let product = products.find(product => product.id_prod === inventory.fk_id_prod_inv);
        const marca = selectMarcaInvMW.value === 'todasLasMarcas' ? true : product.fk_id_mrc_prod == selectMarcaInvMW.value;
        const categoria = selectCategoriaInvMW.value === 'todasLasCategorias' ? true : product.fk_id_ctgr_prod == selectCategoriaInvMW.value;
        const almacen = selectAlmacenInventory.value === 'todo' ? true : inventory.ubi_almacen == selectAlmacenInventory.value;
        return marca && categoria && almacen;
    })
    paginacionInventoryMW(filterInventoriesMW.length, 1);
}
//------Ordenar tabla descendente ascendente
const orderInventoriesMW = document.querySelectorAll('.tbody__head--invMW');
orderInventoriesMW.forEach(div => {
    div.children[0].addEventListener('click', function () {
        const valor = div.children[0].name;
        filterInventoriesMW.sort((a, b) => {
            const productoA = products.find(p => p.id_prod === a.fk_id_prod_inv);
            const productoB = products.find(p => p.id_prod === b.fk_id_prod_inv);
            const valorA = String(productoA[valor]);
            const valorB = String(productoB[valor]);
            return valorA.localeCompare(valorB);
        });
        paginacionInventoryMW(filterInventoriesMW.length, 1);
    });
    div.children[1].addEventListener('click', function () {
        const valor = div.children[0].name;
        filterInventoriesMW.sort((a, b) => {
            const productoA = products.find(p => p.id_prod === a.fk_id_prod_inv);
            const productoB = products.find(p => p.id_prod === b.fk_id_prod_inv);
            const valorA = String(productoA[valor]);
            const valorB = String(productoB[valor]);
            return valorB.localeCompare(valorA);
        });
        paginacionInventoryMW(filterInventoriesMW.length, 1);
    });
})
//------PaginacionInventoryMW
function paginacionInventoryMW(allInventoriesMW, page) {
    let numberInventoriesMW = Number(selectNumberInvMW.value);
    let allPages = Math.ceil(allInventoriesMW / numberInventoriesMW);
    let ul = document.querySelector('#wrapperInvMW ul');
    let li = '';
    let beforePages = page - 1;
    let afterPages = page + 1;
    let liActive;
    if (page > 1) {
        li += `<li class="btn" onclick="paginacionInventoryMW(${allInventoriesMW}, ${page - 1})"><img src="../imagenes/arowLeft.svg"></li>`;
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
        li += `<li class="numb ${liActive}" onclick="paginacionInventoryMW(${allInventoriesMW}, ${pageLength})"><span>${pageLength}</span></li>`;
    }
    if (page < allPages) {
        li += `<li class="btn" onclick="paginacionInventoryMW(${allInventoriesMW}, ${page + 1})"><img src="../imagenes/arowRight.svg"></li>`;
    }
    ul.innerHTML = li;
    let h2 = document.querySelector('#showPageInvMW h2');
    h2.innerHTML = `Pagina ${page}/${allPages}, ${allInventoriesMW} Productos`;
    tableInventoriesMW(page);
}
//------Crear la tabla
function tableInventoriesMW(page) {
    let tbody = document.getElementById('tbodyInvMW');
    let inicio = (page - 1) * Number(selectNumberInvMW.value);
    let final = inicio + Number(selectNumberInvMW.value);
    i = 1;
    tbody.innerHTML = '';
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

    for (let inventory of filterInventoriesMW.slice(inicio, final)) {

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
        fragment.appendChild(tr);
    }
    tbody.innerHTML = '';
    tbody.appendChild(fragment);
}
//---------------------------MODAL TABLA BUSCAR INVENTARIO
const inventorySMW = document.getElementById('inventorySMW');
const closeInventorySMW = document.getElementById('closeInventorySMW');
function openInventorySMW() {
    inventorySMW.classList.add('modal__show');
}
closeInventorySMW.addEventListener('click', () => {
    inventorySMW.classList.remove('modal__show');
});
//--------------------------------------------PRODUCT-----------------------------------------------------
//-------Read productos
let products = [];
async function readProducts() {
    return new Promise((resolve, reject) => {
        let formData = new FormData();
        formData.append('readProducts', '');
        fetch('../controladores/productos.php', {
            method: "POST",
            body: formData
        }).then(response => response.json()).then(data => {
            products = data;
            resolve();
        }).catch(err => console.log(err));
    })
}
//---------------------------------------------------CLIENTES----------------------------------------------
let customers = [];
let formCustomer = [];
async function readCustomers() {
    return new Promise((resolve, reject) => {
        let formData = new FormData();
        formData.append('readCustomers', '');
        fetch('../controladores/clientes.php', {
            method: "POST",
            body: formData
        }).then(response => response.json()).then(data => {
            customers = data;
            resolve();
        }).catch(err => console.log(err));
    })
}
//----------------------------------------------USUARIO --------------------------------------------------/
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
            users = Object.values(data);
            resolve();
        }).catch(err => {
            mostrarAlerta('Ocurrio un error al cargar la tabla de usuarios, cargue nuevamente la pagina');
        });
    });
}
//<<---------------------------------------------EMPRESA---------------------------------------------->>
let enterprises = [];
async function readEnterprises() {
    return new Promise((resolve, reject) => {
        let formData = new FormData();
        formData.append('readEnterprises', '');
        fetch('../controladores/clientes.php', {
            method: "POST",
            body: formData
        }).then(response => response.json()).then(data => {
            enterprises = data;
            resolve();
        }).catch(err => console.log(err));
    })
}
/******************************************TABLE LIST PRICE******************************************/
//-----read prices
let prices = [];
async function readPrices() {
    let formData = new FormData();
    formData.append('readPrices', '');
    fetch('../controladores/proforma.php', {
        method: "POST",
        body: formData
    }).then(response => response.json()).then(data => {
        prices = data;
    }).catch(err => console.log(err));
}
//---------------------------MODAL ALERT----------------------------------------
const modalAlerta = document.getElementById('alerta');
const botonAceptar = document.getElementById('botonAceptar');
function mostrarAlerta(message) {
    modalAlerta.classList.add('modal__show');
    document.getElementById('mensaje-alerta').innerText = message;
}
botonAceptar.addEventListener('click', (e) => {
    modalAlerta.classList.remove('modal__show');
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
            selectMarcaInventoryMW();
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
/*----------------------------------------------Marca y categoria  modal inventory-------------------------------------------------*/
//-------Select de marcas
function selectMarcaInventoryMW() {
    selectMarcaInvMW.innerHTML = '';
    let option = document.createElement('option');
    option.value = 'todasLasMarcas';
    option.innerText = 'Todas las marcas';
    selectMarcaInvMW.appendChild(option);
    marcas.forEach(marca => {
        let option = document.createElement('option');
        option.value = marca.id_mrc;
        option.innerText = marca.nombre_mrc;
        selectMarcaInvMW.appendChild(option);
    })
}
//------Select categorias
function selectCategoriaInventoryMW() {
    selectCategoriaInvMW.innerHTML = '';
    let option = document.createElement('option');
    option.value = 'todasLasCategorias';
    option.innerText = 'Todas las categorias';
    selectCategoriaInvMW.appendChild(option);
    if (selectMarcaInvMW.value != 'todasLasMarcas') {
        let id_mrc = selectMarcaInvMW.value;
        categorias.forEach(categoria => {
            if (categoria.fk_id_mrc_mccr == id_mrc) {
                let option = document.createElement('option');
                option.value = categoria.id_ctgr;
                option.innerText = categoria.nombre_ctgr;
                selectCategoriaInvMW.appendChild(option);
            }
        })
    }
    searchInventoriesMW();
}
