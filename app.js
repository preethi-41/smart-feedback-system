const API_BASE = 'http://localhost:5000';
const form = document.getElementById('feedbackForm');
const resultEl = document.getElementById('result');
const recentList = document.getElementById('recentList');
const authStatus = document.getElementById('authStatus');
const landing = document.getElementById('landing');
const startBtn = document.getElementById('startBtn');
const mainContainer = document.querySelector('main.container');
const loginPage = document.getElementById('loginPage');
const loginPageForm = document.getElementById('loginPageForm');
const loginPageHint = document.getElementById('loginPageHint');
const skipLoginBtn = document.getElementById('skipLoginBtn');
const cancelLoginBtn = document.getElementById('cancelLoginBtn');
const feedbackBar = document.getElementById('feedbackBar');
const rolePicker = document.getElementById('rolePicker');
const giveFeedbackBtn = document.getElementById('giveFeedbackBtn');
let chart;

let desiredRole = 'guest';
let loginOptional = false;

function getAuth() {
  try {
    const raw = localStorage.getItem('authUser');
    return raw ? JSON.parse(raw) : null;
  } catch { return null }
}

function setAuth(user) {
  localStorage.setItem('authUser', JSON.stringify(user));
}

function clearAuth() {
  localStorage.removeItem('authUser');
}

function updateAuthStatus() {
  const user = getAuth();
  if (user) {
    authStatus.innerHTML = `Logged in as <strong>${user.email}</strong> (${user.role}) <button id="logoutBtn" class="link-btn">Logout</button>`;
    const btn = document.getElementById('logoutBtn');
    if (btn) btn.addEventListener('click', () => { clearAuth(); updateAuthStatus(); });
  } else {
    authStatus.textContent = 'Not logged in';
  }
}

if (startBtn) {
  startBtn.addEventListener('click', () => {
    if (landing) landing.style.display = 'none';
    if (mainContainer) mainContainer.style.display = 'block';
  });
}

function showSection(section) {
  if (landing) landing.style.display = 'none';
  if (mainContainer) mainContainer.style.display = 'none';
  if (loginPage) loginPage.style.display = 'none';
  if (section === 'landing' && landing) landing.style.display = 'block';
  if (section === 'feedback' && mainContainer) mainContainer.style.display = 'block';
  if (section === 'login' && loginPage) loginPage.style.display = 'block';
  try { window.scrollTo({ top: 0, behavior: 'smooth' }); } catch {}
}

async function submitFeedback(payload) {
  const res = await fetch(`${API_BASE}/api/feedback`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Failed');
  resultEl.textContent = `Sentiment: ${data.feedback.label} (score ${data.feedback.score.toFixed(3)})`;
  form.reset();
  await loadSummary();
}

form.addEventListener('submit', async (e) => {
  e.preventDefault();
  const fd = new FormData(form);
  const payload = Object.fromEntries(fd.entries());
  const role = payload.role || desiredRole || 'guest';
  const user = getAuth();
  try {
    await submitFeedback(payload);
    if (role === 'guest' && !user) {
      // After guest submission, offer optional login to upgrade
      loginOptional = true;
      loginPageHint.textContent = 'Optional: login to save your feedback and upgrade to Registered.';
      skipLoginBtn.style.display = 'inline-block';
      showSection('login');
    }
  } catch (err) {
    resultEl.textContent = err.message;
  }
});

const roleSelect = form.querySelector('select[name="role"]');

function proceedWithRole(roleVal) {
  desiredRole = roleVal || 'guest';
  if (roleSelect) {
    roleSelect.value = desiredRole;
    roleSelect.disabled = true;
  }
  const user = getAuth();
  if ((desiredRole === 'admin' || desiredRole === 'registered') && !user) {
    loginOptional = false;
    if (loginPageHint) loginPageHint.textContent = `Login required to continue as ${desiredRole}.`;
    if (skipLoginBtn) skipLoginBtn.style.display = 'none';
    showSection('login');
  } else {
    showSection('feedback');
  }
}

if (giveFeedbackBtn && rolePicker) {
  giveFeedbackBtn.addEventListener('click', () => {
    proceedWithRole(rolePicker.value);
  });
  rolePicker.addEventListener('change', () => {
    proceedWithRole(rolePicker.value);
  });
}

document.addEventListener('DOMContentLoaded', () => {
  // Ensure footer controls work even if script executes early in some setups
  if (giveFeedbackBtn && rolePicker && !giveFeedbackBtn._wired) {
    giveFeedbackBtn._wired = true;
    giveFeedbackBtn.addEventListener('click', () => proceedWithRole(rolePicker.value));
    rolePicker.addEventListener('change', () => proceedWithRole(rolePicker.value));
  }
});

if (loginPageForm) {
  loginPageForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const fd = new FormData(loginPageForm);
    const email = fd.get('email');
    // If this was optional (guest upgrade), always set to registered
    const role = loginOptional ? 'registered' : (desiredRole || 'registered');
    setAuth({ email, role });
    updateAuthStatus();
    showSection('feedback');
    loginOptional = false;
  });
}

if (skipLoginBtn) {
  skipLoginBtn.addEventListener('click', () => {
    showSection('feedback');
    loginOptional = false;
  });
}

if (cancelLoginBtn) {
  cancelLoginBtn.addEventListener('click', () => {
    // Return to landing to pick again
    showSection('landing');
    loginOptional = false;
  });
}

async function loadSummary() {
  const res = await fetch(`${API_BASE}/api/summary`);
  const { summary, recent } = await res.json();
  const labels = ['positive', 'neutral', 'negative'];
  const values = [summary.positive||0, summary.neutral||0, summary.negative||0];

  const ctx = document.getElementById('summaryChart');
  if (chart) chart.destroy();
  chart = new Chart(ctx, {
    type: 'bar',
    data: {
      labels,
      datasets: [{
        label: 'Count',
        data: values,
        backgroundColor: ['#22c55e','#f59e0b','#ef4444']
      }]
    },
    options: { responsive: true, plugins: { legend: { display: false } } }
  });

  recentList.innerHTML = recent.map(r => `
    <div class="recent-item">
      <div><strong>${r.event || 'General'}</strong> — ${new Date(r.createdAt).toLocaleString()}</div>
      <div>${r.message}</div>
      <div>Sentiment: ${r.sentiment.label} (${r.sentiment.score.toFixed(3)})</div>
    </div>
  `).join('');
}


updateAuthStatus();
loadSummary();
