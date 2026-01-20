import { getSurahs, getJuzList } from "@/lib/quran-api";
import QuranHome from "@/components/quran/QuranHome";

export const metadata = {
    title: "Read Quran - Deenly",
    description: "Read the Holy Quran by Surah or Juz with translations",
};

export default async function QuranPage() {
    const [surahs, juzs] = await Promise.all([
        getSurahs(),
        getJuzList()
    ]);

    return <QuranHome surahs={surahs} juzs={juzs} />;
}
