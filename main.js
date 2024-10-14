import Chart from "chart.js/auto";
import { isSameDay, getDaysBetween } from "./my-modules/datestuff.js";
import { data } from "./data.js";

//document.querySelector('#data-container').textContent = JSON.stringify(data)

const canv = document.querySelector("#chart-canvas");
const div = document.querySelector("#data-container");
const pre = document.querySelector("#preform");

const totalPts = getSumStoryPoints(data);

const sortedData = sortByDate(data);

let dataPoints = [];

const days = getDaysBetween("2024-9-8", "2024-11-10");

const sumPointsPerDay = [];
for (const day of days) {
  let daySum = 0;
  for (const task of sortedData) {
    if (new Date(task["End Date"]) >= new Date(day)) {
      daySum += task["Story Points"];
    }
    if (!task["End Date"]) {
      daySum += task["Story Points"];
    }
  }
  if (new Date(day) > new Date("2024-10-14")) {
    daySum = 0;
  }
  if (daySum > 0) {
    sumPointsPerDay.push(daySum);
  }
}

const elapsedDays = getDaysBetween("2024-09-07", "2024-10-14");
const ptsCompleted = totalPts - 560;
const averagePointsPerDay = ptsCompleted / elapsedDays.length;

const averagedBurnRate = [1180];
for (let i = 1; i < days.length; i++) {
  averagedBurnRate[i] = averagedBurnRate[i - 1] - averagePointsPerDay;
}

const daysOfAdjusted = getDaysBetween("2024-09-26", "2024-10-15");
const adjustedAveragePointsPerDay = ptsCompleted / daysOfAdjusted.length;
const adjustedAverageBurnRate = [1180];
for (const day of getDaysBetween("2024-09-07", "2024-09-24")) {
  adjustedAverageBurnRate.push(null);
}
let countAdjustedDays = 0;
while((1180 - countAdjustedDays * adjustedAveragePointsPerDay) > 0) {
  adjustedAverageBurnRate.push(
    1180 - countAdjustedDays * adjustedAveragePointsPerDay,
  );
  countAdjustedDays++;
}
let allowance = 0
const daysLeft = getDaysBetween("2024-10-13", "2024-11-10");
for (const day of daysLeft) { 
	allowance += adjustedAveragePointsPerDay
}
console.log(allowance)


const idealBurnRate = totalPts / days.length;
const idealDataPoints = [totalPts];

for (let i = 1; i <= days.length; i++) {
  idealDataPoints.push(idealDataPoints[i - 1] - idealBurnRate);
}

new Chart(canv, {
  type: "bar",
  data: {
    labels: days,
    datasets: [
      {
        label: "Uncompleted Story Points ",
        data: sumPointsPerDay,
        borderWidth: 1,
      },
      {
        label: "Actual Burn Rate",
        data: sumPointsPerDay,
        borderWidth: 1,
        type: "line",
      },
      {
        label: "Ideal Burn Rate",
        data: idealDataPoints,
        type: "line",
      },
      {
        label: "Averaged Projected Burn Rate",
        data: averagedBurnRate,
        type: "line",
      },
      {
        label: "Adjusted Average Burn Rate",
        data: adjustedAverageBurnRate,
        type: "line",
      },
    ],
  },
  options: {
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  },
});

function getSumStoryPoints(data) {
  let sum = 0;
  for (const task of data) {
    sum = sum + task["Story Points"];
  }
  return sum;
}

function sortByDate(data) {
  return data.toSorted((a, b) => {
    if (!a["End Date"] && !b["End Date"]) return 0; // If both dates are empty, keep original order
    if (!a["End Date"]) return 1; // Push items with empty date to the end
    if (!b["End Date"]) return -1; // Keep non-empty dates before empty ones
    return new Date(a["End Date"]) - new Date(b["End Date"]);
  });
}
