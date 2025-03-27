// src/App.js
import React, { useEffect } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { UserProvider } from "./contexts/userContext"; 
import SignIn from "./components/SignIn/SignIn";
import SignUp from "./components/SignUp/SignUp";
import Home from "./components/Home/Home";

function App() {
  useEffect(() => {
    console.log("App component loaded");
  }, []);

  return (
    <UserProvider>
    <Router>
      <Routes>
        <Route path="/" element={<SignIn />} />
        <Route path="/signin" element={<SignIn />} />
        <Route path="/signup" element={<SignUp />} />
          <Route path="/home" element={<Home />} />
      </Routes>
    </Router>
    </UserProvider>
  );
}

export default App;
