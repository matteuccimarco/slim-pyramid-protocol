# SLIM-PYRAMID Examples

This directory contains example payloads at various pyramid levels for different content types.

## Examples

### Document (L3)

[document-l3.json](./document-l3.json) - A technical documentation file at L3 (Structure level)

Shows:
- Hierarchical outline with nested sections
- Unit references with token estimates
- Topics and entity extraction
- Available levels for progressive loading

### Conversation (L4)

[conversation-l4.json](./conversation-l4.json) - A team discussion at L4 (Summary level)

Shows:
- Timeline phases for conversation structure
- Decisions and action items extraction
- Key facts and key points with importance
- Summaries per phase
- Participant entities

### Code (L3)

[code-l3.json](./code-l3.json) - A TypeScript source file at L3

Shows:
- Code-specific outline (imports, classes, functions, exports)
- Unit types for code elements (class, function)
- Language and file metadata

## Validation

Use the JSON Schema to validate your payloads:

```bash
# Using ajv-cli
npm install -g ajv-cli
ajv validate -s ../schema/slim-pyramid.schema.json -d document-l3.json

# Using Python jsonschema
pip install jsonschema
python -c "
import json
from jsonschema import validate
schema = json.load(open('../schema/slim-pyramid.schema.json'))
data = json.load(open('document-l3.json'))
validate(data, schema)
print('Valid!')
"
```

## Level Progression

Each content type follows a similar pattern:

```
L0: Capabilities only (what can you do with this?)
L1: Identity (what is this?)
L2: Navigation (how is it organized?)
L3: Structure (what's in it?)
L4: Summaries (key information)
L5: Content (full text by unit)
L6: Schemas (structured data definitions)
L7: Complete (everything)
L8: Media inventory (what media exists)
L9: Media descriptions (AI-generated descriptions)
```

## Creating Your Own

1. Start with L1 (identity) - the minimum viable payload
2. Add levels based on content complexity
3. Validate against the schema
4. Test with type guards from `@slim-protocol/types`

```typescript
import { isSLIML4, SLIML4 } from '@slim-protocol/types';

const payload = await fetch('/api/content?level=4').then(r => r.json());

if (isSLIML4(payload)) {
  // Type-safe access to L4 properties
  console.log(payload.keyFacts);
  console.log(payload.summaries);
}
```
