#!/usr/bin/env node
import { Command } from 'commander';
import inquirer from 'inquirer';
import chalk from 'chalk';
import { createApp } from './createApp.js';

const program = new Command();

program
  .name('create-longvhv-app')
  .description('Create a new SaaS application using @longvhv framework')
  .argument('[app-name]', 'Application name')
  .option('--template <name>', 'Template to use')
  .option('--version <version>', 'Framework version')
  .option('--registry <url>', 'NPM registry URL')
  .option('--skip-git', 'Skip git initialization')
  .option('--skip-install', 'Skip dependency installation')
  .action(async (appName, options) => {
    console.log(chalk.blue('\n🚀 Create @longvhv SaaS App\n'));

    let name = appName;

    if (!name) {
      const answers = await inquirer.prompt([
        {
          type: 'input',
          name: 'appName',
          message: 'Application name:',
          validate: (input) => {
            if (!input) return 'App name is required';
            if (!/^[a-z0-9-]+$/.test(input)) {
              return 'App name must contain only lowercase letters, numbers, and hyphens';
            }
            return true;
          },
        },
      ]);
      name = answers.appName;
    }

    await createApp(name, options);
  });

program.parse();
