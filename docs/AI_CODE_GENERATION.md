# AI Code Generation

## Overview

The AI Code Generator uses OpenAI's GPT-4 to generate production-ready code for React, Flutter, and Go API backends. It can generate individual components, full pages/screens, API endpoints, or complete full-stack applications.

## Features

- **React Components**: Generate TypeScript React components with hooks, proper types, and styling
- **React Pages**: Create complete page components with routing, data fetching, and state management
- **Flutter Widgets**: Generate Dart widgets with proper state management (Provider, Bloc, Riverpod, GetX)
- **Flutter Screens**: Create complete Flutter screens with navigation and Material Design
- **Go API**: Generate REST API endpoints with Gin framework, including handlers, models, and routes
- **Full-Stack**: Generate coordinated React/Flutter frontend + Go backend in one command

## Prerequisites

### OpenAI API Key

You need an OpenAI API key to use the code generator:

1. Sign up at [https://platform.openai.com](https://platform.openai.com)
2. Create an API key in your account settings
3. Set the environment variable:

```bash
export OPENAI_API_KEY=sk-...
```

Or add to your `.bashrc` or `.zshrc`:

```bash
echo 'export OPENAI_API_KEY=sk-...' >> ~/.bashrc
source ~/.bashrc
```

## Usage

### Basic Commands

```bash
# Generate new code
pnpm cli generate
# or
pnpm cli gen

# Refine/upgrade existing code
pnpm cli refine
```

The generate command creates new code from scratch, while the refine command improves existing code.

### Code Generation

This launches an interactive CLI that guides you through the generation process.

### Generation Examples

#### 1. React Component

```bash
pnpm cli gen
```

Select:

- Target: `React Component`
- Description: `A reusable card component that displays user information with avatar, name, email, and action buttons`
- Component name: `UserCard`
- Features: `form-validation`, `loading-states`, `responsive`
- Styling: `tailwind`
- State management: `useState`

Output:

- `UserCard.tsx` - Complete React component with TypeScript

#### 2. Flutter Widget

```bash
pnpm cli gen
```

Select:

- Target: `Flutter Widget`
- Description: `A custom button widget with loading state, icon support, and various color schemes`
- Widget name: `CustomButton`
- Features: `loading-states`, `responsive`
- State management: `provider`

Output:

- `custom_button_widget.dart` - Complete Flutter widget

#### 3. Go API

```bash
pnpm cli gen
```

Select:

- Target: `Go API`
- Description: `RESTful API for managing user accounts with CRUD operations`
- Features: `authentication`, `error-handling`
- API Endpoints:
  - `GET /api/users` - List users
  - `GET /api/users/:id` - Get user by ID
  - `POST /api/users` - Create user
  - `PUT /api/users/:id` - Update user
  - `DELETE /api/users/:id` - Delete user

Output:

- `handlers.go` - HTTP handlers
- `models.go` - Data models
- `routes.go` - Router configuration

#### 4. Full-Stack (React + Go)

```bash
pnpm cli gen
```

Select:

- Target: `Full-Stack (React + Go)`
- Description: `A task management system with create, update, delete, and list functionality`
- Features: `data-fetching`, `form-validation`, `authentication`, `error-handling`

Output:

- `TaskPage.tsx` - React page component
- `handlers.go` - Go API handlers
- `models.go` - Go data models
- `routes.go` - Go router setup
- `apiClient.ts` - TypeScript API client for React

#### 5. Full-Stack (Flutter + Go)

```bash
pnpm cli gen
```

Select:

- Target: `Full-Stack (Flutter + Go)`
- Description: `A shopping cart with product listing, add to cart, and checkout`
- Features: `data-fetching`, `loading-states`, `error-handling`
- State management: `bloc`

Output:

- `shopping_screen.dart` - Flutter screen
- `handlers.go` - Go API handlers
- `models.go` - Go data models
- `routes.go` - Go router setup
- `api_client.dart` - Dart API client for Flutter

## Generated Code Structure

### React Components

```tsx
// UserCard.tsx
import React, { useState } from 'react';

interface UserCardProps {
  user: User;
  onEdit?: (user: User) => void;
  onDelete?: (userId: string) => void;
}

export function UserCard({ user, onEdit, onDelete }: UserCardProps) {
  // Component implementation with:
  // - Proper TypeScript types
  // - State management
  // - Error handling
  // - Responsive design
  // - Accessibility
}
```

### Flutter Widgets

```dart
// custom_button_widget.dart
import 'package:flutter/material.dart';
import 'package:provider/provider.dart';

class CustomButton extends StatelessWidget {
  final String label;
  final VoidCallback? onPressed;
  final bool isLoading;

  const CustomButton({
    required this.label,
    this.onPressed,
    this.isLoading = false,
  });

  @override
  Widget build(BuildContext context) {
    // Widget implementation with:
    // - Material Design
    // - Loading states
    // - Null safety
    // - Responsive sizing
  }
}
```

### Go API

```go
// handlers.go
package api

import (
    "github.com/gin-gonic/gin"
    "net/http"
)

func GetUsers(c *gin.Context) {
    // Handler implementation with:
    // - Input validation
    // - Error handling
    // - Proper HTTP status codes
    // - JSON responses
}

// models.go
type User struct {
    ID        uint   `json:"id" gorm:"primaryKey"`
    Name      string `json:"name" binding:"required"`
    Email     string `json:"email" binding:"required,email"`
    CreatedAt time.Time `json:"created_at"`
}

// routes.go
func SetupRoutes(router *gin.Engine) {
    api := router.Group("/api")
    {
        api.GET("/users", GetUsers)
        api.POST("/users", CreateUser)
        // ...
    }
}
```

## Code Refinement

The `refine` command allows you to improve, upgrade, or modify existing AI-generated code.

### Refinement Modes

#### 1. Single Refinement

Apply one specific modification to your code:

```bash
pnpm cli refine
```

Select:

- File: `src/components/UserCard.tsx`
- Mode: `Single refinement`
- Type: `Refactor`
- Instructions: `Extract the user avatar logic into a separate component`

The AI will:

- Analyze your current code
- Apply the requested changes
- Show you what changed
- Ask for confirmation before applying

#### 2. Multiple Refinements

Apply several improvements in sequence:

```bash
pnpm cli refine
```

Select:

- File: `src/pages/Dashboard.tsx`
- Mode: `Multiple refinements`
- Add refinements:
  1. Type: `Improve types` - Instructions: `Add proper TypeScript interfaces for all props`
  2. Type: `Optimize` - Instructions: `Use React.memo to prevent unnecessary re-renders`
  3. Type: `Add comments` - Instructions: `Add JSDoc comments to all functions`

Each refinement builds on the previous one, resulting in cumulative improvements.

#### 3. Upgrade Mode

Modernize code to use latest patterns:

```bash
pnpm cli refine
```

Select:

- File: `src/legacy/UserList.tsx`
- Mode: `Upgrade to modern patterns`
- Target version: `React 18` (optional)

The AI will:

- Convert class components to functional components
- Update to latest hooks patterns
- Apply modern TypeScript features
- Use current best practices

### Modification Types

- **Refactor**: Improve code structure and readability
- **Optimize**: Enhance performance
- **Add Feature**: Add new functionality
- **Fix Bug**: Identify and fix issues
- **Improve Types**: Better TypeScript types
- **Add Tests**: Generate test cases
- **Update Styling**: Modify visual design
- **Add Comments**: Documentation and comments

### Examples

#### Example 1: Refactor Component

```bash
pnpm cli refine
```

Input file (`Button.tsx`):

```tsx
export function Button(props: any) {
  return <button onClick={props.onClick}>{props.children}</button>;
}
```

Instructions: "Split into multiple smaller components and add proper types"

Output:

```tsx
interface ButtonProps {
  onClick: () => void;
  children: React.ReactNode;
  variant?: 'primary' | 'secondary';
  disabled?: boolean;
}

export function Button({ onClick, children, variant = 'primary', disabled }: ButtonProps) {
  return (
    <button onClick={onClick} disabled={disabled} className={`btn btn-${variant}`}>
      <ButtonContent>{children}</ButtonContent>
    </button>
  );
}
```

#### Example 2: Add Feature

```bash
pnpm cli refine
```

Instructions: "Add loading state and error handling to the API call"

Before:

```tsx
const fetchUsers = async () => {
  const response = await fetch('/api/users');
  const data = await response.json();
  setUsers(data);
};
```

After:

```tsx
const [loading, setLoading] = useState(false);
const [error, setError] = useState<string | null>(null);

const fetchUsers = async () => {
  setLoading(true);
  setError(null);

  try {
    const response = await fetch('/api/users');

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    setUsers(data);
  } catch (err) {
    setError(err instanceof Error ? err.message : 'An error occurred');
  } finally {
    setLoading(false);
  }
};
```

#### Example 3: Upgrade Flutter Code

```bash
pnpm cli refine
```

Mode: `Upgrade to modern patterns`
Target: `Flutter 3`

Before:

```dart
class UserList extends StatefulWidget {
  @override
  _UserListState createState() => _UserListState();
}

class _UserListState extends State<UserList> {
  List users;

  @override
  Widget build(BuildContext context) {
    return ListView.builder(
      itemCount: users.length,
      itemBuilder: (context, index) => Text(users[index]),
    );
  }
}
```

After:

```dart
class UserList extends StatelessWidget {
  const UserList({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    final users = context.watch<UserProvider>().users;

    return ListView.builder(
      itemCount: users.length,
      itemBuilder: (context, index) => UserListItem(user: users[index]),
    );
  }
}
```

### Safety Features

- **Backup Creation**: Automatically backs up original file before changes
- **Preview Changes**: Shows what will change before applying
- **Separate File Option**: Can save to new file instead of overwriting
- **Change Summary**: Lists all modifications made

### Best Practices for Refinement

1. **Start Small**: Make one change at a time for better control
2. **Review Changes**: Always review the diff before applying
3. **Keep Backups**: Enable backup creation for important files
4. **Be Specific**: Provide clear, detailed instructions
5. **Iterative Approach**: Refine multiple times if needed
6. **Test After**: Run tests after applying refinements

## Configuration Options

### Styling (React)

- **tailwind**: Tailwind CSS utility classes (recommended)
- **css-modules**: CSS Modules for scoped styling
- **styled-components**: CSS-in-JS with styled-components

### State Management

**React:**

- **useState**: React hooks (default, simple)
- **redux**: Redux Toolkit (complex state)
- **zustand**: Lightweight state management

**Flutter:**

- **provider**: Provider pattern (recommended)
- **bloc**: BLoC pattern (complex state)
- **riverpod**: Modern Provider
- **getx**: GetX state management

### Features

- **form-validation**: Add form validation logic
- **data-fetching**: Include API calls and data loading
- **authentication**: Add auth checks and token handling
- **loading-states**: Include loading indicators
- **error-handling**: Add try-catch and error displays
- **responsive**: Make responsive for all screen sizes
- **tests**: Generate test files (Vitest/Testing Library)

## Integration with saas-framework-go

The Go API code generated is compatible with the [saas-framework-go](https://github.com/longvhv/saas-framework-go) project.

### Integration Steps

1. Generate the Go API:

```bash
pnpm cli gen
# Select "Go API" or "Full-Stack"
```

2. Copy generated files to your Go project:

```bash
# In saas-framework-go project
cp generated/*.go ./api/
```

3. Update your `main.go` to import and register routes:

```go
import "your-project/api"

func main() {
    router := gin.Default()
    api.SetupRoutes(router)
    router.Run(":8080")
}
```

4. Run the server:

```bash
go mod tidy
go run main.go
```

## Integration with saas-framework-flutter

The Flutter code generated is compatible with the [saas-framework-flutter](https://github.com/longvhv/saas-framework-flutter) project.

### Integration Steps

1. Generate Flutter code:

```bash
pnpm cli gen
# Select "Flutter Widget", "Flutter Screen", or "Full-Stack (Flutter + Go)"
```

2. Copy generated files to your Flutter project:

```bash
# In saas-framework-flutter project
cp generated/*.dart ./lib/widgets/
cp generated/*_screen.dart ./lib/screens/
cp generated/api_client.dart ./lib/services/
```

3. Add required dependencies to `pubspec.yaml`:

```yaml
dependencies:
  http: ^1.1.0
  provider: ^6.1.1 # or bloc, riverpod, get_x
```

4. Run the app:

```bash
flutter pub get
flutter run
```

## Best Practices

### 1. Provide Clear Descriptions

Be specific about what you want:

❌ Bad: "Make a form"
✅ Good: "Create a user registration form with email, password fields, validation, and submit button"

### 2. Select Relevant Features

Only select features you actually need to avoid overcomplicated code.

### 3. Review and Customize

The AI generates production-ready code, but always review and customize:

- Adjust styling to match your design system
- Update API endpoints to match your backend
- Add business logic specific to your app

### 4. Iterate

If the first generation isn't perfect:

- Generate again with a more detailed description
- Generate separate components and combine them
- Edit the generated code manually

### 5. Cost Management

- GPT-4 API calls cost money
- Use clear descriptions to minimize regenerations
- Consider using GPT-3.5 for simpler components (modify model in code)

## Troubleshooting

### "OPENAI_API_KEY environment variable is not set"

Set your API key:

```bash
export OPENAI_API_KEY=sk-...
```

### "Insufficient credits" or "Rate limit exceeded"

- Check your OpenAI account has sufficient credits
- Wait a moment and try again if rate limited
- Upgrade your OpenAI plan if needed

### Generated code has errors

- Review the description - make it more specific
- Regenerate with different parameters
- Manually fix minor issues
- The AI is powerful but not perfect

### Import errors in generated code

- Ensure you have the required dependencies installed
- Check package names match your project
- Update imports as needed for your project structure

## Advanced Usage

### Custom AI Model

Edit `packages/ai-codegen/src/AIService.ts` to change the model:

```typescript
this.model = config.model || 'gpt-3.5-turbo'; // Cheaper, faster, less capable
// or
this.model = config.model || 'gpt-4-turbo-preview'; // Default, best quality
```

### Programmatic Usage

```typescript
import { AIService, CodeGenerator } from '@longvhv/ai-codegen';

const aiService = new AIService({
  provider: 'openai',
  apiKey: process.env.OPENAI_API_KEY!,
});

const generator = new CodeGenerator(aiService);

const result = await generator.generate({
  target: 'react-component',
  description: 'A todo list component',
  componentName: 'TodoList',
  features: ['form-validation', 'loading-states'],
  styling: 'tailwind',
});

console.log(result.files);
```

## Future Enhancements

- Support for Anthropic Claude
- Support for local LLMs
- Template customization
- Multi-step generation with refinement
- Code review and optimization suggestions
- Automated testing generation
- Database schema generation
- More framework support (Vue, Angular, SwiftUI)

## Support

For issues or questions:

- Check the [troubleshooting section](#troubleshooting)
- Review the [examples](#generation-examples)
- Open an issue on GitHub
- Check OpenAI API status

## License

MIT License - See LICENSE file for details
