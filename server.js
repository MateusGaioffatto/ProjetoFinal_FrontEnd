import express from 'express';
import axios from 'axios';

const app = express();
const PORT = 3000;

app.use(express.json());

const api_key = '68ac826b2d7efaa2747a6cdd';
const url = 'https://api.scrapingdog.com/google_shopping/';

app.post('/api/search', async (req, res) => {
  const { query } = req.body;
  try {
    const params = {
      api_key: api_key,
      query: query,
      language: 'pt_br',
      country: 'br'
    };
    const response = await axios.get(url, { params });
    if (response.status === 200) {
      res.json(response.data);
    } else {
      res.status(response.status).json({ error: 'Request failed' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});