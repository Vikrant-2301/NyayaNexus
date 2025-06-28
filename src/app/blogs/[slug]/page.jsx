//src\app\blogs\[slug]\page.jsx
"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import axios from "axios";
import Image from "next/image";
import Link from "next/link";
import { Twitter, Facebook, ArrowUp } from "lucide-react";
import { IconBrandWhatsapp } from "@tabler/icons-react";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

const estimateReadTime = (html) => {
  const text = html.replace(/<[^>]+>/g, "");
  const words = text.trim().split(/\s+/).length;
  return Math.ceil(words / 200);
};

const ScrollToTopButton = () => {
  const [isVisible, setIsVisible] = useState(false);
  useEffect(() => {
    const listener = () => setIsVisible(window.scrollY > 200);
    window.addEventListener("scroll", listener);
    return () => window.removeEventListener("scroll", listener);
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
    prev: null,
    next: null,
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
      } catch (err) {
        console.error("Error loading blog:", err);
        setLoading(false);
      }
    };
    fetchBlog();
  }, [slug]);

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
    } catch (err) {
      console.error("Comment error:", err);
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
        {/* Main Content */}
        <div>
          {/* Featured Image */}
          <div className="relative w-full h-[50vh] sm:h-[60vh] rounded-xl overflow-hidden">
            {loading ? (
              <Skeleton height="100%" />
            ) : (
              <Image
                src={data.image}
                alt={data.title}
                fill
                className="object-cover object-center"
                priority
              />
            )}
          </div>

          {/* Metadata */}
          <div className="mt-6 flex flex-wrap gap-4 text-sm text-gray-600">
            {loading ? (
              <Skeleton width={200} />
            ) : (
              <>
                <span className="capitalize">{data.category}</span>
                <span>•</span>
                <span>{estimateReadTime(data.description)} min read</span>
                <span>•</span>
                <span>{views} views</span>
              </>
            )}
          </div>

          {/* Title */}
          <h1 className="text-4xl font-bold mt-4 text-gray-900 leading-tight">
            {loading ? <Skeleton count={2} /> : data.title}
          </h1>

          {/* Author Info */}
          <div className="mt-6 flex items-center gap-3">
            {loading ? (
              <>
                <Skeleton circle width={40} height={40} />
                <Skeleton width={120} height={20} />
              </>
            ) : (
              <>
                <Image
                  src={data.author.image}
                  alt={data.author.name}
                  width={40}
                  height={40}
                  className="rounded-full"
                />
                <div>
                  <p className="font-semibold">{data.author.name}</p>
                  <p className="text-sm text-gray-600 line-clamp-2">
                    {data.author.description}
                  </p>
                </div>
              </>
            )}
          </div>

          {/* Blog Body */}
          {loading ? (
            <div className="mt-8 space-y-4">
              <Skeleton count={10} />
            </div>
          ) : (
            <article
              className="prose prose-lg lg:prose-xl max-w-none mt-8"
              dangerouslySetInnerHTML={{ __html: data.description }}
            />
          )}

          {/* Author Profile */}
          {!loading && data.author && (
            <div className="mt-14 p-6 bg-gray-50 border rounded-xl">
              <div className="flex gap-4 items-center">
                <Image
                  src={data.author.image}
                  alt={data.author.name}
                  width={60}
                  height={60}
                  className="rounded-full"
                />
                <div>
                  <h4 className="text-lg font-semibold">{data.author.name}</h4>
                  <p className="text-sm text-gray-600">
                    {data.author.description}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Adjacent Posts */}
          {(nextPrevBlogs.prev || nextPrevBlogs.next) && !loading && (
            <div className="mt-12 border-t pt-8">
              <h2 className="text-xl font-semibold mb-6 text-gray-800">
                More Posts
              </h2>
              <div className="flex flex-col md:flex-row justify-between gap-6">
                {nextPrevBlogs.prev && (
                  <Link
                    href={`/blogs/${nextPrevBlogs.prev.slug}`}
                    className="flex-1 bg-white shadow hover:shadow-md transition p-4 rounded border"
                  >
                    <h3 className="font-bold text-indigo-600 mb-1">
                      ← {nextPrevBlogs.prev.title}
                    </h3>
                    <p className="text-sm text-gray-700 line-clamp-2">
                      {nextPrevBlogs.prev.description.replace(/<[^>]+>/g, "")}
                    </p>
                  </Link>
                )}
                {nextPrevBlogs.next && (
                  <Link
                    href={`/blogs/${nextPrevBlogs.next.slug}`}
                    className="flex-1 bg-white shadow hover:shadow-md transition p-4 rounded border text-right"
                  >
                    <h3 className="font-bold text-indigo-600 mb-1">
                      {nextPrevBlogs.next.title} →
                    </h3>
                    <p className="text-sm text-gray-700 line-clamp-2">
                      {nextPrevBlogs.next.description.replace(/<[^>]+>/g, "")}
                    </p>
                  </Link>
                )}
              </div>
            </div>
          )}

          {/* Comments */}
          {!loading && (
            <div className="mt-12">
              <h2 className="text-2xl font-semibold mb-4 text-gray-800">
                Comments
              </h2>
              {comments.length > 0 ? (
                <div className="space-y-4">
                  {comments.map((c, idx) => (
                    <div
                      key={idx}
                      className="bg-gray-100 p-4 rounded-lg border"
                    >
                      <p className="font-medium text-gray-900">{c.name}</p>
                      <p className="text-gray-700 text-sm mt-1">{c.content}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500">No comments yet.</p>
              )}

              <form onSubmit={handleCommentSubmit} className="mt-6 space-y-4">
                <input
                  type="text"
                  placeholder="Your name"
                  value={newComment.name}
                  onChange={(e) =>
                    setNewComment({ ...newComment, name: e.target.value })
                  }
                  className="w-full px-4 py-2 border rounded focus:ring"
                  required
                />
                <textarea
                  placeholder="Your comment"
                  value={newComment.content}
                  onChange={(e) =>
                    setNewComment({ ...newComment, content: e.target.value })
                  }
                  className="w-full px-4 py-2 border rounded focus:ring"
                  rows={4}
                  required
                />
                <button
                  type="submit"
                  className="bg-indigo-600 text-white px-6 py-2 rounded hover:bg-indigo-700"
                >
                  Submit Comment
                </button>
                {commentStatus && (
                  <p className="text-sm mt-2 text-gray-600">{commentStatus}</p>
                )}
              </form>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <aside className="hidden lg:block sticky top-28 h-fit">
          <div className="bg-white rounded-lg shadow p-5">
            <h3 className="text-lg font-semibold mb-4 text-gray-800">
              Popular Posts
            </h3>
            <div className="space-y-5">
              {loading
                ? Array.from({ length: 3 }).map((_, i) => (
                    <div key={i} className="flex gap-3">
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
