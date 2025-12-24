#!/usr/bin/env node

import { Command } from 'commander';
import chalk from 'chalk';
import { createApp } from './commands/create-app.js';
import { createModule } from './commands/create-module.js';
import { importApp } from './commands/import-app.js';
import { cloneApp } from './commands/clone-app.js';
import { listTemplates } from './commands/list-templates.js';
import { adaptApp } from './commands/adapt-app.js';
import { generateCode } from './commands/generate-code.js';
import { refineCode } from './commands/refine-code.js';

const program = new Command();

program
  .name('saas-cli')
  .description('CLI tools for creating SaaS applications and modules')
  .version('1.0.0');

// Create app command
program
  .command('create-app')
  .description('Create a new SaaS application from template')
  .argument('[name]', 'Application name')
  .action(async (name?: string) => {
    try {
      await createApp(name);
    } catch (error) {
      console.error(chalk.red('Error creating app:'), error);
      process.exit(1);
    }
  });

// Create module command
program
  .command('create-module')
  .description('Create a new module in the current application')
  .argument('[name]', 'Module name')
  .action(async (name?: string) => {
    try {
      await createModule(name);
    } catch (error) {
      console.error(chalk.red('Error creating module:'), error);
      process.exit(1);
    }
  });

// Import app command
program
  .command('import-app')
  .description('Import repository as template')
  .argument('[github-url]', 'GitHub repository URL')
  .argument('[template-name]', 'Template name')
  .action(async (githubUrl?: string, templateName?: string) => {
    try {
      await importApp(githubUrl, templateName);
    } catch (error) {
      console.error(chalk.red('Error importing app:'), error);
      process.exit(1);
    }
  });

// Clone app command
program
  .command('clone-app')
  .description('Create app from template')
  .argument('[template-name]', 'Template name')
  .argument('[app-name]', 'Application name')
  .action(async (templateName?: string, appName?: string) => {
    try {
      await cloneApp(templateName, appName);
    } catch (error) {
      console.error(chalk.red('Error cloning app:'), error);
      process.exit(1);
    }
  });

// List templates command
program
  .command('list-templates')
  .description('Show available templates')
  .action(async () => {
    try {
      await listTemplates();
    } catch (error) {
      console.error(chalk.red('Error listing templates:'), error);
      process.exit(1);
    }
  });

// Adapt app command
program
  .command('adapt-app')
  .description('Convert standalone app to framework format')
  .argument('[path]', 'Path to application')
  .action(async (appPath?: string) => {
    try {
      await adaptApp(appPath);
    } catch (error) {
      console.error(chalk.red('Error adapting app:'), error);
      process.exit(1);
    }
  });

// Generate code command
program
  .command('generate')
  .alias('gen')
  .description('Generate code using AI (React, Flutter, Go API)')
  .action(async () => {
    try {
      await generateCode();
    } catch (error) {
      console.error(chalk.red('Error generating code:'), error);
      process.exit(1);
    }
  });

// Refine code command
program
  .command('refine')
  .description('Refine/upgrade AI-generated code')
  .action(async () => {
    try {
      await refineCode();
    } catch (error) {
      console.error(chalk.red('Error refining code:'), error);
      process.exit(1);
    }
  });

program.parse();
