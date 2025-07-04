'use client';

import { ThemeProvider as MUIThemeProvider, createTheme } from '@mui/material/styles';
import { CssBaseline } from '@mui/material';
import { CacheProvider } from '@emotion/react';
import createEmotionCache from '../lib/emotion-cache';
import { useState } from 'react';

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
  },
});

// Client-side cache, created on client side only
const clientSideEmotionCache = createEmotionCache();

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [emotionCache] = useState(clientSideEmotionCache);

  return (
    <CacheProvider value={emotionCache}>
      <MUIThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </MUIThemeProvider>
    </CacheProvider>
  );
}