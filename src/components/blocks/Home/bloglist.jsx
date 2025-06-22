"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import BlogItem from "./blogitems";

const BlogList = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchBlogs = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await axios.get("/api/blog");
      if (!response.data || !response.data.blogs) {
        throw new Error("Invalid response format");
      }
      setBlogs(response.data.blogs);
    } catch (err) {
      console.error("Failed to fetch blogs:", err);
      setError(
        err.response?.data?.msg || "Unable to load blogs at the moment."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBlogs();
  }, []);

  return (
    <section id="articles" className="py-10 px-4 min-h-screen">
      {/* Heading */}
      <h2 className="text-3xl sm:text-4xl font-bold text-center mb-12 text-gray-800">
        Articles
      </h2>

      {/* Blog Grid */}
      <div
        aria-live="polite"
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 xl:mx-24"
      >
        {loading ? (
          [...Array(6)].map((_, index) => (
            <div
              key={index}
              className="bg-white rounded-xl shadow-md animate-pulse h-[340px]"
            >
              <div className="h-56 w-full bg-gray-200 rounded-t-xl"></div>
              <div className="p-4 space-y-3">
                <div className="h-4 bg-gray-300 rounded w-3/4"></div>
                <div className="h-3 bg-gray-200 rounded w-full"></div>
                <div className="h-3 bg-gray-200 rounded w-5/6"></div>
              </div>
            </div>
          ))
        ) : error ? (
          <div className="col-span-full flex items-center justify-center h-[50vh] text-red-500 text-lg">
            {error}
          </div>
        ) : blogs.length === 0 ? (
          <div className="col-span-full flex items-center justify-center h-[50vh] text-gray-500 text-lg">
            No blogs found.
          </div>
        ) : (
          blogs.map((item) => (
            <BlogItem
              key={item._id}
              slug={item.slug}
              image={item.image}
              title={item.title}
              description={item.description}
              category={item.category}
              author={item.author}
            />
          ))
        )}
      </div>
    </section>
  );
};

export default BlogList;
