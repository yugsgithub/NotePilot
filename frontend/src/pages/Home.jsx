import { useContext } from "react";

import { ThemeContext } from "../context/ThemeContext";

import Sidebar from "../components/Sidebar";
import UploadBox from "../components/UploadBox";
import ChatWindow from "../components/ChatWindow";
import CurrentDocument from "../components/CurrentDocument";
import DashboardStats from "../components/DashboardStats";

function Home() {
  const { theme } = useContext(ThemeContext);

  return (
    <div
      className={
        theme === "dark"
          ? "flex min-h-screen bg-[#0B0D12] text-white"
          : "flex min-h-screen bg-[#F8FAFC] text-black"
      }
    >
      <Sidebar />

      <main className="flex-1 overflow-y-auto">
        <div className="max-w-7xl mx-auto px-10 py-10">

          {/* Header */}

          <div className="mb-10">

            <span className="text-sm text-slate-500 uppercase tracking-widest">
              AI Study Workspace
            </span>

            <h1 className="text-4xl font-bold mt-2">
              Welcome to NotePilot
            </h1>

            <p
              className={
                theme === "dark"
                  ? "text-slate-400 mt-3 max-w-3xl"
                  : "text-slate-600 mt-3 max-w-3xl"
              }
            >
              Upload your notes, chat with AI, generate quizzes,
              flashcards and study material - All in one place.
            </p>

          </div>

          {/* Dashboard Stats */}

          <DashboardStats />

          {/* Upload + Current Document */}

          <div
            className="
              grid
              xl:grid-cols-2
              gap-6
              mt-8
              items-start
            "
          >
            <UploadBox />

            <CurrentDocument />
          </div>

          {/* Chat */}

          <div className="mt-8">
            <ChatWindow />
          </div>

        </div>
      </main>
    </div>
  );
}

export default Home;