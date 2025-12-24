import { AIService } from './AIService.js';
import chalk from 'chalk';
import fs from 'fs-extra';

/**
 * Modification types for code refinement
 */
export type ModificationType =
  | 'refactor'
  | 'optimize'
  | 'add-feature'
  | 'fix-bug'
  | 'improve-types'
  | 'add-tests'
  | 'update-styling'
  | 'add-comments'
  | 'modernize';

/**
 * Request to refine/upgrade existing code
 */
export interface CodeRefinementRequest {
  filePath: string;
  currentCode: string;
  modificationType: ModificationType;
  instructions: string;
  language: 'typescript' | 'tsx' | 'dart' | 'go';
  preserveStructure?: boolean;
}

/**
 * Result of code refinement
 */
export interface CodeRefinementResult {
  originalCode: string;
  refinedCode: string;
  changes: string[];
  explanation: string;
}

/**
 * Service for refining and upgrading AI-generated code
 */
export class CodeRefiner {
  private aiService: AIService;

  constructor(aiService: AIService) {
    this.aiService = aiService;
  }

  /**
   * Refine existing code based on instructions
   */
  async refineCode(request: CodeRefinementRequest): Promise<CodeRefinementResult> {
    console.log(chalk.blue(`Refining ${request.filePath}...`));

    const systemPrompt = this.buildSystemPrompt(request);
    const userPrompt = this.buildUserPrompt(request);

    // Get refined code from AI
    const response = await this.aiService.generateStructuredCode<{
      refinedCode: string;
      changes: string[];
      explanation: string;
    }>(userPrompt, systemPrompt);

    return {
      originalCode: request.currentCode,
      refinedCode: this.cleanCode(response.refinedCode),
      changes: response.changes,
      explanation: response.explanation,
    };
  }

  /**
   * Apply multiple refinements to a file
   */
  async applyMultipleRefinements(
    filePath: string,
    refinements: Array<{ type: ModificationType; instructions: string }>
  ): Promise<CodeRefinementResult> {
    console.log(chalk.blue(`Applying ${refinements.length} refinements to ${filePath}...`));

    let currentCode = await fs.readFile(filePath, 'utf-8');
    const language = this.detectLanguage(filePath);
    const allChanges: string[] = [];
    let explanation = '';

    for (const refinement of refinements) {
      const result = await this.refineCode({
        filePath,
        currentCode,
        modificationType: refinement.type,
        instructions: refinement.instructions,
        language,
      });

      currentCode = result.refinedCode;
      allChanges.push(...result.changes);
      explanation += result.explanation + '\n\n';
    }

    return {
      originalCode: await fs.readFile(filePath, 'utf-8'),
      refinedCode: currentCode,
      changes: allChanges,
      explanation: explanation.trim(),
    };
  }

  /**
   * Upgrade code to newer patterns/standards
   */
  async upgradeCode(filePath: string, targetVersion?: string): Promise<CodeRefinementResult> {
    const currentCode = await fs.readFile(filePath, 'utf-8');
    const language = this.detectLanguage(filePath);

    const upgradeInstructions = this.buildUpgradeInstructions(language, targetVersion);

    return this.refineCode({
      filePath,
      currentCode,
      modificationType: 'modernize',
      instructions: upgradeInstructions,
      language,
      preserveStructure: true,
    });
  }

  /**
   * Build system prompt based on modification type
   */
  private buildSystemPrompt(request: CodeRefinementRequest): string {
    const languageInstructions = this.getLanguageInstructions(request.language);

    const basePrompt = `You are an expert ${this.getLanguageName(request.language)} developer specializing in code refinement and optimization.
${languageInstructions}

Your task is to ${this.getModificationDescription(request.modificationType)}.

Important guidelines:
- Preserve the original functionality unless explicitly asked to change it
- Maintain consistent code style
- Keep existing imports unless they're unused
- Add proper comments for complex changes
- Ensure type safety and null safety
- Follow best practices and modern patterns
${request.preserveStructure ? '- Preserve the overall structure and organization' : ''}

Return response as JSON with this structure:
{
  "refinedCode": "... complete refined code ...",
  "changes": ["List of changes made"],
  "explanation": "Brief explanation of the refinements"
}`;

    return basePrompt;
  }

  /**
   * Build user prompt with code and instructions
   */
  private buildUserPrompt(request: CodeRefinementRequest): string {
    return `Please refine the following ${request.language} code:

File: ${request.filePath}
Modification Type: ${request.modificationType}

Instructions:
${request.instructions}

Current Code:
\`\`\`${request.language}
${request.currentCode}
\`\`\`

Please provide the refined code with all improvements applied.`;
  }

  /**
   * Get language-specific instructions
   */
  private getLanguageInstructions(language: string): string {
    switch (language) {
      case 'typescript':
      case 'tsx':
        return `- Use TypeScript best practices
- Ensure proper type definitions
- Follow React patterns for TSX files
- Use modern ES6+ syntax`;

      case 'dart':
        return `- Use Dart null safety
- Follow Flutter best practices
- Use modern Dart syntax
- Ensure proper widget composition`;

      case 'go':
        return `- Follow Go idioms and conventions
- Ensure proper error handling
- Use context where appropriate
- Follow effective Go patterns`;

      default:
        return '';
    }
  }

  /**
   * Get human-readable language name
   */
  private getLanguageName(language: string): string {
    const names: Record<string, string> = {
      typescript: 'TypeScript',
      tsx: 'React TypeScript',
      dart: 'Dart/Flutter',
      go: 'Go',
    };
    return names[language] || language;
  }

  /**
   * Get description for modification type
   */
  private getModificationDescription(type: ModificationType): string {
    const descriptions: Record<ModificationType, string> = {
      refactor: 'refactor the code to improve readability and maintainability',
      optimize: 'optimize the code for better performance',
      'add-feature': 'add the requested feature to the existing code',
      'fix-bug': 'fix bugs or issues in the code',
      'improve-types': 'improve type definitions and type safety',
      'add-tests': 'add comprehensive tests for the code',
      'update-styling': 'update the styling and visual design',
      'add-comments': 'add helpful comments and documentation',
      modernize: 'modernize the code to use latest patterns and standards',
    };
    return descriptions[type];
  }

  /**
   * Build upgrade instructions based on language
   */
  private buildUpgradeInstructions(language: string, targetVersion?: string): string {
    switch (language) {
      case 'typescript':
      case 'tsx':
        return `Upgrade to modern TypeScript/React patterns:
- Use React 18+ features if applicable
- Convert class components to functional components with hooks
- Use TypeScript 5+ features
- Update to modern async/await patterns
- Use optional chaining and nullish coalescing
${targetVersion ? `- Target version: ${targetVersion}` : ''}`;

      case 'dart':
        return `Upgrade to modern Dart/Flutter patterns:
- Use null safety syntax
- Update to Flutter 3+ widgets
- Use modern state management patterns
- Apply recommended lints
${targetVersion ? `- Target Dart version: ${targetVersion}` : ''}`;

      case 'go':
        return `Upgrade to modern Go patterns:
- Use Go 1.21+ features if applicable
- Use generics where appropriate
- Update error handling patterns
- Use context properly
${targetVersion ? `- Target Go version: ${targetVersion}` : ''}`;

      default:
        return 'Upgrade to modern patterns and best practices';
    }
  }

  /**
   * Detect language from file path
   */
  private detectLanguage(filePath: string): 'typescript' | 'tsx' | 'dart' | 'go' {
    if (filePath.endsWith('.tsx')) return 'tsx';
    if (filePath.endsWith('.ts')) return 'typescript';
    if (filePath.endsWith('.dart')) return 'dart';
    if (filePath.endsWith('.go')) return 'go';
    return 'typescript'; // default
  }

  /**
   * Clean code by removing markdown formatting
   */
  private cleanCode(code: string): string {
    // Remove markdown code blocks
    let cleaned = code.replace(/```(?:typescript|tsx|dart|go|javascript|ts)?\n/g, '');
    cleaned = cleaned.replace(/```\n?$/g, '');
    cleaned = cleaned.trim();
    return cleaned;
  }
}
