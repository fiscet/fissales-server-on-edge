# Task: Build Demo-Integrated Hero Section for WooVector Landing Page

## 🎯 Task Overview

**Title:** Build Demo-Integrated Hero Section for WooVector Landing Page  
**Goal:** Create compelling hero section that immediately demonstrates WooVector's ultra-fast WooCommerce chatbot functionality while communicating speed advantage over competitors
**Background Colors:** Use alternating section backgrounds from Professional Blue theme system

## 📊 Project Analysis & Current State
- **Current Files:** `app/(public)/page.tsx`, `components/landing/HeroSection.tsx`
- **Current Implementation:** Generic template hero section with placeholder content
- **Template Type Context**: adk-agent-saas with sophisticated AI agent functionality
- **Strategic Priority**: Hero must immediately show WooCommerce chatbot in action to eliminate "will this work?" concerns

## 🔄 Code Changes Overview (Before → After)

### 📂 Current Implementation (Before)
```tsx
// File: components/landing/HeroSection.tsx (current generic template)
export default function HeroSection() {
  return (
    <section className="pt-20 pb-16">
      <div className="container mx-auto">
        <h1>Generic Template Headline</h1>
        <p>Template description text</p>
        <Button>Get Started</Button>
      </div>
    </section>
  );
}
```

### 📂 After Transformation
```tsx
// File: components/landing/HeroSection.tsx (Demo-Integrated Hero)
export default function HeroSection() {
  return (
    <section className="pt-20 pb-16 bg-background">
      <div className="container mx-auto max-w-7xl">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left: Messaging */}
          <div className="space-y-6">
            <h1 className="text-4xl lg:text-6xl font-bold">
              Ultra-Fast AI Chatbots for
              <span className="text-primary"> WooCommerce</span>
            </h1>
            <p className="text-xl text-muted-foreground">
              Increase conversions 20-30% with sub-2-second responses. 
              Built specifically for WooCommerce vendors.
            </p>
            <div className="flex gap-4">
              <Button size="lg">Start Free Trial</Button>
              <Button variant="outline" size="lg">View Demo</Button>
            </div>
          </div>
          
          {/* Right: Live Demo */}
          <div className="bg-card border rounded-lg p-6">
            <LiveWooCommerceChatDemo />
          </div>
        </div>
      </div>
    </section>
  );
}
```

## 🎯 Key Changes Summary
- **Demo Integration**: Live WooCommerce chatbot demo integrated directly into hero section
- **Ultra-Fast Positioning**: Headline emphasizes sub-2-second response advantage over competitors
- **WooCommerce Specificity**: Clear positioning as WooCommerce-specific vs generic e-commerce tools
- **Split Layout**: Content left, demo right for immediate visual proof of functionality
- **Conversion Focus**: Dual CTAs for trial signup and demo viewing
- **Files Modified**: `components/landing/HeroSection.tsx`, create `components/landing/LiveWooCommerceChatDemo.tsx`
- **Impact**: Eliminates "will this work for my store?" concerns by showing actual WooCommerce integration

## 📝 Content & Layout Requirements
- **Demo-Integrated Hero Layout Implementation**:
  - **Left Side**: Ultra-fast positioning headline, sub-2-second benefit messaging, dual CTAs (trial + demo)
  - **Right Side**: Live interactive WooCommerce chatbot demo showing product discovery conversation
  - **Grid Structure**: Responsive 2-column layout that stacks on mobile
  - **Visual Hierarchy**: Large headline with primary brand color accent on "WooCommerce"

- **Headline Options** (Final choice: Ultra-fast positioning):
  - Primary: "Ultra-Fast AI Chatbots for WooCommerce"
  - Secondary: "Increase WooCommerce Conversions 20-30%"
  - Supporting: "Sub-2-second responses that understand your products"

- **CTA Strategy**:
  - Primary CTA: "Start Free Trial" (conversion focus)  
  - Secondary CTA: "View Demo" (engagement focus)
  - Color: Primary CTA uses brand blue, secondary uses outline style

- **Demo Requirements**:
  - Show actual WooCommerce product discovery conversation
  - Demonstrate sub-2-second response times
  - Include realistic product recommendations
  - Mobile-responsive design with fixed container dimensions

## 🎨 Design & Accessibility Standards
- **Professional Design Compliance**: Follow all Professional Design Standards from template
- **Single Color Focus**: Use Professional Blue (220 85% 55%) as primary brand color, same in both light and dark modes
- **Professional Typography**: Use Lexend Deca font family for brand consistency and readability
- **Context-Appropriate Spacing**: Hero section spacing that creates impact without being wasteful
- **Professional Icons**: Use contextual Lucide React icons with proper strokeWidth matching font weights
- **Subtle Interactions**: Gentle hover effects on CTAs (`hover:scale-105`)
- **Demo Technical Requirements**:
  - **Fixed Dimensions**: Demo container has fixed width and height to prevent layout shift
  - **No Dynamic Heights**: Content changes during demo animations must NOT cause height changes
  - **Mobile Responsive Priority**: Demo must look beautiful on mobile with simplified interactions if needed
  - **Container Constraints**: Use `overflow: hidden` to ensure animations stay within boundaries
- **Alternating Backgrounds**: Use `bg-background` for hero section
- **Dark Mode Eye Comfort**: Proper contrast ratios in both light and dark modes
- **Accessibility Compliance**: WCAG AA contrast ratios, keyboard navigation, screen reader compatibility
- **Button Component Integrity**: Never add manual spacing to shadcn Button components

## 🔗 Navigation & SEO Integration
- **Header Integration**: Ensure hero works with existing navbar and theme
- **SEO Keywords**: "ultra-fast AI chatbots WooCommerce", "increase conversions", "sub-2-second responses"
- **Structured Data**: Consider product/service schema markup for SEO
- **Performance**: Optimize hero images and demo assets for fast loading
- **CTA Integration**: Primary CTA connects to sign-up flow, secondary to demo viewing
- **Mobile Experience**: Hero must be immediately impactful on mobile devices

## ✅ Validation Requirements (Static Only)
- **Linting**: Run `npm run lint` - zero errors introduced
- **Type Checking**: Run `npm run type-check` - zero type issues  
- **Component Verification**: Hero renders properly with demo integration
- **Theme Compliance**: Verify proper CSS variable usage from Professional Blue theme
- **Responsive Testing**: Ensure layout works on all screen sizes
- **Demo Functionality**: Verify demo component renders without errors

## 🎯 Success Criteria
- [ ] **Demo Integration Complete**: Live WooCommerce chatbot demo integrated seamlessly into hero layout
- [ ] **Ultra-Fast Messaging**: Hero clearly communicates sub-2-second response advantage over competitors
- [ ] **WooCommerce Positioning**: Clear positioning as WooCommerce-specific solution vs generic alternatives  
- [ ] **Professional Design Standards Met**: Follows all design standards with single color focus and professional typography
- [ ] **Layout Excellence**: Split layout with content left, demo right, responsive mobile stacking
- [ ] **CTA Optimization**: Dual CTAs for trial signup and demo viewing with proper styling
- [ ] **Demo Technical Requirements**: Fixed dimensions, no layout shift, mobile responsive
- [ ] **Brand Integration**: Consistent with WooVector's professional, results-focused positioning
- [ ] **Performance Optimized**: Fast loading with optimized assets and efficient code
- [ ] **Accessibility Compliant**: WCAG AA standards with proper contrast and navigation
- [ ] **Mobile Excellence**: Beautiful responsive design with context-appropriate spacing
- [ ] **Code Quality**: Clean, maintainable code with no linting errors

**Strategic Impact**: This Demo-Integrated Hero immediately proves WooVector's value proposition by showing actual WooCommerce functionality, eliminating the need for a separate demo section while maximizing conversion potential through immediate visual proof.
