import {
  createUserWithEmailAndPassword,
  getAuth,
  signInWithEmailAndPassword,
} from "@firebase/auth";
import { addDoc, collection } from "@firebase/firestore";
import { db } from "./firebase/config";

export const Login = async (email: string, password: string) => {
  try {
    const auth = getAuth();
    console.log("Login attempt:", { auth, email, password });
    const res = await signInWithEmailAndPassword(auth, email, password);
    console.log("User logged in successfully", res.user);
    return res;
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
