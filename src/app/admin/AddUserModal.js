// "use client";
// import { useEffect, useState } from "react";

// export default function AddUserModal({ open, setOpen }) {
//   // 🔹 ADDED STATE
//   const [username, setUsername] = useState("");
//   const [mobile, setMobile] = useState("");
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [role, setRole] = useState("");
//   const [error, setError] = useState("");

//   // Close on ESC key
//   useEffect(() => {
//     const handler = (e) => e.key === "Escape" && setOpen(false);
//     window.addEventListener("keydown", handler);
//     return () => window.removeEventListener("keydown", handler);
//   }, [setOpen]);

//   // 🔹 ADDED
//   const handleRegister = async (e) => {
//     e.preventDefault();
//     setError("");

//     try {
//       const res = await fetch("http://localhost:5000/api/admin/register", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({
//           name: username,
//           mobile,
//           email,
//           password,
//           role,
//         }),
//       });

//       const data = await res.json();

//       if (!res.ok) {
//         setError(data.message || "Registration failed");
//         return;
//       }

//       alert("User registered successfully");
//       setOpen(false);
//     } catch {
//       setError("Server error");
//     }
//   };

//   return (
//     <div
//       className={`fixed inset-0 z-50 flex items-center justify-center transition-all duration-300 ${
//         open ? "visible opacity-100" : "invisible opacity-0"
//       }`}
//     >
//       {/* Backdrop */}
//       <div
//         onClick={() => setOpen(false)}
//         className="absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity duration-300"
//       />

//       {/* Modal */}
//       <div
//         className={`relative bg-white w-full max-w-lg rounded-2xl shadow-2xl p-8 transform transition-all duration-300 ease-out
//         ${open ? "scale-100 translate-y-0 opacity-100" : "scale-95 translate-y-6 opacity-0"}`}
//       >
//         <h2 className="text-2xl font-bold text-gray-900 mb-1">
//           Register New User
//         </h2>
//         <p className="text-gray-600 mb-6">
//           Fill in the details to create a new user account
//         </p>

//         {error && <p className="text-red-600 mb-3">{error}</p>}

//         <form className="space-y-5" onSubmit={handleRegister}>
//           {/* Username */}
//           <input
//             placeholder="Enter username"
//             className="w-full border border-gray-300 rounded-xl px-4 py-2"
//             value={username}
//             onChange={(e) => setUsername(e.target.value)}
//           />

//           {/* Mobile */}
//           <input
//             placeholder="Enter mobile number"
//             className="w-full border border-gray-300 rounded-xl px-4 py-2"
//             value={mobile}
//             onChange={(e) => setMobile(e.target.value)}
//           />

//           {/* Email */}
//           <input
//             placeholder="Enter email address"
//             className="w-full border border-gray-300 rounded-xl px-4 py-2"
//             value={email}
//             onChange={(e) => setEmail(e.target.value)}
//           />

//           {/* Password */}
//           <input
//             type="password"
//             placeholder="Enter password"
//             className="w-full border border-gray-300 rounded-xl px-4 py-2"
//             value={password}
//             onChange={(e) => setPassword(e.target.value)}
//           />

//           {/* Role */}
//           <select
//             className="w-full border border-gray-300 rounded-xl px-4 py-2 bg-white"
//             value={role}
//             onChange={(e) => setRole(e.target.value)}
//           >
//             <option value="" disabled>
//               Select role
//             </option>
//             <option value="admin">Admin</option>
//             <option value="user">User</option>
//           </select>

//           {/* Buttons */}
//           <div className="flex justify-end gap-4 pt-6">
//             <button
//               type="button"
//               onClick={() => setOpen(false)}
//               className="px-5 py-2 rounded-xl border border-gray-400 text-gray-700"
//             >
//               Cancel
//             </button>

//             <button
//               type="submit"
//               className="px-6 py-2 rounded-xl bg-gradient-to-r from-green-600 to-green-500 text-white"
//             >
//               Register
//             </button>
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// }


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
        "http://localhost:5000/api/admin/register",
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
