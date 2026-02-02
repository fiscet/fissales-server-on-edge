import { createStep } from "@mastra/core";
import { z } from "zod";
import { productSearchAgent } from "../agents/product-search-agent";

export const productSearchStep = createStep({
  id: "product-search-step",
  inputSchema: z.object({
    classification: z.string()
  }),
  outputSchema: z.object({
    response: z.string()
  }),
  execute: async ({ inputData, runtimeContext }) => {
    console.log('🔵 Product Search Step - Input:', inputData.classification);

    // Parse the classification to extract search parameters
    const classification = JSON.parse(inputData.classification);
    const query = classification?.extractedParams?.query || 'products';
    const category = classification?.extractedParams?.category || undefined;

    console.log('🔵 Extracted search params:', { query, category });

    // Build a clear search instruction
    let searchInstruction = `Search for: "${query}"`;
    if (category) {
      searchInstruction += ` in category "${category}"`;
    }
    searchInstruction += '. Remember to use the searchProductsOnMeta tool.';

    const result = await productSearchAgent.generate(
      [{ role: 'user', content: searchInstruction }],
      { runtimeContext }
    );

    console.log('🔵 Product Search Step - Tool calls:', result.toolCalls?.length || 0);
    console.log('🔵 Product Search Step - Response:', result.text?.substring(0, 200));

    return { response: result.text };
  },
});