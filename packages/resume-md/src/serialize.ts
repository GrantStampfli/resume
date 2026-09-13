import type { ResumeContact, ResumeData, ResumeExperience, ResumeSkill } from './schema'

function trimBlock(value: string): string {
  return value.replace(/\r\n/g, '\n').trim()
}

function indentContinuation(text: string, spaces: number): string {
  const pad = ' '.repeat(spaces)
  return trimBlock(text)
    .split('\n')
    .map((line, index) => (index === 0 ? line : `${pad}${line}`))
    .join('\n')
}

function contactLines(contact: ResumeContact, pdf: string): string[] {
  const lines = [`> [Download PDF](${pdf})`]

  if (contact.phone) {
    const href = contact.phoneHref || `tel:${contact.phone.replace(/\D/g, '')}`
    lines.push(`> __[${contact.phone}](${href})__`)
  }

  if (contact.email)
    lines.push(`> *[${contact.email}](mailto:${contact.email})*`)

  for (const link of contact.links)
    lines.push(`> *[${link.label}](${link.href})*`)

  return lines
}

function skillBlock(skill: ResumeSkill): string {
  return `* ${skill.name}\n  : ${indentContinuation(skill.description, 4)}`
}

function experienceBlock(item: ResumeExperience): string {
  const summary = indentContinuation(item.summary, 2)
  return `${item.organisation}\n: *${item.role}*\n  __${item.dates}__\n  ${summary}`
}

function footerLine(contact: ResumeContact): string | null {
  const parts: string[] = []

  if (contact.phone) {
    const href = contact.phoneHref || `tel:${contact.phone.replace(/\D/g, '')}`
    parts.push(`*Phone:* __*[${contact.phone}](${href})*__`)
  }

  if (contact.email)
    parts.push(`*Email:* __*[${contact.email}](mailto:${contact.email})*__`)

  if (contact.linkedin)
    parts.push(`*LinkedIn:* __*[@${contact.linkedin}](https://www.linkedin.com/in/${contact.linkedin})*__`)

  if (contact.github)
    parts.push(`*Github:* __*[@${contact.github}](https://www.github.com/${contact.github})*__`)

  if (contact.website)
    parts.push(`*Web:* __*[${contact.website}](${contact.website})*__`)

  for (const link of contact.links)
    parts.push(`*${link.label}:* __*[${link.label}](${link.href})*__`)

  return parts.length > 0 ? parts.join(' -- ') : null
}

/**
 * Serialises structured resume data into PHP Markdown Extra that the existing
 * templates already style (definition lists, `{#id}` headers, contact blockquote).
 */
export function serializeResume(data: ResumeData): string {
  const sections: string[] = [
    `# ${data.name}`,
    `## ${data.title}`,
    '',
    ...contactLines(data.contact, data.pdf),
    '',
    '------',
    '',
    '### Profile {#profile}',
    '',
    trimBlock(data.profile),
  ]

  if (data.skills.length > 0) {
    sections.push(
      '',
      '------',
      '',
      '### Skills {#skills}',
      '',
      ...data.skills.flatMap((skill, index) => [
        skillBlock(skill),
        ...(index < data.skills.length - 1 ? [''] : []),
      ]),
    )
  }

  if (data.technical.length > 0) {
    sections.push(
      '',
      '------',
      '',
      '### Technical {#technical}',
      '',
      ...data.technical.map((item, index) => `${index + 1}. ${item}`),
    )
  }

  if (data.experience.length > 0) {
    sections.push(
      '',
      '------',
      '',
      '### Experience {#experience}',
      '',
      ...data.experience.flatMap((item, index) => [
        experienceBlock(item),
        ...(index < data.experience.length - 1 ? [''] : []),
      ]),
    )
  }

  const footer = footerLine(data.contact)
  if (footer) {
    sections.push(
      '',
      '------',
      '',
      '### Footer {#footer}',
      '',
      footer,
      '',
      '------',
      '',
    )
  }
  else {
    sections.push('', '------', '')
  }

  return `${sections.join('\n').replace(/\n{3,}/g, '\n\n').trim()}\n`
}
