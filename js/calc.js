"use strict";

const submit = document.getElementById("submit");
const output = document.getElementById("output");

const startDate = document.getElementById("date-1");
const endDate = document.getElementById("date-2");

const nextWeek = document.getElementById("next-week");
const nextMonth = document.getElementById("next-month");

// -----------------------------------

submit.addEventListener("click", () => {
  const startDate = new Date(document.getElementById("date-1").value);
  const endDate = new Date(document.getElementById("date-2").value);

  const timeOption = document.querySelector(
    'input[name="time-options"]:checked'
  ).value;

  const daysOption = document.querySelector(
    'input[name="days-options"]:checked'
  ).value;

  const difference = getDifferenceBetweenTwoDates(
    startDate,
    endDate,
    timeOption,
    daysOption
  );

  const optionLabel =
    difference === 1 && timeOption === "day" ? "day" : `${timeOption}s`;
  const text = `Difference between ${
    startDate.toISOString().split("T")[0]
  } and ${
    endDate.toISOString().split("T")[0]
  } is <span>${difference}</span> ${optionLabel}`;

  output.innerHTML = text;
  setToLocalStorage(
    `Difference between ${startDate.toISOString().split("T")[0]} and ${
      endDate.toISOString().split("T")[0]
    } is ${difference} ${optionLabel}`
  );
  getFromLocalStorage();

  document.querySelector(".content-history__title").style.display = "block";
});

// ----------------------------------------

startDate.addEventListener("change", (e) => {
  const value = e.target.value;
  if (value) {
    endDate.disabled = false;
    nextWeek.disabled = false;
    nextMonth.disabled = false;
    endDate.setAttribute("min", value);
  }
  if (value > endDate.value) {
    endDate.value = "";
    submit.disabled = true;
  }
});

endDate.addEventListener("change", (e) => {
  const value = e.target.value;
  if (value) {
    submit.disabled = false;
  }
});

// ----------------------------------

function getDifferenceBetweenTwoDates(
  startDate,
  endDate,
  timeOption,
  daysOption
) {
  let timeDifference = endDate.getTime() - startDate.getTime();

  if (daysOption === "work") {
    timeDifference = getWorkingDaysBetweenTwoDates(
      startDate.getTime(),
      endDate.getTime()
    );
  }
  if (daysOption === "weekends") {
    timeDifference = getWeekendsBetweenTwoDates(
      startDate.getTime(),
      endDate.getTime()
    );
  }

  if (timeOption === "day") {
    const dayDifference = Math.abs(timeDifference) / (1000 * 60 * 60 * 24);
    return dayDifference;
  }
  if (timeOption === "hour") {
    const hourDifference = Math.abs(timeDifference) / (1000 * 60 * 60);
    return hourDifference;
  }
  if (timeOption === "minute") {
    const minuteDifference = Math.abs(timeDifference) / (1000 * 60);
    return minuteDifference;
  }
  if (timeOption === "second") {
    const secondDifference = Math.abs(timeDifference) / 1000;
    return secondDifference;
  }
}

// --------------------------

function getWorkingDaysBetweenTwoDates(startDate, endDate) {
  let count = 0;
  const date = new Date(startDate);
  while (date < endDate) {
    const dayOfWeek = date.getDay();
    if (![0, 6].includes(dayOfWeek)) count++;
    date.setDate(date.getDate() + 1);
  }
  return Math.floor(count) * (1000 * 60 * 60 * 24);
}

function getWeekendsBetweenTwoDates(startDate, endDate) {
  let count = 0;
  const date = new Date(startDate);
  while (date < endDate) {
    const dayOfWeek = date.getDay();
    if ([0, 6].includes(dayOfWeek)) count++;
    date.setDate(date.getDate() + 1);
  }
  return Math.floor(count) * (1000 * 60 * 60 * 24);
}

// ----------------------------

function getNextWeekDate(date) {
  const newDate = new Date(date);
  return new Date(newDate.setDate(newDate.getDate() + 7));
}

function getNextMonthDate(date) {
  const newDate = new Date(date);
  return new Date(newDate.setMonth(newDate.getMonth() + 1));
}

document
  .getElementById("next-week")
  .addEventListener("click", handleWeekSelect);
document
  .getElementById("next-month")
  .addEventListener("click", handleMonthSelect);

// -------------------------------

function handleWeekSelect() {
  const startDate = new Date(document.getElementById("date-1").value);
  const endDate = getNextWeekDate(startDate);

  document.getElementById("date-2").value = endDate.toISOString().split("T")[0];
  submit.disabled = false;
}

function handleMonthSelect() {
  const startDate = new Date(document.getElementById("date-1").value);
  const endDate = getNextMonthDate(startDate);

  document.getElementById("date-2").value = endDate.toISOString().split("T")[0];
  submit.disabled = false;
}

// ---------------------------------

function setToLocalStorage(text) {
  let history = JSON.parse(localStorage.getItem("history"));
  if (!history) {
    history = [];
  }
  history.unshift(text);
  localStorage.setItem("history", JSON.stringify(history));
}

// ----------------------------------------

function getFromLocalStorage() {
  let history = JSON.parse(localStorage.getItem("history"));
  if (history.length > 10) {
    history = history.slice(0, 10);
  }
  document.getElementById("history").innerHTML = "";

  for (let i = 0; i < history.length; i++) {
    const item = document.createElement("div");
    item.append(`${i + 1}. ${history[i]}`);
    document.getElementById("history").appendChild(item);
  }
}

// ----------------------------------------

addEventListener("DOMContentLoaded", function () {
  if (localStorage.getItem("history") !== null) {
    getFromLocalStorage();
  } else {
    document.querySelector(".content-history__title").style.display = "none";
  }
});
