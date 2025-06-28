"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import Image from "next/image";
import {
  FaEdit,
  FaTrash,
  FaLinkedin,
  FaGlobe,
  FaTwitter,
} from "react-icons/fa";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function AuthorsPage() {
  const [authors, setAuthors] = useState([]);
  const [form, setForm] = useState({
    name: "",
    description: "",
    image: null,
    twitter: "",
    linkedin: "",
    website: "",
  });
  const [preview, setPreview] = useState(null);
  const [editAuthor, setEditAuthor] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    fetchAuthors();
  }, []);

  const fetchAuthors = async () => {
    const res = await axios.get("/api/authors");
    const sorted = res.data.sort((a, b) =>
      a.name.localeCompare(b.name, "en", { sensitivity: "base" })
    );
    setAuthors(sorted);
  };

  const resetForm = () => {
    setForm({
      name: "",
      description: "",
      image: null,
      twitter: "",
      linkedin: "",
      website: "",
    });
    setPreview(null);
    setEditAuthor(null);
    setModalOpen(false);
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setForm({ ...form, image: file });
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setPreview(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    Object.entries(form).forEach(([key, value]) => {
      if (value) formData.append(key, value);
    });

    try {
      if (editAuthor) {
        await axios.put(`/api/authors/${editAuthor._id}`, formData);
        toast.success("Author updated successfully");
      } else {
        await axios.post("/api/authors", formData);
        toast.success("Author added successfully");
      }
      resetForm();
      fetchAuthors();
    } catch (error) {
      toast.error(error.response?.data?.error || "Failed to save author");
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete this author?")) return;
    try {
      await axios.delete(`/api/authors/${id}`);
      toast.success("Author deleted successfully");
      fetchAuthors();
    } catch (err) {
      toast.error("Failed to delete author");
    }
  };

  const handleEdit = (author) => {
    setEditAuthor(author);
    setForm({
      name: author.name,
      description: author.description,
      image: null,
      twitter: author.socialLinks?.twitter || "",
      linkedin: author.socialLinks?.linkedin || "",
      website: author.socialLinks?.website || "",
    });
    setPreview(author.image);
    setModalOpen(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="p-6 space-y-10">
      <ToastContainer />

      {modalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-40 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-lg w-full max-w-4xl flex flex-col md:flex-row overflow-hidden">
            {/* Left Side (Form) */}
            <div className="w-full md:w-2/3 p-6 space-y-4">
              <h2 className="text-2xl font-semibold text-center">
                {editAuthor ? "Edit Author" : "Add Author"}
              </h2>

              <form onSubmit={handleSubmit} className="space-y-4">
                <input
                  type="text"
                  placeholder="Name"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  required
                  className="border rounded-md p-2 w-full"
                />

                <textarea
                  placeholder="Description"
                  value={form.description}
                  onChange={(e) =>
                    setForm({ ...form, description: e.target.value })
                  }
                  rows={3}
                  required
                  className="border rounded-md p-2 w-full resize-none"
                />

                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="w-full"
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <input
                    type="url"
                    placeholder="Twitter"
                    value={form.twitter}
                    onChange={(e) =>
                      setForm({ ...form, twitter: e.target.value })
                    }
                    className="border rounded-md p-2 w-full"
                  />
                  <input
                    type="url"
                    placeholder="LinkedIn"
                    value={form.linkedin}
                    onChange={(e) =>
                      setForm({ ...form, linkedin: e.target.value })
                    }
                    className="border rounded-md p-2 w-full"
                  />
                  <input
                    type="url"
                    placeholder="Website"
                    value={form.website}
                    onChange={(e) =>
                      setForm({ ...form, website: e.target.value })
                    }
                    className="border rounded-md p-2 w-full md:col-span-2"
                  />
                </div>

                <div className="flex justify-end gap-3 pt-2">
                  <button
                    type="button"
                    onClick={resetForm}
                    className="px-4 py-2 border rounded-md text-gray-600 hover:bg-gray-100"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                  >
                    {editAuthor ? "Save" : "Add"}
                  </button>
                </div>
              </form>
            </div>

            {/* Right Side (Image Preview) */}
            <div className="w-full md:w-1/3 bg-gray-50 flex items-center justify-center p-6 border-l">
              {preview ? (
                <div className="w-40 h-40 relative rounded-full overflow-hidden border shadow">
                  <Image
                    src={preview}
                    alt="Preview"
                    fill
                    className="object-cover"
                  />
                </div>
              ) : (
                <p className="text-gray-400 text-center text-sm">
                  Image preview will appear here
                </p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Authors</h1>
        <button
          className="bg-black text-white px-4 py-2 rounded-md hover:opacity-80"
          onClick={() => setModalOpen(true)}
        >
          + Add Author
        </button>
      </div>

      {/* Author Cards */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {authors.length ? (
          authors.map((author) => (
            <div
              key={author._id}
              className="bg-white border rounded-xl shadow-sm p-6 flex flex-col items-center text-center space-y-2"
            >
              <Image
                src={author.image}
                alt={author.name}
                width={100}
                height={100}
                className="rounded-full object-cover mb-2"
              />
              <h3 className="text-lg font-medium">{author.name}</h3>
              <p className="text-sm text-gray-500">{author.description}</p>

              <div className="flex gap-4 mt-3 text-lg text-gray-600">
                {author.socialLinks?.twitter && (
                  <button
                    onClick={() =>
                      window.open(author.socialLinks.twitter, "_blank")
                    }
                    className="hover:opacity-80"
                  >
                    <FaTwitter />
                  </button>
                )}
                {author.socialLinks?.linkedin && (
                  <button
                    onClick={() =>
                      window.open(author.socialLinks.linkedin, "_blank")
                    }
                    className="hover:opacity-80"
                  >
                    <FaLinkedin />
                  </button>
                )}
                {author.socialLinks?.website && (
                  <button
                    onClick={() =>
                      window.open(author.socialLinks.website, "_blank")
                    }
                    className="hover:opacity-80"
                  >
                    <FaGlobe />
                  </button>
                )}
                <button
                  onClick={() => handleEdit(author)}
                  className="hover:opacity-80"
                >
                  <FaEdit />
                </button>
                <button
                  onClick={() => handleDelete(author._id)}
                  className="hover:opacity-80"
                >
                  <FaTrash />
                </button>
              </div>
            </div>
          ))
        ) : (
          <p className="text-gray-500">No authors found.</p>
        )}
      </div>
    </div>
  );
}
