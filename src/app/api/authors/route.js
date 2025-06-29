import { NextResponse } from "next/server";
import { ConnectDB } from "@/components/lib/config/db";
import Author from "@/components/lib/models/AuthorModel";
import { v2 as cloudinary } from "cloudinary";

// ✅ Cloudinary config
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

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

    // ✅ Upload image to Cloudinary
    const arrayBuffer = await image.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const base64Image = buffer.toString("base64");
    const dataUri = `data:${image.type};base64,${base64Image}`;

    const uploadResult = await cloudinary.uploader.upload(dataUri, {
      folder: "nyaya/authors",
    });

    const author = await Author.create({
      name,
      description,
      image: uploadResult.secure_url,
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
