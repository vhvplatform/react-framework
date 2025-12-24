import { TemplateConfig, RouteConfig } from './types.js';
/**
 * Represents a single template with operations for reading and updating configuration
 */
export declare class Template {
  private config;
  private templatePath;
  constructor(templatePath: string, config: TemplateConfig);
  /**
   * Get template configuration
   */
  getConfig(): TemplateConfig;
  /**
   * Get template name
   */
  getName(): string;
  /**
   * Get template description
   */
  getDescription(): string;
  /**
   * Get template version
   */
  getVersion(): string;
  /**
   * Get template path
   */
  getPath(): string;
  /**
   * Get template source code path
   */
  getSourcePath(): string;
  /**
   * Get template routes
   */
  getRoutes(): RouteConfig[];
  /**
   * Get template dependencies
   */
  getDependencies(): Record<string, string>;
  /**
   * Get template components
   */
  getComponents(): {
    required: string[];
    optional: string[];
  };
  /**
   * Update template configuration
   */
  updateConfig(updates: Partial<TemplateConfig>): Promise<void>;
  /**
   * Load template from directory
   */
  static load(templatePath: string): Promise<Template>;
  /**
   * Create a new template directory structure
   */
  static create(templatePath: string, config: TemplateConfig): Promise<Template>;
  /**
   * Copy template files to a destination
   */
  copyTo(destinationPath: string): Promise<void>;
}
//# sourceMappingURL=Template.d.ts.map
