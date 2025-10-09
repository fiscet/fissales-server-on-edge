import { openai } from '@ai-sdk/openai';
import { createVectorQueryTool } from '@mastra/rag';
import { QdrantVector } from '@mastra/qdrant';

// Initialize Qdrant vector store (cloud)
const qdrantVectorStore = new QdrantVector({
  url: process.env.QDRANT_URL,
  apiKey: process.env.QDRANT_API_KEY,
  https: true
});

// Create the base vector query tool for product search
const baseProductSearchTool = createVectorQueryTool({
  id: 'product-search',
  vectorStoreName: 'qdrant',
  description:
    'Search through the product knowledge base to find relevant winter sports equipment based on customer needs and requirements',
  vectorStore: qdrantVectorStore, // Pass the vector store directly
  indexName: 'products', // This should match your index name
  model: openai.embedding('text-embedding-3-small'),
  enableFilter: true, // Enable metadata filtering
  includeSources: true, // Include source information
  includeVectors: false // Don't include vectors in response to save bandwidth
});

// Wrap the tool with custom logging
export const productSearchTool = {
  ...baseProductSearchTool,
  execute: async (input: any, context: any) => {
    try {
      const result = await baseProductSearchTool.execute(input, context);
      return result;
    } catch (error) {
      throw error;
    }
  }
};