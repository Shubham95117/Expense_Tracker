import React, { useState, useCallback } from "react";

const AuthContext = React.createContext({
  token: "",
  isLoggedIn: false,
  login: (token, email, displayName, photoUrl) => {},
  logout: () => {},
  email: "",
  displayName: "",
  photoUrl: "",
});

export const AuthContextProvider = (props) => {
  const initialToken = localStorage.getItem("token");
  const [token, setToken] = useState(initialToken);
  const [email, setEmail] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [photoUrl, setPhotoUrl] = useState("");

  const userIsLoggedIn = !!token;

  const loginHandler = (token, email, displayName, photoUrl) => {
    setToken(token);
    setEmail(email);
    setDisplayName(displayName);
    setPhotoUrl(photoUrl);
    localStorage.setItem("token", token);
    localStorage.setItem("email", email);
  };

  const logoutHandler = useCallback(() => {
    setToken(null);
    setEmail("");
    setDisplayName("");
    setPhotoUrl("");
    localStorage.removeItem("token");
    localStorage.removeItem("email");
  }, []);

  const contextValue = {
    token: token,
    isLoggedIn: userIsLoggedIn,
    login: loginHandler,
    logout: logoutHandler,
    email: email,
    displayName: displayName,
    photoUrl: photoUrl,
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {props.children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
