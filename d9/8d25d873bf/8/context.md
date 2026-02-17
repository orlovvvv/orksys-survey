# Session Context

## User Prompts

### Prompt 1

Implement the following plan:

# Fix: Drag & Drop Insert Position Bug

## Context
The survey builder has a UX bug where:
1. Visual animation shows items shifting to make room at the correct drop position
2. **But the actual insertion always happens at the END of the array**

This creates confusing UX - users see where the item will go, but it appears somewhere else.

## Root Cause Analysis

### Current Flow

**In `builder-canvas.tsx`:**
```tsx
// Calculates visual drop index
const dropIndex = ov...

### Prompt 2

commit work as is

