/**
 * Template configuration schema for storing and managing application templates
 */
export interface TemplateConfig {
  name: string;
  description: string;
  version: string;
  source: {
    repo: string;
    branch: string;
  };
  components: {
    required: string[];
    optional: string[];
  };
  routes: RouteConfig[];
  dependencies: Record<string, string>;
  modules: string[];
  customization: {
    theme: boolean;
    layout: boolean;
    auth: boolean;
  };
}

/**
 * Route configuration for templates
 */
export interface RouteConfig {
  path: string;
  component: string;
  protected: boolean;
  layout?: string;
}

/**
 * Template metadata for listing and searching
 */
export interface TemplateMetadata {
  name: string;
  description: string;
  version: string;
  createdAt: Date;
  updatedAt: Date;
  componentCount: number;
  routeCount: number;
}

/**
 * Options for creating a template
 */
export interface CreateTemplateOptions {
  name: string;
  description: string;
  version: string;
  sourceRepo: string;
  sourceBranch: string;
}

/**
 * Options for searching templates
 */
export interface SearchTemplateOptions {
  name?: string;
  description?: string;
  tags?: string[];
}
