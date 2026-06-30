import { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import API from "../services/api";
import { useContext } from "react";
import { checkDocuments } from "../utils/checkDocuments";
import { ThemeContext } from "../context/ThemeContext";
import { useDocuments } from "../context/DocumentsContext";

function StudyNotes() {
  const { theme } = useContext(ThemeContext);

const [notes, setNotes] = useState("");
const [loading, setLoading] = useState(false);
const { hasDocuments, setHasDocuments } =
useDocuments();



useEffect(() => {

  const verify = async () => {

    const exists = await checkDocuments();

    setHasDocuments(exists);

  };

  verify();

}, []);


useEffect(() => {

  const savedNotes =
    localStorage.getItem("studyNotes");

  if (savedNotes) {

    setNotes(savedNotes);

  }

}, []);



const loadNotes = async () => {

  setLoading(true);

  try {

    const response =
      await API.get("/summary");

    setNotes(
      response.data.summary
    );

    localStorage.setItem(
      "studyNotes",
      response.data.summary
    );

  } catch (error) {

    console.error(error);

    setNotes(
      "Failed to load study notes."
    );

  } finally {

    setLoading(false);

  }

};

const downloadPDF = () => {


window.open(
  "http://127.0.0.1:8000/export-notes",
  "_blank"
);


};

if (!hasDocuments) {
  return (
    <div className="flex min-h-screen bg-[#0B1120] text-white">

      <Sidebar />

      <main className="flex-1 flex items-center justify-center">

        <div
          className="
            bg-[#111827]
            border
            border-slate-800
            rounded-3xl
            shadow-xl
            p-12
            text-center
            max-w-xl
          "
        >

          <h1 className="text-4xl font-bold mb-4">
            📖 Study Notes
          </h1>

          <p className="text-slate-500 mt-2">
            Upload your notes to generate AI study notes.
          </p>

        </div>

      </main>

    </div>
  );
}

if (!loading && !notes) {
  return (
    <div className="flex min-h-screen bg-[#0B1120] text-white">

      <Sidebar />

      <main className="flex-1 flex items-center justify-center p-10">

        <div
          className="
            bg-[#111827]
            border
            border-slate-800
            rounded-3xl
            shadow-xl
            p-12
            text-center
            max-w-xl
            w-full
          "
        >

          <div className="w-24 h-24 mx-auto mb-6 rounded-3xl bg-blue-500/10 flex items-center justify-center text-5xl">
            📖
          </div>

          <h1 className="text-4xl font-bold mb-4">
            Ready to Generate Study Notes
          </h1>

          <p className="text-slate-400 mb-8">
            Your notes have been uploaded successfully.
            Click below to generate AI-powered study notes
            from your uploaded document.
          </p>

          <button
            onClick={loadNotes}
            className="
              px-6
              py-3
              rounded-xl
              bg-blue-600
              hover:bg-blue-700
              font-medium
              transition
              cursor-pointer
            "
          >
            Generate Study Notes
          </button>

        </div>

      </main>

    </div>
  );
}

return (

  <div className="flex min-h-screen bg-[#0B1120] text-white">

    <Sidebar />

    <main className="flex-1 overflow-y-auto">

      <div className="max-w-6xl mx-auto px-10 py-10">

        {/* Header */}

        <div className="mb-10">

          <h1 className="text-4xl font-bold">
            📖 Study Notes
          </h1>

          <p className="text-slate-400 mt-2">
            AI-generated study notes from your uploaded PDF.
          </p>

        </div>

        {/* Controls */}

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

          <div className="flex flex-wrap gap-4">

            <button
              onClick={downloadPDF}
              className="
                bg-green-600
                hover:bg-green-700
                transition
                px-6
                py-3
                rounded-xl
                cursor-pointer
              "
            >
              Download PDF
            </button>

            <button
              onClick={loadNotes}
              className="
                bg-blue-600
                hover:bg-blue-700
                transition
                px-6
                py-3
                rounded-xl
                cursor-pointer
              "
            >
              Generate New Notes
            </button>

            <button
              onClick={() => {

                localStorage.removeItem("studyNotes");
                setNotes("");

              }}
              className="
                bg-red-600
                hover:bg-red-700
                transition
                px-6
                py-3
                rounded-xl
                cursor-pointer
              "
            >
              Reset
            </button>

          </div>

        </div>

        {loading ? (

          <div
            className="
              bg-[#111827]
              border
              border-slate-800
              rounded-3xl
              shadow-xl
              p-16
              text-center
            "
          >

            <div
              className="
                animate-spin
                rounded-full
                h-12
                w-12
                border-b-2
                border-blue-500
                mx-auto
                mb-5
              "
            />

            <p className="text-slate-400">
              Generating study notes...
            </p>

          </div>

        ) : (

          <div
            className="
              bg-[#111827]
              border
              border-slate-800
              rounded-3xl
              shadow-xl
              p-10
              whitespace-pre-wrap
              leading-8
            "
          >
            {notes}
          </div>

        )}

      </div>

    </main>

  </div>

);
}

export default StudyNotes;
