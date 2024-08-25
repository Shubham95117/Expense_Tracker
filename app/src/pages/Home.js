import React, { useEffect, useState } from "react";
import { Image, Button, Container, Row, Col, Spinner } from "react-bootstrap";
import { useHistory } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { authActions } from "../store/auth-slice";
import axios from "axios";
import classes from "./Home.module.css";
import defaultProfileIcon from "../assets/profile.png";
import ExpensePage from "./ExpensePage";

const Home = () => {
  const dispatch = useDispatch();
  const token = useSelector((state) => state.auth.token);
  const apiKey = "AIzaSyB0ja9xoCcklY3x2gZwpnC_VL_0doFOzmc";
  const [profileData, setProfileData] = useState({
    name: "",
    photoUrl: "",
    isComplete: false,
  });
  const [isLoading, setIsLoading] = useState(true);
  const history = useHistory();

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        const response = await axios.post(
          `https://identitytoolkit.googleapis.com/v1/accounts:lookup?key=${apiKey}`,
          { idToken: token }
        );
        const userData = response.data.users[0];
        setProfileData({
          name: userData.displayName || "",
          photoUrl: userData.photoUrl || defaultProfileIcon,
          isComplete: !!userData.displayName && !!userData.photoUrl,
        });
      } catch (err) {
        console.error("Failed to fetch profile data:", err);
      } finally {
        setIsLoading(false); // Set loading to false after fetching
      }
    };

    fetchProfileData();
  }, [token]);

  const goToProfileHandler = () => {
    history.push("/profile");
  };

  const logoutHandler = () => {
    dispatch(authActions.logout());
    history.push("/auth");
  };

  if (isLoading) {
    return (
      <Container className="d-flex justify-content-center align-items-center mt-3">
        <Spinner animation="border" />
      </Container>
    );
  }

  return (
    <div className={classes.expensepagebackground}>
      <Container className={`mt-4 ${classes.expensesPage}`}>
        <Row className="justify-content-center">
          <Col md="auto">
            <h1 className="text-center text-primary-emphasis">
              Welcome to Expense Tracker
            </h1>
          </Col>
        </Row>
        <Row>
          <Col className="d-flex flex-column align-items-end">
            <div className="d-flex align-items-center mb-2 flex-column">
              <div>
                <Image
                  src={profileData.photoUrl}
                  roundedCircle
                  className={classes.profileImage}
                  onClick={goToProfileHandler}
                  style={{ cursor: "pointer", marginRight: "10px" }}
                />
              </div>
              <div>
                <Button
                  variant="danger"
                  onClick={logoutHandler}
                  className={`rounded-4 mt-2 ${classes.button}`}
                >
                  Logout
                </Button>
              </div>
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
        <ExpensePage />
      </Container>
    </div>
  );
};

export default Home;
