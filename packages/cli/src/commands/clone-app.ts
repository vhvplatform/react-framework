import inquirer from 'inquirer';
import chalk from 'chalk';
import ora from 'ora';
import fs from 'fs/promises';
import path from 'path';
import { TemplateRegistry } from '@longvhv/templates';

interface CloneAppAnswers {
  templateName: string;
  appName: string;
  apiUrl: string;
}

/**
 * Create a new application from a template
 */
export async function cloneApp(templateName?: string, appName?: string) {
  console.log(chalk.blue.bold('\n📦 Clone App from Template\n'));

  // Get templates directory
  const templatesDir = TemplateRegistry.getDefaultTemplatesDir();

  // Initialize registry
  const registry = new TemplateRegistry(templatesDir);
  await registry.initialize();

  const availableTemplates = registry.listTemplates().map((t) => t.getName());

  if (availableTemplates.length === 0) {
    console.log(chalk.yellow('\n⚠️  No templates available.'));
    console.log(chalk.white('Import a template first using: pnpm cli import-app\n'));
    process.exit(0);
  }

  // Prompt for details if not provided
  const answers = await inquirer.prompt<CloneAppAnswers>([
    {
      type: 'list',
      name: 'templateName',
      message: 'Select template:',
      choices: availableTemplates,
      when: !templateName,
    },
    {
      type: 'input',
      name: 'appName',
      message: 'Application name:',
      default: appName || 'my-app',
      when: !appName,
      validate: (input: string) => {
        if (!/^[a-z0-9-]+$/.test(input)) {
          return 'App name must be lowercase alphanumeric with hyphens';
        }
        return true;
      },
    },
    {
      type: 'input',
      name: 'apiUrl',
      message: 'API URL:',
      default: 'http://localhost:8080',
    },
  ]);

  const finalTemplateName = templateName || answers.templateName;
  const finalAppName = appName || answers.appName;
  const apiUrl = answers.apiUrl;

  const spinner = ora('Creating application from template...').start();

  try {
    // Get template
    const template = await registry.getTemplate(finalTemplateName);

    if (!template) {
      throw new Error(`Template ${finalTemplateName} not found`);
    }

    const config = template.getConfig();

    // Create app directory
    const appPath = path.join(process.cwd(), finalAppName);
    await fs.mkdir(appPath, { recursive: true });

    // Copy template files
    await template.copyTo(appPath);

    // Create additional directories
    await fs.mkdir(path.join(appPath, 'public'), { recursive: true });
    await fs.mkdir(path.join(appPath, 'src', 'modules'), { recursive: true });

    // Create package.json
    const packageJson = {
      name: finalAppName,
      version: '1.0.0',
      type: 'module',
      scripts: {
        dev: 'vite',
        build: 'tsc && vite build',
        preview: 'vite preview',
        'type-check': 'tsc --noEmit',
      },
      dependencies: {
        '@longvhv/core': 'workspace:*',
        '@longvhv/api-client': 'workspace:*',
        '@longvhv/ui-components': 'workspace:*',
        ...config.dependencies,
        react: '^18.2.0',
        'react-dom': '^18.2.0',
        'react-redux': '^9.0.4',
        'react-router-dom': '^6.21.1',
      },
      devDependencies: {
        '@types/react': '^18.2.46',
        '@types/react-dom': '^18.2.18',
        '@vitejs/plugin-react': '^4.2.1',
        autoprefixer: '^10.4.16',
        postcss: '^8.4.32',
        tailwindcss: '^3.4.0',
        typescript: '^5.3.3',
        vite: '^5.0.10',
      },
    };

    await fs.writeFile(path.join(appPath, 'package.json'), JSON.stringify(packageJson, null, 2));

    // Create index.html
    const indexHtml = `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/svg+xml" href="/vite.svg" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>${finalAppName}</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>
`;

    await fs.writeFile(path.join(appPath, 'index.html'), indexHtml);

    // Create .gitignore
    const gitignore = `# Dependencies
node_modules

# Build output
dist
dist-ssr
*.local

# Environment files
.env
.env.local

# Editor
.vscode
.idea
*.swp
*.swo

# OS
.DS_Store
Thumbs.db
`;

    await fs.writeFile(path.join(appPath, '.gitignore'), gitignore);

    // Create README.md
    const readme = `# ${finalAppName}

Created from template: ${finalTemplateName}

## Description

${config.description}

## Getting Started

\`\`\`bash
# Install dependencies
pnpm install

# Start development server
pnpm dev

# Build for production
pnpm build
\`\`\`

## Features

- Components: ${config.components.required.length + config.components.optional.length}
- Routes: ${config.routes.length}
- Theme customization: ${config.customization.theme ? 'Yes' : 'No'}
- Authentication: ${config.customization.auth ? 'Yes' : 'No'}

## API Configuration

The application connects to: \`${apiUrl}\`

## Template Source

Repository: ${config.source.repo}
Branch: ${config.source.branch}
`;

    await fs.writeFile(path.join(appPath, 'README.md'), readme);

    spinner.succeed(chalk.green('Application created successfully!'));

    console.log(chalk.cyan('\n📦 Next steps:\n'));
    console.log(chalk.white(`  cd ${finalAppName}`));
    console.log(chalk.white('  pnpm install'));
    console.log(chalk.white('  pnpm dev\n'));
    console.log(chalk.gray(`Application will be available at http://localhost:3000\n`));
  } catch (error) {
    spinner.fail(chalk.red('Failed to create application'));
    console.error(chalk.red('\n' + (error as Error).message + '\n'));
    process.exit(1);
  }
}
