// Capturas de las páginas públicas de GitHub (PR y ejecuciones de Actions) como evidencia de EJ-11 y EJ-17 – EJ-19.
const path = require('node:path')
const { chromium } = require(path.resolve(process.argv[2], 'node_modules', 'playwright'))

const OUT = process.argv[3]
const REPO = 'https://github.com/S4muel-R/Nexora'
const SHOTS = [
  ['EV_EJ-11_pull-requests_20261105.png', `${REPO}/pulls`],
  ['EV_EJ-11_actions_20261105.png', `${REPO}/actions`],
  ['EV_EJ-11_PR4-falla-INC-001_20261105.png', `${REPO}/actions/runs/42144515765`],
  ['EV_EJ-11_PR9-intermitente_20261105.png', `${REPO}/actions/runs/42144538741`],
  ['EV_EJ-11_PR10-falla-INC-004_20261105.png', `${REPO}/actions/runs/42144543564`],
  ['EV_EJ-17_PR11-intermitente-INC-007_20261105.png', `${REPO}/actions/runs/42147274526`],
  ['EV_EJ-19_PR11-verde_20261105.png', `${REPO}/actions/runs/42148745101`],
  ['EV_EJ-19_PR11-checks_20261105.png', `${REPO}/pull/11/checks`],
]

;(async () => {
  const browser = await chromium.launch()
  const page = await browser.newPage({ viewport: { width: 1366, height: 900 }, locale: 'es-CR' })
  for (const [file, url] of SHOTS) {
    await page.goto(url, { waitUntil: 'load', timeout: 60000 })
    await page.waitForTimeout(3000)
    await page.screenshot({ path: path.join(OUT, file), fullPage: false })
    console.log('ok', file)
  }
  await browser.close()
})()
