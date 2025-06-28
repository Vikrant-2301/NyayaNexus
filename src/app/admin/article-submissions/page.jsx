"use client";
import { useEffect, useState, useRef } from "react";
import axios from "axios";
import { Eye, Search, Download, CheckCircle, Trash2, X } from "lucide-react";
import { saveAs } from "file-saver";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const truncateText = (html, maxLength = 120) => {
  const text = html.replace(/<[^>]+>/g, "");
  return text.length > maxLength ? text.slice(0, maxLength) + "..." : text;
};

const ITEMS_PER_PAGE = 6;

export default function ArticleSubmissions() {
  const [submissions, setSubmissions] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedArticle, setSelectedArticle] = useState(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState(null);
  const [confirmApproveId, setConfirmApproveId] = useState(null);
  const contentRef = useRef();

  useEffect(() => {
    fetchSubmissions();
  }, []);

  const fetchSubmissions = async () => {
    try {
      const res = await axios.get("/api/admin/article-submissions");
      const data = res.data.submissions || [];
      setSubmissions(data);
      setFiltered(data);
    } catch {
      toast.error("Failed to fetch submissions");
    }
  };

  const handleSearch = (value) => {
    setSearchQuery(value);
    filterList(value, statusFilter);
  };

  const handleStatusFilter = (value) => {
    setStatusFilter(value);
    filterList(searchQuery, value);
  };

  const filterList = (search, status) => {
    const filteredData = submissions.filter((item) => {
      const matchesSearch =
        item.title.toLowerCase().includes(search.toLowerCase()) ||
        item.name.toLowerCase().includes(search.toLowerCase()) ||
        item.email.toLowerCase().includes(search.toLowerCase());
      const matchesStatus =
        status === "all" ||
        (status === "approved" && item.approved) ||
        (status === "pending" && !item.approved);
      return matchesSearch && matchesStatus;
    });
    setFiltered(filteredData);
  };

  const handleApprove = async (id) => {
    try {
      await axios.put(`/api/article-submissions/${id}/approve`);
      toast.success("Article approved");
      fetchSubmissions();
      setSelectedArticle(null);
    } catch {
      toast.error("Approval failed");
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`/api/article-submissions/${id}/delete`);
      toast.success("Article deleted");
      fetchSubmissions();
      setSelectedArticle(null);
    } catch {
      toast.error("Delete failed");
    }
  };

  const exportAsWord = (article) => {
    const content = `
      <html><head><meta charset='utf-8'></head><body>
        <h1>${article.title}</h1>
        <p><strong>Author:</strong> ${article.name} (${article.email})</p>
        ${article.content}
      </body></html>
    `;
    const blob = new Blob(["\ufeff", content], {
      type: "application/msword",
    });
    saveAs(blob, `${article.title}.doc`);
  };

  const downloadImage = async (url, filename = "image.jpg") => {
    try {
      const response = await fetch(url);
      const blob = await response.blob();
      const blobUrl = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = blobUrl;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      link.remove();
      URL.revokeObjectURL(blobUrl);
    } catch {
      toast.error("Image download failed");
    }
  };

  const paginatedSubmissions = filtered.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);

  return (
    <>
      <ToastContainer />
      <div className="px-4 sm:px-6 md:px-10 pt-6 pb-10 max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-4">
          Submitted Articles
        </h1>

        <div className="flex flex-col md:flex-row justify-between gap-4 mb-6">
          <div className="relative w-full md:max-w-md">
            <input
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
              placeholder="Search by title, author, or email..."
              className="w-full px-4 py-2 pl-10 border border-gray-300 rounded-md text-sm"
            />
            <Search
              className="absolute left-3 top-2.5 text-gray-400"
              size={18}
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => handleStatusFilter(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md text-sm"
          >
            <option value="all">All</option>
            <option value="approved">Approved</option>
            <option value="pending">Pending</option>
          </select>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {paginatedSubmissions.map((article) => (
            <div
              key={article._id}
              onClick={() => setSelectedArticle(article)}
              className="bg-white shadow-sm hover:shadow-lg transition-shadow rounded-xl overflow-hidden cursor-pointer group flex flex-col"
            >
              {article.image && (
                <img
                  src={article.image}
                  alt="Cover"
                  className="w-full object-cover h-48 group-hover:scale-105 transition-transform duration-200"
                />
              )}
              <div className="p-4 flex flex-col gap-2">
                <h2 className="text-lg font-semibold text-gray-800 group-hover:text-indigo-700 transition-colors">
                  {article.title}
                </h2>
                <p className="text-sm text-gray-500">{article.name}</p>
                <p className="text-sm text-gray-600 line-clamp-3">
                  {truncateText(article.content)}
                </p>

                <div className="flex justify-between items-center mt-2">
                  <span
                    className={`text-xs font-semibold px-2 py-1 rounded-full ${
                      article.approved
                        ? "bg-green-100 text-green-700"
                        : "bg-yellow-100 text-yellow-800"
                    }`}
                  >
                    {article.approved ? "Approved" : "Pending"}
                  </span>
                </div>

                <div
                  className="flex justify-end gap-2 mt-3"
                  onClick={(e) => e.stopPropagation()}
                >
                  {!article.approved && (
                    <button
                      onClick={() => setConfirmApproveId(article._id)}
                      className="text-green-700 hover:text-green-900 text-sm flex items-center gap-1"
                    >
                      <CheckCircle size={16} /> Approve
                    </button>
                  )}
                  <button
                    onClick={() => setConfirmDeleteId(article._id)}
                    className="text-red-600 hover:text-red-800 text-sm flex items-center gap-1"
                  >
                    <Trash2 size={16} /> Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {totalPages > 1 && (
          <div className="flex justify-center mt-10 gap-2 flex-wrap">
            {Array.from({ length: totalPages }, (_, i) => (
              <button
                key={i}
                onClick={() => setCurrentPage(i + 1)}
                className={`px-3 py-1.5 rounded-md text-sm transition ${
                  currentPage === i + 1
                    ? "bg-indigo-600 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                {i + 1}
              </button>
            ))}
          </div>
        )}

        {selectedArticle && (
          <div
            className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4"
            onClick={(e) =>
              e.target === e.currentTarget && setSelectedArticle(null)
            }
          >
            <div className="bg-white max-w-3xl w-full rounded-xl shadow-xl overflow-hidden border border-gray-200">
              <div className="flex justify-between items-center px-6 py-4 border-b">
                <div>
                  <h2 className="text-xl font-semibold text-gray-800">
                    {selectedArticle.title}
                  </h2>
                  <p className="text-sm text-gray-500">
                    {selectedArticle.name} • {selectedArticle.email}
                  </p>
                </div>
                <button onClick={() => setSelectedArticle(null)}>
                  <X className="text-gray-400 hover:text-gray-700" size={22} />
                </button>
              </div>

              <div
                className="px-6 py-4 overflow-y-auto max-h-[70vh] space-y-4"
                ref={contentRef}
              >
                {selectedArticle.image && (
                  <img
                    src={selectedArticle.image}
                    alt="Article"
                    className="w-full object-contain max-h-64 rounded-md"
                  />
                )}
                <div
                  className="prose max-w-none"
                  dangerouslySetInnerHTML={{ __html: selectedArticle.content }}
                />
              </div>

              <div className="px-6 py-4 border-t flex flex-wrap justify-between items-center gap-3">
                <div className="flex gap-2 flex-wrap">
                  {!selectedArticle.approved && (
                    <button
                      onClick={() => handleApprove(selectedArticle._id)}
                      className="px-3 py-2 rounded-md text-sm border border-gray-300 hover:bg-green-50 text-green-700 transition-colors"
                    >
                      Approve
                    </button>
                  )}
                  <button
                    onClick={() => setConfirmDeleteId(selectedArticle._id)}
                    className="px-3 py-2 rounded-md text-sm border border-gray-300 hover:bg-red-50 text-red-600 transition-colors"
                  >
                    Delete
                  </button>
                </div>
                <div className="flex gap-2 flex-wrap">
                  <button
                    onClick={() => exportAsWord(selectedArticle)}
                    className="px-3 py-2 rounded-md text-sm border border-gray-300 hover:bg-gray-100 transition"
                  >
                    Download Doc
                  </button>
                  {selectedArticle.image && (
                    <button
                      onClick={() =>
                        downloadImage(
                          selectedArticle.image,
                          "article-cover.jpg"
                        )
                      }
                      className="px-3 py-2 rounded-md text-sm border border-gray-300 hover:bg-gray-100 transition"
                    >
                      Download Image
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {confirmApproveId && (
          <div
            className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4"
            onClick={(e) =>
              e.target === e.currentTarget && setConfirmApproveId(null)
            }
          >
            <div className="bg-white max-w-sm w-full rounded-xl shadow-xl border p-6 space-y-4">
              <h2 className="text-lg font-semibold text-gray-800">
                Approve this article?
              </h2>
              <p className="text-sm text-gray-600">
                This action will mark the article as approved. Are you sure?
              </p>
              <div className="flex justify-end gap-3">
                <button
                  onClick={() => setConfirmApproveId(null)}
                  className="px-3 py-1.5 text-sm rounded-md border border-gray-300 hover:bg-gray-100"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    handleApprove(confirmApproveId);
                    setConfirmApproveId(null);
                  }}
                  className="px-3 py-1.5 text-sm rounded-md bg-green-600 text-white hover:bg-green-700"
                >
                  Confirm
                </button>
              </div>
            </div>
          </div>
        )}

        {confirmDeleteId && (
          <div
            className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4"
            onClick={(e) =>
              e.target === e.currentTarget && setConfirmDeleteId(null)
            }
          >
            <div className="bg-white max-w-sm w-full rounded-xl shadow-xl border p-6 space-y-4">
              <h2 className="text-lg font-semibold text-gray-800">
                Delete this article?
              </h2>
              <p className="text-sm text-gray-600">
                This action cannot be undone. Are you sure you want to delete
                it?
              </p>
              <div className="flex justify-end gap-3">
                <button
                  onClick={() => setConfirmDeleteId(null)}
                  className="px-3 py-1.5 text-sm rounded-md border border-gray-300 hover:bg-gray-100"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    handleDelete(confirmDeleteId);
                    setConfirmDeleteId(null);
                  }}
                  className="px-3 py-1.5 text-sm rounded-md bg-red-600 text-white hover:bg-red-700"
                >
                  Confirm
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
