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

// Simple sequential ID generator (e.g., HH_1, VT_2)
function generateId(prefix) {
  const counterKey = `hwvt_${prefix}_counter`;
  const cur = parseInt(localStorage.getItem(counterKey) || '0', 10);
  const next = cur + 1;
  localStorage.setItem(counterKey, next);
  return `${prefix}_${next}`;
}

// Return a short display version of any stored ID (last part after underscore)
function formatId(id) {
  const parts = id.split('_');
  return parts.length > 1 ? parts[parts.length - 1] : id;
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

function generateId(prefix) {
  return prefix + '_' + Date.now() + '_' + Math.floor(Math.random() * 1000);
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
  formatDate,
  showMessage,
};
