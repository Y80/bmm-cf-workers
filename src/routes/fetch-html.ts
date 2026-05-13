import { Hono } from 'hono'
import { z } from 'zod'

const querySchema = z.object({
  url: z.url(),
})

const fetchHtml = new Hono()

fetchHtml.get('/fetch-html', async (c) => {
  const result = querySchema.safeParse(c.req.query())
  if (!result.success) {
    return c.text(result.error.issues[0].message, 400)
  }

  try {
    const res = await fetch(result.data.url)
    const html = await res.text()
    return c.text(html)
  } catch (err) {
    return c.text(`Fetch failed: ${err}`, 502)
  }
})

export default fetchHtml
