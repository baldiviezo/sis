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
                readProformas(),
                readCustomers(),
                readUsers(),
                readEnterprises()
            ]);
            paginacionProforma(proformas.length, 1);
            rqstNotaEntrega = false;
            preloader.classList.remove('modal__show');
        } catch (error) {
            console.log(error);
            mostrarAlerta('Ocurrio un error al cargar la tabla de notas de entrega. Cargue nuevamente la pagina.');
        }
    }
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
            data = data.filter(proforma => proforma.estado_prof !== 'pendiente');
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
const orderProforma = document.querySelectorAll('.tbody__head--proforma');
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
            resolve();
        }).catch(err => console.log(err));
    })
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