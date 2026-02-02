import { Agent } from "@mastra/core/agent";
import { getConversationContext, saveConversationContext } from "../tools/converstation-tool";
import { memory } from "../utils/memory";

export const contextAgent = new Agent({
  id: 'context-agent',
  name: 'Context Agent',
  description: 'Context agent that handles previous conversation context',
  instructions: `You are a context-aware conversation manager.
Your role:
1. Retrieve previous conversation context (last viewed product, filters, preferences)
2. Clarify user references to previous messages
3. Maintain conversation coherence
4. Save new context for future references

Use pronouns and references to guide the user to what they meant.`,
  model: 'openai/gpt-4.1-nano',
  memory: ({ runtimeContext }) => memory(runtimeContext),
  tools: { getConversationContext, saveConversationContext },
});