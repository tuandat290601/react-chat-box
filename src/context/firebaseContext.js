import React, { useState } from "react";
import useFirestore from "../customHooks/useFirestore";
import { AuthContext } from "./authContext";

export const FirebaseContext = React.createContext();
export default function FirebaseProvider({ children }) {
  const [currentRoom, setCurrentRoom] = useState(null);
  const [currentGuest, setCurrentGuest] = useState(null);

  const {
    currentUser: { uid },
  } = React.useContext(AuthContext);

  const conversationsCondition = React.useMemo(() => {
    return {
      name: "memberList",
      operator: "array-contains",
      value: uid,
      orderBy: ["lastActive", "desc"],
    };
  }, [uid]);

  const conversations = useFirestore("conversations", conversationsCondition);

  return (
    <FirebaseContext.Provider
      value={{
        conversations,
        currentRoom,
        setCurrentRoom,
        currentGuest,
        setCurrentGuest,
      }}
    >
      {children}
    </FirebaseContext.Provider>
  );
}
