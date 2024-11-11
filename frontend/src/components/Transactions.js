import { useState, useEffect } from 'react';
import axios from 'axios';

function Transactions() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [transactions, setTransactions] = useState([]);

  // Fetch transactions based on page, limit, and search criteria
  const fetchTransactions = async () => {
    try {
      const response = await axios.get('http://localhost:4000/api/transactions', {
        params: { page, limit: 10, search }, // limit is fixed to 10
      });
      setTransactions(response.data);
    } catch (error) {
      console.error('Error fetching transactions:', error);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, [page, search]); // Fetch data when page or search changes

  return (
    <div className="flex flex-col justify-center items-center min-h-screen bg-cyan-200 text-black">
      <div className="p-8 shadow-lg w-full max-w-6xl bg-cyan-100 overflow-x-auto flex flex-col items-center">
        <div className="bg-white rounded-full px-8 py-4 mb-8 w-15">
          <h2 className="text-3xl font-bold text-center">Transactions Dashboard</h2>
        </div>
        
        {/* Search Input */}
        <div className="flex w-full space-x-4 mb-6 justify-center">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by Title"
            className="border p-2 rounded-md w-1/2 focus:outline-none bg-white"
          />
        </div>

        {/* Transactions Table */}
        <table className="w-full text-left border-collapse bg-[#f5f5dc] rounded-lg">
          <thead>
            <tr className="border-b-2 border-black">
              <th className="p-4 border-r-2 border-black">ID</th>
              <th className="p-4 border-r-2 border-black">Title</th>
              <th className="p-4 border-r-2 border-black">Description</th>
              <th className="p-4 border-r-2 border-black">Price</th>
              <th className="p-4 border-r-2 border-black">Category</th>
              <th className="p-4 border-r-2 border-black">Sold</th>
              <th className="p-4">Date of Sale</th>
            </tr>
          </thead>
          <tbody>
            {transactions.length > 0 ? (
              transactions.map((transaction) => (
                <tr key={transaction._id} className="border-b border-black">
                  <td className="p-4 border-r-2 border-black">{transaction._id}</td>
                  <td className="p-4 border-r-2 border-black">{transaction.title}</td>
                  <td className="p-4 border-r-2 border-black">{transaction.description}</td>
                  <td className="p-4 border-r-2 border-black">${transaction.price.toFixed(2)}</td>
                  <td className="p-4 border-r-2 border-black">{transaction.category}</td>
                  <td className="p-4 border-r-2 border-black">{transaction.sold ? 'Yes' : 'No'}</td>
                  <td className="p-4">{new Date(transaction.dateOfSale).toLocaleDateString()}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7" className="p-4 text-center">No transactions found.</td>
              </tr>
            )}
          </tbody>
        </table>

        {/* Pagination Controls */}
        <div className="flex items-center justify-center mt-6 space-x-4">
          <button
            onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
            className="bg-cyan-700 text-white p-2 rounded-md font-semibold transition-all duration-300 transform"
          >
            Previous
          </button>
          <span className="font-semibold">Page: {page}</span>
          <button
            onClick={() => setPage((prev) => prev + 1)}
            className="bg-cyan-700 text-white p-2 rounded-md font-semibold transition-all duration-300 transform"
          >
            Next
          </button>
        </div>
        <p className="mt-4 text-center font-semibold">PerPage: 10</p>
      </div>
    </div>
  );
}

export default Transactions;
