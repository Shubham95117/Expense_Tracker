// src/components/Expenses/ExpenseForm.js
import React, { useState, useContext } from "react";
import { Form, Button, Container, Row, Col } from "react-bootstrap";
import AuthContext from "../../store/auth-context";
import axios from "axios";

const ExpenseForm = ({ onAddExpense }) => {
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("Food");
  const authCtx = useContext(AuthContext);

  const submitHandler = async (event) => {
    event.preventDefault();

    const expenseData = { amount, description, category };

    // try {
    //   await axios.post("/api/expenses", expenseData, {
    //     headers: { Authorization: `Bearer ${authCtx.token}` },
    //   });
    //   onAddExpense(expenseData);
    //   setAmount("");
    //   setDescription("");
    //   setCategory("Food");
    // } catch (error) {
    //   console.error("Failed to add expense:", error);
    // }
    onAddExpense(expenseData);
    setAmount("");
    setDescription("");
    setCategory("Food");
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
        <Button type="submit">Add Expense</Button>
      </Form>
    </Container>
  );
};

export default ExpenseForm;
