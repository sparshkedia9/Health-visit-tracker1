// LocalStorage keys
const HOUSEHOLDS_KEY = 'hwvt_households';
const VISITS_KEY = 'hwvt_visits';

// ---------- Data helpers ----------
function loadHouseholds() {
  const data = localStorage.getItem(HOUSEHOLDS_KEY);
  return data ? JSON.parse(data) : [];
}

function saveHouseholds(arr) {
  localStorage.setItem(HOUSEHOLDS_KEY, JSON.stringify(arr));
}

function loadVisits() {
  const data = localStorage.getItem(VISITS_KEY);
  return data ? JSON.parse(data) : [];
}

function saveVisits(arr) {
  localStorage.setItem(VISITS_KEY, JSON.stringify(arr));
}

// Simple sequential ID generator returning plain numeric ID as string
function generateId(prefix) {
  const counterKey = `hwvt_${prefix}_counter`;
  const next = (parseInt(localStorage.getItem(counterKey) || '0', 10) + 1).toString();
  localStorage.setItem(counterKey, next);
  return next; // simple numeric ID
}

// Format ID for display (currently just returns the ID)
function formatId(id) {
  return id;
}

// ---------- Navigation ----------
function setActiveNav() {
  const links = document.querySelectorAll('nav a');
  const path = window.location.pathname.split('/').pop();
  links.forEach(link => {
    if (link.getAttribute('href') === path) {
      link.classList.add('active');
    } else {
      link.classList.remove('active');
    }
  });
}

document.addEventListener('DOMContentLoaded', setActiveNav);

// ---------- Simple helpers ----------
function formatDate(dateStr) {
  const d = new Date(dateStr);
  return d.toLocaleDateString();
}

function showMessage(msg) {
  alert(msg);
}

// Export to window for other scripts
window.common = {
  loadHouseholds,
  saveHouseholds,
  loadVisits,
  saveVisits,
  generateId,
  formatId,
  formatDate,
  showMessage,
};



