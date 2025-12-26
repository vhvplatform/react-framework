import inquirer from 'inquirer';
import chalk from 'chalk';
import ora from 'ora';
import path from 'path';
import fs from 'fs-extra';
import { AppImporter } from '@vhvplatform/app-adapter';
import { TemplateRegistry } from '@vhvplatform/templates';

interface AdaptAppAnswers {
  appPath: string;
  templateName: string;
}

/**
 * Adapt a standalone app to the framework format
 */
export async function adaptApp(appPath?: string) {
  console.log(chalk.blue.bold('\n🔄 Adapt Standalone App to Framework\n'));

  // Get templates directory
  const templatesDir = TemplateRegistry.getDefaultTemplatesDir();

  // Initialize registry
  const registry = new TemplateRegistry(templatesDir);
  await registry.initialize();

  // Prompt for details if not provided
  const answers = await inquirer.prompt<AdaptAppAnswers>([
    {
      type: 'input',
      name: 'appPath',
      message: 'Path to application:',
      default: appPath || process.cwd(),
      when: !appPath,
      validate: async (input: string) => {
        const packageJsonPath = path.join(input, 'package.json');
        if (!(await fs.pathExists(packageJsonPath))) {
          return 'Invalid application path. package.json not found.';
        }
        return true;
      },
    },
    {
      type: 'input',
      name: 'templateName',
      message: 'Template name:',
      validate: (input: string) => {
        if (!/^[a-z0-9-]+$/.test(input)) {
          return 'Template name must be lowercase alphanumeric with hyphens';
        }
        if (registry.hasTemplate(input)) {
          return `Template ${input} already exists`;
        }
        return true;
      },
    },
  ]);

  const finalAppPath = appPath || answers.appPath;
  const templateName = answers.templateName;

  const spinner = ora('Analyzing and adapting application...').start();

  try {
    const importer = new AppImporter();

    const config = await importer.importFromLocal(finalAppPath, templateName, templatesDir);

    spinner.succeed(chalk.green('Application adapted successfully!'));

    console.log(chalk.cyan('\n📊 Analysis Results:\n'));
    console.log(
      chalk.white(
        `  Components: ${config.components.required.length + config.components.optional.length}`
      )
    );
    console.log(chalk.white(`  Routes: ${config.routes.length}`));
    console.log(chalk.white(`  Dependencies: ${Object.keys(config.dependencies).length}`));
    console.log(chalk.white(`  Theme support: ${config.customization.theme ? 'Yes' : 'No'}`));
    console.log(chalk.white(`  Auth support: ${config.customization.auth ? 'Yes' : 'No'}`));

    console.log(chalk.cyan('\n✨ Template created:\n'));
    console.log(chalk.white(`  ${templateName}`));
    console.log(chalk.white(`\nCreate a new app from this template:`));
    console.log(chalk.white(`  pnpm cli clone-app ${templateName} my-new-app\n`));
  } catch (error) {
    spinner.fail(chalk.red('Failed to adapt application'));
    console.error(chalk.red('\n' + (error as Error).message + '\n'));
    process.exit(1);
  }
}
