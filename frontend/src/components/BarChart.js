import { useState } from 'react';
import axios from 'axios';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale } from 'chart.js';

// Register the necessary chart components
ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale);

function BarChart() {
  const [month, setMonth] = useState('11'); // Default month set to November (11)
  const [barData, setBarData] = useState([]);

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

  // Function to fetch bar chart data for the selected month
  const fetchBarChartData = async () => {
    try {
      // Sending request to the backend API with the month query parameter
      const response = await axios.get('http://localhost:4000/api/bar-chart', {
        params: { month },
      });

      // Set the received data to the barData state
      setBarData(response.data);
    } catch (error) {
      console.error('Error fetching bar chart data:', error);
    }
  };

  // Preparing chart data with labels (price ranges) and datasets (number of products sold)
  const chartData = {
    labels: barData.map(item => item.range), // Price range as labels
    datasets: [
      {
        label: 'Number of Products Sold',
        data: barData.map(item => item.count), // Product count as data
        backgroundColor: [
          '#FF0000', '#8A2BE2', '#FFC0CB', '#00FF00', '#0000FF', '#000000', '#FFA500',
        ],
        borderColor: '#333333',
        borderWidth: 1,
      },
    ],
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-cyan-200 text-black">
      <div className="p-8 rounded-lg shadow-lg w-full bg-[#f5f5dc] max-w-4xl">
        {/* Display the selected month name in the heading */}
        <h2 className="text-3xl font-bold mb-8 text-center">
          Bar Chart - Price Ranges {barData.length > 0 && `(${monthNames[month]})`}
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
            onClick={fetchBarChartData}
            className="bg-blue-700 hover:bg-blue-600 text-white p-2 rounded-md w-1/4 font-semibold transition-all duration-300 transform hover:scale-105"
          >
            Fetch Bar Chart Data
          </button>
        </div>

        {/* Bar Chart Display */}
        <div className="mt-6" style={{ width: '550px', height: '450px' }}>
          {barData.length > 0 ? (
            <Bar data={chartData} options={{ responsive: true, maintainAspectRatio: false }} />
          ) : (
            <p className="text-center">No data available. Please fetch data for a specific month.</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default BarChart;
