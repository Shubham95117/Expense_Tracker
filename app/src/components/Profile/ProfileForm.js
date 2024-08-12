import React, { useState } from "react";
import { Form, Button, Spinner, Container, Alert } from "react-bootstrap";
import { useSelector } from "react-redux";
import axios from "axios";
import classes from "./ProfileForm.module.css";

const ProfileForm = ({ profileData, onProfileUpdate }) => {
  const [enteredName, setEnteredName] = useState(profileData.name || "");
  const [enteredImageUrl, setEnteredImageUrl] = useState(
    profileData.photoUrl || ""
  );
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const token = useSelector((state) => state.auth.token);
  const apiKey = "AIzaSyB0ja9xoCcklY3x2gZwpnC_VL_0doFOzmc";

  const submitHandler = async (event) => {
    event.preventDefault();
    setIsLoading(true);
    setErrorMessage("");

    try {
      await axios.post(
        `https://identitytoolkit.googleapis.com/v1/accounts:update?key=${apiKey}`,
        {
          idToken: token,
          displayName: enteredName,
          photoUrl: enteredImageUrl,
          returnSecureToken: false,
        }
      );
      onProfileUpdate({ name: enteredName, photoUrl: enteredImageUrl });
    } catch (error) {
      console.error("Failed to update profile:", error);
      setErrorMessage("Failed to update profile. Please try again later.");
    }

    setIsLoading(false);
  };

  return (
    <Container className="mt-4 d-flex justify-content-center">
      <Form onSubmit={submitHandler}>
        <Form.Group className="mb-3" controlId="formBasicName">
          <Form.Label>Full Name</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter your full name"
            value={enteredName}
            onChange={(e) => setEnteredName(e.target.value)}
            required
          />
        </Form.Group>

        <Form.Group className="mb-3" controlId="formBasicPhoto">
          <Form.Label>Photo URL</Form.Label>
          <Form.Control
            type="url"
            placeholder="Enter the URL of your photo"
            value={enteredImageUrl}
            onChange={(e) => setEnteredImageUrl(e.target.value)}
            required
          />
        </Form.Group>

        {isLoading && (
          <div className="d-flex justify-content-center">
            <Spinner animation="border" role="status" />
          </div>
        )}

        {!isLoading && (
          <Button variant="primary" type="submit">
            Update Profile
          </Button>
        )}

        {errorMessage && (
          <Alert variant="danger" className="mt-3">
            {errorMessage}
          </Alert>
        )}
      </Form>
    </Container>
  );
};

export default ProfileForm;
