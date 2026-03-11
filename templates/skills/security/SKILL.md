---
name: security
description: Security patterns, auth approach, and what NOT to do in this codebase
---

# Security Patterns

## 1. Authentication

### Current State
- Frontend: Logto (OAuth/OIDC) handles user sessions
- Backend: `protectedProcedure` exists but NEVER used
- All 15 routers use `publicProcedure` (INSECURE for user data)

### Code: protectedProcedure vs publicProcedure

```typescript
// CURRENT (INSECURE) - used everywhere in this codebase
export const userRouter = router({
  getProfile: publicProcedure
    .input(z.object({ userId: z.string() }))
    .query(({ input }) => {
      // ❌ Anyone can access any user's profile!
      return prisma.user.findUnique({ where: { id: input.userId } });
    }),
});

// SHOULD BE - using protectedProcedure
export const userRouter = router({
  getMyProfile: protectedProcedure
    .query(({ ctx }) => {
      // ✅ Only authenticated users can access
      // ctx.user is guaranteed to be populated
      return prisma.user.findUnique({ where: { id: ctx.user.id } });
    }),
});
```

### Auth Context (trpc.ts)
```typescript
// Current state - ctx.user is ALWAYS null!
export const createContext = async ({ req, res }) => {
  return {
    req,
    res,
    prisma,
    user: null, // Will be populated when token verification is implemented
  };
};

// Protected procedure always throws UNAUTHORIZED
export const protectedProcedure = t.procedure.use(async function isAuthed(opts) {
  const { ctx } = opts;
  if (!ctx.user) {
    throw new TRPCError({ code: 'UNAUTHORIZED' });
  }
  return opts.next({ ctx: { user: ctx.user } });
});
```

### Rules
- ✅ Use `protectedProcedure` for any user-specific data
- ✅ Use `publicProcedure` only for truly public data (game info, item catalogs)
- ❌ NEVER use `publicProcedure` for: user profiles, settings, private data, mutations

---

## 2. Input Validation

### Current Approach
- Zod on ALL inputs (this is good)
- Example patterns from codebase:

```typescript
// String with length limits
z.string().min(3).max(80)
z.string().email()
z.string().uuid()
z.string().optional()

// Numbers with bounds  
z.number().min(1).max(100)
z.number().min(1).max(50).default(20)

// Booleans with defaults
z.boolean().default(false)

// Enums for fixed values
z.enum(['OPEN', 'CLOSED', 'IN_PROGRESS'])
z.enum(['RANKED', 'CASUAL', 'CUSTOM', 'TOURNAMENT'])

// Arrays
z.array(z.string())
z.array(z.string()).min(1)

// Objects with nested validation
z.object({
  user: z.object({
    id: z.string(),
    username: z.string().optional(),
    avatarUrl: z.string().optional(),
    avatarConfig: z.record(z.string(), z.any()).optional(),
    isGuest: z.boolean().default(false),
  })
})

// Nullable and optional
z.string().nullable()
z.string().optional()
z.string().optional().nullable()
```

### Real Examples from Codebase

```typescript
// From lobby.ts - GOOD validation
.input(z.object({
  logtoId: z.string(),
  title: z.string().min(3).max(80),
  gameSlug: z.string().min(1),
  roomCode: z.string().max(50).optional(),
  description: z.string().max(500).optional(),
  maxPlayers: z.number().min(2).max(100).default(5),
  isPrivate: z.boolean().default(false),
  region: z.string().max(10).optional(),
  requiresMic: z.boolean().default(false),
  minRank: z.string().max(30).optional(),
  ttlHours: z.number().min(1).max(24).default(DEFAULT_TTL_HOURS),
}))

// From users.ts - GOOD email validation
.input(z.object({
  logtoId: z.string(),
  email: z.string().email(),
  username: z.string().nullable().optional(),
  displayName: z.string().nullable().optional(),
  avatarUrl: z.string().nullable().optional(),
}))
```

### Rules
- ✅ ALWAYS use `.input(z.object({...}))`
- ✅ Add `.min()` and `.max()` for strings
- ✅ Use `.email()` for email fields
- ✅ Use `.enum()` for limited choices
- ✅ Use `.default()` for optional fields
- ❌ NEVER skip input validation
- ❌ NEVER trust client-side validation only

---

## 3. Error Handling

### Current Patterns - Good

```typescript
// Using TRPCError (GOOD)
throw new TRPCError({ 
  code: 'NOT_FOUND', 
  message: 'User not found' 
});

throw new TRPCError({ 
  code: 'FORBIDDEN', 
  message: 'Only the host can close this room.' 
});

throw new TRPCError({ 
  code: 'BAD_REQUEST', 
  message: 'Room is full.' 
});

throw new TRPCError({ 
  code: 'CONFLICT', 
  message: 'You are already in this room.' 
});

// Using plain Error (AVOID for tRPC)
throw new Error('User not found');
```

### Best Practices
- Use `TRPCError` with appropriate codes:
  - `NOT_FOUND` - Resource doesn't exist
  - `UNAUTHORIZED` - Not logged in
  - `FORBIDDEN` - Logged in but no permission
  - `BAD_REQUEST` - Invalid input
  - `CONFLICT` - State conflict (e.g., already joined)
  - `INTERNAL_SERVER_ERROR` - Unexpected errors
- Never log sensitive data (passwords, tokens, secrets)
- Use generic messages for auth failures: "Invalid credentials" (not "User not found")

### Anti-Patterns
```typescript
// ❌ NEVER log passwords or secrets
console.log('Login attempt:', { username, password });

// ✅ CORRECT - log without sensitive data
console.log('Login attempt:', { username, expectedUsername: ADMIN_USERNAME });

// ❌ NEVER expose internal details in error messages
throw new TRPCError({ 
  code: 'INTERNAL_SERVER_ERROR', 
  message: 'Database connection failed: ' + error.message // ❌ Leaks internals
});

// ✅ CORRECT - generic error message
throw new TRPCError({ 
  code: 'INTERNAL_SERVER_ERROR', 
  message: 'An unexpected error occurred' 
});
```

---

## 4. Database Security

### Prisma Patterns - Good

```typescript
// Use select/include to limit exposure
prisma.user.findUnique({
  where: { id },
  select: { 
    id: true, 
    username: true, 
    email: true,
    displayName: true,
    avatarUrl: true 
    // ✅ Don't expose: walletAddress, internal IDs
  }
});

// Unique constraints prevent enumeration
@unique logtoId      // Prevent duplicate accounts
@unique email        // Prevent duplicate emails
@unique walletAddress

// Cascade delete for relations - prevents orphaned data
user User @relation(..., onDelete: Cascade)

// Indexes for security (prevent slow queries that could be exploited)
@@index([userId])
@@index([status])
```

### Anti-Patterns
```typescript
// ❌ DON'T: expose all fields
return prisma.user.findUnique({ where: { id } });

// ✅ CORRECT: select only needed fields
return prisma.user.findUnique({ 
  where: { id }, 
  select: { id: true, username: true, ... }
});

// ❌ DON'T: trust raw IDs without ownership check
.input(z.object({ userId: z.string() }))
.query(({ input }) => {
  return prisma.user.findUnique({ where: { id: input.userId } });
  // ❌ Anyone can query any user!
});

// ✅ CORRECT: only allow accessing own data
.input(z.object({}))
.query(({ ctx }) => {
  return prisma.user.findUnique({ where: { id: ctx.user.id } });
  // ✅ Only own profile
});
```

---

## 5. API Key & Secrets

### Environment Variables
Required in `.env`:
- `PANDASCORE_ACCESS_TOKEN` - Pandascore API
- `REDIS_URL` - Cache layer
- `DATABASE_URL` - PostgreSQL
- `LOGTO_ENDPOINT`, `LOGTO_APP_ID`, `LOGTO_APP_SECRET` - Auth
- `ADMIN_USERNAME`, `ADMIN_PASSWORD` - Admin panel (insecure!)

### Rules
- ✅ Never commit `.env` files
- ✅ Use `.env.example` for template
- ✅ Validate env vars at startup
- ✅ Use environment variable syntax in configs: `{env:VARIABLE_NAME}`

---

## 6. Security Anti-Patterns (What NOT to Do)

| Anti-Pattern | Example | Why Bad |
|-------------|---------|---------|
| Skip auth | `publicProcedure` for user data | Anyone can access |
| Log secrets | `console.log({ password })` | Secrets in logs |
| Skip validation | No `.input()` | Invalid data enters DB |
| Expose internal IDs | Return raw `id` | Enumeration attacks |
| Trust client | `input.userId` without check | IDOR vulnerability |
| Weak admin auth | Plain username/password | Easy to crack |
| Expose internals | Error messages with stack traces | Information leakage |

---

## 7. Wallet & Signature Security

### Current Implementation (wallet.ts)
```typescript
// ✅ GOOD: Validates signature
.input(z.object({
  logtoId: z.string(),
  walletAddress: z.string(),
  message: z.string(),
  signature: z.string(),
}))
.mutation(({ input }) => {
  // Validate message format
  const parsed = JSON.parse(input.message);
  if (parsed.address !== input.walletAddress) {
    throw new Error('Wallet address in message does not match provided address.');
  }
  
  // Verify signature
  const isValid = verifySignature(input.message, input.signature, input.walletAddress);
  if (!isValid) {
    throw new Error('Invalid signature.');
  }
});
```

### Improvements to Consider
- Add nonce to prevent replay attacks
- Add expiration timestamp to messages
- Use EIP-712 typed data signing

---

## 8. Frontend Security (Next.js)

### Auth Handling
```typescript
// Using Logto server actions (GOOD)
import { signIn, signOut, handleSignIn, getLogtoContext } from '@logto/next/server-actions';

// Check auth in server components
const context = await getLogtoContext(logtoConfig, { fetchUserInfo: true });
if (!context.isAuthenticated) {
  redirect('/');
}
```

### Environment Variables
- `LOGTO_ENDPOINT` - Auth server
- `LOGTO_APP_ID` - Public (safe to expose)
- `LOGTO_APP_SECRET` - SECRET (never expose)
- `LOGTO_COOKIE_SECRET` - SECRET

### Rules
- ✅ Use server-side auth checks
- ✅ Pass auth tokens via headers when calling backend
- ❌ Never expose secrets in client-side code
- ❌ Never store tokens in localStorage (use httpOnly cookies)

### LocalStorage/SessionStorage Safety

Never trust data from browser storage - users can edit it or it can become corrupted.

```typescript
// ❌ BAD - Crashes on malformed JSON
const data = JSON.parse(localStorage.getItem('key'));

// ✅ GOOD - Try-catch with validation
try {
    const raw = localStorage.getItem('key');
    if (raw) {
        const data = JSON.parse(raw);
        if (data && typeof data === 'object') {
            setState(data);
        }
    }
} catch {
    // Invalid JSON - use defaults
}
```

---

## 9. Fix-First Process

### Phase 1 — Read & Audit (NO XP)

1. Read current level from `.opencode/security/xp.json`
2. Check `.opencode/security/knowledge.md` for known issues and `Lessons Learned`
3. Analyze codebase and identify vulnerabilities by severity
4. Present findings to user — await their decision

### Phase 2 — Fix (XP awarded only after fix is complete)

5. Check `Lessons Learned` before applying the fix
6. Apply the requested fix
7. Verify fix doesn't introduce new issues
8. Update XP in `.opencode/security/xp.json`
9. Update `knowledge.md` — mark issues as fixed, record new lessons

### Level-Up Rule (MANDATORY)

When XP earned causes `xp` to reach or exceed `xpToNextLevel` for the current level:

1. Subtract `xpToNextLevel` from the total XP — the remainder is the carry-over
2. Increment `level` by 1
3. Set `title` to the new level's title
4. Set `xp` to the carry-over amount (never accumulate XP across levels)
5. Save updated `level`, `title`, and `xp` to `.opencode/security/xp.json`

**Example:** Level 1 (`xpToNextLevel = 150`), earn 230 XP total
→ carry-over = 230 − 150 = 80
→ Save: `level = 2`, `title = "Apprentice"`, `xp = 80`

**Chain level-ups:** If carry-over also meets or exceeds the next level's threshold, repeat until it doesn't.

### XP Awards

| Action | XP |
|--------|-----|
| Fix critical vulnerability | +60 XP |
| Fix high vulnerability | +35 XP |
| Fix medium vulnerability | +15 XP |
| Fix low vulnerability | +10 XP |
| Add new pattern to skill | +30 XP |

### Rules

- XP only awarded for completed fixes — never for finding or auditing
- Never auto-fix without explicit user request
- Always check `Lessons Learned` before applying any fix
- Record mistakes in both `xp.json` and `knowledge.md`
- NEVER run `git commit`, `git push`, or any destructive git command

---

## Summary

### DO:
- Use `protectedProcedure` for user-specific operations
- Always validate inputs with Zod
- Use TRPCError with appropriate codes
- Limit exposed fields with `.select()`
- Log without sensitive data

### DON'T:
- Use `publicProcedure` for private data
- Skip input validation
- Log passwords, tokens, or secrets
- Expose internal IDs or error details
- Trust client-provided data without validation
