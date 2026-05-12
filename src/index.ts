import { Hono } from 'hono'
import home from './routes/index'
import testUrl from './routes/test-url'
import fetchHtml from './routes/fetch-html'
import md from './routes/md'

const app = new Hono()

app.route('/', home)
app.route('/', testUrl)
app.route('/', fetchHtml)
app.route('/', md)

export default app
