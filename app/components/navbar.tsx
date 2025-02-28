"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";

const Navbar = () => {
    const router = useRouter();

    const handleLoginClick = () => {
        router.push("/api/auth/login");
    };

    return (
        <header className="px-5 py-3 bg-white shadow-sm font-work-sans">
            <nav className="flex justify-between items-center">
                <Link href="/">
                    <Image src="/logo.png" alt="Logo" width={100} height={30} />
                </Link>

                <div className="flex items-end">
                    <button 
                        onClick={handleLoginClick} 
                        className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition"
                    >
                        Login/Register
                    </button>
                </div>
            </nav>
        </header>
    );
};

export default Navbar;
