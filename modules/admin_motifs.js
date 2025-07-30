import { fetchOpenProjects } from './api.js';

export async function populateProjectDropdown(selectEl, selectedId = null) {
    if (!selectEl) return;
    const projects = await fetchOpenProjects() || [];
    selectEl.innerHTML = '';
    if (projects.length === 0) {
        const opt = document.createElement('option');
        opt.disabled = true;
        opt.selected = true;
        opt.textContent = 'Kein Projekt verfügbar';
        selectEl.appendChild(opt);
        return;
    }
    projects.forEach(p => {
        const opt = document.createElement('option');
        opt.value = p.id;
        opt.textContent = p.name;
        if (selectedId && parseInt(selectedId) === parseInt(p.id)) {
            opt.selected = true;
        }
        selectEl.appendChild(opt);
    });
}
