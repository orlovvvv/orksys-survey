# Session Context

## User Prompts

### Prompt 1

Implement the following plan:

# Fix Survey Builder Re-render Issue (Bottom-to-Top Drag)

## Context

When dragging an item from the bottom to the top of the survey builder, all items re-render. This does NOT happen when dragging from top to bottom. This is caused by:

1. **New object references created for ALL questions** during reordering (`.map((q, index) => ({ ...q, order: index }))`)
2. **Framer Motion's `layout` prop** reacting to the new object references by animating all items
3. **Botto...

### Prompt 2

[Request interrupted by user]

### Prompt 3

that did not address the issue, the the issue is as stated before:
items moved from bottom to top, cause rerender or at least reanimation of ALL items that are moved under it EVEN when the dragging effect already moved those items into the right place, main issue is that moving items from top to bottom DOES not have this issue at all and behaves correctly

### Prompt 4

[Request interrupted by user for tool use]

