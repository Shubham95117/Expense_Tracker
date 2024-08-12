import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../../store/auth-slice";
import expenseReducer from "../../store/ExpenseRedux/expense-slice";

const store = configureStore({
  reducer: {
    auth: authReducer,
    expenses: expenseReducer,
  },
});

export default store;
