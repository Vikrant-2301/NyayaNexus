import Image from "next/image";
import React from "react";

const packages = [
  {
    title: "Jaipur Heritage Tour",
    location: "Jaipur, Rajasthan",
    days: "3 Days / 2 Nights",
    image: "/assets/anc1.jpg",
  },
  {
    title: "Golden Triangle Tour",
    location: "Delhi - Agra - Jaipur",
    days: "5 Days / 4 Nights",
    image: "/assets/anc3.jpg",
  },
  {
    title: "Rajasthan Desert Safari",
    location: "Jaisalmer, Rajasthan",
    days: "4 Days / 3 Nights",
    image: "/assets/anc4.jpg",
  },
  {
    title: "Udaipur Lake Retreat",
    location: "Udaipur, Rajasthan",
    days: "3 Days / 2 Nights",
    image: "/assets/anc4.jpg",
  },
];

function Packages() {
  return (
    <div className="bg-white py-12 px-6 lg:px-20">
      <h1 className="text-3xl font-bold text-center text-gray-900 mb-10">
        Our Packages
      </h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {packages.map((pkg, index) => (
          <div
            key={index}
            className={`rounded-xl shadow-lg hover:shadow-xl transition-all overflow-hidden bg-gray-100 ${
              index % 3 === 0 ? "md:col-span-2" : ""
            }`}
          >
            <Image
              src={pkg.image}
              alt={pkg.title}
              width={500}
              height={300}
              className="w-full h-64 object-cover"
            />
            <div className="p-6">
              <h2 className="text-xl font-semibold text-gray-800">
                {pkg.title}
              </h2>
              <p className="text-gray-600 text-sm mt-1">{pkg.location}</p>
              <p className="text-gray-700 font-medium mt-2">{pkg.days}</p>
              <button className="mt-4 px-4 py-2 bg-pink-500 text-white font-medium rounded-lg hover:bg-pink-600 transition-all">
                Book Now
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Packages;
