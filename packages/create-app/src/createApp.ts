import fs from 'fs-extra';
import path from 'path';
import inquirer from 'inquirer';
import chalk from 'chalk';
import ora from 'ora';
import { execa } from 'execa';

interface CreateAppOptions {
  template?: string;
  version?: string;
  registry?: string;
  skipGit?: boolean;
  skipInstall?: boolean;
}

interface AppConfig {
  name: string;
  template: string;
  frameworkVersion: string;
  registry: string;
  initGit: boolean;
  cicd: string;
  deployTarget: string;
}

export async function createApp(name: string, options: CreateAppOptions) {
  const cwd = process.cwd();
  const appPath = path.join(cwd, name);

  // Check if directory exists
  if (await fs.pathExists(appPath)) {
    console.error(chalk.red(`\n❌ Directory "${name}" already exists\n`));
    process.exit(1);
  }

  // Interactive prompts
  const answers = await inquirer.prompt([
    {
      type: 'list',
      name: 'template',
      message: 'Select template:',
      choices: [
        {
          name: 'Integration Portal (Developer portal with API docs)',
          value: 'integration-portal',
        },
        { name: 'CRM Application (Customer relationship management)', value: 'crm' },
        { name: 'Admin Dashboard (Admin panel)', value: 'admin-dashboard' },
        { name: 'Blank (Minimal setup)', value: 'blank' },
      ],
      default: options.template || 'blank',
    },
    {
      type: 'list',
      name: 'frameworkVersion',
      message: 'Framework version:',
      choices: [
        { name: 'Latest (recommended)', value: 'latest' },
        { name: 'Specific version', value: 'specific' },
      ],
      default: 'latest',
    },
    {
      type: 'input',
      name: 'specificVersion',
      message: 'Enter version:',
      when: (answers) => answers.frameworkVersion === 'specific',
      default: '1.0.0',
    },
    {
      type: 'list',
      name: 'registry',
      message: 'Package registry:',
      choices: [
        { name: 'npm (public)', value: 'https://registry.npmjs.org' },
        { name: 'GitHub Packages (private)', value: 'https://npm.pkg.github.com' },
        { name: 'Custom registry', value: 'custom' },
      ],
      default: options.registry || 'https://registry.npmjs.org',
    },
    {
      type: 'input',
      name: 'customRegistry',
      message: 'Registry URL:',
      when: (answers) => answers.registry === 'custom',
    },
    {
      type: 'confirm',
      name: 'initGit',
      message: 'Initialize git repository?',
      default: !options.skipGit,
    },
    {
      type: 'list',
      name: 'cicd',
      message: 'CI/CD setup:',
      choices: [
        { name: 'GitHub Actions', value: 'github' },
        { name: 'GitLab CI', value: 'gitlab' },
        { name: 'None', value: 'none' },
      ],
      default: 'github',
    },
    {
      type: 'list',
      name: 'deployTarget',
      message: 'Deployment target:',
      choices: [
        { name: 'Vercel', value: 'vercel' },
        { name: 'AWS', value: 'aws' },
        { name: 'Docker', value: 'docker' },
        { name: 'None', value: 'none' },
      ],
      default: 'vercel',
    },
  ]);

  const config: AppConfig = {
    name,
    template: answers.template,
    frameworkVersion: answers.specificVersion || answers.frameworkVersion,
    registry: answers.customRegistry || answers.registry,
    initGit: answers.initGit,
    cicd: answers.cicd,
    deployTarget: answers.deployTarget,
  };

  console.log(chalk.blue('\n📁 Creating application structure...\n'));

  await createAppStructure(appPath, config);

  if (!options.skipInstall) {
    const spinner = ora('Installing dependencies...').start();
    try {
      await execa('npm', ['install'], { cwd: appPath });
      spinner.succeed('Dependencies installed');
    } catch (error) {
      spinner.fail('Failed to install dependencies');
      console.error(error);
    }
  }

  if (config.initGit) {
    const spinner = ora('Initializing git repository...').start();
    try {
      await execa('git', ['init'], { cwd: appPath });
      await execa('git', ['add', '.'], { cwd: appPath });
      await execa('git', ['commit', '-m', 'Initial commit'], { cwd: appPath });
      spinner.succeed('Git repository initialized');
    } catch (error) {
      spinner.fail('Failed to initialize git');
    }
  }

  console.log(chalk.green(`\n✅ Successfully created "${name}"!\n`));
  console.log(chalk.white('Next steps:\n'));
  console.log(chalk.cyan(`  cd ${name}`));
  if (options.skipInstall) {
    console.log(chalk.cyan('  npm install'));
  }
  console.log(chalk.cyan('  npm run dev\n'));
}

async function createAppStructure(appPath: string, config: AppConfig) {
  await fs.ensureDir(appPath);

  // Create directories
  await fs.ensureDir(path.join(appPath, 'src'));
  await fs.ensureDir(path.join(appPath, 'src/modules'));
  await fs.ensureDir(path.join(appPath, 'src/components'));
  await fs.ensureDir(path.join(appPath, 'public'));
  await fs.ensureDir(path.join(appPath, 'scripts'));

  if (config.cicd === 'github') {
    await fs.ensureDir(path.join(appPath, '.github/workflows'));
  }

  // Create package.json
  const packageJson = {
    name: config.name,
    version: '1.0.0',
    private: true,
    type: 'module',
    scripts: {
      dev: 'vite',
      build: 'vite build',
      preview: 'vite preview',
      test: 'vitest',
      lint: 'eslint src --ext ts,tsx',
      'type-check': 'tsc --noEmit',
    },
    dependencies: {
      '@longvhv/core': config.frameworkVersion,
      '@longvhv/api-client': config.frameworkVersion,
      '@longvhv/auth': config.frameworkVersion,
      '@longvhv/ui-components': config.frameworkVersion,
      '@longvhv/theme': config.frameworkVersion,
      '@longvhv/forms': config.frameworkVersion,
      '@longvhv/notifications': config.frameworkVersion,
      '@longvhv/query': config.frameworkVersion,
      react: '^18.2.0',
      'react-dom': '^18.2.0',
      'react-router-dom': '^6.20.0',
    },
    devDependencies: {
      '@types/react': '^18.2.0',
      '@types/react-dom': '^18.2.0',
      '@vitejs/plugin-react': '^4.2.0',
      typescript: '^5.3.0',
      vite: '^5.0.0',
      vitest: '^1.0.0',
      eslint: '^8.0.0',
      tailwindcss: '^3.4.0',
      autoprefixer: '^10.4.0',
      postcss: '^8.4.0',
    },
  };

  await fs.writeJson(path.join(appPath, 'package.json'), packageJson, { spaces: 2 });

  // Create .npmrc if using private registry
  if (config.registry !== 'https://registry.npmjs.org') {
    const npmrc = `@longvhv:registry=${config.registry}
${config.registry.replace('https:', '')}/:_authToken=\${NPM_TOKEN}`;
    await fs.writeFile(path.join(appPath, '.npmrc'), npmrc);
  }

  // Create main.tsx
  const mainTsx = `import React from 'react';
import ReactDOM from 'react-dom/client';
import { Application } from '@longvhv/core';
import { ApiProvider } from '@longvhv/api-client';
import { ThemeProvider } from '@longvhv/theme';
import { NotificationProvider } from '@longvhv/notifications';
import { QueryProvider } from '@longvhv/query';
import { authReducer } from '@longvhv/auth';
import './index.css';

const app = new Application({
  name: '${config.name}',
  apiBaseUrl: import.meta.env.VITE_API_URL || 'http://localhost:8080',
  modules: [],
});

// Register auth module
app.registerModule({
  name: 'auth',
  version: '1.0.0',
  reducers: { auth: authReducer },
});

const App = app.getApp();

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ThemeProvider>
      <QueryProvider>
        <NotificationProvider>
          <ApiProvider baseURL={import.meta.env.VITE_API_URL || 'http://localhost:8080'}>
            <App />
          </ApiProvider>
        </NotificationProvider>
      </QueryProvider>
    </ThemeProvider>
  </React.StrictMode>
);`;

  await fs.writeFile(path.join(appPath, 'src/main.tsx'), mainTsx);

  // Create index.html
  const indexHtml = `<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>${config.name}</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>`;

  await fs.writeFile(path.join(appPath, 'index.html'), indexHtml);

  // Create vite.config.ts
  const viteConfig = `import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
  },
});`;

  await fs.writeFile(path.join(appPath, 'vite.config.ts'), viteConfig);

  // Create tsconfig.json
  const tsConfig = {
    compilerOptions: {
      target: 'ES2020',
      useDefineForClassFields: true,
      lib: ['ES2020', 'DOM', 'DOM.Iterable'],
      module: 'ESNext',
      skipLibCheck: true,
      moduleResolution: 'bundler',
      allowImportingTsExtensions: true,
      resolveJsonModule: true,
      isolatedModules: true,
      noEmit: true,
      jsx: 'react-jsx',
      strict: true,
      noUnusedLocals: true,
      noUnusedParameters: true,
      noFallthroughCasesInSwitch: true,
    },
    include: ['src'],
  };

  await fs.writeJson(path.join(appPath, 'tsconfig.json'), tsConfig, { spaces: 2 });

  // Create tailwind.config.js
  const tailwindConfig = `/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {},
  },
  plugins: [],
}`;

  await fs.writeFile(path.join(appPath, 'tailwind.config.js'), tailwindConfig);

  // Create index.css
  const indexCss = `@tailwind base;
@tailwind components;
@tailwind utilities;`;

  await fs.writeFile(path.join(appPath, 'src/index.css'), indexCss);

  // Create .gitignore
  const gitignore = `# Dependencies
node_modules
.pnpm-store

# Build
dist
*.local

# Environment
.env
.env.local

# IDE
.vscode
.idea

# OS
.DS_Store
Thumbs.db

# Logs
*.log`;

  await fs.writeFile(path.join(appPath, '.gitignore'), gitignore);

  // Create README.md
  const readme = `# ${config.name}

SaaS application built with @longvhv framework.

## Getting Started

\`\`\`bash
npm install
npm run dev
\`\`\`

## Available Scripts

- \`npm run dev\` - Start development server
- \`npm run build\` - Build for production
- \`npm run preview\` - Preview production build
- \`npm test\` - Run tests
- \`npm run lint\` - Lint code

## Framework

This app uses [@longvhv/saas-framework-react](https://github.com/longvhv/saas-framework-react) v${config.frameworkVersion}.

## Documentation

- [Framework Docs](https://github.com/longvhv/saas-framework-react)
- [API Reference](https://github.com/longvhv/saas-framework-react/docs)
`;

  await fs.writeFile(path.join(appPath, 'README.md'), readme);

  // Create CI/CD workflows
  if (config.cicd === 'github') {
    await createGitHubWorkflows(appPath, config);
  }

  // Create .env.example
  const envExample = `# API Configuration
VITE_API_URL=http://localhost:8080

# Authentication
VITE_AUTH_ENABLED=true

# Feature Flags
VITE_FEATURE_X=false`;

  await fs.writeFile(path.join(appPath, '.env.example'), envExample);
}

async function createGitHubWorkflows(appPath: string, config: AppConfig) {
  const ciYml = `name: CI

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main, develop]

jobs:
  test:
    runs-on: ubuntu-latest
    
    steps:
      - uses: actions/checkout@v4
      
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: 'npm'
      
      - name: Install dependencies
        run: npm ci
        env:
          NODE_AUTH_TOKEN: \${{ secrets.NPM_TOKEN }}
      
      - name: Type check
        run: npm run type-check
      
      - name: Lint
        run: npm run lint
      
      - name: Test
        run: npm test
      
      - name: Build
        run: npm run build`;

  await fs.writeFile(path.join(appPath, '.github/workflows/ci.yml'), ciYml);

  if (config.deployTarget === 'vercel') {
    const deployYml = `name: Deploy to Vercel

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      
      - name: Deploy to Vercel
        uses: amondnet/vercel-action@v25
        with:
          vercel-token: \${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: \${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: \${{ secrets.VERCEL_PROJECT_ID }}
          vercel-args: '--prod'`;

    await fs.writeFile(path.join(appPath, '.github/workflows/deploy.yml'), deployYml);
  }
}
