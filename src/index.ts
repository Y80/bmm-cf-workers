import { Hono } from 'hono'
import fetchHtml from './routes/fetch-html'
import home from './routes/index'
import proxy from './routes/proxy'
import testUrl from './routes/test-url'

const app = new Hono()

app.route('/', home)
app.route('/', testUrl)
app.route('/', fetchHtml)
app.route('/', proxy)

export default app
