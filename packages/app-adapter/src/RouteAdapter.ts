import fs from 'fs-extra';
import path from 'path';
import { parse } from '@babel/parser';
import traverse from '@babel/traverse';
import { RouteInfo } from './types.js';

/**
 * Adapts routing patterns from various frameworks to the SaaS framework format
 */
export class RouteAdapter {
  /**
   * Extract routes from an application
   */
  async extractRoutes(appPath: string): Promise<RouteInfo[]> {
    const routes: RouteInfo[] = [];

    // Look for common routing files
    const routeFiles = await this.findRouteFiles(appPath);

    for (const routeFile of routeFiles) {
      const extractedRoutes = await this.analyzeRouteFile(routeFile);
      routes.push(...extractedRoutes);
    }

    return routes;
  }

  /**
   * Find potential route configuration files
   */
  private async findRouteFiles(appPath: string): Promise<string[]> {
    const potentialFiles = [
      'App.tsx',
      'App.jsx',
      'Routes.tsx',
      'Routes.jsx',
      'routes.tsx',
      'routes.jsx',
      'router.tsx',
      'router.jsx',
      'index.tsx',
      'index.jsx',
    ];

    const routeFiles: string[] = [];

    const searchDirs = [
      path.join(appPath, 'src'),
      path.join(appPath, 'src', 'routes'),
      path.join(appPath, 'src', 'router'),
      appPath,
    ];

    for (const dir of searchDirs) {
      if (await fs.pathExists(dir)) {
        for (const file of potentialFiles) {
          const filePath = path.join(dir, file);
          if (await fs.pathExists(filePath)) {
            routeFiles.push(filePath);
          }
        }
      }
    }

    return routeFiles;
  }

  /**
   * Analyze a file for React Router routes
   */
  private async analyzeRouteFile(filePath: string): Promise<RouteInfo[]> {
    try {
      const content = await fs.readFile(filePath, 'utf-8');
      const routes: RouteInfo[] = [];

      const ast = parse(content, {
        sourceType: 'module',
        plugins: ['jsx', 'typescript'],
      });

      traverse(ast, {
        JSXElement(path) {
          const openingElement = path.node.openingElement;

          // Check for <Route> elements
          if (
            openingElement.name.type === 'JSXIdentifier' &&
            openingElement.name.name === 'Route'
          ) {
            let routePath = '';
            let component = '';
            const isProtected = false;

            openingElement.attributes.forEach((attr) => {
              if (attr.type === 'JSXAttribute' && attr.name.type === 'JSXIdentifier') {
                const attrName = attr.name.name;

                if (attrName === 'path' && attr.value) {
                  if (attr.value.type === 'StringLiteral') {
                    routePath = attr.value.value;
                  }
                }

                if ((attrName === 'element' || attrName === 'component') && attr.value) {
                  if (
                    attr.value.type === 'JSXExpressionContainer' &&
                    attr.value.expression.type === 'JSXElement'
                  ) {
                    const element = attr.value.expression.openingElement;
                    if (element.name.type === 'JSXIdentifier') {
                      component = element.name.name;
                    }
                  } else if (
                    attr.value.type === 'JSXExpressionContainer' &&
                    attr.value.expression.type === 'Identifier'
                  ) {
                    component = attr.value.expression.name;
                  }
                }
              }
            });

            if (routePath && component) {
              routes.push({
                path: routePath,
                component,
                componentPath: '', // Will be resolved later
                protected: isProtected,
              });
            }
          }

          // Check for <ProtectedRoute> wrapper
          if (
            openingElement.name.type === 'JSXIdentifier' &&
            (openingElement.name.name === 'ProtectedRoute' ||
              openingElement.name.name === 'PrivateRoute')
          ) {
            // Mark nested routes as protected
            path.traverse({
              JSXElement(innerPath) {
                const innerElement = innerPath.node.openingElement;
                if (
                  innerElement.name.type === 'JSXIdentifier' &&
                  innerElement.name.name === 'Route'
                ) {
                  // This route is protected
                }
              },
            });
          }
        },
      });

      return routes;
    } catch (error) {
      console.warn(`Failed to analyze routes in ${filePath}:`, error);
      return [];
    }
  }

  /**
   * Convert routes to framework format
   */
  convertToFrameworkFormat(routes: RouteInfo[]): RouteInfo[] {
    return routes.map((route) => ({
      ...route,
      // Ensure paths start with /
      path: route.path.startsWith('/') ? route.path : `/${route.path}`,
    }));
  }
}
