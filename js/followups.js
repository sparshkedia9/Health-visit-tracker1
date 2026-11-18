// followups.js - display pending follow‑ups and allow completion

window.addEventListener('DOMContentLoaded', () => {
  const { loadVisits, saveVisits, loadHouseholds, formatDate, showMessage } = window.common;

  const visits = loadVisits();
  const households = loadHouseholds();

  const tableBody = document.querySelector('#followup-table tbody');
  const emptyState = document.getElementById('followup-empty');
  const searchBox = document.getElementById('followup-search');

  function renderTable(filter = '') {
    tableBody.innerHTML = '';
    const today = new Date();
    const pending = visits.filter(v => {
      return v.nextFollowup && (!v.followupCompleted) && new Date(v.nextFollowup) >= today;
    });
    const filtered = pending.filter(v => {
      const hh = households.find(h => h.id === v.householdId);
      const hhName = hh ? hh.headName : '';
      return (
        hhName.toLowerCase().includes(filter) ||
        v.purpose.toLowerCase().includes(filter) ||
        v.nextFollowup.includes(filter)
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
          <td>${hhName}</td>
          <td>${formatDate(v.date)}</td>
          <td>${formatDate(v.nextFollowup)}</td>
          <td>${v.purpose}</td>
          <td>${v.followupCompleted ? 'Completed' : 'Pending'}</td>
          <td><button data-id="${v.id}" class="complete-btn">Mark Completed</button></td>
        `;
        tableBody.appendChild(tr);
      });
    }
  }

  // Mark follow‑up completed
  tableBody.addEventListener('click', e => {
    if (e.target.matches('.complete-btn')) {
      const id = e.target.dataset.id;
      const vt = visits.find(v => v.id === id);
      if (vt) {
        vt.followupCompleted = true;
        saveVisits(visits);
        showMessage('Follow‑up marked as completed.');
        renderTable(searchBox.value.trim().toLowerCase());
      }
    }
  });

  // Search
  searchBox.addEventListener('input', () => {
    renderTable(searchBox.value.trim().toLowerCase());
  });

  renderTable();
});
