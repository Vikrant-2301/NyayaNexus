"use client";
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { motion } from "framer-motion";

const JaipurItinerary = () => {
  const itinerary = [
    {
      day: "Jaipur Sightseeing - Day 1",
      time: "9:00 AM",
      places: [
        "Birla Temple",
        "Albert Hall Museum",
        "Zoo",
        "Jantar Mantar",
        "City Palace",
        "Hawa Mahal",
        "Kanak Ghati",
        "Khajana Mahal",
        "Wax Museum",
        "Mauj Mahal",
        "Jal Mahal",
      ],
    },
    {
      day: "Jaipur Sightseeing - Day 2",
      time: "9:00 AM",
      places: [
        "Amer Fort",
        "Panna Meena Kund",
        "Moatha Lake",
        "Sheesh Mahal",
        "Elephant Village",
        "Jaigarh Fort",
        "Nahargarh Fort",
        "Royal Darbar",
        "Traditional Market",
        "Gator Ki Chhatriyan",
      ],
    },
  ];

  return (
    <div className="relative bg-white py-16 px-8 lg:px-24 overflow-hidden">
      <h1 className="relative text-5xl font-extrabold text-center text-gray-900 mb-12 uppercase tracking-wide">
        Jaipur Itinerary
      </h1>
      <div className="relative flex flex-col space-y-12">
        {itinerary.map((dayPlan, index) => (
          <div key={index} className="relative z-10">
            <motion.h2
              className="text-3xl font-semibold text-gray-800 mb-6"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.3 }}
            >
              {dayPlan.day} - {dayPlan.time}
            </motion.h2>
            <div className="relative flex flex-wrap items-center gap-6 overflow-x-auto px-2 py-4">
              {dayPlan.places.map((place, idx) => (
                <motion.div
                  key={idx}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="min-w-[250px]"
                >
                  <Card className="p-4 border-2 rounded-xl bg-white shadow-lg hover:shadow-xl">
                    <CardContent>
                      <p className="text-lg font-semibold text-gray-900 text-center">
                        {place}
                      </p>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default JaipurItinerary;
