import { getJuzById } from "@/lib/quran-api";
import JuzReader from "@/components/quran/JuzReader";

export async function generateMetadata({ params }) {
    const { id } = await params;
    return {
        title: `Juz ${id} - Read Quran - Deenly`,
        description: `Read Juz (Para) ${id} of the Holy Quran with translation`,
    };
}

export default async function JuzPage({ params }) {
    const { id } = await params;
    const juzData = await getJuzById(parseInt(id));

    return <JuzReader juzData={juzData} />;
}

// Generate static params for all 30 Juz
export async function generateStaticParams() {
    return Array.from({ length: 30 }, (_, i) => ({
        id: String(i + 1),
    }));
}
