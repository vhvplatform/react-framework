import inquirer from 'inquirer';
import chalk from 'chalk';
import ora from 'ora';
import fs from 'fs-extra';
import path from 'path';
import { AIService, CodeGenerator, CodegenRequest, CodegenTarget } from '@longvhv/ai-codegen';

/**
 * Generate code using AI
 */
export async function generateCode() {
  console.log(chalk.blue.bold('\n🤖 AI Code Generator\n'));

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

  // Prompt for generation details
  const answers = await inquirer.prompt<{
    target: CodegenTarget;
    description: string;
    componentName: string;
    features: string[];
    styling?: 'tailwind' | 'css-modules' | 'styled-components';
    stateManagement?: string;
    outputDir: string;
    includeApi: boolean;
  }>([
    {
      type: 'list',
      name: 'target',
      message: 'What do you want to generate?',
      choices: [
        { name: 'React Component', value: 'react-component' },
        { name: 'React Page/View', value: 'react-page' },
        { name: 'Flutter Widget', value: 'flutter-widget' },
        { name: 'Flutter Screen', value: 'flutter-screen' },
        { name: 'Go API', value: 'go-api' },
        { name: 'Full-Stack (React + Go)', value: 'full-stack' },
        { name: 'Full-Stack (Flutter + Go)', value: 'full-stack-flutter' },
      ],
    },
    {
      type: 'input',
      name: 'description',
      message: 'Describe what you want to build:',
      validate: (input: string) => {
        if (input.length < 10) {
          return 'Description must be at least 10 characters';
        }
        return true;
      },
    },
    {
      type: 'input',
      name: 'componentName',
      message: 'Component/Screen/Widget name:',
      default: (answers: any) => {
        if (answers.target.includes('flutter')) return 'MyWidget';
        return 'MyComponent';
      },
    },
    {
      type: 'checkbox',
      name: 'features',
      message: 'Select features to include:',
      choices: [
        { name: 'Form validation', value: 'form-validation' },
        { name: 'Data fetching', value: 'data-fetching' },
        { name: 'Authentication', value: 'authentication' },
        { name: 'Loading states', value: 'loading-states' },
        { name: 'Error handling', value: 'error-handling' },
        { name: 'Responsive design', value: 'responsive' },
        { name: 'Tests', value: 'tests' },
      ],
    },
    {
      type: 'list',
      name: 'styling',
      message: 'Styling approach:',
      choices: ['tailwind', 'css-modules', 'styled-components'],
      when: (answers: any) => answers.target.includes('react'),
    },
    {
      type: 'list',
      name: 'stateManagement',
      message: 'State management:',
      choices: (answers: any) => {
        if (answers.target.includes('flutter')) {
          return ['provider', 'bloc', 'riverpod', 'getx'];
        }
        return ['useState', 'redux', 'zustand'];
      },
      when: (answers: any) =>
        !answers.target.includes('go-api') && !answers.target.includes('full-stack'),
    },
    {
      type: 'input',
      name: 'outputDir',
      message: 'Output directory:',
      default: './generated',
    },
    {
      type: 'confirm',
      name: 'includeApi',
      message: 'Generate API endpoints?',
      default: false,
      when: (answers: any) =>
        answers.target.includes('full-stack') || answers.features.includes('data-fetching'),
    },
  ]);

  const spinner = ora(`Generating code with AI (${providerAnswer.provider})...`).start();

  try {
    // Initialize AI service with selected provider
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

    const generator = new CodeGenerator(aiService);

    // Build request
    const request: CodegenRequest = {
      target: answers.target,
      description: answers.description,
      componentName: answers.componentName,
      features: answers.features,
      styling: answers.styling,
      stateManagement: answers.stateManagement as any,
    };

    // Add API endpoints if requested
    if (answers.includeApi || answers.target.includes('api')) {
      const apiAnswers = await inquirer.prompt<{
        endpoints: string[];
      }>([
        {
          type: 'checkbox',
          name: 'endpoints',
          message: 'Select API endpoints to generate:',
          choices: [
            { name: 'GET /items - List items', value: 'GET:/items:List items' },
            { name: 'GET /items/:id - Get item by ID', value: 'GET:/items/:id:Get item by ID' },
            { name: 'POST /items - Create item', value: 'POST:/items:Create new item' },
            { name: 'PUT /items/:id - Update item', value: 'PUT:/items/:id:Update item' },
            { name: 'DELETE /items/:id - Delete item', value: 'DELETE:/items/:id:Delete item' },
          ],
        },
      ]);

      request.apiEndpoints = apiAnswers.endpoints.map((ep) => {
        const [method, path, description] = ep.split(':');
        return {
          method: method as any,
          path,
          description,
        };
      });
    }

    // Generate code
    const result = await generator.generate(request);

    spinner.succeed(chalk.green('Code generated successfully!'));

    // Save files
    const outputDir = path.resolve(answers.outputDir);
    await fs.ensureDir(outputDir);

    console.log(chalk.cyan('\n📁 Generated files:\n'));

    for (const file of result.files) {
      const filePath = path.join(outputDir, file.path);
      await fs.ensureDir(path.dirname(filePath));
      await fs.writeFile(filePath, file.content, 'utf-8');
      console.log(chalk.white(`  ✓ ${file.path}`));
    }

    console.log(chalk.cyan('\n📋 Instructions:\n'));
    console.log(chalk.white(result.instructions));

    if (result.goApiSpec) {
      console.log(chalk.cyan('\n🔌 API Endpoints:\n'));
      result.goApiSpec.endpoints.forEach((ep) => {
        console.log(chalk.white(`  ${ep.method} ${ep.path} - ${ep.description}`));
      });
    }

    console.log(chalk.green(`\n✨ Files saved to: ${outputDir}\n`));
  } catch (error) {
    spinner.fail(chalk.red('Failed to generate code'));
    console.error(chalk.red('\n' + (error as Error).message + '\n'));

    if ((error as Error).message.includes('API key')) {
      console.log(
        chalk.yellow('💡 Make sure your OPENAI_API_KEY is valid and has sufficient credits.\n')
      );
    }

    process.exit(1);
  }
}
