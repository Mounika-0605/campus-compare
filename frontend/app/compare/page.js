"use client";

import { Suspense } from "react";
import CompareContent from "./CompareContent";

export default function ComparePage() {
  return (
    <Suspense fallback={<p className="p-6">Loading...</p>}>
      <CompareContent />
    </Suspense>
  );
}
