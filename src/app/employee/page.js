"use client";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { useEffect, useState } from "react";
import Navbar from "./navbar";
import { useRouter } from "next/navigation";

export default function Page() {
  const [viewMode, setViewMode] = useState(null);

  const [name, setName] = useState("Employee");

  const [reportData, setReportData] = useState([]);
  const [status, setStatus] = useState(null);
  const [locked, setLocked] = useState(false);
  const [time, setTime] = useState("");
  const [date, setDate] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [distance, setDistance] = useState(null);
  const [geoError, setGeoError] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [chartData, setChartData] = useState([]);
  const [showReport, setShowReport] = useState(false);
  const API_BASE = process.env.NEXT_PUBLIC_API_URL;

  const router = useRouter();



  const fetchChartData = async () => {
    if (!fromDate || !toDate) {
      alert("Select both dates");
      return;
    }

    const token = localStorage.getItem("token");

    if (!token) {
      alert("Session expired. Please login again.");
      return;
    }

    const userId = localStorage.getItem("userId");

    if (!userId) {
      alert("User ID missing. Please login again.");
      return;
    }

    try {
      const res = await fetch(
        `${API_BASE}/chart/attendance-summary?from=${fromDate}&to=${toDate}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await res.json();

      if (!res.ok) {
        alert(data.message || "Error fetching data");
        return;
      }

      const total =
        data.total_present +
        data.total_absent +
        data.total_half_leave +
        data.total_auto_absent;

      if (total === 0) {
        setChartData([]);
        return;
      }

      const formattedData = [
        {
          name: "Present",
          value: data.total_present,
        },
        {
          name: "Absent",
          value: data.total_absent,
        },
        {
          name: "Half Leave",
          value: data.total_half_leave,
        },
        {
          name: "Auto Absent",
          value: data.total_auto_absent,
        },
      ];

      setChartData(formattedData);
    } catch (error) {
      console.log(error);
      alert("Server error");
    }
  };


  const fetchReportData = async () => {
    if (!fromDate || !toDate) {
      alert("Select both dates");
      return;
    }

    const token = localStorage.getItem("token");

    try {
      const res = await fetch(
        `${API_BASE}/attendance/report?from=${fromDate}&to=${toDate}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await res.json();

      if (!res.ok) {
        alert(data.message || "Error fetching report");
        return;
      }

      setReportData(data.records);
    } catch (error) {
      console.log(error);
      alert("Server error");
    }
  };

  useEffect(() => {
    const role = localStorage.getItem("role");

    if (!role) {
      router.push("/");
      return;
    }

    if (role !== "user") {
      router.push("/");
      alert("Access denied. Admin cannot access this page.");
      return
    }

  }, [router]);


  // 🔹 Load attendance status
  useEffect(() => {
    const checkAttendance = async () => {
      const token = localStorage.getItem("token");
      if (!token) return;

      const res = await fetch(`${API_BASE}/attendance/check`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await res.json();

      if (data.status) {
        setStatus(data.status);
        setTime(data.time);
        setDate(formatDate(data.isoTime));
        setDistance(data.distance);
        setMessage(data.message);
        setLocked(true);
      }
    };

    checkAttendance();
  }, []);

  // 🔹 Load user name
  useEffect(() => {
    const storedName = localStorage.getItem("userName");
    if (storedName) setName(storedName);
  }, []);

  const formatDate = (iso) => {
    const d = new Date(iso);
    return `${String(d.getDate()).padStart(2, "0")}/${String(
      d.getMonth() + 1
    ).padStart(2, "0")}/${d.getFullYear()}`;
  };

  // ✅ ONLY reliable way to get location
  const getCurrentLocation = () => {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject("Geolocation not supported");
        return;
      }

      navigator.geolocation.getCurrentPosition(
        (position) => {
          resolve({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          });
        },
        (error) => {
          if (error.code === error.PERMISSION_DENIED) {
            reject("PERMISSION_DENIED");
          } else {
            reject("LOCATION_ERROR");
          }
        },
        {
          enableHighAccuracy: true,
          timeout: 15000,
          maximumAge: 0,
        }
      );
    });
  };

  // ✅ FINAL, FIXED ATTENDANCE FLOW
  const markAttendance = async (type) => {
    if (locked || loading) return;

    const token = localStorage.getItem("token");
    if (!token) {
      alert("Session expired. Please login again.");
      return;
    }

    setLoading(true);
    setGeoError("");
    setMessage("");

    try {
      // 1️⃣ Force browser location popup
      const location = await getCurrentLocation();

      // 2️⃣ Call backend ONLY after GPS success
      const res = await fetch(`${API_BASE}/attendance/${type}`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(location),
      });

      const data = await res.json();

      if (!res.ok) {
        setGeoError(data.message || "Attendance failed");
        return;
      }

      // 3️⃣ Success UI update
      setStatus(data.status);
      setTime(data.time);
      setDate(formatDate(data.isoTime));
      setDistance(data.distance);
      setMessage(data.message);
      setLocked(true);
    } catch (err) {
      if (err === "PERMISSION_DENIED") {
        setGeoError(
          "Location permission denied. Please allow location and click Present again."
        );
      } else {
        setGeoError("Unable to fetch location. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar onReportClick={() => setShowReport(prev => !prev)} />

      <div className="flex items-center justify-center px-4 py-10 cursor-default">
        <div className="w-full max-w-4xl bg-white rounded-3xl shadow-md p-6 sm:p-10 space-y-10">
          <h1 className="text-3xl font-semibold">
            Welcome, <span className="font-bold">{name}</span>
          </h1>

          <div className="text-center space-y-4">
            <p className="text-sm text-gray-600 font-medium">
              Today’s Attendance Status
            </p>

            <div className="flex justify-center gap-4">
              <button
                onClick={() => markAttendance("present")}
                disabled={locked || loading}
                className="px-6 py-2 rounded-xl border border-green-400 text-green-700 hover:bg-black hover:text-white disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
              >
                Present
              </button>

              <button
                onClick={() => markAttendance("absent")}
                disabled={locked || loading}
                className="px-6 py-2 rounded-xl border border-red-400 text-red-700 hover:bg-black hover:text-white disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
              >
                Absent
              </button>
            </div>

            {geoError && (
              <p className="text-sm text-red-600 text-center mt-2">
                {geoError}
              </p>
            )}

            {locked && (
              <p className="text-sm text-gray-500">
                Status locked for today
              </p>
            )}
          </div>

          {/* Chart Section */}
          {showReport && (
            <div className="mt-10 border rounded-2xl p-6 bg-gray-50">
              <h2 className="text-lg font-semibold mb-4 text-center">
                Attendance Report (Between Dates)
              </h2>

              <div className="flex flex-col md:flex-row gap-4 justify-center mb-6">

                <input
                  type="date"
                  value={fromDate}
                  onChange={(e) => setFromDate(e.target.value)}
                  className="border px-3 py-2 rounded-lg w-full md:w-auto text-sm cursor-pointer"
                />

                <input
                  type="date"
                  value={toDate}
                  onChange={(e) => setToDate(e.target.value)}
                  className="border px-3 py-2 rounded-lg w-full md:w-auto text-sm cursor-pointer"
                />

                <button
                  onClick={() => {
                    setViewMode("chart");
                    fetchChartData();
                  }}
                  className={`px-6 py-2 rounded-full font-medium transition-all duration-200 cursor-pointer
                  ${viewMode === "chart"
                      ? "bg-blue-500 text-white shadow-md scale-105"
                      : "bg-gray-200 text-gray-700 hover:bg-blue-100"
                    }`}
                >
                  Show Chart
                </button>

                <button
                  onClick={() => {
                    setViewMode("table");
                    fetchReportData();
                  }}
                  className={`px-6 py-2 rounded-full font-medium transition-all duration-200 cursor-pointer
                ${viewMode === "table"
                      ? "bg-blue-500 text-white shadow-md scale-105"
                      : "bg-gray-200 text-gray-700 hover:bg-blue-100"
                    }`}
                >
                  Show Report
                </button>
              </div>



              <div className="w-full">

                {viewMode === "chart" && chartData.length > 0 && (
                  <div className="w-full h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={chartData}
                          dataKey="value"
                          nameKey="name"
                          innerRadius="55%"
                          outerRadius="80%"
                          paddingAngle={3}
                          isAnimationActive
                        >
                          {chartData.map((entry, index) => {
                            const colors = {
                              Present: "#22c55e",
                              Absent: "#ef4444",
                              "Half Leave": "#facc15",
                              "Auto Absent": "#2596be",
                            };

                            return (
                              <Cell
                                key={`cell-${index}`}
                                fill={colors[entry.name]}
                              />
                            );
                          })}
                        </Pie>

                        {/* Center Content */}
                        <text
                          x="50%"
                          y="40%"
                          textAnchor="middle"
                          dominantBaseline="middle"
                          className="fill-gray-500 text-sm"
                        >
                          Total Days
                        </text>

                        <text
                          x="50%"
                          y="50%"
                          textAnchor="middle"
                          dominantBaseline="middle"
                          className="fill-gray-800 text-2xl font-bold"
                        >
                          {chartData.reduce((sum, item) => sum + item.value, 0)}
                        </text>

                        <Tooltip
                          formatter={(value, name) => [`${value} Days`, name]}
                        />

                        <Legend
                          layout="horizontal"
                          verticalAlign="bottom"
                          align="center"
                        />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                )}

                {viewMode === "table" && reportData.length > 0 && (
                  <div className="mt-4 border rounded-md overflow-hidden">

                    <div className="overflow-x-auto max-h-60 overflow-y-auto">
                      <table className="w-full text-xs sm:text-sm bg-white">

                        <thead className="bg-gray-200 text-gray-700 sticky top-0">
                          <tr>
                            <th className="px-2 py-1 text-left">#</th>
                            <th className="px-2 py-1 text-left">Name</th>
                            <th className="px-2 py-1 text-left">Login</th>
                            <th className="px-2 py-1 text-left">Status</th>
                          </tr>
                        </thead>

                        <tbody>
                          {reportData.map((item, index) => (
                            <tr key={index} className="border-b border-gray-200 hover:bg-gray-50">

                              <td className="px-2 py-2">{index + 1}</td>

                              <td className="px-2 py-2 truncate max-w-[90px]">
                                {item.name}
                              </td>

                              <td className="px-2 py-2 text-[10px] sm:text-xs whitespace-nowrap">
                                {new Date(item.login_time).toLocaleString()}
                              </td>

                              <td className="px-2 py-2">
                                <span
                                  className={`px-1.5 py-0.5 rounded text-[10px] sm:text-xs ${item.status === "Present"
                                      ? "bg-green-100 text-green-700"
                                      : item.status === "Absent"
                                        ? "bg-red-100 text-red-700"
                                        : "bg-blue-100 text-blue-700"
                                    }`}
                                >
                                  {item.status}
                                </span>
                              </td>

                            </tr>
                          ))}
                        </tbody>

                      </table>
                    </div>

                  </div>
                )}

              </div>


            </div>)}





          {status && (
            <div className="rounded-2xl border bg-gray-50 p-6 text-center space-y-3">
              <p className="text-xs uppercase tracking-wide text-gray-400">
                Attendance Summary
              </p>

              <p className="text-2xl font-semibold">{status}</p>

              <p className="text-sm">Date: <b>{date}</b></p>
              <p className="text-sm">Time: <b>{time}</b></p>

              {distance !== null && (
                <p className="text-sm text-green-700">
                  Distance from office: <b>{distance} meters</b>
                </p>
              )}

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