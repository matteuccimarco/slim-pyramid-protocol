# SLIM-PYRAMID Protocol

> A universal protocol for progressive content representation optimized for AI agents

[![npm version](https://img.shields.io/npm/v/@slim-protocol/types.svg)](https://www.npmjs.com/package/@slim-protocol/types)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

## What is SLIM-PYRAMID?

SLIM-PYRAMID is an open protocol that enables AI agents to consume content efficiently through **progressive disclosure**. Instead of loading entire documents, conversations, or codebases, agents can request exactly the level of detail they need.

```
L1: "What is this?"     → ~50 tokens   (identity)
L3: "What's in it?"     → ~200 tokens  (structure)
L5: "Tell me more"      → ~800 tokens  (details)
L7: "Give me everything"→ full content
```

## Why SLIM-PYRAMID?

| Problem | Traditional | SLIM-PYRAMID |
|---------|------------|--------------|
| Long document Q&A | Load all 50k tokens | Start with L3 (~200 tokens), escalate if needed |
| Code understanding | Parse entire codebase | L2 for structure, L3 for interfaces |
| Conversation search | Index full messages | L4 summaries for discovery, L5 for details |

**Result**: 40-90% token reduction for most queries while maintaining semantic completeness.

## Quick Start

### Installation

```bash
npm install @slim-protocol/types
```

### TypeScript Usage

```typescript
import { SLIML3, SLIML4, isSLIML4 } from '@slim-protocol/types';

// Type-safe consumption
function processContent(payload: unknown) {
  if (isSLIML4(payload)) {
    // Access summaries and key facts
    console.log(payload.keyFacts);
    console.log(payload.summaries);
  }
}

// Request specific levels
const response = await fetch('/api/content?format=slim&level=4');
const data: SLIML4 = await response.json();
```

### HTTP Content Negotiation

```http
GET /api/content HTTP/1.1
Accept: application/slim-pyramid+json; level=4
```

```http
HTTP/1.1 200 OK
Content-Type: application/slim-pyramid+json; level=4
X-Slim-Available-Levels: 1,3,4,5,7
X-Slim-Token-Count: 423
```

## The 10 Levels

| Level | Name | Tokens | Purpose |
|-------|------|--------|---------|
| L0 | CAPS | ~20 | Capabilities only |
| L1 | META | ~50 | Identity + metadata |
| L2 | NAV | ~100 | Navigation/outline |
| L3 | INDEX | ~200 | Structure + entities |
| L4 | SUMMARY | ~400 | Summaries + key facts |
| L5 | CONTENT | ~800 | Full text by unit |
| L6 | STRUCT | ~1500 | Data schemas |
| L7 | FULL | Variable | Complete content |
| L8 | MEDIA_META | ~200 | Media inventory |
| L9 | MEDIA_DESC | ~1000 | AI media descriptions |

## Content Types

SLIM-PYRAMID adapts to any content type:

- **Documents**: Articles, reports, documentation
- **Conversations**: Chat logs, emails, meetings
- **Code**: Source files, modules, repositories
- **Decisions**: ADRs, meeting notes, specs
- **Media**: Images, videos, audio with descriptions

## Documentation

- [Full Specification](./SPECIFICATION.md) - Complete protocol details
- [TypeScript Types](./src/index.ts) - Type definitions
- [Examples](./examples/) - Implementation examples

## Use Cases

### AI Assistants
Query large knowledge bases efficiently by starting with L3 summaries and drilling down only when needed.

### RAG Systems
Index at L4 for semantic search, retrieve L5 for generation context.

### Code Analysis
L2 for project structure, L3 for API surface, L5+ for implementation details.

### Meeting Summaries
Store conversations with L4 key points for quick lookup, L7 for full transcript access.

## Implementations

| Language | Package | Status |
|----------|---------|--------|
| TypeScript | `@slim-protocol/types` | Stable |
| Python | `slim-pyramid` | Coming soon |
| Rust | `slim-pyramid` | Coming soon |

## Contributing

We welcome contributions! Please see [CONTRIBUTING.md](./CONTRIBUTING.md) for guidelines.

### Development

```bash
git clone https://github.com/anthropics/slim-pyramid-protocol.git
cd slim-pyramid-protocol
npm install
npm test
```

## License

MIT License - see [LICENSE](./LICENSE) for details.

## Acknowledgments

SLIM-PYRAMID was developed as part of the [FRUX](https://frux.pro) AI platform and is now released as an open standard for the AI community.

---

**SLIM-PYRAMID Protocol** - *Less tokens, same intelligence*
