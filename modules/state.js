const USER_KEY = 'pt_user';
const STATE_KEY = 'pt_state';

export function setUser(user) {
    localStorage.setItem(USER_KEY, JSON.stringify(user));
}

export function getUser() {
    const data = localStorage.getItem(USER_KEY);
    return data ? JSON.parse(data) : null;
}

export function logoutUser() {
    localStorage.removeItem(USER_KEY);
    localStorage.removeItem(STATE_KEY);
}

export function isAdmin() {
    const user = getUser();
    return user && user.role === 'admin';
}

function getState() {
    const data = localStorage.getItem(STATE_KEY);
    return data ? JSON.parse(data) : { selection: {}, xp: 0, combo: 0, progress: [] };
}

function setState(state) {
    localStorage.setItem(STATE_KEY, JSON.stringify(state));
}

export function setSelection(partial) {
    const s = getState();
    s.selection = { ...s.selection, ...partial };
    setState(s);
}

export function getSelection() {
    return getState().selection;
}

export function setProgress(list) {
    const s = getState();
    s.progress = list;
    setState(s);
}

export function getProgress() {
    return getState().progress;
}

export function setXp(xp) {
    const s = getState();
    s.xp = xp;
    setState(s);
}

export function getXp() {
    return getState().xp;
}

export function setCombo(combo) {
    const s = getState();
    s.combo = combo;
    setState(s);
}

export function getCombo() {
    return getState().combo;
}
