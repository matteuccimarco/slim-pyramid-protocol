# SLIM-PYRAMID Protocol

> A universal protocol for progressive content representation optimized for AI agents

[![npm version](https://img.shields.io/npm/v/@slim-protocol/types.svg?style=flat-square&color=00d4aa)](https://www.npmjs.com/package/@slim-protocol/types)
[![npm downloads](https://img.shields.io/npm/dm/@slim-protocol/types.svg?style=flat-square&color=00d4aa)](https://www.npmjs.com/package/@slim-protocol/types)
[![CI](https://img.shields.io/github/actions/workflow/status/matteuccimarco/slim-pyramid-protocol/ci.yml?style=flat-square&label=CI&color=00d4aa)](https://github.com/matteuccimarco/slim-pyramid-protocol/actions)
[![License: MIT](https://img.shields.io/badge/license-MIT-blue.svg?style=flat-square&color=7c3aed)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0+-blue.svg?style=flat-square&color=3178c6)](https://www.typescriptlang.org/)
[![GitHub stars](https://img.shields.io/github/stars/matteuccimarco/slim-pyramid-protocol?style=flat-square&color=7c3aed)](https://github.com/matteuccimarco/slim-pyramid-protocol)

<p align="center">
  <a href="https://matteuccimarco.github.io/slim-pyramid-protocol/">Documentation</a> •
  <a href="#quick-start">Quick Start</a> •
  <a href="./SPECIFICATION.md">Specification</a> •
  <a href="./examples/">Examples</a>
</p>

---

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
import { SLIML4, isSLIML4, selectLevel } from '@slim-protocol/types';

// Fetch content at level 4
const response = await fetch('/api/content?format=slim&level=4');
const payload = await response.json();

// Type-safe consumption with guards
if (isSLIML4(payload)) {
  console.log(payload.keyFacts);     // string[]
  console.log(payload.summaries);    // Record<string, string>
  console.log(payload.actionItems);  // string[] | undefined
}

// Smart level selection
const level = selectLevel([1, 3, 4, 5, 7], {
  tokenBudget: 500,
  prefer: 'balanced'
});
// Returns: 4 (best level within budget)
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
| **L0** | CAPS | ~20 | Capabilities only |
| **L1** | META | ~50 | Identity + metadata |
| **L2** | NAV | ~100 | Navigation/outline |
| **L3** | INDEX | ~200 | Structure + entities |
| **L4** | SUMMARY | ~400 | Summaries + key facts |
| **L5** | CONTENT | ~800 | Full text by unit |
| **L6** | STRUCT | ~1500 | Data schemas |
| **L7** | FULL | Variable | Complete content |
| **L8** | MEDIA_META | ~200 | Media inventory |
| **L9** | MEDIA_DESC | ~1000 | AI media descriptions |

## Content Types

SLIM-PYRAMID adapts to any content type:

| Type | L1 | L3 | L5 |
|------|----|----|-----|
| **Document** | Title, author, pages | Section summaries | Full text |
| **Conversation** | Topic, participants | Decisions, entities | All messages |
| **Code** | Language, filename | Interfaces, signatures | Implementation |
| **Decision** | Title, status | Problem/solution | Full rationale |

## API Reference

### Type Guards

```typescript
import {
  isSLIML0, isSLIML1, isSLIML2, isSLIML3,
  isSLIML4, isSLIML5, isSLIML6, isSLIML7,
  isSLIML8, isSLIML9
} from '@slim-protocol/types';
```

### Utilities

```typescript
import {
  getSlimLevel,        // Get level from payload
  getTokenBudget,      // Get budget for a level
  selectLevel,         // Smart level selection
  createSlimMetadata,  // Create metadata block
  parseAcceptHeader,   // Parse HTTP Accept header
  generateContentType  // Generate Content-Type header
} from '@slim-protocol/types';
```

### Constants

```typescript
import {
  SLIM_PYRAMID_VERSION,  // "2.1"
  SLIM_MIME_TYPE,        // "application/slim-pyramid+json"
  TOKEN_BUDGETS,         // Budget targets per level
  CACHE_TTL              // Recommended TTLs
} from '@slim-protocol/types';
```

## Documentation

- 📖 [Full Specification](./SPECIFICATION.md) - Complete protocol details
- 📁 [Examples](./examples/) - Sample payloads for all content types
- 📋 [JSON Schema](./schema/slim-pyramid.schema.json) - Validation schema
- 🌐 [Website](https://matteuccimarco.github.io/slim-pyramid-protocol/) - Interactive documentation

## Use Cases

### RAG Systems
Index documents at L4 for semantic search, retrieve L5+ for generation context.

### AI Assistants
Query large knowledge bases starting with L3 summaries, drill down on demand.

### Code Analysis
L2 for project structure, L3 for API surface, L5+ for implementation details.

### Meeting Summaries
Store conversations with L4 key points, L7 for full transcript access.

## Validation

Validate payloads against the JSON Schema:

```bash
# Using ajv-cli
npx ajv validate -s schema/slim-pyramid.schema.json -d payload.json
```

## Implementations

| Language | Package | Status |
|----------|---------|--------|
| TypeScript | `@slim-protocol/types` | ✅ Stable |
| Python | `slim-pyramid` | 🔜 Coming soon |
| Rust | `slim-pyramid` | 🔜 Coming soon |

## Contributing

We welcome contributions! Please see [CONTRIBUTING.md](./CONTRIBUTING.md) for guidelines.

```bash
git clone https://github.com/matteuccimarco/slim-pyramid-protocol.git
cd slim-pyramid-protocol
npm install
npm run build
npm test
```

## License

MIT License - see [LICENSE](./LICENSE) for details.

## Acknowledgments

SLIM-PYRAMID was developed as part of the [FRUX](https://frux.pro) AI platform and is now released as an open standard for the AI community.

---

<p align="center">
  <b>SLIM-PYRAMID Protocol</b> — <i>Less tokens, same intelligence</i>
</p>
