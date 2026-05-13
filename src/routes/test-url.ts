import { Hono } from 'hono'
import { z } from 'zod'

const querySchema = z.object({
  url: z.url(),
})

const testUrl = new Hono()

testUrl.get('/test-url', async (c) => {
  const result = querySchema.safeParse(c.req.query())
  if (!result.success) {
    return c.json({ reachable: false, error: result.error.issues[0].message })
  }

  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), 10_000)

  try {
    const res = await fetch(result.data.url, {
      method: 'HEAD',
      redirect: 'follow',
      signal: controller.signal,
    })
    return c.json({ reachable: true, status: res.status, statusText: res.statusText })
  } catch (err) {
    const msg = err instanceof DOMException && err.name === 'AbortError'
      ? 'Timeout'
      : String(err)
    return c.json({ reachable: false, error: msg })
  } finally {
    clearTimeout(timer)
  }
})

export default testUrl
