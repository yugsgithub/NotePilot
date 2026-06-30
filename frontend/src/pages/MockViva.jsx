import { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import API from "../services/api";
import { checkDocuments } from "../utils/checkDocuments";
import { useDocuments } from "../context/DocumentsContext";

function MockViva() {

const [question, setQuestion] = useState("");
const [correctAnswer, setCorrectAnswer] = useState("");
const [answer, setAnswer] = useState("");
const [feedback, setFeedback] = useState("");

const { hasDocuments, setHasDocuments } =
useDocuments();

const [loadingQuestion, setLoadingQuestion] = useState(false);
const [evaluating, setEvaluating] = useState(false);

useEffect(() => {


const verify = async () => {

  const exists = await checkDocuments();

  setHasDocuments(exists);

};

verify();


}, []);

useEffect(() => {

  const savedQuestion =
    localStorage.getItem("oralQuestion");

  const savedAnswer =
    localStorage.getItem("oralCorrectAnswer");

  const savedFeedback =
    localStorage.getItem("oralFeedback");

  if (savedQuestion) {

    setQuestion(savedQuestion);

  }

  if (savedAnswer) {

    setCorrectAnswer(savedAnswer);

  }

  if (savedFeedback) {

    setFeedback(savedFeedback);

  }

}, []);

const generateQuestion = async () => {


setLoadingQuestion(true);

try {

  const response =
    await API.get("/oral-exam/question");

  setQuestion(
  response.data.question
);

setCorrectAnswer(
  response.data.answer
);

localStorage.setItem(
  "oralQuestion",
  response.data.question
);

localStorage.setItem(
  "oralCorrectAnswer",
  response.data.answer
);

localStorage.removeItem(
  "oralFeedback"
);

  setAnswer("");
  setFeedback("");

} catch (error) {

  console.error(error);

} finally {

  setLoadingQuestion(false);

}


};

const evaluateAnswer = async () => {


if (!answer.trim()) return;

setEvaluating(true);

try {

  const response =
    await API.post(
      "/oral-exam/evaluate",
      {
        answer,
        correct_answer:
          correctAnswer
      }
    );

  setFeedback(
  response.data.feedback
);

localStorage.setItem(
  "oralFeedback",
  response.data.feedback
);

} catch (error) {

  console.error(error);

} finally {

  setEvaluating(false);

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
            👨🏽‍🏫 Mock Viva
          </h1>

          <p className="text-slate-500 mt-2">
            Upload your study notes to begin
            AI-powered viva practice.
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
            Mock Viva
          </h1>

          <p className="text-slate-400 mt-2">
            Practice oral exams with AI-generated questions and instant feedback.
          </p>

        </div>

        {/* Start Button */}

        {!question && (

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
        👨🏽‍🏫
      </div>

      <h1 className="text-4xl font-bold mb-4">
        Ready to Start Mock Viva
      </h1>

      <p className="text-slate-400 mb-8">
        Your notes have been uploaded successfully.
        Click below to begin an AI-powered mock viva
        based on your uploaded document.
      </p>

      <button
        onClick={generateQuestion}
        disabled={loadingQuestion}
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
        {loadingQuestion
          ? "Generating Question..."
          : "Start Mock Viva"}
      </button>

    </div>

  </div>

)}

        {/* Question */}

        {question && (

          <>

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

              <p className="text-blue-400 text-sm mb-3">
                Viva Question
              </p>

              <h2 className="text-3xl font-semibold leading-relaxed">
                {question}
              </h2>

            </div>

            {/* Answer */}

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

              <textarea
                value={answer}
                onChange={(e) => setAnswer(e.target.value)}
                placeholder="Type your answer here..."
                className="
                  w-full
                  h-48
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

              <div className="flex flex-wrap gap-4 mt-6">

                <button
                  onClick={evaluateAnswer}
                  disabled={evaluating}
                  className="
                    bg-green-600
                    hover:bg-green-700
                    transition
                    px-6
                    py-3
                    rounded-xl
                    cursor-pointer
                    disabled:opacity-50
                  "
                >
                  {evaluating
                    ? "Evaluating..."
                    : "Evaluate"}
                </button>

                <button
                  onClick={generateQuestion}
                  disabled={loadingQuestion}
                  className="
                    bg-blue-600
                    hover:bg-blue-700
                    transition
                    px-6
                    py-3
                    rounded-xl
                    cursor-pointer
                    disabled:opacity-50
                  "
                >
                  {loadingQuestion
                    ? "Generating..."
                    : "Next Question"}
                </button>

                <button
                  onClick={() => {

                    localStorage.removeItem("oralQuestion");
                    localStorage.removeItem("oralCorrectAnswer");
                    localStorage.removeItem("oralFeedback");

                    setQuestion("");
                    setCorrectAnswer("");
                    setAnswer("");
                    setFeedback("");

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

          </>

        )}

        {/* Loader */}

        {(loadingQuestion || evaluating) && (

          <div
            className="
              bg-[#111827]
              border
              border-slate-800
              rounded-3xl
              shadow-xl
              p-16
              text-center
              mt-8
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

              {loadingQuestion
                ? "Preparing your next viva question..."
                : "Evaluating your answer..."}

            </p>

          </div>

        )}

        {/* Feedback */}

        {feedback && (

          <div
            className="
              bg-[#111827]
              border
              border-slate-800
              rounded-3xl
              shadow-xl
              p-8
              mt-8
            "
          >

            <h3 className="text-2xl font-bold text-green-400 mb-4">
              AI Feedback
            </h3>

            <p className="leading-8 text-slate-300">
              {feedback}
            </p>

          </div>

        )}

      </div>

    </main>

  </div>

);

}

export default MockViva;
