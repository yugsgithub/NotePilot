import {
  MessageSquare,
  FileText,
  Brain,
  BookOpen,
  Search,
  Trophy,
  GraduationCap,
  BarChart3,
  FolderOpen,
} from "lucide-react";

import { Link, useLocation } from "react-router-dom";
import { useContext } from "react";
import { ThemeContext } from "../context/ThemeContext";

import mainy from "../assets/mainy.png";

function Sidebar() {
  const location = useLocation();

  const { theme } = useContext(ThemeContext);

  const activeClass =
    "flex items-center gap-3 px-4 py-3 rounded-lg bg-slate-800 text-white font-medium border border-blue-500 transition-all";

  const inactiveClass =
    "flex items-center gap-3 px-4 py-3 rounded-lg text-slate-400 hover:bg-slate-800 hover:text-white transition-all";

  return (
    <aside
      className={
        theme === "dark"
          ? "w-64 h-screen sticky top-0 bg-[#111827] border-r border-slate-800 flex flex-col"
          : "w-64 h-screen sticky top-0 bg-white border-r border-slate-200 flex flex-col"
      }
    >

      {/* Logo */}
      <div className="h-20 flex items-center font-bold px-6 border-b border-slate-800">
      <div className="flex items-center gap-2">
        <img
          src={mainy}
          alt="NotePilot Logo"
          className="w-12 h-12 object-contain"
        />
        <span className="text-xl">NotePilot</span>
      </div>
    </div>

      {/* Navigation */}

      <nav className="flex-1 overflow-y-auto px-3 py-6">

        {/* Workspace */}

        <p className="text-xs uppercase tracking-widest text-slate-500 px-4 mb-3">
          Workspace
        </p>

        <ul className="space-y-1">

          <Link to="/">
            <li
              className={
                location.pathname === "/"
                  ? activeClass
                  : inactiveClass
              }
            >
              <MessageSquare size={17} />
              AI Assistant
            </li>
          </Link>

          <Link to="/documents">
            <li
              className={
                location.pathname === "/documents"
                  ? activeClass
                  : inactiveClass
              }
            >
              <FolderOpen size={17} />
              Documents
            </li>
          </Link>

          <Link to="/search">
            <li
              className={
                location.pathname === "/search"
                  ? activeClass
                  : inactiveClass
              }
            >
              <Search size={17} />
              Search Notes
            </li>
          </Link>

        </ul>

        {/* Study */}

        <p className="text-xs uppercase tracking-widest text-slate-500 px-4 mt-8 mb-3">
          Study
        </p>

        <ul className="space-y-1">

          <Link to="/study-notes">
            <li
              className={
                location.pathname === "/study-notes"
                  ? activeClass
                  : inactiveClass
              }
            >
              <FileText size={17} />
              Study Notes
            </li>
          </Link>

          <Link to="/flashcards">
            <li
              className={
                location.pathname === "/flashcards"
                  ? activeClass
                  : inactiveClass
              }
            >
              <Brain size={17} />
              Flashcards
            </li>
          </Link>

          <Link to="/quiz">
            <li
              className={
                location.pathname === "/quiz"
                  ? activeClass
                  : inactiveClass
              }
            >
              <BookOpen size={17} />
              Quiz
            </li>
          </Link>

          <Link to="/revision">
            <li
              className={
                location.pathname === "/revision"
                  ? activeClass
                  : inactiveClass
              }
            >
              <FileText size={17} />
              Revision
            </li>
          </Link>

        </ul>

        {/* Practice */}

        <p className="text-xs uppercase tracking-widest text-slate-500 px-4 mt-8 mb-3">
          Practice
        </p>

        <ul className="space-y-1">

          <Link to="/viva">
            <li
              className={
                location.pathname === "/viva"
                  ? activeClass
                  : inactiveClass
              }
            >
              <GraduationCap size={17} />
              Viva Practice
            </li>
          </Link>

          <Link to="/exam-predictor">
            <li
              className={
                location.pathname === "/exam-predictor"
                  ? activeClass
                  : inactiveClass
              }
            >
              <BookOpen size={17} />
              Exam Predictor
            </li>
          </Link>

        </ul>

        {/* Insights */}

        <p className="text-xs uppercase tracking-widest text-slate-500 px-4 mt-8 mb-3">
          Insights
        </p>

        <ul className="space-y-1">

          <Link to="/analytics">
            <li
              className={
                location.pathname === "/analytics"
                  ? activeClass
                  : inactiveClass
              }
            >
              <BarChart3 size={17} />
              Analytics
            </li>
          </Link>

          <Link to="/achievements">
            <li
              className={
                location.pathname === "/achievements"
                  ? activeClass
                  : inactiveClass
              }
            >
              <Trophy size={17} />
              Achievements
            </li>
          </Link>

        </ul>

      </nav>

      {/* Footer */}

      <div className="border-t border-slate-800 px-6 py-5">

        <p className="text-xs uppercase tracking-widest text-slate-500">
          NotePilot
        </p>

        <p className="text-sm text-slate-400 mt-1">
          
        </p>

      </div>

    </aside>
  );
}

export default Sidebar;