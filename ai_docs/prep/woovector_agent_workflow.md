# WooVector Agent Workflow Design

> **Purpose**: Complete Mastra AI agent system design for WooVector - Ultra-fast AI chatbots for WooCommerce vendors to help customers discover products and increase conversion rates by 20-30%. The chatbot UI is developed by third-party; this defines the API backend processing with Mastra AI.

---

## 🎯 WooVector Agent System Overview

### **System Purpose**
WooVector provides ultra-fast (sub-2-second) AI chatbots for WooCommerce vendors that help customers discover relevant products and get company information - all delivered with brand-specific voice and personality.

### **Key Requirements Met**
- **External Chatbot Integration**: API endpoint receives requests from third-party chatbot
- **Product Discovery**: Vector search with smart filtering, personalized recommendations
- **Multi-Agent Routing**: Mastra AI orchestrator routes between product and company info agents
- **Brand Voice**: Configurable tone, style, policies, and key selling points
- **Usage Tracking**: Conversation limits enforcement, analytics tracking
- **Performance**: Caching strategy, asynchronous processing, sub-2-second responses

---

## 🏗️ Agent Architecture Design

### **1. Root Orchestrator Agent** (Mastra AI Agent)
**Agent Name**: `orchestratorAgent`  
**Agent Type**: Mastra AI Agent  
**Agent Purpose**: Routes external chatbot messages to appropriate specialized Mastra AI agents based on intent detection and customer context  

**Tools**:
- Product discovery tool - For product searches and recommendations via Qdrant
- Company info tool - For store policies and company information  
- General support tool - For general customer support and assistance

**Model**: Configurable (GPT-4, Claude, or Gemini) for fast routing decisions

**Memory**: Mastra Memory with LibSQL storage for conversation context

**Instructions**: Custom instructions for intent classification and routing

### **2. Product Discovery Agent** (Mastra AI Agent)
**Agent Name**: `productDiscoveryAgent`  
**Agent Type**: Mastra AI Agent  
**Agent Purpose**: Searches vector database for relevant products, applies smart filters, and provides personalized recommendations with WooCommerce links

**Tools**:
- Vector product search tool - Qdrant vector similarity search in product database
- Smart filtering tool - Price, category, availability, brand filtering
- Product details tool - Fetch full product information and WooCommerce URLs
- Bundle generation tool - Create complementary product suggestions

**Model**: Configurable (GPT-4, Claude, or Gemini) for fast product analysis

**Memory**: Mastra Memory for product discovery context and customer preferences

### **3. Company Info Agent** (Mastra AI Agent)  
**Agent Name**: `companyInfoAgent`
**Agent Type**: Mastra AI Agent
**Agent Purpose**: Provides store information, policies, delivery details, returns, and general company questions using vendor's brand voice

**Tools**: Database query tools for store configuration and policies

**Model**: Configurable (GPT-4, Claude, or Gemini) for policy responses

**Memory**: Mastra Memory for vendor brand voice and policies

### **4. General Support Agent** (Mastra AI Agent)
**Agent Name**: `generalSupportAgent`  
**Agent Type**: Mastra AI Agent
**Agent Purpose**: Handles general customer support, assistance, and non-product related inquiries

**Tools**:
- Customer support info tool - Get general support information
- Store policies tool - Retrieve store policies and information

**Model**: Configurable (GPT-4, Claude, or Gemini) for customer service

**Memory**: Mastra Memory for support context and customer history

---

## 📊 Session State Data Specifications

### **Session State Keys and Data Structures**

#### **`customer_message`** (String)
- **Created by**: Manual capture via `initialize_woovector_state_callback`
- **Data Type**: String  
- **Content**: Original WordPress customer message from plugin
- **Example**: `"Sto cercando scarpe da corsa per principianti sotto €100"` (I'm looking for running shoes for beginners under €100)

#### **`customer_context`** (Dictionary)
- **Created by**: `initialize_woovector_state_callback` from WordPress plugin payload
- **Data Type**: Dictionary
- **Content**: Complete customer information including login status, purchase history, cart contents
- **Structure**:
```json
{
  "isLoggedIn": true,
  "customerId": "wp_customer_123",
  "customerEmail": "mario@example.it",
  "purchaseHistory": [
    {
      "productId": "prod_456",
      "productName": "Sneakers Nike Air",
      "category": "scarpe",
      "purchaseDate": "2024-10-01",
      "price": 89.99
    }
  ],
  "currentCart": [
    {
      "productId": "prod_789",
      "productName": "T-shirt Running",
      "quantity": 2,
      "price": 29.99
    }
  ]
}
```
- **Access Patterns**: `{customer_context[isLoggedIn]}`, `{customer_context[purchaseHistory]}`

#### **`vendor_config`** (Dictionary)
- **Created by**: `initialize_woovector_state_callback` from database vendor lookup
- **Data Type**: Dictionary
- **Content**: Vendor brand configuration, store policies, and personalization settings
- **Structure**:
```json
{
  "vendorId": "vendor_abc123",
  "storeUrl": "https://mioshop.it",
  "brandConfig": {
    "tone": "amichevole", 
    "style": "professionale ma caloroso",
    "keySellingPoints": ["Spedizione gratuita sopra €50", "Prodotti di qualità italiana"],
    "policies": {
      "returns": "Reso gratuito entro 30 giorni",
      "delivery": "Consegna in 24-48 ore",
      "payment": "Pagamenti sicuri con Stripe"
    }
  }
}
```
- **Access Patterns**: `{vendor_config[brandConfig]}`, `{vendor_config[storeUrl]}`

#### **`product_discovery_state`** (Dictionary)
- **Created by**: `initialize_woovector_state_callback` from customer purchase history analysis
- **Data Type**: Dictionary
- **Content**: Search context, filters, preferences, and recommendation tracking
- **Structure**:
```json
{
  "lastSearchQuery": "scarpe da corsa",
  "searchFilters": {
    "priceRange": {"min": 50, "max": 120},
    "categories": ["scarpe", "abbigliamento sportivo"],
    "availability": "in_stock"
  },
  "recommendedProducts": [
    {
      "productId": "prod_123",
      "score": 0.95,
      "reason": "Matches price range and running category preference"
    }
  ],
  "viewedProducts": ["prod_123", "prod_456"],
  "preferences": {
    "preferredCategories": ["scarpe", "elettronica"],
    "priceRange": {"min": 30, "max": 150}
  }
}
```

#### **`conversation_history`** (List)
- **Created by**: `initialize_woovector_state_callback` from session service
- **Data Type**: List
- **Content**: Previous conversation messages for context awareness
- **Structure**:
```json
[
  {
    "id": "msg_1",
    "role": "customer", 
    "content": "Cerco scarpe comode per correre",
    "timestamp": "2024-10-07T10:30:00Z",
    "metadata": {"intent": "product_search"}
  },
  {
    "id": "msg_2",
    "role": "assistant",
    "content": "Ecco le migliori scarpe da running per te...",
    "timestamp": "2024-10-07T10:30:15Z", 
    "metadata": {"products": ["prod_123", "prod_124"]}
  }
]
```

#### **`routing_decision`** (Dictionary) 
- **Created by**: `woovector_orchestrator_agent` via `output_key`
- **Data Type**: Dictionary (using `output_schema`)
- **Content**: Structured routing decision with agent selection and confidence
- **Purpose**: Controls which specialized agent receives the request
- **Structure**:
```json
{
  "selected_agent": "product_discovery",
  "confidence": 0.92,
  "reasoning": "Customer asking for product recommendations with specific criteria",
  "intent": "product_search",
  "requires_login": false
}
```

#### **`product_recommendations`** (String)
- **Created by**: `product_discovery_agent` via `output_key`
- **Data Type**: String
- **Content**: Formatted product recommendations with WooCommerce links and Italian descriptions
- **Example**: `"🛍️ Ecco le scarpe da corsa perfette per te! Basandomi sui tuoi acquisti precedenti e budget, ti consiglio: 1) Nike Air Zoom Pegasus (€89,99) - Ideali per principianti con ottima ammortizzazione [Vedi Prodotto](https://mioshop.it/product/nike-air-zoom) 2) Adidas UltraBoost 22 (€119,99) - Massimo comfort per corse lunghe [Vedi Prodotto](https://mioshop.it/product/adidas-ultraboost)"`

#### **`company_response`** (String)
- **Created by**: `company_info_agent` via `output_key`
- **Data Type**: String
- **Content**: Store policy and company information formatted with brand voice
- **Example**: `"📦 La nostra politica di reso è molto semplice: puoi restituire qualsiasi prodotto entro 30 giorni dalla consegna, completamente gratuito! Spediamo in tutta Italia in 24-48 ore e offriamo spedizione gratuita per ordini superiori a €50. Per qualsiasi domanda, il nostro team è sempre disponibile! 🇮🇹"`

#### **`support_response`** (String)
- **Created by**: `general_support_agent` via `output_key`
- **Data Type**: String  
- **Content**: Customer support response with assistance information and contact details
- **Example**: `"📋 Il tuo ordine #12345 è stato spedito ieri e arriverà domani! Ecco il tracking: IT1234567890. Puoi seguire la spedizione in tempo reale sul sito del corriere. Se hai bisogno di assistenza, sono sempre qui per aiutarti! 🚚"`

---

## 🔗 Agent Connection Mapping

### **Root Orchestration Flow**
```
woovector_orchestrator_agent
├── Routes based on intent detection
├── Tools (Conditional Agent Execution):
│   ├── AgentTool(product_discovery_agent) → Product searches, recommendations, bundles
│   ├── AgentTool(company_info_agent) → Store policies, delivery, returns, about us  
│   └── AgentTool(general_support_agent) → General support, assistance, contact info
└── Outputs: Combined Italian response with brand voice
```

### **Specialized Agent Processing**
```
product_discovery_agent
├── vector_product_search(query, filters, customer_preferences)
├── apply_smart_filters(results, price_range, categories, availability)  
├── get_product_details(product_ids, include_woocommerce_urls)
├── generate_product_bundles(primary_products, customer_history)
└── Output: Formatted product recommendations with links

company_info_agent
├── Processes vendor_config directly (no external tools needed)
├── Applies brand voice to store policies and information
└── Output: Branded company information in Italian

general_support_agent  
├── get_customer_support_info(customer_id, store_url)
├── get_store_policies(store_url)
└── Output: Customer support response with assistance information
```

### **Agent Communication Pattern**
```
WordPress Plugin Request 
→ Session Service (vendor validation, usage checks)
→ woovector_orchestrator_agent
  ├── Detects intent: "scarpe da corsa per principianti" → product_search
  ├── Routes to: product_discovery_agent  
  │   ├── Searches vector DB with customer preferences
  │   ├── Applies smart filters (price: €0-100, category: scarpe, beginner-friendly)
  │   ├── Gets product details with WooCommerce URLs
  │   └── Returns: Formatted recommendations
  └── Applies brand voice and returns to WordPress Plugin
```

---

## 🛠️ Agent Tool Specifications

### **Product Discovery Tools**

#### **`vector_product_search`** (FunctionTool)
```python
def vector_product_search(
    query: str,
    vendor_id: str, 
    customer_preferences: dict,
    limit: int = 10
) -> list[dict]:
    """
    Performs vector similarity search in vendor's product catalog
    
    Args:
        query: Customer search query in Italian
        vendor_id: Vendor's database ID for catalog filtering
        customer_preferences: Price range, categories, purchase history
        limit: Maximum products to return
    
    Returns:
        List of products with similarity scores, prices, categories, URLs
    """
```

#### **`apply_smart_filters`** (FunctionTool)  
```python
def apply_smart_filters(
    products: list[dict],
    filters: dict,
    customer_context: dict
) -> list[dict]:
    """
    Applies intelligent filtering based on customer context and preferences
    
    Args:
        products: Raw product search results
        filters: Price range, categories, availability, brand filters
        customer_context: Purchase history, cart contents, login status
        
    Returns:
        Filtered and ranked products optimized for customer
    """
```

#### **`get_product_details`** (FunctionTool)
```python  
def get_product_details(
    product_ids: list[str],
    store_url: str,
    include_images: bool = True
) -> list[dict]:
    """
    Fetches complete product information with WooCommerce URLs
    
    Args:
        product_ids: List of product IDs from vector search
        store_url: WooCommerce store URL for link generation
        include_images: Whether to include product image URLs
        
    Returns:
        Complete product data with prices, descriptions, WooCommerce links
    """
```

#### **`generate_product_bundles`** (FunctionTool)
```python
def generate_product_bundles(
    primary_products: list[dict],
    customer_history: list[dict],
    bundle_size: int = 3
) -> list[dict]:
    """
    Creates smart product bundles and complementary recommendations
    
    Args:
        primary_products: Main recommended products
        customer_history: Customer's purchase history for personalization
        bundle_size: Number of products per bundle
        
    Returns:
        Smart bundles with total prices and WooCommerce cart URLs
    """
```

### **General Support Tools**

#### **`get_customer_support_info`** (FunctionTool)
```python
def get_customer_support_info(
    customer_id: str,
    store_url: str
) -> dict:
    """
    Provides general customer support information and assistance
    
    Args:
        customer_id: WordPress customer ID
        store_url: WooCommerce store URL
        
    Returns:
        Support information including contact methods and help topics
    """
```

#### **`get_store_policies`** (FunctionTool)
```python
def get_store_policies(
    store_url: str
) -> dict:
    """
    Retrieves store policies and general information
    
    Args:
        store_url: WooCommerce store URL
        
    Returns:
        Store policies including delivery, returns, and payment information
    """
```

---

## 🔄 Agent Workflow Execution Flow

### **Step 1: External Chatbot Request Processing**
```
External Chatbot → Generates sessionId + payload → Next.js API endpoint
→ WooVector Request Handler validates vendor API key and usage limits
→ Creates/retrieves session with customer context and conversation history
```

### **Step 2: Mastra AI Orchestrator Routing** 
```
Mastra orchestratorAgent receives:
├── customer_message: "Looking for running shoes for beginners under €100"  
├── customer_context: {isLoggedIn: true, purchaseHistory: [...], currentCart: [...]}
├── vendor_config: {brandConfig: {tone: "friendly", keySellingPoints: [...]}}
└── conversation_history: [previous messages for context]

Agent analyzes intent → "product_search" → Routes to productDiscoveryAgent
```

### **Step 3: Specialized Mastra Agent Processing**
```
productDiscoveryAgent:
├── Receives routing from orchestrator
├── Executes vector search tool with query and vendor filters
├── Applies smart filtering based on price, category, availability
├── Calls product details tool for complete information
├── Generates product bundles using bundle generation tool
└── Returns: Product recommendations with WooCommerce links
```

### **Step 4: Brand Voice Application & Response**
```
Mastra orchestratorAgent:
├── Receives product recommendations from discovery agent
├── Applies vendor brand voice using Mastra Memory
├── Integrates tone, style, and key selling points
├── Formats response with proper grammar and store personality
└── Returns to External Chatbot: Branded response + product array
```

### **Step 5: Session Updates & Analytics**
```  
Next.js API Handler:
├── Updates conversation history with customer message + agent response
├── Records recommended product IDs for analytics tracking
├── Updates product discovery context in Mastra Memory
├── Records usage event for vendor conversation limits
└── Returns response to external chatbot
```

---

## 🚨 Critical Mastra AI Implementation Details

### **Mastra AI Agent Configuration**

Mastra AI agents use a different architecture than ADK. The key components are:

#### **Agent Instructions and Tools**
```typescript
// woovector/ai/src/mastra/agents/orchestrator-agent.ts
import { Agent } from '@mastra/core/agent';
import { Memory } from '@mastra/memory';
import { LibSQLStore } from '@mastra/libsql';

export const orchestratorAgent = new Agent({
  name: 'orchestratorAgent',
  description: 'Routes customer messages to appropriate specialized agents',
  instructions: `
    You are a routing agent for WooCommerce chatbot requests.
    Analyze customer intent and route to appropriate specialized agent:
    - Product searches → productDiscoveryAgent
    - Store policies/info → companyInfoAgent  
    - General support → generalSupportAgent
    
    Always respond with the configured brand voice.
  `,
  model: /* configured model */,
  memory: new Memory({
    storage: new LibSQLStore({
      url: "file:../../memory.db"
    })
  }),
  tools: {
    // Tools will be defined based on Mastra patterns
  }
});
```

#### **Brand Voice Application via Instructions**
Mastra AI agents apply brand voice through custom instructions rather than callbacks:

```typescript
// Brand voice applied through agent instructions
const brandVoiceInstructions = `
Apply the vendor's brand voice:
- Tone: ${vendorConfig.tone}
- Style: ${vendorConfig.style}
- Key selling points: ${vendorConfig.keySellingPoints.join(', ')}
- Always respond in English (or vendor's configured language)
- Use store policies: ${JSON.stringify(vendorConfig.policies)}
`;
```

### **Mastra AI Tool Definitions**
```typescript
// woovector/ai/src/mastra/tools/vector-search-tool.ts
import { createTool } from '@mastra/core/tools';
import { z } from 'zod';

export const vectorSearchTool = createTool({
  id: 'vector-product-search',
  description: 'Search for products in Qdrant vector database',
  inputSchema: z.object({
    query: z.string().describe('Customer search query'),
    vendorId: z.string().describe('Vendor ID for catalog filtering'),
    filters: z.object({
      priceRange: z.object({
        min: z.number().optional(),
        max: z.number().optional()
      }).optional(),
      categories: z.array(z.string()).optional(),
      availability: z.enum(['in_stock', 'out_of_stock', 'any']).optional()
    }).optional()
  }),
  outputSchema: z.object({
    products: z.array(z.object({
      id: z.string(),
      name: z.string(),
      price: z.number(),
      url: z.string(),
      image: z.string().optional(),
      score: z.number()
    }))
  }),
  execute: async ({ context }) => {
    // Implementation connects to Qdrant and returns products
  }
});
```

---

## ⚡ Performance & Caching Strategy

### **Multi-Level Caching System**

#### **Level 1: Session Service Caching**
- **Vendor Info Cache**: 10 minutes TTL, reduces database queries for brand config
- **Session State Cache**: 5 minutes TTL, maintains customer context between interactions
- **Usage Limits Cache**: Real-time validation with conversation counting

#### **Level 2: Vector Database Optimization**  
- **Product Embeddings**: Pre-computed embeddings for all vendor products
- **Search Results Cache**: Cache similar queries for 15 minutes
- **Popular Products Cache**: Cache frequently recommended products per vendor

#### **Level 3: Agent Response Caching**
- **Company Info Responses**: Cache policy responses per vendor (30 minutes)
- **Common Product Queries**: Cache responses for frequent searches (10 minutes)  
- **Brand Voice Templates**: Cache formatted response templates per vendor

### **Cache Invalidation Strategy**
- **Product Updates**: Clear vector cache when vendor imports new products
- **Brand Config Changes**: Clear company info cache when vendor updates settings
- **Session Expiry**: Automatic cleanup every 5 minutes
- **Usage Limit Resets**: Daily cache reset for conversation limits

---

## 🔧 Implementation Checklist

### **Build Order: Follow Execution Flow**

#### **Phase 1: Foundation Setup**
- [ ] **Build `initialize_woovector_state_callback`** (Callback)
  - [ ] Session state initialization with customer and vendor context
  - [ ] Conversation history setup and preference extraction
  - [ ] Error handling for malformed WordPress plugin data

- [ ] **Build `format_italian_response_callback`** (Callback)  
  - [ ] Brand voice application with vendor-specific tone and style
  - [ ] Italian language formatting and grammar correction
  - [ ] Integration of key selling points and store policies

- [ ] **Build `validate_customer_context_callback`** (Callback)
  - [ ] Customer context validation for support access
  - [ ] General support logic for non-logged-in customers

#### **Phase 2: Function Tools (Product Discovery)**
- [ ] **Build `vector_product_search`** (FunctionTool)
  - [ ] Vector database connection and similarity search implementation
  - [ ] Vendor catalog filtering and customer preference integration
  - [ ] Performance optimization with result caching

- [ ] **Build `apply_smart_filters`** (FunctionTool)
  - [ ] Price range filtering based on customer budget and history
  - [ ] Category matching with customer preferences and search intent
  - [ ] Availability checking and stock status integration

- [ ] **Build `get_product_details`** (FunctionTool)  
  - [ ] Product data fetching from local database
  - [ ] WooCommerce URL generation for product links and cart actions
  - [ ] Image URL processing and optimization

- [ ] **Build `generate_product_bundles`** (FunctionTool)
  - [ ] Complementary product analysis based on customer context
  - [ ] Bundle pricing calculation and discount application
  - [ ] Smart bundle creation with cart integration URLs

#### **Phase 3: Function Tools (General Support)**  
- [ ] **Build `get_customer_support_info`** (FunctionTool)
  - [ ] General support information retrieval
  - [ ] Contact methods and help topics processing
  - [ ] Customer assistance workflow integration

- [ ] **Build `get_store_policies`** (FunctionTool)
  - [ ] Store policy information retrieval
  - [ ] Delivery and return policy processing
  - [ ] Payment and contact information formatting

#### **Phase 4: Specialized Agents**
- [ ] **Build `product_discovery_agent`** (LlmAgent)
  - [ ] Product search instruction with Italian language processing
  - [ ] Tool orchestration for complete product discovery workflow  
  - [ ] Customer personalization and preference learning

- [ ] **Build `company_info_agent`** (LlmAgent)
  - [ ] Brand voice instruction with vendor configuration integration
  - [ ] Store policy formatting and Italian localization
  - [ ] Company information structuring and presentation

- [ ] **Build `general_support_agent`** (LlmAgent)
  - [ ] Customer service instruction with empathy and problem-solving
  - [ ] General support integration and assistance communication
  - [ ] Return and refund guidance with vendor policy application

#### **Phase 5: Root Orchestrator**
- [ ] **Build `woovector_orchestrator_agent`** (LlmAgent)
  - [ ] Intent detection instruction with Italian language understanding
  - [ ] Agent routing logic with confidence scoring  
  - [ ] Response combination and brand voice application
  - [ ] Error handling and fallback response generation

### **Final Integration:**
- [ ] **Test complete workflow end-to-end** with WordPress plugin simulation
- [ ] **Validate session state flow** through all agent interactions  
- [ ] **Confirm usage tracking integration** with conversation limit enforcement
- [ ] **Verify Italian responses** with proper brand voice application
- [ ] **Test caching performance** with realistic load scenarios
- [ ] **Validate product links** back to WooCommerce store functionality

---

## 🎯 Expected Customer Experience

### **Product Search Example Flow**
```
Customer: "Cerco scarpe da corsa per principianti, budget massimo €100"

WooVector Response:
"🏃‍♀️ Perfetto! Ho trovato delle ottime scarpe da corsa ideali per chi inizia:

🔥 **Raccomandazioni Top per Te:**
1. **Nike Air Zoom Pegasus 40** - €89,99 
   Perfette per principianti con ammortizzazione eccellente
   [Vedi Prodotto](https://tuoshop.it/product/nike-pegasus) | [Aggiungi al Carrello](https://tuoshop.it/cart/add/nike-pegasus)

2. **Adidas Duramo SL** - €69,99  
   Leggere e comode, ideali per le prime corse
   [Vedi Prodotto](https://tuoshop.it/product/adidas-duramo) | [Aggiungi al Carrello](https://tuoshop.it/cart/add/adidas-duramo)

💡 **Bundle Completo Principiante** (€119,99 invece di €139,98):
   Scarpe Nike + Calze tecniche + Borraccia sportiva
   [Ordina Bundle](https://tuoshop.it/bundle/runner-starter)

📦 Spedizione GRATUITA sopra €50 | 🔄 Reso gratuito entro 30 giorni"
```

### **Company Info Example Flow**
```
Customer: "Quali sono i vostri orari di apertura?"

WooVector Response:  
"🕐 **Orari del nostro negozio:**
Lunedì-Venerdì: 9:00-19:00
Sabato: 9:00-18:00  
Domenica: 10:00-17:00

📞 **Contattaci:**
Telefono: +39 02 1234 5678
Email: info@tuoshop.it
WhatsApp: +39 335 123 4567

🚚 **Spedizioni:** Consegna in 24-48h in tutta Italia
💳 **Pagamenti:** Accettiamo tutte le carte e PayPal
🔄 **Resi:** 30 giorni per cambiare idea, completamente gratuito!"
```

---

## 💻 Technical Architecture Notes

### **External Chatbot Integration Points**
- **Authentication**: Vendor API key validation through API endpoint
- **Payload Structure**: Standardized request format with customer context
- **Response Format**: Structured JSON with text response + product array
- **Error Handling**: Proper error messages for chatbot display  

### **Vector Database Requirements**
- **Product Embeddings**: Italian language embeddings for each vendor's catalog
- **Search Performance**: Sub-500ms vector similarity search
- **Metadata Integration**: Product categories, prices, availability in vector index
- **Vendor Isolation**: Separate vector collections per vendor for multi-tenancy

### **Usage Tracking Integration**  
- **Conversation Counting**: Each orchestrator execution counts as one conversation
- **Vendor Limit Enforcement**: Pre-check limits before agent execution
- **Analytics Recording**: Track product views, recommendations, bundle suggestions
- **Overage Handling**: Respect vendor configuration for limit exceeded behavior

### **Language Optimization**
- **Brand Voice Templates**: Pre-configured response patterns per vendor tone
- **Grammar Validation**: Natural language rules for conversational responses  
- **Cultural Localization**: E-commerce conventions and customer expectations
- **Emoji Integration**: Appropriate emoji usage for market engagement

---

**🎯 This WooVector agent workflow provides the complete Mastra AI implementation for ultra-fast, intelligent product discovery with proper brand voice, external chatbot integration, and comprehensive session management.**

**Next Step: Implement this Mastra AI agent system in woovector/ai/ following the execution flow, starting with agent configuration and building up to the complete orchestrator workflow.**
