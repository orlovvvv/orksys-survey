# Session Context

## User Prompts

### Prompt 1

Implement the following plan:

# Onboarding & Organization Flow Implementation Plan

## Context

New users encounter a "No active organization selected" error (403) when accessing survey features because:
1. After signup, users have no organization membership
2. The `session.activeOrganizationId` is null
3. All survey API procedures require an active organization via `organizationProcedure`

The solution implements an onboarding flow that ensures every user has an active organization before acce...

