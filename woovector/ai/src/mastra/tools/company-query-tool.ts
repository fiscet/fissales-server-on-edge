import { createTool } from "@mastra/core/tools";
import z from "zod";

// TODO: Implement the tool to query the company information
export const companyQueryTool = createTool({
  id: 'company-query-tool',
  description: 'Queries the company information',
  inputSchema: z.object({
    infoType: z.enum(['terms', 'shipping', 'returns', 'contact', 'faq']).describe('Type of info')
  }),
  execute: async (input) => {
    return {
      response: 'The response to the query',
    };
  },
});