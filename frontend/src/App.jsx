import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import Flashcards from "./pages/Flashcards";
import Quiz from "./pages/Quiz";
import StudyNotes from "./pages/StudyNotes";
import Documents from "./pages/Documents";
import Revision from "./pages/Revision";
import Analytics from "./pages/Analytics";
import Search from "./pages/Search";
import Achievements from "./pages/Achievements";
import MockViva from "./pages/MockViva";
import ExamPredictor from "./pages/ExamPredictor";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/quiz" element={<Quiz />} />
        <Route path="/flashcards" element={<Flashcards />} />
        <Route path="/study-notes" element={<StudyNotes />} />
        <Route path="/revision" element={<Revision />} />
        <Route path="/analytics" element={<Analytics />} />
        <Route path="/documents" element={<Documents />}/>
        <Route path="/search" element={<Search />}/>
        <Route path="/achievements" element={<Achievements />}/>
        <Route path="/viva" element={<MockViva />}/>
        <Route path="/exam-predictor"element={<ExamPredictor />}/>
      </Routes>
    </BrowserRouter>
  );
}

export default App;