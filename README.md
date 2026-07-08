# Operation Glitch 🛡️🚀

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

**Operation Glitch** is an innovative bug bounty platform that transforms cybersecurity training into an engaging, gamified experience. We bridge the gap between theoretical knowledge and real-world application by providing hands-on challenges that simulate actual security vulnerabilities.

It provides an interactive platform for security researchers (hunters) to sign up, explore active bounty missions, submit breach proposals, track levels and XP progression, and view activity history. Additionally, it features a secure administrative dashboard for managing contests, checking logs, and viewing user submissions.

> [!IMPORTANT]
> **Educational & Learning Purpose Only**
> This platform is developed strictly for learning and educational purposes. It does not perform, encourage, or facilitate any real-world hacking, penetration testing against external targets, or actual cyber attacks. All missions, XP rewards, and simulated vulnerabilities are conducted within this educational sandbox environment to help users safely learn bug bounty workflows and application security concepts.

---

## Quick Links

*   **[Setup & Installation Guide](SETUP.md)** - Step-by-step instructions to get up and running locally.🛡️
*   **[MIT License](LICENSE)** - Licensing terms and conditions.
*   **[Security Policy](SECURITY.md)** - Guidelines for reporting vulnerability disclosures.

---

## Key Features

*   **Interactive Public Landing Page**: Showcases live statistics, rules, testimonials, and active bounty hunts.
*   **XP & Level Tracker**: Calculates researcher level and rank using database-backed XP models from successfully accepted submissions.
*   **Bounty Mission Portal**: Detailed listings of target scopes, rewards, and submission status tracking.
*   **Secure Admin Panel**: A dashboard protected by HMAC JWT signature verification for managing contests, contact inquiries, testimonials, and breach proposals.
*   **Email Confirmations**: Integrated SMTP service using Nodemailer for sending auto-acknowledgments.
*   **Optimized Performance & Code Standards**: Checked and formatted via Biome linter/formatter with support for Google Analytics.

---

## Technology Stack

*   **Framework**: [Next.js 15](https://nextjs.org/) (App Router, Server Actions)
*   **Database & Auth**: [Supabase](https://supabase.com/) (SSR, Postgres, Real-time client)
*   **Styling & UI**: [Styled-Components](https://styled-components.com/), TailwindCSS v4, Framer Motion (for smooth micro-animations), and [Lucide React](https://lucide.dev/) icons.
*   **Validation**: [Zod](https://zod.dev/) schemas.
*   **Linting & Formatting**: [Biome](https://biomejs.dev/) for extremely fast lint checks.
*   **Mailing**: [Nodemailer](https://nodemailer.com/).

---

## Getting Started

Here is a quick overview of how to run the project locally. For a comprehensive guide including database setup, please read **[SETUP.md](SETUP.md)**.

### 1. Install dependencies

```bash
npm install
```

### 2. Set up environment variables

Copy `.env.example` to `.env` and fill in your Supabase, email SMTP credentials, and admin setup configuration:

```bash
cp .env.example .env
```

### 3. Run the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to see the result.

### 4. Code Standards & Biome Checks

Before committing changes, make sure your code aligns with standard styles:

```bash
# Run lint check
npm run lint

# Format code automatically
npm run format
```

---

## License

Distributed under the MIT License. See `LICENSE` for more information.
