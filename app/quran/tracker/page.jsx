"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { ArrowLeft, BookOpen, Calendar, CheckCircle, Target, TrendingUp, Settings } from "lucide-react";

export default function QuranTrackerPage() {
    const router = useRouter();
    const { data: session } = useSession();
    const [plan, setPlan] = useState(null);
    const [targetDays, setTargetDays] = useState(30); // Default to 30 days

    // UI State
    const [inputSurah, setInputSurah] = useState("");
    const [inputAyah, setInputAyah] = useState("");

    // Constants
    const SURAHS = ["Al-Fatiha", "Al-Baqarah", "Aal-E-Imran", "An-Nisa", "Al-Ma'idah", "Al-An'am", "Al-A'raf", "Al-Anfal", "At-Tawbah", "Yunus", "Hud", "Yusuf", "Ar-Ra'd", "Ibrahim", "Al-Hijr", "An-Nahl", "Al-Isra", "Al-Kahf", "Maryam", "Ta-Ha", "Al-Anbiya", "Al-Hajj", "Al-Mu'minun", "An-Nur", "Al-Furqan", "Ash-Shu'ara", "An-Naml", "Al-Qasas", "Al-Ankabut", "Ar-Rum", "Luqman", "As-Sajda", "Al-Ahzab", "Saba", "Fatir", "Ya-Sin", "As-Saffat", "Sad", "Az-Zumar", "Ghafir", "Fussilat", "Ash-Shura", "Az-Zukhruf", "Ad-Dukhan", "Al-Jathiya", "Al-Ahqaf", "Muhammad", "Al-Fath", "Al-Hujurat", "Qaf", "Adh-Dhariyat", "At-Tur", "An-Najm", "Al-Qamar", "Ar-Rahman", "Al-Waqi'ah", "Al-Hadid", "Al-Mujadila", "Al-Hashr", "Al-Mumtahanah", "As-Saff", "Al-Jumu'ah", "Al-Munafiqun", "At-Taghabun", "At-Talaq", "At-Tahrim", "Al-Mulk", "Al-Qalam", "Al-Haqqah", "Al-Ma'arij", "Nuh", "Al-Jinn", "Al-Muzzammil", "Al-Muddaththir", "Al-Qiyamah", "Al-Insan", "Al-Mursalat", "An-Naba", "An-Nazi'at", "Abasa", "At-Takwir", "Al-Infitar", "Al-Mutaffifin", "Al-Inshiqaq", "Al-Buruj", "At-Tariq", "Al-A'la", "Al-Ghashiyah", "Al-Fajr", "Al-Balad", "Ash-Shams", "Al-Lail", "Ad-Duha", "Ash-Sharh", "At-Tin", "Al-Alaq", "Al-Qadr", "Al-Bayyina", "Az-Zalzalah", "Al-Adiyat", "Al-Qari'ah", "At-Takathur", "Al-Asr", "Al-Humazah", "Al-Fil", "Quraysh", "Al-Ma'un", "Al-Kawthar", "Al-Kafirun", "An-Nasr", "Al-Masad", "Al-Ikhlas", "Al-Falaq", "An-Nas"];

    // Verse Counts for all 114 Surahs
    const SURAH_VERSES = [7, 286, 200, 176, 120, 165, 206, 75, 129, 109, 123, 111, 43, 52, 99, 128, 111, 110, 98, 135, 112, 78, 118, 64, 77, 227, 93, 88, 69, 60, 34, 30, 73, 54, 45, 83, 182, 88, 75, 85, 54, 53, 89, 59, 37, 35, 38, 29, 18, 45, 60, 49, 62, 55, 78, 96, 29, 22, 24, 13, 14, 11, 11, 18, 12, 12, 30, 52, 52, 44, 28, 28, 20, 56, 40, 31, 50, 40, 46, 42, 29, 19, 36, 21, 38, 29, 18, 45, 20, 77, 23, 37, 18, 19, 26, 30, 20, 15, 21, 11, 8, 8, 19, 5, 8, 8, 11, 11, 3, 9, 5, 4, 7, 3, 6, 3, 5, 4, 5, 6];

    const TOTAL_VERSES = SURAH_VERSES.reduce((a, b) => a + b, 0);

    useEffect(() => {
        const loadPlan = async () => {
            // Priority: Cloud -> Local (if not found in cloud or not logged in)
            let loadedFromCloud = false;

            if (session) {
                try {
                    const res = await fetch('/api/user/tracker');
                    if (res.ok) {
                        const text = await res.text();
                        try {
                            const data = JSON.parse(text);
                            // Check if valid plan exists (has startDate)
                            if (data && data.startDate) {
                                setPlan(data);
                                loadedFromCloud = true;
                            }
                        } catch (e) {
                            console.error("Server response was not JSON:", text.substring(0, 50));
                        }
                    }
                } catch (e) {
                    console.error("Failed to load from cloud", e);
                }
            }

            if (!loadedFromCloud) {
                const savedPlan = localStorage.getItem("quran_tracker_plan");
                if (savedPlan) {
                    setPlan(JSON.parse(savedPlan));
                }
            }
        };
        loadPlan();
    }, [session]);

    const getProgressVerses = (surahName, ayahNumber) => {
        if (!surahName || !ayahNumber) return 0;
        const surahIndex = SURAHS.indexOf(surahName);
        if (surahIndex === -1) return 0;

        // Sum all previous surahs
        let verses = 0;
        for (let i = 0; i < surahIndex; i++) {
            verses += SURAH_VERSES[i];
        }

        // Add current surah verses 
        verses += parseInt(ayahNumber);
        return verses;
    };

    const createPlan = async () => {
        const newPlan = {
            startDate: new Date().toISOString(),
            targetDays: parseInt(targetDays),
            currentProgress: 0, // Total verses read
            lastSurah: "Al-Fatiha",
            lastAyah: 1,
            logs: []
        };
        await savePlan(newPlan);
    };

    const savePlan = async (newPlan) => {
        setPlan(newPlan);
        localStorage.setItem("quran_tracker_plan", JSON.stringify(newPlan));

        if (session) {
            try {
                await fetch('/api/user/tracker', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(newPlan)
                });
            } catch (e) { console.error("Cloud save failed", e); }
        }
    };

    const resetPlan = async () => {
        if (confirm("Are you sure you want to delete your current plan and start over?")) {
            localStorage.removeItem("quran_tracker_plan");
            setPlan(null);
            setTargetDays(30);

            if (session) {
                try {
                    // Send empty object to indicate clear/reset
                    await fetch('/api/user/tracker', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({})
                    });
                } catch (e) { console.error("Cloud clear failed", e); }
            }
        }
    };

    const logReading = () => {
        if (!inputSurah || !inputAyah) return;

        const newProgress = getProgressVerses(inputSurah, inputAyah);
        if (newProgress <= plan.currentProgress) return;

        const updatedPlan = {
            ...plan,
            currentProgress: newProgress,
            lastSurah: inputSurah,
            lastAyah: parseInt(inputAyah),
            logs: [
                {
                    date: new Date().toISOString(),
                    surah: inputSurah,
                    ayah: inputAyah
                },
                ...plan.logs
            ]
        };
        savePlan(updatedPlan);
        setInputSurah("");
        setInputAyah("");
    };

    // --- Calculations ---
    const getStats = () => {
        if (!plan) return {};

        const versesRead = plan.currentProgress;
        const versesRemaining = TOTAL_VERSES - versesRead;

        const startDate = new Date(plan.startDate);
        const targetDate = new Date(startDate);
        targetDate.setDate(startDate.getDate() + plan.targetDays);

        const today = new Date();
        const daysPassed = Math.floor((today - startDate) / (1000 * 60 * 60 * 24));
        const daysRemaining = Math.max(1, plan.targetDays - daysPassed);

        const dailyTarget = Math.ceil(versesRemaining / daysRemaining);
        const progressPercent = Math.min(100, Math.round((versesRead / TOTAL_VERSES) * 100));

        return {
            versesRemaining,
            daysRemaining,
            dailyTarget,
            progressPercent,
            targetDate: targetDate.toLocaleDateString(),
            daysPassed
        };
    };

    const stats = getStats();

    // --- Onboarding View ---
    if (!plan) {
        return (
            <div className="min-h-screen bg-slate-50 p-6 flex flex-col items-center justify-center">
                <div className="max-w-md w-full bg-white rounded-3xl shadow-xl p-8 border border-slate-100">
                    <div className="flex justify-center mb-6">
                        <div className="bg-emerald-100 p-4 rounded-full">
                            <Target className="w-10 h-10 text-emerald-600" />
                        </div>
                    </div>
                    <h1 className="text-2xl font-bold text-center text-slate-800 mb-2">Start a Quran Goal</h1>
                    <p className="text-center text-slate-500 mb-8">Plan your Khatam in days.</p>

                    <div className="space-y-6">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">Target Days</label>
                            <input
                                type="number"
                                value={targetDays}
                                onChange={(e) => setTargetDays(e.target.value)}
                                className="w-full text-center text-2xl font-bold p-4 rounded-2xl border border-slate-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 outline-none"
                            />
                            <div className="flex justify-center gap-2 mt-2">
                                {[30, 60, 90].map(d => (
                                    <button
                                        key={d}
                                        onClick={() => setTargetDays(d)}
                                        className={`px-3 py-1 text-xs rounded-full border ${targetDays == d ? 'bg-emerald-50 border-emerald-500 text-emerald-700' : 'bg-white border-slate-200 text-slate-500'}`}
                                    >
                                        {d} Days
                                    </button>
                                ))}
                            </div>
                        </div>

                        <button
                            onClick={createPlan}
                            className="w-full bg-emerald-600 text-white py-4 rounded-2xl font-bold text-lg hover:bg-emerald-700 transition shadow-lg hover:shadow-emerald-500/30"
                        >
                            Create Plan
                        </button>
                    </div>

                    <button onClick={() => router.back()} className="w-full mt-4 text-slate-400 text-sm hover:text-slate-600">
                        Cancel
                    </button>
                </div>
            </div>
        );
    }

    // --- Dashboard View ---
    return (
        <div className="min-h-screen bg-slate-50 pb-20">
            {/* Header */}
            <div className="bg-emerald-600 text-white pb-20 pt-10 px-6 rounded-b-[3rem] shadow-xl relative overflow-hidden">
                <div className="absolute top-0 right-0 p-32 bg-white/10 rounded-full blur-3xl transform translate-x-1/2 -translate-y-1/2"></div>

                <div className="relative z-10">
                    <div className="flex justify-between items-center mb-6">
                        <button onClick={() => router.back()} className="p-2 bg-white/20 rounded-full hover:bg-white/30 backdrop-blur-md">
                            <ArrowLeft className="w-5 h-5" />
                        </button>
                        <button onClick={resetPlan} className="p-2 bg-white/20 rounded-full hover:bg-white/30 backdrop-blur-md">
                            <Settings className="w-5 h-5" />
                        </button>
                    </div>

                    <div className="text-center mb-6">
                        <p className="text-emerald-100 font-medium mb-1">Current Progress</p>
                        <h1 className="text-5xl font-bold mb-2">{stats.progressPercent}%</h1>

                        {plan.lastSurah && (
                            <div className="mt-2 inline-flex items-center gap-2 bg-emerald-700/50 px-3 py-1 rounded-full text-xs font-medium border border-emerald-500/30">
                                <BookOpen className="w-3 h-3" />
                                <span>{plan.lastSurah} {plan.lastAyah ? ` : ${plan.lastAyah}` : ''}</span>
                            </div>
                        )}
                        <p className="text-xs opacity-70 mt-2">{plan.currentProgress} / {TOTAL_VERSES} Verses</p>
                    </div>

                    {/* Daily Target Card */}
                    <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 flex items-center justify-between border border-white/20">
                        <div className="flex items-center gap-3">
                            <div className="bg-emerald-500/30 p-2 rounded-lg">
                                <BookOpen className="w-6 h-6 text-emerald-50" />
                            </div>
                            <div>
                                <p className="text-xs text-emerald-100 font-bold uppercase tracking-wide">Today's Target</p>
                                <p className="font-semibold text-lg">
                                    Read {stats.dailyTarget} Verses
                                </p>
                            </div>
                        </div>
                        <div className="text-right">
                            <p className="text-xs text-emerald-100">To maintain</p>
                            <p className="text-sm font-bold">{plan.targetDays} Days Goal</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="px-6 -mt-12 relative z-20 space-y-6">

                {/* Stats Grid */}
                <div className="grid grid-cols-2 gap-4">
                    <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100">
                        <div className="flex items-center gap-2 mb-2 text-indigo-500">
                            <Calendar className="w-4 h-4" />
                            <span className="text-xs font-bold uppercase">Days Left</span>
                        </div>
                        <p className="text-2xl font-bold text-slate-800">{stats.daysRemaining}</p>
                    </div>
                    <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100">
                        <div className="flex items-center gap-2 mb-2 text-amber-500">
                            <BookOpen className="w-4 h-4" />
                            <span className="text-xs font-bold uppercase">Verses Left</span>
                        </div>
                        <p className="text-2xl font-bold text-slate-800">{stats.versesRemaining}</p>
                    </div>
                </div>

                {/* Log Reading */}
                <div className="bg-white p-6 rounded-3xl shadow-lg border border-slate-100">
                    <h2 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
                        <CheckCircle className="w-5 h-5 text-emerald-500" />
                        Log Your Reading
                    </h2>

                    <div className="grid grid-cols-2 gap-3 mb-3">
                        <div>
                            <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Surah</label>
                            <select
                                value={inputSurah}
                                onChange={(e) => setInputSurah(e.target.value)}
                                className="w-full p-3 rounded-xl bg-slate-50 border border-slate-200 font-medium focus:border-emerald-500 outline-none text-sm"
                            >
                                <option value="">Select Surah</option>
                                {SURAHS.map(s => <option key={s} value={s}>{s}</option>)}
                            </select>
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Ayah</label>
                            <input
                                type="number"
                                value={inputAyah}
                                onChange={(e) => setInputAyah(e.target.value)}
                                placeholder="Verse No."
                                className="w-full p-3 rounded-xl bg-slate-50 border border-slate-200 font-medium focus:border-emerald-500 outline-none text-sm"
                            />
                        </div>
                    </div>

                    <button
                        onClick={logReading}
                        className="w-full bg-emerald-600 text-white px-6 py-4 rounded-xl font-bold hover:bg-emerald-700 transition shadow-lg hover:shadow-emerald-500/30"
                    >
                        Update Progress
                    </button>

                    <p className="text-xs text-slate-400 mt-3 text-center">
                        Last Read: {plan.lastSurah} : {plan.lastAyah}
                    </p>
                </div>

                {/* History (Optional/MVP) */}
                {plan.logs.length > 0 && (
                    <div className="mt-6">
                        <h3 className="font-bold text-slate-800 mb-3 px-1">Recent Activity</h3>
                        <div className="space-y-3">
                            {plan.logs.slice(0, 3).map((log, i) => (
                                <div key={i} className="flex justify-between items-center bg-white p-3 rounded-xl border border-slate-100">
                                    <span className="text-slate-500 text-sm">{new Date(log.date).toLocaleDateString()}</span>
                                    <span className="font-bold text-slate-700">{log.surah} : {log.ayah}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
