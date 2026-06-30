import { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import API from "../services/api";
import { useContext } from "react";

import { ThemeContext }
from "../context/ThemeContext";

function Analytics() {

  const { theme } = useContext(ThemeContext);

  const [stats, setStats] = useState({
    uploads: 0,
    questions: 0,
    chunks: 0
  });

  useEffect(() => {
    loadAnalytics();
  }, []);

  const loadAnalytics = async () => {

    try {

      const response =
        await API.get("/analytics");

      setStats(response.data);

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
            Analytics Dashboard
          </h1>

          <p className="text-slate-400 mt-2">
            Track your study activity and AI usage.
          </p>

        </div>

        {/* Stats */}

        <div className="grid md:grid-cols-3 gap-6 mb-10">

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
            <p className="text-slate-400 text-sm">
              PDFs Uploaded
            </p>

            <h2 className="text-5xl font-bold mt-4">
              {stats.uploads}
            </h2>

          </div>

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
            <p className="text-slate-400 text-sm">
              Questions Asked
            </p>

            <h2 className="text-5xl font-bold mt-4">
              {stats.questions}
            </h2>

          </div>

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
            <p className="text-slate-400 text-sm">
              Knowledge Chunks
            </p>

            <h2 className="text-5xl font-bold mt-4">
              {stats.chunks}
            </h2>

          </div>

        </div>

        {/* Progress */}

        <div
          className="
            bg-[#111827]
            border
            border-slate-800
            rounded-3xl
            shadow-xl
            p-10
          "
        >

          <h2 className="text-2xl font-bold mb-8">
            Study Progress
          </h2>

          {/* Upload */}

          <div className="mb-8">

            <div className="flex justify-between mb-3">

              <span className="text-slate-300">
                Upload Progress
              </span>

              <span className="text-blue-400 font-medium">
                {Math.min(stats.uploads * 10, 100)}%
              </span>

            </div>

            <div className="w-full h-3 bg-slate-800 rounded-full overflow-hidden">

              <div
                className="h-full bg-blue-500 rounded-full transition-all duration-500"
                style={{
                  width: `${Math.min(stats.uploads * 10, 100)}%`,
                }}
              />

            </div>

          </div>

          {/* Questions */}

          <div>

            <div className="flex justify-between mb-3">

              <span className="text-slate-300">
                Learning Activity
              </span>

              <span className="text-green-400 font-medium">
                {Math.min(stats.questions * 2, 100)}%
              </span>

            </div>

            <div className="w-full h-3 bg-slate-800 rounded-full overflow-hidden">

              <div
                className="h-full bg-green-500 rounded-full transition-all duration-500"
                style={{
                  width: `${Math.min(stats.questions * 2, 100)}%`,
                }}
              />

            </div>

          </div>

        </div>

      </div>
    </main>
  </div>
);
}

export default Analytics;