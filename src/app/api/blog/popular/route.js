import { NextResponse } from "next/server";
import Blog from "@/components/lib/models/BlogModel";
import { ConnectDB } from "@/components/lib/config/db";

export async function GET() {
  await ConnectDB();

  try {
    const popularBlogs = await Blog.find({})
      .sort({ views: -1 })
      .limit(5)
      .select('title slug image views');

    return NextResponse.json({ blogs: popularBlogs });
  } catch (error) {
    console.error("Error fetching popular blogs:", error);
    return NextResponse.json(
      { msg: "Failed to fetch popular blogs" },
      { status: 500 }
    );
  }
}