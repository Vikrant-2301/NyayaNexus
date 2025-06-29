import { ConnectDB } from "@/components/lib/config/db";
import { NextResponse } from "next/server";
import ArticleSubmission from "@/components/lib/models/ArticleSubmission";
import nodemailer from "nodemailer";

export async function GET() {
  try {
    await ConnectDB();
    const submissions = await ArticleSubmission.find().sort({ createdAt: -1 });
    return NextResponse.json({ submissions });
  } catch (error) {
    console.error("GET error:", error);
    return NextResponse.json({ msg: "Failed to fetch submissions" }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    await ConnectDB();

    const { name, email, title, content, image } = await req.json();

    if (!name || !email || !title || !content) {
      return NextResponse.json({ msg: "All fields are required" }, { status: 400 });
    }

    const submission = await ArticleSubmission.create({
      name,
      email,
      title,
      content,
      image: image || "",
      approved: false,
    });

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.MY_EMAIL,
        pass: process.env.MY_PASSWORD,
      },
    });

    await transporter.sendMail({
      from: `"NYAYA NEXUS" <${process.env.MY_EMAIL}>`,
      to: email,
      subject: "Your Article Has Been Received - Nyaya Nexus",
      html: `
        <p>Dear <strong>${name}</strong>,</p>
        <p>Thank you for submitting your article titled <strong>"${title}"</strong> to <strong>Nyaya Nexus</strong>.</p>
        <p>We have received your submission and will review it shortly. If it meets our editorial criteria, you will hear back from us soon regarding the next steps.</p>
        <p>Thank you for contributing to our platform.</p>
        <br/>
        <p>Best regards,<br/>Team Nyaya Nexus</p>
      `,
    });

    return NextResponse.json(
      {
        msg: "Article submitted and email sent successfully",
        submission,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("POST error:", error);
    return NextResponse.json(
      { msg: "Failed to submit article. Try again later." },
      { status: 500 }
    );
  }
}
