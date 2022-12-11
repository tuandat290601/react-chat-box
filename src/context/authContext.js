import { onAuthStateChanged } from "firebase/auth";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth } from "../firebase/firebase";

const AuthContext = React.createContext();
export default function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState({});
  const [loading, setLoading] = useState(true);
  let navigate = useNavigate();
  useEffect(() => {
    const unsubscribed = onAuthStateChanged(auth, (user) => {
      if (user) {
        setCurrentUser(user);
        setLoading(false);
        return;
      }
      setCurrentUser({});
      setLoading(false);
      navigate("/auth");
    });
    return () => {
      unsubscribed();
    };
  }, [navigate]);
  return (
    <AuthContext.Provider value={{ currentUser }}>
      {loading ? <h1>Loading</h1> : children}
    </AuthContext.Provider>
  );
}
export { AuthContext };
