import { Hono } from 'hono'
import { TimeoutError } from 'ky'
import { z } from 'zod'
import { http } from '../utils/http'
import { to } from '../utils/to'

/** 查询参数：url 和 host 二选一，优先 url */
const querySchema = z
  .object({
    /** 完整 URL */
    url: z.url().optional(),
    /** 域名，自动拼接 https:// */
    host: z.string().min(1).optional(),
  })
  .refine((q) => q.url || q.host, { message: 'Missing url or host parameter' })

/** 2xx 响应 */
interface OkResponse {
  ok: true
  status: number
  statusText: string
}

/** 非2xx响应（服务器有响应，但状态码异常） */
interface HttpErrorResponse {
  ok: false
  status: number
  statusText: string
}

/** 网络错误（超时、DNS 失败等，无 HTTP 响应） */
interface NetworkErrorResponse {
  ok: false
  error: string
}

type TestUrlResponse = OkResponse | HttpErrorResponse | NetworkErrorResponse

const testUrl = new Hono()

/**
 * 检测目标 URL 是否可访问
 * 向目标发起 HEAD 请求（模拟 Chrome 浏览器），10s 超时
 * 支持 url（完整地址）或 host（域名，拼接 https://）参数，优先 url
 *
 * 响应结构：
 * - ok + status → 请求成功且 2xx
 * - ok:false + status → 请求成功但非 2xx
 * - ok:false + error → 网络错误（超时/DNS 等）
 */
testUrl.get('/test-url', async (c) => {
  const result = querySchema.safeParse(c.req.query())
  if (!result.success) {
    return c.json<NetworkErrorResponse>({ ok: false, error: result.error.issues[0].message })
  }

  const target = result.data.url ?? `https://${result.data.host}`

  const [err, res] = await to(http.head(target, { redirect: 'follow', timeout: 10_000, throwHttpErrors: false }))

  if (err) {
    const msg = err instanceof TimeoutError ? 'Timeout' : String(err)
    return c.json<NetworkErrorResponse>({ ok: false, error: msg })
  }

  if (!res.ok) {
    return c.json<HttpErrorResponse>({ ok: false, status: res.status, statusText: res.statusText })
  }

  return c.json<OkResponse>({ ok: true, status: res.status, statusText: res.statusText })
})

export default testUrl
