// visits.js - manage visit scheduling

window.addEventListener('DOMContentLoaded', () => {
  const { loadHouseholds, loadVisits, saveVisits, generateId, formatId, showMessage } = window.common;
  let households = loadHouseholds();
  let visits = loadVisits();

  // If no visits, seed empty (no sample needed)

  const form = document.getElementById('visit-form');
  const cancelBtn = document.getElementById('cancel-visit-btn');
  const visitIdField = document.getElementById('visit-id');
  const householdSelect = document.getElementById('visit-household');
  const dateInput = document.getElementById('visit-date');
  const purposeInput = document.getElementById('visit-purpose');
  const statusSelect = document.getElementById('visit-status');

  const tableBody = document.querySelector('#visit-table tbody');
  const emptyState = document.getElementById('visit-empty');
  const searchBox = document.getElementById('visit-search');

  function populateHouseholdOptions() {
    householdSelect.innerHTML = '';
    households.forEach(h => {
      const opt = document.createElement('option');
      opt.value = h.id;
      opt.textContent = `${h.headName} (${formatId(h.id)})`;
      householdSelect.appendChild(opt);
    });
  }

  function resetForm() {
    form.reset();
    visitIdField.value = '';
    cancelBtn.classList.add('hidden');
  }

  function renderTable(filter = '') {
    tableBody.innerHTML = '';
    const filtered = visits.filter(v => {
      const hh = households.find(h => h.id === v.householdId);
      const hhName = hh ? hh.headName : '';
      return (
        hhName.toLowerCase().includes(filter) ||
        v.purpose.toLowerCase().includes(filter) ||
        v.status.toLowerCase().includes(filter)
      );
    });
    if (filtered.length === 0) {
      emptyState.classList.remove('hidden');
    } else {
      emptyState.classList.add('hidden');
      filtered.forEach(v => {
        const hh = households.find(h => h.id === v.householdId);
        const hhName = hh ? hh.headName : v.householdId;
        const tr = document.createElement('tr');
        tr.innerHTML = `
          <td>${formatId(v.id)}</td>
          <td>${hhName}</td>
          <td>${v.date}</td>
          <td>${v.purpose}</td>
          <td>${v.status}</td>
          <td>
            <button data-id="${v.id}" class="edit-btn">Edit</button>
            <button data-id="${v.id}" class="delete-btn">Delete</button>
            <a href="visit-details.html?id=${v.id}"><button data-id="${v.id}" class="details-btn">Details</button></a>
          </td>
        `;
        tableBody.appendChild(tr);
      });
    }
  }

  // Form submit (add or edit)
  form.addEventListener('submit', e => {
    e.preventDefault();
    const id = visitIdField.value;
    const newVisit = {
      id: id || generateId('VT'),
      householdId: householdSelect.value,
      date: dateInput.value,
      purpose: purposeInput.value.trim(),
      status: statusSelect.value,
      // optional fields for details page – initialise if missing
      checklist: {
        healthCheck: false,
        medicineReview: false,
        nutritionGuidance: false,
        vaccinationCheck: false,
      },
      notes: '',
      nextFollowup: '',
    };
    if (id) {
      visits = visits.map(v => (v.id === id ? { ...v, ...newVisit } : v));
      showMessage('Visit updated.');
    } else {
      visits.push(newVisit);
      showMessage('Visit scheduled.');
    }
    saveVisits(visits);
    renderTable(searchBox.value.trim().toLowerCase());
    resetForm();
  });

  cancelBtn.addEventListener('click', () => resetForm());

  // Table actions
  tableBody.addEventListener('click', e => {
    const id = e.target.dataset.id;
    if (e.target.matches('.edit-btn')) {
      const vt = visits.find(v => v.id === id);
      if (vt) {
        visitIdField.value = vt.id;
        householdSelect.value = vt.householdId;
        dateInput.value = vt.date;
        purposeInput.value = vt.purpose;
        statusSelect.value = vt.status;
        cancelBtn.classList.remove('hidden');
      }
    } else if (e.target.matches('.delete-btn')) {
      if (confirm('Delete this visit?')) {
        visits = visits.filter(v => v.id !== id);
        saveVisits(visits);
        renderTable(searchBox.value.trim().toLowerCase());
        showMessage('Visit deleted.');
      }
    }
  });

  // Search
  searchBox.addEventListener('input', () => {
    renderTable(searchBox.value.trim().toLowerCase());
  });

  // Initialise
  populateHouseholdOptions();
  renderTable();
});
