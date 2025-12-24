# Template System Documentation

## Overview

The SaaS Framework Template System enables developers to import existing React applications and convert them into reusable templates. These templates can then be used to quickly bootstrap new applications with pre-configured components, routes, and dependencies.

## Architecture

The template system consists of three main packages:

### 1. @longvhv/templates

Manages the template registry and provides CRUD operations for templates.

**Key Classes:**

- `TemplateRegistry`: Central registry for managing all templates
- `Template`: Represents an individual template with configuration and source files

**Key Features:**

- Template configuration storage
- Template metadata management
- Template CRUD operations
- Template listing and searching

### 2. @longvhv/app-adapter

Analyzes and adapts existing applications into framework-compatible format.

**Key Classes:**

- `AppAnalyzer`: Orchestrates application analysis
- `ComponentExtractor`: Extracts React components and their metadata
- `RouteAdapter`: Detects and converts routing patterns
- `StateAdapter`: Identifies state management solutions
- `DependencyResolver`: Resolves and merges dependencies
- `AppImporter`: Handles import from Git or local filesystem

**Detection Capabilities:**

- Component structure and dependencies
- React Router routes
- State management (Redux, Zustand, Context API)
- Style systems (Tailwind, CSS Modules, Styled Components, Emotion)
- API endpoints
- TypeScript props definitions

**Compatibility:**

The app-adapter supports a wide range of React project structures:

- **Build Tools**: Vite, Webpack, Next.js, Create React App (CRA)
- **Source Directory Structures**: `src/`, `app/`, `source/`, `client/`
- **Routing Patterns**: React Router, Next.js pages, custom routing
- **Configuration Files**: Automatically detects and copies all relevant config files including:
  - Tailwind configs (`.js`, `.ts`, `.cjs`, `.mjs`)
  - Webpack, Vite, Next.js configs
  - TypeScript, ESLint, Prettier configs
  - PostCSS configs

### 3. @longvhv/cli (Enhanced)

CLI commands for template management and app creation.

**New Commands:**

- `import-app`: Import repository as template
- `clone-app`: Create app from template
- `list-templates`: Show available templates
- `adapt-app`: Convert standalone app to framework format

## Getting Started

### Installation

The template system is included in the framework. No additional installation is required.

### Importing an Application from GitHub

```bash
# Import a repository as a template
pnpm cli import-app https://github.com/username/repo integration-portal

# The system will:
# 1. Clone the repository
# 2. Analyze the structure
# 3. Extract components and routes
# 4. Detect dependencies
# 5. Generate template configuration
# 6. Save to templates/integration-portal
```

### Creating an App from a Template

```bash
# List available templates
pnpm cli list-templates

# Create a new app from a template
pnpm cli clone-app integration-portal my-dev-portal

# Install dependencies and run
cd my-dev-portal
pnpm install
pnpm dev
```

### Adapting a Local Application

```bash
# Convert a standalone app to a template
pnpm cli adapt-app /path/to/app

# Or run from within the app directory
cd /path/to/app
pnpm cli adapt-app
```

## Template Configuration

Each template includes a `template.config.json` file:

```json
{
  "name": "integration-portal",
  "description": "A developer portal template",
  "version": "1.0.0",
  "source": {
    "repo": "https://github.com/username/repo",
    "branch": "main"
  },
  "components": {
    "required": ["Dashboard", "APIExplorer"],
    "optional": ["Settings", "Profile"]
  },
  "routes": [
    {
      "path": "/",
      "component": "Dashboard",
      "protected": true,
      "layout": "MainLayout"
    }
  ],
  "dependencies": {
    "@radix-ui/react-dialog": "^1.0.5",
    "lucide-react": "^0.294.0"
  },
  "modules": ["api-explorer", "documentation"],
  "customization": {
    "theme": true,
    "layout": true,
    "auth": true
  }
}
```

### Configuration Fields

- **name**: Unique template identifier (lowercase, alphanumeric with hyphens)
- **description**: Human-readable description
- **version**: Semantic version
- **source**: Original repository information
- **components**: Lists of required and optional components
- **routes**: Route configurations with protection and layout settings
- **dependencies**: NPM packages required by the template
- **modules**: Framework modules used by the template
- **customization**: Features that can be customized during app creation

## Template Directory Structure

```
templates/
└── integration-portal/
    ├── template.config.json
    ├── src/
    │   ├── components/
    │   │   ├── Dashboard.tsx
    │   │   ├── APIExplorer.tsx
    │   │   └── Navigation.tsx
    │   └── styles/
    ├── tailwind.config.js
    ├── vite.config.ts
    └── tsconfig.json
```

## Component Analysis

The `ComponentExtractor` analyzes each component file and extracts:

- Component name and export type
- Import dependencies
- State usage (useState, useReducer)
- Effect usage (useEffect, useLayoutEffect)
- Props definitions (from TypeScript)

Example component analysis result:

```typescript
{
  name: "Dashboard",
  filePath: "/src/components/Dashboard.tsx",
  exports: ["Dashboard"],
  imports: [
    { source: "react", specifiers: ["useState"], isDefault: false },
    { source: "./api", specifiers: ["fetchData"], isDefault: false }
  ],
  hasState: true,
  hasEffects: true
}
```

## Route Adaptation

The `RouteAdapter` detects various routing patterns:

### React Router v6

```tsx
// Detected automatically
<Routes>
  <Route path="/" element={<Dashboard />} />
  <Route path="/api-explorer" element={<APIExplorer />} />
</Routes>
```

### Protected Routes

```tsx
// Automatically marked as protected
<ProtectedRoute>
  <Route path="/admin" element={<Admin />} />
</ProtectedRoute>
```

## State Management Detection

The system detects and preserves state management patterns:

### Redux Toolkit

```typescript
// Detected via package.json and store files
dependencies: {
  "@reduxjs/toolkit": "^2.0.1"
}
```

### Zustand

```typescript
// Detected via package.json
dependencies: {
  "zustand": "^4.4.7"
}
```

### Context API

```typescript
// Detected by scanning for createContext/useContext usage
```

## Dependency Resolution

The `DependencyResolver` handles dependency conflicts:

1. **Merge**: Combines app and framework dependencies
2. **Conflict Resolution**: Prefers newer semantic versions
3. **Critical Packages**: Preserves app-specific UI libraries
4. **Peer Dependencies**: Maintains compatibility

Example:

```typescript
// App has: react@18.2.0
// Framework has: react@18.3.0
// Result: react@18.3.0 (newer version)
```

## Style System Detection

Supported style systems:

- **Tailwind CSS**: Detected via tailwind.config.js/ts
- **CSS Modules**: Detected via .module.css files
- **Styled Components**: Detected via package.json
- **Emotion**: Detected via @emotion packages
- **Plain CSS**: Default fallback

## Best Practices

### Creating Templates

1. **Clean Code**: Ensure the source app has clean, well-organized code
2. **Minimal Dependencies**: Include only necessary packages
3. **TypeScript**: Use TypeScript for better analysis
4. **Documentation**: Include README with setup instructions
5. **Examples**: Provide example components and routes

### Using Templates

1. **Review Configuration**: Check template.config.json before cloning
2. **Customize**: Modify generated apps to fit specific needs
3. **Version Control**: Initialize git after creating from template
4. **Dependencies**: Run `pnpm install` before development

### Template Maintenance

1. **Updates**: Keep templates updated with security patches
2. **Versioning**: Use semantic versioning for template versions
3. **Testing**: Test templates by creating sample apps
4. **Documentation**: Maintain README files for each template

## Troubleshooting

### Template Not Found

```bash
# List available templates
pnpm cli list-templates

# Verify template exists in templates/ directory
ls templates/
```

### Import Fails

```bash
# Check GitHub URL is correct
# Ensure repository is public or you have access
# Verify branch name exists

# For private repos, use SSH URL
pnpm cli import-app git@github.com:username/repo.git
```

### Build Errors After Cloning

```bash
# Install dependencies
pnpm install

# Clear cache and reinstall
pnpm clean
pnpm install

# Check for version conflicts
pnpm list
```

### Component Not Loading

1. Verify component exports in source files
2. Check import paths in generated app
3. Ensure all dependencies are installed
4. Review browser console for errors

## Advanced Usage

### Custom Template Location

Set a custom templates directory:

```bash
export SAAS_TEMPLATES_DIR=/path/to/templates
```

### Programmatic Usage

Use the packages directly in your code:

```typescript
import { TemplateRegistry } from '@longvhv/templates';
import { AppImporter } from '@longvhv/app-adapter';

// Initialize registry
const registry = new TemplateRegistry('./templates');
await registry.initialize();

// Import app
const importer = new AppImporter();
const config = await importer.importFromGit({
  repoUrl: 'https://github.com/username/repo',
  templateName: 'my-template',
  targetDir: './templates',
  branch: 'main',
});

// List templates
const templates = registry.listTemplates();
```

### Custom Analyzers

Extend the analysis capabilities:

```typescript
import { AppAnalyzer } from '@longvhv/app-adapter';

class CustomAnalyzer extends AppAnalyzer {
  async analyzeCustomFeature(appPath: string) {
    // Your custom analysis logic
  }
}
```

## Examples

### Example 1: Import Public Repository

```bash
pnpm cli import-app https://github.com/shadcn/ui shadcn-template
pnpm cli clone-app shadcn-template my-app
```

### Example 2: Import Specific Branch

```bash
pnpm cli import-app https://github.com/user/repo my-template
# When prompted, enter branch name: develop
```

### Example 3: Adapt Local Project

```bash
cd my-existing-project
pnpm cli adapt-app
# Answer prompts to create template
```

### Example 4: Multiple Templates

```bash
# Import multiple templates for different use cases
pnpm cli import-app https://github.com/user/admin-dashboard admin-template
pnpm cli import-app https://github.com/user/landing-page landing-template
pnpm cli import-app https://github.com/user/blog-app blog-template

# List all templates
pnpm cli list-templates

# Clone as needed
pnpm cli clone-app admin-template my-admin-panel
pnpm cli clone-app landing-template my-landing
```

## API Reference

### TemplateRegistry

```typescript
class TemplateRegistry {
  constructor(templatesDir: string);

  async initialize(): Promise<void>;
  async getTemplate(name: string): Promise<Template | null>;
  hasTemplate(name: string): boolean;
  listTemplates(): Template[];
  async listTemplateMetadata(): Promise<TemplateMetadata[]>;
  searchTemplates(options: SearchTemplateOptions): Template[];
  async registerTemplate(name: string, config: TemplateConfig): Promise<Template>;
  async removeTemplate(name: string): Promise<void>;
  getTemplatesDir(): string;

  static getDefaultTemplatesDir(): string;
}
```

### Template

```typescript
class Template {
  constructor(templatePath: string, config: TemplateConfig);

  getConfig(): TemplateConfig;
  getName(): string;
  getDescription(): string;
  getVersion(): string;
  getPath(): string;
  getSourcePath(): string;
  getRoutes(): RouteConfig[];
  getDependencies(): Record<string, string>;
  getComponents(): { required: string[]; optional: string[] };

  async updateConfig(updates: Partial<TemplateConfig>): Promise<void>;
  async copyTo(destinationPath: string): Promise<void>;

  static async load(templatePath: string): Promise<Template>;
  static async create(templatePath: string, config: TemplateConfig): Promise<Template>;
}
```

### AppAnalyzer

```typescript
class AppAnalyzer {
  async analyzeApp(appPath: string): Promise<AppAnalysisResult>;
}
```

### AppImporter

```typescript
class AppImporter {
  async importFromGit(options: ImportAppOptions): Promise<TemplateConfig>;
  async importFromLocal(
    appPath: string,
    templateName: string,
    targetDir: string
  ): Promise<TemplateConfig>;
}
```

## Contributing

To contribute new features or improvements to the template system:

1. Follow existing code patterns
2. Add tests for new functionality
3. Update documentation
4. Submit pull requests with clear descriptions

## License

MIT License - See LICENSE file for details
