import { Template } from './Template.js';
import { TemplateConfig, TemplateMetadata, SearchTemplateOptions } from './types.js';
/**
 * Registry for managing templates in the templates directory
 */
export declare class TemplateRegistry {
  private templatesDir;
  private templates;
  constructor(templatesDir: string);
  /**
   * Initialize the registry and load all templates
   */
  initialize(): Promise<void>;
  /**
   * Load all templates from the templates directory
   */
  private loadTemplates;
  /**
   * Get a template by name
   */
  getTemplate(name: string): Promise<Template | null>;
  /**
   * Check if a template exists
   */
  hasTemplate(name: string): boolean;
  /**
   * List all templates
   */
  listTemplates(): Template[];
  /**
   * Get template metadata for all templates
   */
  listTemplateMetadata(): Promise<TemplateMetadata[]>;
  /**
   * Search templates by criteria
   */
  searchTemplates(options: SearchTemplateOptions): Template[];
  /**
   * Register a new template
   */
  registerTemplate(name: string, config: TemplateConfig): Promise<Template>;
  /**
   * Remove a template
   */
  removeTemplate(name: string): Promise<void>;
  /**
   * Get the templates directory path
   */
  getTemplatesDir(): string;
  /**
   * Get default templates directory
   */
  static getDefaultTemplatesDir(): string;
}
//# sourceMappingURL=TemplateRegistry.d.ts.map
