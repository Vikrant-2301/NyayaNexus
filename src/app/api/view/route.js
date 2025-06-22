import { NextResponse } from "next/server";
import Blog from "@/components/lib/models/BlogModel";
import { ConnectDB } from "@/components/lib/config/db";

export async function POST(request) {
  await ConnectDB();
  const { id } = await request.json();

  if (!id) return NextResponse.json({ msg: "Missing blog ID" }, { status: 400 });

  const updated = await Blog.findByIdAndUpdate(id, { $inc: { views: 1 } }, { new: true });
  if (!updated) return NextResponse.json({ msg: "Blog not found" }, { status: 404 });

  return NextResponse.json({ views: updated.views });
}
