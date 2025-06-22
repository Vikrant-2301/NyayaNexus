"use client";

import {
  FaBlog,
  FaCommentDots,
  FaEnvelope,
  FaUser,
  FaNewspaper,
} from "react-icons/fa";
import Link from "next/link";
import { useEffect, useState } from "react";
import axios from "axios";

const AdminDashboardPage = () => {
  const [stats, setStats] = useState({
    blogs: 0,
    comments: 0,
    submissions: 0,
    authors: 0,
    subscribers: 0,
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [blogRes, commentRes, subRes, authorRes, emailRes] =
          await Promise.all([
            axios.get("/api/blog"),
            axios.get("/api/admin/comments"),
            axios.get("/api/admin/article-submissions"),
            axios.get("/api/authors"),
            axios.get("/api/email"),
          ]);

        setStats({
          blogs: blogRes.data.blogs.length,
          comments: commentRes.data.comments.length,
          submissions: subRes.data.submissions.length,
          authors: authorRes.data.length,
          subscribers: emailRes.data.emails.length,
        });
      } catch (err) {
        console.error("Failed to fetch dashboard stats", err);
      }
    };

    fetchStats();
  }, []);

  const tiles = [
    {
      title: "Add Blog",
      href: "/admin/addBlog",
      icon: <FaBlog className="text-2xl text-blue-600" />,
    },
    {
      title: "Blog List",
      href: "/admin/blogList",
      icon: <FaBlog className="text-2xl text-purple-600" />,
      count: stats.blogs,
    },
    {
      title: "Comments",
      href: "/admin/comments",
      icon: <FaCommentDots className="text-2xl text-green-600" />,
      count: stats.comments,
    },
    {
      title: "Subscriptions",
      href: "/admin/subscriptions",
      icon: <FaEnvelope className="text-2xl text-pink-600" />,
      count: stats.subscribers,
    },
    {
      title: "Authors",
      href: "/admin/authors",
      icon: <FaUser className="text-2xl text-yellow-600" />,
      count: stats.authors,
    },
    {
      title: "Article Submissions",
      href: "/admin/article-submissions",
      icon: <FaNewspaper className="text-2xl text-red-600" />,
      count: stats.submissions,
    },
  ];

  return (
    <div className="p-6 min-h-screen">
      <h1 className="text-3xl sm:text-4xl font-bold mb-8 text-center sm:text-left">
        Admin Dashboard
      </h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {tiles.map(({ title, href, icon, count }) => (
          <Link key={title} href={href}>
            <div className="bg-white border rounded-lg p-5 shadow-sm hover:shadow-md hover:bg-gray-50 transition flex flex-col gap-2 items-center justify-center text-center">
              {icon}
              <p className="text-md font-semibold text-gray-700">{title}</p>
              {typeof count === "number" && (
                <span className="text-sm text-gray-500">{count} items</span>
              )}
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default AdminDashboardPage;
