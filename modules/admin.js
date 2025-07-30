import { api } from "./api.js";
import { setAlert, populateDropdown } from './ui.js';

const resources = [
    { key: 'projects', label: 'Projekte', fields: ['name','description','start_date','end_date'] },
    { key: 'motifs', label: 'Motivgruppen', fields: ['project_id','name','description','sort_order'] },
    { key: 'products', label: 'Produkte', fields: ['motif_id','product_type','color','gender','article_number'] },
    { key: 'product_sizes', label: 'Produktgrößen', fields: ['product_id','size_label','target_quantity','actual_quantity'] },
    { key: 'steps', label: 'Arbeitsschritte', fields: ['name','description','sort_order','created_by','updated_by'] },
    { key: 'project_steps', label: 'Projekt-Schritte', fields: ['step_id','project_id','motif_id','custom_sort_order'] },
    { key: 'users', label: 'Nutzer', fields: ['username','role','password_hash','active'] },
    { key: 'machines', label: 'Maschinen', fields: ['name','machine_type','location','notes','last_used_at','updated_by','active'] }
];

const fkMap = {
    motifs: {
        project_id: { resource: 'projects', endpoint: () => api.getAll('projects') }
    },
    products: {
        motif_id: { resource: 'motifs', endpoint: () => api.getAll('motifs') }
    },
    product_sizes: {
        product_id: { resource: 'products', endpoint: () => api.getAll('products'), labelField: 'product_type' }
    },
    project_steps: {
        step_id: { resource: 'steps', endpoint: () => api.getAll('steps') },
        project_id: { resource: 'projects', endpoint: () => api.getAll('projects') },
        motif_id: { resource: 'motifs', endpoint: () => api.getAll('motifs') }
    },
    steps: {
        created_by: { resource: 'users', endpoint: () => api.getAll('users'), labelField: 'username' },
        updated_by: { resource: 'users', endpoint: () => api.getAll('users'), labelField: 'username' }
    },
    machines: {
        updated_by: { resource: 'users', endpoint: () => api.getAll('users'), labelField: 'username' }
    }
};

export function initAdmin() {
    const tabs = document.getElementById('admin-tabs');
    const content = document.getElementById('admin-content');
    tabs.innerHTML = '';
    content.innerHTML = '';

    resources.forEach((res, idx) => {
        const li = document.createElement('li');
        li.className = 'nav-item';
        li.innerHTML = `<button class="nav-link ${idx===0?'active':''}" data-bs-toggle="tab" data-bs-target="#tab-${res.key}" type="button">${res.label}</button>`;
        tabs.appendChild(li);

        const pane = document.createElement('div');
        pane.className = `tab-pane fade ${idx===0?'show active':''}`;
        pane.id = `tab-${res.key}`;
        content.appendChild(pane);
    });

    resources.forEach(res => loadResource(res));
}

async function loadResource(res) {
    const pane = document.getElementById(`tab-${res.key}`);
    pane.innerHTML = '<div class="text-center p-3"><div class="spinner-border" role="status"></div></div>';
    const data = await api.getAll(res.key) || [];
    pane.innerHTML = renderSection(res, data);
    addHandlers(res);
}

function renderSection(res, data) {
    return `
        <div class="mb-2">
            <button class="btn btn-sm btn-success" data-action="create" data-res="${res.key}">Neu</button>
        </div>
        <table class="table table-sm table-bordered">
            <thead><tr>${res.fields.map(f=>`<th>${f}</th>`).join('')}<th></th></tr></thead>
            <tbody>
                ${data.map(item => renderRow(res, item)).join('')}
            </tbody>
        </table>
        <div class="d-none" id="${res.key}-form-container"></div>
    `;
}

function renderRow(res, item) {
    return `<tr data-id="${item.id}">
        ${res.fields.map(f => `<td>${item[f] ?? ''}</td>`).join('')}
        <td>
            <button class="btn btn-sm btn-secondary me-1" data-action="edit" data-id="${item.id}">✎</button>
            <button class="btn btn-sm btn-danger" data-action="delete" data-id="${item.id}">🗑</button>
        </td>
    </tr>`;
}

function addHandlers(res) {
    const pane = document.getElementById(`tab-${res.key}`);
    pane.querySelector('[data-action="create"]').addEventListener('click', () => openForm(res));
    pane.querySelectorAll('[data-action="edit"]').forEach(btn => {
        btn.addEventListener('click', async () => {
            const id = btn.dataset.id;
            const [item] = await api.getAll(`${res.key}?id=${id}`);
            openForm(res, item);
        });
    });
    pane.querySelectorAll('[data-action="delete"]').forEach(btn => {
        btn.addEventListener('click', async () => {
            if (!confirm('Eintrag löschen?')) return;
            await api.remove(res.key, btn.dataset.id);
            setAlert('Gelöscht', 'success');
            loadResource(res);
            refreshDependentDropdowns(res.key);
        });
    });
}

async function openForm(res, item = {}) {
    const container = document.getElementById(`${res.key}-form-container`);
    container.innerHTML = await buildForm(res, item);
    container.classList.remove('d-none');

    if (res.key === 'projects') {
        flatpickr(container.querySelector('input[name="start_date"]'), { enableTime: true, dateFormat: 'Y-m-d H:i' });
        flatpickr(container.querySelector('input[name="end_date"]'), { enableTime: true, dateFormat: 'Y-m-d H:i' });
    }

    const fkCfg = fkMap[res.key] || {};
    for (const [field, cfg] of Object.entries(fkCfg)) {
        const select = container.querySelector(`select[name="${field}"]`);
        populateDropdown(cfg.endpoint, select, item[field], cfg.labelField || 'name');
    }

    const form = container.querySelector('form');
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const nameInput = form.querySelector('input[name="name"]');
        if (nameInput && !nameInput.value.trim()) {
            setAlert('Name darf nicht leer sein', 'danger');
            return;
        }
        const formData = new FormData(form);
        const data = {};
        formData.forEach((v,k)=>{data[k]=v});
        let result;
        if (item.id) {
            result = await api.update(res.key, item.id, data);
        } else {
            result = await api.create(res.key, data);
        }
        if (result && !result.error) {
            setAlert('Gespeichert', 'success');
            container.classList.add('d-none');
            loadResource(res);
            refreshDependentDropdowns(res.key);
        } else {
            const msg = result && result.error ? result.error : 'Fehler beim Speichern';
            setAlert(msg, 'danger');
        }
    });
    container.querySelector('[data-action="cancel"]').addEventListener('click', () => {
        container.classList.add('d-none');
    });
}

async function buildForm(res, item) {
    let fieldsHtml = '';
    const fkCfg = fkMap[res.key] || {};
    for (const f of res.fields) {
        if (fkCfg[f]) {
            fieldsHtml += `<div class="mb-2"><label class="form-label">${f}</label><select class="form-select" name="${f}"></select></div>`;
        } else if (res.key === 'projects' && (f === 'start_date' || f === 'end_date')) {
            fieldsHtml += `<div class="mb-2"><label class="form-label">${f}</label><input class="form-control date-input" name="${f}" value="${item[f] ?? ''}"></div>`;
        } else {
            fieldsHtml += `<div class="mb-2"><label class="form-label">${f}</label><input class="form-control" name="${f}" value="${item[f] ?? ''}"></div>`;
        }
    }
    return `<form class="border p-3 bg-light">${fieldsHtml}<button type="submit" class="btn btn-primary">Speichern</button>
        <button type="button" class="btn btn-secondary ms-2" data-action="cancel">Abbrechen</button>
    </form>`;
}


function refreshDependentDropdowns(changedResource) {
    Object.entries(fkMap).forEach(([resKey, fields]) => {
        Object.entries(fields).forEach(([field, cfg]) => {
            if (cfg.resource === changedResource) {
                document.querySelectorAll(`#${resKey}-form-container select[name="${field}"]`).forEach(sel => {
                    populateDropdown(cfg.endpoint, sel, sel.value, cfg.labelField || 'name');
                });
            }
        });
    });
}
