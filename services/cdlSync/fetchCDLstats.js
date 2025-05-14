const axios = require('axios');

async function fetchCDLStats() {
  const url = 'https://cdl-other-services.abe-arsfutura.com/production/v2/content-types/score-strip-list/blt458f482d8abb09e4';

  const params = {
    locale: 'en-us',
    options: JSON.stringify({
      siteOrigin: 'callofdutyleague.com'
    })
  };

  const headers = {
    'Origin': 'https://www.callofdutyleague.com',
    'Referer': 'https://www.callofdutyleague.com/',
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/135.0.0.0 Safari/537.36 Edg/135.0.0.0',
    'Accept': '*/*',
    'Accept-Language': 'en-US,en;q=0.9',
    'x-origin': 'callofdutyleague.com'
  };

  try {
    const response = await axios.get(url, { params, headers });
    return response.data;
  } catch (error) {
    console.error('❌ Error:', error.response?.status, error.response?.data || error.message);
    throw error;
  }
}

module.exports = fetchCDLStats;
