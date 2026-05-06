import { z } from 'zod';

export const TailoredApplicationSchema = z.object({
  tailored_resume_html: z.string().describe("The ATS-optimized tailored resume formatted in clean, semantic HTML suitable for rendering in a rich text editor like Quill. Do NOT include html/head/body tags. Only use tags like h1, h2, h3, p, ul, li, strong, em."),
  cover_letter_html: z.string().describe("A professional and compelling cover letter based on the job description and resume, formatted in semantic HTML suitable for rendering in a rich text editor like Quill. Do NOT include html/head/body tags. Only use tags like p, br, strong.")
});

export type TailoredApplication = z.infer<typeof TailoredApplicationSchema>;
