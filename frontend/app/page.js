"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import axios from "axios";

export default function Home() {
  const [colleges, setColleges] = useState([]);
  const [search, setSearch] = useState("");
  const [location, setLocation] = useState("");
  const [maxFees, setMaxFees] = useState("");
  const [selected, setSelected] = useState([]);
  const [sort, setSort] = useState("");
  const [loading, setLoading] = useState(true);
  const [showCompare, setShowCompare] = useState(false);

  useEffect(() => {
    axios
      .get("https://campus-compare.onrender.com/colleges")
      .then((res) => {
        setColleges(res.data);
        setLoading(false);
      })
      .catch((err) => console.error(err));
  }, []);

  const toggleSelect = (college) => {
    setShowCompare(false);

    if (selected.find((c) => c.id === college.id)) {
      setSelected(selected.filter((c) => c.id !== college.id));
    } else if (selected.length < 3) {
      setSelected([...selected, college]);
    }
  };

  const filteredColleges = colleges.filter((college) => {
    return (
      college.name.toLowerCase().includes(search.toLowerCase()) &&
      (location === "" || college.location === location) &&
      (maxFees === "" || college.fees <= parseInt(maxFees))
    );
  });

  let sortedColleges = [...filteredColleges];

  if (sort === "fees_low") sortedColleges.sort((a, b) => a.fees - b.fees);
  if (sort === "fees_high") sortedColleges.sort((a, b) => b.fees - a.fees);
  if (sort === "rating") sortedColleges.sort((a, b) => b.rating - a.rating);

  const uniqueLocations = [...new Set(colleges.map((c) => c.location))];

  // 🔥 LOADING SKELETON
  if (loading) {
    return (
      <div className="p-6 max-w-6xl mx-auto animate-pulse space-y-4">
        <div className="h-8 bg-gray-700 rounded w-1/3"></div>
        <div className="h-24 bg-gray-800 rounded"></div>
        <div className="h-24 bg-gray-800 rounded"></div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-4xl font-bold mb-8 bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
        🎓 Discover Your Perfect College
      </h1>

      {/* Filters */}
      <div className="backdrop-blur-lg bg-white/5 border border-white/10 p-5 rounded-2xl mb-6 flex gap-4 flex-wrap shadow-lg">
        <input
          type="text"
          placeholder="Search college..."
          className="border border-white/20 bg-black/40 text-white p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <select
          className="border border-white/20 bg-black/40 text-white p-2 rounded"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
        >
          <option value="">All Locations</option>
          {uniqueLocations.map((loc) => (
            <option key={loc} value={loc}>
              {loc}
            </option>
          ))}
        </select>

        <input
          type="number"
          placeholder="Max Fees"
          className="border border-white/20 bg-black/40 text-white p-2 rounded"
          value={maxFees}
          onChange={(e) => setMaxFees(e.target.value)}
        />

        <select
          className="border border-white/20 bg-black/40 text-white p-2 rounded"
          value={sort}
          onChange={(e) => setSort(e.target.value)}
        >
          <option value="">Sort By</option>
          <option value="fees_low">Fees: Low → High</option>
          <option value="fees_high">Fees: High → Low</option>
          <option value="rating">Rating</option>
        </select>

        <button
          onClick={() => {
            setSearch("");
            setLocation("");
            setMaxFees("");
            setSort("");
          }}
          className="bg-gray-700 px-3 py-2 rounded text-sm hover:bg-gray-600"
        >
          Clear
        </button>
      </div>

      {/* 🔥 RESULT COUNT */}
      <p className="text-gray-400 mb-4">
        Showing {sortedColleges.length} colleges
      </p>

      {/* Compare Button */}
      <button
        onClick={() => {
          const ids = selected.map((c) => c.id).join(",");
          window.location.href = `/compare?ids=${ids}`;
        }}
        title={selected.length < 2 ? "Select at least 2 colleges" : ""}
        className="bg-gradient-to-r from-blue-500 to-purple-600 hover:opacity-90 text-white px-5 py-2 rounded-lg mb-4 disabled:bg-gray-500 transition shadow-lg"
        disabled={selected.length < 2}
      >
        Compare
      </button>

      {/* Comparison Table */}
      {showCompare && selected.length >= 2 && (
        <div className="mt-6 backdrop-blur-lg bg-white/5 border border-white/10 p-5 rounded-2xl shadow-lg">
          <h2 className="text-xl font-bold mb-4">Comparison</h2>

          <table className="w-full border border-white/10 rounded overflow-hidden">
            <thead>
              <tr className="bg-white/10">
                <th className="p-2 border">Feature</th>
                {selected.map((c) => (
                  <th key={c.id} className="p-2 border">
                    {c.name}
                  </th>
                ))}
              </tr>
            </thead>

            <tbody>
              <tr>
                <td className="p-2 border">Location</td>
                {selected.map((c) => (
                  <td key={c.id} className="p-2 border">
                    {c.location}
                  </td>
                ))}
              </tr>
              <tr>
                <td className="p-2 border">Fees</td>
                {selected.map((c) => (
                  <td key={c.id} className="p-2 border">
                    ₹{c.fees}
                  </td>
                ))}
              </tr>
              <tr>
                <td className="p-2 border">Rating</td>
                {selected.map((c) => (
                  <td key={c.id} className="p-2 border">
                    {c.rating}
                  </td>
                ))}
              </tr>
              <tr>
                <td className="p-2 border">Placement</td>
                {selected.map((c) => (
                  <td key={c.id} className="p-2 border">
                    {c.placement_percentage}%
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
      )}

      {/* College Cards */}
      {sortedColleges.map((college) => (
        <Link key={college.id} href={`/college/${college.id}`}>
          <div
            className={`backdrop-blur-lg bg-white/5 border border-white/10 p-5 mb-5 rounded-2xl hover:bg-white/10 hover:-translate-y-1 hover:scale-[1.02] hover:shadow-blue-500/20 transition-all shadow-lg cursor-pointer
            ${
              selected.find((c) => c.id === college.id)
                ? "ring-2 ring-blue-500"
                : ""
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  onClick={(e) => e.stopPropagation()}
                  onChange={() => toggleSelect(college)}
                  checked={selected.find((c) => c.id === college.id) || false}
                />
                <h2 className="text-xl font-semibold tracking-wide">
                  {college.name}
                </h2>
              </div>

              <span className="bg-yellow-400 text-black px-2 py-1 rounded text-sm font-medium">
                ⭐ {college.rating}
              </span>
            </div>

            <div className="mt-3 text-gray-300">
              <p>📍 {college.location}</p>
              <p>💰 ₹{college.fees}</p>
            </div>

            <div className="mt-3">
              <span className="bg-green-600 px-2 py-1 rounded text-sm font-medium">
                {college.placement_percentage}% placed
              </span>
            </div>
          </div>
        </Link>
      ))}

      {/* 🔥 EMPTY STATE */}
      {sortedColleges.length === 0 && (
        <p className="text-gray-400 mt-10 text-center text-lg">
          🔍 No colleges match your filters
          <br />
          <span className="text-sm text-gray-500">
            Try adjusting filters or clearing search
          </span>
        </p>
      )}

      {/* 🔥 STICKY BAR */}
      {selected.length > 0 && (
        <div className="fixed bottom-4 left-1/2 -translate-x-1/2 bg-black/80 border border-white/10 px-6 py-3 rounded-xl shadow-lg backdrop-blur-lg">
          {selected.length} selected
        </div>
      )}
    </div>
  );
}
