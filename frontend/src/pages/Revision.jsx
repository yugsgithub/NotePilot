import { useEffect, useState } from "react";
import API from "../services/api";
import Sidebar from "../components/Sidebar";
import { useContext } from "react";
import { ThemeContext } from "../context/ThemeContext";
import { checkDocuments } from "../utils/checkDocuments";
import { useDocuments } from "../context/DocumentsContext";

function Revision() {
  const { theme } = useContext(ThemeContext);

  const [questions, setQuestions] = useState([]);

  const [loading, setLoading] = useState(false);
  const { hasDocuments, setHasDocuments } =
  useDocuments();


useEffect(() => {

  const verify = async () => {

    const exists =
      await checkDocuments();

    setHasDocuments(exists);

  };

  verify();

}, []);


useEffect(() => {

  const savedRevision =
    localStorage.getItem("revisionQuestions");

  if (savedRevision) {

    setQuestions(
      JSON.parse(savedRevision)
    );

  }

}, []);


  const loadRevision = async () => {

  const exists = await checkDocuments();

  setHasDocuments(exists);

  if (!exists) return;

  setLoading(true);

  try {

    const response = await API.get("/revision");

    console.log("REVISION:", response.data);

    setQuestions(response.data);

localStorage.setItem(
  "revisionQuestions",
  JSON.stringify(response.data)
);

  } catch (error) {

    console.error(error);

  } finally {

    setLoading(false);

  }

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
            📚 Revision Mode
          </h1>

          <p className="text-slate-500 mt-2">
            Upload your notes to generate
            AI-powered revision questions.
          </p>

        </div>

      </main>

    </div>
  );
}

if (!loading && questions.length === 0) {

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
            📚
          </div>

          <h1 className="text-4xl font-bold mb-4">
            Ready to Start Revision
          </h1>

          <p className="text-slate-400 mb-8">
            Your notes have been uploaded successfully.
            Click below to generate AI-powered revision
            questions from your uploaded document.
          </p>

          <button
            onClick={loadRevision}
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
            Start Revision
          </button>

        </div>

      </main>

    </div>

  );

}

if (loading) {

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
            Generating revision questions...
          </p>

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
            📚 Revision Mode
          </h1>

          <p className="text-slate-400 mt-2">
            Practice important revision questions generated from your notes.
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
              onClick={loadRevision}
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
              Generate New Revision Set
            </button>

            <button
              onClick={() => {

                localStorage.removeItem("revisionQuestions");
                setQuestions([]);

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

        {/* Questions */}

        <div className="space-y-6">

          {questions.map((q, index) => (

            <div
              key={index}
              className="
                bg-[#111827]
                border
                border-slate-800
                rounded-3xl
                shadow-xl
                p-8
              "
            >

              <p className="text-blue-400 text-sm mb-3">
                Question {index + 1}
              </p>

              <h2 className="text-2xl font-semibold mb-6">
                {q.question}
              </h2>

              <textarea
                placeholder="Write your answer here..."
                className="
                  w-full
                  h-40
                  bg-[#0B1120]
                  border
                  border-slate-700
                  rounded-2xl
                  p-5
                  resize-none
                  outline-none
                  focus:border-blue-500
                "
              />

            </div>

          ))}

        </div>

      </div>

    </main>

  </div>

);
}

export default Revision;