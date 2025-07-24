import { useEffect, useState } from 'react';
import { toast } from 'react-hot-toast';
import { createTodo, deleteTodo, listTodos, updateTodo } from './api';

type Todo = {
  id: string
  text: string
  done: boolean
}

function App() {
  const [todos, setTodos] = useState<Todo[]>([])
  const [input, setInput] = useState('')

  useEffect(() => {
    (async () => {
      try {
        const todos = await listTodos()
        setTodos(todos)
      } catch (error) {
        console.error('Failed to fetch todos:', error)
        toast.error('Failed to load todos')
      }
    })()
  }, [])

  const addTodo = async () => {
    try {
      if (input.trim() === '') return
      const todo = await createTodo(input.trim())
      setTodos([...todos, todo])
      setInput('')
    } catch (error) {
      console.error('Failed to create todo:', error)
      toast.error('Failed to create todo')
    }
  }

  const toggleDone = async (id: string) => {
    try {
      const todo = todos.find(todo => todo.id === id)
      if (!todo) return
      await updateTodo(todo.id, todo.text, !todo.done);
      setTodos(todos.map(t => t.id === id ? { ...t, done: !t.done } : t))
    } catch (error) {
      console.error('Failed to update todo:', error)
      toast.error('Failed to update todo')
    }
  }

  const removeTodo = async (id: string) => {
    try {
      const todo = todos.find(todo => todo.id === id)
      if (!todo) return
      await deleteTodo(todo.id);
      setTodos(todos.filter(t => t.id !== id))
    } catch (error) {
      console.error('Failed to delete todo:', error)
      toast.error('Failed to delete todo')
    }
  }

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-md mx-auto bg-white rounded-xl shadow p-6 space-y-4">
        <h1 className="text-2xl font-bold">TODO List</h1>

        <div className="flex space-x-2">
          <input
            type="text"
            className="flex-grow border rounded px-3 py-1"
            placeholder="Add new task"
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && addTodo()}
          />
          <button
            onClick={addTodo}
            className="bg-blue-500 text-white px-4 py-1 rounded hover:bg-blue-600"
          >
            Add
          </button>
        </div>

        <ul className="space-y-2">
          {todos.map(todo => (
            <li
              key={todo.id}
              className="flex items-center justify-between bg-gray-50 px-3 py-2 rounded border"
            >
              <label className="flex items-center space-x-2 flex-grow">
                <input
                  type="checkbox"
                  checked={todo.done}
                  onChange={() => toggleDone(todo.id)}
                />
                <span className={todo.done ? 'line-through text-gray-400' : ''}>
                  {todo.text}
                </span>
              </label>
              <button
                onClick={() => removeTodo(todo.id)}
                className="text-red-500 hover:text-red-700 text-sm"
              >
                Delete
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}

export default App
