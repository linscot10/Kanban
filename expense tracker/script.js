let expenses = JSON.parse(localStorage.getItem('expenses')) || []
let expenseChart;

const expenseForm = document.getElementById('expenseForm');
const amountInput = document.getElementById('amount');
const categoryInput = document.getElementById('category');
const descriptionInput = document.getElementById('description')
const dateInput = document.getElementById('date')

expenseForm.addEventListener('submit', (e) => {
    e.preventDefault()

    const amount = parseFloat(amountInput.value)
    const category = categoryInput.value.trim()
    const description = descriptionInput.value.trim()
    const date = dateInput.value

    if (!amount || amount <= 0 || !category || !description || !date) {
        alert("Please fill in all fields correctly.");
        return;
    }

    const expense = {
        id: Date.now(),
        amount,
        category,
        description,
        date
    }

    // console.log(expense)

    expenses.push(expense)
    saveToLocalStorage();

    renderExpenses();
    renderChart()
    expenseForm.reset();
})


// Render the expenses in a table
function renderExpenses() {
    const tableBody = document.getElementById('expenseTableBody');
    const searchQuery = document.getElementById('searchInput').value.toLowerCase();
    const selectedCategory = document.getElementById('categoryFilter').value;


    tableBody.innerHTML = '';

    let filteredExpenses = expenses.filter(exp => {
        const matchDescription = exp.description.toLowerCase().includes(searchQuery);
        const matchCategory = selectedCategory === '' || exp.category === selectedCategory;
        return matchDescription && matchCategory;
    });

    if (filteredExpenses.length === 0) {
        tableBody.innerHTML = `<tr><td colspan="6" class="text-center text-muted">No matching records found</td></tr>`;
        return;
    }


    filteredExpenses.forEach((expense, index) => {
        const row = document.createElement('tr');

        row.innerHTML = `
          <td>${index + 1}</td>
          <td>Ksh ${expense.amount.toFixed(2)}</td>
          <td>${expense.category}</td>
          <td>${expense.description}</td>
          <td>${expense.date}</td>
          <td>
            <button class="btn btn-sm btn-danger" onclick="deleteExpense(${expense.id})">🗑️</button>
          </td>
        `;

        // expenses.forEach((expense, index) => {
        //     const row = document.createElement('tr');

        //     row.innerHTML = `
        //     <td>${index + 1}</td>
        //     <td>Ksh ${expense.amount.toFixed(2)}</td>
        //     <td>${expense.category}</td>
        //     <td>${expense.description}</td>
        //     <td>${expense.date}</td>
        //     <td>
        //       <button class="btn btn-sm btn-danger" onclick="deleteExpense(${expense.id})">🗑️</button>
        //     </td>
        //   `;

        tableBody.appendChild(row);
    });
}

document.getElementById('searchInput').addEventListener('input', renderExpenses);
document.getElementById('categoryFilter').addEventListener('change', renderExpenses);

function renderChart() {
    const ctx = document.getElementById('expenseChart').getContext('2d');

    const categoryTotals = {};
    expenses.forEach(exp => {
        categoryTotals[exp.category] = (categoryTotals[exp.category] || 0) + exp.amount;
    });

    const data = {
        labels: Object.keys(categoryTotals),
        datasets: [{
            label: 'Expenses by Category',
            data: Object.values(categoryTotals),
            backgroundColor: ['#0d6efd', '#198754', '#ffc107', '#dc3545', '#6f42c1'],
            borderColor: '#fff',
            borderWidth: 1
        }]
    };

    const config = {
        type: 'pie',
        data: data,
        options: {
            responsive: true,
            plugins: {
                legend: {
                    position: 'bottom',
                },
                title: {
                    display: false
                }
            }
        }
    };

    // Destroy previous chart to avoid overlap
    if (expenseChart) expenseChart.destroy();

    expenseChart = new Chart(ctx, config);
}


function saveToLocalStorage() {
    localStorage.setItem('expenses', JSON.stringify(expenses));
}
function deleteExpense(id) {
    expenses = expenses.filter(exp => exp.id !== id);
    saveToLocalStorage();
    renderExpenses();
    renderChart()
}

renderExpenses();
renderChart()   