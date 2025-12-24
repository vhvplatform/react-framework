import chalk from 'chalk';
import { AIService } from './AIService.js';
import {
  CodegenRequest,
  CodegenResult,
  GeneratedFile,
  GoApiSpec,
  GoEndpoint,
  GoModel,
} from './types.js';

/**
 * Main code generator that orchestrates AI-powered code generation
 */
export class CodeGenerator {
  private aiService: AIService;

  constructor(aiService: AIService) {
    this.aiService = aiService;
  }

  /**
   * Generate code based on request
   */
  async generate(request: CodegenRequest): Promise<CodegenResult> {
    console.log(chalk.blue(`Generating ${request.target} code...`));

    switch (request.target) {
      case 'react-component':
        return this.generateReactComponent(request);
      case 'react-page':
        return this.generateReactPage(request);
      case 'go-api':
        return this.generateGoAPI(request);
      case 'flutter-widget':
        return this.generateFlutterWidget(request);
      case 'flutter-screen':
        return this.generateFlutterScreen(request);
      case 'full-stack':
        return this.generateFullStack(request);
      case 'full-stack-flutter':
        return this.generateFullStackFlutter(request);
      default:
        throw new Error(`Unsupported target: ${request.target}`);
    }
  }

  /**
   * Generate React component
   */
  private async generateReactComponent(request: CodegenRequest): Promise<CodegenResult> {
    const componentName = request.componentName || 'MyComponent';
    const styling = request.styling || 'tailwind';
    const stateManagement = request.stateManagement || 'useState';

    const systemPrompt = `You are an expert React developer. Generate clean, production-ready React components using TypeScript.
Follow these guidelines:
- Use functional components with hooks
- Include proper TypeScript types and interfaces
- Use ${styling} for styling
- Use ${stateManagement} for state management
- Follow React best practices and patterns
- Include JSDoc comments for complex logic
- Make components reusable and maintainable
- Return only valid TypeScript/TSX code without markdown formatting`;

    const prompt = `Generate a React component named "${componentName}" with the following requirements:

Description: ${request.description}

${
  request.features && request.features.length > 0
    ? `Features to include:
${request.features.map((f) => `- ${f}`).join('\n')}`
    : ''
}

Requirements:
- Component name: ${componentName}
- Styling: ${styling}
- State management: ${stateManagement}
- Use TypeScript
- Include proper prop types
- Include error handling where appropriate
- Make it accessible (ARIA attributes)

Return a complete, production-ready component.`;

    const code = await this.aiService.generateCode(prompt, systemPrompt);

    const files: GeneratedFile[] = [
      {
        path: `${componentName}.tsx`,
        content: this.cleanCode(code),
        language: 'tsx',
      },
    ];

    // Generate test file if requested
    if (request.features?.includes('tests')) {
      const testPrompt = `Generate a test file for the ${componentName} component using Vitest and Testing Library.
Include tests for main functionality and edge cases.`;

      const testCode = await this.aiService.generateCode(testPrompt, systemPrompt);

      files.push({
        path: `${componentName}.test.tsx`,
        content: this.cleanCode(testCode),
        language: 'tsx',
      });
    }

    return {
      target: 'react-component',
      files,
      instructions: `Component generated successfully. 
      
To use this component:
1. Copy the generated files to your components directory
2. Import and use: import { ${componentName} } from './${componentName}'
3. Customize styling and behavior as needed`,
    };
  }

  /**
   * Generate React page/view
   */
  private async generateReactPage(request: CodegenRequest): Promise<CodegenResult> {
    const pageName = request.componentName || 'MyPage';

    const systemPrompt = `You are an expert React developer. Generate complete page components with proper routing, data fetching, and state management.
Use TypeScript, follow React best practices, and create production-ready code.
Return only valid TypeScript/TSX code without markdown formatting.`;

    const prompt = `Generate a React page component named "${pageName}" with the following requirements:

Description: ${request.description}

${
  request.features && request.features.length > 0
    ? `Features to include:
${request.features.map((f) => `- ${f}`).join('\n')}`
    : ''
}

Requirements:
- Page name: ${pageName}
- Include route configuration
- Use ${request.styling || 'tailwind'} for styling
- Include loading and error states
- Use ${request.stateManagement || 'useState'} for state
- Include proper SEO meta tags
- Make it responsive

Return a complete, production-ready page component.`;

    const code = await this.aiService.generateCode(prompt, systemPrompt);

    return {
      target: 'react-page',
      files: [
        {
          path: `${pageName}.tsx`,
          content: this.cleanCode(code),
          language: 'tsx',
        },
      ],
      instructions: `Page component generated successfully.
      
To use this page:
1. Add to your routes configuration
2. Import necessary dependencies
3. Customize as needed`,
    };
  }

  /**
   * Generate Go API endpoints
   */
  private async generateGoAPI(request: CodegenRequest): Promise<CodegenResult> {
    const systemPrompt = `You are an expert Go developer specializing in REST API development.
Generate clean, idiomatic Go code following best practices.
Use standard library and popular packages like gin-gonic/gin for routing.
Return response as JSON with this structure:
{
  "packageName": "api",
  "endpoints": [
    {
      "method": "GET",
      "path": "/api/resource",
      "handler": "GetResource",
      "description": "...",
      "requestType": "GetResourceRequest",
      "responseType": "GetResourceResponse"
    }
  ],
  "models": [
    {
      "name": "Resource",
      "fields": [
        {
          "name": "ID",
          "type": "uint",
          "jsonTag": "id",
          "validation": "required"
        }
      ]
    }
  ],
  "handlerCode": "... complete Go handler implementation ...",
  "modelCode": "... complete Go model/struct definitions ...",
  "routerCode": "... complete router setup code ..."
}`;

    const endpointsDesc = request.apiEndpoints
      ?.map(
        (ep) =>
          `- ${ep.method} ${ep.path}: ${ep.description}${
            ep.requestBody ? `\n  Request: ${JSON.stringify(ep.requestBody)}` : ''
          }${ep.responseBody ? `\n  Response: ${JSON.stringify(ep.responseBody)}` : ''}`
      )
      .join('\n');

    const prompt = `Generate Go API endpoints with the following requirements:

Description: ${request.description}

${endpointsDesc ? `API Endpoints:\n${endpointsDesc}` : ''}

Requirements:
- Use Gin framework
- Include proper error handling
- Add input validation
- Include CORS middleware
- Use proper HTTP status codes
- Include logging
- Follow Go best practices
- Generate complete, production-ready code

Return as JSON with packageName, endpoints array, models array, handlerCode, modelCode, and routerCode.`;

    const response = await this.aiService.generateStructuredCode<{
      packageName: string;
      endpoints: GoEndpoint[];
      models: GoModel[];
      handlerCode: string;
      modelCode: string;
      routerCode: string;
    }>(prompt, systemPrompt);

    const files: GeneratedFile[] = [
      {
        path: 'handlers.go',
        content: response.handlerCode,
        language: 'go',
      },
      {
        path: 'models.go',
        content: response.modelCode,
        language: 'go',
      },
      {
        path: 'routes.go',
        content: response.routerCode,
        language: 'go',
      },
    ];

    const goApiSpec: GoApiSpec = {
      packageName: response.packageName,
      endpoints: response.endpoints,
      models: response.models,
    };

    return {
      target: 'go-api',
      files,
      goApiSpec,
      instructions: `Go API generated successfully.

To use this API:
1. Copy the generated files to your Go project's API package
2. Import and register routes in your main.go
3. Run: go mod tidy
4. Start server: go run main.go

API Specification:
${JSON.stringify(goApiSpec, null, 2)}`,
    };
  }

  /**
   * Generate Flutter widget
   */
  private async generateFlutterWidget(request: CodegenRequest): Promise<CodegenResult> {
    const widgetName = request.componentName || 'MyWidget';
    const stateManagement = request.flutterStateManagement || 'provider';

    const systemPrompt = `You are an expert Flutter developer. Generate clean, production-ready Flutter widgets using Dart.
Follow these guidelines:
- Use StatelessWidget or StatefulWidget appropriately
- Include proper Dart types and null safety
- Use ${stateManagement} for state management
- Follow Flutter best practices and Material Design guidelines
- Include proper documentation comments
- Make widgets reusable and maintainable
- Return only valid Dart code without markdown formatting`;

    const prompt = `Generate a Flutter widget named "${widgetName}" with the following requirements:

Description: ${request.description}

${
  request.features && request.features.length > 0
    ? `Features to include:
${request.features.map((f) => `- ${f}`).join('\n')}`
    : ''
}

Requirements:
- Widget name: ${widgetName}
- State management: ${stateManagement}
- Use Material Design widgets
- Include proper null safety
- Make it responsive for different screen sizes
- Include error handling where appropriate
- Follow Flutter best practices

Return a complete, production-ready widget.`;

    const code = await this.aiService.generateCode(prompt, systemPrompt);

    const files: GeneratedFile[] = [
      {
        path: `${widgetName.toLowerCase()}_widget.dart`,
        content: this.cleanCode(code),
        language: 'dart',
      },
    ];

    return {
      target: 'flutter-widget',
      files,
      instructions: `Flutter widget generated successfully.

To use this widget:
1. Copy the generated file to your lib/widgets directory
2. Import: import 'package:your_app/widgets/${widgetName.toLowerCase()}_widget.dart';
3. Use in your screens: ${widgetName}()
4. Customize styling and behavior as needed`,
    };
  }

  /**
   * Generate Flutter screen/page
   */
  private async generateFlutterScreen(request: CodegenRequest): Promise<CodegenResult> {
    const screenName = request.componentName || 'MyScreen';
    const stateManagement = request.flutterStateManagement || 'provider';

    const systemPrompt = `You are an expert Flutter developer. Generate complete screen/page widgets with proper routing, data fetching, and state management.
Use Dart with null safety, follow Flutter best practices, and create production-ready code.
Return only valid Dart code without markdown formatting.`;

    const prompt = `Generate a Flutter screen named "${screenName}" with the following requirements:

Description: ${request.description}

${
  request.features && request.features.length > 0
    ? `Features to include:
${request.features.map((f) => `- ${f}`).join('\n')}`
    : ''
}

Requirements:
- Screen name: ${screenName}
- Include proper routing setup
- Use ${stateManagement} for state management
- Include loading and error states
- Use Material Design
- Include AppBar and proper navigation
- Make it responsive
- Include proper lifecycle management

Return a complete, production-ready screen.`;

    const code = await this.aiService.generateCode(prompt, systemPrompt);

    return {
      target: 'flutter-screen',
      files: [
        {
          path: `${screenName.toLowerCase()}_screen.dart`,
          content: this.cleanCode(code),
          language: 'dart',
        },
      ],
      instructions: `Flutter screen generated successfully.

To use this screen:
1. Add to your lib/screens directory
2. Register route in your router
3. Import necessary dependencies
4. Customize as needed`,
    };
  }

  /**
   * Generate full-stack application with Flutter (Flutter + Go API)
   */
  private async generateFullStackFlutter(request: CodegenRequest): Promise<CodegenResult> {
    console.log(chalk.blue('Generating full-stack Flutter application...'));

    // Generate Flutter screen
    const flutterResult = await this.generateFlutterScreen(request);

    // Generate Go API
    const goResult = await this.generateGoAPI(request);

    // Generate API client for Flutter
    const apiClientCode = await this.generateFlutterAPIClient(goResult.goApiSpec!);

    const files = [
      ...flutterResult.files,
      ...goResult.files,
      {
        path: 'api_client.dart',
        content: apiClientCode,
        language: 'dart' as const,
      },
    ];

    return {
      target: 'full-stack-flutter',
      files,
      goApiSpec: goResult.goApiSpec,
      instructions: `Full-stack Flutter application generated successfully!

Frontend (Flutter):
${flutterResult.instructions}

Backend (Go API):
${goResult.instructions}

API Client:
- Use the generated api_client.dart to call backend endpoints
- Import in your screens: import 'package:your_app/services/api_client.dart';
- Add http package to pubspec.yaml: http: ^1.1.0

Project Structure:
- Flutter files: ${flutterResult.files.map((f) => f.path).join(', ')}
- Backend files: ${goResult.files.map((f) => f.path).join(', ')}
- API Client: api_client.dart`,
    };
  }

  /**
   * Generate Dart API client for Go backend
   */
  private async generateFlutterAPIClient(goApiSpec: GoApiSpec): Promise<string> {
    const systemPrompt = `Generate a Dart API client using the http package.
Include proper types, error handling, and follow Flutter best practices.
Return only valid Dart code without markdown formatting.`;

    const prompt = `Generate a Dart API client for the following Go API:

${JSON.stringify(goApiSpec, null, 2)}

Requirements:
- Use http package for HTTP requests
- Include proper Dart classes/models
- Add error handling
- Support for different HTTP methods
- Include response parsing
- Export a singleton instance
- Include documentation comments
- Use null safety`;

    const code = await this.aiService.generateCode(prompt, systemPrompt);
    return this.cleanCode(code);
  }

  /**
   * Generate full-stack application (React + Go API)
   */
  private async generateFullStack(request: CodegenRequest): Promise<CodegenResult> {
    console.log(chalk.blue('Generating full-stack application...'));

    // Generate React components
    const reactResult = await this.generateReactPage(request);

    // Generate Go API
    const goResult = await this.generateGoAPI(request);

    // Generate API client for React
    const apiClientCode = await this.generateAPIClient(goResult.goApiSpec!);

    const files = [
      ...reactResult.files,
      ...goResult.files,
      {
        path: 'apiClient.ts',
        content: apiClientCode,
        language: 'typescript' as const,
      },
    ];

    return {
      target: 'full-stack',
      files,
      goApiSpec: goResult.goApiSpec,
      instructions: `Full-stack application generated successfully!

Frontend (React):
${reactResult.instructions}

Backend (Go API):
${goResult.instructions}

API Client:
- Use the generated apiClient.ts to call backend endpoints
- Import in your React components: import { api } from './apiClient'

Project Structure:
- Frontend files: ${reactResult.files.map((f) => f.path).join(', ')}
- Backend files: ${goResult.files.map((f) => f.path).join(', ')}
- API Client: apiClient.ts`,
    };
  }

  /**
   * Generate TypeScript API client for Go backend
   */
  private async generateAPIClient(goApiSpec: GoApiSpec): Promise<string> {
    const systemPrompt = `Generate a TypeScript API client using axios or fetch.
Include proper types, error handling, and follow best practices.
Return only valid TypeScript code without markdown formatting.`;

    const prompt = `Generate a TypeScript API client for the following Go API:

${JSON.stringify(goApiSpec, null, 2)}

Requirements:
- Use axios for HTTP requests
- Include TypeScript types/interfaces
- Add error handling
- Support request/response interceptors
- Export a singleton instance
- Include JSDoc comments`;

    const code = await this.aiService.generateCode(prompt, systemPrompt);
    return this.cleanCode(code);
  }

  /**
   * Clean generated code by removing markdown formatting
   */
  private cleanCode(code: string): string {
    // Remove markdown code blocks
    let cleaned = code.replace(/```(?:typescript|tsx|go|javascript|ts)?\n/g, '');
    cleaned = cleaned.replace(/```\n?$/g, '');
    cleaned = cleaned.trim();
    return cleaned;
  }
}
