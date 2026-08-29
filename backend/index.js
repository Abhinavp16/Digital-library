require('dotenv').config();
const express = require('express');
const cors = require('cors');
const redis = require('redis');
const app = express();
const port = process.env.PORT || 3000;

const client = redis.createClient({ url: process.env.REDIS_URL || 'redis://localhost:6379' }); // Create a Redis client (redis v4 promise API)

app.use(cors());
app.use(express.json());

// Middleware to increment visitor count on each request
app.use(async (req, res, next) => {
  try {
    await client.incr('visitorCount');
    next();
  } catch (err) {
    console.error('Error incrementing visitor count:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.get('/api/visitors/count', async (req, res) => {
  try {
    const count = await client.get('visitorCount');
    res.json({ count: parseInt(count) || 0 });
  } catch (err) {
    console.error('Error fetching visitor count:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

const studentsRoutes = require('./routes/studentsRoutes');
const teacherRoutes = require('./routes/teacherRoutes');
const contentRoutes = require('./routes/contentRoutes');
const bookRoutes = require('./routes/bookRoutes');
const studentLogin = require('./routes/studentLogin');
const teacherLogin = require('./routes/teacherLogin');
const adminLogin = require('./routes/adminLogin');

app.use('/api/books', bookRoutes);
app.use('/api/content', contentRoutes);
app.use('/api/teachers', teacherRoutes);
app.use('/api/students', studentsRoutes);
app.use('/api/studentlogin', studentLogin);
app.use('/api/teacherlogin', teacherLogin);
app.use('/api/adminlogin', adminLogin);

async function start() {
  try {
    client.on('error', (err) => console.error('Redis Client Error:', err));
    await client.connect();
    console.log('Connected to Redis');

    app.listen(port, () => {
      console.log(`Server is running on port ${port}`);
    });
  } catch (err) {
    console.error('Failed to start server:', err);
    process.exit(1);
  }
}

start();
