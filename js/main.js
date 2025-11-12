let employees = [];
let nextId = 1;
let editingId = null;
let tableBody = document.getElementById('tableBody');
let modal = document.getElementById('modal');
let form = document.getElementById('form');
let addBtn = document.getElementById('addBtn');
let closeBtn = document.getElementById('closeModal');
let salaryInput = document.getElementById('salary');

let savedEmployees = localStorage.getItem('employees');
if (savedEmployees) {
    employees = JSON.parse(savedEmployees);
    if (employees.length > 0) {
        nextId = Math.max(...employees.map(emp => emp.id)) + 1;
    }
}

addBtn.addEventListener('click', () => openModal());
closeBtn.addEventListener('click', closeModal);
modal.addEventListener('click', (e) => {
    if (e.target === modal) closeModal();
});

function openModal(employee = null) {
    form.reset();
    document.getElementById('married').checked = false;
    editingId = null;
    
    if (employee) {
        document.getElementById('firstName').value = employee.firstName;
        document.getElementById('lastName').value = employee.lastName;
        document.getElementById('location').value = employee.location;
        document.getElementById('dob').value = employee.dob;
        document.getElementById('position').value = employee.position;
        document.getElementById('positionType').value = employee.positionType;
        document.getElementById('salary').value = employee.salary;
        document.getElementById('married').checked = employee.married;
        editingId = employee.id;
        form.querySelector('button[type="submit"]').textContent = "Tahrirlash";
    } else {
        form.querySelector('button[type="submit"]').textContent = "Qo'shish";
    }
    
    modal.classList.remove('hidden');
}

function closeModal() {
    modal.classList.add('hidden');
    editingId = null;
}

form.addEventListener('submit', (e) => {
    e.preventDefault();

    let data = {
        firstName: document.getElementById('firstName').value.trim(),
        lastName: document.getElementById('lastName').value.trim(),
        location: document.getElementById('location').value,
        dob: document.getElementById('dob').value,
        position: document.getElementById('position').value,
        positionType: document.getElementById('positionType').value,
        salary: Number(document.getElementById('salary').value),
        married: document.getElementById('married').checked
    };


    if (editingId) {
        let index = employees.findIndex(emp => emp.id === editingId);
        employees[index] = { id: editingId, ...data };
    } else {
        data.id = nextId++;
        employees.push(data);
    }

    localStorage.setItem('employees', JSON.stringify(employees));

    renderTable();
    closeModal();
});

tableBody.addEventListener('click', (e) => {
    let id = Number(e.target.dataset.id);
    if (e.target.classList.contains('edit-btn')) {
        let emp = employees.find(emp => emp.id === id);
        openModal(emp);
    } else if (e.target.classList.contains('delete-btn')) {
        if (confirm("Haqiqatan ham o'chirmoqchimisiz?")) {
            employees = employees.filter(emp => emp.id !== id);
            renderTable();
        }
    }
});

function renderTable() {
    tableBody.innerHTML = '';
    employees.forEach((emp, index) => {
        let row = document.createElement('tr');
        row.className = 'border-b hover:bg-gray-50';
        row.innerHTML = `
            <td class="px-2 py-2 text-left">${index + 1}</td>
            <td class="px-2 py-2 text-left">${emp.firstName}</td>
            <td class="px-2 py-2 text-left">${emp.lastName}</td>
            <td class="px-2 py-2 text-left">${emp.location}</td>
            <td class="px-2 py-2 text-left">${formatDate(emp.dob)}</td>
            <td class="px-2 py-2 text-left">${emp.position}</td>
            <td class="px-2 py-2 text-left">${emp.positionType}</td>
            <td class="px-2 py-2 text-left">${formatSalary(emp.salary)}</td>
            <td class="px-2 py-2 text-left">${emp.married ? 'Ha' : 'Yo\'q'}</td>
            <td class="px-2 py-2 text-left">
                <button class="edit-btn bg-blue-500 text-white px-3 py-1 rounded" data-id="${emp.id}">Edit</button>
                <button class="delete-btn bg-red-500 text-white px-3 py-1 rounded" data-id="${emp.id}">Delete</button>
            </td>
        `;
        tableBody.appendChild(row);
    });
}

function formatDate(dateStr) {
    if (!dateStr) return '';
    return new Date(dateStr).toLocaleDateString('en-GB');
}

function formatSalary(salary) {
    return new Intl.NumberFormat('en-GB').format(salary);
}

renderTable();