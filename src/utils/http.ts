import ky from 'ky'

/** 模拟 Chrome 浏览器的基础请求头 */
const browserHeaders = {
  'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/136.0.0.0 Safari/537.36',
  'Accept-Language': 'zh-CN,zh;q=0.9,en;q=0.8',
}

/** 请求网页时使用的额外 Headers */
export const webHeaders = {
  ...browserHeaders,
  'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
  'Accept-Encoding': 'gzip, deflate, br',
  'Cache-Control': 'no-cache',
}

export const http = ky.create({ headers: browserHeaders, timeout: 30_000 })
