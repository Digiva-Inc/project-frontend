"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import AddUserModal from "./AddUserModal";
import RemoveUserModal from "./RemoveUserModal";
import { useRouter } from "next/navigation";


export default function Navbar() {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [addOpen, setAddOpen] = useState(false);
  const [removeOpen, setRemoveOpen] = useState(false);

  // Validation For Role of User || Admin
  const router = useRouter();

  useEffect(() => {
    const role = localStorage.getItem("role");

    if (!role) {
      alert("Please login first");
      router.push("/login");
      return;
    }

    if (role !== "Admin") {
      router.push("/"); 
      alert("Access denied. Only Admin can access this page.");
      return
    }

  }, [router]);

  /* === SHARED ACTIONS (IMPORTANT) === */
  const openAddUser = () => {
    setAddOpen(true);
    setDropdownOpen(false);
    setMobileOpen(false);
  };


  const openRemoveUser = () => {
    setRemoveOpen(true);
    setDropdownOpen(false);
    setMobileOpen(false);
  };

  return (
    <>
      <nav className="bg-white shadow px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center relative">
        {/* Logo */}
        <Image src="/digiva.png" alt="Digiva" width={120} height={40} />

        {/* ================= DESKTOP ================= */}
        <div className="hidden md:block relative">
          <button
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="bg-blue-600 text-white px-5 py-2 rounded-xl font-semibold shadow hover:bg-blue-700"
          >
            Manage Users ▾
          </button>

          {dropdownOpen && (
            <div
              className="
      absolute right-0 mt-3 w-52
      bg-white  shadow-lg
      rounded-xl overflow-hidden
      z-50
    "
            >
              <button
                onClick={openAddUser}
                className="
        w-full px-4 py-3 text-left
        hover:bg-blue-50
        rounded-t-xl
      "
              >
                ➕ Add User
              </button>

              <button
                onClick={openRemoveUser}
                className="
        w-full px-4 py-3 text-left
        hover:bg-red-50
        rounded-b-xl
      "
              >
                🗑 Remove User
              </button>
            </div>
          )}

        </div>

        {/* ================= MOBILE ================= */}
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="md:hidden text-3xl"
        >
          ☰
        </button>
      </nav>

      {/* MOBILE MENU */}
      {mobileOpen && (
        <div className="md:hidden bg-white shadow border-t px-4 py-3 space-y-3">
          <button
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="w-full bg-blue-600 text-white px-4 py-2 rounded-xl font-semibold"
          >
            Manage Users
          </button>

          {dropdownOpen && (
            <div className="space-y-2">
              <button
                onClick={openAddUser}
                className="w-full bg-blue-50 text-blue-700 px-4 py-2 rounded-lg"
              >
                ➕ Add User
              </button>

              <button
                onClick={openRemoveUser}
                className="w-full bg-red-50 text-red-700 px-4 py-2 rounded-lg"
              >
                🗑 Remove User
              </button>
            </div>
          )}
        </div>
      )}

      {/* MODALS (UNCHANGED LOGIC) */}
      <AddUserModal open={addOpen} setOpen={setAddOpen} />
      <RemoveUserModal open={removeOpen} setOpen={setRemoveOpen} />
    </>
  );
}
