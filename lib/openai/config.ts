/**
 * OpenAI configuration
 * These values can be overridden via environment variables
 */

export const OPENAI_CONFIG = {
  model: process.env.OPENAI_MODEL || 'gpt-4o',
  maxTokens: parseInt(process.env.OPENAI_MAX_TOKENS || '2000', 10),
  temperature: parseFloat(process.env.OPENAI_TEMPERATURE || '0.7'),
} as const
