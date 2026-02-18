# Survey App Development Plan

## Goal
Build a modern, flexible survey platform (web and mobile) that enables users to create, distribute, and analyze surveys with a focus on beautiful UX, actionable AI-driven insights, and support for both anonymous and non-anonymous feedback.

---

## 1. Core Foundation (Phase 1)

### Feature: Database Schema & API (oRPC)
- **User Story**: As a developer, I need a robust data structure to store complex survey configurations and responses.
- **Tasks to Build**:
    - [ ] **Survey Model**: Title, description, status (draft/published), settings (anonymous, branding).
    - [ ] **Question Model**: Type, content, required flag, ordering, options (for multiple choice).
    - [ ] **Logic Rules Model**: Source question, target question, condition (if answer is X).
    - [ ] **Response Model**: Metadata (timestamp, device), link to survey, link to respondent (if non-anon).
    - [ ] **Answer Model**: Link to response, link to question, content (json/string).
    - [ ] **oRPC Routers**: Endpoints for CRUD on surveys, questions, and submission of responses.

### Feature: Authentication & Multi-tenancy
- **User Story**: As an admin, I want to securely manage my surveys and ensure my data is isolated from others.
- **Tasks to Build**:
    - [ ] **Auth Integration**: Connect Better-Auth with the `surveys` table (owner check).
    - [ ] **Organization/Workspace Schema**: Allow surveys to belong to a team or solo user.
    - [ ] **Session Handling**: Middleware to protect builder routes while keeping runner routes public.

---

## 2. Survey Builder Experience (Phase 2)

### Feature: Survey Editor UI (Web)
- **User Story**: As a creator, I want to build a survey visually without writing code.
- **Tasks to Build**:
    - [ ] **Drag-and-Drop Canvas**: Area to reorder questions visually.
    - [ ] **Question Palette**: Sidebar with different question types (NPS, Text, Choice).
    - [ ] **Properties Panel**: Contextual settings for the selected question (label, required, options).
    - [ ] **Live Preview**: Real-time rendering of how the survey looks to respondents.
    - [ ] **Auto-save Engine**: Background sync of builder state to the database.

### Feature: Logic & Branching Builder
- **User Story**: As a creator, I want to show specific questions based on previous answers to keep surveys relevant.
- **Tasks to Build**:
    - [ ] **Logic Editor UI**: Interface to define "If [Question A] is [Value], then Jump to [Question C]".
    - [ ] **Validation Engine**: Check for infinite loops or broken paths in the logic.
    - [ ] **Runner Logic Evaluator**: Code in the survey runner that processes these rules in real-time.

---

## 3. Respondent Experience (Phase 3)

### Feature: The Survey Runner (Web)
- **User Story**: As a respondent, I want a smooth, fast, and accessible interface to provide my feedback.
- **Tasks to Build**:
    - [ ] **Dynamic Form Renderer**: Renders questions one-by-one or in a list based on survey settings.
    - [ ] **Progress Indicator**: Visual bar or percentage of completion.
    - [ ] **Success/Thank You Page**: Customizable landing page after submission.
    - [ ] **Anonymous Tracking Logic**: Securely generate "fingerprints" for anonymous surveys to prevent double-voting without storing PII.

### Feature: Distribution System
- **User Story**: As a creator, I want to easily share my survey through multiple channels.
- **Tasks to Build**:
    - [ ] **Public URL Generator**: Unique, short slugs for each survey.
    - [ ] **QR Code Generator**: Component to download/display QR codes for the survey link.
    - [ ] **Embed Script**: A copy-pasteable JS snippet to render the survey in an iframe or modal on other sites.

---

## 4. Analytics & Insights (Phase 4)

### Feature: Real-time Dashboard
- **User Story**: As an analyst, I want to see a summary of my survey results at a glance.
- **Tasks to Build**:
    - [ ] **Summary Cards**: Total responses, completion rate, average time to complete.
    - [ ] **Chart Library Integration**: Bar charts for multiple choice, Line charts for NPS/Rating trends.
    - [ ] **Response Table**: Filterable and searchable list of all individual submissions.

### Feature: AI Insights (oRPC + LLM)
- **User Story**: As an analyst, I want the system to find patterns in thousands of text responses for me.
- **Tasks to Build**:
    - [ ] **Sentiment Analysis Pipeline**: Batch process text responses through an LLM to assign sentiment scores.
    - [ ] **AI Summarizer**: Generate a 3-bullet summary of "What people are saying" for open-ended questions.
    - [ ] **Keyword Cloud**: Automatically extract and visualize recurring themes.

---

## 5. Mobile Native App (Phase 5)

### Feature: Mobile Survey Runner (React Native)
- **User Story**: As a field researcher, I want to collect responses on a tablet or phone even without internet.
- **Tasks to Build**:
    - [ ] **Native Question Components**: UI optimized for touch (large buttons, swipe gestures).
    - [ ] **Offline Storage (SQLite)**: Save responses locally when no network is detected.
    - [ ] **Sync Manager**: Background worker to upload stored responses once the device is back online.
    - [ ] **Kiosk Mode UI**: Locked-down interface that resets to the first question after each submission.

---

## 6. Polishing & Advanced (V1.1)

### Feature: Templates & Branding
- **User Story**: As a user, I want to start with a professional template and add my logo.
- **Tasks to Build**:
    - [ ] **Template Library**: Pre-defined JSON configs for common surveys (NPS, CSAT).
    - [ ] **Theme Customizer**: UI to pick colors, upload logos, and choose fonts.
    - [ ] **Custom Domains**: Allow users to host surveys on their own subdomains (e.g., feedback.mybrand.com).
