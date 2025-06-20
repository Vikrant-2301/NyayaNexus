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
      const response = await axios.get("/api/blog", {
        headers: { "Cache-Control": "no-cache" },
      });
      setBlogs(response.data.blogs || []);
    } catch (err) {
      console.error("Failed to fetch blogs:", err);
      setError("Unable to load blogs at the moment.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBlogs();
  }, []);

  return (
    <div className="py-14 px-4 sm:px-8">
      <h2 className="text-3xl font-bold text-center text-gray-900 mb-10">
        Latest Articles
      </h2>

      {loading ? (
        <p className="text-center text-gray-500">Loading blogs...</p>
      ) : error ? (
        <p className="text-center text-red-500">{error}</p>
      ) : blogs.length === 0 ? (
        <p className="text-center text-gray-500">No blogs found.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 xl:mx-24">
          {blogs.map((item) => (
            <BlogItem
              key={item._id}
              slug={item.slug}
              image={item.image}
              title={item.title}
              description={item.description}
              category={item.category}
              author={item.author}
              authorImg={item.authorImg}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default BlogList;
