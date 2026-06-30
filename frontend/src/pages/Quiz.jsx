import { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import API from "../services/api";
import { useContext } from "react";
import { checkDocuments } from "../utils/checkDocuments";
import toast from "react-hot-toast";
import { useDocuments } from "../context/DocumentsContext";

import { ThemeContext }
from "../context/ThemeContext";
import { updateStudyStreak } from "../utils/streak";

function Quiz() {
  const { theme } = useContext(ThemeContext);
  const [quiz, setQuiz] = useState([]);
  const [loading, setLoading] = useState(false);
  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState({});
  const [score, setScore] = useState(null);
  const [timeLeft, setTimeLeft] = useState(300);
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

  if (quiz.length === 0) return;

  const timer = setInterval(() => {

    setTimeLeft((prev) => {

      if (prev <= 1) {

        clearInterval(timer);
        finishQuiz();
        return 0;

      }

      return prev - 1;

    });

  }, 1000);

  return () => clearInterval(timer);

}, [quiz]);

useEffect(() => {

  const savedQuiz =
    localStorage.getItem("quizData");

  const savedSelected =
    localStorage.getItem("quizSelected");

  const savedCurrent =
    localStorage.getItem("quizCurrent");

  const savedScore =
    localStorage.getItem("quizScore");

  if (savedQuiz) {

    setQuiz(JSON.parse(savedQuiz));

  }

  if (savedSelected) {

    setSelected(
      JSON.parse(savedSelected)
    );

  }

  if (savedCurrent) {

    setCurrent(
      Number(savedCurrent)
    );

  }

  if (savedScore) {

    setScore(
      JSON.parse(savedScore)
    );

  }

}, []);

useEffect(() => {

  localStorage.setItem(
    "quizSelected",
    JSON.stringify(selected)
  );

}, [selected]);

useEffect(() => {

  localStorage.setItem(
    "quizCurrent",
    current
  );

}, [current]);

  
  const loadQuiz = async () => {

  updateStudyStreak();

  setLoading(true);
    setTimeLeft(300);

    try {
      const response = await API.post("/generate-quiz");
      setQuiz(response.data);
      localStorage.setItem(
      "quizData",
      JSON.stringify(response.data)
    );
      toast.success("Quiz generated");
      setCurrent(0);
      setSelected({});
      setScore(null);
    } catch (error) {
      console.error(error);
      setQuiz([]);
    } finally {
      setLoading(false);
    }
  };

  const regenerateQuiz = async () => {

  setLoading(true);

  try {
    
    localStorage.removeItem("quizData");
    localStorage.removeItem("quizSelected");
    localStorage.removeItem("quizCurrent");
    localStorage.removeItem("quizScore");

    const response =
      await API.post("/generate-quiz");

    setQuiz(response.data);
      localStorage.setItem(
      "quizData",
      JSON.stringify(response.data)
    );

    localStorage.removeItem("quizSelected");
    localStorage.removeItem("quizCurrent");
    localStorage.removeItem("quizScore");
    toast.success("Quiz generated");

    setCurrent(0);

    setSelected({});

    setScore(null);

    setTimeLeft(300);

  } catch (error) {

    console.error(error);

  } finally {

    setLoading(false);

  }

};

  const finishQuiz = () => {

  let correct = 0;

  quiz.forEach((q, index) => {

    if (selected[index] === q.answer) {
      correct++;
    }

  });

  // Save score for dashboard

  localStorage.setItem(
    "lastQuizScore",
    correct
  );

  localStorage.setItem(
    "quizTotal",
    quiz.length
  );

  setScore({
    correct,
    answers: selected,
  });

  localStorage.setItem(
  "quizScore",
  JSON.stringify({
    correct,
    answers: selected,
  })
);

};

  const downloadQuiz = () => {

  const content = quiz
    .map(
      (q, index) =>
`Question ${index + 1}

${q.question}

A) ${q.options[0]}
B) ${q.options[1]}
C) ${q.options[2]}
D) ${q.options[3]}

Answer: ${q.answer}

------------------------`
    )
    .join("\n\n");

  const blob = new Blob(
    [content],
    {
      type: "text/plain"
    }
  );

  const url =
    URL.createObjectURL(blob);

  const link =
    document.createElement("a");

  link.href = url;

  link.download =
    `quiz-${Date.now()}.txt`;

  link.click();
  toast.success("Quiz downloaded");

  URL.revokeObjectURL(url);
};

// -------------------------------
// No PDF Uploaded
// -------------------------------

if (!hasDocuments) {
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

          <h1 className="text-4xl font-bold mb-4">
            ⏰ Quiz
          </h1>

          <p className="text-slate-400">
            Upload your study notes first to generate AI-powered quizzes.
          </p>

        </div>

      </main>

    </div>
  );
}

// -------------------------------
// PDF Uploaded but Quiz Not Generated
// -------------------------------

if (!loading && quiz.length === 0) {

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
            ⏰
          </div>

          <h1 className="text-4xl font-bold mb-4">
            Ready to Generate Quiz
          </h1>

          <p className="text-slate-400 mb-8">
            Your notes have been uploaded successfully.
            Click below to generate an AI quiz based on your uploaded document.
          </p>

          <button
            onClick={loadQuiz}
            className="
              px-6
              py-3
              rounded-xl
              bg-blue-600
              hover:bg-blue-700
              font-medium
              transition
            "
          >
            Generate Quiz
          </button>

        </div>

      </main>

    </div>

  );

}

  if (loading) {
    return (
      <div
  className={
    theme === "dark"
      ? "flex min-h-screen bg-gradient-to-br from-slate-950 via-blue-950  to-slate-950 text-white"
      : "flex min-h-screen bg-white text-black"
  }
>
        <Sidebar />

        <main className="flex-1 p-8 flex items-center justify-center">
          <div className="text-center">
            <div
              className="
                animate-spin
                rounded-full
                h-12
                w-12
                border-b-2
                border-blue-500
                mx-auto
                mb-4
              "
            />
            <p>Generating Quiz...</p>
          </div>
        </main>
      </div>
    );
  }

  if (score !== null) {
  const percentage = Math.round(
    (score.correct / quiz.length) * 100
  );

  return (
    <div className="flex min-h-screen bg-[#0B1120] text-white">
      <Sidebar />

      <main className="flex-1 overflow-y-auto">
        <div className="max-w-6xl mx-auto px-10 py-10">

          {/* Header */}
          <div className="flex items-center justify-between mb-8">

            <div>
              <h1 className="text-4xl font-bold">
                Quiz Results
              </h1>

              <p className="text-slate-400 mt-2">
                Review your performance and improve weak areas.
              </p>
            </div>

            <div className="flex gap-4">
            <button
              onClick={regenerateQuiz}
              className="
                px-5
                py-2
                rounded-xl
                bg-blue-600
                hover:bg-blue-700
                transition
                font-medium
                cursor-pointer
              "
            >
              Generate New Quiz
            </button>
            
            <button
                  onClick={() => {
                    localStorage.removeItem("quizData");
                    setQuiz([]);
                  }}
                  className="
                    bg-red-600
                    hover:bg-red-700
                    transition
                    px-6
                    py-2
                    rounded-xl
                    cursor-pointer
                  "
                >
                  Reset
                </button>
             </div>       
          </div>

          {/* Score Card */}

          <div
            className="
              bg-[#111827]
              border
              border-slate-800
              rounded-3xl
              shadow-xl
              p-10
              mb-8
            "
          >

            <div className="grid md:grid-cols-3 gap-8">

              <div>

                <p className="text-slate-400 text-sm uppercase">
                  Final Score
                </p>

                <h2 className="text-6xl font-bold mt-3 text-blue-400">
                  {score.correct}
                  <span className="text-slate-500 text-3xl">
                    /{quiz.length}
                  </span>
                </h2>

              </div>

              <div>

                <p className="text-slate-400 text-sm uppercase">
                  Accuracy
                </p>

                <h2 className="text-6xl font-bold mt-3 text-green-400">
                  {percentage}%
                </h2>

              </div>

              <div>

                <p className="text-slate-400 text-sm uppercase">
                  Status
                </p>

                <h2 className="text-3xl font-semibold mt-5">

                  {percentage >= 80
                    ? "🎉 Excellent"
                    : percentage >= 60
                    ? "👍 Good"
                    : "📚 Keep Practicing"}

                </h2>

                

              </div>

            </div>

          </div>

          {/* Review */}

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

            <h2 className="text-2xl font-bold mb-8">
              Quiz Review
            </h2>

            <div className="space-y-5">

              {quiz.map((q, index) => {

                const userAnswer = score.answers[index];
                const isCorrect = userAnswer === q.answer;

                return (

                  <div
                    key={index}
                    className="
                      rounded-2xl
                      border
                      border-slate-700
                      bg-slate-900/70
                      p-6
                    "
                  >

                    <div className="flex items-start justify-between">

                      <h3 className="font-semibold text-lg">
                        {index + 1}. {q.question}
                      </h3>

                      <span
                        className={`px-3 py-1 rounded-full text-sm font-medium ${
                          isCorrect
                            ? "bg-green-500/20 text-green-400"
                            : "bg-red-500/20 text-red-400"
                        }`}
                      >
                        {isCorrect ? "Correct" : "Incorrect"}
                      </span>

                    </div>

                    <div className="mt-5 grid md:grid-cols-2 gap-6">

                      <div>

                        <p className="text-slate-400 text-sm mb-2">
                          Your Answer
                        </p>

                        <div className="bg-slate-800 rounded-xl p-3">
                          {userAnswer || "Not Answered"}
                        </div>

                      </div>

                      <div>

                        <p className="text-slate-400 text-sm mb-2">
                          Correct Answer
                        </p>

                        <div className="bg-green-500/10 border border-green-500/20 rounded-xl p-3 text-green-400">
                          {q.answer}
                        </div>

                      </div>

                    </div>

                  </div>

                );

              })}

            </div>

          </div>

        </div>
      </main>
    </div>
  );
}

  const question = quiz[current];

  return (
  <div className="flex min-h-screen bg-[#0B1120] text-white">
    <Sidebar />

    <main className="flex-1 overflow-y-auto">
      <div className="max-w-5xl mx-auto px-10 py-10">

        {/* Header */}
        <div className="flex items-center justify-between mb-10">

          <div>
            <h1 className="text-4xl font-bold">
              Quiz Generator
            </h1>

            <p className="text-slate-400 mt-2">
              AI-generated quiz based on your uploaded notes.
            </p>
          </div>

          <div className="flex gap-4">

            <div
              className="
                px-5
                py-3
                rounded-xl
                bg-red-500/10
                border
                border-red-500/20
              "
            >
              <p className="text-xs text-slate-400">
                Time Remaining
              </p>

              <p className="text-xl font-semibold text-red-400">
                {Math.floor(timeLeft / 60)}:
                {String(timeLeft % 60).padStart(2, "0")}
              </p>
            </div>

          </div>

        </div>

        {/* Progress */}

        <div className="mb-8">

          <div className="flex justify-between text-sm text-slate-400 mb-2">

            <span>
              Question {current + 1} of {quiz.length}
            </span>

            <span>
              {Math.round(((current + 1) / quiz.length) * 100)}%
            </span>

          </div>

          <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">

            <div
              className="h-full bg-blue-500 rounded-full transition-all duration-300"
              style={{
                width: `${((current + 1) / quiz.length) * 100}%`,
              }}
            />

          </div>

        </div>

        {/* Question Card */}

        <div
          className="
            bg-[#111827]
            border
            border-slate-800
            rounded-3xl
            shadow-xl
            p-10
          "
        >

          <div className="mb-8">

            <h2 className="text-2xl font-semibold leading-relaxed">
              {question?.question}
            </h2>

          </div>

          {/* Options */}

          <div className="space-y-4">

            {question?.options?.map((option) => (

              <button
                key={option}
                onClick={() =>
                  setSelected({
                    ...selected,
                    [current]: option,
                  })
                }
                className={`
                  w-full
                  text-left
                  rounded-2xl
                  border
                  p-5
                  transition-all
                  duration-200
                  ${
                    selected[current] === option
                      ? "border-blue-500 bg-blue-600 text-white shadow-lg"
                      : "border-slate-700 bg-slate-900 hover:border-blue-400 hover:bg-slate-800"
                  }
                `}
              >
                {option}
              </button>

            ))}

          </div>

          {/* Footer */}

          <div className="flex justify-between mt-10">

            <button
              disabled={current === 0}
              onClick={() => setCurrent(current - 1)}
              className="
                px-6
                py-3
                rounded-xl
                bg-slate-800
                hover:bg-slate-700
                disabled:opacity-40
                disabled:cursor-not-allowed
                transition
                cursor-pointer
              "
            >
              ← Previous
            </button>

            {current === quiz.length - 1 ? (

              <div className="flex gap-4">

                <button
                  onClick={downloadQuiz}
                  className="
                    px-6
                    py-3
                    rounded-xl
                    bg-purple-600
                    hover:bg-purple-700
                    transition
                    cursor-pointer
                  "
                >
                  Download Quiz
                </button>

                <button
                  onClick={finishQuiz}
                  className="
                    px-6
                    py-3
                    rounded-xl
                    bg-green-600
                    hover:bg-green-700
                    transition
                    cursor-pointer
                  "
                >
                  Finish Quiz
                </button>

              </div>

            ) : (

              <button
                disabled={!selected[current]}
                onClick={() => setCurrent(current + 1)}
                className="
                  px-6
                  py-3
                  rounded-xl
                  bg-blue-600
                  hover:bg-blue-700
                  disabled:bg-slate-700
                  disabled:cursor-not-allowed
                  transition
                  cursor-pointer
                "
              >
                Next →
              </button>

            )}

          </div>

        </div>

      </div>
    </main>
  </div>
);
}

export default Quiz;
