#!/usr/bin/env node

import { Command } from 'commander';
import chalk from 'chalk';
import { createApp } from './commands/create-app.js';
import { createModule } from './commands/create-module.js';

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

program.parse();
