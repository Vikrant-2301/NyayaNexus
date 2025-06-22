"use client";
import { useEffect, useState } from "react";
import axios from "axios";

const ArticleSubmissions = () => {
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState({});
  const [confirmDeleteId, setConfirmDeleteId] = useState(null);

  const fetchSubmissions = async () => {
    try {
      const res = await axios.get("/api/admin/article-submissions");
      setSubmissions(res.data.submissions || []);
    } catch (err) {
      console.error("Failed to fetch submissions", err);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (id) => {
    setStatus((prev) => ({ ...prev, [id]: "Sending..." }));
    try {
      await axios.put(`/api/article-submissions/${id}/approve`);
      setStatus((prev) => ({ ...prev, [id]: "Approved" }));
      fetchSubmissions();
    } catch (err) {
      console.error(err);
      setStatus((prev) => ({ ...prev, [id]: "Failed" }));
    }
  };

  const confirmDelete = (id) => {
    setConfirmDeleteId(id);
  };

  const handleDelete = async () => {
    if (!confirmDeleteId) return;

    setStatus((prev) => ({ ...prev, [confirmDeleteId]: "Deleting..." }));
    try {
      await axios.delete(`/api/article-submissions/${confirmDeleteId}/delete`);
      setConfirmDeleteId(null);
      fetchSubmissions();
    } catch (err) {
      console.error(err);
      setStatus((prev) => ({
        ...prev,
        [confirmDeleteId]: "Delete Failed",
      }));
    }
  };

  useEffect(() => {
    fetchSubmissions();
  }, []);

  return (
    <div className="p-8 max-w-5xl mx-auto">
      <h2 className="text-2xl font-bold mb-6">Submitted Articles</h2>

      {loading ? (
        <p>Loading...</p>
      ) : submissions.length === 0 ? (
        <p className="text-gray-500">No article submissions found.</p>
      ) : (
        <div className="space-y-10">
          {submissions.map((article) => (
            <div
              key={article._id}
              className="border p-6 rounded-lg bg-white shadow-md"
            >
              <h3 className="font-bold text-2xl text-center text-gray-800 mb-2">
                {article.title}
              </h3>

              <p className="text-center text-sm text-gray-600 mb-2">
                By <strong>{article.name}</strong> ({article.email})
              </p>

              <p className="text-center text-xs text-gray-400 mb-4">
                Submitted on{" "}
                {new Date(article.createdAt).toLocaleString("en-IN", {
                  dateStyle: "medium",
                  timeStyle: "short",
                })}
              </p>

              {article.image && (
                <div className="mb-6 flex justify-center">
                  <img
                    src={article.image}
                    alt="Article Cover"
                    className="max-w-full max-h-[400px] object-cover rounded shadow-md"
                    onError={(e) => {
                      e.target.src = "/assets/profile_icon.png";
                      e.target.onerror = null;
                    }}
                  />
                </div>
              )}

              <div
                className="prose max-w-none text-gray-800"
                dangerouslySetInnerHTML={{ __html: article.content }}
              />

              <div className="mt-6 flex gap-4 flex-wrap justify-center">
                {!article.approved ? (
                  <button
                    onClick={() => handleApprove(article._id)}
                    className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded"
                  >
                    {status[article._id] || "Approve & Notify"}
                  </button>
                ) : (
                  <span className="text-green-600 font-medium">Approved</span>
                )}

                <button
                  onClick={() => confirmDelete(article._id)}
                  className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded"
                >
                  {status[article._id] === "Deleting..."
                    ? "Deleting..."
                    : "Delete"}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Confirm Delete Modal */}
      {confirmDeleteId && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-sm shadow-lg">
            <h3 className="text-lg font-semibold mb-4 text-gray-800">
              Confirm Deletion
            </h3>
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete this article? This action cannot
              be undone.
            </p>
            <div className="flex justify-end gap-4">
              <button
                onClick={() => setConfirmDeleteId(null)}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
              >
                Confirm Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ArticleSubmissions;
