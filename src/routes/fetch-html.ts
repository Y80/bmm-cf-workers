import { Hono } from 'hono'
import { z } from 'zod'
import { to } from '../utils/to'
import { http } from '../utils/http'

/** 查询参数 */
const querySchema = z.object({
  /** 目标 URL */
  url: z.url(),
})

const fetchHtml = new Hono()

/**
 * 获取目标 URL 的 HTML 内容
 * 向目标发起 GET 请求（模拟 Chrome 浏览器），返回响应体原文（text/plain）
 */
fetchHtml.get('/fetch-html', async (c) => {
  const result = querySchema.safeParse(c.req.query())
  if (!result.success) {
    return c.text(result.error.issues[0].message, 400)
  }

  const [err, html] = await to(http.get(result.data.url).text())
  if (err) {
    return c.text(`Fetch failed: ${err}`, 502)
  }

  return c.text(html)
})

export default fetchHtml
