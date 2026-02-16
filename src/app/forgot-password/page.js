"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const API_BASE = process.env.NEXT_PUBLIC_API_URL;


  const sendOtp = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/auth/forgot-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();
      if (!res.ok) {
        alert(data.message || "Failed");
        return;
      }

      alert("OTP sent");
      router.push(`/verify-otp?email=${email}`);
    } catch {
      alert("Server error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="bg-white p-6 rounded-2xl shadow-xl w-full max-w-sm sm:p-8">
        <h2 className="text-xl font-bold text-center mb-6 sm:text-2xl text-black cursor-default">
          Forgot Password
        </h2>

        <input
          type="email"
          placeholder="Email"
          className="w-full border px-3 py-2 rounded-md mb-4 focus:ring-1 focus:ring-black outline-none"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <button
          onClick={sendOtp}
          disabled={loading}
          className="w-1/3 block mx-auto bg-black text-white py-2 rounded-md"
        >
          {loading ? "Sending..." : "Send OTP"}
        </button>
      </div>
    </div>
  );
}