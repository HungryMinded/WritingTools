"use client";

import { useState } from "react";
import TitleCapitalizer from "./components/TitleCapitalizer";
import TitleShortener from "./components/TitleShortener";

// Tools available in the application
const TOOLS = {
  TITLE_CAPITALIZER: "Title Capitalizer",
  TITLE_SHORTENER: "Title Shortener",
  // Add more tools here in the future
};

export default function Home() {
  const [selectedTool, setSelectedTool] = useState(TOOLS.TITLE_CAPITALIZER);

  return (
    <div className="min-h-screen p-8 max-w-4xl mx-auto">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-center mb-2">WritingTools</h1>
        <p className="text-gray-600 dark:text-gray-400 text-center">A collection of tools to help with writing tasks</p>
      </header>

      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Select a tool:</h2>
        <div className="flex flex-wrap gap-4">
          {Object.values(TOOLS).map((tool) => (
            <button
              key={tool}
              onClick={() => setSelectedTool(tool)}
              className={`px-4 py-2 rounded-lg ${
                selectedTool === tool
                  ? "bg-blue-500 text-white"
                  : "bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600"
              }`}
            >
              {tool}
            </button>
          ))}
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
        {selectedTool === TOOLS.TITLE_CAPITALIZER && <TitleCapitalizer />}
        {selectedTool === TOOLS.TITLE_SHORTENER && <TitleShortener />}
        {/* Add more tool components here as they are developed */}
      </div>
    </div>
  );
}
