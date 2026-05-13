/**
 * LindaJamii — Frontend Application
 * Connects to three backend services:
 *   - C Service    : http://localhost:8090
 *   - Python API   : http://localhost:5050
 *   - Java API     : http://localhost:8080
 */

'use strict';

// ── API Configuration ─────────────────────────────────────────────
const API = {
  c:      'http://localhost:8090',
  python: 'http://localhost:5050',
  java:   'http://localhost:8080',
};

// ── Utility helpers ───────────────────────────────────────────────
async function fetchJSON(url, options = {}) {
  const res = await fetch(url, { ...options, signal: AbortSignal.timeout(5000) });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json();
}

function timeAgo(dateStr) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins  = Math.floor(diff / 60000);
  const hours = Math.floor(mins / 60);
  const days  = Math.floor(hours / 24);
  if (days  > 0) return `${days}d ago`;
  if (hours > 0) return `${hours}h ago`;
  if (mins  > 0) return `${mins}m ago`;
  return 'Just now';
}

function formatDateTime(dtStr) {
  if (!dtStr) return '—';
  try {
    return new Date(dtStr).toLocaleString('en-KE', {
      month: 'short', day: 'numeric',
      hour: '2-digit', minute: '2-digit',
    });
  } catch { return dtStr; }
}

function categoryIcon(cat) {
  const icons = { crime: '🚨', suspicious: '👁️', infrastructure: '🔧', other: '📋' };
  return icons[cat] || '📋';
}

// ── Navbar ────────────────────────────────────────────────────────
const navbar    = document.getElementById('navbar');
const hamburger = document.getElementById('hamburger');
const navLinks  = document.getElementById('navLinks');

window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 20);
});

hamburger?.addEventListener('click', () => {
  navLinks.classList.toggle('open');
});

// Highlight active nav link on scroll
const sections = document.querySelectorAll('section[id]');
const links    = document.querySelectorAll('.nav-link');
const observer = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      links.forEach(l => l.classList.toggle('active', l.getAttribute('href') === `#${e.target.id}`));
    }
  });
}, { threshold: 0.4 });
sections.forEach(s => observer.observe(s));

// ── Hero Stats ────────────────────────────────────────────────────
async function loadHeroStats() {
  try {
    const [communityStats, nbhSummary, incidents, alerts] = await Promise.allSettled([
      fetchJSON(`${API.python}/api/community/stats`),
      fetchJSON(`${API.java}/api/neighbourhoods/summary`),
      fetchJSON(`${API.python}/api/incidents/`),
      fetchJSON(`${API.python}/api/alerts/`),
    ]);

    if (communityStats.status === 'fulfilled') {
      animateNumber('statMembers', communityStats.value.total_members);
    }
    if (nbhSummary.status === 'fulfilled') {
      animateNumber('statNeighbourhoods', nbhSummary.value.total_neighbourhoods);
    }
    if (incidents.status === 'fulfilled') {
      animateNumber('statIncidents', incidents.value.total);
    }
    if (alerts.status === 'fulfilled') {
      animateNumber('statAlerts', alerts.value.total);
    }
  } catch (err) {
    console.warn('Hero stats error:', err);
  }
}

function animateNumber(id, target) {
  const el = document.getElementById(id);
  if (!el) return;
  let current = 0;
  const step = Math.ceil(target / 40);
  const timer = setInterval(() => {
    current = Math.min(current + step, target);
    el.textContent = current.toLocaleString();
    if (current >= target) clearInterval(timer);
  }, 30);
}

// ── Alerts ────────────────────────────────────────────────────────
async function loadAlerts() {
  const list  = document.getElementById('alertsList');
  const count = document.getElementById('alertsCount');
  try {
    const data = await fetchJSON(`${API.python}/api/alerts/`);
    count.textContent = `${data.total} active`;
    if (data.total === 0) {
      list.innerHTML = '<p style="color:var(--text-muted);text-align:center;padding:1rem">No active alerts at this time.</p>';
      return;
    }
    list.innerHTML = data.alerts.map(a => `
      <div class="alert-item ${a.level}">
        <span class="alert-level ${a.level}">${a.level}</span>
        <div class="alert-body">
          <div class="alert-message">${a.message}</div>
          <div class="alert-meta">📍 ${a.area} &nbsp;·&nbsp; Issued ${formatDateTime(a.issued_at)} &nbsp;·&nbsp; Expires ${formatDateTime(a.expires_at)}</div>
        </div>
      </div>
    `).join('');
  } catch (err) {
    list.innerHTML = `<p style="color:var(--text-muted);text-align:center;padding:1rem">Could not load alerts (Python API offline?)</p>`;
    count.textContent = '—';
  }
}

// ── Incidents ─────────────────────────────────────────────────────
let allIncidents = [];

async function loadIncidents() {
  const grid = document.getElementById('incidentsGrid');
  grid.innerHTML = '<div class="loading-spinner"></div>';
  try {
    const data = await fetchJSON(`${API.python}/api/incidents/`);
    allIncidents = data.incidents || [];
    renderIncidents(allIncidents);
  } catch (err) {
    grid.innerHTML = `<p style="color:var(--text-muted);text-align:center;padding:2rem;grid-column:1/-1">Could not load incidents (Python API offline?)</p>`;
  }
}

function filterIncidents() {
  const cat = document.getElementById('filterCategory').value;
  const sev = document.getElementById('filterSeverity').value;
  const sts = document.getElementById('filterStatus').value;
  let filtered = allIncidents;
  if (cat) filtered = filtered.filter(i => i.category === cat);
  if (sev) filtered = filtered.filter(i => i.severity === sev);
  if (sts) filtered = filtered.filter(i => i.status === sts);
  renderIncidents(filtered);
}

function renderIncidents(incidents) {
  const grid = document.getElementById('incidentsGrid');
  if (!incidents.length) {
    grid.innerHTML = '<p style="color:var(--text-muted);text-align:center;padding:2rem;grid-column:1/-1">No incidents match the selected filters.</p>';
    return;
  }
  grid.innerHTML = incidents.map(i => `
    <div class="incident-card ${i.severity}">
      <div class="incident-header">
        <span class="incident-icon">${categoryIcon(i.category)}</span>
        <span class="incident-title">${i.title}</span>
      </div>
      <div class="incident-badges">
        <span class="badge badge-${i.severity}">${i.severity}</span>
        <span class="badge badge-${i.category}">${i.category}</span>
        <span class="badge badge-${i.status}">${i.status.replace('_', ' ')}</span>
      </div>
      <p class="incident-desc">${i.description}</p>
      <div class="incident-footer">
        <span>📍 ${i.location?.address || 'Unknown location'}</span>
        <span>${timeAgo(i.created_at)}</span>
        <button class="upvote-btn" onclick="this.textContent='👍 ' + (parseInt(this.textContent.replace(/\D/g,'')) + 1)">
          👍 ${i.upvotes}
        </button>
      </div>
    </div>
  `).join('');
}

// ── Neighbourhoods ────────────────────────────────────────────────
async function loadNeighbourhoods() {
  const summaryEl = document.getElementById('summaryCards');
  const gridEl    = document.getElementById('neighbourhoodsGrid');
  try {
    const [summary, list] = await Promise.all([
      fetchJSON(`${API.java}/api/neighbourhoods/summary`),
      fetchJSON(`${API.java}/api/neighbourhoods`),
    ]);

    summaryEl.innerHTML = `
      <div class="summary-card">
        <div class="summary-card-number">${summary.total_neighbourhoods}</div>
        <div class="summary-card-label">Total Neighbourhoods</div>
      </div>
      <div class="summary-card">
        <div class="summary-card-number">${summary.active_neighbourhoods}</div>
        <div class="summary-card-label">Active Neighbourhoods</div>
      </div>
      <div class="summary-card">
        <div class="summary-card-number">${summary.total_members.toLocaleString()}</div>
        <div class="summary-card-label">Total Members</div>
      </div>
    `;

    gridEl.innerHTML = list.neighbourhoods.map(n => `
      <div class="neighbourhood-card">
        <div class="nbh-header">
          <span class="nbh-icon">🏘️</span>
          <div>
            <div class="nbh-name">${n.name}</div>
            <div class="nbh-county">${n.county}, ${n.city}</div>
          </div>
          ${n.active ? '<span class="nbh-active-badge">Active</span>' : ''}
        </div>
        <div class="nbh-stats">
          <span><strong>${n.memberCount}</strong> members</span>
          <span>📍 ${n.latitude.toFixed(3)}, ${n.longitude.toFixed(3)}</span>
        </div>
        <div class="nbh-leader">👤 Ward Leader: ${n.wardLeader}</div>
      </div>
    `).join('');
  } catch (err) {
    summaryEl.innerHTML = `<p style="color:var(--text-muted);text-align:center;padding:1rem;grid-column:1/-1">Could not load neighbourhoods (Java API offline?)</p>`;
    gridEl.innerHTML = '';
  }
}

// ── Patrols ───────────────────────────────────────────────────────
async function loadPatrols(status = '') {
  const grid = document.getElementById('patrolsGrid');
  grid.innerHTML = '<div class="loading-spinner"></div>';

  // Update active filter button
  ['patrolAll','patrolScheduled','patrolActive','patrolCompleted'].forEach(id => {
    document.getElementById(id)?.classList.remove('active-filter');
  });
  const btnMap = { '': 'patrolAll', 'scheduled': 'patrolScheduled', 'active': 'patrolActive', 'completed': 'patrolCompleted' };
  document.getElementById(btnMap[status])?.classList.add('active-filter');

  try {
    const url  = status ? `${API.java}/api/patrols?status=${status}` : `${API.java}/api/patrols`;
    const data = await fetchJSON(url);
    if (!data.patrols.length) {
      grid.innerHTML = '<p style="color:var(--text-muted);text-align:center;padding:2rem;grid-column:1/-1">No patrols found.</p>';
      return;
    }
    grid.innerHTML = data.patrols.map(p => `
      <div class="patrol-card">
        <div class="patrol-header">
          <span class="patrol-status-badge ${p.status}">${p.status}</span>
          <span class="patrol-area">🏘️ ${p.neighbourhood}</span>
        </div>
        <div class="patrol-leader">👮 Led by: <strong>${p.leader}</strong></div>
        <div class="patrol-route">🗺️ ${p.route || 'Route TBD'}</div>
        <div class="patrol-members">
          👥 Members: <strong>${(p.members || []).join(', ') || 'None assigned'}</strong>
        </div>
        <div class="patrol-time">🕐 ${formatDateTime(p.scheduledAt)}</div>
      </div>
    `).join('');
  } catch (err) {
    grid.innerHTML = `<p style="color:var(--text-muted);text-align:center;padding:2rem;grid-column:1/-1">Could not load patrols (Java API offline?)</p>`;
  }
}

// ── System Status ─────────────────────────────────────────────────
async function checkServiceStatus() {
  // C Service
  checkService('C', `${API.c}/health`, 'statusIndicatorC', 'statusDetailsC', 'statusC');
  // Python API
  checkService('Python', `${API.python}/api/health`, 'statusIndicatorPython', 'statusDetailsPython', 'statusPython');
  // Java API
  checkService('Java', `${API.java}/api/health`, 'statusIndicatorJava', 'statusDetailsJava', 'statusJava');
}

async function checkService(name, url, indicatorId, detailsId, cardId) {
  const indicator = document.getElementById(indicatorId);
  const details   = document.getElementById(detailsId);
  const card      = document.getElementById(cardId);
  try {
    const data = await fetchJSON(url);
    indicator.textContent = '✅';
    card.classList.add('online');
    card.classList.remove('offline');
    const uptime = data.uptime_seconds !== undefined ? `Uptime: ${data.uptime_seconds}s` : '';
    const version = data.version ? `v${data.version}` : '';
    details.textContent = `Online · ${version} · ${uptime}`;
  } catch (err) {
    indicator.textContent = '❌';
    card.classList.add('offline');
    card.classList.remove('online');
    details.textContent = `Offline or unreachable — ${err.message}`;
  }
}

// ── Hash Tool ─────────────────────────────────────────────────────
async function computeHash() {
  const input  = document.getElementById('hashInput').value.trim();
  const result = document.getElementById('hashResult');
  if (!input) { result.textContent = 'Please enter some text first.'; result.classList.add('visible'); return; }
  try {
    const data = await fetchJSON(`${API.c}/hash?text=${encodeURIComponent(input)}`);
    result.textContent = `Input: "${data.input}"  →  DJB2: ${data.djb2_hash}  (hex: ${data.hex})`;
    result.classList.add('visible');
  } catch (err) {
    result.textContent = `Error: C service unavailable — ${err.message}`;
    result.classList.add('visible');
  }
}

document.getElementById('hashInput')?.addEventListener('keydown', e => {
  if (e.key === 'Enter') computeHash();
});

// ── Report Incident Modal ─────────────────────────────────────────
function openReportModal() {
  document.getElementById('reportModal').classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeReportModal(e) {
  if (!e || e.target === document.getElementById('reportModal')) {
    document.getElementById('reportModal').classList.remove('open');
    document.body.style.overflow = '';
    document.getElementById('submitFeedback').className = 'submit-feedback';
    document.getElementById('submitFeedback').textContent = '';
  }
}

async function submitIncident(e) {
  e.preventDefault();
  const feedback = document.getElementById('submitFeedback');
  const btn = e.target.querySelector('[type=submit]');
  btn.disabled = true;
  btn.textContent = 'Submitting…';

  const payload = {
    title:       document.getElementById('incTitle').value,
    description: document.getElementById('incDescription').value,
    category:    document.getElementById('incCategory').value,
    severity:    document.getElementById('incSeverity').value,
    location:    { address: document.getElementById('incAddress').value },
    reporter:    document.getElementById('incReporter').value || 'anonymous',
  };

  try {
    await fetchJSON(`${API.python}/api/incidents/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    feedback.textContent = '✅ Incident reported successfully! Thank you for keeping the community safe.';
    feedback.className = 'submit-feedback success';
    e.target.reset();
    setTimeout(() => { closeReportModal(); loadIncidents(); loadHeroStats(); }, 2000);
  } catch (err) {
    feedback.textContent = `❌ Failed to submit: ${err.message}. Please try again.`;
    feedback.className = 'submit-feedback error';
  } finally {
    btn.disabled = false;
    btn.textContent = 'Submit Report';
  }
}

// ── Initialise ────────────────────────────────────────────────────
(async function init() {
  await Promise.allSettled([
    loadHeroStats(),
    loadAlerts(),
    loadIncidents(),
    loadNeighbourhoods(),
    loadPatrols(),
    checkServiceStatus(),
  ]);

  // Refresh status every 30 seconds
  setInterval(checkServiceStatus, 30000);
})();
