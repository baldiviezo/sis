//--------------------------------------------Restricciones de usuario----------------------------------------------
if (localStorage.getItem('rol_usua') == 'Ingeniero' || localStorage.getItem('rol_usua') == 'Gerente De Inventario') {
    document.getElementsByName('nombre_empM')[0].setAttribute('readonly', 'readonly');
    document.getElementsByName('nombre_clteM')[0].setAttribute('readonly', 'readonly');
    document.getElementsByName('apellido_clteM')[0].setAttribute('readonly', 'readonly');
} else if (localStorage.getItem('rol_usua') == 'Administrador') {
    document.querySelector('#formProformaR .form__group--select').children[4].removeAttribute('hidden');
    document.querySelectorAll('#formProformaR .form__group--select')[1].children[3].removeAttribute('hidden');
} else if (localStorage.getItem('rol_usua') == 'Gerente general') {
    document.querySelector('#formProformaR .form__group--select').children[4].removeAttribute('hidden');
    document.querySelectorAll('#formProformaR .form__group--select')[1].children[3].removeAttribute('hidden');
}
//-----------------------------------------Block request with a flag---------------------------------------------
let requestClte = false;
let requestEmp = false;
let requestProducts = false;
let requestProforma = false;
let requestProfMdf = false;
let requestNE = false;
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
//---------------------------------------------------- CARDS PRODUCTS---------------------------------------------------------
let products = {};
let filterProducts = {};
let filterProductsMW = {};
readProducts();
function readProducts() {
    let formData = new FormData();
    formData.append('readProducts', '');
    fetch('../controladores/productos.php', {
        method: "POST",
        body: formData
    }).then(response => response.json()).then(data => {
        products = JSON.parse(JSON.stringify(data));
        filterProducts = products;
        filterProductsMW = products;
        paginacionProduct(Object.values(data).length, 1)
        paginacionProductMW(Object.values(data).length, 1);
    }).catch(err => console.log(err));
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
    paginacionProduct(Object.values(filterProducts).length, 1);
});
//-------Marca y categoria
const selectMarcaProduct = document.getElementById('selectMarcaProduct');
selectMarcaProduct.addEventListener('change', selectCategoriaProd);
const selectCategoriaProduct = document.getElementById('selectCategoriaProduct');
selectCategoriaProduct.addEventListener('change', searchProducts);
//------buscar por:
function searchProducts() {
    filterProducts = {};
    for (let product in products) {
        for (let valor in products[product]) {
            if (selectSearchProduct.value == 'todas') {
                if (valor == 'codigo_prod' || valor == 'nombre_prod' || valor == 'descripcion_prod') {
                    if (products[product][valor].toLowerCase().indexOf(inputSerchProduct.value.toLowerCase()) >= 0) {
                        filterProducts[product] = products[product];
                        break;
                    }
                }
            } else {
                if (valor == selectSearchProduct.value) {
                    if (products[product][valor].toLowerCase().indexOf(inputSerchProduct.value.toLowerCase()) >= 0) {
                        filterProducts[product] = products[product];
                        break;
                    }
                }
            }
        }
    }
    selectProducts();
}
//------buscar por marca y categoria:
function selectProducts() {
    if (selectMarcaProduct.value == 'todasLasMarcas' && selectCategoriaProduct.value == 'todasLasCategorias') {
        paginacionProduct(Object.values(filterProducts).length, 1);
    } else {
        for (let product in filterProducts) {
            for (let valor in filterProducts[product]) {
                if (selectMarcaProduct.value == 'todasLasMarcas') {
                    if (filterProducts[product]['id_ctgr'] != selectCategoriaProduct.value) {
                        delete filterProducts[product];
                        break;
                    }
                } else if (selectCategoriaProduct.value == 'todasLasCategorias') {
                    if (filterProducts[product]['id_mrc'] != selectMarcaProduct.value) {
                        delete filterProducts[product];
                        break;
                    }
                } else {
                    if (filterProducts[product]['id_ctgr'] != selectCategoriaProduct.value || filterProducts[product]['id_mrc'] != selectMarcaProduct.value) {
                        delete filterProducts[product];
                        break;
                    }
                }
            }
        }
        paginacionProduct(Object.values(filterProducts).length, 1);
    }
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
    const root = document.getElementById('root');
    const inicio = (page - 1) * Number(selectNumberProduct.value);
    const final = inicio + Number(selectNumberProduct.value);
    let i = 1;
    let html = '';
    for (let product in filterProducts) {
        if (i > inicio && i <= final) {
            html += `
                <div class='box'>
                    <div class='img-box' style='max-height: 70%; max-width: 100%;'>
                        <img class='images' src='../modelos/imagenes/${filterProducts[product]['imagen_prod']}' onclick='showDetails(${filterProducts[product]['id_prod']})'></img>
                    </div>
                    <div class='bottom'>
                        <h3 hidden>${filterProducts[product]['id_prod']}</h3>
                        <p class='box__code'>${filterProducts[product]['codigo_prod']}</p>
                        <button onclick='addCard(this.parentNode.parentNode)'>Añadir</button>
                    </div>
                </div>`;
            i++;
        } else {
            i++;
        }
    }
    root.innerHTML = html;
}
//------------------------------------------------------MODAL DE UNA CARD-------------------------------------------------
//-------Detalles de la card
function showDetails(id_prod) {
    let modal = document.querySelector('.modalCard__body');
    let cantidad_inv = 'Cantidad: Sin existencias';
    let cost_uni = 'Costo: Sin existencias';
    for (let product in filterProducts) {
        if (filterProducts[product]['id_prod'] == id_prod) {
            for (let inventory in inventories) {
                if (inventories[inventory]['fk_id_prod_inv'] == id_prod) {
                    cantidad_inv = `Existencias: ${inventories[inventory]['cantidad_inv']}`;
                    cost_uni = `Costo: ${inventories[inventory]['cost_uni_inv']} Bs`;
                    break;
                }
            }
            modal.innerHTML = `<div class="modalCard__head">
                                    <h4>${filterProducts[product]['nombre_prod']}</h4><img src="../imagenes/salir.svg" onclick='closeModalCard()' class="button__close">
				                </div>
				                <img src="../modelos/imagenes/${filterProducts[product]['imagen_prod']}" class="modalCard__img">
				                <h5>${filterProducts[product]['codigo_prod']}</h5>
				                <h4>Descripcion: </h4>
				                <p>${filterProducts[product]['descripcion_prod']}</p>
				                <h6>${cantidad_inv}</h6>
				                <h3>${cost_uni}</h3>
				                <img src="../imagenes/edit.svg" onclick="readProduct(this.parentNode)" class="icon__CRUD">`;
            break;
        }
    }
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
function addCard(card) {
    let id_prod = card.children[1].children[0].innerText;
    let codigo_prod = card.children[1].children[1].innerText;
    let carts = cartItem.querySelectorAll('div.cart-item');
    let i = 0;
    carts.forEach(cart => {
        if (codigo_prod == cart.children[2].innerText) { i++ }
    })
    if (i == 0) {
        cartProduct(id_prod);
        totalPrice();
    } else {
        alert('El producto ya se encuentra en el carrito');
    }
}
//------------------------------------------------------CARDS INVENTARIO----------------------------------------------------------
let inventories = {};
let filterInventoriesMW = {};
readInventories();
function readInventories() {
    let formData = new FormData();
    formData.append('readInventories', '');
    fetch('../controladores/inventario.php', {
        method: "POST",
        body: formData
    }).then(response => response.json()).then(data => {
        inventories = JSON.parse(JSON.stringify(data));
        filterInventoriesMW = inventories;
        paginacionInventoryMW(Object.values(data).length, 1);
    }).catch(err => console.log(err));
}
//------Cart
function cartProduct(id_prod) {
    let cantidad_inv = undefined;
    let cost_uni = undefined;
    for (let product in filterProducts) {
        if (filterProducts[product]['id_prod'] == id_prod) {
            for (let inventory in inventories) {
                if (inventories[inventory]['fk_id_prod_inv'] == id_prod) {
                    cantidad_inv = inventories[inventory]['cantidad_inv'];
                    cost_uni = inventories[inventory]['cost_uni_inv'];
                    break;
                }
            }
            cantidad_inv = (cantidad_inv == undefined) ? cantidad_inv = 0 : cantidad_inv;
            cost_uni = (cost_uni == undefined) ? cost_uni = 0 : cost_uni;
            let card = document.createElement('div');
            card.classList.add('cart-item');
            let html =
                `<p class="cart-item__cantInv">${cantidad_inv}</p>
                <div class="row-img">
                    <img src="../modelos/imagenes/${filterProducts[product]['imagen_prod']}" class="rowimg">
                </div>
                <p class="cart-item__codigo">${filterProducts[product]['codigo_prod']}</p>
                <input type="number" value = "1" min="1" onChange="changeQuantity(this.parentNode)" class="cart-item__cantidad">
                <input type="number" value = "${cost_uni}" onChange="changeQuantity(this.parentNode)" class="cart-item__costUnit">
                <input type="number" value = "${cost_uni}" class="cart-item__costTotal" readonly>
                <img src="../imagenes/trash.svg" onClick="removeCardFromCart(this.parentNode)" class='icon__CRUD'>
                <h3 hidden>${filterProducts[product]['nombre_prod']}</h3>
                <h3 hidden>${filterProducts[product]['descripcion_prod']}</h3>`;
            card.innerHTML = html;
            cartItem.appendChild(card);
        }
    }
}
//------Eliminar cart
function removeCardFromCart(cart) {
    cartItem.removeChild(cart);
    totalPrice();
    document.getElementById('count').innerHTML = cartItem.querySelectorAll('div.cart-item').length;
}
//------Al cambia la cantidad
function changeQuantity(product) {
    let cantidad_prod = product.children[3].value;
    let costo_uni = product.children[4].value;
    let cost_uni_total = cantidad_prod * costo_uni;
    product.children[5].value = cost_uni_total.toFixed(2);
    totalPrice();
}
//-------Precio total y moneda
function totalPrice() {
    let divs = cartItem.querySelectorAll('div.cart-item');
    let moneda = selectMoneyCart.value;
    let total = 0;
    divs.forEach(div => {
        costo = Number(div.children[5].value);
        total = total + costo;
    })
    document.getElementById('total').innerHTML = moneda + ' ' + total.toFixed(2);
    document.getElementById('count').innerHTML = cartItem.querySelectorAll('div.cart-item').length;
}
//-------Cambio de moneda
const selectMoneyCart = document.getElementById('selectMoneyCart');
const tipoDeCambioProf = document.getElementById('tipoDeCambioProf');
selectMoneyCart.addEventListener('change', function () {
    totalPrice();
    //Para mostrar y ocultar el tipo de cambio
    if (selectMoneyCart.value == '$') {
        tipoDeCambioProf.removeAttribute('hidden');

    } else {
        tipoDeCambioProf.setAttribute('hidden', '');
    }
})
//------------------------------------------------------------PROFORMA-----------------------------------------------------
let proformas = {};  //base de datos de proformas
let filterProformas = {};
let formProformas;
readProformas();
function readProformas() {
    let formData = new FormData();
    formData.append('readProformas', '');
    fetch('../controladores/proforma.php', {
        method: "POST",
        body: formData
    }).then(response => response.json()).then(data => {
        proformas = JSON.parse(JSON.stringify(data));
        filterProformas = proformas;
        paginacionProforma(Object.values(proformas).length, 1);
    }).catch(err => console.log(err));
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
    paginacionProforma(Object.values(filterProformas).length, 1);
});
//-------Estado de proforma
const selectStateProf = document.getElementById('selectStateProf');
selectStateProf.addEventListener('change', searchProforma);
//------buscar por:
function searchProforma() {
    filterProformas = {};
    for (let proforma in proformas) {
        for (let valor in proformas[proforma]) {
            if (selectSearchProf.value == 'todas') {
                if (valor == 'numero_prof') {
                    if (proformas[proforma][valor].toString().toLowerCase().indexOf(inputSearchProf.value.toLowerCase()) >= 0) {
                        filterProformas[proforma] = proformas[proforma];
                        break;
                    }
                } else if (valor == 'nombre_usua') {
                    if ((proformas[proforma][valor] + ' ' + proformas[proforma]['apellido_usua']).toLowerCase().indexOf(inputSearchProf.value.toLowerCase()) >= 0) {
                        filterProformas[proforma] = proformas[proforma];
                        break;
                    }
                } else if (valor == 'apellido_clte') {
                    if ((proformas[proforma][valor] + ' ' + proformas[proforma]['nombre_clte']).toLowerCase().indexOf(inputSearchProf.value.toLowerCase()) >= 0) {
                        filterProformas[proforma] = proformas[proforma];
                        break;
                    }
                } else if (valor == 'fecha_prof' || valor == 'nombre_emp') {
                    if (proformas[proforma][valor].toLowerCase().indexOf(inputSearchProf.value.toLowerCase()) >= 0) {
                        filterProformas[proforma] = proformas[proforma];
                        break;
                    }
                }
            } else if (selectSearchProf.value == 'encargado') {
                if (valor == 'nombre_usua') {
                    if ((proformas[proforma][valor] + ' ' + proformas[proforma]['apellido_usua']).toLowerCase().indexOf(inputSearchProf.value.toLowerCase()) >= 0) {
                        filterProformas[proforma] = proformas[proforma];
                        break;
                    }
                }
            } else if (selectSearchProf.value == 'cliente') {
                if (valor == 'apellido_clte') {
                    if ((proformas[proforma][valor] + ' ' + proformas[proforma]['nombre_clte']).toLowerCase().indexOf(inputSearchProf.value.toLowerCase()) >= 0) {
                        filterProformas[proforma] = proformas[proforma];
                        break;
                    }
                }
            } else {
                if (valor == selectSearchProf.value) {
                    if (proformas[proforma][valor].toString().toLowerCase().indexOf(inputSearchProf.value.toLowerCase()) >= 0) {
                        filterProformas[proforma] = proformas[proforma];
                        break;
                    }
                }
            }
        }
    }
    selectStateProformas();
}
//------buscar por marca y categoria:
function selectStateProformas() {
    if (selectStateProf.value == 'todasLasProformas') {
        paginacionProforma(Object.values(filterProformas).length, 1);
    } else {
        for (let proforma in filterProformas) {
            for (let valor in filterProformas[proforma]) {
                if (valor == 'estado_prof') {
                    if (filterProformas[proforma][valor] != selectStateProf.value) {
                        delete filterProformas[proforma];
                        break;
                    }
                }
            }
        }
        paginacionProforma(Object.values(filterProformas).length, 1);
    }
}
//------Ordenar tabla descendente ascendente
let orderProforma = document.querySelectorAll('.tbody__head--proforma');
orderProforma.forEach(div => {
    div.children[0].addEventListener('click', function () {
        let array = Object.entries(filterProformas).sort((a, b) => {
            let first = a[1][div.children[0].name];
            let second = b[1][div.children[0].name];
            if (typeof first === 'number' && typeof second === 'number') {
                return first - second;
            } else {
                return String(first).localeCompare(String(second));
            }
        });
        filterProformas = Object.fromEntries(array);
        paginacionProforma(Object.values(filterProformas).length, 1);
    });
    div.children[1].addEventListener('click', function () {
        let array = Object.entries(filterProformas).sort((a, b) => {
            let first = a[1][div.children[0].name];
            let second = b[1][div.children[0].name];
            if (typeof first === 'number' && typeof second === 'number') {
                return second - first;
            } else {
                return String(second).localeCompare(String(first));
            }
        });
        filterProformas = Object.fromEntries(array);
        paginacionProforma(Object.values(filterProformas).length, 1);
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
    let tbody = document.getElementById('tbodyProforma');
    inicio = (page - 1) * Number(selectNumberProf.value);
    final = inicio + Number(selectNumberProf.value);
    i = 1;
    tbody.innerHTML = '';
    for (let proforma in filterProformas) {
        if (i > inicio && i <= final) {
            let tr = document.createElement('tr');
            for (let valor in filterProformas[proforma]) {
                let td = document.createElement('td');
                if (valor == 'id_prof') {
                    td.innerText = filterProformas[proforma][valor];
                    td.setAttribute('hidden', '');
                    tr.appendChild(td);
                    td = document.createElement('td');
                    td.innerText = i;
                    tr.appendChild(td);
                    i++;
                    td = document.createElement('td');
                    td.innerText = filterProformas[proforma]['numero_prof'];
                    tr.appendChild(td);
                } else if (valor == 'fecha_prof') {
                    td.innerText = filterProformas[proforma][valor];
                    tr.appendChild(td);
                }
                else if (valor == 'nombre_usua') {
                    td.innerText = filterProformas[proforma][valor] + ' ' + filterProformas[proforma]['apellido_usua'];
                    tr.appendChild(td);
                } else if (valor == 'numero_prof' || valor == 'id_emp' || valor == 'sigla_emp' || valor == 'direccion_emp' || valor == 'telefono_emp' || valor == 'fk_id_usua_prof' || valor == 'fk_id_clte_prof' || valor == 'apellido_usua' || valor == 'email_usua' || valor == 'celular_usua' || valor == 'apellido_clte' || valor == 'celular_clte' || valor == 'moneda_prof' || valor == 'tipo_cambio_prof' || valor == 'estado_prof' || valor == 'cond_pago_prof' || valor == 'tpo_entrega_prof' || valor == 'observacion_prof') {
                } else if (valor == 'nombre_clte') {
                    td.innerText = filterProformas[proforma]['apellido_clte'] + ' ' + filterProformas[proforma][valor];
                    tr.appendChild(td)
                } else if (valor == 'descuento_prof') {
                    td.innerText = filterProformas[proforma][valor];
                    tr.appendChild(td);
                } else if (valor == 'total_prof') {
                    td.innerText = Number(filterProformas[proforma][valor]).toFixed(2) + ' ' + filterProformas[proforma]['moneda_prof'];
                    tr.appendChild(td);
                } else {
                    td.innerText = filterProformas[proforma][valor];
                    tr.appendChild(td);
                }
            }
            let td = document.createElement('td');
            if (filterProformas[proforma]['estado_prof'] == 'vendido') {
                td.innerHTML = `
            <img src='../imagenes/folder.svg' onclick='showMdfProforma(this.parentNode.parentNode.children[0].innerText)' title='Proformas anteriores'>
            <img src='../imagenes/pdf.svg' onclick='selectPDFInformation(this.parentNode.parentNode.children[0].innerText, "prof")' title='Mostrar PDF'>`;
            } else {
                if (localStorage.getItem('rol_usua') == 'Gerente general' || localStorage.getItem('rol_usua') == 'Administrador') {
                    td.innerHTML = `
                <img src='../imagenes/notaEntrega.svg' onclick='openNotaEntregaRMW(this.parentNode.parentNode)' title='Generar Nota de Entrega'>
                <img src='../imagenes/folder.svg' onclick='showMdfProforma(this.parentNode.parentNode.children[0].innerText)' title='Proformas anteriores'>
                <img src='../imagenes/pdf.svg' onclick='selectPDFInformation(this.parentNode.parentNode.children[0].innerText, "prof")' title='Mostrar PDF'>
                <img src='../imagenes/edit.svg' onclick='readProforma(this.parentNode.parentNode)' title='Editar Proforma'>
                <img src='../imagenes/trash.svg' onclick='deleteProforma(this.parentNode.parentNode)' title='Eliminar Proforma'>`;
                } else {
                    if (localStorage.getItem('id_usua') != filterProformas[proforma]['fk_id_usua_prof']) {
                        td.innerHTML = `
                        <img src='../imagenes/folder.svg' onclick='showMdfProforma(this.parentNode.parentNode.children[0].innerText)' title='Proformas anteriores' >
                        <img src='../imagenes/pdf.svg' onclick='selectPDFInformation(this.parentNode.parentNode.children[0].innerText, "prof")' title='Mostrar PDF'>`;
                    } else {
                        td.innerHTML = `
                        <img src='../imagenes/notaEntrega.svg' onclick='openNotaEntregaRMW(this.parentNode.parentNode)' title='Generar Nota de Entrega'>
                        <img src='../imagenes/folder.svg' onclick='showMdfProforma(this.parentNode.parentNode.children[0].innerText)' title='Proformas anteriores'>
                        <img src='../imagenes/pdf.svg' onclick='selectPDFInformation(this.parentNode.parentNode.children[0].innerText, "prof")' title='Mostrar PDF'>
                        <img src='../imagenes/edit.svg' onclick='readProforma(this.parentNode.parentNode)' title='Editar Proforma'>`;
                    }
                }
            }
            tr.appendChild(td);
            tbody.appendChild(tr);
        } else {
            i++;
        }
    }
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
document.getElementById('formProformaR').addEventListener('submit', createProforma);
function createProforma() {
    let cart = document.querySelectorAll('#cartItem .cart-item');
    if (cart.length > 0) {
        if (requestProducts == false) {
            requestProducts = true;
            proformaRMW.classList.remove('modal__show');
            previewProducts.classList.remove('modal__show');
            cartItem.innerHTML = '';
            let array = [];
            cart.forEach(product => {
                let valor = {};
                valor['codigo'] = product.children[2].innerHTML;
                valor['descripcion'] = product.children[7].innerText;
                valor['cantidad'] = product.children[3].value;
                valor['costoUnitario'] = product.children[4].value;
                valor['imagen'] = product.children[1].children[0].src;
                array.push(valor);
            });
            let productos = JSON.stringify(array); //String Json
            let form = document.getElementById("formProformaR");
            let moneda = selectMoneyCart.value;
            let formData = new FormData(form);
            formData.set("fecha_profR", `${dateActual[2]}-${dateActual[1]}-${dateActual[0]} ${datePart[1]}`);
            formData.set("total_profR", Number(document.getElementById('totalProf').innerHTML.split(' ')[1]));
            formData.append('createProforma', productos);
            formData.append('moneda_profR', moneda);
            formData.append('tipo_cambio_profR', tipoDeCambioProf.value);
            formData.append('id_usua', localStorage.getItem('id_usua'));
            preloader.classList.add('modal__show');
            fetch('../controladores/proforma.php', {
                method: "POST",
                body: formData
            }).then(response => response.text()).then(data => {
                requestProducts = false;
                alert(data);
                totalPrice();
                readProformas();
                readProf_prods();
                preloader.classList.remove('modal__show');
            }).catch(err => {
                requestProducts = false;
                alert(err);
            });
        }
    } else {
        alert('No a seleccionado ningun producto');
    }
}
//------Read una proforma
function readProforma(tr) {
    formProformas = 'M';
    let id_prof = tr.children[0].innerText;
    for (let proforma in filterProformas) {
        for (let valor in filterProformas[proforma]) {
            if (filterProformas[proforma]['id_prof'] == id_prof) {
                if (valor == 'fecha_prof') {
                    document.getElementsByName('fecha_profM')[0].value = `${dateActual[2]}-${dateActual[1]}-${dateActual[0]}`;
                } else if (valor == 'id_emp') {
                    selectEnterpriseM.innerHTML = '';
                    let option = document.createElement('option');
                    option.value = filterProformas[proforma][valor];
                    option.innerText = filterProformas[proforma]['nombre_emp'];
                    selectEnterpriseM.appendChild(option);
                } else if (valor == 'fk_id_clte_prof') {
                    selectCustomerM.innerHTML = '';
                    let option = document.createElement('option');
                    option.value = filterProformas[proforma][valor];
                    option.innerText = filterProformas[proforma]['nombre_clte'] + ' ' + filterProformas[proforma]['apellido_clte'];
                    selectCustomerM.appendChild(option);
                } else if (valor == 'silga_emp' || valor == 'nombre_emp' || valor == 'nombre_clte' || valor == 'fk_id_usua_prof' || valor == 'apellido_clte' || valor == 'nombre_usua' || valor == 'apellido_usua' || valor == 'email_usua' || valor == 'celular_usua' || valor == 'estado_prof' || valor == 'telefono_emp' || valor == 'direccion_emp') {
                } else if (valor == 'tipo_cambio_prof') {
                    if (filterProformas[proforma]['moneda_prof'] == '$') {
                        document.getElementsByName(valor + 'M')[0].parentNode.classList.remove('hide');
                    } else {
                        document.getElementsByName(valor + 'M')[0].parentNode.classList.add('hide');
                    }
                    document.getElementsByName(valor + 'M')[0].value = filterProformas[proforma][valor];
                } else {
                    document.getElementsByName(valor + 'M')[0].value = filterProformas[proforma][valor];
                }
            }
        }
    }
    proformaMMW.classList.add('modal__show');
    readProf_prod();
}
//------Update una proforma
let formProformaM = document.getElementById('formProformaM');
formProformaM.addEventListener('submit', updateProforma)
function updateProforma() {
    let modal = document.querySelector('#cartsProf_prodMW');
    let cartItems = modal.querySelectorAll('div.cart-item');
    if (cartItems.length > 0) {
        if (requestProducts == false) {
            requestProducts = true;
            proformaMMW.classList.remove('modal__show');
            prof_prodMW.classList.remove('modal__show');
            previewProducts.classList.remove('modal__show');
            let array = [];
            cartItems.forEach(product => {
                let valor = {};
                valor['codigo'] = product.children[2].innerText;
                valor['cantidad'] = product.children[3].value;
                valor['costoUnitario'] = product.children[4].value;
                array.push(valor);
            });
            let productos = JSON.stringify(array); //string json
            let form = document.getElementById('formProformaM');
            let formData = new FormData(form);
            formData.set("fecha_profM", `${dateActual[2]}-${dateActual[1]}-${dateActual[0]} ${datePart[1]}`);
            formData.set("total_profM", Number(document.getElementById('totalProf').innerHTML.split(' ')[1]));
            formData.append('updateProforma', productos);
            formData.append('id_usua', localStorage.getItem('id_usua'));
            preloader.classList.add('modal__show');
            fetch('../controladores/proforma.php', {
                method: "POST",
                body: formData
            }).then(response => response.text()).then(data => {
                requestProducts = false;
                alert(data);
                readProformas();
                readProf_prods();
                readMdfProforma();
                readmProf_prods();
                preloader.classList.remove('modal__show');
            }).catch(err => {
                requestProducts = false;
                alert(err);
            });
        }
    } else {
        alert('No a seleccionado ningun producto');
    }
}
//-------Delete una proforma
function deleteProforma(tr) {
    if (confirm('¿Esta usted seguro?')) {
        if (requestProducts == false) {
            requestProducts = true;
            let id_prof = tr.children[0].innerText;
            let formData = new FormData();
            formData.append('deleteProforma', id_prof);
            preloader.classList.add('modal__show');
            fetch('../controladores/proforma.php', {
                method: "POST",
                body: formData
            }).then(response => response.text()).then(data => {
                requestProducts = false;
                alert(data);
                readProformas();
                preloader.classList.remove('modal__show');
            }).catch(err => {
                requestProducts = false;
                alert(err);
            });
        }
    }
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
    if (findOutCartItem() == '') {
        proformaRMW.classList.add('modal__show');
    } else {
        alert(findOutCartItem());
    }
});
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
function findOutCartItem() {
    let cartItem = document.querySelectorAll('#cartItem div.cart-item');
    let errorMessage = '';
    cartItem.forEach(cart => {
        if (!isInteger(cart.children[3].value)) {
            errorMessage += 'La cantidad no es un número entero\n';
        }
    });
    return errorMessage;
}
function isInteger(input) {
    return /^[-+]?\d+$/.test(input);
}
//-------------------------------------------------------CRUD PROFORMAS MODIFICADAS---------------------------------
let mdfPproforma = {};
readMdfProforma()
function readMdfProforma() {
    let formData = new FormData();
    formData.append('read_mdf_Proforma', '')
    fetch('../controladores/proforma.php', {
        method: "POST",
        body: formData
    }).then(response => response.json()).then(data => {
        mdfPproforma = JSON.parse(JSON.stringify(data));
    }).catch(err => console.log(err));
}
function showMdfProforma(id_prof) {
    tablemProfMW.classList.add('modal__show');
    let tbody = document.getElementById('tbodymProforma');
    let i = 1;
    tbody.innerHTML = '';
    document.querySelector('#tablemProfMW div.table__title h1').innerHTML = ``;
    let filtermdfPproforma = [];
    for (let proforma in mdfPproforma) {
        if (mdfPproforma[proforma]['id_prof_mprof'] == id_prof) {
            filtermdfPproforma.push(mdfPproforma[proforma]);
            let tr = document.createElement('tr');
            for (let dato in mdfPproforma[proforma]) {
                let td = document.createElement('td');
                if (dato == 'id_mprof') {
                    document.querySelector('#tablemProfMW div.table__title h1').innerHTML = `${mdfPproforma[proforma]['numero_mprof']}`;
                    td.innerText = i;
                    tr.appendChild(td);
                    td = document.createElement('td');
                    td.innerText = mdfPproforma[proforma]['id_mprof'];
                    td.setAttribute('hidden', '');
                    tr.appendChild(td);
                    td = document.createElement('td');
                    td.innerText = mdfPproforma[proforma]['id_prof_mprof'];
                    td.setAttribute('hidden', '');
                    tr.appendChild(td);
                    td = document.createElement('td');
                    td.innerText = mdfPproforma[proforma]['numero_mprof'] + '-' + i;
                    tr.appendChild(td);
                    i++;
                } else if (dato == 'fecha_mprof') {
                    td.innerText = mdfPproforma[proforma][dato];
                    tr.appendChild(td);
                } else if (dato == 'nombre_usua') {
                    td.innerText = mdfPproforma[proforma][dato] + ' ' + mdfPproforma[proforma]['apellido_usua'];
                    tr.appendChild(td);
                } else if (dato == 'id_prof_mprof' || dato == 'numero_mprof' || dato == 'cond_pago_mprof' || dato == 'tpo_entrega_mprof' || dato == 'apellido_usua' || dato == 'email_usua' || dato == 'celular_usua' || dato == 'sigla_emp' || dato == 'telefono_emp' || dato == 'direccion_emp' || dato == 'apellido_clte' || dato == 'celular_clte' || dato == 'moneda_mprof' || dato == 'tipo_cambio_mprof') {
                } else if (dato == 'nombre_clte') {
                    td.innerText = mdfPproforma[proforma][dato] + ' ' + mdfPproforma[proforma]['apellido_clte'];
                    tr.appendChild(td);
                } else if (dato == 'descuento_mprof') {
                    td.innerText = mdfPproforma[proforma][dato] + '%';
                    tr.appendChild(td);
                } else {
                    td.innerText = mdfPproforma[proforma][dato];
                    tr.appendChild(td);
                }
            }
            let td = document.createElement('td');
            if (localStorage.getItem('rol_usua') == 'Gerente general' || localStorage.getItem('rol_usua') == 'Administrador') {
                td.innerHTML = `
                <img src='../imagenes/pdf.svg' onclick='selectPDFInformation(this.parentNode.parentNode.children[1].innerText, "mprof")' title='PDF'>
                <img src='../imagenes/trash.svg' onclick='deleteMdfProforma(this.parentNode.parentNode, "mprof")' title='Eliminar'>`;
            } else {
                td.innerHTML = `
                <img src='../imagenes/pdf.svg' onclick='selectPDFInformation(this.parentNode.parentNode.children[1].innerText, "mprof")' title='PDF'>`;
            }
            tr.appendChild(td);
            tbody.appendChild(tr);
        }
    }
}
//-------Delete una proforma modificada
function deleteMdfProforma(tr) {
    if (confirm('¿Esta usted seguro?')) {
        if (requestProfMdf == false) {
            requestProfMdf = true;
            let id_mprof = tr.children[1].innerText;
            let formData = new FormData();
            tablemProfMW.classList.remove('modal__show');
            formData.append('deletemProforma', id_mprof);
            preloader.classList.add('modal__show');
            fetch('../controladores/proforma.php', {
                method: "POST",
                body: formData
            }).then(response => response.text()).then(data => {
                requestProfMdf = false;
                readMdfProforma();
                readmProf_prods();
                alert(data);
                preloader.classList.remove('modal__show');
            }).catch(err => {
                requestProfMdf = false;
                alert(err);
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
        for (let proforma in filterProformas) {
            if (filterProformas[proforma]['id_prof'] == id) {
                let objects = [];
                for (let pf_pd in prof_prods) {
                    if (prof_prods[pf_pd]['fk_id_prof_pfpd'] == id) {
                        for (let product in products) {
                            if (products[product]['id_prod'] == prof_prods[pf_pd]['fk_id_prod_pfpd']) {
                                let object = {
                                    'codigo_prod': products[product]['codigo_prod'],
                                    'descripcion_prod': products[product]['descripcion_prod'],
                                    'cantidad_pfpd': prof_prods[pf_pd]['cantidad_pfpd'],
                                    'cost_uni_pfpd': prof_prods[pf_pd]['cost_uni_pfpd'],
                                    'imagen_prod': products[product]['imagen_prod']
                                };
                                objects.push(object);
                            }
                        }
                    }
                }
                showPDF(filterProformas[proforma], objects, pdf);
                break; //Salir de bucle for
            }
        }
    } else if (pdf == 'mprof') {
        filtermdfPproforma.forEach(proforma => {
            if (proforma['id_mprof'] == id) {
                let objects = [];
                for (let pf_pd in mProf_prods) {
                    if (mProf_prods[pf_pd]['fk_id_mprof_mpfpd'] == id) {
                        for (let product in products) {
                            if (products[product]['id_prod'] == mProf_prods[pf_pd]['fk_id_prod_mpfpd']) {
                                let object = {
                                    'codigo_prod': products[product]['codigo_prod'],
                                    'descripcion_prod': products[product]['descripcion_prod'],
                                    'cantidad_mpfpd': mProf_prods[pf_pd]['cantidad_mpfpd'],
                                    'cost_uni_mpfpd': mProf_prods[pf_pd]['cost_uni_mpfpd'],
                                    'imagen_prod': products[product]['imagen_prod']
                                };
                                objects.push(object);
                            }
                        }
                    }
                }
                showPDF(proforma, objects, pdf);
                return;
            }
        })
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
//------------------------------------------------CRUD PROF_PROD------------------------------------------------------------
let prof_prods = {};
readProf_prods();
function readProf_prods() {
    let formData = new FormData();
    formData.append('readProf_prods', '');
    fetch('../controladores/proforma.php', {
        method: "POST",
        body: formData
    }).then(response => response.json()).then(data => {
        prof_prods = JSON.parse(JSON.stringify(data));
    }).catch(err => console.log(err));
}
let mProf_prods = {};
readmProf_prods();
function readmProf_prods() {
    let formData = new FormData();
    formData.append('readmProf_prods', '');
    fetch('../controladores/proforma.php', {
        method: "POST",
        body: formData
    }).then(response => response.json()).then(data => {
        mProf_prods = JSON.parse(JSON.stringify(data));
    }).catch(err => console.log(err));
}
//------read prof_prod
let modalProf_prod = document.querySelector('#prof_prodMW div.modal__body');
function readProf_prod() {
    modalProf_prod.innerHTML = '';
    let id_prof = document.getElementsByName('id_profM')[0].value;
    for (let prof_prod in prof_prods) {
        if (prof_prods[prof_prod]['fk_id_prof_pfpd'] == id_prof) {
            for (let product in products) {
                if (products[product]['id_prod'] == prof_prods[prof_prod]['fk_id_prod_pfpd']) {
                    nuevo_objeto = {
                        'fk_id_prof_pfpd': prof_prods[prof_prod]['fk_id_prof_pfpd'],
                        'codigo_prod': products[product]['codigo_prod'],
                        'nombre_prod': products[product]['nombre_prod'],
                        'descripcion_prod': products[product]['descripcion_prod'],
                        'imagen_prod': products[product]['imagen_prod'],
                        'cantidad_pfpd': prof_prods[prof_prod]['cantidad_pfpd'],
                        'cost_uni_pfpd': prof_prods[prof_prod]['cost_uni_pfpd'],
                    }
                    cartProduct_pfpd(nuevo_objeto);
                }
            }
        }

    }
}
//--------Muestra la lista de los productos de la proforma
function cartProduct_pfpd(product) {
    let cantidad_inv;
    let cost_uni = 0;
    for (let inventory in inventories) {
        for (let valor in inventories[inventory]) {
            if (inventories[inventory]['codigo_prod'] == product['codigo_prod']) {
                cantidad_inv = inventories[inventory]['cantidad_inv'];
                cost_uni = inventories[inventory]['cost_uni_inv'];
                break;
            }
        }
    }
    cantidad_inv = (cantidad_inv == undefined) ? 0 : cantidad_inv;
    let cantidad_prod = (product['cantidad_pfpd'] == undefined) ? 1 : product['cantidad_pfpd'];
    cost_uni = (product['cost_uni_pfpd'] == undefined) ? (product['cost_uni_inv'] == undefined) ? (cost_uni == 0) ? 0 : cost_uni : product['cost_uni_inv'] : product['cost_uni_pfpd'];
    let item = document.createElement('div');
    item.classList.add('cart-item');
    let html =
        `<p class="cart-item__cantInv">${cantidad_inv}</p>
        <div class="row-img">
            <img src="../modelos/imagenes/`+ product['imagen_prod'] + `" class="rowimg">
        </div>
        <p class="cart-item__codigo">`+ product['codigo_prod'] + `</p>
        <input type="number" value = "${cantidad_prod}" min="1" onChange="changeQuantity_pfpd(this.parentNode)" class="cart-item__cantidad">
        <input type="number" value = "${cost_uni}" onChange="changeQuantity_pfpd(this.parentNode)" class="cart-item__costUnit">
        <input type="number" value = "`+ cantidad_prod * cost_uni + `" class="cart-item__costTotal" readonly>
        <img src="../imagenes/trash.svg" onClick="remove_pfpd(this.parentNode)" class='icon__CRUD'>
        <h3 hidden>`+ product['nombre_prod'] + `</h3>
        <h3 hidden>`+ product['descripcion_prod'] + `</h3>`;
    item.innerHTML = html;
    modalProf_prod.appendChild(item);
    totalPrice_pfpd();
}
//-------Eliminar producto 
function remove_pfpd(product) {
    let listProducts = document.querySelector('#prof_prodMW div.modal__body');
    let itemProduct = listProducts.querySelectorAll('div.cart-item');
    listProducts.removeChild(product);
    totalPrice_pfpd();
}
//-------Cuando cambia la cantidad
function changeQuantity_pfpd(product) {
    let cantidad_prod = product.children[3].value;
    let costo_uni = product.children[4].value;
    let cost_uni_total = cantidad_prod * costo_uni;
    product.children[5].value = cost_uni_total.toFixed(2);
    totalPrice_pfpd();
}
function totalPrice_pfpd() {
    let divs = document.querySelectorAll('#prof_prodMW div.modal__body div.cart-item');
    let moneda = document.getElementsByName('moneda_profM')[0].value;
    let total = 0;
    divs.forEach(div => {
        costo = Number(div.children[5].value);
        total = total + costo;
    })
    document.getElementById('total_pfpd').innerHTML = moneda + ' ' + total.toFixed(2);
    document.getElementById('count_pfpd').innerHTML = divs.length;
}
//-------Tipo de moneda
let moneda_profM = document.getElementsByName('moneda_profM')[0];
moneda_profM.addEventListener('change', function () {
    totalPrice_pfpd();
    let tipoDeCambioProfM = document.getElementById('tipoDeCambioProfM');
    if (moneda_profM.value == '$') {
        tipoDeCambioProfM.classList.remove('hide');
    } else {
        tipoDeCambioProfM.classList.add('hide');
    }
});
//-------------------------------------MODAL DE PRODUCTS DE UNA PROFORMA MODIFICAR--------------------------------------------
const closeProf_prodMW = document.getElementById('closeProf_prodMW');
const prof_prodMW = document.getElementById('prof_prodMW');
function openProf_prodMW() {
    prof_prodMW.classList.add('modal__show');
}
closeProf_prodMW.addEventListener('click', (e) => {
    prof_prodMW.classList.remove('modal__show');
});
//-------------------------------------------MOSTRAR LOS PRODUCTOS PREVIAMENTE---------------------------------------------------
function openPreviwProducts() {
    const tbody = document.getElementById('tbodyPreviewProd');
    const productos = getProducts();
    const moneda = getMoneda();
    const total = calculateTotal(productos);
    const desc = getDescuento();
    createTable(tbody, productos, moneda);
    updateTotales(total, desc, moneda);
    createButton(tbody, formProformas);
    previewProducts.classList.add('modal__show');
}
function getProducts() {
    if (formProformas === 'R') {
        return document.querySelectorAll('#cartItem .cart-item');
    } else if (formProformas === 'M') {
        return document.querySelectorAll('#prof_prodMW div.modal__body .cart-item');
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
        total += Number(producto.children[5].value);
    });
    return total;
}
function getDescuento() {
    return Number(document.getElementsByName('descuento_prof' + formProformas)[0].value);
}
function createTable(tbody, productos, moneda) {
    const html = [];
    productos.forEach(producto => {
        html.push(`
        <tr>
          <td>${i}</td>
          <td>${producto.children[2].innerText}</td>
          <td><textarea class="textarea__preview" readonly>${producto.children[7].innerText}</textarea></td>
          <td><textarea class="textarea__preview" readonly>${producto.children[8].innerText}</textarea></td>
          <td><img src='${producto.children[1].children[0].src}' class='tbody__img'></td>
          <td>${producto.children[3].value}</td>
          <td>${producto.children[4].value} <b>${moneda}</b></td>
          <td>${producto.children[5].value} <b>${moneda}</b></td>
        </tr>
      `);
        i++;
    });
    tbody.innerHTML = html.join('');
}
function updateTotales(total, desc, moneda) {
    document.getElementsByName('total_prof' + formProformas)[0].value = total.toFixed(2);
    subTotalProf.innerText = `Sub-Total(${moneda}): ${total} ${moneda}`;
    descProf.innerText = `Desc. ${desc}% (${moneda}): ${(total * desc / 100).toFixed(2)} ${moneda}`;
    totalProf.innerText = `Total(${moneda}): ${(total - (total * desc / 100)).toFixed(2)} ${moneda}`;
}
function createButton(tbody, formProformas) {
    const button = document.createElement('button');
    button.classList.add('button__sell--previw');
    button.innerText = 'Registrar';
    if (formProformas === 'R') {
        button.setAttribute('onclick', 'createProforma();');
    } else if (formProformas === 'M') {
        button.setAttribute('onclick', 'updateProforma();');
    }
    const td = document.createElement('td');
    td.setAttribute('colspan', '8');
    td.appendChild(button);
    tbody.appendChild(td);
}
//-----------------------------MODAL VISTA PREVIA DE LOS PRODUCTOS DE LA PROFORMA
const previewProducts = document.getElementById('previewProducts');
const closePreviewProducts = document.getElementById('closePreviewProducts');
closePreviewProducts.addEventListener('click', () => {
    previewProducts.classList.remove('modal__show');
});
//---------------------------------------------------------CRUD NOTA DE ENTREGA------------------------------------------
//-------Crate Nota de entrega
const productsSold = document.querySelector('#productsSold');
const closeProductsSold = document.querySelector('#closeProductsSold');
function openPreviwProductsSold() {
    const id_prof = document.getElementById('fk_id_prof_ne').value;
    const prof_prodsFiltered = Object.values(prof_prods).filter(prof_prod => prof_prod['fk_id_prof_pfpd'] === id_prof);
    const nuevo_array = [];
    const inventoriesMap = new Map(Object.values(inventories).map(inventory => [inventory['fk_id_prod_inv'], inventory]));
    const productsMap = new Map(Object.values(products).map(product => [product['id_prod'], product]));
    prof_prodsFiltered.forEach(prof_prod => {
        const product = productsMap.get(prof_prod['fk_id_prod_pfpd']);
        const inventory = inventoriesMap.get(product['id_prod']);
        if (inventory) {
            nuevo_array.push({
                'id_inv': inventory['id_inv'],
                'cantidad_inv': inventory['cantidad_inv'],
                'imagen_prod': product['imagen_prod'],
                'codigo_prod': product['codigo_prod'],
                'cantidad_pfpd': prof_prod['cantidad_pfpd'],
                'cost_uni_pfpd': prof_prod['cost_uni_pfpd']
            });
        }
    });
    readProductsSold(nuevo_array);
}
closeProductsSold.addEventListener('click', (e) => {
    productsSold.classList.remove('modal__show');
});
function readProductsSold(products) {
    const item = productsSold.querySelector('.modal__body');
    item.textContent = '';
    const cartTemplate = document.createElement('template');
    cartTemplate.innerHTML = `
        <div class="cart-item">
            <p class="cart-item__cantInv"></p>
            <div class="row-img">
                <img src="" class="rowimg">
            </div>
            <p class="cart-item__codigo"></p>
            <input type="number" value="" min="1" onChange="changeQuantity_pfpd(this.parentNode)" class="cart-item__cantidad">
            <input type="number" value="" onChange="changeQuantity_pfpd(this.parentNode)" class="cart-item__costUnit">
            <input type="number" value="" class="cart-item__costTotal" readonly>
            <p hidden></p>
        </div>
    `;
    let costTotal = 0;
    products.forEach(product => {
        const cart = cartTemplate.content.cloneNode(true);
        cart.querySelector('.cart-item__cantInv').textContent = product['cantidad_inv'];
        cart.querySelector('.row-img img').src = `../modelos/imagenes/${product['imagen_prod']}`;
        cart.querySelector('.cart-item__codigo').textContent = product['codigo_prod'];
        cart.querySelector('.cart-item__cantidad').value = product['cantidad_pfpd'];
        cart.querySelector('.cart-item__costUnit').value = parseFloat(product['cost_uni_pfpd']).toFixed(2);
        cart.querySelector('.cart-item__costTotal').value = (product['cantidad_pfpd'] * parseFloat(product['cost_uni_pfpd'])).toFixed(2);
        cart.querySelector('p[hidden]').textContent = product['id_inv'];
        item.appendChild(cart);
        costTotal += parseFloat(product['cost_uni_pfpd']) * product['cantidad_pfpd'];
    });
    document.getElementById('subTotalNE').innerText = `Sub-Total(Bs): ${costTotal.toFixed(2)} Bs`;
    let desc = (costTotal * Number(document.getElementById('descuento_prof').value) / 100).toFixed(2);
    document.getElementById('descNE').innerText = `Desc. ${Number(document.getElementById('descuento_prof').value)}% (Bs): ${desc} Bs`;
    document.getElementById('totalNE').innerText = `Total(Bs): ${(costTotal - desc).toFixed(2)} Bs`;
    document.getElementById('quantityNE').innerText = products.length;
    document.getElementById('btnBuy').removeAttribute('hidden');
    productsSold.classList.add('modal__show');
}
function createNotaEntrega() {
    const carts = productsSold.querySelectorAll('#cartsProductsSold div.cart-item');
    let arrayObjetos = [];
    let count = true;
    for (let i = 0; i < carts.length; i++) {
        if (Number(carts[i].children[0].innerText) < Number(carts[i].children[3].value)) {
            alert('No hay la cantidad suficiente en inventario del prducto: ' + carts[i].children[2].innerText);
            count = false;
            break; // Detiene la ejecución del bucle
        } else {
            let objeto = {
                'id_inv': parseInt(carts[i].children[6].innerText),
                'cantidad': parseInt(carts[i].children[3].value)
            };
            arrayObjetos.push(objeto);
        }
    }
    if (count == true) {
        if (confirm('¿Esta usted seguro?')) {
            if (requestNE == false) {
                requestNE = true;
                notaEntregaRMW.classList.remove('modal__show');
                productsSold.classList.remove('modal__show');
                const form = document.getElementById('formNotaEntregaR');
                let formData = new FormData(form);
                formData.append('createNotaEntrega', '');
                formData.append('arrayObjetos', JSON.stringify(arrayObjetos));
                formData.append('id_usua', localStorage.getItem('id_usua'));
                preloader.classList.add('modal__show');
                fetch('../controladores/notaEntrega.php', {
                    method: "POST",
                    body: formData
                }).then(response => response.text()).then(data => {
                    requestNE = false;
                    alert(data);
                    form.reset();
                    readProformas();
                    readInventories();
                    preloader.classList.remove('modal__show');
                }).catch(err => {
                    requestNE = false;
                    alert(err);
                });
            }
        }
    }
}
//-----------------------------------------------MODAL DE NOTA DE ENTREGA--------------------------------------------
const closeNotaEntregaRMW = document.getElementById('closeNotaEntregaRMW');
const notaEntregaRMW = document.getElementById('notaEntregaRMW');
function openNotaEntregaRMW(tr) {
    document.getElementsByName('fecha_ne')[0].value = `${dateActual[2]}-${dateActual[1]}-${dateActual[0]}`;
    document.getElementById('fk_id_prof_ne').value = tr.children[0].innerText;
    document.getElementById('descuento_prof').value = tr.children[7].innerText;
    document.getElementById('numero_prof').value = tr.children[2].innerText;
    notaEntregaRMW.classList.add('modal__show');
}
closeNotaEntregaRMW.addEventListener('click', (e) => {
    notaEntregaRMW.classList.remove('modal__show');
});
//---------------------------------------------------------------CLIENTES----------------------------------------------
let selectCustomerR = document.getElementsByName('fk_id_clte_profR')[0];
let selectCustomerM = document.getElementsByName('fk_id_clte_profM')[0];
let customers = {};
let filterCustomers = {};
let sortCustomers = {};
let indexCustomer = 0;
let formCustomer;
readCustomers();
function readCustomers() {
    let formData = new FormData();
    formData.append('readCustomers', '');
    fetch('../controladores/clientes.php', {
        method: "POST",
        body: formData
    }).then(response => response.json()).then(data => {
        customers = JSON.parse(JSON.stringify(data));
        filterCustomers = customers;
        sortCustomers = customers;
        let array = Object.entries(sortCustomers).sort((a, b) => {
            const apellidoCompare = a[1].apellido_clte.toLowerCase().localeCompare(b[1].apellido_clte.toLowerCase());
            if (apellidoCompare !== 0) {
                return apellidoCompare;
            }
            return a[1].nombre_clte.toLowerCase().localeCompare(b[1].nombre_clte.toLowerCase());
        })
        sortCustomers = Object.fromEntries(array);
        fillSelectClte(selectCustomerR, indexCustomer);
    }).catch(err => console.log(err));
}
//<<-----------------------------------------CRUD CLIENTE----------------------------------------->>
//------Create a customer
const formClienteR = document.getElementById('formClienteR');
formClienteR.addEventListener('submit', createCustomer);
function createCustomer() {
    event.preventDefault();
    if (requestClte == false) {
        requestClte = true;
        customersRMW.classList.remove('modal__show');
        let formData = new FormData(formClienteR);
        formData.append('createCustomer', '');
        preloader.classList.add('modal__show');
        fetch('../controladores/clientes.php', {
            method: "POST",
            body: formData
        }).then(response => response.text()).then(data => {
            requestClte = false;
            alert(data);
            indexCustomer = 0;
            readCustomers();
            const inputsR = document.querySelectorAll('#formClienteR .form__group input');
            inputsR.forEach(input => { input.value = '' });
            preloader.classList.remove('modal__show');
        }).catch(err => {
            requestClte = false;
            alert(err);
        });
    }

}
//------Read a Customer
function readCustomer(tr) {
    formCustomer = 'M';
    selectCreateCustomer();
    let id_clte = tr.children[0].value;
    for (let customer in filterCustomers) {
        if (filterCustomers[customer]['id_clte'] == id_clte) {
            for (let valor in filterCustomers[customer]) {
                if (valor == 'nombre_emp' || valor == 'fk_id_emp_clte') {
                } else {
                    document.getElementsByName(valor + 'M')[0].value = filterCustomers[customer][valor];
                }
            }
            break;
        }
    }
    customersMMW.classList.add('modal__show');
}
//------Update a Customer
const formClienteM = document.getElementById('formClienteM');
formClienteM.addEventListener('submit', updateCustomer);
function updateCustomer() {
    event.preventDefault();
    if (requestClte == false) {
        requestClte = true;
        customersMMW.classList.remove('modal__show');
        let formData = new FormData(formClienteM);
        formData.append('updateCustomer', '');
        preloader.classList.add('modal__show');
        fetch('../controladores/clientes.php', {
            method: "POST",
            body: formData
        }).then(response => response.text()).then(data => {
            requestClte = false;
            alert(data);
            indexCustomer = selectCustomerR.value;
            readCustomers();
            preloader.classList.remove('modal__show');
        }).catch(err => {
            requestClte = false;
            alert(err);
        });
    }
}
//------Delete a Customer
function deleteCustomer(tr) {
    if (confirm('¿Esta usted seguro?')) {
        if (requestClte == false) {
            requestClte = true;
            let id_clte = tr.children[0].value;
            let formData = new FormData();
            formData.append('deleteCustomer', id_clte);
            preloader.classList.add('modal__show');
            fetch('../controladores/clientes.php', {
                method: "POST",
                body: formData
            }).then(response => response.text()).then(data => {
                requestClte = false;
                alert(data)
                indexCustomer = 0;
                readCustomers();
                preloader.classList.remove('modal__show');
            }).catch(err => {
                requestClte = false;
                alert(err)
            });
        }
    }
}
//------Empresa de cliente
function selectCreateCustomer() {
    let selectEmp2 = document.getElementById('fk_id_emp_clte' + formCustomer + '2');
    selectEmp2.innerHTML = '';
    let option2 = document.createElement('option');
    option2.value = selectEnterpriseR.value;
    let options = selectEnterpriseR.querySelectorAll('option');
    let valor;
    options.forEach(option => {
        if (selectEnterpriseR.value == option.value) {
            valor = option.innerText;
        }
    })
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
//<<---------------------------------------------EMPRESA---------------------------------------------->>
const selectEnterpriseR = document.getElementsByName('fk_id_emp_clteR')[0];
const selectEnterpriseM = document.getElementsByName('fk_id_emp_clteM')[0];
selectEnterpriseR.addEventListener('change', function () {
    fillSelectClte(selectCustomerR, indexCustomer);
});
let enterprises = {};
let filterEnterprises = {};
let indexEnterprise = 0;
readEnterprises();
function readEnterprises() {
    let formData = new FormData();
    formData.append('readEnterprises', '');
    fetch('../controladores/clientes.php', {
        method: "POST",
        body: formData
    }).then(response => response.json()).then(data => {
        enterprises = JSON.parse(JSON.stringify(data));
        filterEnterprises = enterprises;
        paginacionEnterpriseMW(Object.values(filterEnterprises).length, 1);
        fillSelectEmp(selectEnterpriseR, indexEnterprise);
    }).catch(err => console.log(err));
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
                if (valor != 'id_emp') {
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
//------Ordenar tabla descendente ascendente
let orderEnterprises = document.querySelectorAll('.tbody__head--empMW');
orderEnterprises.forEach(div => {
    div.children[0].addEventListener('click', function () {
        let array = Object.entries(filterEnterprises).sort((a, b) => {
            let first = a[1][div.children[0].name].toLowerCase();
            let second = b[1][div.children[0].name].toLowerCase();
            if (first < second) { return -1 }
            if (first > second) { return 1 }
            return 0;
        })
        filterEnterprises = Object.fromEntries(array);
        paginacionEnterpriseMW(Object.values(filterEnterprises).length, 1);
    });
    div.children[1].addEventListener('click', function () {
        let array = Object.entries(filterEnterprises).sort((a, b) => {
            let first = a[1][div.children[0].name].toLowerCase();
            let second = b[1][div.children[0].name].toLowerCase();
            if (first > second) { return -1 }
            if (first < second) { return 1 }
            return 0;
        })
        filterEnterprises = Object.fromEntries(array);
        paginacionEnterpriseMW(Object.values(filterEnterprises).length, 1);
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
            for (let valor in filterEnterprises[enterprise]) {
                let td = document.createElement('td');
                if (valor == 'id_emp') {
                    td.innerText = filterEnterprises[enterprise][valor];
                    td.setAttribute('hidden', '');
                    tr.appendChild(td);
                    td = document.createElement('td');
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
    let id_emp = tr.children[0].innerText;
    selectEnterpriseR.value = id_emp;
    fillSelectClte(selectCustomerR, indexCustomer);
}
//----------------------------------ventana modal EnterpriseSMW-------------------------------------------
const enterpriseSMW = document.getElementById('enterpriseSMW');
//enterpriseSMW.addEventListener('click', ()=>enterpriseSMW.classList.remove('modal__show'));
const closeEnterpriseSMW = document.getElementById('closeEnterpriseSMW');
function openEnterpriseSMW() {
    enterpriseSMW.classList.add('modal__show');
}
closeEnterpriseSMW.addEventListener('click', () => {
    enterpriseSMW.classList.remove('modal__show');
});
function fillSelectEmp(select, index) {
    select.innerHTML = '';
    for (let enterprise in enterprises) {
        let option = document.createElement('option');
        option.value = enterprises[enterprise]['id_emp'];
        option.innerText = enterprises[enterprise]['nombre_emp'];
        select.appendChild(option);
    }
    if (index > 0) { select.value = index }
    fillSelectClte(selectCustomerR, indexCustomer);
}
function fillSelectClte(select, index) {
    let id_emp = selectEnterpriseR.value;
    select.innerHTML = '';
    for (let customer in sortCustomers) {
        if (sortCustomers[customer]['fk_id_emp_clte'] == id_emp) {
            let option = document.createElement('option');
            option.value = sortCustomers[customer]['id_clte'];
            option.innerText = sortCustomers[customer]['apellido_clte'] + ' ' + sortCustomers[customer]['nombre_clte'];
            select.appendChild(option);
        }
    }
    if (index > 0) { select.value = index }
    for (let enterprise in enterprises) {
        if (enterprises[enterprise]['id_emp'] == id_emp) {
            document.getElementsByName('descuento_profR')[0].value = enterprises[enterprise]['precio_emp'];
        }
    }
}
//<<---------------------------CRUD EMPRESA------------------------------->>
//------Craer una empresa
const formEmpresaR = document.getElementById('formEmpresaR');
formEmpresaR.addEventListener('submit', createEnterprise);
function createEnterprise() {
    event.preventDefault();
    if (requestEmp == false) {
        requestEmp = true;
        enterprisesRMW.classList.remove('modal__show');
        let formData = new FormData(formEmpresaR);
        formData.append('createEnterprise', '');
        preloader.classList.add('modal__show');
        fetch('../controladores/clientes.php', {
            method: "POST",
            body: formData
        }).then(response => response.text()).then(data => {
            requestEmp = false;
            indexEnterprise = 0;
            formEmpresaR.reset();
            readCustomers();
            readEnterprises();
            alert(data);
            preloader.classList.remove('modal__show');
        }).catch(err => {
            requestEmp = false;
            alert(err);
        });
    }
}
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
//------Actualizar una empresa
let formEmpresaM = document.getElementById('formEmpresaM');
formEmpresaM.addEventListener('submit', updateEnterprise);
function updateEnterprise() {
    event.preventDefault();
    if (requestEmp == false) {
        requestEmp = true;
        enterprisesMMW.classList.remove('modal__show');
        let formData = new FormData(formEmpresaM);
        formData.append('updateEnterprise', '');
        preloader.classList.add('modal__show');
        fetch('../controladores/clientes.php', {
            method: "POST",
            body: formData
        }).then(response => response.text()).then(data => {
            requestEmp = false;
            indexEnterprise = document.getElementsByName('fk_id_emp_clteR')[0].value;
            readEnterprises();
            alert(data);
            preloader.classList.remove('modal__show');
        }).catch(err => {
            requestEmp = false;
            alert(err);
        });
    }
}
//------Borrar una empresa
function deleteEnterprise(div) {
    let id_emp = div.children[0].value;
    if (confirm('¿Esta usted seguro?')) {
        if (requestEmp == false) {
            requestEmp = true;
            let formData = new FormData();
            formData.append('deleteEnterprise', id_emp);
            preloader.classList.add('modal__show');
            fetch('../controladores/clientes.php', {
                method: "POST",
                body: formData
            }).then(response => response.text()).then(data => {
                requestEmp = false;
                alert(data);
                indexEnterprise = 0;
                readEnterprises();
                preloader.classList.remove('modal__show');
            }).catch(err => {
                requestEmp = false;
                alert(err);
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
    paginacionInventoryMW(Object.values(filterInventoriesMW).length, 1);
});
//-------Marca y categoria
const selectMarcaInvMW = document.getElementById('selectMarcaInvMW');
selectMarcaInvMW.addEventListener('change', selectCategoriaInventoryMW);
const MWMW = document.getElementById('MWMW');
selectCategoriaInvMW.addEventListener('change', searchInventoriesMW);
//------buscar por:
function searchInventoriesMW() {
    filterInventoriesMW = {};
    for (let inventory in inventories) {
        for (let valor in inventories[inventory]) {
            if (selectSearchInvMW.value == 'todas') {
                if (valor == 'codigo_prod' || valor == 'nombre_prod' || valor == 'descripcion_prod' || valor == 'cost_uni_inv') {
                    if (inventories[inventory][valor].toLowerCase().indexOf(inputSearchInvMW.value.toLowerCase()) >= 0) {
                        filterInventoriesMW[inventory] = inventories[inventory];
                        break;
                    }
                }
            } else {
                if (valor == selectSearchInvMW.value) {
                    if (inventories[inventory][valor].toLowerCase().indexOf(inputSearchInvMW.value.toLowerCase()) >= 0) {
                        filterInventoriesMW[inventory] = inventories[inventory];
                        break;
                    }
                }
            }
        }
    }
    selectInventoriesMW();
}
//------buscar por marca y categoria:
function selectInventoriesMW() {
    if (selectMarcaInvMW.value == 'todasLasMarcas' && selectCategoriaInvMW.value == 'todasLasCategorias') {
        paginacionInventoryMW(Object.values(filterInventoriesMW).length, 1);
    } else {
        for (let ìnventory in filterInventoriesMW) {
            for (let valor in filterInventoriesMW[ìnventory]) {
                if (selectMarcaInvMW.value == 'todasLasMarcas') {
                    if (filterInventoriesMW[ìnventory]['id_ctgr'] != selectCategoriaInvMW.value) {
                        delete filterInventoriesMW[ìnventory];
                        break;
                    }
                } else if (selectCategoriaInvMW.value == 'todasLasCategorias') {
                    if (filterInventoriesMW[ìnventory]['id_mrc'] != selectMarcaInvMW.value) {
                        delete filterInventoriesMW[ìnventory];
                        break;
                    }
                } else {
                    if (filterInventoriesMW[ìnventory]['id_ctgr'] != selectCategoriaInvMW.value || filterInventoriesMW[ìnventory]['id_mrc'] != selectMarcaInvMW.value) {
                        delete filterInventoriesMW[ìnventory];
                        break;
                    }
                }
            }
        }
        paginacionInventoryMW(Object.values(filterInventoriesMW).length, 1);
    }
}
//------Ordenar tabla descendente ascendente
let orderInventoriesMW = document.querySelectorAll('.tbody__head--invMW');
orderInventoriesMW.forEach(div => {
    div.children[0].addEventListener('click', function () {
        let array = Object.entries(filterInventoriesMW).sort((a, b) => {
            let first = a[1][div.children[0].name].toLowerCase();
            let second = b[1][div.children[0].name].toLowerCase();
            if (first < second) { return -1 }
            if (first > second) { return 1 }
            return 0;
        })
        filterInventoriesMW = Object.fromEntries(array);
        paginacionInventoryMW(Object.values(filterInventoriesMW).length, 1);
    });
    div.children[1].addEventListener('click', function () {
        let array = Object.entries(filterInventoriesMW).sort((a, b) => {
            let first = a[1][div.children[0].name].toLowerCase();
            let second = b[1][div.children[0].name].toLowerCase();
            if (first > second) { return -1 }
            if (first < second) { return 1 }
            return 0;
        })
        filterInventoriesMW = Object.fromEntries(array);
        paginacionInventoryMW(Object.values(filterInventoriesMW).length, 1);
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
    inicio = (page - 1) * Number(selectNumberInvMW.value);
    final = inicio + Number(selectNumberInvMW.value);
    i = 1;
    tbody.innerHTML = '';
    for (let inventory in filterInventoriesMW) {
        if (i > inicio && i <= final) {
            let tr = document.createElement('tr');
            for (let valor in filterInventoriesMW[inventory]) {
                let td = document.createElement('td');
                if (valor == 'id_inv') {
                    td.innerText = filterInventoriesMW[inventory][valor];
                    td.setAttribute('hidden', '');
                    tr.appendChild(td);
                } else if (valor == 'id_mrc') {
                } else if (valor == 'id_ctgr') {
                } else if (valor == 'fk_id_prod_inv') {
                    td.innerText = filterInventoriesMW[inventory][valor];
                    td.setAttribute('hidden', '');
                    tr.appendChild(td);
                    td = document.createElement('td');
                    td.innerText = i;
                    tr.appendChild(td);
                    i++;
                } else if (valor == 'imagen_prod') {
                    let img = document.createElement('img');
                    img.classList.add('tbody__img');
                    img.setAttribute('src', '../modelos/imagenes/' + filterInventoriesMW[inventory][valor]);
                    td.appendChild(img);
                    tr.appendChild(td);
                } else {
                    td.innerText = filterInventoriesMW[inventory][valor];
                    tr.appendChild(td);
                }
            }
            let td = document.createElement('td');
            td.innerHTML = `
        <img src='../imagenes/send.svg' onclick='sendInventory(this.parentNode.parentNode)'>`;
            tr.appendChild(td);
            tbody.appendChild(tr);
        } else {
            i++;
        }
    }
}
function sendInventory(tr) {
    let id_inv = tr.children[0].innerText;
    for (let inventario in filterInventoriesMW) {
        if (filterInventoriesMW[inventario]['id_inv'] == id_inv) {
            let prof_prods = modalProf_prod.querySelectorAll('.cart-item');
            let i = 0;
            prof_prods.forEach(prod => {
                let codigo = prod.children[2].innerText;
                if (codigo == filterInventoriesMW[inventario]['codigo_prod']) {
                    i++;
                }
            })
            if (i == 0) {
                cartProduct_pfpd(filterInventoriesMW[inventario]);
            } else {
                alert("El producto ya se encuentra en la lista");
            }
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
//------------------------------------------------TABLA MODAL PRODUCTS--------------------------------------------------
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
    paginacionProductMW(Object.values(filterProductsMW).length, 1);
});
//-------Marca y categoria
const selectMarcaProdMW = document.getElementById('selectMarcaProdMW');
selectMarcaProdMW.addEventListener('change', selectCategoriaProductMW);
const selectCategoriaProdMW = document.getElementById('selectCategoriaProdMW');
selectCategoriaProdMW.addEventListener('change', searchProductsMW);
//------buscar por:
function searchProductsMW() {
    filterProductsMW = {};
    for (let product in products) {
        for (let valor in products[product]) {
            if (selectSearchProdMW.value == 'todas') {
                if (valor == 'codigo_prod' || valor == 'nombre_prod' || valor == 'descripcion_prod') {
                    if (products[product][valor].toLowerCase().indexOf(inputSearchProdMW.value.toLowerCase()) >= 0) {
                        filterProductsMW[product] = products[product];
                        break;
                    }
                }
            } else {
                if (valor == selectSearchProdMW.value) {
                    if (products[product][valor].toLowerCase().indexOf(inputSearchProdMW.value.toLowerCase()) >= 0) {
                        filterProductsMW[product] = products[product];
                        break;
                    }
                }
            }
        }
    }
    selectProductsMW();
}
//------buscar por marca y categoria:
function selectProductsMW() {
    if (selectMarcaProdMW.value == 'todasLasMarcas' && selectCategoriaProdMW.value == 'todasLasCategorias') {
        paginacionProductMW(Object.values(filterProductsMW).length, 1);
    } else {
        for (let product in filterProductsMW) {
            for (let valor in filterProductsMW[product]) {
                if (selectMarcaProdMW.value == 'todasLasMarcas') {
                    if (filterProductsMW[product]['id_ctgr'] != selectCategoriaProdMW.value) {
                        delete filterProductsMW[product];
                        break;
                    }
                } else if (selectCategoriaProdMW.value == 'todasLasCategorias') {
                    if (filterProductsMW[product]['id_mrc'] != selectMarcaProdMW.value) {
                        delete filterProductsMW[product];
                        break;
                    }
                } else {
                    if (filterProductsMW[product]['id_ctgr'] != selectCategoriaProdMW.value || filterProductsMW[product]['id_mrc'] != selectMarcaProdMW.value) {
                        delete filterProductsMW[product];
                        break;
                    }
                }
            }
        }
        paginacionProductMW(Object.values(filterProductsMW).length, 1);
    }
}
//------Ordenar tabla descendente ascendente
let orderProducts = document.querySelectorAll('.tbody__head--ProdMW');
orderProducts.forEach(div => {
    div.children[0].addEventListener('click', function () {
        let array = Object.entries(filterProductsMW).sort((a, b) => {
            let first = a[1][div.children[0].name].toLowerCase();
            let second = b[1][div.children[0].name].toLowerCase();
            if (first < second) { return -1 }
            if (first > second) { return 1 }
            return 0;
        })
        filterProductsMW = Object.fromEntries(array);
        paginacionProductMW(Object.values(filterProductsMW).length, 1);
    });
    div.children[1].addEventListener('click', function () {
        let array = Object.entries(filterProductsMW).sort((a, b) => {
            let first = a[1][div.children[0].name].toLowerCase();
            let second = b[1][div.children[0].name].toLowerCase();
            if (first > second) { return -1 }
            if (first < second) { return 1 }
            return 0;
        })
        filterProductsMW = Object.fromEntries(array);
        paginacionProductMW(Object.values(filterProductsMW).length, 1);
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
    inicio = (page - 1) * Number(selectNumberProdMW.value);
    final = inicio + Number(selectNumberProdMW.value);
    i = 1;
    tbody.innerHTML = '';
    for (let product in filterProductsMW) {
        if (i > inicio && i <= final) {
            let tr = document.createElement('tr');
            for (let valor in filterProductsMW[product]) {
                let td = document.createElement('td');
                if (valor == 'id_prod') {
                    td.innerText = filterProductsMW[product][valor];
                    td.setAttribute('hidden', '');
                    tr.appendChild(td);
                    td = document.createElement('td');
                    td.innerText = i;
                    tr.appendChild(td);
                    i++;
                } else if (valor == 'id_mrc') {
                } else if (valor == 'id_ctgr') {
                } else if (valor == 'imagen_prod') {
                    let img = document.createElement('img');
                    img.classList.add('tbody__img');
                    img.setAttribute('src', '../modelos/imagenes/' + filterProductsMW[product][valor]);
                    td.appendChild(img);
                    tr.appendChild(td);
                } else {
                    td.innerText = filterProductsMW[product][valor];
                    tr.appendChild(td);
                }
            }
            let td = document.createElement('td');
            td.innerHTML = `
        <img src='../imagenes/send.svg' onclick='sendProduct(this.parentNode.parentNode)'>`;
            tr.appendChild(td);
            tbody.appendChild(tr);
        } else {
            i++;
        }
    }
}
function sendProduct(tr) {
    let id_prod = tr.children[0].innerText;
    for (let product in filterProductsMW) {
        if (filterProductsMW[product]['id_prod'] == id_prod) {
            let prof_prods = modalProf_prod.querySelectorAll('.cart-item');
            let i = 0;
            prof_prods.forEach(prod => {
                let codigo = prod.children[2].innerText;
                if (codigo == filterProductsMW[product]['codigo_prod']) {
                    i++;
                }
            })
            if (i == 0) {
                cartProduct_pfpd(filterProductsMW[product]);
            } else {
                alert("El producto ya se encuentra en la lista");
            }
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
function createProduct() {
    event.preventDefault();
    if (requestProducts == false) {
        requestProducts = true;
        if (marca_prodR.value == "todasLasMarcas") {
            alert("Debe seleccionar una marca");
        } else if (categoria_prodR.value == "todasLasCategorias") {
            alert("Debe seleccionar una categoria");
        } else {
            productsRMW.classList.remove('modal__show');
            let form = document.getElementById("formProductsR");
            let formData = new FormData(form);
            formData.append('createProduct', '');
            preloader.classList.add('modal__show');
            fetch('../controladores/productos.php', {
                method: "POST",
                body: formData
            }).then(response => response.text()).then(data => {
                preloader.classList.remove('modal__show');
                requestProducts = false;
                if (data == "El codigo ya existe") {
                    alert(data);
                } else {
                    alert("El producto fue creado con éxito");
                    readProducts();
                    cleanUpProductFormR();
                }
            }).catch(err => {
                requestProducts = false;
                alert(err);
            });
        }
    }
}
//------Leer un producto
function readProduct(tr) {
    cleanUpProductFormM();
    let id_prod = tr.children[0].innerText;
    for (let product in filterProducts) {
        if (filterProducts[product]['id_prod'] == id_prod) {
            for (let valor in filterProducts[product]) {
                if (valor == 'imagen_prod') {
                    document.querySelector('.drop__areaM').setAttribute('style', `background-image: url("../modelos/imagenes/${filterProducts[product][valor]}"); background-size: cover;`);
                } else if (valor == 'id_ctgr') {
                } else if (valor == 'id_mrc') {
                } else if (valor == 'marca_prod') {
                    document.getElementsByName(valor + 'M')[0].value = filterProducts[product]['id_mrc'];
                } else if (valor == 'categoria_prod') {
                    selectCategoriaProdM();
                    document.getElementsByName(valor + 'M')[0].value = filterProducts[product]['id_ctgr'];
                } else {
                    document.getElementsByName(valor + 'M')[0].value = filterProducts[product][valor];
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
    if (requestProducts == false) {
        requestProducts = true;
        if (marca_prodM.value == "todasLasMarcas") {
            alert("Debe seleccionar una marca");
        } else if (categoria_prodM.value == "todasLasCategorias") {
            alert("Debe seleccionar una categoria");
        } else {
            productsMMW.classList.remove('modal__show');
            let form = document.getElementById("formProductsM");
            let formData = new FormData(form);
            formData.append('updateProduct', '');
            preloader.classList.add('modal__show');
            fetch('../controladores/productos.php', {
                method: "POST",
                body: formData
            }).then(response => response.text()).then(data => {
                preloader.classList.remove('modal__show');
                requestProducts = false;
                readProducts();
                alert(data);
            }).catch(err => {
                requestProducts = false;
                alert(err);
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
        alert('No es una archivo valido');
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
        alert('No es una archivo valido');
    }
}
/*-----------------------------------------Marca y categoria producto-------------------------------------------------*/
//-------Read all Marcas
let marcas = {};
readAllMarcas();
function readAllMarcas() {
    let formData = new FormData();
    formData.append('readMarcas', '');
    fetch('../controladores/productos.php', {
        method: "POST",
        body: formData
    }).then(response => response.json()).then(data => {
        marcas = JSON.parse(JSON.stringify(data));
        selectMarcaProd();
        selectMarcaProdR();
        //selectMarcaInv();
        selectMarcaProdM()
        selectMarcaProductMW();
        selectMarcaInventoryMW();
    }).catch(err => console.log(err));
}
//-------Read all categorias
let categorias = {};
readAllCategorias();
function readAllCategorias() {
    let formData = new FormData();
    formData.append('readCategorias', '');
    fetch('../controladores/productos.php', {
        method: "POST",
        body: formData
    }).then(response => response.json()).then(data => {
        categorias = JSON.parse(JSON.stringify(data));
    }).catch(err => console.log(err));
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
        for (let clave in categorias) {
            if (categorias[clave]['id_mrc'] == id_mrc) {
                let option = document.createElement('option');
                option.value = categorias[clave]['id_ctgr'];
                option.innerText = categorias[clave]['nombre_ctgr'];
                selectCategoriaProduct.appendChild(option);
            }
        }
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
    for (let clave in marcas) {
        let option = document.createElement('option');
        option.value = marcas[clave]['id_mrc'];
        option.innerText = marcas[clave]['nombre_mrc'];
        selectMarcaInvMW.appendChild(option);
    }
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
        for (let clave in categorias) {
            if (categorias[clave]['id_mrc'] == id_mrc) {
                let option = document.createElement('option');
                option.value = categorias[clave]['id_ctgr'];
                option.innerText = categorias[clave]['nombre_ctgr'];
                selectCategoriaInvMW.appendChild(option);
            }
        }
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
        for (let clave in categorias) {
            if (categorias[clave]['id_mrc'] == id_mrc) {
                let option = document.createElement('option');
                option.value = categorias[clave]['id_ctgr'];
                option.innerText = categorias[clave]['nombre_ctgr'];
                selectCategoriaProdMW.appendChild(option);
            }
        }
    }
    searchProductsMW();
}
/***************************MARCA Y CATEGORIA PARA FORMULARIO DE REGSITRO DE PRODUCTOS***************************/
const marca_prodR = document.getElementById('marca_prodR');
marca_prodR.addEventListener('change', selectCategoriaProdR);
const categoria_prodR = document.getElementById('categoria_prodR');
//-------Select de marcas registrar
function selectMarcaProdR() {
    marca_prodR.innerHTML = '';
    let option = document.createElement('option');
    option.value = 'todasLasMarcas';
    option.innerText = 'Todas las marcas';
    marca_prodR.appendChild(option);
    for (let clave in marcas) {
        let option = document.createElement('option');
        option.value = marcas[clave]['id_mrc'];
        option.innerText = marcas[clave]['nombre_mrc'];
        marca_prodR.appendChild(option);
    }
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
        for (let clave in categorias) {
            if (categorias[clave]['id_mrc'] == id_mrc) {
                let option = document.createElement('option');
                option.value = categorias[clave]['id_ctgr'];
                option.innerText = categorias[clave]['nombre_ctgr'];
                categoria_prodR.appendChild(option);
            }
        }
    }
}
const marca_prodM = document.getElementById('marca_prodM');
marca_prodM.addEventListener('change', selectCategoriaProdM);
const categoria_prodM = document.getElementById('categoria_prodM');
//-------Select de marcas registrar
function selectMarcaProdM() {
    marca_prodM.innerHTML = '';
    let option = document.createElement('option');
    option.value = 'todasLasMarcas';
    option.innerText = 'Todas las marcas';
    marca_prodM.appendChild(option);
    for (let clave in marcas) {
        let option = document.createElement('option');
        option.value = marcas[clave]['id_mrc'];
        option.innerText = marcas[clave]['nombre_mrc'];
        marca_prodM.appendChild(option);
    }
    selectCategoriaProdM();
}
function selectCategoriaProdM() {
    categoria_prodM.innerHTML = '';
    let option = document.createElement('option');
    option.value = 'todasLasCategorias';
    option.innerText = 'Todas las categorias';
    categoria_prodM.appendChild(option);
    if (marca_prodM.value != 'todasLasMarcas') {
        let id_mrc = marca_prodM.value;
        for (let clave in categorias) {
            if (categorias[clave]['id_mrc'] == id_mrc) {
                let option = document.createElement('option');
                option.value = categorias[clave]['id_ctgr'];
                option.innerText = categorias[clave]['nombre_ctgr'];
                categoria_prodM.appendChild(option);
            }
        }
    }
}
//-----------------------------------------PRE LOADER---------------------------------------------
const preloader = document.getElementById('preloader');

