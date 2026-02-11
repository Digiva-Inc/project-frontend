"use client";
import { useEffect, useState } from "react";

export default function EditStatusModal({ open, onClose, record, onUpdated }) {
  const [status, setStatus] = useState("selected items");
  const [loading, setLoading] = useState(false);
  const API_BASE = process.env.NEXT_PUBLIC_API_URL;


  // 🔑 ALWAYS bind dropdown to SELECTED RECORD ROLE
  useEffect(() => {
    if (open && record) {
      setStatus(record.status); // ← selected role
    }
  }, [open, record]);

  if (!open || !record) return null;

  const updateStatus = async () => {

    if (!status) {
      alert("Please select any one option");
      return;
    }

    const token = localStorage.getItem("token");
    if (!token) {
      alert("Session expired");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch(
        `${API_BASE}/admin/update-status/${record.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ status }),
        }
      );

      if (!res.ok) {
        alert("Update failed");
        return;
      }

      onUpdated();
      onClose();
    } catch {
      alert("Server error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div onClick={onClose} className="absolute inset-0 bg-black/50" />

      <div className="relative bg-white rounded-xl p-6 w-full max-w-sm">
        <h2 className="text-xl font-bold mb-4">
          Update Attendance Status
        </h2>

        {/* ✅ SELECTED ROLE ONLY */}
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="w-full border rounded-lg px-3 py-2"
        >
        <option value="">Select Status</option>
          <option value="Present">Present</option>
          <option value="Half Leave">Half Leave</option>
          <option value="Absent">Absent</option>
        </select>


        <div className="flex justify-end gap-3 mt-6">
          <button onClick={onClose} className="px-4 py-2 border rounded-lg">
            Cancel
          </button>

          <button
            onClick={updateStatus}
            disabled={loading}
            className="px-4 py-2 bg-black text-white rounded-lg"
          >
            {loading ? "Saving..." : "Update"}
          </button>
        </div>
      </div>
    </div>
  );
}


