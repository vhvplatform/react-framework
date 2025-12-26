import chalk from 'chalk';
import { TemplateRegistry } from '@vhvplatform/templates';

/**
 * List all available templates
 */
export async function listTemplates() {
  console.log(chalk.blue.bold('\n📋 Available Templates\n'));

  // Get templates directory
  const templatesDir = TemplateRegistry.getDefaultTemplatesDir();

  // Initialize registry
  const registry = new TemplateRegistry(templatesDir);
  await registry.initialize();

  const templates = await registry.listTemplateMetadata();

  if (templates.length === 0) {
    console.log(chalk.yellow('No templates available.'));
    console.log(
      chalk.white('\nImport a template using: pnpm cli import-app <github-url> <template-name>\n')
    );
    return;
  }

  for (const template of templates) {
    console.log(chalk.cyan(`\n${template.name}`));
    console.log(chalk.gray('─'.repeat(60)));
    console.log(chalk.white(`Description: ${template.description}`));
    console.log(chalk.white(`Version: ${template.version}`));
    console.log(chalk.white(`Components: ${template.componentCount}`));
    console.log(chalk.white(`Routes: ${template.routeCount}`));
    console.log(chalk.white(`Created: ${template.createdAt.toLocaleDateString()}`));
    console.log(chalk.white(`Updated: ${template.updatedAt.toLocaleDateString()}`));

    console.log(chalk.cyan('\n  Usage:'));
    console.log(chalk.white(`    pnpm cli clone-app ${template.name} my-app\n`));
  }

  console.log(chalk.gray('─'.repeat(60)));
  console.log(chalk.white(`\nTotal templates: ${templates.length}\n`));
}
