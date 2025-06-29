import { ConnectDB } from "@/components/lib/config/db";
import BlogModel from "@/components/lib/models/BlogModel";
import { NextResponse } from "next/server";
import { v2 as cloudinary } from "cloudinary";
import AuthorModel from "@/components/lib/models/AuthorModel";


cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export const dynamic = "force-dynamic";

function slugify(text) {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

// ✅ GET all blogs
export async function GET() {
  try {
    await ConnectDB();

    const blogs = await BlogModel.find()
      .sort({ createdAt: -1 })
      .populate("author"); // 🔑 Needed to access author name/image

    return NextResponse.json({ success: true, blogs });
  } catch (error) {
    console.error("GET /api/blog error:", error.message);
    return NextResponse.json({ msg: "Failed to fetch blogs" }, { status: 500 });
  }
}


// ✅ POST: Create a new blog
export async function POST(request) {
  try {
    await ConnectDB();

    const formData = await request.formData();
    const title = formData.get("title");
    const description = formData.get("description");
    const category = formData.get("category");
    const authorInput = formData.get("author"); // can be ID or name
    const imageFile = formData.get("image");

    if (!imageFile || !title || !description || !category || !authorInput) {
      return NextResponse.json({ msg: "Missing required fields" }, { status: 400 });
    }

    // 🔍 Find the author
    const authorDoc = await AuthorModel.findById(authorInput).catch(() =>
      AuthorModel.findOne({ name: authorInput })
    );

    if (!authorDoc) {
      return NextResponse.json({ msg: "Author not found" }, { status: 404 });
    }

    // Convert image to base64
    const buffer = Buffer.from(await imageFile.arrayBuffer());
    const base64Image = `data:${imageFile.type};base64,${buffer.toString("base64")}`;

    // Upload to Cloudinary
    const uploadResult = await cloudinary.uploader.upload(base64Image, {
      folder: "nyaya/blogs",
    });

    // Slug logic
    const baseSlug = slugify(title);
    let uniqueSlug = baseSlug;
    let counter = 1;
    while (await BlogModel.findOne({ slug: uniqueSlug })) {
      uniqueSlug = `${baseSlug}-${counter++}`;
    }

    // Save new blog
    const newBlog = new BlogModel({
      title,
      description,
      category,
      author: authorDoc._id, // ✅ Correct reference
      image: uploadResult.secure_url,
      slug: uniqueSlug,
    });

    await newBlog.save();
    await newBlog.populate("author");

    return NextResponse.json({
      success: true,
      msg: "Blog Created Successfully",
      blog: newBlog,
    });
  } catch (error) {
    console.error("POST /api/blog error:", error.message);
    return NextResponse.json(
      { success: false, msg: error.message || "Error creating blog" },
      { status: 500 }
    );
  }
}
