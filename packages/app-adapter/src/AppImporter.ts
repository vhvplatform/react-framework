import simpleGit from 'simple-git';
import fs from 'fs-extra';
import path from 'path';
import chalk from 'chalk';
import { AppAnalyzer } from './AppAnalyzer.js';
import { TemplateConfig } from '@longvhv/templates';
import { ImportAppOptions } from './types.js';

/**
 * Imports applications from Git repositories and converts them to templates
 */
export class AppImporter {
  private analyzer: AppAnalyzer;

  constructor() {
    this.analyzer = new AppAnalyzer();
  }

  /**
   * Import an application from a Git repository
   */
  async importFromGit(options: ImportAppOptions): Promise<TemplateConfig> {
    const { repoUrl, templateName, targetDir, branch = 'main' } = options;

    console.log(chalk.blue(`Cloning repository ${repoUrl}...`));

    // Create temporary directory for cloning
    const tempDir = path.join(targetDir, '.tmp', templateName);
    await fs.ensureDir(tempDir);

    try {
      // Clone repository
      const git = simpleGit();
      await git.clone(repoUrl, tempDir, ['--depth', '1', '--branch', branch]);

      console.log(chalk.green('Repository cloned successfully'));

      // Analyze the application
      const analysis = await this.analyzer.analyzeApp(tempDir);

      // Generate template configuration
      const templateConfig: TemplateConfig = {
        name: templateName,
        description: `Imported from ${repoUrl}`,
        version: '1.0.0',
        source: {
          repo: repoUrl,
          branch,
        },
        components: {
          required: analysis.components
            .filter((c) => c.hasState || c.hasEffects)
            .map((c) => c.name),
          optional: analysis.components
            .filter((c) => !c.hasState && !c.hasEffects)
            .map((c) => c.name),
        },
        routes: analysis.routes.map((r) => ({
          path: r.path,
          component: r.component,
          protected: r.protected,
          layout: r.layout,
        })),
        dependencies: analysis.dependencies,
        modules: [],
        customization: {
          theme: analysis.styleSystem.type === 'tailwind',
          layout: true,
          auth: analysis.routes.some((r) => r.protected),
        },
      };

      // Copy source files to template directory
      const templateDir = path.join(targetDir, templateName);
      await fs.ensureDir(templateDir);

      // Detect and copy source directory - support different structures
      const possibleSourceDirs = ['src', 'app', 'source', 'client'];
      let sourceDirCopied = false;

      for (const sourceDir of possibleSourceDirs) {
        const sourcePath = path.join(tempDir, sourceDir);
        if (await fs.pathExists(sourcePath)) {
          await fs.copy(sourcePath, path.join(templateDir, 'src'));
          console.log(chalk.gray(`Copied source files from /${sourceDir}`));
          sourceDirCopied = true;
          break;
        }
      }

      if (!sourceDirCopied) {
        throw new Error(
          'Could not find source directory. Expected one of: src, app, source, client'
        );
      }

      // Copy configuration files - support multiple build tools and frameworks
      const configFiles = [
        // Tailwind & PostCSS
        'tailwind.config.js',
        'tailwind.config.ts',
        'tailwind.config.cjs',
        'tailwind.config.mjs',
        'postcss.config.js',
        'postcss.config.cjs',
        // TypeScript
        'tsconfig.json',
        // Vite
        'vite.config.ts',
        'vite.config.js',
        'vite.config.mjs',
        // Webpack
        'webpack.config.js',
        'webpack.config.ts',
        // Next.js
        'next.config.js',
        'next.config.mjs',
        // Create React App
        'craco.config.js',
        // ESLint & Prettier (useful for maintaining code style)
        '.eslintrc.js',
        '.eslintrc.json',
        '.prettierrc',
        '.prettierrc.json',
      ];

      for (const file of configFiles) {
        const sourcePath = path.join(tempDir, file);
        if (await fs.pathExists(sourcePath)) {
          await fs.copy(sourcePath, path.join(templateDir, file));
        }
      }

      // Write template configuration
      await fs.writeJson(path.join(templateDir, 'template.config.json'), templateConfig, {
        spaces: 2,
      });

      console.log(chalk.green(`Template created successfully at ${templateDir}`));

      // Clean up temporary directory
      await fs.remove(tempDir);

      return templateConfig;
    } catch (error) {
      // Clean up on error
      await fs.remove(tempDir);
      throw error;
    }
  }

  /**
   * Import from local directory
   */
  async importFromLocal(
    appPath: string,
    templateName: string,
    targetDir: string
  ): Promise<TemplateConfig> {
    console.log(chalk.blue(`Importing from ${appPath}...`));

    // Analyze the application
    const analysis = await this.analyzer.analyzeApp(appPath);

    // Generate template configuration
    const templateConfig: TemplateConfig = {
      name: templateName,
      description: `Imported from ${appPath}`,
      version: '1.0.0',
      source: {
        repo: 'local',
        branch: 'main',
      },
      components: {
        required: analysis.components.filter((c) => c.hasState || c.hasEffects).map((c) => c.name),
        optional: analysis.components
          .filter((c) => !c.hasState && !c.hasEffects)
          .map((c) => c.name),
      },
      routes: analysis.routes.map((r) => ({
        path: r.path,
        component: r.component,
        protected: r.protected,
        layout: r.layout,
      })),
      dependencies: analysis.dependencies,
      modules: [],
      customization: {
        theme: analysis.styleSystem.type === 'tailwind',
        layout: true,
        auth: analysis.routes.some((r) => r.protected),
      },
    };

    // Copy source files to template directory
    const templateDir = path.join(targetDir, templateName);
    await fs.ensureDir(templateDir);

    // Detect and copy source directory - support different structures
    const possibleSourceDirs = ['src', 'app', 'source', 'client'];
    let sourceDirCopied = false;

    for (const sourceDir of possibleSourceDirs) {
      const sourcePath = path.join(appPath, sourceDir);
      if (await fs.pathExists(sourcePath)) {
        await fs.copy(sourcePath, path.join(templateDir, 'src'));
        console.log(chalk.gray(`Copied source files from /${sourceDir}`));
        sourceDirCopied = true;
        break;
      }
    }

    if (!sourceDirCopied) {
      throw new Error('Could not find source directory. Expected one of: src, app, source, client');
    }

    // Copy configuration files - support multiple build tools and frameworks
    const configFiles = [
      // Tailwind & PostCSS
      'tailwind.config.js',
      'tailwind.config.ts',
      'tailwind.config.cjs',
      'tailwind.config.mjs',
      'postcss.config.js',
      'postcss.config.cjs',
      // TypeScript
      'tsconfig.json',
      // Vite
      'vite.config.ts',
      'vite.config.js',
      'vite.config.mjs',
      // Webpack
      'webpack.config.js',
      'webpack.config.ts',
      // Next.js
      'next.config.js',
      'next.config.mjs',
      // Create React App
      'craco.config.js',
      // ESLint & Prettier (useful for maintaining code style)
      '.eslintrc.js',
      '.eslintrc.json',
      '.prettierrc',
      '.prettierrc.json',
    ];

    for (const file of configFiles) {
      const sourcePath = path.join(appPath, file);
      if (await fs.pathExists(sourcePath)) {
        await fs.copy(sourcePath, path.join(templateDir, file));
      }
    }

    // Write template configuration
    await fs.writeJson(path.join(templateDir, 'template.config.json'), templateConfig, {
      spaces: 2,
    });

    console.log(chalk.green(`Template created successfully at ${templateDir}`));

    return templateConfig;
  }
}
