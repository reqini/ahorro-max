import nextConfig from 'eslint-config-next'

const config = [
  { ignores: ['pwa/**', '.claude/**', '**/.next/**', '**/dist/**'] },
  ...nextConfig,
  {
    rules: {
      // Reading browser-only APIs (localStorage, navigator.onLine) on mount must
      // happen in an effect — these aren't available during SSR, so they can't
      // move into a lazy useState initializer. Downgraded from error to warn.
      'react-hooks/set-state-in-effect': 'warn',
    },
  },
]

export default config
