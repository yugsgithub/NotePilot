import { useState } from "react";
import Sidebar from "../components/Sidebar";
import API from "../services/api";
import { useContext } from "react";
import { useDocuments } from "../context/DocumentsContext";

import { ThemeContext }
from "../context/ThemeContext";

function Search() {
    const { theme } = useContext(ThemeContext);

  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);

  const handleSearch = async () => {

    if (!query.trim()) return;

    try {

      const response = await API.post(
        "/search",
        {
          query
        }
      );

      setResults(response.data);

    } catch (error) {

      console.error(error);

    }

  };

  return (
  <div className="flex min-h-screen bg-[#0B1120] text-white">

    <Sidebar />

    <main className="flex-1 overflow-y-auto">

      <div className="max-w-6xl mx-auto px-10 py-10">

        {/* Header */}

        <div className="mb-10">

          <h1 className="text-4xl font-bold">
            🔍 Search Notes
          </h1>

          <p className="text-slate-400 mt-2">
            Instantly search through your uploaded notes.
          </p>

        </div>

        {/* Search Card */}

        <div
          className="
            bg-[#111827]
            border
            border-slate-800
            rounded-3xl
            shadow-xl
            p-8
            mb-8
          "
        >

          <div className="flex gap-4">

            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search anything..."
              className="
                flex-1
                bg-[#0B1120]
                border
                border-slate-700
                rounded-xl
                px-5
                py-4
                outline-none
                focus:border-blue-500
              "
            />

            <button
              onClick={handleSearch}
              className="
                cursor-pointer
                bg-blue-600
                hover:bg-blue-700
                transition
                px-8
                py-4
                rounded-xl
                font-medium
              "
            >
              Search
            </button>

          </div>

        </div>

        {/* Results */}

        <div
          className="
            bg-[#111827]
            border
            border-slate-800
            rounded-3xl
            shadow-xl
            p-8
          "
        >

          <h2 className="text-2xl font-bold mb-6">
            Search Results
          </h2>

          {results.length === 0 ? (

            <div className="text-center py-10">

              <p className="text-slate-400">
                No search results yet.
              </p>

              <p className="text-slate-500 mt-2">
                Enter a keyword to search your notes.
              </p>

            </div>

          ) : (

            <div className="space-y-5">

              {results.map((item, index) => (

                <div
                  key={index}
                  className="
                    bg-[#0B1120]
                    border
                    border-slate-700
                    rounded-2xl
                    p-5
                    hover:border-blue-500
                    transition-all
                  "
                >
                  {item}
                </div>

              ))}

            </div>

          )}

        </div>

      </div>

    </main>

  </div>
);
}

export default Search;