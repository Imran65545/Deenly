"use client";

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { useState, useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import Image from "next/image";
import { User, LogOut, Shield, ChevronDown } from "lucide-react";

export default function Navbar() {
    const { data: session } = useSession();
    const [isOpen, setIsOpen] = useState(false); // Dropdown state
    const pathname = usePathname();
    const dropdownRef = useRef(null);

    // Close dropdown on outside click
    useEffect(() => {
        function handleClickOutside(event) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const isActive = (path) => pathname === path;

    // UI state for image fallback
    const [imageError, setImageError] = useState(false);

    // Using unavatar.io for better Google Profile / Social image support
    // fallback=false ensures we get a 404 error if no image exists, triggering our onError
    const imageUrl = session?.user?.email
        ? `https://unavatar.io/${session.user.email}?fallback=false`
        : null;

    return (
        <nav className="bg-emerald-600 text-white shadow-lg relative z-50">
            <div className="container mx-auto px-4">
                <div className="flex justify-between items-center h-16">
                    {/* Logo */}
                    <Link href="/" className="flex items-center">
                        <Image
                            src="/deenly-logo-removebg-preview.png"
                            alt="Deenly"
                            width={320}
                            height={85}
                            className="h-20 w-auto md:h-24"
                            priority
                        />
                    </Link>

                    {/* Desktop Nav Links (Hidden on Mobile) */}
                    <div className="hidden md:flex items-center space-x-6">
                        <Link href="/" className={`hover:text-emerald-200 transition ${isActive('/') ? 'font-bold border-b-2 border-white pb-1' : ''}`}>Home</Link>
                        <Link href="/prayer" className={`hover:text-emerald-200 transition ${isActive('/prayer') ? 'font-bold border-b-2 border-white pb-1' : ''}`}>Prayer Times</Link>
                        {session && <Link href="/dashboard" className={`hover:text-emerald-200 transition ${isActive('/dashboard') ? 'font-bold border-b-2 border-white pb-1' : ''}`}>Dashboard</Link>}
                    </div>

                    {/* Right Side: Auth / Profile */}
                    <div className="flex items-center gap-4">
                        {!session ? (
                            <div className="flex items-center gap-3">
                                <Link href="/login" className="hover:text-emerald-100 font-medium text-sm">Login</Link>
                                <Link href="/register" className="bg-white text-emerald-600 px-4 py-2 rounded-lg font-bold text-sm hover:bg-emerald-50 transition">Register</Link>
                            </div>
                        ) : (
                            <div className="relative" ref={dropdownRef}>
                                <button
                                    onClick={() => setIsOpen(!isOpen)}
                                    className="flex items-center gap-2 focus:outline-none"
                                >
                                    <div className="w-10 h-10 rounded-full flex items-center justify-center border-2 border-white/30 backdrop-blur-sm hover:bg-white/30 transition overflow-hidden bg-white/20">
                                        {!imageError && imageUrl ? (
                                            <img
                                                src={imageUrl}
                                                alt="Profile"
                                                className="w-full h-full object-cover"
                                                onError={() => setImageError(true)}
                                            />
                                        ) : (
                                            <span className="text-lg font-bold">
                                                {session.user.name ? session.user.name.charAt(0).toUpperCase() : <User size={20} />}
                                            </span>
                                        )}
                                    </div>
                                    <ChevronDown size={16} className={`hidden md:block transition-transform ${isOpen ? 'rotate-180' : ''}`} />
                                </button>

                                {/* Dropdown Menu */}
                                {isOpen && (
                                    <div className="absolute right-0 mt-3 w-72 bg-white rounded-2xl shadow-xl border border-slate-100 overflow-hidden text-slate-800 animate-in fade-in zoom-in-95 duration-200 origin-top-right">
                                        <div className="p-5 bg-emerald-50 border-b border-emerald-100">
                                            <div className="flex items-center gap-3">
                                                <div className="w-12 h-12 rounded-full flex items-center justify-center text-white text-xl font-bold shadow-md overflow-hidden bg-emerald-600">
                                                    {!imageError && imageUrl ? (
                                                        <img
                                                            src={imageUrl}
                                                            alt="Profile"
                                                            className="w-full h-full object-cover"
                                                            onError={() => setImageError(true)}
                                                        />
                                                    ) : (
                                                        session.user.name?.charAt(0).toUpperCase()
                                                    )}
                                                </div>
                                                <div className="overflow-hidden">
                                                    <p className="font-bold text-lg truncate text-slate-800">{session.user.name}</p>
                                                    <p className="text-xs text-slate-500 truncate">{session.user.email}</p>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="p-2 space-y-1">
                                            {session.user.role === "admin" && (
                                                <Link
                                                    href="/admin"
                                                    onClick={() => setIsOpen(false)}
                                                    className="flex items-center gap-3 w-full p-3 rounded-xl hover:bg-slate-50 transition text-sm font-medium text-emerald-600"
                                                >
                                                    <Shield size={18} className="text-emerald-500" />
                                                    Admin Panel
                                                </Link>
                                            )}

                                            <button
                                                onClick={() => signOut()}
                                                className="flex items-center gap-3 w-full p-3 rounded-xl hover:bg-red-50 transition text-sm font-medium text-red-600"
                                            >
                                                <LogOut size={18} className="text-red-500" />
                                                Logout
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
}
