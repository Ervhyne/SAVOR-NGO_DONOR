# SAVOR App - Figma Design System & Components

## 🎨 Core Design Tokens

### Colors
```
Primary Colors:
• Primary Blue: #1e293b (Dark navy)
• Primary Green: #16a34a (Success/Food theme)
• White: #ffffff
• Light Gray: #f1f5f9

Text Colors:
• Dark Text: #0f172a
• Medium Text: #64748b
• Light Text: #94a3b8

Status Colors:
• Success: #16a34a
• Warning: #f59e0b
• Error: #dc2626
• Info: #3b82f6
```

### Typography
```
Font Family: System fonts (Inter, SF Pro, Roboto)

Font Sizes:
• Large Title: 24px / Bold
• Page Title: 20px / Semibold
• Section Header: 16px / Medium
• Body Text: 14px / Regular
• Small Text: 12px / Regular

Line Heights:
• Large Title: 29px (24px × 1.2)
• Page Title: 24px (20px × 1.2)
• Section Header: 19px (16px × 1.2)
• Body Text: 21px (14px × 1.5)
• Small Text: 17px (12px × 1.4)
```

### Spacing & Layout
```
Container Padding: 16px
Component Spacing: 16px, 24px, 32px
Border Radius: 6px (standard), 8px (cards), 50px (pills)
```

---

## 🧩 Reusable Components

### Primary Button
```
Dimensions: 
• Height: 40px
• Min Width: 120px
• Padding: 16px horizontal

Colors:
• Background: #16a34a (Green)
• Text: #ffffff
• Hover: #15803d (Darker green)

Typography:
• Size: 14px
• Weight: Medium (500)
```

### Secondary Button
```
Dimensions: Same as primary
Colors:
• Background: Transparent
• Border: 1px solid #d1d5db
• Text: #374151
• Hover: #f9fafb background
```

### Input Field
```
Dimensions:
• Height: 40px
• Padding: 12px horizontal
• Border: 1px solid #d1d5db

States:
• Default: Border #d1d5db
• Focus: Border #3b82f6, Ring 2px #3b82f6 (20% opacity)
• Error: Border #dc2626, Text #dc2626

Typography:
• Size: 14px
• Placeholder: #9ca3af
```

### Navigation Header
```
Dimensions:
• Height: 64px
• Padding: 16px horizontal

Layout:
• Back Button (left): 32px × 32px
• Title (center): 20px semibold
• Action (right): 32px × 32px

Background: #ffffff
Border Bottom: 1px solid #e5e7eb
```

### Bottom Navigation
```
Dimensions:
• Height: 80px
• Tab Width: Screen width / number of tabs

Layout:
• Icon: 24px × 24px
• Label: 12px below icon
• Active: #16a34a
• Inactive: #94a3b8

Background: #ffffff
Border Top: 1px solid #e5e7eb
```

---

## 📱 Page-by-Page Components

### Welcome Screen
```
Layout:
• Logo: Top third, centered
• Title: 24px bold, #0f172a
• Subtitle: 14px regular, #64748b
• Button: Full width, 16px margin

Components:
✓ Primary Button (full width)
✓ Logo placeholder (80px × 80px)
```

### Role Selection
```
Role Cards:
• Width: Full width - 32px margin
• Height: Auto (min 120px)
• Padding: 24px
• Border: 2px solid transparent
• Selected: 2px solid #3b82f6
• Background: #ffffff

Components:
✓ Navigation Header
✓ Role Cards (2 variants)
✓ Primary Button
```

### Login Screen
```
Form Layout:
• Container: Max width 400px, centered
• Field spacing: 16px between
• Button: Full width, 24px top margin

Components:
✓ Navigation Header
✓ Input Fields (Email, Password)
✓ Primary Button
✓ Text Links
```

### NGO Registration (Multi-Step)
```
Progress Bar:
• Height: 8px
• Background: #e5e7eb
• Fill: #3b82f6
• Width: Full width

Step Header:
• Icon: 20px × 20px circle
• Title: 16px medium
• Description: 14px regular, #64748b

Components:
✓ Navigation Header
✓ Progress Bar
✓ Input Fields
✓ Document Upload Areas
✓ Primary/Secondary Buttons
```

### Dashboard (Donor/NGO)
```
Metric Cards:
• Width: 50% (2 columns on mobile)
• Height: 100px
• Padding: 16px
• Background: #ffffff
• Shadow: 0 1px 3px rgba(0,0,0,0.1)

Action Section:
• Button spacing: 12px vertical
• Full width buttons

Components:
✓ Navigation Header
✓ Metric Cards
✓ Primary Buttons
✓ Bottom Navigation
```

### Machine Monitoring
```
Machine Cards:
• Width: Full width
• Padding: 16px
• Status dot: 8px diameter, top-right

Map Container:
• Height: 200px
• Background: #e0f2fe
• Border radius: 8px

Components:
✓ Navigation Header
✓ Machine Status Cards
✓ Mock Map Container
✓ Status Indicators
```

---

## 🎯 Specialized Components

### Document Upload Area
```
Dimensions:
• Height: 120px
• Border: 2px dashed #d1d5db
• Border radius: 8px

States:
• Default: Dashed border, center icon
• Hover: Background #f8fafc
• Success: Solid green border, checkmark icon

Content:
• Icon: 32px × 32px
• Text: 14px medium
• Subtext: 12px regular, #64748b
```

### Status Badges
```
Dimensions:
• Height: 24px
• Padding: 6px 12px
• Border radius: 12px (pill shape)

Variants:
• Pending: Background #fef3c7, Text #92400e
• Approved: Background #d1fae5, Text #065f46
• In Transit: Background #dbeafe, Text #1e40af
• Delivered: Background #d1fae5, Text #065f46
```

### Progress Indicator (Steps)
```
Step Circle:
• Size: 32px diameter
• Active: #3b82f6 background, white checkmark
• Inactive: #e5e7eb background, step number
• Completed: #16a34a background, white checkmark

Connector Line:
• Width: 2px
• Color: #e5e7eb (inactive), #3b82f6 (active)
```

---

## 📐 Layout Grids & Spacing

### Mobile Layout (Primary)
```
Screen Padding: 16px sides
Component Spacing: 16px, 24px, 32px
Max Content Width: 400px (centered)

Grid System:
• 2 columns for metric cards
• 1 column for forms
• Full width for actions
```

### Responsive Breakpoints
```
Mobile: 375px - 767px (primary)
Tablet: 768px - 1023px
Desktop: 1024px+ (if needed)
```

---

## ✨ Interactive States

### Button States
```
Default → Hover → Active → Loading

Primary Button:
• Default: #16a34a
• Hover: #15803d
• Active: #14532d
• Loading: Disabled + spinner

Secondary Button:
• Default: Border #d1d5db
• Hover: Background #f9fafb
• Active: Background #f3f4f6
```

### Input States
```
Default → Focus → Error → Disabled

Focus Ring: 2px #3b82f6 at 20% opacity
Error: Border and text #dc2626
Disabled: Background #f9fafb, text #9ca3af
```

---

## 🔤 Icon Specifications

### Icon Library: Lucide React
```
Sizes:
• Small: 16px (form icons)
• Medium: 20px (buttons)
• Large: 24px (navigation)
• Extra Large: 32px (features)

Common Icons:
• Navigation: arrow-left, home, user
• Actions: plus, edit-3, trash-2, upload
• Status: check, x, alert-circle
• Food/App: apple, coffee, heart
```

---

## 📱 Mobile-First Guidelines

### Touch Targets
```
Minimum Size: 44px × 44px
Recommended: 48px × 48px
Spacing: 8px minimum between targets
```

### Gestures
```
• Swipe back navigation
• Pull to refresh
• Tap to select
• Long press for context
```

---

## 🎨 Figma Component Setup

### Auto Layout Recommendations
```
• Use auto layout for all containers
• Set responsive resize behavior
• Create component variants for states
• Use proper constraints for responsive design
```

### Component Naming
```
• Button/Primary/Default
• Button/Primary/Hover
• Input/Default
• Input/Focus
• Card/Metric/Default
```

