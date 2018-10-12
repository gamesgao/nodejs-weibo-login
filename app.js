process.env.NODE_TLS_REJECT_UNAUTHORIZED = 0
const path = require('path')
const express = require('express')
const helmet = require('helmet')
const compression = require('compression')
const bodyParser = require('body-parser')
const methodOverride = require('method-override')

const app = express()
const router = express.Router()
const port = 3000

app.use(helmet())
app.disable('x-powered-by')
app.set('trust proxy', 1)
app.use(compression())
app.set('view engine', 'html')
app.use(bodyParser.urlencoded({
  extended: true
}))
app.use(bodyParser.json())
app.use(methodOverride())

app.get('/', (req, res) => res.send('Hello World!'))

app.use('/', express.static(path.join(__dirname, 'public')))

app.set('views', './views')

app.use('/private', require('./router'))

app.listen(port, () => console.log(`Example app listening on port ${port}!`))

app.use((req, res) => {
  res.status(404).send("Sorry can't find that!")
})
app.use((err, req, res) => {
  console.error(err.stack)
  res.status(500).send('Something broke!')
})
