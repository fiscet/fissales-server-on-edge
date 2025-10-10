## Strategic Database Planning Document

### App Summary
**End Goal:** Help WooCommerce vendors achieve increased sales and conversion rates by helping their customers discover relevant products based on specific needs and occasions using a SaaS platform that manages product imports, enriches them with custom metadata for AI agents, and stores them in vector databases for ultra-fast (sub-2-second) chatbot responses.

**Core Features:** Two-tier subscription model (€29/€59), WooCommerce product import with metadata enrichment, ultra-fast AI chatbots with brand voice configuration, WordPress plugin deployment, multi-language support

---

## 🗄️ Current Database State

**✅ Excellent Foundation - 85% Perfect Match**

- **`users`** - Authentication with Stripe integration and role-based access control (member/admin roles)
- **`userUsageEvents`** - Usage tracking for billing limits (message_sent, session_created events)

### Template Assessment  
**✅ 85% Perfect:** Template provides solid SaaS foundation with authentication, billing integration, and usage tracking infrastructure.

**❌ Missing Components:** WooCommerce integration, product management, AI brand voice configuration, subscription plan templates, and metadata enrichment capabilities.

**🔧 Ready to Build:** Core user management, session handling, and usage tracking systems are production-ready.

---

## ⚡ Feature-to-Schema Mapping

### Core Features (Template Provided - Ready to Build)
- **User Authentication & Roles** → Uses `users` table - Supabase auth integration ready
- **Usage Limit Enforcement** → Uses `userUsageEvents` table - Billing limit tracking ready
- **Stripe Integration Foundation** → Uses `users.stripe_customer_id` - Payment processing ready

### Features Needing New Schema (Priority Implementation Order)
- **Subscription Plan Management** → Need `subscription_plans` + `vendor_subscriptions` tables
- **WooCommerce Store Connection** → Need `vendor_stores` table for API credentials and sync
- **Product Catalog Management** → Need `products` table for full WooCommerce product import
- **AI Brand Voice Configuration** → Need `store_ai_config` table with JSON settings for performance
- **Product Metadata Enrichment** → Need `product_metadata` table for AI-ready enhancement fields

---

## 📋 Recommended Schema Changes

**Bottom Line:** You need to add **5 new tables** to transform your template into a complete WooCommerce AI chatbot SaaS:

### Priority 1: Subscription Plan Management

**Problem:** Template has user billing foundation but no subscription plan templates or vendor subscription management.

**Action:** Add subscription plan system with Stripe integration and overage behavior control.

```sql
-- Subscription Plans (€29 Starter, €59 Professional templates)
CREATE TABLE subscription_plans (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL, -- "Starter", "Professional" 
  price_monthly INTEGER NOT NULL, -- €2900, €5900 (cents)
  price_yearly INTEGER NOT NULL, -- €29000, €59000 (cents)
  product_limit INTEGER NOT NULL, -- 5000, 10000 products
  conversation_limit INTEGER NOT NULL, -- 500, 2000 conversations/month
  stripe_price_id_monthly TEXT, -- Stripe price ID for monthly billing
  stripe_price_id_yearly TEXT, -- Stripe price ID for yearly billing
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Vendor Subscriptions (actual vendor subscriptions with trial support)
CREATE TABLE vendor_subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  plan_id UUID REFERENCES subscription_plans(id),
  stripe_subscription_id TEXT UNIQUE,
  status TEXT NOT NULL, -- 'trialing', 'active', 'past_due', 'canceled'
  billing_cycle TEXT NOT NULL, -- 'monthly', 'yearly'
  trial_end TIMESTAMP WITH TIME ZONE,
  current_period_start TIMESTAMP WITH TIME ZONE,
  current_period_end TIMESTAMP WITH TIME ZONE,
  overage_behavior TEXT DEFAULT 'block', -- 'block' or 'pay' (vendor choice)
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_vendor_subscriptions_user_id ON vendor_subscriptions(user_id);
CREATE INDEX idx_vendor_subscriptions_stripe_id ON vendor_subscriptions(stripe_subscription_id);
```

### Priority 2: WooCommerce Store Configuration

**Problem:** No WooCommerce API integration or store connection management.

**Action:** Add store configuration with API credentials, webhook support, and WordPress plugin API key generation.

```sql
-- WooCommerce Store Connections (one store per vendor for MVP)
CREATE TABLE vendor_stores (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  subscription_id UUID REFERENCES vendor_subscriptions(id) ON DELETE CASCADE,
  store_name TEXT NOT NULL,
  store_url TEXT NOT NULL,
  woocommerce_api_key TEXT NOT NULL, -- Encrypted storage
  woocommerce_api_secret TEXT NOT NULL, -- Encrypted storage
  webhook_secret TEXT, -- For validating WooCommerce webhooks
  connection_status TEXT DEFAULT 'disconnected', -- 'connected', 'disconnected', 'error'
  last_sync_at TIMESTAMP WITH TIME ZONE,
  sync_status TEXT DEFAULT 'pending', -- 'pending', 'syncing', 'completed', 'error'
  api_key TEXT UNIQUE NOT NULL, -- Generated API key for WordPress plugin
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_vendor_stores_user_id ON vendor_stores(user_id);
CREATE INDEX idx_vendor_stores_api_key ON vendor_stores(api_key);
CREATE UNIQUE INDEX idx_vendor_stores_user_subscription ON vendor_stores(user_id, subscription_id);
```

### Priority 3: WooCommerce Product Management

**Problem:** No product storage for AI vector database integration.

**Action:** Add complete product import with WooCommerce API compatibility and vector database references.

```sql
-- Imported Products (full WooCommerce product data for AI processing)
CREATE TABLE products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  store_id UUID REFERENCES vendor_stores(id) ON DELETE CASCADE,
  woocommerce_id BIGINT NOT NULL, -- Original WooCommerce product ID
  name TEXT NOT NULL,
  slug TEXT,
  description TEXT,
  short_description TEXT,
  sku TEXT,
  price DECIMAL(10,2),
  regular_price DECIMAL(10,2),
  sale_price DECIMAL(10,2),
  status TEXT, -- 'draft', 'pending', 'private', 'publish'
  catalog_visibility TEXT, -- 'visible', 'catalog', 'search', 'hidden'
  featured BOOLEAN DEFAULT false,
  categories JSONB, -- WooCommerce category objects array
  tags JSONB, -- WooCommerce tag objects array  
  images JSONB, -- WooCommerce image objects array (API format)
  attributes JSONB, -- Product attributes from WooCommerce
  weight DECIMAL(8,2),
  dimensions JSONB, -- {length, width, height}
  stock_quantity INTEGER,
  manage_stock BOOLEAN DEFAULT false,
  in_stock BOOLEAN DEFAULT true,
  -- Vector database integration (Qdrant Cloud)
  vector_id TEXT, -- Reference to Qdrant vector embedding
  vector_synced_at TIMESTAMP WITH TIME ZONE,
  -- WooCommerce synchronization tracking
  wc_created_at TIMESTAMP WITH TIME ZONE,
  wc_modified_at TIMESTAMP WITH TIME ZONE,
  last_synced_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  UNIQUE(store_id, woocommerce_id) -- Prevent duplicate imports
);

CREATE INDEX idx_products_store_id ON products(store_id);
CREATE INDEX idx_products_wc_id ON products(store_id, woocommerce_id);
CREATE INDEX idx_products_vector_id ON products(vector_id);
CREATE INDEX idx_products_status ON products(status);
CREATE INDEX idx_products_featured ON products(featured);
```

### Priority 4: AI Brand Voice Configuration

**Problem:** No AI agent configuration storage for brand voice and conversation settings.

**Action:** Add JSON-based AI configuration for optimal agent performance (single query access).

```sql
-- AI Configuration per Store (JSON approach for sub-2-second agent performance)
CREATE TABLE store_ai_config (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  store_id UUID REFERENCES vendor_stores(id) ON DELETE CASCADE UNIQUE,
  -- Brand Voice Settings (JSON for single-query agent access)
  brand_voice JSONB NOT NULL DEFAULT '{
    "tone": "friendly",
    "style": "professional", 
    "personality": "helpful",
    "key_selling_points": [],
    "preferred_phrases": [],
    "avoid_phrases": []
  }',
  -- Store Information for AI Context
  store_description JSONB NOT NULL DEFAULT '{
    "what_we_sell": "",
    "target_customers": "",
    "specialization": "",
    "unique_value_prop": ""
  }',
  -- Store Policies (for AI customer service responses)
  policies JSONB NOT NULL DEFAULT '{
    "return_policy": "",
    "shipping_info": "",
    "payment_methods": [],
    "warranty_info": ""
  }',
  -- Conversation Settings
  conversation_settings JSONB NOT NULL DEFAULT '{
    "max_conversation_length": 20,
    "enable_product_suggestions": true,
    "enable_cross_selling": true,
    "conversation_timeout_minutes": 30
  }',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_store_ai_config_store_id ON store_ai_config(store_id);
```

### Priority 5: Product Metadata Enrichment

**Problem:** No enhanced metadata storage for AI-powered product recommendations and cross-selling.

**Action:** Add comprehensive metadata enrichment with location tags, demographics, seasonality, and bundling suggestions.

```sql
-- Enhanced Product Metadata (vendor-added AI enrichment fields)
CREATE TABLE product_metadata (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID REFERENCES products(id) ON DELETE CASCADE UNIQUE,
  -- AI-Ready Enrichment Fields
  extra_description TEXT, -- Vendor-added detailed description for AI context
  location_tags TEXT[], -- ["indoor", "outdoor", "beach", "mountain", "office"]
  demographic_tags TEXT[], -- ["young_adults", "families", "professionals", "seniors"]  
  seasonal_tags TEXT[], -- ["summer", "winter", "christmas", "back_to_school", "valentine"]
  occasion_tags TEXT[], -- ["gift", "daily_use", "special_event", "sport", "work"]
  experience_level TEXT[], -- ["beginner", "intermediate", "expert", "all_levels"]
  
  -- Cross-selling & Dynamic Bundling
  bundling_suggestions JSONB, -- [{"title": "Complete Ski Package", "products": ["prod-1", "prod-2"], "discount": 15}]
  cross_sell_products UUID[], -- Array of product IDs for cross-selling recommendations
  upsell_products UUID[], -- Array of product IDs for upselling recommendations
  
  -- Usage Context & Scenarios
  usage_scenarios TEXT[], -- ["work", "travel", "home", "gym", "outdoor_adventure"]
  compatibility_info TEXT, -- What products/brands it works with
  care_instructions TEXT, -- How to maintain/use the product
  
  -- AI Optimization Tracking
  search_keywords TEXT[], -- Additional keywords for better AI matching
  ai_optimized BOOLEAN DEFAULT false, -- Has been processed for vector database
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_product_metadata_product_id ON product_metadata(product_id);
CREATE INDEX idx_product_metadata_location_tags ON product_metadata USING GIN(location_tags);
CREATE INDEX idx_product_metadata_demographic_tags ON product_metadata USING GIN(demographic_tags);
CREATE INDEX idx_product_metadata_seasonal_tags ON product_metadata USING GIN(seasonal_tags);
CREATE INDEX idx_product_metadata_occasion_tags ON product_metadata USING GIN(occasion_tags);
CREATE INDEX idx_product_metadata_cross_sell ON product_metadata USING GIN(cross_sell_products);
```

### Enhancement: Usage Events for Conversion Tracking

**Current State:** Existing `userUsageEvents` table handles billing limits perfectly.

**Enhancement:** Add metadata column for conversion tracking and new event types.

```sql
-- Enhance existing userUsageEvents table
ALTER TABLE userUsageEvents ADD COLUMN metadata JSONB DEFAULT '{}';

-- New event types to add to USAGE_EVENT_TYPES constant:
-- 'message_sent' (existing)
-- 'session_created' (existing) 
-- 'product_clicked' (new - for conversion tracking)
-- 'conversion_tracked' (new - for ROI metrics)

-- Example usage:
-- INSERT INTO userUsageEvents (userId, eventType, metadata) 
-- VALUES ('user-123', 'product_clicked', '{"product_id": "prod-456", "session_id": "sess-789"}');
```

---

## 🎯 Strategic Architecture Decisions

### Vector Database Strategy: **Cloud Qdrant**
**Choice:** Managed Qdrant Cloud over Postgres + pgvector

**Reasoning:**
- ✅ **Sub-2-second requirement** - Purpose-built for vector similarity search
- ✅ **Superior performance** - Optimized for product recommendation queries with metadata filtering
- ✅ **Managed infrastructure** - Less DevOps overhead for MVP
- ✅ **Better scaling** - As you grow to thousands of products per vendor

**Implementation:** Store full product data in Postgres, vector embeddings in Qdrant with product IDs as references.

### AI Configuration Strategy: **JSON Storage**
**Choice:** JSON fields over normalized tables for AI settings

**Reasoning:**
- ✅ **Agent performance** - Single query access (critical for sub-2-second responses)
- ✅ **Flexibility** - Easy to add new configuration options without schema changes
- ✅ **MVP simplicity** - No complex joins during agent processing
- ✅ **Direct JavaScript usage** - Perfect for Next.js server actions

### Multi-Store Future-Proofing: **Store-Level Architecture**
**Choice:** Design for multi-store but implement single-store MVP

**Reasoning:**
- ✅ **Future-ready** - Schema supports multi-store without migration
- ✅ **Store-level billing** - Each store can have different subscription plans
- ✅ **MVP simplicity** - One store per vendor constraint in business logic, not schema
- ✅ **Scaling advantage** - Easy expansion when you add multi-store feature

---

## 🚀 Implementation Priority & Development Strategy

**Phase 1 (MVP Core - Week 1-2):**
1. **Subscription Management** - Plan templates and vendor subscriptions
2. **Store Connection** - WooCommerce API integration and plugin key generation

**Phase 2 (Product Import - Week 3-4):**
3. **Product Management** - Full catalog import with manual/webhook sync
4. **Vector Integration** - Qdrant setup and product embedding pipeline

**Phase 3 (AI Enhancement - Week 5-6):**
5. **AI Configuration** - Brand voice settings and conversation management
6. **Metadata Enrichment** - Enhanced product data for intelligent recommendations

**Phase 4 (Optimization - Week 7+):**
7. **Conversion Tracking** - Enhanced usage events and analytics
8. **Performance Tuning** - Query optimization and caching strategies

---

## 📊 Business Model Alignment

### Subscription Enforcement
- **Usage Limits:** `userUsageEvents` tracks conversation counts against subscription limits
- **Overage Handling:** `vendor_subscriptions.overage_behavior` controls block vs. pay behavior
- **Trial Management:** Built-in trial period support with automatic transition

### Revenue Optimization
- **Conversion Tracking:** Product clicks and purchase attribution for ROI demonstration
- **Cross-selling Intelligence:** AI-powered bundling suggestions increase average order value
- **Performance Metrics:** Response times and engagement tracking for service improvement

### Multi-Language Support
- **Language-Ready:** Schema supports multiple languages without requiring separate language tables
- **Currency Handling:** Prices stored as DECIMAL for accurate Euro calculations
- **GDPR Compliance:** User data management with proper foreign key constraints and cascade deletes

---

## 🎯 Next Steps: Ready for Development

The 5 new tables above will complete your WooCommerce AI chatbot SaaS platform.

**Development Approach:**
1. **Start with subscriptions** - Get billing foundation working first
2. **Add WooCommerce integration** - Enable store connections and product import
3. **Implement AI configuration** - Get basic chatbot working with brand voice
4. **Enhance with metadata** - Add intelligent product recommendations
5. **Optimize performance** - Ensure sub-2-second response times

**Database Migration Strategy:**
- Use Drizzle migrations for each table addition
- Test with sample WooCommerce data
- Implement vector database integration last (after product import works)

> **Strategic Advantage:** This schema design supports your complete business model from €29 starter plans through enterprise multi-store growth, with performance optimized for your critical sub-2-second AI response requirement.
