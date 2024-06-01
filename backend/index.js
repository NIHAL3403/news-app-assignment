const express = require('express');
const axios = require('axios');
const NodeCache = require('node-cache');
const cors = require('cors');
require('dotenv').config();

const app = express();
const cache = new NodeCache({ stdTTL: 600 }); // Cache for 10 minutes

app.use(cors());

app.get('/api/news', async (req, res) => {
  const apiKey = process.env.NEWS_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: 'API key is missing or invalid' });
  }

  const cachedData = cache.get('news');
  if (cachedData) {
    return res.json(cachedData);
  }

  try {
    const response = await axios.get(`https://newsapi.org/v2/top-headlines?country=us&apiKey=${apiKey}`);
    cache.set('news', response.data);
    res.json(response.data);
  } catch (error) {
    console.error('Error fetching news headlines:', error);
    res.status(500).json({ error: 'Error fetching news headlines' });
  }
});

const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

server.on('error', (error) => {
  if (error.code === 'EADDRINUSE') {
    console.error(`Port ${PORT} is already in use.`);
    process.exit(1); // Exit the process to avoid further issues
  } else {
    console.error('Server error:', error);
  }
});
