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
    const result = await productSearchAgent.generate(
      [{ role: 'user', content: inputData.classification }],
      { runtimeContext }
    );
    return { response: result.text };
  },
});