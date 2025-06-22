"use client";
import BlogTableItem from "@/components/AdminComponents/BlogTableItem";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";

const Page = () => {
  const [blogs, setBlogs] = useState([]);

  const fetchBlogs = async () => {
    try {
      const response = await axios.get("/api/blog");
      setBlogs(response.data.blogs);
    } catch (error) {
      toast.error("Failed to fetch blogs");
    }
  };

  const deleteBlog = async (mongoId) => {
    try {
      const response = await axios.delete("/api/blog", {
        params: { id: mongoId }, // Ensure your API expects this as query param
      });

      toast.success(response.data.msg || "Blog deleted");
      fetchBlogs(); // Refresh blog list
    } catch (error) {
      toast.error(error.response?.data?.msg || "Failed to delete blog");
    }
  };

  useEffect(() => {
    fetchBlogs();
  }, []);

  return (
    <div className="flex-1 pt-5 px-5 sm:pt-12 sm:pl-16">
      <h1>All blogs</h1>
      <div className="relative h-[80vh] max-w-[850px] overflow-x-auto mt-4 border border-gray-400 scrollbar-hide">
        <table className="w-full text-sm text-gray-500">
          <thead className="text-xs text-gray-700 text-left uppercase bg-gray-50">
            <tr>
              <th scope="col" className="hidden sm:block px-6 py-3">
                Author name
              </th>
              <th scope="col" className="px-6 py-3">
                Blog Title
              </th>
              <th scope="col" className="px-6 py-3">
                Date
              </th>
              <th scope="col" className="px-2 py-3">
                Action
              </th>
            </tr>
          </thead>
          <tbody>
            {blogs.map((item, index) => (
              <BlogTableItem
                key={index}
                mongoId={item._id}
                title={item.title}
                author={item.author?.name || "Unknown Author"}
                authorImg={item.author?.image || "/default-avatar.png"}
                date={item.createdAt} // Also fixed the date property
                deleteBlog={deleteBlog}
              />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Page;
