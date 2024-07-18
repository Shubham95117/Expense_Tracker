// src/components/Expenses/ExpenseList.js
import React from "react";
import { ListGroup, Container } from "react-bootstrap";

const ExpenseList = ({ expenses }) => {
  return (
    <Container className="mt-4">
      {expenses.l && <h2>Expenses</h2>}
      <ListGroup>
        {expenses.map((expense, index) => (
          <ListGroup.Item key={index}>
            {expense.description}: ${expense.amount} - {expense.category}
          </ListGroup.Item>
        ))}
      </ListGroup>
    </Container>
  );
};

export default ExpenseList;
