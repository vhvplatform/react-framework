import fs from 'fs-extra';
import path from 'path';
import inquirer from 'inquirer';
import chalk from 'chalk';
import ora, { Ora } from 'ora';
import { execa } from 'execa';

interface CreateAppOptions {
  template?: string;
  frameworkVersion?: string;
  registry?: string;
  skipGit?: boolean;
  skipInstall?: boolean;
  packageManager?: string;
  verbose?: boolean;
}

interface AppConfig {
  name: string;
  template: string;
  frameworkVersion: string;
  registry: string;
  initGit: boolean;
  cicd: string;
  deployTarget: string;
  packageManager: string;
}

/**
 * Detect which package manager is available
 */
async function detectPackageManager(): Promise<string> {
  const managers = ['pnpm', 'yarn', 'npm'];

  for (const manager of managers) {
    try {
      await execa(manager, ['--version']);
      return manager;
    } catch {
      continue;
    }
  }

  return 'npm'; // fallback
}

/**
 * Validate registry URL
 */
function isValidRegistryUrl(url: string): boolean {
  try {
    const parsed = new URL(url);
    return parsed.protocol === 'https:' || parsed.protocol === 'http:';
  } catch {
    return false;
  }
}

/**
 * Create a spinner with consistent styling
 */
function createSpinner(text: string): Ora {
  return ora({
    text,
    color: 'cyan',
    spinner: 'dots',
  });
}

/**
 * Log message based on verbose flag
 */
function log(message: string, options: CreateAppOptions): void {
  if (options.verbose) {
    console.log(chalk.gray(`[INFO] ${message}`));
  }
}

export async function createApp(name: string, options: CreateAppOptions) {
  const cwd = process.cwd();
  const appPath = path.join(cwd, name);

  log('Starting application creation process', options);

  // Check if directory exists
  if (await fs.pathExists(appPath)) {
    console.error(chalk.red(`\n❌ Error: Directory "${name}" already exists\n`));
    console.error(
      chalk.yellow('Please choose a different name or remove the existing directory.\n')
    );
    process.exit(1);
  }

  // Detect package manager
  const detectedPM = options.packageManager || (await detectPackageManager());
  log(`Detected package manager: ${detectedPM}`, options);

  // Interactive prompts
  const answers = await inquirer.prompt([
    {
      type: 'list',
      name: 'template',
      message: 'Select application template:',
      choices: [
        {
          name: 'Blank (Minimal setup) - Recommended for new projects',
          value: 'blank',
        },
        {
          name: 'Integration Portal (Developer portal with API documentation)',
          value: 'integration-portal',
        },
        {
          name: 'CRM Application (Customer relationship management system)',
          value: 'crm',
        },
        {
          name: 'Admin Dashboard (Admin panel with user management)',
          value: 'admin-dashboard',
        },
      ],
      default: options.template || 'blank',
      when: !options.template,
    },
    {
      type: 'list',
      name: 'frameworkVersion',
      message: 'Select framework version:',
      choices: [
        { name: 'Latest (recommended) - Always use the newest version', value: 'latest' },
        { name: 'Specific version - Pin to a specific version', value: 'specific' },
      ],
      default: 'latest',
      when: !options.frameworkVersion,
    },
    {
      type: 'input',
      name: 'specificVersion',
      message: 'Enter specific version (e.g., 1.0.0):',
      when: (answers) => answers.frameworkVersion === 'specific',
      default: '1.0.0',
      validate: (input) => {
        if (!/^\d+\.\d+\.\d+(-[\w.]+)?$/.test(input)) {
          return 'Please enter a valid semver version (e.g., 1.0.0)';
        }
        return true;
      },
    },
    {
      type: 'list',
      name: 'registry',
      message: 'Select package registry:',
      choices: [
        { name: 'npm (Public registry)', value: 'https://registry.npmjs.org' },
        { name: 'GitHub Packages (Private registry)', value: 'https://npm.pkg.github.com' },
        { name: 'Custom registry', value: 'custom' },
      ],
      default: options.registry || 'https://registry.npmjs.org',
      when: !options.registry,
    },
    {
      type: 'input',
      name: 'customRegistry',
      message: 'Enter custom registry URL (e.g., https://npm.company.com):',
      when: (answers) => answers.registry === 'custom',
      validate: (input) => {
        if (!isValidRegistryUrl(input)) {
          return 'Please enter a valid HTTPS or HTTP URL';
        }
        return true;
      },
    },
    {
      type: 'confirm',
      name: 'initGit',
      message: 'Initialize Git repository?',
      default: !options.skipGit,
    },
    {
      type: 'list',
      name: 'cicd',
      message: 'Select CI/CD platform:',
      choices: [
        { name: 'GitHub Actions (Recommended for GitHub)', value: 'github' },
        { name: 'GitLab CI (For GitLab repositories)', value: 'gitlab' },
        { name: 'None (Skip CI/CD setup)', value: 'none' },
      ],
      default: 'github',
    },
    {
      type: 'list',
      name: 'deployTarget',
      message: 'Select deployment target:',
      choices: [
        { name: 'Vercel (Recommended for Next.js/React)', value: 'vercel' },
        { name: 'AWS (Amazon Web Services)', value: 'aws' },
        { name: 'Docker (Containerized deployment)', value: 'docker' },
        { name: 'None (Manual deployment)', value: 'none' },
      ],
      default: 'vercel',
    },
  ]);

  const config: AppConfig = {
    name,
    template: options.template || answers.template,
    frameworkVersion:
      options.frameworkVersion || answers.specificVersion || answers.frameworkVersion,
    registry: options.registry || answers.customRegistry || answers.registry,
    initGit: answers.initGit,
    cicd: answers.cicd,
    deployTarget: answers.deployTarget,
    packageManager: detectedPM,
  };

  log(`Configuration: ${JSON.stringify(config, null, 2)}`, options);

  console.log(chalk.blue.bold('\n📁 Creating application structure...\n'));

  await createAppStructure(appPath, config, options);

  if (!options.skipInstall) {
    const spinner = createSpinner(
      `Installing dependencies with ${config.packageManager}...`
    ).start();
    try {
      await execa(config.packageManager, ['install'], { cwd: appPath });
      spinner.succeed(chalk.green('Dependencies installed successfully'));
    } catch (error) {
      spinner.fail(chalk.red('Failed to install dependencies'));
      console.error(chalk.yellow('\nYou can install dependencies manually by running:'));
      console.error(chalk.cyan(`  cd ${name} && ${config.packageManager} install\n`));
      if (options.verbose && error instanceof Error) {
        console.error(chalk.gray(error.message));
      }
    }
  }

  if (config.initGit) {
    const spinner = createSpinner('Initializing Git repository...').start();
    try {
      await execa('git', ['init'], { cwd: appPath });
      await execa('git', ['add', '.'], { cwd: appPath });
      await execa('git', ['commit', '-m', 'chore: initial commit from create-longvhv-app'], {
        cwd: appPath,
      });
      spinner.succeed(chalk.green('Git repository initialized'));
    } catch (error) {
      spinner.fail(chalk.red('Failed to initialize Git'));
      if (options.verbose && error instanceof Error) {
        console.error(chalk.gray(error.message));
      }
    }
  }

  // Success message
  console.log(chalk.green.bold(`\n✅ Successfully created "${name}"!\n`));
  console.log(chalk.white.bold('📖 Next steps:\n'));
  console.log(chalk.cyan(`  1. cd ${name}`));
  if (options.skipInstall) {
    console.log(chalk.cyan(`  2. ${config.packageManager} install`));
    console.log(chalk.cyan(`  3. ${config.packageManager} run dev`));
  } else {
    console.log(chalk.cyan(`  2. ${config.packageManager} run dev`));
  }
  console.log(chalk.white('\n📚 Documentation:'));
  console.log(chalk.gray('  https://github.com/longvhv/saas-framework-react\n'));
  console.log(chalk.green('Happy coding! 🚀\n'));
}

async function createAppStructure(appPath: string, config: AppConfig, options: CreateAppOptions) {
  await fs.ensureDir(appPath);

  log('Creating directory structure', options);

  // Create directories
  await Promise.all([
    fs.ensureDir(path.join(appPath, 'src')),
    fs.ensureDir(path.join(appPath, 'src/modules')),
    fs.ensureDir(path.join(appPath, 'src/components')),
    fs.ensureDir(path.join(appPath, 'src/hooks')),
    fs.ensureDir(path.join(appPath, 'src/utils')),
    fs.ensureDir(path.join(appPath, 'src/types')),
    fs.ensureDir(path.join(appPath, 'public')),
    fs.ensureDir(path.join(appPath, 'scripts')),
  ]);

  if (config.cicd === 'github') {
    await fs.ensureDir(path.join(appPath, '.github/workflows'));
  }

  log('Creating package.json', options);

  // Create package.json with complete metadata
  const packageJson = {
    name: config.name,
    version: '0.1.0',
    private: true,
    type: 'module',
    description: `SaaS application built with the @longvhv framework`,
    author: '',
    license: 'MIT',
    scripts: {
      dev: 'vite',
      build: 'vite build',
      preview: 'vite preview',
      test: 'vitest',
      'test:ui': 'vitest --ui',
      'test:coverage': 'vitest --coverage',
      lint: 'eslint src --ext ts,tsx',
      'lint:fix': 'eslint src --ext ts,tsx --fix',
      format: 'prettier --write "src/**/*.{ts,tsx,json,css,md}"',
      'format:check': 'prettier --check "src/**/*.{ts,tsx,json,css,md}"',
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
      '@typescript-eslint/eslint-plugin': '^6.0.0',
      '@typescript-eslint/parser': '^6.0.0',
      '@vitejs/plugin-react': '^4.2.0',
      '@vitest/ui': '^1.0.0',
      eslint: '^8.0.0',
      'eslint-config-prettier': '^9.0.0',
      'eslint-plugin-react': '^7.33.0',
      'eslint-plugin-react-hooks': '^4.6.0',
      prettier: '^3.0.0',
      typescript: '^5.3.0',
      vite: '^5.0.0',
      vitest: '^1.0.0',
      tailwindcss: '^3.4.0',
      autoprefixer: '^10.4.0',
      postcss: '^8.4.0',
    },
    engines: {
      node: '>=18.0.0',
    },
  };

  await fs.writeJson(path.join(appPath, 'package.json'), packageJson, { spaces: 2 });

  // Create .npmrc if using private registry
  if (config.registry !== 'https://registry.npmjs.org') {
    log('Creating .npmrc for private registry', options);
    const npmrc = `@longvhv:registry=${config.registry}
${config.registry.replace('https://', '//')}/:_authToken=\${NPM_TOKEN}`;
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

  log('Creating ESLint configuration', options);

  // Create .eslintrc.json
  const eslintConfig = {
    root: true,
    env: {
      browser: true,
      es2020: true,
    },
    extends: [
      'eslint:recommended',
      'plugin:@typescript-eslint/recommended',
      'plugin:react/recommended',
      'plugin:react-hooks/recommended',
      'prettier',
    ],
    ignorePatterns: ['dist', '.eslintrc.json'],
    parser: '@typescript-eslint/parser',
    parserOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      ecmaFeatures: {
        jsx: true,
      },
    },
    plugins: ['react', '@typescript-eslint', 'react-hooks'],
    rules: {
      'react/react-in-jsx-scope': 'off',
      '@typescript-eslint/no-explicit-any': 'warn',
      '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
    },
    settings: {
      react: {
        version: 'detect',
      },
    },
  };

  await fs.writeJson(path.join(appPath, '.eslintrc.json'), eslintConfig, { spaces: 2 });

  log('Creating Prettier configuration', options);

  // Create .prettierrc
  const prettierConfig = {
    semi: true,
    trailingComma: 'es5',
    singleQuote: true,
    printWidth: 100,
    tabWidth: 2,
    useTabs: false,
    arrowParens: 'always',
    endOfLine: 'lf',
  };

  await fs.writeJson(path.join(appPath, '.prettierrc'), prettierConfig, { spaces: 2 });

  // Create .prettierignore
  const prettierIgnore = `# Build output
dist
build
.next
out

# Dependencies
node_modules
.pnpm-store

# Generated files
*.min.js
*.min.css
coverage

# Config files
package-lock.json
pnpm-lock.yaml
yarn.lock`;

  await fs.writeFile(path.join(appPath, '.prettierignore'), prettierIgnore);

  log('Creating PostCSS configuration', options);

  // Create postcss.config.js
  const postcssConfig = `export default {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
};`;

  await fs.writeFile(path.join(appPath, 'postcss.config.js'), postcssConfig);

  log('Creating EditorConfig', options);

  // Create .editorconfig
  const editorConfig = `# EditorConfig helps maintain consistent coding styles
# https://editorconfig.org

root = true

[*]
charset = utf-8
end_of_line = lf
indent_style = space
indent_size = 2
insert_final_newline = true
trim_trailing_whitespace = true

[*.md]
trim_trailing_whitespace = false

[*.{json,yml,yaml}]
indent_size = 2`;

  await fs.writeFile(path.join(appPath, '.editorconfig'), editorConfig);

  log('Creating VSCode settings', options);

  // Create .vscode/settings.json
  await fs.ensureDir(path.join(appPath, '.vscode'));
  const vscodeSettings = {
    'editor.formatOnSave': true,
    'editor.defaultFormatter': 'esbenp.prettier-vscode',
    'editor.codeActionsOnSave': {
      'source.fixAll.eslint': 'explicit',
    },
    'typescript.tsdk': 'node_modules/typescript/lib',
    'typescript.enablePromptUseWorkspaceTsdk': true,
  };

  await fs.writeJson(path.join(appPath, '.vscode/settings.json'), vscodeSettings, {
    spaces: 2,
  });

  // Create .vscode/extensions.json
  const vscodeExtensions = {
    recommendations: [
      'dbaeumer.vscode-eslint',
      'esbenp.prettier-vscode',
      'bradlc.vscode-tailwindcss',
    ],
  };

  await fs.writeJson(path.join(appPath, '.vscode/extensions.json'), vscodeExtensions, {
    spaces: 2,
  });
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
