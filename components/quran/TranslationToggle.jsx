"use client";

import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";

export default function TranslationToggle({ onToggle }) {
    const [showTranslation, setShowTranslation] = useState(true);

    const handleToggle = () => {
        const newValue = !showTranslation;
        setShowTranslation(newValue);
        if (onToggle) onToggle(newValue);
    };

    return (
        <div className="bg-white rounded-xl p-4 shadow-md mb-6 flex items-center justify-center">
            {/* Translation Toggle */}
            <button
                onClick={handleToggle}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-semibold transition-all ${showTranslation
                        ? "bg-emerald-600 text-white"
                        : "bg-gray-200 text-gray-600"
                    }`}
            >
                {showTranslation ? <Eye size={20} /> : <EyeOff size={20} />}
                {showTranslation ? "Hide Translation" : "Show Translation"}
            </button>
        </div>
    );
}
