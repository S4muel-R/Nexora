import { defineConfig, devices } from '@playwright/test'

/**
 * Pruebas de sistema de la interfaz (nivel superior de la pirámide de pruebas).
 * En CI levanta la API con datos ficticios y la interfaz; en local se pueden reutilizar servidores
 * ya iniciados con E2E_NO_SERVER=1 y E2E_BASE_URL.
 */
const baseURL = process.env.E2E_BASE_URL ?? 'http://localhost:5173'
const python = process.env.E2E_PYTHON ?? 'python'
const settings = '--settings=config.settings_test'

export default defineConfig({
  testDir: './e2e',
  fullyParallel: false,
  workers: 1,
  retries: process.env.CI ? 1 : 0,
  reporter: [
    ['list'],
    ['html', { outputFolder: 'reports/playwright', open: 'never' }],
    ['junit', { outputFile: 'reports/e2e-junit.xml' }],
  ],
  use: {
    baseURL,
    locale: 'es-CR',
    screenshot: 'only-on-failure',
    trace: 'retain-on-failure',
  },
  projects: [
    { name: 'computadora', use: { ...devices['Desktop Chrome'], viewport: { width: 1280, height: 800 } } },
    { name: 'telefono', use: { ...devices['Pixel 7'] } },
  ],
  webServer: process.env.E2E_NO_SERVER
    ? undefined
    : [
        {
          command: [
            `${python} manage.py migrate ${settings}`,
            `${python} manage.py seed_demo --reset ${settings}`,
            `${python} manage.py runserver 8000 ${settings} --noreload`,
          ].join(' && '),
          cwd: '../backend',
          url: 'http://localhost:8000/api/v1/health/',
          reuseExistingServer: false,
          timeout: 120_000,
        },
        {
          command: 'npm run dev -- --port 5173 --strictPort',
          url: baseURL,
          reuseExistingServer: false,
          timeout: 120_000,
        },
      ],
})
