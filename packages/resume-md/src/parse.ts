import type { ResumeData } from './schema'
import { parse as parseYaml, stringify as stringifyYaml } from 'yaml'
import { resumeSchema } from './schema'

/** Parse and validate a resume YAML document. */
export function parseResumeYaml(source: string): ResumeData {
  const parsed = parseYaml(source)
  return resumeSchema.parse(parsed)
}

/** Dump resume data as a stable, human-editable YAML document. */
export function stringifyResumeYaml(data: ResumeData): string {
  const normalised = resumeSchema.parse(data)
  return stringifyYaml(normalised, {
    lineWidth: 96,
    defaultStringType: 'PLAIN',
    defaultKeyType: 'PLAIN',
  }).trimEnd().concat('\n')
}

/** Empty resume scaffold for the admin editor. */
export function emptyResume(): ResumeData {
  return resumeSchema.parse({
    name: 'Your Name',
    title: 'Your Title',
    pdf: 'resume.pdf',
    contact: {
      phone: '',
      phoneHref: '',
      email: 'you@example.com',
      linkedin: '',
      github: '',
      website: '',
      links: [],
    },
    profile: 'A short professional summary.',
    skills: [],
    technical: [],
    experience: [],
  })
}
