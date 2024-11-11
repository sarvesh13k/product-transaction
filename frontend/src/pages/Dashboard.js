import { Link } from 'react-router-dom';

function Dashboard() {
  return (
    <div className="flex flex-col items-center min-h-screen justify-center bg-[#f5f5dc] text-white">
    <h1 className="text-3xl font-extrabold text-[#04080f] mb-10">Roxiler MERN Stack Task - Sarvesh Kothule</h1>

      <div className="rounded-lg w-full max-w-2xl text-center">
        <h1 className="text-3xl font-extrabold text-[#04080f] mb-10">API Dashboard</h1>
        
        <div className="space-y-6">
          <Link 
            to="/transactions" 
            className="px-8 py-4 mr-3 bg-[#2563EB] hover:bg-[#0d3fca] text-white rounded-lg font-semibold transition-all duration-300 transform hover:scale-105"
          >
            Transactions
          </Link>
          
          <Link 
            to="/statistics" 
            className="px-8 py-4 mr-3 bg-[#16A34A] hover:bg-[#107a37] text-white rounded-lg font-semibold transition-all duration-300 transform hover:scale-105"
          >
            Statistics
          </Link>
          
          <Link 
            to="/pie-chart" 
            className="px-8 py-4 mr-3 bg-[#7C3AED] hover:bg-[#560fc9] text-white rounded-lg font-semibold transition-all duration-300 transform hover:scale-105"
          >
            Pie Chart
          </Link>
          
          <Link 
            to="/bar-chart" 
            className="px-8 py-4 bg-[#DC2626] hover:bg-[#aa0b0b] text-white rounded-lg font-semibold transition-all duration-300 transform hover:scale-105"
          >
            Bar Chart
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
