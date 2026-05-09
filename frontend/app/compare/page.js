"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function ComparePage() {
  const searchParams = useSearchParams();

  const ids = searchParams.get("ids");

  const [colleges, setColleges] = useState([]);

  useEffect(() => {
    fetch("https://campus-compare.onrender.com/colleges")
      .then((res) => res.json())
      .then((data) => {
        const selected = data.filter((college) =>
          ids?.split(",").includes(college.id.toString()),
        );

        setColleges(selected);
      });
  }, [ids]);

  if (colleges.length === 0) {
    return <div className="text-white p-10">Loading comparison...</div>;
  }

  return (
    <div className="p-8 text-white">
      <h1 className="text-4xl font-bold mb-8">Compare Colleges</h1>

      <div className="overflow-x-auto">
        <table className="w-full border border-white/20">
          <thead>
            <tr className="bg-white/10">
              <th className="p-4 border">Feature</th>

              {colleges.map((college) => (
                <th key={college.id} className="p-4 border">
                  {college.name}
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            <tr>
              <td className="p-4 border">Location</td>

              {colleges.map((college) => (
                <td key={college.id} className="p-4 border">
                  {college.location}
                </td>
              ))}
            </tr>

            <tr>
              <td className="p-4 border">Fees</td>

              {colleges.map((college) => (
                <td key={college.id} className="p-4 border">
                  ₹{college.fees}
                </td>
              ))}
            </tr>

            <tr>
              <td className="p-4 border">Ranking</td>

              {colleges.map((college) => (
                <td key={college.id} className="p-4 border">
                  {college.ranking}
                </td>
              ))}
            </tr>

            <tr>
              <td className="p-4 border">Placements</td>

              {colleges.map((college) => (
                <td key={college.id} className="p-4 border">
                  {college.placements}
                </td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
