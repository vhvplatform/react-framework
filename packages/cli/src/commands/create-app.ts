import inquirer from 'inquirer';
import chalk from 'chalk';
import ora from 'ora';
import fs from 'fs/promises';
import path from 'path';

interface CreateAppAnswers {
  appName: string;
  apiUrl: string;
  enableAuth: boolean;
  enableOAuth: boolean;
  oauthProviders: string[];
}

export async function createApp(name?: string) {
  console.log(chalk.blue.bold('\n🚀 SaaS Framework - Create App\n'));

  // Prompt for app details
  const answers = await inquirer.prompt<CreateAppAnswers>([
    {
      type: 'input',
      name: 'appName',
      message: 'Application name:',
      default: name || 'my-saas-app',
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
      message: 'API URL (from @longvhv/saas-framework-go):',
      default: 'http://localhost:8080',
    },
    {
      type: 'confirm',
      name: 'enableAuth',
      message: 'Enable authentication?',
      default: true,
    },
    {
      type: 'confirm',
      name: 'enableOAuth',
      message: 'Enable OAuth authentication?',
      default: true,
      when: (answers) => answers.enableAuth,
    },
    {
      type: 'checkbox',
      name: 'oauthProviders',
      message: 'Select OAuth providers:',
      choices: ['google', 'github'],
      default: ['google'],
      when: (answers) => answers.enableAuth && answers.enableOAuth,
    },
  ]);

  const { appName, apiUrl, enableAuth, enableOAuth, oauthProviders } = answers;

  const spinner = ora('Creating application...').start();

  try {
    // Create app directory
    const appPath = path.join(process.cwd(), appName);
    await fs.mkdir(appPath, { recursive: true });

    // Create directories
    await fs.mkdir(path.join(appPath, 'src'), { recursive: true });
    await fs.mkdir(path.join(appPath, 'src', 'modules'), { recursive: true });
    await fs.mkdir(path.join(appPath, 'public'), { recursive: true });

    // Create package.json
    const packageJson = {
      name: appName,
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
        ...(enableAuth && { '@longvhv/auth': 'workspace:*' }),
        '@longvhv/ui-components': 'workspace:*',
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

    await fs.writeFile(
      path.join(appPath, 'package.json'),
      JSON.stringify(packageJson, null, 2)
    );

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
      references: [{ path: './tsconfig.node.json' }],
    };

    await fs.writeFile(path.join(appPath, 'tsconfig.json'), JSON.stringify(tsConfig, null, 2));

    // Create tsconfig.node.json
    const tsConfigNode = {
      compilerOptions: {
        composite: true,
        skipLibCheck: true,
        module: 'ESNext',
        moduleResolution: 'bundler',
        allowSyntheticDefaultImports: true,
      },
      include: ['vite.config.ts'],
    };

    await fs.writeFile(
      path.join(appPath, 'tsconfig.node.json'),
      JSON.stringify(tsConfigNode, null, 2)
    );

    // Create vite.config.ts
    const viteConfig = `import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
  },
});
`;

    await fs.writeFile(path.join(appPath, 'vite.config.ts'), viteConfig);

    // Create tailwind.config.js
    const tailwindConfig = `/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {},
  },
  plugins: [],
};
`;

    await fs.writeFile(path.join(appPath, 'tailwind.config.js'), tailwindConfig);

    // Create postcss.config.js
    const postcssConfig = `export default {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
};
`;

    await fs.writeFile(path.join(appPath, 'postcss.config.js'), postcssConfig);

    // Create index.html
    const indexHtml = `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/svg+xml" href="/vite.svg" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>${appName}</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>
`;

    await fs.writeFile(path.join(appPath, 'index.html'), indexHtml);

    // Create src/main.tsx
    const mainTsx = `import React from 'react';
import ReactDOM from 'react-dom/client';
import { Application } from '@longvhv/core';
import { ApiProvider } from '@longvhv/api-client';
${enableAuth ? "import { authReducer } from '@longvhv/auth';" : ''}
import App from './App';
import './index.css';

// API Configuration
const apiConfig = {
  baseURL: '${apiUrl}',
  getToken: () => localStorage.getItem('saas_auth_token'),
  setToken: (token: string | null) => {
    if (token) {
      localStorage.setItem('saas_auth_token', token);
    } else {
      localStorage.removeItem('saas_auth_token');
    }
  },
  onUnauthorized: () => {
    window.location.href = '/login';
  },
};

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ApiProvider config={apiConfig}>
      <Application
        config={{
          name: '${appName}',
          apiUrl: '${apiUrl}',
          enableDevTools: true,
        }}
        modules={[
          ${
            enableAuth
              ? `{
            id: 'auth',
            name: 'Authentication',
            version: '1.0.0',
            reducer: authReducer,
          },`
              : ''
          }
        ]}
      >
        <App />
      </Application>
    </ApiProvider>
  </React.StrictMode>
);
`;

    await fs.writeFile(path.join(appPath, 'src', 'main.tsx'), mainTsx);

    // Create src/App.tsx
    const appTsx = `import { Routes, Route, Link } from 'react-router-dom';
${enableAuth ? "import { LoginForm, ProtectedRoute } from '@longvhv/auth';" : ''}
import { Button, Card } from '@longvhv/ui-components';

function HomePage() {
  return (
    <div className="container mx-auto p-8">
      <Card title="Welcome to ${appName}">
        <p className="mb-4">Your SaaS application is ready!</p>
        <Button variant="primary">Get Started</Button>
      </Card>
    </div>
  );
}

${
  enableAuth
    ? `
function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="w-full max-w-md">
        <Card>
          <LoginForm onSuccess={() => (window.location.href = '/')} />
        </Card>
      </div>
    </div>
  );
}
`
    : ''
}

function App() {
  return (
    <div>
      <nav className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-4">
          <Link to="/" className="text-xl font-bold text-blue-600">
            ${appName}
          </Link>
        </div>
      </nav>

      <Routes>
        <Route path="/" element={${enableAuth ? '<ProtectedRoute>' : ''}<HomePage />${enableAuth ? '</ProtectedRoute>' : ''}} />
        ${enableAuth ? '<Route path="/login" element={<LoginPage />} />' : ''}
      </Routes>
    </div>
  );
}

export default App;
`;

    await fs.writeFile(path.join(appPath, 'src', 'App.tsx'), appTsx);

    // Create src/index.css
    const indexCss = `@tailwind base;
@tailwind components;
@tailwind utilities;

body {
  margin: 0;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen',
    'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue',
    sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
`;

    await fs.writeFile(path.join(appPath, 'src', 'index.css'), indexCss);

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
    const readme = `# ${appName}

A SaaS application built with @longvhv/saas-framework-react

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

- ✅ React 18 + TypeScript
- ✅ Vite for fast development
- ✅ Tailwind CSS for styling
- ✅ Redux Toolkit for state management
- ✅ React Router for navigation
${enableAuth ? '- ✅ Authentication with JWT' : ''}
${enableOAuth ? `- ✅ OAuth support (${oauthProviders.join(', ')})` : ''}
- ✅ Integration with @longvhv/saas-framework-go

## API Configuration

The application connects to: \`${apiUrl}\`

Make sure your @longvhv/saas-framework-go backend is running.
`;

    await fs.writeFile(path.join(appPath, 'README.md'), readme);

    spinner.succeed(chalk.green('Application created successfully!'));

    console.log(chalk.cyan('\n📦 Next steps:\n'));
    console.log(chalk.white(`  cd ${appName}`));
    console.log(chalk.white('  pnpm install'));
    console.log(chalk.white('  pnpm dev\n'));
    console.log(chalk.gray(`Application will be available at http://localhost:3000\n`));
  } catch (error) {
    spinner.fail(chalk.red('Failed to create application'));
    throw error;
  }
}
