export type IntentType =
  | 'off_topic_suspicious'
  | 'company_info'
  | 'search_product'
  | 'product_recommendation'
  | 'context_reference';

export interface ChatMessage {
  message: string;
  sessionId: string; // This is the threadId for Mastra Memory
  userId?: string;
  metadata?: Record<string, any>;
}

export interface IntentResult {
  intent: IntentType;
  confidence: number;
  extractedParams?: Record<string, any>;
  reasoning?: string;
}

export interface AgentResult {
  agentName: string;
  success: boolean;
  data?: any;
  error?: string;
  usedMemory?: boolean;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  imageUrl?: string;
  url: string;
}

export interface FinalResponse {
  message: string;
  products?: Product[];
  metadata?: {
    intents: IntentType[];
    agentsUsed: string[];
    timestamp: string;
    sessionId: string;
  };
}