# AI Vibe Builder (lucid.dev) - Global SaaS Architecture

## 1. System Overview
lucid.dev is a high-performance AI-powered UI generation platform. It follows a multi-tenant, credit-based SaaS model with a cinematic frontend design system.

## 2. Request Lifecycle Pipeline
Every user request (UI generation, screenshot analysis, etc.) passes through the following stages:

1.  **Ingress**: User submits a prompt or image via the Dashboard.
2.  **Task Classification**: AI (Gemini Flash) classifies the task type (e.g., `LANDING_PAGE`, `DASHBOARD_COMPONENT`, `MOBILE_UI`).
3.  **Credit Estimation**: System calculates required credits based on task complexity.
4.  **Wallet Validation**: Checks the user's Supabase `wallets` table to ensure sufficient balance.
5.  **AI Routing**:
    *   **Gemini Flash**: Speed-critical tasks, text classification.
    *   **Claude 3.5 Sonnet**: Primary UI code generation, logic structuring.
    *   **GPT-4o Vision**: Screenshot analysis and reconstruction.
    *   **Claude 3.5 Opus**: Complex full-stack architecture planning.
6.  **Prompt Engineering**: Optimized system prompts wrap the user's intent.
7.  **Execution**: AI call is made server-side.
8.  **Post-Processing**: Code results are linted and formatted.
9.  **Storage**: Project versions are saved to Supabase `project_versions`.
10. **Usage Logging**: Record the request in `ai_usage_logs`.
11. **Credit Deduction**: Atomically deduct credits from the user's wallet.
12. **Egress**: Return structured React/Tailwind code to the frontend.

## 3. Data Models (Supabase)
### `profiles`
*   `id` (uuid, PK)
*   `email` (text)
*   `full_name` (text)
*   `avatar_url` (text)
*   `created_at` (timestamp)

### `wallets`
*   `user_id` (uuid, FK -> profiles.id)
*   `balance` (int) - Credits available.
*   `currency` (text) - Default 'CREDITS'.

### `credit_transactions`
*   `id` (uuid, PK)
*   `user_id` (uuid)
*   `amount` (int) - Positive for top-ups, negative for usage.
*   `type` (enum) - `TOPUP`, `USAGE`, `REFUND`.
*   `metadata` (jsonb) - Related task or transaction IDs.

### `projects`
*   `id` (uuid, PK)
*   `owner_id` (uuid)
*   `name` (text)
*   `description` (text)
*   `created_at` (timestamp)

### `project_versions`
*   `id` (uuid, PK)
*   `project_id` (uuid)
*   `code` (text) - The generated React/Tailwind code.
*   `prompt` (text) - The input prompt.
*   `preview_url` (text)

### `ai_usage_logs`
*   `id` (uuid, PK)
*   `user_id` (uuid)
*   `model_name` (text)
*   `task_type` (text)
*   `token_count` (int)
*   `credit_cost` (int)

## 4. Billing Integration (Paystack)
*   **Checkout**: User selects a credit pack.
*   **Gateway**: Paystack handled via `paystack-node` or direct API integration.
*   **Webhooks**: Verified server-side to credit wallets asynchronously.

## 5. Security Strategy
*   **Row Level Security (RLS)**: Enforced on all tables.
*   **Validation**: Zod schemas for all API inputs.
*   **Atmocity**: Database triggers ensure credit balances never go negative during concurrent requests.
*   **Secrets**: API keys stored in environment variables, never exposed.
