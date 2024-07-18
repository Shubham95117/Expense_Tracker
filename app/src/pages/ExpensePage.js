// src/pages/ExpensesPage.js
import React, { useState } from "react";
import ExpenseForm from "../components/Expense/ExpenseForm";
import ExpenseList from "../components/Expense/ExpenseList";

const ExpensesPage = () => {
  const [expenses, setExpenses] = useState([]);

  const addExpenseHandler = (expense) => {
    setExpenses((prevExpenses) => [...prevExpenses, expense]);
  };

  return (
    <div>
      <ExpenseForm onAddExpense={addExpenseHandler} />
      <ExpenseList expenses={expenses} />
    </div>
  );
};

export default ExpensesPage;
