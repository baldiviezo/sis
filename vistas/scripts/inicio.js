const usuario = document.querySelector('.start__paragraph');
usuario.innerHTML = localStorage.getItem('nombres_usua') + ' ' + localStorage.getItem('apellidos_usua');

const selectYearDashboard = document.getElementById('selectYearDashboard');
const selectMonthDashboard = document.getElementById('selectMonthDashboard');
const totalAmount = document.getElementById('totalAmount');
const totalCount = document.getElementById('totalCount');
const topClientsBody = document.getElementById('topClientsBody');

function createYearDashboard() {
    const year = new Date().getFullYear();
    selectYearDashboard.innerHTML = '';
    for (let i = year; i >= year - 5; i--) {
        const option = document.createElement('option');
        option.value = i;
        option.textContent = i;
        if (i === year) option.selected = true;
        selectYearDashboard.appendChild(option);
    }
}

function loadDashboard() {
    const formData = new FormData();
    formData.append('readDashboardSales', '');
    formData.append('year', selectYearDashboard.value);
    formData.append('month', selectMonthDashboard.value);
    formData.append('rol_usua', localStorage.getItem('rol_usua'));
    formData.append('id_usua', localStorage.getItem('id_usua'));
    fetch('../controladores/ventas.php', {
        method: "POST",
        body: formData
    }).then(response => response.json()).then(data => {
        totalAmount.textContent = parseFloat(data.total_amount).toFixed(2) + ' Bs';
        totalCount.textContent = data.total_count;
        topClientsBody.innerHTML = '';
        if (data.top_clients && data.top_clients.length > 0) {
            data.top_clients.forEach((cliente, index) => {
                const tr = document.createElement('tr');
                tr.innerHTML = `
                    <td>${index + 1}</td>
                    <td>${cliente.cliente}</td>
                    <td>${parseFloat(cliente.total).toFixed(2)} Bs</td>
                `;
                topClientsBody.appendChild(tr);
            });
        } else {
            topClientsBody.innerHTML = '<tr><td colspan="3">Sin ventas en el período seleccionado</td></tr>';
        }
    }).catch(err => console.log(err));
}

createYearDashboard();
loadDashboard();
selectYearDashboard.addEventListener('change', loadDashboard);
selectMonthDashboard.addEventListener('change', loadDashboard);