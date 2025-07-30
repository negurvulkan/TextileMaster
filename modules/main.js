import { loginUser } from './api.js';
import { setUser, getUser, logoutUser } from './state.js';
import { showLoginForm, showDashboard, setAlert } from './ui.js';

document.addEventListener('DOMContentLoaded', () => {
    const user = getUser();
    if (user) {
        showDashboard();
    } else {
        showLoginForm();
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
        } else {
            setAlert('Login fehlgeschlagen', 'danger');
        }
    });
});
