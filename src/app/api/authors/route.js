//src\app\api\authors\route.js
import { NextResponse } from "next/server";
import { writeFile } from "fs/promises";
import path from "path";
import { ConnectDB } from "@/components/lib/config/db";
import Author from "@/components/lib/models/AuthorModel";

export async function GET() {
  try {
    await ConnectDB();
    const authors = await Author.find();
    return NextResponse.json(authors, { status: 200 });
  } catch (error) {
    console.error("GET /api/authors error:", error);
    return NextResponse.json({ error: "Failed to fetch authors" }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    await ConnectDB();

    const formData = await request.formData();
    const name = formData.get("name")?.trim();
    const description = formData.get("description")?.trim();
    const image = formData.get("image");

    const twitter = formData.get("twitter")?.trim();
    const linkedin = formData.get("linkedin")?.trim();
    const website = formData.get("website")?.trim();

    if (!name || !description || !image) {
      return NextResponse.json(
        { error: "Missing required fields: name, description and image are all required" },
        { status: 400 }
      );
    }

    const bytes = await image.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const filename = `author-${Date.now()}${path.extname(image.name)}`;
    const imagePath = path.join(process.cwd(), "public/images/authors", filename);
    await writeFile(imagePath, buffer);

    const author = await Author.create({
      name,
      description,
      image: `/images/authors/${filename}`,
      socialLinks: {
        ...(twitter && { twitter }),
        ...(linkedin && { linkedin }),
        ...(website && { website }),
      },
    });

    return NextResponse.json(author, { status: 201 });
  } catch (error) {
    console.error("POST /api/authors error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
