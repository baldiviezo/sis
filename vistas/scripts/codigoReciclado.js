//---------------------------------------------------------CRUD NOTA DE ENTREGA------------------------------------------
//-------Crate Nota de entrega
const productsSold = document.querySelector('#productsSold');
const closeProductsSold = document.querySelector('#closeProductsSold');
function openPreviwProductsSold() {
    const id_prof = Number(document.getElementById('id_prof').value);
    const prof_prodsFiltered = prof_prods.filter(prof_prod => prof_prod['fk_id_prof_pfpd'] === id_prof);
    const inventoriesMap = new Map(inventories.map(inventory => [inventory['fk_id_prod_inv'], inventory]));
    const productsMap = new Map(products.map(product => [product['id_prod'], product]));
    const nuevo_array = prof_prodsFiltered.map(prof_prod => {
        const product = productsMap.get(prof_prod['fk_id_prod_pfpd']);
        const inventory = inventoriesMap.get(product['id_prod']) || { id_inv: 0, cantidad_inv: 0 };
        return {
            id_inv: inventory.id_inv,
            cantidad_inv: inventory.cantidad_inv,
            imagen_prod: product.imagen_prod,
            codigo_prod: product.codigo_prod,
            cantidad_pfpd: prof_prod.cantidad_pfpd,
            cost_uni_pfpd: prof_prod.cost_uni_pfpd
        };
    });
    readProductsSold(nuevo_array);
}
closeProductsSold.addEventListener('click', (e) => {
    productsSold.classList.remove('modal__show');
});
function readProductsSold(products) {
    const item = productsSold.querySelector('#cartsProductsSold');
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
        </div>`;
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
async function createNotaEntrega() {
    const carts = productsSold.querySelectorAll('#cartsProductsSold div.cart-item');
    const arrayObjetos = [];
    let count = true;
    for (const cart of carts) {

        const cantidadInv = Number(cart.children[0].innerText);
        const cantidadPedida = Number(cart.children[3].value);
        if (cantidadInv < cantidadPedida) {
            mostrarAlerta(`No hay la cantidad suficiente en inventario del producto: ${cart.children[2].innerText}`);
            count = false;
            break;
        }
        arrayObjetos.push({
            id_inv: parseInt(cart.children[6].innerText),
            codigo_neiv: cart.children[2].innerText,
            cantidad_neiv: parseInt(cart.children[3].value),
            cost_uni_neiv: parseFloat(cart.children[4].value)
        });
        console.log(arrayObjetos)
    }
    if (count == true) {
        if (confirm('¿Esta usted seguro?')) {
            if (requestProf == false) {
                requestProf = true;
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
                    Promise.all([readProformas(), readProf_prods(), readInventories()]).then(() => {
                        requestProf = false;
                        mostrarAlerta(data);
                        form.reset();
                        preloader.classList.remove('modal__show');
                    })
                }).catch(err => {
                    requestProf = false;
                    mostrarAlerta(err);
                });
            }
        }
    }
}
//-----------------------------------------------MODAL DE NOTA DE ENTREGA--------------------------------------------
const closeNotaEntregaRMW = document.getElementById('closeNotaEntregaRMW');
const notaEntregaRMW = document.getElementById('notaEntregaRMW');
function openNotaEntregaRMW(tr) {
    console.log(tr)
    document.getElementById('fecha_ne').value = `${dateActual[2]}-${dateActual[1]}-${dateActual[0]}`;
    document.getElementById('id_prof').value = tr.getAttribute('id_prof');
    document.getElementById('descuento_prof').value = filterProformas.find(proforma => proforma['id_prof'] == tr.children[0].innerText)['descuento_prof'];
    document.getElementById('numero_prof').value = tr.children[1].innerText;
    notaEntregaRMW.classList.add('modal__show');
}
closeNotaEntregaRMW.addEventListener('click', (e) => {
    notaEntregaRMW.classList.remove('modal__show');
});



/////////////////////////////////////////////////////////////////////////////
        /*
                let td = document.createElement('td');
                if (['Gerente general', 'Administrador', 'Gerente De Inventario'].includes(localStorage.getItem('rol_usua'))) {
                    td.innerHTML = `<img src='../imagenes/send.svg' onclick='sendInventory(${inventory.id_inv})' title='Seleccionar'>`;
                    tr.appendChild(td);
                }*/

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


////////////////////////////////////////////////////////////////////////////////////////////////////
init();
async function init() {
  if (!rqstNotaEntrega) {
    rqstNotaEntrega = true;
    preloader.classList.add('modal__show');
    try {
      await Promise.all([
        readNotasEntrega(),
        readProf_prods(),
        readProformas(),
        readProducts(),
        readInventories(),
        readUsers(),
        readNte_invs()
      ]);
      // Agrega aquí cualquier lógica adicional que desees ejecutar después de la carga de datos
      rqstNotaEntrega = false;
      preloader.classList.remove('modal__show');
    } catch (error) {
      console.log(error);
      mostrarAlerta('Ocurrio un error al cargar la tabla de notas de entrega. Cargue nuevamente la pagina.');
    }
  }
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
                        'descripcion_prod': products[product]['nombre_prod'],
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

