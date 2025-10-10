## App Pages & Functionality Blueprint

### App Summary  
**End Goal:** Help WooCommerce vendors achieve increased sales and conversion rates by helping their customers discover relevant products based on specific needs and occasions using a SaaS platform that manages product imports, enriches them with custom metadata for AI agents, and stores them in vector databases for ultra-fast chatbot responses.

**Core Value Proposition:** Ultra-fast AI chatbots that increase WooCommerce vendor conversions by 20-30% through intelligent product discovery and personalized shopping guidance

**Target Users:** 
- **Primary:** WooCommerce Vendors (small-to-medium businesses seeking conversion optimization)
- **Secondary:** Super Administrators (platform owners managing vendors and system operations)  
- **End Users:** Shoppers on WooCommerce stores using AI chatbot for product discovery and pre-sales support

**Template Type:** WooCommerce SaaS with Mastra AI agents and external chatbot integration

---

## 🌐 Universal SaaS Foundation

### Public Marketing Pages
- **Landing Page** — `/` 
  - Hero messaging emphasizing ultra-fast response advantage over slow competitors
  - WooCommerce-specific feature highlights: API integration, plugin deployment, metadata enrichment
  - Two-tier pricing section (Starter €29/month, Professional €59/month) with free trial CTA
  - Social proof positioning for e-commerce market
  - Direct CTA to sign-up with plan selection

- **Contact Page** — `/contact`
  - Contact form for pre-sales questions and technical support
  - Business inquiry information for WooCommerce vendors
  - Support channels and response time expectations

- **Legal Pages** — `/privacy`, `/terms`, `/cookies`
  - Privacy policy (GDPR compliant for EU market)
  - Terms of service (SaaS subscription terms, usage limits, AI processing)
  - Cookie policy (GDPR compliance for EU market)

- **Resource Pages** — `/faq`, `/docs` (footer links)
  - Frequently asked questions about WooCommerce integration
  - Documentation and setup guides for vendors

### Public Website Header Navigation
- Home, Features, Pricing, Resources, Contact, Login, Sign Up (Free Trial)

### Authentication Flow
- **Login** — `/auth/login` (Vendor and Super Admin access with role detection)
- **Sign Up** — `/auth/sign-up` (New vendor registration with plan selection: Starter/Professional)  
- **Forgot Password** — `/auth/forgot-password` (Password reset workflow)
- **Sign Up Success** — `/auth/sign-up-success` (Registration confirmation and trial start)

---

## ⚡ Core Application Pages

### Main Vendor Dashboard
- **Dashboard Overview** — `/dashboard`
  - Trial countdown timer with days remaining and upgrade prompts (Frontend)
  - Real-time usage metrics: products imported, conversations used vs limits (Frontend)
  - Quick action buttons: Connect Shop, Import Products, Download Plugin (Frontend)
  - Performance summary: total conversations, estimated sales impact (Frontend)
  - Fetch vendor subscription status and usage from Stripe + database (Backend Process)
  - Calculate and display usage percentages against plan limits (Backend Process)

### WooCommerce Integration
- **Shop Setup** — `/shop-setup`
  - WooCommerce API credentials input form (REST API key, secret, shop URL) (Frontend)
  - Test connection button with real-time validation (Frontend)
  - Connection status indicator (connected/disconnected/error) (Frontend)
  - Webhook setup instructions for automatic product sync (Frontend)
  - Validate WooCommerce API credentials and store securely (Backend Process)
  - Generate unique API key for WordPress plugin communication (Backend Process)
  - Test API connection and fetch basic shop info for validation (Backend Process)

### Product Management
- **Product Catalog** — `/product-catalog`
  - Manual "Import Products" button with progress indicator (Frontend)
  - Product list table with search, filter by category, pagination (Frontend)
  - Sync status indicators: last sync time, auto-sync enabled/disabled (Frontend)
  - Import products from WooCommerce API in batches (Backend Process)
  - Process and store products in local database + vector database (Backend Process)
  - Handle webhook updates from WooCommerce for automatic sync (Backend Process)
  - Vector embedding generation for fast similarity search (Backend Process)

- **Individual Product Editing** — `/product-catalog/[productId]`
  - Product editing modal for "extra description" metadata fields (Frontend)
  - AI-ready metadata enrichment for intelligent recommendations (Frontend)
  - Save enhanced product metadata for vector search optimization (Backend Process)

### AI Configuration
- **AI Assistant** — `/ai-assistant`
  - Brand voice settings form: tone, style, personality, key selling points (Frontend)
  - Policy configuration: return policy, shipping info, payment methods (Frontend)
  - Preferred phrases and language customization (Frontend)
  - Chatbot behavior settings: conversation limits exceeded actions (Frontend)
  - Smart bundling configuration: complementary product suggestions (Frontend)
  - Save brand configuration and integrate with AI agent prompts (Backend Process)
  - Test AI responses with current brand voice settings (Backend Process)

### Plugin Deployment
- **Plugin & Deploy** — `/plugin-deploy`
  - WordPress plugin download button with unique API key generation (Frontend)
  - Step-by-step installation guide with screenshots (Frontend)
  - Plugin configuration instructions: API key input, chatbot placement (Frontend)
  - Installation verification: test connection from plugin to SaaS (Frontend)
  - Risk-free uninstall instructions and guarantee messaging (Frontend)
  - Generate vendor-specific plugin package with embedded API key (Backend Process)
  - Track plugin download and installation status (Backend Process)

### Performance Monitoring
- **Analytics** — `/analytics`
  - Conversation analytics: total conversations, popular queries, response times (Frontend)
  - Sales impact metrics: conversations leading to product views, estimated revenue (Frontend)
  - Product performance: most recommended products, bundling success rates (Frontend)
  - Usage monitoring: conversations used vs limits, overage alerts (Frontend)
  - Export analytics data to CSV for vendor reporting (Frontend)
  - Calculate performance metrics during page load (Backend Process)
  - Track product clicks and conversions from chatbot recommendations (Backend Process)

### User Account Management  
- **Profile** — `/profile`
  - Personal profile: name, email, password change, notification preferences (Frontend)
  - Account security: two-factor authentication, login history (Frontend)
  - Communication preferences: email alerts for limits, trial ending, payment failures (Frontend)
  - Update vendor profile information and security settings (Backend Process)

- **Billing & Usage** — `/billing`
  - Current subscription display: plan, billing cycle, next payment date (Frontend)
  - Usage dashboard: current usage vs plan limits with visual progress bars (Frontend)
  - Upgrade/downgrade options: immediate upgrade, renewal-based downgrade (Frontend)
  - Payment method management: add/remove cards, billing address (Frontend)
  - Invoice history and download links (Frontend)
  - Link to Stripe customer portal for complex billing operations (Frontend Integration)
  - Process subscription changes via Stripe API (Backend Process)
  - Send usage alerts when approaching limits during dashboard load (Backend Process)
  - Handle payment webhooks and subscription status updates (Backend Process)

---

## 💰 Business Model Pages

### Subscription Management
- **Two-Tier Pricing Structure:**
  - **Starter Plan:** €29/month or €290/year (~17% discount)
    - Up to 5,000 products | Up to 500 conversations/month
  - **Professional Plan:** €59/month or €590/year (~17% discount)  
    - Up to 10,000 products | Up to 2,000 conversations/month

- **Free Trial Management:**
  - 1-month free trial with chosen tier limits
  - Manual renewal after trial expiration (no automatic billing)
  - Service interruption after trial with 7-day grace period
  - Email reminders: 7 days before, day of expiration, 3 days after
  - Easy reactivation flow with one-click subscribe

### Usage Enforcement
- Real-time subscription verification before all protected actions
- Check subscription status before every chatbot API call (Backend Process)
- Block product imports when product limit exceeded (Backend Process)
- Display usage warnings at 80% of limits (Frontend + Backend Process)
- Email alerts when limits exceeded during API calls (Backend Process)

### Stripe Integration
- **Webhook Handlers:**
  - `subscription.created` → Activate trial or paid subscription
  - `payment.failed` → Send alerts, update account status  
  - `subscription.cancelled` → Deactivate account, data retention policy
  - `subscription.updated` → Handle plan changes, billing updates

- **Payment Flow:**
  - Stripe customer portal integration for complex billing features
  - Payment method collection during trial signup
  - Immediate upgrade processing (pay difference)
  - Renewal-based downgrade implementation

---

## 👥 Admin Features (Super Administrator)

### Platform Management
- **Vendor Management** — `/admin/vendors`
  - All vendor accounts table: name, plan, status, trial/paid, last active (Frontend)
  - Vendor search and filtering: by plan, status, registration date (Frontend)
  - Account actions: suspend, reactivate, delete, send notifications (Frontend)
  - Fetch all vendor data with subscription and usage information (Backend Process)
  - Administrative actions with audit logging (Backend Process)

- **Individual Vendor Details** — `/admin/vendors/[vendorId]`
  - Vendor detail view: usage, payment history, support notes (Frontend)
  - Usage monitoring: vendors approaching limits, overage patterns (Frontend)
  - Support tools: account access control, manual billing adjustments (Frontend)

### Business Analytics
- **Platform Analytics** — `/admin/analytics`
  - Revenue metrics: Monthly Recurring Revenue (MRR), Annual Run Rate (ARR) (Frontend)
  - Growth metrics: new trials, trial-to-paid conversion rate, churn rate (Frontend)
  - Tier distribution: Starter vs Professional subscriber breakdown (Frontend)
  - Payment health: failed payments, retry success rates, voluntary cancellations (Frontend)
  - Calculate business metrics from Stripe and usage data during page load (Backend Process)

### System Administration
- **System Admin** — `/admin/system`
  - Global system settings: default limits, pricing configuration (Frontend)
  - AI infrastructure monitoring: costs per conversation, model performance (Frontend)
  - Payment issue management: failed payment tracking, retry status (Frontend)
  - System health: database status, API performance, system monitoring (Frontend)
  - Administrative controls for global system configuration (Backend Process)
  - Monitor system health during admin page loads (Backend Process)

---

## 📱 Navigation Structure  

### Main Sidebar (Responsive)
**Core Business Workflow (Top Priority)**
- Dashboard - Overview, trial status, quick actions, performance summary
- Shop Setup - WooCommerce connection, API configuration, sync status  
- Product Catalog - Import, metadata enrichment, product management
- AI Assistant - Brand voice, chatbot configuration, response settings
- Plugin & Deploy - WordPress plugin download, API keys, installation
- Analytics - Performance metrics, conversation analytics, sales impact

**Account Management (Bottom Section)**
- Profile - Personal settings, account preferences, notifications
- Billing & Usage - Subscription, usage limits, payment methods

**👑 Super Administrator (Role-Based Visibility)**
- Vendor Management - All vendor accounts, subscription overview
- Platform Analytics - Revenue metrics, system performance, AI costs
- System Admin - Global settings, infrastructure monitoring

### Mobile Navigation  
- Collapsible hamburger menu with touch-optimized interface
- Essential workflow prioritized: Dashboard → Shop Setup → Catalog → Deploy
- Account settings in secondary mobile menu section

---

## 🔧 Next.js App Router Structure

### Layout Groups
```
app/
├── (public)/          # Marketing and legal pages
├── (auth)/             # Authentication flow  
├── (protected)/        # Main authenticated vendor app
├── (admin)/            # Super administrator pages
└── api/                # External communication endpoints
```

### Complete Route Mapping
**🌐 Public Routes**
- `/` → Landing page with WooVector.io value proposition
- `/contact` → Contact form and support information
- `/privacy` → Privacy policy (GDPR compliant)
- `/terms` → Terms of service (SaaS subscription terms)
- `/cookies` → Cookie policy (GDPR compliance)
- `/faq` → Frequently asked questions (footer link)
- `/docs` → Documentation and guides (footer link)

**🔐 Auth Routes**
- `/auth/login` → Vendor and Super Admin login with role detection
- `/auth/sign-up` → New vendor registration with plan selection
- `/auth/forgot-password` → Password reset workflow
- `/auth/sign-up-success` → Registration confirmation and trial start

**🛡️ Protected Routes (Authenticated Vendors)**  
- `/dashboard` → Overview, trial status, usage metrics, quick actions
- `/shop-setup` → WooCommerce API connection, webhook configuration
- `/product-catalog` → Imported products, metadata enrichment management
- `/product-catalog/[productId]` → Individual product metadata editing
- `/ai-assistant` → Brand voice configuration, chatbot settings
- `/plugin-deploy` → WordPress plugin download, API keys, installation guide
- `/analytics` → Performance metrics, conversation analytics, sales impact
- `/profile` → Personal account settings, password, notifications
- `/billing` → Subscription management, usage tracking, payment methods

**👑 Admin Routes (Role-Based Access)**
- `/admin/vendors` → All vendor accounts, subscription status, management
- `/admin/vendors/[vendorId]` → Individual vendor details, usage, support tools
- `/admin/analytics` → Platform revenue metrics, MRR, churn rates, growth
- `/admin/system` → Infrastructure monitoring, AI costs, global settings

**🔧 Backend Architecture**

**API Endpoints (External Communication Only)**
- `/api/webhooks/stripe/route.ts` → Stripe subscription webhooks (payment events)
- `/api/webhooks/woocommerce/route.ts` → WooCommerce product sync webhooks
- `/api/chatbot/[vendorApiKey]/route.ts` → WordPress plugin chatbot communication
- `/api/health/route.ts` → System health checks for monitoring

**Server Actions (Internal App Functionality)**
- `app/actions/auth.ts` → Login, registration, password reset
- `app/actions/shop-setup.ts` → WooCommerce API validation, connection testing
- `app/actions/products.ts` → Product import, metadata updates, sync management
- `app/actions/ai-config.ts` → Brand voice settings, chatbot configuration
- `app/actions/billing.ts` → Subscription management, usage tracking
- `app/actions/admin.ts` → Vendor management, platform administration

**Lib Queries (Database & Business Logic)**
- `lib/queries/vendors.ts` → Vendor account data, subscription status
- `lib/queries/products.ts` → Product catalog, metadata, vector search
- `lib/queries/usage.ts` → Conversation tracking, limit enforcement
- `lib/queries/analytics.ts` → Performance metrics, sales tracking
- `lib/queries/admin.ts` → Platform analytics, system monitoring

**Architecture Flow**
- Frontend → Server Actions → Lib Queries → Database (Internal SaaS functionality)
- WordPress Plugin → `/api/chatbot/[vendorApiKey]` → Server Actions → Vector Search (External chatbot)
- Stripe → `/api/webhooks/stripe` → Server Actions → Lib Queries (Payment processing)
- WooCommerce → `/api/webhooks/woocommerce` → Server Actions → Product sync (External sync)

---

## 🎯 MVP Functionality Summary

This blueprint delivers your core value proposition: **Help WooCommerce vendors achieve increased sales and conversion rates through ultra-fast AI chatbots with intelligent product discovery**

**Phase 1 (Launch Ready):**
- Universal SaaS foundation (auth, legal, responsive design, GDPR compliance)
- Complete WooCommerce vendor workflow: shop connection → product import → metadata enrichment → AI configuration → plugin deployment → performance monitoring
- Two-tier subscription model (€29/€59 monthly/annual) with manual trial renewal
- Stripe integration with minimal webhooks and real-time usage enforcement
- Super Administrator platform management with revenue analytics and vendor oversight
- MVP constraints: No background jobs, real-time processing, simple deployment architecture

**Phase 2 (Growth Features):**  
- Multi-store management for enterprise vendors
- Advanced AI training with vendor conversation data
- A/B testing for chatbot responses and conversion optimization
- Integration marketplace (email marketing, CRM, inventory management)
- Advanced analytics with customer journey optimization
- Background job infrastructure for improved performance

> **Next Step:** Ready for wireframe design with this concrete, development-ready blueprint

---

## 🔄 Technical Implementation Notes

**MVP Architectural Decisions:**
- **No Background Jobs:** All processing happens during user interactions for simpler deployment
- **Real-time Usage Checks:** Subscription and limit verification during API calls
- **Stripe as Source of Truth:** Authoritative subscription status from Stripe API
- **Manual Trial Renewal:** Trust-building approach with service interruption after trial
- **Minimal Webhooks:** Only essential events (subscription changes, payment failures)
- **Server Actions for Internal Logic:** Avoiding API route complexity for SaaS functionality

**Scalability Considerations:**
- Layout groups support easy role-based feature additions
- Vector database architecture ready for fast product search scaling
- Modular query structure supports future feature expansion
- External API structure prepared for additional integrations

**EU Market Compliance:**
- GDPR-compliant data handling and user consent flows
- Manual subscription renewal for transparent billing
- Multi-language support infrastructure in AI configuration
- EU-friendly privacy policies and cookie management







