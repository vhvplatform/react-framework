import fs from 'fs-extra';
import path from 'path';
import { TemplateConfig, RouteConfig } from './types.js';

/**
 * Represents a single template with operations for reading and updating configuration
 */
export class Template {
  private config: TemplateConfig;
  private templatePath: string;

  constructor(templatePath: string, config: TemplateConfig) {
    this.templatePath = templatePath;
    this.config = config;
  }

  /**
   * Get template configuration
   */
  getConfig(): TemplateConfig {
    return { ...this.config };
  }

  /**
   * Get template name
   */
  getName(): string {
    return this.config.name;
  }

  /**
   * Get template description
   */
  getDescription(): string {
    return this.config.description;
  }

  /**
   * Get template version
   */
  getVersion(): string {
    return this.config.version;
  }

  /**
   * Get template path
   */
  getPath(): string {
    return this.templatePath;
  }

  /**
   * Get template source code path
   */
  getSourcePath(): string {
    return path.join(this.templatePath, 'src');
  }

  /**
   * Get template routes
   */
  getRoutes(): RouteConfig[] {
    return [...this.config.routes];
  }

  /**
   * Get template dependencies
   */
  getDependencies(): Record<string, string> {
    return { ...this.config.dependencies };
  }

  /**
   * Get template components
   */
  getComponents(): { required: string[]; optional: string[] } {
    return {
      required: [...this.config.components.required],
      optional: [...this.config.components.optional],
    };
  }

  /**
   * Update template configuration
   */
  async updateConfig(updates: Partial<TemplateConfig>): Promise<void> {
    this.config = { ...this.config, ...updates };
    const configPath = path.join(this.templatePath, 'template.config.json');
    await fs.writeJson(configPath, this.config, { spaces: 2 });
  }

  /**
   * Load template from directory
   */
  static async load(templatePath: string): Promise<Template> {
    const configPath = path.join(templatePath, 'template.config.json');

    if (!(await fs.pathExists(configPath))) {
      throw new Error(`Template configuration not found at ${configPath}`);
    }

    const config = await fs.readJson(configPath);
    return new Template(templatePath, config);
  }

  /**
   * Create a new template directory structure
   */
  static async create(templatePath: string, config: TemplateConfig): Promise<Template> {
    // Create template directory
    await fs.ensureDir(templatePath);

    // Create src directory
    await fs.ensureDir(path.join(templatePath, 'src'));

    // Write configuration
    const configPath = path.join(templatePath, 'template.config.json');
    await fs.writeJson(configPath, config, { spaces: 2 });

    return new Template(templatePath, config);
  }

  /**
   * Copy template files to a destination
   */
  async copyTo(destinationPath: string): Promise<void> {
    await fs.copy(this.templatePath, destinationPath, {
      filter: (src) => {
        // Don't copy node_modules or dist directories
        return !src.includes('node_modules') && !src.includes('dist');
      },
    });
  }
}
