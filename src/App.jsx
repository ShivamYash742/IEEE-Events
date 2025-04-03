import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Home from "./components/Home";
import Events from "./components/Events";
import Register from "./components/Register";
import Login from "./components/Login";
import Signup from "./components/Signup";
import UserProfile from "./components/UserProfile";
import RegistrationConfirmation from "./components/RegistrationConfirmation";

// Main app component with routing configuration
function App() {
  return (
    <Router>
      <Routes>
        {/* Main public routes */}
        <Route path="/" element={<Home />} />
        <Route path="/events" element={<Events />} />

        {/* Authentication routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        {/* User routes */}
        <Route path="/register" element={<Register />} />
        <Route path="/profile" element={<UserProfile />} />

        {/* Registration confirmation routes */}
        <Route
          path="/registration-confirmation/:registrationId"
          element={<RegistrationConfirmation />}
        />
        <Route
          path="/registration-confirmation"
          element={<RegistrationConfirmation />}
        />
      </Routes>
    </Router>
  );
}

export default App;
