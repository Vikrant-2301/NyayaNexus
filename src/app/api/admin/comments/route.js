import { NextResponse } from "next/server";
import Blog from "@/components/lib/models/BlogModel";
import { ConnectDB } from "@/components/lib/config/db";

export async function GET() {
  await ConnectDB();

  const blogs = await Blog.find({ "comments.approved": false });

  const pendingComments = blogs.flatMap(blog =>
    blog.comments
      .filter(c => !c.approved)
      .map(c => ({
        blogId: blog._id,
        commentId: c._id,
        content: c.content,
        name: c.name,
        blogTitle: blog.title,
      }))
  );

  return NextResponse.json({ comments: pendingComments });
}
