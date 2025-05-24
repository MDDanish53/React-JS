import { useState, useEffect } from "react";
import {TodoProvider} from "./contexts/TodoContext";
import TodoForm from './components/TodoForm';
import TodoItem from './components/TodoItem';

function App() {
  const [todos, setTodo] = useState([]); //todo coming from context is stored here, all todos are stored here

  const addTodo = (todo) => {
    setTodo((existingTodos) => [{ id: Date.now(), ...todo }, ...existingTodos]);
  };

  const updateTodo = (id, todo) => {
    setTodo((existingTodos) =>
      existingTodos.map((currTodo) => (currTodo.id === id ? todo : currTodo))
    );
  };

  const deleteTodo = (id) => {
    setTodo((existingTodos) =>
      existingTodos.filter((currTodo) => currTodo.id !== id)
    );
  };

  const toggleComplete = (id) => {
    setTodo((existingTodos) =>
      existingTodos.map((currTodo) =>
        currTodo.id === id
          ? { ...currTodo, checked: !currTodo.checked }
          : currTodo
      )
    );
  };

  //it injects existing todos from local storage in todo variable when page loads
  useEffect(() => {
    const todos = JSON.parse(localStorage.getItem("todos")); //JSON is used to structure the todo from string to object format

    if (todos && todos.length) {
      setTodo(todos);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("todos", JSON.stringify(todos));
  }, [todos]);

  return (
    <TodoProvider
      value={{ todos, addTodo, updateTodo, deleteTodo, toggleComplete }}
    >
      <div className="bg-[#172842] min-h-screen py-8">
        <div className="w-full max-w-2xl mx-auto shadow-md rounded-lg px-4 py-3 text-white">
          <h1 className="text-2xl font-bold text-center mb-8 mt-2">
            Manage Your Todos
          </h1>
          <div className="mb-4">
            {/* Todo form goes here */}
            <TodoForm />
          </div>
          <div className="flex flex-wrap gap-y-3">
            {/*Loop and Add TodoItem here */}
            {todos.map((indTodo) => (
              <div key={indTodo.id} className='w-full'>
                <TodoItem todo={indTodo} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </TodoProvider>
  );
}

export default App;
