import fs from 'fs-extra';
import path from 'path';
import { StateManagementInfo } from './types.js';

/**
 * Detects state management patterns in React applications
 */
export class StateAdapter {
  /**
   * Detect state management library used in the application
   */
  async detectStateManagement(appPath: string): Promise<StateManagementInfo> {
    const packageJsonPath = path.join(appPath, 'package.json');

    if (!(await fs.pathExists(packageJsonPath))) {
      return {
        type: 'none',
        libraries: [],
        storeFiles: [],
      };
    }

    const packageJson = await fs.readJson(packageJsonPath);
    const dependencies = {
      ...packageJson.dependencies,
      ...packageJson.devDependencies,
    };

    const libraries: string[] = [];
    const storeFiles: string[] = [];

    // Check for Redux
    if (dependencies['@reduxjs/toolkit'] || dependencies['redux']) {
      libraries.push('redux');
      storeFiles.push(...(await this.findStoreFiles(appPath, 'redux')));
    }

    // Check for Zustand
    if (dependencies['zustand']) {
      libraries.push('zustand');
      storeFiles.push(...(await this.findStoreFiles(appPath, 'zustand')));
    }

    // Check for Context API usage
    const hasContext = await this.hasContextAPIUsage(appPath);
    if (hasContext) {
      libraries.push('context');
    }

    // Determine type
    let type: StateManagementInfo['type'] = 'none';
    if (libraries.length === 0) {
      type = 'none';
    } else if (libraries.length === 1) {
      type = libraries[0] as StateManagementInfo['type'];
    } else {
      type = 'multiple';
    }

    return {
      type,
      libraries,
      storeFiles,
    };
  }

  /**
   * Find store configuration files
   */
  private async findStoreFiles(appPath: string, _library: string): Promise<string[]> {
    const storeFiles: string[] = [];

    // Support multiple source directory structures
    const possibleSourceDirs = ['src', 'app', 'source', 'client'];
    const searchPaths: string[] = [];

    for (const sourceDir of possibleSourceDirs) {
      const sourcePath = path.join(appPath, sourceDir);
      if (await fs.pathExists(sourcePath)) {
        searchPaths.push(
          path.join(sourcePath, 'store'),
          path.join(sourcePath, 'redux'),
          path.join(sourcePath, 'state'),
          path.join(sourcePath, 'stores')
        );
      }
    }

    for (const searchPath of searchPaths) {
      if (await fs.pathExists(searchPath)) {
        const files = await this.findFilesRecursive(searchPath);
        storeFiles.push(...files);
      }
    }

    return storeFiles;
  }

  /**
   * Check if application uses Context API
   */
  private async hasContextAPIUsage(appPath: string): Promise<boolean> {
    // Check in multiple possible source directories
    const possibleSourceDirs = ['src', 'app', 'source', 'client'];

    for (const sourceDir of possibleSourceDirs) {
      const srcPath = path.join(appPath, sourceDir);

      if (!(await fs.pathExists(srcPath))) {
        continue;
      }

      const files = await this.findFilesRecursive(srcPath);

      for (const file of files) {
        if (
          file.endsWith('.tsx') ||
          file.endsWith('.jsx') ||
          file.endsWith('.ts') ||
          file.endsWith('.js')
        ) {
          const content = await fs.readFile(file, 'utf-8');
          if (content.includes('createContext') || content.includes('useContext')) {
            return true;
          }
        }
      }
    }

    return false;
  }

  /**
   * Find files recursively
   */
  private async findFilesRecursive(dirPath: string): Promise<string[]> {
    const files: string[] = [];
    const entries = await fs.readdir(dirPath, { withFileTypes: true });

    for (const entry of entries) {
      const fullPath = path.join(dirPath, entry.name);

      if (entry.isDirectory() && !['node_modules', 'dist', 'build', '.git'].includes(entry.name)) {
        files.push(...(await this.findFilesRecursive(fullPath)));
      } else if (entry.isFile()) {
        files.push(fullPath);
      }
    }

    return files;
  }
}
