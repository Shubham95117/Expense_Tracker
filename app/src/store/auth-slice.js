import { createSlice } from "@reduxjs/toolkit";

const initialAuthState = {
  email: localStorage.getItem("email") || "",
  userId: localStorage.getItem("userId") || "",
  token: localStorage.getItem("token") || "",
  isAuthenticated: !!localStorage.getItem("token"),
};

const authSlice = createSlice({
  name: "auth",
  initialState: initialAuthState,
  reducers: {
    login(state, action) {
      state.email = action.payload.email;
      state.userId = action.payload.userId;
      state.token = action.payload.token;
      state.isAuthenticated = true;

      // Save to local storage
      localStorage.setItem("email", action.payload.email);
      localStorage.setItem("userId", action.payload.userId);
      localStorage.setItem("token", action.payload.token);
    },
    logout(state) {
      state.email = "";
      state.userId = "";
      state.token = "";
      state.isAuthenticated = false;

      // Remove from local storage
      localStorage.removeItem("email");
      localStorage.removeItem("userId");
      localStorage.removeItem("token");
    },
  },
});

export const authActions = authSlice.actions;
export default authSlice.reducer;
