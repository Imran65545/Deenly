import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";
import dbConnect from "@/lib/db";
import User from "@/models/User";

export async function GET() {
    try {
        const session = await getServerSession(authOptions);

        if (!session) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }

        await dbConnect();

        const user = await User.findOne({ email: session.user.email }).select('totalQuestionsAttempted correctAnswers totalScore');

        if (!user) {
            return NextResponse.json({ message: "User not found" }, { status: 404 });
        }

        return NextResponse.json({
            totalQuestionsAttempted: user.totalQuestionsAttempted || 0,
            correctAnswers: user.correctAnswers || 0,
            totalScore: user.totalScore || 0
        }, { status: 200 });

    } catch (error) {
        console.error("Error fetching user stats:", error);
        return NextResponse.json({ message: "Internal server error" }, { status: 500 });
    }
}
