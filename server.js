const express = require('express');
const winston = require('winston');
const app = express();
const port = 3000;

// Configure Winston logger
const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({ filename: 'logs/app.log' })
  ]
});

// Middleware to log all requests
app.use((req, res, next) => {
  logger.info(`${req.method} ${req.url}`, {
    ip: req.ip,
    headers: req.headers
  });
  next();
});

// Health check endpoint
app.get('/health', (req, res) => {
  logger.info('Health check endpoint called');
  res.status(200).json({ status: 'healthy', uptime: process.uptime() });
});

// Sample data endpoint
app.get('/api/data', (req, res) => {
  logger.info('Data endpoint called');
  res.json({
    id: 1,
    name: 'Sample Data',
    timestamp: new Date().toISOString()
  });
});

// Sample error endpoint
app.get('/api/error', (req, res) => {
  logger.error('Error endpoint triggered');
  res.status(500).json({ error: 'Internal Server Error' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  logger.error('Unhandled error', { error: err.message, stack: err.stack });
  res.status(500).json({ error: 'Something went wrong' });
});

app.listen(port, () => {
  logger.info(`Server running on port ${port}`);
});