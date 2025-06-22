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
  const [editAuthor, setEditAuthor] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    fetchAuthors();
  }, []);

  const fetchAuthors = async () => {
    const res = await axios.get("/api/authors");
    setAuthors(res.data);
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
    setEditAuthor(null);
    setModalOpen(false);
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
    setModalOpen(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="p-6 space-y-10">
      <ToastContainer />

      {/* Modal Form */}
      {modalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-40 z-50 flex justify-center items-start pt-20">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-xl relative">
            <h2 className="text-xl font-bold mb-4">
              {editAuthor ? "Edit Author" : "Add Author"}
            </h2>
            <form onSubmit={handleSubmit} className="grid gap-4">
              <input
                type="text"
                placeholder="Name"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                required
                className="border p-2 rounded w-full"
              />
              <textarea
                placeholder="Description"
                value={form.description}
                onChange={(e) =>
                  setForm({ ...form, description: e.target.value })
                }
                className="border p-2 rounded w-full"
                rows={4}
                required
              />
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setForm({ ...form, image: e.target.files[0] })}
              />
              <input
                type="url"
                placeholder="Twitter"
                value={form.twitter}
                onChange={(e) => setForm({ ...form, twitter: e.target.value })}
                className="border p-2 rounded w-full"
              />
              <input
                type="url"
                placeholder="LinkedIn"
                value={form.linkedin}
                onChange={(e) => setForm({ ...form, linkedin: e.target.value })}
                className="border p-2 rounded w-full"
              />
              <input
                type="url"
                placeholder="Website"
                value={form.website}
                onChange={(e) => setForm({ ...form, website: e.target.value })}
                className="border p-2 rounded w-full"
              />
              <div className="flex justify-end gap-4">
                <button
                  type="button"
                  onClick={resetForm}
                  className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                  {editAuthor ? "Save" : "Add"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Header & Add Button */}
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Authors</h1>
        <button
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
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
              className="bg-white border rounded-lg shadow p-4 flex flex-col items-center text-center"
            >
              <Image
                src={author.image}
                alt={author.name}
                width={120}
                height={120}
                className="rounded-full object-cover mb-4"
              />
              <h3 className="text-xl font-semibold">{author.name}</h3>
              <p className="text-gray-600">{author.description}</p>
              <div className="flex gap-4 mt-3 text-xl">
                {author.socialLinks?.twitter && (
                  <a
                    href={author.socialLinks.twitter}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <FaTwitter className="text-blue-400" />
                  </a>
                )}
                {author.socialLinks?.linkedin && (
                  <a
                    href={author.socialLinks.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <FaLinkedin className="text-blue-700" />
                  </a>
                )}
                {author.socialLinks?.website && (
                  <a
                    href={author.socialLinks.website}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <FaGlobe className="text-gray-700" />
                  </a>
                )}
                <FaEdit
                  className="text-yellow-600 cursor-pointer"
                  onClick={() => handleEdit(author)}
                />
                <FaTrash
                  className="text-red-600 cursor-pointer"
                  onClick={() => handleDelete(author._id)}
                />
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
