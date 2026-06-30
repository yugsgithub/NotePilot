import { useEffect, useState } from "react";
import {
  FileText,
  MessageSquare,
  Database,
  BookOpen,
  Trophy,
  Lock
} from "lucide-react";

import API from "../services/api";
import { getAchievements } from "../utils/achievements";

function DashboardStats() {

  const [stats, setStats] = useState({
    uploads: 0,
    questions: 0,
    chunks: 0,
    current_file: "None",
  });

  useEffect(() => {
    loadAnalytics();
  }, []);

  const achievements = getAchievements();

  const loadAnalytics = async () => {
    try {
      const response = await API.get("/analytics");
      setStats(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  const cards = [
    {
      title: "PDF Uploads",
      value: stats.uploads,
      icon: <FileText size={22} />,
    },
    {
      title: "Questions Asked",
      value: stats.questions,
      icon: <MessageSquare size={22} />,
    },
    {
      title: "Knowledge Chunks",
      value: stats.chunks,
      icon: <Database size={22} />,
    },
    {
      title: "Current Document",
      value: stats.current_file || "None",
      icon: <BookOpen size={22} />,
    },
  ];

  return (
    <>

      {/* Statistics */}

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5 mb-8">

        {cards.map((card, index) => (

          <div
            key={index}
            className="
              bg-[#111827]
              border
              border-slate-800
              rounded-2xl
              p-6
              hover:border-slate-700
              transition-all
              duration-300
            "
          >

            <div className="flex justify-between items-center mb-5">

              <div className="
                w-11
                h-11
                rounded-xl
                bg-slate-800
                flex
                items-center
                justify-center
                text-blue-400
              ">
                {card.icon}
              </div>

            </div>

            <p className="text-sm text-slate-400">
              {card.title}
            </p>

            <h2 className="
              text-3xl
              font-bold
              mt-2
              break-words
            ">
              {card.value}
            </h2>

          </div>

        ))}

      </div>

      {/* Achievements */}

      <div
        className="
          bg-[#111827]
          border
          border-slate-800
          rounded-2xl
          p-7
        "
      >

        <div className="flex items-center gap-3 mb-6">

          <Trophy className="text-yellow-400" />

          <h2 className="text-2xl font-bold">
            Achievements
          </h2>

        </div>

        {achievements.length === 0 ? (

          <div className="grid md:grid-cols-3 gap-5">

            {/* Card */}

            <div className="
              rounded-xl
              border
              border-slate-800
              bg-slate-900/50
              p-5
            ">

              <div className="flex justify-between">

                <Lock
                  size={18}
                  className="text-slate-500"
                />

                <span className="text-xs text-slate-500">
                  Locked
                </span>

              </div>

              <h3 className="mt-4 font-semibold">
                First Upload
              </h3>

              <p className="text-sm text-slate-400 mt-2">
                Upload your first PDF.
              </p>

              <div className="
                mt-5
                h-2
                rounded-full
                bg-slate-800
              ">
                <div className="w-0 h-full rounded-full bg-blue-500"></div>
              </div>

            </div>

            {/* Card */}

            <div className="
              rounded-xl
              border
              border-slate-800
              bg-slate-900/50
              p-5
            ">

              <div className="flex justify-between">

                <Lock
                  size={18}
                  className="text-slate-500"
                />

                <span className="text-xs text-slate-500">
                  Locked
                </span>

              </div>

              <h3 className="mt-4 font-semibold">
                Curious Learner
              </h3>

              <p className="text-sm text-slate-400 mt-2">
                Ask 10 AI questions.
              </p>

              <div className="
                mt-5
                h-2
                rounded-full
                bg-slate-800
              ">
                <div className="w-0 h-full rounded-full bg-blue-500"></div>
              </div>

            </div>

            {/* Card */}

            <div className="
              rounded-xl
              border
              border-slate-800
              bg-slate-900/50
              p-5
            ">

              <div className="flex justify-between">

                <Lock
                  size={18}
                  className="text-slate-500"
                />

                <span className="text-xs text-slate-500">
                  Locked
                </span>

              </div>

              <h3 className="mt-4 font-semibold">
                Quiz Master
              </h3>

              <p className="text-sm text-slate-400 mt-2">
                Complete 10 quizzes.
              </p>

              <div className="
                mt-5
                h-2
                rounded-full
                bg-slate-800
              ">
                <div className="w-0 h-full rounded-full bg-blue-500"></div>
              </div>

            </div>

          </div>

        ) : (

          <div className="grid gap-4">

            {achievements.map((achievement, index) => (

              <div
                key={index}
                className="
                  rounded-xl
                  border
                  border-emerald-700/40
                  bg-emerald-500/10
                  p-5
                  flex
                  items-center
                  gap-3
                "
              >

                <span className="text-2xl">
                  🏆
                </span>

                <span className="font-medium">
                  {achievement}
                </span>

              </div>

            ))}

          </div>

        )}

      </div>

    </>
  );
}

export default DashboardStats;