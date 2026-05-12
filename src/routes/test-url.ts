import { Hono } from 'hono'

const testUrl = new Hono()

testUrl.get('/test-url', async (c) => {
  const url = c.req.query('url')
  if (!url) {
    return c.json({ ok: false, httpCode: 0, msg: 'Missing url parameter' })
  }

  try {
    const res = await fetch(url, { method: 'HEAD', redirect: 'follow' })
    return c.json({ ok: res.ok, httpCode: res.status, msg: res.statusText })
  } catch (err) {
    return c.json({ ok: false, httpCode: 0, msg: String(err) })
  }
})

export default testUrl
