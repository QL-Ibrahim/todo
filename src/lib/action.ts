import {
  createUserWithEmailAndPassword,
  getAuth,
  signInWithEmailAndPassword,
} from "@firebase/auth";
import { addDoc, collection } from "@firebase/firestore";
import "./firebase/config";
import { db } from "./firebase/config";

export const Login = async (email: string, password: string) => {
  try {
    const auth = getAuth();
    console.log("Login attempt:", { auth, email, password });
    const userCredential = await signInWithEmailAndPassword(
      auth,
      email,
      password,
    );
    console.log("User logged in successfully", userCredential.user);

    const token = await userCredential.user.getIdToken(); // Get the Firebase token

    // Set the cookie manually
    const expiryDate = new Date();
    expiryDate.setDate(expiryDate.getDate() + 1); // 1-day expiration
    document.cookie = `authToken=${token}; path=/; expires=${expiryDate.toUTCString()}; secure; samesite=strict`;

    console.log("Login successful, token saved to cookie");
    //return res;
    // Redirect to the dashboard on successful login
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    console.error("Login error:", error.message);
    // You can handle specific error messages here or set them in the state
  }
};

export const Signup = async (email: string, password: string) => {
  try {
    const auth = getAuth();
    await createUserWithEmailAndPassword(auth, email, password);

    try {
      const docRef = await addDoc(collection(db, "auth"), {
        email,
      });

      console.log("Document written with ID: ", docRef.id);
    } catch (e) {
      console.error("Error adding document: ", e);
    }

    console.log("User signed up successfully");
    return true;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    console.error(error.message);
  }
};

export const Logout = () => {
  const auth = getAuth();
  try {
    auth.signOut();
    document.cookie =
      "authToken=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC; secure; samesite=strict";
    console.log("User logged out, token removed");
    return true;
  } catch (error) {
    console.error("Logout error:", error);
  }
};
