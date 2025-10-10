## Wireframe Reference Doc

### ASCII / Markdown Mock-ups

```text
+----------------------------------------------------------+
| Header: WooVector.io Logo | Trial: 23 Days | Profile ▼  |
|----------------------------------------------------------|
| Sidebar              |  Dashboard                        |
|---------------------|-----------------------------------|
| • Dashboard         |  [Trial Countdown Banner]         |
| • Shop Setup        |  [Usage Metrics Cards]           |
| • Product Catalog   |    - Products: 1,234/5,000       |
| • AI Assistant      |    - Conversations: 45/500       |
| • Plugin & Deploy   |  [Quick Actions]                  |
| • Analytics         |    - Connect Shop                 |
|---------------------|    - Import Products              |
| • Profile           |    - Download Plugin              |
| • Billing & Usage   |  [Performance Summary]           |
|---------------------|    - Total Conversations: 45     |
| Usage: 45/500       |    - Estimated Sales Impact      |
+---------------------+-----------------------------------+

Landing Page `/`
+---------------------------------------------+
| Header: Logo | Features | Pricing | Login   |
|---------------------------------------------|
| Hero: Ultra-Fast AI Chatbots for           |
| WooCommerce - Increase Conversions 20-30%  |
| [Start Free Trial] [View Demo]              |
|---------------------------------------------|
| [Feature Highlights]                        |
| • WooCommerce Integration                   |
| • Vector Database Speed                     |
| • Italian Market Focus                      |
|---------------------------------------------|
| [Pricing Section]                           |
| Starter €29/mo | Professional €59/mo        |
+---------------------------------------------+

Shop Setup `/shop-setup`
+----------------------------------------------------------+
| Sidebar              |  WooCommerce Connection          |
|---------------------|-----------------------------------|
| [Same as Dashboard] |  [Connection Status: Disconnected]|
|                     |  WooCommerce API Credentials      |
|                     |  • Shop URL: [____________]       |
|                     |  • API Key: [____________]        |
|                     |  • Secret: [____________]         |
|                     |  [Test Connection] [Save & Connect]|
|                     |                                   |
|                     |  [Webhook Setup Instructions]     |
|                     |  Copy this URL to WooCommerce...  |
+---------------------+-----------------------------------+

Product Catalog `/product-catalog`
+----------------------------------------------------------+
| Sidebar              |  Product Management              |
|---------------------|-----------------------------------|
| [Same as Dashboard] |  [Import Products] Last sync: 2h ago|
|                     |  [Search: ________] [Category ▼]   |
|                     |  +-----+----------+------+--------+|
|                     |  | Img | Name     | Cat  | Actions||
|                     |  +-----+----------+------+--------+|
|                     |  | 📷  | T-Shirt  | Clothing | Edit||
|                     |  | 📷  | Sneakers | Shoes | Edit   ||
|                     |  | 📷  | Jacket   | Clothing | Edit||
|                     |  +-----+----------+------+--------+|
|                     |  [Pagination: 1 2 3 ... Next]     |
+---------------------+-----------------------------------+

AI Assistant `/ai-assistant`
+----------------------------------------------------------+
| Sidebar              |  AI Configuration                |
|---------------------|-----------------------------------|
| [Same as Dashboard] |  Brand Voice Settings             |
|                     |  • Tone: [Friendly ▼]            |
|                     |  • Style: [Professional ▼]       |
|                     |  • Key Selling Points:           |
|                     |    [________________________]    |
|                     |                                   |
|                     |  Store Description                |
|                     |  • What does your shop sell?     |
|                     |    [________________________]    |
|                     |  • Target customers:              |
|                     |    [________________________]    |
|                     |  • Specialization/Focus:         |
|                     |    [________________________]    |
|                     |                                   |
|                     |  Store Policies                   |
|                     |  • Return Policy: [___________]   |
|                     |  • Delivery Info: [___________]   |
|                     |                                   |
|                     |  [Test AI Response] [Save Settings]|
+---------------------+-----------------------------------+

Plugin & Deploy `/plugin-deploy`
+----------------------------------------------------------+
| Sidebar              |  WordPress Plugin                |
|---------------------|-----------------------------------|
| [Same as Dashboard] |  [Download Plugin] Status: Ready  |
|                     |  Your API Key: wv_abc123...       |
|                     |                                   |
|                     |  Installation Steps:              |
|                     |  1. Download plugin zip file      |
|                     |  2. Upload to WordPress            |
|                     |  3. Activate plugin                |
|                     |  4. Enter API key in settings     |
|                     |                                   |
|                     |  [Test Connection] [View Guide]    |
+---------------------+-----------------------------------+

Analytics `/analytics`
+----------------------------------------------------------+
| Sidebar              |  Performance Analytics           |
|---------------------|-----------------------------------|
| [Same as Dashboard] |  [Date Range: Last 30 Days ▼]    |
|                     |  Conversation Metrics             |
|                     |  • Total: 45 • Popular Queries   |
|                     |  • Avg Response: 0.3s            |
|                     |                                   |
|                     |  Sales Impact                     |
|                     |  • Product Views: 123             |
|                     |  • Estimated Revenue: €1,234     |
|                     |                                   |
|                     |  [Export CSV] [View Details]      |
+---------------------+-----------------------------------+

Admin Vendor Management `/admin/vendors`
+----------------------------------------------------------+
| Sidebar              |  All Vendor Accounts             |
|---------------------|-----------------------------------|
| • Vendor Management |  [Search: ________] [Filter ▼]    |
| • Platform Analytics|  +--------+------+--------+-------+|
| • System Admin      |  | Name   | Plan | Status | Active||
|                     |  +--------+------+--------+-------+|
| Usage: System       |  | Shop A | Pro  | Paid   | 2h ago||
+---------------------+  | Shop B | Start| Trial  | 1d ago||
                        |  | Shop C | Pro  | Suspend| 5d ago||
                        |  +--------+------+--------+-------+|
                        |  [Actions: Suspend, Notify, Delete]|
                        +-----------------------------------+
```

### Navigation Flow Map

```
Landing `/` → Sign Up `/auth/sign-up` → Sign Up Success → /dashboard
              ↘︎ Login `/auth/login` → /dashboard
                ↘︎ Forgot Password `/auth/forgot-password`

/dashboard → Shop Setup `/shop-setup`
           → Product Catalog `/product-catalog` → Product Edit `/product-catalog/[productId]`
           → AI Assistant `/ai-assistant`
           → Plugin & Deploy `/plugin-deploy`
           → Analytics `/analytics`
           → Profile `/profile`
           → Billing & Usage `/billing`

Landing `/` → Contact `/contact`
           → Privacy `/privacy`
           → Terms `/terms`
           → Cookies `/cookies`
           → FAQ `/faq` 
           → Docs `/docs`

Admin Flow (Super Admin Role):
/dashboard → Admin Vendors `/admin/vendors` → Vendor Detail `/admin/vendors/[vendorId]`
           → Admin Analytics `/admin/analytics`
           → Admin System `/admin/system`

External Integrations:
WordPress Plugin → /api/chatbot/[vendorApiKey]
WooCommerce → /api/webhooks/woocommerce
Stripe → /api/webhooks/stripe
```








