// import { createOllama } from 'ollama-ai-provider-v2';
// import { google } from '@ai-sdk/google';
import { Agent } from "@mastra/core/agent";
import { groq } from '@ai-sdk/groq';
import { Memory } from "@mastra/memory";
import { LibSQLStore } from "@mastra/libsql";
import { productSearchTool } from "../tools/vector-query-tool";

// const ollama = createOllama({
//   baseURL: "http://localhost:11434/api",
//   name: "ollama"
// });
// const modelOllama = ollama("mistral-nemo");

const fastModel = groq('llama-3.1-8b-instant');    // Dev/playground
const smartModel = groq('llama-3.3-70b-versatile');
// const modelGemini = google('gemini-2.5-flash-lite');

export const productRagAgent = new Agent({
  name: "productRagAgent",
  description:
    'Pre-sales agent that researches products and prepares comprehensive recommendations for the sales agent when customer needs are clear and specific',
  model: process.env.NODE_ENV === 'production' ? smartModel : fastModel,
  memory: new Memory({
    storage: new LibSQLStore({
      url: "file:../../memory.db"
    })
  }),
  defaultGenerateOptions: {
    maxSteps: 10, // Allow multiple steps for tool calling and response generation
  },
  instructions: `
  You are a pre-sales agent for FisShop. Your role is to research products and prepare comprehensive recommendations for the sales agent when customer needs are clear and specific.

**YOUR MISSION:**
1. **Research Products** - Use available tools to find relevant products
2. **Match Requirements** - Ensure products align with customer's specific needs
3. **Prepare Sales Package** - Create comprehensive JSON for sales agent handoff

**YOUR PROCESS:**

1. **Product Research:**
   - ALWAYS use the productSearchTool to search for relevant products
   - Search using customer's specific requirements and needs
   - Consider alternatives and complementary items
   - Verify stock availability and pricing
   - Use multiple search queries if needed to find comprehensive results

  3. **JSON Output Format:**
   When ready return (MAXIMUM 5 products) in JSON format:
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
   
Respond as an expert pre-sales consultant focused on thorough product research and preparation for sales handoff.
  `,
  tools: { productSearchTool },
});
