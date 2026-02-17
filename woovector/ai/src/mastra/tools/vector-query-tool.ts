import { openai } from '@ai-sdk/openai';
import { createTool } from '@mastra/core/tools';
import { QdrantVector } from '@mastra/qdrant';
import { z } from 'zod';

const qdrantVectorStore = new QdrantVector({
  id: 'woovector-store',
  url: process.env.QDRANT_URL,
  apiKey: process.env.QDRANT_API_KEY,
  https: true
});

// ============================================================================
// PRODUCT SEARCH TOOL - For specific product searches by name
// ============================================================================
export const searchProductsOnMeta = createTool({
  id: 'search_products_meta',
  description: 'Searches specific clothing products by name. Use queryText for product name/search term. Returns topK results (default 5).',
  inputSchema: z.object({
    queryText: z.string().describe('Product name or search term'),
    topK: z.number().optional().default(5).describe('Number of results (max 10)'),
  }),
  execute: async (input) => {
    try {
      const { queryText, topK = 5 } = input;
      const limitedTopK = Math.min(topK, 10);

      console.log('🟡 searchProductsOnMeta CALLED:', queryText);

      // Generate embedding
      const { embedMany } = await import('ai');
      const embedResult = await embedMany({
        model: openai.embedding('text-embedding-3-small'),
        values: [queryText]
      });

      // Query Qdrant
      const results = await qdrantVectorStore.query({
        indexName: 'products',
        queryVector: embedResult.embeddings[0],
        topK: limitedTopK
      });

      console.log('🟡 searchProductsOnMeta RESULT:', results.length, 'products found');

      // Return only essential fields to avoid token limit
      const simplifiedResults = results.map((r: any) => ({
        id: r.metadata?.id,
        name: r.metadata?.name,
        price: r.metadata?.price,
        categories: r.metadata?.categories,
        imageUrl: r.metadata?.imageUrl,
        productUrl: r.metadata?.productUrl,
        stock: r.metadata?.stock
      }));

      return {
        products: simplifiedResults,
        count: results.length
      };
    } catch (error) {
      console.error('🔴 searchProductsOnMeta ERROR:', error);
      throw new Error(`Failed to search products: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }
});

// ============================================================================
// SIMILAR PRODUCTS TOOL - For recommendations based on semantic similarity
// ============================================================================
export const searchSimilarProducts = createTool({
  id: 'search_similar_products',
  description: 'Finds similar clothing products using semantic similarity. Great for recommendations based on style, occasion, season.',
  inputSchema: z.object({
    queryText: z.string().describe('Semantic search query (e.g., "casual summer outfit", "formal wear")'),
    topK: z.number().optional().default(5).describe('Number of results (max 10)'),
  }),
  execute: async (input) => {
    try {
      const { queryText, topK = 5 } = input;
      const limitedTopK = Math.min(topK, 10);

      console.log('🟢 searchSimilarProducts CALLED:', queryText);

      // Generate embedding
      const { embedMany } = await import('ai');
      const embedResult = await embedMany({
        model: openai.embedding('text-embedding-3-small'),
        values: [queryText]
      });

      // Query Qdrant
      const results = await qdrantVectorStore.query({
        indexName: 'products',
        queryVector: embedResult.embeddings[0],
        topK: limitedTopK
      });

      console.log('🟢 searchSimilarProducts RESULT:', results.length, 'products found');

      // Return only essential fields to avoid token limit
      const simplifiedResults = results.map((r: any) => ({
        id: r.metadata?.id,
        name: r.metadata?.name,
        price: r.metadata?.price,
        categories: r.metadata?.categories,
        imageUrl: r.metadata?.imageUrl,
        productUrl: r.metadata?.productUrl,
        stock: r.metadata?.stock,
        score: r.score
      }));

      return {
        results: simplifiedResults,
        count: results.length
      };
    } catch (error) {
      console.error('🔴 searchSimilarProducts ERROR:', error);
      throw error;
    }
  }
});
