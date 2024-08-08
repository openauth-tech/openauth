import unocss from '@unocss/eslint-config/flat'
import { defineConfig } from 'eslint-config-hyoban'

export default defineConfig({
  react: 'vite',
  restrictedSyntax: ['jsx', 'tsx'],
  strict: true,
}, {
  ...unocss,
}, {
  rules: {
    'no-console': 'warn',
    'react-hooks/rules-of-hooks': 'error',
    'react-hooks/exhaustive-deps': 'error',
    'react-refresh/only-export-components': 'off',
  },
})
