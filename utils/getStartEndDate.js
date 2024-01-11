const getStartEndDate = (range) => {

  const selectedOption = range; // Replace with user-selected option

  const currentDate = new Date();
  let startDate, endDate;

  if (selectedOption === "daily") {
    startDate = new Date(currentDate);
    startDate.setDate(currentDate.getDate() - 7); // Past 7 days including the current day
    endDate = new Date(currentDate);
    endDate.setDate(currentDate.getDate()); // Up to and including the current day
  } else if (selectedOption === "weekly") {
    startDate = new Date(currentDate);
    startDate.setDate(currentDate.getDate() - 27); // Past 28 days (4 weeks)
    endDate = new Date(currentDate);
    endDate.setDate(currentDate.getDate() + 1); // Up to and including the current day
  } else if (selectedOption === "monthly") {
    startDate = new Date(currentDate.getFullYear(), currentDate.getMonth() - 3, 1); // Start of the fourth previous month
    endDate = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1); // Start of the next month
  }

  return [startDate, endDate]
};

export default getStartEndDate;
