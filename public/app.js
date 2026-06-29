/**
 * ============================================================================
 * CLIENT SCRIPT FOR SALESFLOW CRM (NEO ENTERPRISE UX)
 * Handles AJAX, State Management, Drag & Drop, and Advanced UI Rendering.
 * ============================================================================
 */

let state = {
    token: localStorage.getItem('sf_token') || null,
    user: JSON.parse(localStorage.getItem('sf_user')) || null,
    simulatedRole: null, 
    leads: [],
    interactions: [],
    auditLogs: [],
    metrics: null,
    selectedCallId: null,
    playInterval: null,
    theme: localStorage.getItem('sf_theme') || 'light',
    socket: null
};

// ----------------------------------------------------------------------------
// BOOTSTRAP & THEME MANAGEMENT
// ----------------------------------------------------------------------------
function initTheme() {
    document.documentElement.setAttribute('data-theme', state.theme);
    updateThemeIcon();
}

function toggleTheme() {
    state.theme = state.theme === 'light' ? 'dark' : 'light';
    document.documentElement.setAttribute('data-theme', state.theme);
    localStorage.setItem('sf_theme', state.theme);
    updateThemeIcon();
}

function updateThemeIcon() {
    const icon = document.getElementById('theme-icon');
    if (!icon) return;
    if (state.theme === 'dark') {
        icon.setAttribute('data-feather', 'sun');
    } else {
        icon.setAttribute('data-feather', 'moon');
    }
    feather.replace();
}

document.addEventListener('DOMContentLoaded', initTheme);

// ----------------------------------------------------------------------------
// API CALL HELPER
// ----------------------------------------------------------------------------
async function apiCall(endpoint, method = 'GET', body = null) {
    const headers = { 'Content-Type': 'application/json' };
    if (state.token) {
        headers['Authorization'] = `Bearer ${state.token}`;
    }
    if (state.simulatedRole && state.user && state.user.role === 'director') {
        headers['X-Simulated-Role'] = state.simulatedRole;
    }

    const config = { method, headers };
    if (body) {
        config.body = JSON.stringify(body);
    }

    const response = await fetch(endpoint, config);
    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
    }
    return response.json();
}

// ----------------------------------------------------------------------------
// AUTHENTICATION
// ----------------------------------------------------------------------------
async function handleLogin(e) {
    e.preventDefault();
    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;
    const errorAlert = document.getElementById('login-error');

    errorAlert.style.display = 'none';

    try {
        const data = await apiCall('/api/auth/login', 'POST', { email, password });
        
        state.token = data.token;
        state.user = data.user;
        state.simulatedRole = data.user.role;

        localStorage.setItem('sf_token', data.token);
        localStorage.setItem('sf_user', JSON.stringify(data.user));

        showToast('Successfully authenticated.', 'success');
        checkAuth();
    } catch (err) {
        errorAlert.innerHTML = `<i data-feather="alert-circle"></i> ${err.message}`;
        errorAlert.style.display = 'flex';
        feather.replace();
    }
}

function handleLogout() {
    if (state.socket) {
        state.socket.disconnect();
        state.socket = null;
    }
    localStorage.removeItem('sf_token');
    localStorage.removeItem('sf_user');
    state.token = null;
    state.user = null;
    state.simulatedRole = null;
    
    document.getElementById('login-screen').style.display = 'flex';
    document.getElementById('dashboard-screen').style.display = 'none';
    showToast('Session ended safely.', 'warning');
}

function initSocket() {
    if (state.token && !state.socket) {
        // Inicializar WebSocket enviando el JWT para la verificación perimetral
        state.socket = io({
            auth: {
                token: state.token
            }
        });

        state.socket.on('connect', () => {
            console.log('🔌 Conectado al servidor WebSocket en tiempo real.');
        });

        // Escuchar alertas de nuevos mensajes del servidor (Sprint 2)
        state.socket.on('new_message_alert', (data) => {
            showToast(`Mensaje entrante de ${data.from}: "${data.preview}"`, 'info');
        });

        state.socket.on('connect_error', (err) => {
            console.error('Error de conexión WebSocket:', err.message);
            showToast(`Error de conexión WebSocket: ${err.message}`, 'error');
        });

        state.socket.on('disconnect', () => {
            console.log('🔌 Desconectado del servidor WebSocket.');
        });
    }
}

function checkAuth() {
    if (state.token && state.user) {
        if (!state.simulatedRole) state.simulatedRole = state.user.role;

        document.getElementById('login-screen').style.display = 'none';
        document.getElementById('dashboard-screen').style.display = 'flex';
        document.getElementById('current-user-name').innerText = state.user.name;
        
        const roleLabels = {
            'sales_agent': 'Sales Agent',
            'team_leader': 'Team Leader',
            'qa_auditor': 'QA Auditor',
            'director': 'Director'
        };
        document.getElementById('current-user-role-label').innerText = roleLabels[state.simulatedRole] || state.simulatedRole;

        const switcher = document.getElementById('role-switcher-select');
        if (state.user.role === 'director') {
            switcher.style.display = 'block';
            switcher.value = state.simulatedRole;
        } else {
            switcher.style.display = 'none';
        }

        // Inicializar conexión Socket de tiempo real
        initSocket();
        fetchData();
    } else {
        document.getElementById('login-screen').style.display = 'flex';
        document.getElementById('dashboard-screen').style.display = 'none';
    }
}

function simulateRoleChange(role) {
    state.simulatedRole = role;
    const roleLabels = { 'sales_agent': 'Sales Agent', 'team_leader': 'Team Leader', 'qa_auditor': 'QA Auditor', 'director': 'Director' };
    document.getElementById('current-user-role-label').innerText = roleLabels[role] || role;
    
    if (state.playInterval) { clearInterval(state.playInterval); state.playInterval = null; }
    showToast(`Role assumed: ${roleLabels[role]}`, 'success');
    fetchData();
}

// ----------------------------------------------------------------------------
// DATA RETRIEVAL
// ----------------------------------------------------------------------------
async function fetchData() {
    try {
        state.leads = await apiCall('/api/leads');

        if (state.simulatedRole === 'director' || state.simulatedRole === 'qa_auditor') {
            state.interactions = await apiCall('/api/interactions');
            if (state.interactions.length > 0 && !state.selectedCallId) {
                state.selectedCallId = state.interactions[0].id;
            }
        } else { state.interactions = []; }

        if (state.simulatedRole === 'director') {
            state.auditLogs = await apiCall('/api/audit-logs');
        } else { state.auditLogs = []; }

        if (state.simulatedRole === 'director' || state.simulatedRole === 'team_leader') {
            state.metrics = await apiCall('/api/metrics');
        } else { state.metrics = null; }

        renderUI();
    } catch (err) {
        showToast(`Sync Error: ${err.message}`, 'danger');
        if (err.message.includes('Token') || err.message.includes('Acceso denegado')) {
            handleLogout();
        }
    }
}

// ----------------------------------------------------------------------------
// DRAG & DROP
// ----------------------------------------------------------------------------
let draggedCardId = null;
function handleDragStart(e) {
    draggedCardId = this.dataset.id;
    this.classList.add('dragging');
    e.dataTransfer.setData('text/plain', draggedCardId);
}
function handleDragEnd() { this.classList.remove('dragging'); draggedCardId = null; }
function handleDragOver(e) { e.preventDefault(); }
async function handleDrop(e) {
    e.preventDefault();
    const leadId = e.dataTransfer.getData('text/plain');
    const newStatus = this.dataset.status;
    try {
        await apiCall(`/api/leads/${leadId}`, 'PUT', { status: newStatus });
        if (newStatus === 'enrolled') showToast('Deal Won! Lead enrolled.', 'success');
        else showToast(`Moved to ${newStatus}`, 'success');
        fetchData();
    } catch (err) { showToast(`Update failed: ${err.message}`, 'danger'); }
}

// ----------------------------------------------------------------------------
// PROGRESSIVE DISCLOSURE (DRAWER)
// ----------------------------------------------------------------------------
function openLeadDrawer(leadId) {
    const lead = state.leads.find(l => l.id === leadId);
    if (!lead) return;

    const overlay = document.getElementById('drawer-overlay');
    const drawer = document.getElementById('detail-drawer');
    const content = document.getElementById('drawer-content');
    const footer = document.getElementById('drawer-footer');
    
    // UI State
    document.getElementById('drawer-title').innerText = `${lead.firstName} ${lead.lastName}`;
    overlay.classList.add('active');
    drawer.classList.add('open');

    // Render Skeletal Load then content
    content.innerHTML = `
        <div class="skeleton">
            <div class="skeleton-title"></div>
            <div class="skeleton-text"></div>
            <div class="skeleton-text"></div>
        </div>
    `;

    setTimeout(() => {
        content.innerHTML = `
            <div class="detail-group">
                <span class="detail-label">Status</span>
                <span class="badge badge-blue" style="width: max-content;">${lead.status.toUpperCase()}</span>
            </div>
            <div class="detail-group">
                <span class="detail-label">Email Address</span>
                <div class="detail-value">${lead.email}</div>
            </div>
            <div class="detail-group">
                <span class="detail-label">Phone Number</span>
                <div class="detail-value">${lead.phone}</div>
            </div>
            <div class="detail-group">
                <span class="detail-label">Created At</span>
                <div class="detail-value">${lead.date}</div>
            </div>
            <div class="detail-group">
                <span class="detail-label">Agent (Owner)</span>
                <div class="detail-value">${lead.agentName}</div>
            </div>
        `;
        
        footer.innerHTML = `
            <button class="btn btn-secondary" onclick="closeDrawer()">Cancel</button>
            <button class="btn btn-primary"><i data-feather="edit-2" style="width:14px;height:14px;"></i> Edit Lead</button>
        `;
        feather.replace();
    }, 300); // Simulate network fetch for deep details
}

function closeDrawer() {
    document.getElementById('drawer-overlay').classList.remove('active');
    document.getElementById('detail-drawer').classList.remove('open');
}

// ----------------------------------------------------------------------------
// HOTKEYS & COMMAND PALETTE
// ----------------------------------------------------------------------------
function toggleCommandPalette() {
    const pal = document.getElementById('cmd-palette');
    const input = document.getElementById('cmd-input');
    if (pal.classList.contains('active')) {
        pal.classList.remove('active');
    } else {
        pal.classList.add('active');
        input.value = '';
        renderCmdResults('');
        setTimeout(() => input.focus(), 100);
    }
}

document.addEventListener('keydown', (e) => {
    // Escape closes modals
    if (e.key === 'Escape') {
        closeDrawer();
        document.getElementById('cmd-palette').classList.remove('active');
    }
    // Ctrl+K opens Command Palette
    if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        toggleCommandPalette();
    }
});

document.getElementById('cmd-input').addEventListener('input', (e) => {
    renderCmdResults(e.target.value.toLowerCase());
});

function renderCmdResults(query) {
    const results = document.getElementById('cmd-results');
    if (!query) {
        results.innerHTML = `
            <div style="padding: 1rem; color: var(--text-tertiary); font-size: 0.875rem; text-align: center;">
                Start typing to search leads or commands...
            </div>
        `;
        return;
    }

    const filteredLeads = state.leads.filter(l => 
        l.firstName.toLowerCase().includes(query) || 
        l.lastName.toLowerCase().includes(query) || 
        l.email.toLowerCase().includes(query)
    );

    if (filteredLeads.length === 0) {
        results.innerHTML = `<div style="padding: 1rem; color: var(--text-tertiary); font-size: 0.875rem; text-align: center;">No results found for "${query}"</div>`;
        return;
    }

    results.innerHTML = filteredLeads.map(l => `
        <div class="cmd-item" onclick="openLeadDrawer('${l.id}'); toggleCommandPalette();">
            <div>
                <div style="font-weight: 500;">${l.firstName} ${l.lastName}</div>
                <div style="font-size: 0.75rem; color: var(--text-tertiary);">${l.email}</div>
            </div>
            <span class="badge badge-neutral">${l.status}</span>
        </div>
    `).join('');
}

// ----------------------------------------------------------------------------
// QA EVALUATION (MOCK PLAYER)
// ----------------------------------------------------------------------------
function selectCall(callId) {
    state.selectedCallId = callId;
    if (state.playInterval) { clearInterval(state.playInterval); state.playInterval = null; }
    renderUI();
}

// ----------------------------------------------------------------------------
// TOAST NOTIFICATIONS
// ----------------------------------------------------------------------------
function showToast(message, type = 'success') {
    const container = document.getElementById('toast-container');
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    
    let icon = 'info';
    if (type === 'success') icon = 'check-circle';
    if (type === 'danger') icon = 'alert-circle';
    if (type === 'warning') icon = 'alert-triangle';

    toast.innerHTML = `<i data-feather="${icon}"></i> <span>${message}</span>`;
    container.appendChild(toast);
    feather.replace();

    setTimeout(() => {
        toast.style.animation = 'slideIn 0.3s reverse';
        setTimeout(() => toast.remove(), 300);
    }, 3500);
}

// ----------------------------------------------------------------------------
// RENDER INTERFACES
// ----------------------------------------------------------------------------
function renderUI() {
    const statsSection = document.getElementById('stats-section');
    const mainContent = document.getElementById('main-content-section');
    const secondaryContent = document.getElementById('secondary-content-section');

    statsSection.innerHTML = '';
    mainContent.innerHTML = '';
    secondaryContent.innerHTML = '';

    // ==========================================================
    // ROLE: SALES AGENT
    // ==========================================================
    if (state.simulatedRole === 'sales_agent') {
        const myLeads = state.leads;
        const wonCount = myLeads.filter(l => l.status === 'enrolled').length;

        statsSection.innerHTML = `
            <div class="card metric-widget border-blue">
                <div class="metric-title">Active Leads</div>
                <div class="metric-value">${myLeads.length}</div>
                <div class="metric-trend"><span class="text-success"><i data-feather="shield" style="width:12px;height:12px;"></i> RLS Secured</span></div>
            </div>
            <div class="card metric-widget border-emerald">
                <div class="metric-title">Won Deals</div>
                <div class="metric-value">${wonCount}</div>
            </div>
            <div class="card metric-widget border-purple">
                <div class="metric-title">To Follow-Up</div>
                <div class="metric-value">${myLeads.filter(l => l.status === 'scheduled').length}</div>
            </div>
            <div class="card metric-widget border-amber">
                <div class="metric-title">Est. Commission</div>
                <div class="metric-value">$${(wonCount * 150).toFixed(0)}</div>
            </div>
        `;

        mainContent.innerHTML = `
            <div style="grid-column: span 12;">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.5rem;">
                    <h2>Active Pipeline</h2>
                    <button class="btn btn-primary"><i data-feather="plus"></i> New Deal</button>
                </div>
                <div class="kanban-container">
                    ${['new', 'contacted', 'scheduled', 'enrolled'].map(status => {
                        const filtered = state.leads.filter(l => l.status === status);
                        return `
                            <div class="kanban-column" data-status="${status}">
                                <div class="column-header">
                                    <span class="column-title">${status}</span>
                                    <span class="column-badge">${filtered.length}</span>
                                </div>
                                <div class="kanban-cards-wrapper" id="col-${status}" data-status="${status}">
                                    ${filtered.map(lead => `
                                        <div class="kanban-card" draggable="true" data-id="${lead.id}" onclick="openLeadDrawer('${lead.id}')">
                                            <div class="card-header">
                                                <div class="card-title">${lead.firstName} ${lead.lastName}</div>
                                            </div>
                                            <div class="card-meta" style="margin-bottom: 0.5rem;"><i data-feather="mail" style="width:12px;height:12px;margin-right:4px;"></i>${lead.email}</div>
                                            <div style="display:flex; justify-content:space-between; align-items:center;">
                                                <span class="status-dot bg-${lead.status}"></span>
                                                <span style="font-size:0.7rem; color:var(--text-tertiary);">${lead.date}</span>
                                            </div>
                                        </div>
                                    `).join('')}
                                </div>
                            </div>
                        `;
                    }).join('')}
                </div>
            </div>
        `;

        document.querySelectorAll('.kanban-card').forEach(card => {
            card.addEventListener('dragstart', handleDragStart);
            card.addEventListener('dragend', handleDragEnd);
        });
        document.querySelectorAll('.kanban-cards-wrapper').forEach(wrapper => {
            wrapper.addEventListener('dragover', handleDragOver);
            wrapper.addEventListener('drop', handleDrop);
        });
    }

    // ==========================================================
    // ROLE: DIRECTOR
    // ==========================================================
    else if (state.simulatedRole === 'director') {
        const m = state.metrics || { totalIncome: '$0', cac: '$0', conversionRate: '0%', forecast: '$0' };
        
        statsSection.innerHTML = `
            <div class="card metric-widget border-blue">
                <div class="metric-title">Global Revenue</div>
                <div class="metric-value">${m.totalIncome || '$0'}</div>
            </div>
            <div class="card metric-widget border-emerald">
                <div class="metric-title">CAC</div>
                <div class="metric-value">${m.cac || '$0'}</div>
                <div class="metric-trend"><span class="text-success">▼ 5%</span> vs last month</div>
            </div>
            <div class="card metric-widget border-purple">
                <div class="metric-title">Conversion Rate</div>
                <div class="metric-value">${m.conversionRate}</div>
            </div>
            <div class="card metric-widget border-amber">
                <div class="metric-title">Predictive Forecast</div>
                <div class="metric-value">${m.forecast || '$0'}</div>
            </div>
        `;

        mainContent.innerHTML = `
            <div class="card" style="grid-column: span 12;">
                <h3 style="margin-bottom: 1.5rem; display: flex; align-items: center; gap: 0.5rem;"><i data-feather="activity"></i> Executive ARCO & Directory</h3>
                <div class="table-container">
                    <table>
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>Status</th>
                                <th>Owner</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${state.leads.map(l => `
                                <tr>
                                    <td><strong>${l.firstName} ${l.lastName}</strong><br><span style="font-size:0.75rem; color:var(--text-tertiary);">${l.email}</span></td>
                                    <td><span class="badge badge-neutral">${l.status.toUpperCase()}</span></td>
                                    <td>${l.agentName}</td>
                                    <td>
                                        <button class="btn btn-secondary" style="padding: 0.25rem 0.5rem; font-size: 0.75rem;" onclick="openLeadDrawer('${l.id}')">View</button>
                                    </td>
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>
                </div>
            </div>
        `;

        secondaryContent.innerHTML = `
            <div class="card" style="grid-column: span 12;">
                <h3 style="margin-bottom: 1.5rem; display: flex; align-items: center; gap: 0.5rem;"><i data-feather="shield"></i> Immutable Audit Trail</h3>
                <div class="table-container">
                    <table>
                        <thead>
                            <tr>
                                <th>Log ID</th>
                                <th>Operator</th>
                                <th>Action</th>
                                <th>Target</th>
                                <th>Delta</th>
                                <th>Timestamp</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${state.auditLogs.map(log => `
                                <tr>
                                    <td style="font-family:monospace; color:var(--text-tertiary);">#${log.id}</td>
                                    <td>${log.actor} <span class="badge badge-neutral" style="font-size:0.6rem;">${log.role}</span></td>
                                    <td><span class="${log.action.includes('update') ? 'text-warning' : 'text-primary'}">${log.action.toUpperCase()}</span></td>
                                    <td style="font-family:monospace;">${log.target}</td>
                                    <td style="max-width: 200px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; font-size:0.8rem;">${log.delta}</td>
                                    <td style="font-size:0.75rem; color:var(--text-tertiary);">${log.date}</td>
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>
                </div>
            </div>
        `;
    }

    feather.replace();
}

// ----------------------------------------------------------------------------
// INITIALIZATION
// ----------------------------------------------------------------------------
checkAuth();
