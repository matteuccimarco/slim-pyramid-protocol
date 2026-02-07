/**
 * SLIM-PYRAMID Protocol Types
 *
 * A universal protocol for progressive content representation optimized for AI agents.
 *
 * @packageDocumentation
 */

// =============================================================================
// METADATA
// =============================================================================

/**
 * Protocol version
 */
export const SLIM_PYRAMID_VERSION = '2.1';

/**
 * Metadata included in every SLIM-PYRAMID payload
 */
export interface SlimMetadata {
  /** Protocol version (e.g., "2.1") */
  version: string;
  /** Current level (0-9) */
  level: number;
  /** Content type */
  contentType: SlimContentType;
  /** Generation timestamp (ISO 8601) */
  generatedAt: string;
  /** SHA-256 hash of original content */
  sourceHash: string;
  /** Actual token count of this payload */
  tokenCount: number;
  /** Which levels are available for this content */
  availableLevels: number[];
  /** Suggested cache TTL in seconds */
  ttlSeconds?: number;
}

// =============================================================================
// COMMON TYPES
// =============================================================================

/**
 * Content type classification
 */
export type SlimContentType =
  // Documents
  | 'article'
  | 'documentation'
  | 'report'
  | 'email'
  // Structured
  | 'conversation'
  | 'code'
  | 'decision'
  | 'data'
  // Media
  | 'video'
  | 'image'
  | 'audio'
  // Other
  | 'mixed'
  | 'unknown';

/**
 * Capabilities that content supports
 */
export type SlimCapability =
  | 'query'      // Can answer questions
  | 'summarize'  // Can be summarized
  | 'extract'    // Contains extractable data
  | 'navigate'   // Has navigable structure
  | 'cite'       // Can be cited/quoted
  | 'compare'    // Can be compared with others
  | 'analyze'    // Supports deep analysis
  | 'execute';   // Contains executable content

/**
 * Content length with unit
 */
export interface ContentLength {
  value: number;
  unit: 'tokens' | 'words' | 'characters' | 'lines' | 'messages' | 'pages';
}

/**
 * Named entity extracted from content
 */
export interface SlimEntity {
  name: string;
  type: 'person' | 'organization' | 'technology' | 'concept' | 'place' | 'date';
  mentions: number;
}

/**
 * Outline entry for navigation
 */
export interface SlimOutlineEntry {
  id: string;
  title: string;
  level: number;
  children?: SlimOutlineEntry[];
}

/**
 * Phase in a conversation or timeline
 */
export interface SlimPhase {
  name: string;
  range: string;
}

/**
 * Content unit reference
 */
export interface SlimUnit {
  id: string;
  type: 'section' | 'message' | 'function' | 'class' | 'table' | 'figure' | 'quote';
  parentId?: string;
  tokenEstimate: number;
  preview?: string;
}

/**
 * Key point with importance
 */
export interface SlimKeyPoint {
  point: string;
  unitId: string;
  importance: 'high' | 'medium' | 'low';
}

// =============================================================================
// LEVEL INTERFACES
// =============================================================================

/**
 * L0 - Capabilities only (~20 tokens)
 */
export interface SLIML0 {
  _slim: SlimMetadata;
  capabilities: SlimCapability[];
}

/**
 * L1 - Identity + metadata (~50 tokens)
 */
export interface SLIML1 extends SLIML0 {
  contentType: SlimContentType;
  title: string;
  language: string;
  length: ContentLength;
  createdAt?: string;
  author?: string;
  description?: string;
}

/**
 * L2 - Navigation/outline (~100 tokens)
 */
export interface SLIML2 extends SLIML1 {
  outline: SlimOutlineEntry[];
  hasTimeline?: boolean;
  phases?: SlimPhase[];
}

/**
 * L3 - Structure + entities (~200 tokens)
 */
export interface SLIML3 extends SLIML2 {
  units: SlimUnit[];
  topics?: string[];
  entities?: SlimEntity[];
  decisions?: string[];
}

/**
 * L4 - Summaries + key facts (~400 tokens)
 */
export interface SLIML4 extends SLIML3 {
  summaries: Record<string, string>;
  keyFacts: string[];
  keyPoints?: SlimKeyPoint[];
  actionItems?: string[];
}

/**
 * L5 - Full text by unit (~800 tokens)
 */
export interface SLIML5 extends SLIML4 {
  contents: Record<string, string>;
}

/**
 * Schema definitions for structured data
 */
export interface SlimSchema {
  id: string;
  type: 'table' | 'list' | 'interface' | 'enum';
  title?: string;
  definition: TableSchema | ListSchema | CodeSchema;
}

export interface TableSchema {
  columns: string[];
  rowCount: number;
  sampleRow?: (string | number | null)[];
}

export interface ListSchema {
  itemCount: number;
  ordered: boolean;
  sampleItems?: string[];
}

export interface CodeSchema {
  language: string;
  exports: string[];
  signature?: string;
}

/**
 * L6 - Data schemas (~1500 tokens)
 */
export interface SLIML6 extends SLIML5 {
  schemas: SlimSchema[];
}

/**
 * Structured data content
 */
export type StructuredData =
  | { type: 'table'; rows: (string | number | boolean | null)[][] }
  | { type: 'list'; items: string[] }
  | { type: 'code'; source: string };

/**
 * L7 - Complete structured data (variable tokens)
 */
export interface SLIML7 extends SLIML6 {
  data: Record<string, StructuredData>;
}

/**
 * Media item metadata
 */
export interface SlimMediaItem {
  id: string;
  type: 'image' | 'video' | 'audio' | 'document';
  title?: string;
  alt?: string;
  mimeType?: string;
  dimensions?: { width: number; height: number };
  duration?: number;
  unitId?: string;
}

/**
 * L8 - Media inventory (~200 tokens)
 */
export interface SLIML8 extends SLIML7 {
  media: SlimMediaItem[];
}

/**
 * AI-generated media description
 */
export interface SlimMediaDescription {
  description: string;
  extractedText?: string;
  objects?: string[];
  sentiment?: string;
  transcript?: string;
}

/**
 * L9 - Media descriptions (~1000 tokens)
 */
export interface SLIML9 extends SLIML8 {
  mediaDescriptions: Record<string, SlimMediaDescription>;
}

// =============================================================================
// TYPE GUARDS
// =============================================================================

/**
 * Check if payload has valid SLIM metadata
 */
function hasSlimMetadata(payload: unknown): payload is { _slim: SlimMetadata } {
  if (!payload || typeof payload !== 'object') return false;
  const obj = payload as Record<string, unknown>;
  if (!obj._slim || typeof obj._slim !== 'object') return false;
  const slim = obj._slim as Record<string, unknown>;
  return (
    typeof slim.version === 'string' &&
    typeof slim.level === 'number' &&
    typeof slim.sourceHash === 'string'
  );
}

/**
 * Type guard for L0 payload
 */
export function isSLIML0(payload: unknown): payload is SLIML0 {
  if (!hasSlimMetadata(payload)) return false;
  const obj = payload as Record<string, unknown>;
  return Array.isArray(obj.capabilities);
}

/**
 * Type guard for L1 payload
 */
export function isSLIML1(payload: unknown): payload is SLIML1 {
  if (!isSLIML0(payload)) return false;
  const obj = payload as Record<string, unknown>;
  return (
    typeof obj.contentType === 'string' &&
    typeof obj.title === 'string' &&
    typeof obj.language === 'string'
  );
}

/**
 * Type guard for L2 payload
 */
export function isSLIML2(payload: unknown): payload is SLIML2 {
  if (!isSLIML1(payload)) return false;
  const obj = payload as Record<string, unknown>;
  return Array.isArray(obj.outline);
}

/**
 * Type guard for L3 payload
 */
export function isSLIML3(payload: unknown): payload is SLIML3 {
  if (!isSLIML2(payload)) return false;
  const obj = payload as Record<string, unknown>;
  return Array.isArray(obj.units);
}

/**
 * Type guard for L4 payload
 */
export function isSLIML4(payload: unknown): payload is SLIML4 {
  if (!isSLIML3(payload)) return false;
  const obj = payload as Record<string, unknown>;
  return (
    typeof obj.summaries === 'object' &&
    obj.summaries !== null &&
    Array.isArray(obj.keyFacts)
  );
}

/**
 * Type guard for L5 payload
 */
export function isSLIML5(payload: unknown): payload is SLIML5 {
  if (!isSLIML4(payload)) return false;
  const obj = payload as Record<string, unknown>;
  return typeof obj.contents === 'object' && obj.contents !== null;
}

/**
 * Type guard for L6 payload
 */
export function isSLIML6(payload: unknown): payload is SLIML6 {
  if (!isSLIML5(payload)) return false;
  const obj = payload as Record<string, unknown>;
  return Array.isArray(obj.schemas);
}

/**
 * Type guard for L7 payload
 */
export function isSLIML7(payload: unknown): payload is SLIML7 {
  if (!isSLIML6(payload)) return false;
  const obj = payload as Record<string, unknown>;
  return typeof obj.data === 'object' && obj.data !== null;
}

/**
 * Type guard for L8 payload
 */
export function isSLIML8(payload: unknown): payload is SLIML8 {
  if (!isSLIML7(payload)) return false;
  const obj = payload as Record<string, unknown>;
  return Array.isArray(obj.media);
}

/**
 * Type guard for L9 payload
 */
export function isSLIML9(payload: unknown): payload is SLIML9 {
  if (!isSLIML8(payload)) return false;
  const obj = payload as Record<string, unknown>;
  return typeof obj.mediaDescriptions === 'object' && obj.mediaDescriptions !== null;
}

// =============================================================================
// UTILITIES
// =============================================================================

/**
 * Get the level of a SLIM payload
 */
export function getSlimLevel(payload: unknown): number | null {
  if (!hasSlimMetadata(payload)) return null;
  return (payload as SLIML0)._slim.level;
}

/**
 * Token budget targets by level
 */
export const TOKEN_BUDGETS: Record<number, { target: number; variance: number }> = {
  0: { target: 20, variance: 10 },
  1: { target: 50, variance: 25 },
  2: { target: 100, variance: 50 },
  3: { target: 200, variance: 100 },
  4: { target: 400, variance: 200 },
  5: { target: 800, variance: 400 },
  6: { target: 1500, variance: 500 },
  7: { target: Infinity, variance: 0 },
  8: { target: 200, variance: 100 },
  9: { target: 1000, variance: 500 },
};

/**
 * Get expected token budget for a level
 */
export function getTokenBudget(level: number): { min: number; target: number; max: number } {
  const budget = TOKEN_BUDGETS[level];
  if (!budget) {
    return { min: 0, target: 0, max: 0 };
  }
  return {
    min: Math.max(0, budget.target - budget.variance),
    target: budget.target,
    max: budget.target === Infinity ? Infinity : budget.target + budget.variance,
  };
}

/**
 * Suggested cache TTL by level (in seconds)
 */
export const CACHE_TTL: Record<number, number> = {
  0: 86400,  // 24 hours
  1: 86400,  // 24 hours
  2: 3600,   // 1 hour
  3: 3600,   // 1 hour
  4: 3600,   // 1 hour
  5: 1800,   // 30 minutes
  6: 1800,   // 30 minutes
  7: 1800,   // 30 minutes
  8: 3600,   // 1 hour
  9: 3600,   // 1 hour
};

/**
 * Create SLIM metadata for a new payload
 */
export function createSlimMetadata(
  level: number,
  contentType: SlimContentType,
  sourceHash: string,
  tokenCount: number,
  availableLevels: number[]
): SlimMetadata {
  return {
    version: SLIM_PYRAMID_VERSION,
    level,
    contentType,
    generatedAt: new Date().toISOString(),
    sourceHash,
    tokenCount,
    availableLevels,
    ttlSeconds: CACHE_TTL[level],
  };
}

// =============================================================================
// CONTENT NEGOTIATION
// =============================================================================

/**
 * MIME type for SLIM-PYRAMID content
 */
export const SLIM_MIME_TYPE = 'application/slim-pyramid+json';

/**
 * Parse Accept header for SLIM level
 */
export function parseAcceptHeader(accept: string): number | null {
  const match = accept.match(/application\/slim-pyramid\+json;\s*level=(\d+)/);
  if (match) {
    return parseInt(match[1], 10);
  }
  return null;
}

/**
 * Generate Content-Type header for a level
 */
export function generateContentType(level: number): string {
  return `${SLIM_MIME_TYPE}; level=${level}; charset=utf-8`;
}

/**
 * Level request options
 */
export interface LevelRequest {
  /** Request specific level */
  level?: number;
  /** Don't exceed this level */
  maxLevel?: number;
  /** Select best level within this token budget */
  tokenBudget?: number;
  /** Preference hint */
  prefer?: 'minimal' | 'balanced' | 'comprehensive';
}

/**
 * Select best level based on request options
 */
export function selectLevel(
  availableLevels: number[],
  request: LevelRequest
): number {
  const sorted = [...availableLevels].sort((a, b) => a - b);

  // Specific level requested
  if (request.level !== undefined) {
    return sorted.includes(request.level)
      ? request.level
      : sorted[sorted.length - 1];
  }

  // Filter by maxLevel
  let candidates = request.maxLevel !== undefined
    ? sorted.filter(l => l <= request.maxLevel!)
    : sorted;

  if (candidates.length === 0) {
    candidates = sorted;
  }

  // Select by token budget
  if (request.tokenBudget !== undefined) {
    for (const level of [...candidates].reverse()) {
      const budget = getTokenBudget(level);
      if (budget.target <= request.tokenBudget) {
        return level;
      }
    }
    return candidates[0];
  }

  // Select by preference
  switch (request.prefer) {
    case 'minimal':
      return candidates[0];
    case 'comprehensive':
      return candidates[candidates.length - 1];
    case 'balanced':
    default:
      // Return L3-L4 range if available, otherwise middle
      const balanced = candidates.filter(l => l >= 3 && l <= 4);
      if (balanced.length > 0) return balanced[0];
      return candidates[Math.floor(candidates.length / 2)];
  }
}
