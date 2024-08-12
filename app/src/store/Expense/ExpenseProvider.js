import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import ExpenseContext from "./expense-context";
import AuthContext from "../auth-context";

const ExpenseProvider = (props) => {
  const authCtx = useContext(AuthContext);
  const userId = authCtx.email.replace(".", "_"); // Firebase does not allow '.' in keys
  const [expenses, setExpenses] = useState([]);

  useEffect(() => {
    const fetchExpenses = async () => {
      if (!userId) return;
      try {
        const response = await axios.get(
          `https://expense-tracker-5058d-default-rtdb.firebaseio.com/expenses/${userId}.json`
        );
        const fetchedExpenses = [];
        for (const key in response.data) {
          fetchedExpenses.push({
            id: key,
            ...response.data[key],
          });
        }
        setExpenses(fetchedExpenses);
      } catch (error) {
        console.error("Error fetching expenses:", error);
      }
    };
    fetchExpenses();
  }, [userId]);

  const addExpenseHandler = async (expense) => {
    try {
      const response = await axios.post(
        `https://expense-tracker-5058d-default-rtdb.firebaseio.com/expenses/${userId}.json`,
        expense
      );
      const newExpense = { id: response.data.name, ...expense };
      setExpenses((prevExpenses) => [...prevExpenses, newExpense]);
      console.log("Expense added successfully:", newExpense);
    } catch (error) {
      console.error("Error adding expense:", error);
    }
  };

  const deleteExpenseHandler = async (id) => {
    try {
      await axios.delete(
        `https://expense-tracker-5058d-default-rtdb.firebaseio.com/expenses/${userId}/${id}.json`
      );
      setExpenses((prevExpenses) =>
        prevExpenses.filter((expense) => expense.id !== id)
      );
      console.log("Expense deleted successfully");
    } catch (error) {
      console.error("Error deleting expense:", error);
    }
  };

  const editExpenseHandler = async (updatedExpense) => {
    try {
      await axios.put(
        `https://expense-tracker-5058d-default-rtdb.firebaseio.com/expenses/${userId}/${updatedExpense.id}.json`,
        updatedExpense
      );
      setExpenses((prevExpenses) =>
        prevExpenses.map((expense) =>
          expense.id === updatedExpense.id ? updatedExpense : expense
        )
      );
      console.log("Expense updated successfully:", updatedExpense);
    } catch (error) {
      console.error("Error updating expense:", error);
    }
  };

  return (
    <ExpenseContext.Provider
      value={{
        totalExpenses: expenses.length,
        expenses: expenses,
        addExpense: addExpenseHandler,
        removeExpense: deleteExpenseHandler,
        editExpense: editExpenseHandler,
      }}
    >
      {props.children}
    </ExpenseContext.Provider>
  );
};

export default ExpenseProvider;
