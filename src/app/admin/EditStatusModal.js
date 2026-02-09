"use client";
import { useState, useEffect } from "react";

export default function EditStatusModal({ open, onClose, record, onUpdated }) {
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (open) {
      setStatus(""); // reset dropdown every time modal opens
    }
  }, [open, record]);


  if (!open) return null;

  const updateStatus = async () => {

    if (!status) {
      alert("Please select any one option");
      return;
    }

    const token = localStorage.getItem("token");
    if (!token) return alert("Session expired");

    setLoading(true);

    try {
      const res = await fetch(
        `http://localhost:5000/api/admin/update-status/${record.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ status }),
        },
      );

      const data = await res.json();

      if (!res.ok) {
        alert(data.message || "Update failed");
        return;
      }

      onUpdated(); // refresh list
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
        <h2 className="text-xl font-bold mb-4">Update Attendance Status</h2>

        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="w-full border rounded-lg px-3 py-2"
        >
          <option value="">Please select any one option</option>
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
