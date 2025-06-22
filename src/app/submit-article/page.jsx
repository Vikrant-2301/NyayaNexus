"use client";
import { useState, useRef } from "react";
import axios from "axios";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import Link from "@tiptap/extension-link";
import {
  FaBold,
  FaItalic,
  FaUnderline,
  FaLink,
  FaQuoteRight,
  FaListUl,
  FaHeading,
} from "react-icons/fa";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const SubmitArticle = () => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    title: "",
    content: "",
    image: "",
  });
  const [showLinkInput, setShowLinkInput] = useState(false);
  const [linkUrl, setLinkUrl] = useState("");
  const [preview, setPreview] = useState(false);
  const [uploading, setUploading] = useState(false);
  const linkInputRef = useRef(null);

  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      Link.configure({
        openOnClick: false,
        HTMLAttributes: { class: "text-blue-600 italic underline" },
      }),
    ],
    content: "",
    editorProps: {
      attributes: {
        class: "min-h-[250px] p-3 focus:outline-none",
      },
    },
    onUpdate: ({ editor }) => {
      setForm((prev) => ({ ...prev, content: editor.getHTML() }));
    },
  });

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const formData = new FormData();
    formData.append("file", file);
    setUploading(true);
    try {
      const res = await axios.post("/api/upload", formData);
      // Store only the relative path, not the full URL
      setForm((prev) => ({ ...prev, image: res.data.url }));
      toast.success("Image uploaded successfully.");
    } catch (err) {
      console.error("Upload failed:", err.message);
      toast.error("Image upload failed.");
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e?.preventDefault();

    // Check if we have all required fields
    if (!form.title || !form.content || !form.name || !form.email) {
      toast.error("Please fill in all required fields");
      return;
    }

    toast.info("Submitting...");
    try {
      // Make sure to include the image URL in the submission
      const submission = {
        ...form,
        image: form.image, // Make sure this is included
      };

      console.log("Submitting article with data:", submission); // Debug log

      await axios.post("/api/article-submissions", submission);
      toast.success("Article submitted successfully!");

      // Reset form and editor
      setForm({ name: "", email: "", title: "", content: "", image: "" });
      if (editor) editor.commands.clearContent();
      setPreview(false);
    } catch (error) {
      console.error("Submission error:", error);
      toast.error("Failed to submit article.");
    }
  };

  const applyLink = () => {
    if (!linkUrl) return;
    editor
      ?.chain()
      .focus()
      .extendMarkRange("link")
      .setLink({ href: linkUrl })
      .run();
    setShowLinkInput(false);
    setLinkUrl("");
  };

  return (
    <div id="submit-article" className="max-w-4xl mx-auto px-6 py-24">
      <ToastContainer />
      <h1 className="text-4xl font-bold mb-6 text-gray-800">
        Submit Your Article
      </h1>

      {/* Guidelines */}
      <div className="bg-yellow-50 border border-yellow-300 p-5 rounded mb-10 text-sm text-gray-800 leading-relaxed">
        <p className="font-semibold mb-2">Submission Guidelines:</p>
        <ul className="list-disc pl-6 space-y-1">
          <li>The manuscript must be your original work.</li>
          <li>
            Plagiarism should not exceed <strong>10%</strong>.
          </li>
          <li>Submissions may be formatted for clarity and consistency.</li>
          <li>By submitting, you grant us permission to publish it.</li>
        </ul>
      </div>

      {/* Preview Mode */}
      {preview ? (
        <>
          <div className="border rounded-lg bg-white p-6 shadow">
            {form.image && (
              <img
                src={form.image}
                alt="Cover"
                className="mb-6 w-full max-h-[400px] object-cover rounded"
                onError={(e) => {
                  e.target.src = "/assets/profile_icon.png"; // Fallback image
                  e.target.onerror = null; // Prevent infinite loop
                }}
              />
            )}
            <h2 className="text-2xl font-bold mb-4 text-center text-gray-800">
              {form.title}
            </h2>
            <div
              className="prose max-w-none text-gray-800"
              dangerouslySetInnerHTML={{ __html: form.content }}
            />
          </div>

          <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={handleSubmit}
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded transition"
            >
              Submit Article
            </button>
            <button
              onClick={() => setPreview(false)}
              className="border border-gray-300 text-gray-700 px-6 py-2 rounded hover:bg-gray-50 transition"
            >
              Edit Article
            </button>
          </div>
        </>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Personal Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="Your Name"
              className="w-full border px-4 py-2 rounded"
              required
            />
            <input
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="Your Email"
              type="email"
              className="w-full border px-4 py-2 rounded"
              required
            />
          </div>
          <input
            name="title"
            value={form.title}
            onChange={handleChange}
            placeholder="Article Title"
            className="w-full border px-4 py-2 rounded"
            required
          />

          {/* Image Upload */}
          <div>
            <label className="block mb-2 font-medium">
              Upload Cover Image (optional)
            </label>
            <input type="file" accept="image/*" onChange={handleImageUpload} />
            {uploading && (
              <p className="text-sm text-gray-500 mt-1">Uploading...</p>
            )}
            {form.image && (
              <img
                src={form.image}
                alt="Preview"
                className="mt-3 w-40 h-auto rounded shadow"
              />
            )}
          </div>

          {/* Tiptap Toolbar */}
          {editor && (
            <div className="flex flex-wrap gap-2 border rounded px-3 py-2 bg-gray-50 mb-2">
              <button onClick={() => editor.chain().focus().toggleBold().run()}>
                <FaBold />
              </button>
              <button
                onClick={() => editor.chain().focus().toggleItalic().run()}
              >
                <FaItalic />
              </button>
              <button
                onClick={() => editor.chain().focus().toggleUnderline().run()}
              >
                <FaUnderline />
              </button>
              <button
                onClick={() =>
                  editor.chain().focus().toggleHeading({ level: 2 }).run()
                }
              >
                <FaHeading />
              </button>
              <button
                onClick={() => editor.chain().focus().toggleBulletList().run()}
              >
                <FaListUl />
              </button>
              <button
                onClick={() => editor.chain().focus().toggleBlockquote().run()}
              >
                <FaQuoteRight />
              </button>
              <button
                onClick={() => {
                  const url = editor.getAttributes("link").href;
                  setLinkUrl(url || "");
                  setShowLinkInput(true);
                  setTimeout(() => linkInputRef.current?.focus(), 100);
                }}
              >
                <FaLink />
              </button>
            </div>
          )}

          {/* Link Input */}
          {showLinkInput && (
            <div className="flex items-center gap-2 mb-4">
              <input
                ref={linkInputRef}
                type="url"
                value={linkUrl}
                onChange={(e) => setLinkUrl(e.target.value)}
                placeholder="https://example.com"
                className="border px-3 py-1 rounded w-full"
              />
              <button
                onClick={applyLink}
                className="bg-indigo-600 text-white px-3 py-1 rounded"
              >
                Apply
              </button>
              <button
                onClick={() => setShowLinkInput(false)}
                className="text-gray-500"
              >
                Cancel
              </button>
            </div>
          )}

          {/* Editor */}
          <div className="border rounded-lg p-4 bg-white min-h-[200px]">
            <EditorContent editor={editor} />
          </div>

          {/* Preview Button */}
          <button
            type="button"
            onClick={() => setPreview(true)}
            className="inline-flex items-center px-4 py-2 border border-indigo-600 text-indigo-600 hover:bg-indigo-50 rounded text-sm transition"
          >
            Preview Article
          </button>

          {/* Submit Button */}
          <button
            type="submit"
            className="bg-indigo-600 text-white px-6 py-2 rounded mt-4"
          >
            Submit Article
          </button>
        </form>
      )}
    </div>
  );
};

export default SubmitArticle;
