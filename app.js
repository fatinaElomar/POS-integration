require("dotenv").config();
const Shopify = require("shopify-api-node");
const shopify = new Shopify({
  shopName: process.env.SHOPIFY_STORE_URL,
  apiKey: process.env.SHOPIFY_API_KEY,
  password: process.env.SHOPIFY_ACCESS_TOKEN,
});
// Example function to fetch products
async function fetchProducts() {
  try {
    const products = await shopify.product.list();
    console.log(products);
  } catch (error) {
    console.error(error);
  }
}
fetchProducts();
