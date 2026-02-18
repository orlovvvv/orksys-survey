# Session Context

## User Prompts

### Prompt 1

Implement the following plan:

# Fix Survey Builder Re-animation Issue - Complete Investigation

## Context

When dragging an item from bottom to top in the survey builder, items that shift down get **re-animated** (fade-in) after the drag ends. This is a classic symptom of **mount/unmount cycles** or **animation library interpreting reorder as "enter"**.

## Root Cause Investigation

Based on the user's feedback, the issue is NOT just inverted `initial` logic. The real problem is likely one of:...

### Prompt 2

commit these changes

