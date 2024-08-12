import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import ExpenseForm from "../components/Expense/ExpenseForm";
import ExpenseList from "../components/Expense/ExpenseList";
import { fetchExpenses } from "../store/ExpenseRedux/expense-slice";
import { Container, Row, Col, Button, Card } from "react-bootstrap";

const ExpensePage = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [editingExpense, setEditingExpense] = useState(null);
  const showActivatePremium = useSelector(
    (state) => state.expenses.showActivatePremium
  );
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchExpenses());
  }, [dispatch]);

  const startEditingHandler = (expense) => {
    setEditingExpense(expense);
    setIsEditing(true);
  };

  const stopEditingHandler = () => {
    setEditingExpense(null);
    setIsEditing(false);
  };

  return (
    <Container className="mt-4">
      <Row className="mb-4">
        <Col>
          {showActivatePremium && (
            <Button variant="danger" className="mb-3">
              Activate Premium
            </Button>
          )}
          {!isEditing && (
            <Button variant="primary" onClick={() => setIsEditing(true)}>
              Add Expense
            </Button>
          )}
        </Col>
      </Row>
      <Row>
        <Col md={8}>
          {isEditing && (
            <Card>
              <Card.Body>
                <ExpenseForm
                  editingExpense={editingExpense}
                  onClose={stopEditingHandler}
                />
              </Card.Body>
            </Card>
          )}
          <ExpenseList onEdit={startEditingHandler} />
        </Col>
      </Row>
    </Container>
  );
};

export default ExpensePage;
