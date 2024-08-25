import React, { useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import { deleteExpense } from "../../store/ExpenseRedux/expense-slice";
import { ListGroup, Button } from "react-bootstrap";

const ExpenseList = React.memo(({ onEdit }) => {
  const expenses = useSelector((state) => state.expenses.expenses);
  const dispatch = useDispatch();

  const handleDelete = useCallback(
    (id) => {
      dispatch(deleteExpense(id));
    },
    [dispatch]
  );

  return (
    <ListGroup>
      {expenses.map((expense) => (
        <ListGroup.Item
          key={expense.id}
          className="d-flex justify-content-between align-items-center"
          style={{ borderRadius: "8px", marginBottom: "10px", padding: "15px" }}
        >
          <div>
            <h5>{expense.description}</h5>
            <p>Amount: {expense.amount}</p>
            <p>Category: {expense.category}</p>
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
});

export default ExpenseList;
