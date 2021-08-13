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
const temp_path = 'doctemplate'
const out_path = 'output'

app.get('/', (req, res) => {
  res.send('All for pdf')
})

app.post('/pdf', (req, res) => {
  const options = {
    convertTo : 'pdf' //can be docx, txt, ...
  }
  const body = req.body
  const infile = body.in //输入的模版文件
  const outfile = body.out //输出的文件
  const data = body.data //需要的资源
  if (!infile || !outfile || !data) {
    res.json({code: 110, msg: 'param missing'})
    return
  }
  const inputpath = path.join(pwd, temp_path, infile)
  carbone.render(inputpath, data, options, function(err, result) {
    if (err) {
      res.json({code: 100, msg: err})
      return
    }
    // write the result
    const filename = path.join(pwd, out_path, outfile)
    fs.writeFileSync(filename, result)
    res.json({code: 0})
  })
})
app.listen(port, () => {
  console.log(process.env.NODE_ENV)
  console.log(`web pdf http://localhost:${port}`)
})
