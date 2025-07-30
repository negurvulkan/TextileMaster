import * as state from './state.js';

export function handleProgress(qty) {
    const combo = state.getCombo();
    const xpGain = 10 * Math.max(1, combo + 1) * Math.abs(qty);
    addXp(xpGain);
    state.setCombo(combo + 1);
}

export function addXp(amount) {
    const xp = state.getXp() + amount;
    state.setXp(xp);
}

export function getLevel() {
    const xp = state.getXp();
    return Math.floor(xp / 100) + 1;
}
