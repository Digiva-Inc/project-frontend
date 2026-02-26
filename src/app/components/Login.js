"use client";
import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";

export default function Login() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const API_BASE = process.env.NEXT_PUBLIC_API_URL;


  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch(`${API_BASE}/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || "Login failed");
        return;
      }

      // ✅ STORE AUTH DATA
      localStorage.setItem("token", data.token);
      localStorage.setItem("role", data.role);
      // localStorage.setItem("userName", data.user.name);
      // localStorage.setItem("userId", data.user.id);

      localStorage.setItem("userName", data.user);
      localStorage.setItem("userId", data.id);

      // ✅ REDIRECT
      if (data.role === "admin") {
        router.push("/admin");
      } else {
        router.push("/employee");
      }
    } catch (err) {
      setError("Server not responding");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center bg-gray-100 justify-center px-4">
      <div className="w-full max-w-sm bg-white rounded-2xl shadow-xl p-6 sm:p-8">
        <h1 className="text-xl sm:text-2xl text-black font-bold text-center mb-6 cursor-default">
          Login
        </h1>


        <form className="space-y-4" onSubmit={handleLogin}>
          {/* Email */}
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-3 text-black border rounded-md focus:ring-1 focus:ring-black outline-none"
            required
          />

          {/* Password */}
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 pr-14 text-black border rounded-md focus:ring-1 focus:ring-black outline-none"
              required
            />

            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2"
            >
              <Image
                src={showPassword ? "/hide.png" : "/show.png"}
                alt="toggle password"
                width={22}
                height={22}
              />
            </button>
          </div>

          {error && (
            <p className="text-red-500 text-sm text-center">{error}</p>
          )}

          {/* ✅ FORGOT PASSWORD ADDED (ONLY NEW PART) */}
          <p className="text-right text-sm">
            <span
              onClick={() => router.push("/forgot-password")}
              className="text-black cursor-pointer"
            >
              Forgot Password?
            </span>
          </p>

          <button
            type="submit"
            disabled={loading}
            className="mx-auto block w-1/3 bg-black text-white rounded-lg py-2 transition disabled:opacity-50"
          >
            {loading ? "..." : "Login"}
          </button>
        </form>
      </div>
    </div>
  );
}


