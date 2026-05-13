import { Hono } from 'hono'
import { TimeoutError } from 'ky'
import { z } from 'zod'
import { http, webHeaders } from '../utils/http'
import { to } from '../utils/to'

/** 查询参数：url 和 host 二选一，优先 url */
const querySchema = z.object({
  /** 完整 URL */
  url: z.url().optional(),
  /** 域名，自动拼接 https:// */
  host: z.string().min(1).optional(),
}).refine((q) => q.url || q.host, { message: 'Missing url or host parameter' })

/** 成功响应 */
interface SuccessResponse {
  reachable: true
  status: number
  statusText: string
}

/** 失败响应 */
interface ErrorResponse {
  reachable: false
  error: string
}

const testUrl = new Hono()

/**
 * 检测目标 URL 是否可访问
 * 向目标发起 HEAD 请求（模拟 Chrome 浏览器），10s 超时
 * 支持 url（完整地址）或 host（域名，拼接 https://）参数，优先 url
 * 返回可达状态及 HTTP 状态码
 */
testUrl.get('/test-url', async (c) => {
  const result = querySchema.safeParse(c.req.query())
  if (!result.success) {
    return c.json<ErrorResponse>({ reachable: false, error: result.error.issues[0].message })
  }

  const target = result.data.url ?? `https://${result.data.host}`

  const [err, res] = await to(
    http.head(target, { headers: webHeaders, redirect: 'follow', timeout: 10_000, throwHttpErrors: false }),
  )

  if (err) {
    const msg = err instanceof TimeoutError ? 'Timeout' : String(err)
    return c.json<ErrorResponse>({ reachable: false, error: msg })
  }

  return c.json<SuccessResponse>({ reachable: true, status: res.status, statusText: res.statusText })
})

export default testUrl
