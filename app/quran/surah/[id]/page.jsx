import { getSurahById } from "@/lib/quran-api";
import SurahReader from "@/components/quran/SurahReader";

export async function generateMetadata({ params }) {
    const { id } = await params;
    return {
        title: `Surah ${id} - Read Quran - Deenly`,
        description: `Read Surah ${id} of the Holy Quran with translation`,
    };
}

export default async function SurahPage({ params }) {
    const { id } = await params;
    const surahData = await getSurahById(parseInt(id));

    return <SurahReader surahData={surahData} />;
}

// Generate static params for all 114 Surahs
export async function generateStaticParams() {
    return Array.from({ length: 114 }, (_, i) => ({
        id: String(i + 1),
    }));
}
