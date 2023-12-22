import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  token: localStorage.getItem("token") || null,
};

const tokenSlice = createSlice({
  name: "token",
  initialState,
  reducers: {
    HANDLE_TOKEN(state, action) {
      console.log(action.payload);
      state.token = action.payload;
    },
    CLEAR_TOKEN(state) {
      localStorage.removeItem("token");
      state.token = null;
    },
  },
});

export const { HANDLE_TOKEN, CLEAR_TOKEN } = tokenSlice.actions;
export default tokenSlice.reducer;
