import { Hono } from 'hono'
import { z } from 'zod'

const querySchema = z.object({
  url: z.url(),
})

const testUrl = new Hono()

testUrl.get('/test-url', async (c) => {
  const result = querySchema.safeParse(c.req.query())
  if (!result.success) {
    return c.json({ ok: false, httpCode: 0, msg: result.error.issues[0].message })
  }

  try {
    const res = await fetch(result.data.url, { method: 'HEAD', redirect: 'follow' })
    return c.json({ ok: res.ok, httpCode: res.status, msg: res.statusText })
  } catch (err) {
    return c.json({ ok: false, httpCode: 0, msg: String(err) })
  }
})

export default testUrl
