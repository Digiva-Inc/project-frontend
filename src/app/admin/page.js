"use client";
import { useEffect, useState } from "react";
import Navbar from "./Navbar";
import EditStatusModal from "./EditStatusModal";

export default function AdminPage() {
  const [employees, setEmployees] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editRecord, setEditRecord] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

// solve this problem

  //late function
  /* =========================
  FETCH RECORDS FROM API
  ========================= */
  const fetchRecords = async () => {
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      const res = await fetch("http://localhost:5000/api/admin/records", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();

      if (data.success) {
        setEmployees(data.data);
      }
    } catch (err) {
      console.error("Fetch error", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecords();

    const interval = setInterval(() => {
      fetchRecords();
    }, 10000); // refresh every 10 seconds

    return () => clearInterval(interval);
  }, []);

  // late arrival
  /* =========================
     DASHBOARD COUNTS
  ========================= */
  const totalEmployees = employees.length;

  const presentToday = employees.filter(
    (e) => e.status === "Present" || e.status === "Half Leave",
  ).length;

  const absentToday = employees.filter(
  (e) => e.status === "Absent" || e.status === "Auto Absent"
  ).length;

  // ✅ SEARCH FUNCTION
  const handleSearch = (e) => {
    const value = e.target.value;
    setSearchTerm(value);

    const filtered = employees.filter(emp =>
      emp.name.toLowerCase().includes(value.toLowerCase())
    );

    setFilteredData(filtered);
  };

  return (
    <>
      <Navbar />

      <main className="bg-gradient-to-br from-gray-50 to-gray-100 min-h-screen px-8 py-10">
        <div className="max-w-7xl mx-auto animate-fadeIn">
          {/* Welcome Text */}
          <div className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">

            {/* Left Side - Welcome Text */}
            <div>
              <h1 className="text-4xl font-extrabold text-gray-900">
                Welcome Admin 👋
              </h1>
              <p className="mt-2 text-lg text-gray-600">
                Here's a quick overview of today’s attendance
              </p>
            </div>

            {/* Right Side - Search Box */}
            <div className="relative w-full md:w-72">

              {/* 🔍 Search Icon */}
              <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                🔍
              </span>

              <input
                type="text"
                value={searchTerm}
                onChange={handleSearch}
                placeholder="Search employee..."
                className="w-full pl-10 pr-4 py-2 border border-black rounded-lg shadow-sm focus:outline-none focus:ring-0"

              />

            </div>


          </div>


          {/* Summary Cards */}
          {/* <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-12"> */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            <DashboardCard
              title="Total Employees"
              value={totalEmployees}
              color="blue"
            />
            <DashboardCard
              title="Present Today"
              value={presentToday}
              color="green"
            />
            <DashboardCard
              title="Late Arrivals"
              value={lateArrivals}
              color="orange"
            />
          </div>

          {/* Attendance Table */}
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
            <table className="w-full text-left">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-6 py-4">Employee Name</th>
                  <th className="px-6 py-4">Arrival</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4">Edit</th>
                </tr>
              </thead>

              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan="4" className="text-center py-6">
                      Loading...
                    </td>
                  </tr>
                ) : filteredData.length === 0 ? (

                  <tr>
                    <td colSpan="4" className="text-center py-6">
                      No attendance records found
                    </td>
                  </tr>
                ) : (
                  filteredData.map((emp) => (
                    <tr
                      key={emp.id}
                      className="border-b last:border-none hover:bg-gray-50 transition"
                    >
                      <td className="px-6 py-4 font-medium text-gray-900">
                        {emp.name}
                      </td>
                      <td className="px-6 py-4 text-gray-700">
                        {emp.login_time}
                      </td>
                      <td className="px-6 py-4">
                        <StatusBadge status={emp.status} />
                      </td>
                      {/* <td className="px-6 py-4">
                        <button className="text-blue-600 hover:text-blue-800 font-semibold">
                          Edit
                        </button>
                      </td> */}
                      <td className="p-4">
                        <button
                          onClick={() => setEditRecord(emp)}
                          className="text-blue-600 font-semibold"
                        >
                          Edit
                        </button>
                        {/* <button
                        className="text-blue-600"
                        onClick={() => {
                          setSelectedRecord(emp);
                          setEditOpen(true);
                        }}
                      >
                        Edit */}
                        {/* </button> */}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>
      {/* EDIT MODAL */}
      <EditStatusModal
        key={editRecord?.id} // 🔑 forces fresh selection per record
        open={!!editRecord}
        record={editRecord}
        onClose={() => setEditRecord(null)}
        onUpdated={fetchRecords}
      />
    </>
  );
}

/* =========================
   COMPONENTS (UNCHANGED)
========================= */

function DashboardCard({ title, value, color }) {
  const colors = {
    blue: "text-blue-600 bg-blue-50",
    green: "text-green-600 bg-green-50",
    orange: "text-orange-600 bg-orange-50",
  };

  return (
    <div
      className={`
        rounded-2xl p-6 shadow-md ${colors[color]}
        transition-all duration-300 ease-out
        hover:shadow-xl hover:-translate-y-1
        cursor-pointer
      `}
    >
      <p className="text-sm font-semibold text-gray-600 uppercase">{title}</p>

      <p className="mt-3 text-4xl font-extrabold">{value}</p>
    </div>
  );
}

function StatusBadge({ status }) {
  const base = "px-3 py-1 rounded-full text-sm font-semibold inline-block";

  if (status === "Present") {
    return (
      <span className={`${base} bg-green-100 text-green-700`}>Present</span>
    );
  }

  if (status === "Absent") {
    return (
      <span className={`${base} bg-yellow-100 text-yellow-700`}>Absent</span>
    );
  }

  if (status === "Half Leave") {
    return (
      <span className={`${base} bg-orange-100 text-orange-700`}>
        Half Leave
      </span>
    );
  }

  if (status === "Auto Absent") {
    return <span className={`${base} bg-red-100 text-red-700`}>Auto Absent</span>;
  }

  if (status === "Absent") {
    return <span className={`${base} bg-yellow-100 text-yellow-700`}>Absent</span>;
  }

  return <span className={`${base} bg-gray-100 text-gray-700`}>{status}</span>;
}
