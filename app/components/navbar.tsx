"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";

const Navbar = () => {
    const router = useRouter();

    const handleLoginClick = () => {
        router.push("/login");
    };

    return (
        <header className="fixed top-0 left-0 w-full bg-[#1C1C1C] text-white py-4 px-10 z-50">
            <nav className="flex justify-between items-center">
                {/* Logo */}
                <Link href="/">
                    <Image src="/logoblack.png" alt="Logo" width={120} height={40} />
                </Link>

                {/* Menu de Navegação */}
                <ul className="flex space-x-8 text-lg font-medium">
                    <li>
                        <Link href="/" className="hover:text-gray-400 transition">Home</Link>
                    </li>
                    <li>
                        <Link href="/services" className="hover:text-gray-400 transition">Serviços</Link>
                    </li>
                    <li>
                        <Link href="/stand" className="hover:text-gray-400 transition">Stand</Link>
                    </li>
                    <li>
                        <Link href="/contact" className="hover:text-gray-400 transition">Contato</Link>
                    </li>
                </ul>

                {/* Botão de Login/Registro */}
                <button 
                    onClick={handleLoginClick} 
                    className="px-5 py-2 bg-white text-black rounded-md hover:bg-gray-300 transition"
                >
                    Login/Registo
                </button>
            </nav>
        </header>
    );
};

export default Navbar;
