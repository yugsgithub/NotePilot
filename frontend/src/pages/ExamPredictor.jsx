import { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import API from "../services/api";
import ReactMarkdown from "react-markdown";
import { checkDocuments } from "../utils/checkDocuments";
import { useDocuments } from "../context/DocumentsContext";


function ExamPredictor() {

const [loading, setLoading] =
useState(false);

const [questions, setQuestions] =
useState("");
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

  const savedQuestions =
    localStorage.getItem("examPredictions");

  if (savedQuestions) {

    setQuestions(savedQuestions);

  }

}, []);

const generatePrediction =
async () => {


  setLoading(true);

  try {

    const response =
      await API.get(
        "/exam-predictor"
      );

    setQuestions(
      response.data.questions
    );

    localStorage.setItem(
      "examPredictions",
      response.data.questions
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
            🎯 Exam Predictor
          </h1>


          <p className="text-slate-500 mt-2">
            Upload your study notes to predict
            important exam questions.
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
            🎯 Exam Predictor
          </h1>

          <p className="text-slate-400 mt-2">
            AI predicts the most likely questions
            from your uploaded notes.
          </p>

        </div>

        {/* Welcome Card */}

{!questions && !loading && (

  <div className="flex-1 flex items-center justify-center p-10">

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
        🎯
      </div>

      <h1 className="text-4xl font-bold mb-4">
        Ready to Predict Exam Questions
      </h1>

      <p className="text-slate-400 mb-8">
        Your notes have been uploaded successfully.
        Click below to let AI analyze your uploaded
        document and predict the most likely exam
        questions.
      </p>

      <button
        onClick={generatePrediction}
        disabled={loading}
        className="
          px-6
          py-3
          rounded-xl
          bg-blue-600
          hover:bg-blue-700
          font-medium
          transition
          cursor-pointer
          disabled:opacity-50
        "
      >
        Predict Questions
      </button>

    </div>

  </div>

)}

{/* Controls After Prediction */}

{questions && (

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

      <button
        onClick={generatePrediction}
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
        Generate New Prediction
      </button>

      <button
        onClick={() => {

          localStorage.removeItem("examPredictions");

          setQuestions("");

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

)}
        {/* Loader */}

        {loading && (

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
              AI is analyzing your notes and
              predicting likely exam questions...
            </p>

          </div>

        )}

        {/* Prediction */}

        {questions && (

          <div
            className="
              bg-[#111827]
              border
              border-slate-800
              rounded-3xl
              shadow-xl
              p-10
              leading-8
              prose
              prose-invert
              max-w-none
            "
          >

            <ReactMarkdown>
              {questions}
            </ReactMarkdown>

          </div>

        )}

      </div>

    </main>

  </div>
);

}

export default ExamPredictor;
