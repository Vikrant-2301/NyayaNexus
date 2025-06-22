"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import Link from "next/link";
import Image from "next/image";
import {
  FaEye,
  FaUser,
  FaCommentDots,
  FaEnvelope,
  FaNewspaper,
} from "react-icons/fa";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend
);

export default function AdminDashboard() {
  const [popular, setPopular] = useState([]);
  const [authors, setAuthors] = useState([]);
  const [comments, setComments] = useState([]);
  const [subs, setSubs] = useState([]);
  const [articles, setArticles] = useState([]);
  const [chartData, setChartData] = useState(null);

  useEffect(() => {
    fetchAll();
  }, []);

  async function fetchAll() {
    try {
      const [popRes, authRes, comRes, subRes, artRes] = await Promise.all([
        axios.get("/api/blog/popular"),
        axios.get("/api/authors"),
        axios.get("/api/admin/comments"),
        axios.get("/api/email"),
        axios.get("/api/admin/article-submissions"),
      ]);
      setPopular(popRes.data.blogs || []);
      setAuthors(authRes.data || []);
      setComments(comRes.data.comments || []);
      setSubs(subRes.data.emails || []);
      setArticles(artRes.data.submissions || []);

      const topViews = popRes.data.blogs?.map((b) => b.views || 0) || [];
      const labels = popRes.data.blogs?.map((_, i) => `#${i + 1}`) || [];

      setChartData({
        labels,
        datasets: [
          {
            data: topViews,
            borderColor: "#3B82F6",
            backgroundColor: "rgba(59, 130, 246, 0.2)",
            fill: true,
            tension: 0.4,
          },
        ],
      });
    } catch (err) {
      console.error(err);
    }
  }

  const panels = [
    {
      icon: <FaEye className="text-blue-600" />,
      title: "Popular Blogs",
      content: chartData && (
        <>
          <Line
            data={chartData}
            options={{
              responsive: true,
              elements: { point: { radius: 0 } },
              plugins: { legend: { display: false } },
              scales: { x: { display: false }, y: { display: false } },
            }}
            className="mb-3"
          />
          <ul className="space-y-1 text-sm max-h-40 overflow-auto pr-1">
            {popular.slice(0, 5).map((b) => (
              <li
                key={b._id}
                className="flex justify-between items-center px-2 py-1 hover:bg-gray-50 rounded"
              >
                <Link
                  href={`/blogs/${b.slug}`}
                  className="truncate"
                  title={b.title}
                >
                  {b.title}
                </Link>
                <span className="flex items-center gap-1 text-gray-500">
                  <FaEye /> {b.views || 0}
                </span>
              </li>
            ))}
          </ul>
        </>
      ),
      link: "/admin/blogList",
    },
    {
      icon: <FaUser className="text-green-600" />,
      title: "Authors",
      content: (
        <ul className="grid grid-cols-2 gap-2 max-h-32 overflow-auto">
          {authors.slice(0, 6).map((a) => (
            <li key={a._id} className="flex items-center gap-2">
              <Image
                src={a.image}
                width={28}
                height={28}
                alt={a.name}
                className="rounded-full object-cover"
              />
              <span className="text-sm truncate">{a.name}</span>
            </li>
          ))}
        </ul>
      ),
      link: "/admin/authors",
    },
    {
      icon: <FaCommentDots className="text-yellow-600" />,
      title: "Pending Comments",
      content: (
        <div className="text-4xl font-bold text-gray-700">
          {comments.length}
        </div>
      ),
      link: "/admin/comments",
    },
    {
      icon: <FaEnvelope className="text-pink-600" />,
      title: "Subscribers",
      content: (
        <div className="text-4xl font-bold text-gray-700">{subs.length}</div>
      ),
      link: "/admin/subscriptions",
    },
    {
      icon: <FaNewspaper className="text-red-600" />,
      title: "New Submissions",
      content: (
        <div className="text-4xl font-bold text-gray-700">
          {articles.length}
        </div>
      ),
      link: "/admin/article-submissions",
    },
  ];

  return (
    <div className="px-4 py-6 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Admin Dashboard</h1>

      <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
        {panels.map((panel) => (
          <div
            key={panel.title}
            className="bg-white rounded-xl shadow-sm border p-5 flex flex-col hover:shadow-md transition"
          >
            <div className="flex items-center mb-3 space-x-2">
              <div className="text-2xl">{panel.icon}</div>
              <h2 className="text-lg font-medium text-gray-700">
                {panel.title}
              </h2>
            </div>
            <div className="flex-1">{panel.content}</div>
            <div className="pt-4">
              <Link
                href={panel.link}
                className="text-blue-600 text-sm hover:underline"
              >
                View All →
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
