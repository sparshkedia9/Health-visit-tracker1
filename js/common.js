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
  const parts = id.split('_');
  return parts[parts.length - 1];
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

// Data migration: convert old complex IDs to simple numeric IDs if present
function migrateIds() {
  let households = loadHouseholds();
  let visits = loadVisits();
  let changed = false;
  const idMap = {};
  // Reassign household IDs
  households.forEach((hh, idx) => {
    if (hh.id.includes('_')) {
      const newId = (idx + 1).toString();
      idMap[hh.id] = newId;
      hh.id = newId;
      changed = true;
    }
  });
  // Update visits that reference old household IDs
  visits.forEach(v => {
    if (v.householdId && idMap[v.householdId]) {
      v.householdId = idMap[v.householdId];
      changed = true;
    }
    // Also migrate visit IDs themselves if they are complex
    if (v.id && v.id.includes('_')) {
      // assign a new sequential numeric ID based on current max
      const maxId = Math.max(0, ...visits.map(v2 => parseInt(v2.id) || 0));
      v.id = (maxId + 1).toString();
      changed = true;
    }
  });
  if (changed) {
    saveHouseholds(households);
    saveVisits(visits);
    // Reset counters so new IDs continue sequentially
    localStorage.setItem('hwvt_HH_counter', households.length.toString());
    localStorage.setItem('hwvt_VT_counter', visits.length.toString());
  }
}

// Run migration on script load
migrateIds();




