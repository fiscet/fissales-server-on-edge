
import { Mastra } from '@mastra/core/mastra';
import { PinoLogger } from '@mastra/loggers';
import { LibSQLStore } from '@mastra/libsql';
import { orchestratorAgent } from './agents/orchestrator-agent';
import { wooCommerceProductAgent } from './agents/woocommerce-product-agent';
import { companyInfoAgent } from './agents/company-info-agent';

export const mastra = new Mastra({
  agents: {
    orchestratorAgent,
    wooCommerceProductAgent,
    companyInfoAgent
  },
  storage: new LibSQLStore({
    // Use persistent storage for conversation memory
    url: "file:./memory.db",
  }),
  logger: new PinoLogger({
    name: 'WooVector-Mastra',
    level: 'info',
  }),
  telemetry: {
    // Telemetry is deprecated and will be removed in the Nov 4th release
    enabled: false,
  },
  observability: {
    // Enables DefaultExporter and CloudExporter for AI tracing
    default: { enabled: true },
  },
});
