export function isSameDay(date1, date2) {
  const d1 = new Date(date1);
  const d2 = new Date(date2);

  return (
    d1.getFullYear() === d2.getFullYear() &&
    d1.getMonth() === d2.getMonth() &&
    d1.getDate() === d2.getDate()
  );
}

export function getDaysBetween(start, end) {
  const dateArray = [];
  let currentDate = new Date(start);

  while (currentDate <= new Date(end)) {
    dateArray.push(currentDate.toISOString().split("T")[0]); // Format the date as 'YYYY-MM-DD'
    currentDate.setDate(currentDate.getDate() + 1); // Move to the next day
  }

  return dateArray;
}

// Example usage:
//const startDate = "2024-10-01";
//const endDate = "2024-10-07";
//console.log(getDaysBetween(startDate, endDate));
