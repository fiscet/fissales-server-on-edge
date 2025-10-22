import { groq } from "@ai-sdk/groq";
import { Agent } from "@mastra/core/agent";
import { searchProductsOnMeta } from "../tools/vector-query-tool";
import { memory } from "../utils/memory";

const fastModel = groq('llama-3.1-8b-instant');    // Dev/playground
const smartModel = groq('llama-3.3-70b-versatile');

export const productSearchAgent = new Agent({
  id: 'product-search-agent',
  name: 'Product Search Agent',
  description: 'Product search agent that finds products in the catalog',
  memory: ({ runtimeContext }) => memory(runtimeContext),
  instructions: `You are a product search specialist.
Given search parameters, find products using the search tool.
Extract from user intent:
- query: main search term
- category: product category (optional)
- priceMin, priceMax: price filters (optional)

Always provide clear product listings with names, prices, and categories.

When ready return (MAXIMUM 3 products) in JSON format:
   JSON:
   {
     "recommendedProducts": [
       {
         "id": "product_id",
         "name": "product name",
         "price": "price",
         "features": ["key features"],
         "benefits": ["why perfect for customer"],
         "availability": "in stock/limited/out of stock",
         "productUrl": "https://example.com/product-url",
         "imageUrl": "https://example.com/image-url"
       }
     ]
   }

If no results, suggest alternatives.`,
  model: process.env.NODE_ENV === 'production' ? smartModel : fastModel,
  tools: { searchProductsOnMeta },
});