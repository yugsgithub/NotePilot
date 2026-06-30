
import { useState, useRef, useEffect } from "react";
import API from "../services/api";
import ReactMarkdown from "react-markdown";
import { Volume2, VolumeX } from "lucide-react";
import { Copy, Check } from "lucide-react";
import { Mic, MicOff } from "lucide-react";
import toast from "react-hot-toast";

import { updateStudyStreak } from "../utils/streak";
import { useDocuments } from "../context/DocumentsContext";

function ChatWindow() {

  const [question, setQuestion] = useState("");
  const [loading, setLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(null);
  const [copiedId, setCopiedId] = useState(null);

  const { hasDocuments } = useDocuments();

  const [messages, setMessages] = useState(() => {

    const saved =
      localStorage.getItem(
        "notePilot-chat"
      );

    return saved
      ? JSON.parse(saved)
      : [
          {
            type: "ai",
            text:
              "Welcome to NotePilot! Upload your notes and start asking questions.",
          },
        ];

  });

  const messagesEndRef = useRef(null);

  useEffect(() => {

    localStorage.setItem(
      "notePilot-chat",
      JSON.stringify(messages)
    );

    messagesEndRef.current?.scrollIntoView({
      behavior: "smooth",
    });

  }, [messages]);

const handleNewChat = async () => {

  try {

    await API.post("/reset-chat");

    setMessages([]);

  } catch (error) {

    console.error(error);

  }

};  


const toggleSpeech = (text) => {
  if (isSpeaking) {
    speechSynthesis.cancel();
    setIsSpeaking(false);
    return;
  }

  const utterance = new SpeechSynthesisUtterance(text);

  utterance.onend = () => {
    setIsSpeaking(false);
  };

  speechSynthesis.speak(utterance);
  setIsSpeaking(true);
};

const startListening = () => {

  const SpeechRecognition =
    window.SpeechRecognition ||
    window.webkitSpeechRecognition;

  if (!SpeechRecognition) {
    alert("Speech recognition not supported.");
    return;
  }

  const recognition =
    new SpeechRecognition();

  recognition.lang = "en-US";
  recognition.interimResults = false;

  recognition.onstart = () => {
    console.log("Listening...");
    setIsListening(true);
  };

  recognition.onresult = (event) => {

    const transcript =
      event.results[0][0].transcript;

    console.log("You said:", transcript);

    setQuestion(transcript);

    handleSendWithPrompt(transcript);
  };

  recognition.onerror = (event) => {
    console.log("Speech Error:", event.error);
  };

  recognition.onend = () => {
    console.log("Stopped");
    setIsListening(false);
  };

  recognition.start();
};

 

  useEffect(() => {
    localStorage.setItem(
    "notePilot-chat",
    JSON.stringify(messages)
  );
    messagesEndRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [messages]);



  const handleCopy = async (text, id) => {
  try {
    await navigator.clipboard.writeText(text);

    toast.success("Copied to clipboard");

    setCopiedId(id);

    setTimeout(() => {
      setCopiedId(null);
    }, 2000);

  } catch (err) {
    toast.error("Failed to copy");
    console.error(err);
  }
};


  const downloadText = (
    filename,
    content
  ) => {

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
    link.download = filename;

    document.body.appendChild(link);

    link.click();

    document.body.removeChild(link);

    URL.revokeObjectURL(url);
  };  

  const quickAsk = async (prompt) => {
  setQuestion(prompt);

  const response = await API.post("/ask", {
    question: prompt,
  });

  setMessages((prev) => [
    ...prev,
    {
      type: "user",
      text: prompt,
    },
    {
      type: "ai",
      text: response.data.answer,
      sources: response.data.sources || [],
    },
  ]);
};

const handleStudyAction = async (prompt) => {

  if (!hasDocuments) {

    setMessages((prev) => [
      ...prev,
      {
        type: "ai",
        text: "📄 Upload a PDF first."
      }
    ]);

    return;
  }

  handleSendWithPrompt(prompt);
};

const handleQuickPrompt = (prompt) => {

  setQuestion(prompt);

  setTimeout(() => {

    const fakeEvent = {
      target: {
        value: prompt,
      },
    };

    setQuestion(prompt);

  }, 50);

  handleSendWithPrompt(prompt);
};

const handleSendWithPrompt = async (customPrompt) => {

  updateStudyStreak();

  const prompt = customPrompt || question;

  if (!prompt.trim() || loading) return;

  setMessages((prev) => [
    ...prev,
    {
      type: "user",
      text: prompt,
    },
    {
      type: "loading",
      text: "🤖 Thinking...",
    },
  ]);

  setQuestion("");
  setLoading(true);

  try {
          const questionsAsked =
        Number(
          localStorage.getItem(
            "questionsAsked"
          ) || 0
        );

      localStorage.setItem(
        "questionsAsked",
        questionsAsked + 1
      );

    const response = await API.post(
      "/ask",
      {
        question: prompt,
      }
    );

    setMessages((prev) => {

      const filtered =
        prev.filter(
          (msg) =>
            msg.type !== "loading"
        );

      return [
        ...filtered,
        {
          type: "ai",
          text: response.data.answer,
          sources:
            response.data.sources || [],
        },
      ];
    });

  } catch (error) {

    console.error(error);

  } finally {

    setLoading(false);

  }
};



  const handleSend = () => {
  handleSendWithPrompt(question);
};

  return (
    <div
  className="
    bg-[#111827]
    border border-slate-800
    rounded-xl
  "
>
{/* Header */}

{/* Header */}

<div
  className="
    flex
    items-center
    justify-between
    px-6
    py-5
    border-b
    border-slate-800
  "
>

  <div>

    <h2 className="text-2xl font-semibold text-white">
      AI Assistant
    </h2>

    <p className="text-sm text-slate-500 mt-1">
      Ask questions about your uploaded notes.
    </p>

  </div>

  <div className="flex items-center gap-3">

    <button
      onClick={handleNewChat}
      className="
        px-4
        py-2
        rounded-lg
        border
        border-slate-700
        bg-slate-900
        hover:bg-slate-800
        transition
        text-sm
        font-medium
        cursor-pointer
      "
    >
      + New Chat
    </button>

    <button
      onClick={() => {
        localStorage.removeItem("notePilot-chat");

        setMessages([
          {
            type: "ai",
            text: "Chat cleared. Ask another question!",
          },
        ]);
      }}
      className="
        px-4
        py-2
        rounded-lg
        border
        border-slate-700
        bg-slate-900
        hover:bg-slate-800
        transition
        text-sm
        font-medium
        cursor-pointer
      "
    >
      Clear
    </button>

  </div>

</div>

{/* Messages */}

<div
  className="
    flex-1
    overflow-y-auto
    px-6
    py-6
    space-y-8
    h-[560px]
  "
>
  {messages.map((message, index) => (

    <div
      key={index}
      className={`flex ${
        message.type === "user"
          ? "justify-end"
          : "justify-start"
      }`}
    >

      <div className="max-w-4xl">

        {/* Name */}

        <div
          className={`mb-2 text-sm font-medium ${
            message.type === "user"
              ? "text-right text-blue-400"
              : "text-slate-400"
          }`}
        >
          {message.type === "user"
            ? "You"
            : "NotePilot AI"}
        </div>

        {/* Bubble */}

        <div
          className={`rounded-2xl border px-5 py-4 shadow-sm transition ${
            message.type === "user"
              ? "bg-blue-600 border-blue-500 text-white"
              : message.type === "loading"
              ? "bg-slate-900 border-slate-700 animate-pulse text-slate-300"
              : "bg-[#0F172A] border-slate-800 text-white"
          }`}
        >

          <div className="leading-8 whitespace-pre-wrap">
            <ReactMarkdown>
              {message.text}
            </ReactMarkdown>
          </div>

          {/* Sources */}

          {message.sources?.length > 0 && (

            <div className="mt-6">

              <div className="text-xs uppercase tracking-widest text-slate-500 mb-3">
                Sources
              </div>

              <div className="space-y-3">

                {message.sources.map((source, i) => (

                  <div
                    key={i}
                    className="
                      rounded-xl
                      border
                      border-slate-700
                      bg-slate-800/60
                      p-4
                    "
                  >

                    <div className="text-blue-400 text-xs font-semibold mb-2">
                      📄 Source {i + 1}
                    </div>

                    <p className="text-sm text-slate-300 leading-6">
                      {source.substring(0, 180)}...
                    </p>

                  </div>

                ))}

              </div>

            </div>

          )}

          {/* Toolbar */}

          {message.type === "ai" && (

            <div className="flex gap-2 mt-5">

              <button
                onClick={() => handleCopy(message.text, message.id)}
                className="
                  h-9
                  w-9
                  rounded-lg
                  border
                  border-slate-700
                  bg-slate-800
                  hover:bg-slate-700
                  flex
                  items-center
                  justify-center
                  transition
                  cursor-pointer
                "
              >
                {copiedId === message.id
                  ? <Check size={16}/>
                  : <Copy size={16}/>}
              </button>

              <button
                onClick={() =>
                  toggleSpeech(message.text)
                }
                className="
                  h-9
                  w-9
                  rounded-lg
                  border
                  border-slate-700
                  bg-slate-800
                  hover:bg-slate-700
                  flex
                  items-center
                  justify-center
                  transition
                  cursor-pointer
                "
              >
                {isSpeaking
                  ? <Volume2 size={16}/>
                  : <VolumeX size={16}/>}
              </button>

            </div>

          )}

        </div>

      </div>

    </div>

  ))}

  <div ref={messagesEndRef} />

</div>

{/* Input */}

<div className="border-t border-slate-800 p-5 bg-[#111827]">

  <div
    className="
      flex
      items-center
      gap-3
      rounded-2xl
      border
      border-slate-700
      bg-[#0F172A]
      px-4
      py-3
    "
  >

    <input
      value={question}
      onChange={(e) => setQuestion(e.target.value)}
      onKeyDown={(e) => {
        if (e.key === "Enter") handleSend();
      }}
      disabled={loading}
      placeholder="Ask anything..."
      className="
        flex-1
        bg-transparent
        outline-none
        text-white
        placeholder:text-slate-500
      "
    />

    <button
      onClick={startListening}
      className="
        h-10
        w-10
        rounded-lg
        border
        border-slate-700
        bg-slate-800
        hover:bg-slate-700
        flex
        items-center
        justify-center
        transition
        cursor-pointer
      "
    >
      {isListening
        ? <Mic className="animate-pulse" size={18}/>
        : <MicOff size={18}/>}
    </button>

    <button
      onClick={handleSend}
      disabled={loading}
      className="
        px-5
        py-2.5
        rounded-xl
        bg-blue-600
        hover:bg-blue-700
        transition
        disabled:opacity-50
        font-medium
        cursor-pointer
      "
    >
      {loading ? "..." : "Send"}
    </button>

  </div>

</div>

</div>
)
}  
export default ChatWindow;