"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import BlogItem from "./blogitems";

const categories = ["All", "Technology", "Startup", "Lifestyle"];

const BlogList = () => {
  const [menu, setMenu] = useState("All");
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchBlogs = async () => {
    try {
      const response = await axios.get("/api/blog", {
        headers: {
          "Cache-Control": "no-cache",
        },
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

  const filteredBlogs =
    menu === "All" ? blogs : blogs.filter((blog) => blog.category === menu);

  return (
    <div className="py-10 px-4">
      {/* Category Filter Buttons */}
      <div className="flex justify-center gap-4 mb-8 flex-wrap">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setMenu(cat)}
            className={`px-4 py-2 rounded-full text-sm font-medium border transition-all duration-200 ${
              menu === cat
                ? "bg-black text-white"
                : "bg-gray-100 text-gray-800 hover:bg-black hover:text-white"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Blog Grid */}
      {loading ? (
        <p className="text-center text-gray-500">Loading blogs...</p>
      ) : error ? (
        <p className="text-center text-red-500">{error}</p>
      ) : filteredBlogs.length === 0 ? (
        <p className="text-center text-gray-500">No blogs found.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 xl:mx-24">
          {filteredBlogs.map((item) => (
            <BlogItem
              key={item._id}
              slug={item.slug}
              image={item.image}
              title={item.title}
              description={item.description}
              category={item.category}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default BlogList;
