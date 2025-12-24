/**
 * Result of analyzing an application
 */
export interface AppAnalysisResult {
  components: ComponentInfo[];
  routes: RouteInfo[];
  dependencies: Record<string, string>;
  stateManagement: StateManagementInfo;
  styleSystem: StyleSystemInfo;
  apiEndpoints: string[];
}

/**
 * Common source directory names across different React project structures
 */
export const POSSIBLE_SOURCE_DIRS = ['src', 'app', 'source', 'client'] as const;

/**
 * Information about a detected component
 */
export interface ComponentInfo {
  name: string;
  filePath: string;
  exports: string[];
  imports: ImportInfo[];
  hasState: boolean;
  hasEffects: boolean;
  props?: PropInfo[];
}

/**
 * Import information
 */
export interface ImportInfo {
  source: string;
  specifiers: string[];
  isDefault: boolean;
}

/**
 * Props information
 */
export interface PropInfo {
  name: string;
  type?: string;
  required: boolean;
}

/**
 * Route information
 */
export interface RouteInfo {
  path: string;
  component: string;
  componentPath: string;
  protected: boolean;
  layout?: string;
}

/**
 * State management detection result
 */
export interface StateManagementInfo {
  type: 'redux' | 'zustand' | 'context' | 'none' | 'multiple';
  libraries: string[];
  storeFiles: string[];
}

/**
 * Style system detection result
 */
export interface StyleSystemInfo {
  type: 'tailwind' | 'css-modules' | 'styled-components' | 'emotion' | 'plain-css' | 'multiple';
  configFiles: string[];
}

/**
 * Options for importing an app
 */
export interface ImportAppOptions {
  repoUrl: string;
  templateName: string;
  targetDir: string;
  branch?: string;
}

/**
 * Options for adapting an app
 */
export interface AdaptAppOptions {
  appPath: string;
  outputPath: string;
  templateName: string;
}
