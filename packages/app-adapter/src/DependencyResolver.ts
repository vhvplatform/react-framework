import fs from 'fs-extra';
import path from 'path';

/**
 * Resolves and merges dependencies from imported apps with framework dependencies
 */
export class DependencyResolver {
  /**
   * Extract dependencies from package.json
   */
  async extractDependencies(appPath: string): Promise<Record<string, string>> {
    const packageJsonPath = path.join(appPath, 'package.json');

    if (!(await fs.pathExists(packageJsonPath))) {
      return {};
    }

    const packageJson = await fs.readJson(packageJsonPath);

    return {
      ...(packageJson.dependencies || {}),
      ...(packageJson.devDependencies || {}),
    };
  }

  /**
   * Merge app dependencies with framework dependencies
   * Resolves conflicts by preferring newer versions
   */
  mergeDependencies(
    appDeps: Record<string, string>,
    frameworkDeps: Record<string, string>
  ): Record<string, string> {
    const merged: Record<string, string> = { ...frameworkDeps };

    for (const [pkg, version] of Object.entries(appDeps)) {
      if (merged[pkg]) {
        // Resolve version conflict
        merged[pkg] = this.resolveVersionConflict(pkg, version, merged[pkg]);
      } else {
        merged[pkg] = version;
      }
    }

    return merged;
  }

  /**
   * Resolve version conflict between two versions
   * Prefers the newer version
   */
  private resolveVersionConflict(_pkg: string, version1: string, version2: string): string {
    // Remove ^ and ~ prefixes for comparison
    const clean1 = version1.replace(/^[\^~]/, '');
    const clean2 = version2.replace(/^[\^~]/, '');

    // Compare semantic versions
    const parts1 = clean1.split('.').map((p) => parseInt(p, 10) || 0);
    const parts2 = clean2.split('.').map((p) => parseInt(p, 10) || 0);

    for (let i = 0; i < Math.max(parts1.length, parts2.length); i++) {
      const p1 = parts1[i] || 0;
      const p2 = parts2[i] || 0;

      if (p1 > p2) {
        return version1;
      } else if (p2 > p1) {
        return version2;
      }
    }

    // Versions are equal, prefer the first one
    return version1;
  }

  /**
   * Filter out framework-provided dependencies
   */
  filterFrameworkDependencies(
    appDeps: Record<string, string>,
    frameworkPackages: string[]
  ): Record<string, string> {
    const filtered: Record<string, string> = {};

    for (const [pkg, version] of Object.entries(appDeps)) {
      if (!frameworkPackages.includes(pkg)) {
        filtered[pkg] = version;
      }
    }

    return filtered;
  }

  /**
   * Get critical app-specific packages that should be preserved
   */
  getCriticalPackages(deps: Record<string, string>): Record<string, string> {
    const critical: Record<string, string> = {};

    // Packages that are likely app-specific and should be preserved
    const criticalPatterns = [
      '@radix-ui',
      'recharts',
      'react-hook-form',
      'zod',
      'lucide-react',
      'date-fns',
      'clsx',
      'tailwind-merge',
    ];

    for (const [pkg, version] of Object.entries(deps)) {
      for (const pattern of criticalPatterns) {
        if (pkg.includes(pattern)) {
          critical[pkg] = version;
          break;
        }
      }
    }

    return critical;
  }
}
