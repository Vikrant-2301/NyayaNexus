//src\app\api\admin\article-submissions\route.js
import { ConnectDB } from "@/components/lib/config/db";
import { NextResponse } from "next/server";
import ArticleSubmission from "@/components/lib/models/ArticleSubmission";

await ConnectDB();

export async function GET() {
  try {
    const submissions = await ArticleSubmission.find().sort({ createdAt: -1 });
    return NextResponse.json({ submissions });
  } catch (error) {
    return NextResponse.json({ msg: "Failed to fetch submissions" }, { status: 500 });
  }
}
