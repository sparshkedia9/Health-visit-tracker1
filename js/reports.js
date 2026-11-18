// reports.js - generate simple summary report

window.addEventListener('DOMContentLoaded', () => {
  const { loadHouseholds, loadVisits, formatDate } = window.common;
  const households = loadHouseholds();
  const visits = loadVisits();

  // If no data, you may have seen sample households added already.
  const totalHouseholds = households.length;
  const totalVisits = visits.length;
  const completedVisits = visits.filter(v => v.status === 'Completed').length;
  const pendingVisits = visits.filter(v => v.status === 'Pending' || v.status === 'Scheduled').length;
  const missedVisits = visits.filter(v => v.status === 'Missed').length;
  const completedFollowups = visits.filter(v => v.followupCompleted).length;

  const tbody = document.querySelector('#summary-table tbody');
  const rows = [
    ['Total households', totalHouseholds],
    ['Total visits scheduled', totalVisits],
    ['Completed visits', completedVisits],
    ['Pending visits', pendingVisits],
    ['Missed visits', missedVisits],
    ['Completed follow‑ups', completedFollowups],
  ];
  tbody.innerHTML = rows.map(r => `<tr><td>${r[0]}</td><td>${r[1]}</td></tr>`).join('');
});
