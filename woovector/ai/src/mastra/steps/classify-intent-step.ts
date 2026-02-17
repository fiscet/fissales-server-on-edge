import { createStep } from "@mastra/core/workflows";
import { classifierAgent } from "../agents/classifier-agent";
import { z } from "zod";

export const classifyIntentStep = createStep({
  id: "classify-intent-step",
  inputSchema: z.object({
    message: z.string()
  }),
  outputSchema: z.object({
    classification: z.string()
  }),
  execute: async ({ inputData }) => {
    const result = await classifierAgent.generate([{ role: 'user', content: inputData.message }]);
    return { classification: result.text };
  },
});