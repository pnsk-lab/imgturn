import { chromium, devices } from 'playwright'
import { Hono } from 'hono'
import { serveStatic } from 'hono/bun'
import { HTTPException } from 'hono/http-exception'

const app = new Hono()

const device = devices['Desktop Edge']

const browser = await chromium.launch()
const context = await browser.newContext({
  ...device,
  locale: 'ja-JP'
})
const page = await context.newPage()

const cookies = Bun.file('./.storage/cookies.json')
if (await cookies.exists()) {
  await context.addCookies(await Bun.file('./.storage/cookies.json').json())
}

await page.goto('https://google.com')

page.on('load', async () => {
  await Bun.write('./.storage/cookies.json', JSON.stringify(await context.cookies(), null, 2))
})
app.use('*', serveStatic({
  root: 'public'
}))

if (process.env.DEV) {
  app.get('/main.js', async c => {
    const built = await Bun.build({
      entrypoints: ['client/main.tsx']
    })
    if (!built.success) {
      console.error(built.logs)
      throw 'build error'
    }
    const res = await built.outputs[0].text()
    c.header('Content-Type', 'text/javascript')
    return c.body(res)
  })
}

app.get('/shot', async c => {
  const ss = await page.screenshot({ fullPage: false })

  c.header('Content-Type', 'image/png')

  return c.body(ss.buffer as ArrayBuffer)
})
app.get('/click/:x/:y', async c => {
  const x = parseInt(c.req.param('x'))
  const y = parseInt(c.req.param('y'))

  console.log('Click received')
  await page.mouse.click(x, y)
  console.log('Clicked')

  return c.json({ success: true })
})
app.post('/type', async c => {
  const text = await c.req.text()
  console.log('Will type:', text)
  await page.keyboard.type(text)
  return c.json({ success: true })
})
app.get('/sendkey/:key', async c => {
  const key = c.req.param('key')
  await page.keyboard.press(key)
  return c.json({ success: true })
})
app.get('/goto', async c => {
  const url = c.req.query('url')
  if (!url) {
    throw new HTTPException(400)
  }
  console.log('Will Goto', url)
  await page.goto(url)
  console.log('Went to', url)
  return c.json({ success: true })
})
app.get('/url', async c => {
  return c.text(page.url())
})
app.get('/scroll/:v', async  c => {
  await page.mouse.wheel(0, parseInt(c.req.param('v')))
  console.log('wheeled', c.req.param('v'))
  return c.json({ success: true })
})
Bun.serve({
  port: 3030,
  fetch: app.fetch
})
console.log('http://localhost:3030')


