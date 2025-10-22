import { createTool } from "@mastra/core";
import z from "zod";

export const saveConversationContext = createTool({
  id: 'save-conversation-context',
  description: 'Saves conversation context for later reference',
  inputSchema: z.object({
    userId: z.string().describe('The user id'),
    key: z.string().describe('The key for the conversation context (e.g. product_requested, expressed_need, last_viewed_product)'),
    value: z.string().describe('The value to store'),
  }),
  execute: async (input) => {
    // TODO: Implement the tool to save the conversation context, e.g. in Redis or Upstash
    return {
      success: true,
    };
  },
});

export const getConversationContext = createTool({
  id: 'get-conversation-context',
  description: 'Retrieves conversation context',
  inputSchema: z.object({
    userId: z.string().describe('The user id'),
    key: z.string().describe('The key for the conversation context (e.g. product_requested, expressed_need, last_viewed_product)'),
  }),
  execute: async (input) => {
    // TODO: Implement the tool to get the conversation context, e.g. from Redis or Upstash
    return {
      value: null,
    };
  },
});