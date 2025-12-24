# Template System Quick Start

## Overview

The Template System allows you to import existing React applications and convert them into reusable templates for creating new SaaS applications.

## Available Commands

### 1. List Available Templates

```bash
pnpm cli list-templates
```

Shows all templates in the `templates/` directory with their metadata.

### 2. Clone App from Template

```bash
pnpm cli clone-app <template-name> <app-name>
```

Create a new application from an existing template.

**Example:**

```bash
pnpm cli clone-app integration-portal my-portal
cd my-portal
pnpm install
pnpm dev
```

### 3. Import App from GitHub

```bash
pnpm cli import-app <github-url> <template-name>
```

Import a GitHub repository as a template.

**Example:**

```bash
pnpm cli import-app https://github.com/username/repo my-template
```

The system will:

1. Clone the repository
2. Analyze the application structure
3. Extract components and routes
4. Detect dependencies and state management
5. Generate a template configuration
6. Save to `templates/<template-name>`

### 4. Adapt Local App

```bash
pnpm cli adapt-app [path]
```

Convert a local standalone app to a framework template.

**Example:**

```bash
# From app directory
cd /path/to/my-app
pnpm cli adapt-app

# Or specify path
pnpm cli adapt-app /path/to/my-app
```

## Pre-configured Templates

### integration-portal

A developer portal template with:

- Dashboard with analytics
- API Explorer for testing endpoints
- Documentation viewer
- Navigation component
- Radix UI components
- React Hook Form
- Recharts for analytics

**Usage:**

```bash
pnpm cli clone-app integration-portal my-dev-portal
```

## Template Structure

Each template in the `templates/` directory contains:

```
templates/integration-portal/
├── template.config.json    # Template metadata and configuration
├── src/
│   ├── components/         # React components
│   │   ├── Dashboard.tsx
│   │   ├── APIExplorer.tsx
│   │   └── ...
│   └── ...
├── tailwind.config.js      # (if using Tailwind)
├── vite.config.ts         # (if using Vite)
└── tsconfig.json          # TypeScript configuration
```

## Template Configuration

`template.config.json` example:

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
      "protected": true
    }
  ],
  "dependencies": {
    "@radix-ui/react-dialog": "^1.0.5",
    "lucide-react": "^0.294.0"
  }
}
```

## Workflow Example

### Import and Use a Template

```bash
# 1. Import from GitHub
pnpm cli import-app https://github.com/shadcn/ui shadcn-template

# 2. List templates to verify
pnpm cli list-templates

# 3. Create new app from template
pnpm cli clone-app shadcn-template my-app

# 4. Run the app
cd my-app
pnpm install
pnpm dev
```

### Adapt Existing Project

```bash
# 1. Navigate to your existing React project
cd my-existing-project

# 2. Adapt it to a template
pnpm cli adapt-app

# 3. Create new apps from your template
pnpm cli clone-app my-template new-app
```

## Features Detected

The analyzer automatically detects:

- **Components**: React components with their dependencies
- **Routes**: React Router patterns
- **State Management**: Redux, Zustand, Context API
- **Styling**: Tailwind, CSS Modules, Styled Components, Emotion
- **Dependencies**: All npm packages
- **TypeScript**: Props and type definitions

## Documentation

For comprehensive documentation, see:

- [Template System Documentation](./docs/TEMPLATE_SYSTEM.md)

## Troubleshooting

### Template Not Found

```bash
# Verify template exists
pnpm cli list-templates
ls templates/
```

### Import Fails

- Check GitHub URL is correct
- Ensure repository is public or you have access
- Verify branch name exists

### Build Errors

```bash
# Clear and reinstall
pnpm clean
pnpm install
```

## Support

For issues or questions, please refer to the main project documentation or create an issue on GitHub.
