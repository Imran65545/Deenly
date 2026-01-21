"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, RotateCcw, Settings, CheckCircle2, Volume2, VolumeX } from "lucide-react";

const DHIKRS = [
    { id: "subhanallah", text: "SubhanAllah", target: 33, arabic: "سُبْحَانَ ٱللَّٰهِ" },
    { id: "alhamdulillah", text: "Alhamdulillah", target: 33, arabic: "ٱلْحَمْدُ لِلَّٰهِ" },
    { id: "allahuakbar", text: "Allahu Akbar", target: 34, arabic: "ٱللَّٰهُ أَكْبَرُ" },
    { id: "astaghfirullah", text: "Astaghfirullah", target: 100, arabic: "أَسْتَغْفِرُ ٱللَّٰهَ" },
    { id: "laillaha", text: "La ilaha illallah", target: 100, arabic: "لَا إِلَٰهَ إِلَّا ٱللَّٰهُ" },
    { id: "unlimited", text: "Free Mode", target: Infinity, arabic: "∞" }
];

const CELEBRATION_MESSAGES = ["Mashallah!", "SubhanAllah!", "Great Job!", "Alhamdulillah!", "Well Done!", "Mubarak!"];

export default function TasbihPage() {
    const router = useRouter();
    const [count, setCount] = useState(0);
    const [selectedDhikr, setSelectedDhikr] = useState(DHIKRS[0]);
    const [isSettingsOpen, setIsSettingsOpen] = useState(false);
    const [vibrationEnabled, setVibrationEnabled] = useState(true);

    const [showCompletion, setShowCompletion] = useState(false);
    const [completionMessage, setCompletionMessage] = useState("");
    const counterRef = useRef(null);

    // Load saved progress
    useEffect(() => {
        const savedCount = localStorage.getItem("tasbih_count");
        const savedDhikrId = localStorage.getItem("tasbih_dhikr");
        const savedVib = localStorage.getItem("tasbih_vibration");

        if (savedCount) setCount(parseInt(savedCount));
        if (savedDhikrId) {
            const dhikr = DHIKRS.find(d => d.id === savedDhikrId) || DHIKRS[0];
            setSelectedDhikr(dhikr);
        }
        if (savedVib !== null) setVibrationEnabled(savedVib === "true");
    }, []);

    // Save progress
    useEffect(() => {
        localStorage.setItem("tasbih_count", count.toString());
        localStorage.setItem("tasbih_dhikr", selectedDhikr.id);
        localStorage.setItem("tasbih_vibration", vibrationEnabled.toString());
    }, [count, selectedDhikr, vibrationEnabled]);

    const handleTap = () => {
        if (showCompletion) {
            setShowCompletion(false);
            setCount(1);
            return;
        }

        const newCount = count + 1;
        setCount(newCount);

        // Haptic feedback
        if (vibrationEnabled && navigator.vibrate) {
            navigator.vibrate(50); // Light tap
        }

        // Check target
        if (selectedDhikr.target !== Infinity && newCount >= selectedDhikr.target) {
            if (vibrationEnabled && navigator.vibrate) {
                navigator.vibrate([100, 50, 100, 50, 100]); // Success pattern
            }
            const randomMsg = CELEBRATION_MESSAGES[Math.floor(Math.random() * CELEBRATION_MESSAGES.length)];
            setCompletionMessage(randomMsg);
            setShowCompletion(true);
            setTimeout(() => {
                setCount(0);
                setShowCompletion(false);
            }, 2000);
        }

        // Button press animation effect
        if (counterRef.current) {
            counterRef.current.style.transform = "scale(0.95)";
            setTimeout(() => {
                if (counterRef.current) counterRef.current.style.transform = "scale(1)";
            }, 100);
        }
    };

    const resetCount = (e) => {
        e.stopPropagation();
        if (window.confirm("Reset counter?")) {
            setCount(0);
            setShowCompletion(false);
        }
    };

    const selectDhikr = (dhikr) => {
        setSelectedDhikr(dhikr);
        setCount(0); // Reset on change? Or keep? Reset is cleaner.
        setIsSettingsOpen(false);
    };

    const progress = selectedDhikr.target === Infinity
        ? 100
        : Math.min((count / selectedDhikr.target) * 100, 100);

    return (
        <div className="min-h-screen bg-gradient-to-br from-emerald-800 to-teal-900 text-white overflow-hidden relative selection:bg-transparent">
            {/* Header */}
            <div className="absolute top-0 left-0 right-0 p-6 flex justify-between items-center z-20">
                <button
                    onClick={() => router.back()}
                    className="p-2 bg-white/10 rounded-full hover:bg-white/20 transition backdrop-blur-md"
                >
                    <ArrowLeft className="w-6 h-6" />
                </button>
                <div className="flex gap-2">
                    <button
                        onClick={(e) => { e.stopPropagation(); setVibrationEnabled(!vibrationEnabled); }}
                        className="p-2 bg-white/10 rounded-full hover:bg-white/20 transition backdrop-blur-md"
                    >
                        {vibrationEnabled ? <Volume2 className="w-6 h-6" /> : <VolumeX className="w-6 h-6" />}
                    </button>
                    <button
                        onClick={(e) => { e.stopPropagation(); setIsSettingsOpen(true); }}
                        className="p-2 bg-white/10 rounded-full hover:bg-white/20 transition backdrop-blur-md"
                    >
                        <Settings className="w-6 h-6" />
                    </button>
                </div>
            </div>

            {/* Main Tappable Area */}
            <div
                className="absolute inset-0 flex flex-col items-center justify-center cursor-pointer select-none active:bg-black/5 transition-colors"
                onClick={handleTap}
            >
                {/* Progress Ring Background */}
                <div className="relative flex items-center justify-center">
                    {/* Ring SVG */}
                    {selectedDhikr.target !== Infinity && (
                        <svg className="w-80 h-80 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 -rotate-90 pointer-events-none opacity-20">
                            <circle
                                cx="160" cy="160" r="150"
                                stroke="currentColor" strokeWidth="8"
                                fill="none"
                            />
                            <circle
                                cx="160" cy="160" r="150"
                                stroke="white" strokeWidth="8"
                                fill="none"
                                strokeDasharray={2 * Math.PI * 150}
                                strokeDashoffset={2 * Math.PI * 150 * (1 - progress / 100)}
                                className="transition-all duration-300 ease-out"
                            />
                        </svg>
                    )}

                    {/* Content */}
                    <div ref={counterRef} className="flex flex-col items-center z-10 transition-transform duration-100 p-10 rounded-full bg-white/5 backdrop-blur-sm border border-white/10 shadow-2xl">
                        {showCompletion ? (
                            <div className="flex flex-col items-center animate-in zoom-in duration-300">
                                <CheckCircle2 className="w-20 h-20 text-emerald-300 mb-4" />
                                <span className="text-3xl font-bold text-center">{completionMessage}</span>
                            </div>
                        ) : (
                            <>
                                <span className="text-8xl font-black tabular-nums tracking-tighter drop-shadow-lg">
                                    {count}
                                </span>
                                {selectedDhikr.target !== Infinity && (
                                    <span className="text-emerald-200/80 font-medium text-lg mt-2">
                                        / {selectedDhikr.target}
                                    </span>
                                )}
                            </>
                        )}
                    </div>
                </div>

                <div className="mt-12 text-center z-10 pointer-events-none">
                    <h2 className="text-3xl font-bold mb-2 text-white/90">{selectedDhikr.arabic}</h2>
                    <p className="text-xl text-emerald-100/80 font-medium">{selectedDhikr.text}</p>
                </div>
            </div>

            {/* Reset Button (Floating) */}
            <button
                onClick={resetCount}
                className="absolute bottom-10 left-1/2 transform -translate-x-1/2 p-4 bg-white/10 rounded-full hover:bg-white/20 transition backdrop-blur-md z-20 group"
            >
                <RotateCcw className="w-6 h-6 group-hover:-rotate-180 transition-transform duration-500" />
            </button>

            {/* Settings Modal */}
            {isSettingsOpen && (
                <div
                    className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-end md:items-center justify-center p-4 animate-in fade-in duration-200"
                    onClick={() => setIsSettingsOpen(false)}
                >
                    <div
                        className="bg-white text-slate-900 w-full max-w-md rounded-t-3xl md:rounded-3xl p-6 pb-12 md:pb-6 shadow-2xl animate-in slide-in-from-bottom duration-300"
                        onClick={e => e.stopPropagation()}
                    >
                        <h3 className="text-2xl font-bold mb-6 text-slate-800">Select Dhikr</h3>
                        <div className="space-y-3 max-h-[60vh] overflow-y-auto pr-2">
                            {DHIKRS.map((dhikr) => (
                                <button
                                    key={dhikr.id}
                                    onClick={() => selectDhikr(dhikr)}
                                    className={`w-full flex items-center justify-between p-4 rounded-xl border-2 transition-all ${selectedDhikr.id === dhikr.id
                                        ? "border-emerald-500 bg-emerald-50 text-emerald-800"
                                        : "border-slate-100 hover:border-emerald-200 hover:bg-slate-50"
                                        }`}
                                >
                                    <div className="text-left">
                                        <div className="font-bold">{dhikr.text}</div>
                                        {dhikr.target !== Infinity && (
                                            <div className="text-xs text-slate-500">Target: {dhikr.target}</div>
                                        )}
                                    </div>
                                    <div className="text-xl font-arabic font-semibold text-slate-400">
                                        {dhikr.arabic}
                                    </div>
                                </button>
                            ))}
                        </div>
                        <button
                            onClick={() => setIsSettingsOpen(false)}
                            className="w-full mt-6 bg-slate-100 text-slate-700 py-3 rounded-xl font-bold hover:bg-slate-200 transition"
                        >
                            Close
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
