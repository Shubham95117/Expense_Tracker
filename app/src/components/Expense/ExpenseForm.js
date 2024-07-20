import React, { useState, useEffect } from "react";
import { Form, Button, Container } from "react-bootstrap";
import axios from "axios";

const ExpenseForm = ({ onAddExpense, currentExpense, onUpdateExpense }) => {
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("Food");
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    if (currentExpense) {
      setAmount(currentExpense.amount);
      setDescription(currentExpense.description);
      setCategory(currentExpense.category);
      setIsEditing(true);
    } else {
      setAmount("");
      setDescription("");
      setCategory("Food");
      setIsEditing(false);
    }
  }, [currentExpense]);

  const submitHandler = async (event) => {
    event.preventDefault();

    const expenseData = { amount, description, category };

    if (isEditing) {
      try {
        await axios.patch(
          `https://expense-tracker-5058d-default-rtdb.firebaseio.com/expenses/${currentExpense.id}.json`,
          expenseData
        );
        onUpdateExpense(currentExpense.id, expenseData);
      } catch (error) {
        console.error("Failed to update expense:", error);
      }
    } else {
      try {
        const response = await axios.post(
          "https://expense-tracker-5058d-default-rtdb.firebaseio.com/expenses.json",
          expenseData
        );
        const newExpense = { id: response.data.name, ...expenseData };
        onAddExpense(newExpense);
      } catch (error) {
        console.error("Failed to add expense:", error);
      }
    }

    setAmount("");
    setDescription("");
    setCategory("Food");
    setIsEditing(false);
  };

  return (
    <Container>
      <Form onSubmit={submitHandler}>
        <Form.Group className="mb-3">
          <Form.Label>Amount Spent</Form.Label>
          <Form.Control
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            min={0}
            required
          />
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>Description</Form.Label>
          <Form.Control
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>Category</Form.Label>
          <Form.Control
            as="select"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            required
          >
            <option value="Food">Food</option>
            <option value="Petrol">Petrol</option>
            <option value="Salary">Salary</option>
          </Form.Control>
        </Form.Group>
        <Button type="submit">
          {isEditing ? "Update Expense" : "Add Expense"}
        </Button>
      </Form>
    </Container>
  );
};

export default ExpenseForm;
