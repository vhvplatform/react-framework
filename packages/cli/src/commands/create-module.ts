import inquirer from 'inquirer';
import chalk from 'chalk';
import ora from 'ora';
import fs from 'fs/promises';
import path from 'path';

interface CreateModuleAnswers {
  moduleName: string;
  moduleId: string;
  hasRoutes: boolean;
  routePath: string;
  hasState: boolean;
  stateName: string;
}

export async function createModule(name?: string) {
  console.log(chalk.blue.bold('\n📦 SaaS Framework - Create Module\n'));

  // Check if we're in a valid app directory
  try {
    await fs.access(path.join(process.cwd(), 'package.json'));
    await fs.access(path.join(process.cwd(), 'src'));
  } catch {
    console.error(
      chalk.red(
        '\n❌ Error: Not in a valid application directory.\nPlease run this command from the root of your application.\n'
      )
    );
    process.exit(1);
  }

  // Prompt for module details
  const answers = await inquirer.prompt<CreateModuleAnswers>([
    {
      type: 'input',
      name: 'moduleName',
      message: 'Module name (display name):',
      default: name || 'My Module',
    },
    {
      type: 'input',
      name: 'moduleId',
      message: 'Module ID (lowercase with hyphens):',
      default: (answers: Partial<CreateModuleAnswers>) =>
        answers.moduleName?.toLowerCase().replace(/\s+/g, '-') || 'my-module',
      validate: (input: string) => {
        if (!/^[a-z0-9-]+$/.test(input)) {
          return 'Module ID must be lowercase alphanumeric with hyphens';
        }
        return true;
      },
    },
    {
      type: 'confirm',
      name: 'hasRoutes',
      message: 'Add routes to this module?',
      default: true,
    },
    {
      type: 'input',
      name: 'routePath',
      message: 'Route path:',
      default: (answers: Partial<CreateModuleAnswers>) => `/${answers.moduleId}`,
      when: (answers) => answers.hasRoutes,
    },
    {
      type: 'confirm',
      name: 'hasState',
      message: 'Add Redux state to this module?',
      default: true,
    },
    {
      type: 'input',
      name: 'stateName',
      message: 'State slice name:',
      default: (answers: Partial<CreateModuleAnswers>) =>
        answers.moduleId?.replace(/-/g, '') || 'mymodule',
      when: (answers) => answers.hasState,
    },
  ]);

  const { moduleName, moduleId, hasRoutes, routePath, hasState, stateName } = answers;

  const spinner = ora('Creating module...').start();

  try {
    // Create module directory
    const modulePath = path.join(process.cwd(), 'src', 'modules', moduleId);
    await fs.mkdir(modulePath, { recursive: true });

    // Create components directory
    await fs.mkdir(path.join(modulePath, 'components'), { recursive: true });

    // Create module index file
    const indexTs = `import { createModule } from '@longvhv/core';
${hasRoutes ? "import { routes } from './routes';" : ''}
${hasState ? `import ${stateName}Reducer from './store/${stateName}Slice';` : ''}

export const ${moduleId.replace(/-/g, '')}Module = createModule({
  id: '${moduleId}',
  name: '${moduleName}',
  version: '1.0.0',
  ${hasRoutes ? 'routes,' : ''}
  ${hasState ? `reducer: ${stateName}Reducer,` : ''}
  initialize: async () => {
    console.log('${moduleName} module initialized');
  },
});
`;

    await fs.writeFile(path.join(modulePath, 'index.ts'), indexTs);

    // Create main component
    const componentName = moduleId
      .split('-')
      .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
      .join('');

    const componentTsx = `import { Card, Button } from '@longvhv/ui-components';

export function ${componentName}() {
  return (
    <div className="container mx-auto p-8">
      <Card title="${moduleName}">
        <p className="mb-4">Welcome to the ${moduleName} module!</p>
        <Button variant="primary">Click Me</Button>
      </Card>
    </div>
  );
}
`;

    await fs.writeFile(
      path.join(modulePath, 'components', `${componentName}.tsx`),
      componentTsx
    );

    // Create routes file if needed
    if (hasRoutes) {
      const routesTsx = `import { RouteObject } from 'react-router-dom';
import { ${componentName} } from './components/${componentName}';

export const routes: RouteObject[] = [
  {
    path: '${routePath}',
    element: <${componentName} />,
  },
];
`;

      await fs.writeFile(path.join(modulePath, 'routes.tsx'), routesTsx);
    }

    // Create Redux slice if needed
    if (hasState) {
      await fs.mkdir(path.join(modulePath, 'store'), { recursive: true });

      const sliceTs = `import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface ${componentName}State {
  // Add your state properties here
  count: number;
}

const initialState: ${componentName}State = {
  count: 0,
};

const ${stateName}Slice = createSlice({
  name: '${stateName}',
  initialState,
  reducers: {
    increment: (state) => {
      state.count += 1;
    },
    decrement: (state) => {
      state.count -= 1;
    },
    setCount: (state, action: PayloadAction<number>) => {
      state.count = action.payload;
    },
  },
});

export const { increment, decrement, setCount } = ${stateName}Slice.actions;
export default ${stateName}Slice.reducer;

// Selectors
export const select${componentName} = (state: { ${stateName}: ${componentName}State }) => state.${stateName};
export const selectCount = (state: { ${stateName}: ${componentName}State }) => state.${stateName}.count;
`;

      await fs.writeFile(path.join(modulePath, 'store', `${stateName}Slice.ts`), sliceTs);
    }

    spinner.succeed(chalk.green('Module created successfully!'));

    console.log(chalk.cyan('\n📦 Module created:\n'));
    console.log(chalk.white(`  Location: src/modules/${moduleId}`));
    console.log(chalk.white(`  Component: ${componentName}`));
    if (hasRoutes) {
      console.log(chalk.white(`  Route: ${routePath}`));
    }
    if (hasState) {
      console.log(chalk.white(`  State: ${stateName}`));
    }

    console.log(chalk.cyan('\n📝 Next steps:\n'));
    console.log(
      chalk.white(`  1. Import the module in src/main.tsx:`)
    );
    console.log(
      chalk.gray(`     import { ${moduleId.replace(/-/g, '')}Module } from './modules/${moduleId}';`)
    );
    console.log(chalk.white(`  2. Add it to the modules array in Application component:`));
    console.log(chalk.gray(`     modules={[..., ${moduleId.replace(/-/g, '')}Module]}`));
    console.log();
  } catch (error) {
    spinner.fail(chalk.red('Failed to create module'));
    throw error;
  }
}
