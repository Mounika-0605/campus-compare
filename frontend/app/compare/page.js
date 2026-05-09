"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import axios from "axios";

function CompareContent() {
  const searchParams = useSearchParams();

  const ids = searchParams.get("ids");

  const [colleges, setColleges] = useState([]);

  useEffect(() => {
    axios.get("https://campus-compare.onrender.com/colleges").then((res) => {
      const selected = res.data.filter((college) =>
        ids?.split(",").includes(college.id.toString()),
      );

      setColleges(selected);
    });
  }, [ids]);

  return (
    <div className="p-6 text-white">
      <h1 className="text-4xl font-bold mb-8">Compare Colleges</h1>

      {colleges.length === 0 ? (
        <p>No colleges selected.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full border border-white/20 text-left">
            <thead className="bg-white/10">
              <tr>
                <th className="p-3 border border-white/20">Feature</th>

                {colleges.map((college) => (
                  <th key={college.id} className="p-3 border border-white/20">
                    {college.name}
                  </th>
                ))}
              </tr>
            </thead>

            <tbody>
              <tr>
                <td className="p-3 border border-white/20">Location</td>

                {colleges.map((college) => (
                  <td key={college.id} className="p-3 border border-white/20">
                    {college.location}
                  </td>
                ))}
              </tr>

              <tr>
                <td className="p-3 border border-white/20">Fees</td>

                {colleges.map((college) => (
                  <td key={college.id} className="p-3 border border-white/20">
                    ₹{college.fees}
                  </td>
                ))}
              </tr>

              <tr>
                <td className="p-3 border border-white/20">Placements</td>

                {colleges.map((college) => (
                  <td key={college.id} className="p-3 border border-white/20">
                    {college.placements}
                  </td>
                ))}
              </tr>

              <tr>
                <td className="p-3 border border-white/20">Ranking</td>

                {colleges.map((college) => (
                  <td key={college.id} className="p-3 border border-white/20">
                    {college.ranking}
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default function ComparePage() {
  return (
    <Suspense fallback={<p>Loading...</p>}>
      <CompareContent />
    </Suspense>
  );
}
