#!/bin/bash
# Create all example applications

create_example() {
    local name=$1
    local description=$2
    
    echo "Creating $name..."
    mkdir -p "$name/src"
    mkdir -p "$name/public"
    
    # Create package.json
    cat > "$name/package.json" << EOF
{
  "name": "$name",
  "version": "1.0.0",
  "description": "$description",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "tsc && vite build",
    "preview": "vite preview"
  },
  "dependencies": {
    "@longvhv/core": "workspace:*",
    "@longvhv/api-client": "workspace:*",
    "@longvhv/auth": "workspace:*",
    "@longvhv/ui-components": "workspace:*",
    "@longvhv/shared": "workspace:*",
    "@longvhv/i18n": "workspace:*",
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "react-router-dom": "^6.20.0",
    "react-redux": "^9.0.0"
  },
  "devDependencies": {
    "@types/react": "^18.2.0",
    "@types/react-dom": "^18.2.0",
    "@vitejs/plugin-react": "^4.2.0",
    "typescript": "^5.3.0",
    "vite": "^5.0.0",
    "autoprefixer": "^10.4.16",
    "postcss": "^8.4.32",
    "tailwindcss": "^3.4.0"
  }
}
EOF
    
    # Create tsconfig.json
    cat > "$name/tsconfig.json" << EOF
{
  "extends": "../../tsconfig.json",
  "compilerOptions": {
    "jsx": "react-jsx",
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"]
    }
  },
  "include": ["src"],
  "references": [
    { "path": "../../packages/core" },
    { "path": "../../packages/api-client" },
    { "path": "../../packages/auth" },
    { "path": "../../packages/ui-components" },
    { "path": "../../packages/shared" }
  ]
}
EOF
    
    # Create vite.config.ts
    cat > "$name/vite.config.ts" << EOF
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': '/src',
    },
  },
});
EOF
    
    # Create tailwind.config.js
    cat > "$name/tailwind.config.js" << EOF
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
EOF
    
    # Create postcss.config.js
    cat > "$name/postcss.config.js" << EOF
export default {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
}
EOF
    
    # Create index.html
    cat > "$name/index.html" << EOF
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>$name</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>
EOF
    
    # Create src/index.css
    cat > "$name/src/index.css" << EOF
@tailwind base;
@tailwind components;
@tailwind utilities;
EOF
}

# Create examples
create_example "01-hello-world" "Simplest possible app"
create_example "02-basic-crud" "Basic CRUD operations"
create_example "03-auth-jwt" "JWT Authentication"
create_example "04-auth-oauth" "OAuth Integration"
create_example "05-multi-language" "Multi-language support"
create_example "06-multi-tenant" "Multi-tenant SaaS"
create_example "07-admin-dashboard" "Admin Dashboard"
create_example "08-ecommerce" "E-commerce Platform"

echo "✅ Example structures created"
ls -d */
