# AutoPlay 🚀

AI-powered job application tool that automates the entire application process — from resume tailoring to form submission.

## Features

- **📝 Resume Management** — Upload and manage multiple resumes for different roles
- **🤖 Smart Resume Tailoring** — Automatically adjust your resume to match job descriptions and pass ATS filters
- **✉️ Cover Letter Generation** — AI-generated cover letters and emails tailored to each position
- **⚡ Auto-Fill & Submit** — Automatically fill web application forms or send emails with one click
- **📊 Application Tracking** — Track applications across stages: Draft → Applied → Interviewing → Offered
- **👀 Review Before Sending** — Preview everything before it goes out

## Tech Stack

| Technology | Purpose |
|---|---|
| **Next.js 16** | Full-stack React framework (App Router) |
| **TypeScript** | Type-safe development |
| **Tailwind CSS** | Utility-first styling |
| **Supabase** | Database, Auth, and Row Level Security |
| **Playwright** | Browser automation for form filling |
| **Vercel** | Hosting and deployment |

## Getting Started

### Prerequisites

- Node.js 18+
- npm
- A [Supabase](https://supabase.com) account and project

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/nevooronni/AutoPlay.git
   cd AutoPlay
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**

   Create a `.env.local` file in the root directory:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

4. **Set up the database**

   Run the migration SQL in your Supabase SQL Editor to create the required tables (`profiles`, `jobs`, `resumes`) with Row Level Security policies.

5. **Enable Email Auth**

   In your Supabase dashboard, go to **Authentication → Providers** and ensure the **Email** provider is enabled.

6. **Run the development server**
   ```bash
   npm run dev
   ```

   Open [http://localhost:3000](http://localhost:3000) to see the app.

## Project Structure

```
├── app/
│   ├── (auth)/actions.ts     # Server actions for login/signup/signout
│   ├── dashboard/page.tsx    # Protected dashboard with stats
│   ├── login/page.tsx        # Login page
│   ├── signup/page.tsx       # Signup page
│   └── page.tsx              # Landing page
├── lib/
│   └── supabase/
│       ├── client.ts         # Browser Supabase client
│       ├── server.ts         # Server Supabase client
│       └── middleware.ts     # Session refresh middleware
├── middleware.ts             # Next.js middleware (route protection)
└── .env.local                # Environment variables (not committed)
```

## Database Schema

- **`profiles`** — User profiles (auto-created on signup via trigger)
- **`resumes`** — Base resumes uploaded by users
- **`jobs`** — Job descriptions, tailored content, and application status

All tables are secured with **Row Level Security (RLS)** — users can only access their own data.

## Roadmap

- [x] Project setup & auth
- [ ] Resume upload & management
- [ ] Job description input & parsing
- [ ] AI resume tailoring (ATS optimization)
- [ ] Cover letter & email generation
- [ ] Application preview & approval flow
- [ ] Playwright-based form auto-fill
- [ ] Email sending integration
- [ ] Kanban board for application tracking

## Author

**Neville Oronni** — [GitHub](https://github.com/nevooronni)

## License

MIT
