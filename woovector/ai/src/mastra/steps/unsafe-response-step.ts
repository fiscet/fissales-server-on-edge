import { z } from "zod";
import { createStep } from "@mastra/core/workflows";

export const unsafeResponseStep = createStep({
  id: "unsafe-response-step",
  inputSchema: z.object({
    classification: z.string()
  }),
  outputSchema: z.object({
    response: z.string()
  }),
  execute: async () => {
    return { response: "I won't answer your question. Please don't ask me anything related to unsafe topics!" };
  },
});