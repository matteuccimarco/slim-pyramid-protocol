# Contributing to SLIM-PYRAMID

Thank you for your interest in contributing to the SLIM-PYRAMID protocol!

## Ways to Contribute

### 1. Report Issues

- Bug reports
- Feature requests
- Documentation improvements
- Questions about the specification

### 2. Propose Changes

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Make your changes
4. Run tests (`npm test`)
5. Commit your changes (`git commit -m 'Add amazing feature'`)
6. Push to the branch (`git push origin feature/amazing-feature`)
7. Open a Pull Request

### 3. Specification Changes

For changes to the protocol specification itself:

1. Open an issue first to discuss the change
2. Provide rationale and use cases
3. Consider backward compatibility
4. Update both SPECIFICATION.md and TypeScript types

## Development Setup

```bash
# Clone the repo
git clone https://github.com/anthropics/slim-pyramid-protocol.git
cd slim-pyramid-protocol

# Install dependencies
npm install

# Run tests
npm test

# Build
npm run build

# Type check
npm run typecheck
```

## Code Style

- TypeScript with strict mode
- ESLint for linting
- Prettier for formatting (coming soon)
- JSDoc comments for public APIs

## Commit Messages

Use conventional commits:

- `feat:` new feature
- `fix:` bug fix
- `docs:` documentation changes
- `test:` adding tests
- `refactor:` code changes that neither fix bugs nor add features
- `chore:` maintenance tasks

## Review Process

1. All changes require a pull request
2. At least one maintainer approval required
3. All tests must pass
4. TypeScript must compile without errors

## License

By contributing, you agree that your contributions will be licensed under the MIT License.

## Questions?

Open an issue or reach out to the maintainers.

---

Thank you for helping make SLIM-PYRAMID better!
