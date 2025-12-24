import fs from 'fs-extra';
import path from 'path';
import { Template } from './Template.js';
import { TemplateConfig, TemplateMetadata, SearchTemplateOptions } from './types.js';

/**
 * Registry for managing templates in the templates directory
 */
export class TemplateRegistry {
  private templatesDir: string;
  private templates: Map<string, Template>;

  constructor(templatesDir: string) {
    this.templatesDir = templatesDir;
    this.templates = new Map();
  }

  /**
   * Initialize the registry and load all templates
   */
  async initialize(): Promise<void> {
    await fs.ensureDir(this.templatesDir);
    await this.loadTemplates();
  }

  /**
   * Load all templates from the templates directory
   */
  private async loadTemplates(): Promise<void> {
    this.templates.clear();

    const entries = await fs.readdir(this.templatesDir, { withFileTypes: true });

    for (const entry of entries) {
      if (entry.isDirectory()) {
        const templatePath = path.join(this.templatesDir, entry.name);
        const configPath = path.join(templatePath, 'template.config.json');

        if (await fs.pathExists(configPath)) {
          try {
            const template = await Template.load(templatePath);
            this.templates.set(template.getName(), template);
          } catch (error) {
            console.warn(`Failed to load template from ${templatePath}:`, error);
          }
        }
      }
    }
  }

  /**
   * Get a template by name
   */
  async getTemplate(name: string): Promise<Template | null> {
    return this.templates.get(name) || null;
  }

  /**
   * Check if a template exists
   */
  hasTemplate(name: string): boolean {
    return this.templates.has(name);
  }

  /**
   * List all templates
   */
  listTemplates(): Template[] {
    return Array.from(this.templates.values());
  }

  /**
   * Get template metadata for all templates
   */
  async listTemplateMetadata(): Promise<TemplateMetadata[]> {
    const metadata: TemplateMetadata[] = [];

    for (const template of this.templates.values()) {
      const config = template.getConfig();
      const templatePath = template.getPath();
      const stats = await fs.stat(templatePath);

      metadata.push({
        name: config.name,
        description: config.description,
        version: config.version,
        createdAt: stats.birthtime,
        updatedAt: stats.mtime,
        componentCount: config.components.required.length + config.components.optional.length,
        routeCount: config.routes.length,
      });
    }

    return metadata;
  }

  /**
   * Search templates by criteria
   */
  searchTemplates(options: SearchTemplateOptions): Template[] {
    const templates = this.listTemplates();

    return templates.filter((template) => {
      const config = template.getConfig();

      if (options.name && !config.name.toLowerCase().includes(options.name.toLowerCase())) {
        return false;
      }

      if (
        options.description &&
        !config.description.toLowerCase().includes(options.description.toLowerCase())
      ) {
        return false;
      }

      return true;
    });
  }

  /**
   * Register a new template
   */
  async registerTemplate(name: string, config: TemplateConfig): Promise<Template> {
    if (this.templates.has(name)) {
      throw new Error(`Template ${name} already exists`);
    }

    const templatePath = path.join(this.templatesDir, name);
    const template = await Template.create(templatePath, config);
    this.templates.set(name, template);

    return template;
  }

  /**
   * Remove a template
   */
  async removeTemplate(name: string): Promise<void> {
    const template = this.templates.get(name);

    if (!template) {
      throw new Error(`Template ${name} not found`);
    }

    // Remove from registry
    this.templates.delete(name);

    // Remove directory
    await fs.remove(template.getPath());
  }

  /**
   * Get the templates directory path
   */
  getTemplatesDir(): string {
    return this.templatesDir;
  }

  /**
   * Get default templates directory
   */
  static getDefaultTemplatesDir(): string {
    // Use environment variable if set, otherwise use default location
    return process.env.SAAS_TEMPLATES_DIR || path.join(process.cwd(), 'templates');
  }
}
