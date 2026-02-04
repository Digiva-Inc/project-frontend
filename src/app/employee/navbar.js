"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const router = useRouter();

  const handleLogout = () => {
    setOpen(false);
    router.push("/");
  };

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
            onClick={handleLogout}
            className={`px-4 py-2 border rounded-md hover:bg-black hover:text-white transition  focus-visible:outline-none
              focus-visible:ring-2 focus-visible:ring-black`}
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
            className={` fixed
              top-[72px]
              right-4
              z-50
              w-44
              bg-white
              shadow-lg
              rounded-lg`}
          >
            <button
              onClick={handleLogout}
             className="
  block w-full text-left
  px-4 py-3 rounded-md
  transition
  hover:bg-black hover:text-white
  active:bg-black active:text-white
  focus:bg-black focus:text-white
  focus-visible:outline-none
"

            >
              Logout
            </button>
          </div>
        )}
      </nav>
    </header>
  );
}
