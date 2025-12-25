# @longvhv/create-app

CLI tool to bootstrap new SaaS applications using the @longvhv framework.

## Usage

### Interactive Mode

```bash
npx @longvhv/create-app
```

### With App Name

```bash
npx @longvhv/create-app my-saas-app
```

### With Options

```bash
npx @longvhv/create-app my-saas-app \
  --template blank \
  --version latest \
  --registry https://registry.npmjs.org \
  --skip-git \
  --skip-install
```

## Options

- `--template <name>` - Template to use (integration-portal, crm, admin-dashboard, blank)
- `--version <version>` - Framework version (latest or specific version like 1.0.0)
- `--registry <url>` - NPM registry URL
- `--skip-git` - Skip git initialization
- `--skip-install` - Skip dependency installation

## What It Creates

The CLI will create a new SaaS application with:

- Full project structure (src, public, scripts)
- Package.json with all @longvhv dependencies
- TypeScript configuration
- Vite configuration
- Tailwind CSS setup
- ESLint and Prettier configuration
- Git repository (optional)
- CI/CD workflows (GitHub Actions, GitLab CI)
- Deployment configuration (Vercel, AWS, Docker)

## Templates

### Blank

Minimal setup with core framework packages.

### Integration Portal

Developer portal with API documentation.

### CRM

Customer relationship management application.

### Admin Dashboard

Admin panel with user management.

## Generated Structure

```
my-saas-app/
├── src/
│   ├── main.tsx
│   ├── index.css
│   ├── modules/
│   └── components/
├── public/
├── scripts/
├── .github/
│   └── workflows/
│       ├── ci.yml
│       └── deploy.yml
├── package.json
├── tsconfig.json
├── vite.config.ts
├── tailwind.config.js
├── .gitignore
├── .npmrc (if using private registry)
├── .env.example
└── README.md
```

## Next Steps

After creating your app:

```bash
cd my-saas-app
npm install  # if you used --skip-install
npm run dev
```

## Private Registry

To use a private registry (GitHub Packages, custom):

```bash
npx @longvhv/create-app my-app --registry https://npm.pkg.github.com
```

The CLI will create a `.npmrc` file with the registry configuration. Make sure to set your `NPM_TOKEN` environment variable.

## Requirements

- Node.js >= 18.0.0
- npm >= 8.0.0

## License

MIT
