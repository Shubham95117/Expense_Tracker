import React, { useState, useCallback } from "react";
import { Form, Button } from "react-bootstrap";
import { useDispatch } from "react-redux";
import {
  addExpense,
  updateExpense,
} from "../../store/ExpenseRedux/expense-slice";

const ExpenseForm = React.memo(({ editingExpense, onClose }) => {
  const [description, setDescription] = useState(
    editingExpense ? editingExpense.description : ""
  );
  const [amount, setAmount] = useState(
    editingExpense ? editingExpense.amount : ""
  );
  const [category, setCategory] = useState(
    editingExpense ? editingExpense.category : "Food"
  );

  const dispatch = useDispatch();

  const handleSubmit = useCallback(
    (e) => {
      e.preventDefault();
      const expenseData = { description, amount: +amount, category };

      if (editingExpense) {
        dispatch(updateExpense({ id: editingExpense.id, expenseData }));
      } else {
        dispatch(addExpense(expenseData));
      }

      onClose();
    },
    [description, amount, category, editingExpense, dispatch, onClose]
  );

  return (
    <Form onSubmit={handleSubmit}>
      <Form.Group controlId="formDescription">
        <Form.Label>Description</Form.Label>
        <Form.Control
          type="text"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
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
      <Form.Group controlId="formCategory" className="mt-3">
        <Form.Label>Category</Form.Label>
        <Form.Control
          as="select"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        >
          <option>Food</option>
          <option>Petrol</option>
          <option>Salary</option>
          <option>Other</option>
        </Form.Control>
      </Form.Group>
      <Button variant="primary" type="submit" className="mt-3">
        {editingExpense ? "Update Expense" : "Add Expense"}
      </Button>
      <Button variant="secondary" onClick={onClose} className="mt-3 ms-2">
        Close
      </Button>
    </Form>
  );
});

export default ExpenseForm;
