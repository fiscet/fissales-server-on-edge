# Task: Update WooVector App Branding

## 🎯 Task Overview

**Title:** Update WooVector App Branding  
**Goal:** Establish WooVector brand identity with Professional Blue theme integration, navbar theme fix, and proper metadata
**Background Colors:** Use alternating section backgrounds from Professional Blue theme system

## 📊 Project Analysis & Current State
- **Current Files:** `app/layout.tsx`, `components/Logo.tsx`, `components/landing/Navbar.tsx`, `components/landing/Footer.tsx`
- **Current Implementation:** Generic template branding with hardcoded theme colors in navbar
- **App Context:** WooVector.io - Ultra-fast AI chatbots for WooCommerce vendors
- **Brand Identity:** Professional, trustworthy, technically innovative, results-focused
- **Theme System:** Professional Blue theme already implemented in `globals.css`

## 🔄 Code Changes Overview (Before → After)

### 📂 Current Implementation (Before)
```tsx
// File: app/layout.tsx (current metadata)
title: "Generic SaaS App"
description: "Template description"

// File: components/Logo.tsx (current)
<span className="text-xl font-bold">Your App</span>

// File: components/landing/Navbar.tsx (current - hardcoded theme)
className="bg-white/80 dark:bg-gray-900/80 border-gray-200 dark:border-gray-700"
```

### 📂 After Transformation
```tsx
// File: app/layout.tsx (updated metadata)
title: "WooVector - Ultra-Fast AI Chatbots for WooCommerce"
description: "Increase WooCommerce conversions 20-30% with sub-2-second AI chatbots. WooCommerce-specific product discovery, metadata enrichment, and intelligent recommendations."

// File: components/Logo.tsx (updated)
<span className="text-xl font-bold">WooVector</span>

// File: components/landing/Navbar.tsx (theme-compliant)
className="bg-background/80 border-border"
```

## 🎯 Key Changes Summary
- **Metadata Update**: Replace generic template metadata with WooVector-specific titles, descriptions, and keywords
- **Logo Update**: Change app name display to "WooVector" while preserving logo image
- **Navbar Theme Fix**: Replace hardcoded theme colors with proper CSS variables from Professional Blue theme system
- **Brand Consistency**: Ensure all branding elements reflect WooVector's professional, trustworthy positioning
- **Files Modified**: `app/layout.tsx`, `components/Logo.tsx`, `components/landing/Navbar.tsx`, `components/landing/Footer.tsx`
- **Impact**: Establishes consistent WooVector brand identity with proper theme integration

## 📝 Content & Layout Requirements
- **App Name**: WooVector (not WooVector.io in UI elements)
- **Primary Value Proposition**: "Ultra-fast AI chatbots for WooCommerce"
- **SEO Keywords**: WooCommerce, AI chatbot, conversion optimization, product discovery, e-commerce AI
- **Brand Voice**: Professional, results-focused, technically credible
- **Target Audience**: WooCommerce vendors seeking conversion optimization
- **Competitive Positioning**: WooCommerce-specific vs generic e-commerce chatbots

## 🎨 Design & Accessibility Standards
- **Professional Design Compliance**: Follow all Professional Design Standards from template
- **Single Color Focus**: Use Professional Blue (220 85% 55%) as primary brand color consistent in both light and dark modes
- **Professional Typography**: Maintain existing Lexend Deca font family for brand consistency
- **Navbar Theme Compliance**: CRITICAL - Use proper CSS variables from Professional Blue theme system instead of hardcoded colors
- **Background System**: Use `--background` and `--border` CSS variables for proper theme integration
- **Dark Mode Eye Comfort**: Ensure navbar maintains proper contrast in both light and dark modes
- **Component Integrity**: Maintain all existing navbar functionality while updating theme colors
- **Logo Preservation**: NEVER remove the logo image, only update the app name text
- **Accessibility Compliance**: Maintain WCAG AA contrast ratios with proper CSS variable usage

## 🔗 Navigation & SEO Integration
- **Navbar Theme Fix**: Replace `bg-white/80 dark:bg-gray-900/80` with `bg-background/80` and `border-gray-200 dark:border-gray-700` with `border-border`
- **Metadata Optimization**: Include WooCommerce-specific keywords for SEO targeting
- **Page Title**: "WooVector - Ultra-Fast AI Chatbots for WooCommerce" 
- **Meta Description**: Focus on conversion benefits and WooCommerce specificity
- **Brand Consistency**: Ensure footer also reflects WooVector branding
- **Social Media**: Update Open Graph and Twitter Card metadata for WooVector
- **Logo Update**: Only change app name text, preserve existing logo image asset

## ✅ Validation Requirements (Static Only)
- **Linting**: Run `npm run lint` - zero errors introduced
- **Type Checking**: Run `npm run type-check` - zero type issues
- **Theme Compliance**: Verify navbar uses CSS variables instead of hardcoded colors
- **Brand Verification**: Confirm all brand elements display "WooVector" correctly
- **Logo Preservation**: Verify logo image remains intact, only text updated

## 🎯 Success Criteria
- [ ] App metadata updated with WooVector-specific information
- [ ] **Logo Updated**: App name displays "WooVector" while preserving logo image
- [ ] **Navbar Theme Fixed**: Navbar uses proper CSS variables (`bg-background/80`, `border-border`) instead of hardcoded theme colors
- [ ] **Professional Brand Identity**: All elements reflect WooVector's professional, results-focused positioning
- [ ] **SEO Optimization**: Metadata includes relevant WooCommerce and AI chatbot keywords
- [ ] **Theme Integration**: All branding elements work properly in both light and dark modes
- [ ] **Accessibility Maintained**: All contrast ratios remain WCAG AA compliant
- [ ] **Component Functionality**: Navbar maintains all existing functionality with updated styling
- [ ] **Brand Consistency**: Logo, navbar, footer, and metadata all reflect unified WooVector identity
- [ ] **Code Quality**: Clean, maintainable code with no linting errors

**CRITICAL**: The navbar theme fix is essential - hardcoded theme colors must be replaced with CSS variables to properly integrate with the Professional Blue theme system.
