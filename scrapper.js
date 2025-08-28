import fetch from 'node-fetch'; // Install node-fetch if in Node.js
const SERPAPI_KEY = '543a9ea4ca184a23ac9e6dcb0b78ff0273df4697a53551c1fe9ff0b2f820c9f5'; // Replace with your actual API key

async function getGoogleShoppingData(searchInputText) {
        const apiUrl = `https://serpapi.com/search?engine=google_shopping&q=${encodeURIComponent(query)}&api_key=${SERPAPI_KEY}`;

    try {
        const response = await fetch(apiUrl);
        const data = await response.json();
        return data.shopping_results; // Or adjust based on the specific API's JSON structure
    } catch (error) {
        console.error('Error fetching Google Shopping data:', error);
        return null;
    }
}

// Usage example

getGoogleShoppingData(searchTerm)
    .then(results => {
        if (results) {
            console.log('Google Shopping Results:', results);
            // Process the results further as needed
        }
    });