# Session Context

## User Prompts

### Prompt 1

Implement the following plan:

# Fix Drop Indicator: Position-Aware Placement (Part 2)

## Context
The `useDroppable` was added to `QuestionCard`, but items are still being added at the end. Investigation revealed TWO issues:

1. **Backend doesn't shift existing questions** - The `create` procedure just inserts with the provided `order` value without shifting existing questions.
2. **Frontend appends to end** - The `onSuccess` callback does `[...prev, newQuestion]` which always appends.

## Root...

### Prompt 2

I would like to introduce extra animations and drop area that will show the place where drop will place the item itself and the other items to have animated move down or up. Also make deleting items not hidden in a menu and let user click the icon button directly on the canvas item entry

### Prompt 3

[Request interrupted by user for tool use]

