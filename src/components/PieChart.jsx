import React from "react";
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";

// Register the required elements
ChartJS.register(ArcElement, Tooltip, Legend);

const PieChart = ({ data }) => {
  const labels = Object.keys(data); // Extract the status labels
  const counts = Object.values(data); // Extract the counts for each status

  // Define a color map for specific statuses
  const colorMap = {
    pending: "#f1c40f", // Yellow
    rejected: "#e74c3c", // Red
    interviewing: "#2ecc71", // Light blue
    offer: "#27ae60", // Green
    unknown: "#7f8c8d", // Grey
  };

  // Get colors based on the status, using the color map
  const backgroundColors = labels.map(
    (status) => colorMap[status.toLowerCase()] || colorMap.unknown
  );
  const hoverBackgroundColors = backgroundColors.map((color) => color);

  const chartData = {
    labels: labels.map((status) => `${status} (${data[status]})`), // Display status with count
    datasets: [
      {
        data: counts,
        backgroundColor: backgroundColors,
        hoverBackgroundColor: hoverBackgroundColors,
      },
    ],
  };

  return <Pie data={chartData} />;
};

export default PieChart;
