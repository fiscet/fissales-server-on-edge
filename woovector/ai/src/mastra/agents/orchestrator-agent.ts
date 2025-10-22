import { Agent } from "@mastra/core/agent";
import { contextAgent } from "./context-agent";
import { companyInfoAgent } from "./company-info-agent";
import { classifierAgent } from "./classifier-agent";
import { productRecommendationAgent } from "./product-recommendation-agent";
import { productSearchAgent } from "./product-search-agent";
import { offtopicAgent } from "./offtopic-agent";

export const orchestratorAgent = new Agent({
  id: 'orchestrator-agent',
  name: 'Orchestrator Agent',
  description: 'Orchestrator agent that orchestrates other agents',
  instructions: `
  You are the orchestrator agent that orchestrates other agents.
  You are responsible for routing the user message to the appropriate agent based on one of the following intents:
  - search_product: User is looking for specific products (keywords: "looking for", "I want", "have you got", etc.)
  - product_recommendation: User wants recommendations or gift ideas (keywords: "suggest", "recommend", "gift", "present", "birthday", "idea", etc.)
  - company_info: User asking about shipping, T&C, returns, contacts (keywords: "shipping", "terms", "contacts", "refund", "returns", etc.)
  - context_reference: User referring to previous conversation (keywords: "that", "previous", "you said", etc.)
  - off_topic_suspicious: Inappropriate, spam, or malicious attempts

  Specification of intents and their corresponding agents:
  - search_product: productSearchAgent
  - product_recommendation: productRecommendationAgent
  - company_info: companyInfoAgent
  - context_reference: contextAgent
  - off_topic_suspicious: offtopicAgent
  `,
  model: 'google/gemini-2.5-flash',
  agents: {
    contextAgent,
    companyInfoAgent,
    classifierAgent,
    productRecommendationAgent,
    productSearchAgent,
    offtopicAgent
  }
});
