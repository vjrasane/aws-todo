let BASE_URL = '';

async function initApiConfig() {
    const res = await fetch('/config.json', { cache: 'no-cache' });
    const cfg = await res.json();
    return cfg.apiUrl;
}

async function getApiUrl() {
    if (!BASE_URL) {
        BASE_URL = await initApiConfig();
    }
    return BASE_URL;
}

export const listTodos = async () => {
    const apiUrl = await getApiUrl();
    const res = await fetch(`${apiUrl}/todos`)
    return res.json();
};

export const createTodo = async (text: string) => {
    const apiUrl = await getApiUrl();
    const res = await fetch(`${apiUrl}/todos`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text }),
    });
    return res.json();
}

export const updateTodo = async (id: string, text: string, done: boolean) => {
    const apiUrl = await getApiUrl();
    await fetch(`${apiUrl}/todos/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text, done }),
    });
}

export const deleteTodo = async (id: string) => {
    const apiUrl = await getApiUrl();
    await fetch(`${apiUrl}/todos/${id}`, {
        method: 'DELETE',
    });
}