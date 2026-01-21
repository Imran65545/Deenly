"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, LayoutDashboard, Clock } from "lucide-react";

export default function BottomNav() {
    const pathname = usePathname();

    const isActive = (path) => pathname === path;

    const navItems = [
        { href: "/", icon: Home, label: "Home" },
        { href: "/dashboard", icon: LayoutDashboard, label: "Dashboard" },
        { href: "/prayer", icon: Clock, label: "Prayer" }
    ];

    return (
        <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 shadow-lg z-50 md:hidden">
            <div className="flex items-center justify-around h-16">
                {navItems.map((item) => {
                    const Icon = item.icon;
                    const active = isActive(item.href);

                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={`flex flex-col items-center justify-center flex-1 h-full transition-colors ${active
                                    ? "text-emerald-600"
                                    : "text-slate-500 hover:text-slate-700"
                                }`}
                        >
                            <Icon
                                size={24}
                                strokeWidth={active ? 2.5 : 2}
                                className="mb-1"
                            />
                            <span className={`text-xs ${active ? "font-semibold" : "font-medium"}`}>
                                {item.label}
                            </span>
                        </Link>
                    );
                })}
            </div>
        </nav>
    );
}
