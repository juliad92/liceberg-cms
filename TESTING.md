# Testing

## Commands

| Command | Description |
|---------|-------------|
| `pnpm test:unit` | Fast unit tests (hooks, auth helpers, route handlers) |
| `pnpm test:int` | Integration tests against MongoDB (access control, CRUD) |
| `pnpm test:coverage` | Full suite with coverage report and thresholds |
| `pnpm test:ci` | Same as CI: unit + int + coverage |
| `pnpm test:e2e` | Playwright smoke tests (starts dev server) |

## Local setup

Integration and E2E tests need MongoDB. Copy `.env.test.example` values into `.env` (or a dedicated test database URL):

```bash
DATABASE_URL=mongodb://127.0.0.1:27017/liceberg-cms-test
PAYLOAD_SECRET=local-test-secret-at-least-32-chars-long
```

## Coverage

After `pnpm test:coverage`:

- Terminal summary
- HTML report: `coverage/index.html`
- LCOV: `coverage/lcov.info`

Thresholds are enforced for `src/hooks/**` and `src/lib/auth/**`.

## CI

GitHub Actions runs on every push/PR to `main`:

- Lint and format check
- Unit + integration tests with coverage
- Playwright E2E against MongoDB
