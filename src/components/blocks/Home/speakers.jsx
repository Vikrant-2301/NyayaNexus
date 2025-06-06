"use client";
import React from "react";

const speakers = [
  {
    name: "Dr. Arvind Sharma",
    image: "https://via.placeholder.com/150", // Dummy avatar
    title: "Renowned Architect",
  },
  {
    name: "Prof. Meera Joshi",
    image: "https://via.placeholder.com/150", // Dummy avatar
    title: "Urban Planner",
  },
  {
    name: "Mr. Rajesh Gupta",
    image: "https://via.placeholder.com/150", // Dummy avatar
    title: "Sustainable Designer",
  },
  {
    name: "Ms. Ananya Verma",
    image: "https://via.placeholder.com/150", // Dummy avatar
    title: "Interior Expert",
  },
  {
    name: "Dr. Pankaj Rao",
    image: "https://via.placeholder.com/150", // Dummy avatar
    title: "Construction Technologist",
  },
  {
    name: "Mr. Aman Khanna",
    image: "https://via.placeholder.com/150", // Dummy avatar
    title: "BIM Specialist",
  },
];

function Speakers() {
  return (
    <div
      id="speakers"
      className="bg-gray-50 min-h-screen py-10 flex flex-col items-center justify-center"
    >
      {/* Header Section */}
      <div className="py-10 bg-gradient-to-r from-gray-900 via-gray-800 to-gray-700 w-full text-center text-white">
        <h1 className="text-3xl md:text-4xl font-semibold tracking-wide">
          Featured Speakers
        </h1>
      </div>

      {/* Speaker Grid */}
      <div className="max-w-6xl w-full px-4 sm:px-6 lg:px-8 py-6 flex-grow flex items-center justify-center">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-3 gap-6 md:gap-8">
          {speakers.map((speaker, index) => (
            <div
              key={index}
              className="flex flex-col items-center bg-white shadow-md rounded-xl p-4 sm:p-6 hover:shadow-lg transition-all duration-300"
            >
              <img
                src={speaker.image}
                alt={speaker.name}
                className="w-24 h-24 sm:w-28 sm:h-28 rounded-full object-cover shadow-md"
              />
              <h2 className="text-lg font-medium text-gray-800 mt-3">
                {speaker.name}
              </h2>
              <p className="text-sm text-gray-600">{speaker.title}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Subtle Bottom Text */}
      <div className="pb-4 text-center">
        <h2 className="text-sm sm:text-base font-normal text-gray-600 tracking-wide">
          Meet the experts shaping the future of architecture
        </h2>
      </div>
    </div>
  );
}

export default Speakers;
