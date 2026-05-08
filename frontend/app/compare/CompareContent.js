"use client";

import { useSearchParams } from "next/navigation";

export default function CompareContent() {
  const searchParams = useSearchParams();

  const college1 = searchParams.get("college1");
  const college2 = searchParams.get("college2");

  return (
    <div>
      <h1>Compare Colleges</h1>
      <p>{college1}</p>
      <p>{college2}</p>
    </div>
  );
}
