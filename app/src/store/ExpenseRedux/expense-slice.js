import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// Asynchronous Thunks for Fetching and Storing Expenses
export const fetchExpenses = createAsyncThunk(
  "expenses/fetchExpenses",
  async (_, { getState }) => {
    const email = getState().auth.email;
    if (!email) throw new Error("User is not authenticated.");

    // Encode email for URL
    const encodedEmail = email.replace(/[@.]/g, "");
    const response = await axios.get(
      `https://expense-tracker1-274cd-default-rtdb.firebaseio.com/${encodedEmail}/expenses.json`
    );

    const expenses = response.data
      ? Object.keys(response.data).map((key) => ({
          id: key,
          ...response.data[key],
        }))
      : [];

    return expenses;
  }
);

export const addExpense = createAsyncThunk(
  "expenses/addExpense",
  async (expenseData, { getState }) => {
    const email = getState().auth.email;
    if (!email) throw new Error("User is not authenticated.");

    // Encode email for URL
    const encodedEmail = email.replace(/[@.]/g, "");
    const response = await axios.post(
      `https://expense-tracker1-274cd-default-rtdb.firebaseio.com/${encodedEmail}/expenses.json`,
      expenseData
    );

    return { id: response.data.name, ...expenseData };
  }
);

export const updateExpense = createAsyncThunk(
  "expenses/updateExpense",
  async ({ id, expenseData }, { getState }) => {
    const email = getState().auth.email;
    if (!email) throw new Error("User is not authenticated.");

    // Encode email for URL
    const encodedEmail = email.replace(/[@.]/g, "");
    await axios.put(
      `https://expense-tracker1-274cd-default-rtdb.firebaseio.com/${encodedEmail}/expenses/${id}.json`,
      expenseData
    );

    return { id, ...expenseData };
  }
);

export const deleteExpense = createAsyncThunk(
  "expenses/deleteExpense",
  async (id, { getState }) => {
    const email = getState().auth.email;
    if (!email) throw new Error("User is not authenticated.");

    // Encode email for URL
    const encodedEmail = email.replace(/[@.]/g, "");
    await axios.delete(
      `https://expense-tracker1-274cd-default-rtdb.firebaseio.com/${encodedEmail}/expenses/${id}.json`
    );

    return id;
  }
);

// Initial State
const initialState = {
  expenses: [],
  status: null,
  error: null,
  totalAmount: 0,
  showActivatePremium: false,
};

// Expense Slice
const expenseSlice = createSlice({
  name: "expenses",
  initialState,
  reducers: {
    addExpenseLocally(state, action) {
      state.expenses.push(action.payload);
      state.totalAmount += action.payload.amount;
      if (state.totalAmount > 10000) {
        state.showActivatePremium = true;
      }
    },
    resetPremiumStatus(state) {
      state.showActivatePremium = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchExpenses.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchExpenses.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.expenses = action.payload;
        state.totalAmount = action.payload.reduce(
          (total, expense) => total + expense.amount,
          0
        );
        state.showActivatePremium = state.totalAmount > 10000;
      })
      .addCase(fetchExpenses.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })
      .addCase(addExpense.fulfilled, (state, action) => {
        state.expenses.push(action.payload);
        state.totalAmount += action.payload.amount;
        if (state.totalAmount > 10000) {
          state.showActivatePremium = true;
        }
      })
      .addCase(updateExpense.fulfilled, (state, action) => {
        const index = state.expenses.findIndex(
          (expense) => expense.id === action.payload.id
        );
        if (index >= 0) {
          const oldAmount = state.expenses[index].amount;
          state.expenses[index] = action.payload;
          state.totalAmount =
            state.totalAmount - oldAmount + action.payload.amount;
          state.showActivatePremium = state.totalAmount > 10000;
        }
      })
      .addCase(deleteExpense.fulfilled, (state, action) => {
        const deletedExpense = state.expenses.find(
          (expense) => expense.id === action.payload
        );
        state.expenses = state.expenses.filter(
          (expense) => expense.id !== action.payload
        );
        state.totalAmount -= deletedExpense.amount;
        state.showActivatePremium = state.totalAmount > 10000;
      });
  },
});

export const expenseActions = expenseSlice.actions;
export default expenseSlice.reducer;
