// src/app/api/comments/like/route.js
import { NextResponse } from "next/server";
import Blog from "@/components/lib/models/BlogModel";
import { ConnectDB } from "@/components/lib/config/db";

export async function POST(request) {
  await ConnectDB();
  const { blogId, commentId } = await request.json();

  const blog = await Blog.findById(blogId);
  if (!blog) return NextResponse.json({ msg: "Blog not found" }, { status: 404 });

  const comment = blog.comments.id(commentId);
  if (!comment) return NextResponse.json({ msg: "Comment not found" }, { status: 404 });

  comment.likes = (comment.likes || 0) + 1;
  await blog.save();

  return NextResponse.json({ msg: "Liked" });
}
