import { Hono } from 'hono'
import { z } from 'zod'
import { to } from '../utils/to'
import { http } from '../utils/http'

/** 查询参数 */
const querySchema = z.object({
  /** 目标 URL */
  url: z.url(),
})

const proxy = new Hono()

/**
 * 代理请求目标 URL
 * 从海外节点获取内容，保留原始响应状态码和 Content-Type
 */
proxy.get('/proxy', async (c) => {
  const result = querySchema.safeParse(c.req.query())
  if (!result.success) {
    return c.text(result.error.issues[0].message, 400)
  }

  const [err, res] = await to(http.get(result.data.url, { throwHttpErrors: false }))
  if (err) {
    return c.text(`Proxy failed: ${err}`, 502)
  }

  return new Response(res.body, {
    status: res.status,
    headers: res.headers,
  })
})

export default proxy
