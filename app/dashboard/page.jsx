"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Sparkles, BookOpen, Loader2, Book, Activity, Heart, Target } from "lucide-react";
import { DUAS } from "@/data/duas";
import Link from "next/link";

const dailyHadiths = [
    {
        text: "The best of people are those who are most beneficial to people.",
        reference: "Sahih al-Bukhari"
    },
    {
        text: "Whoever believes in Allah and the Last Day should speak good or remain silent.",
        reference: "Sahih Muslim"
    },
    {
        text: "The strong person is not the one who can overpower others, but the one who controls himself when angry.",
        reference: "Sahih al-Bukhari"
    },
    {
        text: "None of you truly believes until he loves for his brother what he loves for himself.",
        reference: "Sahih al-Bukhari"
    },
    {
        text: "The most beloved deeds to Allah are those that are most consistent, even if they are small.",
        reference: "Sahih Muslim"
    }
];

export default function Dashboard() {
    const { data: session, status } = useSession();
    const router = useRouter();
    const [dailyHadith, setDailyHadith] = useState(null);
    const [dailyDua, setDailyDua] = useState(null);
    const [isQuizLoading, setIsQuizLoading] = useState(false);
    const [isHadithLoading, setIsHadithLoading] = useState(false);
    const [isQuranLoading, setIsQuranLoading] = useState(false);
    const [isTasbihLoading, setIsTasbihLoading] = useState(false);


    useEffect(() => {
        if (status === "unauthenticated") {
            router.push("/login");
        }
    }, [status, router]);

    useEffect(() => {
        const today = new Date().getDate();
        setDailyHadith(dailyHadiths[today % dailyHadiths.length]);
        setDailyDua(DUAS[today % DUAS.length]);
    }, []);

    if (status === "loading") {
        return <div className="text-center mt-20">Loading...</div>;
    }

    return (
        <div className="space-y-8">
            <div>
                <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-sm overflow-hidden border border-emerald-100">
                        {session?.user?.email && (
                            <img
                                src={`https://unavatar.io/${session.user.email}?fallback=false`}
                                alt="Profile"
                                className="w-full h-full object-cover"
                                onError={(e) => { e.target.style.display = 'none'; e.target.nextSibling.style.display = 'flex'; }}
                            />
                        )}
                        <span className="text-xl font-bold text-emerald-700 hidden items-center justify-center w-full h-full bg-emerald-100" style={{ display: session?.user?.email ? 'none' : 'flex' }}>
                            {session?.user?.name ? session.user.name.charAt(0).toUpperCase() : 'U'}
                        </span>
                    </div>
                    <h1 className="text-2xl font-bold text-slate-800">
                        {session?.user?.name}
                    </h1>
                </div>
                <p className="text-slate-600 mt-2">
                    Ready to test your knowledge today?
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-12">
                {/* Start Quiz Card */}
                <div
                    onClick={() => {
                        setIsQuizLoading(true);
                        router.push('/quiz');
                    }}
                    className="bg-gradient-to-br from-emerald-500 to-emerald-700 hover:from-emerald-600 hover:to-emerald-800 text-white p-6 md:p-10 rounded-2xl md:rounded-3xl shadow-2xl hover:shadow-emerald-500/50 transition-all duration-300 transform hover:scale-105 cursor-pointer flex flex-col items-center justify-center gap-4 md:gap-6 border-4 border-white/20 h-full"
                >
                    <div className="bg-white/30 p-4 md:p-6 rounded-full backdrop-blur-sm">
                        {isQuizLoading ? (
                            <Loader2 className="w-8 h-8 md:w-12 md:h-12 text-white animate-spin" strokeWidth={2.5} />
                        ) : (
                            <Sparkles className="w-8 h-8 md:w-12 md:h-12 text-white" strokeWidth={2.5} />
                        )}
                    </div>
                    <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight">Start Quiz</h2>
                    <p className="text-emerald-50 text-center text-sm md:text-base font-medium">
                        Challenge yourself with Islamic knowledge questions
                    </p>
                    <button className="mt-2 bg-white text-emerald-700 px-6 py-2 md:px-8 md:py-3 rounded-full font-bold text-base md:text-lg hover:bg-emerald-50 transition-all shadow-lg flex items-center gap-2">
                        {isQuizLoading ? (
                            <>
                                <Loader2 size={16} className="animate-spin" />
                                Loading...
                            </>
                        ) : (
                            'Begin Now →'
                        )}
                    </button>
                </div>

                {/* Read Quran Card */}
                <div
                    onClick={() => {
                        setIsQuranLoading(true);
                        router.push('/quran');
                    }}
                    className="bg-gradient-to-br from-teal-500 to-cyan-700 hover:from-teal-600 hover:to-cyan-800 text-white p-6 md:p-10 rounded-2xl md:rounded-3xl shadow-2xl hover:shadow-teal-500/50 transition-all duration-300 transform hover:scale-105 cursor-pointer flex flex-col items-center justify-center gap-4 md:gap-6 border-4 border-white/20 h-full"
                >
                    <div className="bg-white/30 p-4 md:p-6 rounded-full backdrop-blur-sm">
                        {isQuranLoading ? (
                            <Loader2 className="w-8 h-8 md:w-12 md:h-12 text-white animate-spin" strokeWidth={2.5} />
                        ) : (
                            <Book className="w-8 h-8 md:w-12 md:h-12 text-white" strokeWidth={2.5} />
                        )}
                    </div>
                    <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight">Read Quran</h2>
                    <p className="text-teal-50 text-center text-sm md:text-base font-medium">
                        Read the Holy Quran by Surah or Juz with translations
                    </p>
                    <button className="mt-2 bg-white text-teal-700 px-6 py-2 md:px-8 md:py-3 rounded-full font-bold text-base md:text-lg hover:bg-teal-50 transition-all shadow-lg flex items-center gap-2">
                        {isQuranLoading ? (
                            <>
                                <Loader2 size={16} className="animate-spin" />
                                Loading...
                            </>
                        ) : (
                            'Start Reading →'
                        )}
                    </button>
                </div>



                {/* Quran Tracker Card */}
                <div
                    onClick={() => router.push('/quran/tracker')}
                    className="bg-gradient-to-br from-indigo-500 to-violet-600 text-white p-6 md:p-10 rounded-2xl md:rounded-3xl shadow-2xl hover:shadow-indigo-500/50 transition-all duration-300 transform hover:scale-105 cursor-pointer flex flex-col items-center justify-center gap-4 md:gap-6 border-4 border-white/20 h-full"
                >
                    <div className="bg-white/30 p-4 md:p-6 rounded-full backdrop-blur-sm">
                        <Target className="w-8 h-8 md:w-12 md:h-12 text-white" strokeWidth={2.5} />
                    </div>
                    <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight">Quran Tracker</h2>
                    <p className="text-indigo-50 text-center text-sm md:text-base font-medium">
                        Plan and track your Khatam goals
                    </p>
                    <button className="mt-2 bg-white text-indigo-700 px-6 py-2 md:px-8 md:py-3 rounded-full font-bold text-base md:text-lg hover:bg-indigo-50 transition-all shadow-lg flex items-center gap-2">
                        Track Progress →
                    </button>
                </div>

                {/* Digital Tasbih Card */}
                <div
                    onClick={() => {
                        setIsTasbihLoading(true);
                        router.push('/tasbih');
                    }}
                    className="bg-gradient-to-br from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white p-6 md:p-10 rounded-2xl md:rounded-3xl shadow-2xl hover:shadow-cyan-500/50 transition-all duration-300 transform hover:scale-105 cursor-pointer flex flex-col items-center justify-center gap-4 md:gap-6 border-4 border-white/20 h-full"
                >
                    <div className="bg-white/30 p-4 md:p-6 rounded-full backdrop-blur-sm">
                        {isTasbihLoading ? (
                            <Loader2 className="w-8 h-8 md:w-12 md:h-12 text-white animate-spin" strokeWidth={2.5} />
                        ) : (
                            <Activity className="w-8 h-8 md:w-12 md:h-12 text-white" strokeWidth={2.5} />
                        )}
                    </div>
                    <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight">Tasbih</h2>
                    <p className="text-cyan-50 text-center text-sm md:text-base font-medium">
                        Digital Dhikr counter with haptic feedback
                    </p>
                    <button className="mt-2 bg-white text-cyan-700 px-6 py-2 md:px-8 md:py-3 rounded-full font-bold text-base md:text-lg hover:bg-cyan-50 transition-all shadow-lg flex items-center gap-2">
                        {isTasbihLoading ? (
                            <>
                                <Loader2 size={16} className="animate-spin" />
                                Loading...
                            </>
                        ) : (
                            'Start Dhikr →'
                        )}
                    </button>
                </div>

                {/* Daily Hadith Card */}
                <div className="bg-gradient-to-br from-amber-500 to-orange-600 text-white p-6 md:p-10 rounded-2xl md:rounded-3xl shadow-2xl hover:shadow-orange-500/50 transition-all duration-300 transform hover:scale-105 border-4 border-white/20 h-full flex flex-col">
                    <div className="flex items-center gap-4 mb-4 md:mb-6">
                        <div className="bg-white/30 p-4 rounded-full backdrop-blur-sm">
                            <BookOpen className="w-8 h-8 md:w-10 md:h-10 text-white" strokeWidth={2.5} />
                        </div>
                        <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight">Daily Hadith</h2>
                    </div>

                    {dailyHadith && (
                        <div className="flex-1 flex flex-col justify-center">
                            <blockquote className="text-base md:text-lg font-medium text-white/95 italic mb-4 leading-relaxed">
                                "{dailyHadith.text}"
                            </blockquote>
                            <p className="text-amber-100 text-xs md:text-sm font-semibold">
                                — {dailyHadith.reference}
                            </p>
                        </div>
                    )}

                    <button
                        onClick={() => {
                            setIsHadithLoading(true);
                            router.push('/hadith');
                        }}
                        className="mt-6 w-full bg-white text-amber-700 px-6 py-2 md:px-8 md:py-3 rounded-full font-bold text-base md:text-lg hover:bg-amber-50 transition-all shadow-lg flex items-center justify-center gap-2"
                    >
                        {isHadithLoading ? (
                            <>
                                <Loader2 size={16} className="animate-spin" />
                                Loading...
                            </>
                        ) : (
                            'Read More Hadiths →'
                        )}
                    </button>
                </div>
                {/* Dua of the Day Card */}
                <div className="bg-gradient-to-br from-rose-400 to-pink-600 text-white p-6 md:p-10 rounded-2xl md:rounded-3xl shadow-2xl hover:shadow-pink-500/50 transition-all duration-300 transform hover:scale-105 border-4 border-white/20 h-full flex flex-col">
                    <div className="flex items-center gap-4 mb-4 md:mb-6">
                        <div className="bg-white/30 p-4 rounded-full backdrop-blur-sm">
                            <Heart className="w-8 h-8 md:w-10 md:h-10 text-white" strokeWidth={2.5} />
                        </div>
                        <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight">Dua of the Day</h2>
                    </div>

                    {dailyDua && (
                        <div className="flex-1 flex flex-col justify-center">
                            <p className="text-xl md:text-2xl font-bold font-arabic text-right mb-4 leading-relaxed" dir="rtl">
                                {dailyDua.arabic}
                            </p>
                            <p className="text-pink-50 text-xs md:text-sm font-medium line-clamp-3">
                                {dailyDua.translation}
                            </p>
                        </div>
                    )}

                    <button
                        onClick={() => router.push('/duas')}
                        className="mt-6 w-full bg-white text-pink-700 px-6 py-2 md:px-8 md:py-3 rounded-full font-bold text-base md:text-lg hover:bg-pink-50 transition-all shadow-lg flex items-center justify-center gap-2"
                    >
                        Browse All Duas →
                    </button>
                </div>
            </div>
        </div>
    );
}
