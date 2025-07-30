export function showLoginForm() {
    document.getElementById('login-container').classList.remove('d-none');
    document.getElementById('dashboard-container').classList.add('d-none');
}

export function showDashboard() {
    document.getElementById('login-container').classList.add('d-none');
    document.getElementById('dashboard-container').classList.remove('d-none');
}

export function setAlert(message, type = 'danger') {
    const container = document.getElementById('alert-container');
    container.innerHTML = `<div class="alert alert-${type} alert-dismissible" role="alert">${message}<button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button></div>`;
}
