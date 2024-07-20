import React, { useState, useEffect } from "react";
import axios from "axios";
import ExpenseForm from "../components/Expense/ExpenseForm";
import ExpenseList from "../components/Expense/ExpenseList";

const ExpensesPage = () => {
  const [expenses, setExpenses] = useState([]);

  useEffect(() => {
    const fetchExpenses = async () => {
      try {
        const response = await axios.get(
          "https://expense-tracker-5058d-default-rtdb.firebaseio.com/expenses.json"
        );
        const expensesData = Object.keys(response.data).map((key) => ({
          id: key,
          ...response.data[key],
        }));
        setExpenses(expensesData);
      } catch (error) {
        console.error("Failed to fetch expenses:", error);
      }
    };

    fetchExpenses();
  }, []);

  const addExpenseHandler = (expense) => {
    setExpenses((prevExpenses) => [...prevExpenses, expense]);
  };

  const editExpenseHandler = (id, updatedData) => {
    setExpenses((prevExpenses) =>
      prevExpenses.map((expense) =>
        expense.id === id ? { ...expense, ...updatedData } : expense
      )
    );
  };

  const deleteExpenseHandler = (id) => {
    setExpenses((prevExpenses) =>
      prevExpenses.filter((expense) => expense.id !== id)
    );
  };

  return (
    <div>
      <ExpenseForm onAddExpense={addExpenseHandler} />
      <ExpenseList
        expenses={expenses}
        onEditExpense={editExpenseHandler}
        onDeleteExpense={deleteExpenseHandler}
      />
    </div>
  );
};

export default ExpensesPage;
