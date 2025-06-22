import { NextResponse } from "next/server";
import Blog from "@/components/lib/models/BlogModel";
import { ConnectDB } from "@/components/lib/config/db";

export async function PATCH(_, { params }) {
  await ConnectDB();
  const { id } = params;

  const blogs = await Blog.find({ "comments._id": id });

  if (!blogs.length)
    return NextResponse.json({ msg: "Comment not found" }, { status: 404 });

  const blog = blogs[0];
  const comment = blog.comments.id(id);
  comment.approved = true;
  await blog.save();

  return NextResponse.json({ msg: "Comment approved" });
}
