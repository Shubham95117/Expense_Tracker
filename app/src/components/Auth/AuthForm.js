import React, { useContext, useState } from "react";
import { Button, Container, Form } from "react-bootstrap";
import AuthContext from "../../store/auth-context";
import axios from "axios";

const SignupForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const authCtx = useContext(AuthContext);

  const submitHandler = async (e) => {
    e.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (!email || !password || !confirmPassword) {
      setError("All fields are mandatory");
      return;
    }

    const apiKey = "AIzaSyB0ja9xoCcklY3x2gZwpnC_VL_0doFOzmc";
    const url = `https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=${apiKey}`;

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

      authCtx.login(response.data.idToken);
      console.log("User has successfully signed up.");
    } catch (err) {
      setError(err.response?.data?.error?.message || "Authentication failed!");
    }
  };

  return (
    <Container className="d-flex justify-content-center align-items-center vh-100">
      <div
        style={{
          border: "1px solid #ddd",
          padding: "2rem",
          borderRadius: "8px",
          boxShadow: "0 0 10px rgba(0, 0, 0, 0.1)",
          width: "300px",
        }}
      >
        <h3 className="text-center mb-4">SignUp</h3>
        <Form onSubmit={submitHandler}>
          <Form.Group className="mb-3" controlId="formBasicEmail">
            <Form.Control
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="formBasicPassword">
            <Form.Control
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="formBasicConfirmPassword">
            <Form.Control
              type="password"
              placeholder="Confirm Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </Form.Group>

          {error && <p className="text-danger">{error}</p>}

          <div className="d-grid gap-2">
            <Button variant="primary" type="submit" className="mb-2">
              Sign up
            </Button>
          </div>
        </Form>

        <div className="text-center mt-3">
          <Button
            variant="outline-secondary"
            href="#"
            style={{ width: "100%" }}
          >
            Have an account? Login
          </Button>
        </div>
      </div>
    </Container>
  );
};

export default SignupForm;
