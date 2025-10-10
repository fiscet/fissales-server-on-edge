# WooVector.io Development Roadmap

## 🚨 Phase 0: Project Setup (MANDATORY FIRST STEP)
**Goal**: Prepare development environment and understand current codebase
**⚠️ CRITICAL**: This phase must be completed before any other development work begins

### Run Setup Analysis
[Goal: Essential first step to understand current template state and requirements]
- [ ] **REQUIRED**: Run `SETUP.md` using **gemini-2.5-pro** on **max mode** for maximum context
- [ ] Review generated setup analysis and recommendations
- [ ] Verify development environment is properly configured
- [ ] Confirm all dependencies and environment variables are set
- [ ] Document any critical findings before proceeding to Phase 1

---

## Phase 1: Landing Page Updates
**Goal**: Update branding and value proposition for WooVector.io

### Update Application Branding
[Goal: Establish WooVector brand identity and messaging for WooCommerce vendor market]
- [ ] Analyze `ai_docs/prep/app_pages_and_functionality.md` for landing page requirements
- [ ] Review `ai_docs/prep/wireframe.md` for layout and structure needs
- [ ] Update hero section in `app/(public)/page.tsx` with WooVector messaging
- [ ] Modify `components/landing/HeroSection.tsx` - Ultra-fast AI chatbot value proposition
- [ ] Update `components/landing/FeaturesSection.tsx` - WooCommerce-specific features
- [ ] Update `components/landing/PricingSection.tsx` - €29 Starter / €59 Professional tiers
- [ ] Modify `components/landing/ProblemSection.tsx` - 30% sales loss problem statement
- [ ] Update `components/landing/FAQSection.tsx` - WooCommerce vendor FAQs
- [ ] Update branding in `components/Logo.tsx` to WooVector logo
- [ ] Modify navigation in `components/landing/Navbar.tsx` and `components/landing/Footer.tsx`

---

## Phase 2: Authentication Configuration ✅ COMPLETE
**Goal**: Configure authentication for WooCommerce vendor access

### Configure Vendor Authentication
[Goal: Set up authentication providers based on prep document requirements]
- [x] Review `ai_docs/prep/app_pages_and_functionality.md` for auth requirements
- [x] Configure Supabase authentication providers (email/password minimum)
- [x] Update `lib/auth.ts` if any WooCommerce-specific auth logic needed
- [x] Verify user role system supports "member" (vendor) and "admin" (super admin)
- [x] Test authentication flow for vendor signup and login

**✅ Decision**: Email/password authentication only (no OAuth providers)
- Supabase email/password authentication fully configured and working
- Role-based access control supports "member" (vendors) and "admin" (super admins)
- Authentication pages ready: login, sign-up, password reset, email verification
- Professional B2B authentication approach - no third-party OAuth dependencies
- OAuth providers (Microsoft, LinkedIn) can be reconsidered post-MVP if needed

**Note**: User creation in database is automatically handled by existing trigger from SETUP.md - no additional user table configuration needed.

---

## Phase 3: Subscription Plan System
**Goal**: Build two-tier subscription foundation with Stripe integration and usage tracking

### Database Schema - Subscription Plans
[Goal: Create subscription tier templates (Starter €29, Professional €59) with limits]
- [ ] Create `woovector/lib/drizzle/schema/subscription-plans.ts`
  - [ ] Add fields: id, name, price_monthly, price_yearly, product_limit, conversation_limit
  - [ ] Add Stripe price IDs: stripe_price_id_monthly, stripe_price_id_yearly
  - [ ] Add active status flag and timestamps
- [ ] Create `woovector/lib/drizzle/schema/vendor-subscriptions.ts`
  - [ ] Add fields: id, user_id (FK to users), plan_id (FK to subscription_plans)
  - [ ] Add Stripe subscription ID and status (trialing, active, past_due, canceled)
  - [ ] Add billing cycle (monthly/yearly), trial dates, period dates
  - [ ] Add overage_behavior field ('block' or 'pay' - vendor choice)
  - [ ] Add indexes for user_id and stripe_subscription_id
- [ ] Generate migration: `cd woovector && npm run db:generate`
- [ ] Generate down migration using `ai_docs/templates/drizzle_down_migration.md`
- [ ] Apply migration: `npm run db:migrate`

### Seed Subscription Plans
[Goal: Populate database with Starter and Professional tier templates]
- [ ] Create seed script `woovector/scripts/seed-subscription-plans.ts`
- [ ] Add Starter Plan: €29/mo (€290/yr), 5000 products, 500 conversations/month
- [ ] Add Professional Plan: €59/mo (€590/yr), 10000 products, 2000 conversations/month
- [ ] Run seed script to populate plans

### Stripe Integration - Products and Prices
[Goal: Configure Stripe billing with two subscription tiers]
- [ ] Create Starter Plan product in Stripe dashboard
  - [ ] Set up monthly price (€29) and copy price ID to .env: STRIPE_STARTER_MONTHLY_PRICE_ID
  - [ ] Set up yearly price (€290) and copy price ID to .env: STRIPE_STARTER_YEARLY_PRICE_ID
- [ ] Create Professional Plan product in Stripe dashboard
  - [ ] Set up monthly price (€59) and copy price ID to .env: STRIPE_PROFESSIONAL_MONTHLY_PRICE_ID
  - [ ] Set up yearly price (€590) and copy price ID to .env: STRIPE_PROFESSIONAL_YEARLY_PRICE_ID
- [ ] Update `lib/stripe.ts` with subscription plan price IDs
- [ ] Update `lib/stripe-service.ts` with subscription creation logic

### Usage Tracking Foundation
[Goal: Extend existing usage events system for conversation and product tracking]
- [ ] Update `lib/drizzle/schema/usage-events.ts`
  - [ ] Extend metadata JSONB field for conversation tracking
  - [ ] Add new event types: 'conversation_started', 'product_imported'
- [ ] Create `lib/usage-tracking.ts` helper functions
  - [ ] Function: trackConversation(userId, storeId, sessionId)
  - [ ] Function: checkConversationLimit(userId) returns boolean
  - [ ] Function: trackProductImport(userId, storeId, productCount)
  - [ ] Function: checkProductLimit(userId) returns boolean
- [ ] Generate and apply migration for usage events updates

### Subscription Management UI
[Goal: Build vendor subscription dashboard with tier selection and billing]
- [ ] Update `app/(protected)/profile/page.tsx` to show current subscription
- [ ] Update `components/profile/PlanCard.tsx` to display current tier and limits
- [ ] Update `components/profile/SubscriptionPlansCard.tsx`
  - [ ] Display Starter and Professional plan cards with pricing
  - [ ] Add "Upgrade" button for Starter plan users
  - [ ] Add "Downgrade" button for Professional plan users (takes effect at renewal)
  - [ ] Show immediate upgrade flow (pay difference)
- [ ] Update `components/profile/UsageStatisticsCard.tsx`
  - [ ] Display products imported vs limit (e.g., "1,234 / 5,000 products")
  - [ ] Display conversations used vs limit (e.g., "45 / 500 conversations")
  - [ ] Add progress bars with color coding (green < 80%, yellow 80-95%, red > 95%)

### Server Actions - Subscription Management
[Goal: Create subscription CRUD operations and Stripe checkout flows]
- [ ] Create `app/actions/subscriptions.ts`
  - [ ] Action: createCheckoutSession(planId, billingCycle) - Returns Stripe checkout URL
  - [ ] Action: getCurrentSubscription() - Returns subscription with plan details
  - [ ] Action: cancelSubscription() - Cancels at period end
  - [ ] Action: updateSubscription(newPlanId) - Handles upgrade/downgrade
- [ ] Update `app/api/webhooks/stripe/route.ts`
  - [ ] Handle subscription.created webhook
  - [ ] Handle subscription.updated webhook
  - [ ] Handle subscription.deleted webhook
  - [ ] Handle payment_intent.payment_failed webhook
  - [ ] Update vendor_subscriptions table on each event

### Integration
[Goal: Connect subscription UI to Stripe checkout and usage tracking]
- [ ] Connect "Upgrade" buttons in profile to Stripe checkout
- [ ] Test subscription creation flow end-to-end
- [ ] Verify usage statistics display correctly
- [ ] Test webhook handling for subscription events
- [ ] Verify overage behavior configuration options

---

## Phase 4: WooCommerce Store Connection
**Goal**: Enable vendors to connect their WooCommerce stores with API validation and plugin key generation

### Database Schema - Store Connection
[Goal: Store WooCommerce API credentials and generate unique plugin API keys]
- [ ] Create `woovector/lib/drizzle/schema/vendor-stores.ts`
  - [ ] Add fields: id, user_id (FK), subscription_id (FK)
  - [ ] Add store info: store_name, store_url
  - [ ] Add WooCommerce credentials: woocommerce_api_key, woocommerce_api_secret (encrypted)
  - [ ] Add webhook_secret for validating WooCommerce webhooks
  - [ ] Add connection_status: 'disconnected', 'connected', 'error'
  - [ ] Add sync tracking: last_sync_at, sync_status
  - [ ] Add plugin_api_key: TEXT UNIQUE NOT NULL (generated for WordPress plugin auth)
  - [ ] Add indexes: user_id, plugin_api_key, unique constraint on (user_id, subscription_id)
- [ ] Generate migration and down migration
- [ ] Apply migration

### Shop Setup Page
[Goal: Build vendor interface for WooCommerce connection configuration]
- [ ] Create `app/(protected)/shop-setup/page.tsx` (Server Component)
  - [ ] Fetch current store connection status
  - [ ] Display connection status indicator (connected/disconnected/error)
  - [ ] Show store name and URL if connected
  - [ ] Pass data to client component for form
- [ ] Create `components/shop-setup/ConnectionForm.tsx` (Client Component)
  - [ ] Input: Store URL (validates URL format)
  - [ ] Input: WooCommerce API Key (Consumer Key)
  - [ ] Input: WooCommerce API Secret (Consumer Secret)
  - [ ] Button: "Test Connection" (validates credentials before saving)
  - [ ] Button: "Save & Connect"
  - [ ] Display validation errors
- [ ] Create `components/shop-setup/ConnectionStatus.tsx`
  - [ ] Display current connection status with icon
  - [ ] Show last successful sync timestamp
  - [ ] Show webhook configuration status
  - [ ] Button: "Disconnect Store" (with confirmation dialog)

### WooCommerce API Integration
[Goal: Validate and test WooCommerce API connections]
- [ ] Create `lib/woocommerce/client.ts`
  - [ ] Function: createWooCommerceClient(storeUrl, apiKey, apiSecret) - Returns WooCommerce REST API client
  - [ ] Function: testConnection(client) - Validates credentials by fetching store info
  - [ ] Function: getStoreInfo(client) - Returns store name, version, permalink structure
- [ ] Create `lib/woocommerce/validation.ts`
  - [ ] Function: validateStoreUrl(url) - Returns boolean + error message
  - [ ] Function: validateApiCredentials(key, secret) - Returns boolean
  - [ ] Function: encryptCredentials(key, secret) - Encrypts using Next.js crypto
  - [ ] Function: decryptCredentials(encrypted) - Decrypts stored credentials

### API Key Generation for WordPress Plugin
[Goal: Generate secure unique API keys for WordPress plugin authentication]
- [ ] Create `lib/plugin-api/key-generation.ts`
  - [ ] Function: generatePluginApiKey() - Creates unique key (e.g., "wv_abc123def456...")
  - [ ] Use crypto.randomBytes for secure key generation
  - [ ] Prefix with "wv_" for identification
  - [ ] Function: validatePluginApiKey(key) - Checks format and database existence
- [ ] Create database index on vendor_stores.plugin_api_key for fast lookups

### Server Actions - Store Connection
[Goal: Handle store connection, validation, and API key generation]
- [ ] Create `app/actions/shop-setup.ts`
  - [ ] Action: testStoreConnection(storeUrl, apiKey, apiSecret) → { success, storeInfo?, error? }
  - [ ] Action: saveStoreConnection(storeUrl, apiKey, apiSecret, storeName)
    - [ ] Validates credentials first
    - [ ] Encrypts API credentials
    - [ ] Generates plugin_api_key
    - [ ] Creates vendor_stores record
    - [ ] Returns { success, pluginApiKey?, error? }
  - [ ] Action: disconnectStore(storeId) - Soft delete or mark as disconnected
  - [ ] Action: getStoreConnection() - Returns current store details

### Integration
[Goal: Connect shop setup UI to WooCommerce validation and store configuration]
- [ ] Connect "Test Connection" button to testStoreConnection action
- [ ] Connect "Save & Connect" to saveStoreConnection action
- [ ] Display generated plugin_api_key to vendor after successful connection
- [ ] Test end-to-end: URL validation → API test → Save → Key generation

---

## Phase 5: Product Import & Catalog Management
**Goal**: Import WooCommerce products with manual trigger and webhook auto-sync

### Database Schema - Products
[Goal: Store WooCommerce product data with vector DB references for AI search]
- [ ] Create `woovector/lib/drizzle/schema/products.ts`
  - [ ] Add core fields: id, store_id (FK to vendor_stores), woocommerce_id
  - [ ] Add product info: name, slug, description, short_description, sku
  - [ ] Add pricing: price, regular_price, sale_price, currency
  - [ ] Add status: status, catalog_visibility, featured
  - [ ] Add categories: categories JSONB (array of WooCommerce category objects)
  - [ ] Add tags: tags JSONB (array of WooCommerce tag objects)
  - [ ] Add images: images JSONB (array of image URLs and metadata)
  - [ ] Add attributes: attributes JSONB (product attributes from WooCommerce)
  - [ ] Add inventory: weight, dimensions JSONB, stock_quantity, manage_stock, in_stock
  - [ ] Add vector DB reference: vector_id TEXT (Qdrant vector ID), vector_synced_at
  - [ ] Add WooCommerce sync: wc_created_at, wc_modified_at, last_synced_at
  - [ ] Add unique constraint: (store_id, woocommerce_id)
  - [ ] Add indexes: store_id, vector_id, status, featured
- [ ] Generate migration and down migration
- [ ] Apply migration

### Product Import Logic
[Goal: Batch import products from WooCommerce API with progress tracking]
- [ ] Create `lib/woocommerce/product-import.ts`
  - [ ] Function: importProducts(storeId) - Main import orchestrator
    - [ ] Fetches WooCommerce products in batches (100 per request)
    - [ ] Transforms WooCommerce product format to our schema
    - [ ] Upserts products (update if woocommerce_id exists)
    - [ ] Returns import stats: { total, imported, updated, failed }
  - [ ] Function: transformWooCommerceProduct(wcProduct) - Maps WC format to our schema
  - [ ] Function: batchUpsertProducts(products[]) - Bulk database upsert

### Product Catalog Page
[Goal: Display imported products with search, filter, and edit capabilities]
- [ ] Create `app/(protected)/product-catalog/page.tsx` (Server Component)
  - [ ] Fetch products for current user's store with pagination
  - [ ] Query parameters: search, category filter, page number
  - [ ] Pass products to client component
- [ ] Create `components/product-catalog/ImportButton.tsx` (Client Component)
  - [ ] "Import Products" button with loading state
  - [ ] Display import progress (X products imported...)
  - [ ] Show last sync timestamp
  - [ ] Show sync status indicator
- [ ] Create `components/product-catalog/ProductTable.tsx` (Client Component)
  - [ ] Table columns: Image thumbnail, Name, SKU, Price, Category, Stock status
  - [ ] Search input with debounced search
  - [ ] Category filter dropdown
  - [ ] Pagination controls
  - [ ] "Edit" button per product → opens edit modal
- [ ] Create `components/product-catalog/ProductEditModal.tsx` (Client Component)
  - [ ] Display: Product name, image, WooCommerce data (read-only preview)
  - [ ] Link to metadata enrichment phase (coming in Phase 7)
  - [ ] Close modal functionality

### Server Actions - Product Import
[Goal: Trigger product import and retrieve product data]
- [ ] Create `app/actions/products.ts`
  - [ ] Action: importProductsFromWooCommerce() → { success, stats?, error? }
    - [ ] Gets current user's store connection
    - [ ] Validates subscription product limit
    - [ ] Calls importProducts() from lib
    - [ ] Tracks product_imported usage event
    - [ ] Returns import statistics
  - [ ] Action: getProducts(page, search?, category?) → { products, total, hasMore }
  - [ ] Action: getProductById(productId) → product details
  - [ ] Action: getImportStats() → { lastSync, totalProducts, productLimit }

### WooCommerce Webhook Setup
[Goal: Enable automatic product sync when vendors update products in WooCommerce]
- [ ] Create `app/api/webhooks/woocommerce/route.ts`
  - [ ] POST handler: Validates webhook signature using webhook_secret
  - [ ] Handles product.created event - Imports new product
  - [ ] Handles product.updated event - Updates existing product
  - [ ] Handles product.deleted event - Marks product as deleted
  - [ ] Returns 200 OK to acknowledge webhook
- [ ] Create webhook setup instructions in `components/shop-setup/WebhookInstructions.tsx`
  - [ ] Display webhook URL: `https://yourdomain.com/api/webhooks/woocommerce`
  - [ ] Display webhook secret (from vendor_stores table)
  - [ ] Instructions: How to configure webhooks in WooCommerce admin
  - [ ] Events to enable: product.created, product.updated, product.deleted

### Integration
[Goal: Connect product import UI to WooCommerce API and database storage]
- [ ] Connect "Import Products" button to importProductsFromWooCommerce action
- [ ] Display import progress and statistics
- [ ] Test manual product import end-to-end
- [ ] Test product list display with search and pagination
- [ ] Set up webhook testing with WooCommerce test store

---

## Phase 6: AI Configuration & Brand Voice
**Goal**: Configure store-specific AI chatbot settings with brand voice and policies

### Database Schema - AI Configuration
[Goal: Store brand voice settings in JSON for single-query agent access (performance)]
- [ ] Create `woovector/lib/drizzle/schema/store-ai-config.ts`
  - [ ] Add fields: id, store_id (FK to vendor_stores, UNIQUE)
  - [ ] Add brand_voice JSONB: { tone, style, personality, key_selling_points[], preferred_phrases[], avoid_phrases[] }
  - [ ] Add store_description JSONB: { what_we_sell, target_customers, specialization, unique_value_prop }
  - [ ] Add policies JSONB: { return_policy, delivery_info, payment_methods[], warranty_info }
  - [ ] Add conversation_settings JSONB: { max_conversation_length, enable_product_suggestions, enable_cross_selling, timeout_minutes }
  - [ ] Add language: text (default 'en' for English)
  - [ ] Add timestamps: created_at, updated_at
  - [ ] Add index: store_id
- [ ] Generate migration and down migration
- [ ] Apply migration

### AI Assistant Configuration Page
[Goal: Build vendor interface for configuring chatbot brand voice and behavior]
- [ ] Create `app/(protected)/ai-assistant/page.tsx` (Server Component)
  - [ ] Fetch current AI configuration for vendor's store
  - [ ] Pass configuration to client form component
- [ ] Create `components/ai-assistant/BrandVoiceForm.tsx` (Client Component)
  - [ ] Section: Brand Voice Settings
    - [ ] Select: Tone (friendly, professional, casual, enthusiastic)
    - [ ] Select: Style (conversational, formal, helpful, persuasive)
    - [ ] Textarea: Key selling points (bullet list)
    - [ ] Textarea: Preferred phrases vendor wants chatbot to use
    - [ ] Textarea: Phrases to avoid
  - [ ] Section: Store Description (for AI context)
    - [ ] Textarea: What does your store sell? (helps AI understand context)
    - [ ] Textarea: Target customers (demographics, use cases)
    - [ ] Textarea: Store specialization (what makes store unique)
  - [ ] Section: Store Policies
    - [ ] Textarea: Return policy
    - [ ] Textarea: Delivery information
    - [ ] Multi-select: Payment methods accepted
    - [ ] Textarea: Warranty information
  - [ ] Section: Conversation Settings
    - [ ] Number input: Max conversation length (default 20 messages)
    - [ ] Checkbox: Enable product suggestions
    - [ ] Checkbox: Enable cross-selling
    - [ ] Number input: Conversation timeout (minutes)
  - [ ] Buttons: "Test AI Response" and "Save Configuration"
- [ ] Create `components/ai-assistant/TestResponseDialog.tsx` (Client Component)
  - [ ] Input: Test question (e.g., "Do you ship to Rome?")
  - [ ] Display: AI-generated response preview using current settings
  - [ ] Shows how brand voice affects responses

### Server Actions - AI Configuration
[Goal: Save and retrieve AI configuration settings]
- [ ] Create `app/actions/ai-config.ts`
  - [ ] Action: saveAIConfig(config: AIConfigData) → { success, error? }
    - [ ] Validates all required fields
    - [ ] Upserts store_ai_config record
    - [ ] Returns success/error
  - [ ] Action: getAIConfig() → { config, hasConfig }
    - [ ] Returns current configuration or default values
  - [ ] Action: testAIResponse(question: string) → { response, error? }
    - [ ] Uses current AI config to generate sample response
    - [ ] Calls Gemini API with brand voice context
    - [ ] Returns formatted response preview

### AI Configuration Import from WooCommerce
[Goal: Auto-populate AI config with WooCommerce store data where possible]
- [ ] Create `lib/woocommerce/config-import.ts`
  - [ ] Function: importStoreInfoToAIConfig(storeId)
    - [ ] Fetches WooCommerce store settings
    - [ ] Extracts store description, policies from WooCommerce
    - [ ] Pre-fills store_description and policies in AI config
    - [ ] Vendor can then edit/complete missing information

### Integration
[Goal: Connect AI configuration UI to database and test response generation]
- [ ] Connect "Save Configuration" to saveAIConfig action
- [ ] Connect "Test AI Response" to testAIResponse action
- [ ] Display test responses in dialog with brand voice applied
- [ ] Import WooCommerce store info to pre-fill configuration
- [ ] Test end-to-end configuration save and retrieval

---

## Phase 7: Product Metadata Enrichment
**Goal**: Enable vendors to add AI-ready metadata for better product recommendations

### Database Schema - Product Metadata
[Goal: Store enrichment fields for enhanced AI product matching]
- [ ] Create `woovector/lib/drizzle/schema/product-metadata.ts`
  - [ ] Add fields: id, product_id (FK to products, UNIQUE)
  - [ ] Add extra_description: TEXT (vendor-added detailed description for AI)
  - [ ] Add location_tags: TEXT[] (indoor, outdoor, beach, mountain, office)
  - [ ] Add demographic_tags: TEXT[] (young_adults, families, professionals, seniors)
  - [ ] Add seasonal_tags: TEXT[] (summer, winter, christmas, back_to_school, valentine)
  - [ ] Add occasion_tags: TEXT[] (gift, daily_use, special_event, sport, work)
  - [ ] Add experience_level: TEXT[] (beginner, intermediate, expert, all_levels)
  - [ ] Add bundling_suggestions: JSONB (array of: { title, products[], discount })
  - [ ] Add cross_sell_products: UUID[] (array of product IDs)
  - [ ] Add upsell_products: UUID[] (array of product IDs)
  - [ ] Add usage_scenarios: TEXT[] (work, travel, home, gym, outdoor_adventure)
  - [ ] Add compatibility_info: TEXT (what it works with)
  - [ ] Add care_instructions: TEXT (how to maintain/use)
  - [ ] Add search_keywords: TEXT[] (additional keywords for AI matching)
  - [ ] Add ai_optimized: BOOLEAN (default false, set true when processed)
  - [ ] Add timestamps: created_at, updated_at
  - [ ] Add indexes: product_id, GIN indexes on array fields for fast tag searches
- [ ] Generate migration and down migration
- [ ] Apply migration

### Product Metadata Edit Interface
[Goal: Build enrichment interface in product catalog for adding AI-ready metadata]
- [ ] Update `components/product-catalog/ProductEditModal.tsx`
  - [ ] Add tab navigation: "Product Info" | "AI Metadata"
  - [ ] Product Info tab: Display WooCommerce product data (existing)
  - [ ] AI Metadata tab: Show metadata enrichment form
- [ ] Create `components/product-metadata/MetadataForm.tsx` (Client Component)
  - [ ] Section: Enhanced Description
    - [ ] Textarea: Extra description (detailed AI-ready product info)
    - [ ] Helper text: "Add details about use cases, benefits, who it's for"
  - [ ] Section: Tags for AI Matching
    - [ ] Multi-select: Location tags
    - [ ] Multi-select: Demographic tags
    - [ ] Multi-select: Seasonal tags
    - [ ] Multi-select: Occasion tags
    - [ ] Multi-select: Experience level
  - [ ] Section: Usage Scenarios
    - [ ] Multi-select: Usage scenarios (work, travel, home, gym, etc.)
    - [ ] Textarea: Compatibility information
    - [ ] Textarea: Care instructions
  - [ ] Section: Smart Bundling
    - [ ] Button: "Add Bundle Suggestion"
    - [ ] For each bundle: Title, Product selector (multi-select), Discount %
  - [ ] Section: Cross-Sell & Upsell
    - [ ] Product search/select: Cross-sell products
    - [ ] Product search/select: Upsell products
  - [ ] Button: "Save Metadata"

### Bulk Metadata Operations
[Goal: Enable vendors to apply metadata to multiple products at once]
- [ ] Create `components/product-metadata/BulkMetadataDialog.tsx`
  - [ ] Select multiple products from catalog
  - [ ] Apply tags to all selected products (e.g., tag 10 products as "summer" season)
  - [ ] Useful for large catalogs with similar products

### Server Actions - Product Metadata
[Goal: Save and retrieve product metadata enrichment]
- [ ] Create `app/actions/product-metadata.ts`
  - [ ] Action: saveProductMetadata(productId, metadata) → { success, error? }
    - [ ] Validates metadata fields
    - [ ] Upserts product_metadata record
    - [ ] Returns success/error
  - [ ] Action: getProductMetadata(productId) → { metadata, hasMetadata }
  - [ ] Action: bulkUpdateMetadata(productIds[], tags) → { success, updated }
    - [ ] Applies tags to multiple products
  - [ ] Action: getProductsNeedingMetadata() → products without metadata
    - [ ] Helps vendors identify products that need enrichment

### Integration
[Goal: Connect metadata enrichment UI to database and product catalog]
- [ ] Connect "Save Metadata" to saveProductMetadata action
- [ ] Display metadata status in product catalog (icon: enriched vs not enriched)
- [ ] Add "Bulk Edit Metadata" button to product catalog
- [ ] Test metadata save and retrieval end-to-end
- [ ] Verify metadata displays correctly when editing products

---

## Phase 8: Company Information System
**Goal**: Store and manage company/store information for AI chatbot company queries

### Database Schema - Company Information
[Goal: Store business information for AI agent to answer company-related questions]
- [ ] Create `woovector/lib/drizzle/schema/company.ts`
  - [ ] Add fields: id, store_id (FK to vendor_stores, UNIQUE)
  - [ ] Add company_name: TEXT
  - [ ] Add about_us: TEXT (company description, history, mission)
  - [ ] Add faq_content: JSONB (array of { question, answer } objects)
  - [ ] Add policies: JSONB (detailed policies - same as in store_ai_config but more detailed)
  - [ ] Add contact_info: JSONB ({ phone, email, address, hours })
  - [ ] Add custom_content: JSONB (vendor-added custom information)
  - [ ] Add timestamps: created_at, updated_at
  - [ ] Add index: store_id
- [ ] Generate migration and down migration
- [ ] Apply migration

### Company Information Management Page
[Goal: Build vendor interface for managing company information]
- [ ] Create `app/(protected)/company-info/page.tsx` (Server Component)
  - [ ] Fetch current company information
  - [ ] Pass to client form component
- [ ] Create `components/company-info/CompanyInfoForm.tsx` (Client Component)
  - [ ] Section: Basic Information
    - [ ] Input: Company name
    - [ ] Textarea: About Us (company description)
  - [ ] Section: Contact Information
    - [ ] Input: Phone number
    - [ ] Input: Email
    - [ ] Textarea: Physical address
    - [ ] Input: Business hours
  - [ ] Section: Frequently Asked Questions
    - [ ] Button: "Add FAQ"
    - [ ] For each FAQ: Question input, Answer textarea
    - [ ] Button: "Remove FAQ" per item
  - [ ] Section: Detailed Policies
    - [ ] Textarea: Return policy (detailed)
    - [ ] Textarea: Delivery policy (detailed)
    - [ ] Textarea: Privacy policy
    - [ ] Textarea: Terms of service
  - [ ] Section: Custom Content
    - [ ] Textarea: Additional information for AI chatbot
  - [ ] Button: "Import from WooCommerce" - Auto-fills available data
  - [ ] Button: "Save Company Information"

### Import Company Data from WooCommerce
[Goal: Auto-populate company information from WooCommerce store settings]
- [ ] Create `lib/woocommerce/company-import.ts`
  - [ ] Function: importCompanyInfoFromWooCommerce(storeId)
    - [ ] Fetches WooCommerce store settings
    - [ ] Extracts company name, address, policies
    - [ ] Pre-fills company table
    - [ ] Vendor can then edit/add missing information

### Server Actions - Company Information
[Goal: Save and retrieve company information]
- [ ] Create `app/actions/company-info.ts`
  - [ ] Action: saveCompanyInfo(companyData) → { success, error? }
    - [ ] Validates required fields
    - [ ] Upserts company record
    - [ ] Returns success/error
  - [ ] Action: getCompanyInfo() → { company, hasInfo }
  - [ ] Action: importCompanyFromWooCommerce() → { success, importedData?, error? }

### Integration
[Goal: Connect company information UI to database and WooCommerce import]
- [ ] Connect "Save Company Information" to saveCompanyInfo action
- [ ] Connect "Import from WooCommerce" to importCompanyFromWooCommerce action
- [ ] Test company info save and retrieval
- [ ] Test WooCommerce import functionality

---

## Phase 8.5: Vector Database Integration (Qdrant Cloud)
**Goal**: Set up Qdrant Cloud for ultra-fast product vector search (sub-2-second requirement)

### Qdrant Cloud Setup
[Goal: Configure Qdrant Cloud account and collection for product embeddings]
- [ ] Create Qdrant Cloud account at https://cloud.qdrant.io
- [ ] Create new cluster for WooVector production
- [ ] Create collection: `woovector_products` with configuration:
  - [ ] Vector size: 768 (Gemini embeddings dimension)
  - [ ] Distance metric: Cosine similarity
  - [ ] Enable payload indexing for filtering (store_id, categories, price_range)
- [ ] Copy Qdrant API key to .env: QDRANT_API_KEY
- [ ] Copy Qdrant cluster URL to .env: QDRANT_URL
- [ ] Copy collection name to .env: QDRANT_COLLECTION_NAME="woovector_products"

### Qdrant Client Library
[Goal: Create Qdrant client wrapper for product vector operations]
- [ ] Create `woovector/lib/vector-db/qdrant-client.ts`
  - [ ] Function: initializeQdrantClient() - Returns Qdrant client instance
  - [ ] Function: upsertProductVector(productId, embedding, metadata)
    - [ ] Stores vector embedding with product metadata payload
    - [ ] Payload includes: store_id, product_id, name, price, categories
  - [ ] Function: searchProductVectors(query, storeId, filters?, limit?)
    - [ ] Performs vector similarity search
    - [ ] Filters by store_id (vendor isolation)
    - [ ] Optional filters: price range, categories, tags
    - [ ] Returns top N similar products
  - [ ] Function: deleteProductVector(vectorId) - Removes product from vector DB
  - [ ] Function: batchUpsertVectors(products[]) - Bulk vector operations

### Product Embedding Generation
[Goal: Generate vector embeddings for products using Gemini API]
- [ ] Create `woovector/lib/vector-db/embedding-generation.ts`
  - [ ] Function: generateProductEmbedding(product, metadata?)
    - [ ] Combines product name, description, metadata into embedding text
    - [ ] Calls Gemini API for text embedding
    - [ ] Returns embedding vector (768 dimensions)
  - [ ] Function: generateEmbeddingText(product)
    - [ ] Formats product data for optimal embedding:
      - [ ] Include: name, description, extra_description, categories, tags
      - [ ] Format: "Product: [name]. Description: [desc]. Categories: [cats]. Tags: [tags]."
  - [ ] Function: batchGenerateEmbeddings(products[]) - Batch processing for performance

### Vector Sync on Product Import/Update
[Goal: Automatically sync products to Qdrant when imported or updated]
- [ ] Update `lib/woocommerce/product-import.ts`
  - [ ] After product upsert, generate embedding
  - [ ] Upload embedding to Qdrant with product metadata
  - [ ] Update products.vector_id with Qdrant ID
  - [ ] Update products.vector_synced_at timestamp
- [ ] Create background job (or immediate sync) for vector updates
  - [ ] When product metadata is updated, regenerate embedding
  - [ ] When product is deleted, remove from Qdrant

### Vector Search Query Interface
[Goal: Build query interface for testing vector search]
- [ ] Create `app/(protected)/vector-search-test/page.tsx` (Admin/testing only)
  - [ ] Input: Search query (natural language)
  - [ ] Select: Store to search (for testing)
  - [ ] Display: Top 10 matching products with similarity scores
  - [ ] Useful for vendors to test how products are matched
- [ ] Create server action: testVectorSearch(query, storeId) → matching products

### Integration
[Goal: Connect product import to vector DB embedding and storage]
- [ ] Test Qdrant connection and collection creation
- [ ] Import sample products and generate embeddings
- [ ] Test vector search with natural language queries
- [ ] Verify sub-2-second search response times
- [ ] Test product updates sync to Qdrant correctly

---

## Phase 9: Conversation Tracking System
**Goal**: Track chatbot conversations for billing, analytics, and user history

### Database Schema - Conversations
[Goal: Store conversation sessions for billing counts and user history]
- [ ] Create `woovector/lib/drizzle/schema/conversations.ts`
  - [ ] Add fields: id, store_id (FK to vendor_stores)
  - [ ] Add session_id: TEXT UNIQUE (unique identifier per conversation)
  - [ ] Add user_id: TEXT (WordPress user ID if logged in, null for anonymous)
  - [ ] Add user_email: TEXT (for user identification)
  - [ ] Add messages: JSONB (array of { role: 'user'|'assistant', content, timestamp, agent_type })
  - [ ] Add agent_routing: JSONB ({ orchestrator_decision, agents_called: [], reasoning })
  - [ ] Add conversation_metadata: JSONB ({ user_agent, ip_hash, session_duration })
  - [ ] Add conversation_status: TEXT ('active', 'ended', 'timeout')
  - [ ] Add started_at: TIMESTAMP
  - [ ] Add ended_at: TIMESTAMP
  - [ ] Add last_activity_at: TIMESTAMP
  - [ ] Add indexes: store_id, session_id, user_id, started_at
- [ ] Generate migration and down migration
- [ ] Apply migration

### Conversation Tracking Logic
[Goal: Track conversation sessions and count them for subscription billing]
- [ ] Create `lib/conversations/tracking.ts`
  - [ ] Function: startConversation(storeId, userId?, userEmail?) → sessionId
    - [ ] Creates new conversation record
    - [ ] Generates unique session_id
    - [ ] Returns session ID for WordPress plugin to use
  - [ ] Function: addMessage(sessionId, role, content, agentType?)
    - [ ] Appends message to conversation.messages array
    - [ ] Updates last_activity_at timestamp
    - [ ] If logged-in user: stores full message history
    - [ ] If anonymous: stores metadata only (no full message content)
  - [ ] Function: endConversation(sessionId)
    - [ ] Marks conversation as 'ended'
    - [ ] Sets ended_at timestamp
    - [ ] Increments usage event: 'conversation_completed'
  - [ ] Function: isSessionActive(sessionId)
    - [ ] Returns true if last_activity < 30 minutes ago
    - [ ] Returns false if timed out → creates new session

### Conversation Billing Rules
[Goal: Define how conversations are counted for subscription limits]
- [ ] Create `lib/conversations/billing-rules.ts`
  - [ ] Function: shouldCountAsNewConversation(sessionId)
    - [ ] One conversation = one session (multiple messages within 30 min = 1 conversation)
    - [ ] New session after 30 min inactivity = new conversation
    - [ ] Returns boolean: should increment conversation counter?
  - [ ] Function: getMonthlyConversationCount(userId) → count
    - [ ] Counts unique conversation sessions in current billing period
  - [ ] Function: hasReachedConversationLimit(userId) → boolean
    - [ ] Checks current count vs subscription tier limit

### Server Actions - Conversation Management
[Goal: API endpoints for conversation tracking]
- [ ] Create `app/actions/conversations.ts`
  - [ ] Action: createConversationSession(storeId, userId?, userEmail?) → { sessionId }
  - [ ] Action: appendConversationMessage(sessionId, role, content, agentType?)
  - [ ] Action: getConversationHistory(sessionId) → messages array (if logged in)
  - [ ] Action: getVendorConversations(page, filters?) → conversations list
    - [ ] For vendors to view their store's conversation history
    - [ ] Filter by date range, user, agent type

### Integration
[Goal: Connect conversation tracking to chatbot API and usage limits]
- [ ] Update `app/api/chatbot/[vendorApiKey]/route.ts` (will be created in Phase 10)
  - [ ] On each chatbot request: check if sessionId exists
  - [ ] If no sessionId: create new conversation session
  - [ ] If sessionId exists but inactive: create new session (30 min timeout)
  - [ ] If sessionId active: append message to existing conversation
  - [ ] Check conversation limit before processing
  - [ ] Return sessionId to WordPress plugin for subsequent requests
- [ ] Test conversation session creation and timeout logic
- [ ] Verify billing counter increments correctly

---

## Phase 10: Agent Orchestration & Implementation
**Goal**: Design and implement multi-agent system with orchestrator routing to specialized agents

### Agent Workflow Design (MANDATORY STEP)
[Goal: Design agent hierarchy and routing logic before implementation]
- [ ] **REQUIRED**: Run `ai_docs/dev_templates/agent_orchestrator.md` template
  - [ ] Include current understanding of WooVector agent workflow
  - [ ] Define orchestrator routing logic (product vs company queries)
  - [ ] Design specialized agent purposes and interactions
  - [ ] Plan parallel agent execution strategy (company + product simultaneously)
  - [ ] Define agent-to-web API communication patterns
- [ ] Save agent workflow design to `ai_docs/prep/woovector_agent_workflow.md`
- [ ] Review and validate agent architecture before implementation

### External Chatbot Integration Setup
[Goal: Prepare API endpoint to receive requests from external third-party chatbot and process with Mastra AI]
- [ ] **Note:** Chatbot development is handled externally by third-party
- [ ] **This project scope:** API endpoint in Next.js that receives chatbot requests and processes with Mastra AI
- [ ] Verify `woovector/ai/` Mastra setup is properly configured
- [ ] Update environment file: `woovector/ai/.env.local`
  - [ ] Add: DATABASE_URL (same as web app)
  - [ ] Add: QDRANT_URL, QDRANT_API_KEY, QDRANT_COLLECTION_NAME
  - [ ] Add: OPENAI_API_KEY or GOOGLE_API_KEY for LLM
  - [ ] Add: NEXTJS_API_URL=http://localhost:3000 (for agent callbacks)
  - [ ] Add: AGENT_SECRET (shared secret for chatbot-to-web authentication)
- [ ] Ensure Mastra AI agents are configured in `woovector/ai/src/mastra/`

### Mastra AI Agent Implementation
[Goal: Build Mastra AI agents for request routing and processing]
- [ ] Update `woovector/ai/src/mastra/agents/` with WooCommerce-specific agents
  - [ ] Create/update orchestrator agent for request routing
  - [ ] Create product discovery agent for WooCommerce product search
  - [ ] Create company info agent for store policies and information
- [ ] Configure agent workflows in `woovector/ai/src/mastra/workflows/`
- [ ] Ensure proper model configuration (GPT-4, Claude, or Gemini)
- [ ] Set up agent memory and context management using Mastra Memory

### Product Discovery Agent (Mastra AI)
[Goal: Implement Mastra AI agent for WooCommerce product search and recommendations]
- [ ] Update `woovector/ai/src/mastra/agents/` with product discovery agent
  - [ ] Configure agent to search Qdrant vector database
  - [ ] Implement product filtering and ranking logic
  - [ ] Add tools for vector search and product detail retrieval
- [ ] Create tools for product discovery:
  - [ ] Vector search tool connecting to Qdrant Cloud
  - [ ] Product details tool for WooCommerce data
  - [ ] Smart filtering based on customer context
  - [ ] Bundle generation for complementary products

### Company Information Agent (Mastra AI)
[Goal: Implement Mastra AI agent for store policies and company information]
- [ ] Update `woovector/ai/src/mastra/agents/` with company info agent
- [ ] Configure agent to access store configuration from database
- [ ] Implement brand voice application for consistent responses
- [ ] Add tools for:
  - [ ] Store policy retrieval
  - [ ] FAQ search and matching
  - [ ] Contact information formatting
  - [ ] Brand voice application


### External Chatbot API Endpoint (Next.js)
[Goal: Create API endpoint to receive requests from external third-party chatbot]
- [ ] Create `app/api/chatbot/[vendorApiKey]/route.ts`
  - [ ] POST handler: Receives requests from external chatbot
  - [ ] Validates vendor API key and subscription status
  - [ ] Processes requests with Mastra AI agents
  - [ ] Returns formatted responses to external chatbot
- [ ] Create supporting API endpoints for Mastra AI agents:
  - [ ] `app/api/agent/vector-search/route.ts` - Product search in Qdrant
  - [ ] `app/api/agent/company-info/route.ts` - Store policies and information
  - [ ] `app/api/agent/product-details/route.ts` - Detailed product information

### Mastra AI Agent Configuration
[Goal: Configure Mastra AI agents and test functionality]
- [ ] Update `woovector/ai/src/mastra/index.ts` with WooCommerce-specific agents
- [ ] Configure agent memory using Mastra Memory (LibSQL)
- [ ] Set up agent tools for database and API access
- [ ] Test Mastra agents individually:
  - [ ] Product discovery workflows
  - [ ] Company information responses
  - [ ] Multi-agent orchestration
- [ ] Update `woovector/ai/package.json` scripts:
  - [ ] `"dev": "mastra dev"` - Development mode
  - [ ] `"start": "mastra start"` - Production mode

### Integration Testing
[Goal: Test external chatbot → Next.js API → Mastra AI flow]
- [ ] Test chatbot API endpoint with sample requests
- [ ] Verify Mastra AI agent responses
- [ ] Test authentication and authorization
- [ ] Verify responses with brand voice
- [ ] Test product search and company info responses
- [ ] Measure response times (target: sub-2-second)

---

## Phase 11: WordPress Plugin Download System
**Goal**: Generate vendor-specific plugin download with embedded API key

### Plugin API Key Display
[Goal: Show vendor their plugin API key after store connection]
- [ ] Update `app/(protected)/shop-setup/page.tsx`
  - [ ] After successful store connection, display generated plugin_api_key
  - [ ] Show in read-only text field with copy button
  - [ ] Display instructions: "Use this API key when configuring the WordPress plugin"

### Plugin Download Page
[Goal: Build simple download interface for pre-built WordPress plugin]
- [ ] Create `app/(protected)/plugin-deploy/page.tsx` (Server Component)
  - [ ] Fetch vendor's store connection and plugin_api_key
  - [ ] Check if store is connected (require connection before download)
  - [ ] Pass data to client component
- [ ] Create `components/plugin-deploy/DownloadCard.tsx` (Client Component)
  - [ ] Display: Plugin status (Ready to Download / Store Not Connected)
  - [ ] Display: Vendor's plugin API key (with copy button)
  - [ ] Button: "Download WordPress Plugin" (primary CTA)
  - [ ] Display: Plugin version number
  - [ ] Link: "View Installation Guide"

### Plugin Generation & Download Endpoint
[Goal: Generate plugin zip with vendor-specific API key configuration]
- [ ] Create `lib/plugin-generation/plugin-builder.ts`
  - [ ] Function: generatePluginZip(vendorApiKey)
    - [ ] Reads pre-built plugin files from storage/template location
    - [ ] Injects vendor's plugin_api_key into plugin config file
    - [ ] Injects API_BASE_URL (production URL or localhost for dev)
    - [ ] Creates zip archive in memory
    - [ ] Returns: Buffer with zip file
  - [ ] Configuration injection:
    - [ ] Replace `{{API_KEY}}` placeholder in plugin config
    - [ ] Replace `{{API_BASE_URL}}` with actual API URL
- [ ] Create `app/api/plugin/download/route.ts`
  - [ ] GET handler: Authenticates current user
  - [ ] Fetches user's vendor store and plugin_api_key
  - [ ] Generates plugin zip with embedded API key
  - [ ] Returns zip file download: `Content-Type: application/zip`
  - [ ] Filename: `woovector-chatbot-plugin.zip`

### Installation Guide
[Goal: Provide clear instructions for WordPress plugin installation]
- [ ] Create `components/plugin-deploy/InstallationGuide.tsx`
  - [ ] Step 1: Download plugin zip from WooVector dashboard
  - [ ] Step 2: In WordPress admin, go to Plugins → Add New → Upload Plugin
  - [ ] Step 3: Choose downloaded zip file and click "Install Now"
  - [ ] Step 4: Click "Activate" after installation
  - [ ] Step 5: Plugin is now active (API key is pre-configured)
  - [ ] Step 6: Verify chatbot appears on your store front-end
  - [ ] Screenshots/visual guide for each step
- [ ] Create `app/(protected)/plugin-deploy/installation-guide/page.tsx`
  - [ ] Full page with detailed installation instructions
  - [ ] Troubleshooting section
  - [ ] FAQ about plugin configuration

### Server Actions - Plugin Download
[Goal: Handle plugin download requests]
- [ ] Create `app/actions/plugin-download.ts`
  - [ ] Action: getPluginDownloadStatus() → { canDownload, apiKey?, storeConnected }
    - [ ] Checks if vendor has connected store
    - [ ] Returns plugin API key and download status
  - [ ] Action: trackPluginDownload()
    - [ ] Logs when vendor downloads plugin (analytics)
    - [ ] Updates vendor_stores.last_plugin_download_at timestamp

### Integration
[Goal: Connect plugin download UI to zip generation and delivery]
- [ ] Connect "Download WordPress Plugin" button to `/api/plugin/download` endpoint
- [ ] Test plugin zip generation with injected API key
- [ ] Verify downloaded plugin contains correct API key and base URL
- [ ] Test download tracking (logs download event)
- [ ] Create sample WordPress test site to verify plugin installation

---

## Phase 12: External Chatbot Integration (Third-Party Integration)
**Goal**: Build API endpoint to receive requests from external third-party chatbot and process with Mastra AI

### External Chatbot API Endpoint
[Goal: Create main API endpoint that external chatbot communicates with]
- [ ] Create `app/api/chatbot/[vendorApiKey]/route.ts`
  - [ ] POST handler: Main external chatbot request endpoint
  - [ ] Request body: { message, sessionId?, userId?, userEmail? }
  - [ ] Validates vendorApiKey against vendor_stores.plugin_api_key
  - [ ] Checks subscription status and conversation limits
  - [ ] Manages conversation session (create or continue)
  - [ ] Forwards request to Mastra AI service
  - [ ] Returns agent response to external chatbot
  - [ ] Increments conversation counter for billing

### Request Validation & Rate Limiting
[Goal: Validate requests and enforce subscription limits]
- [ ] Create `lib/chatbot-api/request-validation.ts`
  - [ ] Function: validatePluginApiKey(apiKey) → { valid, storeId, userId }
    - [ ] Looks up vendor_stores by plugin_api_key
    - [ ] Returns store and user IDs
  - [ ] Function: validateSubscriptionStatus(userId) → { active, plan, limits }
    - [ ] Checks vendor has active subscription
    - [ ] Returns subscription tier and limits
  - [ ] Function: checkConversationLimit(userId) → { allowed, count, limit }
    - [ ] Checks monthly conversation count vs tier limit
    - [ ] Returns whether request is allowed
  - [ ] Function: handleOveragePolicy(userId) → 'allow' | 'block'
    - [ ] Checks vendor's overage_behavior setting
    - [ ] Returns whether to allow or block over-limit requests

### External Chatbot Request Flow
[Goal: Orchestrate complete external chatbot request handling]
- [ ] Create `lib/chatbot-api/request-handler.ts`
  - [ ] Function: handleChatbotRequest(apiKey, message, sessionId?, userId?, userEmail?)
    - [ ] Step 1: Validate plugin API key → get storeId, vendorUserId
    - [ ] Step 2: Validate subscription status → active and within limits?
    - [ ] Step 3: Manage conversation session:
      - [ ] If no sessionId or inactive: create new session
      - [ ] If sessionId active: continue existing session
    - [ ] Step 4: Fetch store context (AI config, company info, brand voice)
    - [ ] Step 5: Forward to Mastra AI service:
      - [ ] Call Mastra AI agents via internal API
      - [ ] Payload: { message, storeId, sessionId, userId?, userEmail?, storeContext }
    - [ ] Step 6: Receive agent response (orchestrator has routed and combined)
    - [ ] Step 7: Log conversation message (append to conversation history)
    - [ ] Step 8: Increment conversation counter if new session
    - [ ] Step 9: Return formatted response to external chatbot
  - [ ] Returns: { response: string, sessionId: string, agentInfo?: { ... } }

### Store Context Preparation
[Goal: Gather all necessary context for agent to process request]
- [ ] Create `lib/chatbot-api/context-builder.ts`
  - [ ] Function: buildStoreContext(storeId) → storeContext object
    - [ ] Fetches store_ai_config (brand voice, tone, style, policies)
    - [ ] Fetches company information (FAQ, about us, policies)
    - [ ] Fetches store settings (name, URL)
    - [ ] Returns: { brandVoice, policies, companyInfo, storeName, language: 'en' }
  - [ ] Agent uses this context to apply brand voice and access company data

### Response Formatting
[Goal: Format agent responses for WordPress plugin display]
- [ ] Create `lib/chatbot-api/response-formatter.ts`
  - [ ] Function: formatAgentResponse(agentResponse, storeContext)
    - [ ] Ensures response is in configured language
    - [ ] Applies final brand voice polish if needed
    - [ ] Formats product links (if product recommendations included)
    - [ ] Adds structured data for WordPress plugin rendering:
      - [ ] Text response
      - [ ] Product cards (if applicable): { id, name, price, image, url }
      - [ ] Actions (e.g., "View Product Details" button for products)
    - [ ] Returns: { text, products?, actions? }

### Error Handling & Fallbacks
[Goal: Graceful error handling for production reliability]
- [ ] Create `lib/chatbot-api/error-handler.ts`
  - [ ] Function: handleAPIError(error, context)
    - [ ] Logs error details for debugging
    - [ ] Returns user-friendly error message
  - [ ] Error scenarios:
    - [ ] Invalid API key: "Plugin not configured correctly"
    - [ ] Subscription expired: "Subscription expired. Please contact the vendor."
    - [ ] Conversation limit reached: "Conversation limit reached. Try again later."
    - [ ] Agent service down: "Service temporarily unavailable"
    - [ ] General error: "Unexpected error. Please try again."

### Testing & Monitoring
[Goal: Test chatbot API endpoint thoroughly]
- [ ] Create test script: `woovector/scripts/test-chatbot-api.ts`
  - [ ] Simulates WordPress plugin requests
  - [ ] Tests product queries, company queries
  - [ ] Tests conversation session management
  - [ ] Tests limit enforcement
  - [ ] Tests error scenarios
- [ ] Add logging for monitoring:
  - [ ] Request count per vendor
  - [ ] Response times
  - [ ] Error rates
  - [ ] Agent routing decisions (which agent handled request)

### Integration Testing
[Goal: Test external chatbot API integration with Mastra AI and all data systems]
- [ ] Test external chatbot API with sample requests
- [ ] Verify vendor API key validation works
- [ ] Test conversation session creation and continuation
- [ ] Test conversation limit enforcement
- [ ] Test Mastra AI agent responses with brand voice
- [ ] Verify product search and company info both work
- [ ] Test agent orchestration and response combination
- [ ] Measure response times (target: sub-2-second)

---

## Phase 13: Analytics & Performance Dashboard
**Goal**: Build vendor analytics dashboard showing chatbot performance and sales impact

### Database Queries - Analytics
[Goal: Create queries to aggregate conversation and performance data]
- [ ] Create `lib/analytics/conversation-analytics.ts`
  - [ ] Function: getConversationStats(userId, dateRange)
    - [ ] Total conversations in period
    - [ ] Average conversation length (messages)
    - [ ] Peak usage times (hourly breakdown)
    - [ ] Most common query types (product vs company)
  - [ ] Function: getProductPerformance(userId, dateRange)
    - [ ] Most recommended products
    - [ ] Product click-through rates (if WordPress plugin sends click events)
    - [ ] Products with highest engagement
  - [ ] Function: getSalesImpact(userId, dateRange)
    - [ ] Estimated sales impact (conversations → product views)
    - [ ] Revenue correlation (if available)
    - [ ] Conversion funnel: conversation → product click → purchase

### Analytics Dashboard Page
[Goal: Build comprehensive analytics interface for vendors]
- [ ] Create `app/(protected)/analytics/page.tsx` (Server Component)
  - [ ] Date range selector (last 7 days, 30 days, 90 days, custom)
  - [ ] Fetches analytics data for selected date range
  - [ ] Passes data to client components
- [ ] Create `components/analytics/UsageMetricsCard.tsx`
  - [ ] Display: Total conversations used this month
  - [ ] Display: Conversations vs limit progress bar
  - [ ] Display: Average conversation length
  - [ ] Display: Peak usage times chart
- [ ] Create `components/analytics/ProductPerformanceCard.tsx`
  - [ ] Display: Top 10 recommended products
  - [ ] Display: Product click-through rates
  - [ ] Display: Product engagement scores
  - [ ] Table: Product name, recommendations count, clicks, CTR
- [ ] Create `components/analytics/SalesImpactCard.tsx`
  - [ ] Display: Estimated conversations leading to product views
  - [ ] Display: Conversion funnel visualization
  - [ ] Display: Estimated revenue impact (based on average order value)

### Query Type Distribution
[Goal: Show vendors how their chatbot is being used]
- [ ] Create `components/analytics/QueryTypeChart.tsx`
  - [ ] Pie chart: Product queries vs Company queries
  - [ ] Helps vendors understand customer needs
  - [ ] Informs what content needs improvement (e.g., if many company queries, improve FAQ)

### Conversation History View
[Goal: Allow vendors to review past conversations]
- [ ] Create `app/(protected)/analytics/conversations/page.tsx`
  - [ ] Table: List of conversations with date, user (if logged in), message count
  - [ ] Click to expand: View full conversation thread
  - [ ] Filter: By date, user, query type, agent used
  - [ ] Pagination for large conversation lists

### Export Analytics
[Goal: Enable vendors to export analytics data]
- [ ] Create `lib/analytics/export.ts`
  - [ ] Function: exportConversationsToCSV(userId, dateRange)
  - [ ] Function: exportProductPerformanceToCSV(userId, dateRange)
- [ ] Add export button to analytics dashboard
  - [ ] Downloads CSV file with selected analytics data

### Server Actions - Analytics
[Goal: Fetch and export analytics data]
- [ ] Create `app/actions/analytics.ts`
  - [ ] Action: getAnalyticsDashboard(dateRange) → { usage, products, sales, queryTypes }
  - [ ] Action: getConversationHistory(page, filters) → conversations list
  - [ ] Action: exportAnalytics(type, dateRange) → CSV data

### Integration
[Goal: Connect analytics dashboard to conversation and product data]
- [ ] Test analytics queries with sample conversation data
- [ ] Verify all metrics display correctly
- [ ] Test date range filtering
- [ ] Test conversation history view
- [ ] Test CSV export functionality
- [ ] Verify performance with large datasets (pagination, indexes)

---

## Phase 14: Admin Vendor Management (Super Administrator)
**Goal**: Build super administrator dashboard for managing all vendors and system metrics

### Admin Role Verification
[Goal: Ensure admin routes are protected and only accessible to admins]
- [ ] Update `middleware.ts` to check user role for `/admin/*` routes
  - [ ] Verify user role is 'admin' before allowing access
  - [ ] Redirect non-admin users to dashboard
- [ ] Create `lib/auth/admin-check.ts`
  - [ ] Function: isUserAdmin(userId) → boolean
  - [ ] Function: requireAdmin() - Server-side admin check for server actions

### Admin Navigation
[Goal: Add admin section to sidebar for super administrators]
- [ ] Update `components/layout/AppSidebar.tsx`
  - [ ] Conditionally show admin section if user role is 'admin'
  - [ ] Admin menu items:
    - [ ] Vendor Management
    - [ ] Platform Analytics
    - [ ] System Admin
  - [ ] Visual separator between vendor features and admin features

### Vendor Management Page
[Goal: Display all vendor accounts with subscription and usage information]
- [ ] Create `app/(protected)/admin/vendors/page.tsx` (Server Component)
  - [ ] Fetch all vendors with subscription and usage data
  - [ ] Support filtering: by plan, by status, by registration date
  - [ ] Support search: by name, email
  - [ ] Pagination for large vendor lists
- [ ] Create `components/admin/VendorTable.tsx` (Client Component)
  - [ ] Table columns: Vendor Name, Email, Plan, Status, Trial/Paid, Last Active, Actions
  - [ ] Status indicators: Active (green), Trial (yellow), Expired (red), Canceled (gray)
  - [ ] Search and filter controls
  - [ ] Click vendor row → navigate to vendor detail page
  - [ ] Actions per vendor: View Details, Suspend, Send Notification

### Individual Vendor Detail Page
[Goal: Admin view of single vendor with full details and management actions]
- [ ] Create `app/(protected)/admin/vendors/[userId]/page.tsx` (Server Component)
  - [ ] Fetch vendor details, subscription, usage, stores, conversations
  - [ ] Display comprehensive vendor profile
- [ ] Create `components/admin/VendorDetailCard.tsx`
  - [ ] Section: Vendor Information (name, email, registration date, role)
  - [ ] Section: Subscription Details (plan, billing cycle, status, dates)
  - [ ] Section: Usage Statistics (products, conversations, limits)
  - [ ] Section: Connected Stores (store URLs, last sync, status)
  - [ ] Section: Conversation History (recent conversations)
  - [ ] Section: Admin Actions
    - [ ] Button: Suspend Account
    - [ ] Button: Reactivate Account
    - [ ] Button: Delete Account (with confirmation)
    - [ ] Button: Send Email Notification
    - [ ] Button: Manual Billing Adjustment (Stripe portal link)
    - [ ] Button: View Full Conversation Logs

### Platform Analytics Page
[Goal: System-wide metrics for business monitoring]
- [ ] Create `app/(protected)/admin/analytics/page.tsx` (Server Component)
  - [ ] Fetch platform-wide analytics
  - [ ] Date range selector (last 30 days, 90 days, all time)
- [ ] Create `components/admin/RevenueMetricsCard.tsx`
  - [ ] Display: Monthly Recurring Revenue (MRR)
  - [ ] Display: Annual Run Rate (ARR)
  - [ ] Display: Trial conversion rate (trial → paid)
  - [ ] Display: Churn rate (canceled subscriptions)
  - [ ] Chart: Revenue trend over time
- [ ] Create `components/admin/GrowthMetricsCard.tsx`
  - [ ] Display: New trials this month
  - [ ] Display: New paid subscriptions
  - [ ] Display: Total active vendors
  - [ ] Display: Tier distribution (Starter vs Professional)
  - [ ] Chart: User growth over time
- [ ] Create `components/admin/SystemHealthCard.tsx`
  - [ ] Display: Total conversations processed
  - [ ] Display: Average response time (sub-2-second target)
  - [ ] Display: Error rates
  - [ ] Display: Agent usage distribution (product/company)

### System Administration Page
[Goal: Global system settings and infrastructure monitoring]
- [ ] Create `app/(protected)/admin/system/page.tsx` (Server Component)
  - [ ] System health status
  - [ ] Infrastructure metrics
- [ ] Create `components/admin/InfrastructureCard.tsx`
  - [ ] Display: Database status (connection, size)
  - [ ] Display: Vector DB status (Qdrant connection, collection size)
  - [ ] Display: Mastra AI service status (running, response time)
  - [ ] Display: Stripe integration status
  - [ ] Display: WooCommerce webhook health
- [ ] Create `components/admin/GlobalSettingsCard.tsx`
  - [ ] Configure: Default subscription limits (if needed)
  - [ ] Configure: System-wide AI settings
  - [ ] Configure: Email notification templates
  - [ ] Button: Run system diagnostics

### Server Actions - Admin Operations
[Goal: Admin-only actions for vendor and system management]
- [ ] Create `app/actions/admin.ts`
  - [ ] Action: getAllVendors(page, filters) → vendors list
  - [ ] Action: getVendorDetail(userId) → comprehensive vendor data
  - [ ] Action: suspendVendorAccount(userId) → updates status
  - [ ] Action: reactivateVendorAccount(userId)
  - [ ] Action: deleteVendorAccount(userId) → with confirmation
  - [ ] Action: getPlatformAnalytics(dateRange) → MRR, ARR, churn, growth
  - [ ] Action: getSystemHealth() → infrastructure status
  - [ ] All actions: Verify admin role before executing

### Integration
[Goal: Connect admin dashboard to all vendor and system data]
- [ ] Test admin role verification on all admin routes
- [ ] Test vendor management: list, search, filter, detail view
- [ ] Test admin actions: suspend, reactivate (with test vendor account)
- [ ] Verify platform analytics display correct revenue metrics
- [ ] Test system health monitoring
- [ ] Verify non-admin users cannot access admin routes

---

## Phase 15: Advanced Features & Polish
**Goal**: Implement email notifications, overage handling, and final UX improvements

### Email Notification System
[Goal: Send automated emails for trial ending, limit warnings, payment failures]
- [ ] Set up email service (Resend, SendGrid, or similar)
  - [ ] Add email service API key to .env
- [ ] Create `lib/email/templates.ts`
  - [ ] Template: trialEndingReminder (7 days before, day of expiration)
  - [ ] Template: limitApproachingWarning (80%, 95% of conversation limit)
  - [ ] Template: limitExceeded (when limit reached)
  - [ ] Template: paymentFailed (Stripe payment failure)
  - [ ] Template: subscriptionCanceled (when vendor cancels)
  - [ ] Template: welcomeEmail (after successful signup)
  - [ ] All templates: Multi-language option
- [ ] Create `lib/email/notification-service.ts`
  - [ ] Function: sendTrialEndingEmail(userId, daysRemaining)
  - [ ] Function: sendLimitWarningEmail(userId, usagePercent, limitType)
  - [ ] Function: sendPaymentFailedEmail(userId, subscriptionId)
  - [ ] Function: sendWelcomeEmail(userId)

### Email Notification Triggers
[Goal: Trigger email notifications at appropriate times]
- [ ] Create background job or scheduled task (can be simple cron for MVP)
  - [ ] Daily check: Find trials ending in 7 days → send reminder
  - [ ] Daily check: Find trials expired today → send notice
  - [ ] On usage event: Check if approaching limit (80%, 95%) → send warning
  - [ ] On Stripe webhook: payment_intent.payment_failed → send payment failed email
- [ ] Update usage tracking to check limits and trigger emails:
  - [ ] After each conversation: check if 80% or 95% of limit → send email

### Overage Handling Implementation
[Goal: Implement vendor choice of "block" or "pay" for over-limit conversations]
- [ ] Update chatbot API request handler:
  - [ ] If conversation limit exceeded:
    - [ ] Check vendor_subscriptions.overage_behavior
    - [ ] If 'block': Return error message to WordPress plugin
    - [ ] If 'pay': Allow conversation and charge extra (Stripe invoice)
- [ ] Create `lib/billing/overage-billing.ts`
  - [ ] Function: handleOverageConversation(userId, conversationCount)
    - [ ] Creates Stripe invoice item for overage charges
    - [ ] Charges vendor for extra conversations
    - [ ] Logs overage usage event
- [ ] Update profile/billing page to allow vendors to configure overage behavior:
  - [ ] Radio buttons: "Block chatbot when limit reached" vs "Charge me for extra conversations"
  - [ ] Display overage pricing (e.g., €0.10 per extra conversation)

### User Experience Polish
[Goal: Final UX improvements for production readiness]
- [ ] Add loading states to all forms and data fetching components
- [ ] Add success/error toasts for all user actions (using sonner)
- [ ] Add confirmation dialogs for destructive actions (delete, disconnect)
- [ ] Add help text and tooltips for complex features
- [ ] Add keyboard shortcuts for common actions (search, navigation)
- [ ] Add empty states for tables and lists ("No products yet - import from WooCommerce")
- [ ] Add progress indicators for long-running operations (product import)

### Documentation & Help Center
[Goal: Create in-app help resources for vendors]
- [ ] Create `app/(protected)/help/page.tsx`
  - [ ] FAQ section with common questions
  - [ ] Video tutorials (embed YouTube videos)
  - [ ] Contact support form
- [ ] Add help icon/button to main navigation
- [ ] Add contextual help tooltips throughout the application

### Performance Optimization
[Goal: Ensure sub-2-second chatbot responses and fast page loads]
- [ ] Optimize database queries: Add indexes where needed
- [ ] Optimize vector search: Configure Qdrant for best performance
- [ ] Add caching where appropriate (company info, AI config)
- [ ] Optimize Next.js bundle size: Use dynamic imports for large components
- [ ] Monitor Mastra AI agent response times: Ensure proper execution
- [ ] Add response time logging for monitoring

### Integration Testing
[Goal: Test complete end-to-end workflows]
- [ ] Test: Vendor signup → store connection → product import → AI config → plugin download → chatbot works
- [ ] Test: End user chatbot flow → product query → company query
- [ ] Test: Subscription limits → conversation count → overage behavior
- [ ] Test: Email notifications → trial ending, limit warnings
- [ ] Test: Admin workflows → vendor management, platform analytics
- [ ] Test: Payment flow → Stripe checkout, subscription updates, webhooks

### Integration
[Goal: Deploy all advanced features and verify production readiness]
- [ ] Set up email service and test notification delivery
- [ ] Test overage handling with both "block" and "pay" options
- [ ] Verify all UX improvements work across browsers and devices
- [ ] Test help documentation and support resources
- [ ] Run performance tests: Measure chatbot response times
- [ ] Complete end-to-end testing of all workflows

---

## 🎉 **Roadmap Complete - Ready for Implementation**

**What You've Built:**
- ✅ Full-stack WooCommerce AI chatbot SaaS platform
- ✅ Multi-agent orchestration with product and company agents
- ✅ Two-tier subscription system with Stripe integration
- ✅ Ultra-fast vector search with Qdrant Cloud (sub-2-second)
- ✅ WordPress plugin download with vendor-specific API keys
- ✅ Multi-language chatbot with brand voice customization
- ✅ Comprehensive analytics and admin dashboards
- ✅ Complete conversation tracking and usage limit enforcement

**Your Application Supports:**
- 🤖 Intelligent agent routing to specialized sub-agents
- 🔍 Parallel agent execution for hybrid queries
- 💬 Conversation session management with billing integration
- 📊 Real-time analytics for vendor performance monitoring
- 👥 Super admin platform management with revenue metrics
- 📈 Scalable Mastra AI architecture for production

**Next Steps:**
1. **Start with Phase 0** - Run SETUP.md to understand codebase
2. **Execute phases sequentially** - Complete each phase fully before moving to next
3. **Test after each phase** - Verify functionality before proceeding
4. **Deploy to production** - When all phases complete and tested

Happy building! 🚀







