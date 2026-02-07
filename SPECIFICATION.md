# SLIM-PYRAMID Protocol Specification

> A universal protocol for progressive content representation optimized for AI agents

**Version**: 2.1
**Status**: Stable
**License**: MIT

---

## Abstract

**SLIM-PYRAMID** is a content-type agnostic protocol for representing any content (documents, conversations, code, decisions, media) in a hierarchical structure with 10 progressive detail levels (L0-L9). It enables AI agents to request exactly the amount of information needed, optimizing token usage while maintaining semantic completeness.

---

## Table of Contents

1. [Motivation](#motivation)
2. [Core Principles](#core-principles)
3. [The 10 Levels](#the-10-levels)
4. [Content Types](#content-types)
5. [Dynamic Level Selection](#dynamic-level-selection)
6. [TypeScript Definitions](#typescript-definitions)
7. [Content Negotiation](#content-negotiation)
8. [Examples](#examples)
9. [Implementation Guidelines](#implementation-guidelines)
10. [Versioning](#versioning)

---

## Motivation

Modern AI agents face a fundamental challenge: **context window limits vs. information needs**.

Traditional approaches force a choice:
- **Full content**: Wastes tokens on irrelevant details
- **Fixed summaries**: May miss critical information
- **Ad-hoc truncation**: Loses semantic structure

SLIM-PYRAMID solves this with **progressive disclosure**: content is pre-processed into multiple detail levels, allowing agents to request exactly what they need.

### Benefits

| Benefit | Description |
|---------|-------------|
| **Token Efficiency** | 40-90% reduction vs. full content for most queries |
| **Predictable Budgets** | Each level has a target token count |
| **Semantic Preservation** | Structure and meaning maintained at all levels |
| **Type Safety** | Full TypeScript support with type guards |
| **Content Agnostic** | Works with any content type |

---

## Core Principles

### 1. Progressive Disclosure

Each level adds incremental detail. An agent can start at L1 and progressively request higher levels only if needed.

```
L1: "What is this?" → Identity
L3: "What's in it?" → Structure
L5: "Tell me more" → Details
L7: "Give me everything" → Full content
```

### 2. Token Budget Targets

Each level has a predictable token budget, enabling cost estimation before retrieval.

| Level | Target Tokens | Variance |
|-------|---------------|----------|
| L0 | ~20 | ±10 |
| L1 | ~50 | ±25 |
| L2 | ~100 | ±50 |
| L3 | ~200 | ±100 |
| L4 | ~400 | ±200 |
| L5 | ~800 | ±400 |
| L6 | ~1500 | ±500 |
| L7 | Variable | Content-dependent |
| L8 | ~200 | ±100 |
| L9 | ~1000 | ±500 |

### 3. Cumulative Extension

Higher levels extend lower levels. L4 contains all information from L3, L2, L1, and L0.

### 4. Type Safety

Every level has a TypeScript interface with runtime type guards.

---

## The 10 Levels

### L0 - CAPS (Capabilities)

The lightest level. Tells an agent **what operations are possible** without revealing content.

```typescript
interface SLIML0 {
  _slim: SlimMetadata;
  capabilities: SlimCapability[];
}

type SlimCapability =
  | 'query'      // Can answer questions
  | 'summarize'  // Can be summarized
  | 'extract'    // Contains extractable data
  | 'navigate'   // Has navigable structure
  | 'cite'       // Can be cited/quoted
  | 'compare'    // Can be compared with others
  | 'analyze'    // Supports deep analysis
  | 'execute';   // Contains executable content (code)
```

**Use cases**: Routing, filtering, capability discovery.

---

### L1 - META (Identity)

Answers **"What is this?"** - type, title, basic metadata.

```typescript
interface SLIML1 extends SLIML0 {
  contentType: SlimContentType;
  title: string;
  language: string;
  length: ContentLength;
  createdAt?: string;
  author?: string;
  description?: string;
}

type SlimContentType =
  // Documents
  | 'article' | 'documentation' | 'report' | 'email'
  // Structured
  | 'conversation' | 'code' | 'decision' | 'data'
  // Media
  | 'video' | 'image' | 'audio'
  // Other
  | 'mixed' | 'unknown';

interface ContentLength {
  value: number;
  unit: 'tokens' | 'words' | 'characters' | 'lines' | 'messages' | 'pages';
}
```

**Use cases**: Classification, filtering, strategy selection.

---

### L2 - NAV (Navigation)

Shows **how content is organized** - outline, structure, timeline.

```typescript
interface SLIML2 extends SLIML1 {
  outline: SlimOutlineEntry[];
  hasTimeline?: boolean;
  phases?: SlimPhase[];  // For conversations
}

interface SlimOutlineEntry {
  id: string;
  title: string;
  level: number;
  children?: SlimOutlineEntry[];
}

interface SlimPhase {
  name: string;
  range: string;  // e.g., "messages 1-15"
}
```

**Use cases**: Navigation, section targeting, structure understanding.

---

### L3 - INDEX (Structure)

Lists **what units exist** with metadata for selective loading.

```typescript
interface SLIML3 extends SLIML2 {
  units: SlimUnit[];
  topics?: string[];
  entities?: SlimEntity[];
  decisions?: string[];  // For conversations/decisions
}

interface SlimUnit {
  id: string;
  type: 'section' | 'message' | 'function' | 'class' | 'table' | 'figure' | 'quote';
  parentId?: string;
  tokenEstimate: number;
  preview?: string;  // First ~20 tokens
}

interface SlimEntity {
  name: string;
  type: 'person' | 'organization' | 'technology' | 'concept' | 'place' | 'date';
  mentions: number;
}
```

**Use cases**: Query planning, cost estimation, selective retrieval.

---

### L4 - SUMMARY (Key Information)

Provides **actionable information** without full text.

```typescript
interface SLIML4 extends SLIML3 {
  summaries: Record<string, string>;  // unitId → summary
  keyFacts: string[];
  keyPoints?: SlimKeyPoint[];
  actionItems?: string[];  // For conversations
}

interface SlimKeyPoint {
  point: string;
  unitId: string;
  importance: 'high' | 'medium' | 'low';
}
```

**Use cases**: General Q&A, overview, quick understanding.

---

### L5 - CONTENT (Full Text)

Contains **complete text** organized by unit.

```typescript
interface SLIML5 extends SLIML4 {
  contents: Record<string, string>;  // unitId → full text
}
```

**Use cases**: Specific Q&A, citations, detailed analysis.

---

### L6 - STRUCT (Structured Data Schemas)

Describes **structure of data** (tables, lists, interfaces).

```typescript
interface SLIML6 extends SLIML5 {
  schemas: SlimSchema[];
}

interface SlimSchema {
  id: string;
  type: 'table' | 'list' | 'interface' | 'enum';
  title?: string;
  definition: TableSchema | ListSchema | CodeSchema;
}

interface TableSchema {
  columns: string[];
  rowCount: number;
  sampleRow?: (string | number | null)[];
}

interface ListSchema {
  itemCount: number;
  ordered: boolean;
  sampleItems?: string[];
}

interface CodeSchema {
  language: string;
  exports: string[];
  signature?: string;
}
```

**Use cases**: Understanding data structure before loading.

---

### L7 - STRUCT_FULL (Complete Structured Data)

Contains **all structured data** - full tables, lists, code.

```typescript
interface SLIML7 extends SLIML6 {
  data: Record<string, StructuredData>;
}

type StructuredData =
  | { type: 'table'; rows: (string | number | boolean | null)[][] }
  | { type: 'list'; items: string[] }
  | { type: 'code'; source: string };
```

**Use cases**: Data extraction, calculations, code analysis.

---

### L8 - MEDIA_META (Media Inventory)

Lists **what media exists** with metadata.

```typescript
interface SLIML8 extends SLIML7 {
  media: SlimMediaItem[];
}

interface SlimMediaItem {
  id: string;
  type: 'image' | 'video' | 'audio' | 'document';
  title?: string;
  alt?: string;
  mimeType?: string;
  dimensions?: { width: number; height: number };
  duration?: number;  // seconds
  unitId?: string;  // Associated content unit
}
```

**Use cases**: Media inventory, selective loading decisions.

---

### L9 - MEDIA_DESC (Media Descriptions)

Contains **AI-generated descriptions** of media content.

```typescript
interface SLIML9 extends SLIML8 {
  mediaDescriptions: Record<string, SlimMediaDescription>;
}

interface SlimMediaDescription {
  description: string;
  extractedText?: string;  // OCR
  objects?: string[];
  sentiment?: string;
  transcript?: string;  // For audio/video
}
```

**Use cases**: Full understanding including visual/audio content.

---

## Content Types

SLIM-PYRAMID adapts its level semantics based on content type.

### Documents

```
L1: Title, author, page count, date
L2: Table of contents
L3: Section summaries
L4: Key points per section
L5: Full text per section
L6: Table/figure schemas
L7: Complete tables/figures
```

### Conversations (Chat/Email)

```
L1: Topic, participants, message count, date range
L2: Conversation phases/timeline
L3: Topics discussed, decisions made, entities
L4: Key exchanges, Q&A pairs
L5: Full message text
L7: Attachments, shared content
```

### Code

```
L1: Language, filename, line count, type (class/module/script)
L2: Structure (imports, classes, functions, exports)
L3: Public interfaces, function signatures
L4: Function purposes, parameter descriptions
L5: Implementation of key functions
L6: Type definitions, schemas
L7: Complete source code
```

### Decisions (ADRs, Meeting Notes)

```
L1: Decision title, status, date
L3: Problem, solution, alternatives considered
L5: Detailed pros/cons, rationale, impact
L7: Full decision document
```

---

## Dynamic Level Selection

Not all levels are needed for all content. SLIM-PYRAMID supports **dynamic level generation** based on content characteristics.

### Complexity Categories

| Category | Criteria |
|----------|----------|
| **simple** | Short, single-topic, no structure |
| **medium** | Moderate length, some structure |
| **complex** | Long, multi-topic, rich structure |
| **very_long** | Extensive, requires progressive loading |

### Level Selection Matrix

| Content | Simple | Medium | Complex | Very Long |
|---------|--------|--------|---------|-----------|
| Required | L1, L7 | L1, L3, L5, L7 | L1, L2, L3, L4, L5, L7 | All levels |
| Optional | - | L2 | L6 | L6, L8, L9 |

### Size Thresholds by Type

| Type | Simple | Medium | Long | Very Long |
|------|--------|--------|------|-----------|
| Conversation | ≤5 msgs | 6-20 msgs | 21-50 msgs | >50 msgs |
| Document | 1 page | 2-5 pages | 6-20 pages | >20 pages |
| Code | ≤50 lines | 51-200 lines | 201-500 lines | >500 lines |

---

## TypeScript Definitions

### Metadata Block

Every SLIM-PYRAMID payload includes metadata:

```typescript
interface SlimMetadata {
  version: string;       // Protocol version, e.g., "2.1"
  level: number;         // 0-9
  contentType: SlimContentType;
  generatedAt: string;   // ISO 8601
  sourceHash: string;    // SHA-256 of original content
  tokenCount: number;    // Actual tokens in this payload
  availableLevels: number[];  // Which levels exist
  ttlSeconds?: number;   // Suggested cache TTL
}
```

### Type Guards

```typescript
function isSLIML0(payload: unknown): payload is SLIML0;
function isSLIML1(payload: unknown): payload is SLIML1;
function isSLIML3(payload: unknown): payload is SLIML3;
function isSLIML4(payload: unknown): payload is SLIML4;
function isSLIML5(payload: unknown): payload is SLIML5;
function isSLIML7(payload: unknown): payload is SLIML7;
function isSLIML9(payload: unknown): payload is SLIML9;

// Usage
if (isSLIML4(payload)) {
  console.log(payload.keyFacts);  // Type-safe access
}
```

---

## Content Negotiation

### HTTP Headers

**Request:**
```http
Accept: application/slim-pyramid+json; level=4
Accept: application/slim-pyramid+json; level=7, application/json; q=0.9
```

**Response:**
```http
Content-Type: application/slim-pyramid+json; level=4; charset=utf-8
X-Slim-Available-Levels: 1,3,4,5,7
X-Slim-Token-Count: 423
```

### Query Parameters

```
GET /content?format=slim&level=4
GET /content?format=slim&level=best&budget=500
```

### Level Selection Hints

```typescript
interface LevelRequest {
  level?: number;           // Specific level
  maxLevel?: number;        // Don't exceed this level
  tokenBudget?: number;     // Select best level within budget
  prefer?: 'minimal' | 'balanced' | 'comprehensive';
}
```

---

## Examples

### Example 1: Document at L3

```json
{
  "_slim": {
    "version": "2.1",
    "level": 3,
    "contentType": "documentation",
    "generatedAt": "2026-02-07T10:30:00Z",
    "sourceHash": "a1b2c3d4...",
    "tokenCount": 187,
    "availableLevels": [1, 2, 3, 4, 5, 7]
  },
  "capabilities": ["query", "summarize", "navigate", "cite"],
  "contentType": "documentation",
  "title": "SLIM-PYRAMID Protocol Specification",
  "language": "en",
  "length": { "value": 15, "unit": "pages" },
  "outline": [
    { "id": "s1", "title": "Introduction", "level": 1 },
    { "id": "s2", "title": "Core Principles", "level": 1 },
    { "id": "s3", "title": "The 10 Levels", "level": 1 }
  ],
  "units": [
    { "id": "u1", "type": "section", "parentId": "s1", "tokenEstimate": 150 },
    { "id": "u2", "type": "section", "parentId": "s2", "tokenEstimate": 300 },
    { "id": "u3", "type": "table", "parentId": "s3", "tokenEstimate": 200 }
  ],
  "topics": ["AI", "protocols", "progressive disclosure", "token optimization"],
  "entities": [
    { "name": "SLIM-PYRAMID", "type": "technology", "mentions": 45 },
    { "name": "TypeScript", "type": "technology", "mentions": 12 }
  ]
}
```

### Example 2: Conversation at L4

```json
{
  "_slim": {
    "version": "2.1",
    "level": 4,
    "contentType": "conversation",
    "tokenCount": 312
  },
  "contentType": "conversation",
  "title": "API Design Discussion",
  "length": { "value": 28, "unit": "messages" },
  "phases": [
    { "name": "Requirements", "range": "1-8" },
    { "name": "Design Options", "range": "9-20" },
    { "name": "Decision", "range": "21-28" }
  ],
  "topics": ["REST API", "Authentication", "Rate Limiting"],
  "decisions": [
    "Use JWT for auth",
    "Implement sliding window rate limiting",
    "Return RFC 7807 error format"
  ],
  "keyFacts": [
    "API will serve both internal and external clients",
    "Expected load: 1000 req/min peak",
    "Must support webhook callbacks"
  ],
  "summaries": {
    "phase:requirements": "Team discussed API requirements for the new service...",
    "phase:design": "Evaluated REST vs GraphQL, decided on REST for simplicity...",
    "phase:decision": "Finalized auth strategy and error handling approach..."
  },
  "actionItems": [
    "Create OpenAPI spec by Friday",
    "Set up rate limiting middleware",
    "Document webhook payload format"
  ]
}
```

---

## Implementation Guidelines

### Generating SLIM-PYRAMID

1. **Analyze content** - Determine type, length, complexity
2. **Select levels** - Based on complexity matrix
3. **Generate bottom-up** - L1 first, then L2, etc.
4. **Validate budgets** - Ensure token targets are met
5. **Store efficiently** - Cache levels independently

### Consuming SLIM-PYRAMID

1. **Start low** - Request L1 for initial understanding
2. **Escalate as needed** - Request higher levels for specific needs
3. **Use type guards** - Ensure type safety
4. **Respect budgets** - Track token usage

### Caching Strategy

```typescript
// Cache key format
`slim:${sourceHash}:L${level}`

// Recommended TTLs
L0-L1: 24 hours (rarely changes)
L2-L4: 1 hour (summaries may update)
L5-L7: 30 minutes (content may change)
L8-L9: 1 hour (media descriptions stable)
```

---

## Versioning

| Version | Description |
|---------|-------------|
| **1.x** | Legacy 4-level system (L0-L3) |
| **2.0** | 10-level system, web content focus |
| **2.1** | Content-type agnostic, dynamic levels |

### Backward Compatibility

Conversion functions available:
- `convertV1toV2(legacyPayload)`
- `convertV2toV1(slimPayload)` (lossy)

---

## References

- TypeScript package: `@slim-protocol/types` (npm)
- JSON Schema: `https://slim-protocol.org/schema/v2.1.json`
- Validator: `https://slim-protocol.org/validate`

---

## License

MIT License - See LICENSE file for details.

---

*SLIM-PYRAMID Protocol Specification v2.1*
*Last updated: 2026-02-07*
