  import axios from 'axios';

  const api_key = '68ac826b2d7efaa2747a6cdd';
  const url = 'https://api.scrapingdog.com/google_shopping/';
  
  const params = {
    api_key: api_key,
    query: 'notebook acer',
    language: 'pt_br',
    country: 'br'
  };
  
  axios
    .get(url, { params: params })
    .then(function (response) {
      if (response.status === 200) {
        const data = response.data;
        console.log(data);
      } else {
        console.log('Request failed with status code: ' + response.status);
      }
    })
    .catch(function (error) {
      console.error('Error making the request: ' + error.message);
    });