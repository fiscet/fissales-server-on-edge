import { createStep } from "@mastra/core";
import { safetyAgent } from "../agents/safety-agent";
import { customerInputSchema } from "../schemas/customer-input-schema";
import z from "zod";

export const receiveMessageStep = createStep({
  id: "receive-message-step",
  inputSchema: customerInputSchema,
  outputSchema: z.object({
    message: z.string()
  }),
  execute: async ({ inputData, runtimeContext }) => {
    runtimeContext.set("sessionId", inputData.session_id);

    if (inputData.customer_id) {
      runtimeContext.set("userId", inputData.customer_id);
    }

    const result = await safetyAgent.generate(
      [{ role: 'user', content: inputData.message }],
      {
        memory: {
          thread: inputData.session_id,
          resource: inputData.customer_id || 'anonymous'
        }
      }
    );
    return {
      message: result.text
    };
  },
});