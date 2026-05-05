# Current Project

## What we are building
A job application tool called AutoApply. It takes in an Job description and a resume and automatically fills out the job application form if there is a form or sends an email if there is not. It also writes a cover letter and cover email fiting the job and our Resume. Finally it logs everything in a database. The tool is built with Next.js and runs on Vercel. It uses Playwright to automate the browser and Supabase for the database.

## What good looks like
### User requirements
user should be able to add JDs
user should be able to add resumes
user should be able to select which resume to use for a JD
user should be able to tweak added resume to jobs description resume should pass ATS scan filters 
user should be able to get a cover letter returned from JD and resume
user should be able to see a final review of resume, cover letter, application for email before prompting send or approving to send
user should be able to apply for jobs automatically when prompted to do so. 
user should be able to apply using email and or web form when prompted to do so.
user should be able to see a history of jobs applied for including whether email or web form was used and whether it was successfuly sent
user should be able to see groups of the JDs from Draft, applied, interviewing, rejected, etc and move items between these groups - The successfully applied ones should automatically move from Draft to Applied.

### Tech Stack
- Next.js
- Playwright
- Supabase
- Vercel
- TypeScript
- TailwindCSS

## What to avoid
- Do not implement all this at once build each feature step by step I must give approval at each stage to proceed
to next feature
- Use SOLID, DRY, KISS principles 
- Use Type-safe coding practices
- Do not modify database(Supabase) something without explicit user approval no deleting or dropping entire dbs is allowed 