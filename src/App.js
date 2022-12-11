import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Authentication from "./pages/Authentication/Authentication";
import Home from "./pages/Home/Home";

import "./App.css";
import ProtectedRoute from "./components/ProtectedRoute/ProtectedRoute";
import FirebaseProvider from "./context/firebaseContext";
import AuthProvider from "./context/authContext";
import Profile from "./pages/Profile/Profile";

const App = () => {
  return (
    <div className="App">
      <BrowserRouter>
        <AuthProvider>
          <FirebaseProvider>
            <Routes>
              <Route
                path="/"
                element={
                  <ProtectedRoute>
                    <Home />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/profile"
                element={
                  <ProtectedRoute>
                    <Profile />
                  </ProtectedRoute>
                }
              />
              <Route path="/auth" element={<Authentication />} />
            </Routes>
          </FirebaseProvider>
        </AuthProvider>
      </BrowserRouter>
    </div>
  );
};

export default App;
