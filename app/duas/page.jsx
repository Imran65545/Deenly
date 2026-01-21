"use client";

import { useRouter } from "next/navigation";
import { ArrowLeft, Sun, Moon, CloudMoon, Plane, HeartHandshake, Zap, Heart } from "lucide-react";
import { CATEGORIES } from "@/data/duas";

const IconMap = {
    Sun: Sun,
    Moon: Moon,
    CloudMoon: CloudMoon,
    Plane: Plane,
    HeartHandshake: HeartHandshake,
    HandsPraying: Heart // Fallback for Forgiveness
};

export default function DuasPage() {
    const router = useRouter();

    return (
        <div className="min-h-screen bg-slate-50 pb-20">
            {/* Header */}
            <div className="bg-white/80 backdrop-blur-md sticky top-0 z-50 border-b border-slate-100 pb-4 pt-12 px-6 shadow-sm">
                <div className="flex items-center gap-4">
                    <button
                        onClick={() => router.push('/dashboard')}
                        className="p-2 -ml-2 hover:bg-slate-100 rounded-full transition"
                    >
                        <ArrowLeft className="w-6 h-6 text-slate-600" />
                    </button>
                    <div>
                        <h1 className="text-2xl font-bold text-slate-800">Duas & Adhkar</h1>
                        <p className="text-slate-500 text-sm">Authentic supplications</p>
                    </div>
                </div>
            </div>

            {/* Grid */}
            <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                {CATEGORIES.map((cat) => {
                    const Icon = IconMap[cat.icon] || Zap;
                    return (
                        <div
                            key={cat.id}
                            onClick={() => router.push(`/duas/${cat.id}`)}
                            className={`relative overflow-hidden cursor-pointer group bg-gradient-to-br ${cat.color} p-6 rounded-3xl text-white shadow-lg hover:shadow-xl transition-all transform hover:scale-[1.02] active:scale-95`}
                        >
                            <div className="relative z-10 flex items-center justify-between">
                                <div>
                                    <h3 className="text-2xl font-bold">{cat.label}</h3>
                                    <p className="text-white/80 font-medium font-arabic mt-1">{cat.sub}</p>
                                </div>
                                <div className="bg-white/20 p-3 rounded-2xl backdrop-blur-sm">
                                    <Icon className="w-8 h-8 text-white" />
                                </div>
                            </div>

                            {/* Decorative Background Icon */}
                            <Icon className="absolute -bottom-4 -right-4 w-32 h-32 text-white/10 group-hover:rotate-12 transition-transform duration-500 pointer-events-none" />
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
