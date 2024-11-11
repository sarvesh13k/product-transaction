import { useState } from 'react';
import axios from 'axios';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, Title, Tooltip, Legend, ArcElement, CategoryScale, LinearScale } from 'chart.js';

// Register the necessary chart components
ChartJS.register(Title, Tooltip, Legend, ArcElement, CategoryScale, LinearScale);

function PieChart() {
  const [month, setMonth] = useState('11'); // Default month set to November (11)
  const [chartData, setChartData] = useState(null);

  // Month names mapping
  const monthNames = {
    '01': 'January',
    '02': 'February',
    '03': 'March',
    '04': 'April',
    '05': 'May',
    '06': 'June',
    '07': 'July',
    '08': 'August',
    '09': 'September',
    '10': 'October',
    '11': 'November',
    '12': 'December',
  };

  // Function to fetch pie chart data for the selected month
  const fetchPieChartData = async () => {
    try {
      // Sending request to the backend API with the month query parameter
      const response = await axios.get('http://localhost:4000/api/pie-chart', {
        params: { month },
      });

      // Extract the category data from the response
      const categories = response.data;

      // Define the chart data structure
      setChartData({
        labels: categories.map(category => category._id), // Category names as labels
        datasets: [
          {
            data: categories.map(category => category.count), // Category counts as data
            backgroundColor: [
              '#FF0000', // Red
              '#8A2BE2', // Violet
              '#FFC0CB', // Pink
              '#00FF00', // Green
              '#0000FF', // Blue
              '#000000', // Black
              '#FFA500', // Orange
            ],
            hoverOffset: 4,
          },
        ],
      });
    } catch (error) {
      console.error('Error fetching pie chart data:', error);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-cyan-200 text-black">
      <div className="p-8 rounded-lg shadow-lg w-full bg-[#f5f5dc] max-w-4xl">
        {/* Display the selected month name in the heading */}
        <h2 className="text-3xl font-bold mb-8 text-center">
          Pie Chart {chartData && `- ${monthNames[month]}`}
        </h2>

        {/* Dropdown and Button */}
        <div className="flex space-x-4 mb-6 justify-center">
          <select
            value={month}
            onChange={(e) => setMonth(e.target.value)}
            className="border p-2 rounded-md w-1/4 bg-white text-black focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {/* Month options */}
            {Object.entries(monthNames).map(([key, name]) => (
              <option key={key} value={key}>
                {name}
              </option>
            ))}
          </select>
          <button
            onClick={fetchPieChartData}
            className="bg-blue-700 hover:bg-blue-600 text-white p-2 rounded-md w-1/4 font-semibold transition-all duration-300 transform hover:scale-105"
          >
            Fetch Pie Chart
          </button>
        </div>

        {/* Pie Chart Display */}
        {chartData && (
          <div className="mt-4 flex justify-center items-center" style={{ width: '450px', height: '450px' }}>
            <Pie data={chartData} />
          </div>
        )}
      </div>
    </div>
  );
}

export default PieChart;
