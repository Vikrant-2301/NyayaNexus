import { ConnectDB } from "@/components/lib/config/db";
import BlogModel from "@/components/lib/models/BlogModel";
import { NextResponse } from "next/server";
import { writeFile } from "fs/promises";
import fs from "fs";
import path from "path";

export const dynamic = "force-dynamic"; // Prevents route caching

await ConnectDB(); // connect DB once globally

// 🔤 Slugify utility
function slugify(text) {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "") // remove invalid chars
    .replace(/\s+/g, "-")         // replace spaces with -
    .replace(/-+/g, "-");         // collapse multiple -
}

// ✅ GET: Fetch blog(s)
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

// ✅ POST: Create a new blog
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

    // Handle image upload
    const bytes = await image.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Create images directory if it doesn't exist
    const uploadDir = path.join(process.cwd(), "public", "images", "blogs");
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    // Create unique filename
    const timestamp = Date.now();
    const filename = `${timestamp}_${image.name.replace(/\s+/g, '_')}`;
    const imagePath = path.join(uploadDir, filename);

    // Save image
    await writeFile(imagePath, buffer);

    // Generate slug from title
    const slug = slugify(title);

    // Ensure slug uniqueness
    let uniqueSlug = slug;
    let counter = 1;
    while (await BlogModel.findOne({ slug: uniqueSlug })) {
      uniqueSlug = `${slug}-${counter}`;
      counter++;
    }

    // Create new blog with relative image path
    const newBlog = new BlogModel({
      title,
      description,
      category,
      author,
      authorImg,
      image: `/images/blogs/${filename}`,
      slug: uniqueSlug
    });

    await newBlog.save();
    return NextResponse.json({ 
      success: true, 
      msg: "Blog Created Successfully",
      blog: newBlog
    });
  } catch (error) {
    console.error("POST Error:", error);
    return NextResponse.json({ 
      success: false, 
      msg: error.message || "Error creating blog" 
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

    // 🗑 Remove image if custom
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
