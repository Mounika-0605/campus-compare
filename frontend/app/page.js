"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import axios from "axios";

export default function Home() {
  const [colleges, setColleges] = useState([]);
  const [search, setSearch] = useState("");
  const [location, setLocation] = useState("");
  const [selected, setSelected] = useState([]);
  const [sort, setSort] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get("https://campus-compare.onrender.com/colleges")
      .then((res) => {
        setColleges(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
        setLoading(false);
      });
  }, []);

  const toggleSelect = (college) => {
    if (selected.find((c) => c.id === college.id)) {
      setSelected(selected.filter((c) => c.id !== college.id));
    } else if (selected.length < 3) {
      setSelected([...selected, college]);
    }
  };

  const filteredColleges = colleges.filter((college) => {
    return (
      college.name.toLowerCase().includes(search.toLowerCase()) &&
      (location === "" || college.location === location)
    );
  });

  let sortedColleges = [...filteredColleges];

  if (sort === "fees_low") {
    sortedColleges.sort((a, b) => parseFloat(a.fees) - parseFloat(b.fees));
  }

  if (sort === "fees_high") {
    sortedColleges.sort((a, b) => parseFloat(b.fees) - parseFloat(a.fees));
  }

  if (sort === "placements") {
    sortedColleges.sort(
      (a, b) => parseInt(b.placements) - parseInt(a.placements),
    );
  }

  if (sort === "ranking") {
    sortedColleges.sort((a, b) => a.ranking.localeCompare(b.ranking));
  }

  const uniqueLocations = [...new Set(colleges.map((c) => c.location))];

  if (loading) {
    return <div className="p-10 text-white text-2xl">Loading colleges...</div>;
  }

  return (
    <div className="p-6 max-w-6xl mx-auto text-white">
      <h1 className="text-5xl font-bold mb-8 bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
        🎓 Discover Your Perfect College
      </h1>

      {/* FILTERS */}

      <div className="backdrop-blur-lg bg-white/5 border border-white/10 p-5 rounded-2xl mb-6 flex gap-4 flex-wrap shadow-lg">
        <input
          type="text"
          placeholder="Search college..."
          className="border border-white/20 bg-black/40 text-white p-2 rounded"
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

        <select
          className="border border-white/20 bg-black/40 text-white p-2 rounded"
          value={sort}
          onChange={(e) => setSort(e.target.value)}
        >
          <option value="">Sort By</option>

          <option value="fees_low">Fees: Low → High</option>

          <option value="fees_high">Fees: High → Low</option>

          <option value="placements">Placements</option>

          <option value="ranking">Ranking</option>
        </select>

        <button
          onClick={() => {
            setSearch("");
            setLocation("");
            setSort("");
          }}
          className="bg-gray-700 px-3 py-2 rounded"
        >
          Clear
        </button>
      </div>

      <p className="text-gray-400 mb-4">
        Showing {sortedColleges.length} colleges
      </p>

      {/* COMPARE BUTTON */}

      <button
        onClick={() => {
          const ids = selected.map((c) => c.id).join(",");

          window.location.href = `/compare?ids=${ids}`;
        }}
        disabled={selected.length < 2}
        className="bg-gradient-to-r from-blue-500 to-purple-600 px-5 py-2 rounded-lg mb-6 disabled:bg-gray-600"
      >
        Compare
      </button>

      {/* COLLEGE CARDS */}

      {sortedColleges.map((college) => (
        <Link key={college.id} href={`/college/${college.id}`}>
          <div
            className={`backdrop-blur-lg bg-white/5 border border-white/10 p-5 mb-5 rounded-2xl hover:bg-white/10 transition cursor-pointer ${
              selected.find((c) => c.id === college.id)
                ? "ring-2 ring-blue-500"
                : ""
            }`}
          >
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  onClick={(e) => e.stopPropagation()}
                  onChange={() => toggleSelect(college)}
                  checked={selected.find((c) => c.id === college.id) || false}
                />

                <h2 className="text-2xl font-bold">{college.name}</h2>
              </div>

              <span className="bg-yellow-400 text-black px-3 py-1 rounded">
                ⭐ 4.5
              </span>
            </div>

            <div className="mt-4 text-gray-300 space-y-1">
              <p>📍 {college.location}</p>

              <p>💰 ₹{college.fees}</p>

              <p>📈 {college.placements} placed</p>

              <p>🏆 {college.ranking}</p>
            </div>
          </div>
        </Link>
      ))}

      {/* EMPTY */}

      {sortedColleges.length === 0 && (
        <p className="text-center text-gray-400 mt-10">No colleges found</p>
      )}

      {/* STICKY BAR */}

      {selected.length > 0 && (
        <div className="fixed bottom-4 left-1/2 -translate-x-1/2 bg-black/80 px-6 py-3 rounded-xl shadow-lg">
          {selected.length} selected
        </div>
      )}
    </div>
  );
}
