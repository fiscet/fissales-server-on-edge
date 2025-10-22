
import { Mastra } from '@mastra/core/mastra';
import { PinoLogger } from '@mastra/loggers';
import { companyInfoAgent } from './agents/company-info-agent';
import { classifierAgent } from './agents/classifier-agent';
import { safetyAgent } from './agents/safety-agent';
import { contextAgent } from './agents/context-agent';
import { productRecommendationAgent } from './agents/product-recommendation-agent';
import { productSearchAgent } from './agents/product-search-agent';
import { orchestratorAgent } from './agents/orchestrator-agent';
import { storage } from './utils/storage'; // Using Upstash (no bundling issues)
import { ecommerceFlow } from './workflows/ecommerce-flow';

export const mastra = new Mastra({
  agents: {
    orchestratorAgent,
    companyInfoAgent,
    classifierAgent,
    safetyAgent,
    contextAgent,
    productRecommendationAgent,
    productSearchAgent
  },
  workflows: {
    ecommerceFlow
  },
  storage,
  logger: new PinoLogger({
    name: 'WooVector-Mastra',
    level: 'info'
  }),
  observability: {
    // Enables DefaultExporter and CloudExporter for AI tracing
    default: { enabled: true },
  },
});
