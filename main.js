import Chart from "chart.js/auto";
import { isSameDay, getDaysBetween } from "./my-modules/datestuff.js";
import { data } from "./data.js";

//document.querySelector('#data-container').textContent = JSON.stringify(data)

const canv = document.querySelector("#chart-canvas");
const div = document.querySelector("#data-container");
const pre = document.querySelector("#preform");

const totalPts = getSumStoryPoints(data);

const sortedData = sortByDate(data);
for (let i=0; i < sortedData.length; i++) {
  sortedData[i]["Story Points"] = parseInt(sortedData[i]["Story Points"])
}

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

  if (new Date(day) > new Date("2024-10-28")) {
    daySum = 0;
  }
  if (daySum > 0) {
    sumPointsPerDay.push(daySum);
  }
}

const elapsedDays = getDaysBetween("2024-09-07", "2024-10-28");
const ptsCompleted = totalPts - 530;
const averagePointsPerDay = ptsCompleted / elapsedDays.length;
console.log("average pts per day: ", averagePointsPerDay)

const averagedBurnRate = [1850];
for (let i = 1; i < days.length; i++) {
  averagedBurnRate[i] = averagedBurnRate[i - 1] - averagePointsPerDay;
}

const daysOfAdjusted = getDaysBetween("2024-09-26", "2024-10-28");
const adjustedAveragePointsPerDay = ptsCompleted / daysOfAdjusted.length;
console.log("adjustedAveragePointsPerDay: ", adjustedAveragePointsPerDay)
const adjustedAverageBurnRate = [1810	];
for (const day of getDaysBetween("2024-09-07", "2024-09-24")) {
  adjustedAverageBurnRate.push(null);
}
let countAdjustedDays = 0;
while (1810	 - countAdjustedDays * adjustedAveragePointsPerDay > 0) {
  adjustedAverageBurnRate.push(
    1810	 - countAdjustedDays * adjustedAveragePointsPerDay,
  );
  countAdjustedDays++;
}
let allowance = 0;
const daysLeft = getDaysBetween("2024-10-28", "2024-11-10");
for (const day of daysLeft) {
  allowance += adjustedAveragePointsPerDay;
}

const idealBurnRate = totalPts / days.length;
const idealDataPoints = [totalPts];

for (let i = 1; i <= days.length; i++) {
  idealDataPoints.push(idealDataPoints[i - 1] - idealBurnRate);
}

const luxes = []

for (const day of days) {
  luxes.push(190)
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
      // {
      //   label: "Luxury points",
      //   data: luxes,
      // }
      
    ],
  },
  options: {
    scales: {
      x: {
        stacked: true
      },
      y: {
        beginAtZero: true,
        stacked: false
      },
    },
  },
});

function getSumStoryPoints(data) {
  let sum = 0;
  for (const task of data) {
      sum = sum + parseInt(task["Story Points"]);
    
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
