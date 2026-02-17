import { createTool } from "@mastra/core/tools";
import z from "zod";
import { safetyAgent } from "../agents/safety-agent";

export const safetyAgentTool = createTool({
  id: 'safety-agent-tool',
  description: 'Check if the user message is malicious',
  inputSchema: z.object({
    message: z.string()
  }),
  outputSchema: z.object({
    response: z.string()
  }),
  execute: async (input) => {
    const { message } = input;
    const result = await safetyAgent.generate(
      [{ role: 'user', content: message }]
    );
    return {
      response: result.text,
    };
  },
});