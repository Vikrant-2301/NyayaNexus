import { NextResponse } from "next/server";
import nodemailer from "nodemailer";
import { ConnectDB } from "@/components/lib/config/db";
import ArticleSubmission from "@/components/lib/models/ArticleSubmission";

export async function PUT(req, context) {
  const { id } = await context.params; // ✅ await added

  try {
    await ConnectDB();

    const article = await ArticleSubmission.findById(id);
    if (!article) {
      return NextResponse.json({ msg: "Article not found" }, { status: 404 });
    }

    article.approved = true;
    await article.save();

    // Send confirmation email
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.MY_EMAIL,
        pass: process.env.MY_PASSWORD,
      },
    });

    await transporter.sendMail({
      from: `"Nyaya Nexus" <${process.env.MY_EMAIL}>`,
      to: article.email,
      subject: "Your Article Has Been Approved",
      html: `
        <p>Dear ${article.name},</p>
        <p>Your article titled <strong>"${article.title}"</strong> has been approved and will be published on our website soon.</p>
        <p>Thank you for contributing to Nyaya Nexus.</p>
      `,
    });

    return NextResponse.json({ msg: "Article approved and email sent." });
  } catch (error) {
    console.error("Approval error:", error);
    return NextResponse.json(
      { msg: "Failed to approve article or send email." },
      { status: 500 }
    );
  }
}
