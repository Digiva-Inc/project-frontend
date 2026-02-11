"use client";
import { useEffect, useState } from "react";
import Navbar from "./Navbar";
import EditStatusModal from "./EditStatusModal";
import * as XLSX from "xlsx";

export default function AdminPage() {
  const [employees, setEmployees] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [editRecord, setEditRecord] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);

  const API_BASE = process.env.NEXT_PUBLIC_API_URL;

  /* =========================
     FETCH RECORDS FROM API
  ========================= */
    const fetchRecords = async () => {
      const token = localStorage.getItem("token");
      if (!token) return;

      try {
        const res = await fetch(
          `${API_BASE}/admin/records`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const data = await res.json();

        if (data.success) {
          setEmployees(data.data);
          setFilteredData(data.data);
        }
      } catch (err) {
        console.error("Fetch error", err);
      } finally {
        setLoading(false);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecords();
  }, []);

  /* ===== SEARCH ===== */
  const handleSearch = (e) => {
    const value = e.target.value;
    setSearchTerm(value);

    setFilteredData(
      employees.filter((emp) =>
        emp.name.toLowerCase().includes(value.toLowerCase())
      )
    );
  };

  const presentToday = employees.filter(
    (e) => e.status === "Present" || e.status === "Half Leave"
  ).length;

  const absentToday = employees.filter(
    (e) => e.status === "Absent" || e.status === "Auto Absent"
  ).length;

  const formatDateTime = (dateString) => {
    const d = new Date(dateString);
    return d.toLocaleString("en-IN", {
      dateStyle: "medium",
      timeStyle: "short"
    });
  };

  // XLSX
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split("T")[0]
  );

  // // ✅ Extract date from row
  // const getRowDate = (dateTime) =>
  //   new Date(dateTime).toISOString().split("T")[0];

  // // ✅ Check if date is locked (exported)
  // const isDateLocked = (date) => {
  //   const exportedDates =
  //     JSON.parse(localStorage.getItem("attendance_exported_dates")) || [];
  //   return exportedDates.includes(date);
  // };

  // ✅ Fetch attendance from backend by selected date
  const fetchAttendanceByDate = async (date) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return [];

      const res = await fetch(
        `http://localhost:5000/api/admin/records-by-date?date=${date}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await res.json();

      if (!data.success) {
        console.error("Fetch failed:", data.message);
        return [];
      }

      return data.data;
    } catch (error) {
      console.error("Fetch error:", error);
      return [];
    }
  };




  const exportDateWiseExcel = async () => {
    const records = await fetchAttendanceByDate(selectedDate);

    if (!records || records.length === 0) {
      alert(`No attendance found for ${selectedDate}`);
      return;
    }

    const excelData = records.map((emp, index) => ({
      No: index + 1,
      "Employee Name": emp.name,
      "Arrival Time": new Date(emp.login_time).toLocaleString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      }),
      Status: emp.status,
    }));

    const worksheet = XLSX.utils.json_to_sheet(excelData);

    // Column widths (fix header overlap)
    worksheet["!cols"] = [
      { wch: 6 },
      { wch: 20 },
      { wch: 22 },
      { wch: 14 },
    ];

    // 🔒 Lock all cells
    const range = XLSX.utils.decode_range(worksheet["!ref"]);
    for (let r = range.s.r; r <= range.e.r; r++) {
      for (let c = range.s.c; c <= range.e.c; c++) {
        const ref = XLSX.utils.encode_cell({ r, c });
        if (!worksheet[ref]) continue;
        worksheet[ref].s = { protection: { locked: true } };
      }
    }

    // 🔒 Protect sheet
    worksheet["!protect"] = {
      password: "attendance-lock",
      selectLockedCells: false,
      selectUnlockedCells: false,
    };

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Attendance");

    XLSX.writeFile(workbook, `Attendance_${selectedDate}.xlsx`);

    // 🔒 Save export lock (frontend)
    const exportedDates =
      JSON.parse(localStorage.getItem("attendance_exported_dates")) || [];

    if (!exportedDates.includes(selectedDate)) {
      exportedDates.push(selectedDate);
      localStorage.setItem(
        "attendance_exported_dates",
        JSON.stringify(exportedDates)
      );
    }
  };



  return (
    <>
      <Navbar />

      <main className="bg-gray-100 min-h-screen px-4 sm:px-6 lg:px-8 py-6">
        <div className="max-w-7xl mx-auto">

          {/* HEADER */}
          <div className="flex flex-col md:flex-row md:justify-between gap-4 mb-8">
            <div>
              <h1 className="text-3xl font-bold">Welcome Admin 👋</h1>
              <p className="text-gray-500">
                Here's a quick overview of today’s attendance
              </p>
            </div>

            {/* Search */}
            <div className="w-full md:w-64">
              <div
                className="
      flex items-center
      w-full
      h-11
      border border-gray-300
      rounded-xl
      bg-white
      shadow-sm
      px-3
      gap-2
    "
              >
                <span className="text-gray-400 text-lg leading-none">
                  🔍
                </span>

                <input
                  value={searchTerm}
                  onChange={handleSearch}
                  placeholder="Search employee..."
                  className="
        flex-1
        bg-transparent
        outline-none
        border-none
        text-sm
      "
                />
              </div>
            </div>

          </div>

          {/* DASHBOARD CARDS */}
          <div className="grid grid-cols-3 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-10">
            <Card title="TOTAL EMPLOYEES" value={employees.length} color="blue" />
            <Card title="PRESENT TODAY" value={presentToday} color="green" />
            <Card title="ABSENT" value={absentToday} color="orange" />
          </div>

          {/* xlsx */}

          <div className="flex flex-col sm:flex-row gap-3 justify-end mb-4">
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="border rounded-lg px-3 py-2 text-sm"
            />

            <button
              onClick={exportDateWiseExcel}
              className="
                px-4 py-2
                text-sm font-medium
                border border-gray-300
                rounded-lg
               bg-green-600 text-white
                "
            >
              Export
            </button>
          </div>

          {/* ===== Attendance Table ===== */}
          <div className="mt-10 bg-white rounded-xl border border-gray-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[700px]">
                <thead className="bg-gray-200">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wide">
                      Employee
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wide">
                      Arrival Time
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wide">
                      Status
                    </th>
                    <th className="px-6 py-4 text-right text-xs font-medium text-gray-500 uppercase tracking-wide">
                      Action
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-gray-100">
                  {filteredData.map((emp) => (
                    <tr
                      key={emp.id}
                      className="
              hover:bg-gray-50
              transition-colors
            "
                    >

                      <td className="px-6 py-3">
                        <div className="flex items-center gap-3">
                          {/* Avatar */}
                          <div className="w-9 h-9 rounded-full bg-blue-100 text-blue-700
                    flex items-center justify-center
                    font-semibold uppercase">
                            {emp.name?.charAt(0)}
                          </div>

                          {/* Name */}
                          <span className="text-sm font-medium text-gray-900 capitalize">
                            {emp.name}
                          </span>
                        </div>
                      </td>

                      {/* Arrival */}
                      <td className="px-6 py-5 text-sm text-gray-600">
                        {new Date(emp.login_time).toLocaleString("en-IN", {
                          day: "2-digit",
                          month: "short",
                          year: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                          hour12: true,
                        })}

                      </td>

                      {/* Status */}
                      <td className="px-6 py-5">
                        <span
                          className={`
                  inline-flex items-center
                  px-3 py-1
                  rounded-full
                  text-xs font-medium
                  ${emp.status === "Present"
                              ? "bg-green-50 text-green-700"
                              : emp.status === "Half Leave"
                                ? "bg-orange-50 text-orange-700"
                                : "bg-red-50 text-red-700"
                            }
                `}
                        >
                          {emp.status}
                        </span>
                      </td>

                      {/* Action */}
                      <td className="px-6 py-5 text-right">

                        <button
                          onClick={() => setEditRecord(emp)}
                          className="text-sm font-medium text-blue-600 hover:text-blue-800"
                        >
                          Edit
                        </button>



                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>



        </div>
      </main>

      <EditStatusModal
        open={!!editRecord}
        record={editRecord}
        onClose={() => setEditRecord(null)}
        onUpdated={fetchRecords}
      />
    </>
  );
}

/* ===== COMPONENTS ===== */
function Card({ title, value, color }) {
  const map = {
    blue: "bg-blue-50 text-blue-600",
    green: "bg-green-50 text-green-600",
    orange: "bg-orange-50 text-orange-600",
  };

  return (
    <div className={`rounded-xl p-6 shadow ${map[color]}`}>
      <p className="text-xs font-semibold text-gray-500">{title}</p>
      <p className="text-4xl font-bold mt-2">{value}</p>
    </div>
  );
}

function StatusBadge({ status }) {
  const base =
    "inline-flex items-center px-4 py-1.5 rounded-full text-sm font-semibold";

  if (status === "Present") {
    return (
      <span className={`${base} bg-green-100 text-green-700`}>
        Present
      </span>
    );
  }

  if (status === "Half Leave") {
    return (
      <span className={`${base} bg-orange-100 text-orange-700`}>
        Half Leave
      </span>
    );
  }



  return (
    <span className={`${base} bg-red-100 text-red-700`}>
      {status}
    </span>
  );
}
