import React, { useEffect, useState } from "react";
import {
  Container,
  Row,
  Col,
  Image,
  Button,
  Alert,
  Spinner,
} from "react-bootstrap";
import { useSelector, useDispatch } from "react-redux";
import axios from "axios";
import { authActions } from "../store/auth-slice";
import classes from "./ProfilePage.module.css";
import defaultProfileIcon from "../assets/profile.png";
import ProfileForm from "../components/Profile/ProfileForm";

const ProfilePage = () => {
  const dispatch = useDispatch();
  const token = useSelector((state) => state.auth.token);
  const email = useSelector((state) => state.auth.email);
  const apiKey = "AIzaSyB0ja9xoCcklY3x2gZwpnC_VL_0doFOzmc";

  const [profileData, setProfileData] = useState({
    name: "",
    photoUrl: "",
    isComplete: false,
  });
  const [isEditing, setIsEditing] = useState(false);
  const [isEmailVerified, setIsEmailVerified] = useState(true);
  const [verificationMessage, setVerificationMessage] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        const response = await axios.post(
          `https://identitytoolkit.googleapis.com/v1/accounts:lookup?key=${apiKey}`,
          {
            idToken: token,
          }
        );
        const userData = response.data.users[0];
        setProfileData({
          name: userData.displayName || "",
          photoUrl: userData.photoUrl || defaultProfileIcon,
          isComplete: !!userData.displayName && !!userData.photoUrl,
        });
        setIsEmailVerified(userData.emailVerified);
      } catch (err) {
        console.error("Failed to fetch profile data:", err);
      }
      setLoading(false);
    };

    fetchProfileData();
  }, [token]);

  const profileUpdateHandler = (updatedProfile) => {
    setProfileData({
      ...profileData,
      ...updatedProfile,
      isComplete: updatedProfile.name && updatedProfile.photoUrl,
    });
    setIsEditing(false);
  };

  const sendEmailVerificationHandler = async () => {
    try {
      await axios.post(
        `https://identitytoolkit.googleapis.com/v1/accounts:sendOobCode?key=${apiKey}`,
        {
          requestType: "VERIFY_EMAIL",
          idToken: token,
        }
      );
      setVerificationMessage(
        "Verification email sent. Please check your inbox."
      );
    } catch (error) {
      console.error("Failed to send verification email:", error);
      if (error.response && error.response.data && error.response.data.error) {
        setVerificationMessage(`Error: ${error.response.data.error.message}`);
      } else {
        setVerificationMessage(
          "An unexpected error occurred. Please try again later."
        );
      }
    }
  };

  return (
    <Container className="mt-4 d-flex justify-content-center align-content-center">
      {loading ? (
        <Spinner
          animation="border"
          role="status"
          className="d-flex justify-content-center align-items-center"
        >
          <span className="sr-only">Loading...</span>
        </Spinner>
      ) : (
        <>
          {!profileData.isComplete || isEditing ? (
            <ProfileForm
              profileData={profileData}
              onProfileUpdate={profileUpdateHandler}
            />
          ) : (
            <Row className="me-0" style={{ marginRight: "0px" }}>
              <Col>
                <h2>Profile</h2>
                <Image
                  src={profileData.photoUrl}
                  roundedCircle
                  className={classes.profileImage}
                />
                <p>Name: {profileData.name}</p>
                <p>Email: {email}</p>
                <Button onClick={() => setIsEditing(true)}>Edit Details</Button>
                {!isEmailVerified && (
                  <Button
                    variant="warning"
                    className="mx-2"
                    onClick={sendEmailVerificationHandler}
                  >
                    Verify Email
                  </Button>
                )}
                {verificationMessage && (
                  <Row className="mt-3">
                    <Col className="d-flex justify-content-center align-items-center">
                      <Alert variant="info">{verificationMessage}</Alert>
                    </Col>
                  </Row>
                )}
              </Col>
            </Row>
          )}
        </>
      )}
    </Container>
  );
};

export default ProfilePage;
