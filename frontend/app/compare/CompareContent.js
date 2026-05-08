"use client";

import { useSearchParams } from "next/navigation";

export default function CompareContent() {
  const searchParams = useSearchParams();

  const college1 = searchParams.get("college1");
  const college2 = searchParams.get("college2");

  return (
    <div style={{ padding: "20px" }}>
      <h1>College Comparison</h1>

      <p>College 1: {college1}</p>
      <p>College 2: {college2}</p>
    </div>
  );
}
