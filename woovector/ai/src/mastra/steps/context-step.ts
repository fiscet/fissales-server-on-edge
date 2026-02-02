import { createStep } from "@mastra/core";
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
  execute: async ({ inputData, runtimeContext }) => {
    const result = await contextAgent.generate(
      [{ role: 'user', content: inputData.classification }],
      { runtimeContext }
    );
    return { response: result.text };
  },
});