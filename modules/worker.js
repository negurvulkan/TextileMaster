// Worker mode interface and logic
import { api } from './api.js';
import { populateDropdown, setAlert } from './ui.js';
import { getUser, setSelection, getSelection, getXp } from './state.js';
import * as gamify from './gamify.js';
import * as progress from './progress.js';

export async function initWorker() {
    const container = document.getElementById('worker-container');
    if (!container) return;
    container.classList.remove('d-none');
    renderHeader();
    await buildSelectors();
    setupButtons();
    renderProgressBars();
}

function renderHeader() {
    const user = getUser();
    document.getElementById('wh-user').textContent = user.username;
    updateXpBar();
    setInterval(() => {
        document.getElementById('wh-time').textContent = new Date().toLocaleTimeString();
    }, 1000);
}

async function buildSelectors() {
    const projSel = document.getElementById('sel-project');
    const motifSel = document.getElementById('sel-motif');
    const productSel = document.getElementById('sel-product');
    const sizeSel = document.getElementById('sel-size');
    const stepSel = document.getElementById('sel-step');

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
    });

    projSel.dispatchEvent(new Event('change'));
}

function setupButtons() {
    document.getElementById('btn-plus').addEventListener('click', () => addQty(1));
    document.getElementById('btn-minus').addEventListener('click', () => addQty(-1));
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
    updateXpBar();
    renderProgressBars();
}

function renderProgressBars() {
    const list = progress.getEntries();
    const container = document.getElementById('progress-bars');
    container.innerHTML = '';
    const groups = {};
    list.forEach(e => {
        const key = `${e.product_id}-${e.product_size_id}-${e.step_id}`;
        groups[key] = (groups[key] || 0) + e.quantity;
    });
    Object.entries(groups).forEach(([key, qty]) => {
        const [pid, sid, stepId] = key.split('-');
        const label = `P${pid} S${sid} Step${stepId}`;
        const percent = Math.min(100, Math.abs(qty) * 10);
        const wrapper = document.createElement('div');
        wrapper.className = 'mb-2';
        wrapper.innerHTML = `<div>${label}: ${qty}</div><div class="progress"><div class="progress-bar" role="progressbar" style="width:${percent}%"></div></div>`;
        container.appendChild(wrapper);
    });
}

function updateXpBar() {
    const xp = getXp();
    const lvl = gamify.getLevel();
    document.getElementById('xp-value').textContent = xp;
    document.getElementById('level-value').textContent = lvl;
}
