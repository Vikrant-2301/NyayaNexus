import { NextResponse } from "next/server";
import { ConnectDB } from "@/components/lib/config/db";
import ArticleSubmission from "@/components/lib/models/ArticleSubmission";

export async function DELETE(req, { params }) {
  await ConnectDB();

  const id = params.id;

  if (!id) {
    return NextResponse.json({ msg: "Missing article ID" }, { status: 400 });
  }

  try {
    const deleted = await ArticleSubmission.findByIdAndDelete(id);

    if (!deleted) {
      return NextResponse.json({ msg: "Article not found" }, { status: 404 });
    }

    return NextResponse.json({ msg: "Article deleted successfully." });
  } catch (error) {
    console.error("Delete error:", error);
    return NextResponse.json({ msg: "Failed to delete article." }, { status: 500 });
  }
}
