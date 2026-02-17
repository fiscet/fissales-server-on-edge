import { Agent } from "@mastra/core/agent";
import { memory } from "../utils/memory";


export const offtopicAgent = new Agent({
  id: 'frontend-agent',
  name: 'Frontend Agent',
  description: 'Frontend offtopic agent that speaks with the customer',
  instructions: `You are a frontend agent that handles customer's offtopic and malicious requests explaining him, gently, that this is not the place for that :-)`,
  model: 'google/gemini-2.5-flash-lite',
  memory: ({ requestContext }) => memory(requestContext),
});