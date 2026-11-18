// visit-details.js - edit detailed info for a visit

window.addEventListener('DOMContentLoaded', () => {
  const { loadHouseholds, loadVisits, saveVisits, formatDate, showMessage } = window.common;

  const params = new URLSearchParams(window.location.search);
  const visitId = params.get('id');
  if (!visitId) {
    document.body.innerHTML = '<p>Visit ID not provided.</p>';
    return;
  }

  const households = loadHouseholds();
  const visits = loadVisits();
  const visit = visits.find(v => v.id === visitId);
  if (!visit) {
    document.body.innerHTML = '<p>Visit not found.</p>';
    return;
  }

  // Populate static fields
  const hh = households.find(h => h.id === visit.householdId);
  document.getElementById('household-name').textContent = hh ? `${hh.headName} (${hh.id})` : visit.householdId;
  document.getElementById('visit-id').value = visit.id;
  document.getElementById('visit-date').value = visit.date;
  document.getElementById('visit-purpose').value = visit.purpose;
  document.getElementById('visit-status').value = visit.status;
  // Checkboxes
  document.getElementById('chk-health').checked = visit.checklist?.healthCheck || false;
  document.getElementById('chk-medicine').checked = visit.checklist?.medicineReview || false;
  document.getElementById('chk-nutrition').checked = visit.checklist?.nutritionGuidance || false;
  document.getElementById('chk-vaccination').checked = visit.checklist?.vaccinationCheck || false;
  // Notes and follow‑up
  document.getElementById('visit-notes').value = visit.notes || '';
  document.getElementById('next-followup').value = visit.nextFollowup || '';

  const form = document.getElementById('details-form');
  form.addEventListener('submit', e => {
    e.preventDefault();
    // Update visit object
    visit.date = document.getElementById('visit-date').value;
    visit.purpose = document.getElementById('visit-purpose').value.trim();
    visit.status = document.getElementById('visit-status').value;
    visit.checklist = {
      healthCheck: document.getElementById('chk-health').checked,
      medicineReview: document.getElementById('chk-medicine').checked,
      nutritionGuidance: document.getElementById('chk-nutrition').checked,
      vaccinationCheck: document.getElementById('chk-vaccination').checked,
    };
    visit.notes = document.getElementById('visit-notes').value.trim();
    visit.nextFollowup = document.getElementById('next-followup').value;
    // Save
    saveVisits(visits);
    showMessage('Visit details saved.');
  });
});
