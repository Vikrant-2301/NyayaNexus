import { NextResponse } from "next/server";
import { writeFile } from "fs/promises";
import path from "path";
import { ConnectDB } from "@/components/lib/config/db";
import Author from "@/components/lib/models/AuthorModel";

export async function PUT(request, { params }) {
  const { id } = params;

  try {
    await ConnectDB();
    const formData = await request.formData();

    const name = formData.get("name")?.trim();
    const description = formData.get("description")?.trim();
    const image = formData.get("image");

    const twitter = formData.get("twitter")?.trim();
    const linkedin = formData.get("linkedin")?.trim();
    const website = formData.get("website")?.trim();

    const socialLinks = {};
    if (twitter) socialLinks.twitter = twitter;
    if (linkedin) socialLinks.linkedin = linkedin;
    if (website) socialLinks.website = website;

    const updateFields = {
      name,
      description,
      ...(Object.keys(socialLinks).length > 0 && { socialLinks }),
    };

    if (image && image.size > 0) {
      const bytes = await image.arrayBuffer();
      const buffer = Buffer.from(bytes);
      const filename = `author-${Date.now()}${path.extname(image.name)}`;
      const imagePath = path.join(process.cwd(), "public/images/authors", filename);
      await writeFile(imagePath, buffer);
      updateFields.image = `/images/authors/${filename}`;
    }

    const updated = await Author.findByIdAndUpdate(id, { $set: updateFields }, { new: true });
    if (!updated) return NextResponse.json({ error: "Not found" }, { status: 404 });

    return NextResponse.json(updated);
  } catch (error) {
    console.error("PUT /api/authors/:id error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  const { id } = params;

  try {
    await ConnectDB();
    const deleted = await Author.findByIdAndDelete(id);
    if (!deleted) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json({ msg: "Deleted" });
  } catch (error) {
    console.error("DELETE /api/authors/:id error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
