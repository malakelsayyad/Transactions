let tableBody = document.getElementById('tableBody');
let nameFilter = document.getElementById('nameFilter');
let amountFilter = document.getElementById('amountFilter');
let originalData = []; 

let transactionChart;
const ctx = document.getElementById('transactionChart').getContext('2d');

async function getData() {
    
        let response = await fetch(`./data/data.json`);
        let data = await response.json();
        originalData = data;
        displayData(data);
        updateChart(data.transactions);
    
}

getData();

function displayData(data) {
    let tableContent = "";
    for (let transaction of data.transactions) {
        const customerName = data.customers.find(customer => customer.id === transaction.customer_id).name;
        tableContent += `
            <tr>
                <td class="py-3">${customerName}</td>
                <td class="py-3">${transaction.date}</td>
                <td class="py-3">${transaction.amount}</td>
            </tr>
        `;
    }

    tableBody.innerHTML = tableContent;
}

function searchByName() {
    let searchTerm = nameFilter.value.trim().toLowerCase();
    let filteredData = originalData.transactions.filter(transaction => {
        const customerName = originalData.customers.find(customer => customer.id === transaction.customer_id).name.toLowerCase();
        return customerName.includes(searchTerm);
    });

    displayData({ transactions: filteredData, customers: originalData.customers });
    updateChart(filteredData);
}

function searchByAmount() {
    let searchTerm = parseFloat(amountFilter.value.trim());
    let filteredData = originalData.transactions.filter(transaction => parseFloat(transaction.amount) === searchTerm);

    displayData({ transactions: filteredData, customers: originalData.customers });
    updateChart(filteredData);
}

nameFilter.addEventListener('input', searchByName);
amountFilter.addEventListener('input', searchByAmount);

function updateChart(transactions) {
    const labels = transactions.map(transaction => transaction.date);
    const data = transactions.map(transaction => transaction.amount);


    if (transactionChart) {
        transactionChart.destroy();
    }

    transactionChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [{
                label: 'Transaction Amount',
                data: data,
                backgroundColor: '#09c',
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false, 
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });
}
