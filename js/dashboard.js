// dashboard.js – display stats and recent activities
window.addEventListener('DOMContentLoaded', () => {
  const { loadHouseholds, loadVisits, formatDate } = window.common;
  const households = loadHouseholds();
  const visits = loadVisits();

  // Calculate statistics
  const totalHouseholds = households.length;
  const totalVisits = visits.length;
  const completedVisits = visits.filter(v => v.status === 'Completed').length;
  const pendingVisits = visits.filter(v => v.status === 'Pending' || v.status === 'Scheduled').length;
  const upcomingVisits = visits.filter(v => new Date(v.date) >= new Date() && (v.status === 'Scheduled' || v.status === 'Pending')).length;

  // Populate stat cards
  document.getElementById('total-households').innerHTML = `<h3>Total Households</h3><p>${totalHouseholds}</p>`;
  document.getElementById('total-visits').innerHTML = `<h3>Total Visits</h3><p>${totalVisits}</p>`;
  document.getElementById('completed-visits').innerHTML = `<h3>Completed Visits</h3><p>${completedVisits}</p>`;
  document.getElementById('pending-visits').innerHTML = `<h3>Pending Visits</h3><p>${pendingVisits}</p>`;
  document.getElementById('upcoming-visits').innerHTML = `<h3>Upcoming Visits</h3><p>${upcomingVisits}</p>`;

  // Recent activities list
  const activityList = document.getElementById('activity-list');
  const recent = visits
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .slice(0, 5);

  if (recent.length === 0) {
    activityList.innerHTML = '<li>No recent activities.</li>';
  } else {
    activityList.innerHTML = recent
      .map(v => {
        const hh = households.find(h => h.id === v.householdId);
        const hhName = hh ? hh.headName : v.householdId;
        return `<li>${formatDate(v.date)} – ${hhName} – ${v.purpose} – ${v.status}</li>`;
      })
      .join('');
  }
});
