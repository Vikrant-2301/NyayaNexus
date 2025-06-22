import { NextResponse } from "next/server";
import Blog from "@/components/lib/models/BlogModel";
import { ConnectDB } from "@/components/lib/config/db";

export async function POST(request) {
  await ConnectDB();
  const { id, name, content } = await request.json();

  if (!id || !name || !content)
    return NextResponse.json({ msg: "Missing fields" }, { status: 400 });

  const blog = await Blog.findById(id);
  if (!blog) return NextResponse.json({ msg: "Blog not found" }, { status: 404 });

  blog.comments.push({ name, content, approved: false });
  await blog.save();

  return NextResponse.json({ msg: "Comment submitted for approval" });
}
