"use client";

import "./globals.css";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useState, useEffect } from "react";
import { getAuth, onAuthStateChanged } from "firebase/auth";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const router = useRouter();
  const [userName, setUserName] = useState<string | null>(null); // State to store user name

  useEffect(() => {
    const auth = getAuth();

    // Listen for authentication state changes
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUserName(user.displayName || user.email); // Set user name or email if displayName is not available
      } else {
        setUserName(null); // Clear user name if no user is logged in
      }
    });

    return () => unsubscribe(); // Cleanup subscription when component unmounts
  }, []);

  const handleLogout = () => {
    // Clear the auth token or other login data
    document.cookie =
      "authToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    router.push("/login");
  };

  return (
    <html lang="en">
      <body>
        <div className="min-h-screen flex flex-col">
          {/* Header */}
          <header className="bg-gray-800 text-white py-4">
            <div className="container mx-auto flex justify-between items-center px-4">
              <div className="flex items-center space-x-6">
                <h1 className="text-xl font-semibold">
                  <Link href="/dashboard">ToDo App</Link>
                </h1>
                {/* Navigation Tabs */}
                <nav className="space-x-4">
                  <Link
                    href="/tasks"
                    className="hover:text-gray-300 transition-colors"
                  >
                    All Tasks
                  </Link>
                  <Link
                    href="/profile"
                    className="hover:text-gray-300 transition-colors"
                  >
                    Profile
                  </Link>
                </nav>
              </div>

              {/* User Info & Logout Button */}
              <div className="flex items-center space-x-4">
                {userName && (
                  <span className="text-sm">Hello, {userName}</span> // Display user's name
                )}
                <button
                  className="bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded"
                  onClick={handleLogout}
                >
                  Logout
                </button>
              </div>
            </div>
          </header>

          {/* Main Content (child content) */}
          <main className="flex-1 bg-gray-100 p-4">{children}</main>
        </div>
      </body>
    </html>
  );
}
