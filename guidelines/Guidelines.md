# SAVOR Food Donation App Guidelines

## Two-Stage Donation Approval System

The SAVOR app implements a comprehensive two-stage donation approval process to ensure food safety, accountability, and proper inventory management.

### Stage 1: Initial Approval/Denial
**Purpose**: NGOs review donation requests and make initial acceptance decisions

**Process**:
1. Donor submits donation request with details (food type, quantity, pickup date, etc.)
2. NGO receives notification of new donation request (status: `pending`)
3. NGO reviews donation details and makes decision:
   - **Approve**: Move to Stage 2 (status: `approved-pending-verification`)
   - **Deny**: Provide rejection reason and remove from queue

**UI Guidelines**:
- Use orange badges for pending approvals
- Display clear "Stage 1" indicators
- Provide rejection reason text field
- Use blue "Approve" button and red "Deny" button

### Stage 2: Verification and Receipt
**Purpose**: NGOs verify physical receipt of donations with photographic proof

**Process**:
1. NGO receives the physical donation from donor
2. NGO takes proof photo of received items
3. NGO uploads proof image and clicks "Verify & Complete"
4. Donation is automatically added to warehouse inventory (status: `verified`)
5. System generates receipt for donor

**UI Guidelines**:
- Use yellow badges for pending verification
- Display clear "Stage 2" indicators
- Require proof image upload before verification
- Use green "Verify & Complete" button
- Show camera icon for proof upload

### Status Flow
```
pending → approved-pending-verification → verified (added to warehouse)
pending → rejected (removed from queue)
approved-pending-verification → rejected (removed from queue)
```

### Data Management
- **Pending donations**: Managed in temporary state until verified
- **Warehouse inventory**: Only verified donations with proof images
- **Audit trail**: All status changes logged with timestamps
- **Receipt generation**: Automatic for successfully verified donations

## Design System Guidelines

### Color Coding
- **Orange**: Pending initial approval (Stage 1)
- **Yellow**: Pending verification (Stage 2)  
- **Green**: Verified/completed donations
- **Red**: Rejected/denied donations
- **Blue**: Warehouse inventory items

### Button Conventions
- **Primary Blue**: Approve requests (Stage 1)
- **Primary Green**: Verify & Complete (Stage 2)
- **Outline Red**: Deny/Reject
- **Outline Gray**: Secondary actions

### Mobile-First Approach
- All donation management screens optimized for mobile devices
- Touch-friendly button sizes (minimum 44px)
- Clear visual hierarchy with progressive disclosure
- Swipe-friendly card layouts

### Testing Considerations
- Test both approval and denial flows
- Verify proof image upload functionality
- Test status transitions and UI state changes
- Validate warehouse inventory updates
- Test rejection reason handling
<!--

System Guidelines

Use this file to provide the AI with rules and guidelines you want it to follow.
This template outlines a few examples of things you can add. You can add your own sections and format it to suit your needs

TIP: More context isn't always better. It can confuse the LLM. Try and add the most important rules you need

# General guidelines

Any general rules you want the AI to follow.
For example:

* Only use absolute positioning when necessary. Opt for responsive and well structured layouts that use flexbox and grid by default
* Refactor code as you go to keep code clean
* Keep file sizes small and put helper functions and components in their own files.

--------------

# Design system guidelines
Rules for how the AI should make generations look like your company's design system

Additionally, if you select a design system to use in the prompt box, you can reference
your design system's components, tokens, variables and components.
For example:

* Use a base font-size of 14px
* Date formats should always be in the format “Jun 10”
* The bottom toolbar should only ever have a maximum of 4 items
* Never use the floating action button with the bottom toolbar
* Chips should always come in sets of 3 or more
* Don't use a dropdown if there are 2 or fewer options

You can also create sub sections and add more specific details
For example:


## Button
The Button component is a fundamental interactive element in our design system, designed to trigger actions or navigate
users through the application. It provides visual feedback and clear affordances to enhance user experience.

### Usage
Buttons should be used for important actions that users need to take, such as form submissions, confirming choices,
or initiating processes. They communicate interactivity and should have clear, action-oriented labels.

### Variants
* Primary Button
  * Purpose : Used for the main action in a section or page
  * Visual Style : Bold, filled with the primary brand color
  * Usage : One primary button per section to guide users toward the most important action
* Secondary Button
  * Purpose : Used for alternative or supporting actions
  * Visual Style : Outlined with the primary color, transparent background
  * Usage : Can appear alongside a primary button for less important actions
* Tertiary Button
  * Purpose : Used for the least important actions
  * Visual Style : Text-only with no border, using primary color
  * Usage : For actions that should be available but not emphasized
-->
