"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useRouter } from "next/navigation";

export default function CollegeDetail() {
  const { id } = useParams();
  const router = useRouter();

  const [college, setCollege] = useState(null);
  const [loading, setLoading] = useState(true);

  const [questions, setQuestions] = useState([]);
  const [newQuestion, setNewQuestion] = useState("");
  const [answerInputs, setAnswerInputs] = useState({});
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const collegeRes = await axios.get(
          "https://campus-compare.onrender.comcolleges",
        );
        const found = collegeRes.data.find((c) => c.id == id);
        setCollege(found);

        const qRes = await axios.get(
          "https://campus-compare.onrender.com/questions",
        );
        const filtered = qRes.data.filter((q) => q.college_id == id);
        setQuestions(filtered);

        setLoading(false);
      } catch (err) {
        console.error(err);
      }
    };

    fetchData();
  }, [id]);

  const refreshQuestions = async () => {
    const res = await axios.get(
      "https://campus-compare.onrender.com/questions",
    );
    const filtered = res.data.filter((q) => q.college_id == id);
    setQuestions(filtered);
  };

  const submitQuestion = async () => {
    if (!newQuestion.trim()) return;

    setSubmitting(true);

    await axios.post("https://campus-compare.onrender.com/questions", {
      college_id: id,
      question: newQuestion,
    });

    setNewQuestion("");
    await refreshQuestions();

    setSubmitting(false);
  };

  const submitAnswer = async (qid) => {
    const ans = answerInputs[qid];
    if (!ans || !ans.trim()) return;

    await axios.put(`https://campus-compare.onrender.com/questions/${qid}`, {
      answer: ans,
    });

    setAnswerInputs((prev) => ({ ...prev, [qid]: "" }));
    refreshQuestions();
  };

  if (loading) {
    return (
      <div className="p-8 max-w-3xl mx-auto animate-pulse space-y-4">
        <div className="h-8 bg-gray-700 rounded w-1/2"></div>
        <div className="h-5 bg-gray-700 rounded"></div>
        <div className="h-5 bg-gray-700 rounded w-3/4"></div>
        <div className="h-5 bg-gray-700 rounded w-2/3"></div>
      </div>
    );
  }

  return (
    <div className="p-8 max-w-3xl mx-auto">
      {/* Back */}
      <button
        onClick={() => router.back()}
        className="mb-6 text-sm text-blue-400 hover:underline"
      >
        ← Back
      </button>

      {/* Title */}
      <h1 className="text-4xl font-bold mb-6 bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
        {college.name}
      </h1>

      {/* Card */}
      <div className="backdrop-blur-lg bg-white/5 border border-white/10 rounded-2xl p-6 shadow-lg">
        <div className="space-y-3 text-gray-300">
          <p>
            <span className="font-semibold text-white">📍 Location:</span>{" "}
            {college.location}
          </p>

          <p>
            <span className="font-semibold text-white">💰 Fees:</span> ₹
            {college.fees}
          </p>

          <p>
            <span className="font-semibold text-white">⭐ Rating:</span>{" "}
            <span className="bg-yellow-400 text-black px-2 py-1 rounded text-sm">
              {college.rating}
            </span>
          </p>

          <p>
            <span className="font-semibold text-white">📊 Placement:</span>{" "}
            <span className="bg-green-600 px-2 py-1 rounded text-sm">
              {college.placement_percentage}%
            </span>
          </p>
        </div>

        {/* Courses */}
        <div className="mt-6">
          <h2 className="text-xl font-semibold mb-3">Courses Offered</h2>
          <ul className="list-disc pl-5 space-y-1 text-gray-300">
            {college.courses.map((course, index) => (
              <li key={index}>{course}</li>
            ))}
          </ul>
        </div>
      </div>

      {/* Q&A Section */}
      <div className="mt-10">
        <h2 className="text-2xl font-semibold mb-4">💬 Q&A Discussion</h2>

        {/* Ask Question */}
        <div className="flex gap-2 mb-6">
          <input
            type="text"
            placeholder="Ask something about this college..."
            className="flex-1 p-3 rounded-lg bg-black/40 border border-white/10"
            value={newQuestion}
            onChange={(e) => setNewQuestion(e.target.value)}
          />
          <button
            onClick={submitQuestion}
            disabled={submitting}
            className="px-5 py-2 rounded-lg bg-gradient-to-r from-blue-500 to-purple-600 disabled:opacity-50"
          >
            {submitting ? "Posting..." : "Ask"}
          </button>
        </div>

        {/* Questions */}
        {/* Empty state */}
        {questions.length === 0 && (
          <p className="text-gray-500 mb-4">
            No questions yet. Be the first to ask!
          </p>
        )}

        {/* Questions list */}
        {questions.map((q) => (
          <div
            key={q.id}
            className="mb-4 p-4 rounded-xl border border-white/10 bg-white/5"
          >
            <p className="font-semibold">Q: {q.question}</p>

            {q.answer ? (
              <p className="text-green-400 mt-2">A: {q.answer}</p>
            ) : (
              <div className="mt-3 flex gap-2">
                <input
                  type="text"
                  placeholder="Write an answer..."
                  className="flex-1 p-2 rounded bg-black/40 border border-white/10"
                  value={answerInputs[q.id] || ""}
                  onChange={(e) =>
                    setAnswerInputs({
                      ...answerInputs,
                      [q.id]: e.target.value,
                    })
                  }
                />
                <button
                  onClick={() => submitAnswer(q.id)}
                  className="px-3 py-1 bg-green-600 rounded"
                >
                  Answer
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
