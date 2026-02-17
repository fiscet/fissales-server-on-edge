import { createStep } from "@mastra/core/workflows";
import { z } from "zod";
import { contextAgent } from "../agents/context-agent";

export const contextStep = createStep({
  id: "context-step",
  inputSchema: z.object({
    classification: z.string()
  }),
  outputSchema: z.object({
    response: z.string()
  }),
  execute: async ({ inputData, requestContext }) => {
    const result = await contextAgent.generate(
      [{ role: 'user', content: inputData.classification }],
      { requestContext }
    );
    return { response: result.text };
  },
});