export const paths = {
  home: '/',
  auth: { signIn: '/auth/sign-in', resetPassword: '/auth/reset-password' },
  dashboard: {
    overview: '/dashboard',
    account: '/dashboard/account',
    customers: '/dashboard/customers',
    integrations: '/dashboard/integrations',
    signUp: '/auth/sign-up',
    settings: '/dashboard/settings',
  },
  errors: { notFound: '/errors/not-found' },
  api: 'http://54.162.156.5:3001/app/',
} as const;
