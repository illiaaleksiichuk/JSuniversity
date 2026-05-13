function showDate() {
  let date = new Date();

  let info = formatUkrDate(date);
  let week = getWeekInfo(date);

  document.getElementById("out1").innerHTML =
    info +
    "<br>День тижня: " +
    week.dayName +
    "<br>Час: " +
    date.getHours() +
    ":" +
    date.getMinutes();
}

function getDaysAgo() {
  let n = +document.getElementById("daysAgo").value;
  let d = daysAgo(n);

  document.getElementById("out3").innerHTML = d.toString();
}

function getLastDay() {
  let now = new Date();
  let day = lastDayOfMonth(now.getFullYear(), now.getMonth());

  document.getElementById("out4").innerHTML = "Останній день місяця: " + day;
}

function getSeconds() {
  let s = secondsInfo();

  document.getElementById("out5").innerHTML =
    "Від початку дня: " + s.fromStart + "<br>До кінця дня: " + s.toEnd;
}

function diffDates() {
  let d1 = new Date(document.getElementById("date1").value);
  let d2 = new Date(document.getElementById("date2").value);

  let diff = dateDiff(d1, d2);

  document.getElementById("out7").innerHTML = "Різниця (мс): " + diff;
}
