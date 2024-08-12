import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { deleteExpense } from "../../store/ExpenseRedux/expense-slice";
import { ListGroup, Button } from "react-bootstrap";

const ExpenseList = ({ onEdit }) => {
  const expenses = useSelector((state) => state.expenses.expenses);
  const dispatch = useDispatch();

  const handleDelete = (id) => {
    dispatch(deleteExpense(id));
  };

  return (
    <ListGroup>
      {expenses.map((expense) => (
        <ListGroup.Item
          key={expense.id}
          className="d-flex justify-content-between align-items-center"
        >
          <div>
            <h5>{expense.title}</h5>
            <p>Amount: {expense.amount}</p>
            <p>Date: {expense.date}</p>
          </div>
          <div>
            <Button
              variant="info"
              onClick={() => onEdit(expense)}
              className="me-2"
            >
              Edit
            </Button>
            <Button variant="danger" onClick={() => handleDelete(expense.id)}>
              Delete
            </Button>
          </div>
        </ListGroup.Item>
      ))}
    </ListGroup>
  );
};

export default ExpenseList;
