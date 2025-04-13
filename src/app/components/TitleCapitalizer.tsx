"use client";

import { useState } from "react";

// List of words that should remain lowercase in a title (unless they're the first or last word)
const MINOR_WORDS = [
  "a", "an", "and", "as", "at", "but", "by", "for", "if", "in", 
  "nor", "of", "on", "or", "so", "the", "to", "up", "yet"
];

export default function TitleCapitalizer() {
  const [inputText, setInputText] = useState("");
  const [outputText, setOutputText] = useState("");

  // Convert input text to title case
  const convertToTitleCase = (text: string) => {
    if (!text) return "";
    
    const words = text.trim().split(/\s+/);
    if (words.length === 0) return "";
    
    return words
      .map((word, index) => {
        // Skip empty words
        if (!word) return "";
        
        // Always capitalize first and last word
        if (index === 0 || index === words.length - 1) {
          return capitalizeWord(word);
        }
        
        // Check if the word is a minor word
        const lowercaseWord = word.toLowerCase();
        if (MINOR_WORDS.includes(lowercaseWord)) {
          return lowercaseWord;
        }
        
        return capitalizeWord(word);
      })
      .join(" ");
  };

  // Capitalize the first letter of a word
  const capitalizeWord = (word: string) => {
    if (!word) return "";
    return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
  };

  // Handle input change
  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newInput = e.target.value;
    setInputText(newInput);
    setOutputText(convertToTitleCase(newInput));
  };

  // Copy output to clipboard
  const handleCopy = () => {
    navigator.clipboard.writeText(outputText);
  };

  // Clear input and output
  const handleClear = () => {
    setInputText("");
    setOutputText("");
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Title Capitalizer</h2>
      <p className="text-gray-600 dark:text-gray-400 mb-4">
        Easily convert your text to proper title case.
      </p>
      
      <div className="space-y-6">
        {/* Input area */}
        <div>
          <label htmlFor="input-text" className="block mb-2 font-medium">
            Enter your title:
          </label>
          <textarea
            id="input-text"
            value={inputText}
            onChange={handleInputChange}
            placeholder="Enter your title here..."
            className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg 
                      bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
            rows={3}
          />
        </div>
        
        {/* Output area */}
        <div>
          <label htmlFor="output-text" className="block mb-2 font-medium">
            Properly capitalized title:
          </label>
          <div className="relative">
            <textarea
              id="output-text"
              value={outputText}
              readOnly
              className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg 
                        bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100"
              rows={3}
            />
            {outputText && (
              <div className="absolute right-2 top-2 flex gap-2">
                <button
                  onClick={handleCopy}
                  className="p-2 bg-blue-500 text-white rounded hover:bg-blue-600 
                            transition-colors duration-200"
                  title="Copy to clipboard"
                >
                  Copy
                </button>
              </div>
            )}
          </div>
        </div>
        
        {/* Action buttons */}
        <div className="flex justify-end">
          <button
            id="clear-button"
            onClick={handleClear}
            className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-800 
                      dark:text-gray-200 rounded hover:bg-gray-300 dark:hover:bg-gray-600 
                      transition-colors duration-200"
          >
            Clear
          </button>
        </div>
      </div>
    </div>
  );
} 