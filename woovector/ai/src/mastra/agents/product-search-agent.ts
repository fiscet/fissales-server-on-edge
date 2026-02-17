import { groq } from "@ai-sdk/groq";
import { Agent } from "@mastra/core/agent";
import { searchProductsOnMeta } from "../tools/vector-query-tool";

const fastModel = groq('llama-3.1-8b-instant');    // Dev/playground
const smartModel = groq('llama-3.3-70b-versatile');

export const productSearchAgent = new Agent({
  id: 'product-search-agent',
  name: 'Product Search Agent',
  description: 'Product search agent that finds specific clothing products in the catalog using structured search',
  // No memory needed for stateless product search
  defaultGenerateOptionsLegacy: {
    maxSteps: 5,
    temperature: 0.1, // More deterministic
  },
  instructions: `You are a product search agent. Your ONLY job is to:
1. Call searchProductsOnMeta tool with the search query
2. Return EXACTLY the tool result as JSON - DO NOT describe or explain products
3. Limit to top 3 products max

CRITICAL: Return ONLY valid JSON with this structure:
{
  "products": [
    {"id": "...", "name": "...", "price": "...", "categories": [...], "productUrl": "..."}
  ]
}

Examples:
- Query: "V-Neck T-Shirt" → Call: searchProductsOnMeta(queryText="V-Neck T-Shirt", topK=3)
- Query: "blue dress" → Call: searchProductsOnMeta(queryText="blue dress", topK=3)

NEVER write descriptions or explanations. ONLY return the JSON object with products array.
If tool returns empty: {"products": []}`,
  model: process.env.NODE_ENV === 'production' ? smartModel : fastModel,
  tools: { searchProductsOnMeta },
});