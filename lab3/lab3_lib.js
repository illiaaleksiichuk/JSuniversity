function formatUkrDate(date) {
  const months = [
    "січня",
    "лютого",
    "березня",
    "квітня",
    "травня",
    "червня",
    "липня",
    "серпня",
    "вересня",
    "жовтня",
    "листопада",
    "грудня",
  ];

  return `Дата: ${date.getDate()} ${months[date.getMonth()]} ${date.getFullYear()} року`;
}

function getWeekInfo(date) {
  const days = [
    "неділя",
    "понеділок",
    "вівторок",
    "середа",
    "четвер",
    "п’ятниця",
    "субота",
  ];

  return {
    dayNumber: date.getDay() === 0 ? 7 : date.getDay(),
    dayName: days[date.getDay()],
  };
}

function daysAgo(n) {
  let d = new Date();
  d.setDate(d.getDate() - n);
  return d;
}

function lastDayOfMonth(year, month) {
  return new Date(year, month + 1, 0).getDate();
}

function secondsInfo() {
  let now = new Date();

  let start = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  let end = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);

  return {
    fromStart: Math.floor((now - start) / 1000),
    toEnd: Math.floor((end - now) / 1000),
  };
}

function formatDDMMYYYY(date) {
  let d = String(date.getDate()).padStart(2, "0");
  let m = String(date.getMonth() + 1).padStart(2, "0");
  let y = date.getFullYear();
  return `${d}.${m}.${y}`;
}

function dateDiff(d1, d2) {
  return Math.abs(d2 - d1);
}

function formatDate(date) {
  let diff = Date.now() - date;

  if (diff < 1000) return "тільки що";
  if (diff < 60000) return Math.floor(diff / 1000) + " сек. назад";
  if (diff < 3600000) return Math.floor(diff / 60000) + " хв. назад";

  return formatDDMMYYYY(date);
}

function parseDate(str) {
  return new Date(str);
}
