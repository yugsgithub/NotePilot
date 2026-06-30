export const updateStudyStreak = () => {

  const today =
    new Date().toDateString();

  const lastStudy =
    localStorage.getItem(
      "lastStudyDate"
    );

  let streak =
    Number(
      localStorage.getItem(
        "studyStreak"
      ) || 0
    );

  if (!lastStudy) {

    streak = 1;

  } else {

    const last =
      new Date(lastStudy);

    const current =
      new Date(today);

    const diffDays =
      Math.floor(
        (current - last) /
        (1000 * 60 * 60 * 24)
      );

    if (diffDays === 1) {

      streak++;

    } else if (diffDays > 1) {

      streak = 1;

    }

  }

  localStorage.setItem(
    "lastStudyDate",
    today
  );

  localStorage.setItem(
    "studyStreak",
    streak
  );

  return streak;
};