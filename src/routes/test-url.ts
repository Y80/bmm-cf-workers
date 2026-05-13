import { Hono } from 'hono'
import ky, { TimeoutError } from 'ky'
import { z } from 'zod'
import { to } from '../utils/to'
import { http, webHeaders } from '../utils/http'

/** 查询参数 */
const querySchema = z.object({
  /** 目标 URL */
  url: z.url(),
})

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

type TestUrlResponse = SuccessResponse | ErrorResponse

const testUrl = new Hono()

/**
 * 检测目标 URL 是否可访问
 * 向目标发起 HEAD 请求（模拟 Chrome 浏览器），10s 超时
 * 返回可达状态及 HTTP 状态码
 */
testUrl.get('/test-url', async (c) => {
  const result = querySchema.safeParse(c.req.query())
  if (!result.success) {
    return c.json<ErrorResponse>({ reachable: false, error: result.error.issues[0].message })
  }

  const [err, res] = await to(
    http.head(result.data.url, { headers: webHeaders, redirect: 'follow', timeout: 10_000, throwHttpErrors: false }),
  )

  if (err) {
    const msg = err instanceof TimeoutError ? 'Timeout' : String(err)
    return c.json<ErrorResponse>({ reachable: false, error: msg })
  }

  return c.json<SuccessResponse>({ reachable: true, status: res.status, statusText: res.statusText })
})

export default testUrl
