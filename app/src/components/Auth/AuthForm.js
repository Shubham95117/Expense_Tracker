import React, { useContext, useState } from "react";
import { Button, Container, Form, Row, Col, Spinner } from "react-bootstrap";
import AuthContext from "../../store/auth-context";
import axios from "axios";
import { useHistory } from "react-router-dom";

const AuthForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLogin, setIsLogin] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const authCtx = useContext(AuthContext);
  const history = useHistory();

  const switchAuthModeHandler = () => {
    setIsLogin((prevState) => !prevState);
  };

  const submitHandler = async (event) => {
    event.preventDefault();
    setError("");

    if (!email.trim() || !password.trim()) {
      setError("Email and password fields cannot be empty.");
      return;
    }

    setIsLoading(true);
    const apiKey = "AIzaSyB0ja9xoCcklY3x2gZwpnC_VL_0doFOzmc";

    const url = isLogin
      ? `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${apiKey}`
      : `https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=${apiKey}`;

    try {
      const response = await axios.post(url, {
        email,
        password,
        returnSecureToken: true,
      });

      if (response.status !== 200) {
        throw new Error(
          response.data.error.message || "Authentication failed!"
        );
      }
      authCtx.login(response.data.idToken, email);
      console.log("User has successfully logged in/signed up.");
      history.push("/home"); // Navigate to home page on successful login/signup
    } catch (err) {
      setError(err.response?.data?.error?.message || "Authentication failed!");
      console.log(err);
    }

    setIsLoading(false);
  };

  return (
    <Container className="d-flex justify-content-center align-items-center vh-100">
      <Row className="w-75">
        <Col xs={12} md={6} lg={4} className="mx-auto">
          <div
            className="p-4 border rounded shadow-sm"
            style={{ backgroundColor: "white" }}
          >
            <h3 className="text-center mb-4">
              {isLogin ? "Login" : "Sign Up"}
            </h3>
            <Form onSubmit={submitHandler}>
              <Form.Group className="mb-3" controlId="formBasicEmail">
                <Form.Control
                  type="email"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  autoComplete="email"
                />
              </Form.Group>

              <Form.Group className="mb-3" controlId="formBasicPassword">
                <Form.Control
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  autoComplete={isLogin ? "current-password" : "new-password"}
                />
              </Form.Group>

              {error && <p className="text-danger">{error}</p>}

              <div className="d-grid gap-2">
                <Button
                  variant="primary"
                  type="submit"
                  className="mb-2"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <Spinner
                      as="span"
                      animation="border"
                      size="sm"
                      role="status"
                      aria-hidden="true"
                    />
                  ) : isLogin ? (
                    "Login"
                  ) : (
                    "Create Account"
                  )}
                </Button>
              </div>
            </Form>

            <div className="text-center mt-3">
              <Button
                variant="outline-secondary"
                onClick={switchAuthModeHandler}
                style={{ width: "100%" }}
              >
                {isLogin ? "Create new account" : "Login with existing account"}
              </Button>
            </div>
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default AuthForm;
