import { onAuthStateChanged } from "firebase/auth";
import React from "react";
import { useNavigate } from "react-router-dom";

import { auth } from "../../firebase/firebase";

const ProtectedRoute = ({ children }) => {
  let navigate = useNavigate();

  onAuthStateChanged(auth, (user) => {
    if (!user) {
      navigate("/auth");
    }
  });

  return <div>{children}</div>;
};

export default ProtectedRoute;
