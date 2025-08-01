// Worker mode interface and logic
import { api } from './api.js';
import { populateDropdown, setAlert } from './ui.js';
import { setSelection, getSelection } from './state.js';
import * as gamify from './gamify.js';
import * as progress from './progress.js';

export async function initWorker() {
    const container = document.getElementById('worker-container');
    if (!container) return;
    container.classList.remove('d-none');
    await buildSelectors();
    setupButtons();
    renderSizeProgress();
}

async function buildSelectors() {
    const projSel = document.getElementById('selectProject');
    const motifSel = document.getElementById('selectMotif');
    const productSel = document.getElementById('selectProduct');
    const sizeSel = document.getElementById('selectSize');
    const stepSel = document.getElementById('selectStep');

    await populateDropdown(() => api.getAll('projects'), projSel);

    projSel.addEventListener('change', async () => {
        setSelection({ project_id: projSel.value });
        const motifsRes = await api.getAll('motifs');
        const motifs = Array.isArray(motifsRes) ? motifsRes : [];
        const list = motifs.filter(m => m.project_id == projSel.value);
        await populateDropdown(() => Promise.resolve(list), motifSel, null, 'name');
        motifSel.dispatchEvent(new Event('change'));
    });

    motifSel.addEventListener('change', async () => {
        setSelection({ motif_id: motifSel.value });
        const prodRes = await api.getAll('products');
        const products = Array.isArray(prodRes) ? prodRes : [];
        const list = products.filter(p => p.motif_id == motifSel.value);
        await populateDropdown(() => Promise.resolve(list), productSel, null, 'product_type');
        productSel.dispatchEvent(new Event('change'));
    });

    productSel.addEventListener('change', async () => {
        setSelection({ product_id: productSel.value });
        const sizesRes = await api.getAll('product_sizes');
        const sizes = Array.isArray(sizesRes) ? sizesRes : [];
        const list = sizes.filter(s => s.product_id == productSel.value);
        await populateDropdown(() => Promise.resolve(list), sizeSel, null, 'size_label');
        sizeSel.dispatchEvent(new Event('change'));
    });

    sizeSel.addEventListener('change', async () => {
        setSelection({ size_id: sizeSel.value });
        const stepsRes = await api.getAll('steps');
        const steps = Array.isArray(stepsRes) ? stepsRes : [];
        await populateDropdown(() => Promise.resolve(steps), stepSel, null, 'name');
        stepSel.dispatchEvent(new Event('change'));
    });

    stepSel.addEventListener('change', () => {
        setSelection({ step_id: stepSel.value });
        updateCurrentQuantity();
        renderSizeProgress();
    });

    projSel.dispatchEvent(new Event('change'));
}

function setupButtons() {
    document.getElementById('btnPlus').addEventListener('click', () => addQty(1));
    document.getElementById('btnMinus').addEventListener('click', () => addQty(-1));
}

function addQty(qty) {
    const sel = getSelection();
    if (!sel.step_id) {
        setAlert('Bitte Schritt auswählen', 'danger');
        return;
    }
    const entry = progress.createEntry(sel, qty);
    progress.saveEntry(entry);
    gamify.handleProgress(qty);
    updateCurrentQuantity();
    renderSizeProgress();
}

function updateCurrentQuantity() {
    const sel = getSelection();
    const list = progress.getEntries().filter(e =>
        e.product_id == sel.product_id &&
        e.product_size_id == sel.size_id &&
        e.step_id == sel.step_id
    );
    const qty = list.reduce((sum, e) => sum + e.quantity, 0);
    const display = document.getElementById('currentQuantity');
    if (display) display.textContent = qty;
}

async function renderSizeProgress() {
    const sel = getSelection();
    const area = document.getElementById('sizeProgressArea');
    if (!sel.product_id || !sel.step_id) {
        area.classList.add('d-none');
        return;
    }
    const sizesRes = await api.getAll('product_sizes');
    const sizes = Array.isArray(sizesRes) ? sizesRes.filter(s => s.product_id == sel.product_id) : [];
    if (sizes.length === 0) {
        area.classList.add('d-none');
        return;
    }
    const list = progress.getEntries().filter(e => e.product_id == sel.product_id && e.step_id == sel.step_id);
    const groups = {};
    list.forEach(e => {
        groups[e.product_size_id] = (groups[e.product_size_id] || 0) + e.quantity;
    });
    const body = area.querySelector('.card-body');
    body.innerHTML = '<h6 class="mb-3">📊 Fortschritt je Größe</h6>';
    sizes.forEach(sz => {
        const done = groups[sz.id] || 0;
        const target = sz.target_quantity || 0;
        const percent = target ? Math.min(100, (done / target) * 100) : 0;
        const wrapper = document.createElement('div');
        wrapper.className = 'mb-3';
        wrapper.innerHTML = `
            <div class="d-flex justify-content-between">
                <strong>${sz.size_label}</strong>
                <small>${done} / ${target}</small>
            </div>
            <div class="progress">
                <div class="progress-bar" role="progressbar" style="width: ${percent}%" aria-valuenow="${done}" aria-valuemin="0" aria-valuemax="${target}">${percent.toFixed(0)}%</div>
            </div>
        `;
        body.appendChild(wrapper);
    });
    area.classList.remove('d-none');
}
