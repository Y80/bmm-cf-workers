import { Hono } from 'hono'

const md = new Hono()

md.get('/md', (c) => {
  const content = `# BMM API

## Endpoints

### GET /

返回 API 首页（HTML）

### GET /test-url

检测 URL 是否可访问

\`\`\`
GET /test-url?url=https://example.com
\`\`\`

**Response:**

\`\`\`json
{
  "ok": true,
  "httpCode": 200,
  "msg": "OK"
}
\`\`\`

### GET /fetch-html

获取 URL 对应的 HTML 页面，以纯文本返回

\`\`\`
GET /fetch-html?url=https://example.com
\`\`\`

### GET /md

返回本页面（Markdown）
`

  return c.text(content, 200, { 'Content-Type': 'text/plain; charset=utf-8' })
})

export default md
