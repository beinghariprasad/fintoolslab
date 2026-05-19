import { createContext, useContext, useEffect, useState } from 'react';

type Theme = 'light' | 'dark';
type Accent = 'mint' | 'blue' | 'amber';

interface ThemeContextValue {
  theme: Theme;
  accent: Accent;
  setTheme: (theme: Theme) => void;
  setAccent: (accent: Accent) => void;
}

const ThemeContext = createContext<ThemeContextValue>({
  theme: 'light',
  accent: 'amber',
  setTheme: () => {},
  setAccent: () => {},
});

export function useTheme() {
  return useContext(ThemeContext);
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('ft-theme') as Theme | null;
      if (stored === 'dark' || stored === 'light') return stored;
      if (window.matchMedia('(prefers-color-scheme: dark)').matches) return 'dark';
    }
    return 'light';
  });
  const [accent, setAccent] = useState<Accent>('amber');

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('ft-theme', theme);
  }, [theme]);

  useEffect(() => {
    document.documentElement.setAttribute('data-accent', accent);
  }, [accent]);

  return (
    <ThemeContext.Provider value={{ theme, accent, setTheme, setAccent }}>
      {children}
    </ThemeContext.Provider>
  );
}
