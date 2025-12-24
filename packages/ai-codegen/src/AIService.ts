import OpenAI from 'openai';
import { AIConfig } from './types.js';

/**
 * AI service for code generation using OpenAI
 */
export class AIService {
  private client: OpenAI;
  private model: string;
  private temperature: number;
  private maxTokens: number;

  constructor(config: AIConfig) {
    if (config.provider !== 'openai') {
      throw new Error('Currently only OpenAI provider is supported');
    }

    this.client = new OpenAI({
      apiKey: config.apiKey,
    });

    this.model = config.model || 'gpt-4-turbo-preview';
    this.temperature = config.temperature ?? 0.7;
    this.maxTokens = config.maxTokens ?? 4000;
  }

  /**
   * Generate code based on prompt
   */
  async generateCode(prompt: string, systemPrompt?: string): Promise<string> {
    const messages: OpenAI.Chat.ChatCompletionMessageParam[] = [];

    if (systemPrompt) {
      messages.push({
        role: 'system',
        content: systemPrompt,
      });
    }

    messages.push({
      role: 'user',
      content: prompt,
    });

    const completion = await this.client.chat.completions.create({
      model: this.model,
      messages,
      temperature: this.temperature,
      max_tokens: this.maxTokens,
    });

    return completion.choices[0]?.message?.content || '';
  }

  /**
   * Generate code with JSON response format
   */
  async generateStructuredCode<T>(prompt: string, systemPrompt: string, _schema?: any): Promise<T> {
    const messages: OpenAI.Chat.ChatCompletionMessageParam[] = [
      {
        role: 'system',
        content: systemPrompt,
      },
      {
        role: 'user',
        content: prompt,
      },
    ];

    const completion = await this.client.chat.completions.create({
      model: this.model,
      messages,
      temperature: this.temperature,
      max_tokens: this.maxTokens,
      response_format: { type: 'json_object' },
    });

    const content = completion.choices[0]?.message?.content || '{}';
    return JSON.parse(content) as T;
  }
}
