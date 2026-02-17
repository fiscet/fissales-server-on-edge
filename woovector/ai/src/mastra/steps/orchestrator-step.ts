import { createStep } from "@mastra/core/workflows";
import { z } from "zod";
import { orchestratorAgent } from "../agents/orchestrator-agent";

export const orchestratorStep = createStep({
  id: "orchestrator-step",
  inputSchema: z.object({
    classification: z.string()
  }),
  outputSchema: z.object({
    response: z.string()
  }),
  execute: async ({ inputData }) => {
    const { classification } = inputData;

    const result = await orchestratorAgent.generate([{ role: 'user', content: classification }]);

    return { response: result.text };
  }
});