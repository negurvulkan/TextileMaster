export async function loginUser(username, password) {
    try {
        const resp = await fetch('api/login.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password })
        });
        if (!resp.ok) {
            return null;
        }
        const data = await resp.json();
        if (data.error) {
            return null;
        }
        return data;
    } catch (e) {
        return null;
    }
}

export async function fetchOpenProjects() {
    return apiRequest('projects');
}

async function apiRequest(resource, method = 'GET', data = null, id = null) {
    const url = id ? `api/${resource}.php?id=${id}` : `api/${resource}.php`;
    const options = { method, headers: { 'Content-Type': 'application/json' } };
    if (data) {
        options.body = JSON.stringify(data);
    }
    const resp = await fetch(url, options);
    if (!resp.ok) {
        return null;
    }
    return resp.json();
}

export const api = {
    getAll: (res) => apiRequest(res),
    create: (res, data) => apiRequest(res, 'POST', data),
    update: (res, id, data) => apiRequest(res, 'PUT', data, id),
    remove: (res, id) => apiRequest(res, 'DELETE', null, id)
};
