import { loginUser } from './api.js';
import { setUser, getUser, logoutUser, isAdmin } from './state.js';
import { showLoginForm, showDashboard, setAlert, showAdminPanel, hideAdminPanel } from './ui.js';
import { initAdmin } from './admin.js';

document.addEventListener('DOMContentLoaded', () => {
    const user = getUser();
    if (user) {
        showDashboard();
        if (isAdmin()) {
            showAdminPanel();
            initAdmin();
        } else {
            hideAdminPanel();
        }
    } else {
        showLoginForm();
        hideAdminPanel();
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
            if (isAdmin()) {
                showAdminPanel();
                initAdmin();
            } else {
                hideAdminPanel();
            }
        } else {
            setAlert('Login fehlgeschlagen', 'danger');
        }
    });
});
