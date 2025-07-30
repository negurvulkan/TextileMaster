import * as state from './state.js';

export function createEntry(sel, quantity) {
    return {
        id: Date.now(),
        user_id: state.getUser().id,
        project_id: sel.project_id,
        motif_id: sel.motif_id,
        product_id: sel.product_id,
        product_size_id: sel.size_id,
        step_id: sel.step_id,
        quantity: quantity,
        timestamp: new Date().toISOString()
    };
}

export function saveEntry(entry) {
    const list = state.getProgress();
    list.push(entry);
    state.setProgress(list);
}

export function getEntries() {
    return state.getProgress();
}
