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
let rqstNotaEntrega = false;
const preloader = document.getElementById('preloader');
init();
async function init() {
    if (rqstNotaEntrega == false) {
        rqstNotaEntrega = true;
        preloader.classList.add('modal__show');
        Promise.all([readNotasEntrega(), readProf_prods(), readProformas(), readProducts(), readInventories(), readUsers()], readNte_invs()).then(() => {
            rqstNotaEntrega = false;
            preloader.classList.remove('modal__show');
        });
    }
}
//-------------------------------------------------------TABLA NOTA DE ENTREGA-----------------------------------------------------
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
            if (localStorage.getItem('rol_usua') == 'Gerente general' || localStorage.getItem('rol_usua') == 'Administrador') {
                notasEntrega = Object.values(data);
                filterNotasEntrega = notasEntrega;
            } else if (localStorage.getItem('rol_usua') == 'Ingeniero' || localStorage.getItem('rol_usua') == 'Gerente De Inventario') {
                notasEntrega = Object.values(data).filter(notaEntrega => notaEntrega.fk_id_usua_prof === localStorage.getItem('id_usua'));
                filterNotasEntrega = notasEntrega;
            }
            paginacionNotaEntrega(notasEntrega.length, 1);
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
            return (
                notaEntrega.numero_prof.toLowerCase().includes(busqueda) ||
                notaEntrega.fecha_prof.toLowerCase().includes(busqueda) ||
                notaEntrega.fecha_ne.toLowerCase().includes(busqueda) ||
                notaEntrega.nombre_emp.toLowerCase().includes(busqueda) ||
                (notaEntrega.nombre_usua + ' ' + notaEntrega.apellido_usua).toLowerCase().includes(busqueda) ||
                (notaEntrega.nombre_clte + ' ' + notaEntrega.apellido_clte).toLowerCase().includes(busqueda) ||
                notaEntrega.orden_ne.toLowerCase().includes(busqueda) ||
                notaEntrega.observacion_ne.toLowerCase().includes(busqueda)
            );
        } else if (valor == 'encargado') {
            return (notaEntrega.nombre_usua + ' ' + notaEntrega.apellido_usua).toLowerCase().includes(busqueda);
        } else if (valor == 'cliente') {
            return (notaEntrega.nombre_clte + ' ' + notaEntrega.apellido_clte).toLowerCase().includes(busqueda);
        } else {
            return notaEntrega[valor].toLowerCase().includes(busqueda);
        }
    });
    selectStateNotasEntrega();
}
function createYearNE() {
    const anios = Array.from(new Set(notasEntrega.map(ne => ne.fecha_ne.split('-')[0])));

    // Crear opciones para selectYearProf
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
}
//-------Estado de proforma
const selectYearNE = document.getElementById('selectYearNE');
selectYearNE.addEventListener('change', searchNotasEntrega);
const selectMonthNE = document.getElementById('selectMonthNE');
selectMonthNE.addEventListener('change', searchNotasEntrega);
//------buscar por marca y categoria:
function selectStateNotasEntrega() {
    filterNotasEntrega = filterNotasEntrega.filter(proforma => {
        const estado = selectStateNe.value === 'notasEntrega' ? true : proforma.estado_ne === selectStateNe.value;
        const fecha = selectYearNE.value === 'todas' ? true : proforma.fecha_ne.split('-')[0] === selectYearNE.value;
        const mes = selectMonthNE.value === 'todas' ? true : proforma.fecha_ne.split('-')[1] === selectMonthNE.value;
        return estado && fecha && mes;
    });
    paginacionNotaEntrega(filterNotasEntrega.length, 1);
}
//------Ordenar tabla descendente ascendente
let orderNotaEntrega = document.querySelectorAll('.tbody__head--ne');
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
//--------Tabla de proforma
function tableNotaEntrega(page) {
    const totalNE = document.getElementById('totalNE');
    const total = filterNotasEntrega.reduce((acc, current) => acc + current.total_prof, 0);
    totalNE.innerText = `Total: ${total.toFixed(2)} Bs`;

    const tbody = document.getElementById('tbodyNE');
    const inicio = (page - 1) * Number(selectNumberNe.value);
    const final = inicio + Number(selectNumberNe.value);
    const notasEntrega = Object.values(filterNotasEntrega).slice(inicio, final);
    tbody.innerHTML = '';

    notasEntrega.forEach((notaEntrega, index) => {
        const tr = document.createElement('tr');

        const tdIdNE = document.createElement('td');
        tdIdNE.innerText = notaEntrega.id_ne;
        tdIdNE.setAttribute('hidden', '');
        tr.appendChild(tdIdNE);

        const tdIdProf = document.createElement('td');
        tdIdProf.innerText = notaEntrega.id_prof;
        tdIdProf.setAttribute('hidden', '');
        tr.appendChild(tdIdProf);

        const tdNumero = document.createElement('td');
        tdNumero.innerText = index + 1;
        tr.appendChild(tdNumero);

        const tdNumeroProforma = document.createElement('td');
        tdNumeroProforma.innerText = notaEntrega.numero_prof;
        tr.appendChild(tdNumeroProforma);

        const tdFechaProf = document.createElement('td');
        tdFechaProf.innerText = notaEntrega.fecha_prof;
        tr.appendChild(tdFechaProf);

        const tdFechaNE = document.createElement('td');
        tdFechaNE.innerText = notaEntrega.fecha_ne;
        tr.appendChild(tdFechaNE);

        const tdEncargado = document.createElement('td');
        tdEncargado.innerText = notaEntrega.nombre_usua + ' ' + notaEntrega.apellido_usua;
        tr.appendChild(tdEncargado);

        const tdEmpresa = document.createElement('td');
        tdEmpresa.innerText = notaEntrega.nombre_emp;
        tr.appendChild(tdEmpresa);

        const tdCliente = document.createElement('td');
        tdCliente.innerText = notaEntrega.nombre_clte + ' ' + notaEntrega.apellido_clte;
        tr.appendChild(tdCliente);

        const tdOrden = document.createElement('td');
        tdOrden.innerText = notaEntrega.orden_ne;
        tr.appendChild(tdOrden);

        const tdTotal = document.createElement('td');
        tdTotal.innerText = notaEntrega.total_prof.toFixed(2);
        tr.appendChild(tdTotal);

        const tdObservacion = document.createElement('td');
        tdObservacion.innerText = notaEntrega.observacion_ne;
        tr.appendChild(tdObservacion);

        const tdAcciones = document.createElement('td');
        const fragment = document.createDocumentFragment();

        let imgs = [];

        if (notaEntrega.estado_ne == 'vendido') {
            imgs = [
                { src: '../imagenes/pdf.svg', onclick: 'pdfNotaEntrega(this.parentNode.parentNode)', title: 'Descargar nota de entrega' },
                { src: '../imagenes/return.svg', onclick: 'openReturnMW(this.parentNode.parentNode)', title: 'Devolución de la nota de entrega' }

            ];
        } else if (notaEntrega.estado_ne == 'pendiente') {
            if (localStorage.getItem('rol_usua') == 'Administrador' || localStorage.getItem('rol_usua') == 'Gerente general') {
                imgs = [
                    { src: '../imagenes/receipt.svg', onclick: 'readSale(this.parentNode.parentNode)', title: 'Facturar' },
                    { src: '../imagenes/pdf.svg', onclick: 'pdfNotaEntrega(this.parentNode.parentNode)', title: 'Descargar nota de entrega' },
                    { src: '../imagenes/return.svg', onclick: 'openReturnMW(this.parentNode.parentNode)', title: 'Devolución de la nota de entrega' }
                ];
            } else if (localStorage.getItem('rol_usua') == 'Ingeniero' || localStorage.getItem('rol_usua') == 'Gerente De Inventario') {
                imgs = [
                    { src: '../imagenes/pdf.svg', onclick: 'pdfNotaEntrega(this.parentNode.parentNode)', title: 'Descargar nota de entrega' },
                    { src: '../imagenes/return.svg', onclick: 'openReturnMW(this.parentNode.parentNode)', title: 'Devolución de la nota de entrega' }
                ];
            }
        } else if (notaEntrega.estado_ne == 'DEVOLUCION') {
            imgs = [
                { src: '../imagenes/annulled.svg', title: 'Nota de entrega anulada' },
                { src: '../imagenes/pdf.svg', onclick: 'pdfNotaEntrega(this.parentNode.parentNode)', title: 'Descargar nota de entrega' }
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
    });
}
//-------------------------------------------------------PDF NOTA DE ENTREGA------------------------------------------------->>
function pdfNotaEntrega(tr) {
    let id_ne = tr.children[0].innerText;
    let id_prof = tr.children[1].innerText;
    let pdf = 'ne';
    let prof_mprof_ne = {};
    let pf_pd = [];
    for (let proforma in proformas) {
        if (proformas[proforma]['id_prof'] == id_prof) {
            prof_mprof_ne = proformas[proforma];
            break;
        }
    }
    for (let notaEntrega in notasEntrega) {
        if (notasEntrega[notaEntrega]['id_ne'] == id_ne) {
            prof_mprof_ne['orden_ne'] = notasEntrega[notaEntrega]['orden_ne'];
            prof_mprof_ne['observacion_ne'] = notasEntrega[notaEntrega]['observacion_ne'];
            break;
        }
    }
    for (let prof_prod in prof_prods) {
        if (prof_prods[prof_prod]['fk_id_prof_pfpd'] == id_prof) {
            for (let product in products) {
                if (products[product]['id_prod'] == prof_prods[prof_prod]['fk_id_prod_pfpd']) {
                    let cart = {
                        'codigo_prod': products[product]['codigo_prod'],
                        'descripcion_prod': products[product]['descripcion_prod'],
                        'cantidad_pfpd': prof_prods[prof_prod]['cantidad_pfpd'],
                        'cost_uni_pfpd': prof_prods[prof_prod]['cost_uni_pfpd'],
                        'imagen_prod': products[product]['imagen_prod']
                    };
                    pf_pd.push(cart);
                }
            }
        }
    }

    var form = document.createElement('form');
    form.method = 'post';
    form.action = '../modelos/reportes/notaDeEntrega.php';
    form.target = '_blank'; // Abre la página en una nueva ventana
    form.style.display = 'none'; // Oculta visualmente el formulario
    // Crea un campo oculto para la variable prof__ne
    var input1 = document.createElement('input');
    input1.type = 'hidden';
    input1.name = 'prof_mprof_ne';
    input1.value = JSON.stringify(prof_mprof_ne);

    // Crea un campo oculto para la variable pf_pd
    var input2 = document.createElement('input');
    input2.type = 'hidden';
    input2.name = 'pf_pd';
    input2.value = JSON.stringify(pf_pd);

    // Crea un campo oculto para la variable pdf
    var input3 = document.createElement('input');
    input3.type = 'hidden';
    input3.name = 'pdf';
    input3.value = pdf;

    // Agrega los campos al formulario
    form.appendChild(input1);
    form.appendChild(input2);
    form.appendChild(input3);
    // Agrega el formulario al cuerpo del documento HTML
    document.body.appendChild(form);
    // Submitir el formulario
    form.submit();

}
//-------------------------------------------PROF_PROD
let prof_prods = [];
async function readProf_prods() {
    return new Promise((resolve, reject) => {
        let formData = new FormData();
        formData.append('readProf_prods', '');
        fetch('../controladores/proforma.php', {
            method: "POST",
            body: formData
        }).then(response => response.json()).then(data => {
            prof_prods = Object.values(data);
            resolve();
        }).catch(err => console.log(err));
    })
}
//-------------------------------------------------------PROFORMA----------------------------------------------------
let proformas = [];  //base de datos de proformas
async function readProformas() {
    return new Promise((resolve, reject) => {
        let formData = new FormData();
        formData.append('readProformas', '');
        fetch('../controladores/proforma.php', {
            method: "POST",
            body: formData
        }).then(response => response.json()).then(data => {
            proformas = Object.values(data);
            resolve();
        }).catch(err => console.log(err));
    });
}
//------------------------------------------------------PRODUCTOS---------------------------------------------------
let products = {};
async function readProducts() {
    return new Promise((resolve, reject) => {
        let formData = new FormData();
        formData.append('readProducts', '');
        fetch('../controladores/productos.php', {
            method: "POST",
            body: formData
        }).then(response => response.json()).then(data => {
            products = JSON.parse(JSON.stringify(data));
            resolve();
        }).catch(err => console.log(err));
    });
}
//------------------------------------------------------CRUD SALES--------------------------------------------------------
//-----Read a sale
function readSale(tr) {
    let id_ne = tr.children[0].innerText;
    id_prof = tr.children[1].innerText;
    saleRMW.classList.add('modal__show');
    //-----leer proforma
    document.getElementsByName('fecha_vnt')[0].value = `${dateActual[2]}-${dateActual[1]}-${dateActual[0]}`;
    document.getElementsByName('id_ne')[0].value = id_ne;
    document.getElementsByName('id_prof')[0].value = id_prof;
    let id_usua = proformas.find(proforma => proforma.id_prof == id_prof).fk_id_usua_prof;
    document.getElementById('fk_id_usua_vnt').value = id_usua;
}
function openPreviwProductsSold() {
    const id_prof = document.getElementsByName('id_prof')[0].value;
    vnt_prodRMW.classList.add('modal__show');
    const productos = prof_prods.filter(product => product.fk_id_prof_pfpd === id_prof);
    const inventarios = inventories.filter(inventory => productos.some(product => product.fk_id_prod_pfpd === inventory.fk_id_prod_inv));
    const productosConInventario = productos.map(product => ({ ...product, ...inventarios.find(inventory => inventory.fk_id_prod_inv === product.fk_id_prod_pfpd) }));
    cartProd(productosConInventario);
  }
const productsSold = document.querySelector('#vnt_prodRMW');
function cartProd(products) {
    let id_prof = document.getElementsByName('id_prof')[0].value;
    let subTotal = document.getElementById('subTotal');
    let desc = document.getElementById('desc');
    let total = document.getElementById('total');
    let item = productsSold.querySelector('.modal__body');
    item.innerHTML = '';
    let costTotal = 0;
    products.forEach(product => {
        let cart = document.createElement('div');
        cart.classList.add('cart-item');
        let html =
            `<p class="cart-item__cantInv">${product['cantidad_inv']}</p>
        <div class="row-img">
            <img src="../modelos/imagenes/`+ product['imagen_prod'] + `" class="rowimg">
        </div>
        <p class="cart-item__codigo">`+ product['codigo_prod'] + `</p>
        <input type="number" value = "${product['cantidad_pfpd']}" min="1" onChange="changeQuantity_pfpd(this.parentNode)" class="cart-item__cantidad">
        <input type="number" value = "${parseFloat(product['cost_uni_pfpd']).toFixed(2)}" onChange="changeQuantity_pfpd(this.parentNode)" class="cart-item__costUnit">
        <input type="number" value = "`+ product['cantidad_pfpd'] * parseFloat(product['cost_uni_pfpd']).toFixed(2) + `" class="cart-item__costTotal" readonly>
        <p hidden>${product['id_inv']}</p>`;
        cart.innerHTML = html;
        item.appendChild(cart);
        costTotal += parseFloat(product['cost_uni_pfpd']).toFixed(2) * product['cantidad_pfpd'];
    });
    for (let proforma in proformas) {
        if (proformas[proforma]['id_prof'] == id_prof) {
            document.getElementsByName('descuento_prof')[0].value = proformas[proforma]['descuento_prof'];
            break;
        }
    }
    subTotal.innerText = `Sub-Total: ${costTotal.toFixed(2)} Bs`;
    desc.innerHTML = `Desc. ${document.getElementsByName('descuento_prof')[0].value}%: ${(costTotal * document.getElementsByName('descuento_prof')[0].value / 100).toFixed(2)} Bs`;
    total.innerText = `Total: ${(costTotal - (costTotal * document.getElementsByName('descuento_prof')[0].value / 100)).toFixed(2)} Bs`;
    document.getElementsByName('total_vnt')[0].value = (costTotal - (costTotal * document.getElementsByName('descuento_prof')[0].value / 100)).toFixed(2);
    document.getElementById('quantity').innerHTML = products.length;
}
//create a sale
function createSale() {
    let id_prof = document.getElementsByName('id_prof')[0].value;
    const prodCart = prof_prods.filter(product => product.fk_id_prof_pfpd === id_prof);
    if (confirm('¿Esta usted seguro?')) {
        if (rqstNotaEntrega == false) {
            rqstNotaEntrega = true;
            const formsaleR = document.getElementById('formsaleR');
            let formData = new FormData(formsaleR);
            formData.append('createSale', '');
            formData.append('prodCart', JSON.stringify(prodCart));
            preloader.classList.add('modal__show');
            fetch('../controladores/ventas.php', {
                method: "POST",
                body: formData
            }).then(response => response.text()).then(data => {
                if (data == 'La factura ya existe') {
                    rqstNotaEntrega = false;
                    preloader.classList.remove('modal__show');
                    vnt_prodRMW.classList.remove('modal__show');
                    mostrarAlerta(data);
                } else {
                    readNotasEntrega().then(() => {
                        formsaleR.reset();
                        tiempo_credito_vnt.setAttribute('hidden', '');
                        fecha_factura_vnt.removeAttribute('hidden');
                        factura_vnt.removeAttribute('hidden');
                        vnt_prodRMW.classList.remove('modal__show');
                        saleRMW.classList.remove('modal__show');
                        rqstNotaEntrega = false;
                        preloader.classList.remove('modal__show');
                        mostrarAlerta(data);
                    });
                }
            }).catch(err => {
                rqstNotaEntrega = false;
                mostrarAlerta(err);
            });
        }
    }
}
//-----------------------------------MODAL CREATE SALE-------------------------------------------------//
const saleRMW = document.getElementById('saleRMW');
const closeSaleRMW = document.getElementById('closeSaleRMW');
closeSaleRMW.addEventListener('click', () => {
    saleRMW.classList.remove('modal__show');
});
//-------------------------------------MODAL PREVIEW PRODUCTS SOLD----------------------------------------------->>
const closeVnt_prodRMW = document.getElementById('closeVnt_prodRMW');
const vnt_prodRMW = document.getElementById('vnt_prodRMW');
closeVnt_prodRMW.addEventListener('click', (e) => {
    vnt_prodRMW.classList.remove('modal__show');
});
//-------------------------------------------------------INVENTARIO---------------------------------------------------
let inventories = [];
function readInventories() {
    return new Promise((resolve, reject) => {
        let formData = new FormData();
        formData.append('readInventories', '');
        fetch('../controladores/inventario.php', {
            method: "POST",
            body: formData
        }).then(response => response.json()).then(data => {
            inventories = data;
            resolve();
        }).catch(err => console.log(err));
    })
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
//-------------------------------------------------------DEVOLUCION---------------------------------------------------
const returnMW = document.getElementById('returnMW');
const closeReturnMW = document.getElementById('closeReturnMW');
closeReturnMW.addEventListener('click', (e) => {
    returnMW.classList.remove('modal__show');
});
function openReturnMW(row) {
    returnMW.classList.add('modal__show');
    document.getElementsByName('fk_id_ne_dvl')[0].value = row.children[0].innerText;
}
const formReturn = document.getElementById('formReturn');
formReturn.addEventListener('submit', (e) => {
    deleteNotaEntrega();
});
//----------------------------------------------------------- CRUD NOTA ENTREGA----------------------------------------------
//------Delete a nota de entrega
function deleteNotaEntrega() {
    event.preventDefault();
    if (confirm('¿Esta usted seguro?')) {
        if (rqstNotaEntrega == false) {
            rqstNotaEntrega = true;
            preloader.classList.add('modal__show');
            let formData = new FormData(formReturn);
            formData.append('deleteNotaEntrega', '');
            fetch('../controladores/notaEntrega.php', {
                method: "POST",
                body: formData
            }).then(response => response.text()).then(data => {
                rqstNotaEntrega = false;
                preloader.classList.remove('modal__show');
                returnMW.classList.remove('modal__show');
                readNotasEntrega();
                mostrarAlerta(data);
            }).catch(err => {
                rqstNotaEntrega = false;
                mostrarAlerta(err);
            });
        }
    }
}
//-------------------------------------------------------CHANGE QUANTITY-------------------------------------------------
const tipo_pago_vnt = document.getElementById('tipo_pago_vnt');
tipo_pago_vnt.addEventListener('change', () => {
    if (tipo_pago_vnt.value == 'CR') {
        document.getElementById('tiempo_credito_vnt').removeAttribute('hidden');
    } else {
        document.getElementById('tiempo_credito_vnt').setAttribute('hidden', '');
    }
});
const estado_factura_vnt = document.getElementById('estado_factura_vnt');
estado_factura_vnt.addEventListener('change', () => {
    if (estado_factura_vnt.value == '1') {
        document.getElementById('fecha_factura_vnt').removeAttribute('hidden');
        document.getElementById('factura_vnt').removeAttribute('hidden');
    } else {
        document.getElementById('fecha_factura_vnt').setAttribute('hidden', '');
        document.getElementById('factura_vnt').setAttribute('hidden', '');
    }
});
//usarios
let usuarios = [];
async function readUsers() {
    return new Promise((resolve) => {
        let formData = new FormData();
        formData.append('readUsers', '');
        fetch('../controladores/usuarios.php', {
            method: "POST",
            body: formData
        }).then(response => response.json()).then(data => {
            usuarios = Object.values(data);
            selectUser();
            resolve();
        }).catch(err => {
            mostrarAlerta('Ocurrio un error al cargar la tabla de usuarios, cargue nuevamente la pagina');
        });
    });
}
const fk_id_usua_vnt = document.getElementById('fk_id_usua_vnt');
function selectUser() {
    //En fk_id_usua_vnt que es un select se le agrega los usuarios
    fk_id_usua_vnt.innerHTML = '';
    for (let clave in usuarios) {
        let option = document.createElement('option');
        option.value = usuarios[clave]['id_usua'];
        option.innerText = usuarios[clave]['nombre_usua'] + ' ' + usuarios[clave]['apellido_usua'];
        fk_id_usua_vnt.appendChild(option);
    }
}

//----------------------------------------------------NTE-INV----------------------------------------------//
//---------------------------------------------------CRUD NTE_INV------------------------------------------------
let nte_invs = [];
let filterNte_invs = [];
async function readNte_invs() {
    return new Promise((resolve, reject) => {
        let formData = new FormData();
        formData.append('readNte_invs', '');
        fetch('../controladores/notaEntrega.php', {
            method: "POST",
            body: formData
        }).then(response => response.json()).then(data => {
            nte_invs = data;
            filterNte_invs = nte_invs;
            paginacionNteInv(filterNte_invs.length, 1);
            resolve();
        }).catch(err => console.log(err));
    })
}
//------------------------------------------------------TABLE NTE INV FILTER-----------------------------------------------------
//------Select utilizado para buscar por columnas
const selectSearchNteInv = document.getElementById('selectSearchNteInv');
selectSearchNteInv.addEventListener('change', searchNteInv);
//------buscar por input
const inputSearchNteInv = document.getElementById("inputSearchNteInv");
inputSearchNteInv.addEventListener("keyup", searchNteInv);
//------NTE INV por pagina
const selectNumberNteInv = document.getElementById('selectNumberNteInv');
selectNumberNteInv.selectedIndex = 3;
selectNumberNteInv.addEventListener('change', function () {
    paginacionNteInv(filterNte_invs.length, 1);
});
//------buscar por:
function searchNteInv() {
    const busqueda = inputSearchNteInv.value.toLowerCase().trim();
    const valor = selectSearchNteInv.value.toLowerCase().trim();
    filterNte_invs = nte_invs.filter(cmp_inv => {
        if (valor == 'todas') {
            return (
                cmp_inv.id_neiv.toLowerCase().includes(busqueda) ||
                cmp_inv.codigo_neiv.toLowerCase().includes(busqueda) ||
                cmp_inv.cantidad_neiv.toLowerCase().includes(busqueda)
            )
        } else {
            return cmp_inv[valor].toLowerCase().includes(busqueda);
        }
    });
    selectStateNteInvOC();
}
//------Seleccionar el año
const selectYearNteInv = document.getElementById('selectYearNteInv');
selectYearNteInv.addEventListener('change', searchNteInv);
//-------Estado de nte_invs
const selectStateNteInv = document.getElementById('selectStateNteInv');
selectStateNteInv.addEventListener('change', searchNteInv);
const selectMonthNteInv = document.getElementById('selectMonthNteInv');
selectMonthNteInv.addEventListener('change', searchNteInv);
function selectStateNteInvOC() {
    filterNte_invs = filterNte_invs.filter(nteInv => {
        const estado = selectStateNteInv.value === 'todasLasNte' ? true : nteInv.estado_neiv === selectStateNteInv.value;
        const fecha = selectYearNteInv.value === 'todas' ? true : nteInv.fecha_neiv.split('-')[0] === selectYearNteInv.value;
        const mes = selectMonthNteInv.value === 'todas' ? true : nteInv.fecha_neiv.split('-')[1] === selectMonthNteInv.value;
        return estado && fecha && mes;
    });
    paginacionNteInv(filterNte_invs.length, 1);
}
//------Ordenar tabla descendente ascendente
let orderNteInv = document.querySelectorAll('.tbody__head--NteInv');
orderNteInv.forEach(div => {
    div.children[0].addEventListener('click', function () {
        filterNte_invs.sort((a, b) => {
            let first = a[div.children[0].name];
            let second = b[div.children[0].name];
            if (typeof first === 'number' && typeof second === 'number') {
                return first - second;
            } else {
                return String(first).localeCompare(String(second));
            }
        });
        paginacionNteInv(filterNte_invs.length, 1);
    });
    div.children[1].addEventListener('click', function () {
        filterNte_invs.sort((a, b) => {
            let first = a[div.children[0].name];
            let second = b[div.children[0].name];
            if (typeof first === 'number' && typeof second === 'number') {
                return second - first;
            } else {
                return String(second).localeCompare(String(first));
            }
        });
        paginacionNteInv(filterNte_invs.length, 1);
    });
});
//------paginacionNteInv
function paginacionNteInv(allProducts, page) {
    let totalNteInv = document.getElementById('totalNteInv');
    let total = 0;
    /*for (let nte_inv in filterNte_invs) {
        const notaEntrega = filterNotasEntrega.find(notaEntrega => notaEntrega.id_ne == filterNte_invs[nte_inv].fk_id_ne_neiv);
        total += filterNte_invs[nte_inv]['cantidad_neiv'] * filterNte_invs[nte_inv]['cost_uni_neiv'] * (100 - notaEntrega.descuento_ne) / 100;
    }*/
    //totalNteInv.innerHTML ='Total (Bs):' + total.toFixed(2) + ' Bs';
    let numberProducts = Number(selectNumberNteInv.value);
    let allPages = Math.ceil(allProducts / numberProducts);
    let ul = document.querySelector('#wrapperNteInv ul');
    let li = '';
    let beforePages = page - 1;
    let afterPages = page + 1;
    let liActive;
    if (page > 1) {
        li += `<li class="btn" onclick="paginacionNteInv(${allProducts}, ${page - 1})"><img src="../imagenes/arowLeft.svg"></li>`;
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
        li += `<li class="numb ${liActive}" onclick="paginacionNteInv(${allProducts}, ${pageLength})"><span>${pageLength}</span></li>`;
    }
    if (page < allPages) {
        li += `<li class="btn" onclick="paginacionNteInv(${allProducts}, ${page + 1})"><img src="../imagenes/arowRight.svg"></li>`;
    }
    ul.innerHTML = li;
    let h2 = document.querySelector('#showPageNteInv h2');
    h2.innerHTML = `Pagina ${page}/${allPages}, ${allProducts} Productos`;
    tableNteInvMW(page);
}
//--------Tabla de nte_invs
function tableNteInvMW(page) {
    const tbody = document.getElementById('tbodyNteInv');
    const inicio = (page - 1) * Number(selectNumberNteInv.value);
    const final = inicio + Number(selectNumberNteInv.value);
    const nte_invs = filterNte_invs.slice(inicio, final);
    tbody.innerHTML = '';
    nte_invs.forEach((nte_inv, index) => {
        const notaEntrega = filterNotasEntrega.find(notaEntrega => notaEntrega.id_ne == nte_inv.fk_id_ne_neiv);
        const stock = inventories.find(inventory => inventory.id_inv == nte_inv.fk_id_prod_neiv);
        console.log(inventories)
        const producto = products.find(product => product.id_prod == stock.fk_id_prod_inv);

        const tr = document.createElement('tr');
        tr.setAttribute('id_neiv', nte_inv.id_neiv);

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
        tdCantidad.innerText = nte_inv.cantidad_neiv;
        tr.appendChild(tdCantidad);

        const tdCostoUnitario = document.createElement('td');
        tdCostoUnitario.innerText = nte_inv.cost_uni_neiv.toFixed(2) + ' Bs';
        tr.appendChild(tdCostoUnitario);

        const tdSubTotal = document.createElement('td');
        const subTotal = nte_inv.cost_uni_neiv * nte_inv.cantidad_neiv;
        tdSubTotal.innerText = subTotal.toFixed(2) + ' Bs';
        tr.appendChild(tdSubTotal);
/*
        const tdDescuento = document.createElement('td');
        const desc = notaEntrega.descuento_ne * nte_inv.cost_uni_neiv * nte_inv.cantidad_neiv / 100;
        tdDescuento.innerText = desc.toFixed(2) + ' Bs' + ' (' + notaEntrega.descuento_ne + '%)';
        tr.appendChild(tdDescuento);

        const tdTotal = document.createElement('td');
        const total = nte_inv.cantidad_neiv * nte_inv.cost_uni_neiv * (100 - notaEntrega.descuento_ne) / 100;
        tdTotal.innerText = total.toFixed(2) + ' Bs';
        tr.appendChild(tdTotal);*/

        tbody.appendChild(tr);
    });
}

//------open and close modal nte_inv
const tableNteInv = document.querySelector('#tableNteInv');
const openTableNteInv = document.querySelector('#openTableNteInv');
const closeTableNteInv = document.querySelector('#closeTableNteInv');
openTableNteInv.addEventListener('click', () => {
    tableNteInv.classList.add('modal__show');
});
closeTableNteInv.addEventListener('click', () => {
    tableNteInv.classList.remove('modal__show');
})
