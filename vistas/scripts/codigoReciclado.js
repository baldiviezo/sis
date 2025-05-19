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