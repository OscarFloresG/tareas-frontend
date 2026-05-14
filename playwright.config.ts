import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  /* Ejecución en paralelo para terminar más rápido */
  fullyParallel: true,
  /* Si olvidas un test.only, fallará en CI (buena práctica) */
  forbidOnly: !!process.env.CI,
  /* Reintentos en caso de fallo (0 en local para no perder tiempo) */
  retries: process.env.CI ? 2 : 0,
  /* Reportero visual en HTML */
  reporter: 'html',

  use: {
    /* IMPORTANTE: Apuntamos al puerto del FRONTEND */
    baseURL: 'https://localhost:3001',

    /* Configuración para certificados SSL locales */
    ignoreHTTPSErrors: true, 

    /* Requisitos de la rúbrica: evidencias en fallo */
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    
    /* Traza para depurar fallos */
    trace: 'on-first-retry',
  },

  /* Probamos en los 3 motores principales para asegurar compatibilidad */
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },
  ],
});