import { doc,  collection, query, where, getDoc, getDocs } from "firebase/firestore";
import db from "../index";
import catchIfAsyncError from "../catchIfAsyncError";

type WhereFilterOp =
| "<"
| "<="
| "=="
| "!="
| ">="
| ">"
| "array-contains"
| "in"
| "not-in"
| "array-contains-any";

interface Condition {
  key: string,
  operator: WhereFilterOp,
  value: string
}

export const getDocList = async (collectionName: string) =>
  await catchIfAsyncError(async () => {
    const res = await getDocs(collection(db, collectionName));
    let dataDocs = []
    res.forEach(d => {
      dataDocs.push({...d.data(), id: d.id})
    });
    return dataDocs;
  })

export const getDocListWhere = async (collectionName: string, condition: Condition) => 
  await catchIfAsyncError(async () => {
    const readCollection = collection(db, collectionName);
    const request = query(
      readCollection, 
      where(condition.key, condition.operator, condition.value)
    );
    const res = await getDocs(request)
    let dataDocs = []
    res.forEach(d => {
      dataDocs.push({...d.data(), id: d.id})
    });
    return dataDocs;
  })

export const getDocById = async (collectionName: string, docID: string) =>
  await catchIfAsyncError(async () => {
    const document = doc(db, collectionName, docID);
    const res = await getDoc(document);
  return res?.data() ?? {};
  })

