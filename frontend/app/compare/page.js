"use client";

import { Suspense } from "react";

function CompareContent() {
  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold">Compare Colleges</h1>

      <p className="mt-4">Compare page working successfully.</p>
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
