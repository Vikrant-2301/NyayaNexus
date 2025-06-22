import { NextResponse } from "next/server";
import BlogModel from "@/components/lib/models/BlogModel";
import { ConnectDB } from "@/components/lib/config/db";

export async function GET(request) {
  try {
    await ConnectDB();
    const { searchParams } = new URL(request.url);
    const slug = searchParams.get("slug");

    if (!slug) {
      return NextResponse.json({ msg: "Missing slug" }, { status: 400 });
    }

    const currentBlog = await BlogModel.findOne({ slug });
    if (!currentBlog) {
      return NextResponse.json({ msg: "Blog not found" }, { status: 404 });
    }

    const prev = await BlogModel.findOne({
      createdAt: { $lt: currentBlog.createdAt },
    }).sort({ createdAt: -1 });

    const next = await BlogModel.findOne({
      createdAt: { $gt: currentBlog.createdAt },
    }).sort({ createdAt: 1 });

    return NextResponse.json({ prev, next });
  } catch (error) {
    console.error("Adjacent Blog Error:", error);
    return NextResponse.json({ msg: "Error fetching adjacent blogs" }, { status: 500 });
  }
}
