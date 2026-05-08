"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import axios from "axios";
import Link from "next/link";

function CompareContent() {
  const searchParams = useSearchParams();
  const ids = searchParams.get("ids")?.split(",") || [];

  const [colleges, setColleges] = useState([]);

  useEffect(() => {
    axios
      .get("http://localhost:5000/colleges")
      .then((res) => {
        const filtered = res.data.filter((c) => ids.includes(c.id.toString()));
        setColleges(filtered);
      })
      .catch((err) => console.error(err));
  }, [ids]);

  if (colleges.length === 0) {
    return <p className="p-6">Loading...</p>;
  }

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <Link href="/">
        <p className="mb-6 text-blue-400 cursor-pointer">← Back</p>
      </Link>

      <h1 className="text-3xl font-bold mb-6">Compare Colleges</h1>

      <div className="backdrop-blur-lg bg-white/5 border border-white/10 p-6 rounded-2xl shadow-lg">
        <table className="w-full border border-white/10 rounded overflow-hidden">
          <thead>
            <tr className="bg-white/10">
              <th className="p-3 border">Feature</th>
              {colleges.map((c) => (
                <th key={c.id} className="p-3 border">
                  {c.name}
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            <tr>
              <td className="p-3 border">Location</td>
              {colleges.map((c) => (
                <td key={c.id} className="p-3 border">
                  {c.location}
                </td>
              ))}
            </tr>

            <tr>
              <td className="p-3 border">Fees</td>
              {colleges.map((c) => (
                <td key={c.id} className="p-3 border">
                  ₹{c.fees}
                </td>
              ))}
            </tr>

            <tr>
              <td className="p-3 border">Rating</td>
              {colleges.map((c) => (
                <td key={c.id} className="p-3 border">
                  ⭐ {c.rating}
                </td>
              ))}
            </tr>

            <tr>
              <td className="p-3 border">Placement</td>
              {colleges.map((c) => (
                <td key={c.id} className="p-3 border">
                  {c.placement_percentage}%
                </td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default function ComparePage() {
  return (
    <Suspense fallback={<p className="p-6">Loading...</p>}>
      <CompareContent />
    </Suspense>
  );
}
