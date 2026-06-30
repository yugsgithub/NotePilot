import { Search, Upload, Moon, Sun } from "lucide-react";
import { useContext } from "react";
import { ThemeContext } from "../context/ThemeContext";
import mainy from "../assets/mainy.png";

function Navbar() {
  const { theme, toggleTheme } = useContext(ThemeContext);

  return (
    <nav
      className="
        sticky
        top-0
        z-50
        bg-[#0f172a]/90
        backdrop-blur-xl
        border-b
        border-slate-800
      "
    >
      <div
        className="
          flex
          items-center
          justify-between
          px-8
          h-16
        "
      >
        {/* Logo */}

        <div className="flex items-center gap-3">
          <img
            src={mainy}
            alt="NotePilot"
            className="h-9"
          />

          <span className="text-slate-400 text-sm">
            AI Study Workspace
          </span>
        </div>

        {/* Search */}

        <div className="hidden lg:flex flex-1 max-w-xl mx-10">
          <div
            className="
              flex
              items-center
              gap-3
              w-full
              bg-slate-900
              border
              border-slate-800
              rounded-xl
              px-4
              py-2
            "
          >
            <Search
              size={18}
              className="text-slate-500"
            />

            <input
              type="text"
              placeholder="Search anything..."
              className="
                bg-transparent
                flex-1
                outline-none
                text-sm
                text-white
                placeholder:text-slate-500
              "
            />
          </div>
        </div>

        {/* Right Side */}

        <div className="flex items-center gap-3">
          <button
            className="
              flex
              items-center
              gap-2
              px-4
              py-2
              rounded-xl
              bg-blue-600
              hover:bg-blue-700
              transition
            "
          >
            <Upload size={16} />
            Upload
          </button>

          <button
            onClick={toggleTheme}
            className="
              w-11
              h-11
              rounded-xl
              bg-slate-900
              border
              border-slate-800
              flex
              items-center
              justify-center
              hover:border-blue-500
              transition
            "
          >
            {theme === "dark" ? (
              <Sun size={18} />
            ) : (
              <Moon size={18} />
            )}
          </button>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;