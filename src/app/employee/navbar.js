"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Menu, X } from "lucide-react";

export default function Navbar({ onReportClick }) {
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
      setOpen(false);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header className="w-screen max-w-[100vw] overflow-x-hidden">
      <nav className="w-full bg-white shadow-sm px-6 py-4 flex items-center justify-between relative">

        {/* Logo */}
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

        {/* Desktop Buttons */}
        <div className="hidden md:flex items-center gap-4">
          <button
            onClick={handleReport}
            className="px-4 py-2 rounded-md bg-black text-white hover:opacity-80 transition"
          >
            Report
          </button>

          <button
            onClick={handleLogout}
            className="px-4 py-2 rounded-md bg-black text-white hover:opacity-80 transition"
          >
            Logout
          </button>
        </div>

        {/* Mobile Hamburger */}
        <button
          className="md:hidden transition-transform duration-300"
          aria-label="Menu"
          onClick={() => setOpen((prev) => !prev)}
        >
          {open ? (
            <X size={28} className="rotate-180 transition-transform duration-300" />
          ) : (
            <Menu size={28} />
          )}
        </button>

        {/* Mobile Dropdown */}
        {open && (
          <div className="fixed top-16 right-4 w-32 bg-white shadow-lg rounded-lg p-3 flex flex-col gap-3 z-50 md:hidden">
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