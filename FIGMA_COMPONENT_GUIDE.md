# SAVOR App - Figma Component Guide

## 🎨 Design Tokens for Figma

### Color Styles
```
Create these as Figma color styles:

Primary Colors:
• Primary-Blue: #1e293b
• Primary-Green: #16a34a
• White: #ffffff
• Light-Gray: #f1f5f9

Text Colors:
• Text-Dark: #0f172a
• Text-Medium: #64748b
• Text-Light: #94a3b8

Status Colors:
• Success: #16a34a
• Warning: #f59e0b
• Error: #dc2626
• Info: #3b82f6
```

### Text Styles
```
Create these as Figma text styles:

Large-Title:
• Font: Inter/SF Pro Bold
• Size: 24px
• Line Height: 29px
• Color: Text-Dark

Page-Title:
• Font: Inter/SF Pro Semibold
• Size: 20px
• Line Height: 24px
• Color: Text-Dark

Section-Header:
• Font: Inter/SF Pro Medium
• Size: 16px
• Line Height: 19px
• Color: Text-Dark

Body-Text:
• Font: Inter/SF Pro Regular
• Size: 14px
• Line Height: 21px
• Color: Text-Dark

Small-Text:
• Font: Inter/SF Pro Regular
• Size: 12px
• Line Height: 17px
• Color: Text-Medium
```

---

## 🧩 Figma Components

### Primary Button Component
```
Frame Dimensions:
• Width: 335px (full width mobile)
• Height: 40px

Auto Layout:
• Direction: Horizontal
• Padding: 16px horizontal, 10px vertical
• Gap: 8px (if icon + text)
• Alignment: Center

Fill: Primary-Green (#16a34a)
Corner Radius: 6px

Text Layer:
• Style: Body-Text
• Color: White
• Text: "Button Text"

Variants:
• Default (Green background)
• Hover (Darker green #15803d)
• Disabled (Gray #9ca3af)
```

### Secondary Button Component
```
Frame Dimensions:
• Width: 335px
• Height: 40px

Auto Layout:
• Direction: Horizontal
• Padding: 16px horizontal, 10px vertical
• Gap: 8px
• Alignment: Center

Fill: Transparent
Stroke: 1px solid #d1d5db
Corner Radius: 6px

Text Layer:
• Style: Body-Text
• Color: Text-Dark
• Text: "Button Text"

Variants:
• Default (Transparent)
• Hover (Light gray fill #f9fafb)
```

### Input Field Component
```
Field Label (Above Input):
• Style: Small-Text (12px)
• Color: Text-Dark (#0f172a)
• Line Height: 17px
• Weight: Medium (500)
• Text: "Field Name *" (asterisk for required)
• Margin Bottom: 4px from input

Input Frame Dimensions:
• Width: 335px
• Height: 40px

Auto Layout:
• Direction: Horizontal
• Padding: 12px horizontal, 10px vertical
• Alignment: Center left

Fill: White
Stroke: 1px solid #d1d5db
Corner Radius: 6px

Placeholder Text Layer:
• Style: Body-Text (14px)
• Color: Text-Medium (#64748b)
• Line Height: 21px
• Text: "Placeholder text"

Input Text Layer (When filled):
• Style: Body-Text (14px)
• Color: Text-Dark (#0f172a)
• Line Height: 21px

Complete Field Component Structure:
• Frame: Auto height × 335px width
• Auto Layout: Vertical
• Gap: 4px
• Items: Label + Input Field

Variants:
• Default (Gray border, placeholder text)
• Focus (Blue border #3b82f6 + drop shadow)
• Error (Red border #dc2626, red label text)
• Filled (Black input text)
• Required (with red asterisk *)
• Optional (without asterisk)
```

### Select/Dropdown Field Component
```
Field Label (Above Select):
• Style: Small-Text (12px)
• Color: Text-Dark (#0f172a)
• Weight: Medium (500)
• Margin Bottom: 4px

Select Frame Dimensions:
• Width: 335px
• Height: 40px

Auto Layout:
• Direction: Horizontal
• Padding: 12px horizontal, 10px vertical
• Alignment: Space between
• Gap: 8px

Fill: White
Stroke: 1px solid #d1d5db
Corner Radius: 6px

Selected/Placeholder Text:
• Style: Body-Text (14px)
• Color: Text-Medium (#64748b) for placeholder
• Color: Text-Dark (#0f172a) when selected

Dropdown Arrow Icon:
• Size: 16px × 16px
• Color: Text-Medium (#64748b)
• Icon: chevron-down

Variants:
• Default (Placeholder text)
• Selected (Dark text)
• Focus (Blue border)
• Open (Arrow rotated 180°)
```

### Navigation Header Component
```
Frame Dimensions:
• Width: 375px (mobile screen width)
• Height: 64px

Auto Layout:
• Direction: Horizontal
• Padding: 16px horizontal, 12px vertical
• Gap: 16px
• Alignment: Space between

Fill: White
Stroke: Bottom 1px solid #e5e7eb

Left Icon (Back Button):
• Frame: 32px × 32px
• Icon: 20px × 20px arrow-left
• Color: Text-Dark

Center Text:
• Style: Page-Title
• Color: Text-Dark
• Text: "Page Title"

Right Icon (Optional):
• Frame: 32px × 32px
• Icon: 20px × 20px
• Color: Text-Dark
```

### Bottom Navigation Component
```
Frame Dimensions:
• Width: 375px
• Height: 80px

Auto Layout:
• Direction: Horizontal
• Padding: 8px horizontal, 12px vertical
• Gap: 0px (distribute evenly)
• Alignment: Space between

Fill: White
Stroke: Top 1px solid #e5e7eb

Tab Item (Repeat 4-5 times):
• Frame: Auto width × 56px
• Direction: Vertical
• Gap: 4px
• Alignment: Center

Icon:
• Size: 24px × 24px
• Color: Primary-Green (active) / Text-Light (inactive)

Label:
• Style: Small-Text
• Color: Primary-Green (active) / Text-Light (inactive)
• Text: "Tab Name"

Variants:
• Tab-1-Active, Tab-2-Active, etc.
```

### Card Component
```
Frame Dimensions:
• Width: 335px
• Height: Auto (based on content)

Auto Layout:
• Direction: Vertical
• Padding: 16px all sides
• Gap: 12px
• Alignment: Top left

Fill: White
Drop Shadow: 0px 1px 3px rgba(0,0,0,0.1)
Corner Radius: 8px

Card Header:
• Text Style: Section-Header
• Color: Text-Dark

Card Content:
• Text Style: Body-Text
• Color: Text-Medium
```

### Metric Card Component
```
Frame Dimensions:
• Width: 157px (half mobile width minus gap)
• Height: 100px

Auto Layout:
• Direction: Vertical
• Padding: 16px all sides
• Gap: 8px
• Alignment: Top left

Fill: White
Drop Shadow: 0px 1px 3px rgba(0,0,0,0.1)
Corner Radius: 8px

Value:
• Style: Large-Title
• Color: Text-Dark
• Text: "42"

Label:
• Style: Small-Text
• Color: Text-Medium
• Text: "Total Donations"

Icon (Top Right):
• Size: 24px × 24px
• Color: Primary-Green
• Position: Absolute, top-right 16px
```

---

## 📱 Page Layouts

### Mobile Screen Frame
```
Device Frame:
• Width: 375px
• Height: 812px (iPhone size)
• Fill: Light-Gray background

Content Container:
• Width: 343px (375px - 32px padding)
• Auto Layout: Vertical
• Gap: 16px
• Padding: 16px all sides
```

### Welcome Screen Layout
```
Frame: 375px × 812px

Logo Container:
• Width: 80px × 80px
• Position: Center horizontal, 200px from top
• Fill: Light circle or image

Title:
• Style: Large-Title
• Text: "Welcome to SAVOR"
• Position: Center, 100px below logo

Subtitle:
• Style: Body-Text
• Color: Text-Medium
• Text: "Reducing food waste together"
• Position: Center, 16px below title

Button Container:
• Width: 343px
• Position: 32px from bottom
• Auto Layout: Vertical
• Gap: 12px
```

### Role Selection Layout
```
Frame: 375px × 812px

Header: Navigation Header Component

Role Cards Container:
• Width: 343px
• Auto Layout: Vertical
• Gap: 16px
• Padding: 16px horizontal

Role Card:
• Width: 335px
• Height: Auto (min 120px)
• Padding: 24px
• Corner Radius: 8px
• Stroke: 2px solid transparent (default)
• Stroke: 2px solid Info (#3b82f6) when selected
• Auto Layout: Vertical
• Gap: 12px

Button: Primary Button Component at bottom
```

### Registration Form Layout
```
Frame: 375px × 812px

Header: Navigation Header Component

Progress Bar (NGO only):
• Width: 343px
• Height: 8px
• Background: #e5e7eb
• Fill: Info (#3b82f6) based on progress
• Corner Radius: 4px

Form Container:
• Width: 343px
• Auto Layout: Vertical
• Gap: 16px
• Padding: 16px horizontal

Form Fields: Input Field Components
```

### Dashboard Layout
```
Frame: 375px × 812px

Header: Navigation Header Component

Metrics Grid:
• Width: 343px
• Auto Layout: Horizontal wrapped
• Gap: 11px (to fit 2 cards)
• Padding: 16px horizontal

Metric Cards: 2 × Metric Card Components per row

Actions Container:
• Width: 343px
• Auto Layout: Vertical
• Gap: 12px
• Padding: 16px horizontal

Action Buttons: Primary Button Components

Bottom Nav: Bottom Navigation Component
```

---

## 🎯 Specialized Components

### Document Upload Area
```
Frame Dimensions:
• Width: 335px
• Height: 120px

Auto Layout:
• Direction: Vertical
• Padding: 24px
• Gap: 8px
• Alignment: Center

Fill: Transparent
Stroke: 2px dashed #d1d5db
Corner Radius: 8px

Upload Icon:
• Size: 32px × 32px
• Color: Text-Light

Main Text:
• Style: Body-Text
• Color: Text-Dark
• Text: "Upload Document"

Sub Text:
• Style: Small-Text
• Color: Text-Medium
• Text: "PDF or Image files"

Variants:
• Default (Dashed border)
• Hover (Light blue fill #f8fafc)
• Success (Green border, checkmark icon)
```

### Status Badge Component
```
Frame Dimensions:
• Width: Auto (fits content)
• Height: 24px

Auto Layout:
• Direction: Horizontal
• Padding: 6px horizontal, 4px vertical
• Alignment: Center

Corner Radius: 12px (fully rounded)

Text:
• Style: Small-Text (12px)
• Font Weight: Medium (500)
• Line Height: 17px
• Text: "Status Text"

Badge Variants:

SUCCESS BADGES:
• Posted: Fill #dcfce7, Text #166534, Border #bbf7d0
• Active: Fill #dcfce7, Text #166534, Border #bbf7d0  
• Online: Fill #dcfce7, Text #166534, Border #bbf7d0
• Approved: Fill #dcfce7, Text #166534, Border #bbf7d0
• Delivered: Fill #dcfce7, Text #166534, Border #bbf7d0

WARNING BADGES:
• Alert: Fill #fef3c7, Text #92400e, Border #fde68a
• Low Stock: Fill #fef3c7, Text #92400e, Border #fde68a
• Maintenance: Fill #fef3c7, Text #92400e, Border #fde68a
• Pending: Fill #fef3c7, Text #92400e, Border #fde68a

ERROR BADGES:
• Empty: Fill #fee2e2, Text #991b1b, Border #fecaca
• Out of Stock: Fill #fee2e2, Text #991b1b, Border #fecaca
• Offline: Fill #fee2e2, Text #991b1b, Border #fecaca
• Rejected: Fill #fee2e2, Text #991b1b, Border #fecaca

INFO BADGES:
• Claimed: Fill #dbeafe, Text #1e40af, Border #bfdbfe
• In Transit: Fill #dbeafe, Text #1e40af, Border #bfdbfe
• Processing: Fill #dbeafe, Text #1e40af, Border #bfdbfe

NEUTRAL BADGES:
• Expired: Fill #f3f4f6, Text #374151, Border #e5e7eb
• Draft: Fill #f3f4f6, Text #374151, Border #e5e7eb
• Paused: Fill #f3f4f6, Text #374151, Border #e5e7eb

PURPLE BADGES:
• Maintenance: Fill #f3e8ff, Text #7c2d12, Border #e9d5ff
• Scheduled: Fill #f3e8ff, Text #7c2d12, Border #e9d5ff

Badge Sizes:
• Small: Height 20px, Padding 4px horizontal, 2px vertical
• Default: Height 24px, Padding 6px horizontal, 4px vertical  
• Large: Height 28px, Padding 8px horizontal, 6px vertical

Usage Examples:
• Machine Status: Online, Offline, Maintenance
• Donation Status: Posted, Claimed, Empty
• Alert Types: Alert, Low Stock, Out of Stock
• Process Status: Pending, Approved, Rejected
```

### Recent Activity Badge Component
```
Specific badges for Recent Activities section:

Frame Dimensions:
• Width: Auto (typically 40-70px)
• Height: 24px
• Padding: 6px horizontal, 4px vertical
• Corner Radius: 12px

Activity Badge Variants:

1. POSTED Badge:
• Background: #dcfce7 (green-100)
• Text: #166534 (green-800) 
• Border: 1px solid #bbf7d0 (green-200)
• Text: "posted"

2. ALERT Badge:
• Background: #fef3c7 (yellow-100)
• Text: #92400e (yellow-800)
• Border: 1px solid #fde68a (yellow-200)
• Text: "alert"

3. CLAIMED Badge:
• Background: #dbeafe (blue-100)
• Text: #1e40af (blue-800)
• Border: 1px solid #bfdbfe (blue-200)
• Text: "claimed"

4. ONLINE Badge:
• Background: #dcfce7 (green-100)
• Text: #166534 (green-800)
• Border: 1px solid #bbf7d0 (green-200)
• Text: "online"

5. EMPTY Badge:
• Background: #fee2e2 (red-100)
• Text: #991b1b (red-800)
• Border: 1px solid #fecaca (red-200)
• Text: "empty"

6. MAINTENANCE Badge:
• Background: #f3e8ff (purple-100)
• Text: #7c2d12 (purple-800)
• Border: 1px solid #e9d5ff (purple-200)
• Text: "maintenance"

Badge Text Specifications:
• Font: Inter/SF Pro Medium
• Size: 12px
• Line Height: 17px
• Letter Spacing: Normal
• Text Transform: Lowercase
```

### Progress Steps Component
```
Step Circle:
• Dimensions: 32px × 32px
• Corner Radius: 16px (circle)

Variants:
• Inactive: Fill #e5e7eb, Text #64748b (step number)
• Active: Fill Info (#3b82f6), Icon checkmark white
• Completed: Fill Success (#16a34a), Icon checkmark white

Connector Line:
• Width: 2px
• Height: 24px
• Fill: #e5e7eb (inactive) / Info (#3b82f6) active

Complete Step Component:
• Auto Layout: Horizontal
• Gap: 12px
• Items: Circle + Line + Circle + Line + Circle
```

---

## 📐 Auto Layout Guidelines

### Container Setup
```
Main Containers:
• Direction: Vertical
• Alignment: Top center
• Spacing: 16px or 24px
• Padding: 16px sides

Button Containers:
• Direction: Horizontal
• Alignment: Center
• Spacing: 12px
• Resizing: Fill container

Form Containers:
• Direction: Vertical
• Alignment: Top left
• Spacing: 16px
• Resizing: Hug contents
```

### Responsive Behavior
```
Components should:
• Use "Fill container" for width when full-width
• Use "Hug contents" for height unless fixed
• Set proper constraints (Center, Left, Right)
• Use auto layout for consistent spacing
```

---

## 🎨 Component Variants

### Create These Variants in Figma

#### Button Variants:
- Type: Primary, Secondary
- State: Default, Hover, Disabled
- Size: Default, Small, Large

#### Input Variants:
- State: Default, Focus, Error, Filled
- Type: Text, Password, Email

#### Navigation Variants:
- Style: With back button, Without back button
- Right action: None, Icon, Text

#### Card Variants:
- Type: Basic, Metric, Action
- State: Default, Hover, Selected

---

## 📋 Pending Approvals Component

### Pending Approvals Header
```
Frame Dimensions:
• Width: 343px
• Height: Auto

Auto Layout:
• Direction: Horizontal
• Padding: 0px
• Gap: 8px
• Alignment: Center left

Icon:
• Size: 20px × 20px
• Color: Text-Dark (#0f172a)
• Icon: clock or pending-clock

Title Text:
• Style: Section-Header (16px Medium)
• Color: Text-Dark (#0f172a)
• Text: "Pending Approvals"

Count Badge (Optional):
• Height: 20px
• Padding: 4px horizontal
• Background: Warning (#f59e0b)
• Text: White
• Corner Radius: 10px
• Text: Number count
```

### Pending Approval Card Component
```
Frame Dimensions:
• Width: 335px
• Height: Auto (typically 140-160px)

Auto Layout:
• Direction: Vertical
• Padding: 16px all sides
• Gap: 12px
• Alignment: Top left

Fill: White
Drop Shadow: 0px 1px 3px rgba(0,0,0,0.1)
Corner Radius: 8px
Stroke: 1px solid #e5e7eb

Card Header (Horizontal Layout):
• Gap: 12px
• Alignment: Space between

Left Section:
• Food Name: Style Section-Header, Color Text-Dark
• Donor Name: Style Small-Text, Color Text-Medium
• Submission Date: Style Small-Text, Color Text-Light

Right Section:
• Status Badge: "Pending Review" (Warning variant)

Card Content (Vertical Layout):
• Gap: 8px

Food Details:
• Quantity: Style Body-Text, Color Text-Medium
• Expiry Date: Style Small-Text, Color Text-Medium
• Description: Style Small-Text, Color Text-Medium (truncated)

Action Buttons (Horizontal Layout):
• Gap: 8px
• Alignment: Center

Primary Button (Approve):
• Width: 80px, Height: 32px
• Background: Success (#16a34a)
• Text: "Approve"
• Style: Small-Text, Weight Medium

Secondary Button (Reject):
• Width: 70px, Height: 32px
• Background: Transparent
• Stroke: Error (#dc2626)
• Text: "Reject"
• Color: Error (#dc2626)

View Details Link:
• Style: Small-Text
• Color: Info (#3b82f6)
• Text: "View Details"
• Underline: On hover
```

### Empty State Component
```
Frame Dimensions:
• Width: 335px
• Height: 200px

Auto Layout:
• Direction: Vertical
• Padding: 32px
• Gap: 16px
• Alignment: Center

Illustration:
• Size: 80px × 80px
• Color: Text-Light (#94a3b8)
• Icon: Large checkmark in circle

Title:
• Style: Section-Header
• Color: Text-Medium (#64748b)
• Text: "All caught up!"

Subtitle:
• Style: Body-Text
• Color: Text-Light (#94a3b8)
• Text: "No donations waiting for approval"
• Text Align: Center
```

### Bulk Actions Header
```
Frame Dimensions:
• Width: 335px
• Height: 48px

Auto Layout:
• Direction: Horizontal
• Padding: 12px horizontal, 8px vertical
• Gap: 8px
• Alignment: Space between

Background: Light blue (#f0f9ff)
Corner Radius: 6px

Left Section:
• Checkbox: 16px × 16px
• Text: "Select All" (Small-Text, Text-Dark)

Right Section:
• Bulk Actions: Horizontal layout, gap 8px
• Approve All Button: Success color, 28px height
• Reject All Button: Error color, 28px height
```

### Filter Tabs Component
```
Frame Dimensions:
• Width: 335px
• Height: 40px

Auto Layout:
• Direction: Horizontal
• Padding: 0px
• Gap: 1px
• Alignment: Center

Tab Button:
• Width: Auto (equal distribution)
• Height: 40px
• Padding: 8px horizontal
• Background: Transparent (inactive) / Info (#3b82f6) active
• Text Color: Text-Medium (inactive) / White (active)

Tab Variants:
• "All Pending" - Default active state
• "Food Items" - Food donations only
• "Documents" - Document verifications only
• "NGO Applications" - New NGO registrations
```

---

## 📊 Pending Approvals Data Structure

### Sample Pending Approval Data
```
Pending Food Donations:

1. Fresh Vegetable Bundle
   • Donor: "Green Grocery Store"
   • Quantity: "15 kg mixed vegetables"
   • Submitted: "2 hours ago"
   • Expiry: "Tomorrow"
   • Target: "Dispenser #2"
   • Status: "Pending Review"
   • Priority: High (due to expiry)

2. Canned Goods Collection  
   • Donor: "Community Kitchen"
   • Quantity: "24 canned items"
   • Submitted: "5 hours ago"
   • Expiry: "6 months"
   • Target: "Dispenser #1" 
   • Status: "Pending Review"
   • Priority: Normal

3. Bakery Surplus
   • Donor: "Daily Bread Bakery"
   • Quantity: "8 loaves + pastries"
   • Submitted: "1 day ago"
   • Expiry: "Today"
   • Target: "Dispenser #3"
   • Status: "Pending Review"
   • Priority: Urgent

Document Verifications:

1. NGO Registration - Hope Foundation
   • Document: "Tax Exemption Certificate"
   • Submitted: "3 days ago" 
   • Status: "Under Review"

2. Volunteer Application - Sarah Chen
   • Document: "Background Check"
   • Submitted: "1 week ago"
   • Status: "Pending Verification"
```

### Approval Action Flow
```
Quick Approve Actions:
• Single item: Tap "Approve" → Instant approval
• Bulk select: Check multiple → "Approve Selected"
• Quick filters: "Approve All Expiring Today"

Detailed Review Actions:
• Tap "View Details" → Full approval screen
• Review images, documents, donor history
• Add approval notes/conditions
• Set distribution schedule

Rejection Reasons:
• Quality concerns
• Expired items
• Incomplete information  
• Policy violations
• Duplicate submission
```

---

This guide provides exact Figma specifications for creating consistent, pixel-perfect components that match your design system!
