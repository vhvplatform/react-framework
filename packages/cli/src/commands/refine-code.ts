import inquirer from 'inquirer';
import chalk from 'chalk';
import ora from 'ora';
import fs from 'fs-extra';
import path from 'path';
import { AIService, CodeRefiner, ModificationType } from '@vhvplatform/ai-codegen';

/**
 * Refine/upgrade AI-generated code
 */
export async function refineCode() {
  console.log(chalk.blue.bold('\n🔧 AI Code Refiner\n'));

  // Prompt for AI provider selection
  const providerAnswer = await inquirer.prompt<{
    provider: 'openai' | 'github-copilot' | 'gemini';
  }>([
    {
      type: 'list',
      name: 'provider',
      message: 'Select AI provider:',
      choices: [
        { name: 'OpenAI (GPT-4)', value: 'openai' },
        { name: 'GitHub Copilot', value: 'github-copilot' },
        { name: 'Google Gemini', value: 'gemini' },
      ],
      default: 'openai',
    },
  ]);

  // Check for appropriate API key based on provider
  let apiKey: string | undefined;
  let githubToken: string | undefined;

  switch (providerAnswer.provider) {
    case 'openai':
      apiKey = process.env.OPENAI_API_KEY;
      if (!apiKey) {
        console.error(
          chalk.red(
            '\n❌ Error: OPENAI_API_KEY environment variable is not set.\nPlease set it with your OpenAI API key.\n'
          )
        );
        console.log(chalk.white('Example: export OPENAI_API_KEY=sk-...\n'));
        process.exit(1);
      }
      break;

    case 'github-copilot':
      githubToken = process.env.GITHUB_TOKEN;
      if (!githubToken) {
        console.error(
          chalk.red(
            '\n❌ Error: GITHUB_TOKEN environment variable is not set.\nPlease set it with your GitHub token with Copilot access.\n'
          )
        );
        console.log(chalk.white('Example: export GITHUB_TOKEN=ghp_...\n'));
        process.exit(1);
      }
      apiKey = githubToken;
      break;

    case 'gemini':
      apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey) {
        console.error(
          chalk.red(
            '\n❌ Error: GEMINI_API_KEY environment variable is not set.\nPlease set it with your Google Gemini API key.\n'
          )
        );
        console.log(chalk.white('Example: export GEMINI_API_KEY=AI...\n'));
        process.exit(1);
      }
      break;
  }

  // Prompt for file path
  const fileAnswers = await inquirer.prompt<{
    filePath: string;
    mode: 'single' | 'multiple' | 'upgrade';
  }>([
    {
      type: 'input',
      name: 'filePath',
      message: 'Path to the code file to refine:',
      validate: async (input: string) => {
        const fullPath = path.resolve(input);
        if (!(await fs.pathExists(fullPath))) {
          return 'File does not exist';
        }
        const ext = path.extname(fullPath);
        if (!['.ts', '.tsx', '.dart', '.go'].includes(ext)) {
          return 'File must be .ts, .tsx, .dart, or .go';
        }
        return true;
      },
    },
    {
      type: 'list',
      name: 'mode',
      message: 'Refinement mode:',
      choices: [
        { name: 'Single refinement', value: 'single' },
        { name: 'Multiple refinements', value: 'multiple' },
        { name: 'Upgrade to modern patterns', value: 'upgrade' },
      ],
    },
  ]);

  const filePath = path.resolve(fileAnswers.filePath);

  try {
    // Initialize AI service and refiner with selected provider
    const aiService = new AIService({
      provider: providerAnswer.provider,
      apiKey: apiKey!,
      githubToken,
      model:
        providerAnswer.provider === 'openai'
          ? 'gpt-4-turbo-preview'
          : providerAnswer.provider === 'gemini'
            ? 'gemini-pro'
            : 'gpt-4',
    });

    const refiner = new CodeRefiner(aiService);

    if (fileAnswers.mode === 'upgrade') {
      // Upgrade mode
      const upgradeAnswers = await inquirer.prompt<{
        targetVersion?: string;
        backup: boolean;
      }>([
        {
          type: 'input',
          name: 'targetVersion',
          message: 'Target version (optional, e.g., React 18, Go 1.21):',
        },
        {
          type: 'confirm',
          name: 'backup',
          message: 'Create backup of original file?',
          default: true,
        },
      ]);

      const spinner = ora('Upgrading code to modern patterns...').start();

      try {
        const result = await refiner.upgradeCode(
          filePath,
          upgradeAnswers.targetVersion || undefined
        );

        spinner.succeed(chalk.green('Code upgraded successfully!'));

        // Show changes
        console.log(chalk.cyan('\n📝 Changes made:\n'));
        result.changes.forEach((change) => {
          console.log(chalk.white(`  • ${change}`));
        });

        console.log(chalk.cyan('\n💡 Explanation:\n'));
        console.log(chalk.white(result.explanation));

        // Ask to apply changes
        const { apply } = await inquirer.prompt<{ apply: boolean }>([
          {
            type: 'confirm',
            name: 'apply',
            message: 'Apply these changes to the file?',
            default: false,
          },
        ]);

        if (apply) {
          // Create backup if requested
          if (upgradeAnswers.backup) {
            const backupPath = `${filePath}.backup`;
            await fs.copy(filePath, backupPath);
            console.log(chalk.green(`\n✓ Backup created: ${backupPath}`));
          }

          // Write refined code
          await fs.writeFile(filePath, result.refinedCode, 'utf-8');
          console.log(chalk.green(`\n✓ File updated: ${filePath}\n`));
        } else {
          // Save to new file
          const newPath = filePath.replace(/(\.[^.]+)$/, '.refined$1');
          await fs.writeFile(newPath, result.refinedCode, 'utf-8');
          console.log(chalk.green(`\n✓ Refined code saved to: ${newPath}\n`));
        }
      } catch (error) {
        spinner.fail(chalk.red('Failed to upgrade code'));
        throw error;
      }
    } else if (fileAnswers.mode === 'single') {
      // Single refinement mode
      const refinementAnswers = await inquirer.prompt<{
        modificationType: ModificationType;
        instructions: string;
        backup: boolean;
      }>([
        {
          type: 'list',
          name: 'modificationType',
          message: 'Type of modification:',
          choices: [
            { name: 'Refactor (improve structure)', value: 'refactor' },
            { name: 'Optimize (improve performance)', value: 'optimize' },
            { name: 'Add feature', value: 'add-feature' },
            { name: 'Fix bug', value: 'fix-bug' },
            { name: 'Improve types', value: 'improve-types' },
            { name: 'Add tests', value: 'add-tests' },
            { name: 'Update styling', value: 'update-styling' },
            { name: 'Add comments/docs', value: 'add-comments' },
          ],
        },
        {
          type: 'input',
          name: 'instructions',
          message: 'Specific instructions for the refinement:',
          validate: (input: string) => {
            if (input.length < 10) {
              return 'Instructions must be at least 10 characters';
            }
            return true;
          },
        },
        {
          type: 'confirm',
          name: 'backup',
          message: 'Create backup of original file?',
          default: true,
        },
      ]);

      const spinner = ora('Refining code...').start();

      try {
        const currentCode = await fs.readFile(filePath, 'utf-8');
        const ext = path.extname(filePath);
        const language =
          ext === '.tsx' ? 'tsx' : ext === '.ts' ? 'typescript' : ext === '.dart' ? 'dart' : 'go';

        const result = await refiner.refineCode({
          filePath,
          currentCode,
          modificationType: refinementAnswers.modificationType,
          instructions: refinementAnswers.instructions,
          language: language as any,
        });

        spinner.succeed(chalk.green('Code refined successfully!'));

        // Show changes
        console.log(chalk.cyan('\n📝 Changes made:\n'));
        result.changes.forEach((change) => {
          console.log(chalk.white(`  • ${change}`));
        });

        console.log(chalk.cyan('\n💡 Explanation:\n'));
        console.log(chalk.white(result.explanation));

        // Ask to apply changes
        const { apply } = await inquirer.prompt<{ apply: boolean }>([
          {
            type: 'confirm',
            name: 'apply',
            message: 'Apply these changes to the file?',
            default: false,
          },
        ]);

        if (apply) {
          // Create backup if requested
          if (refinementAnswers.backup) {
            const backupPath = `${filePath}.backup`;
            await fs.copy(filePath, backupPath);
            console.log(chalk.green(`\n✓ Backup created: ${backupPath}`));
          }

          // Write refined code
          await fs.writeFile(filePath, result.refinedCode, 'utf-8');
          console.log(chalk.green(`\n✓ File updated: ${filePath}\n`));
        } else {
          // Save to new file
          const newPath = filePath.replace(/(\.[^.]+)$/, '.refined$1');
          await fs.writeFile(newPath, result.refinedCode, 'utf-8');
          console.log(chalk.green(`\n✓ Refined code saved to: ${newPath}\n`));
        }
      } catch (error) {
        spinner.fail(chalk.red('Failed to refine code'));
        throw error;
      }
    } else {
      // Multiple refinements mode
      const refinements: Array<{ type: ModificationType; instructions: string }> = [];

      console.log(chalk.yellow('\nAdd refinements (press Ctrl+C when done):\n'));

      let addMore = true;
      while (addMore) {
        const answers = await inquirer.prompt<{
          modificationType: ModificationType;
          instructions: string;
          addAnother: boolean;
        }>([
          {
            type: 'list',
            name: 'modificationType',
            message: `Refinement ${refinements.length + 1} - Type:`,
            choices: [
              { name: 'Refactor', value: 'refactor' },
              { name: 'Optimize', value: 'optimize' },
              { name: 'Add feature', value: 'add-feature' },
              { name: 'Fix bug', value: 'fix-bug' },
              { name: 'Improve types', value: 'improve-types' },
              { name: 'Add tests', value: 'add-tests' },
              { name: 'Update styling', value: 'update-styling' },
              { name: 'Add comments', value: 'add-comments' },
            ],
          },
          {
            type: 'input',
            name: 'instructions',
            message: 'Instructions:',
            validate: (input: string) => input.length >= 10 || 'At least 10 characters',
          },
          {
            type: 'confirm',
            name: 'addAnother',
            message: 'Add another refinement?',
            default: false,
          },
        ]);

        refinements.push({
          type: answers.modificationType,
          instructions: answers.instructions,
        });

        addMore = answers.addAnother;
      }

      const { backup } = await inquirer.prompt<{ backup: boolean }>([
        {
          type: 'confirm',
          name: 'backup',
          message: 'Create backup of original file?',
          default: true,
        },
      ]);

      const spinner = ora(`Applying ${refinements.length} refinements...`).start();

      try {
        const result = await refiner.applyMultipleRefinements(filePath, refinements);

        spinner.succeed(chalk.green('All refinements applied successfully!'));

        // Show changes
        console.log(chalk.cyan('\n📝 All changes made:\n'));
        result.changes.forEach((change) => {
          console.log(chalk.white(`  • ${change}`));
        });

        console.log(chalk.cyan('\n💡 Explanation:\n'));
        console.log(chalk.white(result.explanation));

        // Ask to apply changes
        const { apply } = await inquirer.prompt<{ apply: boolean }>([
          {
            type: 'confirm',
            name: 'apply',
            message: 'Apply these changes to the file?',
            default: false,
          },
        ]);

        if (apply) {
          // Create backup if requested
          if (backup) {
            const backupPath = `${filePath}.backup`;
            await fs.copy(filePath, backupPath);
            console.log(chalk.green(`\n✓ Backup created: ${backupPath}`));
          }

          // Write refined code
          await fs.writeFile(filePath, result.refinedCode, 'utf-8');
          console.log(chalk.green(`\n✓ File updated: ${filePath}\n`));
        } else {
          // Save to new file
          const newPath = filePath.replace(/(\.[^.]+)$/, '.refined$1');
          await fs.writeFile(newPath, result.refinedCode, 'utf-8');
          console.log(chalk.green(`\n✓ Refined code saved to: ${newPath}\n`));
        }
      } catch (error) {
        spinner.fail(chalk.red('Failed to apply refinements'));
        throw error;
      }
    }
  } catch (error) {
    console.error(chalk.red('\n' + (error as Error).message + '\n'));

    if ((error as Error).message.includes('API key')) {
      console.log(
        chalk.yellow('💡 Make sure your OPENAI_API_KEY is valid and has sufficient credits.\n')
      );
    }

    process.exit(1);
  }
}
