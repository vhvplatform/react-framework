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
  enableMicroservices?: boolean;
  k8sNamespace?: string;
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
        { name: 'Kubernetes (Microservices on K8s)', value: 'kubernetes' },
        { name: 'Vercel (Serverless React apps)', value: 'vercel' },
        { name: 'AWS (Amazon Web Services)', value: 'aws' },
        { name: 'Docker (Containerized deployment)', value: 'docker' },
        { name: 'None (Manual deployment)', value: 'none' },
      ],
      default: 'kubernetes',
    },
    {
      type: 'confirm',
      name: 'enableMicroservices',
      message: 'Enable microservices architecture features?',
      default: true,
      when: (answers) => answers.deployTarget === 'kubernetes',
    },
    {
      type: 'input',
      name: 'k8sNamespace',
      message: 'Kubernetes namespace (default: default):',
      default: 'default',
      when: (answers) => answers.deployTarget === 'kubernetes',
      validate: (input) => {
        if (!/^[a-z0-9]([-a-z0-9]*[a-z0-9])?$/.test(input)) {
          return 'Namespace must contain only lowercase alphanumeric characters or hyphens';
        }
        return true;
      },
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
    enableMicroservices: answers.enableMicroservices,
    k8sNamespace: answers.k8sNamespace || 'default',
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

  // Create Kubernetes manifests
  if (config.deployTarget === 'kubernetes') {
    log('Creating Kubernetes deployment files', options);
    await createKubernetesManifests(appPath, config);
  }

  // Create Dockerfile for containerized deployments
  if (['kubernetes', 'docker'].includes(config.deployTarget)) {
    log('Creating Dockerfile', options);
    await createDockerfile(appPath, config);
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

  if (config.deployTarget === 'kubernetes') {
    const k8sDeployYml = `name: Deploy to Kubernetes

on:
  push:
    branches: [main]

env:
  REGISTRY: ghcr.io
  IMAGE_NAME: \${{ github.repository }}

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    permissions:
      contents: read
      packages: write
    
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
      
      - name: Build application
        run: npm run build
      
      - name: Log in to Container Registry
        uses: docker/login-action@v3
        with:
          registry: \${{ env.REGISTRY }}
          username: \${{ github.actor }}
          password: \${{ secrets.GITHUB_TOKEN }}
      
      - name: Extract metadata
        id: meta
        uses: docker/metadata-action@v5
        with:
          images: \${{ env.REGISTRY }}/\${{ env.IMAGE_NAME }}
          tags: |
            type=ref,event=branch
            type=sha,prefix={{branch}}-
            type=semver,pattern={{version}}
      
      - name: Build and push Docker image
        uses: docker/build-push-action@v5
        with:
          context: .
          push: true
          tags: \${{ steps.meta.outputs.tags }}
          labels: \${{ steps.meta.outputs.labels }}
      
      - name: Setup kubectl
        uses: azure/setup-kubectl@v3
        with:
          version: 'latest'
      
      - name: Configure kubectl
        run: |
          mkdir -p $HOME/.kube
          echo "${'$'}{{ secrets.KUBECONFIG }}" | base64 -d > $HOME/.kube/config
      
      - name: Deploy to Kubernetes
        run: |
          kubectl set image deployment/${config.name} ${config.name}=${'$'}{{ env.REGISTRY }}/${'$'}{{ env.IMAGE_NAME }}:sha-${'$'}{{ github.sha }} -n ${config.k8sNamespace}
          kubectl rollout status deployment/${config.name} -n ${config.k8sNamespace}`;

    await fs.writeFile(path.join(appPath, '.github/workflows/k8s-deploy.yml'), k8sDeployYml);
  }
}

/**
 * Create Kubernetes deployment manifests
 */
async function createKubernetesManifests(appPath: string, config: AppConfig) {
  await fs.ensureDir(path.join(appPath, 'k8s'));

  // Create Deployment manifest
  const deployment = `apiVersion: apps/v1
kind: Deployment
metadata:
  name: ${config.name}
  namespace: ${config.k8sNamespace}
  labels:
    app: ${config.name}
    version: v1
spec:
  replicas: 3
  selector:
    matchLabels:
      app: ${config.name}
  template:
    metadata:
      labels:
        app: ${config.name}
        version: v1
    spec:
      containers:
      - name: ${config.name}
        image: ghcr.io/YOUR_ORG/${config.name}:latest
        imagePullPolicy: Always
        ports:
        - containerPort: 3000
          name: http
          protocol: TCP
        env:
        - name: NODE_ENV
          value: "production"
        - name: VITE_API_URL
          valueFrom:
            configMapKeyRef:
              name: ${config.name}-config
              key: api-url
        resources:
          requests:
            memory: "256Mi"
            cpu: "250m"
          limits:
            memory: "512Mi"
            cpu: "500m"
        livenessProbe:
          httpGet:
            path: /health
            port: 3000
          initialDelaySeconds: 30
          periodSeconds: 10
          timeoutSeconds: 5
          failureThreshold: 3
        readinessProbe:
          httpGet:
            path: /ready
            port: 3000
          initialDelaySeconds: 10
          periodSeconds: 5
          timeoutSeconds: 3
          failureThreshold: 3
      restartPolicy: Always
---
apiVersion: v1
kind: Service
metadata:
  name: ${config.name}
  namespace: ${config.k8sNamespace}
  labels:
    app: ${config.name}
spec:
  type: ClusterIP
  ports:
  - port: 80
    targetPort: 3000
    protocol: TCP
    name: http
  selector:
    app: ${config.name}
---
apiVersion: v1
kind: ConfigMap
metadata:
  name: ${config.name}-config
  namespace: ${config.k8sNamespace}
data:
  api-url: "http://api-service/api"
  app-name: "${config.name}"
---
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: ${config.name}
  namespace: ${config.k8sNamespace}
  annotations:
    kubernetes.io/ingress.class: nginx
    cert-manager.io/cluster-issuer: letsencrypt-prod
spec:
  tls:
  - hosts:
    - ${config.name}.yourdomain.com
    secretName: ${config.name}-tls
  rules:
  - host: ${config.name}.yourdomain.com
    http:
      paths:
      - path: /
        pathType: Prefix
        backend:
          service:
            name: ${config.name}
            port:
              number: 80
`;

  await fs.writeFile(path.join(appPath, 'k8s/deployment.yaml'), deployment);

  // Create HorizontalPodAutoscaler
  const hpa = `apiVersion: autoscaling/v2
kind: HorizontalPodAutoscaler
metadata:
  name: ${config.name}
  namespace: ${config.k8sNamespace}
spec:
  scaleTargetRef:
    apiVersion: apps/v1
    kind: Deployment
    name: ${config.name}
  minReplicas: 2
  maxReplicas: 10
  metrics:
  - type: Resource
    resource:
      name: cpu
      target:
        type: Utilization
        averageUtilization: 70
  - type: Resource
    resource:
      name: memory
      target:
        type: Utilization
        averageUtilization: 80
`;

  await fs.writeFile(path.join(appPath, 'k8s/hpa.yaml'), hpa);

  // Create kustomization.yaml
  const kustomization = `apiVersion: kustomize.config.k8s.io/v1beta1
kind: Kustomization

namespace: ${config.k8sNamespace}

resources:
  - deployment.yaml
  - hpa.yaml

commonLabels:
  app: ${config.name}
  managed-by: kustomize

images:
  - name: ghcr.io/YOUR_ORG/${config.name}
    newTag: latest
`;

  await fs.writeFile(path.join(appPath, 'k8s/kustomization.yaml'), kustomization);

  if (config.enableMicroservices) {
    // Create Service Mesh configuration (Istio example)
    const virtualService = `apiVersion: networking.istio.io/v1beta1
kind: VirtualService
metadata:
  name: ${config.name}
  namespace: ${config.k8sNamespace}
spec:
  hosts:
  - ${config.name}
  - ${config.name}.${config.k8sNamespace}.svc.cluster.local
  http:
  - match:
    - uri:
        prefix: /
    route:
    - destination:
        host: ${config.name}
        port:
          number: 80
      weight: 100
    timeout: 30s
    retries:
      attempts: 3
      perTryTimeout: 10s
`;

    await fs.writeFile(path.join(appPath, 'k8s/virtual-service.yaml'), virtualService);

    // Create DestinationRule for traffic policy
    const destinationRule = `apiVersion: networking.istio.io/v1beta1
kind: DestinationRule
metadata:
  name: ${config.name}
  namespace: ${config.k8sNamespace}
spec:
  host: ${config.name}
  trafficPolicy:
    loadBalancer:
      simple: LEAST_REQUEST
    connectionPool:
      tcp:
        maxConnections: 100
      http:
        http1MaxPendingRequests: 50
        http2MaxRequests: 100
        maxRequestsPerConnection: 2
    outlierDetection:
      consecutiveErrors: 5
      interval: 30s
      baseEjectionTime: 30s
      maxEjectionPercent: 50
`;

    await fs.writeFile(path.join(appPath, 'k8s/destination-rule.yaml'), destinationRule);
  }

  // Create Helm chart structure
  await fs.ensureDir(path.join(appPath, 'helm', config.name));
  await fs.ensureDir(path.join(appPath, 'helm', config.name, 'templates'));

  const helmChart = `apiVersion: v2
name: ${config.name}
description: A Helm chart for ${config.name} microservice
type: application
version: 0.1.0
appVersion: "1.0.0"
keywords:
  - saas
  - microservice
  - react
maintainers:
  - name: Your Team
    email: team@example.com
`;

  await fs.writeFile(path.join(appPath, 'helm', config.name, 'Chart.yaml'), helmChart);

  const helmValues = `# Default values for ${config.name}
replicaCount: 3

image:
  repository: ghcr.io/YOUR_ORG/${config.name}
  pullPolicy: IfNotPresent
  tag: "latest"

service:
  type: ClusterIP
  port: 80
  targetPort: 3000

ingress:
  enabled: true
  className: nginx
  annotations:
    cert-manager.io/cluster-issuer: letsencrypt-prod
  hosts:
    - host: ${config.name}.yourdomain.com
      paths:
        - path: /
          pathType: Prefix
  tls:
    - secretName: ${config.name}-tls
      hosts:
        - ${config.name}.yourdomain.com

resources:
  limits:
    cpu: 500m
    memory: 512Mi
  requests:
    cpu: 250m
    memory: 256Mi

autoscaling:
  enabled: true
  minReplicas: 2
  maxReplicas: 10
  targetCPUUtilizationPercentage: 70
  targetMemoryUtilizationPercentage: 80

env:
  - name: NODE_ENV
    value: production
  - name: VITE_API_URL
    value: http://api-service/api

serviceAccount:
  create: true
  name: ${config.name}

podSecurityContext:
  runAsNonRoot: true
  runAsUser: 1000
  fsGroup: 1000

securityContext:
  allowPrivilegeEscalation: false
  readOnlyRootFilesystem: false
  capabilities:
    drop:
    - ALL
`;

  await fs.writeFile(path.join(appPath, 'helm', config.name, 'values.yaml'), helmValues);

  // Create deployment README
  const k8sReadme = `# Kubernetes Deployment

## Prerequisites

- Kubernetes cluster (v1.24+)
- kubectl configured
- Docker installed (for building images)
${config.enableMicroservices ? '- Istio service mesh (optional but recommended)' : ''}

## Quick Start

### 1. Build Docker Image

\`\`\`bash
docker build -t ${config.name}:latest .
docker tag ${config.name}:latest ghcr.io/YOUR_ORG/${config.name}:latest
docker push ghcr.io/YOUR_ORG/${config.name}:latest
\`\`\`

### 2. Deploy to Kubernetes

Using kubectl:

\`\`\`bash
# Create namespace if needed
kubectl create namespace ${config.k8sNamespace}

# Apply manifests
kubectl apply -f k8s/deployment.yaml
kubectl apply -f k8s/hpa.yaml

# Check status
kubectl get pods -n ${config.k8sNamespace}
kubectl get svc -n ${config.k8sNamespace}
\`\`\`

Using Helm:

\`\`\`bash
# Install
helm install ${config.name} ./helm/${config.name} -n ${config.k8sNamespace} --create-namespace

# Upgrade
helm upgrade ${config.name} ./helm/${config.name} -n ${config.k8sNamespace}

# Uninstall
helm uninstall ${config.name} -n ${config.k8sNamespace}
\`\`\`

Using Kustomize:

\`\`\`bash
kubectl apply -k k8s/
\`\`\`

### 3. Access the Application

\`\`\`bash
# Port forward for local testing
kubectl port-forward svc/${config.name} 8080:80 -n ${config.k8sNamespace}

# Access at http://localhost:8080
\`\`\`

## Configuration

### Environment Variables

Edit \`k8s/deployment.yaml\` or \`helm/${config.name}/values.yaml\` to configure:

- \`VITE_API_URL\`: Backend API URL
- \`NODE_ENV\`: Environment (production/development)

### Resources

Adjust CPU and memory limits in deployment manifest:

\`\`\`yaml
resources:
  requests:
    memory: "256Mi"
    cpu: "250m"
  limits:
    memory: "512Mi"
    cpu: "500m"
\`\`\`

### Scaling

Horizontal Pod Autoscaler is configured to scale based on CPU and memory usage.

Manual scaling:

\`\`\`bash
kubectl scale deployment/${config.name} --replicas=5 -n ${config.k8sNamespace}
\`\`\`

## Health Checks

The application exposes health check endpoints:

- \`/health\`: Liveness probe
- \`/ready\`: Readiness probe

Implement these endpoints in your application.

## Monitoring

### Logs

\`\`\`bash
# View logs
kubectl logs -f deployment/${config.name} -n ${config.k8sNamespace}

# View logs from all pods
kubectl logs -l app=${config.name} -n ${config.k8sNamespace} --tail=100
\`\`\`

### Metrics

If Prometheus is installed:

\`\`\`bash
# View metrics
kubectl port-forward svc/prometheus 9090:9090
\`\`\`

${
  config.enableMicroservices
    ? `
## Service Mesh (Istio)

### Install Istio

\`\`\`bash
# Install Istio
istioctl install --set profile=default -y

# Enable sidecar injection
kubectl label namespace ${config.k8sNamespace} istio-injection=enabled
\`\`\`

### Apply Service Mesh Configuration

\`\`\`bash
kubectl apply -f k8s/virtual-service.yaml
kubectl apply -f k8s/destination-rule.yaml
\`\`\`

### Traffic Management

View traffic in Kiali dashboard:

\`\`\`bash
istioctl dashboard kiali
\`\`\`
`
    : ''
}

## CI/CD

GitHub Actions workflow is configured at \`.github/workflows/k8s-deploy.yml\`.

Required secrets:
- \`KUBECONFIG\`: Base64-encoded kubeconfig file
- \`NPM_TOKEN\`: NPM authentication token (if using private registry)

## Troubleshooting

### Pods not starting

\`\`\`bash
kubectl describe pod <pod-name> -n ${config.k8sNamespace}
kubectl logs <pod-name> -n ${config.k8sNamespace}
\`\`\`

### Service not accessible

\`\`\`bash
kubectl get svc -n ${config.k8sNamespace}
kubectl get ingress -n ${config.k8sNamespace}
\`\`\`

### Check events

\`\`\`bash
kubectl get events -n ${config.k8sNamespace} --sort-by='.lastTimestamp'
\`\`\`

## Best Practices

1. **Use namespaces** to isolate environments (dev, staging, prod)
2. **Set resource limits** to prevent resource exhaustion
3. **Enable autoscaling** for dynamic workload handling
4. **Configure health checks** for automatic recovery
5. **Use ConfigMaps** for configuration management
6. **Use Secrets** for sensitive data
7. **Implement monitoring** with Prometheus and Grafana
8. **Use Helm** for easier deployment management
9. **Enable service mesh** for advanced traffic management
10. **Follow 12-factor app** principles

## References

- [Kubernetes Documentation](https://kubernetes.io/docs/)
- [Helm Documentation](https://helm.sh/docs/)
- [Istio Documentation](https://istio.io/latest/docs/)
- [Kustomize Documentation](https://kustomize.io/)
`;

  await fs.writeFile(path.join(appPath, 'k8s/README.md'), k8sReadme);
}

/**
 * Create Dockerfile for containerization
 */
async function createDockerfile(appPath: string, config: AppConfig) {
  const dockerfile = `# Multi-stage build for optimized image size

# Stage 1: Build
FROM node:20-alpine AS builder

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci --only=production && \\
    npm cache clean --force

# Copy source code
COPY . .

# Build application
RUN npm run build

# Stage 2: Production
FROM nginx:alpine AS production

# Install Node.js for server-side rendering (optional)
RUN apk add --no-cache nodejs npm

# Copy built application
COPY --from=builder /app/dist /usr/share/nginx/html

# Copy nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Add health check script
COPY healthcheck.sh /usr/local/bin/healthcheck.sh
RUN chmod +x /usr/local/bin/healthcheck.sh

# Create non-root user
RUN addgroup -g 1000 appuser && \\
    adduser -D -u 1000 -G appuser appuser && \\
    chown -R appuser:appuser /usr/share/nginx/html && \\
    chown -R appuser:appuser /var/cache/nginx && \\
    chown -R appuser:appuser /var/log/nginx && \\
    touch /var/run/nginx.pid && \\
    chown -R appuser:appuser /var/run/nginx.pid

USER appuser

# Expose port
EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=40s --retries=3 \\
  CMD /usr/local/bin/healthcheck.sh

# Start nginx
CMD ["nginx", "-g", "daemon off;"]
`;

  await fs.writeFile(path.join(appPath, 'Dockerfile'), dockerfile);

  // Create nginx configuration
  const nginxConf = `server {
    listen 3000;
    server_name _;
    root /usr/share/nginx/html;
    index index.html;

    # Gzip compression
    gzip on;
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml application/xml+rss text/javascript;
    gzip_min_length 1000;

    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header Referrer-Policy "no-referrer-when-downgrade" always;

    # SPA routing - serve index.html for all routes
    location / {
        try_files $uri $uri/ /index.html;
    }

    # Health check endpoint
    location /health {
        access_log off;
        return 200 "healthy\\n";
        add_header Content-Type text/plain;
    }

    # Readiness check endpoint
    location /ready {
        access_log off;
        return 200 "ready\\n";
        add_header Content-Type text/plain;
    }

    # Cache static assets
    location ~* \\.(jpg|jpeg|png|gif|ico|css|js|svg|woff|woff2|ttf|eot)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}
`;

  await fs.writeFile(path.join(appPath, 'nginx.conf'), nginxConf);

  // Create health check script
  const healthcheck = `#!/bin/sh
# Health check script for Docker container

# Check if nginx is running
if ! pgrep nginx > /dev/null; then
    echo "nginx is not running"
    exit 1
fi

# Check if application responds
if ! wget --quiet --tries=1 --spider http://localhost:3000/health; then
    echo "Application health check failed"
    exit 1
fi

echo "Container is healthy"
exit 0
`;

  await fs.writeFile(path.join(appPath, 'healthcheck.sh'), healthcheck);

  // Create .dockerignore
  const dockerignore = `node_modules
npm-debug.log
.git
.gitignore
.env
.env.local
.env.*.local
dist
coverage
.vscode
.idea
*.log
.DS_Store
README.md
.editorconfig
.prettierrc
.eslintrc.json
k8s
helm
.github
`;

  await fs.writeFile(path.join(appPath, '.dockerignore'), dockerignore);

  // Create Docker Compose for local development
  const dockerCompose = `version: '3.8'

services:
  ${config.name}:
    build:
      context: .
      dockerfile: Dockerfile
    container_name: ${config.name}
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
      - VITE_API_URL=http://api:8080
    networks:
      - app-network
    restart: unless-stopped
    healthcheck:
      test: ["CMD", "/usr/local/bin/healthcheck.sh"]
      interval: 30s
      timeout: 10s
      retries: 3
      start_period: 40s

networks:
  app-network:
    driver: bridge
`;

  await fs.writeFile(path.join(appPath, 'docker-compose.yml'), dockerCompose);
}
