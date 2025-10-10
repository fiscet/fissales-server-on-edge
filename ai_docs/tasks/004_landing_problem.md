# Task: Build Problem Section with Split Problem-Solution Layout

## 🎯 Task Overview

**Title:** Build Problem Section with Split Problem-Solution Layout  
**Goal:** Address the specific 30% sales loss pain point from slow/generic chatbots and position WooVector as the targeted solution for WooCommerce vendors
**Background Colors:** Use alternating section backgrounds from Professional Blue theme system

## 📊 Project Analysis & Current State
- **Current Files:** `app/(public)/page.tsx`, `components/landing/ProblemSection.tsx`
- **Current Implementation:** Generic template problem section with placeholder content
- **Template Type Context**: adk-agent-saas targeting WooCommerce vendors with specific pain points
- **Strategic Priority**: Highlight 30% sales loss problem and position WooVector as the WooCommerce-specific solution

## 🔄 Code Changes Overview (Before → After)

### 📂 Current Implementation (Before)
```tsx
// File: components/landing/ProblemSection.tsx (current generic template)
export default function ProblemSection() {
  return (
    <section className="py-16">
      <div className="container mx-auto">
        <h2>Generic Problem Statement</h2>
        <p>Template problem description</p>
      </div>
    </section>
  );
}
```

### 📂 After Transformation
```tsx
// File: components/landing/ProblemSection.tsx (Split Problem-Solution layout)
export default function ProblemSection() {
  return (
    <section className="py-16 bg-background">
      <div className="container mx-auto max-w-7xl">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left: Problem (30% Sales Loss) */}
          <div className="space-y-6">
            <div className="text-destructive text-lg font-semibold">
              The Hidden Cost of Generic Chatbots
            </div>
            <h2 className="text-3xl font-bold">
              WooCommerce Vendors Lose 30% of Potential Sales
            </h2>
            <ProblemPointsList />
          </div>
          
          {/* Right: Solution (WooVector Benefits) */}
          <div className="space-y-6">
            <div className="text-success text-lg font-semibold">
              The WooVector Solution
            </div>
            <h2 className="text-3xl font-bold">
              Ultra-Fast AI Built for WooCommerce
            </h2>
            <SolutionBenefitsList />
          </div>
        </div>
      </div>
    </section>
  );
}
```

## 🎯 Key Changes Summary
- **Split Layout**: Visual contrast between problem (left) and solution (right) for clear comparison
- **30% Sales Loss Focus**: Specific statistic that resonates with WooCommerce vendor pain points
- **Generic vs Specific**: Contrast generic chatbot failures with WooCommerce-specific WooVector benefits
- **Color Psychology**: Use `text-destructive` for problem, `text-success` for solution visual cues
- **Vendor-Focused**: Content specifically addresses WooCommerce store owner frustrations
- **Files Modified**: `components/landing/ProblemSection.tsx`, create problem/solution list components
- **Impact**: Creates urgency around sales loss while positioning WooVector as the targeted solution

## 📝 Content & Layout Requirements
- **Split Problem-Solution Layout Implementation**:
  - **Left Side**: Problem statement with 30% sales loss statistic and pain points
  - **Right Side**: WooVector solution with ultra-fast, WooCommerce-specific benefits
  - **Grid Structure**: 2-column on desktop, stacked on mobile with problem first
  - **Visual Contrast**: Red/destructive colors for problem, green/success colors for solution

- **Problem Side Content** (Left):
  - **Headline**: "WooCommerce Vendors Lose 30% of Potential Sales"
  - **Subhead**: "The Hidden Cost of Generic Chatbots" 
  - **Pain Points**:
    - "Slow response times frustrate customers (3+ seconds)"
    - "Generic answers don't understand your products"
    - "No WooCommerce integration = missed opportunities"
    - "Complex setup breaks sites or requires developer help"
    - "Generic chatbots can't access WooCommerce data"

- **Solution Side Content** (Right):
  - **Headline**: "Ultra-Fast AI Built for WooCommerce"
  - **Subhead**: "The WooVector Solution"
  - **Solution Benefits**:
    - "Sub-2-second responses keep customers engaged"
    - "Understands your products with intelligent metadata"
    - "Native WooCommerce API integration"
    - "Risk-free WordPress plugin installation"
    - "Accesses real WooCommerce product data"

- **Messaging Strategy**:
  - **Statistical Impact**: Lead with concrete 30% sales loss figure
  - **Vendor Empathy**: Address specific WooCommerce store owner frustrations
  - **Solution Positioning**: Position WooVector as purpose-built WooCommerce solution

## 🎨 Design & Accessibility Standards
- **Professional Design Compliance**: Follow all Professional Design Standards from template
- **Single Color Focus**: Use Professional Blue as primary with success/destructive colors for contrast
- **Professional Typography**: Use Lexend Deca font family for consistency and readability
- **Split Layout Requirements**:
  - **Visual Balance**: Equal visual weight between problem and solution sides
  - **Color Coding**: Subtle use of `text-destructive` and `text-success` for psychological impact
  - **Spacing**: Consistent `space-y-6` within sides, `gap-12` between sides
  - **Icons**: Professional Lucide React icons (AlertTriangle for problems, CheckCircle for solutions)
- **Context-Appropriate Spacing**: Problem section spacing that creates impact and urgency
- **Professional Icons**: Use contextual icons with `strokeWidth={2.5}` matching font weights
- **Alternating Backgrounds**: Use `bg-background` to contrast with previous muted section
- **Dark Mode Eye Comfort**: Ensure proper contrast in both light and dark modes
- **Accessibility Compliance**: WCAG AA contrast ratios with proper semantic structure
- **Mobile Excellence**: Stacked layout on mobile with problem-first, solution-second order

## 🔗 Navigation & SEO Integration
- **SEO Keywords**: "WooCommerce sales loss", "generic chatbot problems", "WooCommerce-specific AI"
- **Statistical SEO**: "30% sales loss" statistic for long-tail search targeting
- **Problem-Solution Schema**: Consider FAQ or problem-solution structured data markup
- **Internal Linking**: Connect to features and pricing sections for solution details
- **Competitive SEO**: Target searches around WooCommerce chatbot problems and solutions

## ✅ Validation Requirements (Static Only)
- **Linting**: Run `npm run lint` - zero errors introduced
- **Type Checking**: Run `npm run type-check` - zero type issues
- **Component Verification**: Problem section renders with split layout and all content
- **Theme Compliance**: Verify proper CSS variable usage including success/destructive colors
- **Layout Testing**: Ensure proper responsive behavior with mobile stacking
- **Content Verification**: Confirm all problem points and solution benefits display correctly

## 🎯 Success Criteria
- [ ] **Split Problem-Solution Layout**: Clear visual contrast between problem (left) and solution (right)
- [ ] **30% Sales Loss Focus**: Prominent statistic that creates urgency for WooCommerce vendors
- [ ] **WooCommerce-Specific Messaging**: Problem points specifically address WooCommerce vendor pain points
- [ ] **Professional Design Standards Met**: Proper color usage, typography, and spacing throughout
- [ ] **Color Psychology**: Effective use of destructive/success colors for problem/solution contrast
- [ ] **Vendor Empathy**: Content demonstrates understanding of WooCommerce store owner frustrations
- [ ] **Solution Positioning**: WooVector clearly positioned as purpose-built WooCommerce solution
- [ ] **Mobile Excellence**: Stacked layout works beautifully on mobile with proper content hierarchy
- [ ] **Visual Balance**: Equal visual weight and attention between problem and solution sides
- [ ] **Icon Integration**: Professional Lucide React icons enhance content without distraction
- [ ] **Brand Integration**: Consistent with WooVector's professional, results-focused positioning
- [ ] **Code Quality**: Clean, maintainable code with no linting errors

**Strategic Impact**: This Split Problem-Solution section creates urgency around the 30% sales loss while positioning WooVector as the targeted WooCommerce solution, moving prospects from pain awareness to solution consideration in the conversion journey.
