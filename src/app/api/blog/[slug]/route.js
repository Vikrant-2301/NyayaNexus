import { ConnectDB } from "@/components/lib/config/db";
import BlogModel from "@/components/lib/models/BlogModel";
import { NextResponse } from "next/server";

export async function GET(req, { params }) {
  const { slug } = params;

  if (!slug) {
    return NextResponse.json({ msg: "Slug is missing" }, { status: 400 });
  }

  try {
    await ConnectDB();

    // ✅ Populate the author field
    const blog = await BlogModel.findOne({ slug }).populate("author");

    if (!blog) {
      return NextResponse.json({ msg: "Blog not found" }, { status: 404 });
    }

    return NextResponse.json(blog);
  } catch (error) {
    console.error("Error fetching blog by slug:", error.message);
    return NextResponse.json(
      { msg: "Failed to fetch blog", error: error.message },
      { status: 500 }
    );
  }
}
