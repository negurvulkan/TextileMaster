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
