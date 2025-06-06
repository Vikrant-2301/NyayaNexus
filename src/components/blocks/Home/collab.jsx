"use client";
import Image from "next/image";

const images = Array.from(
  { length: 30 },
  (_, i) => `/assets/collab/${i + 1}.png`
);

const Collab = () => {
  return (
    <div id="collab" className="bg-gray-50 py-10">
      {/* Header Section */}
      <div className="relative py-10  bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-white">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            Collaborations
          </h1>
          <p className="text-xl max-w-3xl mx-auto">
            Explore our partnerships and collaborations that drive innovation
          </p>
        </div>
      </div>

      {/* Grid Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-6 gap-6">
          {images.map((src, index) => (
            <div
              key={index}
              className="overflow-hidden rounded-lg shadow-lg transition-transform transform hover:scale-105"
            >
              <Image
                src={src}
                alt={`Collaboration ${index + 1}`}
                width={300}
                height={300}
                className="object-cover w-full h-full"
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Collab;
