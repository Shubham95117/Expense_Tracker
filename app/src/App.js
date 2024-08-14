// App.js
import React from "react";
import {
  BrowserRouter as Router,
  Route,
  Switch,
  Redirect,
} from "react-router-dom";
import { useSelector } from "react-redux";
import Home from "./pages/Home";
import ProfilePage from "./pages/ProfilePage";
import AuthPage from "./pages/AuthPage";
import ExpensePage from "./pages/ExpensePage";

function App() {
  const isLoggedIn = useSelector((state) => state.auth.isAuthenticated);

  return (
    <Router>
      <Switch>
        <Route path="/" exact>
          {!isLoggedIn && <Redirect to="/auth" />}
          {isLoggedIn && <Redirect to="/home" />}
        </Route>
        <Route path="/auth">
          {!isLoggedIn && <AuthPage />}
          {isLoggedIn && <Redirect to="/home" />}
        </Route>
        <Route path="/home">
          {isLoggedIn && <Home />}
          {!isLoggedIn && <Redirect to="/auth" />}
        </Route>
        <Route path="/profile">
          {isLoggedIn && <ProfilePage />}
          {!isLoggedIn && <Redirect to="/auth" />}
        </Route>
        <Route path="/expenses">
          {isLoggedIn && <ExpensePage />}
          {!isLoggedIn && <Redirect to="/auth" />}
        </Route>
        <Route path="*">
          <Redirect to="/" />
        </Route>
      </Switch>
    </Router>
  );
}

export default App;
