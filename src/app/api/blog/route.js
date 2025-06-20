import { ConnectDB } from "@/components/lib/config/db";
import BlogModel from "@/components/lib/models/BlogModel";
import { NextResponse } from "next/server";
import { writeFile } from "fs/promises";
import fs from "fs";
import path from "path";

export const dynamic = "force-dynamic"; // Disable route caching

await ConnectDB(); // Ensure DB connection

// 🔤 Slugify utility
function slugify(text) {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "") // remove invalid chars
    .replace(/\s+/g, "-")         // replace spaces with -
    .replace(/-+/g, "-");         // collapse multiple -
}

// ✅ GET: Fetch blogs or a specific blog by slug
export async function GET(request) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const blogSlug = searchParams.get("slug");

    if (blogSlug) {
      const blog = await BlogModel.findOne({ slug: blogSlug });
      if (!blog) return NextResponse.json({ msg: "Blog not found" }, { status: 404 });
      return NextResponse.json(blog);
    }

    const blogs = await BlogModel.find({}).sort({ createdAt: -1 });
    return NextResponse.json({ blogs });
  } catch (error) {
    console.error("GET Error:", error);
    return NextResponse.json({ msg: "Failed to fetch blogs" }, { status: 500 });
  }
}

// ✅ POST: Create new blog
export async function POST(request) {
  try {
    const formData = await request.formData();
    const title = formData.get("title");
    const description = formData.get("description");
    const category = formData.get("category");
    const author = formData.get("author");
    const authorImg = formData.get("authorImg");
    const image = formData.get("image");

    if (!image || !title || !description || !category || !author || !authorImg) {
      return NextResponse.json({ msg: "Missing required fields" }, { status: 400 });
    }

    // Upload image
    const bytes = await image.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const timestamp = Date.now();
    const filename = `${timestamp}_${image.name}`;
    const imagePath = path.join(process.cwd(), "public", filename);
    await writeFile(imagePath, buffer);

    // Create blog
    const slug = slugify(title);
    const newBlog = new BlogModel({
      title,
      description,
      category,
      author,
      authorImg,
      image: `/${filename}`,
      slug,
    });

    await newBlog.save();
    return NextResponse.json({ success: true, msg: "Blog Created Successfully" });
  } catch (error) {
    console.error("POST Error:", error);
    return NextResponse.json({ success: false, msg: "Error creating blog" }, { status: 500 });
  }
}

// ✅ DELETE: Delete blog by ID
export async function DELETE(request) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const id = searchParams.get("id");

    if (!id) return NextResponse.json({ msg: "Missing blog ID" }, { status: 400 });

    const blog = await BlogModel.findById(id);
    if (!blog) return NextResponse.json({ msg: "Blog not found" }, { status: 404 });

    // Delete associated image
    if (blog.image && blog.image !== "/default-image.jpg") {
      const imagePath = path.join(process.cwd(), "public", blog.image);
      fs.unlink(imagePath, (err) => {
        if (err) console.error("Image deletion failed:", err.message);
      });
    }

    await BlogModel.findByIdAndDelete(id);

    return NextResponse.json({ success: true, msg: "Blog Deleted Successfully" });
  } catch (error) {
    console.error("DELETE Error:", error);
    return NextResponse.json({ msg: "Failed to delete blog" }, { status: 500 });
  }
}
