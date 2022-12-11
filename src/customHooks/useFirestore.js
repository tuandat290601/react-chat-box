import {
  collection,
  onSnapshot,
  orderBy,
  query,
  where,
} from "firebase/firestore";
import { useEffect, useState } from "react";
import { db } from "../firebase/firebase";

const useFirestore = (inCollection, inCondition) => {
  const [data, setData] = useState([]);
  useEffect(() => {
    let selectedCollection = collection(db, inCollection);
    let q;
    if (!inCondition.value || !inCondition.value.length) {
      setData([]);
      return;
    }
    if (inCondition.orderBy?.length >= 1) {
      q = query(
        selectedCollection,
        where(inCondition.name, inCondition.operator, inCondition.value),
        orderBy(
          inCondition.orderBy[0],
          inCondition.orderBy[1] && inCondition.orderBy[1]
        )
      );
    } else {
      q = query(
        selectedCollection,
        where(inCondition.name, inCondition.operator, inCondition.value)
      );
    }

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const result = [];
      querySnapshot.forEach((doc) => {
        result.push(doc.data());
      });
      setData(result);
    });
    return unsubscribe;
  }, [inCollection, inCondition]);

  return data;
};

export default useFirestore;
