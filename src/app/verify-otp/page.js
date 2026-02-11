"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export default function VerifyOtp() {

  const router = useRouter();
  const params = useSearchParams();

  const email = params.get("email");

  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);

  const API_BASE = process.env.NEXT_PUBLIC_API_URL;


  const verifyOtp = async () => {

    if (!otp) {
      alert("Enter OTP");
      return;
    }

    setLoading(true);

    try {

      const res = await fetch(`${API_BASE}/auth/verify-otp`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, otp }),
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.message || "Invalid OTP");
        return;
      }

      // ✅ SAVE TOKEN
      localStorage.setItem("resetToken", data.token);

      alert("OTP verified");

      router.push(`/reset-password?email=${email}`);

    } catch {

      alert("Server error");

    } finally {

      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">

      <div className="bg-white p-6 rounded-xl shadow w-full max-w-sm">

        <h2 className="text-xl font-bold text-center mb-4">
          Verify OTP
        </h2>

        <p className="text-sm text-center mb-3 text-gray-600">
          {email}
        </p>

        <input
          type="text"
          placeholder="Enter OTP"
          className="w-full border px-3 py-2 rounded mb-4"
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
        />

        <button
          onClick={verifyOtp}
          disabled={loading}
          className="w-full bg-black text-white py-2 rounded"
        >
          {loading ? "Verifying..." : "Verify OTP"}
        </button>
        

      </div>
    </div>
  );
}