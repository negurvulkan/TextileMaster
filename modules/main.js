import { loginUser } from './api.js';
import { setUser, getUser, isAdmin } from './state.js';
import { showLoginForm, showDashboard, hideDashboard, setAlert, showAdminPanel, hideAdminPanel, showAdminToggleButton, hideAdminToggleButton } from './ui.js';
import { initAdmin } from './admin.js';
import { initWorker } from './worker.js';

document.addEventListener('DOMContentLoaded', () => {
    const toggleBtn = document.getElementById('admin-toggle-btn');

    const user = getUser();
    if (user) {
        showDashboard();
        initWorker();
        if (isAdmin()) {
            hideAdminPanel();
            showAdminToggleButton('Adminbereich');
        } else {
            hideAdminPanel();
            hideAdminToggleButton();
        }
    } else {
        showLoginForm();
        hideAdminPanel();
        hideAdminToggleButton();
    }

    if (toggleBtn) {
        toggleBtn.addEventListener('click', () => {
            const adminVisible = !document.getElementById('admin-container').classList.contains('d-none');
            if (adminVisible) {
                hideAdminPanel();
                showDashboard();
                showAdminToggleButton('Adminbereich');
            } else {
                initAdmin();
                showAdminPanel();
                hideDashboard();
                showAdminToggleButton('Benutzeransicht');
            }
        });
    }

    const btn = document.getElementById('login-btn');
    btn.addEventListener('click', async () => {
        btn.disabled = true;
        const username = document.getElementById('username').value.trim();
        const password = document.getElementById('password').value;
        const data = await loginUser(username, password);
        btn.disabled = false;
        if (data) {
            setUser(data);
            setAlert('Login erfolgreich', 'success');
            showDashboard();
            initWorker();
            if (isAdmin()) {
                hideAdminPanel();
                showAdminToggleButton('Adminbereich');
            } else {
                hideAdminPanel();
                hideAdminToggleButton();
            }
        } else {
            setAlert('Login fehlgeschlagen', 'danger');
        }
    });
});
