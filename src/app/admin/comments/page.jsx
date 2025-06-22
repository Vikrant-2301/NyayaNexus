"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

const CommentsPage = () => {
  const [pendingComments, setPendingComments] = useState([]);

  const fetchPendingComments = async () => {
    try {
      const response = await axios.get("/api/admin/comments");
      setPendingComments(response.data.comments);
    } catch (error) {
      toast.error("Failed to fetch comments");
    }
  };

  useEffect(() => {
    fetchPendingComments();
  }, []);

  const handleApprove = async (commentId) => {
    try {
      await axios.patch(`/api/admin/comments/${commentId}/approve`);
      toast.success("Comment approved");
      fetchPendingComments();
    } catch (error) {
      toast.error("Failed to approve comment");
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Pending Comments</h1>
      <div className="space-y-4">
        {pendingComments.map((comment) => (
          <div key={comment.commentId} className="border p-4 rounded-lg">
            <div className="font-semibold">{comment.blogTitle}</div>
            <div className="text-sm text-gray-500 mb-2">By {comment.name}</div>
            <p className="mb-4">{comment.content}</p>
            <button
              onClick={() => handleApprove(comment.commentId)}
              className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
            >
              Approve
            </button>
          </div>
        ))}
        {pendingComments.length === 0 && (
          <p className="text-gray-500">No pending comments</p>
        )}
      </div>
    </div>
  );
};

export default CommentsPage;