"use client";
import { assets } from "../../../../public/assets/assets";
import axios from "axios";
import Image from "next/image";
import React, { useState } from "react";
import { toast } from "react-toastify";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";
import TiptapImage from "@tiptap/extension-image";

const MenuBar = ({ editor }) => {
  if (!editor) return null;

  const buttonClass = (active) =>
    `px-2 py-1 text-sm rounded border border-gray-300 ${
      active ? "bg-indigo-100 border-indigo-500" : "bg-white"
    } hover:bg-indigo-50`;

  return (
    <div className="flex flex-wrap gap-2 p-3 bg-gray-100 border-b rounded-t">
      <button
        onClick={() => editor.chain().focus().toggleBold().run()}
        className={buttonClass(editor.isActive("bold"))}
      >
        Bold
      </button>
      <button
        onClick={() => editor.chain().focus().toggleItalic().run()}
        className={buttonClass(editor.isActive("italic"))}
      >
        Italic
      </button>
      <button
        onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
        className={buttonClass(editor.isActive("heading", { level: 2 }))}
      >
        H2
      </button>
      <button
        onClick={() => editor.chain().focus().toggleBulletList().run()}
        className={buttonClass(editor.isActive("bulletList"))}
      >
        • List
      </button>
      <button
        onClick={() => {
          const url = prompt("Enter URL");
          if (url) editor.chain().focus().setLink({ href: url }).run();
        }}
        className={buttonClass(editor.isActive("link"))}
      >
        Link
      </button>
    </div>
  );
};

const Page = () => {
  const [image, setImage] = useState(null);
  const [authors, setAuthors] = useState([
    { name: "Alex Bennett", img: "/author_img.png" },
    { name: "Custom Author", img: "" },
  ]);
  const [selectedAuthor, setSelectedAuthor] = useState(authors[0]);
  const [customAuthor, setCustomAuthor] = useState({ name: "", img: "" });
  const [data, setData] = useState({ title: "", category: "Startup" });

  const editor = useEditor({
    extensions: [StarterKit, Link, TiptapImage],
    content: "",
  });

  const onChangeHandler = (e) => {
    setData({ ...data, [e.target.name]: e.target.value });
  };

  const onSubmitHandler = async (e) => {
    e.preventDefault();

    if (!image) {
      toast.error("Please select a thumbnail image.");
      return;
    }

    const formData = new FormData();
    formData.append("title", data.title);
    formData.append("description", editor.getHTML());
    formData.append("category", data.category);
    formData.append(
      "author",
      selectedAuthor.name === "Custom Author"
        ? customAuthor.name
        : selectedAuthor.name
    );
    formData.append(
      "authorImg",
      selectedAuthor.name === "Custom Author"
        ? customAuthor.img
        : selectedAuthor.img
    );
    formData.append("image", image);

    try {
      const res = await axios.post("/api/blog", formData);
      if (res.data.success) {
        toast.success("Blog posted successfully!");
        editor.commands.setContent("");
        setData({ title: "", category: "Startup" });
        setImage(null);
        setSelectedAuthor(authors[0]);
        setCustomAuthor({ name: "", img: "" });
      } else {
        toast.error(res.data.msg || "Failed to post blog.");
      }
    } catch (err) {
      toast.error(err.response?.data?.msg || "Submission failed.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto bg-white shadow-lg rounded-lg overflow-hidden">
        <form onSubmit={onSubmitHandler} className="p-8 space-y-8">
          <h1 className="text-3xl font-bold text-gray-900">Add New Blog</h1>

          {/* Thumbnail Upload */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Thumbnail Image
            </label>
            <label
              htmlFor="image"
              className="block w-full cursor-pointer border-2 border-dashed border-gray-300 rounded-lg p-4 hover:border-indigo-500 transition"
            >
              <div className="flex justify-center">
                <Image
                  src={image ? URL.createObjectURL(image) : assets.upload_area}
                  alt="Thumbnail"
                  width={200}
                  height={100}
                  className="object-cover"
                />
              </div>
            </label>
            <input
              type="file"
              id="image"
              hidden
              accept="image/*"
              onChange={(e) => setImage(e.target.files[0])}
            />
          </div>

          {/* Title */}
          <div>
            <label className="block text-sm font-semibold text-gray-700">
              Title
            </label>
            <input
              name="title"
              type="text"
              value={data.title}
              onChange={onChangeHandler}
              className="mt-1 w-full border border-gray-300 rounded-md px-4 py-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm"
              placeholder="Enter blog title"
              required
            />
          </div>

          {/* Editor */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Content
            </label>
            <div className="border border-gray-300 rounded-md bg-white">
              <MenuBar editor={editor} />
              <EditorContent
                editor={editor}
                className="prose max-w-none p-4 text-sm"
              />
            </div>
          </div>

          {/* Category */}
          <div>
            <label className="block text-sm font-semibold text-gray-700">
              Category
            </label>
            <select
              name="category"
              value={data.category}
              onChange={onChangeHandler}
              className="mt-1 w-full border border-gray-300 rounded-md px-4 py-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm"
            >
              <option value="Startup">Startup</option>
              <option value="Technology">Technology</option>
              <option value="Lifestyle">Lifestyle</option>
            </select>
          </div>

          {/* Author */}
          <div>
            <label className="block text-sm font-semibold text-gray-700">
              Author
            </label>
            <select
              value={selectedAuthor.name}
              onChange={(e) => {
                const a = authors.find(
                  (author) => author.name === e.target.value
                );
                setSelectedAuthor(a);
              }}
              className="mt-1 w-full border border-gray-300 rounded-md px-4 py-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm"
            >
              {authors.map((author) => (
                <option key={author.name} value={author.name}>
                  {author.name}
                </option>
              ))}
            </select>

            {selectedAuthor.name === "Custom Author" && (
              <div className="mt-4 space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700">
                    Custom Author Name
                  </label>
                  <input
                    type="text"
                    value={customAuthor.name}
                    onChange={(e) =>
                      setCustomAuthor({ ...customAuthor, name: e.target.value })
                    }
                    className="mt-1 w-full border border-gray-300 rounded-md px-4 py-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm"
                    placeholder="Enter name"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700">
                    Custom Author Image URL
                  </label>
                  <input
                    type="text"
                    value={customAuthor.img}
                    onChange={(e) =>
                      setCustomAuthor({ ...customAuthor, img: e.target.value })
                    }
                    className="mt-1 w-full border border-gray-300 rounded-md px-4 py-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm"
                    placeholder="Enter image URL"
                    required
                  />
                </div>
              </div>
            )}
          </div>

          <div className="pt-4">
            <button
              type="submit"
              className="inline-flex justify-center w-full sm:w-auto rounded-md bg-indigo-600 px-6 py-2 text-sm font-medium text-white shadow hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              Publish Blog
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Page;
