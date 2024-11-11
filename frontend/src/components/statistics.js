import { useState, useEffect } from 'react';
import axios from 'axios';

function Statistics() {
  const [month, setMonth] = useState('11'); // Default month set to November (11)
  const [stats, setStats] = useState(null);

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

  // Function to fetch statistics for the selected month
  const fetchStatistics = async () => {
    try {
      const response = await axios.get('http://localhost:4000/api/statistics', {
        params: { month },
      });
      setStats(response.data);
    } catch (error) {
      console.error('Fetch error:', error);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-cyan-200 text-black">
      <div className="p-8 rounded-lg shadow-lg w-full bg-cyan-100 max-w-4xl">
        {/* Display the selected month name in the heading */}
        <h2 className="text-3xl font-bold mb-8 text-center">
          Statistics {stats && `- ${monthNames[month]}`}
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
            onClick={fetchStatistics}
            className="bg-blue-700 hover:bg-blue-600 text-white p-2 rounded-md w-1/4 font-semibold transition-all duration-300 transform hover:scale-105"
          >
            Fetch Statistics
          </button>
        </div>

        {/* Statistics Display */}
        {stats && (
          <div className="bg-[#f5f5dc] text-black p-6 rounded-lg mt-4 w-21">
            <div className="space-y-4">
              <div className="p-4">
                <h4 className="text-xl font-semibold">Total Sales</h4>
                <p className="text-lg mt-2">${stats.totalSales.toFixed(2)}</p>
              </div>
              <div className="p-4">
                <h4 className="text-xl font-semibold">Sold Items</h4>
                <p className="text-lg mt-2">{stats.soldItems}</p>
              </div>
              <div className="p-4">
                <h4 className="text-xl font-semibold">Not Sold Items</h4>
                <p className="text-lg mt-2">{stats.notSoldItems}</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Statistics;
