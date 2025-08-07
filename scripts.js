// script.js

document.addEventListener('DOMContentLoaded', () => {
  const userForm = document.getElementById('userForm');
  const nameInput = document.getElementById('name');
  const emailInput = document.getElementById('email');
  const formMsg = document.getElementById('formMsg');
  const usersTableBody = document.querySelector('#usersTable tbody');
  const searchInput = document.getElementById('searchInput');
  const loginForm = document.getElementById('loginForm');
  const loginMsg = document.getElementById('loginMsg');
  const chartCanvas = document.getElementById('salesChart');

  let users = JSON.parse(localStorage.getItem('users')) || [];

  function renderUsers(filteredUsers = users) {
    if (!usersTableBody) return;
    usersTableBody.innerHTML = '';
    filteredUsers.forEach((user, index) => {
      const row = document.createElement('tr');
      row.innerHTML = `
        <td contenteditable="true">${user.name}</td>
        <td contenteditable="true">${user.email}</td>
        <td><button onclick="deleteUser(${index})">Delete</button></td>
      `;
      usersTableBody.appendChild(row);
    });
    const userCount = document.getElementById('userCount');
    if (userCount) userCount.textContent = users.length;
  }

  window.deleteUser = function(index) {
    if (confirm('Are you sure?')) {
      users.splice(index, 1);
      localStorage.setItem('users', JSON.stringify(users));
      renderUsers();
    }
  }

  if (userForm) {
    userForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = nameInput.value.trim();
      const email = emailInput.value.trim();
      if (!name || !email) {
        formMsg.textContent = 'All fields are required.';
        formMsg.style.color = 'red';
        return;
      }
      users.push({ name, email });
      localStorage.setItem('users', JSON.stringify(users));
      renderUsers();
      nameInput.value = '';
      emailInput.value = '';
      formMsg.textContent = 'User added successfully!';
      formMsg.style.color = 'green';
    });
  }

  if (searchInput) {
    searchInput.addEventListener('input', () => {
      const query = searchInput.value.toLowerCase();
      const filtered = users.filter(u => u.name.toLowerCase().includes(query) || u.email.toLowerCase().includes(query));
      renderUsers(filtered);
    });
  }

  window.sortTable = function(n) {
    users.sort((a, b) => {
      const x = Object.values(a)[n].toLowerCase();
      const y = Object.values(b)[n].toLowerCase();
      return x.localeCompare(y);
    });
    renderUsers();
  }

  if (chartCanvas && window.Chart) {
    const ctx = chartCanvas.getContext('2d');
    new Chart(ctx, {
      type: 'line',
      data: {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
        datasets: [{
          label: 'Monthly Sales',
          data: [120, 190, 300, 500, 200, 300],
          backgroundColor: 'rgba(30, 144, 255, 0.2)',
          borderColor: 'rgba(30, 144, 255, 1)',
          borderWidth: 2
        }]
      },
      options: {
        responsive: true,
        plugins: {
          legend: {
            display: true,
            position: 'bottom'
          }
        }
      }
    });
  }

  if (loginForm) {
    loginForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const user = document.getElementById('loginUser').value;
      const pass = document.getElementById('loginPass').value;

      if (user === 'admin' && pass === '1234') {
        loginMsg.textContent = 'Login successful';
        loginMsg.style.color = 'green';
      } else {
        loginMsg.textContent = 'Invalid credentials';
        loginMsg.style.color = 'red';
      }
    });
  }

  renderUsers();
});
