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
                readEnterprises()
            ]);
            paginacionOrdenCompra(orderBuys.length, 1);
            paginacionInventoryMW(inventories.length, 1);
            rqstNotaEntrega = false;
            preloader.classList.remove('modal__show');
        } catch (error) {
            console.log(error);
            mostrarAlerta('Ocurrio un error al cargar la tabla de notas de entrega. Cargue nuevamente la pagina.');
        }
    }
}
//--------------------------------ORDEN DE COMPRA---------------------------------------------------
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
//-----------------------------------------READ OC_PROD
let oc_prods = [];
function readOcProd() {
    return new Promise((resolve, reject) => {
        let formData = new FormData();
        formData.append('readOcProd', '');
        fetch('../controladores/notaEntrega.php', {
            method: "POST",
            body: formData
        }).then(response => response.json()).then(data => {
            oc_prods = data;
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
//-------Estado de proforma
const selectStateOC = document.getElementById('selectStateOC');
selectStateOC.addEventListener('change', searchOrdenCompra);
//------buscar por:
function searchOrdenCompra() {
    const valor = selectSearchOC.value;
    const busqueda = inputSearchOC.value.toLowerCase().trim();

    filterOrderBuys = orderBuys.filter(ordenBuy => {
        let cliente = customers.find(customer => customer.id_clte === ordenBuy.fk_id_clte_oc);
        let empresa = enterprises.find(enterprise => enterprise.id_emp === cliente.fk_id_emp_clte);
        let usuario = users.find(user => user.id_usua === ordenBuy.fk_id_usua_oc);

        if (valor === 'todas') {
            return (
                ordenBuy.fecha_oc.toLowerCase().includes(busqueda) ||
                empresa.nombre_emp.toLowerCase().includes(busqueda) ||
                (usuario.nombre_usua + ' ' + usuario.apellido_usua).toLowerCase().includes(busqueda) ||
                (cliente.apellido_clte + ' ' + cliente.nombre_clte).toLowerCase().includes(busqueda)
            );
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
    let optionFirst = document.createElement('option');
    optionFirst.value = 'todas';
    optionFirst.innerText = 'Todos los años';
    selectYearOC.appendChild(optionFirst);
    for (let anio of anios) {
        const option = document.createElement('option');
        option.value = anio;
        option.textContent = anio;
        selectYearOC.appendChild(option);
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
            let first = a[div.children[0].name];
            let second = b[div.children[0].name];
            if (typeof first === 'number' && typeof second === 'number') {
                return first - second;
            } else {
                return String(first).localeCompare(String(second));
            }
        });
        paginacionOrdenCompra(filterOrderBuys.length, 1);
    });
    div.children[1].addEventListener('click', function () {
        filterOrderBuys.sort((a, b) => {
            let first = a[div.children[0].name];
            let second = b[div.children[0].name];
            if (typeof first === 'number' && typeof second === 'number') {
                return second - first;
            } else {
                return String(second).localeCompare(String(first));
            }
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
//--------Tabla de proforma
const tbodyOC = document.getElementById('tbodyOC');
function tableOrdenCompra(page) {
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

        const tdNumeroProforma = document.createElement('td');
        //	(SMS25-1247-HUAYHUA)
        tdNumeroProforma.innerText = proforma.numero_prof;
        tr.appendChild(tdNumeroProforma);

        const tdFecha = document.createElement('td');
        tdFecha.innerText = orderBuy.fecha_oc;
        tr.appendChild(tdFecha);

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

        const tdNumeroOC = document.createElement('td');
        tdNumeroOC.innerText = orderBuy.orden_oc;
        tr.appendChild(tdNumeroOC);

        const tdObservacion = document.createElement('td');
        tdObservacion.innerText = orderBuy.observacion_oc;
        tr.appendChild(tdObservacion);

        const tdAcciones = document.createElement('td');
        const fragment = document.createDocumentFragment();

        let imgs = [];

        if (orderBuy.estado_oc === 1) {
        } else if (orderBuy.estado_oc === 0) {
            if (['Administrador', 'Gerente general'].includes(localStorage.getItem('rol_usua'))) {
                imgs = [
                    { src: '../imagenes/notaEntrega.svg', onclick: `openNotaEntregaRMW(${orderBuy.id_oc})`, title: 'Generar Nota de Entrega' },
                ];
            } else if (['Ingeniero', 'Gerente De Inventario'].includes(localStorage.getItem('rol_usua'))) {
                imgs = [
                    { src: '../imagenes/notaEntrega.svg', onclick: `openNotaEntregaRMW(${orderBuy.id_oc})`, title: 'Generar Nota de Entrega' },
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
//-------------------------------OPEN AND CLOSE MODAL DE NOTA DE ENTREGA---------------------------------------------
//------read prof_prod
const modalProf_prod = document.querySelector('#cartsProf_prodMW');
const button__prof_prodMW = document.querySelector('#button__prof_prodMW');
let golbalIdOc = 0;
function readProf_prod(id_oc) {
    golbalIdOc = id_oc;
    modalProf_prod.innerHTML = '';
    const productos = oc_prods.filter(oc_prod => oc_prod['fk_id_oc_ocpd'] == id_oc);
    productos.forEach(oc_prod => {
        const card = cartProduct_pfpd(oc_prod, totalPriceM);
        modalProf_prod.appendChild(card);
    })
    //Drang and drop
    const items = modalProf_prod.querySelectorAll(".cart-item");
    items.forEach(item => {
        item.addEventListener("dragstart", () => {
            setTimeout(() => item.classList.add("dragging"), 0);
        });
        item.addEventListener("dragend", () => item.classList.remove("dragging"));
    });
    modalProf_prod.addEventListener("dragover", initSortableListM);
    modalProf_prod.addEventListener("dragenter", e => e.preventDefault());

    totalPriceM();
}
const initSortableListM = (e) => {
    e.preventDefault();
    const draggingItem = document.querySelector(".dragging");

    let siblings = [...modalProf_prod.querySelectorAll(".cart-item:not(.dragging)")];

    let nextSibling = siblings.find(sibling => {
        const rect = sibling.getBoundingClientRect();
        return e.clientY <= rect.top + rect.height / 2;
    });

    modalProf_prod.insertBefore(draggingItem, nextSibling);
}
//--------Muestra la lista de los productos de la proforma
const selectAlmacen = document.querySelector('#selectAlmacen');
selectAlmacen.addEventListener('change', () => {
    const oc_prod = modalProf_prod.querySelectorAll('.cart-item');
    oc_prod.forEach(prod => {
        prod.remove();
    });
    readProf_prod(golbalIdOc);
});
//------Abrir modal de proforma
function cartProduct_pfpd(oc_prod, total) {
    const product = products.find(product => product.id_prod === oc_prod.fk_id_prod_ocpd);
    if (product) {
        const inventoriesAlto = inventories.filter(inventory => inventory.fk_id_prod_inv === product.id_prod && inventory.ubi_almacen === 0);
        const inventoriesArce = inventories.filter(inventory => inventory.fk_id_prod_inv === product.id_prod && inventory.ubi_almacen === 1);

        const cantidad_invAlto = inventoriesAlto.length > 0 ? inventoriesAlto[0].cantidad_inv : 0;
        const cantidad_invArce = inventoriesArce.length > 0 ? inventoriesArce[0].cantidad_inv : 0;

        const cost_uni2 = prices.find(price => price.modelo.trim() === product.codigo_prod);
        const cost_uni = cost_uni2 ? Math.round(Number(cost_uni2.precio) * 1.1) : (inventoriesAlto.length > 0 ? Math.round(inventoriesAlto[0].cost_uni_inv * 1.1) : (inventoriesArce.length > 0 ? Math.round(inventoriesArce[0].cost_uni_inv * 1.1) : 0));

        const card = document.createElement('div');
        card.classList.add('cart-item');
        card.setAttribute('id_prod', product.id_prod);
        card.setAttribute('draggable', 'true');

        const cantidadInvParagraph = document.createElement('p');
        cantidadInvParagraph.classList.add('cart-item__cantInv');

        if (selectAlmacen.value == '0') {
            cantidadInvParagraph.textContent = cantidad_invAlto
        } else if (selectAlmacen.value == '1') {
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
        cantidadInput.value = oc_prod.cantidad_ocpd;
        cantidadInput.min = '1';
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
        costTotalInput.value = oc_prod.cost_uni_ocpd * oc_prod.cantidad_ocpd;
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
}
function totalPriceM() {
    console.log('entro al totalPriceM');

    const divs = document.querySelectorAll('#cartsProf_prodMW div.cart-item');
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



    document.getElementById('subTotal_pfpd').innerHTML = `Sub-Total(${moneda}): ${total.toFixed(2)} ${moneda}`;
    document.getElementById('desc_pfpd').innerHTML = `Desc. ${descuento}% (${moneda}):   ${((total * descuento) / 100).toFixed(2)} ${moneda}`;
    document.getElementById('total_pfpd').innerHTML = `Total(${moneda}): ${((total - (total * descuento) / 100)).toFixed(2)} ${moneda}`;
    document.getElementById('count_pfpd').innerHTML = divs.length;
}


//------Modal de Nota de Entrega
const prof_prodMW = document.getElementById('prof_prodMW');
const closeProf_prodMW = document.getElementById('closeProf_prodMW');
const openNotaEntregaRMW = (id_oc) => {
    prof_prodMW.classList.add('modal__show');
    readProf_prod(id_oc);

}
closeProf_prodMW.addEventListener('click', () => {
    prof_prodMW.classList.remove('modal__show');
})


//----------------------------------------------TABLA DE NOTA DE ENTREGA------------------------------------------------
/*const tableNEMW = document.getElementById('tableNEMW');
//------------------------------------------OPEN AND CLOSE TABLA NOTA DE ENTREGA-----------------------------------
const openTableNEMW = document.getElementById('openTableNEMW');
const closeTableNEMW = document.getElementById('closeTableNEMW');
openTableNEMW.addEventListener('click', () => {
    tableNEMW.classList.add('modal__show');
});
closeTableNEMW.addEventListener('click', () => {
    tableNEMW.classList.remove('modal__show');
})*/
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
                product.nombre_prod.toLowerCase().includes(busqueda) ||
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