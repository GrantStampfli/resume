import { z } from 'zod'

export const resumeLinkSchema = z.object({
  label: z.string().min(1),
  href: z.string().min(1),
})

export const resumeSkillSchema = z.object({
  name: z.string().min(1),
  description: z.string().min(1),
})

export const resumeExperienceSchema = z.object({
  organisation: z.string().min(1),
  role: z.string().min(1),
  dates: z.string().min(1),
  summary: z.string().min(1),
})

export const resumeContactSchema = z.object({
  phone: z.string().default(''),
  phoneHref: z.string().default(''),
  email: z.union([z.string().email(), z.literal('')]).default(''),
  linkedin: z.string().default(''),
  github: z.string().default(''),
  website: z.union([z.string().url(), z.literal('')]).default(''),
  links: z.array(resumeLinkSchema).default([]),
})

export const resumeSchema = z.object({
  name: z.string().min(1),
  title: z.string().min(1),
  pdf: z.string().min(1).default('resume.pdf'),
  contact: resumeContactSchema.default({ links: [] }),
  profile: z.string().min(1),
  skills: z.array(resumeSkillSchema).default([]),
  technical: z.array(z.string().min(1)).default([]),
  experience: z.array(resumeExperienceSchema).default([]),
})

export type ResumeLink = z.infer<typeof resumeLinkSchema>
export type ResumeSkill = z.infer<typeof resumeSkillSchema>
export type ResumeExperience = z.infer<typeof resumeExperienceSchema>
export type ResumeContact = z.infer<typeof resumeContactSchema>
export type ResumeData = z.infer<typeof resumeSchema>
