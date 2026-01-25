"use client";

import { useRouter } from "next/navigation";
import { ArrowLeft, Copy, Share2, Repeat, Check } from "lucide-react";
import { DUAS, CATEGORIES } from "@/data/duas";
import { useState } from "react";
import { use } from "react";

export default function CategoryClient({ params }) {
    const { category: categoryId } = use(params);
    const router = useRouter();
    const [copiedId, setCopiedId] = useState(null);

    const category = CATEGORIES.find(c => c.id === categoryId);
    const categoryDuas = DUAS.filter(d => d.category === categoryId);

    if (!category) return null;

    const handleCopy = (text, id) => {
        navigator.clipboard.writeText(text);
        setCopiedId(id);
        setTimeout(() => setCopiedId(null), 2000);
    };

    const handleShare = async (dua) => {
        if (navigator.share) {
            try {
                await navigator.share({
                    title: 'Dua from Deenly',
                    text: `${dua.arabic}\\n\\n${dua.translation}\\n\\n(Ref: ${dua.reference})`,
                });
            } catch (err) {
                console.log('Error sharing', err);
            }
        } else {
            handleCopy(`${dua.arabic}\\n\\n${dua.translation}`, dua.id);
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 pb-20">
            {/* Header */}
            <div className={`sticky top-0 z-10 border-b border-white/10 pb-4 pt-12 px-6 shadow-sm bg-gradient-to-r ${category.color} text-white`}>
                <div className="flex items-center gap-4">
                    <button
                        onClick={() => router.back()}
                        className="p-2 -ml-2 hover:bg-white/20 rounded-full transition"
                    >
                        <ArrowLeft className="w-6 h-6" />
                    </button>
                    <div>
                        <h1 className="text-2xl font-bold">{category.label}</h1>
                        <p className="opacity-90 text-sm font-arabic">{category.sub}</p>
                    </div>
                </div>
            </div>

            {/* List */}
            <div className="p-4 space-y-4 max-w-2xl mx-auto">
                {categoryDuas.map((dua, index) => (
                    <div key={dua.id} className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 relative overflow-hidden">
                        {/* Number Badge */}
                        <div className="absolute top-0 right-0 bg-slate-100 text-slate-400 px-4 py-2 rounded-bl-2xl text-xs font-bold font-mono">
                            #{index + 1}
                        </div>

                        {/* Arabic */}
                        <p className="text-right text-3xl font-bold leading-[1.8] text-slate-800 font-arabic mb-6 mt-4" dir="rtl">
                            {dua.arabic}
                        </p>

                        {/* Transliteration */}
                        <p className="text-slate-500 italic mb-4 text-sm leading-relaxed">
                            {dua.transliteration}
                        </p>

                        {/* Translation */}
                        <p className="text-slate-700 font-medium mb-6 leading-relaxed">
                            {dua.translation}
                        </p>

                        {/* Footer */}
                        <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                            <div className="flex items-center gap-2">
                                <span className="bg-emerald-50 text-emerald-700 text-xs px-2 py-1 rounded-md font-bold flex items-center gap-1 border border-emerald-100">
                                    <Repeat className="w-3 h-3" />
                                    {dua.repeat}x
                                </span>
                                <span className="text-xs text-slate-400 font-medium truncate max-w-[150px]">
                                    {dua.reference}
                                </span>
                            </div>

                            <div className="flex gap-2">
                                <button
                                    onClick={() => handleCopy(`${dua.arabic}\\n${dua.translation}`, dua.id)}
                                    className="p-2 text-slate-400 hover:bg-slate-50 hover:text-slate-600 rounded-full transition"
                                    title="Copy"
                                >
                                    {copiedId === dua.id ? <Check className="w-5 h-5 text-emerald-500" /> : <Copy className="w-5 h-5" />}
                                </button>
                                <button
                                    onClick={() => handleShare(dua)}
                                    className="p-2 text-slate-400 hover:bg-slate-50 hover:text-slate-600 rounded-full transition"
                                    title="Share"
                                >
                                    <Share2 className="w-5 h-5" />
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
