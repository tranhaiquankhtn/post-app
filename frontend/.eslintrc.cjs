module.exports = {
  root: true,
  env: {
    browser: true,
    es2022: true,
    node: true,
  },
  extends: [
    'eslint:recommended',
    'plugin:vue/vue3-recommended',
    '@vue/eslint-config-typescript',
    '@vue/eslint-config-prettier',
  ],
  plugins: ['vue', '@typescript-eslint'],
  rules: {
    'no-unused-vars': 'warn',
    'vue/multi-word-component-names': 1,
  },
  settings: {
    'import/parsers': {
      '@typescript-eslint/parser': ['*.ts', '*.tsx'],
      'vue-eslint-parser': ['*.vue'],
    },
    'import/resolver': {
      typescript: true,
      node: true,
      alias: {
        map: [['@', './src']],
        extensions: ['.js', '.ts', '.jsx', '.tsx', '.vue'],
      },
    },
    vite: {
      configPath: './vite.config.ts',
    },
  },
  overrides: [
    {
      files: ['cypress/e2e/**/*.{cy,spec}.{js,ts,jsx,tsx}'],
      extends: ['plugin:cypress/recommended'],
    },
  ],
  parser: 'vue-eslint-parser',
  parserOptions: {
    parser: '@typescript-eslint/parser',
    ecmaVersion: 'latest',
    sourceType: 'module',
    createDefaultProgram: true,
    project: ['./tsconfig.json'],
  },
}
