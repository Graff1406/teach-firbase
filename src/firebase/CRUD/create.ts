// Firebase
import {
  doc,
  setDoc,
  addDoc,
  updateDoc,
  collection
} from "firebase/firestore";
import db from "../index";
import catchIfAsyncError from "../catchIfAsyncError";

// Interfaces
import type { Record, CreatedRecord } from "@/ts/interfaces";


export const createTask = async (collectionName: string, record: Record) => 
  await catchIfAsyncError(async () => 
    await addDoc(
      collection(db, collectionName),
      {...record, saved: Date.now(), confirm: false}
))

export const updateTask = async (collectionName: string,  record: CreatedRecord) => await catchIfAsyncError(async () => await setDoc(doc(db, collectionName, record.id), {...record, saved: Date.now()}))

// export const updateTaskField = async (collectionName: string,  field: object, id: string) => 
//   await catchIfAsyncError(async () =>
//     await updateDoc(doc(db, collectionName, id), field)
//   )