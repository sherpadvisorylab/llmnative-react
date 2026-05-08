const env = import.meta.env;

export const appConfig = {
  provider: env.VITE_PROVIDER ?? 'mock',
  iconProvider: env.VITE_ICON_PROVIDER ?? 'lucide',
  themeProvider: env.VITE_THEME_PROVIDER ?? 'default',
};
    