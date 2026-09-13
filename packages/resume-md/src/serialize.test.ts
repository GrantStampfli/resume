import { describe, expect, it } from 'vitest'
import { parseResumeYaml, serializeResume, stringifyResumeYaml } from './index'

const sample = `
name: Jane Doe
title: Software Engineer
pdf: sample.pdf
contact:
  phone: "(555) 555-0100"
  phoneHref: "tel:+15555550100"
  email: jane@example.com
  linkedin: janedoe
  github: janedoe
  links: []
profile: |
  Engineer who "ships" things -- and writes tests.
skills:
  - name: Web Development
    description: Builds web applications.
technical:
  - HTML5
  - Vue
experience:
  - organisation: Example Corp
    role: Senior Engineer
    dates: 2020-Present
    summary: Built the things.
`

describe('resume-md', () => {
  it('round-trips YAML and emits Extra markdown hooks the templates expect', () => {
    const data = parseResumeYaml(sample)
    const markdown = serializeResume(data)

    expect(markdown).toContain('# Jane Doe')
    expect(markdown).toContain('### Profile {#profile}')
    expect(markdown).toContain('### Skills {#skills}')
    expect(markdown).toContain('* Web Development\n  : Builds web applications.')
    expect(markdown).toContain('Example Corp\n: *Senior Engineer*')
    expect(markdown).toContain('### Footer {#footer}')
    expect(markdown).toContain('[@janedoe](https://www.linkedin.com/in/janedoe)')

    const again = parseResumeYaml(stringifyResumeYaml(data))
    expect(again).toEqual(data)
  })
})
