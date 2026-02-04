"use client";
import { useState } from "react";
import Image from "next/image";
import AddUserModal from "./AddUserModal";
import RemoveUserModal from "./RemoveUserModal";

export default function Navbar() {
    const [showDropdown, setShowDropdown] = useState(false);
    const [addOpen, setAddOpen] = useState(false);
    const [removeOpen, setRemoveOpen] = useState(false);

    return (
        <>
            <nav className="bg-white shadow px-8 py-4 flex justify-between items-center relative">
                {/* Logo */}
                <div className="flex items-center gap-4">
                    <Image src="/digiva.png" alt="Logo" width={150} height={100} />
                </div>

                {/* Manage User Dropdown */}
                <div className="relative">
                    <button
                        onClick={() => setShowDropdown(!showDropdown)}
                        className={`
              bg-gradient-to-r from-blue-600 to-blue-500
              text-white px-6 py-2 rounded-xl font-semibold
              transition-all duration-200
              hover:from-blue-700 hover:to-blue-600
              hover:scale-105 active:scale-95
              shadow-lg
            `}
                    >
                        Manage Users ▾
                    </button>

                    {showDropdown && (
                        <div
                            className={`absolute right-0 mt-3 w-52
                                        bg-white rounded-2xl shadow-2xl border border-gray-100
                                        overflow-hidden z-50
                                        animate-fadeIn`}
                        >
                            {/* Add User */}
                            <button
                                onClick={() => {
                                    setAddOpen(true);
                                    setShowDropdown(false);
                                }}
                                className={`w-full flex items-center gap-3
                                            px-5 py-3 text-gray-800 font-medium
                                            hover:bg-blue-50
                                            transition-colors duration-200`}
                            >
                                <span className="flex items-center justify-center w-9 h-9 rounded-xl bg-blue-100 text-blue-600 text-lg">
                                    +
                                </span>
                                Add User
                            </button>

                            {/* Divider */}
                            <div className="h-px bg-gray-100" />

                            {/* Remove User */}
                            <button
                                onClick={() => {
                                    setRemoveOpen(true);
                                    setShowDropdown(false);
                                }}
                                className={`w-full flex items-center gap-3
                                        px-5 py-3 text-gray-800 font-medium
                                        hover:bg-red-50
                                        transition-colors duration-200`}
                            >
                                <span className="flex items-center justify-center w-9 h-9 rounded-xl bg-red-100 text-red-600 text-lg">
                                    🗑
                                </span>
                                Remove User
                            </button>
                        </div>
                    )}

                </div>
            </nav>

            {/* Modals */}
            <AddUserModal open={addOpen} setOpen={setAddOpen} />
            <RemoveUserModal open={removeOpen} setOpen={setRemoveOpen} />
        </>
    );
}
