import inquirer from 'inquirer';
import chalk from 'chalk';
import ora from 'ora';
import { AppImporter } from '@longvhv/app-adapter';
import { TemplateRegistry } from '@longvhv/templates';

interface ImportAppAnswers {
  repoUrl: string;
  templateName: string;
  branch: string;
}

/**
 * Import an application from GitHub and create a template
 */
export async function importApp(repoUrl?: string, templateName?: string) {
  console.log(chalk.blue.bold('\n📥 Import Application as Template\n'));

  // Get templates directory
  const templatesDir = TemplateRegistry.getDefaultTemplatesDir();

  // Initialize registry
  const registry = new TemplateRegistry(templatesDir);
  await registry.initialize();

  // Prompt for details if not provided
  const answers = await inquirer.prompt<ImportAppAnswers>([
    {
      type: 'input',
      name: 'repoUrl',
      message: 'GitHub repository URL:',
      default: repoUrl,
      when: !repoUrl,
      validate: (input: string) => {
        if (!input.includes('github.com')) {
          return 'Please provide a valid GitHub repository URL';
        }
        return true;
      },
    },
    {
      type: 'input',
      name: 'templateName',
      message: 'Template name:',
      default: templateName,
      when: !templateName,
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
    {
      type: 'input',
      name: 'branch',
      message: 'Branch name:',
      default: 'main',
    },
  ]);

  const finalRepoUrl = repoUrl || answers.repoUrl;
  const finalTemplateName = templateName || answers.templateName;
  const branch = answers.branch;

  const spinner = ora('Importing application...').start();

  try {
    const importer = new AppImporter();

    const config = await importer.importFromGit({
      repoUrl: finalRepoUrl,
      templateName: finalTemplateName,
      targetDir: templatesDir,
      branch,
    });

    spinner.succeed(chalk.green('Application imported successfully!'));

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

    console.log(chalk.cyan('\n✨ Next steps:\n'));
    console.log(chalk.white(`  pnpm cli clone-app ${finalTemplateName} my-new-app`));
    console.log(chalk.white(`  pnpm cli list-templates\n`));
  } catch (error) {
    spinner.fail(chalk.red('Failed to import application'));
    console.error(chalk.red('\n' + (error as Error).message + '\n'));
    process.exit(1);
  }
}
