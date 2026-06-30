import { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import API from "../services/api";
import { useContext } from "react";
import { checkDocuments } from "../utils/checkDocuments";
import { ThemeContext }
from "../context/ThemeContext";
import { updateStudyStreak } from "../utils/streak";
import toast from "react-hot-toast";
import { useDocuments } from "../context/DocumentsContext";



function Flashcards() {
  const { theme } = useContext(ThemeContext);
  const [cards, setCards] = useState([]);
  const [current, setCurrent] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const [loading, setLoading] = useState(false);
  const { hasDocuments, setHasDocuments } =
  useDocuments();

  
useEffect(() => {

  const verifyDocuments = async () => {

    const exists =
      await checkDocuments();

    setHasDocuments(exists);

  };


  verifyDocuments();

}, []);

useEffect(() => {

  const savedCards =
    localStorage.getItem("flashcards");

  if (savedCards) {

    setCards(JSON.parse(savedCards));

  }

}, []);


const fetchFlashcards = async (regenerate = false) => {

  updateStudyStreak();

  setLoading(true);

  try {

    const viewed = Number(
      localStorage.getItem("flashcardsViewed") || 0
    );

    const response = regenerate
      ? await API.get("/flashcards/regenerate")
      : await API.get("/flashcards");

    const generatedCards = regenerate
      ? response.data.flashcards
      : response.data;

    setCards(generatedCards);
      localStorage.setItem(
      "flashcards",
      JSON.stringify(generatedCards)
    );
    toast.success("Flashcards ready");

    localStorage.setItem(
      "flashcardsViewed",
      viewed + generatedCards.length
    );

    setCurrent(0);
    setShowAnswer(false);

  } catch (error) {

    console.error(error);

  } finally {

    setLoading(false);

  }

};


const nextCard = () => {
setShowAnswer(false);


setCurrent((prev) =>
  prev === cards.length - 1
    ? 0
    : prev + 1
);
};

const previousCard = () => {

  setShowAnswer(false);

  setCurrent((prev) =>
    prev === 0
      ? cards.length - 1
      : prev - 1
  );

};

const downloadFlashcards = () => {

  const content = cards
    .map(
      (card, index) =>
        `Flashcard ${index + 1}

Q: ${card.question}

A: ${card.answer}

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
    `flashcards-${Date.now()}.txt`;

  link.click();
  toast.success("Flashcards downloaded");

  URL.revokeObjectURL(url);

};

const shuffleCards = () => {
const shuffled = [...cards].sort(
() => Math.random() - 0.5
);


setCards(shuffled);
localStorage.setItem(
  "flashcards",
  JSON.stringify(shuffled)
);
setCurrent(0);
setShowAnswer(false);


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
            🃏 Flashcards
          </h1>

          <p className="text-slate-500 mt-2">
            Upload your notes to generate flashcards.
          </p>

        </div>

      </main>

    </div>
  );
}


if (loading) {
  return (
    <div className="flex min-h-screen bg-[#0B1120] text-white">
      <Sidebar />

      <main className="flex-1 overflow-y-auto">
        <div className="max-w-4xl mx-auto px-10 py-10">

          <div className="mb-10">
            <h1 className="text-4xl font-bold">
              Flashcards
            </h1>

            <p className="text-slate-400 mt-2">
              AI is generating your study flashcards...
            </p>
          </div>

          <div
            className="
              bg-[#111827]
              border
              border-slate-800
              rounded-3xl
              shadow-xl
              p-16
              flex
              flex-col
              items-center
              justify-center
            "
          >
            <div
              className="
                animate-spin
                rounded-full
                h-14
                w-14
                border-4
                border-slate-700
                border-t-blue-500
                mb-6
              "
            />

            <h2 className="text-2xl font-semibold">
              Generating Flashcards
            </h2>

            <p className="text-slate-400 mt-3">
              This usually takes a few seconds.
            </p>

          </div>

        </div>
      </main>
    </div>
  );
}




if (!loading && cards.length === 0) {
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
            🃏
          </div>

          <h1 className="text-4xl font-bold mb-4">
            Ready to Generate Flashcards
          </h1>

          <p className="text-slate-400 mb-8">
            Your notes have been uploaded successfully.
            Click below to generate AI-powered flashcards
            from your uploaded document.
          </p>

          <button
            onClick={() => fetchFlashcards(true)}
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
            Generate Flashcards
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
      <div className="max-w-5xl mx-auto px-10 py-10">

        {/* Header */}

        <div className="flex items-center justify-between mb-10">

          <div>
            <h1 className="text-4xl font-bold">
              Flashcards
            </h1>

            <p className="text-slate-400 mt-2">
              Review concepts generated from your uploaded notes.
            </p>
          </div>

          <div
            className="
              px-5
              py-3
              rounded-xl
              bg-blue-500/10
              border
              border-blue-500/20
            "
          >
            <p className="text-xs text-slate-400">
              Progress
            </p>

            <p className="text-lg font-semibold text-blue-400">
              {current + 1} / {cards.length}
            </p>
          </div>

        </div>

        {/* Actions */}

        <div className="flex gap-4 mb-8">

          <button
            onClick={shuffleCards}
            className="
              px-5
              py-3
              rounded-xl
              bg-purple-600
              hover:bg-purple-700
              transition
              cursor-pointer
            "
          >
            🔀 Shuffle Cards
          </button>

          <div className="flex gap-4">
          <button
            onClick={() => fetchFlashcards(true)}
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
            ✨ Generate New Set
          </button>

          <button
        onClick={() => {

          localStorage.removeItem("flashcards");

          setCards([]);

          setCurrent(0);

          setShowAnswer(false);

          toast.success("Flashcards reset");

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

        {/* Flashcard */}

        <div
          className="
            bg-[#111827]
            border
            border-slate-800
            rounded-3xl
            shadow-xl
            p-12
            min-h-[420px]
            flex
            flex-col
            justify-center
            items-center
            text-center
          "
        >

          <span className="text-blue-400 text-sm uppercase tracking-wide mb-5">
            Question
          </span>

          <h2 className="text-3xl font-semibold leading-relaxed max-w-3xl">
            {cards[current].question}
          </h2>

          {showAnswer && (

            <div
              className="
                mt-10
                w-full
                border-t
                border-slate-700
                pt-8
              "
            >

              <span className="text-green-400 text-sm uppercase tracking-wide">
                Answer
              </span>

              <p className="text-2xl mt-4 font-medium text-green-300">
                {cards[current].answer}
              </p>

            </div>

          )}

        </div>

        {/* Controls */}

        <div className="flex justify-between items-center mt-8">
          <button
            onClick={previousCard}
            className="
              px-6
              py-3
              rounded-xl
              bg-slate-800
              hover:bg-slate-700
              transition
              cursor-pointer
            "
          >
            ← Previous
          </button>

          <button
            onClick={() => setShowAnswer(!showAnswer)}
            className="
              px-6
              py-3
              rounded-xl
              bg-blue-600
              hover:bg-blue-700
              transition
              cursor-pointer
            "
          >
            {showAnswer
              ? "Hide Answer"
              : "Show Answer"}
          </button>

          <button
            onClick={nextCard}
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
            Next →
          </button>

        </div>

        {/* Download */}

        <div className="flex justify-center mt-8">

          <button
            onClick={downloadFlashcards}
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
            📥 Download Flashcards
          </button>

        </div>

      </div>
    </main>
  </div>
);
}

export default Flashcards;
