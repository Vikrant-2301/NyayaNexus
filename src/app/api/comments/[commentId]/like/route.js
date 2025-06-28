// src/app/api/comments/[commentId]/like/route.js

import { NextResponse } from "next/server";
import Blog from "@/components/lib/models/BlogModel";
import { ConnectDB } from "@/components/lib/config/db";

export async function PUT(request, { params }) {
  const { commentId } = params;
  const { blogId } = await request.json();

  if (!commentId || !blogId) {
    return NextResponse.json({ msg: "Missing parameters" }, { status: 400 });
  }

  await ConnectDB();

  const blog = await Blog.findById(blogId);
  if (!blog) {
    return NextResponse.json({ msg: "Blog not found" }, { status: 404 });
  }

  const comment = blog.comments.id(commentId);
  if (!comment) {
    return NextResponse.json({ msg: "Comment not found" }, { status: 404 });
  }

  comment.likes = typeof comment.likes === "number" ? comment.likes + 1 : 1;

  await blog.save();

  return NextResponse.json({
    msg: "Like added",
    commentId,
    newLikes: comment.likes,
    comments: blog.comments.filter((c) => c.approved),
  });
}
