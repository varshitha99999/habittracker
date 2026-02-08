export function getToday() {
  return new Date().toISOString().split('T')[0];
}

export function getLastNDays(n) {
  const dates = [];
  for (let i = n - 1; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    dates.push(d.toISOString().split('T')[0]);
  }
  return dates;
}

export function formatDateLabel(dateStr) {
  const date = new Date(dateStr);
  return date.toLocaleDateString('en-US', { weekday: 'short', day: 'numeric' });
}

export function calculateStreak(completedDates) {
  if (!completedDates || completedDates.length === 0) return 0;
  
  const dateSet = new Set(completedDates);
  const today = getToday();
  const yesterdayDate = new Date();
  yesterdayDate.setDate(yesterdayDate.getDate() - 1);
  const yesterday = yesterdayDate.toISOString().split('T')[0];
  
  let currentStreak = 0;
  let checkDate = new Date();
  
  if (dateSet.has(today)) {
    currentStreak = 1;
    checkDate.setDate(checkDate.getDate() - 1);
  } else if (dateSet.has(yesterday)) {
    currentStreak = 1;
    checkDate.setDate(checkDate.getDate() - 2);
  } else {
    return 0;
  }
  
  while (true) {
    const dateStr = checkDate.toISOString().split('T')[0];
    if (dateSet.has(dateStr)) {
      currentStreak++;
      checkDate.setDate(checkDate.getDate() - 1);
    } else {
      break;
    }
  }
  
  return currentStreak;
}
