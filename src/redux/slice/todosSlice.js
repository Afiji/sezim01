import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { BASE_API } from "../../config";

export const fetchTodos = createAsyncThunk(
  "todos/fetchTodos",
  async (token, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${BASE_API}/todos/get-all-todos`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const createTodo = createAsyncThunk(
  "todos/createTodo",
  async ({ title, token }, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${BASE_API}/todos/create-todo`,
        { title },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      return response.data.todo;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const editTodoName = createAsyncThunk(
  "todos/editTodoName",
  async ({ todoId, newName, token }, { rejectWithValue }) => {
    try {
      const response = await axios.patch(
        `${BASE_API}/todos/edit-todo-name/${todoId}`,
        { newName: newName },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      return { todoId, ...response.data };
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const toggleTodoStatus = createAsyncThunk(
  "todos/toggleTodoStatus",
  async ({ todoId, newStatus, token }, { rejectWithValue }) => {
    try {
      const response = await axios.patch(
        `${BASE_API}/todos/edit-todo-status/${todoId}`,
        { status: newStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const deleteTodo = createAsyncThunk(
  "todos/deleteTodo",
  async ({ todoId, token }, { rejectWithValue }) => {
    try {
      const response = await axios.delete(
        `${BASE_API}/todos/delete-todo/${todoId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const deleteAllTodos = createAsyncThunk(
  "todos/deleteAllTodos",
  async (_, { getState, rejectWithValue }) => {
    const token = getState().auth.token;
    try {
      const response = await axios.delete(
        `${BASE_API}/todos/delete-all-todos`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const uploadTodoImage = createAsyncThunk(
  "todos/uploadTodoImage",
  async ({ todoId, file, token }, { rejectWithValue }) => {
    try {
      const formData = new FormData();
      formData.append("image", file);
      const response = await axios.post(
        `${BASE_API}/todos/upload-image/${todoId}`,
        formData,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const deleteTodoImage = createAsyncThunk(
  "todos/deleteTodoImage",
  async ({ todoId, token }, { rejectWithValue }) => {
    try {
      const response = await axios.delete(
        `${BASE_API}/todos/delete-image/${todoId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

const initialState = {
  todos: [],
  status: "idle",
  error: null,
  lastCreatedTodo: null,
  lastEditedTodo: null,
  lastToggledTodo: null,
  lastDeletedTodo: null,
};

const todosSlice = createSlice({
  name: "todos",
  initialState,
  reducers: {},
  extraReducers(builder) {
    builder
      .addCase(fetchTodos.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchTodos.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.todos = action.payload;
      })
      .addCase(fetchTodos.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      .addCase(editTodoName.fulfilled, (state, action) => {
        const index = state.todos.findIndex(
          (todo) => todo._id === action.meta.arg.todoId
        );
        if (index !== -1) {
          state.todos[index].title = action.meta.arg.newName;
        }
        state.lastEditedTodo = action.payload;
      })
      .addCase(toggleTodoStatus.fulfilled, (state, action) => {
        const index = state.todos.findIndex(
          (todo) => todo._id === action.meta.arg.todoId
        );
        if (index !== -1) {
          state.todos[index].status = action.meta.arg.newStatus;
        }
        state.lastToggledTodo = action.payload;
      })
      .addCase(deleteTodo.fulfilled, (state, action) => {
        state.todos = state.todos.filter(
          (todo) => todo._id !== action.meta.arg.todoId
        );
        state.lastDeletedTodo = action.payload;
      })
      .addCase(createTodo.fulfilled, (state, action) => {
        state.todos.unshift(action.payload);
        state.lastCreatedTodo = action.payload;
      })
      .addCase(deleteAllTodos.fulfilled, (state) => {
        state.todos = [];
      })
      .addCase(uploadTodoImage.fulfilled, (state, action) => {
        const index = state.todos.findIndex(
          (todo) => todo._id === action.meta.arg.todoId
        );
        if (index !== -1) {
          state.todos[index].imageUrl = action.payload.imageUrl;
        }
      })
      .addCase(deleteTodoImage.fulfilled, (state, action) => {
        const index = state.todos.findIndex(
          (todo) => todo._id === action.meta.arg.todoId
        );
        if (index !== -1) {
          state.todos[index].imageUrl = undefined;
        }
      });
  },
});

export default todosSlice.reducer;
