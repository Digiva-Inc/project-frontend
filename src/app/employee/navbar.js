"use client";
import { useState,useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

export default function Navbar({ onSort, onReportClick }) {
  const [open, setOpen] = useState(false);
  const router = useRouter();

  const handleLogout = () => {
    localStorage.removeItem("token");
    setOpen(false);
    router.push("/");
  };

 const handleReport = () => {
    setOpen(false);
    if (onReportClick) onReportClick();
  };

  useEffect(() => {
  const handleScroll = () => {
    setOpen(false); // close dropdown when page scrolls
  };

  window.addEventListener("scroll", handleScroll);

  return () => {
    window.removeEventListener("scroll", handleScroll);
  };
}, []);
  
  return (
    /* viewport lock prevents width increase */
    <header className="w-screen max-w-[100vw] overflow-x-hidden">
      <nav
        className={`w-full max-w-[100vw]
          bg-white shadow-sm
          px-6 py-4
          flex items-center justify-between
          relative`}
      >
        {/* LOGO (size locked to prevent hydration resize) */}
        <div className="flex items-center gap-4 shrink-0">
          <Image
            src="/digiva.png"
            alt="Digiva Logo"
            width={120}
            height={40}
            priority
            className="object-contain"
          />
        </div>

        {/* Desktop menu */}
        <div className="hidden md:flex gap-4 shrink-0">
          <button
            onClick={onReportClick}
            className="bg-black text-white px-4 py-2 rounded-lg text-sm sm:text-base transition"
          >
            Report
          </button>


          <button
            onClick={handleLogout}
            className={`px-4 py-2 border rounded-md  transition  focus-visible:outline-none bg-black text-white
              focus-visible:ring-2 `}
          >
            Logout
          </button>
        </div>

        {/* Hamburger */}
        <button
          className="md:hidden text-2xl shrink-0"
          aria-label="Menu"
          onClick={() => setOpen((p) => !p)}
        >
          ☰
        </button>


{/* Mobile menu (fixed + no layout reflow) */}
{open && (
  <div
    className="fixed top-16 right-4 w-32  shadow-lg rounded-lg p-3 flex flex-col gap-3 z-50"
  >
    <button
      onClick={handleReport}
      className="w-full py-2 rounded-md bg-black text-white"
    >
      Report
    </button>

    <button
      onClick={handleLogout}
      className="w-full py-2 rounded-md bg-black text-white"
    >
      Logout
    </button>
  </div>
)}

      </nav>
    </header>
  );
}