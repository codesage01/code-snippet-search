require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');

const snippetsRouter = require('./routes/snippets');
const aiRouter = require('./routes/ai');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/snippets', snippetsRouter);
app.use('/api/search', require('./routes/search'));
app.use('/api/ai', aiRouter);

// Health check
app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// 404 handler
app.use((req, res) => {
    res.status(404).json({ success: false, message: 'Route not found' });
});

// Error handler
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ success: false, message: 'Internal Server Error' });
});

const PORT = process.env.PORT || 5000;

let server;
if (require.main === module) {
    connectDB().then(() => {
        server = app.listen(PORT, () => {
            console.log(`🚀 Server running on http://localhost:${PORT}`);
        });
    });
}

module.exports = { app };
