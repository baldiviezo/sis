//-----------------------------------------PRE LOADER---------------------------------------------
const preloader = document.getElementById('preloader');
let requestSale = false;
init();
async function init() {
    if (requestSale == false) {
        requestSale = true;
        preloader.classList.add('modal__show');
        try {
            await Promise.all([
                readvnt_prods(),
                readAllCategorias(),
                readAllMarcas(),
                readSales(),
                readCustomers(),
                readUsers(),
                readEnterprises(),
                readNte_prods()
            ]);
            paginationSales(sales.length, 1);
            paginacionProductMW(filterProductsMW.length, 1);
            paginacionProdVnt(vnt_prods.length, 1);
            paginacionTableClteMW(filterCustomers.length, 1);
            paginacionEnterpriseMW(filterEnterprises.length, 1);
            requestSale = false;
            preloader.classList.remove('modal__show');
        } catch (error) {
            console.log(error);
            mostrarAlerta('Ocurrio un error al cargar la tabla de Facturación. Cargue nuevamente la pagina.');
        }
    }
}
//-----------------------------------------------FECHA----------------------------------------------------
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
//--------------------------------------------TABLE SALES--------------------------------------------
let sales = [];
let filterSales = [];
async function readSales() {
    return new Promise((resolve, reject) => {
        const formData = new FormData();
        formData.append('readSales', '');
        fetch('../controladores/ventas.php', {
            method: "POST",
            body: formData
        }).then(response => response.json()).then(data => {
            sales = data;
            filterSales = sales;
            selectYearVnt();
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
        cliente = customers.find(customer => customer.id_clte === sale.fk_id_clte_vnt);
        usuario = users.find(user => user.id_usua === sale.fk_id_usua_vnt);
        empresa = enterprises.find(enterprise => enterprise.id_emp === cliente.fk_id_emp_clte);
        if (valor === 'todas') {
            return (
                empresa.nombre_emp.toLowerCase().includes(busqueda) ||
                (cliente.nombre_clte + ' ' + cliente.apellido_clte).toLowerCase().includes(busqueda) ||
                sale.fecha_factura_vnt.toLowerCase().includes(busqueda) ||
                (usuario.nombre_usua + ' ' + usuario.apellido_usua).toLowerCase().includes(busqueda) ||
                sale.ciudad_vnt.toLowerCase().includes(busqueda) ||
                sale.tipo_pago_vnt.toLowerCase().includes(busqueda) ||
                sale.factura_vnt.toString().toLowerCase().includes(busqueda)
            );
        } else {
            return sale[valor].toString().toLowerCase().includes(busqueda);
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
    const anios = Array.from(new Set(sales.map(sale => sale.fecha_factura_vnt.split('-')[0])));
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
        const estado = stateFactured.value === 'todas' ? true : buy.estado_factura_vnt == stateFactured.value;
        const fecha = selectDateVnt.value === 'todas' ? true : buy.fecha_factura_vnt.split('-')[0] === selectDateVnt.value;
        const mes = selectMonthVnt.value === 'todas' ? true : buy.fecha_factura_vnt.split('-')[1] === selectMonthVnt.value;
        return estado && fecha && mes;
    });
    paginationSales(filterSales.length, 1);
}
//------Ordenar tabla descendente ascendente
const orderSales = document.querySelectorAll('.tbody__head--venta');
orderSales.forEach(div => {
    div.children[0].addEventListener('click', function () {
        const valor = div.children[0].name;
        filterSales.sort((a, b) => {
            let first = a[valor];
            let second = b[valor];
            if (typeof first === 'number' && typeof second === 'number') {
                return first - second;
            } else {
                return first.localeCompare(second);
            }
        })
        paginationSales(filterSales.length, 1);
    });
    div.children[1].addEventListener('click', function () {
        const valor = div.children[0].name;
        filterSales.sort((a, b) => {
            let first = a[valor];
            let second = b[valor];
            if (typeof first === 'number' && typeof second === 'number') {
                return second - first;
            } else {
                return second.localeCompare(first);
            }
        })
        paginationSales(filterSales.length, 1);
    });
})
//------PaginationSales
const totalVentas = document.getElementById('totalVentas');
function paginationSales(allVentas, page) {
    let total = 0;
    filterSales.forEach(sale => {
        total += sale.total_vnt;
    });
    totalVentas.innerHTML = `Total: ${total.toFixed(2)} Bs`;

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
const tbodyVenta = document.getElementById('tbodyVenta');
function tableSales(page) {
    const inicio = (page - 1) * Number(selectNumberVnt.value);
    const final = inicio + Number(selectNumberVnt.value);
    const filas = filterSales.slice(inicio, final)
    tbodyVenta.innerHTML = '';
    filas.forEach((venta, index) => {
        const cliente = customers.find(customer => customer.id_clte === venta.fk_id_clte_vnt);
        const empresa = enterprises.find(enterprise => enterprise.id_emp === cliente.fk_id_emp_clte);
        const usuario = users.find(user => user.id_usua === venta.fk_id_usua_vnt);

        const tr = document.createElement('tr');
        tr.setAttribute('id_vnt', venta.id_vnt);

        const tdNumero = document.createElement('td');
        tdNumero.innerText = inicio + index + 1;
        tr.appendChild(tdNumero);

        const tdAlmacen = document.createElement('td');
        tdAlmacen.innerText = venta.almacen_vnt === 0 ? 'El Alto' : 'Av. Arce';
        tr.appendChild(tdAlmacen);

        const tdFactura = document.createElement('td');
        tdFactura.innerText = venta.estado_factura_vnt === 1 ? venta.factura_vnt : 'S/F';
        tr.appendChild(tdFactura);

        const tdFecha = document.createElement('td');
        tdFecha.innerText = venta.fecha_factura_vnt;
        tr.appendChild(tdFecha);

        const tdCliente = document.createElement('td');
        tdCliente.innerText = empresa.id_emp === 77 ? `${cliente.apellido_clte} ${cliente.nombre_clte}` : empresa.nombre_emp;
        tr.appendChild(tdCliente);

        const tdTotal = document.createElement('td');
        tdTotal.innerText = `${parseFloat(venta.total_vnt).toFixed(2)} Bs`;
        tr.appendChild(tdTotal);

        const tdUsuario = document.createElement('td');
        tdUsuario.innerText = `${usuario.apellido_usua} ${usuario.nombre_usua}`;
        tr.appendChild(tdUsuario);

        const tdCiudad = document.createElement('td');
        tdCiudad.innerText = venta.ciudad_vnt;
        tr.appendChild(tdCiudad);

        const tdMetodoPago = document.createElement('td');
        tdMetodoPago.innerText = venta.tipo_pago_vnt === 'CR' ? `CREDITO` : `CONTADO`;
        tr.appendChild(tdMetodoPago);

        const tdObservaciones = document.createElement('td');
        tdObservaciones.innerText = venta.observacion_vnt;
        tr.appendChild(tdObservaciones);

        tbodyVenta.appendChild(tr);
    })

}
/********************************************CRUD SALES****************************************************/
//<------------------------------------------MODAL CRUD SALES--------------------------------------------
const saleRMW = document.getElementById('saleRMW');
const closeSaleRMW = document.getElementById('closeSaleRMW');
closeSaleRMW.addEventListener('click', () => {
    saleRMW.classList.remove('modal__show');
});
const fecha_factura_vnt = document.getElementById('fecha_factura_vnt');
const factura_vnt = document.getElementById('factura_vnt');
function openSaleRMW() {
    fecha_factura_vnt.value = `${dateActual[2]}-${dateActual[1]}-${dateActual[0]}`;
    saleRMW.classList.add('modal__show');
}
//----------------------------------------------CHANGE QUANTITY-------------------------------------------------
const tipo_pago_vnt = document.getElementById('tipo_pago_vnt');
tipo_pago_vnt.addEventListener('change', () => {
    if (tipo_pago_vnt.value == 'CR') {
        document.getElementById('tiempo_credito_vnt').removeAttribute('hidden');
    } else {
        document.getElementById('tiempo_credito_vnt').setAttribute('hidden', '');
    }
});
const estado_factura_vnt = document.getElementById('estado_factura_vnt');
const div_fecha_factura_vnt = document.getElementById('div_fecha_factura_vnt');
const div_factura_vnt = document.getElementById('div_factura_vnt');
estado_factura_vnt.addEventListener('change', () => {
    if (estado_factura_vnt.value == '1') {
        div_fecha_factura_vnt.removeAttribute('hidden');
        div_factura_vnt.removeAttribute('hidden');
    } else {
        div_fecha_factura_vnt.setAttribute('hidden', '');
        div_factura_vnt.setAttribute('hidden', '');
    }
});
//---------------------------------MODAL DE VNT-PROD--------------------------------------------
const closeVnt_prodMW = document.getElementById('closeVnt_prodMW');
const vnt_prodMW = document.getElementById('vnt_prodMW');
function openVnt_prodMW() {
    totalPrice();
    vnt_prodMW.classList.add('modal__show');
}
closeVnt_prodMW.addEventListener('click', (e) => {
    vnt_prodMW.classList.remove('modal__show');
});

function cartProduct(id_nepd, contenedor, total) {
    const product = filterProductsMW.find(product => product['id_nepd'] == id_nepd);
    if (product) {
        const card = document.createElement('div');

        card.classList.add('cart-item');
        card.setAttribute('id_nepd', id_nepd);
        card.setAttribute('id_prod', product.fk_id_prod_nepd);
        card.setAttribute('draggable', 'true');

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

        const cantidadInput = document.createElement('input');
        cantidadInput.type = 'number';
        cantidadInput.value = product.cantidad_nepd;
        cantidadInput.min = '1';
        cantidadInput.classList.add('cart-item__cantidad');
        card.appendChild(cantidadInput);

        const costUnitInput = document.createElement('input');
        costUnitInput.type = 'number';
        costUnitInput.value = parseFloat(product.cost_uni_nepd).toFixed(2);
        costUnitInput.classList.add('cart-item__costUnit');
        costUnitInput.readOnly = true;
        card.appendChild(costUnitInput);

        const subTotalInput = document.createElement('input');
        subTotalInput.type = 'number';
        subTotalInput.value = parseFloat(product.cost_uni_nepd * product.cantidad_nepd).toFixed(2);
        subTotalInput.classList.add('cart-item__costUnit');
        subTotalInput.readOnly = true;
        card.appendChild(subTotalInput);

        const descInput = document.createElement('input');
        descInput.type = 'number';
        descInput.value = parseFloat(product.cantidad_nepd * product.cost_uni_nepd * (product.descuento_oc / 100)).toFixed(2);
        descInput.classList.add('cart-item__costUnit');
        descInput.readOnly = true;
        card.appendChild(descInput);

        const costTotalInput = document.createElement('input');
        costTotalInput.type = 'number';
        costTotalInput.value = parseFloat(product.cantidad_nepd * product.cost_uni_nepd - (product.cantidad_nepd * product.cost_uni_nepd * (product.descuento_oc / 100))).toFixed(2);
        costTotalInput.classList.add('cart-item__costTotal');
        costTotalInput.readOnly = true;
        card.appendChild(costTotalInput);

        const trashImg = document.createElement('img');
        trashImg.src = '../imagenes/trash.svg';
        trashImg.classList.add('icon__CRUD');
        trashImg.addEventListener('click', (e) => removeCardFromCart(e, contenedor, total));
        card.appendChild(trashImg);
        return card;
    }
}
function removeCardFromCart(e, container) {
    const card = e.target.parentNode;
    container.removeChild(card);
    totalPrice();
}
const subTotal_vtpd = document.getElementById('subTotal_vtpd');
const total_vtpd = document.getElementById('total_vtpd');
function totalPrice() {
    const divs = document.querySelectorAll('#cartsVnt_prodMW div.cart-item');
    let total = 0;
    let descuento = 0;
    divs.forEach(div => {
        costo = Number(div.querySelector('.cart-item__costTotal').value);
        total = total + costo;
    })
    total_vtpd.innerHTML = `Total(Bs): ${((total - (total * descuento) / 100)).toFixed(2)} Bs`;
    document.getElementById('count_pfpd').innerHTML = divs.length;
}
/******************************************TABLA NTE-PROD**********************************************/
let products = [];
let filterProductsMW = [];
async function readNte_prods() {
    return new Promise((resolve, reject) => {
        let formData = new FormData();
        formData.append('readNte_prods', '');
        fetch('../controladores/notaEntrega.php', {
            method: "POST",
            body: formData
        }).then(response => response.json()).then(data => {
            products = data;
            filterProductsMW = products;
            resolve();
        }).catch(err => console.log(err));
    })
}
//--------------------------------------------TABLA MODAL PRODUCTS-----------------------------------------------
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
const selectAlmacenProdMW = document.getElementById('selectAlmacenProdMW');
selectAlmacenProdMW.addEventListener('change', searchProductsMW);
//------buscar por:
function searchProductsMW() {
    const valor = selectSearchProdMW.value;
    const busqueda = inputSearchProdMW.value.toLowerCase().trim();
    filterProductsMW = products.filter(product => {
        if (valor === 'todas') {
            return (
                product.numero_oc.toString().toLowerCase().includes(busqueda) ||
                product.nombre_emp.toString().toLowerCase().includes(busqueda) ||
                (product.apellido_clte + ' ' + product.nombre_clte).toString().toLowerCase().includes(busqueda) ||
                product.codigo_prod.toString().toLowerCase().includes(busqueda) ||
                product.nombre_emp.toLowerCase().includes(busqueda) ||
                (product.apellido_clte + ' ' + product.nombre_clte).toLowerCase().includes(busqueda)
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
        const almacen = selectAlmacenProdMW.value === 'todosLosAlmacenes' ? true : product.almacen_ne == selectAlmacenProdMW.value;
        const marca = selectMarcaProdMW.value === 'todasLasMarcas' ? true : product.fk_id_mrc_prod == selectMarcaProdMW.value;
        const categoria = selectCategoriaProdMW.value === 'todasLasCategorias' ? true : product.fk_id_ctgr_prod == selectCategoriaProdMW.value;
        return almacen && marca && categoria;
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
const tbodyNteProdMW = document.getElementById('tbodyNteProdMW');
function tableProductsMW(page) {
    const inicio = (page - 1) * Number(selectNumberProdMW.value);
    const final = inicio + Number(selectNumberProdMW.value);
    const products = filterProductsMW.slice(inicio, final);
    tbodyNteProdMW.innerHTML = '';
    products.forEach((product, index) => {

        const marca = marcas.find(marca => marca.id_mrc === product.fk_id_mrc_prod);
        const categoria = categorias.find(categoria => categoria.id_ctgr === product.fk_id_ctgr_prod);
        const inventarioArce = inventories.find(inventory => inventory.fk_id_prod_inv === product.id_prod && inventory.ubi_almacen === 1);
        const inventarioAlto = inventories.find(inventory => inventory.fk_id_prod_inv === product.id_prod && inventory.ubi_almacen === 0);
        const stock = (inventarioArce ? inventarioArce.cantidad_inv : 0) + (inventarioAlto ? inventarioAlto.cantidad_inv : 0);

        const tr = document.createElement('tr');
        tr.setAttribute('id_prod', product.id_nepd);

        const tdIndex = document.createElement('td');
        tdIndex.innerText = inicio + index + 1;
        tr.appendChild(tdIndex);

        const tdAlmacen = document.createElement('td');
        tdAlmacen.innerText = product.almacen_ne === 0 ? 'Alto' : 'Arce';
        tr.appendChild(tdAlmacen);

        const tdNumero = document.createElement('td');
        tdNumero.innerText = product.numero_oc;
        tr.appendChild(tdNumero);

        const tdFecha = document.createElement('td');
        tdFecha.innerText = product.fecha_oc;
        tr.appendChild(tdFecha);

        const tdEmpresa = document.createElement('td');
        tdEmpresa.innerText = product.nombre_emp;
        tr.appendChild(tdEmpresa);

        const tdCliente = document.createElement('td');
        tdCliente.innerText = product.apellido_clte + ' ' + product.nombre_clte;
        tr.appendChild(tdCliente);

        const tdCodigo = document.createElement('td');
        tdCodigo.innerText = product.codigo_prod;
        tr.appendChild(tdCodigo);

        const tdMarca = document.createElement('td');
        tdMarca.innerText = marca.nombre_mrc;
        tr.appendChild(tdMarca);

        const tdCategoria = document.createElement('td');
        tdCategoria.innerText = categoria.nombre_ctgr;
        tr.appendChild(tdCategoria);

        const tdNombre = document.createElement('td');
        tdNombre.innerText = product.nombre_prod;
        tr.appendChild(tdNombre);

        const tdCantidad = document.createElement('td');
        tdCantidad.innerText = product.cantidad_nepd;
        tr.appendChild(tdCantidad);

        const tdCostoUnit = document.createElement('td');
        tdCostoUnit.innerText = `${parseFloat(product.cost_uni_nepd).toFixed(2)} ${product.moneda_oc}`;
        tr.appendChild(tdCostoUnit);

        const tdSubTotal = document.createElement('td');
        tdSubTotal.innerText = `${parseFloat(product.cantidad_nepd * product.cost_uni_nepd).toFixed(2)} ${product.moneda_oc}`;
        tr.appendChild(tdSubTotal);

        const tdDescuento = document.createElement('td');
        tdDescuento.innerText = `${parseFloat(product.cantidad_nepd * product.cost_uni_nepd * (product.descuento_oc / 100)).toFixed(2)} ${product.moneda_oc} (${product.descuento_oc}%)`;
        tr.appendChild(tdDescuento);

        const tdCostoTotal = document.createElement('td');
        tdCostoTotal.innerText = `${parseFloat(product.cantidad_nepd * product.cost_uni_nepd - (product.cantidad_nepd * product.cost_uni_nepd * (product.descuento_oc / 100))).toFixed(2)} ${product.moneda_oc}`;
        tr.appendChild(tdCostoTotal);

        const tdAcciones = document.createElement('td');
        const fragment = document.createDocumentFragment();
        let imgs = [];

        imgs.push(
            { src: '../imagenes/send.svg', onclick: `sendProduct(${product.id_nepd})`, title: 'Seleccionar' });

        imgs.forEach((img) => {
            const imgElement = document.createElement('img');
            imgElement.src = img.src;
            imgElement.onclick = new Function(img.onclick);
            imgElement.title = img.title;
            fragment.appendChild(imgElement);
        });

        tdAcciones.appendChild(fragment);
        tr.appendChild(tdAcciones);

        tbodyNteProdMW.appendChild(tr);
    });
}
//------Agregar producto al carrito
const cartsVnt_prodMW = document.querySelector('#cartsVnt_prodMW');
function sendProduct(id_prod) {
    //Verificar si el producto ya está en el carrito
    const existingCard = cartsVnt_prodMW.querySelector(`.cart-item[id_nepd='${id_prod}']`);
    if (existingCard) {
        return;
    }
    const card = cartProduct(id_prod, cartsVnt_prodMW, totalPrice);
    cartsVnt_prodMW.appendChild(card);
    totalPrice();
    //Drang and drop
    const items = cartsVnt_prodMW.querySelectorAll(".cart-item");
    items.forEach(item => {
        item.addEventListener("dragstart", () => {
            setTimeout(() => item.classList.add("dragging"), 0);
        });
        item.addEventListener("dragend", () => item.classList.remove("dragging"));
    })
    cartsVnt_prodMW.addEventListener("dragover", initSortableListM);
    cartsVnt_prodMW.addEventListener("dragenter", e => e.preventDefault());
}
const initSortableListM = (e) => {
    e.preventDefault();
    const draggingItem = document.querySelector(".dragging");
    let siblings = [...cartsVnt_prodMW.querySelectorAll(".cart-item:not(.dragging)")];
    let nextSibling = siblings.find(sibling => {
        const rect = sibling.getBoundingClientRect();
        return e.clientY <= rect.top + rect.height / 2;
    });
    cartsVnt_prodMW.insertBefore(draggingItem, nextSibling);
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
//------------------------------------MOSTRAR LOS PRODUCTOS PREVIAMENTE--------------------------------------------
const tbodyPreviewProd = document.getElementById('tbodyPreviewProd');
function openPreviwProducts() {
    if (fk_id_emp_clteR.value == '') {
        mostrarAlerta('Selecciona una empresa');
        return;
    }
    const cart = cartsVnt_prodMW.querySelectorAll('.cart-item');
    if (cart.length > 0) {
        const productos = getProducts();
        const total = calculateTotal(productos);
        createTable(tbodyPreviewProd, productos);
        updateTotales(total);
        createButton(tbodyPreviewProd);
        previewProducts.classList.add('modal__show');
    } else {
        mostrarAlerta('No a seleccionado ningun producto');
    }
}
const titleEnterprise = document.getElementById('titleEnterprise');
const titleCustomer = document.getElementById('titleCustomer');
const facturaPreview = document.getElementById('facturaPreview');
const fechaPreview = document.getElementById('fechaPreview');
function getProducts() {
    const empresa = enterprises.find(enterprise => enterprise.id_emp == fk_id_emp_clteR.value);
    const cliente = customers.find(customer => customer.id_clte == fk_id_clte_vntR.value);
    titleEnterprise.innerText = `EMPRESA: ${empresa.nombre_emp}`;
    titleCustomer.innerText = `CLIENTE: ${cliente.apellido_clte + ' ' + cliente.nombre_clte}`;
    if (estado_factura_vnt.value == '1') {
        facturaPreview.innerText = `N° FACTURA: ${factura_vnt.value}`;
        fechaPreview.innerText = `FECHA: ${fecha_factura_vnt.value}`;
    } else {
        facturaPreview.innerText = `N° FACTURA: SIN FACTURA`;
        fechaPreview.innerText = ``;
    }


    return cartsVnt_prodMW.querySelectorAll('.cart-item');
}
function calculateTotal(productos) {
    let total = 0;
    productos.forEach(producto => {
        total += Number(producto.querySelector('.cart-item__costTotal').value);
    });
    return total;
}
function createTable(tbody, productos) {
    const fragment = document.createDocumentFragment();
    productos.forEach((producto, index) => {
        const row = products.find(product => product.id_nepd == producto.getAttribute('id_nepd'));
        const tr = document.createElement('tr');

        tr.setAttribute('id_nepd', producto.getAttribute('id_nepd'));
        const tdIndex = document.createElement('td');
        tdIndex.innerText = index + 1;
        tr.appendChild(tdIndex);

        const tdCodigo = document.createElement('td');
        tdCodigo.innerText = row.codigo_prod;
        tr.appendChild(tdCodigo);

        const tdDescripcion = document.createElement('td');
        tdDescripcion.innerText = row.nombre_prod;
        tr.appendChild(tdDescripcion);

        const tdImagen = document.createElement('td');
        const img = document.createElement('img');
        img.classList.add('tbody__img');
        img.setAttribute('src', `../modelos/imagenes/${row.imagen_prod}`);
        tdImagen.appendChild(img);
        tr.appendChild(tdImagen);

        const tdCantidad = document.createElement('td');
        tdCantidad.innerText = producto.querySelector('.cart-item__cantidad').value;
        tr.appendChild(tdCantidad);

        const tdPrecio = document.createElement('td');
        tdPrecio.innerHTML = `${producto.querySelector('.cart-item__costUnit').value}`;
        tr.appendChild(tdPrecio);

        const tdTotal = document.createElement('td');
        tdTotal.innerHTML = `${producto.querySelector('.cart-item__costTotal').value}`;
        tr.appendChild(tdTotal);

        fragment.appendChild(tr);
    });
    tbody.innerHTML = '';
    tbody.appendChild(fragment);
}
function updateTotales(total) {
    const footerData = [
        { value: `Sub-Total: ${total.toFixed(2)} Bs` }
    ];
    footerData.forEach((item, index) => {
        const tr = document.createElement('tr');
        const tdLabel = document.createElement('td');
        tdLabel.setAttribute('colspan', '5');
        const tdValue = document.createElement('td');
        tdValue.setAttribute('colspan', '2');
        tdValue.classList.add('footer__tbody');
        tdValue.innerText = `${item.value}`;
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

    button.innerText = 'REGISTRAR FACTURA';
    button.setAttribute('onclick', 'createSale();');

    tdLabel.setAttribute('colspan', '5');
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
//---------------------------------------CRUD SALES-------------------------------------------------------
const formSaleR = document.getElementById('formSaleR');
//------Create sale
function createSale() {
    if (confirm('¿Esta usted seguro?')) {
        if (requestSale == false) {
            requestSale = true;
            preloader.classList.add('modal__show');
            saleRMW.classList.add('modal__show');
            previewProducts.classList.remove('modal__show');
            const prodCart = [];
            const cartItems = cartsVnt_prodMW.querySelectorAll('.cart-item');
            cartItems.forEach(item => {
                prodCart.push({
                    id_nepd: item.getAttribute('id_nepd'),
                    fk_id_prod_vtpd: item.getAttribute('id_prod'),
                    codigo_vtpd: item.children[1].innerText,
                    cantidad_vtpd: item.children[2].value,
                    cost_uni_vtpd: item.children[3].value
                });
            });
            let formData = new FormData(formSaleR);
            formData.append('total_vnt', Number(total_vtpd.innerHTML.split(' ')[1]));
            formData.append('createSale', JSON.stringify(prodCart));
            fetch('../controladores/ventas.php', {
                method: "POST",
                body: formData
            }).then(response => response.text()).then(data => {
                if (data == 'La factura ya existe') {
                    requestSale = false;
                    preloader.classList.remove('modal__show');
                    mostrarAlerta(data);
                } else {
                    Promise.all([readSales(), readNte_prods(), readvnt_prods()]).then(() => {
                        paginationSales(sales.length, 1);
                        paginacionProductMW(filterProductsMW.length, 1);
                        paginacionProdVnt(vnt_prods.length, 1);
                        formSaleR.reset();
                        vnt_prodMW.classList.remove('modal__show');
                        cartsVnt_prodMW.innerHTML = '';
                        total_vtpd.innerHTML = `Total(Bs): 0.00 Bs`;
                        preloader.classList.remove('modal__show');
                        saleRMW.classList.remove('modal__show');
                        requestSale = false;
                        mostrarAlerta(data);
                    })
                }
            }).catch(err => {
                requestSale = false;
                mostrarAlerta(err);
            });
        }
    }
}
//---------------------------------------------------CLIENTES----------------------------------------------
let customers = [];
let filterCustomers = [];
let chosenCustomers = [];
let chosenCustomer = [];
let formCustomer;
async function readCustomers() {
    return new Promise((resolve, reject) => {
        let formData = new FormData();
        formData.append('readCustomers', '');
        fetch('../controladores/clientes.php', {
            method: "POST",
            body: formData
        }).then(response => response.json()).then(data => {
            customers = data;
            filterCustomers = customers;
            resolve();
        }).catch(err => console.log(err));
    })
}
//---------------------------------------------TABLA MODAL CUSTOMER---------------------------------
//------Select utilizado para buscar por columnas
const selectSearchClteSMW = document.getElementById('selectSearchClteSMW');
selectSearchClteSMW.addEventListener('change', searchCustomersSMW);
//------buscar por input
const inputSearchClteSMW = document.getElementById("inputSearchClteSMW");
inputSearchClteSMW.addEventListener("keyup", searchCustomersSMW);
//------Clientes por pagina
const selectNumberClteSMW = document.getElementById('selectNumberClteSMW');
selectNumberClteSMW.selectedIndex = 3;
selectNumberClteSMW.addEventListener('change', function () {
    paginacionCustomerMW(chosenCustomers.length, 1);
});
//------buscar por:
function searchCustomersSMW() {
    const busqueda = inputSearchClteSMW.value.toLowerCase();
    const valor = selectSearchClteSMW.value.toLowerCase().trim();
    chosenCustomer = chosenCustomers.filter(customer => {
        const empresa = enterprises.find(enterprise => enterprise.id_emp === customer.fk_id_emp_clte);
        if (valor === 'todas') {
            return (
                customer.nit_clte.toString().toLowerCase().includes(busqueda) ||
                empresa.nombre_emp.toLowerCase().includes(busqueda) ||
                customer.email_clte.toLowerCase().includes(busqueda) ||
                customer.direccion_clte.toString().toLowerCase().includes(busqueda) ||
                customer.celular_clte.toString().toLowerCase().includes(busqueda) ||
                (customer.apellido_clte + ' ' + customer.nombre_clte).toLowerCase().includes(busqueda)
            );
        } else if (valor === 'cliente') {
            return (customer.apellido_clte + ' ' + customer.nombre_clte).toLowerCase().includes(busqueda);
        } else {
            return customer[valor].toString().toLowerCase().includes(busqueda);
        }
    });
    paginacionCustomerMW(chosenCustomer.length, 1);
}
//------PaginacionCustomer
function paginacionCustomerMW(allEnterprises, page) {
    let numberEnterprises = Number(selectNumberClteSMW.value);
    let allPages = Math.ceil(allEnterprises / numberEnterprises);
    let ul = document.querySelector('#wrapperClteSMW ul');
    let li = '';
    let beforePages = page - 1;
    let afterPages = page + 1;
    let liActive;
    if (page > 1) {
        li += `<li class="btn" onclick="paginacionCustomerMW(${allEnterprises}, ${page - 1})"><img src="../imagenes/arowLeft.svg"></li>`;
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
        li += `<li class="numb ${liActive}" onclick="paginacionCustomerMW(${allEnterprises}, ${pageLength})"><span>${pageLength}</span></li>`;
    }
    if (page < allPages) {
        li += `<li class="btn" onclick="paginacionCustomerMW(${allEnterprises}, ${page + 1})"><img src="../imagenes/arowRight.svg"></li>`;
    }
    ul.innerHTML = li;
    let h2 = document.querySelector('#showPageClteSMW h2');
    h2.innerHTML = `Pagina ${page}/${allPages}, ${allEnterprises} Clientes`;
    tableCustomersMW(page);
}
//------Crear la tabla
const tbodyClteSMW = document.getElementById('tbodyClteSMW');
function tableCustomersMW(page) {
    const inicio = (page - 1) * Number(selectNumberClteSMW.value);
    const final = inicio + Number(selectNumberClteSMW.value);
    let i = 1;
    tbodyClteSMW.innerHTML = '';

    const customer = chosenCustomer.slice(inicio, final);
    customer.forEach((clte, index) => {
        const tr = document.createElement('tr');

        const tdNumero = document.createElement('td');
        tdNumero.innerText = index + 1;
        tr.appendChild(tdNumero);

        const tdNumeroClte = document.createElement('td');
        tdNumeroClte.innerText = clte.numero_clte;
        tr.appendChild(tdNumeroClte);

        const tdCliente = document.createElement('td');
        tdCliente.innerText = clte.nombre_clte + ' ' + clte.apellido_clte;
        tr.appendChild(tdCliente);

        const tdNit = document.createElement('td');
        tdNit.innerText = clte.nit_clte;
        tr.appendChild(tdNit);

        const tdEmail = document.createElement('td');
        tdEmail.innerText = clte.email_clte;
        tr.appendChild(tdEmail);

        const tdDirecion = document.createElement('td');
        tdDirecion.innerText = clte.direccion_clte;
        tr.appendChild(tdDirecion);

        const tdCelular = document.createElement('td');
        tdCelular.innerText = clte.celular_clte;
        tr.appendChild(tdCelular);
        const tdAcciones = document.createElement('td');
        tdAcciones.innerHTML = `
            <img src='../imagenes/send.svg' onclick='sendCustomers(${clte.id_clte})'>
            <img src='../imagenes/edit.svg' onclick='readCustomer(${clte.id_clte})'>
            <img src='../imagenes/trash.svg' onclick='deleteCustomer(${clte.id_clte})'>`;
        tr.appendChild(tdAcciones);

        tbodyClteSMW.appendChild(tr);

    });
}
const fk_id_clte_vntR = document.getElementById('fk_id_clte_vntR');
function sendCustomers(id_clte) {
    customerSMW.classList.remove('modal__show');
    const cliente = filterCustomers.find(customer => customer.id_clte == id_clte);
    fk_cliente_vntR.value = cliente.apellido_clte + ' ' + cliente.nombre_clte;
    fk_id_clte_vntR.value = id_clte;
}
//----------------------------------VENTANA MODAL CUSTOMERSMW-------------------------------------------
const customerSMW = document.getElementById('customerSMW');
const closeCustomerSMW = document.getElementById('closeCustomerSMW');
function openCustomersSMW() {
    inputSearchClteSMW.focus();
    customerSMW.classList.add('modal__show');
}
closeCustomerSMW.addEventListener('click', () => {
    customerSMW.classList.remove('modal__show');
});
//<<-----------------------------------------CRUD CUSTOMER  ----------------------------------------->>
//------Read a Customer
function readCustomer(id_clte) {
    const customer = filterCustomers.find(customer => customer.id_clte == id_clte);
    for (const valor in customer) {
        if (valor === 'fk_id_emp_clte') {
            const empresa = enterprises.find(empresa => empresa.id_emp === customer[valor]);
            formClienteM.querySelector(`[name=${valor}M]`).value = empresa.nombre_emp;
        } else {
            formClienteM.querySelector(`[name=${valor}M]`).value = customer[valor];
        }
    }
    customersMMW.classList.add('modal__show');
}
//------Create a customer
const formClienteR = document.getElementById('formClienteR');
formClienteR.addEventListener('submit', createCustomer);
async function createCustomer() {
    event.preventDefault();
    if (requestSale == false) {
        requestSale = true;
        customersRMW.classList.remove('modal__show');
        let formData = new FormData(formClienteR);
        formData.append('createCustomer', '');
        preloader.classList.add('modal__show');
        fetch('../controladores/clientes.php', {
            method: "POST",
            body: formData
        }).then(response => response.text()).then(data => {
            readCustomers().then(() => {
                sendEnterprise(Number(fk_id_emp_clteR.value));
                paginacionTableClteMW(filterCustomers.length, 1);
                requestSale = false;
                formClienteR.reset();
                preloader.classList.remove('modal__show');
                mostrarAlerta(data);
            });
        }).catch(err => {
            requestSale = false;
            mostrarAlerta(err);
        });
    }
}
//------Update a Customer
const formClienteM = document.getElementById('formClienteM');
formClienteM.addEventListener('submit', updateCustomer);
async function updateCustomer() {
    event.preventDefault();
    if (requestSale == false) {
        requestSale = true;
        customersMMW.classList.remove('modal__show');
        const formData = new FormData(formClienteM);
        formData.append('updateCustomer', '');
        preloader.classList.add('modal__show');
        fetch('../controladores/clientes.php', {
            method: "POST",
            body: formData
        }).then(response => response.text()).then(data => {
            readCustomers().then(() => {
                sendEnterprise(Number(fk_id_emp_clteR.value));
                paginacionTableClteMW(filterCustomers.length, 1);
                requestSale = false;
                formClienteM.reset();
                preloader.classList.remove('modal__show');
                mostrarAlerta(data);
            })
        }).catch(err => {
            requestSale = false;
            mostrarAlerta(err);
        });
    }
}
//------Delete a Customer
async function deleteCustomer(id_clte) {
    if (confirm('¿Esta usted seguro?')) {
        if (requestSale == false) {
            requestSale = true;
            let formData = new FormData();
            formData.append('deleteCustomer', id_clte);
            preloader.classList.add('modal__show');
            fetch('../controladores/clientes.php', {
                method: "POST",
                body: formData
            }).then(response => response.text()).then(data => {
                readCustomers().then(() => {
                    paginacionTableClteMW(filterCustomers.length, 1);
                    requestSale = false;
                    preloader.classList.remove('modal__show');
                    mostrarAlerta(data);
                });
            }).catch(err => {
                requestSale = false;
                mostrarAlerta(err)
            });
        }
    }
}
//------Select para crear cliente
const fk_id_emp_clteR2 = document.getElementById('fk_id_emp_clteR2');
function selectCreateCustomer() {
    fk_id_emp_clteR2.innerHTML = '';
    const id_clte = fk_id_emp_clteR.value;
    let option = document.createElement('option');
    option.value = id_clte;
    const empresa = enterprises.find(enterprise => enterprise.id_emp == id_clte);
    option.innerText = empresa.nombre_emp;
    fk_id_emp_clteR2.appendChild(option);
}
//<<-------------------------------------------MODAL CLIENTE---------------------------------------->>
const customersRMW = document.getElementById('customersRMW');
const customersMMW = document.getElementById('customersMMW');
const closeCustomersRMW = document.getElementById('closeCustomersRMW');
const closeCustomersMMW = document.getElementById('closeCustomersMMW');
function openCustomersRMW() {
    customersRMW.classList.add('modal__show');
    formCustomer = 'R';
    selectCreateCustomer();
}
closeCustomersRMW.addEventListener('click', () => {
    customersRMW.classList.remove('modal__show');
});
closeCustomersMMW.addEventListener('click', () => {
    customersMMW.classList.remove('modal__show');
});
//<<---------------------------------------------EMPRESA---------------------------------------------->>
const fk_id_emp_clteR = document.getElementById('fk_id_emp_clteR');
const fk_id_emp_clteM = document.getElementById('fk_id_emp_clteM');
let enterprises = [];
let filterEnterprises = [];
let indexEnterprise = 0;
async function readEnterprises() {
    return new Promise((resolve, reject) => {
        let formData = new FormData();
        formData.append('readEnterprises', '');
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
    paginacionEnterpriseMW(filterEnterprises.length, 1);
});
//------buscar por:
function searchEnterprisesMW() {
    const valor = selectSearchEmpMW.value;
    const busqueda = inputSearchEmpMW.value.toLowerCase().trim();
    filterEnterprises = enterprises.filter(enterprise => {
        if (valor === 'todas') {
            return (
                enterprise.nombre_emp.toLowerCase().includes(busqueda) ||
                enterprise.sigla_emp.toString().toLowerCase().includes(busqueda) ||
                enterprise.nit_emp.toString().toLowerCase().includes(busqueda)
            );
        } else {
            return enterprise[valor].toString().toLowerCase().includes(busqueda);
        }
    });
    paginacionEnterpriseMW(filterEnterprises.length, 1);
}
//------Ordenar tabla descendente ascendente
const orderEnterprises = document.querySelectorAll('.tbody__head--empMW');
orderEnterprises.forEach(div => {
    div.children[0].addEventListener('click', function () {
        const valor = div.children[0].name;
        filterEnterprises.sort((a, b) => a[valor].localeCompare(b[valor]));
        paginacionEnterpriseMW(filterEnterprises.length, 1);
    });
    div.children[1].addEventListener('click', function () {
        const valor = div.children[0].name;
        filterEnterprises.sort((a, b) => b[valor].localeCompare(a[valor]));
        paginacionEnterpriseMW(filterEnterprises.length, 1);
    });
})
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
            tr.setAttribute('id', `${filterEnterprises[enterprise].id_emp}`);
            for (let valor in filterEnterprises[enterprise]) {
                let td = document.createElement('td');
                if (valor == 'id_emp') {
                    td.innerText = i;
                    tr.appendChild(td);
                    i++;
                } else if (valor == 'nit_emp') {
                    if (filterEnterprises[enterprise][valor] == '0') {
                        td.innerText = '';
                    } else {
                        td.innerText = filterEnterprises[enterprise][valor];
                    }
                    tr.appendChild(td);
                } else if (valor == 'telefono_emp') {
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
                <img src='../imagenes/send.svg' onclick='sendEnterprise(${filterEnterprises[enterprise].id_emp})'>
                <img src='../imagenes/edit.svg' onclick='readEnterprise(${filterEnterprises[enterprise].id_emp})'>
                <img src='../imagenes/trash.svg' onclick='deleteEnterprise(${filterEnterprises[enterprise].id_emp})'>`;
            tr.appendChild(td);
            tbody.appendChild(tr);
        } else {
            i++;
        }
    }
}
const fk_nombre_emp_vntR = document.getElementById('fk_nombre_emp_vntR');
const fk_cliente_vntR = document.getElementById('fk_cliente_vntR');
function sendEnterprise(id_emp) {
    enterpriseSMW.classList.remove('modal__show');
    const empresa = filterEnterprises.find(enterprise => enterprise.id_emp == id_emp);
    const cliente = customers.find(customer => customer.fk_id_emp_clte === id_emp && customer.nombre_clte === '' && customer.apellido_clte === '');
    fk_id_emp_clteR.value = id_emp;
    fk_nombre_emp_vntR.value = empresa.nombre_emp;

    if (cliente) {
        fk_id_clte_vntR.value = cliente.id_clte;
        fk_cliente_vntR.value = `${cliente.apellido_clte} ${cliente.nombre_clte}`;
    } else {
        const clienteDefault = customers.find(customer => customer.fk_id_emp_clte === id_emp);
        fk_id_clte_vntR.value = clienteDefault.id_clte;
        fk_cliente_vntR.value = `${clienteDefault.apellido_clte} ${clienteDefault.nombre_clte}`;
    }

    chosenCustomers = customers.filter(customer => customer.fk_id_emp_clte === id_emp && customer.nombre_clte !== '' && customer.apellido_clte !== '');
    chosenCustomer = chosenCustomers;
    paginacionCustomerMW(chosenCustomer.length, 1);
}
//----------------------------------ventana modal EnterpriseSMW-------------------------------------------
const enterpriseSMW = document.getElementById('enterpriseSMW');
//enterpriseSMW.addEventListener('click', ()=>enterpriseSMW.classList.remove('modal__show'));
const closeEnterpriseSMW = document.getElementById('closeEnterpriseSMW');
function openEnterpriseSMW() {
    enterpriseSMW.classList.add('modal__show');
    inputSearchEmpMW.focus();
}
closeEnterpriseSMW.addEventListener('click', () => {
    enterpriseSMW.classList.remove('modal__show');
});
//<<---------------------------CRUD EMPRESA------------------------------->>
//------Leer una empresa
function readEnterprise(id_emp) {
    const empresa = enterprises.find(enterprise => enterprise['id_emp'] === id_emp);
    for (const key in empresa) {
        document.getElementsByName(`${key}M`)[0].value = empresa[key];
    }
    enterprisesMMW.classList.add('modal__show');
}
//------Craer una empresa
const formEmpresaR = document.getElementById('formEmpresaR');
formEmpresaR.addEventListener('submit', createEnterprise);
async function createEnterprise() {
    event.preventDefault();
    if (requestSale == false) {
        requestSale = true;
        enterprisesRMW.classList.remove('modal__show');
        const formData = new FormData(formEmpresaR);
        formData.append('createEnterprise', '');
        preloader.classList.add('modal__show');
        fetch('../controladores/clientes.php', {
            method: "POST",
            body: formData
        }).then(response => response.text()).then(data => {
            readCustomers().then(() => {
                return readEnterprises();
            }).then(() => {
                requestSale = false;
                formEmpresaR.reset();
                mostrarAlerta(data);
                paginacionEnterpriseMW(filterEnterprises.length, 1);
                paginacionTableClteMW(filterCustomers.length, 1);
                preloader.classList.remove('modal__show');
            })
        }).catch(err => {
            requestSale = false;
            mostrarAlerta(err);
        });
    }
}
//------Actualizar una empresa
const formEmpresaM = document.getElementById('formEmpresaM');
formEmpresaM.addEventListener('submit', updateEnterprise);
async function updateEnterprise() {
    event.preventDefault();
    if (requestSale == false) {
        requestSale = true;
        indexEnterprise = fk_id_emp_clteR.value;
        enterprisesMMW.classList.remove('modal__show');
        let formData = new FormData(formEmpresaM);
        formData.append('updateEnterprise', '');
        preloader.classList.add('modal__show');
        fetch('../controladores/clientes.php', {
            method: "POST",
            body: formData
        }).then(response => response.text()).then(data => {
            readCustomers().then(() => {
                return readEnterprises();
            }).then(() => {
                requestSale = false;
                mostrarAlerta(data);
                paginacionEnterpriseMW(filterEnterprises.length, 1);
                paginacionTableClteMW(filterCustomers.length, 1);
                fk_id_emp_clteR.value = indexEnterprise;
                preloader.classList.remove('modal__show');
            })
        }).catch(err => {
            requestSale = false;
            mostrarAlerta(err);
        });
    }
}
//------Borrar una empresa
async function deleteEnterprise(id_emp) {
    if (confirm('¿Esta usted seguro?')) {
        if (requestSale == false) {
            requestSale = true;
            let formData = new FormData();
            formData.append('deleteEnterprise', id_emp);
            preloader.classList.add('modal__show');
            fetch('../controladores/clientes.php', {
                method: "POST",
                body: formData
            }).then(response => response.text()).then(data => {
                readCustomers().then(() => {
                    return readEnterprises();
                }).then(() => {
                    requestSale = false;
                    mostrarAlerta(data);
                    paginacionEnterpriseMW(filterEnterprises.length, 1);
                    paginacionTableClteMW(filterCustomers.length, 1);
                    indexEnterprise = 0;
                    preloader.classList.remove('modal__show');
                })
            }).catch(err => {
                requestSale = false;
                mostrarAlerta(err);
            });
        }
    }
}
//<<----------------------------------------ABRIR Y CERRAR VENTANAS MODALES--------------------------------->>
//-----------------------------------Ventana modal para empresa---------------------------------//
const enterprisesRMW = document.getElementById('enterprisesRMW');
const enterprisesMMW = document.getElementById('enterprisesMMW');
const closeEnterprisesRMW = document.getElementById('closeEnterprisesRMW');
const closeEnterprisesMMW = document.getElementById('closeEnterprisesMMW');
function openEnterprisesRMW() {
    enterprisesRMW.classList.add('modal__show');
}
closeEnterprisesRMW.addEventListener('click', () => {
    enterprisesRMW.classList.remove('modal__show');
});
closeEnterprisesMMW.addEventListener('click', () => {
    enterprisesMMW.classList.remove('modal__show');
});
//--------------------------------------------TABLA MODAL CUSTOMER---------------------------------
//------Select utilizado para buscar por columnas
const selectSearchClteMW = document.getElementById('selectSearchClteMW');
selectSearchClteMW.addEventListener('change', searchCustomersMW);
//------buscar por input
const inputSearchClteMW = document.getElementById("inputSearchClteMW");
inputSearchClteMW.addEventListener("keyup", searchCustomersMW);
//------Clientes por pagina
const selectNumberClteMW = document.getElementById('selectNumberClteMW');
selectNumberClteMW.selectedIndex = 3;
selectNumberClteMW.addEventListener('change', function () {
    paginacionTableClteMW(filterCustomers.length, 1);
});
//------buscar por:
function searchCustomersMW() {
    const busqueda = inputSearchClteMW.value.toLowerCase();
    const valor = selectSearchClteMW.value.toLowerCase().trim();
    filterCustomers = customers.filter(customer => {
        const empresa = enterprises.find(enterprise => enterprise.id_emp === customer.fk_id_emp_clte);
        if (valor === 'todas') {
            return (
                (customer.nombre_clte + ' ' + customer.apellido_clte).toLowerCase().includes(busqueda) ||
                customer.nit_clte.toString().toLowerCase().includes(busqueda) ||
                customer.email_clte.toLowerCase().includes(busqueda) ||
                empresa.nombre_emp.toLowerCase().includes(busqueda) ||
                empresa.sigla_emp.toString().toLowerCase().includes(busqueda) ||
                empresa.nit_emp.toString().toLowerCase().includes(busqueda)
            );
        } else if (valor === 'cliente') {
            return (customer.nombre_clte + ' ' + customer.apellido_clte).toLowerCase().includes(busqueda);
        } else if (valor === 'nombre_emp') {
            return empresa.nombre_emp.toLowerCase().includes(busqueda);
        }
    });
    paginacionTableClteMW(filterCustomers.length, 1);
}
//------PaginacionCustomer
function paginacionTableClteMW(allProducts, page) {
    let numberEnterprises = Number(selectNumberClteMW.value);
    let allPages = Math.ceil(allProducts / numberEnterprises);
    let ul = document.querySelector('#wrapperClteMW ul');
    let li = '';
    let beforePages = page - 1;
    let afterPages = page + 1;
    let liActive;
    if (page > 1) {
        li += `<li class="btn" onclick="paginacionTableClteMW(${allProducts}, ${page - 1})"><img src="../imagenes/arowLeft.svg"></li>`;
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
        li += `<li class="numb ${liActive}" onclick="paginacionTableClteMW(${allProducts}, ${pageLength})"><span>${pageLength}</span></li>`;
    }
    if (page < allPages) {
        li += `<li class="btn" onclick="paginacionTableClteMW(${allProducts}, ${page + 1})"><img src="../imagenes/arowRight.svg"></li>`;
    }
    ul.innerHTML = li;
    let h2 = document.querySelector('#showPageClteMW h2');
    h2.innerHTML = `Pagina ${page}/${allPages}, ${allProducts} Clientes`;
    tableCltesMW(page);
}
//------Crear la tabla de clientes
function tableCltesMW(page) {
    const tbody = document.getElementById('tbodyClteMW');
    const inicio = (page - 1) * Number(selectNumberClteMW.value);
    const final = inicio + Number(selectNumberClteMW.value);
    let i = 1;
    tbody.innerHTML = '';

    const customer = filterCustomers.slice(inicio, final);
    customer.forEach((clte, index) => {
        const tr = document.createElement('tr');

        const tdNumero = document.createElement('td');
        tdNumero.innerText = index + 1;
        tr.appendChild(tdNumero);

        const tdNumeroClte = document.createElement('td');
        tdNumeroClte.innerText = clte.numero_clte;
        tr.appendChild(tdNumeroClte);

        const tdEmpresa = document.createElement('td');
        const empresa = enterprises.find(enterprise => enterprise.id_emp === clte.fk_id_emp_clte);
        tdEmpresa.innerText = empresa ? empresa.nombre_emp : 'N/A';
        tr.appendChild(tdEmpresa);

        const tdSigla = document.createElement('td');
        tdSigla.innerText = empresa ? empresa.sigla_emp : 'N/A';
        tr.appendChild(tdSigla);

        const tdCliente = document.createElement('td');
        tdCliente.innerText = clte.nombre_clte + ' ' + clte.apellido_clte;
        tr.appendChild(tdCliente);

        const tdNit = document.createElement('td');
        tdNit.innerText = empresa.id_emp === 77 ? clte.nit_clte : empresa.nit_emp;
        tr.appendChild(tdNit);

        const tdEmail = document.createElement('td');
        tdEmail.innerText = clte.email_clte;
        tr.appendChild(tdEmail);

        const tdDirecion = document.createElement('td');
        tdDirecion.innerText = clte.direccion_clte;
        tr.appendChild(tdDirecion);

        const tdCelular = document.createElement('td');
        tdCelular.innerText = (empresa.id_emp === 77 ? clte.celular_clte : empresa.telefono_emp) || '';
        tr.appendChild(tdCelular);

        tbody.appendChild(tr);
    });
}
/****************************TABLA CLIENTES****************************************/
//-------Abrir Tabla
const tableClteMW = document.getElementById('tableClteMW');
const closetableClteMW = document.getElementById('closetableClteMW');
function openTableClteMW() {
    tableClteMW.classList.add('modal__show');
}
closetableClteMW.addEventListener('click', () => {
    tableClteMW.classList.remove('modal__show');
});
/***********************************************PRODUCT FILTER VNT_PRODS*********************************************/
//--------read vnt_prods
let vnt_prods = [];
let filterVnt_prods = [];
async function readvnt_prods() {
    return new Promise((resolve, reject) => {
        const formData = new FormData();
        formData.append('readVnt_prods', '');
        fetch('../controladores/ventas.php', {
            method: "POST",
            body: formData
        }).then(response => response.json()).then(data => {
            vnt_prods = data;
            filterVnt_prods = vnt_prods;
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
    filterVnt_prods = vnt_prods.filter(vnt_prod => {
        if (valor === 'todas') {
            const venta = sales.find(sale => sale.id_vnt === vnt_prod.fk_id_vnt_vtpd);
            const cliente = customers.find(customer => customer.id_clte === venta.fk_id_clte_vnt);
            const empresa = enterprises.find(enterprise => enterprise.id_emp === cliente.fk_id_emp_clte);
            return (
                empresa.nombre_emp.toLowerCase().includes(busqueda) ||
                (cliente.nombre_clte + ' ' + cliente.apellido_clte).toLowerCase().includes(busqueda) ||
                vnt_prod.codigo_vtpd.toLowerCase().includes(busqueda) ||
                vnt_prod.nombre_prod.toLowerCase().includes(busqueda) ||
                venta.factura_vnt.toString().toLowerCase().includes(busqueda) ||
                venta.fecha_factura_vnt.toLowerCase().includes(busqueda)
            );
        } else if (valor === 'encargado') {
            return (vnt_prod.nombre_usua + ' ' + vnt_prod.apellido_usua).toLowerCase().includes(busqueda);
        } else if (valor === 'cliente') {
            return (vnt_prod.apellido_clte + ' ' + vnt_prod.nombre_clte).toLowerCase().includes(busqueda);
        } else if (valor === 'factura_vnt') {
            const venta = sales.find(sale => sale.id_vnt === vnt_prod.fk_id_vnt_vtpd);
            return venta.factura_vnt.toString().toLowerCase().includes(busqueda);
        } else {
            return vnt_prod[valor].toString().toLowerCase().includes(busqueda);
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
    filterVnt_prods = filterVnt_prods.filter(vnt_prod => {
        const venta = sales.find(sale => sale.id_vnt === vnt_prod.fk_id_vnt_vtpd);
        const estado = stateFacturedProd.value === 'todas' ? true : venta.estado_factura_vnt == stateFacturedProd.value;
        const fecha = selectDateVntProd.value === 'todas' ? true : venta.fecha_factura_vnt.split('-')[0] === selectDateVntProd.value;
        const mes = selectMonthVnPd.value === 'todas' ? true : venta.fecha_factura_vnt.split('-')[1] === selectMonthVnPd.value;
        return estado && fecha && mes;
    });
    paginacionProdVnt(filterVnt_prods.length, 1);
}
//------Ordenar tabla descendente ascendente
const orderVntProd = document.querySelectorAll('.tbody__head--vntProd');
function compareValues(a, b, valor) {
    const ventaA = sales.find(sale => sale.id_vnt === a.fk_id_vnt_vtpd);
    const ventaB = sales.find(sale => sale.id_vnt === b.fk_id_vnt_vtpd);

    if (valor === 'factura_vnt') {
        return ventaA.factura_vnt - ventaB.factura_vnt;
    } else if (valor === 'fecha_factura_vnt') {
        return ventaA.fecha_factura_vnt.localeCompare(ventaB.fecha_factura_vnt);
    } else {
        let first = a[valor];
        let second = b[valor];
        if (typeof first === 'number' && typeof second === 'number') {
            return first - second;
        } else {
            return first.localeCompare(second);
        }
    }
}
orderVntProd.forEach(div => {
    div.children[0].addEventListener('click', function () {
        const valor = div.children[0].name;
        filterVnt_prods.sort((a, b) => compareValues(a, b, valor));
        paginacionProdVnt(filterVnt_prods.length, 1);
    });

    div.children[1].addEventListener('click', function () {
        const valor = div.children[0].name;
        filterVnt_prods.sort((a, b) => compareValues(b, a, valor));
        paginacionProdVnt(filterVnt_prods.length, 1);
    });
});
//------PaginacionProdVnt
const totalProdVnt = document.getElementById('totalProdVnt');
function paginacionProdVnt(allProducts, page) {
    let total = 0;

    filterVnt_prods.forEach(prodVnt => {
        const venta = sales.find(sale => sale.id_vnt === prodVnt.fk_id_vnt_vtpd);
        const subTotal = prodVnt.cantidad_vtpd * prodVnt.cost_uni_vtpd;
        const descuento = subTotal * (venta.descuento_vnt / 100);
        total += subTotal - descuento;
    });
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
const tbodyProdVnt = document.getElementById('tbodyProdVnt');
function tableVntProds(page) {
    inicio = (page - 1) * Number(selectNumberProdVnt.value);
    final = inicio + Number(selectNumberProdVnt.value);
    const filas = filterVnt_prods.slice(inicio, final);
    tbodyProdVnt.innerHTML = '';
    filas.forEach((prodVnt, index) => {
        const venta = sales.find(sale => sale.id_vnt === prodVnt.fk_id_vnt_vtpd);
        const cliente = customers.find(cust => cust.id_clte === venta.fk_id_clte_vnt);
        const empresa = enterprises.find(ent => ent.id_emp === cliente.fk_id_emp_clte);

        const tr = document.createElement('tr');
        const tdIndex = document.createElement('td');
        tdIndex.innerHTML = index + 1;
        tr.appendChild(tdIndex);

        const tdFactura = document.createElement('td');
        tdFactura.innerHTML = venta.estado_factura_vnt === 1 ? venta.factura_vnt : 'S/F';
        tr.appendChild(tdFactura);

        const tdFecha = document.createElement('td');
        tdFecha.innerHTML = venta.fecha_factura_vnt;
        tr.appendChild(tdFecha);

        const tdCliente = document.createElement('td');
        tdCliente.innerHTML = empresa.id_emp === 77 ? `${cliente.nombre_clte} ${cliente.apellido_clte}` : empresa.nombre_emp;
        tr.appendChild(tdCliente);

        const tdMarca = document.createElement('td');
        tdMarca.innerHTML = prodVnt.nombre_mrc;
        tr.appendChild(tdMarca);

        const tdCategoria = document.createElement('td');
        tdCategoria.innerHTML = prodVnt.nombre_ctgr;
        tr.appendChild(tdCategoria);

        const tdCodigo = document.createElement('td');
        tdCodigo.innerHTML = prodVnt.codigo_vtpd;
        tr.appendChild(tdCodigo);

        const tdDescripcion = document.createElement('td');
        tdDescripcion.innerHTML = prodVnt.nombre_prod;
        tr.appendChild(tdDescripcion);

        const tdCantidad = document.createElement('td');
        tdCantidad.innerHTML = prodVnt.cantidad_vtpd;
        tr.appendChild(tdCantidad);

        const tdCostUni = document.createElement('td');
        tdCostUni.innerHTML = `${prodVnt.cost_uni_vtpd.toFixed(2)} Bs`;
        tr.appendChild(tdCostUni);

        const tdSubTotal = document.createElement('td');
        tdSubTotal.innerHTML = `${(prodVnt.cantidad_vtpd * prodVnt.cost_uni_vtpd).toFixed(2)} Bs`;
        tr.appendChild(tdSubTotal);

        const tdDescuento = document.createElement('td');
        tdDescuento.innerHTML = `${(prodVnt.cantidad_vtpd * prodVnt.cost_uni_vtpd * venta.descuento_vnt / 100).toFixed(2)} Bs`;
        tr.appendChild(tdDescuento);

        const tdTotal = document.createElement('td');
        tdTotal.innerHTML = `${(prodVnt.cantidad_vtpd * prodVnt.cost_uni_vtpd * (1 - venta.descuento_vnt / 100)).toFixed(2)} Bs`;
        tr.appendChild(tdTotal);

        tbodyProdVnt.appendChild(tr);
    });
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
    const nuevaVariable = sortedSales.map((sale) => {
        const cliente = customers.find(cust => cust.id_clte === sale.fk_id_clte_vnt);
        const empresa = enterprises.find(ent => ent.id_emp === cliente.fk_id_emp_clte);
        const usuario = users.find(user => user.id_usua === sale.fk_id_usua_vnt);

        return {
            ITEM: sale.factura_vnt,
            CLIENTE: sale.id_emp === 77 ? `${cliente.nombre_clte} ${cliente.apellido_clte}` : empresa.nombre_emp,
            FECHA: sale.fecha_factura_vnt,
            OC: '',
            MONTO: Number(sale.total_vnt),
            VENTA: `${usuario.nombre_usua} ${usuario.apellido_usua}`,
            CIUDAD: sale.ciudad_vnt,
            PAGO: sale.tipo_pago_vnt,
            OBSERVACIONES: sale.observacion_vnt,
        };
    });
    // Crear un nuevo array que este el total vendido por un ecargado de todos los encargados
    const totalVendido = sortedSales.reduce((acc, sale) => {
        if (acc[sale.encargado]) {
            acc[sale.encargado] += Number(sale.total_vnt);
        } else {
            acc[sale.encargado] = Number(sale.total_vnt);
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
/*******************************Reporte en Excel VNT_PROD*****************************************/
const excelProdVnt = document.getElementById('excelProdVnt');
excelProdVnt.addEventListener('click', () => {
    const reporte = filterVnt_prods.map((obj, index) => {
        const venta = sales.find(sale => sale.id_vnt === obj.fk_id_vnt_vtpd);
        const cliente = customers.find(cust => cust.id_clte === venta.fk_id_clte_vnt);
        const empresa = enterprises.find(ent => ent.id_emp === cliente.fk_id_emp_clte);

        return {
            'Item': index + 1,
            'Numero cliente': cliente.numero_clte,
            'Nombre cliente': empresa.id_emp === 77 ? `${cliente.nombre_clte} ${cliente.apellido_clte}` : empresa.nombre_emp,
            'Codigo producto': obj.codigo_vtpd,
            'Codigo Japón': obj.codigo_smc_prod,
            'Descripcion del producto': obj.nombre_prod,
            'Cantidad': obj.cantidad_vtpd,
            'Precio Lista': obj.cost_uni_vtpd,
            'Total a precio de lista': obj.cost_uni_vtpd * obj.cantidad_vtpd,
            'Precio venta sin IVA': obj.cost_uni_vtpd * obj.cantidad_vtpd * (1 - venta.descuento_vnt / 100) * 0.87,
            'Total a precio venta': obj.cost_uni_vtpd * obj.cantidad_vtpd * (1 - venta.descuento_vnt / 100),
            'Fecha venta': venta.fecha_factura_vnt.toString().split(' ')[0],
            'Factura': venta.factura_vnt
        };
    });
    downloadAsExcel(reporte);
});
/*******************************importa en excel**************************************************/
const excelProdReponer = document.getElementById('excelProdReponer');
excelProdReponer.addEventListener('click', () => {
    downloadAsExcel(productsSold);
});
/***********************************Reporte en Excel*********************************************/
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
//-------------------------TABLE MODAL MOST VENDIDOS----------------------------------------->
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
const orderMostProd = document.querySelectorAll('.tbody__head--MP');
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
/******************************************Read inventories*******************************/
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
/*------------------------------------Marca y categoria producto-------------------------------------------------*/
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
            selectMarcaProductMW();
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
//--------------------------------------USUARIO --------------------------------------------------/
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
            selectUser();
            resolve();
        }).catch(err => {
            mostrarAlerta('Ocurrio un error al cargar la tabla de usuarios, cargue nuevamente la pagina');
        });
    });
}
const fk_id_usua_vnt = document.getElementById('fk_id_usua_vnt');
function selectUser() {
    fk_id_usua_vnt.innerHTML = '';
    users.forEach(user => {
        const option = document.createElement('option');
        option.value = user.id_usua;
        option.text = user.nombre_usua + ' ' + user.apellido_usua;
        fk_id_usua_vnt.appendChild(option);
    });
}
//-------------------------------------Alert-----------------------------------------------
const modalAlerta = document.getElementById('alerta');
const botonAceptar = document.getElementById('botonAceptar');
function mostrarAlerta(message) {
    modalAlerta.classList.add('modal__show');
    document.getElementById('mensaje-alerta').innerText = message;
}
botonAceptar.addEventListener('click', (e) => {
    modalAlerta.classList.remove('modal__show');
});




