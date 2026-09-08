/**
 * Keeps API tests focused on source files and excludes compiled build artifacts.
 */

import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    exclude: ['dist/**', 'node_modules/**'],
  },
});
