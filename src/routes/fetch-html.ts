import { Hono } from 'hono'

const fetchHtml = new Hono()

fetchHtml.get('/fetch-html', async (c) => {
  const url = c.req.query('url')
  if (!url) {
    return c.text('Missing url parameter', 400)
  }

  try {
    const res = await fetch(url)
    const html = await res.text()
    return c.text(html)
  } catch (err) {
    return c.text(`Fetch failed: ${err}`, 502)
  }
})

export default fetchHtml
