import React, { useContext, useState } from "react";
import { Form, Button, Spinner, Container } from "react-bootstrap";
import AuthContext from "../../store/auth-context";
import axios from "axios";

const ProfileForm = ({ profileData, onProfileUpdate }) => {
  const [enteredName, setEnteredName] = useState(profileData.name || "");
  const [enteredImageUrl, setEnteredImageUrl] = useState(
    profileData.photoUrl || ""
  );
  const [isLoading, setIsLoading] = useState(false);
  const authCtx = useContext(AuthContext);
  const apiKey = "AIzaSyB0ja9xoCcklY3x2gZwpnC_VL_0doFOzmc";

  const submitHandler = async (event) => {
    event.preventDefault();
    setIsLoading(true);

    try {
      await axios.post(
        `https://identitytoolkit.googleapis.com/v1/accounts:update?key=${apiKey}`,
        {
          idToken: authCtx.token,
          displayName: enteredName,
          photoUrl: enteredImageUrl,
          returnSecureToken: false,
        }
      );
      console.log("updated successfully");
      onProfileUpdate({ name: enteredName, photoUrl: enteredImageUrl });
    } catch (error) {
      console.error("Failed to update profile:", error);
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
      </Form>
    </Container>
  );
};

export default ProfileForm;
