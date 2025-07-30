export function showLoginForm() {
    document.getElementById('login-container').classList.remove('d-none');
    document.getElementById('dashboard-container').classList.add('d-none');
}

export function showDashboard() {
    document.getElementById('login-container').classList.add('d-none');
    document.getElementById('dashboard-container').classList.remove('d-none');
}

export function showAdminPanel() {
    document.getElementById('admin-container').classList.remove('d-none');
}

export function hideAdminPanel() {
    document.getElementById('admin-container').classList.add('d-none');
}

export function setAlert(message, type = 'danger') {
    const container = document.getElementById('alert-container');
    container.innerHTML = `<div class="alert alert-${type} alert-dismissible" role="alert">${message}<button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button></div>`;
}

export async function populateDropdown(endpointFn, selectEl, selectedId = null, labelField = 'name') {
    if (!selectEl) return;
    const data = await endpointFn() || [];
    selectEl.innerHTML = '';
    if (data.length === 0) {
        const opt = document.createElement('option');
        opt.disabled = true;
        opt.selected = true;
        opt.textContent = 'Kein Eintrag vorhanden';
        selectEl.appendChild(opt);
        return;
    }
    data.forEach(item => {
        const opt = document.createElement('option');
        opt.value = item.id;
        const label = item[labelField] ?? item.name ?? `ID ${item.id}`;
        opt.textContent = label;
        if (selectedId && parseInt(selectedId) === parseInt(item.id)) {
            opt.selected = true;
        }
        selectEl.appendChild(opt);
    });
}
