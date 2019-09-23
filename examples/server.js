const express = require('express')
const bodyParser = require('body-parser')
const webpack = require('webpack')
const webpackDevMiddleware = require('webpack-dev-middleware')
const webpackHotMiddleware = require('webpack-hot-middleware')
const webpackConfig = require('./webpack.config')

const child_process = require("child_process")

const app = express();
const compiler = webpack(webpackConfig);

app.use(webpackDevMiddleware(compiler, {
  publicPath: '/__build__/',
}))

app.use(webpackHotMiddleware(compiler))

app.use(express.static(__dirname))

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: true}))

const router = express.Router()

app.use(router)

const port = process.env.port || 8080
app.listen(port, () => {

  let cmd = ''
  if(process.platform === 'wind32'){
    cmd = 'start "%ProgramFiles%\Internet Explorer\iexplore.exe"'
  }else if(process.platform === 'linux'){
    cmd = 'xdg-open'
  }else if(process.platform === 'darwin'){
    cmd = 'open'
  }

  child_process.exec(`${cmd} "http://localhost:${port}"`);
  console.log(`Server listening on http://localhost:${port}, Ctrl+C to stop`)
})


router.get('/simple/get', function(req, res) {
  res.json({
    msg: `hello world`
  })
})

router.get('/base/get', function(req, res) {
  res.json(req.query)
})
