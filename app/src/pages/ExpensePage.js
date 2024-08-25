import React, { useState, useEffect, useCallback, useMemo } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchExpenses } from "../store/ExpenseRedux/expense-slice";
import { toggleTheme } from "../store/theme-slice";
import { Container, Row, Col, Button, Card } from "react-bootstrap";
import { saveAs } from "file-saver";
import ExpenseForm from "../components/Expense/ExpenseForm";
import ExpenseList from "../components/Expense/ExpenseList";
import "./ExpensePage.css";
const ExpensePage = React.memo(() => {
  const [isEditing, setIsEditing] = useState(false);
  const [editingExpense, setEditingExpense] = useState(null);
  const [premiumActivated, setPremiumActivated] = useState(false);

  const expenses = useSelector((state) => state.expenses.expenses);
  const darkMode = useSelector((state) => state.theme.darkMode);

  const showActivatePremium = useMemo(
    () =>
      expenses.reduce((total, expense) => total + expense.amount, 0) > 10000,
    [expenses]
  );

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchExpenses());
  }, [dispatch]);

  const startEditingHandler = useCallback((expense) => {
    setEditingExpense(expense);
    setIsEditing(true);
  }, []);

  const stopEditingHandler = useCallback(() => {
    setEditingExpense(null);
    setIsEditing(false);
  }, []);

  const handleActivatePremium = useCallback(() => {
    setPremiumActivated(true);
  }, []);

  const downloadCSV = useCallback(() => {
    const csvContent = expenses
      .map((exp) => `${exp.amount},${exp.description},${exp.category}`)
      .join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    saveAs(blob, "expenses.csv");
  }, [expenses]);

  const themeClass = darkMode
    ? "expense-page-background dark"
    : premiumActivated
      ? "expense-page-background black"
      : "expense-page-background";

  return (
    <div className={themeClass}>
      <Container className="mt-4">
        <Row className="justify-content-center mb-4">
          <Col md={8} className="text-center">
            {showActivatePremium && !premiumActivated && (
              <Button
                variant="danger"
                className="mb-3"
                onClick={handleActivatePremium}
              >
                Activate Premium
              </Button>
            )}
            {premiumActivated && (
              <>
                <Button
                  variant="secondary"
                  className="mb-3 me-2"
                  onClick={downloadCSV}
                >
                  Download Expenses
                </Button>
                <Button
                  variant="info"
                  className="mb-3"
                  onClick={() => dispatch(toggleTheme())}
                >
                  Switch Theme
                </Button>
              </>
            )}
          </Col>
        </Row>
        <Row className="justify-content-center">
          <Col md={8} className="text-center mb-3">
            {!isEditing && (
              <Button variant="primary" onClick={() => setIsEditing(true)}>
                Add Expense
              </Button>
            )}
          </Col>
        </Row>
        <Row className="justify-content-center">
          <Col md={8}>
            {isEditing && (
              <Card className="mb-4 p-3">
                <Card.Body>
                  <ExpenseForm
                    editingExpense={editingExpense}
                    onClose={stopEditingHandler}
                  />
                </Card.Body>
              </Card>
            )}
            {expenses.length > 0 && (
              <Card className="p-3">
                <Card.Body style={{ border: "none" }}>
                  <ExpenseList onEdit={startEditingHandler} />
                </Card.Body>
              </Card>
            )}
          </Col>
        </Row>
      </Container>
    </div>
  );
});

export default ExpensePage;
