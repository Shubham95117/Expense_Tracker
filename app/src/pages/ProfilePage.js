import React, { useContext, useEffect, useState } from "react";
import { Container, Row, Col, Image, Button, Spinner } from "react-bootstrap";
import AuthContext from "../store/auth-context";
import ProfileForm from "../components/Profile/ProfileForm";
import axios from "axios";
import classes from "./ProfilePage.module.css";
import defaultProfileIcon from "../assets/profile.png"; // Add a default profile icon

const ProfilePage = () => {
  const authCtx = useContext(AuthContext);
  const apiKey = "AIzaSyB0ja9xoCcklY3x2gZwpnC_VL_0doFOzmc";
  const [profileData, setProfileData] = useState({
    name: "",
    photoUrl: "",
    isComplete: false,
  });
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  console.log(`auth ${authCtx.token}`);
  console.log(`email ${authCtx.email}`);
  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        const response = await axios.post(
          `https://identitytoolkit.googleapis.com/v1/accounts:lookup?key=${apiKey}`,
          {
            idToken: authCtx.token,
          }
        );
        const userData = response.data.users[0];
        setProfileData({
          name: userData.displayName || "",
          photoUrl: userData.photoUrl || defaultProfileIcon,
          isComplete: !!userData.displayName && !!userData.photoUrl,
        });
      } catch (err) {
        console.error("Failed to fetch profile data:", err);
      }
      setIsLoading(false);
    };

    fetchProfileData();
  }, [authCtx.token]);

  const profileUpdateHandler = (updatedProfile) => {
    setProfileData({
      ...profileData,
      ...updatedProfile,
      isComplete: !!updatedProfile.name && !!updatedProfile.photoUrl,
    });
    setIsEditing(false);
  };

  if (isLoading) {
    return (
      <Container
        className="d-flex justify-content-center align-items-center"
        style={{ height: "100vh" }}
      >
        <Spinner animation="border" role="status" />
      </Container>
    );
  }

  return (
    <Container className="mt-4 d-flex justify-content-center align-items-md-center">
      {!profileData.isComplete || isEditing ? (
        <ProfileForm
          profileData={profileData}
          onProfileUpdate={profileUpdateHandler}
        />
      ) : (
        <Row>
          <Col>
            <h2>Profile</h2>
            <Image
              src={profileData.photoUrl}
              roundedCircle
              className={classes.profileImage}
            />
            <p>Name: {profileData.name}</p>
            <p>Email: {authCtx.email}</p>
            <Button onClick={() => setIsEditing(true)}>Edit Details</Button>
          </Col>
        </Row>
      )}
    </Container>
  );
};

export default ProfilePage;
