const express = require('express')
const logger = require('morgan')
const compression = require('compression')
const helmet = require('helmet');
const carbone = require('carbone')
const path = require('path')
const fs   = require('fs')
const process = require('process')
const app = express()
const port = 3000

app.use(logger('dev'))
app.use(express.json())
app.use(compression())
app.use(helmet())

const tasklist = []
const pwd = process.cwd()
const temp_path = 'upload'
const out_path = 'download'

app.get('/', (req, res) => {
  res.send('All for pdf')
})

app.post('/pdf', (req, res) => {
  const options = {
    convertTo : 'pdf' //can be docx, txt, ...
  }
  const body = req.body
  const infile = body.infile //输入的模版文件
  const outfile = body.outfile //输出的文件
  const data = body.data //需要的资源
  if (!infile || !outfile || !data) {
    res.json({code: 110, message: 'param missing'})
    return
  }
  console.log(body)
  const inputpath = path.join(pwd, temp_path, infile)
  carbone.render(inputpath, data, options, async(err, result) => {
    if (err) {
      res.json({code: 100, message: err})
      return
    }
    // write the result
    const filename = path.join(pwd, out_path, outfile)
    const dir = path.dirname(filename)
    await fs.promises.mkdir(dir, { recursive: true })
    await fs.promises.writeFile(filename, result)
    res.json({code: 0})
  })
})
app.listen(port, () => {
  console.log(process.env.NODE_ENV)
  console.log(`web pdf http://localhost:${port}`)
})
