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
