"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import "../../../lib/firebase/config"; // Ensure this path is correct
import { Login } from "../../../lib/action";

type LoginProps = {
  emailProp?: string;
  passwordProp?: string;
};

type LoginErrors = {
  email?: string;
  password?: string;
};

export default function LoginPage({
  emailProp = "",
  passwordProp = "",
}: LoginProps) {
  const router = useRouter();
  const [email, setEmail] = useState(emailProp);
  const [password, setPassword] = useState(passwordProp);
  const [errors, setErrors] = useState<LoginErrors>({});

  const validateEmail = (email: string) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    const newErrors: LoginErrors = {};
    if (!email) newErrors.email = "Email is required";
    else if (!validateEmail(email)) newErrors.email = "Invalid email address";

    if (!password) newErrors.password = "Password is required";
    else if (password.length < 6)
      newErrors.password = "Password must be at least 6 characters";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      console.log("Login attempt:", { email, password });

      const res = await Login(email, password);
      console.log("User logged in successfully", res);

      router.push("/dashboard");
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      console.error("Login error:", error);

      setErrors((prev) => ({
        ...prev,
        password: error.message || "Failed to log in",
      }));
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Login to Your Todo App</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <Input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={errors.email ? "border-red-500" : ""}
              />
              {errors.email && (
                <p className="text-red-500 text-sm mt-1">{errors.email}</p>
              )}
            </div>
            <div>
              <Input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={errors.password ? "border-red-500" : ""}
              />
              {errors.password && (
                <p className="text-red-500 text-sm mt-1">{errors.password}</p>
              )}
            </div>
            <Button type="submit" className="w-full">
              Login
            </Button>
            <Button
              variant="link"
              onClick={() => router.push("/signup")}
              className="text-sm text-blue-600 underline mt-2"
            >
              Create an Account
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
