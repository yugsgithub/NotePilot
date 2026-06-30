import { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import API from "../services/api";
import { useContext } from "react";
import toast from "react-hot-toast";
import { ThemeContext }
from "../context/ThemeContext";
import { useDocuments } from "../context/DocumentsContext";

function Documents() {
  const { theme } = useContext(ThemeContext);

  const { documents, setDocuments } =
  useDocuments();
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    loadDocuments();
  }, []);

  const loadDocuments = async () => {

    try {

      const response =
        await API.get("/documents");

      setDocuments(response.data);

    } catch (error) {

      console.error(error);

    }

  };

const deleteDocument = async (name) => {

  const confirmDelete =
    window.confirm(`Delete ${name}?`);

  if (!confirmDelete) return;

  try {

    await API.delete(`/documents/${name}`);

    localStorage.removeItem("studyNotes");
    localStorage.removeItem("quizData");
    localStorage.removeItem("flashcards");
    localStorage.removeItem("revisionQuestions");
    localStorage.removeItem("examPredictions");
    localStorage.removeItem("oralQuestion");
    localStorage.removeItem("oralCorrectAnswer");
    localStorage.removeItem("oralFeedback");

    setDocuments([]);

    setHasDocuments(true);

    toast.success("Document deleted");

  } catch (error) {

    console.error(error);

    toast.error("Failed to delete document");

  }

};

  const openDocument = async (path) => {

    try {

      await API.post(
        "/documents/load",
        {
          path
        }
      );

      alert(
        "Document Loaded Successfully"
      );

    } catch (error) {

      console.error(error);

    }

  };

  const filteredDocuments = documents.filter((doc) =>
  doc.name.toLowerCase().includes(
    searchTerm.toLowerCase()
  )
);

  return (
  <div className="flex min-h-screen bg-[#0B1120] text-white">
    <Sidebar />

    <main className="flex-1 overflow-y-auto">
      <div className="max-w-6xl mx-auto px-10 py-10">

        {/* Header */}

        <div className="mb-10">

          <h1 className="text-4xl font-bold">
            My Documents
          </h1>

          <p className="text-slate-400 mt-2">
            View, search and manage your uploaded notes.
          </p>

        </div>

        {/* Search */}

        <input
          type="text"
          placeholder="Search documents..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="
            w-full
            mb-8
            bg-[#111827]
            border
            border-slate-700
            rounded-2xl
            px-5
            py-4
            outline-none
            focus:border-blue-500
          "
        />

        {/* Empty */}

        {filteredDocuments.length === 0 ? (

          <div
            className="
              bg-[#111827]
              border
              border-slate-800
              rounded-3xl
              shadow-xl
              p-12
              text-center
            "
          >

            <p className="text-slate-400 text-lg">
              {documents.length === 0
                ? "No documents uploaded yet."
                : "No matching documents found."}
            </p>

          </div>

        ) : (

          <div className="space-y-5">

            {filteredDocuments.map((doc) => (

              <div
                key={doc.name}
                className="
                  bg-[#111827]
                  border
                  border-slate-800
                  rounded-3xl
                  shadow-xl
                  p-6
                  flex
                  justify-between
                  items-center
                "
              >

                <div>

                  <h2 className="text-xl font-semibold">
                    📄 {doc.name}
                  </h2>

                  <p className="text-slate-400 mt-2">
                    {doc.chunks} indexed chunks
                  </p>

                </div>

                <div className="flex gap-4">

                  <button
                    onClick={() => {
                      openDocument(doc.path);
                      toast.success("Document loaded");
                    }}
                    className="
                      px-5
                      py-3
                      rounded-xl
                      bg-blue-600
                      hover:bg-blue-700
                      transition
                      cursor-pointer
                    "
                  >
                    Open
                  </button>

                  <button
                    onClick={() => deleteDocument(doc.name)}
                    className="
                      px-5
                      py-3
                      rounded-xl
                      bg-red-600
                      hover:bg-red-700
                      transition
                      cursor-pointer
                    "
                  >
                    Delete
                  </button>

                </div>

              </div>

            ))}

          </div>

        )}

      </div>
    </main>
  </div>
);

}

export default Documents;