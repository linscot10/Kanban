let expenses = []

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

    renderExpenses();
    expenseForm.reset();
})


// Render the expenses in a table
function renderExpenses() {
    const tableBody = document.getElementById('expenseTableBody');
    tableBody.innerHTML = '';

    expenses.forEach((expense, index) => {
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

        tableBody.appendChild(row);
    });
}

function deleteExpense(id) {
    expenses = expenses.filter(exp => exp.id !== id);
    renderExpenses();
}