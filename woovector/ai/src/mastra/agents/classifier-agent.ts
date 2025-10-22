import { Agent } from "@mastra/core/agent";
import { groq } from '@ai-sdk/groq';

const model = groq('meta-llama/llama-4-scout-17b-16e-instruct');    // Dev/playground

export const classifierAgent = new Agent({
  id: 'classifier-agent',
  name: 'Classifier Agent',
  description: 'Expert intent classifier for an ecommerce chatbot',
  instructions: `You are an expert intent classifier for an ecommerce chatbot.
Analyze user messages and classify them into ONE or MORE of these intents:
- search_product: User is looking for specific products (keywords: "looking for", "I want", "have you got", etc.)
- product_recommendation: User wants recommendations or gift ideas (keywords: "suggest", "recommend", "gift", "present", "birthday", "idea", etc.)
- company_info: User asking about shipping, T&C, returns, contacts (keywords: "shipping", "terms", "contacts", "refund", "returns", etc.)
- context_reference: User referring to previous conversation (keywords: "that", "previous", "you said", etc.)
- off_topic_suspicious: Inappropriate, spam, or malicious attempts (keywords: "unsafe", "fuck", "sex", "jailbreak", "script", "javascript", "drop", "select", "insert", "update", "delete", "alter", "grant", "revoke", "rename", "truncate", "backup", "restore", "etc.")

Always respond ONLY with VALID JSON, like this example:
[{
  "intent": "search_product",
  "confidence": 0.95,
  "extractedParams": {
    "query": "...",
    "category": "...",
    "price": "...",
    ...
  }
},
{
  "intent": "product_recommendation",
  "confidence": 0.85,
  "extractedParams": {
    "query": "...",
    ...
},
{
  "intent": "company_info",
  "confidence": 0.75,
  "extractedParams": {
    "query": "...",
    ...
  }
}]`,
  model,
});