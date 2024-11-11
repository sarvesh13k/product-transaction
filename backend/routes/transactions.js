const express = require('express');
const axios = require('axios');
const Transaction = require('../models/transaction');
const router = express.Router();

// Route to initialize database with third-party data
router.get('/initialize', async (req, res) => {
    try {
        const response = await axios.get('https://s3.amazonaws.com/roxiler.com/product_transaction.json');
        const data = response.data;

        // Save data to MongoDB
        const transactions = data.map(item => ({
            title: item.title,
            description: item.description,
            price: item.price,
            category: item.category,
            dateOfSale: new Date(item.dateOfSale),
            sold: item.sold
        }));

        await Transaction.insertMany(transactions);
        res.status(200).json({ message: 'Database initialized successfully!' });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching data', error: error.message });
    }
});

// Route to list transactions with pagination and search
        // Build the search query
        router.get('/transactions', async (req, res) => {
            const { page = 1, limit = 10, search = '' } = req.query;
        
            try {
                const query = {
                    $or: [
                        { title: { $regex: search, $options: 'i' } },
                        { description: { $regex: search, $options: 'i' } }
                    ]
                };
        
                if (!isNaN(parseFloat(search))) {
                    query.$or.push({ price: parseFloat(search) });
                }
        
                console.log('Query:', JSON.stringify(query));  // Log query to check conditions
        
                const transactions = await Transaction.find(query)
                    .skip((page - 1) * limit)
                    .limit(parseInt(limit));
        
                console.log('Transactions found:', transactions);  // Log fetched transactions
        
                res.status(200).json(transactions);
            } catch (error) {
                res.status(500).json({ message: 'Error fetching transactions', error: error.message });
            }
        });
        

// Route to get statistics for a specific month

// Route to get statistics for a specific month
// Route to get statistics for a specific month
router.get('/statistics', async (req, res) => {
    const { month } = req.query;

    // Use the year based on the first record in the collection (assuming all records are in the same year)
    const sampleRecord = await Transaction.findOne().sort({ dateOfSale: 1 });
    const year = sampleRecord ? sampleRecord.dateOfSale.getFullYear() : 2021; // Default to 2021 if no data

    const startDate = new Date(`${year}-${month}-01T00:00:00.000Z`);
    const endDate = new Date(`${year}-${month}-01T00:00:00.000Z`);
    endDate.setMonth(endDate.getMonth() + 1);

    try {
        const totalSales = await Transaction.aggregate([
            { $match: { dateOfSale: { $gte: startDate, $lt: endDate } } },
            { $group: { _id: null, total: { $sum: '$price' }, count: { $sum: 1 } } }
        ]);

        const soldItems = await Transaction.aggregate([
            { $match: { dateOfSale: { $gte: startDate, $lt: endDate }, sold: true } },
            { $count: 'sold' }
        ]);

        const notSoldItems = await Transaction.aggregate([
            { $match: { dateOfSale: { $gte: startDate, $lt: endDate }, sold: false } },
            { $count: 'notSold' }
        ]);

        res.status(200).json({
            totalSales: totalSales[0]?.total || 0,
            soldItems: soldItems[0]?.sold || 0,
            notSoldItems: notSoldItems[0]?.notSold || 0
        });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching statistics', error: error.message });
    }
});


// Route for bar chart data (price ranges)
router.get('/bar-chart', async (req, res) => {
    const { month } = req.query;

    // Get a sample record to determine the correct year
    const sampleRecord = await Transaction.findOne().sort({ dateOfSale: 1 });
    const year = sampleRecord ? sampleRecord.dateOfSale.getFullYear() : 2021; // Default to 2021 if no data

    // Define start and end date for the month using the correct year
    const startDate = new Date(`${year}-${month}-01T00:00:00.000Z`);
    const endDate = new Date(startDate);
    endDate.setMonth(endDate.getMonth() + 1); // Set end date to the start of the next month

    try {
        const priceRanges = [
            { min: 0, max: 100 },
            { min: 101, max: 200 },
            { min: 201, max: 300 },
            { min: 301, max: 400 },
            { min: 401, max: 500 },
            { min: 501, max: 600 },
            { min: 601, max: 700 },
            { min: 701, max: 800 },
            { min: 801, max: 900 },
            { min: 901, max: Infinity }
        ];

        const data = await Promise.all(priceRanges.map(async (range) => {
            const count = await Transaction.countDocuments({
                price: { $gte: range.min, $lte: range.max },
                dateOfSale: { $gte: startDate, $lt: endDate }
            });
            return { range: `${range.min} - ${range.max}`, count };
        }));

        res.status(200).json(data);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching bar chart data', error: error.message });
    }
});

// Route for pie chart data (categories)
router.get('/pie-chart', async (req, res) => {
    const { month } = req.query;

    // Get a sample record to determine the correct year
    const sampleRecord = await Transaction.findOne().sort({ dateOfSale: 1 });
    const year = sampleRecord ? sampleRecord.dateOfSale.getFullYear() : 2021; // Default to 2021 if no data

    // Define start and end date for the month using the correct year
    const startDate = new Date(`${year}-${month}-01T00:00:00.000Z`);
    const endDate = new Date(startDate);
    endDate.setMonth(endDate.getMonth() + 1); // Set end date to the start of the next month

    try {
        const categories = await Transaction.aggregate([
            { $match: { dateOfSale: { $gte: startDate, $lt: endDate } } },
            { $group: { _id: '$category', count: { $sum: 1 } } }
        ]);

        res.status(200).json(categories);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching pie chart data', error: error.message });
    }
});

router.get('/combined-data', async (req, res) => {
    const { month, page = 1, limit = 10, search = '' } = req.query;

    try {
        // Define base URL
        const baseUrl = 'http://localhost:4000/';

        // Send concurrent requests to all three APIs
        const [transactionsRes, statisticsRes, barChartRes, pieChartRes] = await Promise.all([
            axios.get(`${baseUrl}/transactions`, { params: { page, limit, search } }),
            axios.get(`${baseUrl}/statistics`, { params: { month } }),
            axios.get(`${baseUrl}/bar-chart`, { params: { month } }),
            axios.get(`${baseUrl}/pie-chart`, { params: { month } })
        ]);

        // Combine responses
        const combinedData = {
            transactions: transactionsRes.data,
            statistics: statisticsRes.data,
            barChart: barChartRes.data,
            pieChart: pieChartRes.data
        };

        res.status(200).json(combinedData);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching combined data', error: error.message });
    }
});

module.exports = router;
