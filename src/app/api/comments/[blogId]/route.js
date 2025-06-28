// src/app/api/comments/[blogId]/route.js
import { NextResponse } from "next/server";
import Blog from "@/components/lib/models/BlogModel";
import { ConnectDB } from "@/components/lib/config/db";

export async function GET(request, { params }) {
  const { blogId } = params;
  await ConnectDB();

  const blog = await Blog.findById(blogId);
  if (!blog) return NextResponse.json({ msg: "Blog not found" }, { status: 404 });

  const approved = blog.comments.filter(c => c.approved);
  return NextResponse.json({ comments: approved });
}
