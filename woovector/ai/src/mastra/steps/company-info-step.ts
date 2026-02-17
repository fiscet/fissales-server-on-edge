import { createStep } from "@mastra/core/workflows";
import { z } from "zod";
import { companyInfoAgent } from "../agents/company-info-agent";

export const companyInfoStep = createStep({
  id: "company-info-step",
  inputSchema: z.object({
    classification: z.string()
  }),
  outputSchema: z.object({
    response: z.string()
  }),
  execute: async ({ inputData, requestContext }) => {
    const result = await companyInfoAgent.generate(
      [{ role: 'user', content: inputData.classification }],
      { requestContext }
    );
    return { response: result.text };
  },
});