//src\app\api\upload\route.js
import { writeFile } from "fs/promises";
import path from "path";
import { NextResponse } from "next/server";

export async function POST(req) {
  const formData = await req.formData();
  const file = formData.get("file");

  if (!file) {
    return NextResponse.json({ error: "No file uploaded." }, { status: 400 });
  }

  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);
  const filename = `${Date.now()}-${file.name.replace(/\s+/g, "-")}`;
  const filePath = path.join(process.cwd(), "public", "images", "uploads", filename);

  try {
    await writeFile(filePath, buffer);
    return NextResponse.json({ url: `/images/uploads/${filename}` });
  } catch (error) {
    console.error("File save error:", error);
    return NextResponse.json({ error: "Upload failed" }, { status: 500 });
  }
}
