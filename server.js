const fs = require('fs')
const express = require('express')
const { version } = require('./package.json')

const { createServer: createViteServer } = require('vite')
const app = express()

async function createServer () {
  app.get('/health', (req, res) => {
    res.status(200).set({ 'Content-Type': 'text/html' }).end('ok')
  })

  app.get('/version', (req, res) => {
    res.status(200).set({ 'Content-Type': 'text/html' }).end(version)
  })

  const vite = await createViteServer({
    server: { middlewareMode: 'ssr' }
  })
  // use vite's connect instance as middleware
  app.use(vite.middlewares)

  app.use('*', async (req, res, next) => {
    const url = req.originalUrl

    try {
      let template = fs.readFileSync(
        'D:/Projects/taller-platzi-live/index.html',
        'utf-8'
      )

      template = await vite.transformIndexHtml(url, template)

      const { render } = await vite.ssrLoadModule('/src/entry-server.jsx')

      const appHtml = await render(url)

      const html = template.replace('<!--ssr-outlet-->', appHtml)

      res.status(200).set({ 'Content-Type': 'text/html' }).end(html)
    } catch (e) {
      vite.ssrFixStacktrace(e)
      next(e)
    }
  })

  app.listen(3000)
}

createServer()
