import React from "react";

const ExpenseContext = React.createContext({
  totalExpenses: 0,
  expenses: [],
  addExpense: (expense) => {},
  removeExpense: (id) => {},
  editExpense: (expense) => {},
});

export default ExpenseContext;
