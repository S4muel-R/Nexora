// Revisión asistida de accesibilidad: reflujo a 320 px (WCAG 1.4.10), orden de foco con teclado (2.4.3),
// idioma de la página (3.1.1) y anuncio de errores (4.1.3). Uso: node a11y_manual.cjs <frontend> <baseURL>
const path = require('node:path')
const { chromium } = require(path.resolve(process.argv[2], 'node_modules', 'playwright'))
const BASE = process.argv[3]

async function login(page, email) {
  await page.goto(`${BASE}/ingresar`)
  await page.getByLabel('Correo').fill(email)
  await page.getByLabel('Contraseña').fill('Nexora-Demo-2026')
  await page.getByRole('button', { name: 'Ingresar' }).click()
  await page.getByRole('heading', { name: /^Hola,/ }).waitFor()
}

;(async () => {
  const browser = await chromium.launch()
  const page = await browser.newPage({ viewport: { width: 320, height: 640 }, locale: 'es-CR' })
  const reflow = async (name) => {
    const r = await page.evaluate(() => ({
      scroll: document.documentElement.scrollWidth,
      client: document.documentElement.clientWidth,
      lang: document.documentElement.lang,
    }))
    console.log(`reflujo 320px | ${name} | scrollWidth=${r.scroll} clientWidth=${r.client} | ${r.scroll <= r.client ? 'sin desplazamiento horizontal' : 'DESPLAZAMIENTO HORIZONTAL'} | lang=${r.lang}`)
  }
  await page.goto(`${BASE}/ingresar`)
  await reflow('ingresar')
  await login(page, 'plataforma@nexora.test')
  await page.goto(`${BASE}/instituciones`)
  await page.getByRole('heading', { name: 'Instituciones' }).waitFor()
  await reflow('instituciones')
  await page.getByRole('button', { name: 'Cerrar sesión' }).click()
  await login(page, 'admin@robles.test')
  for (const [name, url, heading] of [['mi-institucion', '/mi-institucion', 'Mi institución'], ['estudiantes', '/estudiantes', 'Estudiantes']]) {
    await page.goto(`${BASE}${url}`)
    await page.getByRole('heading', { name: heading }).waitFor()
    await reflow(name)
  }

  // Orden de foco en el formulario de estudiantes, solo con teclado.
  await page.setViewportSize({ width: 1280, height: 800 })
  await page.getByRole('button', { name: 'Registrar estudiante' }).focus()
  await page.keyboard.press('Enter')
  const order = []
  for (let i = 0; i < 8; i++) {
    await page.keyboard.press('Tab')
    order.push(await page.evaluate(() => {
      const el = document.activeElement
      const label = el.labels?.[0]?.textContent || el.getAttribute('aria-label') || el.textContent
      return `${el.tagName.toLowerCase()}:${(label || '').trim()}`
    }))
  }
  console.log('orden de foco tras abrir el formulario | ' + order.join(' → '))
  await page.keyboard.press('Escape')
  await page.getByRole('button', { name: 'Guardar' }).click()
  const alert = await page.getByRole('alert').first().textContent()
  const invalid = await page.locator('[aria-invalid="true"]').count()
  const described = await page.locator('[aria-invalid="true"][aria-describedby]').count()
  console.log(`errores | alerta con role=alert: "${alert}" | campos aria-invalid=${invalid} | con aria-describedby=${described}`)
  await browser.close()
})()
