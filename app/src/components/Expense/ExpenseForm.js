import React, { useState } from "react";
import { Form, Button } from "react-bootstrap";
import { useDispatch } from "react-redux";
import {
  addExpense,
  updateExpense,
} from "../../store/ExpenseRedux/expense-slice";

const ExpenseForm = ({ editingExpense, onClose }) => {
  const [title, setTitle] = useState(
    editingExpense ? editingExpense.title : ""
  );
  const [amount, setAmount] = useState(
    editingExpense ? editingExpense.amount : ""
  );
  const [date, setDate] = useState(editingExpense ? editingExpense.date : "");

  const dispatch = useDispatch();

  const handleSubmit = (e) => {
    e.preventDefault();
    const expenseData = { title, amount: +amount, date };

    if (editingExpense) {
      dispatch(updateExpense({ id: editingExpense.id, expenseData }));
    } else {
      dispatch(addExpense(expenseData));
    }

    onClose();
  };

  return (
    <Form onSubmit={handleSubmit}>
      <Form.Group controlId="formTitle">
        <Form.Label>Title</Form.Label>
        <Form.Control
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
      </Form.Group>
      <Form.Group controlId="formAmount" className="mt-3">
        <Form.Label>Amount</Form.Label>
        <Form.Control
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          required
        />
      </Form.Group>
      <Form.Group controlId="formDate" className="mt-3">
        <Form.Label>Date</Form.Label>
        <Form.Control
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          required
        />
      </Form.Group>
      <Button variant="primary" type="submit" className="mt-3">
        {editingExpense ? "Update Expense" : "Add Expense"}
      </Button>
      <Button variant="secondary" onClick={onClose} className="mt-3 ms-2">
        Close
      </Button>
    </Form>
  );
};

export default ExpenseForm;
