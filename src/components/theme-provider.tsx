"use client"

import * as React from "react"
import { ThemeProvider as NextThemesProvider, useTheme } from "next-themes"
import { type ThemeProviderProps } from "next-themes/dist/types"

function ThemeEffect() {
  const { theme } = useTheme();

  React.useEffect(() => {
    const body = document.body;
    body.classList.remove('simple-dark');

    if (theme === 'dark') {
      // Use um nome de classe específico para o tema escuro simples
      body.classList.add('simple-dark');
    }
  }, [theme]);

  return null;
}

export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  return (
    <NextThemesProvider {...props}>
      <ThemeEffect />
      {children}
    </NextThemesProvider>
  )
}
