import { z } from 'zod';

/**
 * Supported code generation targets
 */
export type CodegenTarget =
  | 'react-component'
  | 'react-page'
  | 'go-api'
  | 'flutter-widget'
  | 'flutter-screen'
  | 'full-stack'
  | 'full-stack-flutter';

/**
 * Code generation request
 */
export interface CodegenRequest {
  target: CodegenTarget;
  description: string;
  componentName?: string;
  features?: string[];
  styling?: 'tailwind' | 'css-modules' | 'styled-components';
  stateManagement?: 'useState' | 'redux' | 'zustand' | 'provider' | 'bloc' | 'riverpod';
  apiEndpoints?: ApiEndpointSpec[];
  flutterStateManagement?: 'provider' | 'bloc' | 'riverpod' | 'getx';
}

/**
 * API endpoint specification
 */
export interface ApiEndpointSpec {
  method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
  path: string;
  description: string;
  requestBody?: Record<string, any>;
  responseBody?: Record<string, any>;
}

/**
 * Generated code output
 */
export interface CodegenResult {
  target: CodegenTarget;
  files: GeneratedFile[];
  instructions: string;
  goApiSpec?: GoApiSpec;
}

/**
 * Generated file
 */
export interface GeneratedFile {
  path: string;
  content: string;
  language: 'typescript' | 'tsx' | 'go' | 'json' | 'dart';
}

/**
 * Go API specification for backend generation
 */
export interface GoApiSpec {
  packageName: string;
  endpoints: GoEndpoint[];
  models: GoModel[];
}

/**
 * Go endpoint definition
 */
export interface GoEndpoint {
  method: string;
  path: string;
  handler: string;
  description: string;
  requestType?: string;
  responseType?: string;
}

/**
 * Go model/struct definition
 */
export interface GoModel {
  name: string;
  fields: GoField[];
}

/**
 * Go field definition
 */
export interface GoField {
  name: string;
  type: string;
  jsonTag: string;
  validation?: string;
}

/**
 * AI provider configuration
 */
export interface AIConfig {
  provider: 'openai' | 'anthropic';
  apiKey: string;
  model?: string;
  temperature?: number;
  maxTokens?: number;
}

/**
 * Validation schemas
 */
export const CodegenRequestSchema = z.object({
  target: z.enum([
    'react-component',
    'react-page',
    'go-api',
    'flutter-widget',
    'flutter-screen',
    'full-stack',
    'full-stack-flutter',
  ]),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  componentName: z.string().optional(),
  features: z.array(z.string()).optional(),
  styling: z.enum(['tailwind', 'css-modules', 'styled-components']).optional(),
  stateManagement: z
    .enum(['useState', 'redux', 'zustand', 'provider', 'bloc', 'riverpod'])
    .optional(),
  apiEndpoints: z
    .array(
      z.object({
        method: z.enum(['GET', 'POST', 'PUT', 'PATCH', 'DELETE']),
        path: z.string(),
        description: z.string(),
        requestBody: z.record(z.any()).optional(),
        responseBody: z.record(z.any()).optional(),
      })
    )
    .optional(),
  flutterStateManagement: z.enum(['provider', 'bloc', 'riverpod', 'getx']).optional(),
});
