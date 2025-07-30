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
        const motifs = (await api.getAll('motifs')) || [];
        const list = motifs.filter(m => m.project_id == projSel.value);
        motifSel.innerHTML = '';
        list.forEach(m => {
            motifSel.appendChild(new Option(m.name, m.id));
        });
        motifSel.dispatchEvent(new Event('change'));
    });

    motifSel.addEventListener('change', async () => {
        setSelection({ motif_id: motifSel.value });
        const products = (await api.getAll('products')) || [];
        const list = products.filter(p => p.motif_id == motifSel.value);
        productSel.innerHTML = '';
        list.forEach(p => productSel.appendChild(new Option(p.product_type, p.id)));
        productSel.dispatchEvent(new Event('change'));
    });

    productSel.addEventListener('change', async () => {
        setSelection({ product_id: productSel.value });
        const sizes = (await api.getAll('product_sizes')) || [];
        const list = sizes.filter(s => s.product_id == productSel.value);
        sizeSel.innerHTML = '';
        list.forEach(s => sizeSel.appendChild(new Option(s.size_label, s.id)));
        sizeSel.dispatchEvent(new Event('change'));
    });

    sizeSel.addEventListener('change', async () => {
        setSelection({ size_id: sizeSel.value });
        const steps = (await api.getAll('steps')) || [];
        stepSel.innerHTML = '';
        steps.forEach(st => stepSel.appendChild(new Option(st.name, st.id)));
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
