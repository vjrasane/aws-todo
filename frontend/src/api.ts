
export const listTodos = async () => {
    const res = await fetch(`/api/todos`)
    return res.json();
};

export const createTodo = async (text: string) => {
    const res = await fetch(`/api/todos`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text }),
    });
    return res.json();
}

export const updateTodo = async (id: string, text: string, done: boolean) => {
    await fetch(`/api/todos/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text, done }),
    });
}

export const deleteTodo = async (id: string) => {
    await fetch(`/api/todos/${id}`, {
        method: 'DELETE',
    });
}