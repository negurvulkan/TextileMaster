const USER_KEY = 'pt_user';

export function setUser(user) {
    localStorage.setItem(USER_KEY, JSON.stringify(user));
}

export function getUser() {
    const data = localStorage.getItem(USER_KEY);
    return data ? JSON.parse(data) : null;
}

export function logoutUser() {
    localStorage.removeItem(USER_KEY);
}
