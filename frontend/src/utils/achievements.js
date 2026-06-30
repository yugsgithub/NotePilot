export const getAchievements = () => {

  const questions =
    Number(
      localStorage.getItem(
        "questionsAsked"
      ) || 0
    );

  const streak =
    Number(
      localStorage.getItem(
        "studyStreak"
      ) || 0
    );

  const flashcards =
    Number(
      localStorage.getItem(
        "flashcardsViewed"
      ) || 0
    );

  const achievements = [];

  if (questions >= 10)
    achievements.push(
      "💬 Asked 10 Questions"
    );

  if (questions >= 50)
    achievements.push(
      "🧠 AI Explorer"
    );

  if (flashcards >= 50)
    achievements.push(
      "📝 Flashcard Master"
    );

  if (streak >= 3)
    achievements.push(
      "🔥 3 Day Streak"
    );

  if (streak >= 7)
    achievements.push(
      "🔥 7 Day Streak"
    );

  if (streak >= 30)
    achievements.push(
      "🏆 Study Warrior"
    );

  return achievements;
};