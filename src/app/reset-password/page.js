// "use client";

// import { useState } from "react";
// import { useRouter, useSearchParams } from "next/navigation";

// export default function ResetPassword() {
//   const router = useRouter();
//   const params = useSearchParams();

//   const email = params.get("email");

//   const [password, setPassword] = useState("");
//   const [confirm, setConfirm] = useState("");
//   const [loading, setLoading] = useState(false);

//   const API_BASE = process.env.NEXT_PUBLIC_API_URL;


//   const resetPassword = async () => {
//     if (!password || !confirm) {
//       alert("Fill all fields");
//       return;
//     }

//     if (password !== confirm) {
//       alert("Passwords do not match");
//       return;
//     }

//     // ✅ GET JWT TOKEN (FROM VERIFY OTP STEP)
//     const token = localStorage.getItem("resetToken");

//     if (!token) {
//       alert("Session expired. Please verify OTP again.");
//       router.push("/forgot-password");
//       return;
//     }

//     setLoading(true);

//     try {
//       const res = await fetch(`${API_BASE}/auth/reset-password`, {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({
//           email,
//           password,
//           token, // ✅ JWT SENT
//         }),
//       });

//       const data = await res.json();

//       if (!res.ok) {
//         alert(data.message || "Reset failed");
//         return;
//       }

//       alert("Password changed successfully");

//       // ✅ CLEAR TOKEN AFTER SUCCESS
//       localStorage.removeItem("resetToken");

//       // Back to login
//       router.push("/");

//     } catch {
//       alert("Server error");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
//       <div className="bg-white p-6 rounded-2xl shadow-xl w-full max-w-sm sm:p-8">
    
//         <h2 className="text-xl font-bold text-center mb-6 sm:text-2xl text-black cursor-default">
//           Reset Password
//         </h2>

//         <p className="text-sm text-center mb-3 text-gray-600">
//           {email}
//         </p>

//         <input
//           type="password"
//           placeholder="New Password"
//           className="w-full border px-3 py-2 rounded mb-4 focus:ring-1 focus:ring-black outline-none"
//           value={password}
//           onChange={(e) => setPassword(e.target.value)}
//         />

//         <input
//           type="password"
//           placeholder="Confirm Password"
//           className="w-full border px-3 py-2 rounded mb-4 focus:ring-1 focus:ring-black outline-none"
//           value={confirm}
//           onChange={(e) => setConfirm(e.target.value)}
//         />

//         <button
//           onClick={resetPassword}
//           disabled={loading}
//           className="w-1/2 block mx-auto bg-black text-white py-2 rounded-md"
//         >
//           {loading ? "Saving..." : "Reset Password"}
//         </button>

//       </div>
//     </div>
//   );
// }

"use client";

import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";

function ResetPasswordContent() {
  const router = useRouter();
  const params = useSearchParams();

  const email = params.get("email");

  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);

  const API_BASE = process.env.NEXT_PUBLIC_API_URL;

  const resetPassword = async () => {
    if (!password || !confirm) {
      alert("Fill all fields");
      return;
    }

    if (password !== confirm) {
      alert("Passwords do not match");
      return;
    }

    const token = localStorage.getItem("resetToken");

    if (!token) {
      alert("Session expired. Please verify OTP again.");
      router.push("/forgot-password");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch(`${API_BASE}/auth/reset-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          password,
          token,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.message || "Reset failed");
        return;
      }

      alert("Password changed successfully");
      localStorage.removeItem("resetToken");
      router.push("/");
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
          Reset Password
        </h2>

        <p className="text-sm text-center mb-3 text-gray-600">
          {email}
        </p>

        <input
          type="password"
          placeholder="New Password"
          className="w-full border px-3 py-2 rounded mb-4 focus:ring-1 focus:ring-black outline-none"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <input
          type="password"
          placeholder="Confirm Password"
          className="w-full border px-3 py-2 rounded mb-4 focus:ring-1 focus:ring-black outline-none"
          value={confirm}
          onChange={(e) => setConfirm(e.target.value)}
        />

        <button
          onClick={resetPassword}
          disabled={loading}
          className="w-1/2 block mx-auto bg-black text-white py-2 rounded-md"
        >
          {loading ? "Saving..." : "Reset Password"}
        </button>
      </div>
    </div>
  );
}

export default function ResetPassword() {
  return (
    <Suspense fallback={<div className="mt-20 text-center">Loading...</div>}>
      <ResetPasswordContent />
    </Suspense>
  );
}
