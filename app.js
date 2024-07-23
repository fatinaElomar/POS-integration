// require("dotenv").config();
// const Shopify = require("shopify-api-node");
// const shopify = new Shopify({
//   shopName: process.env.SHOPIFY_STORE_URL,
//   apiKey: process.env.SHOPIFY_API_KEY,
//   password: process.env.SHOPIFY_ACCESS_TOKEN,
// });
// // Example function to fetch products
// async function fetchProducts() {
//   try {
//     const products = await shopify.product.list();
//     console.log(products);
//   } catch (error) {
//     console.error(error);
//   }
// }
// fetchProducts();
require('dotenv').config();
const Shopify = require('shopify-api-node');
const https = require('https');

// Initialize Shopify client
const shopify = new Shopify({
  shopName: process.env.SHOPIFY_STORE_URL,
  apiKey: process.env.SHOPIFY_API_KEY,
  password: process.env.SHOPIFY_ACCESS_TOKEN,
});

// Function to fetch products from Shopify
async function fetchShopifyProducts() {
  try {
    const products = await shopify.product.list();
    return products;
  } catch (error) {
    console.error('Error fetching Shopify products:', error);
    return null;
  }
}

// Function to fetch data from Loyvers
function fetchLoyversData(endpoint) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'api.loyverse.com',
      path: `/v1.0/${endpoint}`,
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${process.env.LOYVERS_BearerToken}`,
      },
    };

    const req = https.request(options, (res) => {
      let data = '';

      res.on('data', (chunk) => {
        data += chunk;
      });

      res.on('end', () => {
        try {
          const parsedData = JSON.parse(data);
          resolve(parsedData);
        } catch (error) {
          reject('Error parsing Loyvers data:', error);
        }
      });
    });

    req.on('error', (error) => {
      reject('Error fetching Loyvers data:', error);
    });

    req.end();
  });
}

// Function to fetch and combine data
async function fetchAndCombineData() {
  try {
    // Fetch data from Shopify
    const shopifyProducts = await fetchShopifyProducts();

    // Fetch data from Loyvers (using 'items' endpoint as an example)
    const loyversData = await fetchLoyversData('items');

    // Pretty-print the combined data
    console.log('Shopify Products:', JSON.stringify(shopifyProducts, null, 2));
    console.log('Loyvers Data:', JSON.stringify(loyversData, null, 2));

    // Optionally log specific details
    console.log('Loyvers Data Items (First 5):', JSON.stringify(loyversData.items.slice(0, 5), null, 2)); // Log the first 5 items
    console.log('Loyvers Data Cursor:', loyversData.cursor);

  } catch (error) {
    console.error('Error combining data:', error);
  }
}

// Run the function
fetchAndCombineData();
