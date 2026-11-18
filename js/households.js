// households.js - manage household records

window.addEventListener('DOMContentLoaded', () => {
  const { loadHouseholds, saveHouseholds, generateId, showMessage } = window.common;

  let households = loadHouseholds();

  // If no data, seed with sample
  if (households.length === 0) {
    households = [
      {
        id: generateId('HH'),
        headName: 'John Doe',
        contact: '555-1234',
        address: '123 Main St',
        members: 4,
        observations: 'No issues',
      },
      {
        id: generateId('HH'),
        headName: 'Maria Silva',
        contact: '555-5678',
        address: '456 Oak Ave',
        members: 6,
        observations: 'Elderly member with hypertension',
      },
    ];
    saveHouseholds(households);
  }

  const tableBody = document.querySelector('#household-table tbody');
  const emptyState = document.getElementById('empty-state');
  const form = document.getElementById('household-form');
  const cancelBtn = document.getElementById('cancel-btn');

  const idField = document.getElementById('household-id');
  const headField = document.getElementById('head-name');
  const contactField = document.getElementById('contact-number');
  const addressField = document.getElementById('address');
  const membersField = document.getElementById('members-count');
  const obsField = document.getElementById('observations');

  function renderTable(filter = '') {
    tableBody.innerHTML = '';
    const filtered = households.filter(h =>
      h.headName.toLowerCase().includes(filter) ||
      h.address.toLowerCase().includes(filter)
    );
    if (filtered.length === 0) {
      emptyState.classList.remove('hidden');
    } else {
      emptyState.classList.add('hidden');
      filtered.forEach(h => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
          <td>${h.id}</td>
          <td>${h.headName}</td>
          <td>${h.contact}</td>
          <td>${h.address}</td>
          <td>${h.members}</td>
          <td>${h.observations}</td>
          <td>
            <button data-id="${h.id}" class="edit-btn">Edit</button>
            <button data-id="${h.id}" class="delete-btn">Delete</button>
          </td>
        `;
        tableBody.appendChild(tr);
      });
    }
  }

  function resetForm() {
    form.reset();
    idField.value = '';
    cancelBtn.classList.add('hidden');
  }

  // Form submit (add or edit)
  form.addEventListener('submit', e => {
    e.preventDefault();
    const id = idField.value;
    const newRecord = {
      id: id || generateId('HH'),
      headName: headField.value.trim(),
      contact: contactField.value.trim(),
      address: addressField.value.trim(),
      members: parseInt(membersField.value, 10),
      observations: obsField.value.trim(),
    };
    if (id) {
      // edit
      households = households.map(h => (h.id === id ? newRecord : h));
      showMessage('Household updated.');
    } else {
      households.push(newRecord);
      showMessage('Household added.');
    }
    saveHouseholds(households);
    renderTable(searchBox.value.trim().toLowerCase());
    resetForm();
  });

  // Cancel edit
  cancelBtn.addEventListener('click', () => {
    resetForm();
  });

  // Table actions (edit / delete)
  tableBody.addEventListener('click', e => {
    if (e.target.matches('.edit-btn')) {
      const id = e.target.dataset.id;
      const hh = households.find(h => h.id === id);
      if (hh) {
        idField.value = hh.id;
        headField.value = hh.headName;
        contactField.value = hh.contact;
        addressField.value = hh.address;
        membersField.value = hh.members;
        obsField.value = hh.observations;
        cancelBtn.classList.remove('hidden');
      }
    } else if (e.target.matches('.delete-btn')) {
      const id = e.target.dataset.id;
      if (confirm('Delete this household?')) {
        households = households.filter(h => h.id !== id);
        saveHouseholds(households);
        renderTable(searchBox.value.trim().toLowerCase());
        showMessage('Household deleted.');
      }
    }
  });

  // Search
  const searchBox = document.getElementById('search-box');
  searchBox.addEventListener('input', () => {
    renderTable(searchBox.value.trim().toLowerCase());
  });

  // Initial render
  renderTable();
});
