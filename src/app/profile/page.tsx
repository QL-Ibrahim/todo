"use client";

import React, { useEffect, useState } from "react";
import { getAuth, updateProfile, onAuthStateChanged } from "firebase/auth";
import { db } from "@/lib/firebase/config";
import { doc, getDoc, setDoc } from "firebase/firestore";

const ProfilePage = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isSuccess, setIsSuccess] = useState(false); // Track success state
  const auth = getAuth();

  useEffect(() => {
    const fetchUserProfile = async () => {
      setLoading(true);
      const user = auth.currentUser;

      if (user) {
        setName(user.displayName || "");
        setEmail(user.email || "");

        // Fetch additional data from Firestore
        const docRef = doc(db, "users", user.uid);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const data = docSnap.data();
          setName(data.name || user.displayName || "");
        }
      }

      setLoading(false);
    };

    const unsubscribe = onAuthStateChanged(auth, fetchUserProfile);
    return () => unsubscribe();
  }, [auth]);

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    const user = auth.currentUser;

    if (!user) return alert("No user is logged in!");

    try {
      // Update Firebase Auth profile
      await updateProfile(user, { displayName: name });

      // Update Firestore profile
      const docRef = doc(db, "users", user.uid);
      await setDoc(
        docRef,
        { name, email },
        { merge: true } // Merge fields instead of overwriting the document
      );

      // Update success state after everything is complete
      setIsSuccess(true); // Set success state to true
      setIsEditing(false); // Disable editing

      // // Reset success state after 3 seconds
      setTimeout(() => setIsSuccess(false), 3000);
    } catch (error) {
      console.error("Error updating profile:", error);
      alert("Failed to update profile. Please try again.");
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Profile</h1>

      {/* Display success message after successful update */}
      {isSuccess && (
        <div className="bg-green-500 text-white p-2 rounded mb-4">
          Profile updated successfully!
        </div>
      )}

      <form onSubmit={handleUpdateProfile} className="space-y-4">
        <div className="flex flex-col">
          <label htmlFor="name" className="font-semibold">
            Name
          </label>
          <input
            id="name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            disabled={!isEditing}
            className="p-2 border rounded"
          />
        </div>

        <div className="flex flex-col">
          <label htmlFor="email" className="font-semibold">
            Email
          </label>
          <input
            id="email"
            type="email"
            value={email}
            disabled
            className="p-2 border rounded bg-gray-100"
          />
        </div>

        <div className="flex space-x-4">
          {isEditing && (
            <>
              <button
                type="submit"
                className="bg-blue-600 text-white px-4 py-2 rounded"
              >
                Save
              </button>
              <button
                type="button"
                className="bg-red-600 text-white px-4 py-2 rounded"
                onClick={() => setIsEditing(false)}
              >
                Cancel
              </button>
            </>
          )}

          {!isEditing && (
            <button
              type="button"
              className="bg-gray-600 text-white px-4 py-2 rounded"
              onClick={() => setIsEditing(true)}
            >
              Edit Profile
            </button>
          )}
        </div>
      </form>
    </div>
  );
};

export default ProfilePage;
