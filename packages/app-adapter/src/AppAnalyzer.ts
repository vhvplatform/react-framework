import fs from 'fs-extra';
import path from 'path';
import { ComponentExtractor } from './ComponentExtractor.js';
import { RouteAdapter } from './RouteAdapter.js';
import { StateAdapter } from './StateAdapter.js';
import { DependencyResolver } from './DependencyResolver.js';
import { AppAnalysisResult, StyleSystemInfo } from './types.js';

/**
 * Analyzes React application structure and extracts metadata
 */
export class AppAnalyzer {
  private componentExtractor: ComponentExtractor;
  private routeAdapter: RouteAdapter;
  private stateAdapter: StateAdapter;
  private dependencyResolver: DependencyResolver;

  constructor() {
    this.componentExtractor = new ComponentExtractor();
    this.routeAdapter = new RouteAdapter();
    this.stateAdapter = new StateAdapter();
    this.dependencyResolver = new DependencyResolver();
  }

  /**
   * Analyze an application and return comprehensive information
   */
  async analyzeApp(appPath: string): Promise<AppAnalysisResult> {
    console.log(`Analyzing application at ${appPath}...`);

    // Extract components
    const srcPath = path.join(appPath, 'src');
    const components = await this.componentExtractor.extractComponents(srcPath);
    console.log(`Found ${components.length} components`);

    // Extract routes
    const routes = await this.routeAdapter.extractRoutes(appPath);
    console.log(`Found ${routes.length} routes`);

    // Extract dependencies
    const dependencies = await this.dependencyResolver.extractDependencies(appPath);
    console.log(`Found ${Object.keys(dependencies).length} dependencies`);

    // Detect state management
    const stateManagement = await this.stateAdapter.detectStateManagement(appPath);
    console.log(`State management: ${stateManagement.type}`);

    // Detect style system
    const styleSystem = await this.detectStyleSystem(appPath);
    console.log(`Style system: ${styleSystem.type}`);

    // Detect API endpoints
    const apiEndpoints = await this.detectApiEndpoints(appPath);
    console.log(`Found ${apiEndpoints.length} API endpoints`);

    return {
      components,
      routes,
      dependencies,
      stateManagement,
      styleSystem,
      apiEndpoints,
    };
  }

  /**
   * Detect style system used in the application
   */
  private async detectStyleSystem(appPath: string): Promise<StyleSystemInfo> {
    const configFiles: string[] = [];
    let type: StyleSystemInfo['type'] = 'plain-css';

    // Check for Tailwind
    const tailwindConfig = path.join(appPath, 'tailwind.config.js');
    const tailwindConfigTs = path.join(appPath, 'tailwind.config.ts');
    if ((await fs.pathExists(tailwindConfig)) || (await fs.pathExists(tailwindConfigTs))) {
      type = 'tailwind';
      configFiles.push((await fs.pathExists(tailwindConfig)) ? tailwindConfig : tailwindConfigTs);
    }

    // Check for CSS Modules
    const srcPath = path.join(appPath, 'src');
    if (await fs.pathExists(srcPath)) {
      const hasModuleCss = await this.hasFilesWithExtension(srcPath, '.module.css');
      const hasModuleScss = await this.hasFilesWithExtension(srcPath, '.module.scss');

      if (hasModuleCss || hasModuleScss) {
        type = type === 'tailwind' ? 'multiple' : 'css-modules';
      }
    }

    // Check package.json for styled-components or emotion
    const packageJsonPath = path.join(appPath, 'package.json');
    if (await fs.pathExists(packageJsonPath)) {
      const packageJson = await fs.readJson(packageJsonPath);
      const deps = { ...packageJson.dependencies, ...packageJson.devDependencies };

      if (deps['styled-components']) {
        type = type === 'plain-css' ? 'styled-components' : 'multiple';
      }

      if (deps['@emotion/react'] || deps['@emotion/styled']) {
        type = type === 'plain-css' ? 'emotion' : 'multiple';
      }
    }

    return {
      type,
      configFiles,
    };
  }

  /**
   * Detect API endpoints in the application
   */
  private async detectApiEndpoints(appPath: string): Promise<string[]> {
    const endpoints: string[] = [];
    const srcPath = path.join(appPath, 'src');

    if (!(await fs.pathExists(srcPath))) {
      return endpoints;
    }

    // Look for API configuration files
    const apiFiles = [
      path.join(srcPath, 'api', 'index.ts'),
      path.join(srcPath, 'api', 'client.ts'),
      path.join(srcPath, 'services', 'api.ts'),
      path.join(srcPath, 'lib', 'api.ts'),
      path.join(srcPath, 'utils', 'api.ts'),
    ];

    for (const file of apiFiles) {
      if (await fs.pathExists(file)) {
        const content = await fs.readFile(file, 'utf-8');

        // Extract API base URLs
        const urlMatches = content.match(/https?:\/\/[^\s'"]+/g);
        if (urlMatches) {
          endpoints.push(...urlMatches);
        }
      }
    }

    return [...new Set(endpoints)]; // Remove duplicates
  }

  /**
   * Check if directory contains files with specific extension
   */
  private async hasFilesWithExtension(dirPath: string, extension: string): Promise<boolean> {
    const entries = await fs.readdir(dirPath, { withFileTypes: true });

    for (const entry of entries) {
      const fullPath = path.join(dirPath, entry.name);

      if (entry.isDirectory() && !['node_modules', 'dist', 'build'].includes(entry.name)) {
        if (await this.hasFilesWithExtension(fullPath, extension)) {
          return true;
        }
      } else if (entry.isFile() && entry.name.endsWith(extension)) {
        return true;
      }
    }

    return false;
  }
}
