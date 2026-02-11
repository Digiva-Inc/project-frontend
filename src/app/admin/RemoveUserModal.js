"use client";
import { useEffect, useState } from "react";

export default function RemoveUserModal({ open, setOpen }) {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const API_BASE = process.env.NEXT_PUBLIC_API_URL;


  /* ===============================
     FETCH USERS
  =============================== */
  useEffect(() => {
    if (!open) return;

    const fetchUsers = async () => {
      const token = localStorage.getItem("token");
      if (!token) return;

      try {
        const res = await fetch(
          `${API_BASE}/admin/users`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const data = await res.json();
        if (data.success) {
          setUsers(data.data);
        }
      } catch {
        setError("Failed to load users");
      }
    };

    fetchUsers();
  }, [open]);

  /* ===============================
     DELETE USER
  =============================== */
  const deleteUser = async (userId, name) => {
    if (!confirm(`Are you sure you want to remove ${name}?`)) return;

    const token = localStorage.getItem("token");
    if (!token) return;

    setLoading(true);

    try {
      const res = await fetch(
        `http://localhost:5000/api/admin/delete-user/${userId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await res.json();

      if (!res.ok) {
        alert(data.message || "Delete failed");
        return;
      }

      // 🔄 Remove user from UI
      setUsers((prev) => prev.filter((u) => u.id !== userId));
    } catch {
      alert("Server error");
    } finally {
      setLoading(false);
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        onClick={() => setOpen(false)}
        className="absolute inset-0 bg-black/50"
      />

      {/* Modal */}
      <div className="relative bg-white w-full max-w-md rounded-2xl shadow-2xl p-6">
        <h2 className="text-2xl font-bold mb-2">Remove User</h2>
        <p className="text-gray-600 mb-4">
          Select a user to remove from the system
        </p>

        {error && <p className="text-red-600 mb-3">{error}</p>}

        <div className="space-y-3 max-h-64 overflow-y-auto">
          {users.length === 0 ? (
            <p className="text-gray-500 text-center">No users found</p>
          ) : (
            users.map((user) => (
              <div
                key={user.id}
                className="flex justify-between items-center border rounded-lg px-4 py-2"
              >
                <span className="font-medium">{user.name}</span>

                <button
                  disabled={loading}
                  onClick={() => deleteUser(user.id, user.name)}
                  className="text-red-600 hover:text-red-800 font-semibold disabled:opacity-50"
                >
                  Remove
                </button>
              </div>
            ))
          )}
        </div>

        <div className="flex justify-end mt-6">
          <button
            onClick={() => setOpen(false)}
            className="px-5 py-2 border rounded-lg"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
