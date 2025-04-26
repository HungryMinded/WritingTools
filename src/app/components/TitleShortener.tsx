"use client";

import { useState } from "react";

export default function TitleShortener() {
  const [title, setTitle] = useState("");
  const [subtitle, setSubtitle] = useState("");
  const [shortTitle, setShortTitle] = useState("");
  const [shortSubtitle, setShortSubtitle] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleShorten = async () => {
    setLoading(true);
    setError("");
    setShortTitle("");
    setShortSubtitle("");
    try {
      const res = await fetch("/api/title-shortener", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, subtitle }),
      });
      if (!res.ok) throw new Error("Failed to shorten title.");
      const data = await res.json();
      setShortTitle(data.shortTitle);
      setShortSubtitle(data.shortSubtitle);
    } catch (e: any) {
      setError(e.message || "Unknown error");
    } finally {
      setLoading(false);
    }
  };

  const handleClear = () => {
    setTitle("");
    setSubtitle("");
    setShortTitle("");
    setShortSubtitle("");
    setError("");
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Title Shortener</h2>
      <p className="text-gray-600 dark:text-gray-400 mb-4">
        Shorten your article's title and subtitle for a thumbnail, keeping them click-worthy and clear.
      </p>
      <div className="space-y-6">
        <div>
          <label htmlFor="title-input" className="block mb-2 font-medium">
            Title:
          </label>
          <textarea
            id="title-input"
            value={title}
            onChange={e => setTitle(e.target.value)}
            placeholder="Enter your article title..."
            className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
            rows={2}
          />
        </div>
        <div>
          <label htmlFor="subtitle-input" className="block mb-2 font-medium">
            Subtitle:
          </label>
          <textarea
            id="subtitle-input"
            value={subtitle}
            onChange={e => setSubtitle(e.target.value)}
            placeholder="Enter your article subtitle..."
            className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
            rows={2}
          />
        </div>
        <div className="flex gap-4">
          <button
            onClick={handleShorten}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors duration-200"
            disabled={loading || !title}
          >
            {loading ? "Shortening..." : "Shorten"}
          </button>
          <button
            onClick={handleClear}
            className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors duration-200"
          >
            Clear
          </button>
        </div>
        {error && <div className="text-red-500">{error}</div>}
        {(shortTitle || shortSubtitle) && (
          <div className="mt-6">
            <div className="mb-4">
              <label className="block mb-2 font-medium">Shortened Title:</label>
              <textarea
                value={shortTitle}
                readOnly
                className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                rows={2}
              />
            </div>
            <div>
              <label className="block mb-2 font-medium">Shortened Subtitle:</label>
              <textarea
                value={shortSubtitle}
                readOnly
                className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                rows={2}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 