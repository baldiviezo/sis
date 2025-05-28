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
    if (!rqstNotaEntrega) {
        rqstNotaEntrega = true;
        preloader.classList.add('modal__show');
        try {
            await Promise.all([
                readCustomers(),
                readOrderBuys(),
                readOcProd(),                                                                                           
                readUsers(),
                readEnterprises()
            ]);
            paginacionOrdenCompra(proformas.length, 1);
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
            console.log(data);
            orderBuys = data;
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
            console.log(data)
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
                ordenBuy.numero_oc.toLowerCase().includes(busqueda) ||
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
function createYearProforma() {
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
        const estado = selectStateOC.value === 'todasLasOC' ? true : orderBuy.estado_oc === selectStateOC.value;
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
function tableOrdenCompra(page) {
    const tbody = document.getElementById('tbodyOC');
    const inicio = (page - 1) * Number(selectNumberOC.value);
    const final = inicio + Number(selectNumberOC.value);
    const proformas = filterOrderBuys.slice(inicio, final);
    tbody.innerHTML = '';
    proformas.forEach((proforma, index) => {

        const cliente = customers.find(customer => customer.id_clte === proforma.fk_id_clte_oc);
        const usuario = users.find(user => user.id_usua === proforma.fk_id_usua_oc);
        const empresa = enterprises.find(enterprise => enterprise.id_emp === cliente.fk_id_emp_clte);
        const tr = document.createElement('tr');

        tr.setAttribute('id_oc', proforma.id_oc);

        const tdNumero = document.createElement('td');
        tdNumero.innerText = index + 1;
        tr.appendChild(tdNumero);

        const tdNumeroProforma = document.createElement('td');
        tdNumeroProforma.innerText = proforma.numero_oc;
        tr.appendChild(tdNumeroProforma);

        const tdFecha = document.createElement('td');
        tdFecha.innerText = proforma.fecha_oc;
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
        tdTotal.innerText = proforma.total_oc + ' ' + proforma.moneda_oc;
        tr.appendChild(tdTotal);

        const tdAcciones = document.createElement('td');
        const fragment = document.createDocumentFragment();

        let imgs = [];

        if (proforma.estado_oc == 'vendido') {
            imgs = [
                { src: '../imagenes/pdf.svg', onclick: `selectPDFInformation(${proforma.id_oc}, "prof")`, title: 'Mostrar PDF' }
            ];
        } else if (proforma.estado_oc == 'pendiente') {
            if (['Administrador', 'Gerente general'].includes(localStorage.getItem('rol_usua'))) {
                imgs = [
                    //{ src: '../imagenes/notaEntrega.svg', onclick: 'openNotaEntregaRMW(this.parentNode.parentNode)', title: 'Generar Nota de Entrega' },
                    { src: '../imagenes/pdf.svg', onclick: `selectPDFInformation(${proforma.id_oc}, "prof")`, title: 'Mostrar PDF' },
                    { src: '../imagenes/edit.svg', onclick: `readProforma(${proforma.id_oc})`, title: 'Editar Proforma' },
                    { src: '../imagenes/trash.svg', onclick: `deleteProforma(${proforma.id_oc})`, title: 'Eliminar Proforma' }
                ];
            } else if (['Ingeniero', 'Gerente De Inventario'].includes(localStorage.getItem('rol_usua'))) {
                imgs = [
                    //{ src: '../imagenes/notaEntrega.svg', onclick: 'openNotaEntregaRMW(this.parentNode.parentNode)', title: 'Generar Nota de Entrega' },
                    { src: '../imagenes/pdf.svg', onclick: `selectPDFInformation(${proforma.id_oc}, "prof")`, title: 'Mostrar PDF' },
                    { src: '../imagenes/edit.svg', onclick: `readProforma(${proforma.id_oc})`, title: 'Editar Proforma' }
                ];
            }
        } else if (proforma.estado_oc == 'devolucion') {
            imgs = [
                { src: '../imagenes/pdf.svg', onclick: `selectPDFInformation(${proforma.id_oc}, "prof")`, title: 'Mostrar PDF' }
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
            data = data.filter(proforma => proforma.estado_oc !== 'pendiente');
            const isAdmin = ['Gerente general', 'Administrador'].includes(localStorage.getItem('rol_usua'));
            proformas = isAdmin ? data : data.filter(proforma => proforma.fk_id_usua_oc === localStorage.getItem('id_usua'));
            
            filterProformas = proformas;
            resolve();
            createYearProforma();
        }).catch(err => console.log(err));
    })
}

//----------------------------------------------TABLA DE NOTA DE ENTREGA------------------------------------------------
const tableNEMW = document.getElementById('tableNEMW');
//------------------------------------------OPEN AND CLOSE TABLA NOTA DE ENTREGA-----------------------------------
const openTableNEMW = document.getElementById('openTableNEMW');
const closeTableNEMW = document.getElementById('closeTableNEMW');
openTableNEMW.addEventListener('click', () => {
    tableNEMW.classList.add('modal__show');
});
closeTableNEMW.addEventListener('click', () => {
    tableNEMW.classList.remove('modal__show');
})
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