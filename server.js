// Budget API (MongoDB + Mongoose)

const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const path = require('path');
const BudgetItem = require('./models/BudgetItem');

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Serve static frontend
app.use('/', express.static(path.join(__dirname, 'public')));

// MongoDB connection
const mongoUri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/personal_budget';
mongoose.connect(mongoUri, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.error('MongoDB connection error:', err));

// GET /budget - return all budget items
app.get('/budget', async (req, res) => {
    try {
        const items = await BudgetItem.find().lean();
        // Returning in same shape as previous frontend expects
        res.json({ myBudget: items.map(i => ({ title: i.title, budget: i.value, color: i.color })) });
    } catch (err) {
        console.error('Error fetching budget items:', err);
        res.status(500).json({ error: 'Error fetching budget data' });
    }
});

// POST /budget - add new budget item
app.post('/budget', async (req, res) => {
    try {
        const { title, value, color } = req.body;
        const item = new BudgetItem({ title, value, color });
        await item.save();
        res.status(201).json(item);
    } catch (err) {
        console.error('Error saving budget item:', err);
        res.status(400).json({ error: err.message });
    }
});

app.listen(port, () => {
    console.log(`API served at http://localhost:${port}`);
});