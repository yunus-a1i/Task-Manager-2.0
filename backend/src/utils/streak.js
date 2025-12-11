export const updateStreak = (task) => {
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  
  if (!task.streak.lastCompletedDate) {
    // First completion
    task.streak.count = 1;
    task.streak.lastCompletedDate = today;
    return task.streak;
  }

  const lastCompleted = new Date(task.streak.lastCompletedDate);
  const lastCompletedDay = new Date(
    lastCompleted.getFullYear(),
    lastCompleted.getMonth(),
    lastCompleted.getDate()
  );

  const daysDiff = Math.floor((today - lastCompletedDay) / (1000 * 60 * 60 * 24));

  if (daysDiff === 0) {
    // Same day - maintain current streak
    return task.streak;
  } else if (daysDiff === 1) {
    // Next day - increment streak
    task.streak.count += 1;
    task.streak.lastCompletedDate = today;
  } else {
    // Break in streak - reset to 1
    task.streak.count = 1;
    task.streak.lastCompletedDate = today;
  }

  return task.streak;
};

export const calculateWeeklyStats = (tasks) => {
  const now = new Date();
  const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

  const completedThisWeek = tasks.filter(task => {
    return task.status === 'completed' && 
           task.updatedAt >= weekAgo;
  });

  const totalTasks = tasks.filter(t => !t.isDeleted).length;
  const completedTasks = tasks.filter(t => t.status === 'completed' && !t.isDeleted).length;
  const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  return {
    completedThisWeek: completedThisWeek.length,
    totalTasks,
    completedTasks,
    completionRate
  };
};