# Redux toolkit setup

1. Create a store which is also called "single source of truth" as :

```
import { configureStore } from "@reduxjs/toolkit";
export const store = configureStore({});
```

2. Introducing reducers to store to update values through reducers i.e awaring store about where are the reducers , for this we need to create the reducers :

for reducers we need to create a slice i.e features in todoSlice.js file

to create slice we need the name, initialState, and list of reducers so we create them as :

```
import { createSlice, nanoid } from "@reduxjs/toolkit";

//initial state of store
const initialState = {
  todos: [{
    id: 1,
    text: "Hello Danish"
  }]
};

//creating a slice
export const todoSlice = createSlice({
  name: "Danish",
  initialState,
  reducers: {
    addTodo: (state, action) => {
      const todo = {
        id: nanoid(),
        text: action.payload,
      };
      state.todos.push(todo);
    },
    removeTodo: (state, action) => {
      state.todos = state.todos.filter((todo) => todo.id !== action.payload);
    },
  },
});

//will be used in components
export const { addTodo, removeTodo } = todoSlice.actions;

//awaring store about reducers to maintain the value updation through the registered reducers
export default todoSlice.reducer;
```

the name of slice is "Danish"
the initial state has an todos key with a array value having index as object
the reducer is an object with key: function pairs

in the function of reducer we have access of two things : state and action

in state we get the updated state value in the store
in action we get action.payload and other things

in addTodo, we created a todo in which we generated a id using nanoid() and extracted the text value of todo using action.payload

as we have access of the state so we pushed our todo in the state of todos as here the state is preserved i.e.

```
 addTodo: (state, action) => {
      const todo = {
        id: nanoid(),
        text: action.payload,
      };
      state.todos.push(todo);
```

export all reducers individually as we don't know which reducer will be used in which component as :

```
export const { addTodo, removeTodo } = todoSlice.actions;
```

export main source of reducers because we want to work with it in our state inside our store

3. Now give the list of reducers to the store as :

```
import { configureStore } from "@reduxjs/toolkit";
import todoReducer from "../features/todo/todoSlice";

export const store = configureStore({
  reducer: todoReducer,
});
```

4. Now we create our components :

4.1 - AddTodo.jsx :

```
import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { addTodo } from "../features/todo/todoSlice";

function AddTodo() {
  const [input, setInput] = useState("");
  const dispatch = useDispatch();

  const addTodoHandler = (e) => {
    e.preventDefault();
    dispatch(addTodo(input)); //calling addTodo reducer and adding the todo
    setInput("");
  };

  return (
    <form onSubmit={addTodoHandler} className="space-x-3 mt-12">
      <input
        type="text"
        className="bg-gray-800 rounded border border-gray-700 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-900 text-base outline-none text-gray-100 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out"
        placeholder="Enter a Todo..."
        value={input}
        onChange={(e) => setInput(e.target.value)}
      />
      <button
        type="submit"
        className="text-white bg-indigo-500 border-0 py-2 px-6 focus:outline-none hover:bg-indigo-600 rounded text-lg"
      >
        Add Todo
      </button>
    </form>
  );
}

export default AddTodo;
```

here, we import our required reducers

in AddTodo.jsx we need to send the reducer so we use useDispatch() method as :

```
import { addTodo } from "../features/todo/todoSlice";
const dispatch = useDispatch();
dispatch(addTodo(input));
```

4.2 - Todos.jsx :

```
import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { removeTodo } from "../features/todo/todoSlice";

function Todos() {
  const todos = useSelector((state) => state.todos); //accessing all the todos
  const dispatch = useDispatch();

  return (
    <>
     <div>Todos</div>
    <ul className="list-none">
        {todos.map((todo) => (
          <li
            className="mt-4 flex items-center bg-zinc-800 px-4 py-2 rounded gap-x-2"
            key={todo.id}
          >
            <div className='text-white'>{todo.text}</div>
            <button
             onClick={() => dispatch(removeTodo(todo.id))}
             className="text-white bg-red-500 border-0 py-1 px-2 focus:outline-none hover:bg-red-600 rounded text-md"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-6 h-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
                />
              </svg>
            </button>
          </li>
        ))}
      </ul>
    </>
  );
}

export default Todos;
```

here we need to get the values(all todo values), to do this we need the access of the state and we pick todos as required value as :

```
const todos = useSelector((state) => state.todos);
```

to display these values, as todos is an array, we use map method to display these todos:

```
<ul className="list-none">
 {todos.map((todo) => (
          <li key={todo.id}>
          <div>{todo.text}</div>
            <button
             onClick={() => dispatch(removeTodo(todo.id))}
            >
              <svg<path/></svg>
            </button>
          </li>
          ))}
 </ul>
```

here we successfully implemented loop iterations through unique todo id.

in removeTodo functionality we send some values to the store so here we use useDispatch() method and we call our reducer removeTodo by passing the todo.id to remove a particular todo, we add this method in delete button. as we apply loop on todos we have access to all todos so we apply this functionality in the loop as :

```
<button onClick={() => dispatch(removeTodo(todo.id))}>
  <svg<path/></svg>
</button>
```

this button will delete the particular todo when it is clicked.

