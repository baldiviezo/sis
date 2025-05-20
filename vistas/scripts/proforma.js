//--------------------------------------------Restricciones de usuario----------------------------------------------
if (localStorage.getItem('rol_usua') == 'Ingeniero' || localStorage.getItem('rol_usua') == 'Gerente De Inventario') {
    document.getElementsByName('nombre_empM')[0].setAttribute('readonly', 'readonly');
    document.getElementsByName('nombre_clteM')[0].setAttribute('readonly', 'readonly');
    document.getElementsByName('apellido_clteM')[0].setAttribute('readonly', 'readonly');
} else if (localStorage.getItem('rol_usua') == 'Administrador') {
    //document.querySelector('#formProformaR .form__group--select').children[4].removeAttribute('hidden');
    //document.querySelectorAll('#formProformaR .form__group--select')[1].children[3].removeAttribute('hidden');
} else if (localStorage.getItem('rol_usua') == 'Gerente general') {
    //document.querySelector('#formProformaR .form__group--select').children[4].removeAttribute('hidden');
    //document.querySelectorAll('#formProformaR .form__group--select')[1].children[4].removeAttribute('hidden');
}
//-----------------------------------------PRE LOADER---------------------------------------------
const preloader = document.getElementById('preloader');
let requestProf = false;
init();
async function init() {
    if (!requestProf) {
        requestProf = true;
        preloader.classList.add('modal__show');
        try {
            await Promise.all([
                readAllMarcas(),
                readAllCategorias(),
                readProducts(),
                readProformas(),
                readMdfProforma(),
                readProf_prods(),
                readmProf_prods(),
                readCustomers(),
                readEnterprises(),
                readInventories(),
                readPrices(),
                readUsers()
            ]);
            paginacionProduct(products.length, 1);
            paginacionEnterpriseMW(filterEnterprises.length, 1);
            paginacionProforma(proformas.length, 1);
            paginacionProductMW(products.length, 1);
            paginacionPfPd(filterProf_prods.length, 1);
            paginacionInventoryMW(inventories.length, 1);
            requestProf = false;
            preloader.classList.remove('modal__show');
        } catch (error) {
            console.log(error);
            mostrarAlerta('Ocurrio un error al cargar la tabla de proformas. Cargue nuevamente la pagina.');
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
//----------------------------------------------- CARDS PRODUCTS----------------------------------------------
let products = [];
let filterProducts = [];
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
            filterProducts = products;
            filterProductsMW = products;
            resolve();
        }).catch(err => mostrarAlerta('Ocurrio un error al cargar los productos, cargue nuevamente la pagina.'));
    })
}
//------Select utilizado para buscar por columnas
const selectSearchProduct = document.getElementById('selectSearchProduct');
selectSearchProduct.addEventListener('change', searchProducts);
//------buscar por input
const inputSerchProduct = document.getElementById("inputSerchProduct");
inputSerchProduct.addEventListener("keyup", searchProducts);
//------Clientes por pagina
const selectNumberProduct = document.getElementById('selectNumberProduct');
selectNumberProduct.selectedIndex = 2;
selectNumberProduct.addEventListener('change', function () {
    paginacionProduct(filterProducts.length, 1);
});
//-------Marca y categoria
const selectMarcaProduct = document.getElementById('selectMarcaProduct');
selectMarcaProduct.addEventListener('change', selectCategoriaProd);
const selectCategoriaProduct = document.getElementById('selectCategoriaProduct');
selectCategoriaProduct.addEventListener('change', searchProducts);
//------buscar por:
function searchProducts() {
    const valor = selectSearchProduct.value;
    const busqueda = inputSerchProduct.value.toLowerCase().trim();
    filterProducts = products.filter(product => {
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
    selectProducts();
}
//------buscar por marca y categoria:
function selectProducts() {
    filterProducts = filterProducts.filter(product => {
        const marca = selectMarcaProduct.value === 'todasLasMarcas' ? true : product.fk_id_mrc_prod == selectMarcaProduct.value;
        const categoria = selectCategoriaProduct.value === 'todasLasCategorias' ? true : product.fk_id_ctgr_prod == selectCategoriaProduct.value;
        return marca && categoria;
    });
    paginacionProduct(filterProducts.length, 1);
}
//------PaginacionProduct
function paginacionProduct(allProducts, page) {
    let numberProducts = Number(selectNumberProduct.value);
    let allPages = Math.ceil(allProducts / numberProducts);
    let ul = document.querySelector('#wrapperProduct ul');
    let li = '';
    let beforePages = page - 1;
    let afterPages = page + 1;
    let liActive;
    if (page > 1) {
        li += `<li class="btn" onclick="paginacionProduct(${allProducts}, ${page - 1})"><img src="../imagenes/arowLeft.svg"></li>`;
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
        li += `<li class="numb ${liActive}" onclick="paginacionProduct(${allProducts}, ${pageLength})"><span>${pageLength}</span></li>`;
    }
    if (page < allPages) {
        li += `<li class="btn" onclick="paginacionProduct(${allProducts}, ${page + 1})"><img src="../imagenes/arowRight.svg"></li>`;
    }
    ul.innerHTML = li;
    let h2 = document.querySelector('#showPageProduct h2');
    h2.innerHTML = `Pagina ${page}/${allPages}, ${allProducts} Productos`;
    cardProduct(page);
}
function cardProduct(page) {
    console.log('tabla: cardProduct');
    const root = document.getElementById('root');
    const inicio = (page - 1) * Number(selectNumberProduct.value);
    const final = inicio + Number(selectNumberProduct.value);
    const fragment = document.createDocumentFragment();
    root.innerHTML = '';
    const productsToShow = filterProducts.slice(inicio, final);
    for (let product of productsToShow) {
        const box = document.createElement('div');
        box.classList.add('box');

        const imgBox = document.createElement('div');
        imgBox.classList.add('img-box');
        imgBox.style.maxHeight = '70%';
        imgBox.style.maxWidth = '100%';

        const img = document.createElement('img');
        img.classList.add('images');
        img.src = `../modelos/imagenes/${product.imagen_prod}`;
        img.onclick = () => showDetails(product.id_prod);
        imgBox.appendChild(img);
        box.appendChild(imgBox);

        const bottom = document.createElement('div');
        bottom.classList.add('bottom');

        const p = document.createElement('p');
        p.classList.add('box__code');
        p.textContent = product.codigo_prod;

        const button = document.createElement('button');
        button.textContent = 'Añadir';
        button.onclick = () => addCard(product.id_prod);

        bottom.appendChild(p);
        bottom.appendChild(button);
        box.appendChild(bottom);

        fragment.appendChild(box);
    }
    root.appendChild(fragment);
}
//---------------------------------------------MODAL DE UNA CARD-------------------------------------------------
//-------Detalles de la card
const modalCard__body = document.querySelector('.modalCard__body');
function showDetails(id_prod) {
    const product = filterProducts.find(product => product['id_prod'] == id_prod);

    const { nombre_prod, codigo_prod, imagen_prod, descripcion_prod, catalogo_prod } = product;
    const cost_uni2 = prices.find(price => price.modelo === product.codigo_prod);
    const inventory = inventories.find(inventory => inventory.fk_id_prod_inv === id_prod);
    const cantidad_inv = inventory ? inventory.cantidad_inv : 0;
    const cost_uni = cost_uni2 ? Math.round(Number(cost_uni2.precio)) : (inventory ? inventory.cost_uni_inv : 0);

    modalCard__body.innerHTML = `
      <div class="modalCard__head">
        <h4>${nombre_prod}</h4>
        <img src="../imagenes/salir.svg" onclick='closeModalCard()' class="button__close">
      </div>
      <div class="modalCard--body">
        <h5>${codigo_prod}</h5>
        <img src="../modelos/imagenes/${imagen_prod}" class="modalCard__img">
        <h4>Descripcion: </h4>
        <p>${descripcion_prod.replace(/\n/g, '<br>')}</p>
        <h6>Cantidad: ${cantidad_inv}</h6>
        <h3>Precio de lista: ${cost_uni} Bs</h3>
      </div>
      <div class="modalCard__footer">
        <img src="../imagenes/edit.svg" onclick="readProduct(${id_prod})" class="icon__CRUD">
        <a href="${catalogo_prod}" target="_blank" title="Catálogo">${catalogo_prod}</a>
      </div>
    `;
    modalCard.classList.add('modal__show');
}
//-------Modal de la card
const modalCard = document.getElementById('modalCard');
function closeModalCard() {
    modalCard.classList.remove('modal__show');
}
//---------------------------------------------------AÑADIR LA CARD A EL CART------------------------------------
//-------Añadir card al cart
const cartItem = document.getElementById('cartItem');
function addCard(id_prod) {
    let carts = cartItem.querySelectorAll('div.cart-item');
    let i = 0;
    carts.forEach(cart => {
        if (id_prod == cart.getAttribute('id_prod')) { i++ }
    })
    if (i == 0) {
        const card = cartProduct(id_prod, cartItem, totalPrice);
        cartItem.appendChild(card);
        //Drang and drop
        const items = cartItem.querySelectorAll(".cart-item");
        items.forEach(item => {
            item.addEventListener("dragstart", () => {
                setTimeout(() => item.classList.add("dragging"), 0);
            });
            item.addEventListener("dragend", () => item.classList.remove("dragging"));
        });
        cartItem.addEventListener("dragover", initSortableList);
        cartItem.addEventListener("dragenter", e => e.preventDefault());
        totalPrice();
    } else {
        mostrarAlerta('El producto ya se encuentra en el carrito');
    }
}
const initSortableList = (e) => {
    e.preventDefault();
    const draggingItem = document.querySelector(".dragging");

    let siblings = [...cartItem.querySelectorAll(".cart-item:not(.dragging)")];

    let nextSibling = siblings.find(sibling => {
        const rect = sibling.getBoundingClientRect();
        return e.clientY <= rect.top + rect.height / 2;
    });

    cartItem.insertBefore(draggingItem, nextSibling);
}
function cartProduct(id_prod, contenedor, total) {
    const product = filterProducts.find(product => product['id_prod'] == id_prod);
    if (product) {
        const inventoriesAlto = inventories.filter(inventory => inventory.fk_id_prod_inv === id_prod && inventory.ubi_almacen === 0);
        const inventoriesArce = inventories.filter(inventory => inventory.fk_id_prod_inv === id_prod && inventory.ubi_almacen === 1);

        const cantidad_invAlto = inventoriesAlto.length > 0 ? inventoriesAlto[0].cantidad_inv : 0;
        const cantidad_invArce = inventoriesArce.length > 0 ? inventoriesArce[0].cantidad_inv : 0;
        const cantidad_invTotal = cantidad_invAlto + cantidad_invArce;

        const cost_uni2 = prices.find(price => price.modelo.trim() === product.codigo_prod);
        const cost_uni = cost_uni2 ? Math.round(Number(cost_uni2.precio) * 1.1) : (inventoriesAlto.length > 0 ? Math.round(inventoriesAlto[0].cost_uni_inv * 1.1) : (inventoriesArce.length > 0 ? Math.round(inventoriesArce[0].cost_uni_inv * 1.1) : 0));

        const card = document.createElement('div');
        card.classList.add('cart-item');
        card.setAttribute('id_prod', id_prod);
        card.setAttribute('draggable', 'true');

        const cantidadInvParagraph = document.createElement('p');
        cantidadInvParagraph.classList.add('cart-item__cantInv');

        if (cantidad_invAlto > 0 && cantidad_invArce > 0) {
            cantidadInvParagraph.classList.add('almacen-ambos');
        } else if (cantidad_invAlto > 0) {
            cantidadInvParagraph.classList.add('almacen-alto');
        } else if (cantidad_invArce > 0) {
            cantidadInvParagraph.classList.add('almacen-arce');
        }

        cantidadInvParagraph.textContent = cantidad_invTotal;
        card.appendChild(cantidadInvParagraph);

        const rowImgDiv = document.createElement('div');
        rowImgDiv.classList.add('row-img');
        const img = document.createElement('img');
        img.src = `../modelos/imagenes/${product['imagen_prod']}`;
        img.classList.add('rowimg');
        rowImgDiv.appendChild(img);
        card.appendChild(rowImgDiv);

        const codigoParagraph = document.createElement('p');
        codigoParagraph.classList.add('cart-item__codigo');
        codigoParagraph.textContent = product['codigo_prod'];
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
        cantidadInput.value = '1';
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
        costUnitInput.value = cost_uni;
        costUnitInput.classList.add('cart-item__costUnit');
        costUnitInput.addEventListener('change', (e) => {
            const cantidadInput = e.target.parentNode.querySelector('.cart-item__cantidad');
            const costTotalInput = e.target.parentNode.querySelector('.cart-item__costTotal');
            updateCostTotal(cantidadInput, e.target, costTotalInput);
        });
        card.appendChild(costUnitInput);

        const costTotalInput = document.createElement('input');
        costTotalInput.type = 'number';
        costTotalInput.value = cost_uni;
        costTotalInput.classList.add('cart-item__costTotal');
        costTotalInput.readOnly = true;
        card.appendChild(costTotalInput);

        const trashImg = document.createElement('img');
        trashImg.src = '../imagenes/trash.svg';
        trashImg.classList.add('icon__CRUD');
        trashImg.addEventListener('click', (e) => removeCardFromCart(e, contenedor));
        card.appendChild(trashImg);
        return card;
    }
}
//------Eliminar cart
function removeCardFromCart(e, container) {
    const card = e.target.parentNode;
    container.removeChild(card);
    totalPrice();
}
//-------Precio total y moneda
const totalProfR = document.getElementById('totalProfR');
function totalPrice() {
    const divs = cartItem.querySelectorAll('div.cart-item');
    const moneda = selectMoneyCart.value;
    let total = 0;
    if (divs.length > 0) {
        divs.forEach(div => {
            const costoTotal = div.querySelector('.cart-item__costTotal').value;
            const costo = parseFloat(costoTotal);
            if (!isNaN(costo)) {
                total += costo;
            }
        });
    }
    totalProfR.innerHTML = moneda + ' ' + total.toFixed(2);
    document.getElementById('count').innerHTML = divs.length;
}
//-------Tipo de moneda
const selectMoneyCart = document.getElementById('selectMoneyCart');
const tipoDeCambioProf = document.getElementById('tipoDeCambioProf');
tipoDeCambioProf.addEventListener('change', changueRelacionMoneda);
let valorAnterior = tipoDeCambioProf.value;
function changueRelacionMoneda() {
    const valorNuevo = tipoDeCambioProf.value;
    changueCostUni(valorAnterior, valorNuevo);
    valorAnterior = valorNuevo;
}
selectMoneyCart.addEventListener('change', () => changueCostUni(1, valorAnterior));
function changueCostUni(relacionAnterior, relacionNueva) {
    if (selectMoneyCart.value == '$') {
        tipoDeCambioProf.removeAttribute('hidden');

        const costoUnitario = document.querySelectorAll('.cart-item__costUnit');
        costoUnitario.forEach(function (costo) {
            const valorActual = parseFloat(costo.value);
            const valorNuevo = (valorActual * relacionAnterior) / relacionNueva;
            costo.value = valorNuevo.toFixed(2);

            // Multiplicar por la cantidad
            const cantidad = costo.parentNode.querySelector('.cart-item__cantidad').value;
            const costoTotal = valorNuevo * cantidad;
            costo.parentNode.querySelector('.cart-item__costTotal').value = costoTotal.toFixed(2);

        });

    } else {
        tipoDeCambioProf.setAttribute('hidden', '');
        const costoUnitario = document.querySelectorAll('.cart-item__costUnit');
        costoUnitario.forEach(function (costo) {
            const valorActual = parseFloat(costo.value);
            const valorNuevo = (valorActual * relacionNueva) / relacionAnterior;
            costo.value = valorNuevo.toFixed(2);

            // Multiplicar por la cantidad
            const cantidad = costo.parentNode.querySelector('.cart-item__cantidad').value;
            const costoTotal = valorNuevo * cantidad;
            costo.parentNode.querySelector('.cart-item__costTotal').value = costoTotal.toFixed(2);
        });
    }
    // Llamar a la función totalPrice()
    totalPrice();
}
//--------------------------------------------PROFORMA-----------------------------------------------------
let proformas = [];
let filterProformas = [];
let formProformas;
async function readProformas() {
    return new Promise((resolve, reject) => {
        let formData = new FormData();
        formData.append('readProformas', '');
        fetch('../controladores/proforma.php', {
            method: "POST",
            body: formData
        }).then(response => response.json()).then(data => {
            const isAdmin = ['Gerente general', 'Administrador'].includes(localStorage.getItem('rol_usua'));
            proformas = isAdmin ? data : data.filter(proforma => proforma.fk_id_usua_prof === localStorage.getItem('id_usua'));
            filterProformas = proformas;
            resolve();
            createYearProforma();
        }).catch(err => console.log(err));
    })
}
//------Select utilizado para buscar por columnas
const selectSearchProf = document.getElementById('selectSearchProf');
selectSearchProf.addEventListener('change', searchProforma);
//------buscar por input
const inputSearchProf = document.getElementById("inputSearchProf");
inputSearchProf.addEventListener("keyup", searchProforma);
//------Proformas por pagina
const selectNumberProf = document.getElementById('selectNumberProf');
selectNumberProf.selectedIndex = 3;
selectNumberProf.addEventListener('change', function () {
    paginacionProforma(filterProformas.length, 1);
});
//-------Estado de proforma
const selectStateProf = document.getElementById('selectStateProf');
selectStateProf.addEventListener('change', searchProforma);
//------buscar por:
function searchProforma() {
    const valor = selectSearchProf.value;
    const busqueda = inputSearchProf.value.toLowerCase().trim();

    filterProformas = proformas.filter(proforma => {
        let cliente = customers.find(customer => customer.id_clte === proforma.fk_id_clte_prof);
        let empresa = enterprises.find(enterprise => enterprise.id_emp === cliente.fk_id_emp_clte);
        let usuario = users.find(user => user.id_usua === proforma.fk_id_usua_prof);

        if (valor === 'todas') {
            return (
                proforma.numero_prof.toLowerCase().includes(busqueda) ||
                proforma.fecha_prof.toLowerCase().includes(busqueda) ||
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
            return proforma[valor].toLowerCase().includes(busqueda);
        }
    });
    selectStateProformas();
}
function createYearProforma() {
    const anios = Array.from(new Set(proformas.map(proforma => proforma.fecha_prof.split('-')[0])));

    // Crear opciones para selectYearProf
    selectYearProf.innerHTML = '';
    let optionFirst = document.createElement('option');
    optionFirst.value = 'todas';
    optionFirst.innerText = 'Todos los años';
    selectYearProf.appendChild(optionFirst);
    for (let anio of anios) {
        const option = document.createElement('option');
        option.value = anio;
        option.textContent = anio;
        selectYearProf.appendChild(option);
    }

    // Crear opciones para selectYearPfPd
    selectYearPfPd.innerHTML = '';
    optionFirst = document.createElement('option');
    optionFirst.value = 'todas';
    optionFirst.innerText = 'Todos los años';
    selectYearPfPd.appendChild(optionFirst);
    for (let anio of anios) {
        const option = document.createElement('option');
        option.value = anio;
        option.textContent = anio;
        selectYearPfPd.appendChild(option);
    }
}
//------seleccionar el año
const selectYearProf = document.getElementById('selectYearProf');
selectYearProf.addEventListener('change', searchProforma);
const selectMonthProf = document.getElementById('selectMonthProf');
selectMonthProf.addEventListener('change', searchProforma);
//------buscar por marca y categoria:
function selectStateProformas() {
    filterProformas = filterProformas.filter(proforma => {
        const estado = selectStateProf.value === 'todasLasProformas' ? true : proforma.estado_prof === selectStateProf.value;
        const fecha = selectYearProf.value === 'todas' ? true : proforma.fecha_prof.split('-')[0] === selectYearProf.value;
        const mes = selectMonthProf.value === 'todas' ? true : proforma.fecha_prof.split('-')[1] === selectMonthProf.value;
        return estado && fecha && mes;
    });
    paginacionProforma(filterProformas.length, 1);
}
//------Ordenar tabla descendente ascendente
let orderProforma = document.querySelectorAll('.tbody__head--proforma');
orderProforma.forEach(div => {
    div.children[0].addEventListener('click', function () {
        filterProformas.sort((a, b) => {
            let first = a[div.children[0].name];
            let second = b[div.children[0].name];
            if (typeof first === 'number' && typeof second === 'number') {
                return first - second;
            } else {
                return String(first).localeCompare(String(second));
            }
        });
        paginacionProforma(filterProformas.length, 1);
    });
    div.children[1].addEventListener('click', function () {
        filterProformas.sort((a, b) => {
            let first = a[div.children[0].name];
            let second = b[div.children[0].name];
            if (typeof first === 'number' && typeof second === 'number') {
                return second - first;
            } else {
                return String(second).localeCompare(String(first));
            }
        });
        paginacionProforma(filterProformas.length, 1);
    });
});
//------PaginacionProforma
function paginacionProforma(allProducts, page) {
    let numberProducts = Number(selectNumberProf.value);
    let allPages = Math.ceil(allProducts / numberProducts);
    let ul = document.querySelector('#wrapperProf ul');
    let li = '';
    let beforePages = page - 1;
    let afterPages = page + 1;
    let liActive;
    if (page > 1) {
        li += `<li class="btn" onclick="paginacionProforma(${allProducts}, ${page - 1})"><img src="../imagenes/arowLeft.svg"></li>`;
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
        li += `<li class="numb ${liActive}" onclick="paginacionProforma(${allProducts}, ${pageLength})"><span>${pageLength}</span></li>`;
    }
    if (page < allPages) {
        li += `<li class="btn" onclick="paginacionProforma(${allProducts}, ${page + 1})"><img src="../imagenes/arowRight.svg"></li>`;
    }
    ul.innerHTML = li;
    let h2 = document.querySelector('#showPageProf h2');
    h2.innerHTML = `Pagina ${page}/${allPages}, ${allProducts} Proformas`;
    tableProformas(page);
}
//--------Tabla de proforma
function tableProformas(page) {
    const totalProfMW = document.getElementById('totalProfMW');
    const total = filterProformas.reduce((acc, current) => acc + current.total_prof, 0);
    totalProfMW.innerText = `Total (Bs):  ${total.toFixed(2)} Bs`;

    const tbody = document.getElementById('tbodyProforma');
    const inicio = (page - 1) * Number(selectNumberProf.value);
    const final = inicio + Number(selectNumberProf.value);
    const proformas = filterProformas.slice(inicio, final);
    tbody.innerHTML = '';
    proformas.forEach((proforma, index) => {

        const cliente = customers.find(customer => customer.id_clte === proforma.fk_id_clte_prof);
        const usuario = users.find(user => user.id_usua === proforma.fk_id_usua_prof);
        const empresa = enterprises.find(enterprise => enterprise.id_emp === cliente.fk_id_emp_clte);
        const tr = document.createElement('tr');

        tr.setAttribute('id_prof', proforma.id_prof);

        const tdNumero = document.createElement('td');
        tdNumero.innerText = index + 1;
        tr.appendChild(tdNumero);

        const tdNumeroProforma = document.createElement('td');
        tdNumeroProforma.innerText = proforma.numero_prof;
        tr.appendChild(tdNumeroProforma);

        const tdFecha = document.createElement('td');
        tdFecha.innerText = proforma.fecha_prof;
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
        tdTotal.innerText = proforma.total_prof + ' ' + proforma.moneda_prof;
        tr.appendChild(tdTotal);

        const tdAcciones = document.createElement('td');
        const fragment = document.createDocumentFragment();

        let imgs = [];

        if (proforma.estado_prof == 'vendido') {
            imgs = [
                { src: '../imagenes/pdf.svg', onclick: `selectPDFInformation(${proforma.id_prof}, "prof")`, title: 'Mostrar PDF' }
            ];
            const hasMdfProforma = mdfPproforma.filter(mdfProforma => mdfProforma.id_prof_mprof == proforma.id_prof).length > 0;
            if (hasMdfProforma) {
                imgs.push({ src: '../imagenes/folder.svg', onclick: `showMdfProforma(${proforma.id_prof})`, title: 'Proformas anteriores' });
            }
        } else if (proforma.estado_prof == 'pendiente') {
            if (['Administrador', 'Gerente general'].includes(localStorage.getItem('rol_usua'))) {
                imgs = [
                    //{ src: '../imagenes/notaEntrega.svg', onclick: 'openNotaEntregaRMW(this.parentNode.parentNode)', title: 'Generar Nota de Entrega' },
                    { src: '../imagenes/pdf.svg', onclick: `selectPDFInformation(${proforma.id_prof}, "prof")`, title: 'Mostrar PDF' },
                    { src: '../imagenes/edit.svg', onclick: `readProforma(${proforma.id_prof})`, title: 'Editar Proforma' },
                    { src: '../imagenes/trash.svg', onclick: `deleteProforma(${proforma.id_prof})`, title: 'Eliminar Proforma' }
                ];
            } else if (['Ingeniero', 'Gerente De Inventario'].includes(localStorage.getItem('rol_usua'))) {
                imgs = [
                    //{ src: '../imagenes/notaEntrega.svg', onclick: 'openNotaEntregaRMW(this.parentNode.parentNode)', title: 'Generar Nota de Entrega' },
                    { src: '../imagenes/pdf.svg', onclick: `selectPDFInformation(${proforma.id_prof}, "prof")`, title: 'Mostrar PDF' },
                    { src: '../imagenes/edit.svg', onclick: `readProforma(${proforma.id_prof})`, title: 'Editar Proforma' }
                ];
            }
            const hasMdfProforma = mdfPproforma.filter(mdfProforma => mdfProforma.id_prof_mprof == proforma.id_prof).length > 0;
            if (hasMdfProforma) {
                imgs.push({ src: '../imagenes/folder.svg', onclick: `showMdfProforma(${proforma.id_prof})`, title: 'Proformas anteriores' });
            }
        } else if (proforma.estado_prof == 'devolucion') {
            imgs = [
                { src: '../imagenes/pdf.svg', onclick: `selectPDFInformation(${proforma.id_prof}, "prof")`, title: 'Mostrar PDF' }
            ]
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
//-------------------------------------MODAL DE TABLA DE PROFORMA--------------------------------------------
const closeTableProfMW = document.getElementById('closeTableProfMW');
const tableProfMW = document.getElementById('tableProfMW');
function openTableProfMW() {
    tableProfMW.classList.add('modal__show');
}
closeTableProfMW.addEventListener('click', (e) => {
    tableProfMW.classList.remove('modal__show');
});
//---------------------------------------------------------CRUD PROFORMA-------------------------------------------
//------Create una proforma
const formProformaR = document.getElementById('formProformaR')
formProformaR.addEventListener('submit', createProforma);
async function createProforma() {
    const tbodyPreviewProd = document.getElementById('tbodyPreviewProd');
    const trs = document.querySelectorAll('#tbodyPreviewProd tr');

    if (requestProf === false) {
        requestProf = true;
        preloader.classList.add('modal__show');
        proformaRMW.classList.remove('modal__show');
        previewProducts.classList.remove('modal__show');

        const productos = [];
        for (let div of cartItem.querySelectorAll('div.cart-item')) {
            productos.push({
                id_prod: div.getAttribute('id_prod'),
                cantidad: div.querySelector('.cart-item__cantidad').value,
                costoUnitario: div.querySelector('.cart-item__costUnit').value
            })
        }

        let formData = new FormData(formProformaR);
        const total = (Number(totalProfR.innerHTML.split(' ')[1]) * Number(1 - document.getElementById('descuento_profR').value / 100)).toFixed(2);
        formData.set("total_profR", total);
        formData.append('createProforma', JSON.stringify(productos));
        formData.append('moneda_profR', selectMoneyCart.value);
        formData.append('tipo_cambio_profR', tipoDeCambioProf.value);
        formData.append('id_usua', localStorage.getItem('id_usua'));
        fetch('../controladores/proforma.php', {
            method: "POST",
            body: formData
        }).then(response => response.text()).then(data => {
            Promise.all([readProformas(), readProf_prods()]).then(() => {
                paginacionProforma(proformas.length, 1);
                paginacionPfPd(filterProf_prods.length, 1);
                requestProf = false;
                preloader.classList.remove('modal__show');
                cartItem.innerHTML = '';
                totalPrice();
                fillFormProfR();
                mostrarAlerta(data);
            })
        }).catch(err => {
            requestProf = false;
            mostrarAlerta(err);
        });
    }
}
//------Read una proforma
function readProforma(id_prof) {
    formProformas = 'M';
    const proforma = filterProformas.find(proforma => proforma.id_prof == id_prof);

    for (const valor in proforma) {
        if (valor != 'fk_id_usua_prof' && valor != 'estado_prof') {
            document.getElementsByName(valor + 'M')[0].value = proforma[valor];
            if (valor == 'moneda_prof') {
                if (proforma[valor] == '$') {
                    tipoDeCambioProfM.classList.remove('hide');
                } else {
                    tipoDeCambioProfM.classList.add('hide');
                }
            }
        }
    }

    const cliente = customers.find(customer => customer.id_clte === proforma.fk_id_clte_prof);
    const empresa = enterprises.find(enterprise => enterprise.id_emp === cliente.fk_id_emp_clte);
    fk_id_clte_profM.value = proforma.fk_id_clte_prof;
    fk_id_emp_clteM.value = empresa.id_emp;
    fk_nombre_emp_profM.value = empresa.nombre_emp;
    fk_cliente_profM.value = cliente.apellido_clte + ' ' + cliente.nombre_clte;

    proformaMMW.classList.add('modal__show');
    readProf_prod();
}
//------read prof_prod
const modalProf_prod = document.querySelector('#cartsProf_prodMW');
function readProf_prod() {
    modalProf_prod.innerHTML = '';
    const id_prof = document.getElementById('id_profM').value;
    const prof_prods_filtered = prof_prods.filter(prof_prod => prof_prod['fk_id_prof_pfpd'] == id_prof);
    prof_prods_filtered.forEach(prof_prod => {
        const card = cartProduct_pfpd(prof_prod, modalProf_prod, totalPriceM);
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
function cartProduct_pfpd(prof_prod, contenedor, total) {
    const product = products.find(product => product.id_prod === prof_prod.fk_id_prod_pfpd);
    if (product) {
        const inventoriesAlto = inventories.filter(inventory => inventory.fk_id_prod_inv === product.id_prod && inventory.ubi_almacen === 0);
        const inventoriesArce = inventories.filter(inventory => inventory.fk_id_prod_inv === product.id_prod && inventory.ubi_almacen === 1);

        const cantidad_invAlto = inventoriesAlto.length > 0 ? inventoriesAlto[0].cantidad_inv : 0;
        const cantidad_invArce = inventoriesArce.length > 0 ? inventoriesArce[0].cantidad_inv : 0;
        const cantidad_invTotal = cantidad_invAlto + cantidad_invArce;

        const cost_uni2 = prices.find(price => price.modelo.trim() === product.codigo_prod);
        const cost_uni = cost_uni2 ? Math.round(Number(cost_uni2.precio) * 1.1) : (inventoriesAlto.length > 0 ? Math.round(inventoriesAlto[0].cost_uni_inv * 1.1) : (inventoriesArce.length > 0 ? Math.round(inventoriesArce[0].cost_uni_inv * 1.1) : 0));

        const card = document.createElement('div');
        card.classList.add('cart-item');
        card.setAttribute('id_prod', product.id_prod);
        card.setAttribute('draggable', 'true');

        const cantidadInvParagraph = document.createElement('p');
        cantidadInvParagraph.classList.add('cart-item__cantInv');

        if (cantidad_invAlto > 0 && cantidad_invArce > 0) {
            cantidadInvParagraph.classList.add('almacen-ambos');
        } else if (cantidad_invAlto > 0) {
            cantidadInvParagraph.classList.add('almacen-alto');
        } else if (cantidad_invArce > 0) {
            cantidadInvParagraph.classList.add('almacen-arce');
        }

        cantidadInvParagraph.textContent = cantidad_invTotal;
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
        cantidadInput.value = prof_prod.cantidad_pfpd;
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
        costUnitInput.value = prof_prod.cost_uni_pfpd;
        costUnitInput.classList.add('cart-item__costUnit');
        costUnitInput.addEventListener('change', (e) => {
            const cantidadInput = e.target.parentNode.querySelector('.cart-item__cantidad');
            const costTotalInput = e.target.parentNode.querySelector('.cart-item__costTotal');
            updateCostTotal(cantidadInput, e.target, costTotalInput);
        });
        card.appendChild(costUnitInput);

        const costTotalInput = document.createElement('input');
        costTotalInput.type = 'number';
        costTotalInput.value = prof_prod.cost_uni_pfpd * prof_prod.cantidad_pfpd;
        costTotalInput.classList.add('cart-item__costTotal');
        costTotalInput.readOnly = true;
        card.appendChild(costTotalInput);

        const trashImg = document.createElement('img');
        trashImg.src = '../imagenes/trash.svg';
        trashImg.classList.add('icon__CRUD');
        trashImg.addEventListener('click', (e) => removeCardFromCart(e, contenedor));
        card.appendChild(trashImg);
        return card;
    }
}
function totalPriceM() {
    const divs = document.querySelectorAll('#cartsProf_prodMW div.cart-item');
    const moneda = moneda_profM.value;
    let total = 0;
    divs.forEach(div => {
        costo = Number(div.querySelector('.cart-item__costTotal').value);
        total = total + costo;
    })
    const descuento = Number(document.getElementById('descuento_profM').value);
    document.getElementById('subTotal_pfpd').innerHTML = `Sub-Total(${moneda}): ${total.toFixed(2)} ${moneda}`;
    document.getElementById('desc_pfpd').innerHTML = `Desc. ${descuento}% (${moneda}):   ${((total * descuento) / 100).toFixed(2)} ${moneda}`;
    document.getElementById('total_pfpd').innerHTML = `Total(${moneda}): ${((total - (total * descuento) / 100)).toFixed(2)} ${moneda}`;
    document.getElementById('count_pfpd').innerHTML = divs.length;
}
//-------Tipo de moneda
const moneda_profM = document.getElementById('moneda_profM');
const tipo_cambio_profM = document.getElementById('tipo_cambio_profM');
tipo_cambio_profM.addEventListener('change', changueRelacionMonedaM);
let valorAnteriorM = tipo_cambio_profM.value;

function changueRelacionMonedaM() {
    console.log('sdasd')
    const valorNuevo = tipo_cambio_profM.value;
    changueCostUniM(valorAnterior, valorNuevo);
    valorAnterior = valorNuevo;
}
moneda_profM.addEventListener('change', () => changueCostUniM(1, valorAnterior));
const tipoDeCambioProfM = document.getElementById('tipoDeCambioProfM');
function changueCostUniM(relacionAnterior, relacionNueva) {
    if (moneda_profM.value == '$') {
        tipoDeCambioProfM.classList.remove('hide')

        const costoUnitario = document.querySelectorAll('.cart-item__costUnit');
        costoUnitario.forEach(function (costo) {
            const valorActual = parseFloat(costo.value);
            const valorNuevo = (valorActual * relacionAnterior) / relacionNueva;
            costo.value = valorNuevo.toFixed(2);

            // Multiplicar por la cantidad
            const cantidad = costo.parentNode.querySelector('.cart-item__cantidad').value;
            const costoTotal = valorNuevo * cantidad;
            costo.parentNode.querySelector('.cart-item__costTotal').value = costoTotal.toFixed(2);

        });

    } else {
        tipoDeCambioProfM.classList.add('hide');
        const costoUnitario = document.querySelectorAll('.cart-item__costUnit');
        costoUnitario.forEach(function (costo) {
            const valorActual = parseFloat(costo.value);
            const valorNuevo = (valorActual * relacionNueva) / relacionAnterior;
            costo.value = valorNuevo.toFixed(2);

            // Multiplicar por la cantidad
            const cantidad = costo.parentNode.querySelector('.cart-item__cantidad').value;
            const costoTotal = valorNuevo * cantidad;
            costo.parentNode.querySelector('.cart-item__costTotal').value = costoTotal.toFixed(2);
        });
    }
    // Llamar a la función totalPrice()
    totalPriceM();
}


//------Update una proforma
let formProformaM = document.getElementById('formProformaM');
formProformaM.addEventListener('submit', updateProforma)
async function updateProforma() {
    const modal = document.querySelector('#cartsProf_prodMW');
    const cartItems = modal.querySelectorAll('div.cart-item');
    if (cartItems.length > 0) {
        if (requestProf == false) {
            requestProf = true;
            proformaMMW.classList.remove('modal__show');
            prof_prodMW.classList.remove('modal__show');
            previewProducts.classList.remove('modal__show');
            let array = [];
            cartItems.forEach(product => {
                let valor = {};
                valor['id_prod'] = product.getAttribute('id_prod');
                valor['cantidad'] = product.children[3].value;
                valor['costoUnitario'] = product.children[4].value;
                array.push(valor);
            });
            let productos = JSON.stringify(array); //string json
            let form = document.getElementById('formProformaM');
            let formData = new FormData(form);
            formData.set("total_profM", Number(document.getElementById('total_pfpd').innerHTML.split(' ')[1]));
            formData.append('updateProforma', productos);
            formData.append('id_usua', localStorage.getItem('id_usua'));
            preloader.classList.add('modal__show');
            fetch('../controladores/proforma.php', {
                method: "POST",
                body: formData
            }).then(response => response.text()).then(data => {
                Promise.all([readProformas(), readProf_prods(), readMdfProforma(), readmProf_prods()]).then(() => {
                    paginacionProforma(proformas.length, 1);
                    requestProf = false;
                    preloader.classList.remove('modal__show');
                    mostrarAlerta(data);
                })
            }).catch(err => {
                requestProf = false;
                mostrarAlerta(err);
            });
        }
    } else {
        mostrarAlerta('No a seleccionado ningun producto');
    }
}
//-------Delete una proforma
async function deleteProforma(id_prof) {
    if (confirm('¿Esta usted seguro?')) {
        if (requestProf == false) {
            requestProf = true;
            let formData = new FormData();
            formData.append('deleteProforma', id_prof);
            preloader.classList.add('modal__show');
            fetch('../controladores/proforma.php', {
                method: "POST",
                body: formData
            }).then(response => response.text()).then(data => {
                Promise.all([readProformas(), readProf_prods()]).then(() => {
                    paginacionProforma(proformas.length, 1);
                    paginacionPfPd(filterProf_prods.length, 1);
                    requestProf = false;
                    preloader.classList.remove('modal__show');
                    mostrarAlerta(data);
                })
            }).catch(err => {
                requestProf = false;
                mostrarAlerta(err);
            });
        }
    }
}
//------------------------------------MOSTRAR LOS PRODUCTOS PREVIAMENTE--------------------------------------------
function openPreviwProducts() {
    let cart;
    if (formProformas === 'R') {
        cart = document.querySelectorAll('#cartItem .cart-item')
    } else if (formProformas === 'M') {
        cart = document.querySelectorAll('#cartsProf_prodMW .cart-item')
    }
    if (fk_id_emp_clteR.value == '' && formProformas == 'R') {
        mostrarAlerta('Selecciona una empresa');
        return;
    }
    if (cart.length > 0) {
        const tbody = document.getElementById('tbodyPreviewProd');
        const productos = getProducts();
        const moneda = getMoneda();
        const total = calculateTotal(productos);
        const desc = getDescuento();
        createTable(tbody, productos, moneda);
        updateTotales(total, desc, moneda);
        createButton(tbody, formProformas);
        previewProducts.classList.add('modal__show');
    } else {
        mostrarAlerta('No a seleccionado ningun producto');
    }
}
const titleEnterprise = document.getElementById('titleEnterprise');
const titleCustomer = document.getElementById('titleCustomer');
function getProducts() {
    if (formProformas === 'R') {
        const empresa = enterprises.find(enterprise => enterprise.id_emp == fk_id_emp_clteR.value);
        const cliente = customers.find(customer => customer.id_clte == fk_id_clte_profR.value);

        titleEnterprise.innerText = `EMPRESA: ${empresa.nombre_emp}`;
        titleCustomer.innerText = `CLIENTE: ${cliente.apellido_clte + ' ' + cliente.nombre_clte}`;

        return document.querySelectorAll('#cartItem .cart-item');
    } else if (formProformas === 'M') {

        const empresa = enterprises.find(enterprise => enterprise.id_emp == fk_id_emp_clteM.value);
        const cliente = customers.find(customer => customer.id_clte == fk_id_clte_profM.value);

        titleEnterprise.innerText = `EMPRESA: ${empresa.nombre_emp}`;
        titleCustomer.innerText = `CLIENTE: ${cliente.apellido_clte + ' ' + cliente.nombre_clte}`;
        return document.querySelectorAll('#cartsProf_prodMW .cart-item');
    }
}
function getMoneda() {
    if (formProformas === 'R') {
        return document.getElementById('selectMoneyCart').value;
    } else if (formProformas === 'M') {
        return document.getElementsByName('moneda_profM')[0].value;
    }
}
function calculateTotal(productos) {
    let total = 0;
    productos.forEach(producto => {
        total += Number(producto.querySelector('.cart-item__costTotal').value);
    });
    return total;
}
function getDescuento() {
    return Number(document.getElementsByName('descuento_prof' + formProformas)[0].value);
}
function createTable(tbody, productos, moneda) {
    const fragment = document.createDocumentFragment();

    productos.forEach((producto, index) => {

        const row = products.find(product => product.id_prod == producto.getAttribute('id_prod'));
        const monedaSymbol = `<b>${moneda}</b>`;

        const tr = document.createElement('tr');
        tr.setAttribute('id_prod', producto.getAttribute('id_prod'));

        const tdIndex = document.createElement('td');
        tdIndex.innerText = index + 1;
        tr.appendChild(tdIndex);

        const tdDescripcion = document.createElement('td');
        tdDescripcion.innerText = row.descripcion_prod;
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

    const tbody = document.getElementById('tbodyPreviewProd');

    const footerData = [
        { value: `Sub-Total: ${total.toFixed(2)}` },
        { value: `Desc. ${desc}%: ${(total * desc / 100).toFixed(2)}` },
        { value: `Total: ${(total - (total * desc / 100)).toFixed(2)}` }
    ];

    footerData.forEach((item, index) => {
        const tr = document.createElement('tr');
        const tdLabel = document.createElement('td');
        tdLabel.setAttribute('colspan', '5');

        const tdValue = document.createElement('td');
        tdValue.classList.add('footer__tbody');
        tdValue.innerText = `${item.value} ${moneda}`;

        tr.appendChild(tdLabel);
        tr.appendChild(tdValue);
        tbody.appendChild(tr);
    });
}
function createButton(tbody, formProformas) {
    const tr = document.createElement('tr');
    const tdLabel = document.createElement('td');
    const tdValue = document.createElement('td');
    const button = document.createElement('button');
    button.classList.add('button__sell--previw');
    button.innerText = 'Registrar';
    if (formProformas === 'R') {
        button.setAttribute('onclick', 'createProforma();');
    } else if (formProformas === 'M') {
        button.setAttribute('onclick', 'updateProforma();');
    }

    tdLabel.setAttribute('colspan', '5');
    tdValue.appendChild(button);
    tr.appendChild(tdLabel);
    tr.appendChild(tdValue);
    tbody.appendChild(tr);
}
//<------------------------------------------MODAL PROFORMA--------------------------------------------
const openProformaRMW = document.getElementById('openProformaRMW');
const openProformaMMW = document.getElementById('openProformaMMW');
const closeProformaRMW = document.getElementById('closeProformaRMW');
const closeProformaMMW = document.getElementById('closeProformaMMW');
const proformaRMW = document.getElementById('proformaRMW');
const proformaMMW = document.getElementById('proformaMMW');
openProformaRMW.addEventListener('click', () => {
    document.getElementsByName('fecha_profR')[0].value = `${dateActual[2]}-${dateActual[1]}-${dateActual[0]}`;
    formProformas = 'R';
    if (findOutCartItem() == '' && findCostUni('') == '') {
        proformaRMW.classList.add('modal__show');
    } else {
        mostrarAlerta(findOutCartItem() + findCostUni());
    }
});
function findOutCartItem() {
    let cartItem = document.querySelectorAll('#cartItem div.cart-item');
    let errorMessage = '';
    cartItem.forEach(cart => {
        if (!isInteger(cart.children[3].value)) {
            errorMessage += `La cantidad de "${cart.children[2].innerText}" no es un valor entero\n`;
        }
    });
    return errorMessage;
}
//------Mostrar una alerta si el cost uni es menor a 0
function findCostUni() {
    let cartItem = document.querySelectorAll('#cartItem div.cart-item');
    let errorMessage = '';
    cartItem.forEach(cart => {
        if (Number(cart.children[4].value) <= 0) {
            errorMessage += `El costo unitario de "${cart.children[2].innerText}" no es un valor valido\n`;
        }
    })
    return errorMessage;
}
closeProformaRMW.addEventListener('click', (e) => {
    proformaRMW.classList.remove('modal__show');
});
closeProformaMMW.addEventListener('click', (e) => {
    proformaMMW.classList.remove('modal__show');
});
//---------------------------------------------------------CAMPOS DE FORMULARIO-------------------------------------------
//-----Llenar campos de la porforma
fillFormProfR();
function fillFormProfR() {
    document.getElementsByName('tpo_valido_profR')[0].value = '30 dias';
    document.getElementsByName('cond_pago_profR')[0].innerHTML = `CHEQUE A NOMBRE DE: SMS INTEGRACION Y CONTROL LTDA					
Transferencia / Deposito: Banco BISA					
Titular: SMS INTEGRACION Y CONTROL LTDA					
NIT: 153578020					
Numero de cuenta en Bs.: 1675590024`;
    document.getElementsByName('tpo_entrega_profR')[0].innerHTML = `48 Horas después de la confirmación de su pedido.`;
    document.getElementsByName('observacion_profR')[0].innerHTML = `Precios ofertados válidos sólo a la compra de la totalidad de la proforma o según seleccion previa consulta`;
}
function isInteger(input) {
    return /^[-+]?\d+$/.test(input);
}
//-------------------------------------------------------CRUD PROFORMAS MODIFICADAS---------------------------------
let mdfPproforma = [];
async function readMdfProforma() {
    return new Promise((resolve, reject) => {
        let formData = new FormData();
        formData.append('read_mdf_Proforma', '')
        fetch('../controladores/proforma.php', {
            method: "POST",
            body: formData
        }).then(response => response.json()).then(data => {
            mdfPproforma = data;
            resolve();
        }).catch(err => console.log(err));
    })
}
function showMdfProforma(id_prof) {
    const tbody = document.getElementById('tbodymProforma');
    const tablemProfMW = document.getElementById('tablemProfMW');

    tablemProfMW.classList.add('modal__show');
    tbody.innerHTML = '';
    document.querySelector('#tablemProfMW div.table__title h1').innerHTML = proformas.find(proforma => proforma.id_prof === id_prof).numero_prof;

    let i = 1;
    mdfPproforma.forEach((proforma, index) => {
        if (proforma.id_prof_mprof === id_prof) {
            const cliente = customers.find(customer => customer.id_clte === proforma.fk_id_clte_mprof);
            const usuario = users.find(user => user.id_usua === proforma.fk_id_usua_mprof);
            const empresa = enterprises.find(enterprise => enterprise.id_emp === cliente.fk_id_emp_clte);
            const tr = document.createElement('tr');

            tr.setAttribute('id_mprof', proforma.id_mprof);

            const tdNumero = document.createElement('td');
            tdNumero.innerText = i;
            tr.appendChild(tdNumero);

            const tdNumeroProforma = document.createElement('td');
            tdNumeroProforma.innerText = proforma.numero_mprof;
            tr.appendChild(tdNumeroProforma);

            const tdFecha = document.createElement('td');
            tdFecha.innerText = proforma.fecha_mprof;
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
            tdTotal.innerText = proforma.total_mprof + ' ' + proforma.moneda_mprof;
            tr.appendChild(tdTotal);

            const tdAcciones = document.createElement('td');
            const fragment = document.createDocumentFragment();

            let imgs = [];


            if (['Administrador', 'Gerente general'].includes(localStorage.getItem('rol_usua'))) {
                imgs = [
                    { src: '../imagenes/pdf.svg', onclick: `selectPDFInformation(${proforma.id_mprof}, "mprof")`, title: 'PDF' },
                    { src: '../imagenes/trash.svg', onclick: `deleteMdfProforma(${proforma.id_mprof}, "mprof")`, title: 'Eliminar' }
                ];
            } else if (['Ingeniero', 'Gerente De Inventario'].includes(localStorage.getItem('rol_usua'))) {
                imgs = [
                    { src: '../imagenes/pdf.svg', onclick: `selectPDFInformation(${proforma.id_mprof}, "mprof")`, title: 'PDF' }
                ];
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
            i++;
        }
    });
}
//-------Delete una proforma modificada
async function deleteMdfProforma(id_mprof) {
    if (confirm('¿Esta usted seguro?')) {
        if (requestProf == false) {
            requestProf = true;
            let formData = new FormData();
            formData.append('deletemProforma', id_mprof);
            tablemProfMW.classList.remove('modal__show');
            preloader.classList.add('modal__show');
            fetch('../controladores/proforma.php', {
                method: "POST",
                body: formData
            }).then(response => response.text()).then(data => {
                Promise.all([readMdfProforma(), readmProf_prods()]).then(() => {
                    requestProf = false;
                    mostrarAlerta(data);
                });
                preloader.classList.remove('modal__show');
            }).catch(err => {
                requestProf = false;
                mostrarAlerta(err);
            });
        }

    }
}
//--------------------------------------------------MODAL DE TABLA DE PROFORMA MODIFICADAS--------------------------------------------
const closemTableProfMW = document.getElementById('closemTableProfMW');
const tablemProfMW = document.getElementById('tablemProfMW');
closemTableProfMW.addEventListener('click', (e) => {
    tablemProfMW.classList.remove('modal__show');
});
//---------------------------------------------------------------GENERAR PDF-----------------------------------------------------
//-------Pide la informacion del pdf que se va a mostrar (prof, mprof, ne)
function selectPDFInformation(id, pdf) {

    if (pdf == 'prof') {
        const proforma = filterProformas.find(proforma => proforma['id_prof'] == id);
        if (proforma) {
            const objects = prof_prods.filter(pf_pd => pf_pd['fk_id_prof_pfpd'] == id)
                .map(pf_pd => {
                    const product = products.find(product => product['id_prod'] == pf_pd['fk_id_prod_pfpd']);
                    return {
                        'codigo_prod': product['codigo_prod'],
                        'descripcion_prod': product['descripcion_prod'],
                        'cantidad_pfpd': pf_pd['cantidad_pfpd'],
                        'cost_uni_pfpd': pf_pd['cost_uni_pfpd'],
                        'imagen_prod': product['imagen_prod']
                    };
                });
            showPDF(proforma, objects, pdf);
        }
    } else if (pdf == 'mprof') {

        const proforma = mdfPproforma.find(proforma => proforma['id_mprof'] == id);
        if (proforma) {
            const objects = mProf_prods.filter(pf_pd => pf_pd['fk_id_mprof_mpfpd'] == id)
                .map(pf_pd => {
                    const product = products.find(product => product['id_prod'] == pf_pd['fk_id_prod_mpfpd']);
                    return {
                        'codigo_prod': product['codigo_prod'],
                        'descripcion_prod': product['descripcion_prod'],
                        'cantidad_mpfpd': pf_pd['cantidad_mpfpd'],
                        'cost_uni_mpfpd': pf_pd['cost_uni_mpfpd'],
                        'imagen_prod': product['imagen_prod']
                    };
                });
            showPDF(proforma, objects, pdf);
        }
    }
}
//-------Crear el pdf de la proforma
function showPDF(prof_mprof_ne, pf_pd, pdf) {

    // Crea un formulario oculto
    var form = document.createElement('form');
    form.method = 'post';
    form.action = '../modelos/reportes/proformaSMC.php';
    form.target = '_blank'; // Abre la página en una nueva ventana
    form.style.display = 'none'; // Oculta visualmente el formulario
    // Crea un campo oculto para la variable prof_mprof_ne
    var input1 = document.createElement('input');
    input1.type = 'hidden';
    input1.name = 'prof_mprof_ne';
    input1.value = JSON.stringify(prof_mprof_ne); // Reemplaza con el valor real

    // Crea un campo oculto para la variable pf_pd
    var input2 = document.createElement('input');
    input2.type = 'hidden';
    input2.name = 'pf_pd';
    input2.value = JSON.stringify(pf_pd); // Reemplaza con el valor real

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
//-----------------------------------------------CRUD PROF_PROD-----------------------------------------------
let prof_prods = [];
let filterProf_prods = [];
async function readProf_prods() {
    return new Promise((resolve, reject) => {
        let formData = new FormData();
        formData.append('readProf_prods', '');
        fetch('../controladores/proforma.php', {
            method: "POST",
            body: formData
        }).then(response => response.json()).then(data => {
            prof_prods = data;
            filterProf_prods = prof_prods;
            resolve();
        }).catch(err => console.log(err));
    })
}
//------------------------------------------------TABLE PRODUCT FILTER---------------------------------------
//------Select utilizado para buscar por columnas
const selectSearchPfPd = document.getElementById('selectSearchPfPd');
selectSearchPfPd.addEventListener('change', searchPfPd);
//------buscar por input
const inputSearchPfPd = document.getElementById("inputSearchPfPd");
inputSearchPfPd.addEventListener("keyup", searchPfPd);
//------Proformas por pagina
const selectNumberPfPd = document.getElementById('selectNumberPfPd');
selectNumberPfPd.selectedIndex = 3;
selectNumberPfPd.addEventListener('change', function () {
    paginacionPfPd(filterProf_prods.length, 1);
});
//------buscar por:
function searchPfPd() {
    const busqueda = inputSearchPfPd.value.toLowerCase().trim();
    const valor = selectSearchPfPd.value.toLowerCase().trim();
    filterProf_prods = prof_prods.filter(prof_prod => {
        const proforma = proformas.find(proforma => proforma.id_prof === prof_prod.fk_id_prof_pfpd);
        const producto = products.find(product => product.id_prod === prof_prod.fk_id_prod_pfpd);
        if (valor == 'todas') {
            return (
                proforma.numero_prof.toLowerCase().includes(busqueda) ||
                proforma.fecha_prof.toLowerCase().includes(busqueda) ||
                producto.codigo_prod.toString().toLowerCase().includes(busqueda)
            )
        } else if (valor == 'codigo_prod') {
            return producto.codigo_prod.toString().toLowerCase().includes(busqueda);
        } else {
            return proforma[valor].toLowerCase().includes(busqueda);
        }
    });
    selectStateProductOC();
}
//------Seleccionar el año
const selectYearPfPd = document.getElementById('selectYearPfPd');
selectYearPfPd.addEventListener('change', searchPfPd);
//-------Estado de prof_prods
const selectStatePfPd = document.getElementById('selectStatePfPd');
selectStatePfPd.addEventListener('change', searchPfPd);
const selectMonthPfpd = document.getElementById('selectMonthPfpd');
selectMonthPfpd.addEventListener('change', searchPfPd);
function selectStateProductOC() {
    filterProf_prods = filterProf_prods.filter(profProd => {
        const proforma = proformas.find(proforma => proforma.id_prof === profProd.fk_id_prof_pfpd);
        const estado = selectStatePfPd.value === 'todasLasProf' ? true : proforma.estado_prof === selectStatePfPd.value;
        const fecha = selectYearPfPd.value === 'todas' ? true : proforma.fecha_prof.split('-')[0] === selectYearPfPd.value;
        const mes = selectMonthPfpd.value === 'todas' ? true : proforma.fecha_prof.split('-')[1] === selectMonthPfpd.value;
        return estado && fecha && mes;
    });
    paginacionPfPd(filterProf_prods.length, 1);
}
//------Ordenar tabla descendente ascendente
const orderPfPd = document.querySelectorAll('.tbody__head--PfPd');
orderPfPd.forEach(div => {
    div.children[0].addEventListener('click', function () {
        const valor = div.children[0].name;
        filterProf_prods.sort((a, b) => {
            const proformaA = proformas.find(proforma => proforma.id_prof == a.fk_id_prof_pfpd);
            const proformaB = proformas.find(proforma => proforma.id_prof == b.fk_id_prof_pfpd);
            const valorA = String(proformaA[valor]);
            const valorB = String(proformaB[valor]);
            return valorA.localeCompare(valorB);
        });
        paginacionPfPd(filterProf_prods.length, 1);
    });
    div.children[1].addEventListener('click', function () {
        const valor = div.children[0].name;
        filterProf_prods.sort((a, b) => {
            const proformaA = proformas.find(proforma => proforma.id_prof == a.fk_id_prof_pfpd);
            const proformaB = proformas.find(proforma => proforma.id_prof == b.fk_id_prof_pfpd);
            const valorA = String(proformaA[valor]);
            const valorB = String(proformaB[valor]);
            return valorB.localeCompare(valorA);
        });
        paginacionPfPd(filterProf_prods.length, 1);
    });
});
//------paginacionPfPd
function paginacionPfPd(allProducts, page) {
    console.log('Tabla de proforma-productos');
    let totalPfPd = document.getElementById('totalPfPd');
    let total = 0;
    for (let prof_prods in filterProf_prods) {
        const proforma = proformas.find(proforma => proforma.id_prof == filterProf_prods[prof_prods].fk_id_prof_pfpd);
        total += filterProf_prods[prof_prods]['cantidad_pfpd'] * filterProf_prods[prof_prods]['cost_uni_pfpd'] * (100 - proforma.descuento_prof) / 100;
    }
    totalPfPd.innerHTML = 'Total (Bs):' + total.toFixed(2) + ' Bs';
    let numberProducts = Number(selectNumberPfPd.value);
    let allPages = Math.ceil(allProducts / numberProducts);
    let ul = document.querySelector('#wrapperPfPd ul');
    let li = '';
    let beforePages = page - 1;
    let afterPages = page + 1;
    let liActive;
    if (page > 1) {
        li += `<li class="btn" onclick="paginacionPfPd(${allProducts}, ${page - 1})"><img src="../imagenes/arowLeft.svg"></li>`;
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
        li += `<li class="numb ${liActive}" onclick="paginacionPfPd(${allProducts}, ${pageLength})"><span>${pageLength}</span></li>`;
    }
    if (page < allPages) {
        li += `<li class="btn" onclick="paginacionPfPd(${allProducts}, ${page + 1})"><img src="../imagenes/arowRight.svg"></li>`;
    }
    ul.innerHTML = li;
    let h2 = document.querySelector('#showPagePfPd h2');
    h2.innerHTML = `Pagina ${page}/${allPages}, ${allProducts} Productos`;
    tablePdPf(page);
}
//--------Tabla de prof_prods
function tablePdPf(page) {
    const tbody = document.getElementById('tbodyPfPd');
    const inicio = (page - 1) * Number(selectNumberPfPd.value);
    const final = inicio + Number(selectNumberPfPd.value);
    const prods = filterProf_prods.slice(inicio, final);
    tbody.innerHTML = '';
    prods.forEach((prod, index) => {
        const proforma = proformas.find(proforma => proforma.id_prof == prod.fk_id_prof_pfpd);
        const producto = products.find(product => product.id_prod == prod.fk_id_prod_pfpd);

        const tr = document.createElement('tr');
        tr.setAttribute('id_pfpd', prod.id_pfpd);

        const tdNumero = document.createElement('td');
        tdNumero.innerText = index + 1;
        tr.appendChild(tdNumero);

        const tdNumeroProforma = document.createElement('td');
        tdNumeroProforma.innerText = proforma.numero_prof;
        tr.appendChild(tdNumeroProforma);

        const tdFechaProforma = document.createElement('td');
        tdFechaProforma.innerText = proforma.fecha_prof;
        tr.appendChild(tdFechaProforma);

        const tdCodigo = document.createElement('td');
        tdCodigo.innerText = producto.codigo_prod;
        tr.appendChild(tdCodigo);

        const tdCantidad = document.createElement('td');
        tdCantidad.innerText = prod.cantidad_pfpd;
        tr.appendChild(tdCantidad);

        const tdCostoUnitario = document.createElement('td');
        tdCostoUnitario.innerText = prod.cost_uni_pfpd.toFixed(2) + ' Bs';
        tr.appendChild(tdCostoUnitario);

        const tdSubTotal = document.createElement('td');
        const subTotal = prod.cost_uni_pfpd * prod.cantidad_pfpd;
        tdSubTotal.innerText = subTotal.toFixed(2) + ' Bs';
        tr.appendChild(tdSubTotal);

        const tdDescuento = document.createElement('td');
        const desc = proforma.descuento_prof * prod.cost_uni_pfpd * prod.cantidad_pfpd / 100;
        tdDescuento.innerText = desc.toFixed(2) + ' Bs' + ' (' + proforma.descuento_prof + '%)';
        tr.appendChild(tdDescuento);

        const tdTotal = document.createElement('td');
        const total = prod.cantidad_pfpd * prod.cost_uni_pfpd * (100 - proforma.descuento_prof) / 100;
        tdTotal.innerText = total.toFixed(2) + ' Bs';
        tr.appendChild(tdTotal);

        tbody.appendChild(tr);
    });
}
//------open and clode modal prof_prod
const tablePPMW = document.querySelector('#tablePPMW');
const openTablePPMW = document.querySelector('#openTablePPMW');
const closeTablePPMW = document.querySelector('#closeTablePPMW');
openTablePPMW.addEventListener('click', () => {
    tablePPMW.classList.add('modal__show');
});
closeTablePPMW.addEventListener('click', () => {
    tablePPMW.classList.remove('modal__show');
})
let mProf_prods = [];
async function readmProf_prods() {
    return new Promise((resolve, reject) => {
        let formData = new FormData();
        formData.append('readmProf_prods', '');
        fetch('../controladores/proforma.php', {
            method: "POST",
            body: formData
        }).then(response => response.json()).then(data => {
            mProf_prods = data;
            resolve();
        }).catch(err => console.log(err));
    });
}
//---------------------------------MODAL DE PRODUCTS DE UNA PROFORMA MODIFICADA--------------------------------------------
const closeProf_prodMW = document.getElementById('closeProf_prodMW');
const prof_prodMW = document.getElementById('prof_prodMW');
function openProf_prodMW() {
    prof_prodMW.classList.add('modal__show');
}
closeProf_prodMW.addEventListener('click', (e) => {
    prof_prodMW.classList.remove('modal__show');
});
//-----------------------------MODAL VISTA PREVIA DE LOS PRODUCTOS DE LA PROFORMA
const previewProducts = document.getElementById('previewProducts');
const closePreviewProducts = document.getElementById('closePreviewProducts');
closePreviewProducts.addEventListener('click', () => {
    previewProducts.classList.remove('modal__show');
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
let orderEnterprises = document.querySelectorAll('.tbody__head--empMW');
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
                <img src='../imagenes/send.svg' onclick='sendEnterprise(${filterEnterprises[enterprise].id_emp})'>`;
            tr.appendChild(td);
            tbody.appendChild(tr);
        } else {
            i++;
        }
    }
}
const fk_nombre_emp_profR = document.getElementById('fk_nombre_emp_profR');
const fk_nombre_emp_profM = document.getElementById('fk_nombre_emp_profM');
const fk_cliente_profR = document.getElementById('fk_cliente_profR');
const fk_cliente_profM = document.getElementById('fk_cliente_profM');
function sendEnterprise(id_emp) {
    enterpriseSMW.classList.remove('modal__show');

    if (formProformas === 'R') {
        const empresa = enterprises.find(enterprise => enterprise.id_emp === id_emp);
        const cliente = customers.find(customer => customer.fk_id_emp_clte === id_emp && customer.nombre_clte === '' && customer.apellido_clte === '');

        fk_id_emp_clteR.value = id_emp;
        fk_nombre_emp_profR.value = empresa.nombre_emp;

        if (cliente) {
            fk_id_clte_profR.value = cliente.id_clte;
            fk_cliente_profR.value = `${cliente.apellido_clte} ${cliente.nombre_clte}`;
        } else {
            const clienteDefault = customers.find(customer => customer.fk_id_emp_clte === id_emp);
            fk_id_clte_profR.value = clienteDefault.id_clte;
            fk_cliente_profR.value = `${clienteDefault.apellido_clte} ${clienteDefault.nombre_clte}`;
        }

        filterCustomers = customers.filter(customer => customer.fk_id_emp_clte === id_emp && customer.nombre_clte !== '' && customer.apellido_clte !== '');

    } else if (formProformas === 'M') {
        const empresa = enterprises.find(enterprise => enterprise.id_emp === id_emp);
        const cliente = customers.find(customer => customer.fk_id_emp_clte === id_emp && customer.nombre_clte === '' && customer.apellido_clte === '');

        fk_id_emp_clteM.value = id_emp;
        fk_nombre_emp_profM.value = empresa.nombre_emp;

        if (cliente) {
            fk_id_clte_profM.value = cliente.id_clte;
            fk_cliente_profM.value = `${cliente.apellido_clte} ${cliente.nombre_clte}`;
        } else {
            const clienteDefault = customers.find(customer => customer.fk_id_emp_clte === id_emp);
            fk_id_clte_profM.value = clienteDefault.id_clte;
            fk_cliente_profM.value = `${clienteDefault.apellido_clte} ${clienteDefault.nombre_clte}`;
        }

        filterCustomers = customers.filter(customer => customer.fk_id_emp_clte === id_emp && customer.nombre_clte !== '' && customer.apellido_clte !== '');
    }
    paginacionCustomerMW(filterCustomers.length, 1);
}
//----------------------------------ventana modal EnterpriseSMW-------------------------------------------
const enterpriseSMW = document.getElementById('enterpriseSMW');
//enterpriseSMW.addEventListener('click', ()=>enterpriseSMW.classList.remove('modal__show'));
const closeEnterpriseSMW = document.getElementById('closeEnterpriseSMW');
function openEnterpriseSMW() {
    enterpriseSMW.classList.add('modal__show');
    //Al mostrar la tabla de cliente que el puntero se encuentre en el input de busqueda
    inputSearchEmpMW.focus();
}
closeEnterpriseSMW.addEventListener('click', () => {
    enterpriseSMW.classList.remove('modal__show');
});
//<<---------------------------CRUD EMPRESA------------------------------->>
//------Leer una empresa
function readEnterprise(div) {
    let id_emp = div.children[0].value;
    for (let enterprise in enterprises) {
        if (enterprises[enterprise]['id_emp'] == id_emp) {
            for (let valor in enterprises[enterprise]) {
                document.getElementsByName(valor + 'M')[0].value = enterprises[enterprise][valor];
            }
            break;
        }
    }
    enterprisesMMW.classList.add('modal__show');
}
//------Craer una empresa
const formEmpresaR = document.getElementById('formEmpresaR');
formEmpresaR.addEventListener('submit', createEnterprise);
async function createEnterprise() {
    event.preventDefault();
    if (requestProf == false) {
        requestProf = true;
        enterprisesRMW.classList.remove('modal__show');
        let formData = new FormData(formEmpresaR);
        formData.append('createEnterprise', '');
        preloader.classList.add('modal__show');
        fetch('../controladores/clientes.php', {
            method: "POST",
            body: formData
        }).then(response => response.text()).then(data => {
            readCustomers().then(() => {
                return readEnterprises();
            }).then(() => {
                requestProf = false;
                formEmpresaR.reset();
                mostrarAlerta(data);
                paginacionEnterpriseMW(filterEnterprises.length, 1);
                preloader.classList.remove('modal__show');
            })
        }).catch(err => {
            requestProf = false;
            mostrarAlerta(err);
        });
    }
}
//------Actualizar una empresa
let formEmpresaM = document.getElementById('formEmpresaM');
formEmpresaM.addEventListener('submit', updateEnterprise);
async function updateEnterprise() {
    event.preventDefault();
    if (requestProf == false) {
        requestProf = true;
        indexEnterprise = fk_id_emp_clteR.value;
        enterprisesMMW.classList.remove('modal__show');
        let formData = new FormData(formEmpresaM);
        formData.append('updateEnterprise', '');
        preloader.classList.add('modal__show');
        fetch('../controladores/clientes.php', {
            method: "POST",
            body: formData
        }).then(response => response.text()).then(data => {
            readEnterprises().then(() => {
                requestProf = false;
                mostrarAlerta(data);
                fk_id_emp_clteR.value = indexEnterprise;
                preloader.classList.remove('modal__show');
            })
        }).catch(err => {
            requestProf = false;
            mostrarAlerta(err);
        });
    }
}
//------Borrar una empresa
async function deleteEnterprise(div) {
    let id_emp = div.children[0].value;
    if (confirm('¿Esta usted seguro?')) {
        if (requestProf == false) {
            requestProf = true;
            let formData = new FormData();
            formData.append('deleteEnterprise', id_emp);
            preloader.classList.add('modal__show');
            fetch('../controladores/clientes.php', {
                method: "POST",
                body: formData
            }).then(response => response.text()).then(data => {
                readEnterprises().then(() => {
                    requestProf = false;
                    mostrarAlerta(data);
                    indexEnterprise = 0;
                    preloader.classList.remove('modal__show');
                })
            }).catch(err => {
                requestProf = false;
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
//---------------------------------------------------------------CLIENTES----------------------------------------------
const fk_id_clte_profR = document.getElementById('fk_id_clte_profR');
const fk_id_clte_profM = document.getElementById('fk_id_clte_profM');
let customers = [];
let filterCustomers = [];
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
    paginacionCustomerMW(filterCustomers.length, 1);
});
//------buscar por:
function searchCustomersSMW() {
    const busqueda = inputSearchClteSMW.value.toLowerCase();
    const valor = selectSearchClteSMW.value.toLowerCase().trim();
    filterCustomers = filterCustomers.filter(customer => {
        if (valor === 'todas') {
            return (
                customer.nit_clte.toLowerCase().includes(busqueda) ||
                customer.nombre_emp.toLowerCase().includes(busqueda) ||
                customer.email_clte.toLowerCase().includes(busqueda) ||
                customer.direccion_clte.toLowerCase().includes(busqueda) ||
                customer.celular_clte.toLowerCase().includes(busqueda) ||
                (customer.apellido_clte + ' ' + customer.nombre_clte).toLowerCase().includes(busqueda)
            );
        } else if (valor === 'cliente') {
            return (customer.apellido_clte + ' ' + customer.nombre_clte).toLowerCase().includes(busqueda);
        } else {
            return customer[valor].toLowerCase().includes(busqueda);
        }
    });
    paginacionCustomerMW(filterCustomers.length, 1);
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
    h2.innerHTML = `Pagina ${page}/${allPages}, ${allEnterprises} Empresas`;
    tableCustomersMW(page);
}
//------Crear la tabla
function tableCustomersMW(page) {

    const tbody = document.getElementById('tbodyClteSMW');
    const inicio = (page - 1) * Number(selectNumberClteSMW.value);
    const final = inicio + Number(selectNumberClteSMW.value);
    let i = 1;
    tbody.innerHTML = '';

    for (let customer in filterCustomers) {
        if (i > inicio && i <= final) {
            const tr = document.createElement('tr');
            tr.setAttribute('id', `${filterCustomers[customer].id_clte}`);

            for (let valor in filterCustomers[customer]) {
                const td = document.createElement('td');
                if (valor === 'id_clte') {
                    td.innerText = i;
                    tr.appendChild(td);
                    i++;
                } else if (valor === 'nombre_clte') {
                    td.innerText = `${filterCustomers[customer].apellido_clte} ${filterCustomers[customer].nombre_clte}`;
                    tr.appendChild(td);
                } else if (valor === 'apellido_clte') {

                } else if (valor === 'fk_id_emp_clte') {
                    let empresa = enterprises.find(enterprise => enterprise.id_emp == filterCustomers[customer][valor]);
                    td.innerText = empresa.nombre_emp;
                    tr.appendChild(td);
                } else if (valor === 'nit_clte' || valor === 'celular_clte') {
                    if (filterCustomers[customer][valor] === '0') {
                        td.innerText = '';
                    } else {
                        td.innerText = filterCustomers[customer][valor];
                    }
                    tr.appendChild(td);
                } else {
                    td.innerText = filterCustomers[customer][valor];
                    tr.appendChild(td);
                }
            }

            const td = document.createElement('td');
            td.innerHTML = `
          <img src='../imagenes/send.svg' onclick='sendCustomers(${filterCustomers[customer].id_clte})'>
        `;
            tr.appendChild(td);
            tbody.appendChild(tr);
        } else {
            i++;
        }
    }
}
function sendCustomers(id_clte) {
    customerSMW.classList.remove('modal__show');
    const cliente = filterCustomers.find(customer => customer.id_clte == id_clte);
    if (formProformas === 'R') {
        fk_cliente_profR.value = cliente.apellido_clte + ' ' + cliente.nombre_clte;
        fk_id_clte_profR.value = id_clte;
    } else if (formProformas === 'M') {
        fk_cliente_profM.value = cliente.apellido_clte + ' ' + cliente.nombre_clte;
        fk_id_clte_profM.value = id_clte;
    }
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
function readCustomer(tr) {
    formCustomer = 'M';
    selectCreateCustomer();
    let id_clte = tr.children[0].value;
    const customer = filterCustomers.find(customer => customer.id_clte == id_clte);
    if (customer) {
        for (const valor in customer) {
            if (valor !== 'nombre_emp' && valor !== 'fk_id_emp_clte') {
                document.getElementsByName(valor + 'M')[0].value = customer[valor];
            }
        }
    }
    customersMMW.classList.add('modal__show');
}
//------Create a customer
const formClienteR = document.getElementById('formClienteR');
formClienteR.addEventListener('submit', createCustomer);
async function createCustomer() {
    event.preventDefault();
    if (requestProf == false) {
        requestProf = true;
        customersRMW.classList.remove('modal__show');
        let formData = new FormData(formClienteR);
        formData.append('createCustomer', '');
        preloader.classList.add('modal__show');
        fetch('../controladores/clientes.php', {
            method: "POST",
            body: formData
        }).then(response => response.text()).then(data => {
            readCustomers().then(() => {
                requestProf = false;
                formClienteR.reset();
                preloader.classList.remove('modal__show');
                mostrarAlerta(data);
            });
        }).catch(err => {
            requestProf = false;
            mostrarAlerta(err);
        });
    }
}
//------Update a Customer
const formClienteM = document.getElementById('formClienteM');
formClienteM.addEventListener('submit', updateCustomer);
async function updateCustomer() {
    event.preventDefault();
    if (requestProf == false) {
        requestProf = true;
        customersMMW.classList.remove('modal__show');
        let formData = new FormData(formClienteM);
        formData.append('updateCustomer', '');
        preloader.classList.add('modal__show');
        fetch('../controladores/clientes.php', {
            method: "POST",
            body: formData
        }).then(response => response.text()).then(data => {
            readCustomers().then(() => {
                requestProf = false;
                formClienteM.reset();
                preloader.classList.remove('modal__show');
                mostrarAlerta(data);
            })
        }).catch(err => {
            requestProf = false;
            mostrarAlerta(err);
        });
    }
}
//------Delete a Customer
async function deleteCustomer(tr) {
    if (confirm('¿Esta usted seguro?')) {
        if (requestProf == false) {
            requestProf = true;
            let id_clte = tr.children[0].value;
            let formData = new FormData();
            formData.append('deleteCustomer', id_clte);
            preloader.classList.add('modal__show');
            fetch('../controladores/clientes.php', {
                method: "POST",
                body: formData
            }).then(response => response.text()).then(data => {
                readCustomers().then(() => {
                    requestProf = false;
                    preloader.classList.remove('modal__show');
                    mostrarAlerta(data);
                });
            }).catch(err => {
                requestProf = false;
                mostrarAlerta(err)
            });
        }
    }
}
//------Empresa de cliente
function selectCreateCustomer() {
    const selectEmp2 = document.getElementById('fk_id_emp_clte' + formCustomer + '2');
    selectEmp2.innerHTML = '';
    const option2 = document.createElement('option');

    const selectEnterprise = formProformas === 'R' ? fk_id_emp_clteR : fk_id_emp_clteM;
    const valor = selectEnterprise.options[selectEnterprise.selectedIndex].text;

    option2.value = selectEnterprise.value;
    option2.innerText = valor;

    selectEmp2.appendChild(option2);
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
        /*
                let td = document.createElement('td');
                if (['Gerente general', 'Administrador', 'Gerente De Inventario'].includes(localStorage.getItem('rol_usua'))) {
                    td.innerHTML = `<img src='../imagenes/send.svg' onclick='sendInventory(${inventory.id_inv})' title='Seleccionar'>`;
                    tr.appendChild(td);
                }*/
        fragment.appendChild(tr);
    }
    tbody.innerHTML = '';
    tbody.appendChild(fragment);
}
function sendInventory(id_inv) {
    const inventory = filterInventoriesMW.find(inv => inv['id_inv'] === id_inv);
    const prof_prods = modalProf_prod.querySelectorAll('.cart-item');
    if (inventory) {
        inventory.id_prod = inventory.fk_id_prod_inv;
        const product = products.find(product => product.id_prod === inventory.fk_id_prod_inv);
        inventory.codigo_prod = product.codigo_prod;
        const codigo = inventory.codigo_prod;
        const existe = Array.from(prof_prods).some(prod => prod.children[2].innerText === codigo);
        if (!existe) {
            cartProduct_pfpd(inventory, 'sendInventory');
        } else {
            mostrarAlerta("El producto ya se encuentra en la lista");
        }
    }
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
//------buscar por:
function searchProductsMW() {
    const valor = selectSearchProdMW.value;
    const busqueda = inputSearchProdMW.value.toLowerCase().trim();
    filterProducts = products.filter(product => {
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
    filterProducts = filterProducts.filter(product => {
        const marca = selectMarcaProdMW.value === 'todasLasMarcas' ? true : product.fk_id_mrc_prod == selectMarcaProdMW.value;
        const categoria = selectCategoriaProdMW.value === 'todasLasCategorias' ? true : product.fk_id_ctgr_prod == selectCategoriaProdMW.value;
        return marca && categoria;
    });
    paginacionProductMW(filterProducts.length, 1);
}
//------Ordenar tabla descendente ascendente
const orderProducts = document.querySelectorAll('.tbody__head--ProdMW');
orderProducts.forEach(div => {
    div.children[0].addEventListener('click', function () {
        const valor = div.children[0].name;
        filterProducts.sort((a, b) => {
            const valorA = String(a[valor]);
            const valorB = String(b[valor]);
            return valorA.localeCompare(valorB);
        });
        paginacionProductMW(filterProducts.length, 1);
    });
    div.children[1].addEventListener('click', function () {
        const valor = div.children[0].name;
        filterProducts.sort((a, b) => {
            const valorA = String(a[valor]);
            const valorB = String(b[valor]);
            return valorB.localeCompare(valorA);
        });
        paginacionProductMW(filterProducts.length, 1);
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
    let tbody = document.getElementById('tbodyProductMW');
    let inicio = (page - 1) * Number(selectNumberProdMW.value);
    let final = inicio + Number(selectNumberProdMW.value);
    let fragment = document.createDocumentFragment();

    for (let product of filterProducts.slice(inicio, final)) {
        let tr = document.createElement('tr');
        tr.setAttribute('id_prod', product.id_prod);

        let tdIndex = document.createElement('td');
        tdIndex.innerText = inicio + filterProducts.indexOf(product) + 1;
        tr.appendChild(tdIndex);

        for (let valor in product) {
            let td = document.createElement('td');
            if (valor == 'id_prod' || valor == 'codigo_smc_prod' || valor == 'catalogo_prod') {
                // No hacer nada
            } else if (valor == 'fk_id_mrc_prod') {
                const marca = marcas.find((marca) => marca.id_mrc === product[valor]);
                td.innerText = marca ? marca.nombre_mrc : '';
                tr.appendChild(td);
            } else if (valor == 'fk_id_ctgr_prod') {
                const categoria = categorias.find((categoria) => categoria.id_ctgr === product[valor]);
                td.innerText = categoria ? categoria.nombre_ctgr : '';
                tr.appendChild(td);
            } else if (valor == 'imagen_prod') {
                let img = document.createElement('img');
                img.classList.add('tbody__img');
                img.setAttribute('src', '../modelos/imagenes/' + product[valor]);
                td.appendChild(img);
                tr.appendChild(td);
            } else {
                td.innerText = product[valor];
                tr.appendChild(td);
            }
        }

        let td = document.createElement('td');
        td.innerHTML = `
            <img src='../imagenes/send.svg' onclick='sendProduct(${product.id_prod})' title='Seleccionar'>`;
        tr.appendChild(td);
        fragment.appendChild(tr);
    }
    tbody.innerHTML = '';
    tbody.appendChild(fragment);
}
function sendProduct(id_prod) {
    const product = filterProductsMW.find(prod => prod['id_prod'] === id_prod);
    if (product) {
        let prof_prods = modalProf_prod.querySelectorAll('.cart-item');
        const codigo = product['codigo_prod'];
        const existe = Array.from(prof_prods).some(prod => prod.children[2].innerText === codigo);
        if (!existe) {

            const card = cartProduct(id_prod, modalProf_prod, totalPriceM);
            modalProf_prod.appendChild(card);

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
        } else {
            mostrarAlerta("El producto ya se encuentra en la lista");
        }
    }
}
//---------------------------VENTANA MODAL PARA BUSCAR PRODUCTOS
const productSMW = document.getElementById('productSMW');
const closeProductSMW = document.getElementById('closeProductSMW');
function openProductSMW(clave) {
    productSMW.classList.add('modal__show');
    claveSendProduct = clave;
}
closeProductSMW.addEventListener('click', () => {
    productSMW.classList.remove('modal__show');
});
//<<------------------------------------------CRUD DE PRODUCTS------------------------------------->>
//------Create un producto
document.getElementById("formProductsR").addEventListener("submit", createProduct);
async function createProduct() {
    event.preventDefault();
    if (marca_prodR.value == "todasLasMarcas") {
        mostrarAlerta("Debe seleccionar una marca");
    } else if (categoria_prodR.value == "todasLasCategorias") {
        mostrarAlerta("Debe seleccionar una categoria");
    } else {
        if (requestProf == false) {
            requestProf = true;
            let form = document.getElementById("formProductsR");
            let formData = new FormData(form);
            formData.append('createProduct', '');
            preloader.classList.add('modal__show');
            productsRMW.classList.remove('modal__show');
            fetch('../controladores/productos.php', {
                method: "POST",
                body: formData
            }).then(response => response.text()).then(data => {
                requestProf = false;
                if (data == "El codigo ya existe") {
                    mostrarAlerta(data);
                    preloader.classList.remove('modal__show');
                } else if (data == "El codigo SMC ya existe") {
                    mostrarAlerta(data);
                    preloader.classList.remove('modal__show');
                } else {
                    readProducts().then(() => {
                        form.reset();
                        paginacionProduct(products.length, 1);
                        paginacionProductMW(products.length, 1);
                        mostrarAlerta("El producto fue creado con éxito");
                        divCodigoSMCR.setAttribute('hidden', '');
                        preloader.classList.remove('modal__show');
                    })
                }
            }).catch(err => {
                requestProf = false;
                mostrarAlerta(err);
            });
        }
    }
}
//------Leer un producto
function readProduct(id_prod) {
    cleanUpProductFormM();
    let product = filterProducts.find(product => product.id_prod == id_prod);
    for (let valor in product) {
        if (valor == 'imagen_prod') {
            document.querySelector('.drop__areaM').setAttribute('style', `background-image: url("../modelos/imagenes/${product[valor]}"); background-size: cover;`);
        } else if (valor == 'codigo_smc_prod') {
            if (product['fk_id_mrc_prod'] == '15') {
                divCodigoSMCM.removeAttribute('hidden');
                document.getElementsByName(valor + 'M')[0].value = product[valor];
            }
        } else if (valor == 'fk_id_mrc_prod') {
            document.getElementsByName(valor + 'M')[0].value = product[valor];
        } else if (valor == 'fk_id_ctgr_prod') {
            selectCategoriaProdM();
            document.getElementsByName(valor + 'M')[0].value = product[valor];
        } else {
            document.getElementsByName(valor + 'M')[0].value = product[valor];
        }
    }
    productsMMW.classList.add('modal__show');
}
//-------Update un producto
document.getElementById("formProductsM").addEventListener("submit", updateProduct);
async function updateProduct() {
    event.preventDefault();
    if (fk_id_mrc_prodM.value == "todasLasMarcas") {
        mostrarAlerta("Debe seleccionar una marca");
    } else if (fk_id_ctgr_prodM.value == "todasLasCategorias") {
        mostrarAlerta("Debe seleccionar una categoria");
    } else {
        if (requestProf == false) {
            requestProf = true;
            let form = document.getElementById("formProductsM");
            let formData = new FormData(form);
            formData.append('updateProduct', '');
            preloader.classList.add('modal__show');
            fetch('../controladores/productos.php', {
                method: "POST",
                body: formData
            }).then(response => response.text()).then(data => {
                requestProf = false;
                if (data == "El codigo ya existe") {
                    mostrarAlerta(data);
                    preloader.classList.remove('modal__show');
                } else if (data == 'El codigo SMC ya existe') {
                    mostrarAlerta(data);
                    preloader.classList.remove('modal__show');
                } else {
                    readProducts().then(() => {
                        productsMMW.classList.remove('modal__show');
                        modalCard.classList.remove('modal__show');
                        mostrarAlerta(data);
                        preloader.classList.remove('modal__show');
                    })
                }
            }).catch(err => {
                requestProf = false;
                mostrarAlerta(err);
            });
        }
    }
}
//<<--------------------------------------------ABRIR Y CERRAR VENTANAS MODALES--------------------------------->>
const productsRMW = document.getElementById('productsRMW');
const productsMMW = document.getElementById('productsMMW');
const closeProductsRMW = document.getElementById('closeProductsRMW');
const closeProductsMMW = document.getElementById('closeProductsMMW');
function openProductsRMW() {
    productsRMW.classList.add('modal__show');
}
closeProductsRMW.addEventListener('click', (e) => {
    productsRMW.classList.remove('modal__show');
});
closeProductsMMW.addEventListener('click', (e) => {
    productsMMW.classList.remove('modal__show');
});
//<<-----------------------------------------------------MUESTRA LA IMAGEN CARGADA------------------------------>>
document.getElementById("imagen_prodR").addEventListener("change", mostrarimagenR);
document.getElementById("imagen_prodM").addEventListener("change", mostrarimagenM);
//-------Muestra en un campo la imagen que se esta seleccionando para registrar
function mostrarimagenR() {
    let form = document.getElementById('formProductsR');
    //Seleccionar los elementos del form registrar antes de enviar el formulario
    let formData = new FormData(form);
    let imagen = formData.get('imagen_prodR');
    //URL.createObjectURL() crea un DOMString que contiene una URL que representa al objeto pasado como parámetro.
    let urlDeImagen = URL.createObjectURL(imagen);
    document.querySelector('.drop__areaR').setAttribute('style', `background-image: url("${urlDeImagen}"); background-size: cover; background-position: center; background-repeat: no-repeat;`);
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
//<<------------------------------------------------------CAMPOS DE LOS FORMULARIOS------------------------------->>
const inputsFormProduct = document.querySelectorAll('.modalP__form .modalP__group input');
//------Vuelve oblogatorios los campos del formulario
function requiredInputProd() {
    inputsFormProduct.forEach(input => input.setAttribute("required", ""));
    //formulario registrar
    document.getElementsByName("imagen_prodR")[0].setAttribute('accept', "image/jpeg, image/jpg");
    document.getElementsByName("descripcion_prodR")[0].setAttribute("required", "");
    //formulario modificar
    document.getElementsByName("id_prodM")[0].setAttribute("hidden", "");
    document.getElementsByName("imagen_prodM")[0].setAttribute("accept", "image/jpeg, image/jpg");
    document.getElementsByName("descripcion_prodM")[0].setAttribute("required", "");
}
//<<-------------------------------------------------------ESPACIOS OBLIGATORIOS de formProductsR y formProductsM ------------------------------------------>>
inputsFormProduct.forEach(input => {
    input.setAttribute('required', '');
    document.getElementsByName("codigo_smc_prodR")[0].removeAttribute('required');
    document.getElementsByName("codigo_smc_prodM")[0].removeAttribute('required');
})
//<<---------------------------------------------------LIMPIAR CAMPOS DEL FORMULARIO----------------------------------->>
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
            selectMarcaProd();
            selectMarcaProdR();
            //selectMarcaInv();
            selectMarcaProdM();
            selectMarcaProductMW();
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
/*----------------------------------------------Marca y categoria inventary-------------------------------------------------*/
//-------Select de marcas
function selectMarcaInv() {
    selectMarcaInventory.innerHTML = '';
    let option = document.createElement('option');
    option.value = 'todasLasMarcas';
    option.innerText = 'Todas las marcas';
    selectMarcaInventory.appendChild(option);
    for (let clave in marcas) {
        let option = document.createElement('option');
        option.value = marcas[clave]['id_mrc'];
        option.innerText = marcas[clave]['nombre_mrc'];
        selectMarcaInventory.appendChild(option);
    }
}
//------Select categorias
function selectCategoriaInv() {
    selectCategoriaInventory.innerHTML = '';
    let option = document.createElement('option');
    option.value = 'todasLasCategorias';
    option.innerText = 'Todas las categorias';
    selectCategoriaInventory.appendChild(option);
    if (selectMarcaInventory.value != 'todasLasMarcas') {
        let id_mrc = selectMarcaInventory.value;
        for (let clave in categorias) {
            if (categorias[clave]['id_mrc'] == id_mrc) {
                let option = document.createElement('option');
                option.value = categorias[clave]['id_ctgr'];
                option.innerText = categorias[clave]['nombre_ctgr'];
                selectCategoriaInventory.appendChild(option);
            }
        }
    }
    searchInventories();
}
/*----------------------------------------------Marca y categoria product-------------------------------------------------*/
//-------Select de marcas
function selectMarcaProd() {
    selectMarcaProduct.innerHTML = '';
    let option = document.createElement('option');
    option.value = 'todasLasMarcas';
    option.innerText = 'Todas las marcas';
    selectMarcaProduct.appendChild(option);
    for (let clave in marcas) {
        let option = document.createElement('option');
        option.value = marcas[clave]['id_mrc'];
        option.innerText = marcas[clave]['nombre_mrc'];
        selectMarcaProduct.appendChild(option);
    }
}
//------Select categorias
function selectCategoriaProd() {
    selectCategoriaProduct.innerHTML = '';
    let option = document.createElement('option');
    option.value = 'todasLasCategorias';
    option.innerText = 'Todas las categorias';
    selectCategoriaProduct.appendChild(option);
    if (selectMarcaProduct.value != 'todasLasMarcas') {
        let id_mrc = selectMarcaProduct.value;
        categorias.forEach(categoria => {
            if (categoria.fk_id_mrc_mccr == id_mrc) {
                let option = document.createElement('option');
                option.value = categoria.id_ctgr;
                option.innerText = categoria.nombre_ctgr;
                selectCategoriaProduct.appendChild(option);
            }
        });
    }
    searchProducts();
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
    let formData = new FormData();
    formData.append('readPrices', '');
    fetch('../controladores/proforma.php', {
        method: "POST",
        body: formData
    }).then(response => response.json()).then(data => {
        prices = data;
        filterPrices = prices;
        paginacionPriceList(filterPrices.length, 1);
    }).catch(err => console.log(err));
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
            users = Object.values(data);
            resolve();
        }).catch(err => {
            mostrarAlerta('Ocurrio un error al cargar la tabla de usuarios, cargue nuevamente la pagina');
        });
    });
}