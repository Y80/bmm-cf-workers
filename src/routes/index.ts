import { Hono } from 'hono'
import { html } from 'hono/html'

const home = new Hono()

/** API 首页，以 HTML 形式展示所有接口文档 */
home.get('/', (c) => {
  return c.html(html`
    <!DOCTYPE html>
    <html lang="zh">
    <head>
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <title>BMM API</title>
      <script src="https://cdn.tailwindcss.com"></script>
    </head>
    <body class="bg-gray-50 min-h-screen flex items-center justify-center p-4">
      <div class="max-w-2xl w-full space-y-6">
        <h1 class="text-3xl font-bold text-center text-gray-800">BMM API</h1>

        <div class="bg-white rounded-xl shadow p-6 space-y-4">
          <h2 class="text-xl font-semibold text-gray-700">GET /test-url</h2>
          <p class="text-gray-600">检测 URL 是否可访问（支持 url 或 host 参数）</p>
          <code class="block bg-gray-100 rounded p-3 text-sm text-gray-800">
            GET /test-url?url=https://example.com
          </code>
          <pre class="bg-gray-100 rounded p-3 text-sm text-gray-800">{
  "ok": true,
  "status": 200,
  "statusText": "OK"
}</pre>
        </div>

        <div class="bg-white rounded-xl shadow p-6 space-y-4">
          <h2 class="text-xl font-semibold text-gray-700">GET /fetch-html</h2>
          <p class="text-gray-600">获取 URL 对应的 HTML 页面，以纯文本返回</p>
          <code class="block bg-gray-100 rounded p-3 text-sm text-gray-800">
            GET /fetch-html?url=https://example.com
          </code>
        </div>
      </div>
    </body>
    </html>
  `)
})

export default home
