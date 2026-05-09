"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

export default function CollegeDetails() {
  const params = useParams();

  const [college, setCollege] = useState(null);

  useEffect(() => {
    fetch(`https://campus-compare.onrender.com/colleges/${params.id}`)
      .then((res) => res.json())
      .then((data) => setCollege(data))
      .catch((err) => console.log(err));
  }, [params.id]);

  if (!college) {
    return <div className="text-white p-10">Loading...</div>;
  }

  return (
    <div className="p-8 text-white max-w-5xl mx-auto">
      <img
        src={college.image}
        alt={college.name}
        className="w-full h-[400px] object-cover rounded-2xl"
      />

      <h1 className="text-5xl font-bold mt-6">{college.name}</h1>

      <div className="mt-6 space-y-3 text-xl">
        <p>📍 {college.location}</p>
        <p>💰 ₹{college.fees}</p>
        <p>🏆 {college.ranking}</p>
        <p>📈 {college.placements}</p>
      </div>

      <p className="mt-8 text-lg text-gray-300">{college.description}</p>
    </div>
  );
}
