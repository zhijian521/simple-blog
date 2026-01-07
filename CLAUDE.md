# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

```bash
# Start development server
npm run dev

# Production build (TypeScript check + build)
npm run build

# Preview production build
npm run preview

# Linting (ESLint with max-warnings=0)
npm run lint
npm run lint:fix

# Code formatting (Prettier)
npm run format
npm run format:write
```

## Architecture

This is a Vue 3 + Vite + TypeScript project with a modular, domain-driven architecture.

### Module-Based Routing Structure

Routes are decentralized and maintained within each business module:

- Each module defines its own routes in `src/modules/<module>/routes.ts`
- All module routes are aggregated in `src/router/routes.ts`
- Routes use lazy loading: `component: () => import('./pages/ComponentName.vue')`
- Page titles are set via `route.meta.title` and automatically applied in `src/router/index.ts`

**When adding a new page:** Create a new module folder under `src/modules/<module-name>/` with:

- `routes.ts` - exports `<module>Routes: RouteRecordRaw[]`
- `pages/` - contains Vue page components

Then import and add the routes to `src/router/routes.ts`.

### Application Bootstrap

- Entry point: `src/main.ts` creates Vue app and calls `bootstrapApp()`
- Bootstrap logic: `src/app/bootstrap.ts` registers global plugins (router, future store, etc.)
- Constraint: Keep `bootstrapApp()` free of business logic

### Directory Layout

```
src/
  app/           # Application bootstrap & global registration
  router/        # Router instance and route aggregation
  layouts/       # Layout components (contain RouterView)
  modules/       # Business modules (domain-driven organization)
  stores/        # Pinia state management stores
  services/      # API/request layer
    ├── api/     # HTTP client and API utilities
    └── config/  # API configuration and endpoints
  shared/        # Reusable capabilities
    ├── composables/  # Vue 3 Composition API composables
    ├── utils/        # Utility functions
    ├── types/        # Global type definitions
    ├── constants/    # Application constants
    └── components/   # Shared base components
```

### State Management (Pinia)

**Architecture:**

- Pinia stores located in `src/stores/`
- Each store is self-contained with state, getters, and actions
- Stores use Composition API style (setup syntax)

**Key Principles:**

1. **Store Organization**
    - One store per domain (e.g., `app.ts`, `user.ts`, `article.ts`)
    - Keep stores flat and focused
    - Avoid circular dependencies between stores

2. **State Patterns**
    - Use ref() for reactive state
    - Use computed() for derived state
    - Actions should be simple and focused

3. **When to Use Stores vs Composables**
    - Use stores for global application state (user auth, theme, etc.)
    - Use composables for reusable logic patterns (async data, error handling, etc.)
    - Use component state for UI-local state

**Example Store Structure:**

```typescript
// src/stores/app.ts
export const useAppStore = defineStore('app', () => {
    // State
    const isLoading = ref(false);

    // Getters
    const hasGlobalError = computed(() => ...);

    // Actions
    function setLoading(loading: boolean) {
        isLoading.value = loading;
    }

    return { isLoading, hasGlobalError, setLoading };
});
```

### Services Layer (API)

**Architecture:**

- HTTP client: `src/services/api/http-client.ts`
- API configuration: `src/services/config/api.config.ts`
- Endpoint definitions centralized in `API_ENDPOINTS`

**Key Principles:**

1. **API Organization**
    - All API endpoints defined in `API_ENDPOINTS` constant
    - HTTP client provides GET/POST/PUT/DELETE methods
    - Services layer is independent of specific modules

2. **Error Handling**
    - HTTP client throws errors for failed requests
    - Use `useAsyncData` composable in components for error handling
    - Centralized error logging can be added to HTTP client

3. **Type Safety**
    - API responses use `ApiResponse<T>` type
    - Type definitions in `src/services/types/`

### Composables Layer

**Architecture:**

- Core composables in `src/shared/composables/`
- Each composable is reusable and framework-agnostic logic
- Follow Vue 3 Composition API best practices

**Available Composables:**

1. **useAsyncData** - Async data management
    - Manages loading, error, and success states
    - Provides execute() method for async operations
    - Use for API calls, data fetching, etc.

2. **useErrorHandler** - Error handling
    - Centralized error state management
    - Converts errors to consistent AppError format
    - Use for global error handling

3. **useLocalStorage** - Local storage management
    - Type-safe localStorage operations
    - Automatic synchronization with browser storage
    - Preset hooks: `useAuthToken()`, `useAppTheme()`, `useAppLanguage()`

**Creating New Composables:**

- Place in `src/shared/composables/use<Name>.ts`
- Export from `src/shared/composables/index.ts`
- Follow naming convention: `use<Name>`
- Return refs and functions (not entire objects)

## Code Standards

**Core Principles:**

- Follow senior development standards and current best practices
- Embrace modular, domain-driven architecture
- Keep code simple, clear, and well-structured

### Code Style

- Prettier configured with `tabWidth: 4`
- ESLint 9 with flat config
- Vue 3 Composition API (`<script setup>`)
- TypeScript strict mode

### Modularity Rules

1. **Module Self-Containment**
    - Each module in `src/modules/<name>/` is self-contained
    - Modules export their own routes, types, and public APIs
    - Avoid circular dependencies between modules

2. **Clear Boundaries**
    - `services/` for API/request layer
    - `shared/` for reusable cross-module utilities
    - Keep domain logic within its module

3. **File Organization**
    - Co-locate related files (routes, pages, components, types)
    - One export per file unless strongly related
    - Use `index.ts` barrels only when public API is small

### Documentation Guidelines

**Add comments for:**

- Module exports explaining their purpose
- Complex business logic or algorithms
- Non-obvious type definitions
- Architecture constraints (e.g., "Constraint: Keep this free of business logic")

**Omit comments for:**

- Self-evident code (e.g., `return x + y` // add x and y)
- Variable declarations that describe themselves
- Obvious function names

**Use JSDoc for:**

- Public module exports
- Complex function signatures
- Utility functions in `shared/`

### Best Practices

1. **Type Safety**
    - Avoid `any` - use `unknown` with type guards
    - Leverage TypeScript inference where possible
    - Export types used across modules

2. **Vue Composition API**
    - Prefer `<script setup>` over Options API
    - Extract complex logic into composables
    - Use composables for reusable reactive logic

3. **Performance**
    - Route-based code splitting (lazy loading)
    - Async components where appropriate
    - Computed over methods for derived state

4. **Readability**
    - Small, focused functions (< 50 lines)
    - Descriptive names (no abbreviations unless standard)
    - Early returns to reduce nesting

## Git Commit Conventions

Follow [Conventional Commits](https://www.conventionalcommits.org/) specification:

### Commit Message Format

```
<type>(<scope>): <subject>

<body>

<footer>
```

### Type Categories

- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting, semicolons, etc.)
- `refactor`: Code refactoring (neither feature nor fix)
- `perf`: Performance improvements
- `test`: Adding or updating tests
- `chore`: Build process or auxiliary tool changes
- `build`: Build system or dependencies

### Examples

```
feat(router): add lazy loading for blog posts

fix(auth): resolve token expiration issue

refactor(modules): extract shared logic to composables

style: apply prettier formatting
```

### Rules

- Use lowercase for type and scope
- Keep subject under 50 characters
- Use imperative mood ("add" not "added" or "adds")
- Do not end subject with period
- Wrap body at 72 characters
- Reference issues in footer: `Closes #123`
- **Do NOT include AI-related information in commit messages** (e.g., "Generated with Claude Code", "Co-Authored-By", etc.)
- Keep commit logs clean and professional, focusing only on technical changes

**IMPORTANT:** Never create commits unless explicitly requested by the user.
