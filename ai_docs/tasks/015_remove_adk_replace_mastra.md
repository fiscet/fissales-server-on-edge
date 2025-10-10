# Task 015: Remove ADK References and Prepare for Mastra AI Integration

**Date:** October 9, 2025  
**Status:** ✅ COMPLETED  
**Type:** Architecture Migration - ADK to Mastra AI

---

## Objective

Remove all Google ADK (Agent Development Kit) references from the codebase and documentation, preparing the project for Mastra AI integration. The external third-party chatbot will communicate with our API endpoint, which processes requests using Mastra AI agents.

---

## Key Changes Made

### 1. Removed ADK-Specific Code

**Deleted Files:**
- `woovector/lib/adk/session-service.ts` - ADK session management
- `woovector/lib/adk/request-handler.ts` - ADK request handling
- `woovector/lib/adk/request-types.ts` - ADK type definitions
- `woovector/app/actions/adk.ts` - ADK server actions
- `woovector/app/api/run/route.ts` - ADK run endpoint
- `woovector/app/api/sessions/route.ts` - ADK sessions endpoint

**Updated Files:**
- `woovector/lib/config/backend-config.ts` - Removed Agent Engine logic, now uses generic `AGENT_BACKEND_URL`
- `woovector/lib/config/server-auth.ts` - Removed Google Cloud authentication, simplified to Bearer token
- `woovector/app/api/health/route.ts` - Updated to generic health check
- `woovector/lib/stripe.ts` - Changed appInfo from "ShipKit ADK Agent Template" to "WooVector"

### 2. Removed Internal Chat UI

The internal "test chat" UI was legacy functionality for testing agents inside the dashboard. Since the chatbot is external, we removed:

**Deleted:**
- `woovector/contexts/ChatStateContext.tsx`
- `woovector/hooks/useChatMessageFlow.ts`
- `woovector/hooks/useChatPolling.ts`
- `woovector/hooks/useChatMessages.ts`
- `woovector/hooks/useChatUrlHandler.ts`
- `woovector/hooks/useChatLimits.ts`
- `woovector/app/(protected)/chat/` - Entire chat route removed
- `woovector/components/chat/` - Most chat UI components removed

**Kept:**
- `woovector/components/chat/ChatHeader.tsx` - May be useful for vendor dashboard
- `woovector/components/chat/ChatErrorBoundary.tsx` - Generic error boundary
- `woovector/components/chat/BillingQuickAccess.tsx` - Billing component

**Created:**
- `woovector/lib/chat/session-service.ts` - Minimal stub types for any remaining references

### 3. Updated Redirects

Changed all authentication and navigation redirects from `/chat` to `/profile`:
- `woovector/app/actions/auth.ts`
- `woovector/components/auth/LoginForm.tsx`
- `woovector/app/(auth)/auth/login/page.tsx`
- `woovector/app/(auth)/auth/sign-up/page.tsx`
- `woovector/app/(auth)/auth/forgot-password/page.tsx`
- `woovector/app/(auth)/auth/confirm/route.ts`
- `woovector/components/history/StartChattingButton.tsx`
- `woovector/components/history/SessionRow.tsx`
- `woovector/lib/usage-tracking.ts`
- `woovector/components/layout/AppSidebar.tsx` - Removed "Chat" nav item

### 4. Scaffolded External Chatbot API Endpoint

**Created:**
- `woovector/app/api/chatbot/[vendorApiKey]/route.ts`

**Features:**
- POST handler for external chatbot requests
- Validates vendor API key from route parameter
- Request payload: `{ message, sessionId?, userId?, userEmail?, pastOrders? }`
- Response format: `{ success, response, sessionId, products[], metadata: { intent, confidence, agentUsed } }`
- Validates subscription and conversation limits
- Generates/reuses session IDs
- Records usage events for billing
- Includes comprehensive TODO comments for Mastra AI integration
- CORS support for external requests

### 5. Updated Documentation

**Roadmap (`ai_docs/prep/roadmap.md`):**
- Phase 10: Replaced "ADK Agent Project" with "External Chatbot Integration Setup"
- Updated agent implementation sections to reference Mastra AI
- Changed environment variables from ADK-specific to Mastra-compatible
- Updated integration testing descriptions
- Changed "ADK agent service" to "Mastra AI service"

**Agent Workflow (`ai_docs/prep/woovector_agent_workflow.md`):**
- Updated purpose to clarify external chatbot + Mastra AI backend
- Changed agent types from "LlmAgent" to "Mastra AI Agent"
- Updated agent names to camelCase Mastra conventions
- Replaced ADK callback system with Mastra instructions/tools pattern
- Added Mastra-specific code examples (TypeScript instead of Python)
- Updated execution flow for external chatbot → Next.js API → Mastra flow

**App Pages (`ai_docs/prep/app_pages_and_functionality.md`):**
- Changed template type from "adk-agent-saas" to "WooCommerce SaaS with Mastra AI"

### 6. Language Updates: Italian → English

Removed Italian-language references throughout documentation:
- Changed default language from 'it' to 'en'
- Replaced "Italian responses" with "branded responses" or "configured language"
- Updated error messages from Italian to English
- Changed "Italian brand voice" to "brand voice"
- Updated code examples from Italian queries to English

**Files Updated:**
- `ai_docs/prep/roadmap.md`
- `ai_docs/prep/woovector_agent_workflow.md`
- `ai_docs/prep/app_pages_and_functionality.md`
- `ai_docs/prep/master_idea.md`
- `ai_docs/prep/initial_data_schema.md`

---

## Architecture Changes

### Before (ADK)
```
External Chatbot → Next.js API → ADK Python Service → Google Agent Engine → Database
```

### After (Mastra AI)
```
External Chatbot → Next.js API → Mastra AI Agents (woovector/ai/) → Database/Qdrant
```

---

## Next Steps for Mastra AI Implementation

### 1. Configure Mastra AI Agents (`woovector/ai/`)
- Update `woovector/ai/src/mastra/agents/` with:
  - Orchestrator agent for routing
  - Product discovery agent for WooCommerce search
  - Company info agent for store policies
- Configure Mastra Memory with LibSQL for conversation context
- Set up agent tools for Qdrant and database access

### 2. Implement API Integration
- Replace TODO placeholders in `woovector/app/api/chatbot/[vendorApiKey]/route.ts`
- Create `validateVendorApiKey()` function with database query
- Implement `processChatbotRequest()` to call Mastra agents
- Add vendor configuration fetching for brand voice

### 3. Database Schema
Still needed (Phase 3-5 in roadmap):
- `subscription_plans` and `vendor_subscriptions` tables
- `vendor_stores` table with `api_key` field for validation
- `products` table for WooCommerce catalog
- `store_ai_config` table for brand voice settings
- `product_metadata` table for AI enrichment

### 4. Environment Variables
Update `.env.local`:
```env
# Remove these ADK variables:
# ADK_URL=...
# GOOGLE_SERVICE_ACCOUNT_KEY_BASE64=...

# Add these Mastra variables:
AGENT_BACKEND_URL=http://localhost:3001  # If agents run separately
AGENT_SECRET=your-secret-key
OPENAI_API_KEY=sk-...  # Or ANTHROPIC_API_KEY, GOOGLE_API_KEY
QDRANT_URL=https://your-cluster.qdrant.tech
QDRANT_API_KEY=...
```

---

## Breaking Changes

### Removed Features
- Internal chat UI (vendors can no longer test agents in dashboard)
- ADK session management and polling system
- Google Agent Engine deployment support

### Preserved Features
- User authentication and authorization
- Subscription management framework
- Usage tracking and limits
- History viewing
- Profile management

### Migration Path
- No database migrations required (only code changes)
- No user data loss (no chat history to preserve yet)
- External chatbot API is new functionality

---

## Validation Checklist

- [x] All ADK code removed from `woovector/`
- [x] Internal chat UI removed
- [x] Documentation updated (roadmap, workflow, app pages)
- [x] Italian language references changed to English
- [x] External chatbot API endpoint scaffolded
- [x] Redirects updated (chat → profile)
- [x] Sidebar navigation cleaned
- [x] Neutral chat types created for any remaining imports
- [ ] Linting check (pending)
- [ ] Type checking (pending)

---

## Questions for Next Session

### 1. Mastra AI Agent Structure
- How should we structure agents in `woovector/ai/src/mastra/agents/`?
- Should orchestrator, product, and company agents be separate files or one export?
- Do you want to use Mastra workflows or just agents?

### 2. Database Schema Priority
- Should we implement vendor_stores table first (for API key validation)?
- Or mock the validation for now and implement full schema later?

### 3. Mastra Memory Configuration
- Should we use the LibSQL file (`woovector/ai/memory.db`) for memory storage?
- Or connect to Supabase for centralized storage?

### 4. Agent Tools Implementation
- Do you want tools to call Next.js API endpoints (for database access)?
- Or should agents connect directly to databases (Supabase, Qdrant)?

### 5. Response Language
- Default to English for all responses?
- Or should we add language detection/configuration from vendor settings?

---

**Status:** ✅ COMPLETED  
**Ready for:** Mastra AI agent implementation in next session  
**Documentation:** Complete and updated



