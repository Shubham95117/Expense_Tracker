import React, { Suspense, lazy } from "react";
import "./App.css";
import {
  BrowserRouter as Router,
  Route,
  Switch,
  Redirect,
} from "react-router-dom";
import { useSelector } from "react-redux";

const Home = lazy(() => import("./pages/Home"));
const ProfilePage = lazy(() => import("./pages/ProfilePage"));
const AuthPage = lazy(() => import("./pages/AuthPage"));

function App() {
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);

  return (
    <Router>
      <Suspense fallback={<div>Loading...</div>}>
        <Switch>
          <Route path="/auth" component={AuthPage} />
          <Route path="/home">
            {isAuthenticated ? <Home /> : <Redirect to="/auth" />}
          </Route>
          <Route path="/profile">
            {isAuthenticated ? <ProfilePage /> : <Redirect to="/auth" />}
          </Route>
          <Route path="*">
            <Redirect to="/auth" />
          </Route>
        </Switch>
      </Suspense>
    </Router>
  );
}

export default App;
