const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const transactionRoutes = require('./routes/transactions');

const app = express();
app.use(cors());
app.use(express.json());

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/product_transactions', { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.log('MongoDB connection error: ', err));

// Use routes
app.use('/api', transactionRoutes);

// Start server
const PORT =4000;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
