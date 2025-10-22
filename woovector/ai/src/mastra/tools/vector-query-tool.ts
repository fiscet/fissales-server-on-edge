import { openai } from '@ai-sdk/openai';
import { createVectorQueryTool } from '@mastra/rag';
import { createTool } from '@mastra/core';
import { QdrantVector } from '@mastra/qdrant';
import { z } from 'zod';

// Initialize Qdrant vector store (cloud)
const qdrantVectorStore = new QdrantVector({
  url: process.env.QDRANT_URL,
  apiKey: process.env.QDRANT_API_KEY,
  https: true
});

// SEARCH TOOLS - Structured search with filters (Meta catalog style)
const baseMetaSearchTool = createVectorQueryTool({
  id: 'search_products_meta',
  vectorStoreName: 'qdrant',
  description:
    'Searches products on Meta (catalog) by category, price range, and keywords. Use filters for structured search (category, price range). Great for browsing specific categories or price ranges.',
  vectorStore: qdrantVectorStore,
  indexName: 'products',
  model: openai.embedding('text-embedding-3-small'),
  enableFilter: true, // Enable metadata filtering for category, price, etc.
  includeSources: true,
  includeVectors: false
});

// Wrap the Meta search tool to provide a cleaner interface
export const searchProductsOnMeta = {
  ...baseMetaSearchTool,
  execute: async (input: any, context: any) => {
    try {
      // The input already contains query and filter from createVectorQueryTool
      // We can pass it directly or transform it if needed
      const result = await baseMetaSearchTool.execute(input, context);

      // Transform to Meta-style response format
      return {
        products: result.results || [],
        count: result.results?.length || 0,
        filters_applied: input.filter || {}
      };
    } catch (error) {
      console.error('Error searching products on Meta:', error);
      throw new Error(`Failed to search products: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }
};

// VECTOR DB TOOLS - Semantic Search

// Create the base vector query tool for product search
const baseProductSearchTool = createVectorQueryTool({
  id: 'product-search',
  vectorStoreName: 'qdrant',
  description:
    'Finds similar clothing products in VectorDB using semantic similarity. Use queryText parameter for semantic search (e.g., "summer dress", "casual wear", "formal outfit"). Supports optional filters for category, price, color, size. Returns topK results (default 5, max 10).',
  vectorStore: qdrantVectorStore, // Pass the vector store directly
  indexName: 'products', // This should match your index name
  model: openai.embedding('text-embedding-3-small'),
  enableFilter: true, // Enable metadata filtering
  includeSources: true, // Include source information
  includeVectors: false // Don't include vectors in response to save bandwidth
});

// Wrap the tool with custom logging and parameter validation
export const searchSimilarProducts = {
  ...baseProductSearchTool,
  execute: async (input: any, context: any) => {
    try {
      // Validate and set defaults for topK
      const topK = input.topK ? Math.min(input.topK, 10) : 5; // Default 5, max 10

      // Build the params object with validated values
      const searchParams = {
        ...input,
        topK,
      };

      console.log('🟢 searchSimilarProducts CALLED with params:', {
        queryText: searchParams.queryText,
        topK: searchParams.topK,
        hasFilters: !!searchParams.filter
      });

      const result = await baseProductSearchTool.execute(searchParams, context);

      console.log('🟢 searchSimilarProducts RESULT:', {
        resultsCount: result.results?.length || 0,
        queryText: searchParams.queryText,
        topK: searchParams.topK,
        hasFilters: !!searchParams.filter,
        firstResult: result.results?.[0]?.metadata || 'no results'
      });

      return result;
    } catch (error) {
      console.error('🔴 searchSimilarProducts ERROR:', error);
      throw error;
    }
  }
};