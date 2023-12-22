import { configureStore } from "@reduxjs/toolkit";
import tokenSlice from "./slice/tokenSlice";
import todosSlice from "./slice/todosSlice";

export const store = configureStore({
  reducer: {
    token: tokenSlice,
    todos: todosSlice,
  },
});
