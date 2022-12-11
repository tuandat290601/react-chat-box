import { db } from "./firebase";
import {
  collection,
  getDocs,
  limit,
  orderBy,
  query,
  where,
} from "firebase/firestore";



export const checkExistingEmail = async (email) => {
  const q = query(collection(db, "users"), where("email", "==", email));
  return getDocs(q).then((snap) => snap.size >= 1);
};

export const getDocIdByEmail = async (email) => {
  const q = query(collection(db, "users"));
  const querySnapshot = await getDocs(q);
  let result = [];
  querySnapshot.forEach((snap) => {
    if (snap.data().email === email) {
      result.push(snap.id);
    }
  });
  return result[0].toString();
};

export const searchByEmail = async (searchKey) => {
  const q = query(
    collection(db, "users"),
    where("email", ">=", searchKey),
    where("email", "<=", searchKey + "\uf8ff"),
    orderBy("email"),
    limit(10)
  );
  const querySnapshot = await getDocs(q);
  let result = [];
  querySnapshot.forEach((snap) => {
    result.push(snap.data());
  });
  return result;
};

export const getAConversation = async (member1, member2) => {
  const q = query(
    collection(db, "conversations")
    // where("memberList", "array-contains", [member1, member2]),
  );
  const querySnapshot = await getDocs(q);
  let result = [];
  querySnapshot.forEach((snap) => {
    const isContain =
      snap.data().memberList.includes(member1) &&
      snap.data().memberList.includes(member2);
    if (isContain) {
      result.push(snap.data());
    }
  });
  return result[0];
};
