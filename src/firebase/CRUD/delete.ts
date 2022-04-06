import {
  doc,
  deleteField,
  deleteDoc,
  updateDoc,
} from "firebase/firestore";

import db from "../index";

import catchIfAsyncError from "../catchIfAsyncError";

export const removeDoc = async (collectionName: string, docID: string) =>
  await catchIfAsyncError(async () => await deleteDoc(doc(db, collectionName, docID)))

export const removeField = async (
  collectionName: string,
  field: string,
  docName: string
) => await catchIfAsyncError(async () => {
  const document = doc(db, collectionName, docName);
  return await updateDoc(document, { [field]: deleteField() })
})