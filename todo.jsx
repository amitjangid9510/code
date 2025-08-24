import React, { useState } from "react";

export default function TodoApp() {
  const [task, setTask] = useState("");
  const [todos, setTodos] = useState([]);

  const addTodo = () => {
    if (task.trim() === "") return;
    setTodos(prev => [...prev, { text: task, completed: false }]);
    setTask("");
  };

  const toggleTodo = (index) => {
    setTodos(prev =>
      prev.map((todo, i) =>
        i === index ? { ...todo, completed: !todo.completed } : todo
      )
    );
  };

  const deleteTodo = (index) => {
    setTodos(prev => prev.filter((_, i) => i !== index));
  };

  return (
    <main className="min-h-screen bg-gray-50 flex flex-col items-center p-6">
      <h1 className="text-3xl font-bold mb-6">Simple To-Do App with Checkbox</h1>

      <div className="w-full max-w-md bg-white p-6 rounded shadow space-y-4">
        <div className="flex space-x-4">
          <input
            type="text"
            className="flex-grow border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Add new task..."
            value={task}
            onChange={(e) => setTask(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && addTodo()}
          />
          <button
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
            onClick={addTodo}
          >
            Add
          </button>
        </div>

        {todos.length === 0 && (
          <p className="text-gray-500 text-center">No tasks yet.</p>
        )}

        <ul className="space-y-2">
          {todos.map((todo, index) => (
            <li
              key={index}
              className="flex items-center justify-between p-2 border rounded bg-white"
            >
              <label className="flex items-center cursor-pointer flex-grow select-none">
                <input
                  type="checkbox"
                  checked={todo.completed}
                  onChange={() => toggleTodo(index)}
                  className="mr-3 w-5 h-5 text-blue-600 rounded"
                />
                <span
                  className={`${
                    todo.completed ? "line-through text-gray-500" : ""
                  }`}
                >
                  {todo.text}
                </span>
              </label>
              <button
                className="ml-4 text-red-500 hover:text-red-700"
                onClick={() => deleteTodo(index)}
              >
                Delete
              </button>
            </li>
          ))}
        </ul>
      </div>
    </main>
  );
}
