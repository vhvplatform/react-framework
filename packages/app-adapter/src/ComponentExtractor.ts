import fs from 'fs-extra';
import path from 'path';
import { parse } from '@babel/parser';
import traverse from '@babel/traverse';
import { ComponentInfo, ImportInfo } from './types.js';

/**
 * Extracts and analyzes React components from source files
 */
export class ComponentExtractor {
  /**
   * Extract components from a directory
   */
  async extractComponents(dirPath: string): Promise<ComponentInfo[]> {
    const components: ComponentInfo[] = [];

    await this.traverseDirectory(dirPath, async (filePath) => {
      if (this.isComponentFile(filePath)) {
        const component = await this.analyzeComponentFile(filePath);
        if (component) {
          components.push(...component);
        }
      }
    });

    return components;
  }

  /**
   * Check if file is likely a component file
   */
  private isComponentFile(filePath: string): boolean {
    const ext = path.extname(filePath);
    return ['.tsx', '.jsx', '.ts', '.js'].includes(ext);
  }

  /**
   * Analyze a component file and extract information
   */
  private async analyzeComponentFile(filePath: string): Promise<ComponentInfo[] | null> {
    try {
      const content = await fs.readFile(filePath, 'utf-8');
      const components: ComponentInfo[] = [];

      const ast = parse(content, {
        sourceType: 'module',
        plugins: ['jsx', 'typescript'],
      });

      let hasState = false;
      let hasEffects = false;
      const imports: ImportInfo[] = [];
      const exports: string[] = [];

      traverse(ast, {
        ImportDeclaration(path) {
          const source = path.node.source.value;
          const specifiers: string[] = [];

          path.node.specifiers.forEach((spec) => {
            if (spec.type === 'ImportDefaultSpecifier') {
              specifiers.push(spec.local.name);
            } else if (spec.type === 'ImportSpecifier') {
              specifiers.push(spec.imported.type === 'Identifier' ? spec.imported.name : '');
            }
          });

          imports.push({
            source,
            specifiers,
            isDefault: path.node.specifiers.some((s) => s.type === 'ImportDefaultSpecifier'),
          });
        },

        CallExpression(path) {
          const callee = path.node.callee;
          if (callee.type === 'Identifier') {
            if (callee.name === 'useState' || callee.name === 'useReducer') {
              hasState = true;
            }
            if (callee.name === 'useEffect' || callee.name === 'useLayoutEffect') {
              hasEffects = true;
            }
          }
        },

        ExportNamedDeclaration(path) {
          if (path.node.declaration) {
            if (path.node.declaration.type === 'FunctionDeclaration' && path.node.declaration.id) {
              exports.push(path.node.declaration.id.name);
            } else if (path.node.declaration.type === 'VariableDeclaration') {
              path.node.declaration.declarations.forEach((decl) => {
                if (decl.id.type === 'Identifier') {
                  exports.push(decl.id.name);
                }
              });
            }
          }
        },

        ExportDefaultDeclaration(path) {
          if (path.node.declaration.type === 'Identifier') {
            exports.push(path.node.declaration.name);
          } else if (
            path.node.declaration.type === 'FunctionDeclaration' &&
            path.node.declaration.id
          ) {
            exports.push(path.node.declaration.id.name);
          }
        },
      });

      // If file has exports and React imports, consider it a component
      const hasReactImport = imports.some((imp) => imp.source === 'react');

      if (exports.length > 0 && hasReactImport) {
        exports.forEach((exportName) => {
          components.push({
            name: exportName,
            filePath: filePath,
            exports: [exportName],
            imports,
            hasState,
            hasEffects,
          });
        });
      }

      return components.length > 0 ? components : null;
    } catch (error) {
      console.warn(`Failed to analyze ${filePath}:`, error);
      return null;
    }
  }

  /**
   * Traverse directory recursively
   */
  private async traverseDirectory(
    dirPath: string,
    callback: (filePath: string) => Promise<void>
  ): Promise<void> {
    const entries = await fs.readdir(dirPath, { withFileTypes: true });

    for (const entry of entries) {
      const fullPath = path.join(dirPath, entry.name);

      // Skip node_modules, dist, build directories
      if (entry.isDirectory()) {
        if (!['node_modules', 'dist', 'build', '.git'].includes(entry.name)) {
          await this.traverseDirectory(fullPath, callback);
        }
      } else {
        await callback(fullPath);
      }
    }
  }
}
