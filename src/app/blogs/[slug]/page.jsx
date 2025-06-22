"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import axios from "axios";
import Image from "next/image";
import Link from "next/link";
import { Twitter, Facebook, ArrowUp } from "lucide-react";
import { IconBrandWhatsapp } from "@tabler/icons-react";
import { motion } from "framer-motion";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

const estimateReadTime = (text) => {
  if (typeof text !== "string") return 0;
  const words = text.trim().split(/\s+/).length;
  return Math.ceil(words / 200);
};

const ScrollToTopButton = () => {
  const [isVisible, setIsVisible] = useState(false);
  useEffect(() => {
    const toggleVisibility = () => {
      setIsVisible(window.scrollY > 200);
    };
    window.addEventListener("scroll", toggleVisibility);
    return () => window.removeEventListener("scroll", toggleVisibility);
  }, []);
  return isVisible ? (
    <button
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      className="fixed bottom-5 right-5 z-50 p-3 bg-indigo-600 text-white rounded-full shadow-md hover:bg-indigo-700 transition"
    >
      <ArrowUp size={18} />
    </button>
  ) : null;
};

const BlogPage = () => {
  const { slug } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [views, setViews] = useState(0);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState({ name: "", content: "" });
  const [commentStatus, setCommentStatus] = useState("");
  const [popularBlogs, setPopularBlogs] = useState([]);
  const [nextPrevBlogs, setNextPrevBlogs] = useState({
    next: null,
    prev: null,
  });

  const shareUrl = typeof window !== "undefined" ? window.location.href : "";

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const res = await axios.get(`/api/blog/${slug}`);
        const blog = res.data;
        setData(blog);
        setComments(blog.comments?.filter((c) => c.approved) || []);
        setLoading(false);

        if (blog._id) {
          axios
            .post("/api/view", { id: blog._id })
            .then((res) => setViews(res.data.views));
          axios
            .get("/api/blog/popular")
            .then((res) => setPopularBlogs(res.data.blogs || []));
          axios
            .get(`/api/blog/adjacent?slug=${slug}`)
            .then((res) => setNextPrevBlogs(res.data));
        }
      } catch (error) {
        console.error("Error loading blog:", error);
        setLoading(false);
      }
    };

    fetchBlog();
  }, [slug]);

  const readTime = estimateReadTime(data?.description || "");

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    setCommentStatus("");
    if (!data?._id || !newComment.name.trim() || !newComment.content.trim()) {
      setCommentStatus("Please fill in all fields.");
      return;
    }

    try {
      await axios.post(`/api/comments`, {
        id: data._id,
        name: newComment.name.trim(),
        content: newComment.content.trim(),
      });
      setCommentStatus("Comment submitted for approval.");
      setNewComment({ name: "", content: "" });
    } catch (error) {
      console.error("Comment error:", error);
      setCommentStatus("Failed to submit comment.");
    }
  };

  const handleShare = (platform) => {
    const text = encodeURIComponent(`Check out this blog: ${data?.title}`);
    const urls = {
      twitter: `https://twitter.com/intent/tweet?text=${text}&url=${shareUrl}`,
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${shareUrl}`,
      whatsapp: `https://wa.me/?text=${text} ${shareUrl}`,
    };
    window.open(urls[platform], "_blank");
  };

  return (
    <>
      <div className="max-w-screen-xl mx-auto px-4 md:px-6 pt-24 pb-10 grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-10">
        {/* Main Blog Content */}
        <div>
          <div className="relative w-full h-[50vh] sm:h-[60vh] rounded-xl overflow-hidden">
            {loading ? (
              <Skeleton height="100%" />
            ) : (
              <Image
                src={data?.image || "/default-image.jpg"}
                alt={data?.title}
                fill
                className="object-cover object-center"
                priority
              />
            )}
          </div>

          <div className="mt-6 flex flex-wrap gap-4 text-sm text-gray-600">
            {loading ? (
              <Skeleton width={150} />
            ) : (
              <>
                <span className="capitalize">{data?.category}</span>
                <span>•</span>
                <span>{readTime} min read</span>
                <span>•</span>
                <span>{views} views</span>
              </>
            )}
          </div>

          <h1 className="text-4xl font-bold mt-4 text-gray-900 leading-tight">
            {loading ? <Skeleton count={2} /> : data?.title}
          </h1>

          {loading ? (
            <div className="flex gap-3 mt-4">
              <Skeleton circle width={40} height={40} />
              <Skeleton width={100} />
            </div>
          ) : (
            <div className="flex items-center gap-3 mt-4">
              <Image
                src={data?.author?.image || "/default-avatar.png"}
                alt={data?.author?.name}
                width={40}
                height={40}
                className="rounded-full"
              />
              <span>{data?.author?.name}</span>
            </div>
          )}

          {/* Main Content */}
          {loading ? (
            <div className="mt-8 space-y-4">
              <Skeleton count={10} />
            </div>
          ) : (
            <article
              className="prose prose-lg lg:prose-xl max-w-none mt-8"
              dangerouslySetInnerHTML={{ __html: data?.description }}
            />
          )}
        </div>

        {/* Sidebar Popular Posts */}
        <aside className="hidden lg:block sticky top-28 h-fit">
          <div className="bg-white rounded-lg shadow p-5">
            <h3 className="text-lg font-semibold mb-4 text-gray-800">
              Popular Posts
            </h3>
            <div className="space-y-5">
              {loading
                ? Array.from({ length: 3 }).map((_, idx) => (
                    <div key={idx} className="flex gap-3">
                      <Skeleton width={80} height={60} />
                      <div className="flex-1">
                        <Skeleton width="80%" />
                        <Skeleton width="40%" />
                      </div>
                    </div>
                  ))
                : popularBlogs.map((blog) => (
                    <Link
                      key={blog._id}
                      href={`/blogs/${blog.slug}`}
                      className="flex gap-3 hover:bg-gray-100 rounded p-2 transition"
                    >
                      <Image
                        src={blog.image}
                        alt={blog.title}
                        width={80}
                        height={60}
                        className="rounded object-cover"
                        loading="lazy"
                      />
                      <div>
                        <h4 className="font-medium text-gray-900 line-clamp-2">
                          {blog.title}
                        </h4>
                        <p className="text-sm text-gray-500">
                          {blog.views} views
                        </p>
                      </div>
                    </Link>
                  ))}
            </div>
          </div>
        </aside>
      </div>

      <ScrollToTopButton />
    </>
  );
};

export default BlogPage;
