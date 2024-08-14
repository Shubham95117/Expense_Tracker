import React, { useEffect, useState } from "react";
import { Image, Button, Container, Row, Col } from "react-bootstrap";
import { useHistory } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { authActions } from "../store/auth-slice"; // Import authActions from your auth slice
import axios from "axios";
import classes from "./Home.module.css";
import defaultProfileIcon from "../assets/profile.png";
import ExpensePage from "./ExpensePage";

const Home = () => {
  const dispatch = useDispatch();
  const token = useSelector((state) => state.auth.token); // Get token from Redux store
  const apiKey = "AIzaSyB0ja9xoCcklY3x2gZwpnC_VL_0doFOzmc"; // Replace with your actual Firebase API key
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
            idToken: token,
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
  }, [token]);

  const goToProfileHandler = () => {
    history.push("/profile");
  };

  const logoutHandler = () => {
    dispatch(authActions.logout()); // Dispatch the logout action
    history.push("/auth"); // Redirect to the auth page
  };

  return (
    <div>
      <Container className={`mt-4 ${classes.expensesPage}`}>
        <Row>
          <Col>
            <h2>Welcome to Expense Tracker</h2>
          </Col>
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
                  onClick={logoutHandler} // Use logoutHandler function
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
