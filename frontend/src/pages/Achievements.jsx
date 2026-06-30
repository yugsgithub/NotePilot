import { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import API from "../services/api";
import { useContext } from "react";

import { ThemeContext }
from "../context/ThemeContext";

function Achievements() {

    const { theme } = useContext(ThemeContext);

  const [stats, setStats] = useState({});

  useEffect(() => {
    loadAchievements();
  }, []);

  const loadAchievements = async () => {

    const response =
      await API.get("/achievements");

    setStats(response.data);

  };

  return (
    <div
  className={
    theme === "dark"
      ? "flex min-h-screen bg-gradient-to-br from-slate-950 via-blue-950  to-slate-950 text-white"
      : "flex min-h-screen bg-white text-black"
  }
>

      <Sidebar />

      <main className="flex-1 p-8">

        <h1 className="text-5xl font-bold mb-8">
          Achievements
        </h1>

        <div className="grid md:grid-cols-2 gap-6">

          {stats.uploads >= 1 && (
            <div className="bg-slate-900 p-6 rounded-xl">
              🥇 First PDF Uploaded
            </div>
          )}

          {stats.uploads >= 5 && (
            <div className="bg-slate-900 p-6 rounded-xl">
              📚 Study Master
            </div>
          )}

          {stats.questions >= 10 && (
            <div className="bg-slate-900 p-6 rounded-xl">
              🤖 AI Explorer
            </div>
          )}

          {stats.questions >= 50 && (
            <div className="bg-slate-900 p-6 rounded-xl">
              🏆 Power Learner
            </div>
          )}

        </div>

      </main>

    </div>
  );
}

export default Achievements;