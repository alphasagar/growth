const express = require('express');
const axios = require('axios');
const cheerio = require('cheerio');
const cors = require('cors');

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

const fetchData = async (url) => {
  try {
    const res = await axios.get(url);
    const $ = cheerio.load(res.data);

    const text = $('body').text();
    const words = text.trim().split(/\s+/);
    const wordCount = words.length;

    const links = [];
    $('a').each((index, element) => {
      const link = $(element).attr('href');
      if (link && link.startsWith('http')) {
        links.push(link);
      }
    });

    return { wordCount, links };
  } catch (error) {
    console.error('Error fetching data:', error);
    throw error;
  }
};

app.get('/count', async (req, res) => {
  const url = req.query.url;

  try {
    const { wordCount, links } = await fetchData(url);
    res.send({ wordCount, links });
  } catch (error) {
    console.error('Error checking word count:', error);
    res.status(500).send('Internal Server Error');
  }
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
