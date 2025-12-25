#!/usr/bin/env node
import { Command } from 'commander';
import inquirer from 'inquirer';
import chalk from 'chalk';
import validatePackageName from 'validate-npm-package-name';
import { createApp } from './createApp.js';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Read package.json for version
const packageJson = JSON.parse(readFileSync(join(__dirname, '../package.json'), 'utf-8'));

const program = new Command();

program
  .name('create-longvhv-app')
  .version(packageJson.version, '-v, --version', 'Output the current version')
  .description('Create a new SaaS application using @longvhv framework')
  .argument('[app-name]', 'Application name')
  .option('--template <name>', 'Template to use (blank, crm, admin-dashboard, integration-portal)')
  .option('--framework-version <version>', 'Framework version (default: latest)')
  .option('--registry <url>', 'NPM registry URL')
  .option('--skip-git', 'Skip git initialization')
  .option('--skip-install', 'Skip dependency installation')
  .option('--package-manager <manager>', 'Package manager to use (npm, pnpm, yarn)')
  .option('--verbose', 'Enable verbose logging')
  .action(async (appName, options) => {
    try {
      console.log(chalk.blue.bold('\n🚀 Create @longvhv SaaS App\n'));

      let name = appName;

      if (!name) {
        const answers = await inquirer.prompt([
          {
            type: 'input',
            name: 'appName',
            message: 'Application name:',
            validate: (input) => {
              if (!input) return 'App name is required';

              const validation = validatePackageName(input);
              if (!validation.validForNewPackages) {
                const errors = [...(validation.errors || []), ...(validation.warnings || [])];
                return errors.length > 0 ? errors[0] : 'Invalid package name';
              }

              return true;
            },
          },
        ]);
        name = answers.appName;
      } else {
        // Validate provided app name
        const validation = validatePackageName(name);
        if (!validation.validForNewPackages) {
          const errors = [...(validation.errors || []), ...(validation.warnings || [])];
          console.error(chalk.red(`\n❌ Invalid app name: ${errors[0] || 'Unknown error'}\n`));
          process.exit(1);
        }
      }

      await createApp(name, options);
    } catch (error) {
      console.error(chalk.red('\n❌ An error occurred:\n'));
      console.error(error instanceof Error ? error.message : String(error));
      if (options.verbose && error instanceof Error) {
        console.error('\nStack trace:');
        console.error(error.stack);
      }
      process.exit(1);
    }
  });

program.parse();
