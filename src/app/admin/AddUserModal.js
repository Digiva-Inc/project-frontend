"use client";
import { useEffect, useState } from "react";

export default function AddUserModal({ open, setOpen }) {
  const [username, setUsername] = useState("");
  const [mobile, setMobile] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const API_BASE = process.env.NEXT_PUBLIC_API_URL;


  /* =========================
     ESC CLOSE
  ========================= */
  useEffect(() => {
    const handler = (e) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [setOpen]);

  /* =========================
     REGISTER USER (API)
  ========================= */
  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const token = localStorage.getItem("token");
    if (!token) {
      setError("Unauthorized. Please login again.");
      setLoading(false);
      return;
    }

    try {
      const res = await fetch(
        `${API_BASE}/admin/register`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`, // ✅ ADDED
          },
          body: JSON.stringify({
            name: username,
            mobile,
            email,
            password,
            role,
          }),
        }
      );

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || "Registration failed");
        return;
      }

      alert("User registered successfully");

      // 🔄 Reset form
      setUsername("");
      setMobile("");
      setEmail("");
      setPassword("");
      setRole("");

      setOpen(false);
    } catch (err) {
      setError("Server error");
    } finally {
      setLoading(false);
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        onClick={() => setOpen(false)}
        className="absolute inset-0 bg-black/50"
      />

      <div className="relative bg-white w-full max-w-lg rounded-2xl p-8">
        <h2 className="text-2xl font-bold mb-4">Register New User</h2>

        {error && <p className="text-red-600 mb-3">{error}</p>}

        <form className="space-y-4" onSubmit={handleRegister}>
          <input
            placeholder="Username"
            className="w-full border px-4 py-2 rounded-xl"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />

          <input
            placeholder="Mobile"
            className="w-full border px-4 py-2 rounded-xl"
            value={mobile}
            onChange={(e) => setMobile(e.target.value)}
          />

          <input
            placeholder="Email"
            className="w-full border px-4 py-2 rounded-xl"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <input
            type="password"
            placeholder="Password"
            className="w-full border px-4 py-2 rounded-xl"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <select
            className="w-full border px-4 py-2 rounded-xl"
            value={role}
            onChange={(e) => setRole(e.target.value)}
          >
            <option value="">Select role</option>
            <option value="admin">Admin</option>
            <option value="user">User</option>
          </select>

          <div className="flex justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="px-4 py-2 border rounded-xl"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={loading}
              className="px-5 py-2 bg-green-600 text-white rounded-xl disabled:opacity-50"
            >
              {loading ? "Registering..." : "Register"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
