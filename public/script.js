const API_URL = '/api/users';
const tableBody = document.getElementById('client-table-body');
const noResults = document.getElementById('no-results');
const loading = document.getElementById('loading');
const resultCount = document.getElementById('result-count');

let clients = [];
let currentData = [];

async function fetchClients() {
  try {
    showLoading(true);
    const res = await fetch(API_URL);
    clients = await res.json();
    currentData = clients;
    renderTable(clients);
  } catch (error) {
    console.error('Failed to fetch:', error);
  } finally {
    showLoading(false);
  }
}

function normalize(str) {
  return str?.toLowerCase().replace(/\s+/g, '').trim() || '';
}

function renderTable(data) {
  currentData = data;
  tableBody.innerHTML = '';

  if (data.length === 0) {
    noResults.classList.remove('hidden');
    resultCount.classList.add('hidden');
    return;
  }

  noResults.classList.add('hidden');
  resultCount.textContent = `✅ Showing ${data.length} result${data.length > 1 ? 's' : ''}`;
  resultCount.classList.remove('hidden');

  data.forEach((item, index) => {
    const row = document.createElement('tr');
    row.innerHTML = `
      <td class="p-3 border">${index + 1}</td>
      <td class="p-3 border">${item.firstname}</td>
      <td class="p-3 border">${item.lastname}</td>
      <td class="p-3 border">${item.email}</td>
      <td class="p-3 border">${item.phone}</td>
      <td class="p-3 border">${item.room}</td>
    `;
    tableBody.appendChild(row);
  });
}

function filterClients() {
  const name = normalize(document.getElementById('search-name').value);
  const email = normalize(document.getElementById('search-email').value);
  const phone = normalize(document.getElementById('search-phone').value);
  const room = normalize(document.getElementById('search-room').value);

  const filtered = clients.filter(item => {
    const fullName = normalize(item.firstname + item.lastname);
    return (
      (!name || fullName.includes(name)) &&
      (!email || normalize(item.email).includes(email)) &&
      (!phone || normalize(item.phone).includes(phone)) &&
      (!room || normalize(item.room).includes(room))
    );
  });

  renderTable(filtered);
}

function showLoading(state) {
  loading.style.display = state ? 'block' : 'none';
}

function cleanData() {
  showLoading(true);

  setTimeout(() => {
    const cleaned = clients.filter(item => {
      const isDummy = (val) => {
        const lowerVal = val.trim().toLowerCase();
        const dummyKeywords = ['test', 'dummy', 'abc', '123', 'none', 'null', 'fake'];
        if (dummyKeywords.includes(lowerVal)) return true;
        if (/^([a-z])\1{2,}$/i.test(lowerVal)) return true;
        if (/^[a-z]{2,5}$/i.test(lowerVal) && new Set(lowerVal).size <= 2) return true;
        return false;
      };

      const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email);
      const isValidPhone = (phone) => /^\+92\d{10}$/.test(phone.replace(/\s/g, ''));
      const isValidName = (name) => name.trim().length >= 3 && !isDummy(name);

      return (
        isValidName(item.firstname) &&
        isValidName(item.lastname) &&
        isValidEmail(item.email) &&
        isValidPhone(item.phone)
      );
    });

    renderTable(cleaned);
    resultCount.textContent = `🧹 Cleaned data. Showing ${cleaned.length} valid entries.`;
    resultCount.classList.remove('hidden');
    showLoading(false);
  }, 500);
}

function removeDuplicates() {
  showLoading(true);

  setTimeout(() => {
    const seen = new Set();
    const unique = currentData.filter(item => {
      const phone = item.phone.replace(/\s/g, '');
      if (seen.has(phone)) return false;
      seen.add(phone);
      return true;
    });

    renderTable(unique);
    resultCount.textContent = `❌ Duplicates removed. Showing ${unique.length} unique entries.`;
    resultCount.classList.remove('hidden');
    showLoading(false);
  }, 500);
}

function exportCSV() {
  if (!currentData.length) return;
  const headers = ['Firstname', 'Lastname', 'Email', 'Phone', 'Room'];
  const rows = currentData.map(item => [item.firstname, item.lastname, item.email, item.phone, item.room]);
  const csvContent = [headers, ...rows].map(e => e.join(",")).join("\n");

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = 'clients.csv';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

document.getElementById('search-name').addEventListener('input', filterClients);
document.getElementById('search-email').addEventListener('input', filterClients);
document.getElementById('search-phone').addEventListener('input', filterClients);
document.getElementById('search-room').addEventListener('input', filterClients);

fetchClients();
