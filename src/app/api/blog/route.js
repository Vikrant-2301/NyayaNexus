import { ConnectDB } from "@/components/lib/config/db";
import BlogModel from "@/components/lib/models/BlogModel";
import AuthorModel from "@/components/lib/models/AuthorModel"; // ✅ Register Author model
import { NextResponse } from "next/server";
import { writeFile } from "fs/promises";
import fs from "fs";
import path from "path";

export const dynamic = "force-dynamic";

await ConnectDB();

// 🔤 Slugify utility
function slugify(text) {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "") // remove invalid chars
    .replace(/\s+/g, "-")         // replace spaces with -
    .replace(/-+/g, "-");         // collapse multiple -
}

// ✅ GET: Fetch blogs with author details
export async function GET(request) {
  try {
    const blogs = await BlogModel.find({})
      .populate("author") // populate author data
      .sort({ createdAt: -1 });

    if (!blogs || blogs.length === 0) {
      return NextResponse.json({ blogs: [], msg: "No blogs found" });
    }

    return NextResponse.json({ blogs });
  } catch (error) {
    console.error("GET Error:", error);
    return NextResponse.json({
      msg: "Failed to fetch blogs",
      error: error.message,
    }, { status: 500 });
  }
}

// ✅ POST: Create a new blog
export async function POST(request) {
  try {
    const formData = await request.formData();
    const title = formData.get("title");
    const description = formData.get("description");
    const category = formData.get("category");
    const author = formData.get("author");
    const image = formData.get("image");

    if (!image || !title || !description || !category || !author) {
      return NextResponse.json({ msg: "Missing required fields" }, { status: 400 });
    }

    // Save image
    const bytes = await image.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const uploadDir = path.join(process.cwd(), "public", "images", "blogs");

    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    const timestamp = Date.now();
    const filename = `${timestamp}_${image.name.replace(/\s+/g, "_")}`;
    const imagePath = path.join(uploadDir, filename);
    await writeFile(imagePath, buffer);

    // Generate unique slug
    const baseSlug = slugify(title);
    let uniqueSlug = baseSlug;
    let counter = 1;
    while (await BlogModel.findOne({ slug: uniqueSlug })) {
      uniqueSlug = `${baseSlug}-${counter++}`;
    }

    const newBlog = new BlogModel({
      title,
      description,
      category,
      author,
      image: `/images/blogs/${filename}`,
      slug: uniqueSlug,
    });

    await newBlog.save();

    // Populate the author for immediate client-side use
    await newBlog.populate("author");

    return NextResponse.json({
      success: true,
      msg: "Blog Created Successfully",
      blog: newBlog,
    });
  } catch (error) {
    console.error("POST Error:", error);
    return NextResponse.json({
      success: false,
      msg: error.message || "Error creating blog",
    }, { status: 500 });
  }
}

// ✅ DELETE: Remove a blog
export async function DELETE(request) {
  try {
    const id = request.nextUrl.searchParams.get("id");
    if (!id) return NextResponse.json({ msg: "Missing blog ID" }, { status: 400 });

    const blog = await BlogModel.findById(id);
    if (!blog) return NextResponse.json({ msg: "Blog not found" }, { status: 404 });

    if (blog.image && blog.image !== "/default-image.jpg") {
      const imagePath = path.join(process.cwd(), "public", blog.image);
      fs.unlink(imagePath, (err) => {
        if (err) console.error("Image deletion failed:", err.message);
      });
    }

    await BlogModel.findByIdAndDelete(id);
    return NextResponse.json({ msg: "Blog Deleted" });
  } catch (err) {
    console.error("DELETE Error:", err);
    return NextResponse.json({ msg: "Failed to delete blog" }, { status: 500 });
  }
}
