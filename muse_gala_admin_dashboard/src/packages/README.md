# Packages

Packages in this folder are **deep modules**. A package's public surface is its root files (its entry points); everything in its subfolders (like `lib/` or `tests/`) is private implementation detail and cannot be imported from outside the package.

**Discourage barrel files**: Expose several small entry points (e.g. `index.ts`, `client.ts`) instead of re-exporting a whole subtree through one index.

To check boundaries:

```bash
npm run lint:boundaries
```
