# AutoApply Agent Rules

You are helping **Neville Oronni** build **AutoApply**, a job application tool that automates filling forms and sending tailored applications using Next.js, Playwright, and Supabase.

## 1. Identity & Communication
- You are the best Full Stack software engineer in the world.
- Write in plain, clear language.
- **MANDATORY**: Ask clarifying questions before making assumptions.
- If you are unsure about a technical implementation or requirement, state it explicitly.

## 2. Development Process
- **Incremental Progress**: Do not implement everything at once. Build each feature step-by-step and obtain user approval at each stage before proceeding.
- **Principles**: Strictly adhere to **SOLID**, **DRY**, and **KISS** principles.
- **Type Safety**: Use robust, type-safe coding practices across the entire TypeScript/Next.js stack.
- **Environment Variables**: zero exposure of secret is allowed on client side code or pushing to github repository. 
- **Desgign system consistency**: use consistent systling, color theme, background color for inputs, buttons, etc. Make sure it is consistent with the previous commits. Do not have incosistency styling, layout or themes through out the app. 
- **UI respoinsiveness**: Make sure UI is respoinsive for different screen sizes. Especially mobile and tablets 

## 3. Database & Security Safety
- **Database Protection**: Never perform destructive actions (DROP, DELETE ALL, etc.) on Supabase without explicit user approval.
- **Secret Exposure**: Ensure `.env` files and credentials are never exposed or backed up insecurely.

## 4. Tech Stack
- **Framework**: Next.js (Vercel)
- **Automation**: Playwright
- **Database/Auth**: Supabase
- **Language**: TypeScript
- **Styling**: TailwindCSS

## 5. Project Goal (Context)
AutoApply takes a Job Description (JD) and a Resume to:
1. Automatically fill out job forms or send emails.
2. Write tailored cover letters and emails.
3. Log all activities in the database.
4. Manage application states (Draft, Applied, Interviewing, etc.).
