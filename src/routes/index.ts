import { Hono } from 'hono'

interface Bindings {
  ASSETS: Fetcher
}

const home = new Hono<{ Bindings: Bindings }>()

/** API 首页，返回独立 HTML 接口文档 */
home.get('/', async (c) => {
  const res = await c.env.ASSETS.fetch(new Request(new URL('/index.html', c.req.url)))
  return res
})

export default home
