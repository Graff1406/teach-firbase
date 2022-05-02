import {
  getAuth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  sendSignInLinkToEmail,
  isSignInWithEmailLink,
  signInWithEmailLink,
  sendPasswordResetEmail,
  signInWithPhoneNumber,
  RecaptchaVerifier,
  signInWithPopup,
  GoogleAuthProvider
} from "firebase/auth";
import {app} from './index'
import catchIfAsyncError from "./catchIfAsyncError";

const url = 'http://localhost:3000/'

export const auth = getAuth(app);

export const signInUser = async (email: string, psw: string): Promise<any> =>
  await catchIfAsyncError(async () => {
    const { user } = await signInWithEmailAndPassword(auth, email, psw)
    return user
  })

export const createUser = async (email: string, psw: string): Promise<any> =>
  await catchIfAsyncError(async () => {
    const { user } = await createUserWithEmailAndPassword(auth, email, psw)
    await sendSignInLinkToEmail(auth, email, { 
      url, 
      handleCodeInApp: true 
    })
    window.localStorage.setItem('emailForSignIn', email);
    return user
  })

export const signOutUser = async () =>
  await catchIfAsyncError(async () => await signOut(auth))

export const confirmEmailUser = async () => {
  const email = window.localStorage.getItem('emailForSignIn');
  if (!email) throw new Error('Please provide your email for confirmation')
  if (isSignInWithEmailLink(auth, url)) 
    return await catchIfAsyncError(async () => {
      await signInWithEmailLink(auth, email, url)
      window.localStorage.removeItem('emailForSignIn');
    })
}

export const recoveryPswUser = async (email: string) =>
  await catchIfAsyncError(async () => 
    await sendPasswordResetEmail(auth, email, {url: `${url}?${email}`}))

export const signInWithPhoneUser = async (phoneNumber: string) => {
  window.recaptchaVerifier = new RecaptchaVerifier(
    'sign-in-button', 
    {'size': 'invisible'}, 
  auth);
  return await catchIfAsyncError(async () => 
    await signInWithPhoneNumber(auth, phoneNumber, window.recaptchaVerifier))
}

export const signInWitGoogle = async () => {
  const provider = new GoogleAuthProvider();
  return await catchIfAsyncError(async () => await signInWithPopup(auth, provider))
}