import nextVitals from 'eslint-config-next/core-web-vitals';
import nextTypescript from 'eslint-config-next/typescript';

const config = [
  ...nextVitals,
  ...nextTypescript,
  {
    rules: {
      'react-hooks/purity': 'off',
      'react-hooks/set-state-in-effect': 'off',
    },
  },
  {
    ignores: [
      '.next/**',
      'node_modules/**',
      'generated/**',
      'out/**',
      'build/**',
      'test-results/**',
      'playwright-report/**',
      'next-env.d.ts',
    ],
  },
];

export default config;
