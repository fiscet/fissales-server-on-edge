import { createStep } from "@mastra/core/workflows";
import z from "zod";
import { productRecommendationAgent } from "../agents/product-recommendation-agent";

export const productRecommendationStep = createStep({
  id: "product-recommendation-step",
  inputSchema: z.object({
    classification: z.string()
  }),
  outputSchema: z.object({
    response: z.string()
  }),
  execute: async ({ inputData, requestContext }) => {
    console.log('Product Recommendation Step - Input:', inputData.classification);

    // Parse the classification to extract the query
    const classification = JSON.parse(inputData.classification);
    const query = classification?.extractedParams?.query || classification?.query || 'products';

    console.log('Extracted query for search:', query);

    const result = await productRecommendationAgent.generate(
      [{
        role: 'user',
        content: `Find and recommend products for: "${query}". Remember to use the searchSimilarProducts tool.`
      }],
      { requestContext }
    );

    console.log('Product Recommendation Step - Tool calls:', result.toolCalls?.length || 0);
    console.log('Product Recommendation Step - Response:', result.text?.substring(0, 200));

    return { response: result.text };
  },
});