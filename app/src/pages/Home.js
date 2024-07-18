import React, { useContext, useEffect, useState } from "react";
import { Image, Button, Container, Row, Col } from "react-bootstrap";
import { useHistory } from "react-router-dom";
import AuthContext from "../store/auth-context";
import axios from "axios";
import classes from "./Home.module.css";
import defaultProfileIcon from "../assets/profile.png";

const Home = () => {
  const authCtx = useContext(AuthContext);
  const apiKey = "AIzaSyB0ja9xoCcklY3x2gZwpnC_VL_0doFOzmc";
  const [profileData, setProfileData] = useState({
    name: "",
    photoUrl: "",
    isComplete: false,
  });
  const history = useHistory();

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
    };

    fetchProfileData();
  }, [authCtx.token]);

  const goToProfileHandler = () => {
    history.push("/profile");
  };

  return (
    <Container className="mt-4">
      <Row>
        <Col>
          <h2>Welcome to Expense Tracker</h2>
        </Col>
        <Col className="d-flex flex-column align-items-end">
          <div className="d-flex align-items-center mb-2">
            <Image
              src={profileData.photoUrl}
              roundedCircle
              className={classes.profileImage}
              onClick={goToProfileHandler}
              style={{ cursor: "pointer", marginRight: "10px" }}
            />
            <Button
              variant="outline-danger"
              onClick={authCtx.logout}
              className="me-3"
            >
              Logout
            </Button>
          </div>
          {!profileData.isComplete && (
            <p className="text-danger mt-2">
              Your profile is incomplete.{" "}
              <span
                onClick={goToProfileHandler}
                className="text-primary"
                style={{ textDecoration: "underline", cursor: "pointer" }}
              >
                Complete Now.
              </span>
            </p>
          )}
        </Col>
      </Row>
    </Container>
  );
};

export default Home;
