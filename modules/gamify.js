import { getXp, setXp, getCombo, setCombo } from './state.js';

export function handleProgress(qty) {
    const combo = getCombo();
    const xpGain = 10 * Math.max(1, combo + 1) * Math.abs(qty);
    addXp(xpGain);
    setCombo(combo + 1);
}

export function addXp(amount) {
    const xp = getXp() + amount;
    setXp(xp);
}

export function getLevel() {
    const xp = getXp();
    return Math.floor(xp / 100) + 1;
}
