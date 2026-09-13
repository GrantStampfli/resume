# @stampfli/resume-md

Structured resume data (YAML) and a serializer that emits the PHP Markdown Extra dialect the
`apps/resume-gen` templates already style.

```ts
import { parseResumeYaml, serializeResume } from '@stampfli/resume-md'

const data = parseResumeYaml(yaml)
const markdown = serializeResume(data)
```

Used by:

- `apps/resume-gen/scripts/build.mjs` — compile before the PHP HTML/PDF render
- `apps/admin` — form editor + live preview
