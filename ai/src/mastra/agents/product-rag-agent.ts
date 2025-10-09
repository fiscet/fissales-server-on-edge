import { Agent } from "@mastra/core/agent";
import { createOllama } from 'ollama-ai-provider-v2';
import { productSearchTool } from "../tools/vector-query-tool";

const ollama = createOllama({
  baseURL: "http://localhost:11434",
  name: "ollama"
});

const model = ollama("llama3.2");

export const ragAgent = new Agent({
  name: "ragAgent",
  model: model,
  instructions: `
    You are a helpful assistant that can search the product database for information.
    Use the productSearchTool to search the product database.
  `,
  tools: { productSearchTool },
});
