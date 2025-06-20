"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import axios from "axios";
import Image from "next/image";

const BlogPage = () => {
  const { slug } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!slug) return;

    const fetchBlogData = async () => {
      try {
        const response = await axios.get(
          `/api/blog?slug=${encodeURIComponent(slug)}`
        );
        setData(response.data);
      } catch (error) {
        console.error(
          "Failed to fetch blog data:",
          error.response?.data || error.message
        );
      } finally {
        setLoading(false);
      }
    };

    fetchBlogData();
  }, [slug]);

  const shareUrl = typeof window !== "undefined" ? window.location.href : "";

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: data?.title || "Blog Post",
          url: shareUrl,
        });
      } catch (err) {
        console.error("Share failed:", err);
      }
    } else {
      alert("Sharing not supported on this browser.");
    }
  };

  if (loading) return <div className="p-10 text-center">Loading blog...</div>;
  if (!data)
    return <div className="p-10 text-center text-red-500">Blog not found.</div>;

  return (
    <main className="pt-28 pb-20 px-4 sm:px-6 lg:px-32 xl:px-48 bg-white text-gray-900">
      {/* Title Section */}
      <section className="text-center max-w-5xl mx-auto">
        <h1 className="text-3xl sm:text-5xl font-extrabold leading-tight mb-6">
          {data.title}
        </h1>
        <div className="flex items-center justify-center gap-3 mb-10">
          <Image
            src={data.authorImg || "/default-avatar.png"}
            width={50}
            height={50}
            alt="Author"
            className="rounded-full border"
          />
          <p className="text-gray-600 text-base sm:text-lg">
            {data.author || "Anonymous"}
          </p>
        </div>
      </section>

      {/* Featured Image */}
      <section className="w-full max-w-5xl mx-auto aspect-video overflow-hidden rounded-2xl shadow-lg border mb-14">
        <Image
          src={data.image || "/default-image.jpg"}
          alt="Blog cover"
          width={1280}
          height={720}
          className="w-full h-full object-cover"
        />
      </section>

      {/* Blog Content */}
      <article className="prose prose-lg prose-slate max-w-3xl mx-auto text-justify">
        <div dangerouslySetInnerHTML={{ __html: data.description }} />
      </article>

      {/* Share Section */}
      <section className="mt-20 max-w-3xl mx-auto border-t pt-10">
        <h3 className="text-xl font-semibold mb-4">Share this article</h3>
        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={handleNativeShare}
            className="px-4 py-2 rounded border text-sm font-medium hover:bg-black hover:text-white transition"
          >
            Share via Device
          </button>
          <a
            href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
              shareUrl
            )}`}
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2 rounded border text-sm font-medium hover:bg-blue-600 hover:text-white transition"
          >
            Facebook
          </a>
          <a
            href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(
              shareUrl
            )}&text=${encodeURIComponent(data.title)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2 rounded border text-sm font-medium hover:bg-blue-400 hover:text-white transition"
          >
            Twitter
          </a>
          <a
            href={`mailto:?subject=${encodeURIComponent(
              data.title
            )}&body=${encodeURIComponent(shareUrl)}`}
            className="px-4 py-2 rounded border text-sm font-medium hover:bg-gray-700 hover:text-white transition"
          >
            Email
          </a>
        </div>
      </section>
    </main>
  );
};

export default BlogPage;
