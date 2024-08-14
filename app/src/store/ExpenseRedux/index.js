import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../../store/auth-slice";
import expenseReducer from "../../store/ExpenseRedux/expense-slice";
import themeReducer from "../theme-slice";
const store = configureStore({
  reducer: {
    auth: authReducer,
    expenses: expenseReducer,
    theme: themeReducer,
  },
});

export default store;
