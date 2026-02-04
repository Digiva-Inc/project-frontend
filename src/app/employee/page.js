"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import Navbar from "./navbar";

export default function Page() {
  const searchParams = useSearchParams();
  const name = searchParams.get("user") || "Employee";

  const [status, setStatus] = useState(null);
  const [locked, setLocked] = useState(false);
  const [time, setTime] = useState("");
  const [date, setDate] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  /* ===============================
     HELPERS
  =============================== */
  const formatDate = (iso) => {
    const d = new Date(iso);
    return `${String(d.getDate()).padStart(2, "0")}/${String(
      d.getMonth() + 1
    ).padStart(2, "0")}/${d.getFullYear()}`;
  };

  /* ===============================
     API CALL
  =============================== */
  const markAttendance = async (type) => {
    if (locked || loading) return;

    const token = localStorage.getItem("token");
    if (!token) {
      alert("Session expired. Please login again.");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch(
        `http://localhost:5000/api/attendance/${type}`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await res.json();

      if (!res.ok) {
        alert(data.message);
        return;
      }

      setStatus(data.status);
      setTime(data.time);
      setDate(formatDate(data.isoTime));
      setMessage(data.message);
      setLocked(true);
    } catch (err) {
      alert("Server error");
    } finally {
      setLoading(false);
    }
  };

  /* ===============================
     UI
  =============================== */
  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />

      <div className="flex items-center justify-center px-4 py-10">
        <div className="w-full max-w-4xl bg-white rounded-3xl shadow-md p-6 sm:p-10 space-y-10">
          {/* Header */}
          <h1 className="text-3xl font-semibold">
            Welcome, <span className="font-bold">{name}</span>
          </h1>

          {/* Attendance Buttons */}
          <div className="text-center space-y-4">
            <p className="text-sm text-gray-600 font-medium">
              Today’s Attendance Status
            </p>

            <div className="flex justify-center gap-4">
              <button
                onClick={() => markAttendance("present")}
                disabled={locked || loading}
                className="px-6 py-2 rounded-xl border border-green-400 text-green-700 hover:bg-black hover:text-white disabled:opacity-50"
              >
                Present
              </button>

              <button
                onClick={() => markAttendance("absent")}
                disabled={locked || loading}
                className="px-6 py-2 rounded-xl border border-red-400 text-red-700 hover:bg-black hover:text-white disabled:opacity-50"
              >
                Absent
              </button>
            </div>

            {locked && (
              <p className="text-sm text-gray-500">
                Status locked for today
              </p>
            )}
          </div>

          {/* Summary */}
          {status && (
            <div className="rounded-2xl border bg-gray-50 p-6 text-center space-y-3">
              <p className="text-xs uppercase tracking-wide text-gray-400">
                Attendance Summary
              </p>

              <p className="text-2xl font-semibold">{status}</p>

              <p className="text-sm">
                Date: <b>{date}</b>
              </p>

              <p className="text-sm">
                Time: <b>{time}</b>
              </p>

              <div className="mt-4 px-5 py-3 rounded-xl bg-black text-white text-sm">
                {message}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
