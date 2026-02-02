import { createTool } from "@mastra/core/tools";
import z from "zod";
import { safetyAgent } from "../agents/safety-agent";

export const classifierAgentTool = createTool({
  id: 'classifier-agent-tool',
  description: 'Classifier agent tool',
  inputSchema: z.object({
    message: z.string()
  }),
  outputSchema: z.object({
    classification: z.string()
  }),
  execute: async ({ context, runtimeContext }) => {
    const { message } = context;
    const result = await safetyAgent.generate(
      [{ role: 'user', content: message }],
      {
        memory: {
          thread: runtimeContext.get('sessionId')!,
          resource: runtimeContext.get('userId')!,
        },
      }
    );
    return {
      classification: result.text,
    };
  },
});