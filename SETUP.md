# Setup & Installation Guide

This guide will help you set up **Glitch Operation (Bug Bounty Platform)** for local development and deployment.

---

## Prerequisites

Before starting, ensure you have the following installed and configured:

1. **Node.js**: Version 18.x or 20.x (Recommended).
2. **Package Manager**: `npm` (default), `yarn`, `pnpm`, or `bun`.
3. **Supabase**: A Supabase account and project configured.
4. **SMTP Service**: A Gmail account (or other SMTP service) with an App Password enabled for sending transaction/acknowledgment emails.

---

## Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/bug-bounty.git
cd bug-bounty
```

### 2. Install Dependencies

Install the project dependencies using `npm`:

```bash
npm install
```

---

## Environment Configuration

### 1. Copy the Environment Template

Copy the provided environment template to create your local environment file:

```bash
cp .env.example .env
```

### 2. Configure Environment Variables

Open `.env` in your editor and update the variables:

*   **Supabase Settings**:
    *   `NEXT_PUBLIC_SUPABASE_URL`: Your Supabase project URL (e.g., `https://xxxx.supabase.co`).
    *   `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` & `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Found under Project Settings > API in your Supabase dashboard.
    *   `SUPABASE_SERVICE_ROLE_KEY`: Secret API key (Service Role). **Warning:** Do not share or commit this key.
*   **Nodemailer Settings**:
    *   `EMAIL_USER`: Gmail address used to send emails.
    *   `EMAIL_PASSWORD`: 16-character Gmail App Password (do not use your regular password). Refer to Google account security settings to generate an App Password.
*   **Google Analytics**:
    *   `NEXT_PUBLIC_GA_ID`: Your GA4 tracking measurement ID (e.g., `G-XXXXXXX`).
*   **Admin Access**:
    *   `ADMIN_ID`: Username for admin portal login (default: `admin`).
    *   `ADMIN_SECRET`: Password for admin portal login (default: `admin`).
    *   `ADMIN_JWT_SECRET`: Random 32-character base64 string for signing JWT tokens. You can generate one via command line:
        ```bash
        openssl rand -base64 32
        ```

---

## Database (Supabase) Setup

The platform uses Supabase for database storage and authentication. You will need to create the following tables in your Supabase database.

### Required Tables & Schema Guidelines

You can create these tables using the **Table Editor** or **SQL Editor** in the Supabase Dashboard:

#### 1. `profiles`
Tracks user profiles.
*   `id`: `uuid` (Primary Key, references `auth.users.id` on delete cascade)
*   `created_at`: `timestamp with time zone` (default: `now()`)
*   `full_name`: `text`
*   `username`: `text` (unique)
*   `email`: `text` (unique)
*   `avatar_url`: `text` (optional)
*   `bio`: `text` (optional)
*   `tag_line`: `text` (optional)
*   `social_id`: `text` (optional)

#### 2. `contactus`
Stores messages sent via the Contact page.
*   `id`: `bigint` (Primary Key, Identity)
*   `created_at`: `timestamp with time zone` (default: `now()`)
*   `sender_name`: `text`
*   `sender_email`: `text`
*   `sender_subject`: `text`
*   `sender_message`: `text`

#### 3. `contests`
Stores bounty hunts/missions details.
*   `id`: `uuid` (Primary Key, default: `gen_random_uuid()`)
*   `created_at`: `timestamp with time zone` (default: `now()`)
*   `title`: `text`
*   `reward`: `integer` (XP points)
*   `description`: `text`
*   `status`: `text` (e.g., `ACTIVE`, `COMPLETED`)

#### 4. `contest_status`
Tracks user submissions/status for specific contests.
*   `id`: `bigint` (Primary Key, Identity)
*   `created_at`: `timestamp with time zone` (default: `now()`)
*   `user_id`: `uuid` (references `profiles.id`)
*   `contest_id`: `uuid` (references `contests.id`)
*   `status`: `text` (e.g., `PENDING`, `ACCEPTED`, `REJECTED`)

#### 5. `profile_activities`
Tracks active missions and audit logs.
*   `id`: `bigint` (Primary Key, Identity)
*   `created_at`: `timestamp with time zone` (default: `now()`)
*   `user_id`: `uuid` (references `profiles.id`)
*   `contest_id`: `uuid` (references `contests.id`)
*   `status`: `text`
*   `unique_code`: `text` (optional security audit code)

#### 6. `profile_metrics`
Aggregates profile ranks and statistics.
*   `id`: `uuid` (Primary Key, references `profiles.id`)
*   `rank`: `integer`
*   `completed_missions`: `integer` (default: `0`)

#### 7. `testimonals` (or `testimonials`)
Stores user testimonials shown on public landing pages.
*   `id`: `bigint` (Primary Key, Identity)
*   `created_at`: `timestamp with time zone` (default: `now()`)
*   `name`: `text`
*   `role`: `text`
*   `message`: `text`
*   `avatar_url`: `text` (optional)

#### 8. `breach_proposal`
Stores user-submitted vulnerability breach proposals.
*   `id`: `uuid` (Primary Key, default: `gen_random_uuid()`)
*   `created_at`: `timestamp with time zone` (default: `now()`)
*   `user_id`: `uuid` (references `profiles.id`)
*   `title`: `text`
*   `description`: `text`
*   `status`: `text` (default: `PENDING`)

---

## Code Quality Check (Biome)

This project uses **Biome** for fast formatting and linting. Run quality checks before submitting any commits.

*   **Lint & Check**:
    ```bash
    npm run lint
    ```
*   **Format Code**:
    ```bash
    npm run format
    ```

---

## Running the Development Server

Start the Next.js local server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to view the application.

*   Public home/mission pages: `/`
*   Admin Login Portal: `/ui/controller/admin-login`
