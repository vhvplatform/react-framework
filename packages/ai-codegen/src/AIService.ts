import OpenAI from 'openai';
import { AIConfig } from './types.js';

/**
 * AI service for code generation supporting multiple providers
 */
export class AIService {
  private provider: 'openai' | 'github-copilot' | 'gemini';
  private openaiClient?: OpenAI;
  private model: string;
  private temperature: number;
  private maxTokens: number;
  private apiKey: string;

  constructor(config: AIConfig) {
    this.provider = config.provider;
    this.apiKey = config.apiKey;
    this.temperature = config.temperature ?? 0.7;
    this.maxTokens = config.maxTokens ?? 4000;

    // Initialize provider-specific clients and models
    switch (this.provider) {
      case 'openai':
        this.openaiClient = new OpenAI({
          apiKey: config.apiKey,
        });
        this.model = config.model || 'gpt-4-turbo-preview';
        break;

      case 'github-copilot':
        // GitHub Copilot uses OpenAI-compatible API
        this.openaiClient = new OpenAI({
          apiKey: config.githubToken || config.apiKey,
          baseURL: 'https://api.githubcopilot.com',
        });
        this.model = config.model || 'gpt-4';
        break;

      case 'gemini':
        // Gemini will use REST API
        this.model = config.model || 'gemini-pro';
        break;

      default:
        throw new Error(`Unsupported provider: ${config.provider}`);
    }
  }

  /**
   * Generate code based on prompt
   */
  async generateCode(prompt: string, systemPrompt?: string): Promise<string> {
    switch (this.provider) {
      case 'openai':
      case 'github-copilot':
        return this.generateWithOpenAI(prompt, systemPrompt);

      case 'gemini':
        return this.generateWithGemini(prompt, systemPrompt);

      default:
        throw new Error(`Unsupported provider: ${this.provider}`);
    }
  }

  /**
   * Generate code with JSON response format
   */
  async generateStructuredCode<T>(
    prompt: string,
    systemPrompt: string,
    _schema?: any
  ): Promise<T> {
    switch (this.provider) {
      case 'openai':
      case 'github-copilot':
        return this.generateStructuredWithOpenAI<T>(prompt, systemPrompt);

      case 'gemini':
        return this.generateStructuredWithGemini<T>(prompt, systemPrompt);

      default:
        throw new Error(`Unsupported provider: ${this.provider}`);
    }
  }

  /**
   * Generate code using OpenAI or GitHub Copilot API
   */
  private async generateWithOpenAI(prompt: string, systemPrompt?: string): Promise<string> {
    if (!this.openaiClient) {
      throw new Error('OpenAI client not initialized');
    }

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

    const completion = await this.openaiClient.chat.completions.create({
      model: this.model,
      messages,
      temperature: this.temperature,
      max_tokens: this.maxTokens,
    });

    return completion.choices[0]?.message?.content || '';
  }

  /**
   * Generate structured code using OpenAI or GitHub Copilot API
   */
  private async generateStructuredWithOpenAI<T>(
    prompt: string,
    systemPrompt: string
  ): Promise<T> {
    if (!this.openaiClient) {
      throw new Error('OpenAI client not initialized');
    }

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

    const completion = await this.openaiClient.chat.completions.create({
      model: this.model,
      messages,
      temperature: this.temperature,
      max_tokens: this.maxTokens,
      response_format: { type: 'json_object' },
    });

    const content = completion.choices[0]?.message?.content || '{}';
    return JSON.parse(content) as T;
  }

  /**
   * Generate code using Google Gemini API
   */
  private async generateWithGemini(prompt: string, systemPrompt?: string): Promise<string> {
    const fullPrompt = systemPrompt ? `${systemPrompt}\n\n${prompt}` : prompt;

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${this.model}:generateContent?key=${this.apiKey}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: fullPrompt,
                },
              ],
            },
          ],
          generationConfig: {
            temperature: this.temperature,
            maxOutputTokens: this.maxTokens,
          },
        }),
      }
    );

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Gemini API error: ${error}`);
    }

    const data = await response.json();
    return data.candidates?.[0]?.content?.parts?.[0]?.text || '';
  }

  /**
   * Generate structured code using Google Gemini API
   */
  private async generateStructuredWithGemini<T>(
    prompt: string,
    systemPrompt: string
  ): Promise<T> {
    const fullPrompt = `${systemPrompt}\n\n${prompt}\n\nIMPORTANT: Respond with valid JSON only, no markdown formatting.`;

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${this.model}:generateContent?key=${this.apiKey}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: fullPrompt,
                },
              ],
            },
          ],
          generationConfig: {
            temperature: this.temperature,
            maxOutputTokens: this.maxTokens,
          },
        }),
      }
    );

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Gemini API error: ${error}`);
    }

    const data = await response.json();
    const content = data.candidates?.[0]?.content?.parts?.[0]?.text || '{}';

    // Clean up markdown formatting if present
    const cleanContent = content.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();

    return JSON.parse(cleanContent) as T;
  }
}
