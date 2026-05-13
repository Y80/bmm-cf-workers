import { Hono } from 'hono'
import { z } from 'zod'
import { to } from '../utils/to'

const querySchema = z.object({
  url: z.url(),
})

const fetchHtml = new Hono()

fetchHtml.get('/fetch-html', async (c) => {
  const result = querySchema.safeParse(c.req.query())
  if (!result.success) {
    return c.text(result.error.issues[0].message, 400)
  }

  const [fetchErr, res] = await to(fetch(result.data.url))
  if (fetchErr) {
    return c.text(`Fetch failed: ${fetchErr}`, 502)
  }

  const [readErr, html] = await to(res.text())
  if (readErr) {
    return c.text(`Read failed: ${readErr}`, 502)
  }

  return c.text(html)
})

export default fetchHtml
