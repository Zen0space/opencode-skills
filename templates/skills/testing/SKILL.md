---
name: testing
description: Testing patterns, frameworks, and best practices for unit, integration, and E2E tests
---

# Testing Patterns

## Framework Detection

| Indicator | Framework |
|-----------|-----------|
| `vitest` in package.json | Vitest |
| `jest` in package.json | Jest |
| `@testing-library/react` | React Testing Library |
| `@testing-library/vue` | Vue Testing Library |
| `@playwright/test` | Playwright |
| `cypress` | Cypress |

---

## 1. Unit Testing (Vitest/Jest)

### AAA Pattern

```typescript
describe('calculateTotal', () => {
  it('should calculate total with tax', () => {
    // Arrange
    const items = [{ price: 100 }, { price: 50 }];
    const taxRate = 0. Act
    const1;

    // result = calculateTotal(items, taxRate);

    // Assert
    expect(result).toBe(165);
  });
});
```

### Test File Naming

| Type | Pattern | Example |
|------|---------|---------|
| Unit | `*.test.ts` or `*.spec.ts` | `utils.test.ts` |
| Component | `*.test.tsx` or `*.spec.tsx` | `Button.test.tsx` |
| Integration | `*.integration.test.ts` | `api.integration.test.ts` |
| E2E | `*.e2e.test.ts` | `login.e2e.test.ts` |

### Common Matchers

```typescript
// Equality
expect(value).toBe(42);
expect(value).toEqual({ name: 'test' });

// Truthiness
expect(value).toBeTruthy();
expect(value).toBeFalsy();
expect(value).toBeNull();
expect(value).toBeUndefined();

// Numbers
expect(value).toBeGreaterThan(10);
expect(value).toBeLessThanOrEqual(100);
expect(value).toBeCloseTo(3.14, 2);

// Strings
expect(text).toMatch(/regex/);
expect(text).toContain('substring');

// Arrays
expect(array).toContain(item);
expect(array).toHaveLength(3);

// Objects
expect(obj).toHaveProperty('key');
expect(obj).toMatchObject({ key: 'value' });

// Exceptions
expect(() => throwError()).toThrow();
```

---

## 2. tRPC/API Testing

### Testing Routers with Context

```typescript
import { appRouter } from '../src/routers/_app';
import { createTRPCContext } from '../src/server/trpc';

describe('userRouter', () => {
  const createMockContext = (overrides = {}) => {
    return createTRPCContext({
      req: {} as Request,
      res: {} as Response,
      ...overrides,
    });
  };

  it('should get user profile', async () => {
    const ctx = createMockContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.user.getProfile({ userId: '123' });

    expect(result).toHaveProperty('id');
  });

  it('should throw on invalid input', async () => {
    const ctx = createMockContext();
    const caller = appRouter.createCaller(ctx);

    await expect(
      caller.user.getProfile({ userId: '' })
    ).rejects.toThrow();
  });
});
```

### Testing Input Validation

```typescript
it('should reject invalid email', async () => {
  const ctx = createMockContext();
  const caller = appRouter.createCaller(ctx);

  await expect(
    caller.user.create({
      email: 'not-an-email',
      username: 'test'
    })
  ).rejects.toThrow('Invalid email');
});
```

### Testing Error Handling

```typescript
it('should throw NOT_FOUND for non-existent user', async () => {
  const ctx = createMockContext();
  const caller = appRouter.createCaller(ctx);

  await expect(
    caller.user.getProfile({ userId: 'non-existent' })
  ).rejects.toMatchObject({
    code: 'NOT_FOUND',
    message: expect.stringContaining('not found')
  });
});
```

---

## 3. React Component Testing (Testing Library)

### Query Priority

Use queries in this order (most to least preferred):

1. **`getByRole`** - Most accessible
   ```typescript
   expect(screen.getByRole('button', { name: /submit/i })).toBeDisabled();
   expect(screen.getByRole('textbox', { name: /email/i })).toHaveValue('test@test.com');
   ```

2. **`getByLabelText`** - For form fields
   ```typescript
   expect(screen.getByLabelText(/email/i)).toHaveValue('test@test.com');
   ```

3. **`getByPlaceholderText`** - If no label
   ```typescript
   screen.getByPlaceholderText('Enter your email');
   ```

4. **`getByText`** - For non-interactive elements
   ```typescript
   expect(screen.getByText(/welcome back/i)).toBeInTheDocument();
   ```

5. **`getByTestId`** - Last resort
   ```typescript
   <div data-testid="custom-element" />
   ```

### User Events (Preferred over fireEvent)

```typescript
import userEvent from '@testing-library/user-event';

it('should submit form', async () => {
  const user = userEvent.setup();
  
  await user.type(screen.getByLabelText(/email/i), 'test@test.com');
  await user.click(screen.getByRole('button', { name: /submit/i }));
  
  expect(screen.getByText(/submitted/i)).toBeInTheDocument();
});
```

### Testing Forms

```typescript
it('should show validation errors', async () => {
  const user = userEvent.setup();
  
  const submitButton = screen.getByRole('button', { name: /submit/i });
  await user.click(submitButton);
  
  expect(screen.getByText(/email is required/i)).toBeInTheDocument();
  expect(submitButton).toBeDisabled();
});

it('should submit with valid data', async () => {
  const user = userEvent.setup();
  const onSubmit = vi.fn();
  
  await user.type(screen.getByLabelText(/email/i), 'test@test.com');
  await user.click(screen.getByRole('button', { name: /submit/i }));
  
  expect(onSubmit).toHaveBeenCalledWith({
    email: 'test@test.com'
  });
});
```

### Testing Async Components

```typescript
it('should show loading then data', async () => {
  render(<UserProfile userId="123" />);
  
  expect(screen.getByText(/loading/i)).toBeInTheDocument();
  
  await waitFor(() => {
    expect(screen.getByText(/john doe/i)).toBeInTheDocument();
  });
});

it('should handle error state', async () => {
  server.use(...mockErrorResponse);
  
  render(<UserProfile userId="123" />);
  
  await waitFor(() => {
    expect(screen.getByText(/error loading user/i)).toBeInTheDocument();
  });
});
```

---

## 4. Playwright E2E Testing

### Setup

```typescript
import { test, expect } from '@playwright/test';

test.describe('Login Flow', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/login');
  });

  test('should login successfully', async ({ page }) => {
    await page.fill('[name="email"]', 'test@example.com');
    await page.fill('[name="password"]', 'password123');
    await page.click('button[type="submit"]');
    
    await expect(page).toHaveURL('/dashboard');
    await expect(page.locator('[data-testid="welcome"]')).toContainText('Welcome');
  });

  test('should show error on invalid credentials', async ({ page }) => {
    await page.fill('[name="email"]', 'wrong@example.com');
    await page.fill('[name="password"]', 'wrongpass');
    await page.click('button[type="submit"]');
    
    await expect(page.locator('[role="alert"]')).toContainText('Invalid credentials');
  });
});
```

### Playwright MCP Integration

When user needs E2E testing assistance:

1. **Check if Playwright MCP is configured:**
   - Read `opencode.json` and check for `mcp.playwright` configuration

2. **If not configured, prompt user:**
   ```
   Enable Playwright for E2E testing? This will:
   - Add Playwright MCP to opencode.json (for AI-driven testing)
   - Install @playwright/test as dev dependency
   - Install browser binaries
   ```

3. **If user agrees, setup:**
   ```bash
   # Add to opencode.json
   npm install -D @playwright/test
   npx playwright install
   ```

4. **If already available, use directly**

### Best Practices

```typescript
// ✅ GOOD - Use locators
const submitButton = page.getByRole('button', { name: /submit/i });
await submitButton.click();

// ✅ GOOD - Wait for assertions
await expect(page.locator('.data-loaded')).toBeVisible();

// ✅ GOOD - Use test hooks
test.beforeEach(async ({ page }) => {
  await page.goto('/reset-state');
});

// ❌ BAD - Race conditions
await page.click('button');
await expect(page.locator('.success')).toBeVisible();

// ✅ GOOD - Proper waiting
await page.click('button');
await expect(page.locator('.success')).toBeVisible({ timeout: 10000 });
```

---

## 5. Mocking Patterns

### Mocking tRPC Procedures

```typescript
import { vi } from 'vitest';

vi.mock('../trpc', () => ({
  createTRPCContext: vi.fn(() => ({
    prisma: mockPrisma,
    user: null,
  })),
}));
```

### Mocking Prisma

```typescript
const mockPrisma = {
  user: {
    findUnique: vi.fn(),
    create: vi.fn(),
    update: vi.fn(),
    delete: vi.fn(),
  },
  // ... other models
};

beforeEach(() => {
  vi.clearAllMocks();
  mockPrisma.user.findUnique.mockResolvedValue(null);
});
```

### Mocking External APIs

```typescript
import { http, HttpResponse } from 'msw';
import { setupServer } from 'msw/node';

const server = setupServer(
  http.get('/api/users', () => {
    return HttpResponse.json([
      { id: '1', name: 'John' }
    ]);
  })
);

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());
```

---

## 6. Anti-Patterns

### Testing Implementation Details

```typescript
// ❌ BAD - Testing internal state
const instance = new MyClass();
instance['privateMethod']();

// ✅ GOOD - Testing behavior
expect(instance.calculate(2, 3)).toBe(5);
```

### Using fireEvent (Prefer userEvent)

```typescript
// ❌ BAD
fireEvent.change(input, { target: { value: 'test' } });

// ✅ GOOD
await userEvent.type(input, 'test');
```

### Index as Key

```typescript
// ❌ BAD
items.map((item, index) => <div key={index}>...</div>);

// ✅ GOOD
items.map(item => <div key={item.id}>...</div>);
```

### Missing Cleanup

```typescript
// ❌ BAD
it('test', () => {
  const instance = new Class();
});

// ✅ GOOD
let instance;
beforeEach(() => instance = new Class());
afterEach(() => instance = null);
```

### Hardcoded Time/Dates

```typescript
// ❌ BAD
expect(new Date().toISOString()).toBe('2024-01-01T00:00:00.000Z');

// ✅ GOOD - Use fake timers
vi.useFakeTimers();
vi.setSystemTime(new Date('2024-01-01'));
```

---

## 7. Coverage Guidelines

### Prioritize Testing

| Priority | What to Test |
|----------|-------------|
| **High** | Business logic, calculations, transformations |
| **High** | Edge cases, boundary conditions |
| **High** | Error handling, exceptions |
| **Medium** | Component rendering, user interactions |
| **Medium** | API endpoints, integrations |
| **Low** | Simple getters/setters |
| **Low** | Boilerplate, types only |

### What NOT to Test

- TypeScript types (already enforced by compiler)
- Simple utility functions that just pass through
- Third-party library internals
- Implementation details

---

## 8. Fix-First Process

### Phase 1 — Read & Plan (NO XP)

1. Read current level from `.opencode/testing/xp.json`
2. Check `.opencode/testing/knowledge.md` for known patterns and `Lessons Learned`
3. Detect test framework from `package.json`
4. Identify code that needs tests or broken tests to fix
5. Present test plan to user — await their confirmation

### Phase 2 — Write/Fix (XP awarded only after tests pass)

6. Check `Lessons Learned` before writing tests
7. Write or fix the tests
8. Run tests to verify they pass
9. Update XP in `.opencode/testing/xp.json`
10. Update `knowledge.md` with new patterns or lessons

### XP Awards

| Action | XP |
|--------|-----|
| Write passing unit test | +10 XP |
| Write passing integration test | +15 XP |
| Write passing E2E test | +20 XP |
| Fix broken/flaky test | +10 XP |
| Add new pattern to skill | +30 XP |

### Rules

- XP only awarded for passing tests — never for planning or identifying
- Always run tests before claiming XP
- Track seen patterns in `xp.json` to avoid duplicate XP
- Always check `Lessons Learned` before writing tests
- Record mistakes in both `xp.json` and `knowledge.md`
- NEVER run `git commit`, `git push`, or any destructive git command
