// import { createOllama } from 'ollama-ai-provider-v2';
// import { google } from '@ai-sdk/google';
import { Agent } from "@mastra/core/agent";
import { groq } from '@ai-sdk/groq';
import { searchSimilarProducts } from "../tools/vector-query-tool";

// const ollama = createOllama({
//   baseURL: "http://localhost:11434/api",
//   name: "ollama"
// });
// const modelOllama = ollama("mistral-nemo");

const fastModel = groq('llama-3.1-8b-instant');    // Dev/playground
const smartModel = groq('llama-3.3-70b-versatile');
// const modelGemini = google('gemini-2.5-flash-lite');

export const productRecommendationAgent = new Agent({
  id: 'product-recommendation-agent',
  name: 'Product Recommendation Agent',
  description:
    'Product recommendation agent for clothing and fashion that finds products in the catalog and prepares comprehensive recommendations when customer needs are clear and specific',
  model: smartModel,
  // No memory needed for stateless product recommendations
  defaultGenerateOptionsLegacy: {
    maxSteps: 10, // Allow multiple steps for tool calling and response generation
    temperature: 0.1,
  },
  instructions: `You are a fashion recommendation agent. Your job is to:
1. Call searchSimilarProducts tool with semantic query based on user's needs
2. Return ONLY valid JSON with top 3 products
3. Add a brief "reason" field explaining why each product matches

CRITICAL: Return ONLY valid JSON with this structure:
{
  "recommendedProducts": [
    {
      "id": "from_tool",
      "name": "from_tool", 
      "price": "from_tool",
      "categories": "from_tool",
      "productUrl": "from_tool",
      "reason": "Brief explanation why it matches user needs"
    }
  ]
}

Examples:
- "casual summer outfit" → Call: searchSimilarProducts(queryText="casual summer comfortable clothing", topK=3)
- "formal wear" → Call: searchSimilarProducts(queryText="formal elegant clothing", topK=3)
- "gym clothes" → Call: searchSimilarProducts(queryText="athletic sportswear gym", topK=3)

NEVER write long descriptions. Keep "reason" to 1 short sentence per product.
If tool returns empty: {"recommendedProducts": []}`,
  tools: { searchSimilarProducts },
});
