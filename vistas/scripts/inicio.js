const usuario = document.querySelector('.start__paragraph');
usuario.innerHTML = localStorage.getItem('nombres_usua') + ' ' + localStorage.getItem('apellidos_usua');


function paginacionProduct(allProducts, page) {
    const numberProducts = Number(selectNumberProduct.value);
    const allPages = Math.ceil(allProducts / numberProducts);
    const ul = document.querySelector('#wrapperProduct ul');
    const lis = ul.querySelectorAll('li');
    const beforePages = page - 1;
    const afterPages = page + 1;
    let liActive;
    for (let i = 0; i < lis.length; i++) {
        lis[i].classList.remove('active');
    }

    if (page > 1) {
        lis[0].classList.add('active');
    }
    let li = '';
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
        console.log(ul)
        lis[lis.length - 1].classList.add('active');
    }

    ul.innerHTML = li;

    const h2 = document.querySelector('#showPageProduct h2');
    h2.textContent = `Pagina ${page}/${allPages}, ${allProducts} Productos`;

    cardProduct(page);
}
function cardProduct(page) {
    const root = document.getElementById('root');
    const inicio = (page - 1) * Number(selectNumberProduct.value);
    const final = inicio + Number(selectNumberProduct.value);
    const fragment = document.createDocumentFragment();

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

        const h3 = document.createElement('h3');
        h3.hidden = true;
        h3.textContent = product.id_prod;

        const p = document.createElement('p');
        p.classList.add('box__code');
        p.textContent = product.codigo_prod;

        const button = document.createElement('button');
        button.onclick = () => addCard(button.parentNode.parentNode);

        bottom.appendChild(h3);
        bottom.appendChild(p);
        bottom.appendChild(button);
        box.appendChild(bottom);

        fragment.appendChild(box);
    }
root.appendChild(fragment);
}