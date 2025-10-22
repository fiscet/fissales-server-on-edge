import { groq } from '@ai-sdk/groq';
import { Agent } from "@mastra/core/agent";
import { companyQueryTool } from "../tools/company-query-tool";

const fastModel = groq('llama-3.1-8b-instant');    // Dev/playground
const smartModel = groq('llama-3.3-70b-versatile');

export const companyInfoAgent = new Agent({
  id: 'company-info-agent',
  name: 'Company Info Agent',
  description: 'Specialist agent that handles retrieve policies, shipping information, customer service, and company-related inquiries',
  instructions: `You are our company information specialist.
Provide accurate, clear information about:
- Shipping policies and costs
- Returns and refund process
- Terms and conditions
- Contact information
- FAQs

Be concise but complete. Always offer follow-up help.`,
  model: process.env.NODE_ENV === 'production' ? smartModel : fastModel,
  tools: { companyQueryTool },
});

